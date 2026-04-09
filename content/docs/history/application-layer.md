---
date: '2026-04-09T20:00:00+08:00'
title: '应用层'
description: ""
summary: ""
tags: ["network"]
categories: ["network"]
series: ["Network"]
ShowToc: true
TocOpen: true
---

# 应用层

> 目标

- 网络应用层的概念和实现
  - 客户端-服务器模型
  - 服务模型
- 通过对常用应用层协议的探讨和分析来学习网络协议

> 深层次目标

- 特定协议
  - http
  - ftp
  - smtp
  - pop
  - dns

## 应用程序 和 应用层协议

- 应用程序：**沟通，分布式的进程**
  - 运行在网络主机的“用户空间”
  - 在应用程序间交换报文

- 应用层协议

  - 应用程序的一个“组成部分”

  - 定义应用程序需要交换的报文和所需采取的动作

  - 使用较低层次所提供的通信服务（TCP， UDP）

<img src="https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305170032952.png" alt="image-20230517003220736" style="zoom:50%;" />

### 一些术语

- 进程（Process）主机中运行的程序
  - 在某些主机中，两个进程使用 **进程间通信**
  - 而运行在不同主机上的进程则使用应用层协议进行通信
- 用户代理（User agent）：软件进程，是介于用户和网络之间的接口
  - 实现应用级协议
  - Web：浏览器
  - E-mail
  - 流媒体：media player

### 客户端-服务器模式

典型的网络应用都是由两个部分组成：客户端和服务器

- 客户端
  - 发起同服务器的联系 speaks first
  - 一般都从服务器请求服务
  - web: 客户端由浏览器实现
  - Email: 通过 OE，Foxmail 实现
- 服务器
  - 向客户端提供所请求的服务
  - e.g. Web 服务器发送被请求的 web 页面，邮件服务器传递 e-mail

### 应用程序接口

API：application programming interface

- 定义应用层和传输层间的接口
- 插口：(socket: Internet API)
  - 两个进程间的通信，将数据送入 socket, 或从 socket 读取数据

> Q : 某个进程如何认定另一个需要与之通信的进程？

- IP地址： 运行另一个进程的主机所拥有的
- 端口号：允许接收主机来确定的一个标识，本地进程将报文发送给它

### 应用进程需要怎样的传输服务

> 衡量的标准

- 数据丢失(Data loss)
  - 某些应用（e.g. audio）可以容忍某种程度上的数据丢失
  - 其它应用（e.g 文件传输）要去i100% 可靠的数据传输
- 实时性(Timing)
  - 某些应用要求较低的延迟
- 带宽(Bandwidth)
  - 某些应用对带宽有要求
  - 某些应用则可灵活应用所得到的带宽

| 应用程序      | 数据丢失          | 带宽                         | 实时性     |
| ------------- | ----------------- | ---------------------------- | ---------- |
| 文件传输      | 不丢失            | 弹性                         | 无         |
| e-mail        | 不丢失            | 弹性                         | 无         |
| Web网页       | 不丢失            | 弹性                         | 无         |
| 实时音频/视频 | 允许丢失/允许丢失 | 音频: 5kb-1Mb 视频: 10kb-5Mb | 100’s msec |
| 存储音频/视频 | 允许丢失          | 同上                         | few secs   |
| 交互式游戏    | 允许丢失          | 几 kb/s 以上                 | 100‘s msec |
| 金融应用      | 不允许            | 弹性                         | yes and no |

### Internet 的传输协议服务

#### TCP 服务

- 面向链接：需要先建立链接
- 可靠传输：在发送和接受进程之间
- 流量控制：发送数据的速度觉不超过接收的速度
- 拥塞控制
- 不提供：实时性，最小带宽承诺

##### HTTP 协议

http: 使用 TCP 传输服务，是“无状态（stateless）” 的，全称为 (hypertext transfer protocol 超文本传输歇息)

- 客户端启动 TCP 链接到服务器，默认端口 80
- 服务器接受来自客户端的 TCP 连接
- http 报文（应用层协议报文）在浏览器和 Web服务器之间进行交换
- 关闭 TCP 连接

> http 协议版本

- http1.0 RFC 1945
- http1.1 RFC 2612
- http2

##### 认证（authentication）

认证：控制对服务器内容的访问

- 信用认证：一般通过用户名，密码进行
- 无状态：客户端必须在每次请求前进行认证
  - Authorization: 就是要求在每个请求报文中提交认证的首部行

##### Cookies: 保存状态

- 服务器产生一个 #，服务器认识这个 # 以备不时之需
  - 认证
  - 记忆用户的前序访问，先前的选择
- 服务器在响应报文中发送 cookie 给可客户端
- 客户端可以在后续的请求中发送 cookie

##### ftp: 文件传输协议

- 传输文件往来与远程主机
- 客户端/服务器模式
- ftp: RFC 959
- ftp 服务器：端口默认 21

<img src="https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305170122234.png" alt="image-20230517012200204" style="zoom:50%;" />

- 分离的控制，数据连接
  - ftp 客户端在 ftp服务器的端口21进行联系，使用TCP作为传输协议
  - 打开两个并行的连接
    - 控制：在客户端和服务器之间交换命令，响应。称为带外控制（out of band control)
    - 数据：往来于服务器的文件
  - ftp 维持状态（state）：当前目录，先前的认证信息等

<img src="https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305170126905.png" alt="image-20230517012615873" style="zoom:50%;" />

##### 电子邮件

smtp [RFC 821]

- 使用 tpc 可靠的传送邮件报文，端口 25
- 直接传输：发送服务器到接收服务器
- 传输的三个阶段
  - 握手
  - 报文传输
  - 结束
- 命令/响应交互
  - 命令：ASCII 文件
  - 响应：状态码和短语
- 邮件报文必须使用 7-bit ASCII 表示

<img src="https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305170131449.png" alt="image-20230517013155417" style="zoom:50%;" />

#### UDP 服务

- 在客户端和服务器进程之间实现“不可靠的”数据传输
- 不提供：连接建立，可靠性保证，流量控制，拥塞控制，实时性，最小带宽承诺

| 应用           | 应用协议         | 所以来的传输协议 |
| -------------- | ---------------- | ---------------- |
| e-mail         | smtp [RFC 821]   | TCP              |
| 远程终端访问   | telnet [RFC 854] | TCP              |
| Web            | http [RFC 2068]  | TCP              |
| 文件传输       | ftp [RFC 959]    | TCP              |
| 流媒体         | 专有协议         | TCP or UDP       |
| 远程文件服务器 | NSF              | TCP or UDP       |
| IP 电话        | 专有协议         | typically UDP    |

### 应用层协议

#### DNS(Domain Name System) 域名系统

DNS 记录: RR(存储资源记录的分布式数据库) 格式: (name, value, type, ttl)

> Type=A
- name = 主机名
- value = IP 地址

> Type=NS
- name = 域(e.g. foo.com)
- value = 该域授权域名服务器的 IP 地址

> Type=CNAME
- name = 别名
- value = 真名

> Type=MX
- value = 与name相关的邮件服务器域名

![](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305232229679.png)

![](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305232232394.png)