---
layout: post
title: 编写高质量Python代码的有效方法
description: 编写高质量Python代码的有效方法
keywords: python
category: python
tags: [python]
---

> 如果特别说明下面示例代码一律采用 python 3.6.2 版本测试

1. 确保自己所用的 python 版本

    ```python
    import sys
    print(sys.version_info)
    print(sys.version)
    ```
    
2. 遵循 [PEP8](https://www.python.org/dev/peps/pep-0008/) 风格指南 
    > 下面列出的规则必须要遵守

    ```python
    -- 空白
    # 1. 使用 space 来进进行缩进，而不是用 tab
    # 2. 和语法相关的每一层缩进都用四个空格
    # 3. 每行的字符数不应该超过79
    # 4. 对于占据多行的长表达式来说，除了首行之外每行多应该在通常的缩进级别上再加4个空格
    # 5. 代码中的函数和类之间应该用两个空行隔开
    # 6. 在同一个类中，各方法之间应该用一个空行隔开
    # 7. 在使用下表来获取列表原始，调用函数或给关键字参数赋值的时候，不要在两旁添加空格
    
    -- 命名
    # 8. 为变量赋值的时候，赋值符号的左侧和右侧应该格子写上一个空格，而且只写一个就好
    # 9. 函数、变量及属性应该适应小写字母来拼写，个单词之间以下划线相连 eg. lowercase_underscore
    # 10. 受保护的实例属性，应该使用单下划线开头 e. _leading_underscore
    # 11. 私有的实例属性，应该用双下划綫开头 e. __double_leading_underscore
    # 12. 类与异常应该采用大驼峰方法命名 e. CapitalizedWord
    # 13. 模块级别的常量，应该全部采用大写字母来拼写，个单词之间以下划线相连 e. ALL_CAPS
    # 14. 类中的实例方法(instance method),应该把收个参数命名为 self,以表示该对象自身
    # 15. 类方法(class method)的收首个参数，应该命名为 cls, 以表示该类自身
    
    -- 表达式
    # 16. 采用内联形式的否定词,不要吧否定词放到整个表达式的前面。
    #     应该写为 if a is not b 而不是 if not a is b
    # 17. 不要通过检测长度的方法（if len(somelist) == 0）来判断 somelist 是否为 []
    #     或 ''等空值,应该采用 if not somelist 写法判断
    # 18. 代码中引入包的顺序应分为三部分 
    #     标准库模块
    #     第三方模块
    #     自用模块， 各 import 语句应该按照模块的字母顺序来排序
        
    
    ```

3. bytes、str 和 unicode 的区别
 

未完待续......


