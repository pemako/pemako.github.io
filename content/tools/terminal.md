---
date: '2026-04-09T20:00:00+08:00'
title: '终端原理'
description: ""
summary: ""
tags: ["terminal"]
categories: ["tools"]
series: ["Tools"]
ShowToc: true
TocOpen: true
---

# Go 终端编程原理详解

> 基于 `golang.org/x/term` 和 `github.com/creack/pty` 的完整技术文档

---

## 目录

1. [终端基础概念](#1-终端基础概念)
2. [文件描述符](#2-文件描述符)
3. [termios：终端 I/O 控制](#3-termios终端-io-控制)
4. [Cooked 模式 vs Raw 模式](#4-cooked-模式-vs-raw-模式)
5. [golang.org/x/term API 详解](#5-golangorgxterm-api-详解)
6. [PTY（伪终端）原理](#6-pty伪终端原理)
7. [完整示例解析](#7-完整示例解析)
8. [常见问题与最佳实践](#8-常见问题与最佳实践)
9. [参考资料](#9-参考资料)

---

## 1. 终端基础概念

### 什么是终端（Terminal）

终端最初是物理设备（电传打字机、CRT 显示器），通过串口连接到主机，用于输入命令和查看输出。现代操作系统中的"终端"是对这一概念的软件模拟，称为**终端模拟器**（Terminal Emulator），如 macOS 的 Terminal.app、iTerm2，Linux 上的 GNOME Terminal 等。

```
用户键盘输入
   │
   ▼
┌─────────────┐      ┌──────────────┐      ┌─────────┐
│  终端模拟器   │─────▶│  TTY 驱动层   │─────▶│  进程   │
│ (Terminal)  │◀─────│  (内核)       │◀─────│ (Shell) │
└─────────────┘      └──────────────┘      └─────────┘
   │
   ▼
屏幕显示输出
```

### TTY 与终端设备文件

在 Linux/macOS 中，终端通过特殊的设备文件暴露给进程：

```bash
# 查看当前终端对应的设备文件
$ tty
/dev/ttys003    # macOS 示例
/dev/pts/0      # Linux 示例
```

每个终端会话对应一个 `/dev/tty*` 或 `/dev/pts/*` 设备文件。进程通过读写这些文件与终端交互，而 TTY 驱动层（内核中）负责处理回显、行缓冲、信号等逻辑。

---

## 2. 文件描述符

### 什么是文件描述符（File Descriptor）

文件描述符（fd）是内核为每个进程维护的一个非负整数，代表一个打开的 I/O 资源（文件、socket、管道、终端等）。进程通过 fd 进行读写操作，不直接接触底层设备。

### 标准文件描述符

Unix/Linux 规定每个进程启动时默认打开三个文件描述符：

| fd 编号 | 符号常量        | 含义     | Go 对应     |
| ------- | --------------- | -------- | ----------- |
| `0`     | `STDIN_FILENO`  | 标准输入 | `os.Stdin`  |
| `1`     | `STDOUT_FILENO` | 标准输出 | `os.Stdout` |
| `2`     | `STDERR_FILENO` | 标准错误 | `os.Stderr` |

### 在 Go 中获取文件描述符

```go
package main

import (
  "fmt"
  "os"
)

func main() {
  // os.File 类型有 Fd() 方法，返回 uintptr
  // 需要转换为 int 才能传给 term 包的函数
  stdinFd  := int(os.Stdin.Fd())   // 通常为 0
  stdoutFd := int(os.Stdout.Fd())  // 通常为 1
  stderrFd := int(os.Stderr.Fd())  // 通常为 2

  fmt.Printf("stdin  fd: %d\n", stdinFd)
  fmt.Printf("stdout fd: %d\n", stdoutFd)
  fmt.Printf("stderr fd: %d\n", stderrFd)
}
```

### 为什么 term 包函数接收 fd 而不是 \*os.File

`golang.org/x/term` 的函数接收 `int` 类型的 fd，而非 `*os.File`，原因是：

1. **底层系统调用**：`termios` 等系统调用直接操作 fd 编号（`tcgetattr(fd, ...)`）
2. **灵活性**：可以操作任意打开的终端 fd，不限于标准流
3. **跨平台统一**：Windows 的 Console API 同样接受句柄（handle），fd 是更通用的抽象

---

## 3. termios：终端 I/O 控制

### termios 是什么

`termios`（Terminal I/O Settings）是 POSIX 定义的终端属性控制接口。它是一个结构体，包含描述终端行为的所有标志位。通过读写这个结构体，程序可以精确控制终端如何处理输入和输出。

### termios 结构体（简化版）

```c
// C 语言定义（Linux/macOS）
struct termios {
  tcflag_t c_iflag;   // 输入模式标志  (Input flags)
  tcflag_t c_oflag;   // 输出模式标志  (Output flags)
  tcflag_t c_cflag;   // 控制模式标志  (Control flags)
  tcflag_t c_lflag;   // 本地模式标志  (Local flags) — 最重要
  cc_t     c_cc[NCCS]; // 控制字符     (Control characters)
  // ... 波特率等字段
};
```

### 关键标志位说明

#### c_lflag（本地模式，最常用）

| 标志     | 含义               | 设置后效果                              |
| -------- | ------------------ | --------------------------------------- |
| `ECHO`   | 回显输入字符       | 用户输入时在终端上显示字符              |
| `ICANON` | 规范（行缓冲）模式 | 按 Enter 后才将数据发送给程序           |
| `ISIG`   | 处理信号字符       | Ctrl+C 发送 SIGINT，Ctrl+Z 发送 SIGTSTP |
| `IEXTEN` | 扩展处理           | 启用 Ctrl+V 等扩展输入字符              |

#### c_iflag（输入模式）

| 标志    | 含义                                  |
| ------- | ------------------------------------- |
| `ICRNL` | 将输入的 CR（\r）转换为 NL（\n）      |
| `IXON`  | 启用 XON/XOFF 流控制（Ctrl+S/Ctrl+Q） |

### 系统调用接口

```c
// C 系统调用
#include <termios.h>

// 读取终端属性
int tcgetattr(int fd, struct termios *termios_p);

// 设置终端属性
// action: TCSANOW(立即生效) / TCSADRAIN(排空后生效) / TCSAFLUSH(清空后生效)
int tcsetattr(int fd, int action, const struct termios *termios_p);
```

### Go 中的等价操作（golang.org/x/sys/unix）

```go
package main

import (
  "fmt"
  "os"
  "golang.org/x/sys/unix"
)

func showTermiosFlags() {
  fd := int(os.Stdin.Fd())

  // 读取当前 termios 属性
  termios, err := unix.IoctlGetTermios(fd, unix.TIOCGETA) // macOS
  // termios, err := unix.IoctlGetTermios(fd, unix.TCGETS) // Linux
  if err != nil {
    panic(err)
  }

  fmt.Printf("c_lflag: 0x%08X\n", termios.Lflag)

  // 检查各标志位
  if termios.Lflag & unix.ECHO != 0 {
    fmt.Println("ECHO: 开启（输入会回显）")
  }
  if termios.Lflag & unix.ICANON != 0 {
    fmt.Println("ICANON: 开启（行缓冲模式）")
  }
  if termios.Lflag & unix.ISIG != 0 {
    fmt.Println("ISIG: 开启（处理 Ctrl+C 等信号）")
  }
}
```

### golang.org/x/term 如何实现 MakeRaw

`term.MakeRaw()` 的内部逻辑（简化）：

```go
// 等价于 term.MakeRaw 的手动实现（仅作说明，实际请使用 term.MakeRaw）
func makeRawManual(fd int) (*term.State, error) {
  // 1. 读取当前状态（保存备份）
  termios, _ := unix.IoctlGetTermios(fd, unix.TIOCGETA)
  oldState := *termios  // 深拷贝

  // 2. 修改为 Raw 模式
  // 关闭回显、行缓冲、信号处理、扩展处理
  termios.Lflag &^= unix.ECHO | unix.ECHONL | unix.ICANON | unix.ISIG | unix.IEXTEN
  // 关闭输入转换
  termios.Iflag &^= unix.ICRNL | unix.INPCK | unix.ISTRIP | unix.IXON
  // 设置字符大小为 8 位
  termios.Cflag |= unix.CS8
  // VMIN=1: 读取至少 1 个字符才返回
  // VTIME=0: 不设置超时
  termios.Cc[unix.VMIN] = 1
  termios.Cc[unix.VTIME] = 0

  // 3. 应用新状态
  unix.IoctlSetTermios(fd, unix.TIOCSETA, termios)

  // 返回旧状态，用于后续恢复
  // return &term.State{oldState}, nil  // (实际 State 字段是私有的)
  return nil, nil
}
```

---

## 4. Cooked 模式 vs Raw 模式

### Cooked 模式（规范模式 / Canonical Mode）

Cooked 是终端的**默认**工作模式，由 TTY 驱动层在内核中处理大量输入逻辑：

| 特性             | 说明                                                 |
| ---------------- | ---------------------------------------------------- |
| **行缓冲**       | 输入存在内核缓冲区，按 Enter 后才整行发给程序        |
| **回显（Echo）** | 每个字符输入后立即显示在终端上                       |
| **行编辑**       | Backspace 删除字符、Ctrl+W 删除单词、Ctrl+U 删除整行 |
| **信号处理**     | Ctrl+C → SIGINT，Ctrl+Z → SIGTSTP，Ctrl+\ → SIGQUIT  |
| **CR/LF 转换**   | 输入的 \r 转为 \n，输出的 \n 转为 \r\n               |

```go
// Cooked 模式示例（默认，无需特殊设置）
package main

import (
  "fmt"
)

func main() {
  fmt.Print("请输入（Cooked 模式，按 Enter 结束）: ")

  var input string
  fmt.Scanln(&input)  // 程序在此阻塞，直到用户按 Enter

  // 期间用户可以：
  // - 看到自己输入的字符（回显）
  // - 用 Backspace 修改错误
  // - 按 Ctrl+C 终止程序
  fmt.Printf("收到: %q\n", input)
}
```

### Raw 模式（原始模式）

Raw 模式绕过 TTY 驱动层的所有处理，程序直接收到每个字节：

| 特性         | 说明                                                 |
| ------------ | ---------------------------------------------------- |
| **无缓冲**   | 每个字符立即发送给程序，无需等 Enter                 |
| **无回显**   | 输入字符不显示在终端上                               |
| **无行编辑** | Backspace 等键作为普通字节（0x7F 或 0x08）发送给程序 |
| **无信号**   | Ctrl+C 不发信号，程序需手动检测字节 `0x03`           |
| **无转换**   | \r 和 \n 按原样传递                                  |

```go
// Raw 模式示例
package main

import (
  "fmt"
  "os"
  "golang.org/x/term"
)

func main() {
  fd := int(os.Stdin.Fd())

  // 切换到 Raw 模式，保存旧状态
  oldState, err := term.MakeRaw(fd)
  if err != nil {
    panic(err)
  }
  // 用 defer 确保即使 panic 也能恢复
  defer term.Restore(fd, oldState)

  fmt.Print("Raw 模式，逐字符读取（按 q 退出）:\r\n")

  buf := make([]byte, 1)
  for {
    n, err := os.Stdin.Read(buf)
    if err != nil || n == 0 {
      break
    }

    ch := buf[0]

    // 手动处理 Ctrl+C（字节值 3）
    if ch == 3 {
      fmt.Print("\r\n收到 Ctrl+C，退出\r\n")
      return
    }

    // 手动处理退出
    if ch == 'q' || ch == 'Q' {
      fmt.Print("\r\n退出\r\n")
      return
    }

    // 注意：Raw 模式下换行需要 \r\n，仅 \n 只换行不回车
    fmt.Printf("收到: %c (0x%02X)\r\n", ch, ch)
  }
}
```

### 两种模式的数据流对比

```
键盘输入: H e l l o Backspace W Enter

Cooked 模式数据流:
  内核缓冲区:  H e l l o → 删除 o → H e l l W
  程序收到:    "HellW\n"  （按 Enter 后一次性收到整行）

Raw 模式数据流:
  程序依次收到: 'H' 'e' 'l' 'l' 'o' 0x7F 'W' '\r'
        （每个字节立即收到，包括退格键的原始字节）
```

### 为什么密码输入需要 Raw 模式

`term.ReadPassword()` 的核心需求是**关闭回显**（不显示输入字符）。这通过修改 `c_lflag` 中的 `ECHO` 标志实现，通常同时也关闭 `ICANON`（行缓冲）以获得更精细的控制。

---

## 5. golang.org/x/term API 详解

### 安装

```bash
go get golang.org/x/term
```

### 核心 API

#### `term.IsTerminal(fd int) bool`

检查给定的 fd 是否连接到一个终端设备。常用于判断程序是否在交互式终端中运行（而非被管道重定向）。

```go
package main

import (
  "fmt"
  "os"
  "golang.org/x/term"
)

func main() {
  stdinFd := int(os.Stdin.Fd())

  if term.IsTerminal(stdinFd) {
    fmt.Println("运行在交互式终端中，可以使用终端控制功能")
  } else {
    // 例如：echo "hello" | go run main.go
    fmt.Println("stdin 被重定向（管道/文件），不是终端")
    // 此时调用 term.MakeRaw 等会失败
  }
}
```

**底层原理**：调用 `isatty(fd)` 系统调用，它尝试对 fd 执行 `tcgetattr()`，成功则是终端，失败（`ENOTTY`）则不是。

#### `term.GetSize(fd int) (width, height int, err error)`

获取终端的列数和行数（字符单位）。

```go
package main

import (
  "fmt"
  "os"
  "golang.org/x/term"
)

func main() {
  width, height, err := term.GetSize(int(os.Stdout.Fd()))
  if err != nil {
    fmt.Println("获取终端大小失败:", err)
    return
  }
  fmt.Printf("终端大小: %d 列 × %d 行\n", width, height)

  // 实际应用：绘制分隔线
  for i := 0; i < width; i++ {
    fmt.Print("─")
  }
  fmt.Println()
}
```

**底层原理**：通过 `ioctl(fd, TIOCGWINSZ, &winsize)` 系统调用获取 `winsize` 结构体：

```c
struct winsize {
  unsigned short ws_row;    // 行数
  unsigned short ws_col;    // 列数
  unsigned short ws_xpixel; // 像素宽（通常为 0）
  unsigned short ws_ypixel; // 像素高（通常为 0）
};
```

#### `term.MakeRaw(fd int) (*State, error)`

将终端切换为 Raw 模式，返回切换前的状态（`*State`）。`State` 是一个不透明类型，封装了 `termios` 结构体，只能通过 `Restore()` 使用。

```go
package main

import (
  "fmt"
  "os"
  "golang.org/x/term"
)

func main() {
  fd := int(os.Stdin.Fd())

  // MakeRaw 会：
  // 1. 调用 tcgetattr(fd) 读取当前状态
  // 2. 修改标志位（关闭 ECHO、ICANON、ISIG 等）
  // 3. 调用 tcsetattr(fd, TCSANOW) 立即应用
  // 4. 返回第 1 步保存的旧状态
  oldState, err := term.MakeRaw(fd)
  if err != nil {
    panic(err)
  }
  defer term.Restore(fd, oldState) // 必须恢复！

  fmt.Print("现在是 Raw 模式\r\n")
  // ... 在 Raw 模式下做事情
}
```

#### `term.Restore(fd int, state *State) error`

将终端恢复到 `MakeRaw()` 之前的状态。

```go
// 正确的状态恢复模式
oldState, err := term.MakeRaw(fd)
if err != nil {
  return err
}
// 方式 1：defer（推荐，即使 panic 也会执行）
defer term.Restore(fd, oldState)

// 方式 2：手动（需要确保所有代码路径都调用）
// 注意：不要使用 defer 时，记得在每个 return 前调用
// term.Restore(fd, oldState)
```

**底层原理**：直接调用 `tcsetattr(fd, TCSADRAIN, savedTermios)` 将保存的 `termios` 结构体写回。

#### `term.ReadPassword(fd int) ([]byte, error)`

最简单、最常用的密码读取函数。内部逻辑：

1. 读取当前终端状态
2. 关闭 `ECHO` 标志（不回显）
3. 读取一行输入（直到 `\n` 或 `\r`）
4. 恢复终端状态
5. 返回读取的字节（不含换行符）

```go
package main

import (
  "fmt"
  "os"
  "golang.org/x/term"
)

func main() {
  fmt.Print("密码: ")

  // 注意：ReadPassword 不会在行尾打印换行
  // 调用后需要手动 fmt.Println()
  password, err := term.ReadPassword(int(os.Stdin.Fd()))
  if err != nil {
    fmt.Println("\n错误:", err)
    return
  }

  fmt.Println() // 补充换行，避免下一行输出紧跟在密码提示后面

  // password 是 []byte，包含用户输入的原始字节
  // 生产环境不应打印密码！这里仅作演示
  fmt.Printf("密码长度: %d\n", len(password))
}
```

#### `term.NewTerminal(c io.ReadWriter, prompt string) *Terminal`

创建一个支持行编辑的终端对象，通常与 Raw 模式配合用于构建交互式 shell。

```go
package main

import (
  "fmt"
  "os"
  "golang.org/x/term"
)

func main() {
  fd := int(os.Stdin.Fd())
  oldState, err := term.MakeRaw(fd)
  if err != nil {
    panic(err)
  }
  defer term.Restore(fd, oldState)

  // NewTerminal 内部实现了行编辑（左右方向键、历史记录等）
  t := term.NewTerminal(os.Stdin, "> ")

  for {
    line, err := t.ReadLine()
    if err != nil {
      break
    }
    if line == "exit" {
      break
    }
    fmt.Fprintln(t, "你输入了: "+line)
  }
}
```

---

## 6. PTY（伪终端）原理

### 什么是 PTY

PTY（Pseudo-Terminal，伪终端）是一对虚拟设备，由内核提供：

- **Master 端（ptmx）**：通常由终端模拟器或程序控制，负责读写数据、设置窗口大小等
- **Slave 端（pts/N）**：看起来像一个普通终端，运行的程序（shell）对 slave 进行读写

```
┌──────────────────────────────────────────────────────┐
│                      内核                             │
│                                                      │
│  ┌─────────────────────────────────────────────┐     │
│  │              PTY 驱动层                      │     │
│  │                                             │     │
│  │  /dev/ptmx (master)  ←→  /dev/pts/N (slave) │     │
│  └─────────────────────────────────────────────┘     │
│          ↑                        ↑                  │
└──────────┼────────────────────────┼──────────────────┘
           │                        │
	  ┌─────┴───────┐          ┌─────┴────────┐
	  │  父进程      │          │   子进程      │
	  │ (你的程序)   │          │   (bash 等)   │
	  │             │          │              │
	  │ 读: 子进程输出│          │ stdin/stdout │
	  │ 写: 向子进程输入│        │   → pts/N    │
	  └─────────────┘          └──────────────┘
```

### PTY 的用途

1. **SSH 服务端**：SSH 服务为每个连接分配一个 PTY，让远程 shell 认为自己连接在真实终端上
2. **终端模拟器**：iTerm2、GNOME Terminal 等通过 PTY 运行 shell
3. **自动化测试**：`expect`、`pexpect` 等工具用 PTY 模拟交互式输入
4. **终端录制**：`script`、`asciinema` 等工具通过 PTY 捕获终端输出
5. **多路复用**：`tmux`、`screen` 通过 PTY 实现多窗口管理

### github.com/creack/pty 库

`creack/pty` 是 Go 中最常用的 PTY 库，封装了 `posix_openpt()`、`grantpt()`、`unlockpt()` 等系统调用。

```go
// 04_t.go - 用 PTY 创建一个完整的 Shell 会话
package main

import (
  "io"
  "os"
  "os/exec"
  "os/signal"
  "syscall"

  "github.com/creack/pty"
  "golang.org/x/term"
)

func main() {
  // 1. 创建要运行的 shell 命令
  cmd := exec.Command("bash")

  // 2. pty.Start() 做了以下事情：
  //    - 打开 /dev/ptmx 获得 master fd（ptmx）
  //    - 通过 grantpt/unlockpt 解锁对应的 slave 设备 /dev/pts/N
  //    - fork + exec "bash"，将 bash 的 stdin/stdout/stderr 连接到 slave
  //    - 返回 master fd 的 *os.File
  ptmx, err := pty.Start(cmd)
  if err != nil {
    panic(err)
  }
  defer ptmx.Close()

  // 3. 将当前终端（os.Stdin）切到 Raw 模式
  //    这样我们的按键可以不经过本地 TTY 处理，直接转发给 bash
  oldState, err := term.MakeRaw(int(os.Stdin.Fd()))
  if err != nil {
    panic(err)
  }
  defer term.Restore(int(os.Stdin.Fd()), oldState)

  // 4. 处理窗口大小变化
  //    当终端窗口调整大小时，内核发送 SIGWINCH 信号
  //    我们需要将新的大小同步到 PTY slave，否则 bash 不知道窗口变了
  ch := make(chan os.Signal, 1)
  signal.Notify(ch, syscall.SIGWINCH)
  go func() {
    for range ch {
      // pty.InheritSize 读取 os.Stdin 的窗口大小
      // 并通过 ioctl(ptmx, TIOCSWINSZ) 设置给 PTY
      pty.InheritSize(os.Stdin, ptmx)
    }
  }()
  ch <- syscall.SIGWINCH // 初始同步一次当前窗口大小

  // 5. 双向数据拷贝：
  //    os.Stdin → ptmx：用户输入转发给 bash
  //    ptmx → os.Stdout：bash 输出转发给用户终端
  go func() {
    _, _ = io.Copy(ptmx, os.Stdin) // 键盘输入 → bash
  }()
  _, _ = io.Copy(os.Stdout, ptmx) // bash 输出 → 屏幕
  // 当 bash 退出时，ptmx 的读取端返回 EOF，io.Copy 返回，main 函数退出
}
```

### PTY 数据流详解

```
用户按下 'l' 's' Enter
    │
    ▼
┌───────────────┐
│  os.Stdin     │  （Raw 模式，字节直接可读）
└───────┬───────┘
    │ io.Copy(ptmx, os.Stdin)
    ▼
┌───────────────┐
│  ptmx (master)│  写入 → PTY 驱动
└───────┬───────┘
    │  内核 PTY 驱动处理（回显、行规则 etc.）
    ▼
┌───────────────┐
│  /dev/pts/N   │  (slave) bash 的 stdin
│  (slave)      │
└───────┬───────┘
    │
    ▼
┌───────────────┐
│  bash 进程    │  执行 "ls" 命令
└───────┬───────┘
    │ bash 写入 stdout (→ slave)
    ▼
┌───────────────┐
│  /dev/pts/N   │
│  (slave)      │
└───────┬───────┘
    │  内核 PTY 驱动（输出处理）
    ▼
┌───────────────┐
│  ptmx (master)│  可读
└───────┬───────┘
    │ io.Copy(os.Stdout, ptmx)
    ▼
┌───────────────┐
│  os.Stdout    │  显示 ls 的输出
└───────────────┘
```

---

## 7. 完整示例解析

### 示例 0：最简密码读取（main.go）

最直接的用法，三行核心代码完成密码读取：

```go
package main

import (
  "fmt"
  "os"
  "golang.org/x/term"
)

func main() {
  fmt.Print("请输入密码: ")

  // term.ReadPassword 内部：
  // 1. tcgetattr 保存状态
  // 2. 关闭 ECHO 标志
  // 3. tcsetattr 应用
  // 4. 逐字节读取直到 \n 或 \r
  // 5. tcsetattr 恢复原状态
  password, err := term.ReadPassword(int(os.Stdin.Fd()))
  if err != nil {
    panic(err)
  }

  fmt.Println()
  fmt.Printf("密码长度: %d\n", len(password))
}
```

**执行流程**：

- 用户输入时屏幕无任何字符回显
- 按 Enter 后 `ReadPassword` 返回
- 终端状态自动恢复，后续输入正常显示

---

### 示例 1：Cooked vs Raw 模式对比（01_cooked_vs_raw.go）

```go
package main

import (
  "fmt"
  "os"
  "golang.org/x/term"
)

// Cooked 模式演示：默认行为，无需特殊设置
func demonstrateCookedMode() {
  fmt.Println("=== Cooked 模式 ===")
  fmt.Println("（可以看到输入，可以 Backspace，按 Enter 结束）")
  fmt.Print("输入: ")

  var input string
  fmt.Scanln(&input) // 阻塞直到 Enter，期间 TTY 驱动处理所有行编辑

  fmt.Printf("程序收到: %q（共 %d 字节）\n\n", input, len(input))
}

// Raw 模式演示：逐字符读取，完全控制
func demonstrateRawMode() {
  fmt.Println("=== Raw 模式 ===")
  fmt.Println("（看不到输入，每个字符立即发给程序，按 Enter 结束）")

  oldState, err := term.MakeRaw(int(os.Stdin.Fd()))
  if err != nil {
    panic(err)
  }
  defer term.Restore(int(os.Stdin.Fd()), oldState)

  var chars []byte
  buf := make([]byte, 1)

  for {
    n, err := os.Stdin.Read(buf)
    if err != nil || n == 0 {
      break
    }

    if buf[0] == '\n' || buf[0] == '\r' {
      break
    }

    if buf[0] == 3 { // Ctrl+C
      fmt.Print("\r\n中断\r\n")
      return
    }

    chars = append(chars, buf[0])
    // Raw 模式下 \n 只换行不回车，需要 \r\n
    fmt.Printf("\r\n收到字节: %c (ASCII: %d, 0x%02X)", buf[0], buf[0], buf[0])
  }

  fmt.Printf("\r\n程序收到: %q（共 %d 字节）\r\n", string(chars), len(chars))
}

func main() {
  demonstrateCookedMode()
  demonstrateRawMode()
}
```

**关键差异**：

- Cooked 模式：`fmt.Scanln` 一次性拿到整行，用户看到自己的输入
- Raw 模式：`os.Stdin.Read(buf)` 每次读一个字节，用户什么都看不到

---

### 示例 2：带星号的密码输入（02_password_with_stars.go）

`term.ReadPassword()` 完全隐藏输入，而有些场景需要显示 `*` 作为输入反馈。这需要手动在 Raw 模式下实现：

```go
package main

import (
  "fmt"
  "os"
  "golang.org/x/term"
)

func readPasswordWithStars() ([]byte, error) {
  oldState, err := term.MakeRaw(int(os.Stdin.Fd()))
  if err != nil {
    return nil, err
  }
  defer term.Restore(int(os.Stdin.Fd()), oldState)

  var password []byte
  buf := make([]byte, 1)

  for {
    n, err := os.Stdin.Read(buf)
    if err != nil || n == 0 {
      break
    }

    switch buf[0] {
    case '\n', '\r': // Enter 键：结束输入
      return password, nil

    case 3: // Ctrl+C (ASCII ETX)
      fmt.Print("\r\n")
      os.Exit(1)

    case 127, 8: // Backspace（ASCII DEL=127 或 BS=8）
      if len(password) > 0 {
        password = password[:len(password)-1]
        // 终端转义序列：退格 + 空格（覆盖星号）+ 退格（移回光标）
        fmt.Print("\b \b")
      }

    default:
      // 忽略其他控制字符（< 32 且不是上面已处理的）
      if buf[0] < 32 {
        continue
      }
      password = append(password, buf[0])
      fmt.Print("*") // 显示星号代替实际字符
    }
  }

  return password, nil
}

func main() {
  fmt.Print("密码（显示 *）: ")

  password, err := readPasswordWithStars()
  if err != nil {
    panic(err)
  }

  fmt.Println()
  fmt.Printf("密码: %s\n", string(password))
}
```

**`\b \b` 删除星号的原理**：

```
光标位置: 输入了 "abc" 后显示 "***|"（| 为光标）

\b  → 光标左移一格：  "**|*"  等等，实际是 "***" 然后光标在最后一个 * 上
  → 实际变为: "**[cursor]"
' ' → 用空格覆盖那个位置的星号: "** "
\b  → 光标再左移: "**[cursor] " → 光标在空格位置
  → 视觉效果: 最后一个 * 被擦除
```

---

### 示例 3：底层文件描述符操作（03_low_level_demo.go）

```go
package main

import (
  "fmt"
  "os"
  "syscall"

  "golang.org/x/term"
)

func main() {
  fd := int(os.Stdin.Fd())

  // --- 1. 文件描述符信息 ---
  fmt.Printf("stdin  fd: %d\n", fd)
  fmt.Printf("stdout fd: %d\n", int(os.Stdout.Fd()))
  fmt.Printf("stderr fd: %d\n", int(os.Stderr.Fd()))

  // --- 2. 终端检测 ---
  if !term.IsTerminal(fd) {
    fmt.Println("不是终端，退出")
    return
  }
  fmt.Println("是终端设备")

  // --- 3. 获取终端大小 ---
  width, height, _ := term.GetSize(fd)
  fmt.Printf("终端: %d×%d\r\n", width, height)

  // --- 4. 进入 Raw 模式，用 syscall.Read 直接读取 ---
  oldState, _ := term.MakeRaw(fd)
  defer term.Restore(fd, oldState)

  fmt.Print("按键（q 退出）:\r\n")
  buf := make([]byte, 1)

  for {
    // syscall.Read 是最底层的读取，等同于 C 的 read(fd, buf, 1)
    // 在 Raw 模式下，每个字符键入后立即返回
    n, err := syscall.Read(fd, buf)
    if err != nil || n == 0 {
      break
    }

    fmt.Printf("字节: %c  ASCII: %3d  十六进制: 0x%02X\r\n",
      buf[0], buf[0], buf[0])

    if buf[0] == 'q' || buf[0] == 'Q' {
      break
    }
  }
}
```

**`os.Stdin.Read` vs `syscall.Read` 的区别**：

|          | `os.Stdin.Read(buf)`   | `syscall.Read(fd, buf)`  |
| -------- | ---------------------- | ------------------------ |
| 层次     | Go 标准库（带缓冲/锁） | 直接系统调用             |
| 返回     | `(int, error)`         | `(int, syscall.Errno)`   |
| 错误处理 | Go 风格 error          | Unix errno               |
| 推荐     | 大多数情况             | 需要最低延迟或特殊控制时 |

---

### 示例 4：完整 PTY Shell（04_t.go）

```go
package main

import (
  "io"
  "os"
  "os/exec"
  "os/signal"
  "syscall"

  "github.com/creack/pty"
  "golang.org/x/term"
)

func main() {
  // 步骤 1: 准备要在 PTY 中运行的命令
  cmd := exec.Command("bash")

  // 步骤 2: 启动 PTY
  // pty.Start 内部操作：
  //   fd = open("/dev/ptmx", O_RDWR)     // 打开 master
  //   ptsname(fd) → "/dev/pts/N"          // 获取 slave 路径
  //   grantpt(fd); unlockpt(fd)           // 解锁 slave
  //   slave_fd = open("/dev/pts/N", ...)  // 打开 slave
  //   fork(); exec("bash")               // 子进程，stdin/stdout/stderr = slave_fd
  ptmx, err := pty.Start(cmd)
  if err != nil {
    panic(err)
  }
  defer ptmx.Close()

  // 步骤 3: 本终端切为 Raw 模式
  // 目的：让键盘输入不经本地 TTY 处理，直接转发给 PTY
  oldState, err := term.MakeRaw(int(os.Stdin.Fd()))
  if err != nil {
    panic(err)
  }
  defer term.Restore(int(os.Stdin.Fd()), oldState)

  // 步骤 4: 监听窗口大小变化信号
  ch := make(chan os.Signal, 1)
  signal.Notify(ch, syscall.SIGWINCH)
  go func() {
    for range ch {
      // 将父终端的窗口大小同步给 PTY slave
      // 内部调用: ioctl(ptmx, TIOCSWINSZ, &winsize)
      pty.InheritSize(os.Stdin, ptmx)
    }
  }()
  ch <- syscall.SIGWINCH // 立即同步一次

  // 步骤 5: 双向数据桥接
  go func() {
    io.Copy(ptmx, os.Stdin) // 用户键盘 → bash stdin
  }()
  io.Copy(os.Stdout, ptmx) // bash stdout → 用户屏幕
  // bash 退出 → ptmx EOF → io.Copy 返回 → main 退出
}
```

**为什么需要同步窗口大小**：

bash 内部的很多程序（vim、less、top 等）需要知道终端大小来正确排版。窗口大小存储在 PTY slave 设备的属性中，通过 `TIOCSWINSZ` ioctl 设置。如果不同步，这些程序看到的窗口大小是默认值（通常 80×24），导致显示错乱。

---

## 8. 常见问题与最佳实践

### 问题 1：忘记恢复终端状态

**症状**：程序退出后终端无法正常显示输入，按键无回显。

**原因**：程序在 Raw 模式下崩溃或退出，没有调用 `term.Restore()`。

**解决方案**：

```go
// ✅ 正确做法：用 defer 确保恢复
oldState, err := term.MakeRaw(fd)
if err != nil {
  return err
}
defer term.Restore(fd, oldState) // panic 时也会执行

// ❌ 错误做法：依赖手动调用
oldState, _ := term.MakeRaw(fd)
// 如果下面某行 panic 了，Restore 不会被调用
doSomething()
term.Restore(fd, oldState) // 可能不会执行到这里
```

**紧急修复**（终端乱掉时）：

```bash
# 方法 1: 用 reset 命令重置终端
reset

# 方法 2: 用 stty 恢复
stty sane

# 方法 3: 输入 stty echo（可能看不见，但盲打有效）
stty echo
```

### 问题 2：Raw 模式下换行显示异常

**症状**：输出只换行不回车，后续内容从上一行结束位置开始。

**原因**：Raw 模式关闭了输出的 CR/LF 转换（`ONLCR` 标志）。

**解决方案**：在 Raw 模式下，所有换行都用 `\r\n`：

```go
// ❌ Raw 模式下
fmt.Println("hello") // 等同于 "hello\n"，光标位置不对

// ✅ Raw 模式下
fmt.Print("hello\r\n") // 明确指定回车+换行
```

> 注意：`term.ReadPassword()` 不受此影响，因为它在读取完成后恢复了正常模式。

### 问题 3：在非终端环境中运行

**症状**：`term.MakeRaw()` 返回错误，如 `inappropriate ioctl for device`。

**原因**：程序的 stdin 被管道或文件重定向，不是真实终端。

**解决方案**：先检测后操作：

```go
fd := int(os.Stdin.Fd())

if !term.IsTerminal(fd) {
  // 非交互式模式：从管道/文件读取，或使用默认值
  fmt.Fprintln(os.Stderr, "警告：非交互式模式，跳过密码输入")
  return
}

// 只在确认是终端时才操作
oldState, err := term.MakeRaw(fd)
// ...
```

### 问题 4：PTY 中 Ctrl+C 不生效

**症状**：在 PTY 包裹的 shell 中，Ctrl+C 不能中断前台命令。

**原因**：Ctrl+C 需要通过 PTY slave 的 `ISIG` 标志处理，程序需要确保 PTY slave 正确配置了信号处理。

`creack/pty` 库通过 `pty.Start()` 创建的 PTY slave 默认保持 Cooked 模式（包含 `ISIG`），因此 Ctrl+C 会正确发送 SIGINT 给 PTY 中的进程组，`04_t.go` 示例已正确处理此场景。

### 问题 5：Windows 兼容性

`golang.org/x/term` 支持 Windows，但底层实现完全不同：

|            | Unix/macOS          | Windows                                   |
| ---------- | ------------------- | ----------------------------------------- |
| API        | `termios` + `ioctl` | `Console API` (`SetConsoleMode` 等)       |
| 文件描述符 | fd (int)            | HANDLE (uintptr)                          |
| Raw 模式   | 清除 ECHO/ICANON    | `ENABLE_ECHO_INPUT` / `ENABLE_LINE_INPUT` |
| 信号       | SIGWINCH            | `SetConsoleCtrlHandler`                   |

`golang.org/x/term` 的跨平台封装使得代码无需修改即可在 Windows 上运行。

---

## 9. 参考资料

### 官方文档

- [golang.org/x/term 包文档](https://pkg.go.dev/golang.org/x/term)
- [golang.org/x/sys/unix 包文档](https://pkg.go.dev/golang.org/x/sys/unix)
- [github.com/creack/pty](https://github.com/creack/pty)

### POSIX/系统文档

- [POSIX termios 规范](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/termios.h.html)
- [Linux termios(3) man page](https://man7.org/linux/man-pages/man3/termios.3.html)
- [Linux pty(7) man page](https://man7.org/linux/man-pages/man7/pty.7.html)
- [ANSI 转义序列](https://en.wikipedia.org/wiki/ANSI_escape_code)

### 相关 Go 项目

- [bubbletea](https://github.com/charmbracelet/bubbletea) — TUI 框架，大量使用 PTY/Raw 模式
- [cobra](https://github.com/spf13/cobra) — CLI 框架
- [survey](https://github.com/AlecAivazis/survey) — 交互式 CLI 提示库
- [pterm](https://github.com/pterm/pterm) — 终端 UI 组件库
- [liner](https://github.com/peterh/liner) — 行编辑库（类似 readline）

### 深入阅读

- _The Linux Programming Interface_ (TLPI) — Michael Kerrisk，第 62 章 Terminals
- _Advanced Programming in the UNIX Environment_ (APUE) — Stevens，第 18-19 章
