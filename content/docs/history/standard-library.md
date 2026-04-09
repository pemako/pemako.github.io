---
date: '2026-04-09T20:00:00+08:00'
title: 'Go 标准库'
description: ""
summary: ""
tags: ["go"]
categories: ["go"]
series: ["Go"]
ShowToc: true
TocOpen: true
---

1. 自定义 Transport 
2. 请求存在 302 跳转的时候支持携带上 cookie


```go
type LogRedirects struct {
	Transport http.RoundTripper
}

func (l LogRedirects) RoundTrip(req *http.Request) (resp *http.Response, err error) {
	t := l.Transport
	if t == nil {
		t = http.DefaultTransport
	}
	resp, err = t.RoundTrip(req)
	if err != nil {
		return
	}
	switch resp.StatusCode {
	case http.StatusMovedPermanently, http.StatusFound, http.StatusSeeOther, http.StatusTemporaryRedirect:
		fmt.Println("Request Method", req.Method, "Request for", req.URL, "redirected with status", resp.StatusCode)
	}
	return
}

func login() {
	client := &http.Client{Transport: LogRedirects{}} // 记录中间每次 302 请求的跳转地址
	request, err := http.NewRequest("GET", "http://kuboard-dev.domob-inc.cn/login?state=%2F", nil)
	if err != nil {
		return
	}

	response, err := client.Do(request)
	if err != nil {
		return
	}
	defer response.Body.Close()

	reqURL := response.Request.URL.String()
	rParams := url.Values{}
	rParams.Add("login", "admin")
	rParams.Add("password", `{"password":"xxxx","passcode":""}`)
	request2, err := http.NewRequest("POST", reqURL, strings.NewReader(rParams.Encode()))
	request2.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	request2.Header.Set("Referer", reqURL)
	if err != nil {
		return
	}
	// 如果页面有重定向的时候cookie不会被携带，这里需要重新设置如下两行，可以在重定向后获取到请求的cookie信息
	jar, _ := cookiejar.New(nil)
	client = &http.Client{Jar: jar}
	response2, err := client.Do(request2)
	if err != nil {
		return
	}
	defer response2.Body.Close()

	for _, cookie := range response2.Request.Cookies() {
		fmt.Println(cookie.Name, cookie.Value, cookie.Expires)
	}
}
```

---

- WithDeadline

```go
package main

import (
	"context"
	"fmt"
	"time"
)

func dl2(ctx context.Context) {
	n := 1
	for {
		select {
		case <-ctx.Done():
			fmt.Println(ctx.Err())
			return
		default:
			fmt.Println("dl2 : ", n)
			n++
			time.Sleep(time.Second)
		}
	}
}

func dl1(ctx context.Context) {
	n := 1
	for {
		select {
		case <-ctx.Done():
			fmt.Println(ctx.Err())
			return
		default:
			fmt.Println("dl1 : ", n)
			n++
			time.Sleep(3 * time.Second)
		}
	}
}

func main() {
	// 设置deadline为当前时间之后的5秒那个时刻
	d := time.Now().Add(5 * time.Second)
	ctx, cancel := context.WithDeadline(context.Background(), d)
	defer cancel()
	go dl1(ctx)
	go dl2(ctx)
	for {
		select {
		case <-ctx.Done():
			fmt.Println("over", ctx.Err())
			return
		}
	}
}
```


- WithTimeout

```go
package main

import (
	"context"
	"fmt"
	"time"
)

func to1(ctx context.Context) {
	n := 1
	for {
		select {
		case <-ctx.Done():
			fmt.Println("to1 is over")
			return
		default:
			fmt.Println("to1 : ", n)
			n++
			time.Sleep(time.Second)
		}
	}
}

func main() {
	// 设置为6秒后context结束
	ctx, cancel := context.WithTimeout(context.Background(), 6*time.Second)
	defer cancel()
	go to1(ctx)
	n := 1
	for {
		select {
		case <-time.Tick(2 * time.Second):
			if n == 9 {
				return
			}
			fmt.Println("number :", n)
			n++
		}
	}
}
```

- WithCancel
```go
package main

import (
	"context"
	"fmt"
	"time"
)

func MyOperate1(ctx context.Context) {
	for {
		select {
		default:
			fmt.Println("MyOperate1", time.Now().Format("2006-01-02 15:04:05"))
			time.Sleep(2 * time.Second)
		case <-ctx.Done():
			fmt.Println("MyOperate1 Done")
			return
		}
	}
}
func MyOperate2(ctx context.Context) {
	fmt.Println("Myoperate2")
}
func MyDo2(ctx context.Context) {
	go MyOperate1(ctx)
	go MyOperate2(ctx)
	for {
		select {
		default:
			fmt.Println("MyDo2 : ", time.Now().Format("2006-01-02 15:04:05"))
			time.Sleep(2 * time.Second)
		case <-ctx.Done():
			fmt.Println("MyDo2 Done")
			return
		}
	}

}
func MyDo1(ctx context.Context) {
	go MyDo2(ctx)
	for {
		select {
		case <-ctx.Done():
			fmt.Println("MyDo1 Done")
			// 打印 ctx 关闭原因
			fmt.Println(ctx.Err())
			return
		default:
			fmt.Println("MyDo1 : ", time.Now().Format("2006-01-02 15:04:05"))
			time.Sleep(2 * time.Second)
		}
	}
}
func main() {
	// 创建 cancelCtx 实例
	// 传入context.Background() 作为根节点
	ctx, cancel := context.WithCancel(context.Background())
	// 向协程中传递ctx
	go MyDo1(ctx)
	time.Sleep(5 * time.Second)
	fmt.Println("stop all goroutines")
	// 执行cancel操作
	cancel()
	time.Sleep(2 * time.Second)
}
```

- WithValue
```go
package main

import (
	"context"
	"fmt"
	"time"
)

func v3(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			fmt.Println("v3 Done : ", ctx.Err())
			return
		default:
			fmt.Println(ctx.Value("key"))
			time.Sleep(3 * time.Second)
		}
	}
}

func v2(ctx context.Context) {
	fmt.Println(ctx.Value("key"))
	fmt.Println(ctx.Value("v1"))
	// 相同键,值覆盖
	ctx = context.WithValue(ctx, "key", "modify from v2")
	go v3(ctx)
}

func v1(ctx context.Context) {
	if v := ctx.Value("key"); v != nil {
		fmt.Println("key = ", v)
	}
	ctx = context.WithValue(ctx, "v1", "value of v1 func")
	go v2(ctx)
	for {
		select {
		default:
			fmt.Println("print v1")
			time.Sleep(time.Second * 2)
		case <-ctx.Done():
			fmt.Println("v1 Done : ", ctx.Err())
			return
		}
	}
}

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	// 向context中传递值
	ctx = context.WithValue(ctx, "key", "main")
	go v1(ctx)
	time.Sleep(10 * time.Second)
	cancel()
	time.Sleep(3 * time.Second)
}
```
- 参考:https://studygolang.com/articles/29504

---

> 源码分析阅读

```go
package main

import (
 "fmt"
 "log"
 "os"
 "time"

 "github.com/robfig/cron/v3"
)

func TestCron() {
 c := cron.New(cron.WithSeconds(),
  cron.WithChain(cron.SkipIfStillRunning(cron.DefaultLogger)),
  cron.WithLogger(
   cron.VerbosePrintfLogger(log.New(os.Stdout, "cron: ", log.LstdFlags)),
  ))

 i := 1
 EntryID, err := c.AddFunc("*/2 * * * * *", func() {
  fmt.Println(time.Now(), "每5s一次----------------", i)
  time.Sleep(time.Second * 6)
  i++
 })
 fmt.Println(time.Now(), EntryID, err)

 c.Start()
 time.Sleep(time.Second * 30)
}

func main() {
 TestCron()
}
```

- <https://github.com/robfig/cron>
- <https://juejin.cn/post/7004656484902502408>

####

- 显示cron的含义
  - `https://crontab.guru/#*/2_*_*_*_*`


---

```go
package main

import (
    "crypto/md5"
    "crypto/sha1"
    "fmt"
    "io"
)

func main() {
	// md5加密
    h := md5.New()
    io.WriteString(h, "demo")
    fmt.Printf("%x\n", h.Sum(nil))

    h2 := md5.New()
    h2.Write([]byte("demo"))
    fmt.Printf("%x\n", h2.Sum(nil))
    
    // sha1 加密
    s := sha1.New()
    io.WriteString(s, "demo")
    fmt.Printf("%x", s.Sum(nil))
}
```


## 非对称加密

```go
package utils

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"os"
	"runtime"
)

func Error(file string, line int, err string) error {
	return fmt.Errorf("file:%s line:%d error:%s", file, line, err)
}

func GenerateRsaKey(keySize int) {
	privateKey, err := rsa.GenerateKey(rand.Reader, keySize)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	// x509
	derText := x509.MarshalPKCS1PrivateKey(privateKey)
	// pem Block
	block := &pem.Block{
		Type:  "rsa private key",
		Bytes: derText,
	}
	fmt.Println("生成private key")
	fmt.Println()
	pem.Encode(os.Stdout, block)

	// get PublicKey from privateKey
	publicKey := privateKey.PublicKey
	derStream, err := x509.MarshalPKIXPublicKey(&publicKey)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	block = &pem.Block{
		Type:  "rsa public key",
		Bytes: derStream,
	}
	fmt.Println("生成public key")
	fmt.Println()
	pem.Encode(os.Stdout, block)
}

// RsaEncrypt Rsa加密
// plainText 明文
// publicPEM 公钥文件路径
// 返回加密后的结果 错误
func RsaEncrypt(plainText []byte, publicPEM []byte) ([]byte, error) {
	block, _ := pem.Decode(publicPEM)
	publicInterface, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		_, file, line, _ := runtime.Caller(0)
		return nil, Error(file, line+1, err.Error())
	}
	publicKey, flag := publicInterface.(*rsa.PublicKey)
	if !flag {
		_, file, line, _ := runtime.Caller(0)
		return nil, Error(file, line+1, "error occur when trans to *rsa.Publickey")
	}
	// encrypt
	cipherText, err := rsa.EncryptPKCS1v15(rand.Reader, publicKey, plainText)
	if err != nil {
		_, file, line, _ := runtime.Caller(0)
		return nil, Error(file, line+1, err.Error())
	}
	return cipherText, nil
}

// RsaDecrypt Rsa解密
// cipherText 密文
// privatePEM 私钥文件路径
// 返回解密后的结果 错误
func RsaDecrypt(cipherText []byte, privatePEM []byte) (plainText []byte, err error) {
	block, _ := pem.Decode(privatePEM)
	if err != nil {
		_, file, line, _ := runtime.Caller(0)
		return nil, Error(file, line+1, err.Error())
	}
	// get privateKey
	privateKey, _ := x509.ParsePKCS1PrivateKey(block.Bytes)
	// get plainText use privateKey
	plainText, err3 := rsa.DecryptPKCS1v15(rand.Reader, privateKey, cipherText)
	if err3 != nil {
		_, file, line, _ := runtime.Caller(0)
		return nil, Error(file, line+1, err3.Error())
	}
	return plainText, err
}

```

---

```go
package main

import (
    b64 "encoding/base64"
    "fmt"
)

func main() {
    data := "abc123!?$*&()'-=@~"
    
    sEnc := b64.StdEncoding.EncodeToString([]byte(data))
    fmt.Println(sEnc)

	sDec, _ := b64.StdEncoding.DecodeString(sEnc)
	fmt.Println(string(sDec))
	fmt.Println()

	uEnc := b64.URLEncoding.EncodeToString([]byte(data))
	fmt.Println(uEnc)
	uDec, _ := b64.StdEncoding.DecodeString(uEnc)
	fmt.Println(string(uDec))
}

```

Go 同时支持标准的和 URL 兼容的 base64 格式。编码需要使用 []byte 类型的参数，所以要将字符串转成此类型。

解码可能会返回错误，如果不确定输入信息格式是否正确，那么，你就需要进行错误检查了。

标准 base64 编码和 URL 兼容 base64 编码的编码字符串存在稍许不同（后缀为 + 和 -），但是两者都可以正确解码为原始字符串。

---

1. 如果确保某个类型实现了某个接口的所有方法，一般采用下面方法进行验证

```go
type Person interface {
    getName() string
}

type Student struct {
    name string
    age  int
}

func (stu *Student) getName() string {
	return stu.name
}

```
- `var _ Person = (*Student)(nil)`
> 将空值 nil 转换为 *Student 类型，再转换为 Person 接口，如果转换失败，说明 Student 并没有实现 Person 接口的所有方法

- 实例可以强制转化为接口，接口也可以强制转化为实例
```
var p Person = &Student{name:"Tom", age: 12}

s := p.(*Student) // 接口转为实例
```


---

- 单引号和双引号

结论：Go 语言不倾向于使用单引号来表示字符串，根据需要使用双引号或反引号

一个 Go 语言字符串是一个任意字节的常量序列。Go 语言的字符串类型在本质上与其他语言的字符类型不同。Java 的 String、C++的 std::string 以及 Python3的 str
类型都只是定宽字符序列，而 Go语言的字符串是一个用 UTF-8编码的变宽字符序列，它的每一个字符都用一个或多个字节表示。

Go语言中的字符串字面量使用 双引号 或 反引号 来创建：

双引号用来创建可解析的字符串字面量(支持转义，但不能用来引用多行)；
反引号用来创建原生的字符串字面量，这些字符串可能由多行组成(不支持任何转义序列)，原生的字符串字面量多用于书写多行消息、HTML以及正则表达式。

- `...` 的用法
    - 主要是用于函数有多个不定参数的情况，可以接受多个不确定数量的参数
    - 第二个用法是slice可以被打散进行传递

> 示例一

```go
package main

import "fmt"

func test1(args ...string) { // 可以接受任意个string
	for _, v := range args {
		fmt.Println(v)
	}
}

func main() {
	var strss = []string{
		"qwr", "234", "yui", "cvba",
	}
	test1(strss...) // 切片被打散传
}
```

> 示例二

```go
package main

import "fmt"

func main() {
	var strss = []string{"qwr", "234", "yui", "cvba"}
	var strss2 = []string{"qwr", "234", "yui", "cvba"}
	strss = append(strss, strss2...) // strss2 的元素被打散一个一个append到strss
	fmt.Println(strss)
}
```