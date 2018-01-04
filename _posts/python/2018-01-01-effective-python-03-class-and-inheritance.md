---
layout: post
title: 编写高质量的python代码 -- 类与继承
keywords: python
category: python
tags: [python]
---

### 22. 尽量用辅助类来维护程序的状态，而不要用字典和元组
 
- 不要使用包含其它字典的字典，也不要使用过长的元组
- 如果容器中包含简单又不可变的数据，那么可以先使用 namedtuple来表示，待稍后有需要时，再修改为完整的类
- 保存内部状态的字典如果变得比较复杂，那就应该把这些代码拆解外多个辅助类

```python
# 要把许多学生的成绩记录下来，但这些学生的名字我们事先不知道。于是定义了一个类，把学生名字全部保存在字典里面，这样就不用把每个学生表示成对象了，也无需在每个对象中预设一个存在其名字的属性

class SimpleGradebook(object):
    def __init__(self):
        self._grades = {}
    
    def add_student(self, name):
        self._grades[name] = []
    
    def report_grade(self, name, score):
        self._grades[name].append(score)
        
    def average_grade(self, name):
        grades = self._grades[name]
        return sum(grades) / len(grades)

```

### 23. 简单的接口应该接受函数，而不是类的实例

- 对于连接各种python组件的简单接口来说，通常应该给其直接传入函数，而不是先定义某个类，然后再传入该类的实例
- python中的函数和方法都可以像一级类那样引用，因此，他们与其它类型的对象一样，也能够放在表达式里面
- 通过名为 `__call__` 的特殊方法，可以使类的示例能够像普通的python函数那样得到调用
- 如果要用函数保存状态，那就应该定义新的类，并令其实现 `__call__`方法，而不要定义带状态的闭包

```python
# Example 1
names = ['Socrates', 'Archimedes', 'Plato', 'Aristotle']
names.sort(key=lambda x: len(x))
print(names)


# Example 2
from collections import defaultdict

def log_missing():
    print('Key added')
    return 0


# Example 3
current = {'green': 12, 'blue': 3}
increments = [
    ('red', 5),
    ('blue', 17),
    ('orange', 9),
]
result = defaultdict(log_missing, current)
print('Before:', dict(result))
for key, amount in increments:
    result[key] += amount
print('After: ', dict(result))


# Example 4
# 现在要给defaultdict传入一个产生默认值的挂钩，并令其统计出该字典一共遇到了多少
# 缺失的键。一种实现方式是使用带状态的闭包。下面定义的辅助函数就是使用这种闭包
# 作为产生默认值的挂钩函数
def increment_with_report(current, increments):
    added_count = 0

    def missing():
        nonlocal added_count  # Stateful closure
        added_count += 1
        return 0

    result = defaultdict(missing, current)
    for key, amount in increments:
        result[key] += amount

    return result, added_count


# Example 5
result, count = increment_with_report(current, increments)
assert count == 2
print(result)


# Example 6
# 把带状态的闭包函数用作挂钩有一个缺点，就是读起来要比无状态的函数难懂一些。还有个
# 办法，定义一个小型的类，把需要追踪的状态封装起来
class CountMissing(object):
    def __init__(self):
        self.added = 0

    def missing(self):
        self.added += 1
        return 0


# Example 7
counter = CountMissing()
result = defaultdict(counter.missing, current)  # Method reference
for key, amount in increments:
    result[key] += amount
assert counter.added == 2
print(result)


# Example 8
# 使用例7确实比闭包函数好点，但是我们依然不太容易理解CountMissing 的意图。CountMissing
# 对象由谁来构建？missing方法由谁来调用？该类以后是否需要添加新的公共方法？这些问题，都
# 必须等看过了defaultdict的用法之后，才能明白。 
# 为了解决这些问题，我们可以在代码中定义名为 __call__ 的特殊方法。该方法使相关对象能够
# 像函数那样得到调用。此外如果把这样的实例传给内置的callable函数，那么callable函数会返回True
class BetterCountMissing(object):
    def __init__(self):
        self.added = 0

    def __call__(self):
        self.added += 1
        return 0

counter = BetterCountMissing()
counter()
assert callable(counter)


# Example 9
counter = BetterCountMissing()
result = defaultdict(counter, current)  # Relies on __call__
for key, amount in increments:
    result[key] += amount
assert counter.added == 2
print(result)
```

### 24. 以 @classmethod 形式的多态去通用地构建对象

多态：使得继承体系中的多个类都能以各自所独有的方式来实现某个方法。这些类，都满足相同的接口或继承自相同的抽象类，但却有着各自不同的功能。

```python
# 实现MapReduce 的流程

import os
import random

from threading import Thread
from tempfile import TemporaryDirectory

class InputData(object):
    def read(self):
        raise NotImplementedError

class PathInputData(InputData):
    def __init__(self, path):
        super().__init__()
        self.path = path

    def read(self):
        return open(self.path).read()

class Worker(object):
    def __init__(self, input_data):
        self.input_data = input_data
        self.result = None

    def map(self):
        raise NotImplementedError

    def reduce(self, other):
        raise NotImplementedError

class LineCountWorker(Worker):
    def map(self):
        data = self.input_data.read()
        self.result = data.count('\n')

    def reduce(self, other):
        self.result += other.result

def generate_inputs(data_dir):
    for name in os.listdir(data_dir):
        yield PathInputData(os.path.join(data_dir, name))

def create_workers(input_list):
    workers = []
    for input_data in input_list:
        workers.append(LineCountWorker(input_data))
    return workers

def execute(workers):
    threads = [Thread(target=w.map) for w in workers]
    for thread in threads: thread.start()
    for thread in threads: thread.join()

    first, rest = workers[0], workers[1:]

    for worker in rest:
        first.reduce(worker)
    return first.result

def mapreduce(data_dir):
    inputs = generate_inputs(data_dir)
    workers = create_workers(inputs)
    return execute(workers)

def write_test_files(tmpdir):
    for i in range(100):
        with open(os.path.join(tmpdir, str(i)), 'w') as f:
            f.write('\n' * random.randint(0, 100))

with TemporaryDirectory() as tmpdir:
    write_test_files(tmpdir)
    result = mapreduce(tmpdir)

print('There are', result, 'lines')
```

上面的写法有个大问题，就是MapReduce函数不够通用。如果要编写其他的InputData或Worker子类，那就得重写`generate_inputs`、`create_workers` 和 `mapreduce`函数，以便与之匹配。

解决这个问题的最佳方案，是使用 @classmethod 形式的多态。这种多态形式，其实与InputData.read那样的实例方法多态非常相似，只不过它针对的是整个类，而不是从该类构建出来的对象。

```python
import os
import random

from threading import Thread
from tempfile import TemporaryDirectory

class GenericInputData(object):
    def read(self):
        raise NotImplementedError

    @classmethod
    def generate_inputs(cls, config):
        raise NotImplementedError

class PathInputData(GenericInputData):
    def __init__(self, path):
        super().__init__()
        self.path = path

    def read(self):
        return open(self.path).read()

    @classmethod
    def generate_inputs(cls, config):
        data_dir = config['data_dir']
        for name in os.listdir(data_dir):
            yield cls(os.path.join(data_dir, name))

class GenericWorker(object):
    def __init__(self, input_data):
        self.input_data = input_data
        self.result = None

    def map(self):
        raise NotImplementedError

    def reduce(self, other):
        raise NotImplementedError

    @classmethod
    def create_workers(cls, input_class, config):
        workers = []
        for input_data in input_class.generate_inputs(config):
            workers.append(cls(input_data))
        return workers

class LineCountWorker(GenericWorker):
    def map(self):
        data = self.input_data.read()
        self.result = data.count('\n')

    def reduce(self, other):
        self.result += other.result

def mapreduce(worker_class, input_class, config):
    workers = worker_class.create_workers(input_class, config)
    return execute(workers)

def write_test_files(tmpdir):
    for i in range(100):
        with open(os.path.join(tmpdir, str(i)), 'w') as f:
            f.write('\n' * random.randint(0, 100))
  
def execute(workers):
    threads = [Thread(target=w.map) for w in workers]
    for thread in threads: thread.start()
    for thread in threads: thread.join()

    first, rest = workers[0], workers[1:]

    for worker in rest:
        first.reduce(worker)
    return first.result
    
with TemporaryDirectory() as tmpdir:
    write_test_files(tmpdir)
    config = {'data_dir': tmpdir}
    result = mapreduce(LineCountWorker, PathInputData, config)
print('There are', result, 'lines')
```

### 25. 用 super 初始化父类

初始化父类的传统方式，是在子类里用子类实例直接调用父类的`__init__`方法。这种办法对于简单的继承体系是可行的，但是在多重继承的时候可能会产生无法预知的行为。所以初始化父类的时候直接使用 super() 。

钻石形继承体系：如果子类继承自两个单独的超类，而那两个超类又继承自同一个公共积类，那么久构成了钻石形继承体系。

python2.2 增加了内置的super函数，并且定义了方法解析顺序（method resolution order, MRO）。MRO以标准的流程来安排超类之间的初始化书序（例如，深度优先，从左到右），它也保证钻石顶部那个公共基类的 `__init__`方法只会运行一次。

程序运行的顺序会与类的MRO保持一致，这个MRO顺序可以通过名为 mro 的类方法来查询。

```python
from pprint import pprint
pprint(xxxClass.mro())
```

内置的super函数确实可以正常运行，但在python2中有两个问题需要注意
- super语句写起来有点麻烦。我们必须制定给当前所在的类和self对象，而且还要制定相关的方法名称(通常是 `__init__`)以及那个方法的参数。
- 调用super时，必须写出当前类的名称。由于我们以后可能会修改类体系，所以类的名称也可能变化，那时，必须修改每一条super调用语句才行

python3中则没有这些问题，因为它提供了一种不带参数的super调用方式，该方式的效果与用`__class__`和`self`来调用super形同。

```python
class MyBaseClass(object):
    def __init__(self, value):
        self.value = value
        
class Explicit(MyBaseClass):
    def __init__(self, value):
        super(__class__, self).__init__(value*2)

class Implicit(MyBaseClass):
    def __init__(self, value):
        super().__init__(value * 2)

assert Explicit(10).value ==Implicit(10).value
```

### 26. 只在使用 Mix-in(混合类) 组件制作工具类时进行多重继承

- 能用mix-in 组件实现的效果，就不要用多重继承来做
- 将各功能实现为可插拔的mix-in 组件，然后令相关的类继承自需要的那些组件，即可定制该类示例所应具备的行为
- 把简单的行为封装到mix-in组件里，然后就可以用多个mix-in组合出复杂的行为了

*没有具体应用到项目中，等有实际例子了再来补充* [参考](http://blog.hszofficial.site/TutorialForPython/%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E6%83%AF%E7%94%A8%E6%B3%95/%E5%A4%9A%E9%87%8D%E7%BB%A7%E6%89%BF%E5%92%8CMixin.html)


### 27. 多用 public 属性，少用 private 属性

- python编辑器无法严格保证private字段的私密性
- 不要盲目地将属性设置为private，而是应该从一开始就做好规划，并允许子类更多的访问超类的内部API
- 应该多用protected属性，并在文档中把这些字段的和利用法告诉子类的开发者，而不要视图用private属性来限制子类访问这些字段
- 只有当子类不受自己控制时，才可以考虑用private属性来避免名称冲突

```python
class MyObject(object):
    def __init__(self):
        self.public_field = 5
        self.__private_field = 10
    
    def get_private_field(self):
        return self.__private_field

foo = MyObject()
foo.get_private_field()
# 如果直接使用 foo.__private_field 会出错，私有属性不能直接这样访问
# foo.__dict__  => {'_MyObject__private_field': 10, 'public_field': 5}
# 所有可以使用 foo._ClassName__private_filed 进行私有字段的访问
foo._MyObject__private_field
```

### 28. 继承 collections.abc 以实现自定义的容器类型

- 如果要定制的子类比较简单，那就可以直接从python的容器类型(如list或dict)中继承
- 想正确实现自定义的容器类型，可能需要编写大量的特殊方法
- 编写自制的容器类型时，可以从 collections.abc 模块的抽象基类中继承，那些基类能够确保我们的子类具备适当的接口及行为

