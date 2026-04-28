---
sidebar_position: 1
slug: /shell
---

# Shell 学习笔记索引

GNU Bash Manual 通读后的整理笔记，按主题分类；每条均可独立阅读。

## 一、总览 / 规范

- [posix-and-shells.md](posix-and-shells.md) — POSIX 是什么，sh / dash / bash / zsh / ksh 的关系与取舍
- [features.md](features.md) — Bash 独有特性全景（数组、`[[`、`((`、进程替换、coproc…）
- [vs-bourne.md](vs-bourne.md) — 对照 SVR4.2 sh 的完整差异清单（Appendix B）
- [shell-variables.md](shell-variables.md) — Bourne Shell Variables vs Bash Variables 的分层与区别

## 二、参数、变量、展开

- [parameter-expansion.md](parameter-expansion.md) — `${…}` 全套展开：模式移除、子串、替换、间接、变换 `@X`
- [declare.md](declare.md) — 属性与作用域：`-i/-a/-A/-r/-x/-n/-l/-u` 与 `local`/`readonly`
- [read.md](read.md) — `read` 的 `-r/-p/-e/-i/-s/-t/-n/-d`，默认 `REPLY`

## 三、重定向与文件描述符

- [fd-varname.md](fd-varname.md) — `{var}<file` 自动分配 fd 的机制、生命周期与实战

## 四、进程、作业、协程

- [job-control.md](job-control.md) — `jobs/fg/bg/wait/disown`、jobspec、`set -m`、`auto_resume`
- [coproc.md](coproc.md) — `coproc` 协程：fd 对、异步交互模式、与 `exec {fd}` 的配合

## 五、启动、执行、行为开关

- [exec.md](exec.md) — `exec` 替换进程镜像 / 仅重定向 / 改 argv0 的三种用法
- [set.md](set.md) — `set` 系列开关：`-e -u -o pipefail -x` 等
- [shopt.md](shopt.md) — `shopt` 细粒度选项：`globstar/extglob/nullglob/inherit_errexit` 等

## 六、陷阱与调试

- [trap.md](trap.md) — 信号与伪信号：`EXIT/ERR/DEBUG/RETURN`、`functrace/errtrace`
- [caller.md](caller.md) — `caller` 打印调用栈，配合 `BASH_SOURCE/BASH_LINENO`

## 七、内建命令综合

- [builtin.md](builtin.md) — `builtin` / `command` 绕过函数覆盖；内建查找优先级
- [bind.md](bind.md) — Readline 绑定查看与修改

## 八、交互体验

- [readline.md](readline.md) — 行编辑 + `~/.inputrc` + 可编程补全（`complete/compgen/compopt`）
- [history.md](history.md) — `HIST*` 变量、`history/fc`、history expansion

---

## 建议的阅读顺序

1. **打地基**：`posix-and-shells` → `features` → `vs-bourne`
2. **变量与展开**：`shell-variables` → `parameter-expansion` → `declare`
3. **输入输出**：`read` → `fd-varname` → `exec`
4. **控制流与错误处理**：`set` → `shopt` → `trap` → `caller`
5. **进程模型**：`job-control` → `coproc`
6. **交互层**（可选）：`readline` → `history` → `bind`
7. **内建参考**：`builtin` 按需查阅

## 下一步巩固

详见 [practice-guide.md](practice-guide.md)：巩固方法、推荐源码、4 周学习路径。

- 每个脚本 `shellcheck` + `shfmt` 常驻
- 用 `bats-core` 给自己写的函数库加测试
- 精读源码：`rupa/z` → `direnv/stdlib.sh` → `bash-completion/completions/` → `fzf` 的 shell 集成
- 读 Greg's Wiki：**BashPitfalls** / BashFAQ / BashGuide（mywiki.wooledge.org）
