---
sidebar_position: 15
---

# Bash Job Control（作业控制）

> 参考：https://www.gnu.org/software/bash/manual/bash.html#Job-Control-1

## 一、概念总结

### 1. 什么是 Job

Shell 每执行一条 **pipeline**，就创建一个 **进程组（process group）**，该进程组即一个 **job**。Shell 在内部维护一张 jobs 表，可通过 `jobs` 查看。

### 2. 三种状态

- **foreground（前台）**：占用终端，shell 等待其结束。
- **background（后台）**：命令末尾加 `&`，立即返回提示符。
- **stopped/suspended（挂起）**：`Ctrl-Z` 发 `SIGTSTP` 挂起；`Ctrl-C` 发 `SIGINT`；`Ctrl-\` 发 `SIGQUIT`。

### 3. 启用条件

交互式 shell 默认开启 monitor 模式；脚本中需显式 `set -m`。

### 4. Jobspec（作业标识）

| 形式 | 含义 |
|------|------|
| `%n` | 编号 n 的作业 |
| `%%` / `%+` | current job（最近挂起或放后台的） |
| `%-` | previous job |
| `%string` | 以 string 开头的命令 |
| `%?string` | 包含 string 的命令 |

`jobs` 输出中 `+` 标记 current、`-` 标记 previous；`$!` 是最近一个后台作业的 PID。

### 5. Builtins 一览

- `jobs [-lnprs]` / `jobs -x cmd`：列出作业；`-l` 带 PID，`-p` 仅 PID，`-n` 变化过的，`-r` 运行中，`-s` 已停止，`-x` 把 jobspec 展开为 PID。
- `fg [jobspec]`：调到前台。
- `bg [jobspec …]`：在后台继续运行（等价于 `SIGCONT`）。
- `kill [-sigspec] pid|jobspec …` / `kill -l`：发信号 / 列信号名。
- `wait [-fn] [-p var] [id …]`：等待作业结束，返回其退出码。
- `disown [-ar] [-h] [jobspec …]`：移出 jobs 表；`-h` 标记为 shell 退出时不发 `SIGHUP`。
- `suspend [-f]`：挂起当前 shell。

### 6. 变量

- **`auto_resume`**：只输入命令名即可恢复已停止作业。
  - `exact`：完全匹配
  - `substring`：子串匹配
  - 其他值：前缀匹配
  - unset：关闭

---

## 二、实际应用中的典型用法

### 1. 临时把前台任务丢到后台继续

  正在运行的命令想挪走但不想杀：

  ```bash
  $ make build           # 跑了一半发现时间长
  # Ctrl-Z                 挂起
  $ bg                   # 放到后台继续
  $ disown -h %1         # 可选：退出终端时不被 SIGHUP 杀掉
  ```

### 2. 启动长任务并稍后回收结果

  ```bash
  $ long_job > out.log 2>&1 &
  [1] 23456
  $ echo $!              # 23456，记录 PID
  $ wait %1              # 需要结果时再阻塞等待
  $ echo $?              # 拿到 long_job 的退出码
  ```

### 3. 并行启动多个任务，等全部完成

  ```bash
  $ for host in h1 h2 h3; do
      ssh "$host" 'backup.sh' &
    done
  $ wait                 # 等所有后台任务
  $ echo "all done"
  ```

  只想等任意一个先结束：`wait -n`。

### 4. 多任务切换（编辑器 + 编译 + 调试）

  ```bash
  $ vim src/main.c       # Ctrl-Z 挂起
  $ make && ./a.out      # 编译运行
  # Ctrl-Z                 挂起 a.out
  $ fg %vim              # 按前缀名切回 vim
  $ fg %-                # 或切回上一个作业
  ```

### 5. 关掉终端仍让任务活着

  三种方式选一：

  ```bash
  $ nohup ./server &             # 启动时就 nohup
  $ ./server & disown -h %1      # 已启动则 disown -h
  $ setsid ./server              # 新会话，彻底脱离
  ```

  更稳妥：用 `tmux` / `screen` 会话。

### 6. 批量杀掉某类作业

  ```bash
  $ jobs -p | xargs -r kill         # 杀全部作业
  $ kill %?node                     # 杀命令中含 "node" 的作业
  $ kill -STOP %1 ; kill -CONT %1   # 手动暂停 / 恢复
  ```

### 7. 脚本里启用作业控制

  非交互脚本默认 monitor 关闭，`%1` 这类 jobspec 不可用：

  ```bash
  #!/usr/bin/env bash
  set -m                 # 开启 monitor
  worker &
  trap 'kill %1' EXIT    # 脚本退出时确保清理后台 worker
  main_task
  ```

### 8. 只等某些子进程 + 拿到是谁结束的

  bash 5.1+ 可用 `wait -p`：

  ```bash
  $ job1 & job2 & job3 &
  $ wait -n -p finished_pid
  $ echo "pid $finished_pid exited with $?"
  ```

### 9. auto_resume 快速恢复

  ```bash
  $ auto_resume=substring
  $ vim notes.txt        # Ctrl-Z
  $ less big.log         # Ctrl-Z
  $ notes                # 直接输入子串，恢复 vim
  ```

### 10. 常见陷阱

- **管道里的 `Ctrl-Z`**：挂起的是整条 pipeline，`jobs` 只显示一个作业。
- **`&` 后紧跟 `wait`**：`wait` 不带参数会等所有后台作业，想等单个务必指定 `%n` 或 PID。
- **`disown` vs `nohup`**：`disown` 只改 shell 内部表，`nohup` 还重定向输出并忽略 `SIGHUP`；想"关终端不死"优先 `nohup` 或 `disown -h`。
- **子 shell 中的 `&`**：`(cmd &)` 把作业放到子 shell，父 shell 的 `jobs` 看不到它。
- **SSH 非交互执行**：`ssh host 'cmd &'` 的 `&` 可能因为 ssh 仍在等 stdout/stderr 而不返回；加 `</dev/null >/dev/null 2>&1` 或用 `nohup`。
