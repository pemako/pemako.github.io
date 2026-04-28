---
sidebar_position: 10
---

# Bash `exec` 命令详解

## 语法

```bash
exec [-cl] [-a name] [command [arguments]]
```

---

## 核心概念

`exec` 有两种完全不同的用途：

| 用途 | 条件 | 行为 |
|------|------|------|
| **替换进程** | 提供 command | 用 command 替换当前 shell 进程，不创建子进程 |
| **重定向当前 shell** | 不提供 command | 对当前 shell 的文件描述符进行永久重定向 |

---

## 选项说明

| 选项 | 说明 |
|------|------|
| `-l` | 在传给 command 的第零个参数（`$0`）前加 `-`，模拟 login shell 行为 |
| `-c` | 以**空环境**执行 command（不继承当前 shell 的环境变量） |
| `-a name` | 将 `name` 作为第零个参数传给 command（覆盖默认的程序名） |

---

## 关键行为

### 替换进程（有 command）

- 当前 shell **不创建子进程**，直接被 command 替换
- 替换后原 shell 进程消失，PID 不变
- command **不能是 shell 内建命令或函数**
- command 执行失败时：
  - 非交互式 shell：直接退出（除非启用 `execfail` 选项）
  - 交互式 shell：返回非零状态，shell 继续存在
  - 子 shell：无条件退出

### 仅重定向（无 command）

- 对**当前 shell 环境**的文件描述符进行永久操作
- 无重定向错误时返回 0，否则返回非零

---

## 实际使用场景

### 1. 脚本末尾替换为目标程序（进程替换）

**场景**：包装脚本做完初始化后，将控制权完全移交给目标程序，节省一个进程。

```bash
#!/bin/bash
# wrapper.sh

# 做一些初始化
export APP_ENV=production
export CONFIG_PATH=/etc/app/config.yaml
ulimit -n 65536

echo "初始化完成，移交控制权..."

# 替换当前 shell，PID 保持不变
exec /usr/bin/app --config "$CONFIG_PATH"

# 以下代码永远不会执行
echo "这行不会被执行"
```

对比不用 `exec`：
```bash
# 不用 exec：shell 进程还在，等待 app 退出，多一层进程
/usr/bin/app --config "$CONFIG_PATH"
```

---

### 2. 容器/系统服务入口（PID 1 问题）

**场景**：Docker 容器中，PID 1 必须能正确处理信号（SIGTERM 等）。用 `exec` 让应用直接成为 PID 1，避免信号被 shell 拦截。

```dockerfile
# 错误写法：shell 是 PID 1，应用无法收到 SIGTERM
CMD ["/bin/sh", "-c", "/app/server"]

# 正确写法：exec 让 server 成为 PID 1
CMD ["/app/server"]
```

```bash
#!/bin/bash
# entrypoint.sh

# 初始化配置
envsubst < /etc/app/config.template > /etc/app/config.yaml

# 用 exec 让应用成为 PID 1，能正确接收 SIGTERM
exec "$@"
```

```dockerfile
ENTRYPOINT ["/entrypoint.sh"]
CMD ["/app/server", "--port", "8080"]
```

---

### 3. 模拟 login shell（`-l` 选项）

**场景**：切换用户后以 login shell 方式执行，加载完整的登录环境（`/etc/profile`、`~/.bash_profile` 等）。

```bash
# 普通切换（不加载登录环境）
exec /bin/bash

# 模拟 login shell（$0 变为 -bash，触发登录配置加载）
exec -l /bin/bash

# 等价于
exec /bin/bash --login
```

`su` 命令的 `-` 选项内部就是通过类似机制实现的：
```bash
su - username     # 等价于：exec -l /bin/bash（以 username 身份）
```

---

### 4. 以干净环境执行（`-c` 选项）

**场景**：测试程序在无任何环境变量时的行为，或安全隔离执行。

```bash
# 当前 shell 有大量环境变量
echo $PATH   # /usr/local/bin:/usr/bin:/bin:...

# 以空环境执行，程序只能看到自己设置的变量
exec -c /usr/bin/env   # 输出为空

# 实用：隔离测试
exec -c bash --norc --noprofile   # 启动完全干净的 bash
```

---

### 5. 永久重定向当前 shell 的输出（无 command）

**场景**：脚本全局日志记录，一次重定向，后续所有输出自动写入文件。

```bash
#!/bin/bash

LOGFILE="/var/log/deploy-$(date +%Y%m%d).log"

# 将后续所有 stdout 和 stderr 重定向到日志文件
exec >> "$LOGFILE" 2>&1

# 从此所有输出都进日志，无需每行加重定向
echo "=== 部署开始: $(date) ==="
apt-get update
apt-get install -y nginx
systemctl start nginx
echo "=== 部署完成: $(date) ==="
```

---

### 6. 操作文件描述符（无 command）

**场景**：在 shell 脚本中手动管理文件描述符，实现同时写多个目标、临时保存和恢复 stdout 等。

**同时输出到终端和文件：**

```bash
#!/bin/bash

# 打开 fd 3 指向日志文件
exec 3>> /tmp/script.log

echo "这行只到终端"
echo "这行到日志" >&3
echo "这行也只到终端"

# 关闭 fd 3
exec 3>&-
```

**保存并恢复 stdout：**

```bash
#!/bin/bash

# 将 stdout 备份到 fd 3
exec 3>&1

# 将 stdout 重定向到文件
exec > /tmp/output.txt

echo "这行写入文件"
echo "这行也写入文件"

# 恢复 stdout
exec 1>&3 3>&-

echo "这行回到终端"
```

**从文件读取（替代 while read 的子进程方式）：**

```bash
#!/bin/bash

# 打开文件到 fd 4 用于读取
exec 4< /etc/hosts

while read -u 4 line; do
  echo "读到: $line"
done

exec 4<&-   # 关闭 fd 4
```

---

### 7. 结合 trap 做后台任务输出保护

**场景**（来自 trap 文档中的示例扩展）：忽略 HUP 的同时，用 `exec` 一次性重定向所有输出，防止终端关闭后 SIGPIPE 导致退出。

```bash
#!/bin/bash

trap "" HUP

# 用 exec 一次性重定向，比在每条命令后加重定向更可靠
exec >> /tmp/task.log 2>&1

echo "任务开始: $(date)"
for i in $(seq 1 10); do
  echo "步骤 $i"
  sleep 5
done
echo "任务完成: $(date)"
```

---

### 8. 切换解释器（shebang 替换技巧）

**场景**：脚本需要先用 bash 做环境检测，再切换到 Python/Node 等执行主逻辑，同时保持单文件。

```bash
#!/bin/bash
# 检查依赖
if ! command -v python3 &>/dev/null; then
  echo "错误：需要 python3" >&2
  exit 1
fi

# 激活虚拟环境
source /opt/venv/bin/activate

# 用 exec 替换为 python3 执行后续逻辑
exec python3 - "$@" << 'PYEOF'
import sys
print(f"Python 接管，参数: {sys.argv[1:]}")
PYEOF
```

---

## 文件描述符操作速查

```bash
exec > file          # stdout 重定向到 file（覆盖）
exec >> file         # stdout 重定向到 file（追加）
exec 2> file         # stderr 重定向到 file
exec >> file 2>&1    # stdout+stderr 都追加到 file
exec 3> file         # 打开 fd 3 写入 file
exec 3< file         # 打开 fd 3 读取 file
exec 3>&-            # 关闭 fd 3（写）
exec 3<&-            # 关闭 fd 3（读）
exec 3>&1            # fd 3 复制自 stdout（备份）
exec 1>&3 3>&-       # stdout 恢复自 fd 3，再关闭 fd 3
```

---

## 返回值

| 情况 | 返回值 |
|------|--------|
| command 执行成功 | 不返回（进程已被替换） |
| command 执行失败（非交互式） | shell 退出 |
| command 执行失败（交互式） | 非零状态，shell 继续 |
| 仅重定向，无错误 | `0` |
| 仅重定向，有错误 | 非零 |
