---
sidebar_position: 14
---

# Bash `caller` 命令详解

## 语法

```bash
caller [expr]
```

---

## 核心作用

在**函数内部**或 **`source` 执行的脚本**中调用，返回当前调用栈的信息（行号、函数名、文件名）。常用于调试和错误追踪。

- 不带参数：返回最近一层调用的信息
- `expr` 为数字：指定调用栈深度（0 = 当前层，1 = 上一层，依此类推）

---

## 输出格式

```
行号  函数名  文件名
```

```bash
foo() {
  caller 0    # 示例输出：8 foo script.sh
}
```

---

## 返回值

| 情况 | 返回值 |
|------|--------|
| 成功输出调用信息 | `0` |
| 不在函数内调用，或栈深度超出范围 | 非零（无输出） |

> `expr` 超过栈深度时静默返回非零，可用此特性控制 `while caller $i` 的循环终止。

---

## 经典使用场景

### 1. 统一错误处理，定位出错位置

```bash
#!/bin/bash

error() {
  read -r line func file <<< $(caller 0)
  echo "错误 [$file:$line in $func()]: $1" >&2
  exit 1
}

load_config() {
  [ -f "$1" ] || error "配置文件不存在: $1"
}

load_config /etc/missing.conf
# 输出：错误 [script.sh:10 in load_config()]: 配置文件不存在: /etc/missing.conf
```

---

### 2. 打印完整调用栈（辅助调试）

```bash
#!/bin/bash

stacktrace() {
  local i=0
  echo "=== 调用栈 ===" >&2
  while caller $i 2>/dev/null; do
    ((i++))
  done | awk '{print NR"  "$0}' >&2
}

c() { stacktrace; }
b() { c; }
a() { b; }
a
```

输出：
```
=== 调用栈 ===
1  4  c  stack.sh
2  5  b  stack.sh
3  6  a  stack.sh
4  7  main  stack.sh
```

---

### 3. 断言函数（测试脚本中定位失败位置）

```bash
#!/bin/bash

assert_eq() {
  local expected="$1" actual="$2"
  if [ "$expected" != "$actual" ]; then
    read -r line func file <<< $(caller 0)
    echo "FAIL [$file:$line]: 期望 '$expected'，实际 '$actual'" >&2
    exit 1
  fi
}

test_add() {
  result=$((1 + 1))
  assert_eq 3 "$result"   # 故意写错
}
test_add
# 输出：FAIL [test.sh:14]: 期望 '3'，实际 '2'
```

---

### 4. 函数调用日志（追踪执行路径）

```bash
#!/bin/bash

log_call() {
  read -r line func file <<< $(caller 1)   # caller 1 获取调用方的调用方
  echo "[TRACE] $func() 被 $file:$line 调用" >> /tmp/trace.log
}

deploy() {
  log_call
  echo "执行部署..."
}

deploy
# /tmp/trace.log 中记录：[TRACE] deploy() 被 script.sh:12 调用
```

---

### 5. 限制函数只能被特定函数调用

```bash
#!/bin/bash

_internal_only() {
  read -r _ caller_func _ <<< $(caller 0)
  if [ "$caller_func" != "allowed_func" ]; then
    echo "错误：_internal_only 只能由 allowed_func 调用，当前调用者: $caller_func" >&2
    return 1
  fi
  echo "执行内部逻辑..."
}

allowed_func() { _internal_only; }
bad_func()     { _internal_only; }

allowed_func   # 正常执行
bad_func       # 报错：错误：_internal_only 只能由 allowed_func 调用，当前调用者: bad_func
```

---

### 6. 检测脚本是被 `source` 还是直接执行

```bash
# lib.sh
_check_sourced() {
  if caller 0 &>/dev/null; then
    read -r line _ file <<< $(caller 0)
    echo "lib.sh 被 $file 第 $line 行 source 加载"
  else
    echo "错误：lib.sh 必须用 source 加载，不能直接执行" >&2
    exit 1
  fi
}
_check_sourced
```

---

## 注意事项

- 只能在**函数内部**或 **`source` 执行的脚本**中使用，顶层直接调用无输出且返回非零
- 重定向到 stderr 必须用 `>&2`，不能写成 `> &2`（空格导致语法错误）
- `caller 0` 返回的是调用**当前函数**的位置，`caller 1` 返回调用**上一层函数**的位置
