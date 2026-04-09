---
date: '2025-06-11T23:23:05+08:00'
title: 'Shell 脚本中为何使用 `{ ... }` 包裹整个脚本'
description: ""
summary: ""
tags: ["shell"]
categories: ["shell"]
series: ["Post"]
ShowToc: true
TocOpen: true
---

## 📌 问题

在一些 Shell 脚本中，常常看到以下结构：

```bash
#!/usr/bin/env bash

{ # this ensures the entire script is downloaded #

# 脚本内容
some_function() {
  echo "Hello"
}
some_function

} # this ensures the entire script is downloaded #
```

为什么要用 `{ ... }` 把整个脚本包裹起来？这样做有什么好处？

---

## ✅ 答案

这是一个 **Shell 脚本技巧**，主要用于：

> **确保整个脚本在下载完成并被完全解析之后再执行**

---

## 🧠 原因解释

在执行远程脚本时，例如：

```bash
curl -s https://example.com/script.sh | bash
```

脚本是以**流式方式**传给 `bash` 的，会出现：

- 边下载边执行
- 如果下载中断，脚本会只执行了一部分
- 函数定义、变量赋值可能不完整，甚至执行危险命令

---

## 🛡 加上 `{ ... }` 的作用

使用大括号包裹：

```bash
{
  # 所有脚本内容
}
```

等于告诉 `bash`：

> **先把整个代码块读完并确认语法完整后再执行**，否则不执行。

这样做能显著提升远程执行脚本时的稳定性与安全性。

---

## 📦 使用场景

- 在线安装脚本（nvm、rustup、rvm 等）
- 托管在 GitHub/Gitee 的 `curl | bash` 脚本
- 对完整性有要求的初始化脚本

---

## ✅ 示例对比

### ❌ 没有使用 `{}`（可能部分执行）

```bash
#!/usr/bin/env bash

setup_env
# 假设这里还没下载完或中断
install_dependencies
```

> 如果网络中断，`bash` 已经开始执行 `setup_env`，但后续内容丢失。

---

### ✅ 使用 `{}`（确保完整执行）

```bash
#!/usr/bin/env bash
{
  setup_env
  install_dependencies
}
```

> Shell 会完整解析完 `{}` 里的内容后，才开始执行其中的命令。

---

## ✍ 总结

> 使用 `{ ... }` 包裹整个脚本体是一种防御式编程技巧，适用于通过管道执行的脚本（如 `curl | bash`），可以避免部分执行带来的错误或风险。

建议你在所有在线执行脚本中使用这种结构，尤其是涉及部署或安装操作时。
