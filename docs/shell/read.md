---
sidebar_position: 8
---

# Bash `read` 命令详解

## 语法

```bash
read [-Eers] [-a aname] [-d delim] [-i text] [-n nchars]
   [-N nchars] [-p prompt] [-t timeout] [-u fd] [name ...]
```

---

## 核心概念

从标准输入（或指定文件描述符）读取一行，按 IFS 分词后依次赋给各变量。未提供变量名时，整行赋给 `$REPLY`。

---

## 选项说明

| 选项 | 说明 |
|------|------|
| `-a aname` | 读入内容按单词拆分后赋给数组，索引从 0 开始 |
| `-d delim` | 以 delim 首字符替代换行作为行终止符；delim 为空串时以 NUL 终止 |
| `-e` | 启用 Readline 编辑，使用文件名补全 |
| `-E` | 启用 Readline 编辑，使用 bash 可编程补全 |
| `-i text` | Readline 模式下预填充编辑缓冲区 |
| `-n nchars` | 读取 nchars 个字符后返回（遇到分隔符可提前返回） |
| `-N nchars` | 严格读取恰好 nchars 个字符，忽略分隔符，结果不按 IFS 拆分 |
| `-p prompt` | 读取前显示提示语（不含换行，仅终端有效） |
| `-r` | 禁用反斜杠转义，`\` 作为普通字符处理 |
| `-s` | 静默模式，输入不回显（适合密码输入） |
| `-t timeout` | 超时秒数（支持小数），超时返回状态码 > 128；timeout 为 0 时检测是否有可读数据 |
| `-u fd` | 从指定文件描述符读取而非 stdin |

---

## 核心行为

### 多变量分词赋值

```bash
read first second rest <<< "one two three four"
echo $first   # one
echo $second  # two
echo $rest    # three four（剩余内容全给最后一个变量）
```

### 无变量名时赋给 `$REPLY`

```bash
read
# 输入：hello world
echo $REPLY   # hello world
```

### IFS 控制分隔符

```bash
IFS=: read user pass uid gid <<< "root:x:0:0"
echo $user   # root
echo $uid    # 0
```

---

## 实际使用场景

### 1. 交互式输入

```bash
read -p "请输入用户名: " username
read -s -p "请输入密码: " password
echo ""
echo "用户: $username"
```

### 2. 超时输入

```bash
if read -t 5 -p "5秒内确认继续 (y/n): " answer; then
  echo "输入: $answer"
else
  echo "超时，默认取消"
fi
```

### 3. 逐行处理文件（标准写法）

```bash
while IFS= read -r line; do
  echo "处理: $line"
done < /etc/hosts
```

> `-r` 防止反斜杠被转义；`IFS=` 防止行首尾空白被裁剪。

### 4. 读入数组

```bash
read -a colors <<< "red green blue"
echo ${colors[0]}   # red
echo ${colors[@]}   # red green blue
```

### 5. 读取固定字符数

```bash
# -n：遇分隔符提前返回
read -n 1 -p "按任意键继续..." key
echo ""

# -N：严格读取，不受分隔符影响
read -N 4 chunk <<< "abcdefg"
echo $chunk   # abcd
```

### 6. 自定义终止符

```bash
read -d : part <<< "hello:world"
echo $part   # hello（读到 : 停止）
```

### 7. 从文件描述符读取

```bash
exec 3< /etc/passwd
read -u 3 first_line
echo $first_line   # root:x:0:0:root:/root:/bin/bash
exec 3<&-
```

### 8. 预填充编辑内容（`-i`）

```bash
read -e -i "https://example.com" -p "URL: " url
echo "确认 URL: $url"
```

---

## 常见陷阱

### 管道中变量丢失

```bash
# 错误：管道创建子 shell，变量不传回父 shell
cat file.txt | while read line; do
  ((count++))
done
echo $count   # 0，变量丢失

# 正确：用进程替换，在当前 shell 执行
while IFS= read -r line; do
  ((count++))
done < <(cat file.txt)
echo $count   # 正确值
```

### 反斜杠行为差异

```bash
# 默认：反斜杠转义，\\ 变为 \，续行符被消费
read var <<< "hello\\ world"
echo $var   # hello\ world

# -r：反斜杠原样保留，不做任何转义
read -r var <<< "hello\\ world"
echo $var   # hello\\ world
```

---

## 返回值

| 情况 | 返回值 |
|------|--------|
| 成功读取 | `0` |
| 遇到 EOF | 非零 |
| 读取超时 | `> 128` |
| 变量赋值错误（如只读变量） | 非零 |
| 无效文件描述符 | 非零 |
