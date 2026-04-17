---
title: Parameter Expansion
---

> Bash 手册参考：https://www.gnu.org/software/bash/manual/bash.html#Shell-Parameter-Expansion

---

## 一、默认值 / 赋值 / 报错 / 替换（冒号系列）

这四个展开共享同一个逻辑前提：**判断变量是否"unset 或为空"**。
去掉冒号 `:` 时，只判断是否 **unset**（空字符串不触发）。

---

### 1. `${parameter:-word}` — 取默认值（Default Value）

**规则：** 若 `parameter` unset 或为空，展开为 `word`；否则展开为 `parameter` 的值。
**变量本身不被修改。**

```bash
name=""
echo ${name:-"Guest"}     # 输出: Guest  （为空，用默认值）
echo $name                # 输出:         （变量仍为空）

name="Alice"
echo ${name:-"Guest"}     # 输出: Alice  （有值，用原值）

unset age
echo ${age:-18}           # 输出: 18     （未设置，用默认值）

# 去掉冒号：只检查 unset，不检查空字符串
name=""
echo ${name-"Guest"}      # 输出:         （空字符串不触发，输出空）

unset name
echo ${name-"Guest"}      # 输出: Guest  （未设置，触发默认值）
```

**典型用途：** 函数参数默认值、脚本配置兜底

```bash
port=${PORT:-8080}
log_dir=${LOG_DIR:-"/var/log/myapp"}
```

---

### 2. `${parameter:=word}` — 赋默认值（Assign Default）

**规则：** 若 `parameter` unset 或为空，将 `word` **赋值给 parameter**，并展开为 `word`；否则展开为 `parameter` 的值。
**变量被永久修改。**

> 注意：不能用于位置参数（`$1`, `$2`）和特殊参数（`$@`, `$*`）。

```bash
unset config
echo ${config:="/etc/app.conf"}   # 输出: /etc/app.conf
echo $config                       # 输出: /etc/app.conf  （变量已被赋值）

name=""
echo ${name:="Anonymous"}         # 输出: Anonymous
echo $name                         # 输出: Anonymous      （空字符串也被赋值）

# 去掉冒号：只对 unset 赋值
name=""
echo ${name="Bob"}                # 输出:                 （空字符串不触发，不赋值）
echo $name                         # 输出:                 （仍为空）
```

**典型用途：** 初始化全局变量（只初始化一次）

```bash
: ${TMPDIR:=/tmp}          # 常见惯用写法：用 : 命令丢弃展开值
: ${MAX_RETRY:=3}
```

---

### 3. `${parameter:?word}` — 未设置则报错（Error if Unset）

**规则：** 若 `parameter` unset 或为空，向标准错误输出 `word` 并**退出脚本**（非交互式 shell）；否则展开为 `parameter` 的值。

```bash
unset required_arg
echo ${required_arg:?"required_arg must be set"}
# 输出到 stderr: bash: required_arg: required_arg must be set
# 脚本退出，退出码为 1

name=""
echo ${name:?"name cannot be empty"}
# 输出到 stderr: bash: name: name cannot be empty

name="Alice"
echo ${name:?"name cannot be empty"}   # 输出: Alice（正常执行）

# 去掉冒号：只对 unset 报错
name=""
echo ${name?"name is unset"}           # 输出:   （空字符串不触发，正常通过）
```

**典型用途：** 脚本入口参数强制校验

```bash
#!/bin/bash
DB_HOST=${DB_HOST:?"环境变量 DB_HOST 未设置，请配置后重试"}
API_KEY=${API_KEY:?"API_KEY 不能为空"}
```

---

### 4. `${parameter:+word}` — 有值则替换（Alternate Value）

**规则：** 若 `parameter` unset 或为空，展开为**空字符串**；若有值，展开为 `word`（变量本身不被修改）。
**与 `:-` 逻辑相反。**

```bash
name="Alice"
echo ${name:+"Hello, $name!"}    # 输出: Hello, Alice!  （有值，用 word）

name=""
echo ${name:+"Hello"}            # 输出:                 （为空，展开为空）

unset flag
echo ${flag:+"-v"}               # 输出:                 （未设置，展开为空）

flag=1
echo ${flag:+"-v"}               # 输出: -v             （有值，输出 word）

# 去掉冒号：只检查 unset
name=""
echo ${name+"exists"}            # 输出: exists          （空字符串也算"已设置"）

unset name
echo ${name+"exists"}            # 输出:                 （未设置，才展开为空）
```

**典型用途：** 条件性添加参数

```bash
verbose=""
debug=1

cmd="myapp ${verbose:+-v} ${debug:+--debug}"
# 等价于: cmd="myapp  --debug"

# 数组追加元素（判断变量是否存在）
extra_args=${EXTRA:+"--extra=$EXTRA"}
```

---

## 二、子字符串截取

### 5. `${parameter:offset}` — 从偏移位置截取到末尾

**规则：** 从 `offset` 位置开始，截取到字符串末尾。

- 索引从 `0` 开始
- `offset` 为负数时，从末尾倒数（负数前需有空格或用括号，避免与 `:-` 混淆）

```bash
str="Hello, World!"

echo ${str:7}           # 输出: World!    （从第7个字符开始）
echo ${str:0}           # 输出: Hello, World!
echo ${str:1}           # 输出: ello, World!

# 负数偏移：从末尾倒数
echo ${str: -6}         # 输出: World!    （注意冒号后有空格）
echo ${str:(-6)}        # 输出: World!    （括号写法）

# 位置参数同样适用
set -- "apple" "banana" "cherry"
echo ${@:2}             # 输出: banana cherry  （从第2个参数开始）
echo ${@:1}             # 输出: apple banana cherry
```

---

### 6. `${parameter:offset:length}` — 截取指定长度

**规则：** 从 `offset` 开始，截取 `length` 个字符。

- `length` 为负数时，表示**距末尾的偏移**（截取到倒数第 |length| 个字符前）

```bash
str="Hello, World!"

echo ${str:7:5}         # 输出: World
echo ${str:0:5}         # 输出: Hello
echo ${str:7:1}         # 输出: W

# 负数 length：截取到距末尾 N 个字符前
echo ${str:0:-1}        # 输出: Hello, World   （去掉最后1个字符）
echo ${str:7:-1}        # 输出: World          （去掉最后1个字符，从第7位开始）

# 数组截取
arr=(a b c d e)
echo ${arr[@]:1:3}      # 输出: b c d          （从索引1开始，取3个元素）
echo ${arr[@]: -2}      # 输出: d e            （最后2个元素）

# 位置参数截取
set -- one two three four five
echo ${@:2:3}           # 输出: two three four
```

---

## 三、间接引用 / 变量名展开

### 7. `${!prefix*}` — 列出以 prefix 开头的变量名（拼接为单词）

**规则：** 展开为所有以 `prefix` 开头的变量名，用 `IFS` 的第一个字符分隔（通常是空格）。
结果是一个**单个字符串**（类似 `$*`）。

```bash
MY_APP_HOST="localhost"
MY_APP_PORT="8080"
MY_APP_NAME="demo"
OTHER_VAR="ignored"

echo ${!MY_APP*}
# 输出: MY_APP_HOST MY_APP_NAME MY_APP_PORT

# 遍历（不推荐，有分词问题）
for var in ${!MY_APP*}; do
    echo "$var = ${!var}"
done
# 输出:
# MY_APP_HOST = localhost
# MY_APP_NAME = demo
# MY_APP_PORT = 8080
```

---

### 8. `${!prefix@}` — 列出以 prefix 开头的变量名（独立引号安全）

**规则：** 与 `${!prefix*}` 相同，但在双引号内展开时，每个变量名是独立的词（类似 `$@`）。
**推荐使用 `@` 版本**，更安全。

```bash
MY_HOST="localhost"
MY_PORT="8080"
MY_NAME="my app"   # 含空格

# 使用 * 版本（双引号内合并为一个字符串）
for var in "${!MY_*}"; do echo "[$var]"; done
# 输出: [MY_HOST MY_NAME MY_PORT]   ← 全部合并成一个词，错误！

# 使用 @ 版本（双引号内每个名字独立）
for var in "${!MY_@}"; do echo "[$var]"; done
# 输出:
# [MY_HOST]
# [MY_NAME]
# [MY_PORT]
```

---

### 9. `${!name[@]}` — 数组所有下标（独立元素）

**规则：** 展开为数组 `name` 的所有**下标/键**，在双引号内每个下标是独立的词。

```bash
# 普通索引数组
fruits=("apple" "banana" "cherry")
echo ${!fruits[@]}        # 输出: 0 1 2

# 稀疏数组（跳过元素后下标不连续）
sparse=()
sparse[0]="zero"
sparse[3]="three"
sparse[7]="seven"
echo ${!sparse[@]}        # 输出: 0 3 7

# 关联数组（哈希表）
declare -A person
person[name]="Alice"
person[age]="30"
person[city]="Beijing"
echo ${!person[@]}        # 输出: name age city（顺序不定）

# 安全遍历关联数组
for key in "${!person[@]}"; do
    echo "$key => ${person[$key]}"
done
```

---

### 10. `${!name[*]}` — 数组所有下标（单字符串）

**规则：** 与 `${!name[@]}` 相同，但在双引号内合并为一个字符串（用 `IFS` 分隔）。

```bash
declare -A config
config[host]="localhost"
config[port]="5432"

# @ 版本：双引号内独立词（推荐）
for key in "${!config[@]}"; do
    echo "$key"
done

# * 版本：双引号内合并为一个字符串
echo "${!config[*]}"      # 输出: host port（单个字符串）

# 对比
keys_at=("${!config[@]}")    # 正确：每个键独立成元素
keys_star=("${!config[*]}")  # 错误：所有键合并为一个元素
echo ${#keys_at[@]}           # 输出: 2
echo ${#keys_star[@]}         # 输出: 1
```

---

## 四、长度

### 11. `${#parameter}` — 字符串长度 / 数组元素个数

**规则：**

- 普通变量：展开为字符串的**字符数**
- `${#*}` 或 `${#@}`：展开为**位置参数的个数**
- `${#array[@]}` 或 `${#array[*]}`：展开为数组**元素个数**

```bash
# 字符串长度
str="Hello"
echo ${#str}              # 输出: 5

str="你好世界"
echo ${#str}              # 输出: 4  （字符数，非字节数）

empty=""
echo ${#empty}            # 输出: 0

# 未设置的变量
unset undef
echo ${#undef}            # 输出: 0

# 位置参数个数
set -- a b c d
echo ${#@}                # 输出: 4
echo ${#*}                # 输出: 4

# 数组元素个数
arr=(one two three)
echo ${#arr[@]}           # 输出: 3
echo ${#arr[*]}           # 输出: 3

# 特定元素的长度
echo ${#arr[1]}           # 输出: 3  （"two" 的长度）

# 关联数组
declare -A map=([a]=1 [b]=2 [c]=3)
echo ${#map[@]}           # 输出: 3
```

---

## 五、前缀/后缀删除（模式匹配）

> **记忆关键：`#` 从前删，`%` 从后删；单符号最短匹配，双符号最长匹配**

---

### 12. `${parameter#word}` — 删除最短前缀匹配

**规则：** 从字符串**开头**匹配 `word` 模式（glob），删除**最短**匹配部分。

```bash
path="/usr/local/bin/bash"

echo ${path#/}            # 输出: usr/local/bin/bash    （删除开头的 /）
echo ${path#*/}           # 输出: local/bin/bash        （最短匹配：删到第一个 / 后）
echo ${path#/usr}         # 输出: /local/bin/bash

# 提取文件名（basename 等效）
echo ${path##*/}          # 输出: bash                  （## 最长匹配，见下一条）

file="report.tar.gz"
echo ${file#*.}           # 输出: tar.gz                （删除第一个点前的内容）

# URL 处理
url="https://www.example.com/path"
echo ${url#*://}          # 输出: www.example.com/path
```

---

### 13. `${parameter##word}` — 删除最长前缀匹配

**规则：** 从字符串**开头**匹配 `word` 模式，删除**最长**匹配部分。

```bash
path="/usr/local/bin/bash"

echo ${path##*/}          # 输出: bash                  （最长匹配：删到最后一个 /）
echo ${path##/usr}        # 输出: /local/bin/bash

file="report.tar.gz"
echo ${file##*.}          # 输出: gz                    （最长匹配：删到最后一个点）

# 与 # 的区别
echo ${file#*.}           # 输出: tar.gz   （最短：第一个点）
echo ${file##*.}          # 输出: gz       （最长：最后一个点）

# 实用：提取文件扩展名
filename="archive.tar.gz"
echo ${filename##*.}      # 输出: gz

# 提取目录路径（dirname 等效）
path="/home/user/docs/file.txt"
dir="${path%/*}"          # 见 % 部分
```

---

### 14. `${parameter%word}` — 删除最短后缀匹配

**规则：** 从字符串**末尾**匹配 `word` 模式，删除**最短**匹配部分。

```bash
path="/usr/local/bin/bash"

echo ${path%/*}           # 输出: /usr/local/bin        （删除最后一个 /bash）
echo ${path%bash}         # 输出: /usr/local/bin/

file="report.tar.gz"
echo ${file%.*}           # 输出: report.tar            （删除最后一个点及后缀）

# 去掉文件扩展名（单层）
echo ${file%.gz}          # 输出: report.tar
echo ${file%.tar.gz}      # 输出: report

# 提取目录（dirname 等效）
full_path="/home/user/docs/file.txt"
echo ${full_path%/*}      # 输出: /home/user/docs

# 去掉末尾斜杠
dir="/var/log/"
echo ${dir%/}             # 输出: /var/log
```

---

### 15. `${parameter%%word}` — 删除最长后缀匹配

**规则：** 从字符串**末尾**匹配 `word` 模式，删除**最长**匹配部分。

```bash
path="/usr/local/bin/bash"

echo ${path%%/*}          # 输出:   （最长匹配：从末尾往前，匹配所有含 / 的内容，结果为空）

file="report.tar.gz"
echo ${file%%.*}          # 输出: report                （删除第一个点及其后所有内容）

# 与 % 的区别
echo ${file%.*}           # 输出: report.tar   （最短：最后一个点）
echo ${file%%.*}          # 输出: report        （最长：第一个点）

# URL 提取协议
url="https://www.example.com/path?q=1"
echo ${url%%://*}         # 输出: https

# CSV 第一列
csv="alice,30,Beijing,engineer"
echo ${csv%%,*}           # 输出: alice
```

---

## 六、子字符串替换

> **记忆关键：`/` 替换第一个，`//` 替换全部；`/#` 锚定开头，`/%` 锚定结尾**

---

### 16. `${parameter/pattern/string}` — 替换第一个匹配

**规则：** 将 `parameter` 中**第一个**匹配 `pattern` 的部分替换为 `string`。
若 `string` 省略，则删除匹配部分。

```bash
str="hello world hello"

echo ${str/hello/hi}              # 输出: hi world hello    （只替换第一个）
echo ${str/hello/}                # 输出:  world hello      （删除第一个）
echo ${str/ /_}                   # 输出: hello_world hello （替换第一个空格）

# glob 模式匹配
path="/usr/local/bin"
echo ${path/\/usr/\/opt}          # 输出: /opt/local/bin

# 匹配任意字符
str="2024-01-15"
echo ${str/-/\/}                  # 输出: 2024/01-15        （替换第一个 -）

# 删除匹配
filename="  spaces  "
echo ${filename/ /}               # 输出:  spaces  （只删一个空格）
```

---

### 17. `${parameter//pattern/string}` — 替换所有匹配

**规则：** 将 `parameter` 中**所有**匹配 `pattern` 的部分替换为 `string`。

```bash
str="hello world hello"

echo ${str//hello/hi}             # 输出: hi world hi      （替换所有）
echo ${str// /_}                  # 输出: hello_world_hello（所有空格换下划线）
echo ${str//l/L}                  # 输出: heLLo worLd heLLo

# 删除所有匹配
str="a1b2c3d4"
echo ${str//[0-9]/}               # 输出: abcd             （删除所有数字）

# 转义特殊字符
path="/home/user/my dir/file"
echo ${path// /\\ }               # 输出: /home/user/my\ dir/file

# 实用：去除所有空格
input="  hello   world  "
echo ${input// /}                 # 输出: helloworld

# 替换换行（结合 $'\n'）
str=$'line1\nline2\nline3'
echo ${str//$'\n'/ | }            # 输出: line1 | line2 | line3
```

---

### 18. `${parameter/#pattern/string}` — 替换开头匹配（锚定前缀）

**规则：** 仅当 `pattern` 匹配字符串**开头**时才替换。等效于 `pattern` 前加 `^`。

```bash
str="hello world"

echo ${str/#hello/hi}             # 输出: hi world          （开头匹配，替换）
echo ${str/#world/earth}          # 输出: hello world       （不在开头，不替换）
echo ${str/#h/H}                  # 输出: Hello world

# 添加前缀
files="file.txt"
echo ${files/#file/backup_file}   # 输出: backup_file.txt

# 去掉开头的 ./
path="./src/main.go"
echo ${path/#.\//}                # 输出: src/main.go

# 条件添加协议头
url="example.com"
echo ${url/#http:\/\//}           # 输出: example.com（无 http:// 前缀，不变）
url2="http://example.com"
echo ${url2/#http:\/\//https://}  # 输出: https://example.com
```

---

### 19. `${parameter/%pattern/string}` — 替换结尾匹配（锚定后缀）

**规则：** 仅当 `pattern` 匹配字符串**末尾**时才替换。等效于 `pattern` 后加 `$`。

```bash
str="hello world"

echo ${str/%world/earth}          # 输出: hello earth       （末尾匹配，替换）
echo ${str/%hello/hi}             # 输出: hello world       （不在末尾，不替换）

# 修改文件扩展名
file="report.txt"
echo ${file/%.txt/.md}            # 输出: report.md

# 批量重命名扩展名
for f in *.txt; do
    mv "$f" "${f/%.txt/.md}"
done

# 去掉末尾斜杠
dir="/var/log/"
echo ${dir/%\//}                  # 输出: /var/log

# 添加后缀（如果不以特定字符结尾）
str="hello"
echo ${str/%o/o!}                 # 输出: hello!
```

---

## 七、大小写转换

> **记忆关键：`^` 转大写，`,` 转小写；单符号转第一个，双符号转全部**

---

### 20. `${parameter^pattern}` — 首字母/匹配字符转大写

**规则：** 将字符串中**第一个**匹配 `pattern` 的字符转为大写。
若 `pattern` 省略，默认匹配任意字符（即转首字母大写）。

```bash
str="hello world"

echo ${str^}              # 输出: Hello world    （首字母大写）
echo ${str^h}             # 输出: Hello world    （匹配 h，转大写）
echo ${str^[aeiou]}       # 输出: hello world    （首字母 h 不是元音，不转）

str2="apple"
echo ${str2^[aeiou]}      # 输出: Apple          （首字母是元音，转大写）

# 转首字母大写（标题格式）
name="alice"
echo ${name^}             # 输出: Alice
```

---

### 21. `${parameter^^pattern}` — 所有匹配字符转大写

**规则：** 将字符串中**所有**匹配 `pattern` 的字符转为大写。
若 `pattern` 省略，将整个字符串转为大写。

```bash
str="hello world"

echo ${str^^}             # 输出: HELLO WORLD    （全部大写）
echo ${str^^[aeiou]}      # 输出: hEllO wOrld    （只有元音转大写）
echo ${str^^[a-z]}        # 输出: HELLO WORLD    （所有小写字母转大写）
echo ${str^^h}            # 输出: Hello world    （只转 h）

# 环境变量风格命名
var_name="my_config_value"
echo ${var_name^^}        # 输出: MY_CONFIG_VALUE

# 数组元素大写
arr=(apple banana cherry)
echo ${arr[@]^^}          # 输出: APPLE BANANA CHERRY
```

---

### 22. `${parameter,pattern}` — 首字母/匹配字符转小写

**规则：** 将字符串中**第一个**匹配 `pattern` 的字符转为小写。
若 `pattern` 省略，只转首字母小写。

```bash
str="HELLO WORLD"

echo ${str,}              # 输出: hELLO WORLD    （首字母小写）
echo ${str,H}             # 输出: hELLO WORLD    （匹配 H，转小写）
echo ${str,[A-Z]}         # 输出: hELLO WORLD    （第一个大写字母转小写）

# 驼峰命名首字母小写
class_name="MyClassName"
echo ${class_name,}       # 输出: myClassName
```

---

### 23. `${parameter,,pattern}` — 所有匹配字符转小写

**规则：** 将字符串中**所有**匹配 `pattern` 的字符转为小写。
若 `pattern` 省略，将整个字符串转为小写。

```bash
str="HELLO WORLD"

echo ${str,,}             # 输出: hello world    （全部小写）
echo ${str,,[AEIOU]}      # 输出: hELLO wORLD    （只有大写元音转小写）
echo ${str,,[A-Z]}        # 输出: hello world

# 规范化用户输入
read -p "Enter choice (Y/N): " choice
case ${choice,,} in
    y|yes) echo "Confirmed" ;;
    n|no)  echo "Cancelled" ;;
esac

# 数组元素小写
arr=(APPLE BANANA CHERRY)
echo ${arr[@],,}          # 输出: apple banana cherry
```

---

## 八、参数转换操作符

### 24. `${parameter@operator}` — 参数变换

`operator` 是单个字母，不同字母执行不同变换：

---

#### `${parameter@U}` — 转大写（同 `^^`）

```bash
str="hello world"
echo ${str@U}             # 输出: HELLO WORLD
```

#### `${parameter@u}` — 首字母转大写（同 `^`）

```bash
str="hello world"
echo ${str@u}             # 输出: Hello world
```

#### `${parameter@L}` — 转小写（同 `,,`）

```bash
str="HELLO WORLD"
echo ${str@L}             # 输出: hello world
```

---

#### `${parameter@Q}` — 引号安全转义（Shell 可重用格式）

**规则：** 将值转为带引号的格式，使其可以安全地被 shell 重新解析。

```bash
str="hello world"
echo ${str@Q}             # 输出: 'hello world'

str2="it's a test"
echo ${str2@Q}            # 输出: 'it'\''s a test'  或 $'it\'s a test'

path="/home/user/my docs"
echo ${path@Q}            # 输出: '/home/user/my docs'

# 实用：调试时安全打印变量
declare -p var            # 等效于用 @Q 打印

# 生成可重用的赋值语句
name="Alice O'Brien"
echo "name=${name@Q}"     # 输出: name='Alice O'\''Brien'
```

---

#### `${parameter@E}` — 转义序列展开（类似 `$'...'`）

**规则：** 将字符串中的转义序列（`\n`, `\t`, `\xHH` 等）展开为实际字符。

```bash
str='Hello\nWorld'        # 单引号，\n 未展开
echo ${str@E}             # 输出: Hello
                          #       World     （\n 被展开为换行）

str2='Column1\tColumn2'
echo ${str2@E}            # 输出: Column1	Column2   （\t 展开为制表符）

hex='\x41\x42\x43'
echo ${hex@E}             # 输出: ABC        （十六进制展开）

# 与 $'...' 等效
echo $'Hello\nWorld'      # 同上效果
```

---

#### `${parameter@P}` — 按提示符格式展开

**规则：** 将 `parameter` 的值按 PS1 提示符格式（`\u`, `\h`, `\w` 等）展开。

```bash
# 模拟提示符展开
template='\u@\h:\w\$'
echo ${template@P}        # 输出: alice@myhost:/home/alice/projects$

# 调试 PS1 展开结果
echo ${PS1@P}             # 输出当前提示符的实际显示内容
```

---

#### `${parameter@A}` — 生成赋值语句

**规则：** 展开为可重现变量赋值的 `declare` 语句（包含属性和值）。

```bash
name="Alice"
echo ${name@A}            # 输出: declare -- name="Alice"

declare -r PI=3.14
echo ${PI@A}              # 输出: declare -r PI="3.14"

declare -i count=42
echo ${count@A}           # 输出: declare -i count="42"

declare -a arr=(1 2 3)
echo ${arr@A}             # 输出: declare -a arr=([0]="1" [1]="2" [2]="3")

declare -A map=([a]=1 [b]=2)
echo ${map@A}             # 输出: declare -A map=([a]="1" [b]="2")

# 实用：序列化变量（用于 eval 恢复）
backup="${arr@A}"
unset arr
eval "$backup"
echo ${arr[@]}            # 输出: 1 2 3  （已恢复）
```

---

#### `${parameter@a}` — 显示变量属性标志

**规则：** 展开为 `declare` 属性标志字母（`r`=只读, `i`=整数, `a`=数组, `A`=关联数组, `x`=export 等）。

```bash
declare -r PI=3.14
echo ${PI@a}              # 输出: r    （只读）

declare -i num=10
echo ${num@a}             # 输出: i    （整数）

declare -rx LOG_LEVEL="info"
echo ${LOG_LEVEL@a}       # 输出: rx   （只读 + export）

declare -a arr
echo ${arr@a}             # 输出: a    （索引数组）

declare -A map
echo ${map@a}             # 输出: A    （关联数组）

name="Alice"
echo ${name@a}            # 输出:      （普通变量，无属性）
```

---

## 总结：记忆规则

### 一、冒号系列（`-` `=` `?` `+`）

```
操作符    有值时      无值/空时       记忆口诀
  -       原值        用word         「减」法兜底：没有就用默认值
  =       原值        赋word给变量   「等」于赋值：没有就赋上去
  ?       原值        报错退出       「问」号追责：没有就报错
  +       word        空字符串       「加」法反转：有了才替换
```

**反向逻辑记忆：`:-` 和 `:+` 互为反义：**

- `:-` → 没有时用 word（兜底）
- `:+` → 有值时用 word（替换）

**冒号的作用：**

- 有 `:` → 同时检查 **unset** 和 **空字符串**
- 无 `:` → 只检查 **unset**

---

### 二、`#` / `%` 删除模式

```
方向      单符号(#/%)   双符号(##/%%)
开头(#)   最短匹配删除   最长匹配删除
结尾(%)   最短匹配删除   最长匹配删除
```

**联想记忆：**

- `#` 在键盘上是 `Shift+3`，**3 在 1 的右边** → 从**左/前**开始
- `%` 在键盘上是 `Shift+5`，**5 在 1 的右边更远** → 从**右/后**开始
- 或记：`#` 是注释符，注释写在**前面** → 删**前缀**；`%` 是取模，通常在末尾 → 删**后缀**
- 单符号 = 贪心停止（最短），双符号 = 贪心到底（最长）

**实用口诀：**

```bash
${file##*/}   # 取文件名（删掉最长前缀路径）
${file%.*}    # 去扩展名（删掉最短后缀）
${file##*.}   # 取扩展名（删掉最长前缀到点）
${path%/*}    # 取目录名（删掉最短后缀文件名）
```

---

### 三、替换系列（`/`）

```
${var/pat/str}    替换第一个    → 单斜杠，一次
${var//pat/str}   替换全部      → 双斜杠，所有
${var/#pat/str}   替换开头      → # 锚定开头（同正则 ^）
${var/%pat/str}   替换结尾      → % 锚定结尾（同正则 $）
```

---

### 四、大小写系列

```
^ 朝上  = 大写     , 朝下  = 小写
单符号  = 第一个   双符号  = 全部

${var^}    首字母大写
${var^^}   全部大写
${var,}    首字母小写
${var,,}   全部小写
```

---

### 五、`@` 操作符速查表

| 操作符 | 功能              | 记忆联想               |
| ------ | ----------------- | ---------------------- |
| `@Q`   | 带引号转义        | Q = Quote              |
| `@E`   | 展开转义序列      | E = Escape / Expand    |
| `@P`   | 按提示符格式展开  | P = Prompt             |
| `@A`   | 生成 declare 语句 | A = Assignment         |
| `@a`   | 显示属性标志      | a = attributes（小写） |
| `@U`   | 全部大写          | U = Uppercase          |
| `@u`   | 首字母大写        | u = uppercase（首个）  |
| `@L`   | 全部小写          | L = Lowercase          |

---

### 六、`!` 间接引用速查

```
${!prefix@}    列出变量名（@ 版本，引号安全）
${!prefix*}    列出变量名（* 版本，合并为一串）
${!arr[@]}     数组所有下标/键
${!var}        间接引用：展开 $var，再用其值作为变量名
```

---

### 七、综合记忆口诀

```
冒号系列：- 兜底，= 赋值，? 报错，+ 反转
井号删前缀，百分删后缀，单符最短双最长
斜杠替换首，双杠替全部，井锚头百锚尾
帽子变大写，逗号变小写，单个首双全部
At符号变形：Q引E转P提示，A赋值a属性UuL大小写
```
