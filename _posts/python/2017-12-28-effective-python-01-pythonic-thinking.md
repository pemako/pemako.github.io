---
layout: post
title: 编写高质量的python代码 -- 01. 用pythonic 方式来思考
keywords: python
category: python
tags: [python]
---

#### 01. 确认自己的所使用的 python 版本

```python
>>> import sys
>>> print(sys.version_info)
sys.version_info(major=3, minor=6, micro=3, releaselevel='final', serial=0)
>>> print(sys.version)
3.6.3 (default, Oct  4 2017, 06:09:38)
[GCC 4.2.1 Compatible Apple LLVM 9.0.0 (clang-900.0.37)]
```

#### 02. 遵循 [PEP8](https://www.python.org/dev/peps/pep-0008/) 风格指南

下面几条一定要遵守的规则

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
 # 16. 采用内联形式的否定词,不要把否定词放到整个表达式的前面。
 #     应该写为 if a is not b 而不是 if not a is b
 # 17. 不要通过检测长度的方法（if len(somelist) == 0）来判断 somelist 是否为 []
 #     或 ''等空值,应该采用 if not somelist 写法判断
 # 18. 代码中引入包的顺序应分为三部分 
 #     标准库模块
 #     第三方模块
 #     自用模块， 各 import 语句应该按照模块的字母顺序来排序
```

#### 03. 了解 bytes、str 和 unicode 的区别

python3中有两种表示字符序列的类型：bytes(实例包含原始的8位值)和 str(实例包含 Unicode 字符)。

python2 中两种表示字符序列的类型: str(实例包含原始的8位值) 和 unicode(包含 Unicode字符)。

由于字符类型有别，所以Python 代码中经常会出现两种常见的使用场景：

- 开发者需要原始8位值，这些8位置表示以 UTF-8格式(或其它编码形式)来编码的字符
- 开发者需要操作没有特性编码形式的 Unicode 字符

```python

# python3 中编写两个帮助函数

def to_str(bytes_or_str):
    """接受str或bytes,并总是返回str"""
    if isinstance(bytes_or_str, bytes):
        value = bytes_or_str.decode('utf-8')
    else:
        value = bytes_or_str
    return value # Instance of str

print(repr(to_str(u'foo')))
print(repr(to_str('foo')))

def to_bytes(bytes_or_str):
    """接受str或bytes,并总是返回bytes"""
    if isinstance(bytes_or_str, str):
        value = bytes_or_str.encode('utf-8')
    else:
        value = bytes_or_str
    return value # Instance of bytes

print(repr(to_bytes(b'foo')))
print(repr(to_bytes('foo')))

# python2 中编写两个辅助函数

def to_unicode(unicode_or_str):
    """接受 str 或 unicode，并总返回 Unicode"""
    if isinstance(unicode_or_str, str):
        value = unicode_or_str.decode('utf-8')
    else:
        value = unicode_or_str
    return value #Instance of unicode

print(repr(to_unicode(u'foo')))
print(repr(to_unicode('foo')))

def to str(unicode_or_str):
    """接受 str 或 unicode，并总返回 str"""
    if isinstance(unicode_or_str, unicode):
        value = unicode_or_str.encode('utf-8')
    else:
        value = unicode_or_str
    return value #Instance of str
print(repr(to_str(u'foo')))
print(repr(to_str('foo')))
    
```

- 要点
    - 在 python3中，bytes 是一种包含8位值的序列，str 是一种包含 Unicode 字符的序列。开发者不能以> 或+ 等操作符来混同操作 bytes 和 str 实例
    - 在 python2中，str 是一种包含8位值的序列，Unicode是一种包含 Unicode 字符的序列。如果 str 只包含7位 ASCII 字符，那么可以通过相关的操作符来同时使用 str 与 unicode
    - 在对输入的数据进行操作之前，使用辅助函数来保证字符序列的类型与开发者的期望相符
    - 从文件中读取二进制数据，或向文件中写入二进制数据时，总应该以'rb'或'wb'等二进制模式来开启文件


#### 04. 用辅助函数来取代复杂的表达式

要从 URL 中解码查询字符串,在下例所举的查询字符串中，每个参数都可以表示一个整数值。

```python

from urllib.parse import parse_qs

my_values = parse_qs('red=5&blue=0&green=', keep_blank_values=True)
print(repr(my_values))
>>> {'red': ['5'], 'blue': ['0'], 'green': ['']}

# 现在要依次取出 red  greep opacity(不存在的参数) 的值，常规做法
red = int(my_values.get('red', [''])[0] or 0)
green = int(my_values.get('green', [''])[0] or 0)
opacity = int(my_values.get('opacity', [''])[0] or 0)

# 表达式比较长可以修改为 if/else 方式获取，最好的方式是封装成辅助函数如下

def get_first_int(values, key, default=0):
    found = values.get(key, [''])
    if found[0]:
        found = int(found[0]
    else:
        found = default
    return found

# 获取上面的值只需要调用辅助方法即可如
green = get_first_int(my_values, 'green')

```

- 要点
    - 不要过度运用 python 语法特性，写出特别复杂且难以理解的单行表达式
    - 把复杂的表达式移入辅助函数之中，如果要反复使用形同的逻辑，就应该这么做
    - 使用 if/else 表达式，要比用 or 或 and 这样的 Boolena 操作符写成的表达式更加清楚

#### 05. 了解切割序列的方法

切割操作的基本写法是 somelist[start:end], 其中 start(起始索引)所指的元素涵盖在切割后的范围内，而 end(结束索引)所指的元素不包括在切割结果之中。

- 要点
    - 不要写多余的代码：当 start索引为0，或 end 索引为序列长度时，应该将其省略
    - 切片操作不会计较 start 与 end 索引是否越界，这使得很容易就能从序列的前端或后端开始，对其进行范围固定的切片操作（a[:20] 或 a[-20:]）
    - 对 list 赋值的时候，如果使用切片操作，就会把原列表中处在相关范围内的值替换成新值，即便它们的长度不同也依然可以替换

#### 06. 在单词切片操作内，不要同时制定 start、end 和 stride

- 要点
    - 即有 start 和 end,又有 stride 的切割操作，可能会令人费解
    - 尽量使用 stride 为正值，且不带 start 或 end 索引的切割操作。精良避免使用负数做 stride.
    - 在同一个切片操作内，不要同时使用 start, end 和 stride。如果确实需要执行这样的操作，那就考虑将其拆解为两条赋值语句，其中一条作范围切割，另一条做步进切割，或考虑使用内置 itertools 模块中的 islice
    

#### 07. 用列表推导式取代 map 和 filter

```python
# 如下例 希望获取 a 的每个数的平方

a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squares = [x**2 for x in a] # 列表推导式实现

squares = map(lambda x: x**2, a) # map 加 lambda 实现


# 如果只需要获取可以被2整除的数
even_squares = [x**2 for x in a if x % 2 == 0]
even_squares = map(lambda x: x**2, filter(lambda x: x % 2 == 0, a))

# 字典也支持推导列表
In [1]: chile_ranks = {'ghost':1, 'habanero': 2, 'cayenne': 3}

In [2]: {rank:name for name, rank in chile_ranks.items()}
Out[2]: {1: 'ghost', 2: 'habanero', 3: 'cayenne'}

In [3]: {len(name) for name in chile_ranks.keys()}
Out[3]: {5, 7, 8}
```

- 要点
    - 列表推导要比内置的 map 和 filter 函数清晰，因为无需额外编写 lambda 表达式
    - 列表推导式可以跳过输入列表中的某些原始，如果改用 map 来做，必须辅以 filter 方能实现
    - 字典也支持推导列表


#### 08. 不要使用含有两个以上表达式的列表推导

- 要点：
    - 列表推导支持多级循环，每一级循环也支持多项条件
    - 超过两个表达式的列表推导是很难理解的，应该尽量避免

#### 09. 用生成器表达式来改写数据量较大的列表推导

列表推导的缺点：如果输入的数据非常多，那么可能会消耗大量内存，并导致程序崩溃。

假设 /tmp/myfile.txt 文件有几行数据，每行数据的长度为 100, 57, 14, 1, 4

```python
# 少量的数据输入
value = [len(x) for x in open('/tmp/myfile.txt')]
print(value)
>>>[100, 57, 14, 1, 4]

# 如果数据量比较大可以使用生成器，把实现列表推导所用的那种写法放到一对圆括号中，就构成了生成器表达式
# 下面给出的生成器表达式与刚才的代码等效。二者的区别在于，对生成器表达式求值时，他会立刻返回一个迭代器，而不会深入处理文件中的内容

it = (len(x) for x in open('/tmp/myfile.txt'))
print(it)
>>><generator object <genexpr> at 0x10918d518>
print(next(it))
print(next(it))
>>>
100
57
```

```python
# 组合生成器表达式
it = (len(x) for x in open('/tmp/adobegc.log'))
roots = ((x, x**0.5) for x in it)

In [14]: next(roots)
Out[14]: (125, 11.180339887498949)

In [15]: next(roots)
Out[15]: (115, 10.723805294763608)

In [16]: next(roots)
Out[16]: (99, 9.9498743710662)

In [17]: next(roots)
Out[17]: (126, 11.224972160321824)

In [18]: next(roots)
Out[18]: (140, 11.832159566199232)

In [19]: next(roots)
---------------------------------------------------------------------------
StopIteration                             Traceback (most recent call last)
<ipython-input-19-19124443b294> in <module>()
----> 1 next(roots)

StopIteration:

```

- 要点
    -  当输入的数据量较大时，列表推导可能会因为占用太多内存而出现问题
    -  由生成器表达式所返回的迭代器，可以主次产生输出值，从而避免内存用量问题
    -  把某个生成器表达式所返回的迭代器，放在另一个生成器表达式的 for 子表达式中，即可将二者结合起来
    -  串在一起的生成器表达式执行速度很快


#### 10. 尽量用 enumerate 取代 range

在对列表进行迭代的时候，通常还想知道当前元素在列表中的索引。一种方式使用 range

```python

# 使用 range
flavor_list = ['vanilla', 'chocolate', 'pecan', 'strawberry']
for i in range(len(flavor_list)):
    flavor = flavor_list[i]
    print("{0}:{1}".format(i+1, flavor))

'''Output:
1:vanilla
2:chocolate
3:pecan
4:strawberry
'''

# 使用内置的 enumerate 函数,输出结果和上面一样
for i, flavor in enumerate(flavor_list):
     print("{0}:{1}".format(i+1, flavor))
     
# 还可以直接指定 enumerate 函数开始计数时所用的值
for i, flavor in enumerate(flavor_list, 1):
     print("{0}:{1}".format(i, flavor))

```

- 要点：
    - enumerate 函数提供了一种精简的写法，可以在遍历迭代器时获取每个元素的索引
    - 尽量用 enumerate 来改写那种将 range 与下表访问相结合的序列遍历代码
    - 可以给 enumerate 提供第二个参数，以指定开始计数时所用的值(默认为0)

#### 11. 用 zip 函数同时遍历连个迭代器

如果两个列表有相互关联关系，如果想平行的迭代两份列表，如下

```python
names = ['Cecilia', 'Lise', 'Marie']
letters = [len(n) for n in names]

longest_name = None
max_letters = 0

# 使用 range 最傻，不上代码，次之使用 enumerate 迭代
for i, name in enumerate(names):
    count = letters[i]
    if count > max_letters:
        longest_name = name
        max_letters = count
        print("{}->{}".format(longest_name, max_letters))
#Cecilia->7

# 使用 zip 进行平行迭代
for name, count in zip(names, letters):
    if count > max_letters:
        longest_name = name
        max_letters = count
        print("{}->{}".format(longest_name, max_letters))
```

- 注意内置的 zip 有两个问题：
    - Python2中的 zip 并不是生成器,而是会把开发者所提供的那些迭代器，都平行的遍历一次，在此过程中，它会把那些迭代器所产生的值汇聚成元祖，并把那些元组所构成的列表完整地返回给调用者。这可能会占用大量内存导致程序崩溃。在Python2中用zip来遍历数据量非常大的迭代器，应该使用itertools内置模块中的 izip 函数
    - 如果输入的迭代器长度不同，那么 zip 会表现出比较奇怪的行为。若不能确定zip所封装的列表是否等长，则可考虑改用 itertools 内置模块中的 zip_longest 函数(在python2中叫做 izip_longest)
     
- 要点
    - 内置的 zip 函数可以平行的遍历多个迭代器
    - Python3中的 zip 相当于生成器，会在遍历过程中逐次产生元组，而Python2中的zip则是直接把这些元祖完全生成好，并一次性地返回整份列表
    - 如果提供的迭代器长度不等，那么zip就会自动提前终止
    - itertools 内置模块中的zip_lognest 函数可以平行地遍历多个迭代器，而不用在乎它们的长度是否相等


#### 12. 不要在 for 和 while 循环后面写 else 块

Python提供了一种很多编程语言都不支持的功能，那就是可以在循环内部的语句块后面直接编写else块

```python
for i in range(3):
    print('Loop {}'.format(i))
        if i == 1:
            break # 在循环里面用break 语句提前跳出，会导致程序不执行else块
else:
    print('Else block!')

'''
Loop 0
Loop 1
'''

for i in range(3):
    print('Loop {}'.format(i))
else:
    print('Else block!')
    
'''
Loop 0
Loop 1
Loop 2
Else block!
'''

# 初始循环条件为false的while循环，如果后面跟着else块，那它也会立即执行
while False:
    print('Never runs')
else:
    print('Whie Else block!')
>>> While Else block!

# 如果for循环遍历的序列为空的，会立即执行else块
for x in []:
    print('Nevers runs')
else:
    print('For Else block!')
>>> For Else block!
```

- 要点
    - Python有种特殊语法，可在for及while 循环的内部语句块之后紧跟一个else块
    - 只有当整个循环主体都没遇到break语句时，循环后面的else块才会执行
    - 不要在循环后面使用else块，因为这种写法既不直观，又容易引人误解


#### 13. 合理利用 try/except/else/finally 结构中的每个代码块

混合使用示例: 从文件中读取某项事物的描述信息，处理该事务，然后就地更新该文件。

```python
UNDEFINED = object()

def divide_josn(path):
    handler = open(path, 'r+')      # May raise IOError
    try:
        data = handler.read()       # May raise UnicodeDecodeError
        op = json.loads(data)       # May raise ValueError
        value = (
            op['numerator']/
            op['denominator'])      # May raise ZeroDivisionError
    except ZeroDivisionError as e:
        return UNDEFINED
    else:
        op['result'] = value
        result = json.dumps(op)
        handle.seek(0)
        handle.write(result)        # May raise IOError
        return value
    finally:
        handle.close()              # Always runs
```

- 要点
    - 物理try块是否发生异常，都可以利用 try/finally 复合语句中的finally 块来执行清理工作
    - else块可以用来缩减try块中的代码量，并把没有发生异常时所要执行的语句与try/except 代码块隔开
    - 顺利运行try块后，若想是某些操作能在finally块的清理代码之前执行，则可将这些操作写到else块中
