---
layout: post
title: Golang 概述
category: golang
tags: golang
---

## 安装

- `Git: https://github.com/golang/go`
- `Video: https://www.youtube.com/watch?v=XCsL89YtqCs`

- 源码安装

```
- 获取代码仓库
$ git clone https://go.googlesource.com/go
$ cd go
$ git checkout go1.7

- 安装 go
$ cd src
$ ./all.bash
```


- 设置工作环境

```
 - 工作空间
    - src go 源码文件
    - pkg 包对象
    - bin 目录包含可执行命令


export GOROOT=/usr/local/go
export GOPATH=$HOME/work/golang
export GOBIN=$GOPATH/bin
export PATH=$PATH:$GOBIN
```

# 概述
## 变量

```golang
package main

import "fmt"

func main(){
    var x int32 // 变量声明使用 var 默认值为0
    y := 100 // 在函数内部可以省略 var 进行类型推断
    
    var s = 'Hello world!'
    
    fmt.Println(x, y, s) // 0 100 Hello world
}
```

## 表达式
```golang
// go 有三种流程控制语句  if switch for
package main

import "fmt"

func main(){
    x := 100
    
    if(x > 0){
        fmt.Println("x")
    } else if(x < 0){
        fmt.Println("-x")
    } else {
        fmt.Println("0")
    }
}
```
```golang
// file name switch.go
package main

import "fmt"

func main() {
    x := 100

    switch {
    case x > 0:
        fmt.Println(x)
    case x < 0:
        fmt.Println(-x)
    default:
        fmt.Println("0")
    }
}
```

```golang
// file name for.go

package main 

import "fmt"

func main() {
    for i := 0; i < 5; i++ {
        fmt.Println(i)
    }

    fmt.Println("---")

    for i := 4; i >= 0; i-- {
    	fmt.Println(i)
    }

    fmt.Println("-------")
    
    x := 0
    for x < 5 {	// 相当于 while(x<5)
    	fmt.Println(x)
    	x++
    }

    y := 4
    for { // 相当于 wile(true)
    	fmt.Println(y)
    	y--

    	if y < 0 {
    		break
    	}
    }
}
```

```golang
// file name for-range.go
package main 

import "fmt"

func main() {
    x := []int{100, 101, 102, 103, 104}

    for i, n := range x {
        fmt.Println("index is ", i, "values is", n)
    }
}
```

## 函数
```golang
// 函数可以定义多个返回值，甚至对其命令
package main

import (
    "fmt"
    "errors"
)

func div(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }

    return a/b, nil
}

func main() {
    a, b := 10, 2	// 定义多个变量
    c, err := div(a, b)

    fmt.Println(c, err)
}
```

```golang
// 函数是第一类型，可以作为参数或返回值
package main 

func test(x int) func() {
    return func() {
    	println(x)
    }
}

func main() {
    x := 100

    f := test(x)
    f()
}
```

```golang
// 用 defer 定义延迟调用，无论函数是否出错，它都确保结束前调用
package main

func test(a, b int) {
    defer println("dispose....")
    println(a/b)
}

func main(){
    test(10, 0)
}
```

## 数据
```golang
// 切片(slice) 可以实现类似动态数组的功能
package main

import "fmt"

func main(){
    x := make([]int, 0, 5) // 创建容量为5的切片
    
    for i :=0; i < 8; i++ {
        x = append(x, i)    // 追加数据，当超出容量限制时，自动分配更大的存储空间
    }
    
    fmt.Println(x)
}

```

```golang
// map 字典类型
package main

import "fmt"

func main() {
    m := make(map[string]int)   // 创建字典类型对象
    m["a"] = 1  // 添加或设置
    x, ok := m["b"] // 使用 ok-idiom 获取值，可知道 key/value 是否存在
    fmt.Println(x, ok)
    
    delete(m, "a")  // 删除
}
```

```golang
// struct 可以匿名嵌入其它类型
package main

import "fmt"

type user struct { // 结构体类型
    name string
    age byte
}

type manager struct { // 你们嵌入其它类型
    user
    title string
}

func main() {
    var m manager
    
    m.name = "Tom"
    m.age = 29
    m.title = "CTO"
    
    fmt.Println(m)
}
```

## 方法
```golang
// 可以为当前包内的任意类型定义方法
package main

type X int
func (x *X) inc() { // 名称前的参数成为 receiver,作用类似 python self
    *x++
}

func main(){
    var x X
    x.inc()
    println(x) // 1
}
```

```golang
// 还可以直接调用匿名字段的方法，这种方式可实现与继承类似的功能
package main

import "fmt"

type user struct {
    name string
    age byte
}

func (u user) ToString() string {
    return fmt.Sprintf("%+v", u)
}

type manager struct {
    user
    title string
}

func main() {
    var m manager
    m.name = "Tom"
    m.age = 29
    
    println(m.ToString()) // 调用 user.ToString() {name:Tom age:29}
}
```

## 接口
```golang
// 接口无需在实现类型上添加显示声明
// 另外空接口类型 interface{} 可接收任意类型对象
package main

import "fmt"

type user struct {
    name string
    age byte
}

func (u user) Print() {
    fmt.Printf("%+v\n", u)
}

type Printer interface {// 接口类型
    Print()
}

func main(){
    var u user
    u.name = "Tom"
    u.age = 29
    
    var p Printer = u // 只需包含接口所需的全部方法，即表示实现了该接口
    p.Print()
}

```

## 并发
```golang
package main

import (
    "fmt"
    "time"
)

func task(id int) {
    for i := 0; i < 5; i++ {
        fmt.Printf("%d: %d\n", id, i)
        time.Sleep(time.Second)
    }
}

func main() {
    go task(1)
    go task(2)
    
    time.Sleep(time.Second * 6)
}
```

```golang
// 通道 channel 与 goroutine 搭配，实现用通讯代替内存共享
package main

// 消费者
func consumer(data chan int, done chan bool) {
    for x : = range data { // 接收数据，知道通道被关闭
        println("recv:", x)
    }
    
    done <- true // 通知 main, 消费结束
}

// 生产者
func producer(data chan int) {
    for i := 0; i < 4; i++ {
        data <- i
    }
    close(data) // 生产结束，关闭通道
}

func main() {
    done := make(chan bool) // 用于接收消费结束信号
    data := make(chan int)  // 数据管道
    
    go consumer(data, done) // 启动消费者
    go producer(data)   // 启动生产者
    
    <-done  // 阻塞，知道消费者发送结束信号
}
/*
recv: 0
recv: 1
recv: 2
recv: 3
*/
```

