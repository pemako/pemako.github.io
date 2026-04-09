---
date: '2025-04-27T12:50:41+08:00'
title: 'Unsafe'
description: ""
summary: ""
tags: ["go"]
categories: ["go"]
series: ["Go"]
ShowToc: true
TocOpen: true
---

## unsafe 包学习

> uintptr 和 unsafe.Pointer 的区别

- `unsafe.Pointer` 只是单纯的通用指针类型，用于转换不同类型指针，它不可以参与指针运算
- 而 `uintptr` 是用于指针运算的，`GC` 不把 `uintptr` 当指针，也就是说 `uintptr` 无法持有对象， `uintptr` 类型的目标会被回收
- `unsafe.Pointer` 可以和 普通指针 进行相互转换
- `unsafe.Pointer` 可以和 `uintptr` 进行相互转换

### 示例

```go
package main

import (
  "fmt"
  "unsafe"
)

type W struct {
  b int32
  c int64
}

func main() {
  var w = new(W)
  fmt.Println(w.b, w.c)

  // 通过指针运算给 b 变量赋值
  b := unsafe.Pointer(uintptr(unsafe.Pointer(w)) + unsafe.Offsetof(w.b))
  *((*int)(b)) = 100

  fmt.Println(w.b, w.c)
}


// uintptr(unsafe.Pointer(w)) 获取了 w 的指针起始值
// unsafe.Offsetof(w.b) 获取 b 变量的偏移量
// 两个相加就得到了 b 的地址值，将通用指针 Pointer 转换成具体指针 ((*int)(b))，通过 * 符号取值，然后赋值。*((*int)(b)) 相当于把 (*int)(b) 转换成 int 了，最后对变量重新赋值成 10，这样指针运算就完成了

```
