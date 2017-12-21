---
layout: post
title: Python基础教程
description: Python基础教程
keywords: python
category: python
tags: [python]
---


1. 在 python 中使用普通的除法

    ```python
    from __future__ import division
    
    $ 1/2 = 0.5
    ```
    
2. 原始字符串

    ```python
    # 原始字符串对于反斜线不会做特殊处理，原始字符串以 r 开头
    
    $ print r'C:\nowhere' = C:\nowhere
    
    # 注意不能在原始字符串结尾输入反斜线，除非进行转义
    $ print r'C:\nowhere\' = 错误 如果需要反斜线需转义
    ```

3. python 中元组存在的意义

    ```python
    # 1. 元组可以在映射(和集合的成员)中当做健使用 - 而列表则不行
    # 2. 元组作为很多内建函数和方法的返回值存在，也就是你必须对元组进行处理
    
    # tuple([1,2,3]) 把序列转为元组 (1,2,3)
    # 一般列表可以满足对序列的所有需求
    ```

4. 使用字典进行格式化输出字符串
    
    ```python
    _world = "My name is %(name)s , I\'m %(age)d old"
    dict = {"name": "pemako", "age": 18}
    print _world % dict
    $ My name is pemako , Im 18 old
    ```
    
5. 清空字典 clear方法

    ```python
    # clear 清除字典中所有的项，无返回值或者返回值为 None
    # 不直接把字典赋值为空而采用 clear ,是因为 clear可以清空原始字典中所有元素
    
    // eg:
    In [35]: y = x
    In [36]: x['key'] = 'value'
    In [37]: y
    Out[37]: {'key': 'value'}
    In [38]: x = {}
    In [39]: y
    Out[39]: {'key': 'value'}
    
    In [40]: x = {}
    In [41]: y = x
    In [42]: x['key'] = 'value'
    In [43]: y
    Out[43]: {'key': 'value'}
    In [44]: x.clear()
    In [45]: y
    Out[45]: {}
    ```
    
6. 字典中的 copy 和 deepcopy 问题

    ```python
    # copy 方法返回一个具有相同键值对的新字典，这种方法实现的是浅拷贝，当在副本中替换值的
    # 时候原始字典不受影响，但是如果修改了某个值，原始的字典也会改变
    
    In [50]: x = {'name':'admin', 'machines':['foo', 'bar', 'baz']}

    In [51]: y = x.copy()
    
    In [52]: y['name'] = 'pemako'
    
    In [53]: y['machines'].remove('bar')
    
    In [54]: y
    Out[54]: {'machines': ['foo', 'baz'], 'name': 'pemako'}
    
    In [55]: x
    Out[55]: {'machines': ['foo', 'baz'], 'name': 'admin'}
    
    # 避免上面的问题可以采用深拷贝 deepcopy
    
    In [61]: from copy import deepcopy
    In [62]: d = {}
    In [63]: d['name'] = ['pemako', 'lena']
    In [64]: c = d.copy()
    In [65]: dc = deepcopy(d)
    In [66]: d['name'].append('Alice')
    In [67]: c
    Out[67]: {'name': ['pemako', 'lena', 'Alice']}
    In [68]: dc
    Out[68]: {'name': ['pemako', 'lena']}
    ```
    
7. 迭代序列

    ```python
    # 内建函数 zip 进行并行迭代
    names = ["Lena", "Mako"]
    ages = [18, 20]
    # zip(names, ages) = [('Lena', 18), ('Mako', 20)]
    for name, age in zip(names,ages):
        print name, age
        
    # zip 可以处理不等长的序列，当最短的序列用完的时候就会停止
    $ zip(range(5), xrange(1000000))
    $ [(0, 0), (1, 1), (2, 2), (3, 3), (4, 4)]
    
    
    # 按索引迭代
    >>> seasons = ['Spring', 'Summer', 'Fall', 'Winter']
    >>> list(enumerate(seasons))
    [(0, 'Spring'), (1, 'Summer'), (2, 'Fall'), (3, 'Winter')]
    >>> list(enumerate(seasons, start=1))
    [(1, 'Spring'), (2, 'Summer'), (3, 'Fall'), (4, 'Winter')]
    
    # Equivalent to
    def enumerate(sequence, start=0):
        n = start
        for elem in sequence:
            yield n, elem
            n += 1
    ```
    
8. 列表推导式

    ```python
    # 列表推导式是利用其他列表创建新列表的一种方法，工作方式类似于 for 循环
    
    [x*x for x in range(10)]
    [x*x for x in range(10) if x % 3 == 0] => [0, 9, 36, 81]
    ```

9. 文档化函数

    ```python
    In [85]: class DemoObj(object):
    ...:        '''This is d demo object'''
    ...:        def suquare(x):
    ...:            '''Calculates the square of the number x'''
    ...:         return x*x

    In [86]: DemoObj.__doc__
    Out[86]: 'This is d demo object'
    
    In [87]: DemoObj.suquare.__doc__
    Out[87]: 'Calculates the square of the number x'
    
    In [88]: help(DemoObj)
    
    Help on class DemoObj in module __main__:

    class DemoObj(__builtin__.object)
     |  This is d demo object
     |
     |  Methods defined here:
     |
     |  suquare(x)
     |      Calculates the square of the number x
     |
     |  ------------------------------------------------------------
     |  Data descriptors defined here:
     |
     |  __dict__
     |      dictionary for instance variables (if defined)
     |
     |  __weakref__
     |      list of weak references to the object (if defined)
    ```
    
10. 访问内中私有的方法
    
    ```python
    # python并不直接支持私有方式，为了让方法或特性变为私有，可以有在他的名字前加上双下划线 __
    # 前面有双下划线的名字都不会被带星号的 import 语句导入 from module import *
    
    class Secretive:
        def __hidden(self):
            print 'Bet you cant see me'
            
        def accessible(self):
            print 'The secret message is: '
            self.__hidden()
    
    s = Secretive()
    # 如果想要直接访问 __hidden() 方法可以使用
    
    s._Secretive__hidden()
    ```
    
11. 异常之禅

    ```python
    try:
        x = input('Enter the first number: ')
        y = input('Enter the second number: ')
        print x / y
        
    except (ZeroDivisionError, TypeError), e:
    # 在 python3 中 上面语句被写为
    # except (ZeroDivisionError, TypeError) as e:
        print e
    
    $ Enter the first number: 12
    $ Enter the second number: 0
    $ division by zero
    
    
    # 假设有一个字典，希望打印出存储在特定的健下面的值，如果健不存在什么也不错
    
    def describePerson(person):
        print 'Description of', persopn['name']
        print 'Age:', person['age']
        if 'occupation' in person:
            print 'Occupation:', persion['occupation']
    
    # 上面的代码非常直观但是效率不高，程序会两次查找 occupation 健
    # 另外一个解决方案如下
     def describePerson(person):
        print 'Description of', persopn['name']
        print 'Age:', person['age']
        try:
            # 这里要使用加好而不是逗号，否则 Occupation 会在异常之前打印
            print 'Occupation:'+ persion['occupation']
        expect KeyError: pass
    ```
    
12. 魔术方法、属性和迭代器

    ```python
    # class NewStyle(object):  新式类 
    # class OldStyle:   旧式类
    
    # 构造方法 __init__
    # 如果在子类中重新定义析构方法，必须首先调用父类中的构造方法
    # 使用 supper 函数
    
    class Bird(object):
        def __init__(self):
            self.hungry = True
        def eat(self):
            if self.hungry:
                print 'Aaaah..'
                self.hungry = False
            else:
                print 'No, thanks!'
    
    class SongBird(Bird):
        def __init__(self):
            #Bird.__init__(self)     
            # 新版本绑定和上面等价，尽量使用这种方式
            # 对于继承多个父类的方式，也只需要调用一次 supper 即可
            supper(SongBird, self).__init__()
            self.sound = 'Squawk!'
        def sing(self):
            print self.sound
    ```
    
13. 包和模块的一些信息

    ```python
    
    # 1. 查看模块包含的内容使用 dir 函数
    # 2. __all__ 查看模块中包含哪些内容
    # 3. help(modulename.methodname) 查看某个模块下某个方法
    # 4. 使用文档  print range.__doc__
    # 5. 使用源代码  print copy.__file__ 查看源码路径
   
    ```

14. 文件处理

    ```python
    
    # 1. 如果文件不是很大，可以直接使用 read 方法一次性读取整个文件
    # 2. 或者使用 readlines 方法，把文件读入一个字符串列表
    # 3. 文件比较大的情况，readlines 会占用太多的内存，这个时候可以使用 while 循环和 readline 方法来替代
    
    f = open(filename)
    while True:
        line = f.readline()
        if not line: break
        process(line)
    f.close()
    
    import fileinput
    for line in fileiput.input(filename):
        process(line)
        
    # 处理标准输入流中的数据
    import sys
    for line in sys.stdin:
        process(line)
    ```
    
15. 图形化界面工具

    ```python
    # wxPython -> https://wiki.wxpython.org/Getting%20Started
    
    ```
    
16. 网络编程

    ```python
    
    # 1. John Goerzen 的 Foundations of Python Network Programming
    # 2. Twisted 框架，一个丰富，成熟的用于编写网络应用程序的框架
    
    # urllib 和 urllib2
    # BeautifulSoup4  - https://www.crummy.com/software/BeautifulSoup/bs4/doc.zh/
    # socket 模块
    # SocketServer 模块是标准库中很多服务器框架的基础，这些服务器包括 
    # BaseHTTPServer, SimpleHTTPServer, CGIHTTPServer, SimpleXMLRPCServer 和 DocXMLRPCServer
    
    # CGI Common Gateway Interface, 通用网关接口
    ```
    
    
17. 测试工具

    ```python
    # 1. unitest : 通用测试框架
    # 2. doctest : 简单的一些模块，检查文档用的，对于编写单元测试也很在行
    
    #!/usr/bin/env python
    # -*- coding=utf-8 -*-
    # @create 17/07/16 16:44:39
    # @author pemakoa@gmail.com
    
    def square(x):
        '''
        Square a number and returns the result.
    
        >>> square(2)
        4
        >>> square(3)
        9
        '''
        return x*x
    
    if __name__ == '__main__':
        import doctest, my_math
        doctest.testmod(my_math)
     
    λ pemakoMBookPro2 python → python my_math.py -v
    Trying:
        square(2)
    Expecting:
        4
    ok
    Trying:
        square(3)
    Expecting:
        9
    ok
    1 items had no tests:
        my_math
    1 items passed all tests:
       2 tests in my_math.square
    2 tests in 2 items.
    2 passed and 0 failed.
    Test passed.
    
    
    # my_math.py
    def square(x):
        '''
        Square a number and returns the result.
    
        >>> square(2)
        4
        >>> square(3)
        9
        '''
        return x*x
    
    def product(x, y):
        return x * y
    
    
    if __name__ == '__main__':
        import doctest, my_math
        doctest.testmod(my_math)
        
    # 使用 unittest 框架的简单测试
    
    import unittest, my_math

    class ProductTestCase(unittest.TestCase):
    
        def testIntegers(self):
            for x in xrange(-10, 10):
                for y in xrange(-10, 10):
                    p = my_math.product(x, y)
                    self.failUnless(p == x *y, 'Integer multiplication failed')
    
        def testFloats(self):
            for x in xrange(-10,10):
                for y in xrange(-10, 10):
                    x = x / 10.0
                    y = y / 10.0
                    p = my_math.product(x, y)
                self.failUnless(p == x *y, 'Float multiplication fauled.')
    
    if __name__ == '__main__':
        unittest.main()
        
    # unittest.main() 函数负责实际运行测试，他会实例化所有 TestCase 的子类，运行所有名字以 test 开头的方法
    
    # 测试以外的可以使用 PyChecker 和 PyLint 检查源代码
    
    # 代码性能分析 profile, timeit 模块
    
    ```
    
18. 程序打包

    ```python
    
    # Distutils 不仅可能够制作给予脚本的 python 库安装程序，
    # 还可以用它来生成简单的 windows 安装程序，如果再与扩展
    # 程序 py2exe 结合使用，还能生成独立的 Windows 可执行程序。

    # distutils 基础 https://docs.python.org/2/library/distutils.html
    
    # 简单的 Distutils 安装脚本（setup.py）
    
    from distutils.core import setup
    setup(name='Hello',
          version='1.0',
          description='A simple example',
          author='FangJie Liang',
          author_email='pemakoa@gmail.com',
          url='http://pemako.cn',
          py_modules=['hello'])
    
    # hello.py
    def hello():
        print 'hello world!'
        
    if __name__ == '__main__':
        hello()
    
    # 运行: python setup build # 执行过程如下
    # running build
    # running build_py
    # creating build
    # creating build/lib
    # copying hello.py -> build/lib
    
    # 执行：python setup.py install
    # running install
    # running build
    # running build_py
    # running install_lib
    # copying build/lib/hello.py -> /Library/Frameworks/Python.framework/Versions/2.7/lib/python2.7/site-packages
    # byte-compiling /Library/Frameworks/Python.framework/Versions/2.7/lib/python2.7/site-packages/hello.py to hello.pyc
    # running install_egg_info
    # Writing /Library/Frameworks/Python.framework/Versions/2.7/lib/python2.7/site-packages/Hello-1.0-py2.7.egg-info
    
    # 此时可以直接 使用  hello 包
    
    # 打包 写完供用户安装模块使用的 setup.py
    # 脚本以后，就可以用它来建立存档文件，Windows 安装程序或者 RPM 包
    # 建立存档文件：
    # 使用 sdist 命令（用于"源代码发布"） 
    
    # python setup.py sdist
    # running sdist
    # running check
    # warning: sdist: manifest template 'MANIFEST.in' does not exist (using default file list)
    # warning: sdist: standard file not found: should have one of README, README.txt
    # writing manifest file 'MANIFEST'
    # creating Hello-1.0
    # making hard links in Hello-1.0...
    # hard linking hello.py -> Hello-1.0
    # hard linking setup.py -> Hello-1.0
    # creating dist
    # Creating tar archive
    # removing 'Hello-1.0' (and everything under it)
    
    # 使用 py2exe 创建可执行程序 http://py2exe.org/
    ```
    
19. 使用配置文件

    ```python
    # 使用标准库的模块 ConfigParser 需要使用[files]或者[colors]这样的数据头将配置
    # 文件划分成几个区段(section)。名字可以随意设定，但是需要将他们用方括号括起来
    
    # simple.cfg
    [numbers]
    pi = 3.1415925535897931
    
    [messages]
    greeting = Welcome to the area calulation porgram!
    question = Please enter the radius:
    result_message = The area is
    
    # simple.py
    from ConfigParser import ConfigParser

    config = ConfigParser()
    config.read('simple.cfg')

    print config.get('messages', 'greeting')
    radius = input(config.get('messages', 'question') + ' ')
    # 已逗号做结束将结果显示在一行
    print config.get('messages', 'result_message'), 
    print config.getfloat('numbers', 'pi') * radius **2
    
    # λ pemakoMBookPro2 conf → python simple.py
    # Welcome to the area calulation porgram!
    # Please enter the radius: 10
    # The area is 314.159255359
    ```

19. 日志记录
    
    - [Github](https://github.com/pemako/LearnPython/tree/master/logger)
    - [logging-basic-tutorual](http://python.usyiyi.cn/python_278/howto/logging.html#logging-basic-tutorial)
    - [logging-config-api](http://python.usyiyi.cn/documents/python_278/library/logging.config.html#logging-config-api)

21. 图像生成

    ```
    # pdf 生成 reportlab
    # sudo -H pip install --ignore-installed rlextra -i https://www.reportlab.com/pypi/
    # 账号/密码 pemako@126.com / xxxx
    ```
    
22. URL 请求

    ```python
    # http://docs.python-requests.org/zh_CN/latest/user/quickstart.html
    
    import requests # 需要安装 requests 模块
    
    ```
    
23. python相关模块查看

    ```python
    # 查看内置的模块存放的位置
    sys.builtin_module_names 
    
    ```

24. 文档的创建

    ```python
    
    # https://readthedocs.org/dashboard/
    # 账号: pemakoa@gmail.com 密码：xxxx
    # 示例：https://readthedocs.org/projects/pemako-demo/
    
    # 采用 Sphinx 和 reST 进行构建文档
    # reST 语法：http://docutils.sourceforge.net/docs/ref/rst/restructuredtext.html
    
    
    ```
    
25. 分发打包

    ```python
    # pbr (Python Build Reasonableness) https://pypi.python.org/pypi/pbr/3.1.1
    
    #1. distutils 是标准库的一部分，能处理简单的包的安装
    #2. setuptools 领先的包安装标准，曾被废弃但现在又继续开发
    #3. distribute 从0.7 版本开始并如 setuptools
    #4. distutils2 也被称为 packaging 已经被废弃
    #5. distlib 可能将来会去打 distutils
    #6. pbr 新型的打包工具目前在 OpenStack
    ```

