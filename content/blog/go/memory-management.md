---
date: '2026-04-09T20:00:00+08:00'
title: 'Go 内存管理'
description: ""
summary: ""
tags: ["go"]
categories: ["go"]
series: ["Go"]
ShowToc: true
TocOpen: true
---

在 Go 或其他编程语言中，内存分配在 堆（heap） 和 栈（stack） 上有明显的区别。以下是两者的概念、特点和区别的详细说明：

1. 栈（Stack）

栈内存是一种快速、高效的内存分配方式，通常用于存储函数调用期间的局部变量。

特点
 • 内存分配：
 • 在函数调用时自动分配。
 • 在函数返回时自动释放（自动管理）。
 • 作用域：
 • 存储局部变量（比如函数内声明的变量）。
 • 生命周期受限于函数作用域，函数退出后变量被销毁。
 • 分配速度：
 • 分配速度快，因为栈是按顺序分配内存。
 • 空间大小：
 • 通常栈空间有限（在 Go 中，栈的初始大小是 2KB，动态增长至 1GB）。
 • 线程独立性：
 • 每个 Goroutine 都有自己的栈。

使用场景
 • 存储函数的局部变量、参数和返回地址。
 • 轻量、短期使用的内存。

2. 堆（Heap）

堆内存是一种灵活的内存分配方式，适用于需要跨函数或长期使用的内存。

特点
 • 内存分配：
 • 通过动态分配（如 new 或 make）申请。
 • 不会自动释放，需要由垃圾回收器（GC）管理。
 • 作用域：
 • 分配的内存可以在函数返回后继续存在（通常用于共享内存）。
 • 分配速度：
 • 分配速度相对较慢，因为需要复杂的内存管理。
 • 空间大小：
 • 堆的内存大小较大，但分配和回收消耗更多资源。
 • 线程共享性：
 • 堆内存是全局共享的，所有 Goroutine 都可以访问。

使用场景
 • 分配较大、需要长期使用的对象。
 • 在多个函数或 Goroutine 之间共享的数据。

3. 栈和堆的区别

特性 栈（Stack） 堆（Heap）
内存分配 自动分配，按调用顺序增长 动态分配，通过垃圾回收管理
分配速度 快 慢
作用域 函数内（局部变量） 全局（跨函数、长期变量）
空间大小 小，受限于系统设置 大
管理方式 自动管理 垃圾回收器（GC）管理
线程安全 每个 Goroutine 独立 所有 Goroutine 共享

4. 为什么区分栈和堆？
 • 性能原因：
栈分配和释放内存速度快，适合存储生命周期短的对象；堆虽然灵活但开销更高。
 • 垃圾回收负担：
堆分配需要 GC 追踪和回收，会引发一定的性能损耗。
 • 共享性：
栈变量是局部的，安全性高；堆变量可被多个函数或线程共享。

5. 在 Go 中如何决定分配到栈或堆？

Go 编译器会根据变量的作用域和生命周期决定分配位置：
 1. 逃逸分析（Escape Analysis）：
 • 如果一个变量被函数外部引用，或者其生命周期超过函数范围，变量会分配到堆。
 • 反之，分配到栈。
 2. 自动优化：
 • Go 编译器会根据优化需求调整栈或堆的分配。

示例

```go
package main

import "fmt"

func main() {
    x := 10                // 分配在栈上
    p := &x                // 由于 p 引用了 x，x 会逃逸到堆
    fmt.Println(*p)
}

```

在这个例子中，x 被 p 引用，逃逸分析会将其分配到堆。

6. 相关建议
 • 尽量减少堆分配：过多的堆分配会增加垃圾回收的负担。
 • 使用局部变量：局部变量通常分配在栈上，性能更高。
 • 优化逃逸分析：在设计程序时注意变量作用域，避免不必要的逃逸。

通过了解栈和堆的区别，你可以更高效地优化程序的性能和内存使用！


---

这篇文章详细介绍了 Go 语言的内存对齐。包括(x)确定变量内存字节数，不同基础类型的内存占用大小，结构体因变量顺序不同内存大小有别从而引出内存对齐。阐述了内存对齐的规则，如成员对齐、整体对齐，还说明了空结构体作为成员变量时内存占用与位置的关系，最后提到可通过调整变量位置优化内存占用。

关联问题: 如何优化结构体内存 内存对齐适用场景有哪些 空结构体在中间时怎样

> 你必须非常努力，才能看起来毫不费力！
>
> 微信搜索公众号\[ 漫漫Coding路 \]，一起From Zero To Hero !

## 前言

前面有篇文章我们学习了 Go语言空结构体，最近又在看 unsafe包 的知识，在查阅相关资料时不免会看到内存对齐相关的内容，虽然感觉这类知识比较底层，但是看到了却不深究和渣男有什么区别？虽然我不会，但我可以学🐶，那么这篇文章，我们就一起来看下什么是内存对齐吧！

> 说明：本文中的测试示例，均是基于Go1.17 64位机器

## 基础知识

在Go语言中，我们可以通过 `unsafe.Sizeof(x)` 来确定一个变量占用的内存字节数（不包含 x 所指向的内容的大小）。

例如对于字符串数组，在64位机器上，unsafe.Sizeof() 返回的任意字符串数组大小为 24 字节，和其底层数据无关：

```go
func main() { s := []string{"1", "2", "3"} s2 := []string{"1"} fmt.Println(unsafe.Sizeof(s)) // 24 fmt.Println(unsafe.Sizeof(s2)) // 24 }
```

对于Go语言的内置类型，占用内存大小如下：

| 类型 | 字节数 |
| --- | --- |
| bool | 1个字节 |
| intN, uintN, floatN, complexN | N/8 个字节 （int32 是 4 个字节） |
| int, uint, uintptr | 计算机字长/8 (64位 是 8 个字节) |
| \*T, map, func, chan | 计算机字长/8 (64位 是 8 个字节) |
| string （data、len） | 2 \* 计算机字长/8 (64位 是 16 个字节) |
| interface (tab、data 或 \_type、data) | 2 \* 计算机字长/8 (64位 是 16 个字节) |
| \[\]T (array、len、cap) | 3 \* 计算机字长/8 (64位 是 24 个字节) |

```go
func main() { fmt.Println(unsafe.Sizeof(int(1))) // 8 fmt.Println(unsafe.Sizeof(uintptr(1))) // 8 fmt.Println(unsafe.Sizeof(map[string]string{})) // 8 fmt.Println(unsafe.Sizeof(string(""))) // 16 fmt.Println(unsafe.Sizeof([]string{})) // 24 var a interface{} fmt.Println(unsafe.Sizeof(a)) // 16 }
```

## 看个问题

基于上面的理解，那么对于一个结构体来说，占用内存大小就应该等于多个基础类型占用内存大小的和，我们就结合几个示例来看下：

```go
type Example struct { a bool // 1个字节 b int // 8个字节 c string // 16个字节 } func main() { fmt.Println(unsafe.Sizeof(Example{})) // 32 }
```

Example 结构体的三个基础类型，加起来一个 `25字节`，但是最终输出的却是 `32字节`。

我们再看两个结构体，`即使这两个结构体包含的字段类型一致，但是顺序不一致，最终输出的大小也不一样`：

```go
type A struct { a int32 b int64 c int32 } type B struct { a int32 b int32 c int64 } func main() { fmt.Println(unsafe.Sizeof(A{})) // 24 fmt.Println(unsafe.Sizeof(B{})) // 16 }
```

是什么导致了上述问题的呢，这就引出了我们要看的知识点：**内存对齐**。

## 什么是内存对齐

我们知道，在计算机中访问一个变量，需要访问它的内存地址，从理论上讲似乎对任何类型的变量的访问可以从任何地址开始，但实际情况是：在访问`特定类型变量`的时候通常在`特定的内存地址`访问，这就需要对这些数据在内存中存放的位置有限制，各种类型数据按照一定的规则在空间上排列，而不是顺序的一个接一个的排放，这就是对齐。

内存对齐是编译器的管辖范围。表现为：编译器为程序中的每个“数据单元”安排在适当的位置上。

## 为什么需要内存对齐

1. 有些`CPU`可以访问任意地址上的任意数据，而有些`CPU`只能在特定地址访问数据，因此不同硬件平台具有差异性，这样的代码就不具有移植性，如果在编译时，将分配的内存进行对齐，这就具有平台可以移植性了。

2. `CPU` 访问内存时并不是逐个字节访问，而是以字长（word size）为单位访问，例如 32位的CPU 字长是4字节，64位的是8字节。如果变量的地址没有对齐，可能需要多次访问才能完整读取到变量内容，而对齐后可能就只需要一次内存访问，因此内存对齐可以`减少CPU访问内存的次数，加大CPU访问内存的吞吐量`。

假设每次访问的步长为4个字节，如果未经过内存对齐，获取b的数据需要进行两次内存访问，最后再进行数据整理得到b的完整数据：

![image-20220313230839425](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7310fe138174feea5b59069cea5ef86~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

如果经过内存对齐，一次内存访问就能得到b的完整数据，减少了一次内存访问：

![image-20220313231143302](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef20dddb8d1c49aa99b1930e3b8efb61~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

## unsafe.AlignOf()

unsafe.AlignOf(x) 方法的返回值是 m，当变量进行内存对齐时，需要保证分配到 x 的内存地址能够整除 `m`。因此可以通过这个方法，确定变量x 在内存对齐时的地址：

- 对于任意类型的变量 x ，`unsafe.Alignof(x)` 至少为 1。
- 对于 struct 结构体类型的变量 x，计算 x 每一个字段 f 的 `unsafe.Alignof(x.f)`，`unsafe.Alignof(x)` 等于其中的最大值。
- 对于 array 数组类型的变量 x，`unsafe.Alignof(x)` 等于构成数组的元素类型的对齐倍数。

对于系统内置基础类型变量 x ，`unsafe.Alignof(x)` 的返回值就是 `min(字长/8，unsafe.Sizeof(x))`，即计算机字长与类型占用内存的较小值：

```go
func main() { fmt.Println(unsafe.Alignof(int(1))) // 1 -- min(8,1) fmt.Println(unsafe.Alignof(int32(1))) // 4 -- min (8,4) fmt.Println(unsafe.Alignof(int64(1))) // 8 -- min (8,8) fmt.Println(unsafe.Alignof(complex128(1))) // 8 -- min(8,16) }
```

## 内存对齐规则

我们讲内存对齐，就是把变量放在特定的地址，那么如何计算特定地址呢，这就涉及到内存对齐规则：

- 成员对齐规则

针对一个基础类型变量，如果 `unsafe.AlignOf()` 返回的值是 m，那么该变量的地址需要 `被m整除` （如果当前地址不能整除，填充空白字节，直至可以整除）。

- 整体对齐规则

针对一个结构体，如果 `unsafe.AlignOf()` 返回值是 m，需要保证该结构体整体内存占用是 `m的整数倍`，如果当前不是整数倍，需要在后面填充空白字节。

通过内存对齐后，就可以在保证在访问一个变量地址时：

1. 如果该变量占用内存小于字长：保证一次访问就能得到数据；
2. 如果该变量占用内存大于字长：保证第一次内存访问的首地址，是该变量的首地址。

## 举个例子

**例1：**

```go
type A struct { a int32 b int64 c int32 } func main() { fmt.Println(unsafe.Sizeof(A{1, 1, 1})) // 24 }
```

1. 第一个字段是 int32 类型，unsafe.Sizeof(int32(1))=4，内存占用为4个字节，同时unsafe.Alignof(int32(1)) = 4，内存对齐需保证变量首地址可以被4整除，我们假设地址从0开始，0可以被4整除：

![成员变量1内存对齐](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9eb02524be1043b1868ba7835f58d138~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

2. 第二个字段是 int64 类型，unsafe.Sizeof(int64(1)) = 8，内存占用为 8 个字节，同时unsafe.Alignof(int64(1)) = 8，需保证变量放置首地址可以被8整除，当前地址为4，距离4最近的且可以被8整除的地址为8，因此需要添加四个空白字节，从8开始放置：

![成员变量2内存对齐](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/869b1d13aa8544658c7f73c9fa75592c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

3. 第三个字段是 int32 类型，unsafe.Sizeof(int32(1))=4，内存占用为4个字节，同时unsafe.Alignof(int32(1)) = 4，内存对齐需保证变量首地址可以被4整除，当前地址为16，16可以被4整除：

![成员变量3内存对齐](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c555b9830df4f9fab2885e5d0bed427~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

4. 所有成员对齐都已经完成，现在我们需要看一下整体对齐规则：unsafe.Alignof(A{}) = 8，即三个变量成员的最大值，内存对齐需要保证该结构体的内存占用是 8 的整数倍，当前内存占用是 20个字节，因此需要再补充4个字节：

![整体对齐](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6bc4c50f7643486d9fecd120c15e2682~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

5. 最终该结构体的内存占用为 24字节。

**例二：**

```go
type B struct { a int32 b int32 c int64 } func main() { fmt.Println(unsafe.Sizeof(B{1, 1, 1})) // 16 }
```

1. 第一个字段是 int32 类型，unsafe.Sizeof(int32(1))=4，内存占用为4个字节，同时unsafe.Alignof(int32(1)) = 4，内存对齐需保证变量首地址可以被4整除，我们假设地址从0开始，0可以被4整除：

![成员变量1内存对齐](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6453524326f44d41b51f50f2260013b2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

2. 第二个字段是 int32 类型，unsafe.Sizeof(int32(1))=4，内存占用为4个字节，同时unsafe.Alignof(int32(1)) = 4，内存对齐需保证变量首地址可以被4整除，当前地址为4，4可以被4整除：

![成员变量2内存对齐](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/599df762ea304314a6718bbe8bbb62b5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

3. 第三个字段是 int64 类型，unsafe.Sizeof(int64(1))=8，内存占用为8个字节，同时unsafe.Alignof(int64(1)) = 8，内存对齐需保证变量首地址可以被8整除，当前地址为8，8可以被8整除：

![成员变量3内存对齐](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa0b87ec6a774db5afe70c5339c69935~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

4. 所有成员对齐都已经完成，现在我们需要看一下整体对齐规则：unsafe.Alignof(B{}) = 8，即三个变量成员的最大值，内存对齐需要保证该结构体的内存占用是 8 的整数倍，当前内存占用是 16个字节，已经符合规则，最终该结构体的内存占用为 16个字节。

## 空结构体的对齐规则

如果空结构体作为结构体的内置字段：当变量位于结构体的前面和中间时，不会占用内存；当该变量位于结构体的末尾位置时，需要进行内存对齐，内存占用大小和前一个变量的大小保持一致。

```go
type C struct { a struct{} b int64 c int64 } type D struct { a int64 b struct{} c int64 } type E struct { a int64 b int64 c struct{} } type F struct { a int32 b int32 c struct{} } func main() { fmt.Println(unsafe.Sizeof(C{})) // 16 fmt.Println(unsafe.Sizeof(D{})) // 16 fmt.Println(unsafe.Sizeof(E{})) // 24 fmt.Println(unsafe.Sizeof(F{})) // 12 }
```

## 总结

本篇文章我们一起学习了Go 语言中的内存对齐，主要内容如下：

- unsafe.Sizeof(x) 返回了变量x的内存占用大小
- 两个结构体，即使包含变量类型的数量相同，但是位置不同，占用的内存大小也不同，由此引出了内存对齐
- 内存对齐包含成员对齐和整体对齐，与 unsafe.AlignOf(x) 息息相关
- 空结构体作为成员变量时，是否占用内存和所处位置有关
- 在实际开发中，我们可以通过调整变量位置，优化内存占用（一般按照变量内存大小顺序排列，整体占用内存更小）

## 更多

个人博客: [lifelmy.github.io/](https://link.juejin.cn/?target=https%3A%2F%2Flifelmy.github.io%2F "https://lifelmy.github.io/")

微信公众号：漫漫Coding路
