---
layout: post
title: istio概述
category: k8s
tags: k8s
---


# 概述

![](https://raw.githubusercontent.com/pemako/imgs/master/public/20200715161731.png)

## 1. 连接

- 流量管理
- 负载均衡
- 灰度发布


## 2. 安全

- 认证
- 鉴权

## 3. 控制

- 限流
- ACL

## 4. 观察

- 监控
- 调用链


----

# 二、istio 架构


- 数据平面由一组智能代理（Envoy）组成，被部署为 sidecar。这些代理通过一个通用的策略和遥测中心（Mixer）传递和控制微服务之间的所有网络通信。
- 控制平面管理并配置代理来进行流量路由。此外，控制平面配置 Mixer 来执行策略和收集遥测数据。

![](https://istio.io/v1.5/zh/docs/ops/deployment/architecture/arch.svg)


## 组件

- Mixer (适配组件) 在整个服务网格中执行访问控制和策略使用，并从 Envoy 代理和其他服务收集遥测数据
- Pilot (策略配置组件)Pilot 为 Envoy sidecar 提供服务发现、用于智能路由的流量管理功能（例如，A/B 测试、金丝雀发布等）以及弹性功能（超时、重试、熔断器等）
- Citadel 安全组件
- Galley 配置管理，验证，分发

### istio 4个配置资源，落地所有流量管理需求

- 虚拟服务 `VirtualService` 实现服务请求路由规则的功能
- 目标规则 `DestinationRule` 实现目标服务的负载均衡，服务发现，故障处理和故障注入的功能
- 网关     `Gateway` 让服务网格内的服务，可以被外网访问
- 服务入口 `ServiceEntry` 让服务网格内的服务，可以访问网格外的服务



### 安全

> 安装架构

![安全架构](https://istio.io/v1.5/zh/docs/concepts/security/arch-sec.svg)


> 授权架构

![授权架构](https://istio.io/v1.5/zh/docs/concepts/security/authz.svg)

- 认证策略 `PeerAuthentication` `RequestAuthentication`


---

> 名词翻译

1. 策略执行点（Policy Enforcement Points(PEPs) 
2. 秘钥发现服务 secret discovery service（SDS）
3. 指标（Metric）
