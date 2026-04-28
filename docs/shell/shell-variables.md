---
sidebar_position: 5
---

# Bourne Shell Variables vs Bash Variables

## 核心区别

**Bourne Shell Variables** 是 POSIX 标准定义的，所有 POSIX shell 都有；**Bash Variables** 是 bash 专有扩展，只在 bash 中存在。

---

## Bourne Shell Variables（POSIX 标准，全平台通用）

### 环境与路径

| 变量 | 说明 |
|------|------|
| `$HOME` | 用户主目录 |
| `$PATH` | 命令搜索路径 |
| `$PWD` | 当前目录 |
| `$OLDPWD` | 上一个目录 |
| `$CDPATH` | `cd` 的搜索路径 |
| `$LANG` / `$LC_*` | 语言和区域设置 |
| `$MAIL` | 邮件文件路径 |
| `$MAILPATH` | 多个邮件文件路径（冒号分隔） |
| `$MAILCHECK` | 检查新邮件的间隔秒数（默认 60） |

### 提示符

| 变量 | 说明 |
|------|------|
| `$PS1` | 主提示符 |
| `$PS2` | 续行提示符（输入未完成时） |

### 特殊参数

| 变量 | 说明 |
|------|------|
| `$?` | 上一条命令的退出状态 |
| `$$` | 当前 shell 的 PID |
| `$!` | 最近一个后台进程的 PID |
| `$0` | 脚本或 shell 名称 |
| `$1`~`$9` | 位置参数 |
| `$@` | 所有位置参数（各自独立） |
| `$*` | 所有位置参数（合并为一个字符串） |
| `$#` | 位置参数数量 |
| `$-` | 当前已开启的选项标志 |

### 其他

| 变量 | 说明 |
|------|------|
| `$IFS` | 字段分隔符（默认空格/Tab/换行） |
| `$OPTARG` | `getopts` 当前选项的参数值 |
| `$OPTIND` | `getopts` 下一个处理的参数索引 |

---

## Bash Variables（bash 专有，不可移植）

### Shell 自身信息

| 变量 | 说明 |
|------|------|
| `$BASH` | bash 可执行文件的路径 |
| `$BASH_VERSION` | bash 版本字符串 |
| `$BASH_VERSINFO` | bash 版本信息数组 |
| `$BASHPID` | 当前 bash 进程的 PID（与 `$$` 不同，子 shell 中有差异） |
| `$BASHOPTS` | 当前 `shopt` 开启的选项列表 |
| `$SHELLOPTS` | 当前 `set -o` 开启的选项列表 |
| `$SHLVL` | shell 嵌套层数 |
| `$HOSTTYPE` | 硬件类型（如 `x86_64`） |
| `$OSTYPE` | 操作系统类型（如 `linux-gnu`） |
| `$MACHTYPE` | 完整机器描述 |
| `$HOSTNAME` | 主机名 |
| `$HOSTFILE` | 主机名补全的来源文件 |
| `$CHILD_MAX` | shell 记录的已退出子进程数上限 |
| `$FUNCNEST` | 函数嵌套调用深度上限（防止无限递归） |

### 调试与追踪

| 变量 | 说明 |
|------|------|
| `$BASH_SOURCE` | 调用栈中每层对应的源文件名（数组） |
| `$BASH_LINENO` | 调用栈中每层对应的行号（数组） |
| `$BASH_COMMAND` | 当前正在执行的命令（配合 DEBUG trap） |
| `$BASH_SUBSHELL` | 当前子 shell 的嵌套层数 |
| `$BASH_ARGC` / `$BASH_ARGV` | 调用栈参数信息（需开启 `extdebug`） |
| `$BASH_EXECUTION_STRING` | `-c` 选项传入的命令字符串 |
| `$LINENO` | 当前执行的行号 |
| `$FUNCNAME` | 函数调用栈数组 |
| `$BASH_XTRACEFD` | `set -x` 输出的目标文件描述符 |
| `$BASH_COMPAT` | 设置 bash 兼容模式版本号 |

### 历史记录

| 变量 | 说明 |
|------|------|
| `$HISTFILE` | 历史记录文件路径 |
| `$HISTSIZE` | 内存中保留的历史条数 |
| `$HISTFILESIZE` | 文件中保留的历史条数 |
| `$HISTCONTROL` | 历史记录过滤规则（`ignoredups` 等） |
| `$HISTIGNORE` | 不记录历史的命令模式 |
| `$HISTTIMEFORMAT` | 历史记录的时间戳格式 |
| `$HISTCMD` | 当前命令在历史中的编号 |

### 管道与进程

| 变量 | 说明 |
|------|------|
| `$PIPESTATUS` | 上一条管道中每个命令的退出状态（数组） |
| `$PPID` | 父进程 PID |
| `$UID` / `$EUID` | 真实/有效用户 ID |
| `$GROUPS` | 用户所属组 ID 数组 |

### 实用工具变量

| 变量 | 说明 |
|------|------|
| `$RANDOM` | 每次引用返回 0~32767 的随机数 |
| `$SRANDOM` | 32 位高质量随机数（bash 5.1+） |
| `$SECONDS` | shell 启动至今的秒数 |
| `$EPOCHSECONDS` | Unix 时间戳（整秒） |
| `$EPOCHREALTIME` | Unix 时间戳（含小数秒） |
| `$REPLY` | `read` 未指定变量名时的默认接收变量 |
| `$DIRSTACK` | `pushd`/`popd` 目录栈数组 |
| `$TIMEFORMAT` | `time` 命令的输出格式 |
| `$TMOUT` | 交互式 shell 的输入超时秒数 |
| `$BASH_REMATCH` | `[[ =~ ]]` 正则匹配的捕获组数组 |
| `$MAPFILE` | `mapfile`/`readarray` 的默认数组名 |
| `$EXECIGNORE` | `exec` 时忽略的文件模式列表 |
| `$GLOBIGNORE` | glob 展开时忽略的文件模式列表 |
| `$FIGNORE` | 补全时忽略的文件后缀列表 |
| `$IGNOREEOF` | 交互式 shell 忽略 EOF 的次数 |
| `$INPUTRC` | Readline 配置文件路径（默认 `~/.inputrc`） |
| `$INSIDE_EMACS` | 在 Emacs 中运行时由 Emacs 设置 |
| `$POSIXLY_CORRECT` | 设置后强制 POSIX 兼容模式 |
| `$BASH_ENV` | 非交互式 bash 启动时执行的文件 |
| `$BASH_LOADABLES_PATH` | 动态加载内建命令的搜索路径 |
| `$LINES` / `$COLUMNS` | 终端行数/列数（`checkwinsize` 自动更新） |

### 补全相关变量

| 变量 | 说明 |
|------|------|
| `$COMP_CWORD` | 当前光标所在单词在 `$COMP_WORDS` 中的索引 |
| `$COMP_KEY` | 触发补全的按键 |
| `$COMP_LINE` | 当前命令行完整内容 |
| `$COMP_POINT` | 光标在命令行中的位置 |
| `$COMP_TYPE` | 补全类型（Tab/`?`/`!` 等） |
| `$COMP_WORDBREAKS` | 补全时的单词分隔字符集 |
| `$COMP_WORDS` | 当前命令行拆分后的单词数组 |
| `$COMPREPLY` | 补全函数向 bash 返回补全候选的数组 |

### 提示符扩展

| 变量 | 说明 |
|------|------|
| `$PS0` | 每条命令执行前、读取后显示的字符串（bash 4.4+） |
| `$PS3` | `select` 循环的提示符 |
| `$PS4` | `set -x` 追踪时每行的前缀（默认 `+`） |
| `$PROMPT_COMMAND` | 每次显示 `$PS1` 前执行的命令 |
| `$PROMPT_DIRTRIM` | 提示符中路径显示的层数上限 |

---

## 关键差异示例

### PIPESTATUS：管道各段退出状态

```bash
# bash 专有，sh/dash 没有
cat /nonexistent | grep foo
echo ${PIPESTATUS[@]}   # 1 1（cat 失败，grep 也失败）

# POSIX 替代方案：只能拿到最后一段的状态
echo $?   # 只有 grep 的退出状态
```

### BASH_SOURCE + FUNCNAME：调试定位

```bash
# bash 专有，可精确定位函数调用位置
foo() {
  echo "调用自: ${BASH_SOURCE[1]}:${BASH_LINENO[0]}"
  echo "调用栈: ${FUNCNAME[@]}"
}

bar() { foo; }
bar
# 输出：
# 调用自: script.sh:8
# 调用栈: foo bar main
```

### RANDOM：随机数

```bash
# bash 专有
echo $RANDOM            # 每次引用返回不同值（0~32767）

# POSIX 替代方案
awk 'BEGIN{srand(); print int(rand()*32768)}'
```

### EPOCHREALTIME：高精度时间戳（bash 5.0+）

```bash
# bash 专有
echo $EPOCHREALTIME     # 1745723412.345678

# POSIX 替代方案
date +%s%N              # 精度取决于系统
```

### BASH_REMATCH：正则捕获组

```bash
# bash 专有
str="2026-04-27"
if [[ $str =~ ^([0-9]{4})-([0-9]{2})-([0-9]{2})$ ]]; then
  echo "年: ${BASH_REMATCH[1]}"   # 2026
  echo "月: ${BASH_REMATCH[2]}"   # 04
  echo "日: ${BASH_REMATCH[3]}"   # 27
fi

# POSIX 替代方案：用 sed/awk 提取
echo "$str" | sed 's/\([0-9]*\)-\([0-9]*\)-\([0-9]*\)/年:\1 月:\2 日:\3/'
```

### IFS 控制分词（POSIX，但常被忽视）

```bash
# IFS 是 POSIX 变量，所有 shell 都有
IFS=: read user pass uid gid <<< "root:x:0:0"
echo "$user $uid"   # root 0

# 临时修改 IFS
IFS=',' read -ra fields <<< "a,b,c,d"
echo ${fields[@]}   # a b c d
```

---

## 可移植性速查

| 需求 | POSIX 写法 | bash 专有 |
|------|-----------|-----------|
| 退出状态 | `$?` | `${PIPESTATUS[@]}` |
| 当前行号 | 无标准方式 | `$LINENO` |
| 函数名 | 无标准方式 | `${FUNCNAME[0]}` |
| 随机数 | `awk rand()` | `$RANDOM` |
| 时间戳 | `date +%s` | `$EPOCHSECONDS` |
| 正则捕获 | `sed`/`awk` | `$BASH_REMATCH` |
| 管道各段状态 | 无 | `$PIPESTATUS` |
| 主机名 | `hostname` 命令 | `$HOSTNAME` |

---

## 一句话总结

写需要跨平台移植的脚本（`#!/bin/sh`）只能依赖 Bourne Shell Variables；写只在 bash 环境运行的脚本（`#!/bin/bash`）可充分利用 Bash Variables 提供的调试、历史、随机数、管道状态等能力。
