---
title: Bash `{varname}` 文件描述符重定向详解
date: 2026-04-24
authors: [pemako]
---

# Bash `{varname}` 文件描述符重定向详解

## 背景：传统文件描述符重定向

### FD 基础：标准三路

每个进程启动时默认持有三个文件描述符：

| FD 编号 | 名称 | 默认指向 |
|---------|------|----------|
| 0 | stdin | 终端输入 |
| 1 | stdout | 终端输出 |
| 2 | stderr | 终端输出 |

<!--truncate-->

---

### 典型用法：`ls > dirlist 2>&1`

```bash
ls > dirlist 2>&1
#   ─────────  ────
#       ①        ②
```

这条命令把 `ls` 的 stdout 和 stderr **都**写入文件 `dirlist`，终端看不到任何输出。

#### 重定向从左到右依次执行

**初始状态：**
```
FD 1 ──► 终端
FD 2 ──► 终端
```

**第 1 步**，处理 `> dirlist`（即 `1>dirlist`）：
```
FD 1 ──► dirlist 文件
FD 2 ──► 终端           ← 还没动
```

**第 2 步**，处理 `2>&1`（把 FD 2 复制为 FD 1 的**当前值**）：
```
FD 1 ──► dirlist 文件
FD 2 ──► dirlist 文件   ← 指向同一文件
```

> `2>&1` 的语义是**拍快照**，不是建链接——复制的是"此刻 FD 1 指向哪里"，
> 之后 FD 1 再变化，FD 2 不跟着变。

#### 经典陷阱：顺序写反

```bash
ls 2>&1 > dirlist    # ⚠ 意图相同，结果不同
```

**第 1 步**，处理 `2>&1`（此时 FD 1 还指向终端）：
```
FD 1 ──► 终端
FD 2 ──► 终端   ← 复制的是终端，不是文件
```

**第 2 步**，处理 `> dirlist`：
```
FD 1 ──► dirlist 文件
FD 2 ──► 终端           ← 已固定，不跟着变
```

**结果**：stdout 进文件，**stderr 仍然打印到终端**。

#### 现代等价写法（bash 4+）

```bash
ls &> dirlist     # 等价，更简洁
ls >& dirlist     # 同上
```

这两种写法由 bash 保证"两路同时重定向"，不存在顺序问题。

---

### 硬编码 FD 的局限

在 bash 中，重定向操作符前可以加一个 FD 编号：

```bash
# 明确指定 FD 3 写文件
exec 3>output.txt
echo "hello" >&3
exec 3>&-    # 关闭 FD 3
```

这种方式的问题：
- **FD 编号硬编码**：你得自己选 3、4、5……，容易与子进程或系统已用的 FD 冲突
- **可读性差**：`>&5` 不知道这个 5 代表什么
- **必须用 exec**：开文件、持久化 FD 必须靠 `exec`

---

## `{varname}` 语法

Bash 4.1 引入了一种新写法，把 FD 编号替换成 `{变量名}`：

```
{varname}>file
{varname}<file
{varname}>>file
{varname}<>file
{varname}>&-      # 关闭（用 $varname 存储的 FD 编号）
{varname}<&-      # 关闭（输入侧）
```

### 核心行为

| 情况 | 行为 |
|------|------|
| `{var}>file`（非关闭类操作符） | bash 自动分配一个 **≥ 10** 的空闲 FD，并将其编号写入变量 `var` |
| `{var}>&-` 或 `{var}<&-` | 关闭 `$var` 所存编号对应的 FD |
| FD 生命周期 | **持久到当前 shell**，不随命令结束而关闭 |

关键一句话来自手册：
> *If `{varname}` is supplied, the redirection persists beyond the scope of the command.*

也就是说：`cmd {fd}>file` 执行结束后，`$fd` 仍有效，文件仍然打开。

---

## `varredir_close` shopt 选项

```bash
shopt -s varredir_close   # 开启：命令结束后自动关闭 {var} 分配的 FD
shopt -u varredir_close   # 关闭（默认）：FD 持久，需手动关闭
```

默认是 **关闭**，即手动管理 FD 生命周期。
开启后行为更接近普通重定向（命令结束 FD 随之关闭）。

---

## 实际使用示例

### 示例 1：最简单的用法——打开文件、写入、关闭

```bash
#!/usr/bin/env bash
set -e

# 打开文件，bash 自动分配 FD，编号存入 $logfd
exec {logfd}>my.log

echo "第一行日志" >&$logfd
echo "第二行日志" >&$logfd

# 关闭——注意不能写 exec {logfd}>&-，而是
exec {logfd}>&-

cat my.log
```

输出：
```
第一行日志
第二行日志
```

---

### 示例 2：无需 exec 也能持久化（命令级重定向）

```bash
# 不用 exec，直接在命令上打开，FD 依然持久
echo "initialize" {fd}>data.txt   # fd 被赋值，FD 保持打开

echo "second line" >&$fd          # 继续写同一文件
echo "third line"  >&$fd

exec {fd}>&-                       # 手动关闭
cat data.txt
```

---

### 示例 3：读文件

```bash
exec {inp}<words.txt

while IFS= read -r -u "$inp" line; do
    echo "读到: $line"
done

exec {inp}<&-
```

---

### 示例 4：同时管理多个日志文件（避免 FD 编号冲突）

```bash
#!/usr/bin/env bash

exec {stdout_log}>stdout.log
exec {stderr_log}>stderr.log

run_task() {
    local name=$1
    echo "[INFO]  Task $name started"  >&$stdout_log
    echo "[ERROR] Task $name failed"   >&$stderr_log
}

run_task "alpha"
run_task "beta"

exec {stdout_log}>&-
exec {stderr_log}>&-

echo "=== stdout.log ===" && cat stdout.log
echo "=== stderr.log ===" && cat stderr.log
```

---

### 示例 5：双向通信（process substitution + {varname}）

```bash
#!/usr/bin/env bash

# 用命名管道实现与子进程双向通信
mkfifo /tmp/to_child /tmp/from_child

exec {to_child}>/tmp/to_child
exec {from_child}</tmp/from_child

# 子进程：从管道读命令，写回结果
( while IFS= read -r -u 0 cmd; do
      echo "processed: $cmd"
  done < /tmp/to_child > /tmp/from_child ) &

# 父进程发送数据
echo "hello" >&$to_child
echo "world" >&$to_child

exec {to_child}>&-     # 关闭写端，让子进程 EOF 退出

# 父进程读回结果
while IFS= read -r -u "$from_child" reply; do
    echo "reply: $reply"
done

exec {from_child}<&-
wait
rm /tmp/to_child /tmp/from_child
```

---

### 示例 6：利用 varredir_close 自动关闭（作用域内临时 FD）

```bash
shopt -s varredir_close

# 只在这条命令期间打开 FD，命令结束自动关闭
awk '{print NR, $0}' {tmpfd}<source.txt   # 命令结束后 $tmpfd 对应的 FD 自动关闭

echo "FD 编号是 $tmpfd，但已被自动关闭"
```

---

### 示例 7：将 stderr 重定向到同一个日志文件

```bash
exec {log}>app.log

# 把 stderr 也指向同一 FD
exec 2>&$log

echo "这是 stdout，会进 app.log"
echo "这是 stderr" >&2    # 同样进 app.log

exec {log}>&-
exec 2>&1    # 恢复 stderr
```

---

## 对比总结

| 特性 | 传统 `3>file` | `{varname}>file` |
|------|--------------|-----------------|
| FD 编号 | 手动指定，可能冲突 | bash 自动分配 ≥10，不冲突 |
| 代码可读性 | 裸数字，难以理解 | 有语义的变量名 |
| 打开方式 | 必须用 `exec` 持久化 | 命令级即可持久化 |
| 关闭方式 | `exec 3>&-` | `exec {var}>&-` |
| 生命周期控制 | 依赖作用域 | 精确手动控制 |
| 自动关闭 | 不支持 | 可用 `varredir_close` 开启 |

---

## 注意事项

1. **bash 版本**：`{varname}` 语法需要 **bash 4.1+**（macOS 默认 bash 3.2 不支持，需安装 brew 版 bash 5.x）
2. **关闭语法**：关闭时写 `exec {var}>&-`，bash 会读取 `$var` 的值来确定要关闭哪个 FD
3. **不要用 `echo {var}>&-`**：只有 `exec` 或独立重定向才能真正关闭 FD；在普通命令上 `{var}>&-` 只是关闭那条命令的副本
4. **泄漏风险**：若关闭前脚本报错退出，FD 会泄漏——可结合 `trap` 清理：
   ```bash
   exec {fd}>file.log
   trap 'exec {fd}>&-' EXIT
   ```
