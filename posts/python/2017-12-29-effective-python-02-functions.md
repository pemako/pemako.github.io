---
layout: post
title: 编写高质量的python代码 -- 02. 函数
keywords: python
category: python
tags:
  - python
---

# 2017-12-29-effective-python-02-functions

## 14. 尽量用异常来表示特殊情况，而不返回 None

* 用 None 这个返回值来表示特殊意义的函数，很容易使调用者犯错，因为 None 和0以及空字符之类的值，在条件表达式里都会评估为 False
* 函数在遇到特殊情况时，应该抛出异常，而不要返回 None.调用者看到该函数的文档中所描述的异常之后，应该就会编写相应的代码来处理它们了

如两个数字进行相除的函数

```python
def divide(a, b):
    """求两个数相除"""
    try:
        return a / b
    except ZeroDivisionError as e:
        raise ValueError('Invalid inputs') from e

x, y = 5, 2
try:
    result = divide(x, y)
except ValueError:
    print('Invalid inputs')
else:
    print('Result is {}'.format(result))
```

## 15. 了解如何在闭包里使用外围作用域中的变量

* 对于定义在某作用域内的闭包来说，它可以引用这些作用域中的变量
* 使用默认方式对闭包内的变量赋值，不会影响外围作用域中的同名变量
* 在 python3中，程序可以在闭包内用 nonlocal 语句来修饰某个名称，使该闭包能够修改外围作用域中的同名变量
* 在 python2中，程序可以使用可变值\(如，包含单个元素的列表\)来实现与 nonlocal 语句相仿的机制
* 处理那种比较简单的函数，尽量不要用 nonlocal 语句

示例：假如有一份列表，其中的元素都是数字，现在要对其排序，但排序时，要把出现在某个群组内的数字，放在群组外的那些数字之前。

```python
numbers = [8, 3, 1, 2, 5, 4, 7, 6]
group = {2, 3, 5, 7}

def sort_priority(values, group):
    def helper(x):
        if x in group:
            return (0, x)
        return (1, x)
    values.sort(key=helper)
sort_priority(numbers, group)
>>> [2, 3, 5, 7, 1, 4, 6, 8]

# 这个山水能正常工作是因为
# 1. python 支持闭包：闭包是一种定义在某个作用域中的函数，这种函数引用了那个作用域里面的变量。helper 函数之所以能够访问 sort_priority 的 group 参数，原因就在于它是闭包
# 2. python 的函数是一级对象，也就是说，我们可以直接饮用函数，把函数赋给变量、把函数当成参数传递给其它函数，并通过表达式及 if 语句对其进行比较和判断，等待。于是，我们可以把 helper 这个闭包函数，传递个 sort 方法的 key 参数
# 3. python 使用特殊的规则来比较两个元组。它首先比较各元组中下标为0的对应元素，如果相等，在比较下表为1的对应元素，依次类推
```

改进 sort\_priority函数，返回一个值用来表示用户界面里是否出现了优先级较高的原件，使得该函数的调用者，可以根据这个返回值做出相应的处理。

```python
numbers = [8, 3, 1, 2, 5, 4, 7, 6]
group = {2, 3, 5, 7}

def sort_priority(values, group):
    found = False
    def helper(x):
        if x in group:
            found = True    # 闭包里面的赋值，相当于定义了一个新的变量 found 
                            # 不会修改sort_priority函数中的 found 值
            return (0, x)
        return (1, x)
    values.sort(key=helper)
    return found

sort_priority(numbers, group)

>>> 
Found: False # 期望返回 True，返回了 False
[2, 3, 5, 7, 1, 4, 6, 8]

# 之所以出现上面的问题，是Python 语言故意这么设计的。这样做可以防止函数中的局部变量污染函数外面的那个模块。
```

python3中获取闭包内的数据，可以使用 nonlocal。也就是给相关变量赋值的时候，应该在上层作用域中查找该变量。nonlocal 的唯一限制在于，它不能延伸到模块级别，这是为了防止污染全局作用域。

```python
def sort_priority(values, group):
    found = False
    def helper(x):
        nonlocal found
        if x in group:
            found = True
            return (0, x)
        return (1, x)
    values.sort(key=helper)
    return found
```

python2中不支持 nonlocal 关键字，为了实现类似的功能，我们需要利用 python 的作用域规则来解决。

```python
def sort_priority(numbers, group):
    found = [False]
    def helper(x):
        if x in group:
            found[0] = True
            return (0, x)
        return (1, x)
    numbers.sort(key=helper)
    return found[0]
```

如果使用 nonlocal 的那些代码，已经写得原来越复杂，那就应该将其相关的状态封装成辅助类。下面定义的类，与 nonlocal 所表达的功能形同。

```python
class Sorter(object):
    def __init__(self, group):
        self.group = group
        self.found = False

    def __call__(self, x):
        if x in self.group:
            self.found = True
            return (0, x)
        return (1, x)

sorter = Sorter(group)
numbers.sort(key=sorter)
assert sorter.found is True
```

## 16. 考虑用生成器来改写直接返回列表的函数

* 使用生成器比把收集到的结果放入列表里返回给调用者更加清晰
* 由生成器函数返回的那个迭代器，可以把生成器函数体重，传给 yield 表达式的那些纸，逐次产生出来
* 无论输入量有多大，生成器都能产生一系列输出，因为这些输入量和输出量，都不会影响它在执行时所耗的内存

例如： 我们要查出字符串中每个词的首字母，在整个字符串里的位置。

```python
def index_words(text):
    result = []
    if text:
        result.append(0)
    for index, letter in enumerate(text):
        if letter == ' ':
            result.append(index + 1)
    return result

# 把这个函数改为生成器来写会更好。生成器是使用 yield 表达式的函数。调用生成器函数时，
# 它不会真的运行，而是会返回迭代器。每次在这个迭代器上面调用内置的 next 函数时，迭代
# 器会把生成器推进到下一个 yield 表达式那里。生成器传给 yield 的每一个值，都会由迭代
# 器返回给调用者

def index_words_iter(text):
    if text:
        yield 0
    for index, letter in enumerate(text):
        if letter == ' ':
            yield index + 1

result = list(index_words_iter(address))

# 下面定义一个生成器，从文件里面依次读入各行内容，然后逐个处理每行汇总的单词，并产生
# 相应结果。该函数执行时所耗的内存，由单行输入值的最大字符数来界定

def index_file(handle):
    offset = 0
    for line in handle:
        if line:
            yield offset
        for letter in line:
            offset += 1
            if letter == ' ':
                yield offset

with open('/tmp/address.txt', 'r') as f:
    it = index_file(f)
    results = islice(it, 0, 3)
    print(list(results)
```

## 17. 在参数上面迭代时，要多加小心

* 函数在输入的参数上面多次迭代时要小心：如果参数是迭代器，那么可能会导致奇怪的行为并错失某些值
* python 的迭代器协议，描述了容器和迭代器应该如何与iter和 nextn 内置函数、for 循环及相关表达式相互配合
* 把 **iter** 方法实现为生成器，即可定义自己的容器类型
* 想判断某个值是迭代器还是容器，可以拿该值为参数，两次调用 iter 函数，若结果相同，则为迭代器，调用内置的 next 函数，即可令该迭代器前进一步

以统计城市旅游的人数，占总游客的百分比。

```python
def normalize_defensive(numbers):
    if iter(numbers) is iter(numbers):
        raise TypeError('Must supply a container')
    total = sum(numbers)
    result = []
    for value in numbers:
        percent = 100 * value / total
        result.append(percent)
    return result

# 使用迭代器协议（iterator protocol）的容器类
class ReadVisits(object):
    def __init__(self, data_path):
        self.data_path = data_path

    def __iter__(self):
        with open(self.data_path) as f:
            for line in f:
                yield int(line)

'''
/tmp/a.data 文件中包含三行数据
15
35
80
'''

# python 在 for 循环及相关表达式中遍历某中容器的内容时，就要依靠这个迭代协议。
# 在执行类似 for x in foo 这样的语句时，python 实际上会调动 iter(foo).内置的 iter 函数又会
# 调用 foo.__iter__ 这个特殊方法。该方法必须返回迭代器对象。

visits = [15, 35, 80]
normalize_defensive(visits) # No error
visits = ReadVisits('/tmp/a.data')
normalize_defensive(visits)
```

## 18. 用数量可变的位置参数减少视觉杂讯

* 在 def 语句中使用`*args`, 即可令函数接受数量可变的位置参数
* 调用函数时，可以采用`*` 操作符，把序列中的元素当成位置参数，传给该函数
* 对生成器使用 `*` 操作符，可能导致程序耗尽内存并崩溃
* 在已经接受 `*args` 参数的函数上面继续添加位置参数，可能会产生难以排查的 bug

## 19. 用关键字参数来表达可选的行为

* 函数参数可以按位置或关键字来指定
* 只使用位置参数来调用函数，可能会导致这些参数值的含义不够明确，而关键字参数则能阐明每个参数的意图
* 给函数添加新的行为时，可以使用带默认值的关键字参数，以便与原有的函数调用代码保持兼容
* 可选的关键字参数，总是应该以关键字形式来指定，而不应该以位置参数的形式来指定

## 20. 用 None 和文档字符串来描述具有动态默认值的参数

* 参数的默认值，只会在程序加载模块并读到本函数的定义时评估一次。对于{} 或 \[\] 等动态的值，可能会导致奇怪的行为
* 对于以动态值作为实际默认值的关键字参数来说，应该把形式上的默认值写为 None,并在函数的文档字符串里面描述该默认值所对应的实际行为

```python
from datetime import datetime
from time import sleep
def log(message, when=datetime.now()):
    print('{}: {}'.format(when, message))

log('Hi there!')
sleep(0.1)
log('Hi again!')

# 上面的例子输出的时间是一样的，因为 datetime.now 只执行了一次。
# 在 python 若想正确实动态默认值，习惯上把默认值设置为 None,并在文档字符串里面把对None 对应的实际行为
# 描述出来。编写函数代码时，如果返现该参数的值是 None,那就将其设为实际的默认值

def log(message, when=None):
    """Log a message with a timestamp.

    Args:
        message: Message to print.
        when: datetime of when the message occurred.
            Defaults to the present time.
    """
    from datetime import datetime
    when = datetime.now() if when is None else when
    print('{}: {}'.format(when, message))
```

## 21. 用只能以关键字形式指定的参数来确保代码清晰

* 关键字参数能够使函数调用的意图更加明确
* 对于各参数之间很容易混淆的函数，可以声明只能以关键字形式指定的参数，以确保调用者必须通过关键字来指定它们。对于接受多个 Boolena 标志的函数，更应该这样做
* python3 有明确的语法来定义这种只能以关键字形式指定的参数
* python2 的函数可以接受 `**kwargs` 参数，并手工抛出 TypeError 异常，以便模拟只能以关键字形式来指定的参数

python3 可以定义一种只能以关键字形式来指定的参数，从而确保调用该函数的代码读起来会比较明确。下面定义的这个 safe\_division\_c 函数，带有两个只能以关键字形式来指定的参数。参数列表里的`*`，标志着位置参数就此终结，之后的那些参数，都只能以关键字形式来指定。

```python
# python3 写法
def safe_division_c(number, divisor, *, ignore_overflow=False,ignore_zero_division=False):
    try:
        return number /divisor
    except OverflowError:
        if ignore_overflow:
            return 0
        else:
            raise
    except ZeroDivisionError:
        if ignore_zero_division:
            return float('inf')
        else:
            raise

# python2 写法
def safe_division_d(number, divisor, **kwargs):
    ignore_overflow = kwargs.pop('ignore_overflow', False)
    ignore_zero_division = kwargs.pip('ignore_zero_division', False)
    if kwargs:
        raise TypeError('Unexpected **kwargs: %r' % kwargs)
    try:
        return number /divisor
    except OverflowError:
        if ignore_overflow:
            return 0
        else:
            raise
    except ZeroDivisionError:
        if ignore_zero_division:
            return float('inf')
        else:
            raise
```

