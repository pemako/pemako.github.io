---
sidebar_position: 21
---

# Bash 融会贯通：巩固方法与推荐阅读

> 通读 GNU Bash Manual 之后，把离散知识点串成肌肉记忆的路线图。按投入产出比排序。

## 一、巩固方法

### 1. 写 — 而且用严苛工具兜底

- **`shellcheck`** 每次保存都跑；它会把你没背过的坑逐条指出（`SC2086` 引号、`SC2155` 局部赋值丢退出码、`SC2046` 未引用展开…）
- **`shfmt`** 固化风格，免得把精力耗在空格缩进上
- **`bats-core`** 给脚本写测试——能写出测试的脚本，说明你真的懂参数展开、重定向、退出码的边界
- 模板化错误处理：

  ```bash
  set -euo pipefail
  shopt -s inherit_errexit
  trap 'echo "ERR at $BASH_SOURCE:$LINENO" >&2' ERR
  ```

  强迫自己把 `ERR trap` / `errtrace` / `BASH_SOURCE` / `BASH_LINENO` 这些调试设施用起来。

### 2. 小项目驱动刻意练习

每个特性都找一个"非它不可"的场景刻意练一次：

- **`coproc`** → 写脚本与外部交互式程序（sqlite、gdb、ssh）来回对话
- **`mapfile` + 关联数组** → 实现词频统计 / 去重保序
- **`trap DEBUG` + `PS4`** → 手写 profiler：统计每条语句耗时
- **进程替换 `<()` / `>()`** → 三路 diff、把两个流同时喂给 `paste`
- **`/dev/tcp/…`** → 纯 bash 的 HTTP GET、端口扫描、迷你聊天
- **`exec {fd}<>file`** → 用 fd 维护"有状态"的读写指针
- **可编程补全** → 给自己常用的一个脚本写 `complete -F`

### 3. 读优质文档（比再读一遍 manual 更重要）

- **Greg's Wiki** — mywiki.wooledge.org
  - `BashPitfalls`（~100 条，每条都值得）
  - `BashFAQ`、`BashGuide`
- **`man bash` 的本地 `/pattern` 跳读习惯** —— 胜过再读一遍全本
- **POSIX 规范的 `sh` 章节** —— 帮你清晰区分"bash 独有" vs "可移植"

## 二、推荐阅读的源码（按收益 × 可读性）

### ★ 首选：结构清晰、读完收益高

- [**`bats-core`**](https://github.com/bats-core/bats-core)（github.com/bats-core/bats-core）
  纯 bash 写的测试框架。看它怎么做子进程隔离、怎么捕获 stderr、怎么用 `trap` 实现断言栈回溯。
- [**`bash-completion`**](https://github.com/scop/bash-completion)（github.com/scop/bash-completion）
  生产级 compspec 大全。`completions/` 目录一个文件读一个工具；`_init_completion`、`_filedir`、`_command` 是补全教材级助手。
- [**`rupa/z`**](https://github.com/rupa/z)（`z.sh`，单文件）
  一个文件写完 "frecency" 目录跳转。学：如何在 `PROMPT_COMMAND` 里低开销记录、关联数组替代临时文件、`awk` 与 bash 的分工边界。

### ★★ 进阶：老手如何处理可移植性与边界

- [**`nvm`**](https://github.com/nvm-sh/nvm)（github.com/nvm-sh/nvm）
  一份脚本兼容 bash/zsh/ksh/dash；重度使用 `printf` + 参数展开替代外部命令，谨慎的 subshell 控制。可移植 shell 脚本的天花板。
- [**`pyenv`**](https://github.com/pyenv/pyenv) [**`rbenv`**](https://github.com/rbenv/rbenv)（github.com/pyenv/pyenv）
  大量小型命令拼成子命令系统（`pyenv-exec`、`pyenv-which`）——"bash 当框架用"的优秀样本。
- **`direnv` 的 stdlib**（github.com/direnv/direnv 的 `stdlib.sh`）
  设计精良的 bash 函数库；函数命名、错误处理、幂等性都很讲究。

### ★★★ 重磅：见识 bash 的极限

- **`bash-it` / `oh-my-bash`** — 不是读插件，是读它们的 **loader**：启动时怎么惰性加载、怎么做 enable/disable、怎么管 PATH 与 hook
- **`fzf` 的 shell 集成**（`shell/key-bindings.bash`、`completion.bash`）
  教科书级的 readline 绑定 + 补全替换。短但精悍
- **Git 自带的 shell 脚本**（`contrib/completion/git-completion.bash`、`git-sh-prompt`）
  全球被执行最多次的补全脚本之一，细节经得起推敲

### 反面教材 / 对比

- **`modernish`**（github.com/modernish/modernish）—— 严格 POSIX。读它能让你清楚意识到 bash 给了你多少便利
- **`bashly`**（github.com/DannyBen/bashly）—— 把 YAML 编译成 bash CLI；看生成出的代码很能训练你对参数解析、子命令派发的理解

## 三、4 周学习路径

### Week 1 — 打扫卫生 & 固化工具链

- `shellcheck` / `shfmt` 跑遍你过去所有脚本，把所有 warning 修掉
- 把模板 `set -euo pipefail` + `ERR trap` + `usage()` + `parse_args()` 固化成 `skeleton.sh`
- 配置 `~/.inputrc` 和 `HIST*` 系列到你喜欢的状态

### Week 2 — 读小项目 + 写自己的 lib.sh

- 精读 `z.sh` 和 `direnv/stdlib.sh`
- 仿写一份属于自己的 `lib.sh`，最少包含：
  - `log_info` / `log_warn` / `log_err`
  - `die`（打印后以非零退出）
  - `require`（命令存在性检查）
  - `with_tempdir`（trap 清理的临时目录）
  - `retry` / `timeout_cmd`

### Week 3 — 吃透补全

- 精读 `bash-completion/completions/` 里 5 个你常用命令的补全源码
- 给你自己写的一个工具写一份 `complete -F`，覆盖：
  - 子命令补全
  - 依上下文（`prev`）切换候选
  - `compopt -o nospace` 与 `return 124` 懒加载

### Week 4 — 测试驱动收尾

- 用 `bats-core` 给 Week 2 的 `lib.sh` 写 30 条测试
- 读 `bats-core` 源码（特别是 `libexec/bats-core/` 下几个核心脚本）作为收尾
- 把本周学到的补回 `lib.sh` / `skeleton.sh`

## 四、长期运营

- 每次遇到 `$(...)` 前先问："能不能用参数展开替？" 久了形成 fork-少、性能好的直觉
- 所有脚本都写好 `--help`；养成参数解析规范化的习惯
- 每半年回看一次自己半年前写的脚本——你会亲眼看到自己的进步
