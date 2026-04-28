---
sidebar_position: 20
---

# Bash `builtin` 命令详解

## 语法

```bash
builtin [shell-builtin [args]]
```

---

## 核心作用

强制调用 shell 内建命令，绕过同名的函数或外部命令。返回值为内建命令的退出状态；若指定的命令不是内建命令，则返回非零。

---

## 典型场景：函数内调用同名内建命令

最常见的用法是**重写内建命令时**，函数内部仍能调用原始内建，避免无限递归：

```bash
# 重写 cd，增加自动 ls 功能
cd() {
  builtin cd "$@"   # 调用真正的 cd，而不是递归调用自身
  ls -la
}
```

不加 `builtin` 时，`cd` 函数会无限递归调用自己。

---

## 常见重写场景

```bash
# 增强 echo，加时间戳
echo() {
  builtin echo "[$(date '+%H:%M:%S')] $*"
}

# 增强 exit，退出前清理
exit() {
  builtin echo "退出前清理..."
  rm -f /tmp/my_lock
  builtin exit "$@"
}

# 增强 pwd，同时记录访问路径
pwd() {
  builtin pwd | tee -a ~/.dir_history
}
```

---

## 验证某命令是否为内建命令

```bash
builtin ls      # 返回非零：ls 是外部命令，不是内建
builtin cd      # 返回 0：cd 是内建命令
builtin echo    # 返回 0：echo 是内建命令
```

---

## 与 `command` 的区别

| 命令 | 跳过函数 | 查找内建 | 查找外部命令 |
|------|----------|----------|--------------|
| `builtin cmd` | 是 | 是 | 否 |
| `command cmd` | 是 | 是 | 是 |

```bash
ls() { echo "自定义 ls"; }

ls             # 输出：自定义 ls（调用函数）
command ls     # 调用 /bin/ls（跳过函数，找外部命令）
builtin ls     # 报错：ls 不是内建命令
builtin echo   # 调用内建 echo（跳过同名函数）
```

---

## 注意事项

- `builtin` 本身也是内建命令
- 只能调用内建命令，不能用于外部命令（`/bin/ls` 等）
- 函数内调用同名内建若不加 `builtin`，会导致无限递归

---

## 返回值

| 情况 | 返回值 |
|------|--------|
| 内建命令执行成功 | 内建命令自身的退出状态 |
| 指定命令不是内建命令 | 非零 |
