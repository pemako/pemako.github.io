---
date: '2025-06-26T23:23:05+08:00'
title: 'iptables'
description: ""
summary: ""
tags: ["iptables"]
categories: ["iptables"]
series: ["Post"]
ShowToc: true
TocOpen: true
---

> 图片引用 https://mp.weixin.qq.com/s/GTAGMy2t0FIIUhq6CpFgWw
![Pasted image 20250627125922](https://raw.githubusercontent.com/pemako/imgs/master/public/2025/202506271259911.png)

## **🧩 一、iptables 五表详解**

> 优先级顺序 raw > mangle > nat > filter > security

|**表名**|**用途**|**作用时机**|**优先级**|**常用规则**|
|---|---|---|---|---|
|**raw**|关闭连接跟踪（conntrack）|最早阶段|⭐最高|NOTRACK|
|**mangle**|修改数据包（TTL、TOS、MARK等）|早期、中期、晚期都可插入|高|MARK, TTL, TOS|
|**nat**|实现源地址或目标地址转换（NAT）|PREROUTING / POSTROUTING / OUTPUT|中|SNAT, DNAT, MASQUERADE|
|**filter**|数据包过滤（放行/丢弃）|处理末期|⭐最常用|ACCEPT, DROP|
|**security**|与 SELinux、AppArmor 结合的强制访问控制|最后阶段|低|配合 SELinux 使用|

## **🔗 二、五链详解（对应五个 hook 点）**

|**链名**|**描述**|**属于哪些表**|
|---|---|---|
|**PREROUTING**|入站包一进内核就处理（在路由前）|raw, mangle, nat|
|**INPUT**|进入本机的包|mangle, filter, security|
|**FORWARD**|转发到别处的包|mangle, filter, security|
|**OUTPUT**|本机发出的包|raw, mangle, nat, filter, security|
|**POSTROUTING**|所有出站包（包括转发）在离开前|mangle, nat, security|

## **🚚 三、收发包流程图说明（图下方）**

你贴的图，和 Netfilter 的真实流程图是基本一致的。下面我对照图帮你拆解下：

### **✅ 1. 入站数据包（A 网络 -> 本机）**

-> raw 表 PREROUTING 链  
-> mangle 表 PREROUTING 链  
-> nat 表 PREROUTING 链（例如 DNAT）  
-> 路由判断（是给本机的）  
-> security 表 INPUT 链  
-> mangle 表 INPUT 链  
-> filter 表 INPUT 链（此处常写 ACCEPT/DROP）  
-> 本机应用处理

### **✅ 2. 本机发出的数据包（本机 -> B 网络）**

-> 本机生成数据包  
-> raw 表 OUTPUT 链  
-> mangle 表 OUTPUT 链  
-> nat 表 OUTPUT 链（目的地址改写）  
-> 路由判断  
-> security 表 OUTPUT 链  
-> filter 表 OUTPUT 链  
-> mangle 表 POSTROUTING 链  
-> nat 表 POSTROUTING 链（SNAT/MASQUERADE）  
-> 实际发出

### **✅ 3. 转发包（从 A 网络进入，从 B 网络发出）**

-> raw 表 PREROUTING 链  
-> mangle 表 PREROUTING 链  
-> nat 表 PREROUTING 链  
-> 路由判断：非本机目标，转发！  
-> security 表 FORWARD 链  
-> mangle 表 FORWARD 链  
-> filter 表 FORWARD 链（决定是否允许转发）  
-> mangle 表 POSTROUTING 链  
-> nat 表 POSTROUTING 链（如 SNAT）  
-> 发往 B 网络

## **🎯 重点理解**

1. **NAT 只在特定链上生效：**
    - DNAT 一般在 PREROUTING 链（目标改写）
    - SNAT 在 POSTROUTING 链（源地址改写）

2. **FORWARD 链 ≠ INPUT 链**
    - 如果数据包不是给本机，是从一个网卡进另一个网卡出（如路由器场景），才会走 FORWARD 链。

3. **raw 表适合关闭 conntrack**
    - 提高性能，防止无效连接被跟踪。

4. **filter 表是“最终决定”**
    - 是否 DROP、ACCEPT 都在这里。

5. **security 表 很少用**
    - 一般配合 SELinux，默认规则为空，可忽略。

要在实际配置 iptables 时灵活掌握这些流程图，建议搭配使用：
```
iptables -t filter -L -n -v  
iptables -t nat -L -n -v
```
