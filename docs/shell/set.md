---
sidebar_position: 11
---

# Bash `set` 命令详解

## 是什么 / 主要用途

`set` 是 bash 最核心的内建命令之一，主要做三件事：

1. **控制 shell 行为选项**：开启或关闭影响脚本执行方式的开关（如错误处理、调试追踪、变量检查）
2. **设置位置参数**：用 `set --` 覆盖 `$1 $2 $3...`，常用于解析命令输出
3. **查看 shell 状态**：无参数时列出所有变量和函数，`set -o` 查看所有选项状态

与 `shopt` 的分工：

| | `set` | `shopt` |
|--|-------|---------|
| 标准 | POSIX 标准，所有 POSIX shell 通用 | Bash 专有扩展特性 |
| 典型用途 | 错误退出、调试追踪、变量检查、管道错误 | glob 模式、历史记录、补全、目录切换 |
| 语法 | `set -e` / `set -o errexit` | `shopt -s extglob` |

`set` 覆盖的核心能力域：

- **错误处理**：`-e`（errexit）、`-u`（nounset）、`-o pipefail`
- **调试追踪**：`-x`（xtrace）、`-v`（verbose）、`-n`（noexec 语法检查）
- **变量与环境**：`-a`（allexport）、`-k`（keyword）
- **文件保护**：`-C`（noclobber）防止重定向覆盖
- **trap 继承**：`-E`（errtrace）、`-T`（functrace）
- **位置参数**：`set --` 重设 `$1`~`$N`

---

## 语法

```bash
set [-abefhkmnptuvxBCEHPT] [-o option-name] [--] [-] [argument ...]
set [+abefhkmnptuvxBCEHPT] [+o option-name] [--] [-] [argument ...]
set -o   # 查看所有选项当前状态
set +o   # 输出可复用的 set 命令列表
```

> `-` 开启选项，`+` 关闭选项。当前所有选项状态保存在 `$-` 变量中。

---

## 无参数时的行为

```bash
set        # 显示所有 shell 变量和函数（按 locale 排序，可作为输入复用）
set -o     # 显示所有选项名称及 on/off 状态
set +o     # 输出一系列 set 命令，可复用以恢复当前选项状态
```

---

## 选项说明

### 常用安全选项

| 短选项 | 长选项 | 说明 |
|--------|--------|------|
| `-e` | `errexit` | 命令返回非零时立即退出 |
| `-u` | `nounset` | 使用未定义变量时报错退出 |
| `-x` | `xtrace` | 执行前打印每条命令及其展开结果 |
| `-o pipefail` | `pipefail` | 管道返回值取最后一个非零命令的状态 |

### 其他选项

| 短选项 | 长选项 | 说明 |
|--------|--------|------|
| `-a` | `allexport` | 所有创建/修改的变量自动 export |
| `-b` | `notify` | 后台任务完成时立即报告状态 |
| `-f` | `noglob` | 禁用文件名通配符展开（globbing） |
| `-h` | `hashall` | 执行时缓存命令路径（默认开启） |
| `-k` | `keyword` | 环境变量赋值可放在命令任意位置 |
| `-m` | `monitor` | 启用作业控制 |
| `-n` | `noexec` | 只读取命令不执行（用于语法检查） |
| `-p` | `privileged` | 特权模式，不处理 $ENV/$BASH_ENV |
| `-r` | — | 启用受限 shell 模式（不可关闭） |
| `-t` | `onecmd` | 执行完一条命令后退出 |
| `-v` | `verbose` | 读取时将输入行打印到 stderr |
| `-B` | `braceexpand` | 启用花括号展开（默认开启） |
| `-C` | `noclobber` | 禁止 `>` 覆盖已有文件 |
| `-E` | `errtrace` | ERR trap 被函数/子 shell 继承 |
| `-H` | `histexpand` | 启用 `!` 历史展开（交互式默认开） |
| `-P` | `physical` | cd 使用物理路径，不解析符号链接 |
| `-T` | `functrace` | DEBUG/RETURN trap 被函数继承 |

---

## 实际使用场景

### 1. 生产脚本安全四件套

```bash
#!/bin/bash
set -euo pipefail

# -e：任意命令失败立即退出
# -u：使用未定义变量立即报错
# -o pipefail：管道中任意命令失败都会触发退出
```

各选项作用对比：

```bash
# -e 的效果
set -e
cp /nonexistent /tmp    # 失败，脚本立即退出，后续不执行

# -u 的效果
set -u
echo $UNDEFINED_VAR     # 报错：unbound variable

# pipefail 的效果
set -o pipefail
cat /nonexistent | grep foo   # 没有 pipefail：返回 0（grep 成功）
                 # 有 pipefail：返回非零（cat 失败）
```

---

### 2. 调试脚本（`-x`）

```bash
set -x   # 开启追踪
cp file1 file2
ls -la
set +x   # 关闭追踪
```

输出示例（每行前缀为 `$PS4`，默认 `+`）：

```
+ cp file1 file2
+ ls -la
```

自定义 PS4 显示文件和行号：

```bash
export PS4='[${BASH_SOURCE}:${LINENO}] '
set -x
```

---

### 3. 语法检查不执行（`-n`）

```bash
bash -n script.sh       # 检查语法错误，不执行
# 或在脚本内
set -n
```

---

### 4. 防止覆盖文件（`-C`）

```bash
set -C
echo "data" > existing.txt   # 报错：cannot overwrite existing file
echo "data" >| existing.txt  # 用 >| 强制覆盖
set +C                        # 恢复允许覆盖
```

---

### 5. 所有变量自动导出（`-a`）

```bash
set -a
DB_HOST="localhost"    # 自动 export，无需 export DB_HOST
DB_PORT=5432
source .env            # .env 中的变量也自动导出

set +a
```

---

### 6. 设置位置参数（`--`）

```bash
# 用 set -- 覆盖 $1 $2 $3...
set -- "alpha" "beta" "gamma"
echo $1   # alpha
echo $2   # beta
echo $#   # 3

# 常用于将命令输出解析为位置参数
set -- $(date)
echo "年份: $6"   # 取 date 输出的第6个字段
```

---

### 7. 符号链接处理（`-P`）

```bash
# 默认：跟随逻辑路径
cd /usr/sys    # /usr/sys 是 /usr/local/sys 的符号链接
pwd            # /usr/sys

# -P：使用物理路径
set -P
cd /usr/sys
pwd            # /usr/local/sys
```

---

### 8. ERR/DEBUG/RETURN trap 继承（`-E` / `-T`）

```bash
# -E：让函数继承 ERR trap
set -E
trap 'echo "错误在第 $LINENO 行"' ERR

my_func() {
  cp /nonexistent /tmp   # 没有 -E 时函数内的 ERR trap 不触发
}
my_func   # 有 -E 时正常触发

# -T：让函数继承 DEBUG/RETURN trap（详见 trap 文档）
set -T
trap 'echo "执行前: $BASH_COMMAND"' DEBUG
```

---

### 9. 查看和恢复选项状态

```bash
# 查看当前所有选项
set -o

# 保存当前状态，稍后恢复
OLD_OPTS=$(set +o)   # 输出一系列 set 命令
set -euo pipefail    # 临时修改
# ... 某些操作 ...
eval "$OLD_OPTS"     # 恢复原有状态
```

---

## `-e` 的豁免条件

以下情况失败**不触发** `-e` 退出（与 ERR trap 豁免条件相同）：

- `while` / `until` 循环条件中的命令
- `if` / `elif` 的测试命令
- `&&` / `||` 列表中非最后一个命令
- 管道中非最后一条命令（受 `pipefail` 影响）
- 使用 `!` 取反的命令

```bash
set -e
# 以下不会触发退出
if grep -q "foo" file; then echo "found"; fi
false || true
! false
```

---

## `$-` 变量

当前所有已开启的单字母选项：

```bash
echo $-    # 示例输出：himBHs
# h=hashall, i=interactive, m=monitor, B=braceexpand, H=histexpand, s=stdin
```

---

## 速查表

```bash
set -euo pipefail    # 生产脚本推荐组合
set -x               # 开启调试追踪
set +x               # 关闭调试追踪
set -n               # 语法检查模式
set -C               # 防止重定向覆盖文件
set -a               # 所有变量自动导出
set -T               # 函数继承 DEBUG/RETURN trap
set -E               # 函数继承 ERR trap
set -o               # 查看所有选项状态
set +o               # 输出可复用的选项恢复命令
set -- arg1 arg2     # 重设位置参数
```

---

## 详细使用示例与经典场景

### 场景一：生产脚本完整错误处理模板

```bash
#!/bin/bash
set -euo pipefail

# 结合 trap ERR 输出错误位置
trap 'echo "错误: 第 $LINENO 行命令失败 (exit $?)" >&2' ERR

# 结合 trap EXIT 做清理
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

echo "临时目录: $TMPDIR"
cp /etc/hosts "$TMPDIR/"

# pipefail 效果：整个管道的失败会被捕获
grep "^root" "$TMPDIR/hosts" | awk '{print $1}' | sort
```

---

### 场景二：分段调试（只追踪关键区域）

```bash
#!/bin/bash

echo "这段不追踪"

set -x   # 开始追踪
result=$(curl -s https://api.example.com/status)
status=$(echo "$result" | jq -r '.status')
set +x   # 停止追踪

echo "状态: $status"
echo "这段也不追踪"
```

自定义 PS4 显示更多调试信息：

```bash
export PS4='+[${BASH_SOURCE##*/}:${LINENO}:${FUNCNAME[0]:+${FUNCNAME[0]}()}] '
set -x
# 输出示例：+[deploy.sh:42:check_env()] export APP_ENV=production
```

---

### 场景三：脚本上线前语法检查

```bash
# 不执行，只检查语法
bash -n deploy.sh && echo "语法正确" || echo "有语法错误"

# 结合 -v 查看读取过程（不执行）
bash -nv deploy.sh

# CI 中批量检查
find . -name "*.sh" | xargs -I{} bash -n {} && echo "所有脚本语法正确"
```

---

### 场景四：加载 .env 文件并自动导出

```bash
#!/bin/bash

# set -a 让 source 的变量全部自动 export
set -a
source .env       # DB_HOST=localhost DB_PORT=5432 ...
set +a

# 之后启动的子进程自动继承所有变量
node app.js       # app.js 能读到 process.env.DB_HOST
python server.py  # os.environ['DB_HOST'] 也能读到
```

---

### 场景五：解析命令输出为位置参数

```bash
#!/bin/bash

# 解析日期字段
set -- $(date)
# $1=Mon $2=Apr $3=27 $4=10:30:00 $5=CST $6=2026
echo "今天是 $6 年 $2 月 $3 日"

# 解析 IP 地址
ip_info=$(ip route get 8.8.8.8 | head -1)
set -- $ip_info
# 提取本机出口 IP（字段位置按实际输出调整）
echo "出口 IP: $7"

# 清除位置参数
set --
echo "参数数量: $#"   # 0
```

---

### 场景六：-e 与错误豁免的配合

```bash
#!/bin/bash
set -e

# 这些写法不会触发 -e 退出
# 1. if 条件中
if grep -q "error" /var/log/app.log; then
  echo "发现错误日志"
fi

# 2. || 提供默认值
value=$(cat config.txt 2>/dev/null) || value="default"

# 3. && 链式检查
[ -f config.txt ] && source config.txt

# 4. ! 取反
if ! command -v docker &>/dev/null; then
  echo "docker 未安装" >&2
  exit 1
fi
```

---

### 场景七：保存和恢复选项状态（库函数模式）

```bash
# 库函数中临时修改选项，执行完恢复原状
run_quietly() {
  local saved_opts
  saved_opts=$(set +o)   # 保存当前所有选项
  set +x +v              # 临时关闭追踪和 verbose

  "$@"                   # 执行传入的命令
  local exit_code=$?

  eval "$saved_opts"     # 恢复所有选项
  return $exit_code
}

set -x
echo "追踪中..."
run_quietly cp /etc/hosts /tmp/   # 这条命令不会被追踪
echo "恢复追踪"
```

---

### 场景八：-E 和 -T 配合 trap 做全局错误追踪

```bash
#!/bin/bash
set -E   # ERR trap 被函数继承
set -T   # DEBUG/RETURN trap 被函数继承

# 全局错误处理，函数内的错误也能捕获
trap 'echo "[ERR] ${BASH_SOURCE}:${LINENO} in ${FUNCNAME[0]:-main}" >&2' ERR

validate_config() {
  grep -q "^port=" config.ini   # 如果失败，ERR trap 会报告函数名和行号
}

start_server() {
  validate_config
  echo "启动服务..."
}

start_server
```

---

### 场景九：nounset 与默认值配合

```bash
#!/bin/bash
set -u

# 直接用未定义变量会报错
# echo $UNDEFINED   # 报错：unbound variable

# 正确做法：提供默认值（不触发 -u）
echo "${APP_ENV:-development}"    # 未定义时用 development
echo "${PORT:-8080}"              # 未定义时用 8080
echo "${DEBUG:+--debug}"         # 已定义时才展开

# 数组也需要注意
args=()
echo "${args[@]+"${args[@]}"}"   # 空数组的安全展开写法
```

---

### 场景十：pipefail 与管道错误处理

```bash
#!/bin/bash
set -eo pipefail

# 没有 pipefail 时，管道整体返回最后一条命令的状态
# cat 失败但 grep 成功 → 整体返回 0，-e 不触发
cat /nonexistent | grep "foo"   # 有 pipefail → 非零，脚本退出

# 实际场景：数据处理管道
process_data() {
  mysql -u root -p"$DB_PASS" mydb \
    | grep -v "^#" \
    | awk '{print $1,$3}' \
    | sort -u \
    > output.csv
  # 任意一步失败，整体失败
}

# 特意忽略某条管道错误
{ cat /nonexistent || true; } | grep "foo"
```
