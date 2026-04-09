---
date: '2026-04-09T20:00:00+08:00'
title: 'Linux 内核'
description: ""
summary: ""
tags: ["linux", "kernel"]
categories: ["linux"]
series: ["Linux"]
ShowToc: true
TocOpen: true
---


# **🧭《深入理解 Linux 内核（2.6.11）》 → Linux 6.x 源码结构对照与学习导引**

---

## **🧩 一、系统整体结构**

|**模块**|**书中章节**|**Linux 2.6 路径**|**Linux 6.x 路径**|**说明**|
|---|---|---|---|---|
|内核入口（启动流程）|第 2 章|arch/i386/kernel/head.S, init/main.c|arch/x86/kernel/head_64.S, init/main.c|入口逻辑相似：仍是 start_kernel()，但支持多架构（x86, ARM, RISC-V）|
|系统调用入口|第 10 章|arch/i386/kernel/entry.S, arch/i386/kernel/traps.c|arch/x86/entry/entry_64.S, kernel/syscall_table.S|系统调用表机制相同，但入口汇编和 syscall wrapper 重写|
|内核初始化流程|第 3 章|init/main.c|init/main.c|主干逻辑仍是 start_kernel() → rest_init()|

---

## **🧠 二、进程与调度（Process & Scheduler）**

|**模块**|**书中章节**|**2.6.11 路径**|**6.x 路径**|**说明**|
|---|---|---|---|---|
|进程描述符|第 3–4 章|include/linux/sched.h, kernel/fork.c|include/linux/sched.h, kernel/fork.c|task_struct 结构仍然存在，字段大幅扩展（多 CPU、NUMA 支持）|
|进程创建|第 3 章|kernel/fork.c|kernel/fork.c|核心函数仍是 do_fork() / copy_process()|
|进程终止|第 3 章|kernel/exit.c|kernel/exit.c|逻辑基本相同|
|调度器|第 7 章|kernel/sched.c（O(1) 调度器）|kernel/sched/core.c, kernel/sched/fair.c（CFS 调度器）|📌 **最大差异**：现代内核使用 CFS（完全公平调度器）取代了 O(1)|
|睡眠与唤醒|第 7 章|kernel/sched.c|kernel/sched/core.c|同样通过 wait_queue 与 schedule()|

---

## **🧮 三、内存管理（Memory Management）**

|**模块**|**书中章节**|**2.6.11 路径**|**6.x 路径**|**说明**|
|---|---|---|---|---|
|页框分配|第 8 章|mm/page_alloc.c|mm/page_alloc.c|概念一致（buddy system），但支持 NUMA / CMA / ZONE_DEVICE|
|虚拟内存管理|第 9 章|mm/mmap.c, mm/mprotect.c|mm/mmap.c, mm/mprotect.c|vm_area_struct、mm_struct 概念仍相同|
|页面换出|第 15 章|mm/vmscan.c|mm/vmscan.c|逻辑相似但复杂度大幅提升|
|Slab 分配器|第 8 章|mm/slab.c|mm/slub.c, mm/slab_common.c|默认使用 SLUB（比 Slab 更简洁高效）|

---

## **🧱 四、中断与异常（Interrupts & Exceptions）**

|**模块**|**书中章节**|**2.6.11 路径**|**6.x 路径**|**说明**|
|---|---|---|---|---|
|中断描述|第 4 章|arch/i386/kernel/irq.c, kernel/irq/handle.c|kernel/irq/ 下多文件（manage.c, chip.c, spurious.c 等）|2.6 时是单文件，现在模块化程度更高|
|中断上下文切换|第 4–5 章|arch/i386/kernel/entry.S|arch/x86/entry/entry_64.S|汇编层实现更新为 x86_64 调用约定|
|软中断、tasklet、工作队列|第 4–5 章|kernel/softirq.c, kernel/workqueue.c|kernel/softirq.c, kernel/workqueue.c|概念完全保留|

---

## **💾 五、文件系统（VFS & FS）**

|**模块**|**书中章节**|**2.6.11 路径**|**6.x 路径**|**说明**|
|---|---|---|---|---|
|虚拟文件系统层（VFS）|第 12 章|fs/namei.c, fs/open.c, fs/read_write.c|fs/namei.c, fs/open.c, fs/read_write.c|几乎同名路径，代码更复杂|
|inode / dentry 机制|第 12 章|fs/inode.c, fs/dcache.c|fs/inode.c, fs/dcache.c|概念完全相同，接口丰富|
|文件系统注册|第 13 章|fs/super.c|fs/super.c|仍然是 register_filesystem()|
|Ext2 文件系统|第 14 章|fs/ext2/|fs/ext4/|现代系统几乎都使用 ext4 取代 ext2|

---

## **🔌 六、设备驱动与内核模块（Driver & Module）**

|**模块**|**书中章节**|**2.6.11 路径**|**6.x 路径**|**说明**|
|---|---|---|---|---|
|模块加载机制|第 20 章|kernel/module.c|kernel/module/（目录化）|模块系统大改：支持 LTO、压缩、Rust 模块等|
|设备驱动模型|第 13 章|drivers/base/|drivers/base/|书中介绍的 kobject/kset/driver model 仍是基础|
|字符设备|第 13 章|drivers/char/|drivers/char/|仍可用同样机制注册字符设备|

---

## **⚙️ 七、同步机制（Synchronization）**

|**模块**|**书中章节**|**2.6.11 路径**|**6.x 路径**|**说明**|
|---|---|---|---|---|
|自旋锁、信号量|第 5 章|kernel/spinlock.c, kernel/semaphore.c|kernel/locking/|完全独立成 kernel/locking/ 模块|
|RCU（Read-Copy-Update）|第 5 章|初步存在|kernel/rcu/|现代内核的核心机制之一|
|原子操作|第 5 章|include/asm/atomic.h|include/linux/atomic/|已高度泛化并支持多架构实现|

---

## **🌐 八、网络子系统（Networking）**

|**模块**|**书中章节**|**2.6.11 路径**|**6.x 路径**|**说明**|
|---|---|---|---|---|
|网络协议栈|第 18–19 章|net/ipv4/, net/core/|net/ipv4/, net/core/, net/ipv6/|路径相同，但功能极大增强（XDP、eBPF）|
|Socket 实现|第 18 章|net/socket.c|net/socket.c|接口一致，内部实现复杂化|
|eBPF|无|无|kernel/bpf/, tools/bpf/|⚡ 新增：现代 Linux 内核的重大特性|

---

## **🧩 九、核心入口函数速览（Linux 6.x 仍保留的经典符号）**

|**功能**|**函数名**|**路径**|
|---|---|---|
|内核启动|start_kernel()|init/main.c|
|系统调用|sys_* 系列|kernel/sys_*.c|
|进程调度|schedule()|kernel/sched/core.c|
|创建进程|do_fork(), copy_process()|kernel/fork.c|
|虚拟内存管理|do_mmap(), do_munmap()|mm/mmap.c|
|文件打开|do_sys_openat2()|fs/open.c|
|读写文件|vfs_read(), vfs_write()|fs/read_write.c|

---

## **🧭 十、推荐的现代学习路线图（结合你的环境）**

|**阶段**|**内容**|**对应实践**|
|---|---|---|
|**阶段 1：结构导览**|通读 ULK 前 3 章 + 对照 init/, kernel/, arch/x86/|阅读 init/main.c 中的 start_kernel()|
|**阶段 2：进程调度与内存**|对照书中第 3–9 章|阅读 kernel/sched/ 与 mm/page_alloc.c|
|**阶段 3：VFS 与系统调用**|书中第 10–14 章|对照 fs/ 与 arch/x86/entry/|
|**阶段 4：同步与驱动模型**|书中第 5、20 章|查看 kernel/locking/, drivers/base/|
|**阶段 5：现代特性探索**|eBPF、io_uring、cgroups、namespaces|阅读 kernel/bpf/, fs/io_uring.c, kernel/cgroup/|

---

## **✅ 总结**

- 你完全可以用 **Linux 6.x + OrbStack** 学《深入理解 Linux 内核》。
    
- 书中内容 = 原理清晰，但源码版本老；
    
- 用上面表格对照即可快速定位现代源码路径；
    
- 强烈推荐结合 **LXR (Linux Cross Reference)** 或 GitHub 搜索源码符号，例如：
    
    👉 https://elixir.bootlin.com/linux/latest/source
    

---


这份指南按章节、学习目标、现代源码入口函数排列，让你可以 **边看书边看 Linux 6.x 源码**，系统掌握内核整体结构。

---
# **🧭 Linux 内核学习路线图（基于 ULK 与 Linux 6.x）**

  

## **📘 阶段 1：从入口了解内核的全貌（第 1–3 章）**

|**学习目标**|**对应书章节**|**Linux 6.x 源码入口**|**阅读建议**|
|---|---|---|---|
|了解内核启动流程|第 2 章《内核的初始化》|init/main.c → start_kernel() → rest_init()|重点看：内核初始化顺序、内核线程创建|
|了解体系结构特定代码|第 2 章|arch/x86/kernel/head_64.S, arch/x86/kernel/setup.c|理解从汇编入口到 C 初始化的过渡|
|系统调用初始化|第 10 章|arch/x86/entry/entry_64.S, kernel/sys_ni.c|现代系统调用表在 arch/x86/entry/syscalls/syscall_64.tbl|

📍 **建议阅读顺序：**

1️⃣ arch/x86/kernel/head_64.S

2️⃣ start_kernel() → mm_init() / sched_init() / rest_init()

3️⃣ kernel_init() → init/main.c 结尾

---

## **🧠 阶段 2：进程管理与调度（第 3–7 章）**

|**学习目标**|**书中章节**|**Linux 6.x 入口函数**|**路径**|
|---|---|---|---|
|理解 task_struct|第 3 章|include/linux/sched.h|所有进程核心结构|
|进程创建机制|第 3 章|copy_process()、do_fork()|kernel/fork.c|
|进程退出流程|第 3 章|do_exit()、release_task()|kernel/exit.c|
|调度器原理|第 7 章|schedule()、__schedule()、pick_next_task_fair()|kernel/sched/core.c, kernel/sched/fair.c|
|睡眠/唤醒机制|第 7 章|__wake_up()、prepare_to_wait_event()|kernel/sched/wait.c|
|内核线程|第 3 章|kernel_thread(), kthread_create()|kernel/kthread.c|

📍 **建议阅读顺序：**

1️⃣ 阅读 include/linux/sched.h → task_struct

2️⃣ 阅读 copy_process() 创建流程

3️⃣ 再看 schedule() 调度实现

4️⃣ 最后看 do_exit() 结束逻辑

---

## **🧮 阶段 3：内存管理（第 8–9 章）**

|**学习目标**|**书中章节**|**Linux 6.x 源码入口**|**路径**|
|---|---|---|---|
|页框分配（Buddy System）|第 8 章|alloc_pages()、__alloc_pages()|mm/page_alloc.c|
|虚拟内存映射|第 9 章|do_mmap()、do_munmap()|mm/mmap.c|
|内核内存分配（kmalloc）|第 8 章|kmalloc(), kmem_cache_alloc()|mm/slub.c|
|页换出|第 15 章|shrink_node(), vmscan.c|mm/vmscan.c|

📍 **建议阅读顺序：**

1️⃣ alloc_pages() → 物理页分配

2️⃣ kmalloc() → 内核分配接口

3️⃣ do_mmap() → 用户空间映射

4️⃣ vmscan.c → 回收与换出机制

---

## **⚙️ 阶段 4：同步与中断（第 4–5 章）**

|**学习目标**|**书中章节**|**6.x 源码入口**|**路径**|
|---|---|---|---|
|中断处理框架|第 4 章|__do_softirq(), handle_irq_event()|kernel/irq/|
|软中断 / tasklet / 工作队列|第 4–5 章|kernel/softirq.c, kernel/workqueue.c|同路径|
|自旋锁与信号量|第 5 章|kernel/locking/spinlock.c, kernel/locking/mutex.c|同路径|
|RCU 机制|第 5 章|rcu_read_lock(), synchronize_rcu()|kernel/rcu/|

📍 **建议阅读顺序：**

1️⃣ kernel/irq/ → 中断注册与处理

2️⃣ softirq.c / workqueue.c → 异步任务机制

3️⃣ spinlock.c, mutex.c → 同步原语

---

## **💾 阶段 5：文件系统与 VFS（第 12–14 章）**

|**学习目标**|**书中章节**|**6.x 入口函数**|**路径**|
|---|---|---|---|
|系统调用层 → VFS|第 12 章|do_sys_openat2(), vfs_open()|fs/open.c|
|inode/dentry|第 12 章|struct inode, d_lookup()|fs/inode.c, fs/dcache.c|
|文件读写|第 12 章|vfs_read(), vfs_write()|fs/read_write.c|
|文件系统注册|第 13 章|register_filesystem()|fs/super.c|

📍 **建议阅读顺序：**

1️⃣ 从 sys_open() → do_sys_openat2() 开始

2️⃣ 阅读 vfs_open()、inode_operations

3️⃣ 理解 read_write.c 的读写流程

---

## **🔌 阶段 6：设备驱动与模块（第 19–20 章）**

|**学习目标**|**书中章节**|**6.x 源码入口**|**路径**|
|---|---|---|---|
|模块加载与符号解析|第 20 章|load_module()、layout_and_allocate()|kernel/module/main.c|
|字符设备注册|第 13 章|register_chrdev_region(), cdev_add()|fs/char_dev.c|
|驱动模型|第 13 章|kobject, device_register()|drivers/base/core.c|

📍 **建议阅读顺序：**

1️⃣ 阅读 kernel/module/ → 模块装载

2️⃣ drivers/base/ → 驱动模型与 kobject

3️⃣ fs/char_dev.c → 字符设备注册

---

## **🌐 阶段 7：网络子系统（第 18–19 章）**

|**学习目标**|**书中章节**|**6.x 源码入口**|**路径**|
|---|---|---|---|
|socket 创建与绑定|第 18 章|sock_create_kern(), __sys_bind()|net/socket.c|
|协议栈入口|第 19 章|tcp_v4_connect(), ip_queue_xmit()|net/ipv4/tcp.c, net/ipv4/ip_output.c|
|网络接口|第 19 章|register_netdev()|net/core/dev.c|

📍 **建议阅读顺序：**

1️⃣ 从 net/socket.c → sock_create() → inet_create()

2️⃣ 进入 net/ipv4/tcp.c → tcp_v4_connect()

3️⃣ 理解 dev_queue_xmit() 与网卡驱动收发机制

---

## **🧩 阶段 8：现代新增机制（ULK 未涵盖）**

|**模块**|**路径**|**功能**|
|---|---|---|
|eBPF|kernel/bpf/, tools/bpf/|可编程内核执行环境|
|io_uring|fs/io_uring.c|高性能异步 I/O|
|cgroup / namespace|kernel/cgroup/, kernel/nsproxy.c|容器化基础|
|Rust 模块支持|rust/|Linux 6.x 新增的安全驱动开发语言|

---

## **📖 推荐阅读方式（高效三步法）**

  

1️⃣ **先看 ULK 理论章节**（原理不变，重点理解抽象层次）

2️⃣ **再查表定位现代源码文件**（上表提供路径）

3️⃣ **用符号搜索辅助阅读：**

- [Elixir Bootlin](https://elixir.bootlin.com/linux/latest/source)
    
- 搜索函数名，如 copy_process, do_fork, schedule
    
- 跟踪调用栈和关键结构体定义
    

---

## **✅ 总结**

- 《深入理解 Linux 内核》仍是理解现代内核结构的**最佳原理书**。
    
- Linux 6.x 仅在实现层面演进（CFS、NUMA、RCU、SLUB 等），主干架构一致。
    
- 按上述路线，你可以从“内核启动 → 调度 → 内存 → 文件系统 → 网络”完整走一遍。
    
- 用 **OrbStack + Linux 6.x 源码** 完全足够深入理解 Linux。
    

---

是否希望我接下来帮你生成一个 **“函数调用导图 + 推荐阅读顺序（按调用栈）”**，比如从 start_kernel() 开始一路展开，直到调度器初始化？

那样你能看到每一章具体调用链（像一张学习路线图）。


非常好 ✅

我们来正式构建一份可操作的、贯穿《深入理解 Linux 内核》的

🧭 **函数调用导图 + 阅读顺序（基于 Linux 6.x 内核）**。

  

这份图从 **内核入口函数 start_kernel()** 出发，层层展开，直至调度器与内存初始化，是学习内核最关键的主干路径。

我会为每一层提供：

- ✅ 主要函数名（函数入口）
    
- 📂 对应源码路径
    
- 🎯 学习目标（理解点）
    
- 🧩 建议阅读顺序
    

---

# **🧩 Linux 6.x 内核启动主路径导图**

  

（从汇编到内核线程）

```
arch/x86/kernel/head_64.S
        ↓
start_kernel()
        ↓
    setup_arch()
    mm_init()
    sched_init()
    rest_init()
        ↓
        ├─ kernel_init()  → init进程（PID 1）
        └─ kthreadd()     → 内核线程守护进程（PID 2）
```

---

## **🧱 第一阶段：体系结构入口（汇编 → C）**

| **阶段** | **函数**              | **文件路径**                  | **说明**                         |
| ------ | ------------------- | ------------------------- | ------------------------------ |
| 🧩 1   | _start              | arch/x86/kernel/head_64.S | CPU 上电后的第一个入口，建立最小运行环境         |
| 🧩 2   | x86_64_start_kernel | arch/x86/kernel/head64.c  | 从汇编跳入 C 世界，准备调用 start_kernel() |
| 🧩 3   | start_kernel()      | init/main.c               | Linux 内核的 **主入口函数**            |

🎯 **目标：**

理解“汇编初始化 → 内核主控逻辑”的转换。

📍 你可以从 head_64.S 搜索 _start: 开始看，一直跳转到 start_kernel()。

---

## **⚙️ 第二阶段：内核初始化主流程（**

## **start_kernel()**

## **）**

```
asmlinkage __visible void __init start_kernel(void)
{
    setup_arch(&command_line);
    setup_command_line();
    setup_per_cpu_areas();
    mm_init();
    sched_init();
    rest_init();
}
```

|**函数**|**路径**|**学习点**|
|---|---|---|
|setup_arch()|arch/x86/kernel/setup.c|检测 CPU、内存布局、初始化分页|
|mm_init()|mm/init.c|启动内存管理系统（buddy、slab、vm）|
|sched_init()|kernel/sched/core.c|初始化调度器与 runqueue|
|rest_init()|init/main.c|启动第一个进程（kernel_init）与 kthread 守护线程|

🎯 **阅读建议顺序：**

1️⃣ start_kernel() 总体

2️⃣ setup_arch() → CPU 检测 + 内存布局

3️⃣ mm_init() → 内存系统

4️⃣ sched_init() → 调度初始化

5️⃣ rest_init() → 创建内核线程

---

## **🧠 第三阶段：**

## **mm_init()**

##  **内存管理初始化**

|**函数**|**路径**|**学习点**|
|---|---|---|
|mm_init()|mm/init.c|初始化页表、内核堆、SLAB|
|mem_init()|mm/mem_init.c|建立物理内存管理结构|
|kmem_cache_init()|mm/slab_common.c|初始化 slab/slub 系统|
|vmalloc_init()|mm/vmalloc.c|虚拟内存分配机制|

📍 推荐查看：

```
mm_init()
 ├─ page_ext_init_flatmem()
 ├─ kmem_cache_init()
 ├─ vmalloc_init()
 └─ mem_init()
```

🎯 目标：理解从物理内存 → 页管理 → 虚拟地址空间 的整个过程。

---

## **🧩 第四阶段：**

## **sched_init()**

##  **调度器初始化**

|**函数**|**文件**|**学习点**|
|---|---|---|
|sched_init()|kernel/sched/core.c|初始化全局调度器|
|init_sched_fair_class()|kernel/sched/fair.c|初始化 CFS 调度类|
|init_idle()|kernel/sched/core.c|初始化 idle 任务|

📍 调用层次：

```
sched_init()
 ├─ init_sched_fair_class()
 ├─ init_idle()
 └─ init_rt_class()
```

🎯 目标：了解 CFS（完全公平调度器）的框架结构。

---

## **🧩 第五阶段：**

## **rest_init()**

##  **→ 内核线程启动**

```
static noinline void __ref rest_init(void)
{
    kernel_thread(kernel_init, NULL, CLONE_FS);
    pid = kernel_thread(kthreadd, NULL, CLONE_FS);
    init_idle();
    schedule();
}
```

|**函数**|**路径**|**说明**|
|---|---|---|
|kernel_thread()|kernel/fork.c|创建内核线程|
|kernel_init()|init/main.c|初始化 init 进程（PID 1）|
|kthreadd()|kernel/kthread.c|内核线程守护进程（PID 2）|

🎯 目标：理解 Linux 从单线程进入多任务状态的关键节点。

---

## **🔄 第六阶段：**

## **kernel_init()**

##  **→ 用户空间切换**

|**函数**|**文件**|**学习点**|
|---|---|---|
|kernel_init()|init/main.c|加载驱动、挂载根文件系统|
|init_post()|init/main.c|执行 /sbin/init、/bin/sh 等用户进程|
|run_init_process()|init/main.c|第一个用户空间进程执行点|

🎯 目标：

从这里，Linux 完成了“自举（bootstrapping）”的最后阶段，进入用户空间。

---

# **🧩 全调用关系图（核心路径）**

```
_start                  [arch/x86/kernel/head_64.S]
 └─ x86_64_start_kernel()
     └─ start_kernel()  [init/main.c]
         ├─ setup_arch()
         ├─ mm_init()
         │   ├─ kmem_cache_init()
         │   └─ mem_init()
         ├─ sched_init()
         │   └─ init_sched_fair_class()
         └─ rest_init()
             ├─ kernel_thread(kernel_init)
             │   ├─ do_basic_setup()
             │   ├─ driver_init()
             │   └─ run_init_process()
             └─ kernel_thread(kthreadd)
```

---

# **📚 推荐学习顺序（对照 ULK 章节）**

|**阶段**|**ULK 章节**|**现代源码入口**|**学习重点**|
|---|---|---|---|
|1️⃣ 启动阶段|第 2 章|init/main.c, arch/x86/kernel/head_64.S|内核初始化框架|
|2️⃣ 内存管理|第 8–9 章|mm/init.c, mm/page_alloc.c|物理页与虚拟内存|
|3️⃣ 调度器|第 7 章|kernel/sched/core.c|CFS 调度机制|
|4️⃣ 进程创建|第 3 章|kernel/fork.c|copy_process() 流程|
|5️⃣ 系统调用|第 10 章|arch/x86/entry/syscalls/syscall_64.tbl|syscall 表结构|
|6️⃣ 进程切换|第 6 章|__switch_to()|任务上下文切换|

---

# **💡 配合工具**

|**工具**|**用途**|
|---|---|
|[Elixir Bootlin](https://elixir.bootlin.com/linux/latest/source)|在线浏览 Linux 源码，按函数跳转|
|cscope / ctags|本地函数跳转索引|
|make ARCH=x86_64 tags|生成源码索引|
|qemu-system-x86_64|可在 macOS 上模拟原生启动调试内核|

---

## **✅ 总结**

- 你的 OrbStack 内核版本（6.15.11）完全可以作为学习环境。
    
- 按上述路径看 start_kernel() → rest_init() → kernel_init()，能贯穿整个内核生命周期。
    
- 建议你在 Bootlin 上边看书、边展开对应函数，效果极佳。
    

---

是否希望我下一步帮你生成

🧩 **“函数调用关系可视图（Mermaid 图格式）”**，

可直接在 Markdown / Obsidian / VSCode 中可视化？