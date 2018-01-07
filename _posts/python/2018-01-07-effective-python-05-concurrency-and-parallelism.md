---
layout: post
title: 编写高质量的python代码 -- 05. 并发与并行
keywords: python
category: python
tags: [python]
---

- 并发(concurrency)的意思是说，计算机似乎(seemingly)是在同一时间做着很多不同的事。
- 并行(parallelism)的意思是说，计算机确实(acutally)是在同一时间做着很多不同的事。

在同一个程序内部，并发是一种工具，它使程序员可以更加方便地解决特定类型的问题。在并发程序中，不同的执行路径都能够以某种方式向前推进，而这种方式，使人感觉那些路径可以在同一时间独立运行。

并行与并发的关键区别，就在于能不能提速。


### 36. 用subproccess 模块来管理子进程

python演化出了许多中运行子进程的方式，其中包括popen、popen2和os.exec* 等。然而，对于当今的python来说，最好用且最简单的子进程管理模块，应该是内置的 subprocess 模块。

```python
# 用subprocess 模块运行子进程比较简单。下面代码用Popen构造器来启动进程。然后用communicate方法读取子进程的输出信息，并等待其终止

proc = subprocess.Popen(
    ['echo', 'Hello from the child!'],
    stdout=subprocess.PIPE)
out, err = proc.communicate()
print(out.decode('utf-8'))

# 子进程可将独立于父进程而运行，这里的父进程，指的是python解释器。在下面的程序，可以一边定期查询子进程的状态，一边处理其它事务
from time import sleep, time
proc = subprocess.Popen(['sleep', '0.3'])
while proc.poll() is None:
    print('Working...')
    # Some time consuming work here
    sleep(0.2)

print('Exit status', proc.poll())

# 把子进程从父进程中剥离，意味着父进程可以随意运行很多条平行的子进程。为了实现这一点，我们可以把所有的子进程都启动起来
def run_sleep(period):
    proc = subprocess.Popen(['sleep', str(period)])
    return proc

start = time()
procs = []
for _ in range(10):
    proc = run_sleep(0.1)
    procs.append(proc)

# 通过communicate 方法，等待这些子进程完成其I/O工作并终结
for proc in procs:
    proc.communicate()
end = time()
print('Finished in %.3f seconds' % (end - start))
>>> 
Finished in 0.134 seconds
# 假如这些子进程逐个运行，而不是平行运行，那么总的延迟时间就会达到1s，而不像本例，只用了0.1s左右就运行完毕
```

- 可以用subprocess 模块运行子进程，并管理其输入流与输出流
- python解释器能够平行地运行多条子进程，这使得开发者可以充分利用CPU的处理能力
- 可以给communicate 方法传入timeout 参数，以避免子进程死锁或失去响应(hanging ，挂起)。timeout 参数尽在python3.3及以后版本中有效。针对早起的python版本来说，我们需要使用内置的select模块来处理proc.stdin、proc.stdout和proc.stderr,以确保I/O操作的超时机制能够生效


### 37. 可以用线程来执行阻塞式I/O，但不要用它做平行计算

- 因为受到全局解释器锁(GIL)的限制，所有多条python线程不能在多个cpu核心上面平行地执行字节码
- 尽管受制于GIL，但是python的多线程功能依然很有用，它可以轻松地模拟出同一时刻执行多项任务的效果
- 通过python线程，我们可以平行地执行多个系统调用，这使得程序能够在执行阻塞式I/O操作的同时，执行一些运算操作

```python
def factorize(number):
    """因式分解函数"""
    for i in range(1, number + 1):
        if number % i == 0:
            yield i

from time import time
numbers = [2139079, 1214759, 1516637, 1852285]
start = time()
for number in numbers:
    list(factorize(number))
end = time()
print('Took %.3f seconds' % (end - start))
# 在我的电脑上运行时间如下
# Took 0.628 seconds 
```

待用多线程的方式进行密集型计算代码如下

```python
from threading import Thread

class FactorizeThread(Thread):
    def __init__(self, number):
        super().__init__()
        self.number = number

    def run(self):
        self.factors = list(factorize(self.number))

start = time()
threads = []
for number in numbers:
    thread = FactorizeThread(number)
    thread.start()
    threads.append(thread)


for thread in threads:
    thread.join()
end = time()
print('Took %.3f seconds' % (end - start))

# 采用多线程运行时间如下
# Took 0.682 seconds
```

我们会发现使用多线程的话费时间比单线程耗时更久。python的多线程程序受到GIL的影响。

但是多线程在处理阻塞式的I/O操作。


### 38. 在线程中使用Lock来放置数据竞争

全局解释器锁(GIL),并不会保护开发者自己编写的代码。同一时刻固然只能有一个python线程得以执行，但是当这个线程正在操作某个数据结构时，其他线程可能会打断它，也就是说，python解释器在执行两个联系的字节码指令时，其他线程可能会中途突然插进来。

如下面的程序，假设要从一整套传观器网络中对光照级别进行采样，那么采集到的样本总量，就会随着程序的运行不断增加，于是，新建名为Counter的类，专门用来表示样本数量。

```python
class Counter(object):
    def __init__(self):
        self.count = 0

    def increment(self, offset):
        self.count += offset

# 在查询传观器读数的过程中，会发生阻塞式I/O操作，所有，我们要给每个传感器分配它自己的工作线程(worker thread).每采集到一次读数，工作线程就会给Counter 对象的value值加1，然后继续采集，直到完成全部的采样操作

def worker(sensor_index, how_many, counter):
    # I have a barrier in here so the workers synchronize
    # when they start counting, otherwise it's hard to get a race
    # because the overhead of starting a thread is high.
    BARRIER.wait()
    for _ in range(how_many):
        # Read from the sensor
        counter.increment(1)

# 为每个传感器启动一条工作线程
from threading import Barrier, Thread
BARRIER = Barrier(5)
def run_threads(func, how_many, counter):
    threads = []
    for i in range(5):
        args = (i, how_many, counter)
        thread = Thread(target=func, args=args)
        threads.append(thread)
        thread.start()
    for thread in threads:
        thread.join()


how_many = 10**5
counter = Counter()
run_threads(worker, how_many, counter)
print('Counter should be %d, found %d' % (5 * how_many, counter.count))
# 输出的结果如下：
# Counter should be 500000, found 249414（该值和我们期待的500000相差很大）
```

为了保证所有的线程都能够公平地执行，python解释器会给每个线程分配大致相等的处理器时间。而为了达到这样的分配策略，python系统可能当某个线程在执行的时候，将其暂停(suspend),然后使另外一个线程继续往下执行。问题就在于，开发者无法准确地获知python系统会在何时暂停这些线程。有一些操作，看上去好像是原子操作(atomic operation),但python系统依然有可能在线程执行到一半的时候将其暂停。于是就发生了上面的情况。

Counter 对象的increment方法看上去很简单。 `counter.count += offset`.但是在对象的属性上面进行 +=操作符，实际上会令python于幕后执行三项独立的操作。上面那条语句，可以拆分成下面这三条语句

```python
value = getatter(counter, 'count')
result = value + offset
setattr(counter, 'count', result)
```

为了实现自增，python线程必须依次执行上述三个操作，而在任意两个操作之间，都有可能发生线程切换。这种交错执行的方式，可能会令线程把旧的value设置给Counter,从而使程序的运行结果出现问题。已 A 和 B 两个线程，来演示这种情况。

```python
# Running in Thread A
value_a = getattr(counter, 'count')
# Context switch to Thread B
value_b = getattr(counter, 'count')
result_b = value_b + 1
setattr(counter, 'count', result_b)
# Context switch back to Thread A
result_a = value_a + 1
setattr(counter, 'count', result_a)
```

在上例中，线程A执行到一半的时候，线程B插了进来，等线程B执行完整个递增操作之后，线程A又继续执行，于是，线程A就把线程B刚才对计数器所做的递增效果，完全抹去了（这样线程叫做线程A踩踏线程B）。传感器采用程序所统计到的样本总数之所以会出错，正式这个原因。

为了防止诸如此类的数据竞争行为，python在内置的threading模块里提供了一套健壮的工具，就是Lock类，该类相当于互斥锁。

```python
from threading import Lock

class LockingCounter(object):
    def __init__(self):
        self.lock = Lock()
        self.count = 0

    def increment(self, offset):
        with self.lock:
            self.count += offset


BARRIER = Barrier(5)
counter = LockingCounter()
run_threads(worker, how_many, counter)
print('Counter should be %d, found %d' %(5 * how_many, counter.count))
>>>Counter should be 500000, found 500000
# 输出的结果符合预期

```

- python确实有全局解释器锁，但是在编写自己的程序时，依然要设法防止多个线程争用同一份数据
- 如果在不加锁的前提下，运行多条线程修改同一个对象，那么程序的数据结构可能会遭到破坏
- 在python内置的threading模块中，有个名叫Lock的类，它用标准的方式实现了互斥锁


### 39. 用Queue来协调各线程之间的工作

- 管线是一种优秀的任务处理方式，它可以把处理流程划分为若干阶段，并使用多条python线程来同时执行这些任务
- 构建并发式的管线时，要注意许多问题，其中包括：如何防止某个阶段陷入持续等待的状态之中、如何停止工作线程，以及如何放置内存膨胀等。
- Queue类所提供的机制，可以彻底解决上述问题，它具备阻塞式的队列操作、能够制定缓冲区尺寸，而且还支持join方法，这使得开发者可以构建出健壮的管线

```python
# 自己实现一套生产消费队列

import time
from threading import Lock
from collections import deque
from threading import Thread
from time import sleep

def download(item):
    return item

def resize(item):
    return item

def upload(item):
    return item

class MyQueue(object):
    def __init__(self):
        self.items = deque()
        self.lock = Lock()

    def put(self, item):
        with self.lock:
            self.items.append(item)

    def get(self):
        with self.lock:
            return self.items.popleft()

class Worker(Thread):
    def __init__(self, func, in_queue, out_queue):
        super().__init__()
        self.func = func
        self.in_queue = in_queue
        self.out_queue = out_queue
        self.polled_count = 0
        self.work_done = 0

    def run(self):
        while True:
            self.polled_count += 1
            try:
                item = self.in_queue.get()
            except IndexError:
                sleep(0.01)  # No work to do
            except AttributeError:
                # The magic exit signal
                return
            else:
                result = self.func(item)
                self.out_queue.put(result)
                self.work_done += 1

download_queue = MyQueue()
resize_queue = MyQueue()
upload_queue = MyQueue()
done_queue = MyQueue()
threads = [
    Worker(download, download_queue, resize_queue),
    Worker(resize, resize_queue, upload_queue),
    Worker(upload, upload_queue, done_queue),
]

for thread in threads:
    thread.start()
for _ in range(1000):
    download_queue.put(object())
    
while len(done_queue.items) < 1000:
    # Do something useful while waiting
    time.sleep(0.1)
# Stop all the threads by causing an exception in their
# run methods.
for thread in threads:
    thread.in_queue = None

processed = len(done_queue.items)
polled = sum(t.polled_count for t in threads)
print('Processed', processed, 'items after polling', polled, 'times')
>>>Processed 1000 items after polling 3027 times.
# 输入的 polled=3027的值不固定，可能是其他值
```

自己实现的生产消费队列有以下几个问题

1. 定义的run方法中用来捕获IndexError 异常的，会运行很多次
2. 为了判断所有的任务是否都彻底处理完毕，我们需要再编写一下循环，持续判断`done_queue`队列中的任务数量
3. Worker线程的run方法，会一直执行循环，即便到了应该退出的时候，我们也没有办法通知Worker线程停止这一循环
4. 如果管线的某个阶段发生迟滞，那么随时都可能导致程序崩溃。若第一阶段的处理速度很快，而第二阶段的处理速度较慢，则连接这两个阶段的那个队列的容量就会不断增大。第二极端始终没有办法跟上第一阶段的节奏。这种现象持续一段时间后，程序就会因为收到大量的输入数据而耗尽内存，进而崩溃

上面这些问题并不能证明管线是一种糟糕的设计方式，它们只是提醒大家：想要自己打造一种良好的生产者-消费者队列，是非常困难的。


##### 用Queue 类来弥补自编队列的缺陷

内置的queue模块中，有个名叫Queue的类，该类能够彻底解决上面提出的问题。Queue类使得工作线程无需在频繁的查询输入队列的状态，因为它的get方法会持续阻塞，直到有新的数据加入。

```python
from threading import Thread
from queue import Queue


class ClosableQueue(Queue):
    SENTINEL = object() # 添加这个特殊的对象，表明该对象之后再也没有其他任务需要处理了

    def close(self):
        self.put(self.SENTINEL)

    def __iter__(self):
        """定义迭代器，此迭代器在发现特殊对象时，会停止迭代。
        __iter__方法也会在适当的时机调用 task_done,使得开发者可以追踪队列的工作进度"""
        while True:
            item = self.get()
            try:
                if item is self.SENTINEL:
                    return  # Cause the thread to exit
                yield item
            finally:
                self.task_done()


class StoppableWorker(Thread):
    def __init__(self, func, in_queue, out_queue):
        super().__init__()
        self.func = func
        self.in_queue = in_queue
        self.out_queue = out_queue

    def run(self):
        for item in self.in_queue:
            result = self.func(item)
            self.out_queue.put(result)

def download(item):
    return item

def resize(item):
    return item

def upload(item):
    return item

download_queue = ClosableQueue()
resize_queue = ClosableQueue()
upload_queue = ClosableQueue()
done_queue = ClosableQueue()
threads = [
    StoppableWorker(download, download_queue, resize_queue),
    StoppableWorker(resize, resize_queue, upload_queue),
    StoppableWorker(upload, upload_queue, done_queue),
]

for thread in threads:
    thread.start()
for _ in range(1000):
    download_queue.put(object())
download_queue.close()

download_queue.join()
resize_queue.close()
resize_queue.join()
upload_queue.close()
upload_queue.join()
print(done_queue.qsize(), 'items finished')
>>> 1000 items finished
```

### 40. 考虑用携程来并发地运行多个函数

线程三个显著缺点：

1. 为了确保数据安全，必须使用特殊的工具来协调这些线程(38和39条)。这使得多线程的代码要比但现场的过程式代码更加难懂。这种复杂的多线程代码，会主键令程序变得难于扩展和维护
2. 线程需要占用大量内存，每个正在执行的线程，大约占8MB内存。
3. 线程启动时的开销比较大。如果程序不停地依靠创建新线程来同时执行多个函数，并等待这些线程结束，那么使用线程所引发的开销，就会拖慢整个程序的速度

python的协程(coroutine)可以避免上述问题，它使得python程序看上去好像是在同时运行多个函数。协程的实现方式，实际上是对生成器（16条）的一种扩展。启动生成器协程所需要的开销，与调用函数的开销相仿。处于活动状态的协程在其耗尽之前，只会占用到不到1kb的内存。

携程的工作原理是这样的：每当生成器函数执行yield表达式的时候，消耗生成器的那段代码，就通过send方法给生成器回传一个值。而生成器在收到了经由send函数所传进来的这个值之后，会将其视为yield表达式的执行结果。

```python
def my_coroutine():
    while True:
        received = yield
        print('Received:', received)

it = my_coroutine()
next(it)
it.send('First')
it.send('Second')
>>>Received: First
>>>Received: Second
```

编写一个生成器协程，并给它依次发送许多数值，而该协程每收到一个数值，就会给出当前所统计到的最小值。

生成器函数似乎会一直运行下去，每次在它上面调用send之后，都会产生新的值。与线程类似，协程也是独立的函数，它可以消耗由外部环境传进来的输入数据，并产生相应的输出结果。但与线程不同的是，协程会在生成器函数中的每个yield表达式哪里暂停，等到外界再次调用send方法之后，它才会继续执行到下一个yield表达式。

```python
def minimize():
    current = yield
    while True:
        value = yield current
        current = min(value, current)


it = minimize()
next(it)            # Prime the generator
print(it.send(10))
print(it.send(4))
print(it.send(22))
print(it.send(-1))
```

- 协程提供了一种有效的方式，令程序看上去好像能够同时运行大量函数
- 对于生成器内的yield表达式来说，外部代码通过 send方法传给生成器的那个纸，就是该表达式所具备的值
- 协程是一种强大的工具，它可以把程序的核心逻辑，与程序同外部环境交互时所用的代码相分离
- python2不支持yield from 表达式，也不支持从生成器内通过return语句向外界返回某个值


### 41. 考虑用concurrent.futures 来实现真正的平行计算

python中把代码的总计算量分配到多个独立的任务之中，并在多个CUP核心上面同时运行任务呢？

可以通过内置的 conrurrent.futures 模块，来利用另外一个名叫 multiprocessing 的内置模块，从而实现这种需求。该做法会以子进程的形式，平行地运行多个解释器，从而令python程序能够利用多核心CUP来提升执行速度。由于子进程与主解释器相分离，所以他们的全局解释其锁是互相独立的。每个子进程都可以完整地利用一个CPU内核，而且这些子进程，都与主进程之间有着联系，通过这种联系渠道，子进程可以接收主进程发过来的指令，并把计算结果返回给主进程。

例如：我们现在要编写一个运算量很大的python程序，并且要在该程序中充分利用CPU的多个内核。

```python
from time import time

def gcd(pair):
    a, b = pair
    low = min(a, b)
    for i in range(low, 0, -1):
        if a % i == 0 and b % i == 0:
            return i

numbers = [(1963309, 2265973), (2030677, 3814172),
           (1551645, 2229620), (2039045, 2020802)]
           
start = time()
results = list(map(gcd, numbers))
end = time()
print('Took %.3f seconds' % (end - start))
>>> Took 0.693 seconds
```

采用python多线程来改善上述程序，没有什么效果，因为全局解释器锁(GIL)使得python无法在多个CPU核心上面平行地运行这些代码。借助 concurrent.futures 模块来执行与刚才相同的运行，它使用ThreadPoolExecutor类及8个工作线程来实现（max_workers表示工作线程的数量，此参数应该与CPU的核心数同）

```python
from multiprocessing import cpu_count
from concurrent.futures import ThreadPoolExecutor

start = time()
pool = ThreadPoolExecutor(max_workers=cpu_count())
results = list(pool.map(gcd, numbers))
end = time()
print('Took %.3f seconds' % (end - start))
>>> Took 0.761 seconds
# 耗时比单线程更久，是因为在创建线程有一定的开销
```

把上面的代码只需修改一行即可利用到CPU的核数进行平行计算

```python
from multiprocessing import cpu_count
from concurrent.futures import ProcessPoolExecutor

start = time()
pool = ProcessPoolExecutor(max_workers=cpu_count())
results = list(pool.map(gcd, numbers))
end = time()
print('Took %.3f seconds' % (end - start))
>>> Took 0.209 seconds
```

- 把引发CPU性能瓶颈的那部分代码，用C语言扩展模块来改写，即可在尽量发挥python性能的前提下，有效提升程序的执行速度。但是这样做的工作量比较大，而且可能会引入bug
- multiprocessing 模块提供了一些强大的工具。对于某些类型的任务来说，开发者只需编写少量代码，即可实现平行计算
- 若想利用强大的multiprocessing模块，做恰当的做饭，是通过内置的concurrent.futures模块及其ProcessPoolExecutor类来使用它
- multiprocessing 模块所提供的那些高级功能，都特别复杂，所以开发者尽量不要直接使用它们
