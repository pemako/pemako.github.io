---
date: '2026-04-09T20:00:00+08:00'
title: '虚拟机安装'
description: ""
summary: ""
tags: ["vm"]
categories: ["tools"]
series: ["Tools"]
ShowToc: true
TocOpen: true
---

## 系统下载安装

> 说明该版本的系统主要是作为学习 《程序员的自我修养》这本书的环境 

1. 下载对应的 iso 镜像版本 https://old-releases.ubuntu.com/releases/7.04/
2. 配置 ubuntu 提供的老的 apt 镜像源 [问题1](https://askubuntu.com/questions/91815/how-to-install-software-or-upgrade-from-an-old-unsupported-release?rq=1) [问题2](https://askubuntu.com/questions/386265/media-change-please-insert-the-disc-labeled-when-trying-to-install-ruby-on-ra)

```shell
# 先备份
cp /etc/apt/sources.list /etc/apt/sources.list.bak

# 替换
sudo sed -i -re 's/([a-z]{2}\.)?archive.ubuntu.com|security.ubuntu.com/old-releases.ubuntu.com/g' /etc/apt/sources.list

# then update with
sudo apt-get update && sudo apt-get dist-upgrade

# 删除 cdrom 的行
sed -i '/cdrom/d' /etc/apt/sources.list
```

## 网络配置

这里主要是想固定虚拟机的ip地址，开启 ssh 服务，这样可以通过终端登录。故这里选择的网络模式为 Nat + Host-only 模式。

- 在 `Tools->Network->Create` 选择 `Host-only Networks` 添加一个网络配置 

![image-20240430100754595](https://raw.githubusercontent.com/pemako/assets/main/2024/05/202404301007760.png)

- 在虚拟机的 `Settings->Network->Adapter 1` 中选择 `NAT` （这里默认选择） 

![image-20240430101045905](https://raw.githubusercontent.com/pemako/assets/main/2024/05/202404301010933.png)

- 配置 `Adapter 2` 网络在 图一添加的 host only network 的名字

![](https://raw.githubusercontent.com/pemako/assets/main/2024/05/202404301012515.png)



### 登录机器修改内容

在 7.04 系统上，默认没有安装 sshd-server 服务需要手动安装

```shell
# install
sudo apt install openssh-server

# ssh 操作命令
/etc/init.d/ssh {start|stop|reload|force-reload|restart}

```

进入系统后执行 `ifconfg` 默认只有 `lo` 没有其它网卡这里如下操作

```shell
ifconfig eth1 up
dhclient

# 为了固定机器 ip 及进入系统默认启用 在 /etc/init.d/rc.local 文件中添加
ifconfig eth1 192.168.56.4 network 255.255.255.0
ifconfig eth1 up
dhclient
```

使用 `ssh` 登录到虚拟机中

```shell
# ssh 遇到问题  no matching key exchange method found. Their offer: diffie-hellman-group-exchange-sha1,diffie-hellman-group14-sha1,diffie-hellman-group1-sha1

# 使用 ssh的时候指定参数
ssh -oKexAlgorithms=+diffie-hellman-group1-sha1 -c 3des-cbc  mako@192.168.56.4

# 把上面的参数配置到 .ssh/config 文件中，内容如下
Host 192.168.56.4
  Ciphers 3des-cbc
  KexAlgorithms +diffie-hellman-group1-sha1

# 配置完成 ssh 到虚拟机的时候只需要
ssh mako@192.168.56.4

# 进入到虚拟机后屏幕无法 clear
screen -T screen ssh mako@192.168.56.4
```

### 参考

- https://zhuanlan.zhihu.com/p/554893004 
- https://docs.oracle.com/en/virtualization/virtualbox/7.0/user/networkingdetails.html#nichardware

1. 网卡一 选择 桥接网络
2. 网卡二 选择 Host-only Network
3. 解决 ssh 后无法执行 clear 
	1. `screen -T screen ssh -oKexAlgorithms=+diffie-hellman-group1-sha1 mako@192.168.1.4`
	2. 每次连接不同的 wifi 后 地址会变

- 配置 Nat + Host-only 模式
	- 虚拟机地址 10.0.2.6 
	- VirtualBox Tool 配置的NAT Network 地址： 10.0.2.0/24
		- 配置端口转发
		- hostip:127.0.0.1 hostport: 2222
		- guestip: 10.0.2.6 guestport: 22
	- 参考：https://zhuanlan.zhihu.com/p/554893004 





