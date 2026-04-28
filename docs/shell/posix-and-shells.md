---
sidebar_position: 2
---

# POSIX 标准与 Shell 详解

## POSIX 是什么

**POSIX**（Portable Operating System Interface）是由 IEEE（电气和电子工程师协会）制定的一系列标准，正式编号为 **IEEE Std 1003**，目标是让软件在不同的类 Unix 系统之间可移植。

名字里的 "X" 是 Unix 的意思，由 Richard Stallman 建议加上。可以把它理解为一份**合同**：实现了 POSIX 的系统，遵循标准编写的程序就能跨平台运行。

---

## 历史背景

```
1969  Unix 诞生（Bell Labs，Ken Thompson + Dennis Ritchie）
      │
1970s 各公司开始基于 Unix 派生自己的系统
      ├─ BSD（加州大学伯克利分校）
      ├─ System V（AT&T）
      ├─ AIX（IBM）
      ├─ HP-UX（HP）
      └─ SunOS（Sun）

      问题：各家实现不兼容，同一个程序在不同系统上跑不起来

1988  IEEE 发布 POSIX.1，统一接口标准
1997  Single UNIX Specification (SUS) 与 POSIX 合并
2001  POSIX:2001 / SUSv3（现代 POSIX 的基础）
2008  POSIX:2008（当前主流版本，又叫 SUSv4）
```

---

## POSIX 标准覆盖的内容

POSIX 不只是 shell 标准，它定义了整个操作系统的接口层：

### 1. C 语言 API（系统调用接口）

```c
fork()      // 创建子进程
exec()      // 执行程序
open()      // 打开文件
read()      // 读文件
write()     // 写文件
pipe()      // 创建管道
signal()    // 信号处理
pthread_*() // 线程相关
```

### 2. Shell 语言规范

```sh
# 条件判断
if [ -f file ]; then
  echo "exists"
fi

# 循环
for i in 1 2 3; do
  echo $i
done

# 函数定义
func() {
  return 0
}
```

### 3. 命令行工具规范

POSIX 规定了这些工具必须存在且行为一致：

| 类别     | 工具                                 |
| -------- | ------------------------------------ |
| 文件操作 | `ls` `cp` `mv` `rm` `mkdir` `find`   |
| 文本处理 | `grep` `sed` `awk` `sort` `cut` `tr` |
| 进程管理 | `ps` `kill` `wait`                   |
| 压缩归档 | `tar` `cpio`                         |
| 编译开发 | `make` `cc` `ar`                     |
| Shell    | `sh` `echo` `test` `expr`            |

### 4. 文件系统结构

```
/       根目录
/bin    基本命令
/etc    配置文件
/tmp    临时文件
/usr    用户程序
/var    可变数据
```

### 5. 正则表达式规范

POSIX 定义了两种正则：

```bash
# BRE（Basic Regular Expression）
grep "a\{3\}" file    # 匹配 aaa

# ERE（Extended Regular Expression）
grep -E "a{3}" file   # 匹配 aaa
```

---

## POSIX Shell 具体规定了什么

### 变量展开

```sh
${var}           # 基本展开
${var:-default}  # 未定义时用默认值
${var:=default}  # 未定义时赋值并展开
${var:?error}    # 未定义时报错退出
${var:+other}    # 已定义时展开 other
${#var}          # 变量长度
${var%pattern}   # 从右删除最短匹配
${var%%pattern}  # 从右删除最长匹配
${var#pattern}   # 从左删除最短匹配
${var##pattern}  # 从左删除最长匹配
```

### POSIX 没有的（bash/zsh 扩展）

```bash
${var/old/new}    # 字符串替换  ← bash 扩展
${var^^}          # 转大写      ← bash 扩展
declare -A map    # 关联数组    ← bash 扩展
[[ ]]             # 增强条件    ← bash 扩展
(( ))             # 算术命令    ← bash 扩展（POSIX 只有 $(( ))）
shopt             # shell 选项  ← bash 扩展
```

### 特殊内建命令（Special Built-in Utilities）

POSIX 将以下命令列为特殊内建，与普通命令有三点核心差异：

```
break  :  .  continue  eval  exec  exit
export  readonly  return  set  shift  times  trap  unset
```

**差异一：命令前的变量赋值会持久化**

```sh
# 普通命令：var 只在该命令作用域内有效
var=hello echo "$var"   # 空

# 特殊内建：var 持久保留在当前 shell
var=hello export PATH
echo "$var"             # hello
```

**差异二：错误会导致 shell 退出（POSIX 模式下）**

```bash
set -o posix

readonly x=1
x=2           # 错误：赋值只读变量，shell 立即退出

cd /nonexistent   # 普通内建失败，shell 继续执行
echo "还在运行"   # 会执行
```

**差异三：函数无法覆盖特殊内建（POSIX 模式下）**

```bash
# bash 默认模式：函数可以覆盖
exit() { echo "拦截了 exit"; }
exit   # 输出"拦截了 exit"，不真正退出

# POSIX 模式：特殊内建优先，函数覆盖无效
set -o posix
exit() { echo "拦截了 exit"; }
exit   # 直接退出，函数被忽略
```

---

## 各 Shell 与 POSIX 的关系

### 演化谱系

```
Thompson sh（1971，Unix 原始 shell）
    │
    ├─→ Bourne sh（1979，/bin/sh 的起源）
    │       │
    │       ├─→ POSIX sh 标准（1988，以 Bourne sh 为基础制定）
    │       │       ├─→ dash（严格 POSIX，轻量快速，Ubuntu 的 /bin/sh）
    │       │       └─→ sh（各系统的 /bin/sh）
    │       │
    │       ├─→ ksh（Korn Shell，1983，贡献了大量特性给 POSIX）
    │       │
    │       └─→ bash（1989，GNU，POSIX 兼容 + 大量扩展）
    │               └─→ zsh（1990，兼容 bash/ksh + 更多扩展）
    │
    └─→ csh（1978，独立分支，不兼容 POSIX）
            └─→ tcsh（csh 改进版）
```

### 各 Shell 对 POSIX 的支持程度

| Shell          | POSIX 支持 | 说明                                      |
| -------------- | ---------- | ----------------------------------------- |
| `dash`         | 严格遵守   | Ubuntu 的 `/bin/sh`，几乎无扩展，速度最快 |
| `sh`           | 直接实现   | 通常是 dash 或 bash 的软链接              |
| `bash`         | 兼容并扩展 | 默认有扩展，`set -o posix` 切换严格模式   |
| `zsh`          | 基本兼容   | 默认行为有差异，`emulate sh` 切换兼容模式 |
| `ksh`          | 高度兼容   | POSIX 标准的重要参考来源                  |
| `csh` / `tcsh` | 不兼容     | 独立分支，语法完全不同                    |

### csh 是个特例

`csh` 语法仿照 C 语言，与 POSIX shell 完全不兼容：

```csh
set name = "world"
if ($name == "world") then
  echo "hello $name"
endif

foreach i (1 2 3)
  echo $i
end
```

业界著名文章 _"Csh Programming Considered Harmful"_ 明确建议不要用 csh 写脚本。`tcsh` 是 csh 的改进版，主要用作交互式 shell。

---

## bash 与 zsh 的扩展对比

同样的功能，POSIX 写法 vs 各 Shell 扩展写法：

```bash
# ── 递归查找文件 ──────────────────────────────
# POSIX（sh/dash/bash/zsh 都能用）
for f in $(find . -name "*.sh"); do
  echo "$f"
done

# bash 扩展
shopt -s globstar
for f in **/*.sh; do
  echo "$f"
done

# ── 关联数组 ──────────────────────────────────
# POSIX：不支持

# bash 扩展
declare -A map
map[key]="value"
echo ${map[key]}

# ── 字符串替换 ────────────────────────────────
# POSIX
echo "$var" | sed 's/old/new/'

# bash 扩展
echo "${var/old/new}"

# ── 条件判断 ──────────────────────────────────
# POSIX
if [ "$a" = "$b" ] && [ -f "$file" ]; then ...

# bash 扩展
if [[ "$a" == "$b" && -f "$file" ]]; then ...
```

---

## 符合 POSIX 的系统

| 系统    | 说明                            |
| ------- | ------------------------------- |
| macOS   | 通过官方 POSIX 认证（基于 BSD） |
| AIX     | IBM，通过认证                   |
| HP-UX   | HP，通过认证                    |
| Solaris | Oracle，通过认证                |
| Linux   | 未通过官方认证，但行为高度兼容  |
| Windows | 不符合，WSL 是变通方案          |

> Linux 没有通过官方 POSIX 认证的原因是认证费用昂贵，而非技术上不兼容。

---

## 命令查找顺序

| 模式       | 查找顺序                                         |
| ---------- | ------------------------------------------------ |
| bash 默认  | 别名 → 函数 → 内建（含特殊内建）→ 外部命令       |
| POSIX 模式 | 别名 → **特殊内建** → 函数 → 普通内建 → 外部命令 |

---

## 实际使用建议

| 场景                 | 推荐                | 原因                                    |
| -------------------- | ------------------- | --------------------------------------- |
| 需要跨平台移植的脚本 | `#!/bin/sh`         | 只用 POSIX 语法，dash/bash/zsh 均可运行 |
| 只在 Linux/Mac 运行  | `#!/bin/bash`       | 可用 bash 扩展，功能更强                |
| 交互式终端           | zsh / bash          | 扩展特性让日常操作更便捷                |
| 系统启动脚本         | `#!/bin/sh`（dash） | 速度快，无额外依赖                      |
| 检查脚本可移植性     | `shellcheck`        | 自动检测非 POSIX 用法                   |

### 检查脚本是否符合 POSIX

```bash
# 安装 shellcheck
brew install shellcheck          # macOS
apt-get install shellcheck       # Ubuntu

# 检查脚本
shellcheck -s sh script.sh       # 按 POSIX sh 标准检查
shellcheck -s bash script.sh     # 按 bash 标准检查

# bash 中临时切换 POSIX 模式测试
set -o posix
# ... 执行脚本 ...
set +o posix
```

### 判断当前 shell 是否为 POSIX 模式

```bash
# bash 中检查
[[ $POSIXLY_CORRECT ]] && echo "POSIX 模式" || echo "bash 扩展模式"

# zsh 中切换兼容模式
emulate sh        # 模拟 POSIX sh
emulate zsh       # 恢复 zsh 模式
emulate bash      # 模拟 bash
```

---

## 一句话总结

POSIX 是 Unix 世界的"语言标准"——就像 ECMAScript 之于 JavaScript，POSIX 定义了 Unix 系统必须提供什么接口。Shell 只是 POSIX 标准的一部分，它同时还规定了 C API、命令行工具、文件系统结构等整个操作系统层面的接口。各 Shell（bash、zsh、ksh）在兼容 POSIX 的基础上各自扩展，`csh` 是唯一走了完全不同路线的主流 shell。
