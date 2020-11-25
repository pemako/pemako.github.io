---
layout: post
title: PHP手册使用的正确姿势
description: 'php,手册'
keywords: 'php,手册'
category: php
tags:
  - php
---

# 00-手册

PHP官方手册主要包含了四大部分

1. [语言参考](2017-02-03-how-to-use-php-documentation.md#langref)
2. [函数参考](2017-02-03-how-to-use-php-documentation.md#function)
3. [产品特点](2017-02-03-how-to-use-php-documentation.md#features)
4. [补充信息](2017-02-03-how-to-use-php-documentation.md#appendices)

## 语言参考

### 基本语法

#### 1. PHP 标记

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

#### 2. 从HTML中分离

凡是在一对开始和结束标记之外的内容都会被 PHP 解析器忽略，这使得 PHP 文件可以具备混合内容。 可以使 PHP 嵌入到 HTML 文档中去，如下例所示。

```php
<p>这里是 HTML 文件内容不会被解析</p>
<?php echo '这里的内容会被解析'; ?>
<p>这里的内容也不会被解析</p>
```

#### 3. 指令分隔符

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

#### 4. 注释

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

### 类型

#### 0. 简介

* 四中变量类型
  * [boolena](2017-02-03-how-to-use-php-documentation.md#boolena)
  * [integer](2017-02-03-how-to-use-php-documentation.md#integer)
  * [float \(dobule\)](2017-02-03-how-to-use-php-documentation.md#float)
  * [string](2017-02-03-how-to-use-php-documentation.md#string)
* 两种复合类型
  * [array](2017-02-03-how-to-use-php-documentation.md#array)
  * [object](2017-02-03-how-to-use-php-documentation.md#object)
* 两种特殊类型
  * [resource](https://github.com/pemako/pemako.github.io/tree/47cb5a2dee3e03dae8535254262fabbffee059e9/_posts/php/resource/README.md)
  * [NULL](2017-02-03-how-to-use-php-documentation.md#null)
* 伪类型
  * [mixed](2017-02-03-how-to-use-php-documentation.md#mixed)
  * [number](2017-02-03-how-to-use-php-documentation.md#number)
  * [callback](2017-02-03-how-to-use-php-documentation.md#callback)

#### 1. Boolena 布尔类型

当转换为 Boolena 值时，以下值被认为 FALSE：

* `the boolena FALSE itself`
* `the integer 0(zero)`
* `the float 0.0(zero)`
* `the empty string, and the string "0"`
* `the array with zero elements`
* `the special type NULL (including unset variables)`
* `SimpleXML objects created from empty tags`

#### 2. Integer 整型

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

#### 3. Float 浮点型

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

#### 4 String 字符串

* 字符串的四中表示方法
  * [单引号](2017-02-03-how-to-use-php-documentation.md#single-quotes)
  * [双引号](2017-02-03-how-to-use-php-documentation.md#double-quotes)
  * [heredoc 语法结构](2017-02-03-how-to-use-php-documentation.md#heredoc)
  * [nowdoc 语法结构](2017-02-03-how-to-use-php-documentation.md#nowdoc) `php5.3.0起`

**单引号**

Note: 不像双引号和 heredoc 语法结构，在单引号字符串中的变量和特殊字符的转义序列将不会被替换。

**双引号**

如果字符串是包围在双引号（"）中， PHP 将对一些特殊的字符和变量进行解析。

**heredoc 语法结构**

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

**nowdoc 语法结构**

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

#### 5. Array 数组

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

#### 6. Object 对象

* 要创建一个新的对象 object，使用 new 语句实例化一个类
* 如果将一个对象转换成对象，它将不会有任何变化。如果其它任何类型的值被转换成对象，将会创建一个内置类 stdClass 的实例。如果该值为 NULL，则新的实例为空。数组转换成对象将使键名成为属性名并具有相对应的值。对于任何其它的值，名为 scalar 的成员变量将包含该值。
* 详细讨论请参考下面[类与对象](2017-02-03-how-to-use-php-documentation.md#class-and-obj)

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

#### 7. Resource 资源类型

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

#### 8. NULL

* 特殊的 NULL 值表示一个变量没有值。NULL 类型唯一可能的值就是 NULL。
* NULL 类型只有一个值，就是不区分大小写的常量 NULL。
* NULL 类型只有一个值，就是不区分大小写的常量 NULL。
  * 被赋值为 NULL
  * 尚未被赋值
  * 被 unset\(\)
* 使用 is\_null\(\) 函数监测一个值是否为 null

#### 9. Callback 回调类型

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

#### 10. 伪类型与变量

* mixed 说明一个参数可以接受多种不同的（但不一定是所有的）类型
  * 例如 gettype\(\) 可以接受所有的 PHP 类型，str\_replace\(\) 可以接受字符串和数组
* number 说明一个参数可以是 integer 或者 float
* 本文档中在 PHP 5.4 引入 callable 类型之前使用 了 callback 伪类型。二者含义完全相同。
* void 作为返回类型意味着函数的返回值是无用的。void 作为参数列表意味着函数不接受任何参数。

#### 11. 类型转换的判别

* 允许的强制转换有
  * \(int\), \(integer\) - 转换为整形 integer
  * \(bool\), \(boolean\) - 转换为布尔类型 boolean
  * \(float\), \(double\), \(real\) - 转换为浮点型 float
  * \(string\) - 转换为字符串 string
  * \(array\) - 转换为数组 array
  * \(object\) - 转换为对象 object
  * \(unset\) - 转换为 NULL \(PHP 5\)

### 变量

#### 0. 基础

* PHP 中的变量用一个美元符号后面跟变量名来表示。变量名是区分大小写的
* 一个有效的变量名由字母或者下划线开头，后面跟上任意数量的字母，数字，或者下划线
* 按照正常的正则表达式，它将被表述为：'\[a-zA-Z\_\x7f-\xff\]\[a-zA-Z0-9\_\x7f-\xff\]\*'
* $this 是一个特殊的变量，它不能被赋值
* 变量默认总是传值赋值,那也就是说，当将一个表达式的值赋予一个变量时，整个原始表达式的值被赋值到目标变量。这意味着，例如，当一个变量的值赋予另外一个变量时，改变其中一个变量的值，将不会影响到另外一个变量
* PHP 也提供了另外一种方式给变量赋值：引用赋值。这意味着新的变量简单的引用（换言之，"成为其别名"或者"指向"）了原始变量。改动新的变量将影响到原始变量，反之亦然
* 使用引用赋值，简单地将一个 & 符号加到将要赋值的变量前（源变量）
* `Note:`那就是只有有名字的变量才可以引用赋值
* 虽然在 PHP 中并不需要初始化变量，但对变量进行初始化是个好习惯

#### 1. 预定义变量

* 超全局变量
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

#### 2. 变量的范围

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

#### 3. 可变变量

* 要将可变变量用于数组，必须解决一个模棱两可的问题。这就是当写下 $$a\[1\] 时，解析器需要知道是想要 $a\[1\] 作为一个变量呢，还是想要 $$a 作为一个变量并取出该变量中索引为 \[1\] 的值。解决此问题的语法是，对第一种情况用 ${$a\[1\]}，对第二种情况用 ${$a}\[1\]
* 类的属性也可以通过可变属性名来访问。可变属性名将在该调用所处的范围内被解析。例如，对于 $foo-&gt;$bar 表达式，则会在本地范围来解析 $bar 并且其值将被用于 $foo 的属性名。对于 $bar 是数组单元时也是一样。
* 也可使用花括号来给属性名清晰定界。最有用是在属性位于数组中，或者属性名包含有多个部分或者属性名包含有非法字符时

#### 4. 来自PHP之外的变量

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

### 常量

* 语法
  * 常量默认大小写敏感，传统上常量标识符总是大写
  * 常量名和其它任何 PHP 标签遵循同样的命名规则
  * 常量定义使用 define  const\(php 5.3以后生效\)
  * 

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

### 表达式

最基本的表达式形式是常量和变量。稍微复杂的表达式例子就是函数。PHP 是一种面向表达式的语言，从这一方面来讲几乎一切都是表达式。

### 运算符

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

### 流程控制

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
* return
* require / require\_once
* include / include\_once
* goto

### 函数

### 类与对象

* [简介](2017-02-03-how-to-use-php-documentation.md#obj-introduction)
* [基本概念](2017-02-03-how-to-use-php-documentation.md#obj-basics)
* [属性](2017-02-03-how-to-use-php-documentation.md#obj-property)
* [类常量](2017-02-03-how-to-use-php-documentation.md#obj-class-constants)
* [自动加载类](2017-02-03-how-to-use-php-documentation.md#obj-autoloading)
* [构造函数和析构函数](2017-02-03-how-to-use-php-documentation.md#obj-construct-and-destruct)
* [访问控制可见性](2017-02-03-how-to-use-php-documentation.md#obj-visibility)
* [对象继承](2017-02-03-how-to-use-php-documentation.md#obj-inheritance)
* [范围解析操作符::](2017-02-03-how-to-use-php-documentation.md#obj-scope)
* [Static 关键字](2017-02-03-how-to-use-php-documentation.md#obj-static)
* [抽象类](2017-02-03-how-to-use-php-documentation.md#obj-abstraction)
* [对象接口](2017-02-03-how-to-use-php-documentation.md#obj-interface)
* [Trait](2017-02-03-how-to-use-php-documentation.md#obj-trait)
* [匿名类](2017-02-03-how-to-use-php-documentation.md#obj-anonymous)
* [重载](2017-02-03-how-to-use-php-documentation.md#obj-overloading)
* [遍历对象](2017-02-03-how-to-use-php-documentation.md#obj-iteration)
* [魔术方法](2017-02-03-how-to-use-php-documentation.md#obj-magic-method)
* [Final 关键字](2017-02-03-how-to-use-php-documentation.md#obj-final)
* [对象复制](2017-02-03-how-to-use-php-documentation.md#obj-cloning)
* [对象比较](2017-02-03-how-to-use-php-documentation.md#obj-comparing)
* [类型约束](2017-02-03-how-to-use-php-documentation.md#obj-type-hinting)
* [后期静态绑定](2017-02-03-how-to-use-php-documentation.md#obj-late-static-binding)
* [对象和引用](2017-02-03-how-to-use-php-documentation.md#obj-and-reference)
* [对象序列化](2017-02-03-how-to-use-php-documentation.md#obj-serialization)
* [OOP变更日志](2017-02-03-how-to-use-php-documentation.md#obj-opp-changelog)

**简介**

自 PHP 5 起完全重写了对象模型以得到更佳性能和更多特性。这是自 PHP 4 以来的最大变化。PHP 5 具有完整的对象模型。

PHP 5 中的新特性包括[访问控制](2017-02-03-how-to-use-php-documentation.md#obj-visibility)，[抽象类](2017-02-03-how-to-use-php-documentation.md#obj-abstraction)和 [final](2017-02-03-how-to-use-php-documentation.md#obj-final) 类与方法，附加的[魔术方法](2017-02-03-how-to-use-php-documentation.md#obj-magic-method)，[接口](2017-02-03-how-to-use-php-documentation.md#obj-interface)，[对象复制](2017-02-03-how-to-use-php-documentation.md#obj-cloning)和[类型约束](2017-02-03-how-to-use-php-documentation.md#obj-type-hinting).

PHP 对待对象的方式与引用和句柄相同，即每个变量都持有对象的引用，而不是整个对象的拷贝。参见[对象和引用](2017-02-03-how-to-use-php-documentation.md#obj-and-reference)。

**基本概念**

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
  * 要创建一个类的实例，必须使用 new 关键字。当创建新对象时该对象总是被赋值，除非该对象定义了[构造函数](2017-02-03-how-to-use-php-documentation.md#obj-construct-and-destruct)并且在出错时抛出了一个异常。类应在被实例化之前定义（某些情况下则必须这样）。
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

**属性**

**类常量**

**自动加载类**

**构造函数和析构函数**

**访问控制可见性**

**对象继承**

**范围解析操作符::**

**Static 关键字**

**抽象类**

**对象接口**

**Trait**

**匿名类**

**重载**

**遍历对象**

**魔术方法**

**Final 关键字**

**对象复制**

**对象比较**

**类型约束**

**后期静态绑定**

**对象和引用**

**对象序列化**

**OOP变更日志**

### 命名空间

### Errors

### 异常扩展

### 生成器

### 引用的解释

### 预定义变量

### 预定义异常

### 预定义接口

### 上线文\(Context\) 选项和参数

### 支持的协议和封装的协议

## 函数参考

## ① 核心扩展库

### 字符串

### 数组

### 类/对象

### 日期/时间

### 目录

### 错误处理

### 程序执行

### Filesystem

### Filter

### Function Handing

### Hash

### PHP 选项/信息

### Mail

### Math

### Misc

### 网络

### 输出控制

### Password Hashing

### Phar

### 反射

### POSIX Regex

### SPL

### Streams

### Tokenizer

### URLs

### Variable Handing

## ② 绑定的扩展库

### Apache

### BC Math

### Calendar

### COM

### Ctype

### DBA

### Exif

### Fileinfo

### FTP

### iconv

### GD

### intl

### JSON

### 多字节字符串

### NSAPI

### PCNTL

### PCRE

### PDO

### POSIX

### Semaphore

### Shared Memory

### Sockets

### SQLite3

### XML-RPC

### Zlib

## ③ 外部扩展库

下面这些扩展库已经绑定在 PHP 发行包中，但是要编译一下扩展库，需要外部的库文件。

### Bzip2

### cURL

### dBase

### DOM

### Enchant

### FrontBase

### Gettext

### GMP

### Firebird/InterBase

### Informix

### IMAP

### LDAP

### libxml

### Mcrypt

### Mhash

### mSQL

### Mssql

### MySQL\(原始\)

### Mysqli

### Mysqlnd

### OCI8

### OpenSSL

### MS SQL Server\(PDO\)

### Firebird \(PDO\)

### MySQL \(PDO\)

### Oracle \(PDO\)

### ODBC and DB2 \(PDO\)

### PostgreSQL \(PDO\)

### SQLite \(PDO\)

### PostgreSQL

### Pspell

### Readline

### Recode

### SimpleXML

### SNMP

### SOAP

### Sybase

### Tidy

### ODBC

### WDDX

### XML 解析器

### XMLReader

### XMLWriter

### XSL

### Zip

## ④ PECL 扩展库

以下扩展来自PECL，它们可能需要额外的库。还有更多的 PECL 扩展存在，但是在 PHP 手册中尚未有文档。

### APC

### APD

### BBCode

### bcompiler

### Cairo

### chdb

### Classkit

### Crack

### CUBRID

### Cyrus

### DB++

### dbx

### Direct IO

### Eio

### Ev

### Event

### Expect

### FAM

### FDF

### filePro

### FriBiDi

### Gearman

### Gender

### GeoIP

### Gmagick

### GnuPG

### Gupnp

### haru

### htscanner

### Hyperwave API

### IBM DB2

### ID3

### IIS

### ImageMagick

### inclued

### Ingres

### Inotify

### Judy

### KADM5

### KTaglib

### Lapack

### Libevent

### Lua

### LZF

### Mailparse

### MaxDB

### MCVE

### Memcache

### Memcached

### Memtrack

### Mimetype

### Ming

### mnoGoSearch

### Mongo

### mqseries

### Msession

### mysqlnd\_memcache

### mysqlnd\_ms

### mysqlnd\_mux

### mysqlnd\_qc

### mysqlnd\_uh

### Ncurses

### Gopher

### Newt

### YP/NIS

### OAuth

### oggvorbis

### OpenAL

### Paradox

### Parsekit

### PDF

### 4D \(PDO\)

### CUBRID \(PDO\)

### IBM \(PDO\)

### Informix \(PDO\)

### MS SQL Server \(PDO\)

### Proctitle

### PS

### pthreads

### Quickhash

### Radius

### Rar

### RPM Reader

### RRD

### runkit

### SAM

### SCA

### scream

### SDO

### SDO DAS XML

### SDO-DAS-Relational

### Session PgSQL

### Solr

### Sphinx

### SPL Types

### SQLite

### SQLSRV

### ssdeep

### SSH2

### Statistics

### Stomp

### SVM

### SVN

### Swish

### Taint

### TCP

### tokyo\_tyrant

### V8js

### Varnish

### vpopmail

### Weakref

### win32ps

### win32service

### WinCache

### xattr

### xdiff

### Xhprof

### Yaf

### Yaml

### YAZ

### ZooKeeper

## 产品特点

## 补充信息

