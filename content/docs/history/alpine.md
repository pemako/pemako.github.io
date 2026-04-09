---
date: '2026-04-09T20:00:00+08:00'
title: 'Alpine Linux'
description: ""
summary: ""
tags: ["docker", "alpine"]
categories: ["docker"]
series: ["Docker"]
ShowToc: true
TocOpen: true
---


基于 alpine 打一个 atlantis 运行使用的基础镜像

docker pull golang:1.19.5-alpine3.17


- 修改时区
	- apk add --no-cache tzdata 
	- cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
	- echo "Asia/Shanghai" > /etc/timezone
- 添加 chromium 进行浏览器登录获取token使用
	- apk add chromium
- 安装 go 环境
	- apk add binutils go