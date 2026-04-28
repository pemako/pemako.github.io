---
sidebar_position: 3
---

# Bash Features 详解

## 概述

本文档涵盖 Bash 专有特性（Chapter 6: Bash Features），这些是 bash 相较于 POSIX sh 的扩展能力。

---

## 1. 调用 Bash（Invoking Bash）

### Shell 类型

| 类型 | 判断条件 |
|------|----------|
| **登录 Shell** | `$0` 首字符为 `-`，或使用 `--login` 选项启动 |
| **交互式 Shell** | 无非选项参数、无 `-c`，且 stdin/stderr 连接到终端；或使用 `-i` 启动 |

```bash
# 检测是否为交互式 shell
[[ $- == *i* ]] && echo "交互式" || echo "非交互式"

# 检测是否为登录 shell
shopt -q login_shell && echo "登录 shell" || echo "非登录 shell"
```

### 常用启动选项

| 选项 | 说明 |
|------|------|
| `--login` / `-l` | 以登录 shell 方式启动 |
| `--interactive` / `-i` | 强制交互式模式 |
| `--norc` | 不读取 `~/.bashrc` |
| `--noprofile` | 不读取任何 profile 文件 |
| `--rcfile file` | 用指定文件替代 `~/.bashrc` |
| `--posix` | 启用 POSIX 严格模式 |
| `-c string` | 执行 string 中的命令 |
| `-s` | 从 stdin 读取命令（可配合参数传递） |
| `-r` | 启动受限 shell |

---

## 2. Bash 启动文件（Bash Startup Files）

### 启动文件加载顺序

```
交互式登录 Shell
    → /etc/profile
    → ~/.bash_profile  （找到即停止）
    → ~/.bash_login
    → ~/.profile
    → 退出时执行 ~/.bash_logout

交互式非登录 Shell
    → ~/.bashrc

非交互式 Shell（运行脚本）
    → 读取 $BASH_ENV 指向的文件（不使用 PATH 搜索）

以 sh 名称调用
    → /etc/profile + ~/.profile（登录模式）
    → $ENV 指向的文件（交互模式）

POSIX 模式（--posix）
    → $ENV 指向的文件（交互模式）
```

### 常见 ~/.bashrc 与 ~/.bash_profile 分工

```bash
# ~/.bash_profile：登录时执行一次
export PATH="$HOME/.local/bin:$PATH"
source ~/.bashrc          # 通常在此引入 .bashrc

# ~/.bashrc：每个交互式 shell 都执行
alias ll='ls -lah'
PS1='\u@\h:\w\$ '
```

### 特权模式下的行为

当有效 UID ≠ 真实 UID 且未提供 `-p` 时：
- 不读取任何启动文件
- 不继承环境中的函数
- 忽略 `SHELLOPTS`、`BASHOPTS`、`CDPATH`、`GLOBIGNORE`

---

## 3. 交互式 Shell（Interactive Shells）

交互式 shell 的特有行为：

- 启动时读取 `~/.bashrc`
- 默认开启任务控制（Job Control）
- 开启历史记录
- 开启别名展开（`expand_aliases`）
- `$PS1` 被设置，`$-` 包含 `i`
- 忽略 `SIGTERM` 信号
- `SIGINT` 被捕获但不退出（用于中断当前命令）
- 退出时若有停止的作业会提示

```bash
# 判断是否交互式
if [[ $- == *i* ]]; then
  echo "交互式 shell"
  bind '"\e[A":history-search-backward'
fi
```

---

## 4. Bash 条件表达式（Bash Conditional Expressions）

用于 `[[` 复合命令和 `test`/`[` 内建命令。

### 文件测试

| 表达式 | 含义 |
|--------|------|
| `-a file` / `-e file` | 文件存在 |
| `-f file` | 存在且为普通文件 |
| `-d file` | 存在且为目录 |
| `-b file` | 存在且为块设备 |
| `-c file` | 存在且为字符设备 |
| `-p file` | 存在且为命名管道（FIFO） |
| `-S file` | 存在且为 socket |
| `-L file` / `-h file` | 存在且为符号链接 |
| `-r file` | 存在且可读 |
| `-w file` | 存在且可写 |
| `-x file` | 存在且可执行 |
| `-s file` | 存在且大小 > 0 |
| `-g file` | 存在且设置了 set-group-id 位 |
| `-u file` | 存在且设置了 set-user-id 位 |
| `-k file` | 存在且设置了 sticky 位 |
| `-O file` | 存在且属于当前有效用户 |
| `-G file` | 存在且属于当前有效组 |
| `-N file` | 存在且上次访问后被修改过 |
| `-t fd` | 文件描述符 fd 已打开且指向终端 |
| `f1 -ef f2` | f1 和 f2 指向同一设备和 inode |
| `f1 -nt f2` | f1 比 f2 新（修改时间），或 f1 存在 f2 不存在 |
| `f1 -ot f2` | f1 比 f2 旧，或 f2 存在 f1 不存在 |

### 字符串测试

| 表达式 | 含义 |
|--------|------|
| `-z string` | 字符串长度为 0 |
| `-n string` / `string` | 字符串长度非 0 |
| `s1 == s2` / `s1 = s2` | 字符串相等（`[[` 中支持模式匹配） |
| `s1 != s2` | 字符串不等 |
| `s1 < s2` | s1 按字典序排在 s2 前面 |
| `s1 > s2` | s1 按字典序排在 s2 后面 |

### 变量测试

| 表达式 | 含义 |
|--------|------|
| `-v varname` | 变量已设置（已赋值） |
| `-R varname` | 变量已设置且是 nameref 引用 |

### 算术比较

| 表达式 | 含义 |
|--------|------|
| `arg1 -eq arg2` | 等于 |
| `arg1 -ne arg2` | 不等于 |
| `arg1 -lt arg2` | 小于 |
| `arg1 -le arg2` | 小于等于 |
| `arg1 -gt arg2` | 大于 |
| `arg1 -ge arg2` | 大于等于 |

### Shell 选项测试

```bash
-o optname    # shell 选项 optname 已开启
```

### 使用示例

```bash
# 文件测试
if [[ -f /etc/hosts && -r /etc/hosts ]]; then
  echo "可读"
fi

# 字符串模式匹配（[[ 专有）
filename="report_2026.pdf"
if [[ $filename == *.pdf ]]; then
  echo "是 PDF 文件"
fi

# 正则匹配（[[ 专有）
if [[ $filename =~ ^report_([0-9]{4})\.pdf$ ]]; then
  echo "年份: ${BASH_REMATCH[1]}"
fi
```

---

## 5. Shell 算术（Shell Arithmetic）

bash 支持整数算术运算，使用 `$((...))` 或 `((...))` 或 `let`。

### 运算符（按优先级从高到低）

| 运算符 | 说明 |
|--------|------|
| `id++` `id--` | 后置自增/自减 |
| `++id` `--id` | 前置自增/自减 |
| `-` `+` | 一元负/正 |
| `!` `~` | 逻辑非 / 按位取反 |
| `**` | 幂运算 |
| `*` `/` `%` | 乘 / 除 / 取余 |
| `+` `-` | 加 / 减 |
| `<<` `>>` | 左移 / 右移 |
| `<=` `>=` `<` `>` | 比较 |
| `==` `!=` | 等于 / 不等于 |
| `&` | 按位 AND |
| `^` | 按位 XOR |
| `\|` | 按位 OR |
| `&&` | 逻辑 AND |
| `\|\|` | 逻辑 OR |
| `expr?expr:expr` | 三元运算符 |
| `=` `*=` `/=` `%=` `+=` `-=` `<<=` `>>=` `&=` `^=` `\|=` | 赋值 |
| `expr1, expr2` | 逗号（顺序求值） |

### 数字进制

```bash
echo $((10))      # 十进制：10
echo $((010))     # 八进制：8
echo $((0x1F))    # 十六进制：31
echo $((2#1010))  # 二进制：10
echo $((16#FF))   # 十六进制（显式基数）：255
```

### 使用示例

```bash
# 基本运算
a=10 b=3
echo $(( a + b ))    # 13
echo $(( a ** b ))   # 1000
echo $(( a % b ))    # 1

# 自增
((count++))
((i += 5))

# 三元运算
result=$(( a > b ? a : b ))   # 取较大值

# 位运算
flags=0
flags=$(( flags | 0x01 ))     # 设置位
flags=$(( flags & ~0x01 ))    # 清除位
echo $(( flags >> 2 ))        # 右移 2 位

# let 命令（等同 ((...))）
let "x = 5 * 3"
let x++
```

---

## 6. 别名（Aliases）

别名允许用一个字符串替换命令行中的一个单词。

### 基本规则

- 别名名称不能包含 `/` `$` `` ` `` `=` 及 shell 元字符
- 替换文本可以是任意合法 shell 输入
- 别名**不能传递参数**（需要参数时应用函数替代）
- 非交互式 shell 中默认不展开别名（除非开启 `expand_aliases`）
- 别名在**读取命令时**展开，而非执行时

```bash
# 创建别名
alias ll='ls -lah'
alias grep='grep --color=auto'
alias ..='cd ..'
alias ...='cd ../..'

# 别名末尾加空格：让下一个词也进行别名检查
alias sudo='sudo '

# 查看别名
alias ll           # 查看单个
alias              # 查看所有

# 删除别名
unalias ll

# 临时跳过别名（使用 \ 前缀或 command）
\ls                # 跳过 ls 别名
command ls         # 跳过 ls 别名
```

### 别名 vs 函数

```bash
# 别名：不能用参数
alias mkcd='mkdir -p'   # mkcd foo 可用，但 mkcd foo && cd foo 做不到

# 函数：可以用参数（推荐替代复杂别名）
mkcd() {
  mkdir -p "$1" && cd "$1"
}
```

---

## 7. 数组（Arrays）

bash 支持**索引数组**和**关联数组**（字典），无大小限制。

### 索引数组

```bash
# 声明与赋值
declare -a arr
arr=(apple banana cherry)
arr[0]="apple"

# 负索引（从末尾计数）
echo ${arr[-1]}          # cherry（最后一个元素）

# 读取
echo ${arr[0]}           # apple
echo ${arr[@]}           # 所有元素（各自独立）
echo ${arr[*]}           # 所有元素（合并为一个字符串）
echo ${#arr[@]}          # 元素数量：3
echo ${!arr[@]}          # 所有索引：0 1 2

# 切片
echo ${arr[@]:1:2}       # 从索引 1 取 2 个：banana cherry

# 追加
arr+=(date elderberry)
arr[10]="fig"            # 稀疏数组，索引可不连续

# 删除
unset arr[1]             # 删除单个元素
unset arr                # 删除整个数组

# 遍历
for item in "${arr[@]}"; do
  echo "$item"
done
```

### 关联数组（字典）

```bash
# 必须用 declare -A 显式声明
declare -A user
user[name]="Alice"
user[age]=30
user[role]="admin"

# 另一种赋值方式
declare -A config=([host]="localhost" [port]="5432")

# 读取
echo ${user[name]}       # Alice
echo ${user[@]}          # 所有值
echo ${!user[@]}         # 所有键

# 检查键是否存在
[[ -v user[name] ]] && echo "键存在"

# 遍历
for key in "${!user[@]}"; do
  echo "$key: ${user[$key]}"
done

# 删除
unset user[age]          # 删除单个键
unset user               # 删除整个数组
```

### 常用数组操作

```bash
# 数组长度
echo ${#arr[@]}

# 数组拼接
combined=("${arr1[@]}" "${arr2[@]}")

# 数组作为函数参数（需借助全局变量或 nameref）
process() {
  local -n ref=$1        # nameref
  echo "${ref[@]}"
}
process arr

# readarray / mapfile 读取文件到数组
mapfile -t lines < /etc/hosts
readarray -t lines < /etc/hosts

# 用命令输出填充数组
files=( $(find . -name "*.sh") )
# 更安全的写法（处理含空格的文件名）
mapfile -t files < <(find . -name "*.sh")
```

---

## 8. 目录栈（The Directory Stack）

bash 维护一个目录栈，支持快速在多个目录间切换。

| 命令 | 说明 |
|------|------|
| `pushd dir` | 切换到 dir 并将当前目录压栈 |
| `popd` | 弹出栈顶目录并切换回去 |
| `dirs` | 显示目录栈内容 |
| `dirs -v` | 带编号显示目录栈 |
| `pushd +N` | 旋转目录栈，切换到编号 N 的目录 |
| `popd +N` | 删除栈中编号 N 的目录 |

```bash
# 基本使用
cd /var/log
pushd /etc/nginx    # 栈：/etc/nginx /var/log
pushd /tmp          # 栈：/tmp /etc/nginx /var/log
dirs -v
# 0  /tmp
# 1  /etc/nginx
# 2  /var/log

popd                # 回到 /etc/nginx
popd                # 回到 /var/log

# $DIRSTACK 变量存储栈内容
echo "${DIRSTACK[@]}"
```

---

## 9. 控制提示符（Controlling the Prompt）

bash 允许在 `PS0`、`PS1`、`PS2`、`PS4` 中使用转义序列。

### 提示符变量

| 变量 | 触发时机 |
|------|----------|
| `$PS0` | 读取命令后、执行前显示 |
| `$PS1` | 主提示符，每次准备读取命令时显示 |
| `$PS2` | 续行提示符（命令未完成时） |
| `$PS4` | `set -x` 追踪时每行前缀 |
| `$PROMPT_COMMAND` | 每次显示 PS1 前执行的命令 |

### PS1 转义序列

| 序列 | 含义 |
|------|------|
| `\u` | 当前用户名 |
| `\h` | 主机名（到第一个 `.`） |
| `\H` | 完整主机名 |
| `\w` | 当前目录（`$HOME` 缩写为 `~`） |
| `\W` | 当前目录的基名 |
| `\d` | 日期（如 `Tue Apr 27`） |
| `\t` | 时间 24 小时制（`HH:MM:SS`） |
| `\T` | 时间 12 小时制 |
| `\@` | 时间 12 小时 am/pm 格式 |
| `\A` | 时间 24 小时制（`HH:MM`） |
| `\D{fmt}` | 自定义时间格式（传给 `strftime`） |
| `\n` | 换行 |
| `\s` | shell 名称 |
| `\v` | bash 版本 |
| `\V` | bash 版本 + patch level |
| `\!` | 历史编号 |
| `\#` | 命令编号 |
| `\$` | UID 为 0 显示 `#`，否则显示 `$` |
| `\nnn` | 八进制字符 |
| `\\` | 反斜杠 |
| `\[` `\]` | 包裹不可打印字符（如终端颜色码） |

### 示例

```bash
# 彩色提示符
PS1='\[\e[32m\]\u@\h\[\e[0m\]:\[\e[34m\]\w\[\e[0m\]\$ '

# 显示 git 分支
PS1='\u@\h:\w$(git branch 2>/dev/null | grep "^*" | sed "s/* / [/;s/$//]")\$ '

# 自定义 PS4（调试时显示文件和行号）
PS4='+[${BASH_SOURCE##*/}:${LINENO}:${FUNCNAME[0]:+${FUNCNAME[0]}()}] '

# PROMPT_COMMAND：每次提示前更新终端标题
PROMPT_COMMAND='echo -ne "\033]0;${USER}@${HOSTNAME}: ${PWD}\007"'
```

---

## 10. 受限 Shell（The Restricted Shell）

用 `rbash` 或 `bash -r` 启动，用于构建更受控的执行环境。

### 受限 Shell 禁止的操作

- `cd` 切换目录
- 修改 `SHELL`、`PATH`、`HISTFILE`、`ENV`、`BASH_ENV`
- 命令名或文件名中包含 `/`
- 使用 `>` `>|` `<>` `>&` `&>` `>>` 重定向输出
- 使用 `exec` 替换当前进程
- 用 `enable` 启用/禁用内建命令
- 用 `set +r` 或 `shopt -u restricted_shell` 关闭受限模式

```bash
# 启动受限 shell
bash -r
# 或
rbash

# 为特定用户设置受限 shell
chsh -s /bin/rbash username
```

> 注意：启动文件读取完毕后才强制执行这些限制；执行 shell 脚本时，rbash 会在子 shell 中关闭受限模式。

---

## 11. Bash 与 POSIX（Bash and POSIX）

### 开启 POSIX 模式

```bash
# 方式一：启动时
bash --posix

# 方式二：运行时
set -o posix

# 方式三：环境变量
POSIXLY_CORRECT=1 bash
```

### POSIX 模式改变的行为（主要差异）

| 行为 | bash 默认 | POSIX 模式 |
|------|-----------|------------|
| 特殊内建命令错误 | shell 不退出 | shell 退出 |
| 函数可覆盖特殊内建 | 可以 | 不可以 |
| `time` 关键字 | 可单独使用 | 受限 |
| `alias` 展开 | 交互式默认开 | 同左 |
| `$'...'` 引用 | 支持 | POSIX 不定义（bash 仍支持） |

---

## 12. Shell 兼容模式（Shell Compatibility Mode）

bash 4.0 引入，允许选择之前版本的行为，便于脚本迁移。

### 设置方式

```bash
# bash 5.0 及之前：shopt 选项
shopt -s compat42

# bash 4.3 及以后：推荐用变量
BASH_COMPAT=4.2

# bash 5.1 及以后：只能用变量
BASH_COMPAT=50
```

### 各兼容级别说明

| 级别 | 主要行为变化 |
|------|-------------|
| `compat31` | `[[ =~` 右侧引号不对正则有特殊效果 |
| `compat32` | `[[` 的 `<` `>` 用 ASCII 排序而非 locale |
| `compat40` | 同 compat32 的排序行为 |
| `compat41` | POSIX 模式下 `time` 后可跟选项；单引号在双引号参数展开中特殊处理 |
| `compat42` | 双引号模式替换中替换字符串不做 quote removal |
| `compat43` | 单词展开错误为非致命错误；函数中 break/continue 影响调用方循环 |
| `compat44` | `BASH_ARGV`/`BASH_ARGC` 在非 extdebug 下也可展开；子 shell 继承父循环状态 |
| `compat50` | `$RANDOM` 用旧算法生成（bash 5.1 改进了随机性） |
| `compat51` | `unset` 处理 `@`/`*` 下标的旧行为；多种表达式可多次展开 |
| `compat52` | `test` 用历史算法解析括号子表达式；`bind -p/-P` 处理参数的旧行为 |

---

## 速查

```bash
# 检测 shell 类型
[[ $- == *i* ]]          # 是否交互式
shopt -q login_shell     # 是否登录 shell

# 数组操作
${arr[@]}                # 所有元素
${#arr[@]}               # 元素数量
${!arr[@]}               # 所有索引/键
${arr[@]:start:len}      # 切片

# 条件表达式
[[ -f file ]]            # 文件存在且为普通文件
[[ -v var ]]             # 变量已设置
[[ str =~ regex ]]       # 正则匹配
[[ str == pattern ]]     # glob 模式匹配

# 算术
$(( expr ))              # 算术展开
(( expr ))               # 算术命令
let "expr"               # let 命令

# 目录栈
pushd dir / popd / dirs -v

# 受限 shell
bash -r / rbash

# POSIX 模式
set -o posix / POSIXLY_CORRECT=1

# 兼容模式
BASH_COMPAT=5.0
```
