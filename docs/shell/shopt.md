---
sidebar_position: 12
---

# Bash `shopt` 命令详解

## 是什么 / 主要用途

`shopt`（shell options）是 bash 专有的选项管理命令，用于开启或关闭 bash 的**扩展行为特性**。

与 `set` 的分工：

|          | `set`                                         | `shopt`                             |
| -------- | --------------------------------------------- | ----------------------------------- |
| 管理范围 | POSIX 标准 shell 行为                         | Bash 专有扩展特性                   |
| 典型用途 | `-e` 错误退出、`-x` 调试、`-u` 未定义变量检测 | glob 模式、历史记录、补全、目录切换 |

`shopt` 覆盖的核心能力域：

- **文件名展开**：控制 `*` `**` 等通配符的匹配规则
- **模式匹配**：`case` / `[[` 的大小写敏感性、扩展模式语法
- **历史记录**：追加模式、多行命令保存方式
- **交互式增强**：`autocd`、`cdspell`、自动补全行为
- **脚本健壮性**：`inherit_errexit`、`lastpipe`、`nullglob`
- **调试支持**：`extdebug` 配合 `declare -F` 显示函数位置

---

## 语法

```bash
shopt [-pqsu] [-o] [optname ...]
```

> `shopt -s` 开启，`shopt -u` 关闭，与 `set` 的区别在于 `shopt` 管理 bash 扩展行为，`set` 管理 POSIX 标准行为。

---

## 选项说明

| 选项 | 说明                                                |
| ---- | --------------------------------------------------- |
| `-s` | 开启指定选项                                        |
| `-u` | 关闭指定选项                                        |
| `-p` | 显示选项列表（可复用格式）                          |
| `-q` | 静默模式，用返回值表示选项状态（0=开启，非零=关闭） |
| `-o` | 限定为 `set -o` 的选项集合                          |

```bash
shopt               # 显示所有选项及状态
shopt -s extglob    # 开启 extglob
shopt -u extglob    # 关闭 extglob
shopt -q extglob    # 静默检测，$? 为 0 表示已开启
shopt extglob       # 显示单个选项状态
```

---

## 返回值

| 情况                             | 返回值 |
| -------------------------------- | ------ |
| 列出选项时，所有指定选项均已开启 | `0`    |
| 列出选项时，有未开启的选项       | 非零   |
| 设置/取消选项成功                | `0`    |
| optname 无效                     | 非零   |

---

## 选项分类详解

### 文件名展开（Globbing）

| 选项              | 默认 | 说明                                           |
| ----------------- | ---- | ---------------------------------------------- |
| `dotglob`         | 关   | `*` 匹配以 `.` 开头的文件（隐藏文件）          |
| `globstar`        | 关   | `**` 递归匹配所有文件和目录                    |
| `nullglob`        | 关   | 无匹配时展开为空，而非保留原样                 |
| `failglob`        | 关   | 无匹配时报错（与 nullglob 互斥）               |
| `extglob`         | 关   | 启用扩展模式匹配                               |
| `nocaseglob`      | 关   | 文件名匹配忽略大小写                           |
| `globskipdots`    | 开   | 展开时永远不匹配 `.` 和 `..`                   |
| `globasciiranges` | 关   | 字符范围 `[a-z]` 使用 C locale 而非本地 locale |

```bash
# dotglob：包含隐藏文件
shopt -s dotglob
ls *        # 包含 .bashrc .gitignore 等

# globstar：递归查找
shopt -s globstar
ls **/*.sh  # 找出所有子目录下的 .sh 文件

# nullglob：无匹配时不报错
shopt -s nullglob
files=(*.xyz)
echo ${#files[@]}   # 0，而非展开为 *.xyz

# extglob：扩展模式
shopt -s extglob
ls !(*.log)         # 匹配除 .log 外的所有文件
ls +(*.sh|*.py)     # 匹配 .sh 或 .py 文件
```

扩展模式语法：

| 模式         | 含义           |
| ------------ | -------------- |
| `?(pattern)` | 匹配 0 或 1 次 |
| `*(pattern)` | 匹配 0 或多次  |
| `+(pattern)` | 匹配 1 或多次  |
| `@(pattern)` | 恰好匹配 1 次  |
| `!(pattern)` | 不匹配该模式   |

---

### 目录切换

| 选项          | 默认 | 说明                                |
| ------------- | ---- | ----------------------------------- |
| `autocd`      | 关   | 输入目录名直接 cd（仅交互式 shell） |
| `cdspell`     | 关   | cd 时自动纠正轻微拼写错误           |
| `cdable_vars` | 关   | cd 的参数可以是存储路径的变量名     |

```bash
# autocd：直接输入目录名进入
shopt -s autocd
/etc          # 等同于 cd /etc

# cdspell：自动纠错
shopt -s cdspell
cd /ect       # 自动纠正为 /etc

# cdable_vars：变量名作为路径
shopt -s cdable_vars
mydir=/var/log
cd mydir      # 等同于 cd /var/log
```

---

### 历史记录

| 选项         | 默认 | 说明                                         |
| ------------ | ---- | -------------------------------------------- |
| `histappend` | 关   | shell 退出时追加历史而非覆盖 HISTFILE        |
| `cmdhist`    | 开   | 多行命令保存为单条历史记录                   |
| `lithist`    | 关   | 多行命令用换行而非 `;` 保存到历史            |
| `histverify` | 关   | `!` 历史展开后先加载到编辑缓冲区，不立即执行 |
| `histreedit` | 关   | 历史替换失败时允许重新编辑                   |

```bash
# histappend：多个 shell 不互相覆盖历史
shopt -s histappend

# histverify：!! 展开后先预览，按 Enter 再执行
shopt -s histverify
!!    # 展开上条命令到缓冲区，可修改后再执行
```

---

### 模式匹配

| 选项          | 默认 | 说明                            |
| ------------- | ---- | ------------------------------- |
| `nocasematch` | 关   | `case` 和 `[[` 匹配时忽略大小写 |
| `extglob`     | 关   | 扩展模式匹配（见上文）          |

```bash
shopt -s nocasematch
read -p "继续？(y/n): " ans
case $ans in
  y|yes) echo "继续" ;;
  n|no)  echo "取消" ;;
esac
# 输入 Y / YES / Yes 均能匹配
```

---

### 调试与开发

| 选项            | 默认 | 说明                                                   |
| --------------- | ---- | ------------------------------------------------------ |
| `extdebug`      | 关   | 启用调试模式（`declare -F` 显示行号，DEBUG trap 增强） |
| `execfail`      | 关   | 非交互式 shell exec 失败时不退出                       |
| `shift_verbose` | 关   | `shift` 超出位置参数数量时打印错误                     |

```bash
# extdebug：declare -F 显示函数定义位置
shopt -s extdebug
declare -F my_func
# 输出：my_func 12 /path/to/script.sh
```

---

### 补全行为

| 选项                      | 默认 | 说明                         |
| ------------------------- | ---- | ---------------------------- |
| `progcomp`                | 开   | 启用可编程补全               |
| `progcomp_alias`          | 关   | 对别名也尝试可编程补全       |
| `dirspell`                | 关   | 补全时自动纠正目录名拼写     |
| `direxpand`               | 关   | 补全时将目录名替换为展开结果 |
| `hostcomplete`            | 开   | `@` 后尝试主机名补全         |
| `no_empty_cmd_completion` | 关   | 空行时不搜索 PATH 补全       |
| `complete_fullquote`      | 开   | 补全文件名时引用所有元字符   |

---

### 管道与作业

| 选项           | 默认 | 说明                                           |
| -------------- | ---- | ---------------------------------------------- |
| `lastpipe`     | 关   | 管道最后一条命令在当前 shell 而非子 shell 执行 |
| `checkjobs`    | 关   | 退出前列出运行中/停止的作业                    |
| `huponexit`    | 关   | 登录 shell 退出时向所有作业发送 SIGHUP         |
| `checkwinsize` | 开   | 命令执行后更新 LINES/COLUMNS                   |

```bash
# lastpipe：管道最后一段的变量改动可传回当前 shell
shopt -s lastpipe
count=0
cat file.txt | while read line; do
  ((count++))
done
echo $count   # 有 lastpipe：正确值；无 lastpipe：0
```

---

### 错误处理

| 选项              | 默认 | 说明                                   |
| ----------------- | ---- | -------------------------------------- |
| `inherit_errexit` | 关   | 命令替换继承 `errexit`（`set -e`）设置 |

```bash
set -e
shopt -s inherit_errexit
result=$(false)   # 没有 inherit_errexit：子 shell 不受 -e 影响
          # 有 inherit_errexit：子 shell 也会因 false 退出
```

---

### 局部变量

| 选项               | 默认 | 说明                                           |
| ------------------ | ---- | ---------------------------------------------- |
| `localvar_inherit` | 关   | local 变量继承外层同名变量的值和属性           |
| `localvar_unset`   | 关   | unset 局部变量后，上层作用域的同名变量也不可见 |

---

### 其他实用选项

| 选项                   | 默认         | 说明                                     |
| ---------------------- | ------------ | ---------------------------------------- |
| `expand_aliases`       | 开（交互式） | 启用别名展开                             |
| `interactive_comments` | 开           | 交互式 shell 支持 `#` 注释               |
| `sourcepath`           | 开           | `source` 使用 PATH 查找文件              |
| `xpg_echo`             | 关           | `echo` 默认展开转义序列（如 `\n`）       |
| `bash_source_fullpath` | 关           | BASH_SOURCE 存储完整路径而非相对路径     |
| `varredir_close`       | 关           | `{var}` 重定向的 fd 在命令完成后自动关闭 |
| `checkhash`            | 关           | 执行缓存命令前验证其是否仍存在           |
| `login_shell`          | —            | 只读，标识当前是否为登录 shell           |
| `restricted_shell`     | —            | 只读，标识当前是否为受限 shell           |

---

## 实际使用场景

### 1. 脚本推荐开头组合

```bash
#!/bin/bash
set -euo pipefail
shopt -s inherit_errexit   # 命令替换也遵守 errexit
shopt -s nullglob          # 无匹配的 glob 展开为空，避免意外
```

### 2. 递归处理文件

```bash
shopt -s globstar nullglob
for f in **/*.log; do
  echo "处理: $f"
  gzip "$f"
done
```

### 3. 大小写不敏感的用户输入

```bash
shopt -s nocasematch
read -p "环境 (dev/prod): " env
case $env in
  dev)  echo "开发环境" ;;
  prod) echo "生产环境" ;;
  *)    echo "未知环境" ;;
esac
```

### 4. 多 shell 共享历史

```bash
# 写入 ~/.bashrc
shopt -s histappend
HISTSIZE=10000
HISTFILESIZE=20000
HISTCONTROL=ignoredups:erasedups
```

### 5. 管道变量传回

```bash
shopt -s lastpipe
declare -A word_count
while IFS= read -r line; do
  for word in $line; do
    ((word_count[$word]++))
  done
done < /etc/hosts
echo "单词数: ${#word_count[@]}"
```

### 6. 检测选项用于条件分支

```bash
# 保存并临时修改选项
if shopt -q extglob; then
  extglob_was_set=1
else
  extglob_was_set=0
  shopt -s extglob
fi

# 使用 extglob 特性
ls !(*.bak)

# 恢复原状
[ $extglob_was_set -eq 0 ] && shopt -u extglob
```

---

## `set -o` 与 `shopt` 对比

| 维度      | `set -o`                    | `shopt`                      |
| --------- | --------------------------- | ---------------------------- |
| 标准      | POSIX 标准选项              | Bash 专有扩展选项            |
| 语法      | `set -e` / `set -o errexit` | `shopt -s extglob`           |
| 查看      | `set -o`                    | `shopt`                      |
| 使用 `-o` | —                           | `shopt -o` 可访问 set 的选项 |

---

## 速查表

```bash
shopt -s dotglob          # * 匹配隐藏文件
shopt -s globstar         # ** 递归匹配
shopt -s nullglob         # 无匹配展开为空
shopt -s extglob          # 扩展模式 !(*.log) 等
shopt -s nocaseglob       # 文件名匹配忽略大小写
shopt -s nocasematch      # case/[[ 匹配忽略大小写
shopt -s autocd           # 直接输目录名进入
shopt -s cdspell          # cd 自动纠错
shopt -s histappend       # 追加而非覆盖历史文件
shopt -s lastpipe         # 管道末段在当前 shell 执行
shopt -s inherit_errexit  # 命令替换继承 errexit
shopt -s checkjobs        # 退出前列出作业
shopt -q extglob          # 静默检测选项是否开启（$? 判断）
```

---

## 详细使用示例与经典场景

### 场景一：批量处理文件（globstar + nullglob）

```bash
#!/bin/bash
shopt -s globstar nullglob

# 递归压缩所有 .log 文件，无匹配时安全跳过
for f in /var/log/**/*.log; do
  echo "压缩: $f"
  gzip "$f"
done

# 统计所有 .sh 脚本行数
total=0
for f in **/*.sh; do
  lines=$(wc -l < "$f")
  ((total += lines))
done
echo "总行数: $total"
```

---

### 场景二：文件清理（extglob）

```bash
shopt -s extglob

# 删除除 .sh 和 .py 之外的所有文件
rm -f !(*.sh|*.py)

# 删除所有备份文件（.bak .bak1 .bak2 等）
rm -f *.bak*(*)

# 匹配 image001 ~ image999
ls image+([0-9])
```

---

### 场景三：交互式 shell 增强（~/.bashrc）

```bash
# 输入目录名直接进入
shopt -s autocd

# cd 时自动纠正拼写
shopt -s cdspell

# 变量名作路径
shopt -s cdable_vars
LOGS=/var/log
CONF=/etc/nginx
# 之后直接 cd LOGS 即可

# 多 shell 共享并保留完整历史
shopt -s histappend
HISTSIZE=50000
HISTFILESIZE=100000
HISTCONTROL=ignoredups:erasedups
HISTTIMEFORMAT="%F %T "   # 历史记录带时间戳

# 多行命令保存为单条记录（便于重新编辑）
shopt -s cmdhist
shopt -s lithist
```

---

### 场景四：健壮的生产脚本

```bash
#!/bin/bash
set -euo pipefail
shopt -s inherit_errexit   # $(cmd) 中的错误也会触发 -e 退出
shopt -s nullglob          # glob 无匹配时展开为空，避免 "文件不存在" 错误

process_configs() {
  local configs=(/etc/app/*.conf)
  if [[ ${#configs[@]} -eq 0 ]]; then
    echo "没有配置文件" >&2
    return 1
  fi
  for conf in "${configs[@]}"; do
    # inherit_errexit 保证此处命令替换的错误不被吞掉
    version=$(grep '^version=' "$conf" | cut -d= -f2)
    echo "处理 $conf (version=$version)"
  done
}
```

---

### 场景五：管道结果传回主 shell（lastpipe）

```bash
shopt -s lastpipe

# 不用 lastpipe：count 始终为 0（while 在子 shell 运行）
count=0
cat /etc/passwd | while IFS=: read user _; do
  ((count++))
done
echo $count   # 0

# 用 lastpipe：while 在当前 shell 运行，count 正确传回
count=0
cat /etc/passwd | while IFS=: read user _; do
  ((count++))
done
echo $count   # 正确值
```

---

### 场景六：大小写不敏感匹配

```bash
shopt -s nocasematch

# case 语句不区分大小写
read -p "是否继续？(yes/no): " ans
case $ans in
  yes|y) echo "继续执行" ;;
  no|n)  echo "已取消"   ;;
  *)     echo "无效输入" ;;
esac
# 输入 YES / Yes / Y 均能匹配

# [[ ]] 条件也不区分大小写
os="Linux"
if [[ $os == linux ]]; then
  echo "是 Linux"   # 能匹配
fi

# 文件名补全忽略大小写（交互式）
shopt -s nocaseglob
ls *.PNG   # 也能匹配 .png .Png
```

---

### 场景七：调试脚本（extdebug）

```bash
shopt -s extdebug

# declare -F 显示函数定义的文件和行号
declare -F my_func
# 输出：my_func 42 /home/user/scripts/utils.sh

# DEBUG trap 控制执行流（返回非零跳过下一条命令）
trap '[[ $BASH_COMMAND == "rm"* ]] && { echo "拦截 rm 命令"; return 1; }' DEBUG
rm -rf /tmp/test   # 被拦截，不执行
```

---

### 场景八：临时修改选项（保存/恢复模式）

```bash
# 库函数中临时开启 extglob，执行后恢复原状
use_extglob_temporarily() {
  local restore=0
  shopt -q extglob || { shopt -s extglob; restore=1; }

  # 使用 extglob 特性
  local files=( !(*.bak) )
  echo "有效文件: ${files[*]}"

  [[ $restore -eq 1 ]] && shopt -u extglob
}
```

---

### 场景九：dotglob 处理隐藏文件

```bash
shopt -s dotglob

# 复制目录下所有文件（包括 .gitignore .env 等隐藏文件）
cp -r /source/dir/* /dest/dir/

# 检查目录是否为空（含隐藏文件）
is_empty() {
  local files=("$1"/*)
  [[ ${#files[@]} -eq 0 ]]
}
```

---

### 场景十：varredir_close 自动关闭文件描述符

```bash
shopt -s varredir_close

# 不用 varredir_close：需要手动关闭 fd
exec {fd}> /tmp/output.txt
echo "写入内容" >&$fd
exec {fd}>&-   # 手动关闭

# 用 varredir_close：命令完成后自动关闭 fd
echo "写入内容" >{fd}/tmp/output.txt
# fd 自动关闭，无需 exec {fd}>&-
```
