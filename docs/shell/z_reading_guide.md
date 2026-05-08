---
sidebar_position: 22
---

# z.sh 阅读指南

> 本指南对 `z.sh`（rupa/z）进行源码级拆解，聚焦算法公式的数字取值、Shell 冷僻语法、以及设计上的取舍。
> 源码参见 [rupa/z@d37a763](https://github.com/rupa/z/blob/d37a763/z.sh)，本文行号均基于该 commit。

---

## 一、整体设计哲学

z 的核心价值观只有一句：**用 frecency（frequency + recency）替代死板的字母匹配来跳目录。**

围绕这一核心衍生出几个工程决策：

| 决策 | 动机 |
|------|------|
| 单个纯文本文件 `~/.z` | 无依赖、可迁移、可 `grep`，用户可自行备份/修复 |
| `precmd` 后台异步写入 | 不阻塞交互式 shell；子 shell `( ... & )` 方式同时静默 job 控制消息 |
| awk 做所有重活 | 避免 shell 循环逐行处理的慢 + 数据一致性差，awk 单次扫描 O(N) |
| aging（衰减）机制 | 防止数据文件无限膨胀，让"历史偏好"有机会被新习惯覆盖 |
| 写 tempfile 再 `mv` | 原子替换，避免崩溃/并发造成半写入文件 |
| 不依赖 bash 特性 | 同时兼容 bash/zsh（`compctl` 与 `complete` 双路径） |

---

## 二、数据结构

数据文件每行一条记录，三列以 `|` 分隔：

```
/Users/mako/Work/github.com/shell/z|12.5|1715000000
└──────────── path ────────────────┘└rank┘└── mtime ──┘
```

- **path**: 绝对路径（可选择是否解析符号链接）
- **rank**: 访问"频次分"，可以是小数（因为 aging 时乘 0.99）
- **time**: 上次访问的 Unix 时间戳

这三元组支撑起三种排序模式：
- `-r`：只看 rank
- `-t`：只看 time
- 默认：frecent(rank, time) 复合评分

---

## 三、核心算法详解

### 3.1 frecent 评分函数（z.sh:147-152）

```awk
function frecent(rank, time) {
  dx = t - time
  return int(10000 * rank * (3.75/((0.0001 * dx + 1) + 0.25)))
}
```

这是全文最值得拆解的一段。`t` 是"当前时刻"，`dx` 是"距离上次访问过了多少秒"。

先看数学骨架：

```
frecent ∝ rank × f(dx)
其中 f(dx) = 3.75 / (0.0001·dx + 1.25)
```

**为什么是 `0.0001·dx + 1`？**

- `+1` 是防止 `dx = 0` 时分母出现 0（虽然还有 `+0.25` 兜底，但这样更直观）。
- `0.0001` 是衰减速率：`1/0.0001 = 10000` 秒 ≈ **2.78 小时**。也就是说每过一个"2.78 小时"的时间单位，分母就涨 1。这个尺度恰好和人的工作节奏合拍——早上进的目录到下午仍然"热乎"，隔夜就明显降温。

**为什么是 `+ 0.25`？**

很多人第一眼以为它是"避免除零"，其实不是（`0.0001·dx + 1` 本来就 ≥ 1）。它的真正作用：

1. **标定初值**：`dx = 0` 时 `f = 3.75 / (1 + 0.25) = 3.75 / 1.25 = 3`，配合前面的 `10000 × rank`，得到"刚刚访问"的基础分恰好是 `30000 × rank`。这让"访问一次且刚刚访问" = 30000，"访问两次且刚刚访问" = 60000，是一个整齐的心智模型。
2. **让衰减更温和**：没有 `0.25` 时 `f(0) = 3.75`，加了以后 `f(0) = 3`，初始分被压低，使得一个老条目多访问几次有机会追上新条目。

**为什么是 `3.75`？**

它只是个分子常数，和 `0.25` 一起把 `f(0)` 校准成整数 3。换成 7.5 / 2.5 也能得到同样的 3，但 3.75 让 `f(∞)→0` 的速率合适（见下表）。

**衰减曲线实测**（rank = 1）：

| 距上次访问 dx | f(dx) | frecent | 相对 f(0) |
|--------------|-------|---------|-----------|
| 0 s (刚刚)   | 3.00  | 30000   | 100%      |
| 1 小时       | 2.33  | 23290   | 78%       |
| 2.78 小时    | 1.67  | 16670   | 56%       |
| 1 天         | 0.38  | 3790    | 13%       |
| 1 周         | 0.06  | 607     | 2%        |
| 30 天        | 0.014 | 143     | 0.5%      |

一句话总结：**公式曲线平滑且单调递减，"半衰期"约在数小时量级，尾巴拖得很长——让半年前访问过一次的目录仍能以低分存活在列表中，但几乎永远竞争不过今天高频访问的目录。**

### 3.2 Aging 机制（z.sh:72, 89-94）

```awk
if( count > score ) {
    for( x in rank ) print x "|" 0.99*rank[x] "|" time[x]
} else for( x in rank ) print x "|" rank[x] "|" time[x]
```

当所有 rank 之和超过 `$_Z_MAX_SCORE`（默认 9000）时，**全体条目的 rank 乘 0.99**。这是最经典的"指数衰减计数器"思路：

- 不需要单独的 GC 任务
- 不需要额外字段记录最后衰减时间
- 近期高频的条目会自然变大（加 1 比损失 1% 快），远古条目会被慢慢挤出 `$2 >= 1` 这条门槛（见 z.sh:78），之后直接丢弃

**与 frecent 的分工**：frecent 只影响"查询时的排序"，不改数据；aging 才是"数据本身的遗忘"。

---

## 四、Shell 技巧详解

### 4.1 `>|` 强制覆盖重定向（z.sh:95）

```bash
... >| "$tempfile"
```

当用户在 shell 里开启了 `set -o noclobber`（或 `set -C`），普通 `>` 会拒绝覆盖已存在文件，报 `cannot overwrite existing file`。

`>|`（有的文档写作 `>!`）是 POSIX 标准里明确定义的"强制覆盖"形式：**无视 noclobber，总是覆盖**。

脚本给用户用时你不知道对方的 shell 选项，加 `>|` 是一条廉价的健壮性保险。

### 4.2 `$'\n''` 真换行符拼接（z.sh:264）

```bash
PROMPT_COMMAND="$PROMPT_COMMAND"$'\n''(_z --add "$(command pwd '$_Z_RESOLVE_SYMLINKS' 2>/dev/null)" 2>/dev/null &);'
```

拆开看是三段字符串的串接：

```
"$PROMPT_COMMAND"   ← 原值（双引号展开）
$'\n'               ← 一个真正的换行符（ANSI-C quoting）
'(_z --add ...)'    ← 追加的命令（单引号原样保留）
```

关键点：
- `'\n'` 在单引号里只是两个字面字符 `\` 和 `n`，**不会**变成换行。
- `$'...'` 是 bash/zsh 的 ANSI-C quoting，`\n` 会被解释为换行符、`\t` 为制表符等。
- 用真换行符而不是分号，是因为 bash 的 `PROMPT_COMMAND` 按多行脚本执行，换行分隔的可读性和容错都好于 `;`（例如上一条命令以注释结尾就吃掉分号）。

中间那段又出现了 `'$_Z_RESOLVE_SYMLINKS'`：这是利用"单引号之间可以关掉再重开"的技巧——**闭单引号 → 让 shell 展开变量 → 再开单引号**。

### 4.3 `: $RANDOM` 空命令展开（z.sh:238, 243）

```zsh
_z_precmd() {
    (_z --add "${PWD:a}" &)
    : $RANDOM
}
```

两个元素要分开看：

- `:` 是 POSIX 的"空命令"（null utility），什么都不做但会**展开参数**。常见于 `: ${VAR:=default}` 这种给变量赋默认值的语法糖。
- `$RANDOM` 每次引用都会产生一个新的伪随机整数。

合起来，`: $RANDOM` 的效果是：**让 shell 做一次"读取 `$RANDOM` 并丢掉"的动作**，命令本身没有副作用。

在这里的真正意图是**压制 zsh 的后台作业消息**。`(_z --add ... &)` 已经用子 shell 隔离了后台任务，但 zsh 的 precmd 返回时还是有几率显示 `[1] + done ...` 之类的 job-control 消息。通过在函数尾部再执行一条前台命令（`: $RANDOM`），等于告诉 zsh 在 precmd 的最后一条有效命令是 `:` 而非后台 fork，抑制了那条 job-control 输出。`$RANDOM` 只是为了让这条命令"看起来每次都不同"（避免被优化掉或与历史去重混淆），在效果上它和 `:` 一样什么都不做。

这类小技巧在老一辈 shell 脚本里很常见，核心是"用最廉价的方式给 shell 状态机加一个占位符"。

### 4.4 反斜杠转义命令名 `\awk` `\sed` `\date` `\env`（z.sh:73, 98, 101, 131, 147）

```bash
_z_dirs | \awk -v path="$*" -v now="$(\date +%s)" ...
\sed -i -e "\:^${PWD}|.*:d" "$datafile"
\env mv -f "$tempfile" "$datafile"
```

在命令名前加 `\` 会**绕过 alias 展开**。这是 rupa 在 commit `d37a763`（"Escape calls for sed and awk in case someone aliased them"）加的防御。

想象用户把 `awk` alias 到 `gawk --some-flag`，或者把 `sed` 换成 GNU/BSD 不兼容的变体——z 的 awk 程序依赖特定行为时就会挂。`\awk` 强制使用 PATH 里查到的原始二进制。

同样的道理也适用于 `\env`：避免用户把 `mv` 换成 `mv -i` 造成每次覆盖都要确认。

### 4.5 `sort -n >&2` 的取巧（z.sh:160）

```awk
cmd = "sort -n >&2"
for( x in matches ) {
    if( matches[x] ) {
        printf "%-10s %s\n", matches[x], x | cmd
    }
}
```

列表模式 (`-l`) 要按分数排序后打印。awk 自己不排序，借外部 `sort` 做，但**输出重定向到 stderr**。为什么？

因为 `_z` 函数外层用 `cd="$( ... )"` 捕获 stdout 作为"要跳转的目标"。如果列表也从 stdout 走，就会被当成路径赋给 `cd`。把列表打到 stderr：
- 不污染 stdout（不会被 `$()` 捕获）
- 用户依然能在终端看到
- 让同一个 awk 程序同时兼顾 "返回值" 和 "展示输出" 两种用途

### 4.6 同类其他细节

| 语法 | 作用 |
|------|------|
| `${PWD:A}` / `${PWD:a}` | zsh 参数展开：`A` 解析符号链接到绝对路径，`a` 不解析 |
| `[ -h "$file" ]` | 测试符号链接（不是 `-L`——`-h` 和 `-L` 在此语境等价，`-h` 更老资格） |
| `[ -s "$file" ]` | 文件存在**且非空** |
| `[ -z "$_Z_OWNER" -a -f "$datafile" -a ! -O "$datafile" ]` | "没设 `$_Z_OWNER` 且文件存在但不归当前用户"——防止 sudo 下误写 root 的 `.z` |
| `case "$*" in "$exclude"*) return;; esac` | `case` 的 glob 匹配做前缀判断，比正则更快 |
| `\:^${PWD}|.*:d` | `sed` 的地址分隔符可以用 `:` 代替 `/`，避免和 `|`、路径里的 `/` 冲突 |
| `substr(q, 3)` | tab 补全时去掉前缀 `z `（2 个字符 + 1）|
| `read -l compl` / `reply=(...)` | zsh `compctl` 补全函数接口，不是 bash |

---

## 五、并发与原子性

```bash
local tempfile="$datafile.$RANDOM"
... >| "$tempfile"
...
\env mv -f "$tempfile" "$datafile" || \env rm -f "$tempfile"
```

三层防护：

1. **`$RANDOM` 后缀**：两个并发 precmd 同时写不会踩到同一个 tempfile。
2. **`mv -f`**：POSIX 保证同文件系统下 rename 是原子的；即使正在读 `~/.z` 的另一个进程，也要么看到旧版要么看到新版。
3. **失败回滚**：`||` 后 `rm -f "$tempfile"` 清理失败产物，不留垃圾。

另外 z.sh:97 还有一处 `if [ $? -ne 0 -a -f "$datafile" ]; then env rm -f "$tempfile"`——**awk 失败且原数据文件还在，就丢弃 tempfile 保留原文件**，优先保证数据不坏。

---

## 六、其他设计亮点

### 6.1 大小写双桶匹配（z.sh:193-202）

```awk
if( $1 ~ q ) {
    matches[$1] = rank
} else if( tolower($1) ~ tolower(q) ) imatches[$1] = rank
```

大小写敏感匹配和不敏感匹配进两个独立的表。最后在 END 里先判断 `best_match`（敏感）再回退到 `ibest_match`（不敏感）。这样 `z Doc` 和 `z doc` 会有不同的最佳结果，同时不会因为小写匹配淹没精确匹配。

### 6.2 共同根路径（z.sh:170-182, 207）

```awk
function common(matches) {
    for( x in matches ) {
        if( matches[x] && (!short || length(x) < length(short)) ) short = x
    }
    if( short == "/" ) return
    for( x in matches ) if( matches[x] && index(x, short) != 1 ) return
    return short
}
```

如果所有匹配都在同一棵子树下（例如用户输入 `z proj`，所有匹配都在 `/home/me/projects/` 下面），那 `cd` 到这个共同前缀——而不是最高分那个。只有 `-r` 或 `-t` 模式会跳过这个逻辑（`if( common && !typ )`）。这让 z 在歧义场景下"往上退一步"，而不是强行选一个。

### 6.3 完成后回车直接进（z.sh:138-141）

```bash
case "$last" in
    /*) [ -z "$list" -a -d "$last" ] && builtin cd "$last" && return;;
esac
```

tab 补全出来的路径以 `/` 开头。如果用户按回车时最后一个参数就是绝对路径且存在，直接 `cd` 过去——等于把 `z` 退化成 `cd`，避免补全后还要再跑一遍 frecent 匹配。

### 6.4 添加时预置 rank（z.sh:74-77）

```awk
BEGIN {
    rank[path] = 1
    time[path] = now
}
$2 >= 1 { ... }
```

写入时先在 BEGIN 块给当前路径一个基础分 1 + now。然后读入数据文件，**如果文件里已经有这条路径**，主代码块会命中 `$1 == path` 分支把 rank 改成 `$2 + 1`（即覆盖掉 BEGIN 的 1 继续累加）。如果没有就保留 BEGIN 里的初值。用 `awk` 的 BEGIN/主体/END 三段结构优雅地表达了"不存在则插入，存在则更新"。

### 6.5 目录存在性过滤（z.sh:44-53）

```bash
_z_dirs () {
    [ -f "$datafile" ] || return
    local line
    while read line; do
        [ -d "${line%%\|*}" ] && echo "$line"
    done < "$datafile"
}
```

每次查询都过滤掉**已经不存在的目录**。这是个刻意的设计选择：不在写入时清理（写入快），而是在读取时过滤（查询每次扫描）。换来的好处是**不需要后台守护 / 定期清理 cron**，数据文件只靠 aging 衰减出场。

---

## 七、设计亮点总结

| 场景 | 选择 | 为什么聪明 |
|------|------|------------|
| 存储 | 单一文本文件 | 0 依赖，用户可 `cat`/`grep`/手动备份，也是可迁移的 |
| 评分 | frecency = rank × f(dx) | 用一条光滑曲线同时编码频率和时间，单字段排序 |
| 衰减 | 阈值触发 × 0.99 | 自治 GC，不需要额外字段或任务 |
| 数据写入 | tempfile + mv + `$RANDOM` 后缀 | 原子替换 + 并发隔离 + 失败回滚 |
| 异步更新 | `( ... & )` 子 shell + `: $RANDOM` | 不阻塞 prompt，不泄露 job 消息 |
| 命令健壮性 | `\awk` / `\sed` / `\env` / `>|` | 抵御 alias、noclobber 等本地环境变量 |
| 匹配策略 | 敏感优先 → 不敏感 → 共同根 | 三层渐退，符合直觉 |
| 跨 shell | `compctl` 分支 vs `complete` 分支 | 同一脚本支持 bash 与 zsh，无需分两份 |

z.sh 只有 ~270 行，但 **Shell 脚本 / awk 字符串处理 / Unix 文件原子性 / 人类习惯建模** 四个领域的小技巧被密集编织进去。对想深入 Unix 文化的读者来说，它是一份极佳的"教具"。

---

## 八、阅读顺序建议

1. **先看 `_z_dirs` 和 `--add` 分支**（z.sh:44-102）：理解数据文件格式与写入逻辑。
2. **再看查询分支主体与 awk 程序**（z.sh:119-215）：理解 frecent 怎么产生、列表怎么走 stderr。
3. **最后看外层 alias 与 shell 集成**（z.sh:227-267）：理解为什么 bash / zsh 两边需要不同的 hook。

配合 `sh -x z.sh` 开 trace 并在 `$HOME/.z` 准备几条样本数据，边改边观察，是最快的学习路径。
