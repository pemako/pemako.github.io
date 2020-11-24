---
layout: post
title: python3 dict2cls
keywords: python
category: python
tags:
  - python
---

# 2018-03-30-dict-to-cls

今天遇到一个很大的JSON包转为字典后每次获取里面的值相对来说比较麻烦，搜索后发现可以如下解决

```python
# -*- coding:utf-8 -*-
# 2018-03-29 21:17:58

import json

class Dict2Cls(object):
    def __init__(self, d):
        for a, b in d.items():
            if isinstance(b, (list, tuple)):
               setattr(self, a, [Dict2Cls(x) if isinstance(x, dict) else x for x in b])
            else:
               setattr(self, a, Dict2Cls(b) if isinstance(b, dict) else b)


class Struct(object):
    def __init__(self, data):
        for name, value in data.items():
            setattr(self, name, self._wrap(value))

    def _wrap(self, value):
        if isinstance(value, (tuple, list, set, frozenset)): 
            return type(value)([self._wrap(v) for v in value])
        else:
            return Struct(value) if isinstance(value, dict) else value


json_data = open('https://pemako.github.io/assets/data/json.data','r')
#s = Dict2Cls(json.loads(json_data.read()))
s = Struct(json.loads(json_data.read()))
print(s.result.pageInfo.bg_time)
print(s.result.pageInfo.directory[0].title)
```

上述两种方式均可完成，还有更多的方式，均是利用把DICT 进行循环迭代为类中的属性

[参考](https://stackoverflow.com/questions/1305532/convert-python-dict-to-object)

