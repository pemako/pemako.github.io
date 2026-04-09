---
date: '2026-04-09T20:00:00+08:00'
title: 'Docker'
description: ""
summary: ""
tags: ["docker"]
categories: ["docker"]
series: ["Docker"]
ShowToc: true
TocOpen: true
---


使用Mac上进行docker的学习,使用的版本信息如下

```
Client: Docker Engine - Community
 Version:           18.09.2
 API version:       1.39
 Go version:        go1.10.8
 Git commit:        6247962
 Built:             Sun Feb 10 04:12:39 2019
 OS/Arch:           darwin/amd64
 Experimental:      false

Server: Docker Engine - Community
 Engine:
  Version:          18.09.2
  API version:      1.39 (minimum version 1.12)
  Go version:       go1.10.6
  Git commit:       6247962
  Built:            Sun Feb 10 04:13:06 2019
  OS/Arch:          linux/amd64
  Experimental:     false
```

## 0、环境初始化

- 方式一 `brew cask install docker` 这种安装方式不带GUI存命令行操作
- 方式二 下载 [Docker Desktop for Mac](https://hub.docker.com/editions/community/docker-ce-desktop-mac) 带一套可视化软件和Docker环境

## 1、Docker 的安装和配置

### 1.1 在Ubuntu中安装

- 检查环境是否支持
  - uname -a
  - ls -l /sys/class/misc/device-mapper

- 方式一 版本比较旧
  - `sudo apt-get install -y docker.io`
  - `source /etc/bash_completion.d/docker.io`

- 方式二
  - 检查APT的https支持，查看/usr/lib/apt/methods/https 文件是否存在
    - apt-get update
    - apt-get install -y apt-transport-https
  - 添加Docker的APT仓库
    - echo deb <https://get.docker.com/ubuntu> docker main >/etc/apt/sources.list.d/docker.list
  - 添加仓库的key
    - apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 36A1D7869245C8950F966E92D8576A8BA88D21E9
  - 安装
    - apt-get update
    - apt-get install -y lxc-docker

- Docker提供的简易安装方式
  - sudo apt-get install-y curl
  - curl -sSL <https://get.docker.com/> | sudo sh

- 新版本Docker安装
  - [参考官网文档](https://docs.docker-cn.com/engine/installation/linux/docker-ce/ubuntu/)

- 使用非root用户
  - sudo groupadd docker
  - sudo gpasswd -a user docker
  - sudo service docker restart

### 1.2 在window中安装

- 旧版本Docker
- 新版本Docker
  - 直接下载windows的docker进行安配置即可
  - [参考](https://docs.docker-cn.com/docker-for-windows/install/#start-docker-for-windows)

### 1.3 在MacOS中安装

- [参考官网文档](https://docs.docker-cn.com/docker-for-mac/install/#install-and-run-docker-for-mac)

## 2、Docker 简介

### 2.1 什么是容器

- 一种虚拟化的方案
- 操作系统级别的虚拟化
- 只能运行相同或相似内核的操作系统
- 依赖于Linux内核特性：`Namespace`和`Cgroups` (`Control Group`)

### 2.2 什么是Docker

- 将应用程序自动部署到容器
- Go语言开源引擎 Github地址: <https://github.com/docker/docker>
- 2013年初 dotCloud
- 基于Apache 2.0 开源授权协议发行

### 2.3 Docker目标（特点）

- 提供简单轻量的建模方式
- 职责的逻辑分离
- 快速高效的开发生命周期
- 鼓励使用面向服务的架构

### 2.4 Docker的使用场景

- 使用Docker容器开发，测试，部署服务
- 创建隔离的运行环境
- 搭建测试环境
- 构建多用户的平台即服务（PaaS Platform as a Service）基础设施
- 提供软件即服务（SaaS Software as a Service）应用程序
- 高性能，超大规模的宿主机部署

## 3、Docker的基本组成

![Docker的基本组成](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305220129682.png)

### 3.1 Docker客户端/守护进程

![C/S架构通信](../../../data/img/docker的基本组成CS2.png)

#### 连接方式

- 客户端和守护进程通信
  - unix:///var/run/docker.sock  (Docker 默认)
  - tcp://host:port
  - fd://socketfd

- 守护进程启动项修改
  - 详细参考[官网文档](https://docs.docker.com/engine/reference/commandline/cli/)
  - 修改启动配置文件(下面已Mac为例) 其余参考[官方文档](https://docs.docker.com/engine/reference/commandline/dockerd/#daemon-configuration-file)
    - 方式一直接修改 `vim ~/.docker/daemon.json`
    - 方式二 Docker->Preferences->Daemon->Advanced-> 直接进行配置json格式数据即可

- 访问远程的docker服务
  - `curl --unix-socket /var/run/docker.sock http:/v1.39/info`
  - [remote api](https://docs.docker.com/develop/sdk/)

### 3.2 Docker Image 镜像

#### 3.2.1 特点

- 容器的基石
- 层叠的只读文件系统
- 联合加载（union mount）

#### 3.3.2 基本操作

- 查找镜像
  - `docker search --no-trunc --limit=10  --filter stars=50  nginx`

 > 这个会在Docker的[官方仓库](https://hub.docker.com/)进行查找

 > search的各个参数可以再[官方文档Search](https://docs.docker.com/engine/reference/commandline/search/) 进行详细查看

- 拉取镜像
  - `docker pull [OPTIONS] NAME[:TAG|@DIGEST]`
  - `docker pull ubuntu:16.04`

- 列出镜像
  - `docker image ls -a -q`
  - `docker image ls -f dangling=true` 列出悬空镜像
 > -a 列出所有镜像  -q仅列出image id

- 查看镜像详细信息
  - `docker [image] inspect id|name`

- 删除镜像
  - `docker image rm id|name`
  - `docker image rmi -f $(docker image ls -q)`
  - `docker image prune` 删除悬空镜像
 > 批量删除镜像

- 编译镜像
  - `docker image build ...`

- 构建镜像
  - `docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]`
    - `-a, --author string    Author`
    - `-c, --change list      Apply Dockerfile instruction to the created image`
    - `-m, --message string   Commit message`
    - `-p, --pause            Pause container during commit (default true)`
   - `docker commit -a mako -m test -p 容器 仓库:标签`

  - `Dockerfile 构建进行`
    - 新建一个目录下面创建Dockerfile文件
    - Dockerfile文件内容如下
  ```
  FROM ubuntu
  MAINTAINER pemako "pemakoa@gmail.com"
  RUN apt-get update && apt-get install -y install vim
  EXPOSE 80
  ```
    - `docker build -t='pemako/test' .`

- 推送镜像
  - `docker push [OPTIONS] NAME[:TAG]`

> 所有详细信息可以使用 `docker image --help` 查看支持的命令

> 已ls为例查看支持的选项 `docker image ls --help` 查看每个命令下支持的选项信息

> 更详细的信息参考[commandline docker](https://docs.docker.com/engine/reference/commandline/docker/)

#### 3.3.3 Dockerfile 指令

- FROM
  - 指定的镜像名必须是存在的
  - 这个镜像也叫做基础镜像
  - 在Dockerfile 中的第一条非注释的指令

- MAINTAINER
  - 指定镜像的所有者信息

- RUN
  - 指定镜像中构建时的命令有下面两种模式
    - shell 模式
    - exec 模式

- EXPOSE
  - 运行镜像使用的端口
  - 可以指定一个或多个端口

- CMD
  - 提供容器运行的默认行为
  - CMD command param1 parma2 (shell 模式)
  - CMD ["executable", "param1", "parma2"] (exec 模式)
  - CMD ["parma1", "parma2"] (作为ENTRYPOINT指令的默认参数)

- ENTRYPOINT
  - 会被docker run启动命令中的命令覆盖

- ADD
  - 将文件或目录复制到Dockerfile
  - 包含类似tar的加压功能

- COPY
  - 单纯的复制推荐使用

- VOLUME
  - 基于镜像创建的容器添加卷

- WORKDIR
  - 在容器内部设定工作目录
  - 通常使用绝对路径

- ENV
  - 设置环境变量 ENV <key> <value>

- USER
  - USER nginx 以 nginx 用户启动
  - USER user| user:group |user:gid |uid |uid:gid |uid:group

- ONBUILD [INSTRUCTION]
  - 镜像触发器
  - 当一个镜像被其他镜像作为基数镜像时执行
  - 会在构建过程中插入指令

#### 3.3.3 Dockerfile 构建过程

- 重基础镜像运行一个容器
- 执行一条指令，对容器做出修改
- 执行类似docker commit 的操作，提交一个新的镜像层
- 再基于刚才提交的镜像运行一个新容器
- 执行Dockerfile 中的下一条指令，直至所有的指令执行完成

- 构建缓存
  - 已经构建过的中间层会进行缓存，下次再构建
- 不使用缓存
  - `docker build --on-build选项`
  - `使用环境变量`

- 查看构建过程
  - `docker history [OPTIONS] IMAGE`

### 3.3 Docker Container 容器

#### 3.3.1 特点

- 通过镜像启动
- 启动和之行阶段
- 写时复制（copy on write）

#### 3.3.2 基本操作

- 启动容器 `docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`
  - 1、单次命令容器 `docker run ubuntu echo 'Hello World'`

 > 表示启动容器并执行 echo 命令 对应的参数 为 'Hello World'

  - 2、交互模式启动 `docker run -i -t ubuntu /bin/bash`

- 列出容器 `docker ps [-a] [-l]`
 > -a 列出全部容器， -l列出最近的一个容器
 > 不指定参数返回的是在运行的容器

- 查看指定容器的详细信息
  - `docker inspect [CONTAINER ID|NAMES]`

- 自定义容器名字执行
  - `docker run --name=container_name -i -t ubuntu /bin/bash`

- 重新启动停止容器
  - `docker start [-i] 容器名|或id`
 > -i 交互模式启动

- 删除已经停止的容器
  - `docker rm containerid`

- 导出容器
  - `docker export containerId > xxx.tar`

- 导入容器快照
  - `cat xxx.tar | docker import - test/ubuntu:v1.0`
  - `docker import http://example.com/exampleimage.tgz example/imagerepo`

#### 3.3.3 守护式容器

> 什么是是守护式容器：能够长期运行，没有交互式回话，适合运行应用程序和服务

- 启动方式一
  - docker run -i -t IMAGE /bin/bash
  - Contrl + p + q 退出
 > 此时使用 `docker container ps` 查看容器是在运行的状态

  - docker attach 容器名|或id
 > 重新进入刚才在后台运行的容器

- 使用RUN 启动守护式容器
  - docker run --name=mako1 -d ubuntu /bin/bash -c "while true; do echo hello world; sleep 1; done"
 > -d 已后台模式运行容器，命令结束后依旧会退出 + 加上循环保持容器不退出

- 查看容器日志查看容器运行
  - docker logs [-f] [-t] [-tail] 容器名|或id
 > -f --follows=true|false 默认为false     一直跟踪日志变化并返回结果
 > -t --timestamps=true|false 默认为false 在返回结果上加上时间戳
 > --tail="all"        返回最后多少条日志

  - docker logs -f  mako1
  - docker logs -ft mako1
  - docker logs -ft --tail=10 mako1

- 通过top命令查看运行中容器的进程情况
  - docker top mako1

- 在运行中的容器中启动新的进程
  - docker exec [-d] [-i] [-t] 容器名|或id [comamnd] [arg...]
  - docker exec -i -t /bin/bash
  - docker top mako1 查看新的进程是否存在

- 停止守护式容器
  - docker stop 容器名|或id  会进行等待
  - docker kill 容器名|或id  快速停止

> 详细命令查看 docker --help 查看

#### 3.3.4 在容器中部署一个静态网站

> 通过NGINX部署静态网站

- 容器的端口映射
  - docker run [-P] [-p]
    - -P --public-all=true|false 默认为false 为容器暴露所有端口进行映射
      - docker run -P -i -t ubuntu /bin/bash
    - -p --publish=[]  指定映射哪些容器的端口
      - containerPort 只指定容器端口，宿主机端口随机映射
        - docker run -p 80 -i -t ubuntu /bin/bash
      - hostPort:containerPort 同时指定宿主机端口和容器端口
        - docker run -p 8080:80 -i -t ubuntu /bin/bash
      - ip:containerPort 指定IP和容器端口
        - docker run -p 0.0.0.0:80 -i -t ubuntu /bin/bash
      - ip:hostPort:containerPort 同时指定IP 宿主机端口和容器端口
        - docker run -p 0.0.0.0:8080:80 -i -t ubuntu /bin/bash

- 部署的流程
  - 创建映射80端口的交互式容器
  - 安装Nginx， vim
  - 创建静态页面
  - 修改Nginx配置文件
  - 运行Nginx
  - 验证网站访问

 ```
 docker run -p 80 --name=web -i -t ubuntu /bin/bash
 apt-get update
 apt-get install -y nginx vim
 mkdir /var/www/html && cd /var/www/html
 vim index.html 进行编辑
 whereis nginx  
 # 查找nginx安装信息 nginx: /usr/sbin/nginx /usr/lib/nginx /etc/nginx /usr/share/nginx
 ls /etc/nginx/
 vim /etc/nginx/sites-enabled/default  # 修改root根目录
 nginx # 启动
 Contrl + p Contrl + q 退出
 ```

  - 使用docker ps| docker prot  查看 发现 `0.0.0.0:32769->80/tcp` 把32769端口映射到容器中的80端口
 ```
 ➜  ~ docker port web
 80/tcp -> 0.0.0.0:32769
 ➜  ~ docker top web
 PID                 USER                TIME                COMMAND
 28314               root                0:00                /bin/bash
 29952               root                0:00                nginx: master process nginx
 29953               xfs                 0:00                nginx: worker process
 29954               xfs                 0:00                nginx: worker process
 ```

- 使用宿主机的地址访问网站
  - curl <http://localhost:32769/>
  - <http://localhost:32769/>
  - <http://0.0.0.0:32769/>

- 使用容器的IP地址访问
  - docker inspect web
  - 找到 "IPAddress": "172.17.0.2"
  - 直接访问
 > 发现访问的时候网络不通[解决办法](https://my.oschina.net/shea1992/blog/2991407)

 > 在启动的时候 添加 --net=host 的网络选项

### 3.4 Docker Registry 仓库

- 共有 Docker Hub
- 私有

## 4、Docker 容器相关技术简介

### 4.1 Namespace 命名空间

- 编程语言
  - 封装 -> 代码隔离
- 操作系统
  - 系统资源隔离
  - 进程、网络、文件系统...

- Docker提供五种隔离
  - PID (Process ID) 进程隔离
  - NET (Network) 管理网络接口
  - IPC (InterProcess Communication) 管理跨进程通信的访问
  - MUT (Mount)管理挂载点
  - UTS (Unix Timesharing System) 隔离内核和版本标识

### 4.2 Control Groups 控制组

- 用来分配资源，来源于google
- Linux kernel 2.6.24@2007 整合

- 提供的功能
  - 资源限制
  - 优先级设定
  - 资源计量
  - 资源控制（挂起，恢复）

### 4.3 Docker容器的能力

- 文件系统隔离
  - 每个容器都有自己的root文件系统
- 进程隔离
  - 每个容器都运行在自己的进程环境中
- 网络隔离
  - 容器间的虚拟网络接口和IP地址都是分开的
- 资源隔离和分组
  - 使用cgroups将CPU和内存之类的资源独立分配给每个Docker容器

### 4.4 Docker容器的网络连接

#### 4.4.1 Docker容器的网络基础

> [注意](http://wudaijun.com/2017/11/docker-network/) Mac上使用需要注意

> [Docker For Mac]的实现和标准Docker规范有区别，Docker For Mac的Docker Daemon是运行于虚拟机(xhyve)中的(而不是像Linux上那样作为进程运行于宿主机)，因此Docker For Mac没有docker0网桥，不能实现host网络模式，host模式会使Container复用Daemon的网络栈(在xhyve虚拟机中)，而不是与Host主机网络栈，这样虽然其它容器仍然可通过xhyve网络栈进行交互，但却不是用的Host上的端口(在Host上无法访问)。bridge网络模式 -p 参数不受此影响，它能正常打开Host上的端口并映射到Container的对应Port。

- Linux虚拟网桥的特点
  - 可以设置IP地址
  - 相当于拥有一个隐藏的虚拟网卡

#### 4.4.2 Docker容器的互联

##### 1) 内部容器之间的连接

- 允许所有容器互联
  - `--icc=true` 同一宿主机下默认情况允许连接
  - 容器重启的是ip地址会发生改变

 >  容器启动时可以使用 --link=[CONTAINER_NAME]:[ALIAS] [IMAGE] [COMMAND] 解决重启IP地址发生变化

 > 后面访问可以使用 ALIAS 进行访问

  - `docker run -it --name cct3 --link=cct1:webtest pemako/cct`
  - `ping webtest`

- 拒绝容器间互联
  - Docker守护进程启动的时候设置 `--icc=false` 拒绝所有容器连接

- 允许特定容器间的连接

 > 修改下面三个配置可以允许部分容器间进行连接

  - `--icc=false`
  - `--iptables=true`
  - `--link`  仅允许使用link选项配置的容器间连接

##### 2) 容器与外部网络的连接

> ip_forward、iptables、 允许端口映射访问、限制IP访问容器

- ip_forward
  - --ip-forward=true docker守护进程启动的时候默认允许流量转发
  - `sysctl net.ipv4.conf.all.forwarding` 使用系统命令查看是否开启
    - 结果 `net.ipv4.conf.all.forwarding = 1`

- iptables[详细参考](http://www.zsythink.net/archives/category/%E8%BF%90%E7%BB%B4%E7%9B%B8%E5%85%B3/iptables/page/2/)

 > [参考1](http://0cx.cc/iptables-flow-diagram.jspx)

 > Iptables 是与Linux内核集成的包过滤防火墙系统，激活所有的linux发型版本都会包含iptabel的功能

  - 表 table
    - nat
    - mangle
    - raw
    - filter
  - 链 chain
  - 规则 rule 是每个链下的操作
    - ACCEPT
    - REJECT
    - DROP

### 4.5 Docker容器的数据管理

#### 4.5.1 Docker容器的数据卷

> 什么是数据卷(Data Volume)

- 数据卷是经过特殊设置的目录，可以绕过联合文件系统（UFS），为一个或多个容器提供访问
- 数据卷设计的目的，在于数据的永久化，它完全独立与容器的生存周期，因此，Docker 不会再容器删除时删除其挂载的数据卷，也不会存在类似的垃圾收集机制，对容器引用的数据卷进行处理

> 数据卷的架构
![](https://raw.githubusercontent.com/pemako/assets/main/2022/202212072140508.png)

- 数据卷是独立docker的存在与docker容器的生存周期是分离的
- docker数据卷是独立存储在docker宿主机的文件系统中
- docker数据卷可以是目录也可以是文件
- docker容器可以利用数据卷的技术与宿主机进行数据共享
- 同一个目录或文件支持多个容器间访问，实现容器间的数据共享

> 数据卷的特点

- 数据卷在容器启动时初始化，如果容器使用的镜像在挂载点包含了数据，这些数据会拷贝到新初始化的数据卷中
- 数据卷可以再容器之间共享和重用
- 可以对数据卷例的内容直接进行修改
- 数据卷的变化不会影响镜像的更新
- 卷会一直存在，及时挂在数据卷的容器已经被删除

> 为容器添加数据卷 -v 指定本机文件或目录:容器中的目录或文件

- `docker run -v ~/本机目录:/容器中目录 -it ubuntu /bin/bash`

> 为数据卷添加访问权限 指定目录映射后指定权限

- `sudo run -it -v ~/本机目录:/容器中目录:ro ubuntu /bin/bash`

> 使用Dockerfile 构建包含数据卷的镜像,没构建一次，本地目录都会重新创建，这种创建的数据卷不能共享；如果需要实现共享采用数据卷容器的方式

- VOLUME ["/data"] 不能映射到本次存在的目录或文件,

#### 4.5.2 Docker数据卷容器

> 命名的容器挂在数据卷，其他容器通过挂在这个容器实现数据共享，挂载数据卷的容器，就叫做数据卷容器

![](https://raw.githubusercontent.com/pemako/assets/main/2022/202212072141456.png)

> 挂载数据卷容器的方法

- `docker run --volumes-from [CONTAINER NAME]`
  - 首先创建一个挂载书卷的容器 dev1
  - 创建一个新的容器并挂载 dev1
  - `docker run -it --name dev2 --volumes-from dev1 ubuntu /bin/bash`

#### 4.5.3 Docker数据卷的备份和还原

> 数据的备份方案

- `docker run --volumes-from [container name] -v $(pwd):/backup ubuntu tar cvf /backup.tar [container data volume]`

> 上面个的命令执行的效果如下图

![](https://raw.githubusercontent.com/pemako/assets/main/2022/202212072141725.png)

> 数据还原方案

- `docker run --volumes-from [container name] -v $(pwd):/backup ubuntu tar xvf /backup.tar [container data volume]`

## 参考

- 1、[https://www.jishuwen.com/d/2ETn](https://www.jishuwen.com/d/2ETn)
- 2、[https://yeasy.gitbooks.io/docker_practice/](https://yeasy.gitbooks.io/docker_practice/)
- 3、[https://zhuanlan.zhihu.com/p/35792864](https://zhuanlan.zhihu.com/p/35792864)
- 4、[https://www.jianshu.com/p/9e11be3d74f0](https://www.jianshu.com/p/9e11be3d74f0)
- 5、[https://www.zhihu.com/question/20387284](https://www.zhihu.com/question/20387284)
- 6、[https://www.raywenderlich.com/9159-docker-on-macos-getting-started](https://www.raywenderlich.com/9159-docker-on-macos-getting-started)
- 7、[https://pjw.io/articles/2018/04/25/access-to-the-container-network-of-docker-for-mac/](https://pjw.io/articles/2018/04/25/access-to-the-container-network-of-docker-for-mac/)

## 待学习

- Github + Docker Hub 实现自动构建镜像 [https://blog.csdn.net/bbwangj/article/details/82084480](https://blog.csdn.net/bbwangj/article/details/82084480)


---

## 一、概述

### 1.1 基本概念

Docker 是一个开源的应用容器引擎，基于 Go 语言  并遵从 Apache2.0 协议开源。

Docker 可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。

容器是完全使用沙箱机制，相互之间不会有任何接口（类似 iPhone 的 app），更重要的是容器性能开销极低。

### 1.2 优势

**简化程序**：Docker 让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的  Linux 机器上，便可以实现虚拟化。

Docker改变了虚拟化的方式，使开发者可以直接将自己的成果放入Docker中进行管理。方便快捷已经是 Docker的最大优势，过去需要用数天乃至数周的   任务，在Docker容器的处理下，只需要数秒就能完成。

**节省开支**：一方面，云计算时代到来，使开发者不必为了追求效果而配置高额的硬件，Docker 改变了高性能必然高价格的思维定势。

Docker 与云的结合，让云空间得到更充分的利用。不仅解决了硬件管理的问题，也改变了虚拟化的方式。

### 1.3 与传统VM特性对比：

作为一种轻量级的虚拟化方式，Docker在运行应用上跟传统的虚拟机方式相比具有显著优势：

- Docker 容器很快，启动和停止可以在秒级实现，这相比传统的虚拟机方式要快得多。
- Docker 容器对系统资源需求很少，一台主机上可以同时运行数千个Docker容器。
- Docker 通过类似Git的操作来方便用户获取、分发和更新应用镜像，指令简明，学习成本较低。
- Docker 通过Dockerfile配置文件来支持灵活的自动化创建和部署机制，提高工作效率。
- Docker 容器除了运行其中的应用之外，基本不消耗额外的系统资源，保证应用性能的同时，尽量减小系统开销。
- Docker 利用Linux系统上的多种防护机制实现了严格可靠的隔离。从1.3版本开始，Docker引入了安全选项和镜像签名机制，极大地提高了使用Docker的安全性。

| 特性       | 容器               | 虚拟机     |
| ---------- | ------------------ | ---------- |
| 启动速度   | 秒级               | 分钟级     |
| 硬盘使用   | 一般为MB           | 一般为GB   |
| 性能       | 接近原生           | 弱于原生   |
| 系统支持量 | 单机支持上千个容器 | 一般几十个 |

### 1.4 基础架构

Docker 使用客户端-服务器 (C/S) 架构模式，使用远程API来管理和创建Docker容器。

Docker 容器通过 Docker 镜像来创建。

容器与镜像的关系类似于面向对象编程中的对象与类。

| 容器 | 对象 |
| ---- | ---- |
| 镜像 | 类   |

![图片](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305220124172.jpeg)

### 1.5 Docker 技术的基础：

- namespace，容器隔离的基础，保证A容器看不到B容器. 6个名空间：User，Mnt，Network，UTS，IPC，Pid
- cgroups，容器资源统计和隔离。主要用到的cgroups子系统：cpu，blkio，device，freezer，memory
- unionfs，典型：aufs/overlayfs，分层镜像实现的基础

### 1.6 Docker 组件

- docker Client客户端 -->向docker服务器进程发起请求，如:创建、停止、销毁容器等操作
- docker Server服务器进程 -->处理所有docker的请求，管理所有容器
- docker Registry镜像仓库 -->镜像存放的中央仓库，可看作是存放二进制的scm

## 二、安装部署

### 2.1 准备条件

目前，CentOS 仅发行版本中的内核支持 Docker。Docker 运行在 CentOS 7 上，要求系统为64位、系统内核版本为 3.10 以上。

Docker 运行在 CentOS-6.5 或更高的版本的 CentOS 上，要求系统为64位、系统内核版本2.6.32-431 或者更高版本。

### 2.2 安装 Docker

```shell
yum install docker -y          #安装
systemctl start docker         #启动
systemctl enable docker        #设置开机自启动
```

### 2.3 基本命令

```
docker search centos   #搜索镜像
```

默认从国外拉去，速度很慢，可以使用daocloud配置加速

```shell
curl -sSL https://get.daocloud.io/daotools/set_mirror.sh | sh -s http://d6f11267.m.daocloud.io

# 脚本是写入
echo "{\"registry-mirrors\": [\"http://d6f11267.m.daocloud.io\"]}"> /etc/docker/daemon.json
systemctl restart docker              #重启失效
```

![图片](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305220124005.jpeg)

根据需求拉取镜像：

```
docker pull docker.io/ansible/centos7-ansible
```

拉去search到的全部镜像：

```
for i in `docker search centos|awk '!/NAME/{print $2}'`;do docker pull $i;done
```

查看本地镜像：

```
docker images
```

![图片](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305220124597.png)

### 2.4 命令整理

容器操作：

```shell
docker create 		# 创建一个容器但是不启动它
docker run 				# 创建并启动一个容器
docker stop 			# 停止容器运行，发送信号SIGTERM
docker start 			# 启动一个停止状态的容器
docker restart 		# 重启一个容器
docker rm 				# 删除一个容器
docker kill 			# 发送信号给容器，默认SIGKILL
docker attach 		# 连接(进入)到一个正在运行的容器
docker wait 			# 阻塞一个容器，直到容器停止运行
```

获取容器信息：

```
docker ps 			# 显示状态为运行（Up）的容器
docker ps -a 		# 显示所有容器,包括运行中（Up）的和退出的(Exited)
docker inspect 	# 深入容器内部获取容器所有信息
docker logs 		# 查看容器的日志(stdout/stderr)
docker events 	# 得到docker服务器的实时的事件
docker port 		# 显示容器的端口映射
docker top 			# 显示容器的进程信息
docker diff 		# 显示容器文件系统的前后变化
```

导出容器：

```
docker exec # 在容器里执行一个命令，可以执行bash进入交互式
```

执行：

```
docker exec # 在容器里执行一个命令，可以执行bash进入交互式
```

### 2.5 简单实践操作

运行并进入容器操作：

```
docker run -i -t docker.io/1832990/centos6.5  /bin/bash
```

- -t 表示在新容器内指定一个伪终端或终端；
- -i 表示允许我们对容器内的 (STDIN) 进行交互；
- -d 表示将容器在后台运行；
- /bin/bash 。这将在容器内启动 bash shell；

所以当容器（container）启动之后，我们会获取到一个命令提示符：

![图片](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305220124251.png)

在容器内我们安装MySQL并设置开机自启动，将修改后的镜像提交：

```
docker ps -l 查询容器IDdocker commit -m "功能" -a "用户信息" ID tag 提交修改后的镜像
```

![图片](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305220124003.jpeg)

```
docker inspect ID 查看详细信息
docker push ID 上传docker镜像
```

利用DockerFile创建镜像

使用命令 docker build ， 需要创建一个 Dockerfile 文件，其中包含一组指令来告诉 Docker 如何构建镜像。

```
mkdir DockerFile
cd DockerFilecat > Dockerfile <<EOF
FROM 603dd3515fcc
MAINTAINER Docker xuel
RUN yum install mysql mysql-server -y
RUN mddir /etc/sysconfig/network
RUN /etc/init.d/mysqld start
EOF
```

```
docker build -t "centos6.8:mysqld" .
```

- -t 制定repository 与tag
- . 指定Dockerfile的路径

> 注意一个镜像不能超过 127 层
> 此外，还可以利用 ADD 命令复制本地文件到镜像；
> 用 EXPOSE 命令来向外部开放端口；
> 用 CMD 命令来描述容器启动后运行的程序等。
> CMD [“/usr/sbin/apachectl”, “-D”, “FOREGROUND”]

### 2.6 Dockerfile 详解

Dockerfile的指令是忽略大小写的，建议使用大写，使用 # 作为注释，每一行只支持一条指令，每条指令可以携带多个参数。

Dockerfile的指令根据作用可以分为两种，构建指令和设置指令。

**构建指令**：用于构建 image，其指定的操作不会在运行image的容器上执行；

**设置指令**：用于设置 image 的属性，其指定的操作将在运行image的容器中执行。

- **FROM（指定基础image）**

构建指令，必须指定且需要在 Dockerfile 其他指令的前面。后续的指令都依赖于该指令指定的image。FROM 指令指定的基础 image 可以是官方远程仓库中的，也可以位于本地仓库。

该指令有两种格式：

```
FROM <image>       #指定基础image为该image的最后修改的版本
FROM <image>:<tag> #指定基础image为该image的一个tag版本。
```

- **MAINTAINER（用来指定镜像创建者信息）**

构建指令，用于将image的制作者相关的信息写入到image中。当我们对该image执行docker inspect命令时，输出中有相应的字段记录该信息。

```
MAINTAINER <name>
```

- **RUN（安装软件用）**

构建指令，RUN可以运行任何被基础image支持的命令。如基础image选择了ubuntu，那么软件管理部分只能使用ubuntu的命令。

```
RUN <command> (the command is run in a shell - `/bin/sh -c`)
RUN ["executable", "param1", "param2" ... ]  (exec form)
```

- **CMD（设置container启动时执行的操作）**

设置指令，用于container启动时指定的操作。该操作可以是执行自定义脚本，也可以是执行系统命令。该指令只能在文件中存在一次，如果有多个，则只执行最后一条。

```
CMD ["executable","param1","param2"] (like an exec, this is the preferred form)
CMD command param1 param2 (as a shell)
```

ENTRYPOINT 指定的是一个可执行的脚本或者程序的路径，该指定的脚本或者程序将会以 param1 和param2作为参数执行。

所以如果CMD指令使用上面的形式，那么Dockerfile中必须要有配套的ENTRYPOINT。当Dockerfile指定了ENTRYPOINT，那么使用下面的格式：

```
CMD ["param1","param2"] (as default parameters to ENTRYPOINT)
```

- **ENTRYPOINT（设置container启动时执行的操作）**

设置指令，指定容器启动时执行的命令，可以多次设置，但是只有最后一个有效。

```
ENTRYPOINT ["executable", "param1", "param2"] (like an exec, the preferred form)
ENTRYPOINT command param1 param2 (as a shell)
```

该指令的使用分为两种情况，一种是独自使用，另一种和CMD指令配合使用。

当独自使用时，如果你还使用了CMD命令且CMD是一个完整的可执行的命令，那么CMD指令和ENTRYPOINT会互相覆盖只有最后一个CMD或者ENTRYPOINT有效。

```
# CMD指令将不会被执行，只有ENTRYPOINT指令被执行
CMD echo “Hello, World!”
ENTRYPOINT ls -l
```

另一种用法和CMD指令配合使用来指定ENTRYPOINT的默认参数，这时CMD指令不是一个完整的可执行命令，仅仅是参数部分；ENTRYPOINT指令只能使用JSON方式指定执行命令，而不能指定参数。

```
FROM ubuntu
CMD ["-l"]
ENTRYPOINT ["/usr/bin/ls"]
```

- **USER（设置container容器的用户）**

设置指令，设置启动容器的用户，默认是root用户

```
# 指定memcached的运行用户
ENTRYPOINT ["memcached"]
USER daemon
或
ENTRYPOINT ["memcached", "-u", "daemon"]
```

- **EXPOSE（指定容器需要映射到宿主机器的端口）**

设置指令，该指令会将容器中的端口映射成宿主机器中的某个端口。当你需要访问容器的时候，可以不是用容器的IP地址而是使用宿主机器的IP地址和映射后的端口。

要完成整个操作需要两个步骤，首先在Dockerfile使用EXPOSE设置需要映射的容器端口，然后在运行容器的时候指定-p选项加上EXPOSE设置的端口，这样EXPOSE设置的端口号会被随机映射成宿主机器中的一个端口号。

也可以指定需要映射到宿主机器的那个端口，这时要确保宿主机器上的端口号没有被使用。EXPOSE指令可以一次设置多个端口号，相应的运行容器的时候，可以配套的多次使用-p选项。

```
# 映射一个端口EXPOSE port1# 相应的运行容器使用的命令  (主机(宿主)端口:容器端口)
docker run -p port1 image
# 映射多个端口
EXPOSE port1 port2 port3
# 相应的运行容器使用的命令
docker run -p port1 -p port2 -p port3 image
# 还可以指定需要映射到宿主机器上的某个端口号
docker run -p host_port1:port1 -p host_port2:port2 -p host_port3:port3 image
```

端口映射是 Docker 比较重要的一个功能，原因在于我们每次运行容器的时候容器的IP地址不能指定而是在桥接网卡的地址范围内随机生成的。

宿主机器的IP地址是固定的，我们可以将容器的端口的映射到宿主机器上的一个端口，免去每次访问容器中的某个服务时都要查看容器的IP的地址。

对于一个运行的容器，可以使用docker port加上容器中需要映射的端口和容器的ID来查看该端口号在宿主机器上的映射端口。

- **ENV（用于设置环境变量）**

构建指令，在image中设置一个环境变量。

```
ENV <key> <value>
```

设置了后，后续的RUN命令都可以使用，container启动后，可以通过docker inspect查看这个环境变量，也可以通过在docker run —env key=value时设置或修改环境变量。

假如你安装了JAVA程序，需要设置JAVA_HOME，那么可以在Dockerfile中这样写：

```
ENV JAVA_HOME /path/to/java/dirent
```

- **ADD（从src复制文件到container的dest路径）**

构建指令，所有拷贝到container中的文件和文件夹权限为0755，uid和gid为0；

如果是一个目录，那么会将该目录下的所有文件添加到container中，不包括目录；如果文件是可识别的压缩格式，则docker会帮忙解压缩（注意压缩格式）；

如果`<src>`是文件且`<dest>`中不使用斜杠结束，则会将`<dest>`视为文件，`<src>`的内容会写入`<dest>`；

如果`<src>`是文件且`<dest>`中使用斜杠结束，则会`<src>`文件拷贝到`<dest>`目录下。

```
ADD <src> <dest>
```

是相对被构建的源目录的相对路径，可以是文件或目录的路径，也可以是一个远程的文件url;

是container中的绝对路径

- **VOLUME（指定挂载点)**

设置指令，使容器中的一个目录具有持久化存储数据的功能，该目录可以被容器本身使用，也可以共享给其他容器使用。

我们知道容器使用的是AUFS，这种文件系统不能持久化数据，当容器关闭后，所有的更改都会丢失。当容器中的应用有持久化数据的需求时可以在Dockerfile中使用该指令。

```
FROM baseVOLUME ["/tmp/data"]
```

- **WORKDIR（切换目录）**

设置指令，可以多次切换(相当于cd命令)，对RUN,CMD,ENTRYPOINT生效。

```
# 在 /p1/p2 下执行 vim a.txt
WORKDIR /p1 WORKDIR p2 RUN vim a.txt
```

### 2.7 镜像导入导出

![图片](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305220125515.png)

导出镜像到本地：

![图片](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305220125151.png)

```
docker save -o centos6.5.tar centos6.5 或
docker export f9c99092063c >centos6.5.tar
```

从本地将镜像导入：

```
docker load --input centos6.5.tar 或
docker load < centos6.5.tar
```

```
docker rm删除已经终止的容器docker -f rm 可以删除正在运行的容器
```

修改已经运行的后台容器：

```
docker exec -it CONTAINER ID /bin/bash
```

![图片](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305220125091.jpeg)

## 三、存储

### 3.1 数据盘

Docker 的镜像使用一层一层文件组成的，Docker 的一些存储引擎可以处理怎么样存储这些文件。

```
docker inspect centos #查看容器详细信息
```

信息下方的Layers，就是centos的文件，这些东西都是只读的不能去修改，我们基于这个镜像去创建的镜像和容器也会共享这些文件层，而docker会在这些层上面去添加一个可读写的文件层。

如果需要修改一些文件层里面的东西的话，docker会复制一份到这个可读写的文件层里面，如果删除容器的话，那么也会删除它对应的可读写的文件层的文件。

如果有些数据你想一直保存的话，比如：web服务器上面的日志，数据库管理系统里面的数据，那么我们可以把这些数据放到data volumes数据盘里面。

它上面的数据，即使把容器删掉，也还是会永久保留。创建容器的时候，我们可以去指定数据盘。其实就是去指定一个特定的目录。

```
docker run -i -t -v /mnt  --name nginx docker.io/nginx /bin/bash
```

- -v：制定挂载到容器内的目录

![图片](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305220125468.jpeg)

使用docker inspect容器ID可以查看挂载目录对应于宿主机的物理文件路径。

![图片](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305220125474.jpeg)

同样，我们可以使用将制定物理宿主机的目录挂载到容器的制定目录下：

将宿主机目录挂载到容器内：

```
docker run -d -p 80:80 --name nginx -v /webdata/wordpress:/usr/share/nginx/html docker.io/sergeyzh/centos6-nginx
```

- -d 后台运行
- —name 给运行的容器命名
- -v 宿主机目录：容器目录 将宿主机目录挂载在容器内
- -p 宿主机端口：容器监听端口 将容器内应用监听端口映射到物理宿主机的特定端口上

![图片](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305220125414.jpeg)

![图片](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305220125603.png)

映射多个物理目录：（多写几个-v即可）

![图片](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305220125987.jpeg)

![图片](https://mmbiz.qpic.cn/mmbiz_png/A1HKVXsfHNn2qKaO1IkMBUwFxsW5LIpnhkDDc6b6q0AJfibEaq4OltB5zuVkeDiatITOdqRT4oUeyAtN734nzA8w/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

### 3.2 数据容器

可以创建一个数据容器，也就是再创建容器是指定这个容器的数据盘，然后让其他容器可以使用这个容器作为他们的数据盘，有点像继承了这个数据容器指定的数据盘作为数据盘。

首先创建一个数据容器命名为newnginx

```
docker create -v /mnt -it --name newnginx docker.io/nginx /bin/bash
```

利用此数据容器容器运行一个容器nginx1，在数据目录/mnt 下创建一个文件

```
docker run --volumes-from newnginx --name nginx1 -it docker.io/nginx /bin/bash
利用数据容器在创建一个容器nginx2，查看数据目录下容器nginx1创建的文件依旧存在，同理在nginx2的/mnt下创建文件，其他基于数据容器运行的新容器也可以看到文件
```

![图片](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305220125136.png)

### 3.3 数据盘管理

在删除容器时，docker默认不会删除其数据盘。

```
docker volume ls                    #查看数据盘docker volume ls -f dangling=true        #查看未被容器使用的数据盘docker volume rm VOLUME NAME        #删除数据盘
```

如果想要删除容器时，同时删除掉其数据盘，那么可以使用`-v`参数。

```
docker rm -v newnginx
```

## 四、网络

docker提供几种网络，它决定容器之间和外界和容器之间如何去相互通信。

```
docker network ls        #查看网络
```

![图片](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305220125797.png)

当 Docker 进程启动时，会在主机上创建一个名为 docker0 的虚拟网桥，此主机上启动的Docker容器会连接到这个虚拟网桥上。

虚拟网桥的工作方式和物理交换机类似，这样主机上的所有容器就通过交换机连在了一个二层网络中。从docker0子网中分配一个IP给容器使用，并设置docker0的IP地址为容器的默认网关。

在主机上创建一对虚拟网卡veth pair设备，Docker将veth pair设备的一端放在新创建的容器中，并命名为eth0（容器的网卡），另一端放在主机中，以vethxxx这样类似的名字命名，并将这个网络设备加入到docker0网桥中。

### 4.1 bridge桥接

网络除非创建容器的时候指定网络，不然容器就会默认的使用桥接网络。属于这个网络的容器之间可以相互通信，不过外界想要访问到这个网络的容器呢，需使用桥接网络，有点像主机和容器之间的一座桥，对容器有一点隔离作用。

实际是在iptables做了DNAT规则，实现端口转发功能。可以使用iptables -t nat -vnL查看。

### 4.2 host 主机网络

如果启动容器的时候使用host模式，那么这个容器将不会获得一个独立的Network Namespace，而是和宿主机共用一个 Network Namespace。容器将不会虚拟出自己的网卡，配置自己的IP等，而是使用宿主机的IP和端口。

但是，容器的其他方面，如文件系统、进程列表等还是和宿主机隔离的。只用这种网络的容器会使用主机的网络，这种网络对外界是完全开放的，能够访问到主机，就能访问到容器。

### 4.3 使用 none 模式

使用none模式Docker容器拥有自己的Network Namespace，但是，并不为Docker容器进行任何网络配置。也就是说，这个Docker容器没有网卡、IP、路由等信息。需要我们自己为Docker容器添加网卡、配置IP等。使用此种网络的容器会完全隔离。

### 4.4 简单演示

启动两个容器，查看其容器内部IP地址

```
for i in `docker ps |grep -v "CONTAINER"|awk '{print $1}'`;do docker inspect $i|grep 'IPAddress';done
```

查看桥接模式下主机内部容器之间和容器与宿主机直接均可正常通讯

![图片](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305220126008.jpeg)

```
docker inspect 容器ID
```

![图片](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305220126770.png)

查看host创建的容器内部没有IP地址，它使用的为宿主机的地址：

```
docker run -d --net host docker.io/sergeyzh/centos6-nginx
```

![图片](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305220126157.jpeg)

![图片](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305220126042.jpeg)

查看 host 创建的容器内部没有 IP 地址，它使用的为宿主机的地址：

```
docker run -d --net none docker.io/sergeyzh/centos6-nginx
```

![图片](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305220126933.jpeg)

### 4.5 容器端口

如果想让外界可以访问到，基于bridge网络创建的容器提供的服务，那你可以告诉Docker 你要使用哪些接口。如果想查看镜像会使用哪些端口，ExposedPorts，可以获悉镜像使用哪些端口。

```
docker run -d -p 80 docker.io/sergeyzh/centos6-nginxdocker port 09648b2ff7f6
```

> - -p 参数会在宿主机随机映射一个高端口到容器内的指定端口。

![图片](https://raw.githubusercontent.com/pemako/assets/main/2023/network/202305220126911.jpeg)

```
docker run -d -p 80:80 docker.io/sergeyzh/centos6-nginx    #将宿主机的80端口映射到容器的80端口
```