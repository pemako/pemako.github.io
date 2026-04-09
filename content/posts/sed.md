---
date: '2026-04-09T20:00:00+08:00'
title: 'Sed'
description: ""
summary: ""
tags: ["linux", "sed"]
categories: ["linux"]
series: ["Linux"]
ShowToc: true
TocOpen: true
---


## 重要函数说明

- `q`  提前退出命令，不执行后续命令，也不读入后续行
- `d`  删除`pattern space`(模式空间)中的所有内容，包括换行符
- `D`  删除模式空间中的首行，即第一个`\n`之前的所有内容
- `h`  **拷贝**模式空间中的所有内容到`hold space`(交换空间)
- `H`  **追加**模式空间中的所有内容到交换空间
- `g`  **拷贝**交换空间中的所有内容到模式空间
- `G`  **追加**交换空间中的所有内容到模式空间
- `n`  **读取**下一个输入行，使用接下来的命令继续对下一行进行处理
- `N`  **追加**下一个输入行到当前模式空间，并改变当前行号
- `p`  打印当前行所有模式空间中的内容
- `P`  打印当前行模式空间中的首行，即第一个`\n`之前的所有内容
- `x`  将模式空间和交换空间的内容进行交换
- `t label` 如果条件满足，则跳转到标签所在地继续执行，若无标签，则到命令末尾
- `b label` 直接跳转到标签所在地继续执行，若无标签，则到命令末尾

> 模式空间和交换空间都属于缓存区

## 模式空间 (pattern space)

- 默认情况下 `sed` 逐行处理空间
- 编辑指令支队该空间生效
- 该空间如无`d/D`命令，必打印

## 交换空间/保持空间 (hold space)

- 按指令进行存取处理
- 如需编辑该空间，需交换出去
- 如需打印，需交换出去

## 入门例子详解

> `sed`的命令参数有： `-n` `-i` `-e` `-r`

> `sed`的函数参数有: `i` `c` `a` `r` `w` `y` `q` `s` `n` `N` `d` `D` `p` `P` `h` `H` `g` `G` `x` `t` `b`

> 下面所有的处理均采用该示例文件（exam.txt）内容操作

```txt
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
January February March April May June July August September October November Deccmber
```

### 命令参数

#### `-n`参数及`p`指令

- `cat exam.txt | sed ''`

> 类似于直接cat文件不做任何操作

```
# cat exam.txt | sed ''
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
January February March April May June July August September October November Deccmber
```

- `cat exam.txt | sed 'p'`

> 读到第一行的时候接收到 `p` 指令会把第一行的内容打印出来；第二行`One`的内容由`sed`的模式空间自动打印出来的

```
# cat exam.txt | sed 'p'
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
January February March April May June July August September October November Deccmber
January February March April May June July August September October November Deccmber
```

- `cat exam.txt | sed -n 'p'`

> 如只希望采用指令进行打印，不打印模式空间的内容，可以使用 `-n`参数

```
# cat exam.txt | sed -n 'p'
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
January February March April May June July August September October November Deccmber
```

#### `-i` 参数

> `-i` 默认修改文件中的内容

- `sed 's/One/1/' exam.txt > /dev/null; cat exam.txt`

```
# sed -i 's/One/1/' exam.txt > /dev/null; cat exam.txt
1/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
January February March April May June July August September October November Deccmber
```

- `sed -i 's/One/1/' exam.txt > /dev/null; cat exam.txt`

```
# sed -i 's/One/1/' exam.txt > /dev/null; cat exam.txt
1/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
January February March April May June July August September October November Deccmber
```

#### `-e` 连接多个指令

- `sed 's/One/1' 's/Two/2' exam.txt`

```
# sed 's/One/1/' 's/Two/2/' exam.txt
sed: can't read s/Two/2/: No such file or directory
1/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
January February March April May June July August September October November Deccmber
```

- `sed -e 's/One/1' -e 's/Two/2' exam.txt`

```
# sed -e 's/One/1/' -e 's/Two/2/' exam.txt
1/2/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
January February March April May June July August September October November Deccmber
```

#### `-r` 对正则表达式处理 存疑？

- `sed 's/e[2]/ow/' exam.txt`

> 示例目的是把包含两个`e`的替换为 `ow`; 如下输出，没有把[2]解析为正则表达式

```
# sed 's/e[2]/ow/' exam.txt
1/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
January February March April May June July August September October November Deccmber
```

- `sed -r 's/e[2]/ow/' exam.txt`

### 函数参数

#### `i` 插入在匹配到的内容之前添加

- `sed '/February/i Spring' exam.txt`

```
# sed '/February/i Spring' exam.txt
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
Spring
January February March April May June July August September October November Deccmber
```

#### `a` 插入在匹配到的内容之后添加

- `sed '/February/a Spring' exam.txt`

```
# sed '/February/a Spring' exam.txt
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
January February March April May June July August September October November Deccmber
Spring
```

#### `c` 匹配到内容整行替换

- `sed '/February/c Spring' exam.txt`

```
# sed '/February/c Spring' exam.txt
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
Spring
```

#### `w` 匹配到的内容写入到新文件

- `sed '/February/ w exam.tmp' exam.txt`

```
# sed '/February/ w exam.tmp' exam.txt
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
January February March April May June July August September October November Deccmber
# cat exam.tmp
January February March April May June July August September October November Deccmber
```

#### `r` 读文件

- `sed '/One/ r exam.tmp' exam.txt`

> 匹配到`One`后，读取`exam.tmp`中的文件打印

```
# sed '/One/ r exam.tmp' exam.txt
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
January February March April May June July August September October November Deccmber # 这一行为读取exam.tmp文件中的内容
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
January February March April May June July August September October November Deccmber
```

#### `q` 退出(包含后面的命令及函数)

- `sed '2q' exam.txt`

> 表示到第二行的时候就退出

```
# sed '2q' exam.txt
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
```

#### `y` 替换字符

> 注意在不同的版本中该命令会不存在；mac上的sed存在该函数。

- `sed 'y/abc/ABC' exam.txt`

> 意思为把 `abc` 替换为 `ABC`；注意在不同的系统或版本上的效果可能会存在出入。

```
➜  ~ sed 'y/abc/ABC/' exam.txt
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
MondAy#TuesdAy#WednesdAy#ThursdAy#FridAy#SAturdAy#SundAy
JAnuAry FeBruAry MArCh April MAy June July August SeptemBer OCtoBer NovemBer DeCCmBer
```

> 把 `a -> A` `c->C`

```
➜  ~ sed 'y/[a-c]/[A-C]/' exam.txt
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
MondAy#TuesdAy#WednesdAy#ThursdAy#FridAy#SAturdAy#SundAy
JAnuAry FebruAry MArCh April MAy June July August September OCtober November DeCCmber
```

#### `=` 打印模式空间所在的行数

`man sed: Write the line number to the standard output followed by a newline character.`

- `sed = exam.txt`

```
➜  ~ sed = exam.txt
1
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
2
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
3
January February March April May June July August September October November Deccmber
```

#### `t` 有条件跳转

- `sed ':a;s/F/f/;ta' exam.txt`

> `:a` 其中`a`为标签(标签前必须添加冒号，标签名称自己定义) `t` 后面跟的字符串一定为标签名称。示例的意思为如果碰到 t`a`(标签)的话回转到开头继续处理不读入下一行，会跳转到标签所在位置继续执行。

匹配到第一行的`F`our 把 `F` -> `f` ，继续在本行替换 `F` -> `f`；如匹配不到则不执行t的动作。

```
# sed ':a;s/F/f/;ta' exam.txt
One/Two/Three/four/five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#friday#Saturday#Sunday
January february March April May June July August September October November Deccmber
```

- 如不添加 `g` 匹配到第一个`F`后即跳转到第二行处理

```
# sed 's/F/f/' exam.txt
One/Two/Three/four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#friday#Saturday#Sunday
January february March April May June July August September October November Deccmber
```

#### `b` 无条件跳转

- `sed ':label;s/F/f/;/F/blabel' exam.txt`

b 为无条件跳转，如果为 `sed ':lable;s/F/f;blabel exam.txt'`则会陷入死循环，无法跳转出去；这里人为的增加`/F/`即后续只有再匹配到`F`的时候才会进行跳转。

```
# sed ':label;s/F/f/;/F/blabel' exam.txt
One/Two/Three/four/five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#friday#Saturday#Sunday
January february March April May June July August September October November Deccmber
```

- `sed '/F/ba;s/r/???/;:a;s/^/((/' exam.txt`

因为每行都有F，则直接跳转到标签:a 处也就是匹配到 `/F/`后直接执行 `s/^/((/`替换操作。

```
# sed '/F/ba;s/r/???/;:a;s/^/((/' exam.txt
((One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
((Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
((January February March April May June July August September October November Deccmber
```

- `sed '/xxx/ba;s/r/???/;:a;s/^/((/' exam.txt`

操作文件中没一行都没有 `xxx` 故 `ba`跳转到标签`a`不会执行，程序会依次执行；先执行 `s/r/???` 操作；`:a`此时没有跳转失去意义；继续执行后续 `s/^/((`, 因此结果如下。

```
# sed '/xxx/b a;s/r/???/; :a;s/^/((/' exam.txt
((One/Two/Th???ee/Four/Five/Six/Seven/Eight/Nine/Ten
((Monday#Tuesday#Wednesday#Thu???sday#Friday#Saturday#Sunday
((Janua???y February March April May June July August September October November Deccmber
```

#### `n` 读入下一行

- `sed '1{n; s/o/???/}' exam.txt`

`1`匹配到第一行后执行 `n`读入下一行内容并把 `o`替换为`???` 输出结果如下。

```
# sed '1{n; s/o/???/}' exam.txt
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
M???nday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
January February March April May June July August September October November Deccmber
```

- `sed -n '1{n;p}' exam.txt`

`-n` 忽略模式空间的内容，仅匹配到第一行后打印下一行的内容。

```
# sed '1{n;p}' exam.txt
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
```

#### `N` 通俗将就是把下一行的内容移到到上一行的末尾

第一行没有匹配直接输出，第二行匹配到/Monday/后输出模式空间的内容并执行`{N; s/\n/\n\n/}`即把第三行的内容读取到当前的模式空间，并把 `\n` 替换为 `\n\n`

```
# sed '/Monday/{N;s/\n/\n\n/}' exam.txt
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday

January February March April May June July August September October November Deccmber
```

#### `p` 打印当前行所有模式空间中的内容

- `sed -n '2N;p exam.txt`

整个命令在执行的过程中`2N`指对第2行进行`N`的操作，因为N;p没有放到一个`{}`中，故p会打印模式空间的内容；匹配到第2行的时候执行`N`的操作(此时第三行的内容追加到第二行的末尾，指针已经指到第三行) p打印当前模式空间的所有内容，既结果如下。

```
➜  ~ sed -n '2N;p' exam.txt
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
January February March April May June July August September October November Deccmber
```

- `sed -n '2{N;p}' exam.txt`

**注意**：不同的版本对`{}`支持不同，`mac`的`sed`版本不支持 `{}`; 这里的大括号的作用是对匹配到的内容进行单独操作`{}`的命令

#### `P` 打印当前行模式空间中的首行

- `sed -n '2N;P' exam.txt`

执行命令的过程为P把第一行的内容打印出来，第二行匹配后执行N的动作，则第二行目前的值为`One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten\nMonday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday` 再执行`P`的动作，打印当前模式空间的首行根据`\n`切分，既打印`Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday`

```
➜  ~ sed -n '2N;P' exam.txt
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
```

#### `d/D` 删除匹配到的行

注意：如果模式空间中没有回车符的存在`d/D`的效果一样均为清空该模式空间的内容,如下面前两个例子。

- `sed '2d' exam.txt`

```
➜  ~ sed '2d' exam.txt
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
January February March April May June July August September October November Deccmber
```

- `sed '2D' exam.txt`

```
➜  ~ sed '2D' exam.txt
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
January February March April May June July August September October November Deccmber
```

- `sed 'N;2D' exam.txt`

```
➜  ~ sed 'N;2D' exam.txt
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
January February March April May June July August September October November Deccmber
```

- `sed 'N;2d' exam.txt`

注意这里不同的版本输出的结果可能不一样

这里没有内容输出，该命令执行的过程采用`sedsed`调试工具查看如下

```
# sedsed -d 'N;2d' exam.txt
PATT:One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten$
HOLD:$
COMM:N
PATT:One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten\nMonday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday$
HOLD:$
COMM:2 d
PATT:January February March April May June July August September October November Deccmber$
HOLD:$
COMM:N
January February March April May June July August September October November Deccmber
```

- `sed 'N;2D;3D' exam.txt`

```
# sedsed -d 'N;2D;3D' exam.txt
PATT:One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten$
HOLD:$
COMM:N
PATT:One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten\nMonday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday$
HOLD:$
COMM:2 D
PATT:Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday$
HOLD:$
COMM:N
PATT:Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday\nJanuary February March April May June July August September October November Deccmber$
HOLD:$
COMM:2 D
PATT:Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday\nJanuary February March April May June July August September October November Deccmber$
HOLD:$
COMM:3 D
PATT:January February March April May June July August September October November Deccmber$
HOLD:$
COMM:N
January February March April May June July August September October November Deccmber
```

- `sed '$!N;2D;3D' exam.txt`

最后一行不做N的操作，最终结果不输出。

#### `g/G` 覆盖/追加交换空间中的所有内容到模式空间

- `sed 'g' exam.txt`

输出三个空行原因是 `g`把空的交换空间内容覆盖到模式空间，输出打印模式空间内容空。结果如下

```
PATT:One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten$
HOLD:$
COMM:g
PATT:$
HOLD:$

PATT:Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday$
HOLD:$
COMM:g
PATT:$
HOLD:$

PATT:January February March April May June July August September Octo\
ber November Deccmber$
HOLD:$
COMM:g
PATT:$
HOLD:$

```

- `sed 'G' exam.txt`

`G` 追加交换空间的内容到模式空间，这个例子中输出结果相当于是每行末尾添加一个空行。

```
# sed 'G' exam.txt
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten

Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday

January February March April May June July August September October November Deccmber

```

- `seq 3 | sed 'N;G'`

```
1
2

3
```

- `seq 4 | sed 'N;G'`

```
1
2

3
4

```

#### `h/H` 拷贝/追加模式空间的内容到交换空间

- `sed '1h;3g' exam.txt`

```
# sed '1h;3g' exam.txt
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
```

- `sed '1{h;d};3G' exam.txt`

```
# sed '1{h;d};3G' exam.txt
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
January February March April May June July August September October November Deccmber
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
```

- `sed 'h;3g' exam.txt`

```
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
January February March April May June July August September October November Deccmber
```

- `sed '1h;3g' exam.txt`

```
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
```

- `sed 'H;3g' exam.txt`

```
# sed 'H;3g' exam.txt
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday

One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
January February March April May June July August September October November Deccmber
```

- `sed '1h;3x' exam.txt`

```
# sed '1h;3x' exam.txt
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
```

- `sed '1h;3{g;G}' exam.txt`

```
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
```

- `sed '2{x;p;x}' exam.txt`

在指定的行上面添加一个空行

```
One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten

Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
January February March April May June July August September October November Deccmber
```

## 进阶实例讲解

### 文件中有`/`如何处理简单

正常使用`sed`进行替换操作如 `sed 's/One/1/' exam.txt` 如果要匹配的是`/`则可以指定默认的符号，这里指定的为`:`(可以把这里的冒号默认理解为原来的`/`), 两个`:`之间的内容为要替换的内容。

- 将程序里以 `//` 注释修改为 `/*... */`注释
  - `sed 's://\(.*\):/* \1 */:' test.go`
  - `sed -r 's://(.*):/* \1 */:' test.go`
  - `sed -r 's#//(.*)#/* \1 */#' test.go`

### 如何输出奇数行

- `sed 'n;d' exam.txt`
- `sed -n 'p;n' exam.txt`
- `sed '$!N;P;d' exam.txt`

### 将偶数行附加在奇数行

- `sed '$!N;s/\n/ /' exam.txt`
  - 推荐这种方法
  - `$!N` 不对最后一行做`N`
- `sed -n 'h;n;H;g;s/\n/ /;p' exam.txt`

### 重温 `N`, `$!N` 的用法

- 在不熟悉`N`的运作模式下，请勿直接使用
- 一般情况下，用 `$!N` 绝对没错
- `N`一旦失败，代表着`sed`的结束

### 打印或删除匹配的上一行

- `sed -n '/hello/{g;p};h` 打印匹配`hello`的上一行
- `sed -n 'N;\n.*hello/!P;D'` 删除匹配`hello`的上一行

### 数字格式化

- `sed -r ':a;s/(.*[0-9])([0-9]{3})/\1,\2/;ta'`

```
# echo 1234567 | sed -r ':a;s/(.*[0-9])([0-9]{3})/\1,\2/;ta'
1,234,567

# echo 1234567 | sed --debug -r ':a;s/(.*[0-9])([0-9]{3})/\1,\2/;ta'
SED PROGRAM:
  :a
  s/(.*[0-9])([0-9]{3})/\1,\2/
  t a
INPUT:   'STDIN' line 1
PATTERN: 1234567
COMMAND: :a
COMMAND: s/(.*[0-9])([0-9]{3})/\1,\2/
MATCHED REGEX REGISTERS
  regex[0] = 0-7 '1234567'
  regex[1] = 0-4 '1234'
  regex[2] = 4-7 '567'
PATTERN: 1234,567
COMMAND: t a
COMMAND: :a
COMMAND: s/(.*[0-9])([0-9]{3})/\1,\2/
MATCHED REGEX REGISTERS
  regex[0] = 0-4 '1234'
  regex[1] = 0-1 '1'
  regex[2] = 1-4 '234'
PATTERN: 1,234,567
COMMAND: t a
COMMAND: :a
COMMAND: s/(.*[0-9])([0-9]{3})/\1,\2/
PATTERN: 1,234,567
COMMAND: t a
END-OF-CYCLE:
1,234,567
```

### 重温`t`,`b` 标签的用法

```
# cat num.txt
1
2
1
3
1
1
```

- 按行算，把第偶数个出现的`1`改为`0`
  - `sed '/1/{:a;n;s/1/0/;tb;ba;:b}' num.txt`

```
# sed '/1/{:a;n;s/1/0/;tb;ba;:b}' num.txt
1
2
0
3
1
0
```

#### 关键点

- `t/b`都表示跳转，区别在于t为有条件跳转
- `t`与`s`匹配同用，当替换成功则跳转
- 使用`b`请自带条件，否则易死循环

### 重温`d/D`的用法

#### 关键点

- 当模式空间无`\n`, `d/D`完全一样
- `N/P/D`用处大，`D`删除后如果模式空间还有内容，会继续进行循环
- 使用`d`删除后，直接跳到下一行

#### 打印带有`hello`的段落

- `sed '/./{H;$!d};x;/hello/!d;s/.//'`
- `awk -v RS= '/hello/'`

#### 删除文件最后10行内容

- `sed ':a;$d;N;2,10ba;P;D'`

### 神奇的用法 `~`

- 如何每隔2行输出1行，比如1，4，7，10

```
# seq 10 | sed -n '1~3p'
1
4
7
10
```

```
# seq 10 | sed -n '0~3p'
3
6
9
```

### 变态的 `addr1/addr2`

#### 关键点

- `0,/addr2/`和`1,/addr2/`类似，不同点在于是否`addr2`匹配了文件的第一行
- 当`addr1`匹配成功后，一直到匹配上`/addr2/`后才会关闭，且后续行不再打开
- 如果`/addr2/`一直无法匹配，则开关一直打开，规则一直执行到结束
- 如果`addr2`是行号，一旦该行大于`addr2`，即刻关闭开关，不执行后面的命令

```
# cat test
a1
a2
a3
a4
a5

# sed '0,/a/{s/a/ax/}' test
ax1
a2
a3
a4
a5

# sed '1,/a/{s/a/ax/}' test
ax1
ax2
a3
a4
a5

# sed '1,/z/{s/a/ax/}' test
ax1
ax2
ax3
ax4
ax5
```

## 综合实例讲解

### 反转单词

- `echo 'how are you' | sed -r 'G;:a;s/(\w+) ?(\n.*)/\2 \1/;ta;s/\n //'`
- `echo 'how are you' | awk '{for(i=NF;i>0;i--)printf("%s ",$i);print ""}'`
  - `you are how`

### 只将第二次出现的`1`替换为`0`

```
# cat num
1
2
1
3
1
```

- `sed '0,/1/b;0,/1/{/1/s/1/0/}' num`
- `awk '/1/{a++;if(a==2)gsub(/1/,0,$0)}1' num`

```
#sed '0,/1/b;0,/1/{/1/s/1/0/}' num 
1
2
0
3
1
```

### 实际案例

如下一个log文件，内容现在需要输出打印所有`syncing`字段记录，且带上时间。思路为把时间作为数组下标，带有syncing的作为key。

```
# cat log
Sun Mar 13 17:42:39 CST 2016
10.171.21.45 manual
10.170.2.45 load
Sun Mar 13 18:12:19 CST 2016
10.191.23.12 ping
10.233.82.2 syncing
10.34.11.11 loading
Sun Mar 13 18:32:49 CST 2016
10.33.32.11 syncing
10.32.32.32 manual
10.10.10.10 syncing
```

- `awk '/CST/{c=$0;a[c]}/syncing/{a[c]=a[c]$0"\n"}END{l=asorti(a,b);for(i=1;i<=l;i++)if(a[b[i]])printf b[i]"\n"a[b[i]]}' log`
- `sed -n '/CST/h;/syncing/{x;//!p;g;p}' log`
- `sed -n '/CST/h;/syncing/{x;/syncing/!p;g;p}' log`
- `sed -n '/CST/h;/syncing/{x;/^$/!p;g;p;s/.*//;h}' log`

```
Sun Mar 13 18:12:19 CST 2016
10.233.82.2 syncing
Sun Mar 13 18:32:49 CST 2016
10.33.32.11 syncing
10.10.10.10 syncing
```

- `sed -n '/CST/h;/syncing/{x;p;g;p;s/.*//;h}' log`

```
# sed -n '/CST/h;/syncing/{x;p;g;p;s/.*//;h}' log 
Sun Mar 13 18:12:19 CST 2016
10.233.82.2 syncing
Sun Mar 13 18:32:49 CST 2016
10.33.32.11 syncing

10.10.10.10 syncing
```

## 学习资料

- [Software Sed](https://www.gnu.org/software/sed/)函数参数
- [Sed Manual](https://www.gnu.org/software/sed/manual/sed.html)
- [sed.sourceforge.net](http://sed.sourceforge.net/)
- [a sed tutorial and reference](https://alexharv074.github.io/2019/04/16/a-sed-tutorial-and-reference.html)
- [sedsed](https://github.com/aureliojargas/sedsed)调试工具

### sedsed解释

- `-d` 打开调试模式
- `PATT` `Pattern Space`的内容
- `HOLD` `Hold Space`的内容
- `COMM` `sed`执行的命令
- $ `PATT`与`HOLD`的结束符
- `...` 不以任何标识符开头的是最终输出的结果

```
➜  ~ sedsed -d 'N;2D' exam.txt
PATT:One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten$
HOLD:$
COMM:N
PATT:One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten$
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday$
HOLD:$
COMM:2 D
PATT:Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday$
HOLD:$
COMM:N
PATT:Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday$
January February March April May June July August September October November Deccmber$
HOLD:$
COMM:2 D
PATT:Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday$
January February March April May June July August September October November Deccmber$
HOLD:$
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
January February March April May June July August September October November Deccmber
```

或直接使用

```
# sed --debug 'N;2D' exam.txt
SED PROGRAM:
  N
  2 D
INPUT:   'exam.txt' line 1
PATTERN: One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten
COMMAND: N
PATTERN: One/Two/Three/Four/Five/Six/Seven/Eight/Nine/Ten\nMonday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
COMMAND: 2 D
PATTERN: Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
COMMAND: N
PATTERN: Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday\nJanuary February March April May June July August September October November Deccmber
COMMAND: 2 D
END-OF-CYCLE:
Monday#Tuesday#Wednesday#Thursday#Friday#Saturday#Sunday
January February March April May June July August September October November Deccmber
```
