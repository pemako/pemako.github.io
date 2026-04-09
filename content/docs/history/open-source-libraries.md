---
date: '2026-04-09T20:00:00+08:00'
title: 'Go 开源库'
description: ""
summary: ""
tags: ["go"]
categories: ["go"]
series: ["Go"]
ShowToc: true
TocOpen: true
---

##### 参考
- https://github.com/golang/sync/blob/master/singleflight/singleflight.go
- https://www.cnblogs.com/failymao/p/15613749.html
- https://draveness.me/golang/docs/part3-runtime/ch06-concurrency/golang-sync-primitives/#singleflight

---

[bubbletea](https://github.com/charmbracelet/bubbletea)



---

仓库地址 [term](https://github.com/pkg/term)

[`github.com/pkg/term`](https://github.com/pkg/term) 是一个**专业的终端和串口控制库**，填补了 Go 标准库在底层终端操作方面的空白。它特别适合：

- 嵌入式系统开发
- 串口设备通信
- 交互式终端应用
- 工业控制系统
- 需要精确控制终端行为的应用程序

该库的核心价值在于提供了简洁的 Go 语言接口来访问复杂的 `POSIX termios` 功能，让开发者无需深入了解底层系统调用细节就能实现专业的终端和串口控制。

如果仅仅开发 `CLI` 工具推荐使用 [`golang.org/x/term`](https://pkg.go.dev/golang.org/x/term)

例如要开发一个需要用户在终端输入密码的 CLI 工具时，输入密码时不要显示出来可以这样处理

```go
package main

import (
	"fmt"
	"os"

	"golang.org/x/term"
)

func main() {
	fmt.Print("请输入密码: ")

	// 使用 golang.org/x/term 的 ReadPassword 函数
	// 它会自动处理终端状态的保存和恢复,并隐藏输入
	password, err := term.ReadPassword(int(os.Stdin.Fd()))
	if err != nil {
		panic(err)
	}

	fmt.Println()
	fmt.Printf("密码 %v\n", string(password))
}

```

效果如下
```
➜  term-password go run ./main.go
请输入密码: 
密码 打印输入的密码
```


### `x/term` vs `pkg/term`

| **包**               | **本质定位**              |
| ------------------- | --------------------- |
| golang.org/x/term   | 给 CLI 用的终端工具          |
| github.com/pkg/term | 给系统/串口/设备用的终端 & 串口控制库 |

golang.org/x/term 本质上是：
通过系统调用，临时修改“终端驱动”的工作模式，让程序接管键盘输入和屏幕输出的解释权。
它不操作屏幕、不画 UI、不拦截键盘硬件，它操作的是：内核里的 TTY（终端）状态机

### 补充知识

- 终端
```
键盘
 ↓
终端模拟器（iTerm / Terminal.app）
 ↓
PTY（伪终端）
 ↓
TTY 驱动（内核）
 ↓
Shell（bash / zsh）
 ↓
你的程序（Go）
```

> TTY 是 Unix 里一个**极老但极重要的东西**  **TTY = 内核里的“字符设备 + 状态机”**
TTY（Teletypewriter，电传打字机）是 Unix/Linux 系统中一个**核心且历史悠久的概念**，它代表了用户与系统进行交互的终端设备。

简单来说，**TTY 就是终端（Terminal）在操作系统中的抽象和实现**。当你通过 SSH 登录、在图形界面打开终端模拟器，或者直接使用物理控制台时，你都在与一个 TTY 交互。

### TTY 的核心概念

1.  **历史渊源**：源于物理的 Teletypewriter（电传打字机），一种通过串行线连接计算机的输入输出设备。UNIX 早期用它作为人机接口。

2.  **在 Unix/Linux 中的角色**：
    *   **终端会话的抽象**：每个交互式会话（登录 shell）都关联一个 TTY 设备。
    *   **设备文件**：在 `/dev` 目录下体现为特殊设备文件（如 `/dev/tty1`、`/dev/pts/0`）。
    *   **内核子系统**：包含线路规程（line discipline），负责处理输入输出（如缓冲、回显、特殊字符解析，如 `Ctrl+C` 发送 SIGINT）。

### TTY 的类型

1.  **物理控制台（Console TTYs）**：
    *   对应真实的硬件控制台（显示器+键盘）。
    *   设备名：`/dev/tty1`、`/dev/tty2` ... （通过 `Ctrl+Alt+F1~F7` 切换）。
    *   系统启动时，第一个控制台（`tty1`）会显示内核消息。

2.  **伪终端（Pseudo-Terminals，PTY）**：
    *   这是现代最常用的类型，通过软件模拟终端。
    *   **PTY 由两部分组成**：
        *   **PTY Master**：由终端模拟器（如 GNOME Terminal、xterm、SSH 服务端）控制。
        *   **PTY Slave**：提供给 Shell（如 bash）使用，它表现得像一个真实终端。
    *   设备名：`/dev/pts/0`、`/dev/pts/1` ... （“pts” 指 “pseudo-terminal slave”）。
    *   **所有通过 SSH、图形界面终端模拟器打开的会话，都是 PTY。**

3.  **串行终端（Serial TTYs）**：
    *   通过串行线（RS-232）连接的物理终端或设备。
    *   设备名：`/dev/ttyS0`、`/dev/ttyUSB0` 等。

### 相关命令和工具

*   **`tty` 命令**：告诉你当前 shell 关联的 TTY 设备文件路径。
    ```bash
    $ tty
    /dev/pts/2
    ```

*   **`who` 或 `w` 命令**：显示已登录的用户及其使用的 TTY。
    ```bash
    $ who
    alice   pts/0        2024-01-15 10:30 (192.168.1.100)
    bob     tty2         2024-01-15 09:15
    ```

*   **`ps` 命令**：可以查看进程属于哪个 TTY（`TTY` 列）。
    ```bash
    $ ps -ef | grep bash
    alice   12345  12344  0 10:30 pts/0    00:00:00 -bash
    ```

*   **`/dev/tty`**：这是一个特殊的设备文件，指向**当前进程的控制终端**，无论它具体是哪个 TTY。常用于脚本中确保与用户交互。

### TTY 的重要特性

1.  **会话管理**：TTY 与会话（session）和进程组（process group）紧密绑定，使得 Shell 可以管理前台/后台作业，并发送信号（如 `Ctrl+Z` 的 SIGTSTP）。
2.  **输入输出处理**：线路规程（line discipline）负责：
    *   **回显**：你敲的字符在屏幕上显示出来。
    *   **行缓冲**：直到你按下回车，才将整行数据发送给程序。
    *   **特殊字符处理**：`Ctrl+C`（中断）、`Ctrl+Z`（挂起）、`Ctrl+\`（退出）、`Ctrl+D`（EOF）等。
3.  **权限控制**：TTY 设备文件有权限设置，例如 `write` 命令就是通过向其他用户的 TTY 设备文件写入数据来发送消息的。

### 为什么 TTY 在现代依然重要？

虽然物理电传打字机早已消失，但 TTY 的抽象被完整保留并扩展，因为它完美地定义了**交互式字符设备会话的模型**。几乎所有需要交互式命令行输入输出的场景都离不开 TTY 子系统。

### 总结

| 概念 | 说明 |
|------|------|
| **物理 TTY** | 硬件控制台或串行终端。 |
| **伪终端 (PTY)** | 软件模拟的终端，用于终端模拟器和远程连接。 |
| **`/dev/ttyX`** | 控制台终端设备。 |
| **`/dev/pts/X`** | 伪终端从设备。 |
| **`/dev/tty`** | 当前进程的控制终端（虚拟设备）。 |

**简单比喻**：
*   **TTY** 就像是公司总机的一个**分机号码**。
*   当你 SSH 登录或打开终端时，系统为你分配一个分机（如 `pts/0`）。
*   你的 Shell（如 bash）就在这个分机上接听和通话。
*   内核的 TTY 子系统就是**总机交换机**，负责路由、处理信号（如挂断、转接）。

理解 TTY 是理解 Unix/Linux 进程、会话、作业控制以及终端 I/O 的基础。

---

# GoReplay 使用说明

> GoReplay 是一个开源的网络流量录制和重放工具，可用于影子测试、负载测试和流量分析。

---

## 一、快速开始

### 安装

```bash
# 从 GitHub 下载最新版本
wget https://github.com/buger/goreplay/releases/download/v1.3.3/gor_1.3.3_x64.tar.gz
tar -xzf gor_1.3.3_x64.tar.gz
```

### 最简单的使用

```bash
# 捕获 8000 端口流量并打印到终端（类似 tcpdump）
sudo ./gor --input-raw :8000 --output-stdout

# 捕获并实时重放到测试环境
sudo ./gor --input-raw :8000 --output-http http://staging.example.com:8000
```

---

## 二、核心概念

### 工作原理

```
生产服务器 (:8000)          测试服务器 (:8000)
      │                           ▲
      │ ① 旁路监听                 │ ③ 重放
      ▼                           │
  ┌───────────┐    ② 处理    ┌────┴────┐
  │ GoReplay  │ ──────────▶ │ GoReplay │
  │ (Input)   │             │ (Output) │
  └───────────┘             └──────────┘
```

**关键特性**：
- **非代理模式**：旁路监听，不拦截流量
- **零侵入**：对生产环境无性能影响
- **内核级过滤**：使用 BPF 高效过滤

---

## 三、常用命令

### 1. 流量录制

```bash
# 录制到文件
sudo ./gor --input-raw :8000 --output-file requests.gor

# 录制并压缩
sudo ./gor --input-raw :8000 --output-file requests.gor.gz

# 按时间分割录制（每分钟一个文件）
sudo ./gor --input-raw :8000 --output-file requests_%Y%m%d%H%M.gor

# 限制文件大小（100MB 后轮转）
sudo ./gor --input-raw :8000 --output-file requests.gor --output-file-size-limit 100mb
```

### 2. 流量重放

```bash
# 从文件重放
./gor --input-file requests.gor --output-http http://staging:8000

# 加速重放（2倍速）
./gor --input-file requests.gor --output-http http://staging:8000 --input-file-rate 200%

# 减速重放（0.5倍速）
./gor --input-file requests.gor --output-http http://staging:8000 --input-file-rate 50%

# 循环重放
./gor --input-file requests.gor --output-http http://staging:8000 --input-file-loop
```

### 3. 实时镜像

```bash
# 镜像到测试环境
sudo ./gor --input-raw :8000 --output-http http://staging:8000

# 镜像到多个目标
sudo ./gor --input-raw :8000 \
    --output-http http://staging1:8000 \
    --output-http http://staging2:8000

# 分流到多个目标（轮询）
sudo ./gor --input-raw :8000 \
    --output-http http://staging1:8000 \
    --output-http http://staging2:8000 \
    --split-output
```

### 4. 流量过滤

```bash
# 只捕获特定 URL
sudo ./gor --input-raw :8000 \
    --output-http http://staging:8000 \
    --http-allow-url "/api/.*"

# 排除特定 URL
sudo ./gor --input-raw :8000 \
    --output-http http://staging:8000 \
    --http-disallow-url "/health"

# 按 Header 过滤
sudo ./gor --input-raw :8000 \
    --output-http http://staging:8000 \
    --http-allow-header "X-User-Id:.*"

# 只捕获特定方法
sudo ./gor --input-raw :8000 \
    --output-http http://staging:8000 \
    --http-allow-method "GET" \
    --http-allow-method "POST"
```

### 5. 请求修改

```bash
# 添加 Header
sudo ./gor --input-raw :8000 \
    --output-http http://staging:8000 \
    --http-set-header "X-Gor-Test:1"

# 修改 Header
sudo ./gor --input-raw :8000 \
    --output-http http://staging:8000 \
    --http-rewrite-header "Host:staging.example.com"

# URL 重写
sudo ./gor --input-raw :8000 \
    --output-http http://staging:8000 \
    --http-rewrite-url "/v1/(.*):/v2/$1"

# 设置请求参数
sudo ./gor --input-raw :8000 \
    --output-http http://staging:8000 \
    --http-set-param "debug=true"
```

---

## 四、高级配置

### 性能调优

```bash
# 使用高性能引擎（Linux）
sudo ./gor --input-raw :8000 \
    --input-raw-engine af_packet \
    --output-http http://staging:8000

# 增大缓冲区
sudo ./gor --input-raw :8000 \
    --input-raw-buffer-size 100mb \
    --output-http http://staging:8000

# 调整 Worker 数量
sudo ./gor --input-raw :8000 \
    --output-http http://staging:8000 \
    --output-http-workers 100
```

### 超时设置

```bash
sudo ./gor --input-raw :8000 \
    --output-http http://staging:8000 \
    --output-http-timeout 30s \
    --input-raw-expire 5s
```

### 流量限制

```bash
# 限制每秒请求数
sudo ./gor --input-raw :8000 \
    --output-http "http://staging:8000|10"  # 每秒最多 10 个请求

# 限制百分比
sudo ./gor --input-raw :8000 \
    --output-http "http://staging:8000|50%"  # 只重放 50% 流量
```

### 响应追踪

```bash
# 追踪响应（用于对比测试）
sudo ./gor --input-raw :8000 \
    --output-http http://staging:8000 \
    --output-http-track-response
```

---

## 五、输入插件

| 插件 | 参数 | 说明 |
|------|------|------|
| RAW | `--input-raw :8000` | 捕获网卡流量 |
| File | `--input-file requests.gor` | 读取录制文件 |
| TCP | `--input-tcp :28020` | 接收 TCP 转发 |
| Kafka | `--input-kafka-host` | 从 Kafka 消费 |

---

## 六、输出插件

| 插件 | 参数 | 说明 |
|------|------|------|
| HTTP | `--output-http http://host` | 重放到 HTTP 服务 |
| File | `--output-file requests.gor` | 录制到文件 |
| TCP | `--output-tcp host:28020` | 转发到 TCP |
| Stdout | `--output-stdout` | 打印到终端 |
| Null | `--output-null` | 丢弃（测试用） |
| Kafka | `--output-kafka-host` | 发送到 Kafka |

---

## 七、捕获引擎

| 引擎 | 参数 | 平台 | 性能 |
|------|------|------|------|
| libpcap | `--input-raw-engine libpcap` | 跨平台 | 中 |
| AF_PACKET | `--input-raw-engine af_packet` | Linux | 高 |
| raw_socket | `--input-raw-engine raw_socket` | Linux | 中 |
| pcap_file | `--input-raw-engine pcap_file` | 跨平台 | - |

---

## 八、典型场景

### 场景 1：影子测试（Shadow Testing）

将生产流量镜像到测试环境，验证新版本：

```bash
sudo ./gor --input-raw :8000 \
    --output-http http://staging:8000 \
    --http-set-header "X-Shadow-Test:1"
```

### 场景 2：负载测试

录制流量后多倍速重放：

```bash
# 录制
sudo ./gor --input-raw :8000 --output-file load_test.gor

# 5 倍速重放
./gor --input-file load_test.gor \
    --output-http http://staging:8000 \
    --input-file-rate 500%
```

### 场景 3：A/B 测试

将流量分发到不同版本：

```bash
sudo ./gor --input-raw :8000 \
    --output-http "http://version-a:8000|50%" \
    --output-http "http://version-b:8000|50%" \
    --split-output
```

### 场景 4：流量归档

长期录制流量用于回放测试：

```bash
sudo ./gor --input-raw :8000 \
    --output-file "archive_%Y%m%d.gor.gz" \
    --output-file-size-limit 1gb \
    --output-file-queue-limit 1000
```

### 场景 5：调试分析

捕获特定请求进行分析：

```bash
sudo ./gor --input-raw :8000 \
    --output-stdout \
    --http-allow-url "/api/problem.*" \
    --http-allow-header "X-User-Id:12345"
```

---

## 九、注意事项

### 权限要求

```bash
# 需要 root 权限捕获网络流量
sudo ./gor --input-raw :8000 ...

# 或者设置 capabilities
sudo setcap cap_net_raw,cap_net_admin=eip ./gor
./gor --input-raw :8000 ...
```

### 常见问题

1. **捕获不到流量**
   - 检查端口是否正确
   - 确认使用 sudo 运行
   - 尝试指定网卡：`--input-raw eth0:8000`

2. **重放失败**
   - 检查目标服务是否可达
   - 增加超时时间：`--output-http-timeout 60s`
   - 检查防火墙设置

3. **内存占用高**
   - 减小缓冲区：`--input-raw-buffer-size 10mb`
   - 限制队列长度：`--output-http-queue-len 100`

4. **丢包严重**
   - 使用 AF_PACKET 引擎
   - 增大缓冲区
   - 增加 Worker 数量

---

## 十、完整参数列表

```bash
# 查看所有参数
./gor --help

# 查看版本
./gor --version
```

### 常用参数速查

| 参数 | 说明 | 示例 |
|------|------|------|
| `--input-raw` | 捕获端口 | `:8000` |
| `--output-http` | 重放目标 | `http://host:8000` |
| `--output-file` | 录制文件 | `requests.gor` |
| `--input-file` | 重放文件 | `requests.gor` |
| `--input-file-loop` | 循环重放 | - |
| `--input-file-rate` | 重放速度 | `200%` |
| `--http-allow-url` | URL 白名单 | `/api/.*` |
| `--http-disallow-url` | URL 黑名单 | `/health` |
| `--http-set-header` | 添加 Header | `X-Test:1` |
| `--output-http-workers` | Worker 数 | `100` |
| `--output-http-timeout` | 超时时间 | `30s` |
| `--split-output` | 分流输出 | - |
| `--verbose` | 详细日志 | `--verbose 3` |

---

## 参考链接

- [GitHub 仓库](https://github.com/buger/goreplay)
- [官方文档](https://github.com/buger/goreplay/wiki)
- [常见问题](https://github.com/buger/goreplay/wiki/FAQ)


---

# CSV Processor — Go WebAssembly 项目文档

## 目录

1. [项目概览](#1-项目概览)
2. [文件结构](#2-文件结构)
3. [技术原理](#3-技术原理)
   - 3.1 [Go WebAssembly（WASM）原理](#31-go-webassemblywasm-原理)
   - 3.2 [syscall/js — Go 与 JavaScript 互操作](#32-syscalljs--go-与-javascript-互操作)
   - 3.3 [PapaParse — 纯前端 CSV 解析](#33-papaparse--纯前端-csv-解析)
4. [两个页面的对比](#4-两个页面的对比)
5. [完整代码](#5-完整代码)
   - 5.1 [main.go](#51-maingo)
   - 5.2 [index.html（Go WASM 版）](#52-indexhtml-go-wasm-版)
   - 5.3 [index2.html（PapaParse 纯前端版）](#53-index2html-papaparse-纯前端版)
6. [编译与运行](#6-编译与运行)
7. [数据结构说明](#7-数据结构说明)
8. [常见问题](#8-常见问题)

---

## 1. 项目概览

这是一个 **CSV 文件处理器**，提供两种实现方式：

| 页面 | 实现方式 | 特点 |
|------|---------|------|
| `index.html` | Go 编译为 WebAssembly，在浏览器运行 | 演示 Go → WASM 技术栈 |
| `index2.html` | 纯 JavaScript（PapaParse 库） | 零编译、开箱即用 |

两个页面功能相同：上传或粘贴 CSV → 解析 → 展示 JSON 结果、表格预览、数值列统计。

---

## 2. 文件结构

```
wasm/
├── main.go          # Go 源码：CSV 解析逻辑 + WASM 导出
├── main.wasm        # 编译产物（Go → WASM 二进制）
├── wasm_exec.js     # Go 官方提供的 JS 胶水文件（Go 运行时桥接）
├── index.html       # 页面一：调用 Go WASM 处理 CSV
└── index2.html      # 页面二：使用 PapaParse 纯前端处理 CSV
```

---

## 3. 技术原理

### 3.1 Go WebAssembly（WASM）原理

WebAssembly（WASM）是一种**二进制指令格式**，可在现代浏览器的沙箱环境中以接近原生速度运行。

**整体流程：**

```
Go 源码 (main.go)
      ↓  GOOS=js GOARCH=wasm go build
main.wasm（二进制）
      ↓  fetch() 加载到浏览器
WebAssembly.instantiate()
      ↓  wasm_exec.js 初始化 Go 运行时
window.processCSV 全局函数可用
      ↓  JavaScript 调用
返回 JSON 字符串
```

**关键点：**
- `GOOS=js`：告诉 Go 编译器目标操作系统是浏览器（JS 环境）
- `GOARCH=wasm`：目标架构是 WebAssembly
- `wasm_exec.js`：Go 官方提供，负责初始化 Go 运行时（内存管理、goroutine 调度器等），是 Go WASM 能运行的必要条件
- `select {}`：Go `main()` 函数末尾的阻塞，防止 WASM 实例退出，保持函数注册有效

### 3.2 syscall/js — Go 与 JavaScript 互操作

`syscall/js` 是 Go 标准库中专为 `GOOS=js` 提供的包，允许 Go 代码直接操作 JavaScript 对象和函数。

**核心 API：**

```go
// 向 JS 全局作用域注册一个函数
js.Global().Set("functionName", js.FuncOf(goHandler))

// 处理函数签名（固定格式）
func handler(this js.Value, args []js.Value) interface{}

// 读取 JS 传入的字符串参数
str := args[0].String()

// 返回字符串给 JS
return js.ValueOf("result string")
```

**注册流程图：**

```
Go main()
  └─ js.Global().Set("processCSV", js.FuncOf(processCSVWrapper))
        │
        ▼
  浏览器 window.processCSV = <Go function>
        │
        ▼
  JS 调用: const result = await window.processCSV(csvText)
        │
        ▼
  Go processCSVWrapper() 执行，返回 JSON 字符串
```

### 3.3 PapaParse — 纯前端 CSV 解析

[PapaParse](https://www.papaparse.com/) 是业界最流行的 JavaScript CSV 解析库，`index2.html` 通过 CDN 引入：

```html
<script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
```

**核心解析调用：**

```js
const parsed = Papa.parse(csvString, {
  dynamicTyping: false,   // 不自动转换类型，保留原始字符串
  skipEmptyLines: false,  // 不跳过空行（手动处理）
  newline: "",            // 自动检测换行符（\r\n / \n / \r）
});
// parsed.data  => string[][]  二维数组
// parsed.errors => 解析错误列表
```

**PapaParse 能处理的复杂情况：**
- 字段内含逗号：`"王,五"` → 正确解析为单个字段
- 字段内含引号：`"Ann ""The Ace"""` → 解析为 `Ann "The Ace"`
- 不同操作系统的换行符（CRLF / LF）

---

## 4. 两个页面的对比

| 对比项 | index.html（WASM 版） | index2.html（PapaParse 版） |
|--------|----------------------|---------------------------|
| 解析引擎 | Go 标准库 `encoding/csv` | PapaParse 5.4.1 |
| 网络依赖 | 需要加载 `main.wasm`（本地） | 需要加载 PapaParse CDN |
| 启动方式 | 必须 HTTP 服务器（fetch 限制） | 必须 HTTP 服务器（同上） |
| 语言 | Go + JavaScript | 纯 JavaScript |
| 适用场景 | 演示 Go WASM 技术 | 生产可用的轻量方案 |
| 国际化 | 英文界面 | 中文界面 |

---

## 5. 完整代码

### 5.1 main.go

```go
package main

import (
  "encoding/csv"
  "encoding/json"
  "fmt"
  "strconv"
  "strings"
  "syscall/js"
)

// Result 是返回给 JavaScript 的顶层结构
type Result struct {
  Headers  []string              `json:"headers"`
  RowCount int                   `json:"row_count"`
  Rows     [][]string            `json:"rows,omitempty"`
  Stats    map[string]ColumnStat `json:"stats,omitempty"`
  Error    string                `json:"error,omitempty"`
}

// ColumnStat 记录单列的数值统计
type ColumnStat struct {
  Sum   float64 `json:"sum,omitempty"`
  Avg   float64 `json:"avg,omitempty"`
  Count int     `json:"count"`
  IsNum bool    `json:"is_num"`
}

// parseCSV 接收 CSV 字符串，返回解析结果及统计
func parseCSV(text string) Result {
  r := csv.NewReader(strings.NewReader(text))
  records, err := r.ReadAll()
  if err != nil {
    return Result{Error: err.Error()}
  }

  if len(records) == 0 {
    return Result{}
  }

  // 第一行视为表头
  headers := records[0]
  rows := [][]string{}
  if len(records) > 1 {
    rows = records[1:]
  }

  colCount := len(headers)
  stats := make(map[string]ColumnStat, colCount)

  // 初始化统计，默认认为每列都是数值列
  for _, h := range headers {
    stats[h] = ColumnStat{IsNum: true}
  }

  for _, row := range rows {
    for i := 0; i < colCount; i++ {
      header := headers[i]
      var cell string
      if i < len(row) {
        cell = row[i]
      }

      if cell == "" {
        cs := stats[header]
        cs.IsNum = false
        stats[header] = cs
        continue
      }

      f, err := strconv.ParseFloat(cell, 64)
      if err != nil {
        cs := stats[header]
        cs.IsNum = false
        stats[header] = cs
        continue
      }

      cs := stats[header]
      cs.Sum += f
      cs.Count++
      stats[header] = cs
    }
  }

  // 计算平均值
  for _, h := range headers {
    cs := stats[h]
    if cs.Count > 0 {
      cs.Avg = cs.Sum / float64(cs.Count)
    } else {
      cs.IsNum = false
    }
    stats[h] = cs
  }

  return Result{
    Headers:  headers,
    RowCount: len(rows),
    Rows:     rows,
    Stats:    stats,
  }
}

// processCSVWrapper 是暴露给 JavaScript 的入口函数
// 签名固定：func(this js.Value, args []js.Value) interface{}
func processCSVWrapper(this js.Value, args []js.Value) interface{} {
  if len(args) < 1 {
    return js.ValueOf(`{"error":"missing argument"}`)
  }

  csvText := args[0].String()
  res := parseCSV(csvText)

  b, err := json.Marshal(res)
  if err != nil {
    return js.ValueOf(fmt.Sprintf(`{"error":"%s"}`, err.Error()))
  }

  return js.ValueOf(string(b))
}

func main() {
  // 将 Go 函数注册为全局 JS 函数 window.processCSV
  js.Global().Set("processCSV", js.FuncOf(processCSVWrapper))
  fmt.Println("Go WASM CSV processor initialized")
  select {} // 阻塞，保持 WASM 实例存活
}
```

**返回的 JSON 结构示例：**

```json
{
  "headers": ["name", "age", "salary"],
  "row_count": 3,
  "rows": [
    ["Alice", "30", "1000"],
    ["Bob",   "25", "850"],
    ["Carol", "40", "1200"]
  ],
  "stats": {
    "name":   { "count": 0, "is_num": false },
    "age":    { "sum": 95,   "avg": 31.67, "count": 3, "is_num": true },
    "salary": { "sum": 3050, "avg": 1016.67, "count": 3, "is_num": true }
  }
}
```

---

### 5.2 index.html（Go WASM 版）

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Go WASM CSV Processor</title>
  <style>
    body {
      font-family: system-ui, -apple-system, Roboto, "Segoe UI", Arial;
      padding: 20px;
    }
    textarea {
      width: 100%;
      height: 180px;
    }
    pre {
      background: #f6f8fa;
      padding: 10px;
      overflow: auto;
    }
    table {
      border-collapse: collapse;
      margin-top: 12px;
    }
    table th, table td {
      border: 1px solid #ddd;
      padding: 6px 8px;
    }
  </style>
</head>
<body>
  <h2>CSV Processor (Go WebAssembly)</h2>

  <input id="file" type="file" accept=".csv" />
  <button id="sample">Load sample CSV</button>
  <p>
    <button id="process" disabled>Process CSV</button>
  </p>

  <h3>Raw CSV</h3>
  <textarea id="csvtext" placeholder="CSV content will appear here..."></textarea>

  <details open>
    <summary style="cursor:pointer;user-select:none;">
      <h3 style="display:inline;margin:0">Table Preview</h3>
    </summary>
    <div id="table"></div>
  </details>

  <details id="resultDetails">
    <summary style="cursor:pointer;user-select:none;">
      <h3 style="display:inline;margin:0">Result (JSON)</h3>
    </summary>
    <pre id="result">WASM not loaded yet</pre>
  </details>

  <!-- Step 1: 加载 Go 运行时胶水文件 -->
  <script src="wasm_exec.js"></script>
  <script>
    const go = new Go(); // wasm_exec.js 提供的 Go 运行时对象
    let wasmLoaded = false;

    // Step 2: fetch 加载 .wasm 二进制并实例化
    async function loadWasm() {
      const resp = await fetch('main.wasm');
      const buf = await resp.arrayBuffer();
      const result = await WebAssembly.instantiate(buf, go.importObject);
      go.run(result.instance); // 启动 Go 运行时，执行 main()
      wasmLoaded = true;
      document.getElementById('process').disabled = false;
      document.getElementById('result').textContent = 'WASM loaded. Ready.';
    }

    loadWasm().catch(err => {
      document.getElementById('result').textContent = 'WASM load error: ' + err;
    });

    // 文件读取
    document.getElementById('file').addEventListener('change', e => {
      const f = e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => { document.getElementById('csvtext').value = reader.result; };
      reader.readAsText(f);
    });

    // 加载示例数据
    document.getElementById('sample').addEventListener('click', () => {
      document.getElementById('csvtext').value =
        'name,age,salary\nAlice,30,1000\nBob,25,850\nCarol,40,1200\n';
    });

    // Step 3: 调用 Go 注册的全局函数 window.processCSV
    document.getElementById('process').addEventListener('click', async () => {
      if (!wasmLoaded) return alert('wasm not ready');
      const text = document.getElementById('csvtext').value;
      if (!text) return alert('empty csv');
      try {
        const jsonStr = await window.processCSV(text); // Go 函数，返回 JSON 字符串
        const obj = JSON.parse(jsonStr);
        document.getElementById('result').textContent = JSON.stringify(obj, null, 2);
        renderTable(obj);
      } catch (err) {
        document.getElementById('result').textContent = 'error: ' + err;
      }
    });

    function renderTable(obj) {
      const container = document.getElementById('table');
      container.innerHTML = '';
      if (!obj || !obj.headers) return;
      const headers = obj.headers;
      const rows = obj.rows || [];

      const table = document.createElement('table');
      const thead = document.createElement('thead');
      const tr = document.createElement('tr');
      headers.forEach(h => {
        const th = document.createElement('th');
        th.textContent = h;
        tr.appendChild(th);
      });
      thead.appendChild(tr);
      table.appendChild(thead);

      const tbody = document.createElement('tbody');
      rows.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach((_, i) => {
          const td = document.createElement('td');
          td.textContent = row[i] ?? '';
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      container.appendChild(table);
    }
  </script>
</body>
</html>
```

---

### 5.3 index2.html（PapaParse 纯前端版）

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>纯前端 CSV 处理（PapaParse）</title>
  <style>
    body {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial;
      padding: 18px;
      color: #0f172a;
      background: #fbfdff;
      max-width: 1100px;
      margin: 0 auto;
    }
    h1 { margin-top: 0; font-size: 20px; }
    .controls { display: flex; gap: 8px; align-items: center; margin-bottom: 10px; flex-wrap: wrap; }
    textarea { width: 100%; height: 180px; font-family: monospace; margin-top: 8px; padding: 8px; box-sizing: border-box; }
    button { padding: 8px 12px; border-radius: 6px; border: 1px solid #cbd5e1; background: #fff; cursor: pointer; }
    button:active { transform: translateY(1px); }
    pre { background: #f1f5f9; padding: 10px; overflow: auto; border-radius: 6px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 14px; }
    th, td { border: 1px solid #e2e8f0; padding: 6px 8px; text-align: left; }
    th { background: #f8fafc; position: sticky; top: 0; z-index: 2; }
    .stats { margin-top: 8px; display: flex; gap: 12px; flex-wrap: wrap; }
    .stat-card { border: 1px solid #e2e8f0; padding: 8px; border-radius: 6px; background: #fff; min-width: 200px; }
    .error { color: #b91c1c; }
    .muted { color: #64748b; font-size: 13px; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
</head>
<body>
  <h1>纯前端 CSV 处理器（使用 PapaParse）</h1>

  <div class="controls">
    <input id="file" type="file" accept=".csv,text/csv" />
    <button id="loadSample">加载示例 CSV</button>
    <button id="parseBtn" disabled>解析并统计</button>
    <label class="muted">或把 CSV 粘贴到下方文本框</label>
  </div>

  <label><strong>CSV 原文</strong></label>
  <textarea id="csvText" placeholder="把 CSV 内容粘贴到这里，或使用上方文件选择 / 示例"></textarea>

  <div style="margin-top:10px;">
    <span class="muted">注意：第一行被视为表头。PapaParse 支持带引号与包含逗号的字段。</span>
  </div>

  <div class="result">
    <details id="resultDetails">
      <summary style="cursor:pointer;user-select:none;">
        <h3 style="display:inline;margin:0">解析结果 (JSON)</h3>
      </summary>
      <pre id="jsonResult">尚未解析</pre>
    </details>

    <details open>
      <summary style="cursor:pointer;user-select:none;">
        <h3 style="display:inline;margin:0">表格预览</h3>
      </summary>
      <div id="tableWrap"></div>
    </details>

    <h3>数值列统计</h3>
    <div id="statsWrap" class="stats"></div>

    <div id="errorWrap" class="error"></div>
  </div>

  <script>
    const fileInput  = document.getElementById('file');
    const csvText    = document.getElementById('csvText');
    const parseBtn   = document.getElementById('parseBtn');
    const loadSample = document.getElementById('loadSample');
    const jsonResult = document.getElementById('jsonResult');
    const tableWrap  = document.getElementById('tableWrap');
    const statsWrap  = document.getElementById('statsWrap');
    const errorWrap  = document.getElementById('errorWrap');

    // 示例数据（含中文、逗号、引号边界情况）
    const sampleCSV = `id,name,age,city,salary
1,"张三",28,北京,1000
2,"李四",34,上海,850
3,"王,五",22,"广,州",1200
4,"赵六",30,深圳,950
5,"Ann ""The Ace""",27,New York,1100
`;

    function updateParseBtn() {
      parseBtn.disabled = !(csvText.value.trim().length > 0 || fileInput.files.length > 0);
    }

    csvText.addEventListener('input', updateParseBtn);

    fileInput.addEventListener('change', e => {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = () => { csvText.value = reader.result; updateParseBtn(); };
        reader.readAsText(e.target.files[0]);
      } else {
        updateParseBtn();
      }
    });

    loadSample.addEventListener('click', () => {
      csvText.value = sampleCSV;
      updateParseBtn();
    });

    // 核心解析函数
    function parseAndAnalyze(csvString) {
      errorWrap.textContent = '';
      const parsed = Papa.parse(csvString, {
        dynamicTyping: false,
        skipEmptyLines: false,
        newline: "",
      });

      if (parsed.errors && parsed.errors.length > 0) {
        const e = parsed.errors[0];
        errorWrap.textContent = `解析错误: ${e.message} (row ${e.row})`;
        return null;
      }

      const data = parsed.data;
      if (!data || data.length === 0) {
        errorWrap.textContent = 'CSV 为空或无法解析';
        return null;
      }

      const headers = data[0].map(h => String(h));
      const rows = data.slice(1);
      const colCount = headers.length;
      const stats = {};

      for (let i = 0; i < colCount; i++) {
        stats[headers[i]] = { sum: 0, avg: 0, count: 0, isNum: true };
      }

      for (const row of rows) {
        // 跳过全空行（文件末尾多余空行）
        if (row.every(c => String(c ?? '').trim() === '')) continue;

        for (let i = 0; i < colCount; i++) {
          const header = headers[i];
          const cell = (i < row.length && row[i] != null) ? String(row[i]).trim() : '';

          if (cell === '') {
            stats[header].isNum = false;
            continue;
          }

          const n = Number(cell);
          if (!Number.isFinite(n)) {
            stats[header].isNum = false;
            continue;
          }

          stats[header].sum += n;
          stats[header].count += 1;
        }
      }

      for (const h of headers) {
        const cs = stats[h];
        if (cs.count > 0) {
          cs.avg = cs.sum / cs.count;
        } else {
          cs.isNum = false;
        }
      }

      return {
        headers,
        rowCount: rows.filter(r => !r.every(c => String(c ?? '').trim() === '')).length,
        rows,
        stats,
      };
    }

    function escapeHtml(s) {
      return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function renderResult(obj) {
      if (!obj) {
        jsonResult.textContent = '解析失败';
        tableWrap.innerHTML = '';
        statsWrap.innerHTML = '';
        return;
      }

      jsonResult.textContent = JSON.stringify(obj, null, 2);

      const MAX_ROWS = 200;
      const { headers, rows } = obj;
      let html = '<table><thead><tr>';
      for (const h of headers) html += `<th>${escapeHtml(h)}</th>`;
      html += '</tr></thead><tbody>';
      for (const row of rows.slice(0, MAX_ROWS)) {
        html += '<tr>';
        for (let i = 0; i < headers.length; i++) {
          html += `<td>${escapeHtml(String(row[i] ?? ''))}</td>`;
        }
        html += '</tr>';
      }
      if (rows.length > MAX_ROWS) {
        html += `<tr><td colspan="${headers.length}">... 仅显示前 ${MAX_ROWS} 行，总行数 ${rows.length} ...</td></tr>`;
      }
      html += '</tbody></table>';
      tableWrap.innerHTML = html;

      statsWrap.innerHTML = '';
      for (const h of headers) {
        const cs = obj.stats[h];
        const card = document.createElement('div');
        card.className = 'stat-card';
        card.innerHTML = `<strong>${escapeHtml(h)}</strong>
          <div>isNum: ${cs.isNum}</div>
          <div>count: ${cs.count}</div>
          <div>sum: ${Number(cs.sum).toLocaleString()}</div>
          <div>avg: ${cs.count > 0 ? Number(cs.avg).toLocaleString() : '-'}</div>`;
        statsWrap.appendChild(card);
      }
    }

    parseBtn.addEventListener('click', () => {
      errorWrap.textContent = '';
      const text = csvText.value;
      if (!text || text.trim() === '') {
        errorWrap.textContent = '请先选择文件或粘贴 CSV 内容';
        return;
      }
      const obj = parseAndAnalyze(text);
      if (obj) renderResult(obj);
    });

    // 初始化：自动填入示例
    csvText.value = sampleCSV;
    updateParseBtn();

    // Ctrl/Cmd + Enter 快捷触发解析
    csvText.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') parseBtn.click();
    });
  </script>
</body>
</html>
```

---

## 6. 编译与运行

### 编译 main.wasm

```bash
# 设置编译目标为浏览器 WASM
GOOS=js GOARCH=wasm go build -o main.wasm main.go

# 复制 Go 运行时胶水文件（路径根据 Go 版本可能不同）
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" .
# 或（较新版本）
find $(go env GOROOT) -name "wasm_exec.js"
```

### 启动本地 HTTP 服务器

**必须通过 HTTP 服务器访问**，不能直接双击打开 HTML 文件，原因是 `fetch()` 在 `file://` 协议下被浏览器安全策略阻止。

```bash
# Python 3（推荐，零依赖）
python3 -m http.server 8080

# 或 Node.js（需安装 http-server）
npx http-server -p 8080
```

浏览器访问：
- `http://localhost:8080/index.html` — Go WASM 版
- `http://localhost:8080/index2.html` — PapaParse 版

---

## 7. 数据结构说明

### Go 端结构体

```go
// 顶层返回结果
type Result struct {
  Headers  []string              `json:"headers"`    // 表头列表
  RowCount int                   `json:"row_count"`  // 数据行数（不含表头）
  Rows     [][]string            `json:"rows,omitempty"`  // 所有数据行
  Stats    map[string]ColumnStat `json:"stats,omitempty"` // 按列名索引的统计
  Error    string                `json:"error,omitempty"` // 错误信息（有错时才出现）
}

// 单列统计
type ColumnStat struct {
  Sum   float64 `json:"sum,omitempty"` // 数值之和
  Avg   float64 `json:"avg,omitempty"` // 平均值
  Count int     `json:"count"`         // 有效数值行数
  IsNum bool    `json:"is_num"`        // 该列是否为纯数值列
}
```

### 判断"数值列"的规则

1. 初始假设每列都是数值列（`IsNum: true`）
2. 遇到空字符串 → `IsNum = false`
3. 遇到 `strconv.ParseFloat` 失败的值 → `IsNum = false`
4. 只要有任意一行无法解析，整列标记为非数值列

---

## 8. 常见问题

**Q: 打开页面报 `TypeError: Failed to fetch`**

A: 用了 `file://` 直接打开，必须通过 HTTP 服务器（见第 6 节）。

**Q: `wasm_exec.js` 找不到**

A: Go 版本不同路径不同，用以下命令搜索：
```bash
find $(go env GOROOT) -name "wasm_exec.js"
```

**Q: WASM 加载很慢**

A: `.wasm` 文件包含完整 Go 运行时，通常在 2–5 MB 之间，首次加载较慢属正常现象。生产环境建议开启 gzip 压缩。

**Q: 修改 Go 代码后页面没变化**

A: 需要重新编译并刷新浏览器（强刷 `Cmd+Shift+R` / `Ctrl+Shift+R`）：
```bash
GOOS=js GOARCH=wasm go build -o main.wasm main.go
```

**Q: index2.html 在离线环境无法使用**

A: PapaParse 通过 CDN 加载，离线时需要将 `papaparse.min.js` 下载到本地并修改 `<script src>` 路径。
