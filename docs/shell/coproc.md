# Bash 协进程（coproc）

## 语法

```bash
coproc [NAME] command [redirections]
```

## 变量说明

命名后 Shell 自动创建两个文件描述符：

| 变量      | 含义                                             |
| --------- | ------------------------------------------------ |
| `NAME[0]` | 父 Shell **读取**协进程输出（连接协进程 stdout） |
| `NAME[1]` | 父 Shell **写入**协进程输入（连接协进程 stdin）  |

## 通信原理

```
父 Shell                    协进程
  │                            │
  │──── NAME[1] (写) ────────▶ stdin
  │◀─── NAME[0] (读) ───────── stdout
```

---

## 示例

### 1. 最简单的协进程

```bash
coproc cat

echo "hello" >&"${COPROC[1]}"   # 向协进程写
read line <&"${COPROC[0]}"      # 从协进程读
echo "收到: $line"               # 输出: 收到: hello
```

### 2. 命名协进程 + bc 做计算器

```bash
coproc BC { bc -l; }

echo "3.14 * 2" >&"${BC[1]}"
read result <&"${BC[0]}"
echo "结果: $result"     # 结果: 6.28000000000000000000

echo "sqrt(2)" >&"${BC[1]}"
read result <&"${BC[0]}"
echo "结果: $result"     # 结果: 1.41421356237309504880

exec {BC[1]}>&-
```

### 3. 解决管道 subshell 变量丢失问题

```bash
# 普通管道的问题：变量在 subshell 里修改，父 Shell 看不到
count=0
cat /etc/passwd | while read line; do
    ((count++))
done
echo $count   # 输出 0，变量丢失！

# 用协进程解决
count=0
coproc READER { cat /etc/passwd; }

while read line <&"${READER[0]}"; do
    ((count++))
done
echo $count   # 正确输出行数
```

### 4. 长连接复用（避免重复启动进程）

```bash
coproc SSH { ssh user@server 'while read cmd; do eval "$cmd"; done'; }

echo "ls /tmp" >&"${SSH[1]}"
read output <&"${SSH[0]}"
echo "$output"

echo "whoami" >&"${SSH[1]}"
read output <&"${SSH[0]}"
echo "$output"

exec {SSH[1]}>&-
```

### 5. 多个命名协进程并行工作

```bash
coproc WORKER1 { while read x; do echo "$((x * 2))"; done; }
coproc WORKER2 { while read x; do echo "$((x * x))"; done; }

for i in 1 2 3 4 5; do
    echo $i >&"${WORKER1[1]}"
    echo $i >&"${WORKER2[1]}"

    read r1 <&"${WORKER1[0]}"
    read r2 <&"${WORKER2[0]}"

    echo "$i -> 双倍: $r1, 平方: $r2"
done

exec {WORKER1[1]}>&-
exec {WORKER2[1]}>&-
```

输出：

```
1 -> 双倍: 2, 平方: 1
2 -> 双倍: 4, 平方: 4
3 -> 双倍: 6, 平方: 9
4 -> 双倍: 8, 平方: 16
5 -> 双倍: 10, 平方: 25
```

---

## 注意事项

| 问题 | 说明                                                            |
| ---- | --------------------------------------------------------------- |
| 死锁 | 父子双方都在等对方写会卡住，需注意读写顺序                      |
| 缓冲 | 协进程输出有缓冲，行缓冲命令（如 `grep`）需加 `--line-buffered` |
| 关闭 | 用完后用 `exec {NAME[1]}>&-` 关闭写端，协进程读到 EOF 才会退出  |
| 数量 | 匿名协进程（无 NAME）同时只能有一个                             |
