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

#### 2. 从HTML中分离

#### 3. 指令分隔符

#### 4. 注释

### 类型

#### 0. 简介

#### 1. Boolena 布尔类型

#### 2. Integer 整型

#### 3. Float 浮点型

#### 4 String 字符串

#### 5. Array 数组

#### 6. Object 对象

#### 7. Resource 资源类型

#### 8. NULL

#### 9. Callback 回调类型

#### 10. 伪类型与变量

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
