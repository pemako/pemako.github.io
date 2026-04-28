---
sidebar_position: 7
---

# Bash `declare` 命令详解

## 语法

```bash
declare [-aAfFgiIlnrtux] [-p] [name[=value] ...]
```

---

## 核心作用

声明变量并赋予属性，控制变量的类型、作用域和行为。不提供变量名时，显示已声明变量的属性和值。

> 用 `+` 代替 `-` 可**取消**属性，如 `declare +r` 取消只读。

---

## 选项说明

| 选项 | 作用 |
|------|------|
| `-i` | 整数类型，赋值时自动做算术运算 |
| `-r` | 只读，不可修改或删除 |
| `-l` | 自动转小写 |
| `-u` | 自动转大写 |
| `-a` | 索引数组 |
| `-A` | 关联数组（字典） |
| `-x` | 导出为环境变量（等同 `export`） |
| `-f` | 显示函数定义 |
| `-F` | 只显示函数名（不显示函数体） |
| `-g` | 在函数内创建全局变量 |
| `-I` | 继承同名变量的属性和值 |
| `-n` | nameref，引用另一个变量名 |
| `-t` | 给函数设置 trace 属性 |
| `-p` | 显示变量的属性和值 |

---

## 各属性详解与示例

### `-i` 整数

```bash
declare -i num=10
num="5 + 3"
echo $num    # 8，自动计算

declare -i x=10
x="hello"
echo $x      # 0，非数字赋值为 0
```

---

### `-r` 只读

```bash
declare -r VERSION="1.0.0"
VERSION="2.0"   # 报错：cannot assign to readonly variable
unset VERSION   # 报错：cannot unset readonly variable
```

---

### `-l` / `-u` 大小写自动转换

```bash
declare -l lower
lower="Hello World"
echo $lower    # hello world

declare -u upper
upper="Hello World"
echo $upper    # HELLO WORLD
```

---

### `-a` 索引数组

```bash
declare -a fruits=("apple" "banana" "cherry")
echo ${fruits[1]}        # banana
echo ${fruits[@]}        # apple banana cherry
echo ${#fruits[@]}       # 3
```

---

### `-A` 关联数组（字典）

```bash
declare -A user
user[name]="Alice"
user[age]=30
user[role]="admin"

echo ${user[name]}       # Alice

for k in "${!user[@]}"; do
  echo "$k: ${user[$k]}"
done
```

---

### `-x` 导出环境变量

```bash
declare -x APP_ENV="production"
# 等同于：export APP_ENV="production"

# 取消导出
declare +x APP_ENV
```

---

### `-g` 函数内创建全局变量

```bash
set_global() {
  declare -g GLOBAL_VAR="hello"   # 全局作用域
  local LOCAL_VAR="world"         # 函数作用域
}
set_global
echo $GLOBAL_VAR    # hello
echo $LOCAL_VAR     # 空，函数外不可见
```

---

### `-n` nameref（变量引用）

```bash
declare -n ref=GLOBAL_VAR
echo $ref           # 读取 GLOBAL_VAR 的值
ref="changed"
echo $GLOBAL_VAR    # changed，通过 ref 修改了原变量
```

---

### `-p` 查看变量属性

```bash
declare -p user       # 显示 user 的类型和值
declare -p            # 显示所有变量
declare -pA           # 只显示所有关联数组
declare -f func_name  # 显示函数完整定义
declare -F            # 列出所有函数名
```

---

## 实际使用场景

### 1. 函数参数类型校验（`-i`）

```bash
set_timeout() {
  declare -i timeout=$1
  [ $timeout -le 0 ] && { echo "超时必须为正整数" >&2; return 1; }
  echo "超时设置为: $timeout 秒"
}

set_timeout "abc"   # 0，走校验分支
set_timeout 30      # 超时设置为: 30 秒
```

---

### 2. 统计单词频率（`-A` 关联数组）

```bash
declare -A freq
while read -r word; do
  ((freq[$word]++))
done < <(tr ' ' '\n' < /etc/hosts)

for word in "${!freq[@]}"; do
  echo "$word: ${freq[$word]}"
done
```

---

### 3. 动态变量名赋值（`-n` nameref）

```bash
set_var() {
  declare -n target=$1   # $1 是变量名字符串
  target=$2              # 通过引用给该变量赋值
}

set_var MY_NAME "Alice"
echo $MY_NAME    # Alice
```

---

### 4. 保护常量（`-r`）

```bash
declare -r MAX_RETRY=3
declare -r BASE_URL="https://api.example.com"

retry_request() {
  for ((i=0; i<MAX_RETRY; i++)); do
    curl "$BASE_URL/endpoint" && return 0
  done
  return 1
}
```

---

### 5. 规范化用户输入大小写（`-l` / `-u`）

```bash
declare -l input
read -p "输入环境名称（dev/staging/prod）: " input
# 无论用户输入 DEV / Dev / dev，统一转为小写

case $input in
  dev)     echo "开发环境" ;;
  staging) echo "预发环境" ;;
  prod)    echo "生产环境" ;;
  *)       echo "未知环境" ;;
esac
```

---

### 6. 查看函数定义（`-f` / `-F`）

```bash
# 列出当前 shell 中所有函数名
declare -F

# 查看某个函数的完整代码
declare -f my_func

# 结合 extdebug 显示函数定义所在文件和行号
shopt -s extdebug
declare -F my_func
# 输出：my_func 12 /path/to/script.sh
```

---

## 注意事项

- `declare` 在函数内使用时默认创建**局部变量**，加 `-g` 才创建全局变量
- `-n` nameref 不能引用自身，否则报错
- `-p` 与 `-f`/`-F` 以外的选项同时使用时，`-f`/`-F` 之外的选项在 `-p` 模式下被忽略


```bash
echo "afadfadfsd"

```
