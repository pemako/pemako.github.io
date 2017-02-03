---
layout: post
title: PHP手册使用的正确姿势
description: php,手册
keywords: php,手册
category: php
tags: [php]
---

# 简介

PHP官方手册主要包含了四大部分

1. [`语言参考`](#langref)
2. [`函数参考`](#function)
3. [`产品特点`](#features)
4. [`补充信息`](#appendices)

## <span id="langref">语言参考</span>

### 基本语法

#### 1. PHP 标记

当解析一个文件时，PHP 会寻找起始和结束标记，也就是 <?php 和 ?>，这告诉 PHP 开始和停止解析二者之间的代码。此种解析方式使得 PHP 可以被嵌入到各种不同的文档中去，而任何起始和结束标记之外的部分都会被 PHP 解析器忽略。

PHP 也允许使用短标记 <? 和 ?>，但不鼓励使用。只有通过激活 php.ini 中的 `short_open_tag` 配置指令或者在编译 PHP 时使用了配置选项 --enable-short-tags 时才能使用短标记。

如果文件内容是纯 PHP 代码，最好在文件末尾删除 PHP 结束标记。这可以避免在 PHP 结束标记之后万一意外加入了空格或者换行符，会导致 PHP 开始输出这些空白，而脚本中此时并无输出的意图。

```php
<?php

echo "Hello world";

// 脚本至此结束，并无PHP 结束标记
```

|Version| Description|
|-------|---------------|
|7.0.0  | The ASP tags <%, %>, <%=, and the script tag \<script language="php"> are removed from PHP|
|5.4.0  | The tag <?= is always available regardless of the short_open_tag ini setting.|


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
    
- 四中变量类型
    - [boolena](#boolena)
    - [integer](#integer)
    - [float (dobule)](#float)
    - [string](#string)

- 两种复合类型
    - [array](#array)
    - [object](#object)

- 两种特殊类型
    - [resource](resource)
    - [NULL](#null)

- 伪类型
    - [mixed](#mixed)
    - [number](#number)
    - [callback](#callback)

#### <span id="boolena">1. Boolena 布尔类型</span>

当转换为 Boolena 值时，以下值被认为 FALSE：

- `the boolena FALSE itself`
- `the integer 0(zero)`
- `the float 0.0(zero)`
- `the empty string, and the string "0"`
- `the array with zero elements`
- `the special type NULL (including unset variables)`
- `SimpleXML objects created from empty tags`

#### <span id="integer">2. Integer 整型</span>

整型值可以使用十进制，十六进制，八进制或二进制表示，前面可以加上可选的符号（- 或者 +）。

二进制表达的 integer 自 PHP 5.4.0 起可用。

要使用八进制表达，数字前必须加上 0（零）。要使用十六进制表达，数字前必须加上 0x。要使用二进制表达，数字前必须加上 0b。

整型数的字长和平台有关，PHP 不支持无符号整数。Integer 值的字长可以用常量`PHP_INT_SIZE`来表示，自PHP4.4.0和 PHP5.0.5后，最大值可以用常量`PHP_INT_MAX` 来表示。

Warning: 如果向八进制数传递了一个非法数字(即8或9),则后面其余的数字会被忽略
```php
<?php
// 下面这一句在 PHP5.4.16运行正常
// php 7.0.x PHP Parse error:  Invalid numeric literal
var_dump(01090); // 八进制010 = 十进制 8
```

#### <span id="float">3. Float 浮点型</span>

浮点型（也叫浮点数 float，双精度数 double 或实数 real）.浮点数的字长和平台相关。

浮点数的精度有限。尽管取决于系统，PHP 通常使用 IEEE 754 双精度格式，则由于取整而导致的最大相对误差为 1.11e-16。非基本数学运算可能会给出更大误差，并且要考虑到进行复合运算时的误差传递。

此外，以十进制能够精确表示的有理数如 0.1 或 0.7，无论有多少尾数都不能被内部所使用的二进制精确表示，因此不能在不丢失一点点精度的情况下转换为二进制的格式。这就会造成混乱的结果：例如，floor((0.1+0.7)*10) 通常会返回 7 而不是预期中的 8，因为该结果内部的表示其实是类似 7.9999999999999991118...。

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

由于 NAN 代表着任何不同值，不应拿 NAN 去和其它值进行比较，包括其自身，应该用 is_nan() 来检查。

#### <span id="string">4 String 字符串</span>

- 字符串的四中表示方法
    - [单引号](#single-quotes)
    - [双引号](#double-quotes)
    - [heredoc 语法结构](#heredoc)
    - [nowdoc 语法结构](#nowdoc) `php5.3.0起`

##### <span id="single-quotes">单引号</span>

Note: 不像双引号和 heredoc 语法结构，在单引号字符串中的变量和特殊字符的转义序列将不会被替换。

##### <span id="double-quotes">双引号</span>

如果字符串是包围在双引号（"）中， PHP 将对一些特殊的字符和变量进行解析。

##### <span id="heredoc">heredoc 语法结构</span>

第三种表达字符串的方法是用 heredoc 句法结构：<<<。在该运算符之后要提供一个标识符，然后换行。接下来是字符串 string 本身，最后要用前面定义的标识符作为结束标志。

结束时所引用的标识符必须在该行的第一列，而且，标识符的命名也要像其它标签一样遵守 PHP 的规则：只能包含字母、数字和下划线，并且必须以字母和下划线作为开头。

`Warning`要注意的是结束标识符这行除了可能有一个分号（;）外，绝对不能包含其它字符。这意味着标识符不能缩进，分号的前后也不能有任何空白或制表符。更重要的是结束标识符的前面必须是个被本地操作系统认可的换行，比如在 UNIX 和 Mac OS X 系统中是 \n，而结束定界符（可能其后有个分号）之后也必须紧跟一个换行。

```php
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

##### <span id="nowdoc">nowdoc 语法结构</span>

就象 heredoc 结构类似于双引号字符串，Nowdoc 结构是类似于单引号字符串的。Nowdoc 结构很象 heredoc 结构，但是 nowdoc 中不进行解析操作。这种结构很适合用于嵌入 PHP 代码或其它大段文本而无需对其中的特殊字符进行转义。与 SGML 的 <![CDATA[ ]]> 结构是用来声明大段的不用解析的文本类似，nowdoc 结构也有相同的特征。

一个 nowdoc 结构也用和 heredocs 结构一样的标记 <<<， 但是跟在后面的标识符要用单引号括起来，即 <<<'EOT'。Heredoc 结构的所有规则也同样适用于 nowdoc 结构，尤其是结束标识符的规则。

```php
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

#### <span id="array">5. Array 数组</span>

#### <span id="object">6. Object 对象</span>

#### <span id="resource">7. Resource 资源类型</span>

#### <span id="null">8. NULL</span>

#### <span id="callback">9. Callback 回调类型

#### <span id="mixed">10. 伪类型与变量</span>

#### 11. 类型转换的判别

### 变量

#### 0. 基础

#### 1. 预定义变量

#### 2. 变量的范围

#### 3. 可变变量

#### 4. 来自PHP之外的变量

### 常量

#### 0. 语法

#### 1. 魔术敞亮

### 表达式

### 运算符

### 流程控制

### 函数

### 类与对象

### 命名空间

### Errors

### 异常扩展

### 生成器

### 引用的解释

### 预定义变量

### 预定义异常

### 预定义接口

### 上线文(Context) 选项和参数

### 支持的协议和封装的协议

## <span id="function"> 函数参考</span>

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

### MySQL(原始)

### Mysqli

### Mysqlnd

### OCI8

### OpenSSL

### MS SQL Server(PDO)

### Firebird (PDO)

### MySQL (PDO)

### Oracle (PDO)

### ODBC and DB2 (PDO)

### PostgreSQL (PDO)

### SQLite (PDO)

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
### mysqlnd_memcache
### mysqlnd_ms
### mysqlnd_mux
### mysqlnd_qc
### mysqlnd_uh
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
### 4D (PDO)
### CUBRID (PDO)
### IBM (PDO)
### Informix (PDO)
### MS SQL Server (PDO)
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
### tokyo_tyrant
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

## <span id="features">产品特点</span>
## <span id="appendices">补充信息</span>
