---
layout: post
title: PHP语言参考
description: 'php,手册'
keywords: 'php,手册,语法'
category: php
tags:
  - php
---

# 简介

PHP官方手册主要包含了四大部分为了便于查阅进行整理总结，本篇主要是第一部分语言参考。

* [基础语法](2017-02-03-php-language-reference.md#base-syntax)
* [类型](2017-02-03-php-language-reference.md#types)
* [变量](2017-02-03-php-language-reference.md#variables)
* [常量](2017-02-03-php-language-reference.md#constants)
* [表达式](2017-02-03-php-language-reference.md#expressions)
* [运算符](2017-02-03-php-language-reference.md#operators)
* [流程控制](2017-02-03-php-language-reference.md#control-structures)
* [函数](2017-02-03-php-language-reference.md#functions)
* [类与对象](2017-02-03-php-language-reference.md#class-and-obj)
  * [简介](2017-02-03-php-language-reference.md#obj-introduction)
  * [基本概念](2017-02-03-php-language-reference.md#obj-basics)
  * [属性](2017-02-03-php-language-reference.md#obj-property)
  * [类常量](2017-02-03-php-language-reference.md#obj-class-constants)
  * [自动加载类](2017-02-03-php-language-reference.md#obj-autoloading)
  * [构造函数和析构函数](2017-02-03-php-language-reference.md#obj-construct-and-destruct)
  * [访问控制可见性](2017-02-03-php-language-reference.md#obj-visibility)
  * [对象继承](2017-02-03-php-language-reference.md#obj-inheritance)
  * [范围解析操作符::](2017-02-03-php-language-reference.md#obj-scope)
  * [Static 关键字](2017-02-03-php-language-reference.md#obj-static)
  * [抽象类](2017-02-03-php-language-reference.md#obj-abstraction)
  * [对象接口](2017-02-03-php-language-reference.md#obj-interface)
  * [Trait](2017-02-03-php-language-reference.md#obj-trait)
  * [匿名类](2017-02-03-php-language-reference.md#obj-anonymous)
  * [重载](2017-02-03-php-language-reference.md#obj-overloading)
  * [遍历对象](2017-02-03-php-language-reference.md#obj-iteration)
  * [魔术方法](2017-02-03-php-language-reference.md#obj-magic-method)
  * [Final 关键字](2017-02-03-php-language-reference.md#obj-final)
  * [对象复制](2017-02-03-php-language-reference.md#obj-cloning)
  * [对象比较](2017-02-03-php-language-reference.md#obj-comparing)
  * [类型约束](2017-02-03-php-language-reference.md#obj-type-hinting)
  * [后期静态绑定](2017-02-03-php-language-reference.md#obj-late-static-binding)
  * [对象和引用](2017-02-03-php-language-reference.md#obj-and-reference)
  * [对象序列化](2017-02-03-php-language-reference.md#obj-serialization)
* [命令空间](2017-02-03-php-language-reference.md#namespaces)
* [Errors](2017-02-03-php-language-reference.md#errors)
* [异常处理](2017-02-03-php-language-reference.md#exceptions)
* [生成器](2017-02-03-php-language-reference.md#generators)
* [引用的解释](2017-02-03-php-language-reference.md#references-explained)
* [预定义变量](2017-02-03-php-language-reference.md#predefined-variables)
* [预定义异常](2017-02-03-php-language-reference.md#predefined-exceptions)
* [预定义接口](2017-02-03-php-language-reference.md#predefined-interfaces-and-classes)
* [上下文选项和参数](2017-02-03-php-language-reference.md#context-option-and-paramenters)
* [支持的协议和封装的协议](2017-02-03-php-language-reference.md#supported-protocols)

## 基本语法

### 1. PHP 标记

当解析一个文件时，PHP 会寻找起始和结束标记，也就是 &lt;?php 和 ?&gt;，这告诉 PHP 开始和停止解析二者之间的代码。此种解析方式使得 PHP 可以被嵌入到各种不同的文档中去，而任何起始和结束标记之外的部分都会被 PHP 解析器忽略。

PHP 也允许使用短标记 &lt;? 和 ?&gt;，但不鼓励使用。只有通过激活 php.ini 中的 `short_open_tag` 配置指令或者在编译 PHP 时使用了配置选项 --enable-short-tags 时才能使用短标记。

如果文件内容是纯 PHP 代码，最好在文件末尾删除 PHP 结束标记。这可以避免在 PHP 结束标记之后万一意外加入了空格或者换行符，会导致 PHP 开始输出这些空白，而脚本中此时并无输出的意图。

```php
<?php

echo "Hello world";

// 脚本至此结束，并无PHP 结束标记
```

| Version | Description |
| :--- | :--- |
| 7.0.0 | The ASP tags &lt;%, %&gt;, &lt;%=, and the script tag \ are removed from PHP |
| 5.4.0 | The tag &lt;?= is always available regardless of the short\_open\_tag ini setting. |

### 2. 从HTML中分离

凡是在一对开始和结束标记之外的内容都会被 PHP 解析器忽略，这使得 PHP 文件可以具备混合内容。 可以使 PHP 嵌入到 HTML 文档中去，如下例所示。

```php
<p>这里是 HTML 文件内容不会被解析</p>
<?php echo '这里的内容会被解析'; ?>
<p>这里的内容也不会被解析</p>
```

### 3. 指令分隔符

PHP需要在每个语句后面用分好结束指令。一段PHP 代码中的结束标记隐含表示了一个分好;在一个PHP 代码汇总的最后一行可以不用分号结束。如果后面还有新行，则代码段的结束标记包含了行结束。

Note: 文件末尾的 PHP 代码段结束标记可以不要，有些情况下当使用 include 或者 require 时省略掉会更好些，这样不期望的空白符就不会出现在文件末尾，之后仍然可以输出响应标头。在使用输出缓冲时也很便利，就不会看到由包含文件生成的不期望的空白符.

```php
<?php
    echo "This is a test";
?>

<?php echo "this is a test" ?>

<?php echo "We omitted the last closing tag";
```

One thing to remember is, if you decide to omit the closing PHP tag, then the last line of the file should be ended with semi colon. If you add the closing tag then last line doesn't need to end with semi colon.

```php
<?php
echo "First line";
echo "Last line"
```

The above code throws error as it neither has closing tag nor semicolon ending. So it should be replaced with either of the below two

```php
<?php
echo "First line";
echo "Last line";
```

or

```php
<?php
echo "First line";
echo "Last line" ?>
```

### 4. 注释

PHP支持C, C++和 Unix Shell 风格的注释

```php
<?php

echo "This is a test"; // This is a one-line c++ style comment

/**
 * This is a multi line comment
 * yet another line of comment
 */

echo "This is yet another test";
echo "One Final Test"; # This is a one-line shell-style comment
```

## 类型

### 0. 简介

* 四中变量类型
  * [boolena](2017-02-03-php-language-reference.md#boolena)
  * [integer](2017-02-03-php-language-reference.md#integer)
  * [float \(dobule\)](2017-02-03-php-language-reference.md#float)
  * [string](2017-02-03-php-language-reference.md#string)
* 两种复合类型
  * [array](2017-02-03-php-language-reference.md#array)
  * [object](2017-02-03-php-language-reference.md#object)
* 两种特殊类型
  * [resource](https://github.com/pemako/pemako.github.io/tree/47cb5a2dee3e03dae8535254262fabbffee059e9/_posts/php/resource/README.md)
  * [NULL](2017-02-03-php-language-reference.md#null)
* 伪类型
  * [mixed](2017-02-03-php-language-reference.md#mixed)
  * [number](2017-02-03-php-language-reference.md#number)
  * [callback](2017-02-03-php-language-reference.md#callback)

### 1. Boolena 布尔类型

当转换为 Boolena 值时，以下值被认为 FALSE：

* `the boolena FALSE itself`
* `the integer 0(zero)`
* `the float 0.0(zero)`
* `the empty string, and the string "0"`
* `the array with zero elements`
* `the special type NULL (including unset variables)`
* `SimpleXML objects created from empty tags`

### 2. Integer 整型

整型值可以使用十进制，十六进制，八进制或二进制表示，前面可以加上可选的符号（- 或者 +）。

二进制表达的 integer 自 PHP 5.4.0 起可用。

要使用八进制表达，数字前必须加上 0（零）。要使用十六进制表达，数字前必须加上 0x。要使用二进制表达，数字前必须加上 0b。

整型数的字长和平台有关，PHP 不支持无符号整数。Integer 值的字长可以用常量`PHP_INT_SIZE`来表示，自PHP4.4.0和 PHP5.0.5后，最大值可以用常量`PHP_INT_MAX` 来表示。

Warning: 如果向八进制数传递了一个非法数字\(即8或9\),则后面其余的数字会被忽略

```php
<?php
// 下面这一句在 PHP5.4.16运行正常
// php 7.0.x PHP Parse error:  Invalid numeric literal
var_dump(01090); // 八进制010 = 十进制 8
```

### 3. Float 浮点型

浮点型（也叫浮点数 float，双精度数 double 或实数 real）.浮点数的字长和平台相关。

浮点数的精度有限。尽管取决于系统，PHP 通常使用 IEEE 754 双精度格式，则由于取整而导致的最大相对误差为 1.11e-16。非基本数学运算可能会给出更大误差，并且要考虑到进行复合运算时的误差传递。

此外，以十进制能够精确表示的有理数如 0.1 或 0.7，无论有多少尾数都不能被内部所使用的二进制精确表示，因此不能在不丢失一点点精度的情况下转换为二进制的格式。这就会造成混乱的结果：例如，floor\(\(0.1+0.7\)x10\) 通常会返回 7 而不是预期中的 8，因为该结果内部的表示其实是类似 7.9999999999999991118...。

所以永远不要相信浮点数结果精确到了最后一位，也永远不要比较两个浮点数是否相等。如果确实需要更高的精度，应该使用任意精度数学函数或者 gmp 函数。

要测试浮点数是否相等，要使用一个仅比该数值大一丁点的最小误差值。该值也被称为机器极小值（epsilon）或最小单元取整数，是计算中所能接受的最小的差别值。

```php
<?php
// $a 和 $b 在小数点后五位精度内都是相等的
$a = 1.23456789;
$b = 1.23456780;
$epsilon = 0.00001;

if(abs($a-$b) < $epsilon) {
    echo "true";
}
```

`NaN` 某些数学运算会产生一个由常量 NAN 所代表的结果。此结果代表着一个在浮点数运算中未定义或不可表述的值。任何拿此值与其它任何值进行的松散或严格比较的结果都是 FALSE.

由于 NAN 代表着任何不同值，不应拿 NAN 去和其它值进行比较，包括其自身，应该用 is\_nan\(\) 来检查。

### 4 String 字符串

* 字符串的四中表示方法
  * [单引号](2017-02-03-php-language-reference.md#single-quotes)
  * [双引号](2017-02-03-php-language-reference.md#double-quotes)
  * [heredoc 语法结构](2017-02-03-php-language-reference.md#heredoc)
  * [nowdoc 语法结构](2017-02-03-php-language-reference.md#nowdoc) `php5.3.0起`

#### 单引号

Note: 不像双引号和 heredoc 语法结构，在单引号字符串中的变量和特殊字符的转义序列将不会被替换。

#### 双引号

如果字符串是包围在双引号（"）中， PHP 将对一些特殊的字符和变量进行解析。

#### heredoc 语法结构

第三种表达字符串的方法是用 heredoc 句法结构：\&lt;\&lt;\&lt;。在该运算符之后要提供一个标识符，然后换行。接下来是字符串 string 本身，最后要用前面定义的标识符作为结束标志。

结束时所引用的标识符必须在该行的第一列，而且，标识符的命名也要像其它标签一样遵守 PHP 的规则：只能包含字母、数字和下划线，并且必须以字母和下划线作为开头。

`Warning`要注意的是结束标识符这行除了可能有一个分号（;）外，绝对不能包含其它字符。这意味着标识符不能缩进，分号的前后也不能有任何空白或制表符。更重要的是结束标识符的前面必须是个被本地操作系统认可的换行，比如在 UNIX 和 Mac OS X 系统中是 \n，而结束定界符（可能其后有个分号）之后也必须紧跟一个换行。

```php
<?php
# 1 非法的示例
class foo {
    public $bar = <<<EOT
bar
    EOT;
}
?>

# 2 正确的示例
$str = <<<EOD
Example of string spanning multiple lines
useing heredoc syntax.
EOD;

/*含有变量的更复杂的示例*/
class foo
{
    var $foo;
    var $bar;

    function foo()
    {
        $this->foo = 'Foo';
        $this->bar = array('Bar1', 'Bar2', 'Bar3');
    }
}

$foo = new foo();
$name = 'MyName';

echo <<<EOT
My name is "$name". I am printing some $foo->foo.
Now, I am printing some {$foo->bar[1]}.
This should print a capital 'A': \x41
EOT;
// 输出结果如下
My name is "MyName". I am printing some Foo.
Now, I am printing some Bar2.
This should print a capital 'A': A
```

在 PHP 5.3.0 以后，也可以用 Heredoc 结构来初始化静态变量和类的属性和常量，还可以在 Heredoc 结构中庸双引号来声明标识符。

```php
<?php
// 静态变量
function foo() {
    static $bar = <<<LABEL
Nothing in here...
LABEL;
}

// 类的常量，属性
class foo {
    const BAR = <<<FOOBAR
Constant example
FOOBAR;

    public $baz = <<<"FOOBAR"
property example
FOOBAR;
}
```

#### nowdoc 语法结构

就象 heredoc 结构类似于双引号字符串，Nowdoc 结构是类似于单引号字符串的。Nowdoc 结构很象 heredoc 结构，但是 nowdoc 中不进行解析操作。这种结构很适合用于嵌入 PHP 代码或其它大段文本而无需对其中的特殊字符进行转义。与 SGML 的 CDATA 结构是用来声明大段的不用解析的文本类似，nowdoc 结构也有相同的特征。

一个 nowdoc 结构也用和 heredocs 结构一样的标记 \&lt;\&lt;\&lt;， 但是跟在后面的标识符要用单引号括起来，即 \&lt;\&lt;\&lt;'EOT'。Heredoc 结构的所有规则也同样适用于 nowdoc 结构，尤其是结束标识符的规则。

```php
<?php
$str = <<<'EOD'
Example of string useing nowdoc syntax.
EOD;

class foo
{
    var $foo;
    var $bar;

    function foo()
    {
        $this->foo = 'Foo';
        $this->bar = array('Bar1', 'Bar2', 'Bar3');
    }
}

$foo = new foo();
$name = 'MyName';

echo <<<'EOT'
My name is "$name". I am printing some $foo->foo.
Now, I am printing some {$foo->bar[1]}.
This should print a capital 'A': \x41
EOT;
// 内用将原样输出不做解析
```

### 5. Array 数组

PHP中的数组实际上是一个有序映射。映射是一种把 values 关联到 keys 的类型。定义数组使用 array\(\), 自5.4起可以使用短数组定义语法,用`[]`替代 array\(\)。

key 可以是 integer 或者 string。value 可以是任意类型。此外 key 会有以下强制转换规则

* 包含有合法整型值的字符串会被转换为整型。例如键名 "8" 实际会被储存为 8。但是 "08" 则不会强制转换，因为其不是一个合法的十进制数值。
* 浮点数也会被转换为整型，意味着其小数部分会被舍去。例如键名 8.7 实际会被储存为 8。
* 布尔值也会被转换成整型。即键名 true 实际会被储存为 1 而键名 false 会被储存为 0。
* Null 会被转换为空字符串，即键名 null 实际会被储存为 ""。
* 数组和对象不能被用为键名。坚持这么做会导致警告：Illegal offset type。

如果在数组定义中多个单元都使用了同一个键名，则只使用了最后一个，之前的都被覆盖了。

Note:

* 自 PHP5.4起可以用数组间接引用函数或方法调用的结果。之前只能通过一个临时变量
* 自 PHP5.5起可以用数组间接引用一个数组原型
* 试图访问一个未定义的数组键名与访问任何未定义变量一样：会导致 E\_NOTICE 级别错误信息，其结果为 NULL。

```php
<?php

# 数组间接引用
function getArray() {
    return array(1, 2, 3);
}

// on PHP 5.4
$secondElement = getArray()[1];

// previously
$tmp = getArray();
$secondElement = $tmp[1];

// or
list(, $secondElement) = getArray();
```

```php
<?php
$arr = [5=>1, 12=>2];
$arr[] = 56; // This is the same as $arr[13] = 56 at this point of the script
$arr["x"] = 42; // This adds a new element to the array with key "x"
unset($arr[5]); // This removes the element form the array
unset($arr); // This deletes the whole array
```

* 如上所述，如果给出方括号但没有指定键名，则取当前最大整数索引值，新的键名将是该值加上 1（但是最小为 0）。如果当前还没有整数索引，则键名将为 0。
* unset\(\) 函数允许删除数组中的某个键。但要注意数组将不会重建索引。如果需要删除后重建索引，可以用 array\_values\(\) 函数。

```php
<?php
$a = [1=>'one', 2=>'two', 3=>'three'];
unset($a[2]);
// 现在$a = [1 => 'one', 3=>'three'] 
$b = array_values($a);
// Now $b is [0=>'one', 1=>'three']
```

### 6. Object 对象

* 要创建一个新的对象 object，使用 new 语句实例化一个类
* 如果将一个对象转换成对象，它将不会有任何变化。如果其它任何类型的值被转换成对象，将会创建一个内置类 stdClass 的实例。如果该值为 NULL，则新的实例为空。数组转换成对象将使键名成为属性名并具有相对应的值。对于任何其它的值，名为 scalar 的成员变量将包含该值。
* 详细讨论请参考下面[类与对象](2017-02-03-php-language-reference.md#class-and-obj)

```php
<?php
class foo {
    function do_foo() {
        echo "Doing foo.";
    }
}

$bar = new foo;
$bar->do_foo();

# 转换为对象
$obj = (object)'ciao';
echo $obj->scalar; // outputs 'ciao'

// In PHP 7 there are a few ways to create an empty object:
$obj1 = new \stdCalss; // Instantiate stdClass object
$obj2 = new class{}; // Instantiate anonymous class
$obj3 = (object)[];  // Cast empty array to object

var_dump($obj1); // object(stdClass)#1 (0) {}
var_dump($obj2); // object(class@anonymous)#2 (0) {}
var_dump($obj2); // object(stdClass)#1 (0) {}

// $obj1 and $obj3 are the same type, but $obj1 !== $obj3. Also, all three will json_encode() to a simple JS object {}:

echo json_encode([
    new \stdClass,
    new class{},
    (object)[],
]);
// Output: [{},{},{}]
```

### 7. Resource 资源类型

* 资源 resource 是一种特殊变量，保存了到外部资源的一个引用。资源是通过专门的函数来建立和使用的。所有的这些函数及其相应资源类型见[附录](http://nl3.php.net/manual/zh/resource.php)
* 资源类型可以通过`get_resource_type` 函数获取
* PHP Zend 引擎会自动检查一个资源不在被引用，资源使用的所有外部资源都会被垃圾回收系统释放。很少需要手工释放内存
* Note: 持久化链接比较特殊，它们不会被垃圾回收系统销毁。参见[数据库永久链接](http://nl3.php.net/manual/zh/features.persistent-connections.php)一章

```php
<?php

$c = mysql_connect();
echo get_resource_type($c); // mysql link

$fp = fopen("foo", "w");
echo get_resource_type($fp); // file
```

### 8. NULL

* 特殊的 NULL 值表示一个变量没有值。NULL 类型唯一可能的值就是 NULL。
* NULL 类型只有一个值，就是不区分大小写的常量 NULL。
* NULL 类型只有一个值，就是不区分大小写的常量 NULL。
  * 被赋值为 NULL
  * 尚未被赋值
  * 被 unset\(\)
* 使用 is\_null\(\) 函数监测一个值是否为 null

### 9. Callback 回调类型

* 自 PHP 5.4 起可用 callable 类型指定回调类型 callback
* 回调函数的参数可以是下面几种情况
  * 一个 PHP 的函数以 string 类型传递其名称。可以使用任何内置或用户自定义函数，但除了语言结构例如：array\(\)，echo，empty\(\)，eval\(\)，exit\(\)，isset\(\)，list\(\)，print 或 unset\(\)。
  * 一个已实例化的对象的方法被作为数组传递，下标 0 包含该对象，下标 1 包含方法名。
  * 静态类方法也可不经实例化该类的对象而传递，只要在下标 0 中包含类名而不是对象。自 PHP 5.2.3 起，也可以传递 'ClassName::methodName'。
  * 除了普通的用户自定义函数外，create\_function\(\) 可以用来创建一个匿名回调函数。自 PHP 5.3.0 起也可传递 closure 给回调参数。

```php
<?php

function my_callback_function() {
    echo "hello world";
}

// An example callback method
class MyClass {
    static function myCallbackMethod() {
        echo "Hello World!";
    }
}

// Type1 : Simple callback
call_user_func('my_callback_function');

// Type2 : Static class method call
call_user_func(['MyClass', 'myCallbackMethod']);

// Type3 : Object method call
$obj = new MyClass();
call_user_func([$obj, 'myCallbackMethod']);

// Type4 : Static calss method call (As of PHP 5.2.3)
call_user_func('MyClass::myCallbackMethod');

// Type5 : Relative static calss method call(As of PHP 5.3.0)
class A {
    public static function who() {
        echo "A\n";
    }
}

class B extends A {
    public static function who() {
        echo "B\n";
    }
}

call_user_func(['B', 'parent::who']); // A

// Type6 : Objects implementing __invoke can be used as callables (since PHP 5.3)
class C {
    public function __invoke($name) {
        echo "Hello ", $name, "\n";
    }
}

$c = new C();
call_user_func($c, 'PHP!'); // Hello PHP!
```

Closure 的示例

```php
<?php

$double = function($a) {
    return $a * 2;
};

$numbers = range(1, 5);

$new_numbers = array_map($double, $numbers);
print implode(' ', $new_numbers); // 2 4 6 8 10
```

### 10. 伪类型与变量

* mixed 说明一个参数可以接受多种不同的（但不一定是所有的）类型
  * 例如 gettype\(\) 可以接受所有的 PHP 类型，str\_replace\(\) 可以接受字符串和数组
* number 说明一个参数可以是 integer 或者 float
* 本文档中在 PHP 5.4 引入 callable 类型之前使用 了 callback 伪类型。二者含义完全相同。
* void 作为返回类型意味着函数的返回值是无用的。void 作为参数列表意味着函数不接受任何参数。

### 11. 类型转换的判别

* 允许的强制转换有
  * \(int\), \(integer\) - 转换为整形 integer
  * \(bool\), \(boolean\) - 转换为布尔类型 boolean
  * \(float\), \(double\), \(real\) - 转换为浮点型 float
  * \(string\) - 转换为字符串 string
  * \(array\) - 转换为数组 array
  * \(object\) - 转换为对象 object
  * \(unset\) - 转换为 NULL \(PHP 5\)

## 变量

### 0. 基础

* PHP 中的变量用一个美元符号后面跟变量名来表示。变量名是区分大小写的
* 一个有效的变量名由字母或者下划线开头，后面跟上任意数量的字母，数字，或者下划线
* 按照正常的正则表达式，它将被表述为：'\[a-zA-Z\_\x7f-\xff\]\[a-zA-Z0-9\_\x7f-\xff\]\*'
* $this 是一个特殊的变量，它不能被赋值
* 变量默认总是传值赋值,那也就是说，当将一个表达式的值赋予一个变量时，整个原始表达式的值被赋值到目标变量。这意味着，例如，当一个变量的值赋予另外一个变量时，改变其中一个变量的值，将不会影响到另外一个变量
* PHP 也提供了另外一种方式给变量赋值：引用赋值。这意味着新的变量简单的引用（换言之，"成为其别名"或者"指向"）了原始变量。改动新的变量将影响到原始变量，反之亦然
* 使用引用赋值，简单地将一个 & 符号加到将要赋值的变量前（源变量）
* `Note:`那就是只有有名字的变量才可以引用赋值
* 虽然在 PHP 中并不需要初始化变量，但对变量进行初始化是个好习惯

### 1. 预定义变量

* $GLOBALS - 引用全局作用于中可用的全部变量
* $GLOBALS - 引用全局作用域中可用的全部变量
* $\_SERVER - 服务器和执行环境信息
* $\_GET - HTTP GET 变量
* $\_POST - HTTP POST 变量
* $\_FILES - HTTP 文件上传变量
* $\_REQUEST - HTTP Request 变量
* $\_SESSION - Session 变量
* $\_ENV - 环境变量
* $\_COOKIE - HTTP Cookies
* $php\_errormsg - 前一个错误信息
* $HTTP\_RAW\_POST\_DATA - 原生POST数据
* $http\_response\_header - HTTP 响应头
* $argc - 传递给脚本的参数数目
* $argv - 传递给脚本的参数数组

### 2. 变量的范围

* 变量的范围机它定义的上下文北京。大部分 php 变量只有一个单独的范围。这个单独的范围快读同样包含了 include和 require 引入的文件。

```php
<?php
// filename: b.php
$a = "demo";
?>

<?php
include "b.php";
echo $a; // demo
```

* PHP 中全局变量在函数中使用时必须声明为 global
* 在全局范围内访问变量的第二个办法，是用特殊的 PHP 自定义 $GLOBALS 数组
* 使用静态变量\(static variable\).静态变量尽在局部函数中存在，但当程序执行离开次作用域时，其值并不丢失
* 如果在解析表达式的记过对静态变量赋值会导致解析错误，静态声明是在编译时解析的

```php
<?php
# 全局变量
$a = 1;
$b = 2;

function Sum() {
    $GLOBALS['b'] = $GLOBALS['a'] + $GLOBALS['b']; // 等同于下面两行
    // global $a, $b;
    // $b = $a + $b;
}

Sum();
echo $b; // 3

# 静态变量
function foo() {
    static $int = 0;
    static $int2 = 1 + 2; // wrong
    static $int3 = sqrt(121); // wrong
}
```

### 3. 可变变量

* 要将可变变量用于数组，必须解决一个模棱两可的问题。这就是当写下 $$a\[1\] 时，解析器需要知道是想要 $a\[1\] 作为一个变量呢，还是想要 $$a 作为一个变量并取出该变量中索引为 \[1\] 的值。解决此问题的语法是，对第一种情况用 ${$a\[1\]}，对第二种情况用 ${$a}\[1\]
* 类的属性也可以通过可变属性名来访问。可变属性名将在该调用所处的范围内被解析。例如，对于 $foo-&gt;$bar 表达式，则会在本地范围来解析 $bar 并且其值将被用于 $foo 的属性名。对于 $bar 是数组单元时也是一样。
* 也可使用花括号来给属性名清晰定界。最有用是在属性位于数组中，或者属性名包含有多个部分或者属性名包含有非法字符时

### 4. 来自PHP之外的变量

* 用户表单提交的变量。
  * 变量名中的点和空格被转换成下划线。例如 \ 变成了 $\_REQUEST\["a\_b"\]。
  * Note: 之所以把提交name="a.b" 转为 a\_b 是因为如果接收的 $a.b 不是一个合法的变量名，所以会自动转换为下划线
  * \  这种情况下不会转 POST 接收的数据 为$\_POST\['psersonal'\]\['a.b'\]    

```php
<?php
if (isset($_POST['action']) && $_POST['action'] == 'submitted') {
    echo '<pre>';

    print_r($_POST);
    echo '<a href="'. $_SERVER['PHP_SELF'] .'">Please try again</a>';

    echo '</pre>';
} else {
?>
<form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
    Name:  <input type="text" name="personal[name]"><br />
    Email: <input type="text" name="personal[email]"><br />
    Test1: <input type="text" name="a b"><br />
    Test2: <input type="text" name="c.d"><br />
    Beer: <br>
    <select multiple name="beer[]">
        <option value="warthog">Warthog</option>
        <option value="guinness">Guinness</option>
        <option value="stuttgarter">Stuttgarter Schwabenbr</option>
    </select><br />
    <input type="hidden" name="action" value="submitted" />
    <input type="submit" name="submit" value="submit me!" />
</form>
<?php
}
?>
/*
Array
(
    [personal] => Array
        (
            [name] => pemako
            [email] => pemako@126.com
        )

    [a_b] => a b
    [c_d] => c.d
    [beer] => Array
        (
            [0] => guinness
            [1] => stuttgarter
        )

    [action] => submitted
    [submit] => submit me!
)
*/
```

* image submit 变量名
  * 当提交表单时，可以用一幅图像代替标准的提交按钮，用类似下面的标记
  * \
  * 当用户点击到图像中的某处时，相应的表单会被传送到服务器，并加上两个变量 sub\_x 和 sub\_y。它们包含了用户点击图像的坐标。有经验的用户可能会注意到被浏览器发送的实际变量名包含的是一个点而不是下划线（即 sub.x 和 sub.y），但 PHP 自动将点转换成了下划线。

## 常量

* 常量默认大小写敏感，传统上常量标识符总是大写
* 常量名和其它任何 PHP 标签遵循同样的命名规则
* 常量定义使用 define  const\(php 5.3以后生效\)

```php
<?php

define("CONSTANT1", "Hello world."); // 5.3 之前只能用 define 函数

// Works as of PHP 5.3.0
const CONSTANT = 'Hello World';

echo CONSTANT;

// Works as of PHP 5.6.0
const ANOTHER_CONST = CONSTANT.'; Goodbye World';
echo ANOTHER_CONST;

const ANIMALS = array('dog', 'cat', 'bird');
echo ANIMALS[1]; // outputs "cat"

// Works as of PHP 7
define('ANIMALS', array(
    'dog',
    'cat',
    'bird'
));
echo ANIMALS[1]; // outputs "cat"
```

* 魔术常量有八个魔术常量它们的值随着它们在代码中的位置改变而改变,这些特殊的常量不区分大小写。
  * \_\_LINE\_\_ 文件中当前的行号
  * \_\_FILE\_\_ 文件的完整路径和文件名
  * \_\_DIR\_\_  文件所在的目录
  * \_\_FUNCTION\_\_ 函数名称，自PHP5起常量返回该函数被定义的名字\(区分大小写\)
  * \_\_CLASS\_\_ 类的名称
  * \_\_TRAIT\_\_ Trait 的名字 php5.4.0 新加，
  * \_\_METHOD\_\_ 类的方法名，返回该方法被定义时的名字
  * \_\_NAMESPACE\_\_ 当前命名空间的名称（区分大小写）此常量在编译时定义的5.3.0新增

## 表达式

最基本的表达式形式是常量和变量。稍微复杂的表达式例子就是函数。PHP 是一种面向表达式的语言，从这一方面来讲几乎一切都是表达式。

## 运算符

运算符可以按照其能接受几个值来分组。一元运算符只能接受一个值，如`!, ++,--`。二元运算符可接受两个值。最后一种是三元运算符`?:`。

* 运算符优先级
  * 下表按照优先级从高到低累出了运算符。同一行中的运算符具有相同优先级，此时它们结合方向决定求值顺序

| 结合方向 | 运算符 | 附加信息 |
| :---: | :---: | :---: |
| 无 | clone new | clone 和 new |
| 左 | \[ | array\(\) |
| 右 | \*\* | 算术运算符 |
| 右 | ++ -- ~ \(int\) \(float\) \(string\) \(array\) \(object\) \(bool\) @ | 类型和递增／递减 |
| 无 | instanceof | 类型 |
| 右 | ! | 逻辑运算符 |
| 左 | \* / % | 算术运算符 |
| 左 | + - . | 算术运算符和字符串运算符 |
| 左 | &lt;&lt; &gt;&gt; | 位运算符 |
| 无 | &lt; &lt;= &gt; &gt;= | 比较运算符 |
| 无 | == != === !== &lt;&gt; &lt;=&gt; | 比较运算符 |
| 左 | & | 位运算符和引用 |
| 左 | ^ | 位运算符 |
| 左 | \| | 位运算符 |
| 左 | && | 逻辑运算符 |
| 左 | \|\| | 逻辑运算符 |
| 左 | ?? | 比较运算符 |
| 左 | ? : | ternary |
| right | = += -= \*= \*\*= /= .= %= &= \|= ^= &lt;&lt;= &gt;&gt;= | 赋值运算符 |
| 左 | and | 逻辑运算符 |
| 左 | xor | 逻辑运算符 |
| 左 | or | 逻辑运算符 |

* 算术运算符
  * 取模运算符的操作数在运算之前都会转换成整数\(除去小数部分\)
  * 取模运算符 % 的结果和被除数的符号（正负号）相同。即 $a % $b 的结果和 $a 的符号相同

| 例子 | 名称 | 结果 |
| :--- | :--- | :--- |
| $a % $b | 取模 | $a除以$b 的余数 |

```php
<?php
echo (5 % 3)."\n";           // prints 2
echo (5 % -3)."\n";          // prints 2
echo (-5 % 3)."\n";          // prints -2
echo (-5 % -3)."\n";         // prints -2
```

* 赋值运算符
  * 基本的赋值运算符是"="。一开始可能会以为它是"等于"，其实不是的。它实际上意味着把右边表达式的值赋给左边的运算数。
  * 引用赋值意味着两个变量指向了同一个数据，没有拷贝任何东西
  * 自 PHP 5 起，new 运算符自动返回一个引用，因此再对 new 的结果进行引用赋值在 PHP 5.3 以及以后版本中会发出一条 E\_DEPRECATED 错误信息，在之前版本会发出一条 E\_STRICT 错误信息
  * _注意赋值运算将原变量的值拷贝到新变量中（传值赋值），所以改变其中一个并不影响另一个_
  * _在 PHP 中普通的传值赋值行为有个例外就是碰到对象 object 时，在 PHP 5 中是以引用赋值的，除非明确使用了 clone 关键字来拷贝_

```php
<?php
$a = 3;
$b = &$a; // $b 是 $a 的引用

print "$a\n"; // 输出 3
print "$b\n"; // 输出 3

$a = 4; // 修改 $a

print "$a\n"; // 输出 4
print "$b\n"; // 也输出 4，因为 $b 是 $a 的引用，因此也被改变
```

* 位运算符
  * 位运算符允许对整型数中指定的位进行求值和操作

| 例子 | 名称 | 结果 |
| :---: | :---: | :---: |
| $a & $b | And（按位与） | 将把 $a 和 $b 中都为 1 的位设为 1 |
| $a \| $b | Or（按位或） | 将把 $a 和 $b 中任何一个为 1 的位设为 1 |
| $a ^ $b | Xor（按位异或） | 将把 $a 和 $b 中一个为 1 另一个为 0 的位设为 1 |
| ~ $a | Not（按位取反） | 将 $a 中为 0 的位设为 1，反之亦然 |
| $a &lt;&lt; $b | Shift left（左移） | 将 $a 中的位向左移动 $b 次（每一次移动都表示乘以 2） |
| $a &gt;&gt; $b | Shift right（右移） | 将 $a 中的位向右移动 $b 次（每一次移动都表示除以 2 |

* 比较运算符
  * 如果比较一个数字和字符串或者比较涉及到数字内容的字符串，则字符串会被转换为数值并且比较按照数值来进行。此规则也适用于 switch 语句
  * 当用 === 或 !== 进行比较时则不进行类型转换，因为此时类型和数值都要比对
* 错误控制运算符
  * PHP 支持一个错误控制运算符：@。当将其放置在一个 PHP 表达式之前，该表达式可能产生的任何错误信息都被忽略掉
  * 如果用 set\_error\_handler\(\) 设定了自定义的错误处理函数，仍然会被调用，但是此错误处理函数可以（并且也应该）调用 error\_reporting\(\)，而该函数在出错语句前有 @ 时将返回 0
  * 如果激活了 track\_errors 特性，表达式所产生的任何错误信息都被存放在变量 $php\_errormsg 中。此变量在每次出错时都会被覆盖，所以如果想用它的话就要尽早检查
  * @ 运算符只对表达式有效。对新手来说一个简单的规则就是：如果能从某处得到值，就能在它前面加上 @ 运算符
    * 可以把它放在变量，函数和 include 调用，常量，等等之前
    * 不能把它放在函数或类的定义之前，也不能用于条件结构例如 if 和 foreach 等
* 执行运算符

PHP 支持一个执行运算符：反引号（\`\`）。PHP 将尝试将反引号中的内容作为 shell 命令来执行，并将其输出信息返回（即，可以赋给一个变量而不是简单地丢弃到标准输出）。使用反引号运算符"\`"的效果与函数 shell\_exec\(\) 相同。

_反引号运算符在激活了安全模式或者关闭了 shell\_exec\(\) 时是无效的_

_与其它某些语言不同，反引号不能在双引号字符串中使用_

```php
<?php
$output = `ls -al`;
echo "<pre>$output</pre>";
```

* 递增／递减运算符

**递增／递减运算符不影响布尔值。递减 NULL 值也没有效果，但是递增 NULL 的结果是 1**

| 例子 | 名称 | 结果 |
| :---: | :---: | :---: |
| ++$a | 前加 | $a 的值加一，然后返回 $a |
| $a++ | 后加 | 返回$a,然后将$a 的值加一 |
| --$a | 前减 | $a 的值减一，然后返回 $a |
| $a-- | 后减 | 返回$a ，然后将$a的值减一 |

* 逻辑运算符

And 、Or、Xor\(异或\)、Not、

* 字符串运算符

有两个字符串（string）运算符。第一个是连接运算符（"."），它返回其左右参数连接后的字符串。第二个是连接赋值运算符（".="），它将右边参数附加到左边的参数之后

* 数组运算符
  * $a+$b 意思为$a和$b 的联合
    * + 运算符把右边的数组元素附加到左边的数组后面，两个数组中都有的键名，则只用左边数组中的，右边的被忽略
  * $a == $b 如果$a 和$b 具有相同的健/值对则为 True
  * $a === $b 如果 $a 和 $b 具有相同的键／值对并且顺序和类型都相同则为 TRUE
  * $a !== $b 如果 $a 不全等于 $b 则为 TRUE

```php
<?php
$a = array("a" => "apple", "b" => "banana");
$b = array("a" => "pear", "b" => "strawberry", "c" => "cherry");

$c = $a + $b; // Union of $a and $b
echo "Union of \$a and \$b: \n";
var_dump($c);

$c = $b + $a; // Union of $b and $a
echo "Union of \$b and \$a: \n";
var_dump($c);

$a += $b; // Union of $a += $b is $a and $b
echo "Union of \$a += \$b: \n";
var_dump($a);

$a = array("apple", "banana");
$b = array(1 => "banana", "0" => "apple");

var_dump($a == $b); // bool(true)
var_dump($a === $b); // bool(false)

/* output
Union of $a and $b:
array(3) {
  ["a"]=>
  string(5) "apple"
  ["b"]=>
  string(6) "banana"
  ["c"]=>
  string(6) "cherry"
}
Union of $b and $a:
array(3) {
  ["a"]=>
  string(4) "pear"
  ["b"]=>
  string(10) "strawberry"
  ["c"]=>
  string(6) "cherry"
}
Union of $a += $b:
array(3) {
  'a' =>
  string(5) "apple"
  'b' =>
  string(6) "banana"
  'c' =>
  string(6) "cherry"
}
*/
```

* 类型运算符
  * instanceof 用于确定一个 PHP 变量是否属于某一个类 class 的实例
  * instanceof 也可以确定一个变量是不是继承自某一父类的子类的实例
  * 检查一个对象是否不是某个类的实例，可以使用逻辑运算符 not
  * instanceof 也可以确定一个变量是不是实现了某个接口的对象的实例
  * 虽然 instanceof 通常直接与类名一起使用，但也可以使用对象或字符串变量
  * 如果被检测的变量不是对象，instanceof 并不发出任何错误信息而是返回 FALSE。不允许用来检测常量

```php
<?php
# 1 对类使用 instanceof
class MyClass{}
class NotMyClass{}
$a = new MyClass;
var_dump($a instanceof MyClass); // bool(true)
var_dump($a instanceof NotMyClass); // bool(false)
?>

<?php
# 2 对继承类的使用
class ParentClass {}
class MyClass extends ParentClass {}
$a = new MyClass;
var_dump($a instanceof MyClass);    // bool(true)
var_dump($a instanceof ParentClass);// bool(true)
?>

<?php
# 3 使用 instanceof 检查对象不是某个类的实例
class MyClass {}
$a = new MyClass;
var_dump(!($a instanceof stdClass)); // bool(true)
?>

<?php
# 4 对接口使用 instanceof
interface MyInterface {}
class MyClass implements MyInterface {}
$a = new MyClass;
var_dump($a instanceof MyClass);    // bool(true)
var_dump($a instanceof MyInterface);// bool(true)
?>

<?php
# 5 对其他变量使用 instanceof
interface MyInterface {}
class MyClass implements MyInterface {}
$a = new MyClass;
$b = new MyClass;
$c = 'MyClass';
$d = 'NotMyClass';

var_dump($a instanceof $b);    //$b is an object of class MyClass bool(true)
var_dump($a instanceof $c); //$c is a string 'MyClass'  bool(true)
var_dump($a instanceof $d); //$d is a string 'NotMyClass' bool(false)
?>

<?php
# 6 用 instanceof 检测其它变量
$a = 1;
$b = NULL;
$c = imagecreate(5, 5);
var_dump($a instanceof stdClass); // $a is an integer bool(false)
var_dump($b instanceof stdClass); // $b is NULL bool(false)
var_dump($c instanceof stdClass); // $c is a resource bool(false)
var_dump(FALSE instanceof stdClass); //PHP Fatal error:  instanceof expects an object instance, constant given
```

## 流程控制

* if else / if elseif else
* 流程控制的替代语法
  * PHP 提供了一些流程控制的替代语法，包括 if，while，for，foreach 和 switch。替代语法的基本形式是把左花括号（{）换成冒号（:），把右花括号（}）分别换成 endif;，endwhile;，endfor;，endforeach; 以及 endswitch;
* while
* do-while
* for
* foreach
* break
* continue
* switch
* declare
  * 目前支持的3个指令 ticks, encoding, strict\_types\(PHP7新增\)
  * ticks\(时钟周期\)是一个在 declare 代码段中解释器每执行 N 条低级语句就会发生的事件。N 的值是在 declare 中的 directive 部分用 ticks=N 来指定。
    * 不是所有的语句都可以计时。通常条件表达式和参数表达式都不可计时
    * 每个 tick 中出现的事件都是由 register\_tick\_function\(\) 来指定,由 unregister\_tick\_function\(\)解除
  * encoding 用法
  * strict\_types 用法

```php
<?php
# 1. Tick 的用法示例

declare(ticks=1); // 如果有 register_tick_function() 表明每执行一行代码调用一次注册的函数

// A function called on each tick event
function tick_handler() {
    static $num = 0;
    $num++;
    echo "tick_handle() called $num times.\n";
}

register_tick_function('tick_handler');

$a = 1;

if($a > 0) {
    $a += 2;
    echo "$a \n";
}

/* output
tick_handler() called 1 times.
tick_handler() called 2 times.
tick_handler() called 3 times.
3
tick_handler() called 4 times.
*/
?>

<?php
# 2. Ticks 的用法 上面的代码执行顺序和下面相同
// A function called on each tick event
function tick_handler() {
    static $num = 0;
    $num++;
    echo "tick_handle() called $num times \n";
}

$a = 1;
tick_handler();

if($a > 0) {
    $a += 2;
    tick_handler();
    echo "$a \n";
    tick_handler();
}
tick_handler();
?>

<?php
# 3. Tick 调用类中的方法
declare(ticks=1);

// using a function as the callback
register_tick_function('my_function', true);

// using an object->method
$obj = new MyClass;
register_tick_function([&obj, 'my_method'], true);
?>
```

每执行一次低级语句检查一次该进程是否有未处理过的信号，测试代码如下

```php
<?php
# FileName: signal.php
declare(ticks=1);
pcntl_signal(SIGINT, function(){
    exit("Get signal SIGINT and exit\n);
});

echo "Ctl + c or run cmd : kill -SIGINT " . posix_getpid(). "\n" ;

while(true) {
    $a++;
}
/*
while output:
Ctl + c or run cmd : kill -SIGINT 62062
^CGet signal SIGINT and exit 
*/
```

```php
<?php
# 2. 使用 encoding指令来对每段脚本指定其编码方式
declare(encodng='IOS-8859-1');
// code here
// 当和命名空间结合起来时 declare 的唯一合法语法是 declare(encoding='...');
// 其中 ... 是编码的值。而 declare(encoding='...') {} 将在与命名空间结合时产生解析错误
```

```php
<?php
# 3. 使用strict_types 声明严格模式 类似于js 的 strict mode
declare(strict_types=1);

function foo(int $a): int {
    return $a * 2;
}

// 上面代码表示 foo 函数的参数和返回值必须是整数 如果不是整数的话会抛出错误
foo(1.0)
// PHP Fatal error:  Uncaught TypeError: Argument 1 passed to foo() must be of the type integer, float given
```

* return
* require / require\_once
* include / include\_once
* goto

## 函数

* 用户自定义函数
  * 函数名师大小写无关的，不过在调用函数的时候，使用其定义时相同的形式是一个好习惯
* 函数的参数
  * 默认按值传参，如果希望允许函数修改它的参数值，必须通过引用传递参数
  * 当使用默认参数时，任何默认参数必须放在任何非默认参数的右侧；否则，函数将不会按照预期的情况工作
  * 自 PHP7 后函数的参数可以限定类型 bool, float, int, string, array, callable
  * PHP5.6+ 自定义函数中支持可变数量的参数列表由 ... 语法实现
  * PHP5.5 及更早版本使用函数 func\_num\_args\(\), func\_get\_arg\(\), func\_get\_args\(\)

```php
<?php
function sum(...$numbers) {
    $acc = 0;
    foreach($numbers as $n) {
        $acc += $n;
    }
    return $acc;
}

echo sum(1, 2, 3, 4); // 10

function add($a, $b) {
    return $a + $b;
}

echo add(...[1, 2])."\n"; // 3

$a = [1, 2];
echo add(...$a); // 3
?>
```

```php
<?php

// Older version of PHP
function sum() {
    $acc = 0;
    foreach(func_get_args() as $n) {
        $acc += $n;
    }
    return $acc;
}
echo sum(1, 2, 3, 4); // 10
```

* 返回值
* 可变函数
* 内置函数[详见](2017-02-03-php-language-reference.md#function)
* 匿名函数
  * 5.3.0 可以使用匿名函数，5.4.0 $this 可用于匿名函数
  * 匿名函数也叫闭包函数，允许临时创建一个没有指定名称的函数，最经常用做回调函数参数的值。
  * 闭包也可以作为变量的值来使用
  * 闭包可以从父作用域中继承变量，任何此类变量都应该用 use 语言结果传递进去

```php
<?php
echo preg_replace_callback('/-([a-z])/', function ($match) {
    return strtoupper($match[1]);
}, 'hello-world');
// 输出 helloWorld
```

## 类与对象

* [简介](2017-02-03-php-language-reference.md#obj-introduction)
* [基本概念](2017-02-03-php-language-reference.md#obj-basics)
* [属性](2017-02-03-php-language-reference.md#obj-property)
* [类常量](2017-02-03-php-language-reference.md#obj-class-constants)
* [自动加载类](2017-02-03-php-language-reference.md#obj-autoloading)
* [构造函数和析构函数](2017-02-03-php-language-reference.md#obj-construct-and-destruct)
* [访问控制可见性](2017-02-03-php-language-reference.md#obj-visibility)
* [对象继承](2017-02-03-php-language-reference.md#obj-inheritance)
* [范围解析操作符::](2017-02-03-php-language-reference.md#obj-scope)
* [Static 关键字](2017-02-03-php-language-reference.md#obj-static)
* [抽象类](2017-02-03-php-language-reference.md#obj-abstraction)
* [对象接口](2017-02-03-php-language-reference.md#obj-interface)
* [Trait](2017-02-03-php-language-reference.md#obj-trait)
* [匿名类](2017-02-03-php-language-reference.md#obj-anonymous)
* [重载](2017-02-03-php-language-reference.md#obj-overloading)
* [遍历对象](2017-02-03-php-language-reference.md#obj-iteration)
* [魔术方法](2017-02-03-php-language-reference.md#obj-magic-method)
* [Final 关键字](2017-02-03-php-language-reference.md#obj-final)
* [对象复制](2017-02-03-php-language-reference.md#obj-cloning)
* [对象比较](2017-02-03-php-language-reference.md#obj-comparing)
* [类型约束](2017-02-03-php-language-reference.md#obj-type-hinting)
* [后期静态绑定](2017-02-03-php-language-reference.md#obj-late-static-binding)
* [对象和引用](2017-02-03-php-language-reference.md#obj-and-reference)
* [对象序列化](2017-02-03-php-language-reference.md#obj-serialization)

#### 简介

自 PHP 5 起完全重写了对象模型以得到更佳性能和更多特性。这是自 PHP 4 以来的最大变化。PHP 5 具有完整的对象模型。

PHP 5 中的新特性包括[访问控制](2017-02-03-php-language-reference.md#obj-visibility)，[抽象类](2017-02-03-php-language-reference.md#obj-abstraction)和 [final](2017-02-03-php-language-reference.md#obj-final) 类与方法，附加的[魔术方法](2017-02-03-php-language-reference.md#obj-magic-method)，[接口](2017-02-03-php-language-reference.md#obj-interface)，[对象复制](2017-02-03-php-language-reference.md#obj-cloning)和[类型约束](2017-02-03-php-language-reference.md#obj-type-hinting).

PHP 对待对象的方式与引用和句柄相同，即每个变量都持有对象的引用，而不是整个对象的拷贝。参见[对象和引用](2017-02-03-php-language-reference.md#obj-and-reference)。

#### 基本概念

每个类的定义都以关键字 class 开头，后面跟着类名，后面跟着一对花括号，里面包含有类的属性与方法的定义。

类名可以是任何非 PHP 保留字的合法标签。一个合法类名以字母或下划线开头，后面跟着若干字母，数字或下划线。以正则表达式表示为：\[a-zA-Z\_\x7f-\xff\]\[a-zA-Z0-9\_\x7f-\xff\]\*

一个类可以包含有属于自己的常量，变量（称为"属性"）以及函数（称为"方法"）。

```php
<?php
#1 简单的类定义
class SimpleClass {
    // property declaration
    public $var = 'a default value';

    // method declaration
    public function displayVar() {
        echo $this->var;
    }
}

// 当一个方法在类定义内部被调用时，有一个可用的伪变量$this。$this 是一个到主叫对象的引用
// (通常是该方法所从属的对象，但如果是从第二个对象静态调用时也可能是另一个对象)

#2 $this 伪变量的示例

class A {
    function foo() {
        if(isset($this)) {
            echo '$this is defind ('. get_class($this). ")\n";
        } else {
            echo "\$this is not defined.\n";
        }
    }
}

class B {
    function bar() {
        A::foo(); // Note: the next line will issue a warning if E_STRICT is enabled.
    }
}

$a = new A();
$a->foo(); // $this is defined (A)

A::foo();

$b = new B();
$b->bar();

B::bar();

/*
# PHP5 output 
$this is defined (A)
$this is not defined.
$this is defined (B)
$this is not defined.

# PHP7 output
$this is defined (A)
$this is not defined.
$this is not defined.
$this is not defined.
*/
```

* New 关键字
  * 要创建一个类的实例，必须使用 new 关键字。当创建新对象时该对象总是被赋值，除非该对象定义了[构造函数](2017-02-03-php-language-reference.md#obj-construct-and-destruct)并且在出错时抛出了一个异常。类应在被实例化之前定义（某些情况下则必须这样）。
  * 如果在 new 之后跟着的是一个包含有类名的字符串，则该类的一个实例被创建。如果该类属于一个名字空间，则必须使用其完整名称。
  * 在类定义内部，可是用_new self_ 和 _new parent_ 创建新对象

```php
<?php

# 创建一个实例
$instance = new SimpleClass();

// 也可以如下面这样
$className = 'SimpleClass';
$instance = new $className();
```

* ::class
  * 自 PHP 5.5 起，关键词 class 也可用于类名的解析。使用 ClassName::class 你可以获取一个字符串，包含了类 ClassName 的完全限定名称。这对使用了\[命名空间\(\#\)的类尤其有用

#### 属性

* 非静态属性访问 $this-&gt;property
* 静态属性访问 self::$property

#### 类常量

* 类中常量使用 `const` 定义 内容访问使用 self::常量名, 外部访问 ClassName::常量名

```php
<?php
class MyClass {
    const CONSTANT = 'constant test';

    function showConstant() {
        echo self::CONSTANT ."\n";
    }
}

echo MyClass::CONSTANT;

$obj = new MyClass;
$obj->showConstant();

$obj::CONSTANT; // PHP5.3.0
```

#### 自动加载类

* 定义一个`__autoload()`函数，他会在视图使用尚未定义的类的时候自动调用。
* `Tip` `spl_autoload_register()`提供了一种更加灵活的方式实现类的自动加载。因此不建议使用`__autoload()` 函数
* `Note:` 5.3.0 版本之前，`__autoload`函数抛出的异常不能被 catch 语句块捕获并会导致一个致命错误。
* 5.3.0+ `__autoload` 函数抛出的异常可以被 catch语句块捕获，但需要遵循一个条件。如果抛出的是一个自定义异常，那么必须存在相应的自定义异常类。`__autoload` 函数可以递归的自动加载自定义异常类
* 自动加载不能用于 PHP 的 CLI \( Command line interface \) 模式

```php
<?php
function __autoload($class_name) {
    require_once $class_name . '.php';
}

$obj  = new MyClass1(); // 会自定调用 __autoload() 函数并试图在当前文件夹下加载 MyClass1.php 文件
                        // 如果不存在也会抛出一个致命错误
$obj2 = new MyClass2();
?>
```

```php
<?php
// 假定当前目录下只要 MyClass1.php 没有 MyClass2.php
<?php

spl_autoload_register(function ($name) {
    if(file_exists("$name.php")) {
        require_once("$name.php");
    } else {
        throw new Exception("Unable load $name.php");
    }
});

try {
    $obj = new Class1();
    $obj2 = new Class2();
}catch(Exception $e) {
    echo $e->getMessage()."\n"
} 

// Unable load Class2.php
```

#### 构造函数和析构函数

* `__construct()` 在类创建的时候调用此方法
* `__destruct()` 在类进行销毁的时候执行此方法

#### 访问控制可见性

* public
* protected
* private

#### 对象继承

* extends

#### 范围解析操作符::

* 范围解析操作符（也可称作 Paamayim Nekudotayim）或者更简单地说是一对冒号，可以用于访问静态成员，类常量，还可以用于覆盖类中的属性和方法
* self，parent 和 static 这三个特殊的关键字是用于在类定义的内部对其属性或方法进行访问的

#### Static 关键字

* 声明类属性或方法为静态，就可以不实例化类而直接访问。静态属性不能通过一个类已实例化的对象来访问（但静态方法可以）
* 由于静态方法不需要通过对象即可调用，所以伪变量 $this 在静态方法中不可用
* 静态属性不可以由对象通过 -&gt; 操作符来访问
* 就像其它所有的 PHP 静态变量一样，静态属性只能被初始化为文字或常量，不能使用表达式。所以可以把静态属性初始化为整数或数组，但不能初始化为另一个变量或函数返回值，也不能指向一个对象
* 自 PHP 5.3.0 起，可以用一个变量来动态调用类。但该变量的值不能为关键字 self，parent 或 static。

#### 抽象类

* 定义为抽象的类不能被实例化
* 任何一个类，如果它里面至少有一个方法是被声明为抽象的，那么这个类就必须被声明为抽象的
* 继承一个抽象类的时候，子类必须定义父类中的所有抽象方法另外，这些方法的访问控制必须和父类中一样（或者更为宽松）

```php
<?php
abstract class AbstractClass
{
 // 强制要求子类定义这些方法
    abstract protected function getValue();
    abstract protected function prefixValue($prefix);

    // 普通方法（非抽象方法）
    public function printOut() {
        print $this->getValue() . "\n";
    }
}

class ConcreteClass1 extends AbstractClass
{
    protected function getValue() {
        return "ConcreteClass1";
    }

    public function prefixValue($prefix) {
        return "{$prefix}ConcreteClass1";
    }
}

class ConcreteClass2 extends AbstractClass
{
    public function getValue() {
        return "ConcreteClass2";
    }

    public function prefixValue($prefix) {
        return "{$prefix}ConcreteClass2";
    }
}

$class1 = new ConcreteClass1;
$class1->printOut();
echo $class1->prefixValue('FOO_') ."\n";

$class2 = new ConcreteClass2;
$class2->printOut();
echo $class2->prefixValue('FOO_') ."\n";

/*
ConcreteClass1
FOO_ConcreteClass1
ConcreteClass2
FOO_ConcreteClass2
*/
```

#### 对象接口

* 使用接口（interface），可以指定某个类必须实现哪些方法，但不需要定义这些方法的具体内容。
* 接口是通过 interface 关键字来定义的，就像定义一个标准的类一样，但其中定义所有的方法都是空的。
* 接口中定义的所有方法都必须是公有，这是接口的特性
* 要实现一个接口，使用 implements 操作符。类中必须实现接口中定义的所有方法，否则会报一个致命错误。类可以实现多个接口，用逗号来分隔多个接口的名称
* Note: 5.3.9 之前，指定一个类不能实现两个接口
* Note: 实现多个接口时，接口中的方法不能有重名
* Note: 接口也可以继承，通过使用`extends` 操作符
* 接口中也可以定义常量。接口常量和类常量的使用完全相同，但是不能被子类或子接口所覆盖

```php
<?php

// Declare the interface 'iTemplate'
interface iTemplate {
    public function setVariable($name, $var);
    public function getHtml($template);
}

// Implement the interface
// This will work

class Template implements iTemplate {
    private $vars = [];

    public function setVariable($name, $var) {
        $this->vars[$name] = $var;
    }

    public function getHtml($template) {
        foreach($this->vars as $name => $value) {
            $template = str_replace('{'. $name . '}', $value, $template);
            echo $template;
        }

        return $template;
    }
}


// Extendable Interfaces
interface a {
    public function foo();
}

interface b {
    public function baz(Baz $baz);
}

// This will work
class c implements b {
    // 实现 a b 两个接口的方法
    public function foo() {
    }

    public function baz(Baz $baz) {
    }
}


// Multiple interface inheritance
interface m {
    public function foo();
}

interface n {
    public function bar();
}

interface o extends m, n {
    public function baz();
}

class p implements o {
    public function foo(){}

    public function bar(){}

    public function baz(){}
}

// Interfaces with constants
interface q {
    const b = 'Interface constant';
}

//Prints: Interface constant
echo q::b;

// This will however not work because it's not allowed to override constants.
class b implements a {
    const b = 'Class constant';
}
```

#### Trait

* 自 PHP 5.4.0 起，PHP 实现了一种代码复用的方法，称为 trait
* Trait 是为类似 PHP 的单继承语言而准备的一种代码复用机制。Trait 为了减少单继承语言的限制，使开发人员能够自由地在不同层次结构内独立的类中复用 method。Trait 和 Class 组合的语义定义了一种减少复杂性的方式，避免传统多继承和 Mixin 类相关典型问题
* Trait 和 Class 相似，但仅仅旨在用细粒度和一致的方式来组合功能。 无法通过 trait 自身来实例化。它为传统继承增加了水平特性的组合；也就是说，应用的几个 Class 之间不需要继承
* 从基类继承的成员会被 trait 插入的成员所覆盖。优先顺序是来自当前类的成员覆盖了 trait 的方法，而 trait 则覆盖了被继承的方法

```php
<?php
trait HelloWorld {
    public function sayHello() {
        echo 'Hello World!';
    }
}

class TheWorldIsNotEnough {
    use HelloWorld;
    public function sayHello() {
        echo 'Hello Universe!';
    }
}

$o = new TheWorldIsNotEnough();
$o->sayHello();  // Hello Universe
```

* 通过逗号分隔，在 use 声明列出多个 trait，可以都插入到一个类中

```php
<?php
trait Hello {
    public function sayHello() {
        echo 'Hello ';
    }
}

trait World {
    public function sayWorld() {
        echo 'World';
    }
}

class MyHelloWorld {
    use Hello, World;
    public function sayExcalamtionMark() {
        echo "!";
    }
}

$o = new MyHelloWorld();
$o->sayHello();
$o->sayWorld();
$o->sayExcalamtionMark();
```

* 如果两个 trait 都插入了一个同名的方法，如果没有明确解决冲突将会产生一个致命错误
* 为了解决多个 trait 在同一个类中的命名冲突，需要使用 insteadof 操作符来明确指定使用冲突方法中的哪一个
* 以上方式仅允许排除掉其它方法，as 操作符可以将其中一个冲突的方法以另一个名称来引入

```php
<?php

# 解决两个 trait 都拥有同一个方法的冲突

trait A {
    public function smallTalk() {
        echo 'a';
    }

    public function bigTalk() {
        echo 'A';
    }
}

trait B {
    public function smallTalk() {
        echo 'b';
    }

    public function bigTalk() {
        echo 'B';
    }
}

class Talker {
    use A, B {
        // 表示用 B中的 smallTalk 替代 A 中的 samllTalk
        B::smallTalk insteadof A;
        // 表示用 A中的 bigTalk 替代 B 中的 bigTalk
        A::bigTalk insteadof B;
    }
}

$o = new Talker();
$o->smallTalk(); //b
$o->bigTalk();  // A

class Aliased_Talker {
    use A, B {
        B::smallTalk insteadof A;
        A::bigTalk insteadof B;
        B::bigTalk as talk;
    }
}

$o = new Aliased_Talker();
$o->smallTalk(); // b
$o->bigTalk();  // A
$o->talk(); // B
```

* 使用 as 语法还可以用来调整方法的访问控制

```php
<?php
trait HelloWorld {
    public function sayHello() {
        echo 'Hello World!';
    }
}

// 修改 sayHello 的访问控制
class MyClass1 {
    use HelloWorld { sayHello as protected; }
}

// 给方法一个改变了访问控制的别名
// 原来的 sayHello 的访问控制则没有发生改变

class MyClass2 {
    use HelloWorld { sayHello as private myPrivateHello; }
}

$o1 = new MyClass1();
$o1->sayHello(); // 报错访问一个受保护的方法

$o2 = new MyClass2();
$o2->sayHello();    // Hello World!

$o2->myPrivateHello(); // 报错访问一个私有的方法
```

* 正如 class 能够使用 trait 一样，其它 trait 也能够使用 trait。在 trait 定义时通过使用一个或多个 trait，能够组合其它 trait 中的部分或全部成员

```php
<?php
trait Hello {
    public function sayHello() {
        echo 'Hello';
    }
}

trait World {
    public function sayWorld() {
        echo 'World';
    }
}

trait HelloWorld {
    use Hello, World;
}

class MyHelloWorld {
    use HelloWorld;
}

$o = new MyHelloWorld();
$o->sayHello(); // Hello 
$o->sayWorld(); // World
```

* 为了对使用的类施加强制要求，trait 支持抽象方法的使用

```php
<?php
trait Hello {
    public function sayHelloWorld() {
        echo 'Hello '.$this->getWorld();
    }
    abstract public function getWorld();
}

class MyHelloWorld {
    private $world;
    use Hello;
    public function getWorld() {
        return $this->world;
    }

    public function setWorld($val) {
        $this->world = $val;
    }
}

$o = new MyHelloWorld();
$o->setWorld('demo');
echo $o->getWorld();
```

* Traits 可以定义静态的成员或方法
* Trait 同样可以定义属性

```php
<?php
trait Counter {

    public $x = 1;

    public function inc() {
        static $c = 0;
        $c = $c + 1;
        echo "$c \n";
    }

    public static function doSomething() {
        return "Doing something\n";
    }
}

class C1 {
    use Counter;
}

class C2 {
    use Counter;
}

$o = new C1();
$o->inc(); // 1
$o->inc(); // 2

echo Counter::doSomething();

echo $o->x; // 1

$p = new C2();
$p->inc(); // 1
$p->inc(); // 2
```

* 如果 trait 定义了一个属性，那类将不能定义同样名称的属性，否则会产生一个错误。
* 如果该属性在类中的定义与在 trait 中的定义兼容\(同样的可见性和初始值\)，那么错误几倍为 E\_STRICT,否则是一个致命错误

```php
<?php
trait PropertiesTrait {
    public $same = true;
    public $different = false;
}

class PropertiesExample {
    use PropertiesTrait;
    public $same = true; // Strict Standards
    public $different = true; // 致命错误
}
```

#### 匿名类

* PHP7 开始支持匿名类。匿名类很有用，可以创建一次性简单对象

```php
<?php
// PHP 7 之前的代码

class Logger
{
    public function log($msg) {
        echo $msg;
    }
}


$obj = new Logger();
$obj->log('This is demo!');


//  PHP7+
$obj2 = (new class {
    public function log($msg) {
        echo $msg;
    }
});

$obj2->log('这个是匿名类');
?>
```

* 可以传递参数到匿名类的构造器，也可以扩展（extend）其他类、实现接口（implement interface），以及像其他普通的类一样使用 trait

```php
<?php

class SomeClass{}
interface SomeInterface {}
trait SomeTrait {}

var_dump(new class(10) extends SomeClass implements SomeInterface {
    private $num;

    public function __construct($num) {
        $this->num = $num;
    }

    use SomeTrait;
});

//object(class@anonymous)#1 (1) {
//  ["num":"class@anonymous":private]=>
//  int(10)
//}
```

* 匿名函数嵌套近普通Class 后，不能访问 private, protected 方法或属性。如果需要访问 protected 属性或方法，匿名类需要 extend 此外部类。为了访问 private 属性或方法，需要童工构造器传递

```php
<?php

class Outer {
    private $prop = 1;
    protected $prop2 = 2;

    protected function func1() {
        return 3;
    }

    public function func2() {
        return new class($this->prop) extends Outer {
            private $prop3;

            public function __construct($prop) {
                $this->prop3 = $prop;
            }

            public function func3() {
                return $this->prop2 + $this->prop3 + $this->func1();
            }
        };
    }
}

echo (new Outer)->func2()->func3(); // 6
```

#### 重载

* PHP提供的重载是指动态地"创建"类属性和方法。通过魔术方法来实现
* 当调用当前环境下未定义或不可见的类属性或方法时，重载方法会被调用。
* 所有的重载方法都必须声明为 public
* 5.3.0 新增 `__callStatic()`魔术方法。可见性设置为 public或未声明为 static 的时候会产生一个警告
* 在给不可访问属性赋值时，`__set()` 会被调用
* 读取不可访问属性的值是，`__get()` 会被调用
* 对不可访问属性调用`isset() 或 empty()时，` `__isset()`会被调用
* 当对不可访问属性调用 unset\(\) 时，`__unset()`会被调用
* 属性重载只能在对象中进行。在静态方法中，这些魔术方法将不会被调用。所以这些方法都不能被 声明为 static

```php
<?php

class PropertyTest {
    // 被重载的数据保存在此
    private $data = [];

    // 重载不能被用在已经定义的属性
    public $declared = 1;

    // 只有从外部访问这个属性时，重载才会发生
    private $hidden = 2;

    public function __set($name, $value) {
        echo "Setting '$name' to '$value' \n";
        $this->data[$name] = $value;
    }

    public function __get($name) {
        echo "Getting '$name' \n";
        if(array_key_exists($name, $this->data)) {
            return $this->data[$name];
        }

        $trace = debug_backtrace();
        trigger_error(
            'Undefined property via __get(): '. $name .
            ' in '. $trace[0]['file'] .
            ' on line '. $trace[0]['line'],
            E_USER_NOTICE);

        return null;
    }

    // PHP 5.1.0 之后版本
    public function __isset($name) {
        echo "Is '$name' set?\n";
        return isset($this->data[$name]);
    }

    public function __unset($name) {
        echo "Unsetting '$name' \n";
        unset($this->data[$name]);
    }

    public function getHidden()
    {
        return $this->hidden;
    }
}

echo "<pre>\n";

$obj = new PropertyTest;

$obj->a = 1;
echo $obj->a . "\n\n";

var_dump(isset($obj->a)); // bool(true)
unset($obj->a); // 
var_dump(isset($obj->a)); // bool(false)

echo $obj->declared . "\n\n";

// 私有属性的访问
echo $obj->getHidden() . "\n\n";

echo $obj->hidden; // Will call__get() 函数
```

* 在对象汇总调用一个不可访问方法时，`__call()`会被调用
* 在静态上下文中调用一个不可访问方法是， `__callStatic()`会被调用

```php
<?php

class MethodTest {
    public function __call($name, $arguments) {
        echo "Calling object method '$name' "
            . implode(',', $arguments). "\n";
    }

    // PHP 5.3.0+
    public static function __callStatic($name, $arguments) {
        echo "Calling object method '$name' "
            . implode(',', $arguments). "\n";
    }
}


$obj = new MethodTest;
$obj->runTest('in object context'); // Calling object method 'runTest' in object context

// Calling object method 'runTest' in static context
MethodTest::runTest('in static context'); // PHP5.3.0+
```

#### 遍历对象

* php 提供一种定义对象的方法使其可以通过单元列表来遍历，如`foreach` 语句，遍历所有能够访问的可见属性
* 可以实现 Interator / IteratorAggregate 接口。可以让对象自行决定如何遍历以及每次遍历时哪些值可用

```php
// IteratorAggregate 只需要实现getIterator 方法即可
<?php
class myData implements IteratorAggregate {
    protected $property = 'Protected property';
    public $property1 = 'Public property one';
    public $property2 = 'Public property two';
    public $property3 = 'Public property three';

    public function __construct() {
        $this->property4 = "last property";
    }

    public function getIterator() {
        return new ArrayIterator($this);
    }
}

$obj = new myData;

foreach($obj as $key=>$value) {
    echo "$key=>$value\n";
}
/*
property1=>Public property one
property2=>Public property two
property3=>Public property three
property4=>last property
*/
```

#### 魔术方法

* `__construct()`
* `__destruct()`
* `__call()`
* `__callStatic()`
* `__get()`
* `__set()`
* `__isset()`
* `__unset()`
* `__sleep()`
  * serialize\(\) 函数会检查类中是否存在一个魔术放`__sleep()`，如果存在，该方法会被先调用，然后才执行序列化操作。此功能可以用于清理对象，并返回一个包含对象中所有应有被序列化的变量名称的数组。
  * `__sleep()` 不能返回父类的私有成员的名字
  * `__sleep()` 方法常用于提交未提交的数据，或类似的清理操作。同时，如果有一些很大的对象，但不需要全部保存，这个功能就很好用
* `__wakeup()`
  * unserialize\(\) 会检查是否存在一个 `__wakeup()` 方法。如果存在，则会先调用 `__wakeup` 方法，预先准备对象需要的资源
  * `__wakeup()` 经常用在反序列化操作中，例如重新建立数据库连接，或执行其它初始化操作

```php
<?php
class Person {

    private $name, $age, $sex, $info;

    public function __construct($name, $age, $sex) {
        $this->name = $name;
        $this->age = $age;
        $this->sex = $sex;
        $this->info = sprintf("prepared by construct magic function name: %s, age: %d sex: %s",
        $this->name, $this->age, $this->sex);
    }

    public function getInfo() {
        echo $this->info . PHP_EOL;
    }

    // serialize 前调用 用于删除需要被序列化存储的成员变量
    // return array
    public function __sleep(){
        echo __METHOD__. PHP_EOL;
        // 序列化只会存储 name, age, sex , info 不会被序列化
        return ['name', 'age', 'sex'];
    }

    // unserialize 钱调用，用于预先准备对象资源
    public function __wakeup() {
        echo __METHOD__ .PHP_EOL;
        $this->info = sprintf("prepared by wakeup magic function name: %s age: %d sex: %s", 
                                $this->name, $this->age, $this->sex);
    }
}

$man = new Person('pemako', 26, 'man');
$man->getInfo();

$temp = serialize($man);
echo $temp. PHP_EOL;

// 反序列化先调用 __wakeup
$man = unserialize($temp);
$man->getInfo();

/*
prepared by construct magic function name: pemako, age: 26 sex: man
Person::__sleep
O:6:"Person":3:{s:12:"Personname";s:6:"pemako";s:11:"Personage";i:26;s:11:"Personsex";s:3:"man";}
Person::__wakeup
prepared by wakeup magic function name: pemako age: 26 sex: man
*/
```

* `__toString()`
  * 用于一个类被当成字符串时应该怎样相应。不能再 `__toString()`方法中抛出异常，否则会导致致命错误
* `__invoke()`
  * 当尝试以调用函数的方式调用一个对象时， `__invoke()`方法会被自动调用 5.3.0+有效

```php
<?php

class CallableClass {
    function __invoke($x) {
        var_dump($x);
    }
}

$obj = new CallableClass;
$obj(5); // int(5)
var_dump(is_callable($obj));// bool(true)
```

* `__set_state()`
  * php5.1.0起当调用 var\_export\(\) 导出类时，此静态方法会被调用

```php
# var_export() 函数
$a = [1, 2, ["a", "b", "c"]]
var_export($a);
/*
array (
  0 => 1,
  1 => 2,
  2 =>
  array (
    0 => 'a',
    1 => 'b',
    2 => 'c',
  ),
)
*/

class A {
    public $var1;
    public $var2;

    public static function __set_state($array) {
        $obj = new A;
        $obj->var1 = $array['var1'];
        $obj->var2 = $array['var2'];
        return $obj;
    }
}

$o = new A;
$o->var1 = 5;
$o->var2 = 'foo';

eval('$b ='. var_export($o, true). ';');
var_dump($b);
/*
string(60) "A::__set_state(array(
   'var1' => 5,
   'var2' => 'foo',
))"
*/

$b = var_export($o, true);
var_dump($b);
/*
string(60) "A::__set_state(array(
   'var1' => 5,
   'var2' => 'foo',
))"
*/
```

* `__clone()`
  * 对象复制可以通过 clone 关键字来完成（如果可能，这将调用对象的 `__clone()` 方法）。对象中的 `__clone()` 方法不能被直接调用
  * 当对象被复制后，PHP 5 会对对象的所有属性执行一个浅复制（shallow copy）。所有的引用属性 仍然会是一个指向原来的变量的引用
  * 当复制完成时，如果定义了 `__clone()` 方法，则新创建的对象（复制生成的对象）中的 `__clone()` 方法会被调用，可用于修改属性的值（如果有必要的话）

```php
<?php

class SubObject {
    static $instances = 0;
    public $instance;

    public function __construct() {
        $this->instance = ++self::$instances;
    }

    public function __clone() {
        $this->instance = ++self::$instances;
    }
}

class MyCloneable {
    public $object1;
    public $object2;

    function __clone() {
        // 强制复制一份this->object， 否则仍然指向同一个对象
        $this->object1 = clone $this->object1;
    }
}

$obj = new MyCloneable();

$obj->object1 = new SubObject();
$obj->object2 = new SubObject();

$obj2 = clone $obj;


print("Original Object:\n");
print_r($obj);

print("Cloned Object:\n");
print_r($obj2);

/*
Original Object:
MyCloneable Object
(
    [object1] => SubObject Object
        (
            [instance] => 1
        )

    [object2] => SubObject Object
        (
            [instance] => 2
        )

)
Cloned Object:
MyCloneable Object
(
    [object1] => SubObject Object
        (
            [instance] => 3
        )

    [object2] => SubObject Object
        (
            [instance] => 2
        )
)
*/
```

* `__debugInfo()` 5.6.0 新增
  * 当使用 var\_dump\(\) 输出对象的时候，可以用来控制要输出的属性和值。返回值必须是个数组

```php
<?php

class C {
    private $prop;

    public function __construct($val) {
        $this->prop = $val;
    }

    public function __debugInfo() {
        return [
            'propSquared' => $this->prop ** 2,
        ];
    }
}

var_dump(new C(42));

/*
 object(C)#1 (1) {
  ["propSquared"]=>
  int(1764)
}
 */
```

#### Final 关键字

* 如果父类中的方法被声明为 final ，则子类无法覆盖该方法
* 如果一个类被声明为 final，则不嗯给你被继承
* 只有类和方法能定义为 final ,属性不能定义为 fina

#### 对象复制

* 见`__clone()`

#### 对象比较

* 当使用比较运算符（==）比较两个对象变量时，比较的原则是：如果两个对象的属性和属性值 都相等，而且两个对象是同一个类的实例，那么这两个对象变量相等
* 而如果使用全等运算符（===），这两个对象变量一定要指向某个类的同一个实例（即同一个对象

#### 类型约束

* 如果一个类或接口指定了类型约束，则其所有的子类或实现也都如此
* 类型约束不能用于标量类型如 int 或 string。Traits 也不允许。

#### 后期静态绑定

* "后期绑定"的意思是谁，static:: 不在被解析为定义当前方法所在的类，而是实际运行时计算的。也可以成为静态绑定，因为它可以用于（但不限于）静态方法的调用
* 我们可以功能通过 self 关键字或 CLASS 来判断或调用当前类。但有一个问题，如果我们是在子类中调用，得到的结果将是父类。因为在继承父类的时候，静态成员就已经被绑定了，所以在5.3.0中增加了一个 static 关键字来引用当前类，机实现了延迟静态绑定

```php
<?php

class A {
    public static function who() {
        echo __CLASS__;
    }

    public static function test() {
        self::who();
        //static::who(); // 延迟静态绑定
    }
}

class B extends A {
    public static function who() {
        echo __CLASS__;
    }
}

B::test(); // A 
// 如果想得到结果为 B 只需注释 self::who() ，打开 static::who()注释即可。则 B::test() 结果为 B
```

#### 对象和引用

* php的引用是别名，就是两个不同的变量名字指向相同的内容。在php5，一个对象变量已经不再保存整个对象的值。只是保存一个标识符来访问真正的对象内容。 当对象作为参数传递，作为结果返回，或者赋值给另外一个变量，另外一个变量跟原来的不是引用的关系，只是他们都保存着同一个标识符的拷贝，这个标识符指向同一个对象的真正内容。

```php
<?php
class A {
    public $foo = 1;
}

$a = new A;
$b = $a; // $a , $b 都是同一个标识符的拷贝  ($a) = ($b) = <id>

$b->foo = 2;

echo $a->foo. "\n"; // 2

$c = new A;
$d = &$c; // $c, $d 是引用 ($c, $d) = <id>

$d->foo = 2;
echo $c->foo."\n"; // 2

$e = new A;
function foo($obj) {
    // ($obj) = ($e) = <id>
    $obj->foo = 2; // 2
}

foo($e);
echo $e->foo. "\n"; // 2
```

#### 对象序列化

* 所有php里面的值都可以使用函数serialize\(\)来返回一个包含字节流的字符串来表示。unserialize\(\)函数能够重新把字符串变回php原来的值。 序列化一个对象将会保存对象的所有变量，但是不会保存对象的方法，只会保存类的名字。
* 为了能够unserialize\(\)一个对象，这个对象的类必须已经定义过。如果序列化类A的一个对象，将会返回一个跟类A相关，而且包含了对象所有变量值的字符串。 如果要想在另外一个文件中解序列化一个对象，这个对象的类必须在解序列化之前定义，可以通过包含一个定义该类的文件或使用函数spl\_autoload\_register\(\)来实现

```php
<?php
// classa.inc:

class A {
    public $one = 1;

    public function show_one() {
        echo $this->one;
    }
}

// page1.php:

include("classa.inc");

$a = new A;
$s = serialize($a);
// 把变量$s保存起来以便文件page2.php能够读到
file_put_contents('store', $s);

// page2.php:

// 要正确了解序列化，必须包含下面一个文件
include("classa.inc");

$s = file_get_contents('store');
$a = unserialize($s);

// 现在可以使用对象$a里面的函数 show_one()
$a->show_one();
```

## 命名空间

**1. 命名空间解决的两类问题**

* 用户编写的代码与PHP内部的类/函数/常量或第三方类/函数/常量之间的名字冲突
* 为很长的标识符名称\(通常是为了缓解第一类问题而定义的\)创建一个别名（或简短）的名称，提高源代码的可读性

**2. 命名空间的定义**

* 只有类（包含抽象类和 traits）、接口、函数和常量受命名空间的影响
* 命名空间通过 namespace 来声明。如果一个文件中包含命名空间，它必须在其它所有代码之前声明命名空间，除了一个以外：declare关键字
* 在声明命名空间之前唯一合法的代码是用于定义源文件编码方式的 declare 语句。另外，所有非 PHP 代码包括空白符都不能出现在命名空间的声明之前：

```php
<?php
namespace MyProject;

class CONNECT_OK = 1;
class Connection{}
function connect() {}
```

```php
<?php
namespace MyProject;
```

**3. 定义子命名空间**

* 与目录和文件的关系很象，PHP 命名空间也允许指定层次化的命名空间的名称。因此，命名空间的名字可以使用分层次的方式定义：

```php
<?php
namespace MyProject\Sub\Level;
```

**4. 同一个文件中定义多个命名空间 不建议这样做** **5. 使用**

```php
<?php
#fil1.php
namespace Foo\Bar\subnamespace;

const FOO = 1;
function foo() {
    echo __NAMESPACE__.PHP_EOL;
}
class foo {
    static function staticmethod() {
        echo __NAMESPACE__.PHP_EOL;
    }
}
```

```php
<?php

namespace Foo\Bar;
include "file1.php";

const FOO = 2;
function foo() {
    echo __NAMESPACE__.PHP_EOL;
}
class foo {
    public static function staticfunction() {
        echo __NAMESPACE__.PHP_EOL;
    }
}

// 非限定名称
foo();
foo::staticfunction(); 
echo FOO.PHP_EOL;

// 限定名称
subnamespace\foo();
subnamespace\foo::staticmethod();
echo subnamespace\FOO . PHP_EOL;

// 完全限定名
\FOO\Bar\foo();
\FOO\Bar\foo::staticfunction();
\Foo\Bar\FOO;
```

**6. 其它相关**

* PHP支持两种抽象的访问当前命名空间内部元素的方法，**NAMESPACE** 魔术常量和namespace关键字
* 允许通过别名引用或导入外部的完全限定名称
* 如果没有定义任何命名空间，所有的类与函数的定义都是在全局空间，与 PHP 引入命名空间概念前一样。在名称前加上前缀  表示该名称是全局空间中的名称，即使该名称位于其它的命名空间中时也是如此
* 其它相关信息[参考](https://secure.php.net/manual/zh/language.namespaces.faq.php)

## Errors

* 自定义错误处理函数 `set_error_handler()` 去处理错误

```php
<?php

// 该函数不能捕获 E_ERROR 错误
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    echo $errstr.PHP_EOL;
});

// 可以捕获 E_ERROR
register_shutdown_function(function() {
    if(is_null($e = error_get_last()) === false) {
        echo $e['message'] . PHP_EOL;
    }
});
```

* PHP7 改变了大多数错误的报告方式，不同于传统的错误报告机制，现在大多数错误被作为 Error 异常抛出 
* 这种异常可以像 Exception 异常一样被第一个匹配的 tyr/ catch 块捕获。如果没有匹配的 catch 块，则调用异常处理函数\(事先通过set\_exception\_handler\(\) 注册\) 进行处理。如果尚未注册异常处理函数，则按照传统方式处理：报告一个致命错误
* `Note` Error 类并非继承自 Exception 类，所以不能用 catch \(Exception $e\) { ... } 来捕获 Error。你可以用 catch \(Error $e\) { ... }，或者通过注册异常处理函数（ set\_exception\_handler\(\)）来捕获 Error.

## 异常处理

* 在5.5之后，支持 finally 关键字

```php
<?php
function inverse($x) {
    if(!$x) {
        throw new Exception('Division by zero.');
    }
    return 1/$x;
}

try {
    echo inverse(2).PHP_EOL;
    echo inverse(0).PHP_EOL;
} catch(Exception $e) {
    echo "Caught exception: ", $e->getMessage(). PHP_EOL;
} finally {
    echo "Finally".PHP_EOL;
}
```

## 生成器

* 简介
  * 生成器提供了一种更容易的方法来实现简单的对象迭代，相比较定义类实现 Iterator 接口的方式，性能开销和复杂性大大降低
  * 生成器允许你在 foreach 代码块中写代码来迭代一组数据而不需要在内存中创建一个数组, 那会使你的内存达到上限，或者会占据可观的处理时间。相反，你可以写一个生成器函数，就像一个普通的自定义函数一样, 和普通函数只返回一次不同的是, 生成器可以根据需要 yield 多次，以便生成需要迭代的值

```php
<?php
# 不使用生成器
$start_time=microtime(true);
$array = array();
$result = '';
for($count=1000000; $count--;)
{
  $array[]=$count/2;
}
foreach($array as $val)
{
  $val += 145.56;
  $result .= $val;
}
$end_time=microtime(true);

echo "time: ", bcsub($end_time, $start_time, 4), "\n";
echo "memory (byte): ", memory_get_peak_usage(true), "\n";
?>

<?php
# 使用生成器
$start_time=microtime(true);
$result = '';
function it()
{
  for($count=1000000; $count--;)
  {
    yield $count/2;
  }
}
foreach(it() as $val)
{
  $val += 145.56;
  $result .= $val;
}
$end_time=microtime(true);

echo "time: ", bcsub($end_time, $start_time, 4), "\n";
echo "memory (byte): ", memory_get_peak_usage(true), "\n";
?>

Result: 
            | time   | memory, mb |
----------------------------------|
not gen     | 0.3899 | 44.37891   |
gen         | 0.3679 | 12.375     |
```

* 生成器语法
  * 生成器可以使yield 生成需要它所需要的值
  * 当一个生成器被调用的时候，它返回一个可以被调遍历的对象。当你遍历这个对象的时候\(例如通过一个foreach循环\)，PHP 将会在每次需要值的时候调用生成器函数，并在产生一个值之后保存生成器的状态，这样它就可以在需要产生下一个值的时候恢复调用状态。
  * 一旦不再需要产生更多的值，生成器函数可以简单退出，而调用生成器的代码还可以继续执行，就像一个数组已经被遍历完了
  * `Note` 一个生成器不可以返回值： 这样做会产生一个编译错误。然而return空是一个有效的语法并且它将会终止生成器继续执行。
* yield 关键字
  * 生成器函数的核心是yield关键字。它最简单的调用形式看起来像一个return申明，不同之处在于普通return会返回值并终止函数的执行，而yield会返回一个值给循环调用此生成器的代码并且只是暂停执行生成器函数。

```php
<?php

# 生成键值对形式
$input = <<<'EOF'
1;PHP;Likes dollar signs
2;Python;Likes whitespace
3;Ruby;Likes blocks
EOF;

function input_parser($input) {
    foreach (explode("\n", $input) as $line) {
        $fields = explode(';', $line);
        $id = array_shift($fields);

        yield $id => $fields;
    }
}

foreach(input_parser($input) as $id=>$fields) {
    echo "$id : $fields[0], $fields[1]";
}

# 生成 null 值
# 不传递参数的情况下被调用来生成一个 NULL 值并匹配对一个自动的健名
```

## 引用的解释

* 引用是什么
  * PHP 中引用意味着用不同的名字访问同一个变量内容。引用可以看做是 Unix 文件系统中的硬链接
* 引用做什么
  * PHP 的引用允许用两个变量来指向同一个内容
  * PHP5 起 new 自动返回引用

    ```php
    <?php
    $a = &$b; // $a 和$b在这里完全相同，并不是$a 指向了$b 或相反，而是 $a 和 $b 指向了同一个地方
    ```
* 引用不是什么
  * 引用不是指针
* 引用传递
  * 可以将一个变量通过引用传递给函数，这样该函数就可以修改其内参数的值

```php
<?php

function foo(&$var) {
    $var++;
}

$a= 5;
foo($a);
echo $a; // 6
```

* 引用返回
  * 引用返回用在当想用函数找到引用应该被绑定在哪一个变量上面时

```php
<?php
class foo {
    public $value = 42;

    public function &getValue() {
        return $this->value;
    }
}

$obj = new foo;
// 注意这里也必须使用 & 
$my_value = &$obj->getValue(); // 42

$obj->value = 2;
echo $my_value; // 2
```

* 取消引用
  * unset\(\) 

```php
<?php
$a = 1;
$b = &$a;
unset($a);
echo $b; // 1
```

* 引用定位
  * global 引用，当用 global $var 声明一个变量时实际上建立了一个全局变量的引用
  * $this 在一个对象的方法中，$this 永远是调用它的对象的引用

```php
<?php
// 定义了一个全局变量 $var
$var = &$GLOBALS["var"]
```

## [预定义变量](2017-02-03-php-language-reference.md#predefined-variables)

## 预定义异常

* PHP5 以后包含
  * [Exception](2017-02-03-php-language-reference.md)
  * [ErrorException](2017-02-03-php-language-reference.md)
* PHP7新增
  * [Error](2017-02-03-php-language-reference.md)
  * [ArithmeticError](2017-02-03-php-language-reference.md)
  * [AssertionError](2017-02-03-php-language-reference.md)
  * [DivisionByZeroError](2017-02-03-php-language-reference.md)
  * [ParseError](2017-02-03-php-language-reference.md)
  * [TypeError](2017-02-03-php-language-reference.md)

## 预定义接口

* [Traversable遍历接口](2017-02-03-php-language-reference.md)
* [Iterator 迭代器接口](2017-02-03-php-language-reference.md)
* [IteratorAggregate 聚合式迭代器接口](2017-02-03-php-language-reference.md)
* [Throwable](2017-02-03-php-language-reference.md)
  * Throwable is the base interface for any object that can be thrown via a throw statement in PHP 7, including Error and Exception.
  * PHP classes cannot implement the Throwable interface directly, and must instead extend Exception.
* [ArrayAccess 数组式接口](2017-02-03-php-language-reference.md)
* [Serializable 序列化接口](2017-02-03-php-language-reference.md)
* [Closure 匿名接口](2017-02-03-php-language-reference.md)
* [Generator 生成器类](2017-02-03-php-language-reference.md)

## 上线文\(Context\) 选项和参数

* [Socket context options](2017-02-03-php-language-reference.md)
* [HTTP context options](2017-02-03-php-language-reference.md)
* [FTP context options](2017-02-03-php-language-reference.md)
* [SSL context options](2017-02-03-php-language-reference.md)
* [CURL context options](2017-02-03-php-language-reference.md)
* [Phar context options](2017-02-03-php-language-reference.md)
* [MongoDB context options](2017-02-03-php-language-reference.md)
* [Context parameters](2017-02-03-php-language-reference.md)

## 支持的协议和封装的协议

PHP 带有很多内置 URL 风格的封装协议，可用于类似 fopen\(\)、 copy\(\)、 file\_exists\(\) 和 filesize\(\) 的文件系统函数。 除了这些封装协议，还能通过 stream\_wrapper\_register\(\) 来注册自定义的封装协议

* [file://](2017-02-03-php-language-reference.md) 访问本地文件系统
* [http://](2017-02-03-php-language-reference.md) 访问 HTTP\(s\) 网址
* [ftp://](2017-02-03-php-language-reference.md) 访问 FTP\(s\) URLs
* [php://](2017-02-03-php-language-reference.md) 访问各个输入/输出流（I/O streams）
* [zlib://](2017-02-03-php-language-reference.md) 压缩流
* [data://](2017-02-03-php-language-reference.md) 数据（RFC 2397）
* [glob://](2017-02-03-php-language-reference.md) 查找匹配的文件路径模式
* [phar://](2017-02-03-php-language-reference.md) PHP 归档
* [ssh2://](2017-02-03-php-language-reference.md) Secure Shell 2
* [rar://](2017-02-03-php-language-reference.md) RAR
* [ogg://](2017-02-03-php-language-reference.md) 音频流
* [expect://](2017-02-03-php-language-reference.md) 处理交互式的流

