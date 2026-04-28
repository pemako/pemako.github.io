---
sidebar_position: 4
---

# Bash vs Bourne Shell（Appendix B 差异汇总）

> 参考：https://www.gnu.org/software/bash/manual/bash.html#Major-Differences-From-The-Bourne-Shell
> 基准：SVR4.2 的历史 sh。

## 1. 规范与定位

- **POSIX 兼容**：冲突时以 POSIX 为准，而非传统 sh。
- 支持多字符启动选项（如 `--noediting`、`--dump-strings`）；SVR4.2 sh 只支持 `-xv` 一类单字符。
- Restricted mode（`rbash`）更完善。

## 2. 交互体验（sh 完全没有）

- **行编辑**（Readline）+ `bind` 内建
- **可编程补全**：`complete` / `compgen` / `compopt`
- **命令历史**：`history` / `fc`、`HISTTIMEFORMAT`、csh 式 `!` 展开
- 提示符 `PS0 / PS1 / PS2 / PS4` 支持反斜杠转义
- `PROMPT_COMMAND` 支持数组形式

## 3. 引用与展开

- `$'…'`（ANSI-C 转义）、`$"…"`（locale 翻译，`-D/--dump-strings` 抽取）
- **brace expansion** `{a,b}`、**tilde expansion** `~user`
- POSIX `$(…)` 命令替换（仍兼容反引号）
- `${ cmd;}` / `${|cmd;}` 在**当前 shell** 执行的命令替换
- **process substitution** `<(…)` / `>(…)`
- `alias` / `unalias`

## 4. 参数展开（巨大扩展）

- `${num}` 支持 `$10` 以上
- `+=` 追加赋值
- 模式移除：`${v#p}` `${v##p}` `${v%p}` `${v%%p}`
- 长度 `${#x}`、子串 `${x:off:len}`、替换 `${x/pat/rep}`（支持 `//` `#` `%`）
- 间接 `${!var}` 与 **nameref**（`declare -n`）
- 名字枚举 `${!prefix*}` / `${!prefix@}`
- **变换** `${var@X}`（`Q/E/P/A/K/a/U/L/u` 等）

## 5. 控制结构 & 表达式

- `!` 取反管道；`set -o pipefail`
- `time` 关键字 + `TIMEFORMAT`
- `coproc` 协程
- C 风格 `for ((…;…;…))`；`select` 菜单
- `[[ … ]]` 条件命令（含 regex `=~`，可 `shopt -s nocasematch`）
- `case` 支持 `;&`（贯穿）和 `;;&`（继续匹配下一条）
- `((…))` 算术命令、`let`、`$((…))`
- **一维数组**（索引/关联），多个内建支持数组参数

## 6. 变量行为

- 初始环境变量**自动导出**到子进程（sh 需显式 `export`）
- 预置变量：
  - 身份：`UID/EUID/GROUPS`
  - 主机/平台：`HOSTTYPE/OSTYPE/MACHTYPE/HOSTNAME`
  - Bash 自身：`BASH/BASH_VERSION/BASH_VERSINFO`
  - 随机/时间：`RANDOM/SRANDOM/EPOCHSECONDS/EPOCHREALTIME`
  - 进程/追踪：`BASHPID/BASH_XTRACEFD`
  - 过滤：`GLOBIGNORE/HISTIGNORE/GLOBSORT`
- **`IFS` 只切割展开结果**（修复 sh 的安全漏洞）
- 命令前变量赋值**只作用于该命令**（builtin/函数同样如此）

## 7. 文件名展开

- bracket 否定支持 `!` 和 `^`（sh 仅 `!`）
- 支持 POSIX 字符类 `[:alpha:]`、等价类、collating symbols
- `shopt -s extglob` 扩展模式：`?(…)` `*(…)` `+(…)` `@(…)` `!(…)`
- `shopt -s globstar` 递归 `**`

## 8. 重定向

- `<>` 读写、`&>` 合并 stdout+stderr、`<<<` here-string
- `[n]<&w` / `[n]>&w` 移动 fd
- `{var}<word` 让 shell 自动分配 fd 并存入变量
- 对重定向目标做文件名展开
- 特殊文件名：`/dev/fd/N`、`/dev/stdin|stdout|stderr`、`/dev/tcp/host/port`、`/dev/udp/host/port`
- `noclobber` 防覆盖 + `>|` 强制覆盖

## 9. 函数

- 函数可有 **`local`** 变量，支持递归
- 函数与变量**命名空间分离**
- `export -f` 导出给子进程
- 函数可覆盖同名内建；用 `builtin` / `command` 绕过

## 10. 调试支持

- 变量：`BASH_ARGC` / `BASH_ARGV` / `BASH_LINENO` / `BASH_SOURCE`
- 伪信号：`DEBUG`、`RETURN`、`ERR`（需 `functrace` / `errtrace` 传到函数）
- `declare -F`、`caller`、`extdebug`

## 11. 目录栈

- `pushd` / `popd` / `dirs`、`DIRSTACK` 变量
- `cd` / `pwd` 的 `-L` / `-P`（逻辑/物理路径）

## 12. 内建命令增强（对照表）

| 内建 | Bash 的增强 |
|------|-------------|
| `declare` | 统一管理变量/函数属性（`-i/-a/-A/-r/-x/-n/-l/-u`） |
| `disown` | 移出 job 表；`-h` 防 SIGHUP |
| `enable` | 启禁内建、动态加载 `.so` |
| `exec` | 控制环境、改 argv0（`-c/-l/-a`） |
| `export/readonly` | `-f` 作用于函数；`-p` 可重用输出；`-n` 去属性 |
| `hash` | `-p` 手工绑定路径 |
| `help` | 内建帮助 |
| `mapfile` / `readarray` | 读文件到数组 |
| `printf` | 额外格式符、`-v` 赋值到变量 |
| `read` | `-r/-p/-e/-i/-s/-t/-n/-d`，默认写 `REPLY` |
| `return` | 可中止被 source 的脚本 |
| `set` | 大量 `-o`；`-x` 追踪复合命令 |
| `shopt` | 细粒度可选开关，启动时也能设 |
| `test` | POSIX 按参数数量裁决 |
| `trap` | `DEBUG/RETURN/ERR` 伪信号 |
| `type` | 更详尽的查找信息 |
| `ulimit` | 更多资源维度 |
| `umask` | `-p` 可重用输出 |
| `wait` | `-n` 等任一、`-p var` 记录退出 pid |

## 13. 不支持的 SVR4.2 特性

- 无 `stop` / `newgrp` 内建
- 无 `SHACCT` 变量 / shell accounting
- 无 `mldmode` / `priv`
- 不像 SVR4.2 以 `jsh` 启动自动开 job control
- Bash 用 `TMOUT` 对应 SVR4.2 的 `TIMEOUT`

## B.1 实现层差异

- **不为重定向 `if` / `while` 等结构 fork 子 shell**。
- **不容忍引号不闭合**（sh 会静默补一个，埋藏难查 bug）。
- 不靠 trap `SIGSEGV` 管内存；从 block 了 `SIGSEGV` 的进程启动也不崩。
- 不会在 UID < 100 时擅自改 real/effective UID/GID。
- 允许用户 trap `SIGSEGV` / `SIGALRM` / `SIGCHLD`。
- `IFS` / `MAILCHECK` / `PATH` / `PS1` / `PS2` 都可 unset。
- 不把 `^` 当 `|`（sh 遗留）。
- 启动选项可分多次 `-x -v`；sh 必须合成 `-xv`，有些版本遇到第二个 `-` 还会 coredump。
- **只在 POSIX 特殊 builtin 失败时退出脚本**（sh 任何 builtin 失败都退）。
- `shopt -s lastpipe` + 无 job control 时，管道最后一段在**当前 shell** 执行（可让管道里的赋值生效）。

## 一句话概括

Bash = POSIX sh 超集 + csh 历史展开 + ksh 扩展（数组、`[[`、`((`、函数作用域）+ 交互体验（Readline、补全、提示符、目录栈）+ 调试钩子 + 现代重定向 / 网络 + 更安全的解析与信号处理。
