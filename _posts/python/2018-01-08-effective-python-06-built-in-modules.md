---
layout: post
title: 编写高质量的python代码 -- 06. 内置模块
keywords: python
category: python
tags: [python]
---

### 42. 用functools.wraps 定义函数修饰器

#### 1. python为修饰器提供了专门的语法，它使得程序在运行的时候，能够用一个函数来修改另一个函数
#### 2. 对于调试器这种依赖内省机制的工具，直接编写修饰器会引发奇怪的行为
#### 3. 内置的functools 模块提供了名为 wraps的修饰器，开发者在定义自己的修饰器时，应该用wraps对其做一些处理，避免一些问题

```python
def trace(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs):
        print('%s(%r, %r) -> %r' % (func.__name__, args, kwargs, result))
        return result
    return wrapper

# 可以用 @ 符号把刚才那个装饰器套用到某个函数上面
# 使用 @ 符号来修饰函数，其效果就等于先以该函数为参数，调用修饰器，然后把修饰器所返回的结果，赋给同一个作用域中与原函数同名的那个变量。
# fibonacci = trace(fibonacci)

@trace
def fibonacci(n):
    """Return the n-th Fibonacci number"""
    if n in (0, 1):
        return n
    return (fibonacci(n -2) + fibonacci(n -1))

fibonacci(3)
>>>
fibonacci((1,), {}) -> 1
fibonacci((0,), {}) -> 0
fibonacci((1,), {}) -> 1
fibonacci((2,), {}) -> 1
fibonacci((3,), {}) -> 2

```

如果编写修饰器的时候，没有用wraps做相应的处理，那就会令help函数失效。除了help函数，修饰器还会导致其他一些难于排查的问题。为了维护函数的接口，修饰之后的函数，必须保留原函数的某些标准python属性，例如 `__name__`和`__module__`。因此，我们需要用wraps来确保修饰后的函数具备正确的行为

![trace](https://pemako.github.io/assets/imags/python/42.png)

### 43. 考虑以contextlib和with语句来改写可复用的try/finally代码

### 44. 用copyreg 实现可靠的pickle操作

### 45. 应该用datetime 模块来处理本地时间，而不是用time模块

### 46. 使用内置算法与数据结构

### 47. 在重视精度的场合，应该使用decimal

### 48. 学会安装由python开发者社区所构建的模块
