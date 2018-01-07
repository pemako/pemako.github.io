---
layout: post
title: 编写高质量的python代码 -- 04. 元类及属性
keywords: python
category: python
tags: [python]
---

`metaclass` 元类这个词，只是模糊地描述了一种高于类，而又超乎类的概念。简单来说，就是我们可以把python的class语句转译为元类，并令其在每次定义具体的类时，都提供独特的行为。


### 29. 用纯属性取代get和set方法

- 编写新类时，应该用简单的public属性来定义其接口，而不要手工实现set和get方法
- 如果访问对象的某个属性时，需要表现出特殊的行为，那就用 @property来定义这种行为
- @property 方法应该遵循最小惊讶元组，而不应产生奇怪的副作用
- @property 方法需要执行地迅速一些，缓慢或复杂的工作，应该放在普通的方法里面

```python
class Resistor(object):
    def __init__(self, ohms):
        self.ohms = ohms
        self.voltage = 0
        self.current = 0

r1 = Resistor(50e3)

# 上面的写法比较符合python的风格，不用对属性向Java那样定义get和set方法
r1.ohms = 10e3

# 如果想在设置属性的时候实现特殊行为，那么可以改用@property 修饰器来和setter方法来做。
# 下面这个子类继承自Resistor,它在给 voltage(电压)属性赋值的时候，还会同时修改current
# (电流)属性。请注意：setter和getter方法的名称必须与相关属性相符，方能使这套机制正常运作

class VoltageResistance(Resistor):
    def __init__(self, ohms):
        super().__init__(ohms)
        self._voltage = 0
    
    @property
    def voltage(self):
        return self._voltage
    
    @voltage.setter
    def voltage(self, voltage):
        self._voltage = voltage
        self.current = self._voltage / self.ohms

# 现在设置voltage属性时，将会执行名为voltage的setter方法。该方法会更新本对象的current属性

r2 = VoltageResistance(1e3)
print('Before: %5r amps' % r2.current) # Before:    0 amps
r2.voltage = 10
print('After: %5r amps' % r2.current)  # After:  0.01 amps

```

### 30. 考虑用 @property 来代替属性重构

- @property 可以为现有的实例属性添加新的功能
- 可以用 @property 来逐步完善数据模型
- 如果 @property用的太过频繁，那就应该考虑彻底重构该类并修改相关的调用代码


### 31. 用描述符来改写需要复用的@property方法

[描述符相关知识参考](https://www.ibm.com/developerworks/cn/opensource/os-pythondescriptors/index.html)

- 如果想复用 @property 方法集其验证机制，那么可以自己定义描述符类
- WeakKeyDictionary 可以保证描述符类不会泄露内存
- 通过描述符协议来实现属性的获取和设置操作时，不要纠结于 `__getattribute__`的方法具体运作细节


### 32. 用 `__getattr__`、`__getattribute__`和`__setattr__`实现按需生成的属性

对于一些动态行为的对象，可以通过python的`__getattr__`特殊方法来做。如果某个类定义了`__getattr__`，同时系统在该类对象的实例字典中又找不到待查询的属性，那么，系统就会调用这个方法。

- 通过 `__getattr__` 和 `__setattr__` 我们可以用惰性的方式来加载并保存对象的属性
- 要理解 `__getattr__` 于 `__getattribute__`的区别：前者只会在待访问的属性缺失时触发，而后者则会在每次访问属性时触发
- 如果要在 `__getattribute__`和`__setattr__`方法中访问实例属性，那么应该直接通过super() (也就是object类的同名方法)来做，以避免无线递归

```python
class LazyDB(object):
    def __init__(self):
        self.exists = 5
    
    def __getattr__(self, name):
        value = 'Value for %s' % name
        setattr(self, name, value)
        return value

# 在访问data对象所缺失的foo属性。这回导致python调用刚才定义的 __getattr__方法，从而修改实例的__dict__字典
data = LazyDB()
data.__dict__ # {'exists': 5}
data.foo
data.__dict__ # {'exists': 5, 'foo': 'Value for foo'}

# 给LazyDB添加记录功能，把程序对 __getattr__的调用行为记录下来。请注意，为了避免无限递归，我们需要在子类里面通过 super().__getattr__() 来获取真正的属性值。

class LoggingLazyDB(LazyDB):
    def __getattr__(self, name):
        print('Called __getattr__(%s)' % name)
        return super().__getattr__(name)

data = LoggingLazyDB()
print('exists:', data.exists)
print('foo:', data.foo)
print('foo:', data.foo)
>>>
exists: 5
Called __getattr__(foo)
foo: Value for foo
foo: Value for foo

# 由于exists属性本来就在实例字典里面，所以访问它的时候，不触发__getattr__。而foo属性刚开始并不在实例字典中，所以初次访问的时候会触发__getattr__。由于 __getattr__又会调用setattr方法，并把foo放到实例字典中，所以第二次访问foo的时候，就不会再触发__getattr__了。

```

python程序在每次访问对象的属性时，系统都会调用 `__getattribute__`这个特殊方法，即使字典里面已有了该属性，也依然会触发`__getattribute__`方法。这样就可以在程序每次访问属性时，检查全局事物状态。下面定义的这个 ValidatingDB类，会在`__getattribute__`方法里面记录每次调用的时间。

```python
class ValidatingDB(object):
    def __init__(self):
        self.exists = 5
    
    def __getattribute__(self, name):
        print('Called __getattribute__(%s)' % name)
        try:
            return super().__getattribute__(name)
        except AttributeError:
            value = 'Value for %s' % name
            setattr(self, name, value)
            return value

data = ValidatingDB()
print('exists:', data.exists)
print('foo:', data.foo)
print('foo:', data.foo)

>>>
Called __getattribute__(exists)
exists: 5
Called __getattribute__(foo)
foo: Value for foo
Called __getattribute__(foo)
foo: Value for foo
```

### 33. 用元类来验证子类

元类最简单的一种用途，就是验证某个类定义得是否正确。构建复杂的类体系时，我们可能需要确保类的风格协调一致。确保某些方法得到了覆写，或是确保类属性之间具备某些严格的关系。原来提供了一种可靠的验证方式，每当开发者定义新的类时，它都会运行验证代码，以确保这个新类符合预定的规范。

开发者一般会把验证代码放在本类的 `__init__`方法里面运行，这是由于程序构建该类的对象时，会调用本类型的`__init__`方法。但如果改用原来来进行验证，我们还可以把验证时机提前一些，以便尽早发现错误。

定义原来的时候，要从type中继承，而对于使用该元类的其它类来说，python默认会把那些类的class语句体现中所含的相关内容，发送给元类的`__new__`方法。于是，我们就可以在系统构建出那种类型之前，先修改那个类的信息

```python
class Meta(type):
    def __new__(meta, name, bases, class_dict):
        print(meta, name, bases, class_dict)
        return type.__new__(meta, name, bases, class_dict)
        
class MyClass(object, metaclass=Meta):
    stuff = 123
    
    def foo(self):
        pass

## python2中的写法有些区别,它是通过名为 __metaclass__的类属性来指定元类的，而Meta.__new__接口一致
class MyClassInPython2(object):
    __metaclass__ = Meta
```

注意：元类中所编写的验证逻辑，针对的是该积累的子类，而不是基类本身。

```python
class ValidatePolygon(type):
    def __new__(meta, name, bases, class_dict):
        # Don't validate the abstract Polygon class
        if bases != (object,):
            if class_dict['sides'] < 3:
                raise ValueError('Polygons need 3+ sides')
        return type.__new__(meta, name, bases, class_dict)

class Polygon(object, metaclass=ValidatePolygon):
    sides = None  # Specified by subclasses

    @classmethod
    def interior_angles(cls):
        return (cls.sides - 2) * 180

class Triangle(Polygon):
    sides = 3

print(Triangle.interior_angles())

try:
    print('Before class')
    class Line(Polygon):
        print('Before sides')
        sides = 1
        print('After sides')
    print('After class')
except:
    logging.exception('Expected')
else:
    assert False

```

- 通过元类，我们可以在生成子类对象之前，先验证子类中的定义是否合乎规范
- pyhton2和3指定元类的语法略有不同
- python系统把子类的整个class语句体处理完毕后，就会调用其原来的 `__new__`方法


### 34. 用元类来注册子类

元类还有一个用途，那就是在程序中自动注册类型。对于需要反向查找(reverse lookup)的场合，这种注册操作是很有用的，它使我们可以在简单的标识符与对应的类之间，建立映射关系。

- 在构建模块化的python程序时，类的注册是一种很有用的模式
- 开发者每次从基类中继承子类时，基类的元类都可以自动运行注册代码
- 通过元类来实现类的注册，可以确保所有子类都不会遗漏，从而避免后续的错误

如定义一个通用的基类，它可以基类程序调用本类构造器时所用的参数，并将其转化为JSON字典。

```python
import json

registry = {}

def register_class(target_class):
    registry[target_class.__name__] = target_class

def deserialize(data):
    params = json.loads(data)
    name = params['class']
    target_class = registry[name]
    return target_class(*params['args'])
    
class BetterSerializable(object):
    def __init__(self, *args):
        self.args = args

    def serialize(self):
        return json.dumps({
            'class': self.__class__.__name__,
            'args': self.args,
        })

    def __repr__(self):
        return '%s(%s)' % (
            self.__class__.__name__, ', '.join(str(x) for x in self.args))

class Meta(type):
    def __new__(meta, name, bases, class_dict):
        cls = type.__new__(meta, name, bases, class_dict)
        register_class(cls)
        return cls

class RegisteredSerializable(BetterSerializable, metaclass=Meta):
    pass


class Vector3D(RegisteredSerializable):
    def __init__(self, x, y, z):
        super().__init__(x, y, z)
        self.x, self.y, self.z = x, y, z

v3 = Vector3D(10, -7, 3)
print('Before:    ', v3)
data = v3.serialize()
print('Serialized:', data)
print('After:     ', deserialize(data))

>>>
Before:     Vector3D(10, -7, 3)
Serialized: {"class": "Vector3D", "args": [10, -7, 3]}
After:      Vector3D(10, -7, 3)

```

### 35. 用元类来注解类的属性

原来还有一个更有用的功能，那就是可以在某个类刚定义好但是尚未使用的时候，提前修改或注解该类的属性。这种写法通常会与描述符(descriptor)搭配起来，令这些属性可以更加详细的了解自己在外围类中的使用方式。


例如：要定义新的类，用来表示客户数据库里的某一行。同时，我们还希望在该类的相关属性与数据库表的每一列之间，建立对应关系。于是，用下面的这个描述符类，把属性与列名联系起来。

```python
class Field(object):
    def __init__(self, name):
        self.name = name
        self.internal_name = '_' + self.name
        
    def __get__(self, instance, instance_type):
        if instance is None: return self
        return getattr(instance, self.internal_name, '')
        
    def __set__(self, instance, value):
        setattr(instance, self.internal_name, value)

# 接下来定义表示数据行的Customer类，定义该类的时候，我们要为每个类属性指定对应的列名
class Customer(object):
    # Class attributes
    first_name = Field('first_name')
    last_name = Field('last_name')
    prefix = Field('prefix')
    suffix = Field('suffix')

foo = Customer()
print('Before:', repr(foo.first_name), foo.__dict__)
foo.first_name = 'Euclid'
print('After:', repr(foo.first_name), foo.__dict__)
>>>
Before: '' {}
After: 'Euclid' {'_first_name': 'Euclid'}

```

上面的代码写法显得有些重复。在Customer 类的class语句体中，我们既然要将构建好的Field对象赋给Customer.first_name, 那为什么还要把这个字段名再传给Field的构造器呢？之所以还要把字段名传给Field构造器，是因为定义Customer类的时候，python会以从右向左的顺序解读赋值语句。首先python会以`Field('first_name')` 的形式来调用Field构造器。然后，它把调用构造器所得的返回值，赋给Customer.field_name。从这个顺序来看，Field对象没有办法提前知道自己会赋给Customer类里的哪一个属性。

为了消除这种重复代码，我们使用元类来改写它。使用元类就相当于直接在class语句上面放置挂钩，只要class语句体处理完毕，这个挂钩就会立刻触发。于是我们可以借助元类，为Field描述符自动设置其Field.name 和 Field.internal_name，而不用再像刚才那样，把列的名称手工传给Field构造器

[元类的使用参考](https://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000/0014319106919344c4ef8b1e04c48778bb45796e0335839000)

```python
class Meta(type):
    def __new__(meta, name, bases, class_dict):
        for key, value in class_dict.items():
            if isinstance(value, Field):
                value.name = key
                value.internal_name = '_' + key
        cls = type.__new__(meta, name, bases, class_dict)
        return cls

class DatabaseRow(object, metaclass=Meta):
    pass

class Field(object):
    def __init__(self):
        # These will be assigned by the metaclass.
        self.name = None
        self.internal_name = None
    def __get__(self, instance, instance_type):
        if instance is None: return self
        return getattr(instance, self.internal_name, '')

    def __set__(self, instance, value):
        setattr(instance, self.internal_name, value)

class BetterCustomer(DatabaseRow):
    first_name = Field()
    last_name = Field()
    prefix = Field()
    suffix = Field()

foo = BetterCustomer()
print('Before:', repr(foo.first_name), foo.__dict__)
foo.first_name = 'Euler'
print('After: ', repr(foo.first_name), foo.__dict__)
>>>
Before: '' {}
After:  'Euler' {'_first_name': 'Euler'}
```

- 借助元类，我们可以在某个类完全定义好之前，率先修改该类的属性
- 描述符与元类能够有效地结合起来，以便对某种行为作出修饰，或在程序运行时探查相关信息
- 如果把元类与描述符相结合，那就可以在不使用weakref 模块的前提下避免内存泄露
- 元类经典用法在ORM操作上。ORM全称'Object Relational Mapping'，即对象-关系映射，就是把关系数据库的一行映射为一个对象，也就是一个类对应一个表，这样，写代码更简单，不用直接操作SQL语句。
