---
date: '2026-04-09T20:00:00+08:00'
title: 'macOS 汇编'
description: ""
summary: ""
tags: ["assembly", "macos"]
categories: ["assembly"]
series: ["Assembly"]
ShowToc: true
TocOpen: true
---

### 十进制与二进制的相互转换

#### 十进制转为二进制，分为整数部分和小数部分

整数部分采用除 2 倒取余法: 用2去除十进制整数，可以得到一个商和余数；在用2去除商，又会得到一个商和余数，如此进行，知道商为0时为止，然后把先的到的余数作为二进制的低位有效位，后得到的余数作为二进制数的高位有效位，依次排列起来。

小数部分采用乘2取整法，具体做法：用2乘十进制小数，可以得到积，将积中的整数部分取出，在用2乘余下的小数部分，又得到一个积，在将积中的整数部分取出，如此进行，直到积中的小数部分为0，此时0或1为二进制的最后一位，或者达到所要求的精度为止，然后把取出的整数部分按顺序排列起来，先取得整数作为二进制小数的最高位有效位，后取的整数作为低位有效位。

#### 二进制转为十进制

**按权相加法**，即将二进制每位上的数乘以权，然后相加之和即是十进制数

### 预备知识

由于计算机的硬件决定，**任何存储于计算机中的数据，其本质都是以二进制码存储**。

根据冯·诺依曼提出的经典计算机体系结构框架，一台计算机由运算器、控制器、存储器、输入和输出设备组成。其中运算器**只有加法运算器**，没有减法运算器（据说一开始是有的，后来由于减法运算器硬件开销太大，被废了）。

所以计算机中没办法直接做减法的，它的减法是通过加法实现的。现实世界中所有的减法也可以当成加法的，减去一个数可以看作加上这个数的相反数，但前提是要先有负数的概念，这就是为什么不得不引入一个符号位。**符号位在内存中存放的最左边一位，如果该位为0，则说明该数为正；若为1，则说明该数为负。**

而且从硬件的角度上看，只有正数加负数才算减法，正数与正数相加，负数与负数相加，其实都可以通过加法器直接相加。

原码、反码、补码的产生过程就是为了解决计算机做减法和引入符号位的问题。

### 原码

原码：**是最简单的机器数表示法，用最高位表示符号位，其他位存放该数的二进制的绝对值**。

以带符号位的四位二进制数为例：1010，最高位为1表示这是一个负数，其它三位010，即0*2^2+1*2^1+0*2^0=2，所以1010表示十进制数-2。

|     | 正数 |     |     | 负数 |
| --- | ---- | --- | --- | ---- |
| 0   | 0000 |     | -0  | 1000 |
| 1   | 0001 |     | -1  | 1001     |
| 2   | 0010 |     | -2 |  1010    |
| 3   | 0011 |     | -3 |  1011    |
| 4   | 0100 |     | -4 |  1100    |
| 5   | 0101 |     | -5 |  1101    |
| 6   | 0110 |     | -6 |  1110    |
| 7   | 0111 |     | -7 |  1111    |

原码的表示法很简单，虽然出现了+0和-0，但是直观易懂。于是开始运算 ---

> 0001 + 0010 = 0011,  1+2=3;
> 0000 + 1000= 1000, +0+(-0)=-0;
> 0001 + 1001=1010, 1+(-1)=-2

于是可以看到其实正数之间的加法通常是不会出错的，因为它就是一个很简单的二进制加法，而正数与负数相加，或负数与负数相加，就要引起莫名其妙的结果，这都是符号位引起的。0分为+0和-0也是因它而起。

**原码的特点：**

1. 原码表示直观、易懂，与真值转换容易。

2. 原码中0有两种不同的表示形式，给使用带来了不便。

> 通常0的原码用+0表示，若在计算过程中出现了-0，则需要用硬件将-0变成+0。

3. 原码表示加减运算复杂。

> 利用原码进行两数相加运算时，首先要判别两数符号，若同号则做加法，若异号则做减法。在利用原码进行两数相减运算时，不仅要判别两数符号，使得同号相减，异号相加；还要判别两数绝对值的大小，用绝对值大的数减去绝对值小的数，取绝对值大的数的符号为结果的符号。可见，原码表示不便于实现加减运算。

### 反码

原码最大的问题就在于一个数加上它的相反数不等于0，于是反码的设计思想就是冲着解决这一点，既然一个负数是一个正数的相反数，那干脆用一个正数按位取反来表示负数。

反码：**正数的反码还是等于原码；负数的反码就是它的原码除符号位外，按位取反**。

以带符号位的四位二进制数为例：3是正数，反码与原码相同，则可以表示为0011；-3的原码是1011，符号位保持不变，低三位按位取反，所以-3的反码为1100。

|     | 正数 |     |     | 反码/负数 | 原码/负数 |
| --- | ---- | --- | --- | --------- | --------- |
| 0   | 0000 |     | -0  | 1111      | 1000          |
| 1   | 0001 |     | -1  | 1110      | 1001          |
| 2   | 0010 |     | -2  | 1101      | 1010          |
| 3   | 0011 |     | -3  | 1100      | 1011          |
| 4   | 0100 |     | -4  | 1011      | 1100          |
| 5   | 0101 |     | -5  | 1010      | 1101          |
| 6   | 0110 |     | -6  | 1001      | 1110          |
| 7   | 0111 |     | -7  | 1000      | 1111          |

再试着用反码的方式解决一下原码的问题——

> 0001+1110=1111，1+(-1)=-0；  
> 1110+1100=1010，(-1)+(-3)=-5。

互为相反数相加等于0，虽然的到的结果是1111也就是-0。但是两个负数相加的出错了。

**反码的特点：**

1. 在反码表示中，用符号位表示数值的正负，形式与原码表示相同，即0为正；1为负。
2. 在反码表示中，数值0有两种表示方法。
3. 反码的表示范围与原码的表示范围相同。

**反码表示在计算机中往往作为数码变换的中间环节。**

### 补码

**正数的补码等于它的原码；负数的补码等于反码+1**（这只是一种算补码的方式，多数书对于补码就是这句话）。

其实负数的补码等于反码+1只是补码的求法，而不是补码的定义，很多人以为求补码就要先求反码，其实并不是，那些计算机学家并不会心血来潮的把反码+1就定义为补码，只不过补码正好就等于反码+1而已。

如果有兴趣了解补码的严格说法，建议可以看一下《计算机组成原理》，它会用“模”和“同余”的概念，严谨地解释补码。

```assembly
movq $0x1a, %rax ; 这两行表示的是一个意思, 采用16进制表示
movq $26, %rax   ; 这两行表示的是一个意思, 采用10进制表示
```

- 一个八进制数的一位代表一个二进制数的三位
- 一个十六进制的一位代表一个二进制数的四位

### [[字节序]]

### [[MacOS结构]]


---


## 1、软件安装

在macOS 运行汇编需要的工具有 `gcc`, `nasm`, `gdb`。使用`brew`安装需要的软件 `brew install nasm gdb`


## 2、准备知识

- 文件名`hello.c`
    ```c
    #include <stdio.h>
    int main() {
        return 0;
    }
    ```

- 文件名`hello.s`
    ```
    global _main
    
    _main:
        mov rax, 0
        ret
    ```

##### 一个C语言程序文件，需要经过两步才能转换成为可执行文件

> 在C语言中gcc 即是编译器又是连接器下面两步可以直接使用 `gcc hello.c -o hello` 这样不会生成`hello.o`目标文件

- 1、使用`C编译器`对源文件进行`编译`,生成"目标文件"
    - `gcc -c hello.c` 生成目标文件`hello.o` 
- 2、使用`链接器`对一个或多个目标文件进行连接,生成可执行文件
    - `gcc hello.o` 默认生成`a.out` 可以使用`-o`指定生成的执行文件名称 `gcc hello.o -o hello` 

##### 汇编语言同样是两个步骤

> 汇编语言的汇编器是 `nasm`链接器也是`gcc`;  下面已`hello.s`为例介绍汇编链接过程

- 1、使用`汇编器`对源文件进行汇编，生成"目标文件"
    - `nasm -f macho64 hello.s` 会生成 `hello.o`的目标文件
    - `-f macho64`表示生成macOS平台x86_64格式的目标文件
- 2、使用`链接起`对一个或多个目标文件进行链接，生成可执行文件
    - `gcc hello.o -o hello` 这样就会生成可执行 `hello`   

## 3、示例说明

- hello2.c

```c
#include <unistd.h>
int main() {
    char *msg = "Hello world\n"; // 定义要输出的文件msg
    write(1, msg, 12);           // 输出msg, 12为msg的长度
    _exit(0);                    // 调用 _exit函数返回
}
```

- hello1.s

```
; 定义要输出的文字msg，db是data byte的意思
; 0x0a表示换行符，0x前缀表示十六进制，
; 也可以用h后缀表示十六进制，比如41h，0ch，以a～f开头的十六进制前面一定要加0
msg: db "Hello World", 0x0a

global _main

_main:
    ; 要调用的write函数，放入寄存器rax
    mov rax, 0x2000004
    mov rdi, 1     ; 第1个参数1，放入寄存器rdi
    mov rsi, msg   ; 第2个参数msg，放入寄存器rsi，此行链接时会报警告
    mov rdx, 12    ; 第3个参数12，放入寄存器rdx
    syscall        ; 调用rax寄存器中的函数
    ret            ; 函数调用返回

    ; 要调用的_exit函数，放入寄存器rax
    mov rax, 0x2000001
    mov rdi, 0     ; 第1个参数0，放入寄存器rdi
    syscall        ; 调用rax寄存器中的函数
    ret            ; 函数调用返回
```

汇编并链接 `nasm -f macho64 hello1.s && gcc hello1.o -o hello1`; 会出现警告信息 `ld: warning: PIE disabled. Absolute addressing (perhaps -mdynamic-no-pic) not allowed in code signed PIE, but used in _main from hello1.o. To fix this warning, don't compile with -mdynamic-no-pic or link with -Wl,-no_pie`先不管，接着运行./hello1可以看到能正常输出Hello world。程序的解释我先以注释形式放在程序内，汇编的注释以分号开头，到行末结束。


- hello2.s

修复一下警告，并重构一下代码;警告是由指令`mov rsi`, msg引起的。这条指令的意思是把msg的地址放到寄存器`rsi`中，而链接器认为你使用了绝对地址，不能直接使用msg的地址。我们用`lea rsi [rel msg]`替换刚才的语句就可以了。12是`Hello World`字符串的长度，改了字符串还要改这个值，可以自动计算字符串的长度两段函数调用处都有，`syscall`和`ret`语句，这两句是调用系统内核，可以提取一个公用的代码段修复了这三个问题的程序`hello2.s`如下


```
SECTION .data           ; 数据代码段

msg: db "Hello World", 0x0a
len: equ $-msg          ; 计算msg的长度，赋值给len

SECTION .text           ; 程序代码段

global _main

kernal:
    syscall
    ret

_main:
    mov rax, 0x2000004
    mov rdi, 1
    lea rsi, [rel msg]
    mov rdx, len        ; 把len的值作为参数传入
    call kernal         ; 调用kernal处的代码

    mov rax, 0x2000001
    mov rdi, 0
    call kernal
```

- 对可执行文件进行反汇编

![](https://raw.githubusercontent.com/pemako/imgs/master/public/01-001-6-assembly-mac_assembly_environment-001.png)


#### 参考

-  [https://www.jianshu.com/p/552f37d3c9b0](https://www.jianshu.com/p/552f37d3c9b0)
-  [https://www.jianshu.com/p/ead99e10c572](https://www.jianshu.com/p/ead99e10c572)

---


> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [www.jianshu.com](https://www.jianshu.com/p/b684092e01b0)

> 2016 年 6 月，苹果公司宣布 OS X 更名为 macOS，以便与苹果其他操作系统如 iOS、watchOS 和 tvOS 保持统一的命名风格。
> Mac OS X 包含两个主要部分：以 FreeBSD 源代码 和 Mach 微核心为基础的 XUN 混合内核，并在 XNU 上构建的 Darwin 核心系统；及一个由苹果开发，称为 Aqua 的闭源、独占版权的图形用户界面。细分的看，Mac OS X 系统可以分成五层结构，每一层有其代表性技术。

![macOS 结构图](https://upload.wikimedia.org/wikipedia/commons/f/f2/Diagram_of_Mac_OS_X_architecture.svg)

### 内核和设备服务层

**内核和设备服务层：**包括 XNU 内核、设备驱动和其他底层组件。XNU 是由苹果电脑发展的操作系统内核，被使用于 Mac OS X 中。它是 Darwin 操作系统的一部分，跟随着 Darwin 一同作为自由及开放源代码软件被发布。其中，XNU  
是 X is Not Unix 的缩写。XNU 包括 Mach 和 BSD（libSystem）两个部分，最初版本的 XNU 是 Mach 2.5 版本和 BSD 4.3 的混合，随着 OS X 的发布，Mach 版本升级到 3，BSD 部分被 FreeBSD 替代。

* **Mach**

Mach 是一个由卡内基梅隆大学开发的计算机操作系统`微内核`， 是最早实现微内核操作系统的例子之一，也是许多其他相似的项目的标准。同 Unix 一样，Mach 系统也包含了一组丰富的实用工具，并保留了 Unix 中驱动程序的概念用以硬件交互。在 OS X 中，Mach 内核为系统提供了 64 内核和主要驱动支持。

* **BSD**

伯克利软件套件（英语：Berkeley Software Distribution，缩写为 BSD），也被称为伯克利 Unix（Berkeley Unix），是一个操作系统的名称，现在 BSD 也被用于称呼其衍生的各种套件。时至今日， OS X 中的许多命令行工具还是来源于 BSD。在 OS X 中，文件系统、网络栈、IPC、通知机制的支持也来自 BSD。

### 核心系统层（Core OS）

核心系统层的技术和框架是硬件 / 网络相关的底层服务，这些服务是和内核特性直接相关的。包括以下组件和框架（不完全列举）：

* 安全措施：（为上层提供支持）包括 Gatekeeper、APP 沙盒化、代码签名等。
* Core OS 框架：包括磁盘管理、硬件加速、OpenCL、系统配置等。
* Hypervisor：虚拟化支持。

### 核心服务层（Core service）

核心服务层和用户界面的应用程序没有直接联系，但是它们建立在内核和核心系统层上，为 APP 提供诸如数据处理、字符串控制、封装网络库等核心支持。包括以下组件和框架（不完全列举）：

* iCloud 存储服务和 CloudKit
* 社交网络帐号：包括保存在 OS X 内的社交帐户的管理。
* 文件管理
* 本地化设置：语言、货币、日期和时间的格式化、编码、字体排版和渲染。
* 安全认证：包括本地账户、信任的证书、安全传输、密钥串访问等。
* Time Machine 支持：OS X 的系统备份功能。
* [Bonjour](https://links.jianshu.com/go?to=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FBonjour)：局域网下的设备发现服务，是打印机服务和局域网文件共享服务的基础。
* XML 和 SQLite 支持：系统和 APP 的配置文件使用 XML 格式进行存储，数据使用 SQLite 格式进行保存。
* [Webkit](https://links.jianshu.com/go?to=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FWebkit): 允许 APP 进行网页渲染，具有 Web Core 和 JavaScript Core 两个部分。
* 快速预览：包括在 spotlight 中预览和空格键预览。
* Store Kit: 为 Mac Appstore 和 iTunes 提供支持，处理相关请求。
* Core Services Umbrella Framework：包括管理文件打开方式、MIME 支持、文件元数据管理、SearchKit 搜索支持、词典服务等。
  * [Carbon](https://links.jianshu.com/go?to=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FCarbon_%28API%29): Carbon 也是 OS X 上的原生 API，也是 Core Services Umbrella Framework 的子集，和 Cocoa 不同的是，Carbon 是面向过程（Procedural）的编程语言 API，也更加接近系统底层，可以使用包括 C 和 C++ 在内的多种编程语言进行开发，类似 Windows 的 win32 API。Carbon API 提供了良好的向下兼容性，为开发者快速将旧 MacOS 上的程序移植到 OS X 提供了便利，但是 Carbon 本身已经处于被苹果不建议使用的状态，也没有 64 位支持，在 OS X 10.8 后苹果没有对 Carbon 提供后续更新。

### 媒体层

媒体层负责音频、图像等多媒体文件的处理，2D 和 3D 图像的渲染，各种动画支持。

* [OpenGL](https://links.jianshu.com/go?to=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FOpenGL) ：OpenGL 是一个定义了一个跨编程语言、跨平台的应用程序接口（API）的规范，它用于生成二维、三维图像。OpenGL 本身与语言和平台无关，它将具体实现交给窗口系统，OS X 也提供了 OpenGL 的实现。
* [Metal](https://links.jianshu.com/go?to=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FMetal_%28API%29) ：Metal 是一种面向底层的硬件加速 API，Metal 在单一 API 下提供了类似 OpenGL 和 OpenCL 的功能，旨在为提供和 Windows 上 [Direct3D 12](https://links.jianshu.com/go?to=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FDirect3D) 和跨平台的 [Vulkan](https://links.jianshu.com/go?to=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FVulkan_%28API%29) 相似的功能和特性。 从 10.11 开始在 OS X 上提供支持。
* [Quartz](https://links.jianshu.com/go?to=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FQuartz)：Quartz 是 OS X 上的 UI 绘图层，由 Quartz Compositor（合成视窗系统，管理和合成幕后视窗视频来创建 Mac OS X 用户界面） 和 Quartz 2D（以 PDF 规范为基础的图形库，用来绘制二维文字和图形，现在被称为 Core Graphics）组成。
* 颜色管理
* 音视频文件解析：包括 QuickTime Kit、Core Media 、Core Video 等一系列多媒体处理框架。
* 字体渲染系统：包括 Cocoa Text 系统和 Core Text。

### 图形用户界面（Cocoa 层）

图形用户界面层包括设计和用户交互的 UI、响应用户操作、管理程序的行为。

* Aqua：Aqua 是承载于 Quartz 上的 GUI 系统和视觉主题，首次发布于 2000 年。
* X11（XQuartz）: XQuartz 是 OS X 上 [X 窗口系统](https://links.jianshu.com/go?to=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FX%25E7%25AA%2597%25E5%258F%25A3%25E7%25B3%25BB%25E7%25BB%259F)的一个实现，最初和 OS X 10.2 公开预览版一起提供，从 OS X 10.8 开始不随系统提供。
* Spotlight：OS X 下的搜索工具。
* [Cocoa](https://links.jianshu.com/go?to=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FCocoa): Cocoa 是 Mac OS X 上原生面向对象的编程环境，建立在 Quartz 上并由 Objective-C 语言编写，Cocoa 程序也主要使用 Objective-C 语言编写，但是通过桥接技术，也可以使用 JAVA、Python、Ruby 等语言开发 Cocoa 应用。Cocoa 是典型的 [MVC](https://links.jianshu.com/go?to=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FMVC) 模式。
  * Appkit：直接派生自 NeXTSTEP 的 AppKit 的。它包含了程序与图形用户界面交互所需的代码。
  * Foundation 工具包：首先出现在 OpenStep 中。在 Mac OS X 中，它是基于 Core Foundation 的。作为通用的面向对象的函数库，Foundation 提供了字符串，数值的管理，容器及其枚举，分布式计算，事件循环，以及一些其它的与图形用户界面没有直接关系的功能。
  * [Core Data](https://links.jianshu.com/go?to=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FCore_Data)：Core Data 是 Mac OS X 中 Cocoa API 的一部分，它允许按照 MVC 模型组织 APP 的数据，并以 XML，二进制文件或 SQLite 数据文件的格式将其序列化。

## [[Mach-O文件结构]]


---

Mach-O 是 Mach Object 文件格式的缩写，是一种可执行文件


https://geneblue.github.io/2021/01/04/osx/sec--MachO-file-format/
https://juejin.cn/post/7022810233105809439
https://opensource.apple.com/source/xnu/xnu-4903.221.2/EXTERNAL_HEADERS/mach-o/
https://github.com/apple-oss-distributions/xnu
https://www.jianshu.com/p/8f2740fbfe82
https://www.jianshu.com/p/332b183c055a
https://www.jianshu.com/p/3fae23dc081d

