---
layout: post
title:  使用vim进行多行折叠
description: linux, vim
tags: [linux, vim]
category: linux
---

- 有下面一份文件内如如下,把文件内容保存为一行有如下方法

```
name,
age,
sex,
email
```

- :%j 或 :%j!(不会再行尾添加空格)
- :1,$j
- :ggVGJ
- :%s/\n//g
- qqJ@qq@q
