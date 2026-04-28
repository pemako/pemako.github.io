---
sidebar_position: 18
---

# Bash History（交互式历史）

> 参考：https://www.gnu.org/software/bash/manual/bash.html#Using-History-Interactively-1

## 9.1 Bash History Facilities

### 开关

- 交互式 shell 默认开启
- 临时关闭：`set +o history`
- 重新打开：`set -o history`

### 内存 & 文件两层

- 内存：当前会话命令列表
- 文件：`$HISTFILE`（默认 `~/.bash_history`），退出时写回

### 核心变量

| 变量 | 作用 |
|------|------|
| `HISTFILE` | 历史文件路径（空值禁用写盘） |
| `HISTSIZE` | 内存保留条数 |
| `HISTFILESIZE` | 文件保留条数 |
| `HISTCONTROL` | `ignorespace` / `ignoredups` / `ignoreboth` / `erasedups` |
| `HISTIGNORE` | 冒号分隔模式，匹配者不入史 |
| `HISTTIMEFORMAT` | 非空则记录时间戳，`history` 按此格式显示 |
| `HISTCMD` | 当前命令的历史编号 |

### 相关 shopt

- `histappend`：追加而非覆盖 `HISTFILE`
- `cmdhist`：多行命令合成一条
- `lithist`：配合 `cmdhist`，多行用换行保存
- `histreedit`：展开失败可回编辑
- `histverify`：展开后先回填行缓冲区确认

### 多行与子 shell

`cmdhist` 默认开启；子 shell / 管道段内命令不额外入史。

## 9.2 Bash History Builtins

### history

- `history` 列出全部
- `history N` 最近 N 条
- `history -c` 清空内存
- `history -d offset[-end]` 删除指定条（支持区间）
- `history -a` 本会话新增追加到文件
- `history -n` 把文件里尚未读入的追加进内存
- `history -w` 内存整盘写回文件
- `history -r` 读文件覆盖内存
- `history -s "cmd"` 手工塞入一条
- `history -p 'arg' …` 只展开不执行、不入史

### fc（fix command）

- `fc [-e editor] [-lnr] [first] [last]`：区间丢编辑器
- `fc -l` 列出不执行
- `fc -n` 不带行号
- `fc -r` 倒序
- `fc -s [pat=rep] [cmd]` 不进编辑器，替换并重跑（`r` 的基础）

## 9.3 History Expansion

行首扫描，**在引号解析前发生**；单引号无法阻止，需要 `\!` 或关掉。

结构：`! event [:word] [:modifier…]`

### 事件指示符

| 语法 | 含义 |
|------|------|
| `!!` | 上一条 |
| `!n` | 编号 n |
| `!-n` | 倒数第 n 条 |
| `!string` | 最近一条**以 string 开头** |
| `!?string[?]` | 最近一条**包含 string** |
| `^old^new^` | 上条做一次替换 |
| `!#` | 当前已输入的整行 |

### 词指示符（前接 `:`，紧跟 `!!` 时可省略 `:`）

| 语法 | 含义 |
|------|------|
| `0` | 命令本身 |
| `n` | 第 n 个参数 |
| `^` | 第 1 个（= `:1`） |
| `$` | 最后一个 |
| `%` | 与 `!?string?` 匹配的词 |
| `x-y` | 第 x 到 y 个词 |
| `*` | `1-$` 全部参数 |
| `x*` | `x-$` |
| `x-` | `x-$` 但不含最后一个 |

### 修饰符（可叠加）

- `h` 路径目录部分（head）
- `t` 文件名（tail）
- `r` 去扩展名（root）
- `e` 只留扩展名
- `p` **只打印不执行**
- `q` 整体加引号
- `x` 引号并按空白拆词
- `s/old/new/` 替换一次（`&` 表示 old）
- `gs/old/new/` 全局替换
- `a` 全局（alias for `g`）

### 常用片段

```bash
$ sudo !!               # 给上条加 sudo
$ !!:gs/foo/bar/        # 全局替换后重跑
$ ls !$                 # 上条最后一个参数
$ vim !cat:2            # 最近 cat 命令的第 2 个词
$ ^prod^staging         # prod → staging 重跑
$ !mk:p                 # 打印最近 mk 开头命令，先看再决定
$ echo !!:1:h           # 上条第 1 参数的目录部分
```

### 交互保护

- `shopt -s histverify`：展开结果先回填给你确认
- `shopt -s histreedit`：匹配失败回编辑而非报错丢失
- `set +H` / `set +o histexpand`：完全禁用
- 脚本里想安全拿到展开：`history -p '!!'`

---

## 经典使用案例

### 1. 推荐的 HIST* 基线配置

  写进 `~/.bashrc`：

  ```bash
  HISTSIZE=50000
  HISTFILESIZE=50000
  HISTCONTROL=ignoreboth:erasedups
  HISTTIMEFORMAT='%F %T  '
  HISTIGNORE='ls:ll:pwd:exit:clear:history:bg:fg:jobs'
  shopt -s histappend cmdhist histverify
  ```

  `ignoreboth` = `ignorespace + ignoredups`：空格开头的命令不入史，用于临时敏感命令。

### 2. 多终端实时共享历史

  加一行 `PROMPT_COMMAND`：

  ```bash
  PROMPT_COMMAND="history -a; history -n; ${PROMPT_COMMAND:-:}"
  ```

  每条命令执行完 `-a` 追加到文件、`-n` 把其他终端新写入的读回本窗口。

### 3. 给上一条命令加 sudo

  ```bash
  $ apt update
  E: Permission denied
  $ sudo !!
  ```

### 4. 批量替换后重跑

  ```bash
  $ scp file.tar user@host-prod:/opt/
  $ !!:gs/prod/staging/
  # 等价 scp file.tar user@host-staging:/opt/
  ```

  只替一次：`^prod^staging^`。

### 5. 反复使用上条参数

  `M-.` 是交互级快捷；脚本化场景用 `!$`：

  ```bash
  $ mkdir -p /var/log/myapp
  $ chown app:app !$
  $ cd !$
  ```

  取第一个参数 `!^`，全部参数 `!*`。

### 6. 安全预览再执行（`:p`）

  对拼起来较长的展开别急着回车：

  ```bash
  $ !rsync:p               # 打印展开结果到历史，不执行
  # 检查没问题再 !! 或 C-p 回车
  ```

  或全局开 `shopt -s histverify`，每次展开都先进编辑缓冲区。

### 7. 删掉刚写错的敏感命令

  刚输入了带密码明文的命令想抹掉：

  ```bash
  $ mysql -u root -pSECRET    # 不小心写了
  $ history -d $((HISTCMD-1)) # 删内存里这条
  $ history -w                # 立刻写盘覆盖
  ```

  更简单：命令前加**空格**（需 `HISTCONTROL=ignorespace`），本身就不入史。

### 8. 从历史里抠出一段复杂命令再编辑

  ```bash
  $ fc -l -20          # 列最近 20 条看编号
  $ fc 842 845         # 842–845 合并进编辑器
  # 保存退出 → 作为一条新命令执行
  ```

### 9. 按时间段捞历史

  ```bash
  $ HISTTIMEFORMAT='%F %T  ' history | awk '$2 >= "2026-04-20"'
  ```

### 10. 脚本里复用历史展开

  不能在非交互脚本里直接写 `!!`，用 `history -p`：

  ```bash
  last=$(history -p '!!')
  echo "上一条是：$last"
  ```

### 11. 常见陷阱

  - `echo "hello!"` 会触发 history expansion 报错 → 用单引号或 `\!`。
  - 多终端退出时互相覆盖历史 → 必须 `shopt -s histappend`，或配合 PROMPT_COMMAND 同步。
  - `HISTIGNORE` 只影响**入史**，不影响已有历史。
  - `HISTCONTROL=ignoredups` 只去相邻重复；跨会话去重要 `erasedups` + `histappend`。
  - `history -c` 只清内存，不动文件；真正抹掉要 `history -c && history -w` 或直接编辑 `$HISTFILE`。
  - `fc -s` 的替换只替**第一次出现**，要全替得手写 `!!:gs/…/…/`。
