---
sidebar_position: 13
---

# Bash `trap` 命令详解

## 语法

```bash
trap [-lpP] [action] [sigspec ...]
```

---

## 核心概念

`trap` 用于在 shell 接收到指定信号或特殊事件时，执行预设的命令（action）。

### action 的三种形态

| action 值     | 行为                                  |
| ------------- | ------------------------------------- |
| 命令字符串    | 收到信号时执行该命令                  |
| `-`（或省略） | 将信号处置重置为 shell 启动时的默认值 |
| 空字符串 `""` | 忽略该信号（shell 及其子进程均忽略）  |

---

## 选项说明

| 选项   | 说明                                                                   |
| ------ | ---------------------------------------------------------------------- |
| `-l`   | 列出所有信号名称及对应编号                                             |
| `-p`   | 显示当前已设置的 trap 命令（可在子 shell 中查看父 shell 的 trap 状态） |
| `-P`   | 同 `-p`，但只显示指定 sigspec 的 action；至少需要一个 sigspec 参数     |
| 无参数 | 等同于 `-p`，打印所有已设置的 trap（输出可直接作为 shell 输入复用）    |

> `-p` / `-P` 可在子 shell（如命令替换）中使用，且在本 shell 改变信号处理之前调用时，反映的是父 shell 的 trap 状态。

---

## 特殊 sigspec

| sigspec      | 触发时机                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| `0` / `EXIT` | shell 退出时                                                                                           |
| `DEBUG`      | 每条简单命令、`for`/`case`/`select`/`((`/`[[`/算术 for 循环执行**前**，以及 shell 函数第一条命令执行前 |
| `RETURN`     | shell 函数或通过 `.`/`source` 执行的脚本**结束时**                                                     |
| `ERR`        | 管道、列表或复合命令返回非零状态时（受以下条件限制）                                                   |

### ERR trap 的豁免条件（以下情况**不触发** ERR trap）

- `until` / `while` 循环条件列表中的失败命令
- `if` / `elif` 后的测试命令
- `&&` / `||` 列表中（**最后一个** `&&`/`||` 之前）的命令
- 管道中**非最后**一条命令（受 `pipefail` 选项影响）
- 使用 `!` 取反返回状态的命令

> 这些豁免条件与 `set -e`（errexit）完全一致。

---

## 信号名称规则

- 大小写不敏感：`SIGINT` = `sigint` = `INT`
- `SIG` 前缀可选：`SIGTERM` = `TERM`

---

## 子 shell 行为

- 非交互式 shell：进入时已忽略的信号**无法**被 trap 或重置
- 交互式 shell：允许 trap 进入时已忽略的信号
- 创建子 shell 或子 shell 环境时，未被忽略的已设置 trap 会重置为原始值

---

## 实际使用场景

### 1. 清理临时文件（EXIT trap）

```bash
TMPFILE=$(mktemp)
trap "rm -f $TMPFILE" EXIT

# 脚本正常结束或被 kill 都会自动清理
echo "working..." > "$TMPFILE"
```

### 2. 捕获 Ctrl+C，优雅退出（INT trap）

```bash
trap "echo ''; echo '已中断，正在退出...'; exit 1" INT

while true; do
  echo "处理中..."
  sleep 1
done
```

### 3. 错误时自动报告行号（ERR trap）

```bash
set -e
trap 'echo "错误发生在第 $LINENO 行，退出码: $?"' ERR

cp /nonexistent/file /tmp/   # 触发 ERR trap
```

### 4. 调试追踪每条命令（DEBUG trap）

```bash
trap 'echo "[DEBUG] 第 $LINENO 行: $BASH_COMMAND"' DEBUG

x=1
y=$(( x + 1 ))
echo $y
```

预期输出：

```
[DEBUG] 第 5 行: x=1
[DEBUG] 第 6 行: y=$(( x + 1 ))
[DEBUG] 第 7 行: echo $y
2
```

> DEBUG trap 在每条命令**执行前**触发一次。`echo` 输出 `2` 后脚本退出，不会有第二次触发。

### 5. 函数执行后记录日志（RETURN trap）

RETURN trap 默认不被函数继承，需要 `set -T`（functrace）才能在函数返回时触发。

**方式一：`set -T` 让函数继承 trap（推荐）**

```bash
set -T
trap 'echo "函数返回，退出码: $?"' RETURN

my_func() {
  echo "执行中..."
  return 0
}
my_func
```

**方式二：trap 写在函数内部**

```bash
my_func() {
  trap 'echo "函数返回，退出码: $?"' RETURN
  echo "执行中..."
  return 0
}
my_func
```

**方式三：`source` 执行脚本**（脚本本身视为函数，退出时触发）

```bash
source trap_return.sh
```

预期输出：

```
执行中...
函数返回，退出码: 0
```

> RETURN trap 的设计初衷是配合 `source`/`.` 使用；用于普通函数时需要 `set -T`。

### 6. 保存并恢复信号处置（-p 选项）

**使用场景**：在库函数或插件中临时修改信号处理，执行完毕后恢复调用方原有的 trap，避免覆盖调用方的逻辑。

```bash
#!/bin/bash

# 调用方预先设置了自己的 trap
trap 'echo "调用方: 收到 INT，执行清理"' INT

# --- 进入库函数 ---
lib_func() {
  # 1. 保存调用方的 trap 状态
  local saved_traps
  saved_traps=$(trap -p INT TERM)

  # 2. 设置库函数自己的临时 trap
  trap 'echo "lib_func: 临时拦截，忽略信号"' INT TERM

  echo "lib_func 执行中..."
  sleep 2   # 模拟耗时操作（此时按 Ctrl+C 触发的是临时 trap）

  # 3. 恢复调用方原有状态
  eval "$saved_traps"
  echo "lib_func 完成，已恢复调用方 trap"
}

lib_func

# 此后 Ctrl+C 再次触发调用方的原始 trap
echo "主流程继续..."
sleep 5
```

**`trap -p` 的输出格式**（可直接作为 shell 输入复用）：

```bash
$ trap 'echo hello' INT
$ trap -p INT
trap -- 'echo hello' INT   # 这行本身就是合法的 trap 命令
```

**注意**：若调用方从未设置过该信号的 trap，`trap -p` 输出为空，`eval` 空字符串无副作用，行为正确。

---

### 7. 忽略 HUP 信号（后台任务防中断）

**背景**：终端关闭或 SSH 断连时，系统向前台进程组发送 `SIGHUP`，默认行为是终止进程。后台任务如果未做处理，会随终端退出而中断。

**方式一：`trap "" HUP`（在脚本内忽略）**

```bash
#!/bin/bash

trap "" HUP    # 忽略 SIGHUP，终端关闭后脚本继续运行

echo "开始长时间任务，PID=$$"
for i in $(seq 1 100); do
  echo "$(date): 步骤 $i" >> /tmp/task.log
  sleep 10
done
echo "任务完成"
```

运行方式：

```bash
bash long_task.sh &   # 后台运行，关闭终端后不受影响
```

**方式二：`nohup`（外部命令，等效方案）**

```bash
nohup bash long_task.sh &
# 输出自动重定向到 nohup.out
```

`nohup` 本质上就是在执行前将 HUP 设为忽略，等价于 `trap "" HUP`。

**方式三：SSH 断连场景（结合重定向）**

```bash
#!/bin/bash

trap "" HUP

# 必须重定向 stdout/stderr，否则终端关闭后写入会报 SIGPIPE
exec >> /tmp/task.log 2>&1

echo "任务开始: $(date)"
sleep 300
echo "任务结束: $(date)"
```

> 仅 `trap "" HUP` 不够——终端关闭后，向已关闭的 tty 写入会触发 `SIGPIPE` 导致退出，务必同时将输出重定向到文件。

### 8. 重置信号为默认行为

```bash
trap - SIGTERM   # 恢复 SIGTERM 默认行为（终止进程）
```

---

## 返回值

| 返回码 | 含义                 |
| ------ | -------------------- |
| `0`    | 成功                 |
| 非零   | sigspec 不是有效信号 |

---

## 速查表

```bash
trap -l                      # 列出所有信号
trap -p                      # 查看当前所有 trap
trap -p INT                  # 查看 INT 信号的 trap
trap 'cleanup' EXIT          # 退出时执行 cleanup
trap '' SIGPIPE              # 忽略 SIGPIPE
trap - INT                   # 重置 INT 为默认行为
```
