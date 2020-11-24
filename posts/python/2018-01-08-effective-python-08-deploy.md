---
layout: post
title: 编写高质量的python代码 -- 08. 部署
keywords: python
category: python
tags:
  - python
---

# 2018-01-08-effective-python-08-deploy

## 54. 考虑用模块级别的代码来配置不同的部署环境

* 程序通常需要运行在各种不同的部署环境之中，而这些环境所需要的先决条件及配置信息，也都互相不同
* 我们可以在模块范围内，编写普通的python语句，以便根据不同的部署环境，来定制本模块的内容
* 我们可以根据外部条件来决定模块的内容，例如：通过sys和os模块来查询宿主操作系统的特性，并以此来定义本模块中的相关结构

## 55. 通过repr字符串来输出调试信息

* 针对内置的python类型来调用print函数，会根据该值打印出一条易于阅读的字符串，这个自测隐藏了类型信息
* 只对内置的python类型来调用repr函数，会根据该值返回一条可供打印的字符串。把这个repr字符串传给内置的eval函数，就可以将其还原为初始的那个值
* 在格式化字符串里使用 %s, 能够产生于str函数的返回值相仿的易读字符串，而在格式化字符串里使用 %r,则能够产生与 repr函数的返回值相仿的可打印字符串
* 可以在类中编写 `__repr__`方法，用自定义的方式来提供一中可打印的字符串，并在其中给出更为详细的调试信息
* 可以在任意对象上面查询 `__dict__`属性，以观察其内部信息

```python
class OpaqueClass(object):
    def __init__(self, x, y):
        self.x = x
        self.y = y

class BetterClass(object):
    def __init__(self, x, y):
        self.x = 1
        self.y = 2
    def __repr__(self):
        return 'BetterClass(%d, %d)' % (self.x, self.y)

obj = BetterClass(1, 2)
print(obj)
>>>BetterClass(1, 2)

obj = OpaqueClass(4, 5)
print(obj.__dict__)
>>>{'x': 4, 'y': 5}
```

## 56. 用unittest来测试全部代码

* 编写测试
* 内置的unittest模块提供了测试者所需要的很多功能，我们可以借助这些机制写出好的测试
* 我们可以在TestCase子类中，为每一个需要测试的行为，定义对应的测试方法。TestCase子类里的测试方法，其名称必须以test开头
* 我们必须同时编写单元测试和继承测试，前者用来独立检验程序中的每个功能，而后者则用来校验模块之间的交互行为

```python
# utils.py
def to_str(data):
    if isinstance(data, str):
        return data
    elif isinstance(data, bytes):
        return data.decode('utf-8')
    else:
        raise TypeError('Must supply str or bytes, found: %r' % data)

# utils_test.py
from unittest import TestCase, main
from utils import to_str

class UtilsTestCase(TestCase):
    def test_to_str_bytes(self):
        self.assertEqual('hello', to_str(b'hello'))

    def test_to_str_str(self):
        self.assertEqual('hello', to_str('hello'))

    def test_to_str_bad(self):
        self.assertRaises(TypeError, to_str, object())

if __name__ == '__main__':
    main()
```

## 57. 考虑用 pdb 实现交互调试

* 我们可以修改python程序，在想要调试的代码上方直接加入 `import pdb;pdb.set_trace()`语句，以触发互动调试器
* python调试器也是一个完整的python提示符界面，我们可以检查并修改受测程序的状态
* 我们可以在pdb提示符中输入命令，以便精确地控制程序的执行流程，这些命令是的我们能够交替地查看程序状态并继续向下运行程序

[pdb使用详细参考官网文档](https://docs.python.org/3.6/library/pdb.html)

## 58. 先分析性能，然后在优化

应对性能问题的最佳方式，是在优化程序之前先分析其性能，而不是靠直觉去判断。python提供了内置的性能分析工具（profiler）,它可以计算出程序中某个部分的执行时间，在总体执行时间中所占的比率。通过这些数据，可以找到最为显著的性能瓶颈，并把注意力放在优化这部分代码上面，而不要子啊不影响速度的那些地方浪费精力。

例如：我们想查明陈旭中某个算法卫生么运行得比较慢。下面第你故意的这个函数，采用插入排序法来排列一组数据。

```python
def insertion_sort(data):
    result = []
    for value in data:
        insert_value(result, value)
    return result

# 下面定义的这个insert_value 函数，要对外界输入的array序列进行线性扫描，以确定插入点。因此效率是非常低的
def insert_value(array, value):
    for i, existing in enumerate(array):
        if existing > value:
            array.insert(i, value)
            return
    array.append(value)

# 为了分析 insertion_sort和 insert_value 的效率，创建一组随机数字，并定义test函数，以便将该函数传给profiler

from random import randint

max_size = 10**4
data = [randint(0, max_size) for _ in range(max_size) ]
test = lambda: insertion_sort(data)

# 示例化 cProfile模块中的Profile对象，并通过runcall方法来运行刚才定义的test函数
from cProfile import Profile

profiler = Profile()
profiler.runcall(test)

# test函数运行完毕之后，我们采用内置的pstats模块和模块中的Stats类，来剖析由Profile对象所收集大的性能统计数据。Stats对象提供了各种方法，我们可以用这些方法对性能分析数据进行遴选及排序，以便把自己所关注的那部分信息单独列出来。

import sys
from pstats import Stats

stats = Stats(profiler)
stats = Stats(profiler, stream=STDOUT)
stats.strip_dirs()
stats.sort_stats('cumulative')
stats.print_stats()
```

上面的代码会输出一张表格，其中的信息是按照函数来分组的。表格中的数据，是在profiler处于激活状态的时候统计出来的，也就是说，这些时间数据，都是在执行刚才那个runcall方法的过程中统计出来的。

```text
      20003 function calls in 1.833 seconds

   Ordered by: cumulative time

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
        1    0.000    0.000    1.833    1.833 <ipython-input-54-00b642c16395>:21(<lambda>)
        1    0.003    0.003    1.833    1.833 <ipython-input-54-00b642c16395>:1(insertion_sort)
    10000    1.815    0.000    1.830    0.000 <ipython-input-54-00b642c16395>:8(insert_value)
     9994    0.015    0.000    0.015    0.000 {method 'insert' of 'list' objects}
        6    0.000    0.000    0.000    0.000 {method 'append' of 'list' objects}
        1    0.000    0.000    0.000    0.000 {method 'disable' of '_lsprof.Profiler' objects}
```

下面简述性能统计表中每一列的含义：

* ncalls 该函数在性能分析期间的调用次数
* tottime 执行该函数所花的总秒数。本函数因调用其他函数所耗费的时间，不计入在内
* tottime percall: 每次调用该函数所花的平均秒数。本函数因调用其他函数所耗费的时间，不计入在内。此值等于 tottime 与 ncalls 相除的商
* cumtime 执行该函数及其中的全部函数调用操作，所花的总秒数
* cumtime  percall: 每次执行该函数及其中的全部函数调用操作，所花的平均秒数。此值等于 cumtime 与 ncalls 相除的商

通过profiler 给出的统计表可以看到，在 cumulative time\(累计时间\)一栏中，insert\_value 函数所占用的CPU份额是最大的。于是我们改用内置的bisect模块来重新定义此函数。

```text
In [55]: from bisect import bisect_left
    ...:
    ...: def insert_value(array, value):
    ...:     i = bisect_left(array, value)
    ...:     array.insert(i, value)
    ...:
    ...: profiler = Profile()
    ...: profiler.runcall(test)
    ...: stats = Stats(profiler, stream=STDOUT)
    ...: stats.strip_dirs()
    ...: stats.sort_stats('cumulative')
    ...: stats.print_stats()
    ...:
         30003 function calls in 0.027 seconds

   Ordered by: cumulative time

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
        1    0.000    0.000    0.027    0.027 <ipython-input-54-00b642c16395>:21(<lambda>)
        1    0.002    0.002    0.027    0.027 <ipython-input-54-00b642c16395>:1(insertion_sort)
    10000    0.004    0.000    0.024    0.000 <ipython-input-55-07e324b0ee63>:3(insert_value)
    10000    0.014    0.000    0.014    0.000 {method 'insert' of 'list' objects}
    10000    0.006    0.000    0.006    0.000 {built-in method _bisect.bisect_left}
        1    0.000    0.000    0.000    0.000 {method 'disable' of '_lsprof.Profiler' objects}
```

所耗费的时间几乎是原来的百分之一。

python的profiler提供了一种方式，可以在性能分析数据中列出每个函数的调用者，使我们可以据此看出该函数所耗费的执行时间，究竟是由哪些调用者所分别引发的

```text
stats.print_callers()

In [56]: stats.print_callers()
   Ordered by: cumulative time

Function                                           was called by...
                                                       ncalls  tottime  cumtime
<ipython-input-54-00b642c16395>:21(<lambda>)       <-
<ipython-input-54-00b642c16395>:1(insertion_sort)  <-       1    0.002    0.027  <ipython-input-54-00b642c16395>:21(<lambda>)
<ipython-input-55-07e324b0ee63>:3(insert_value)    <-   10000    0.004    0.024  <ipython-input-54-00b642c16395>:1(insertion_sort)
{method 'insert' of 'list' objects}                <-   10000    0.014    0.014  <ipython-input-55-07e324b0ee63>:3(insert_value)
{built-in method _bisect.bisect_left}              <-   10000    0.006    0.006  <ipython-input-55-07e324b0ee63>:3(insert_value)
{method 'disable' of '_lsprof.Profiler' objects}   <-


Out[56]: <pstats.Stats at 0x112799898>
```

左边列出的是受测函数，右边列出的是该函数的调用者。

* 优化python程序之前，一定要先分析其性能，因为python程序的性能瓶颈通常很难直接观察出来
* 做性能分析时，应该使用 cProfile模块，而不要使用profile模块，因为前者能够给出更为精确的性能分析数据
* 我们可以通过Profile对象的runcall方法来分析程序性能，该方法能够提供性能分析所需的全部信息，它会按照树状的函数调用关系，来单独地统计每个函数的性能
* 我们可以用Stats对象来筛选性能分析数据，并打印出我们所需要的那一部分，以便据此了解程序的性能

## 59. 用 tracemalloc 来掌握内存的使用及泄露情况

* python程序的内存使用情况和内存泄露情况是很难判断的。
* 我们虽然可以通过gc模块来了解程序中的对象，但是并不能由此看出这些对象究竟是如何分配出来的。
* 内置的tracemalloc模块提供了很多强大的工具，使得我们可以找出导致内存使用量增大的根源
* 只有python3.4及后续版本，才支持tracemalloc 模块

```python
# waste_memory.py
import os
import hashlib

class MyObject(object):
    def __init__(self):
        self.x = os.urandom(100)
        self.y = hashlib.sha1(self.x).hexdigest()

def get_data():
    values = []
    for _ in range(100):
        obj = MyObject()
        values.append(obj)
    return values

def run():
    deep_values = []
    for _ in range(100):
        deep_values.append(get_data())
    return deep_values
```

使用tracemalloc 打印出导致内存用量增大的前三个对象。

```python
# top_n.py
import tracemalloc
tracemalloc.start(10)  # Save up to 10 stack frames

time1 = tracemalloc.take_snapshot()
import waste_memory
x = waste_memory.run()
time2 = tracemalloc.take_snapshot()

stats = time2.compare_to(time1, 'lineno')
for stat in stats[:3]:
    print(stat)
```

tracemalloc 模块也可以打印出python系统在执行每一个分配内存操作时，所具备的完整堆栈信息\(full stack trace\),打印的最大栈桢数量，由传给start函数的参数来决定。下面找到程序中最小号内存的那个内存分配操作，并将该操作的堆栈信息打印出来。

```python
# with_trace.py
import tracemalloc
tracemalloc.start(10)

time1 = tracemalloc.take_snapshot()
import waste_memory
x = waste_memory.run()
time2 = tracemalloc.take_snapshot()
stats = time2.compare_to(time1, 'traceback')
top = stats[0]
print('\n'.join(top.traceback.format()))
```

如果程序中有多个地方都调用了同一个函数，那么通过上述方式就可以更好地看出，究竟是那一行调用代码导致内存占用量变大的。

python2虽然没有内置的这个tracemalloc模块，但是有很多开源软件包\(如heapy等\)也可以追踪内存用量，然而它们在功能上面，与tracemalloc并不是完全相同的。

