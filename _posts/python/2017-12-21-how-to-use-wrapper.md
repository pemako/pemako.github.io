---
layout: post
title: Python装饰器示例
description: Python装饰器示例
keywords: python, wrapper
category: python
tags: [python]
---


装饰器会用一个动态创建的新函数替换原来的，新函数缺少很多原函数的属性,如 docstring和名字

python内置的 functools 模块通过其 update_wrapper 函数解决这个问题

手工调用 update_wrapper 创建装饰器很不方便,所以 functools提供了名为 wraps 的装饰器

inspect 从装饰器函数中获取相应的参数,通过 getcallargs 函数把参数转化为 dict格式

下面使用示例：

```python
# -*- coding:utf-8 -*-
# @author: pemakoa@gmail.com

import functools
import inspect


def check_is_admin(f):
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        func_args = inspect.getcallargs(f, *args, **kwargs)
        if func_args['username'] != 'admin':
            raise Exception("This user is not allowed to get food")
        return f(*args, **kwargs)
    return wrapper


@check_is_admin
def get_food(username, type="chocolate"):
    return type + " nom nom nom!"
```
