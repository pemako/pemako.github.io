---
date: '2026-04-09T20:00:00+08:00'
title: 'Linux 基础'
description: ""
summary: ""
tags: ["linux"]
categories: ["linux"]
series: ["Linux"]
ShowToc: true
TocOpen: true
---


GUI \(Graphical User Interface\) 图形用户界面。用户界面的所有元素图形化，主要使用鼠标作为输入工具，点击图标执行程序，使用按钮、菜单、对话等尽心个交互，追求医用，看起来比较美

CLI \(Command Line Interface\) 命令行界面。用户界面字符化，使用键盘作为输入工具，输入命令、选项、参数执行程序，追求高效，看起来比较酷

## 缩写习惯

### 1. 最常见的缩写，取每个单词的首字母

* `cd` `Change Directory`
* `dd` `Disk Dump`
* `df` `Disk Free`
* `du` `Disk Usage`
* `pwd` `Print Working Directory`
* `ps` `Processes Status`
* `PS` `Prompt Strings`
* `su` `Substitute User`
* `rc` `Run Command`
* `Tcl` `Tool Command Language`
* `cups` `Common Unix Printing System`
* `apt` `Advanced Package Tool`
* `bg` `BackGround`
* `ping` `Packet InterNet Grouper`

### 2. 如果首字母后为`h`,通常保留

* `chsh` `CHange SHell`
* `chmod` `CHange MODe`
* `chown` `CHange OWNer`
* `chgrp` `CHange GRouP`
* `bash` `Bourne Again Shell`
* `zsh` `Z SHell`
* `ksh` `Korn SHell`
* `ssh` `Secure SHell`

### 3. 递归缩写类

* `GNU` `GUN's Not Unix`
* `PHP` `PHP; Hypertext Pregrocessor`
* `RPM` `RPM Package Manager`
* `WINE` `WINE Is Not an Emulator`
* `PNG` `PNG's Not GIF`
* `nano` `Nano's ANOther editor`

### 4. 如果只有一个单词，通常取每个音节的首字母

* `cp` `CoPy`
* `ln` `LiNk`
* `ls` `LiSt`
* `mv` `MoVe`
* `rm` `ReMove`

### 5. 对于目录，通常使用前几个字母作为缩写

* `bin` `BINaries`
* `dev` `DEVices`
* `etc` `ETCetera`
* `lib` `LIBrary`
* `var` `VARiable`
* `proc` `PROCesses`
* `sbin` `Superuser BINaries`
* `tmp` `TemPorary`
* `usr` `Unix Shared Resources`
* `diff` `DIFFerences`
* `cal`    `CALendar`
* `cat`    `CATenate`
* `ed`    `EDitor`
* `exec` `EXECute`
* `tab`    `TABle`
* `regexp` `REGular EXPression`

### 6. 如果某种缩写比较深入人心，例如"mesg"代表"message"，在新的复合缩写中，将沿用这种缩写方式

* `dmesg` `Diagnostic MESsaGe`
* `sed` `Stream EDitor`
* `stty` `Set TTY`
* `fstab` `FileSystem TABle`
* `passwd` `PASSWorD`

### 7. 有些缩写中，第一个字母'g'，代表'GNU'

* `awk` `Aho Weiberger and Kernighan`
* `gawk` `GNU AWK`
* `gpg` `GNU Privacy Guard`
* `grep` `GNU Regular Expression Print`
* `egrep` `Extended GREP`

## 命令选项，从a到z

* a
  * all: 全部，所有（ls, uname, lsattr）
  * archive: 存储\(cp, rsync\)
  * append: 附加 \(tar -A , 7z\)
* b
  * blocksize: 块大小，带参数 \(du , df\)
  * batch: 批处理模式 \(交互模式的程序通常拥有此选项，如 top -b\)
* c
  * commands : 执行命令，带参数 \(bash , ksh , python\)
  * create : 创建 \(tar\)
* d
  * debug : 调试
  * delete : 删除
  * directory : 目录 \(ls\)
* e
  * execute : 执行，带参数 \(xterm , perl\)
  * edit : 编辑
  * exclude : 排除
* f
  * force : 强制，不经确认\(cp , rm ,mv\)
  * file : 文件，带参数 \(tar\)
  * configuration file : 指定配置文件\(有些守护进程拥有此选项，如 ssh , lighttpd\)
* g
* h
  * --help : 帮助
  * human readable : 人性化显示\(ls , du , df\)
  * headers : 头部
* i
  * interactive : 交互模式，提示\(rm , mv\)
  * include : 包含
* k
  * keep : 保留
  * kill
* l
  * long listing format : 长格式\(ls\)
  * list : 列表
  * load : 读取 \(gcc , emacs\)
* m
  * message : 消息 \(cvs\)
  * manual : 手册 \(whereis\)
  * create home : 创建 home 目录 \(usermod , useradd\)
* n
  * number : 行号、编号 \(cat , head , tail , pstree , lspci\)
  * no : \(useradd , make\)
* o
  * output : 输出 \(cc , sort\)
  * options : 选项 \(mount\)
* p
  * port : 端口，带参数 \(很多网络工具拥有此选项，如 ssh , lftp \)
  * protocol : 协议，带参数
  * passwd : 密码，带参数
* q
  * quiet : 静默
* r
  * reverse : 反转
  * recursive : 递归 \(cp , rm , chmod -R\)
* s
  * silent : 安静
  * size : 大小，带参数
  * subject
* t
  * tag
  * type: 类型（mount）
* u
  * user：用户名、UID、带参数
* v
  * verbose : 冗长
  * version : 版本
* w
  * width : 宽度
  * warning : 警告
* x
  * exclude : 排除 \(tar , zip\)
* y
  * yes
* z
  * zip : 启用压缩 \(bzip , tar , zcat , zip , cvs\)

## 学会使用`man`命令

> 下面以 `man date` 为例进行说明
![](https://raw.githubusercontent.com/pemako/assets/main/2022/202212081315728.png)
![](https://raw.githubusercontent.com/pemako/assets/main/2022/202212081316797.png)

* `man date`
  * DATE\(1\) 1代表的是一般用户可以执行的命令
  * Name 简短的命令，数据名称说明
  * SYNOPSIS 简单的命令执行语法简介
  * DESCRIPTION 命令较为完整的说明
  * FORMAT 格式化输出的详细数据
  * ENVIRONMENT 与这个命令相关的环境参数有如下说明
  * AUTHOR 这个命令的作者
  * REPORTING BUGS bugs  反馈地址
  * COPYRIGHT 收到著作权法的保护！用的就是 GPL
  * SEE ALSO 查看与 date 相关的说明
* 常见的数字的意义

| 数字 | 代表内容 |
| :--- | :--- |
| 1 | 用户在 shell 环境中可以操作的命令或可执行文件 |
| 2 | 系统内核可调用的函数与工具等 |
| 3 | 一些常用的函数（function）与函数库（library）大部分为 C 的函数库（libc） |
| 4 | 设备文件的说明，通常在 /dev 下的文件 |
| 5 | 配置文件或是某些文件的格式 |
| 6 | 游戏 games |
| 7 | 惯例与协议等，例如 Linux 文件系统、网络协议、ASCII code 等的说明 |
| 8 | 系统管理员可以执行的管理命令 |
| 9 | 跟 kernel 有关的文件 |

* Man page 大致分为下面几个部分

| 代号 | 内容说明 |
| :--- | :--- |
| NAME | 简短的命令，数据名称说明 |
| SYNOPTIONS | 简短的命令执行语法（syntax）简介 |
| DESCRIPTION | 较为完整的说明 |
| OPTIONS | 针对 SYNOPTIONS 部分中，有列举的所有可用的选项说明 |
| COMMANDS | 当这个程序（软件）在执行的时候，可以在此程序（软件）中执行的命令 |
| FILES | 这个程序或数据所使用或参考或连接到的某些文件 |
| SEE ALSO | 这个命令或数据相关的其他说明 |
| EXAMPLE | 一些参考的范例 |
| BUGS | 是否哟相关的错误 |


---

## 一些命令

- apropos 显示一系列适合的命令
- whatis 显示一个命令的简洁描述
- tee - 从标准输入读取数据，并同时写到标准输出和文件
- traceroute 显示从本地到指定主机 要经过的所有“跳数”的网络流量列表
- netstat  程序被用来检查各种各样的网络设置和统计数据
- gzip 压缩或文件
  - -d 解压缩 和 gunzip 命令一样
  - gunzip 解压 gzip 的压缩文件
- bzip2 块排序文件压缩器 -d 解压
- tar 打包工具
- zip 打包和压缩文件
- rsync 同步远端文件和目录
- paste 将给定输入文件相应行连接起来，用单个制表符替换除最后一个文件的换行符外的所有行符
- tr 基于字符的查找和替换
  - -d 删除指定字符 `tr -d '\r' < file`
  - -s 挤压（删除）连续的重复字符 `echo "aaabbbccc" | tr -s ab` 得到 `abccc`  
- sed 命令 [[SED使用教程]]
  - <https://edoras.sdsu.edu/doc/sed-oneliners.html>
  - <https://quickref.me/sed.html>
  - <https://www.pement.org/sed/sed1line.txt>
  - <https://www.grymoire.com/Unix/Sed.html>
- aspell 交互式的拼写检查器
  - <https://github.com/GNUAspell/aspell>

由此产生的线路到标准输出

## 一些概念

### 文件描述符（File Descriptor, FD）

文件描述符是一个非父整数，用于标识进程在操作系统内核中打开的文件或其它输入/输出资源。文件描述符是操作系统管理文件和资源的一种抽象，几乎所有的输入/输出操作都依赖它们。

文件描述符用于以下几种常见的资源

- 文件： 当一个文件被打开时，操作系统返回一个文件描述符，以后对该文件的读写操作都通过这个文件描述符来进行
- 管道：管道是一种特殊的文件，用于在进程之间传递数据。管道的两端分别对应两个文件描述符，一个用于读，一个用于写
- 套字节：网络通信中的套接字也使用文件描述符来标识
- 设备文件：如终端、打印机等设备，操作系统将其视为文件，也使用文件描述符来标识

在 Unix 和 Linux 系统中，前三个文件描述符是标准的

- 0: 标准输入（stdin）默认情况下从键盘输入数据
- 1: 标准输出（stdout）默认情况下输出数据到屏幕
- 2: 标准错误（stderr）默认情况下输出错误信息到屏幕

文件描述符的工作原理
当一个进程启动时，操作系统为其分配一组文件描述符，用于管理文件和设备的输入输出。文件描述符是进程级的，这意味着每个进程都有自己独立的文件描述符表。

#### 标出输出，错误输出重定向问题

- 标准输出重定向 `mako@ubuntu:~$ ls -l /bin/users > ls-output.txt`
- 标准输出重定向 `mako@ubuntu:~$ > ls-output.txt`
  - 表示直接清空 ls-output.txt 的内容或创建这个空文件
- 标准错误输出重定向 `mako@ubuntu:~$ ls -l /bin/users 2> ls-error.txt`
  - 在重定向符号前面添加上 `2` （标准错误的文件描述符）
- 标准输出和错误输出重定向到一个文件 `mako@ubuntu:~$ ls -l /bin/users > output.txt 2>&1`
  - 另外一种写法 `mako@ubuntu:~$ ls -l /bin/users &> output.txt`
- 输入不做处理 `mako@ubuntu:~$ ls -l /bin/users > /dev/null`
  - `/dev/null` 文件是系统设备，叫做位存储桶，它可以接受输入，并且对输入不做 任何处理

### shell 中算术表达式

- `$((expression))`

### 特殊的权限位

- `setuid` `chmod u+s program`
  - 当应用到一个可执行文件时，它把有效用户ID从真正的用户（实际运行程序的用户）设置成程序所有者的ID
  - 如  `-rwsr-xr-x 1 root root 59976 Feb  6 20:54 /usr/bin/passwd`
- `setgid` `chmod g+s dir`
  - 把有效用户组 ID 从 真正的用户组 ID 更改为文件所有者的组 ID
  - 当 `setgid` 位设置在一个目录上时，该目录中创建的新文件和子目录将继承其父目录的组，而不是创建它们的用户的主组
  - 一版用于 共享工作目录，开发环境目录及临时目录设置使用
- `sticky` `chmod +t dir`
  - 如果一个目录设置了 sticky 位，那么它能阻止用户删除或重命名文件，除非用户是 这个目录的所有者，或者是文件所有者，或是超级用户
  - 常用来控制访问共享目录，如 `/tmp`
  - `drwxrwxrwt.  46 root  root  126976 Jun 17 09:23 tmp`

### 进程状态描述

| 状态  | 含义                                                          |
| --- | ----------------------------------------------------------- |
| R   | 运行中。这意味着，进程正在运行或准备运行。                                       |
| S   | 正在睡眠。进程没有运行，而是，正在等待一个事件，比如 说，一个按键或者网络分组。                    |
| D   | 不可中断睡眠。进程正在等待 I/O，比方说，一个磁盘驱动 器的 I/O。                        |
| T   | 已停止. 已经指示进程停止运行。                                            |
| Z   | 一个死进程或“僵尸”进程。这是一个已经终止的子进程， 但是它的父进程还没有清空它。(父进程没有把子进程从进程表中删除) |
| <   | 一个高优先级进程                                                    |
| N   | 低优先级进程                                                      |

### sudo 和 su

`sudo` 命令

- **执行单个命令**：`sudo` 命令用于以另一个用户（通常是超级用户 root）的身份执行单个命令。
- **身份验证**：`sudo` 命令要求用户输入自己的密码，而不是 root 的密码。这意味着用户需要被授予使用 `sudo` 的权限（配置在 `/etc/sudoers` 文件中）。
- **权限控制**：系统管理员可以在 `/etc/sudoers` 文件中配置特定用户或用户组对某些命令的执行权限。这提供了更细粒度的权限控制。
- **日志记录**：`sudo` 命令的使用会被记录在日志文件中（通常在 `/var/log/auth.log`），这便于审计和追踪。

`su` 命令

- **切换用户身份**：`su` 命令用于切换到另一个用户的身份。默认情况下，`su` 切换到 root 用户，但也可以切换到其他用户。
- **身份验证**：`su` 命令要求输入目标用户（通常是 root）的密码。这意味着用户需要知道 root 的密码或其他目标用户的密码。
- **新 shell 环境**：`su` 命令切换用户身份后，会启动一个新的 shell 环境。加上 `-` 或 `-l` 参数时，`su` 将会模拟一个完整的登录，会加载目标用户的环境变量和配置文件。
- **持续权限**：`su` 切换用户后，所有后续命令都会以新的用户身份执行，直到退出当前 shell 环境。

### read 从标准输入读取数值

| 选项         | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| -a array     | 把输入赋值到数组 array 中，从索引号零开始                    |
| -d delimiter | 用字符串 delimiter 中的第一个字符指示输入结束，而不是 一个换行符 |
| -e           | 使用 Readline 来处理输入                                     |
| -n num       | 读取 num 个输入字符, 而不是整行                              |
| -p prompt    | 为输入显示提示信息，使用字符串 prompt                        |
| -r           | Raw mode. 不把反斜杠字符解释为转义字符                       |
| -s           | Silent mode. 不会在屏幕上显示输入的字符。当输入密码和其它确认信息的时候有帮助 |
| -t seconds   | 超时。几秒钟后终止输入。若输入超时，read会返回一个非零退出状态 |
| -u fd        | 使用文件描述符 fd 中的输入，而部署标准输入                   |

```shell
#!/bin/bash
# read-ifs: read fields from a file
FILE=/etc/passwd
read -p "Enter a user name > " user_name
file_info=$(grep "^$user_name:" $FILE)
if [ -n "$file_info" ]; then
 OLD_IFS="$IFS"
 IFS=":"
 read user pw uid gid name home shell <<< "$file_info"
 # <<< 操作符指示一个 here 字符串。一个 here 字符串就像一个 here 文档，只是比较简短，由单个字符串组成
 IFS="$OLD_IFS"
fi
```

**注意**  上面采用 `here 字符串 <<<` 的模式来使用，不能把管道用在 read 上

如  `echo "foo" | read` 这个命令将显示成功，但是 REPLY 变量总是为空。为什么会这样?

在 bash 中管道线会创建子 shell。这个子 shell 是为了执行执行管线中的命令而创建的 shell 和 它的环境的副本。上面的示例中 read 命令将在子 shell 中执行。

在类 Unix 的系统中，子 shell 执行的时候，会为进程创建父环境的副本。当进 程结束之后，该副本就会被破坏掉。这意味着一个子 shell 永远不能改变父进程的 环境。read 赋值变量，然后会变为环境的一部分。在上面的例子中，read 在它的子 shell 环境中，把 foo 赋值给变量 REPLY，但是当命令退出后，子 shell 和它的环境 将被破坏掉，这样赋值的影响就会消失。

使用 here 字符串是解决此问题的一种方法。

## 一些点

### 单词分割问题

单词分割机制把换行符看作界定符，对命令替换产生了一个虽然微妙但有趣的影响。

```shell
# 没有引用的命令替换导致命令行包含 39 个参数
mako@ubuntu:~/books$ echo $(cal)
June 2024 Su Mo Tu We Th Fr Sa 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30

# 命令 行只有一个参数，参数中包括嵌入的空格和换行符
mako@ubuntu:~/books$ echo "$(cal)"
     June 2024
Su Mo Tu We Th Fr Sa
                   1
 2  3  4  5  6  7  8
 9 10 11 12 13 14 15
16 17 18 19 20 21 22
23 24 25 26 27 28 29
30
```

### 正则表达式 （POSIX标准）

- 正则表达式元字符 `^ $ . [ ] { } - ? * + ( ) | \`
- `^$` 行首和行尾之间没有字符，会匹配空行
-

> shell 中使用 case 的时候默认不匹配多个测试条件，现在的 bash 版本中，添加 ";;&" 表达式来终止每个行动

### shell 中特殊的参数

| 参数  | 描述                                                                                                                                |
| --- | --------------------------------------------------------------------------------------------------------------------------------- |
| $*  | 展开成一个从 1 开始的位置参数列表。当它被用双引号引 起来的时候，展开成一个由双引号引起来的字符串，包含了 所有的位置参数，每个位置参数由 shell 变量 IFS 的第一个字符(默认为一个空格)分隔开。如果 IFS 为 null，则连接参数时不插入分隔符 |
| $@  | 展开成一个从 1 开始的位置参数列表。当它被用双引号引 起来的时候，它把每一个位置参数展开成一个由双引号引起来的分开的字符串                                                                    |
| $#  | 扩展为十进制位置参数的数量                                                                                                                     |
| $-  | 扩展为调用时指定的当前选项标志，由 `set` 内置命令或 shell 本身设置的选项标志（例如 -i 选项） ）                                                                         |

### 组命令和子shell

组命令: `{ command1; command2; [command3; ...]}`

- 花括号与命令之间必须有一个空格，并且最后一个命令必须用一个分号或者一个换行符终止
- 组命令中的命令则直接在当前Shell进程中执行，因此对于环境的修改会影响到后续的命令执行。

子shell: `(command1; command2; [command3; ...])`

- 子shell会创建一个新的子进程来执行其中的命令，子进程会继承父进程的环境变量和文件描述符等信息
- 因此在子shell中执行的命令对于父进程来说是独立的，不会影响到父进程的环境

> 注意： 任何通过子shell给变量赋值的命令会导致变量为空。如 `echo "foo" | read ; echo $REPLY` 的值一直为空

shell 提供了一种叫做**进程替换**的方式来解决这类问题。进程替换有两种表达方式

1. 适用于产生标准输出的进程 `<(list)`
2. 适用于接受标准输入的进程 `>(list)`

如解决上面 read 的问题，可以使用下面的形式

```bash
read < <(echo "foo")
echo $REPLY
```

### trap 陷阱

当 shell 脚本接收到一些信号量（如 ctl+c）的时候，执行一些动作。可以使用 `trap`

`trap` 的语法 `trap argument signal [signal...]` 这里的 `argument` 是一个字符串，它被读取并当作一个命令，`signal`是一个信号的说明，它会触发执行所要解释的命令。

### 字符串和数字

#### 管理空变量的展开

| 形式                   | 说明                                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| `${parameter:-word}` | `parameter`有值使用自己，未设置或为空使用 `word` 的值                                                            |
| `${parameter:=word}` | `parameter`有值使用自己，未设置或为空使用 `word` 的值，且会把 `word`的值赋值给 `parameter`                                |
| `${parameter:?word}` | 若 parameter 没有设置或为空，这种展开导致脚本带有错误退出，并且 word 的内容会发送 到标准错误。若 parameter 不为空，展开结果是 parameter 的值。     |
| `${parameter:+word}` | 若 parameter 没有设置或为空，展开结果为空。若 parameter 不为空，展开结果是 word 的 值会替换掉 parameter 的值;然而，parameter 的值不会改变。 |
|                      |                                                                                                 |

```shell
#!/bin/bash
# ${parameter:-word}
foo=
echo ${foo:-substitute value if unset} # 输出 substitute value if unset
echo $foo # 输出空
foo=bar
echo ${foo:-substitute value if unset} # 输出 bar
echo $foo # 输出 bar

# ${parameter:=word}
foo=
echo ${foo:="default value if unset"} # 输出 default value if unset
echo $foo # 输出 default value if unset
foo=bar
echo ${foo:="default value if unset"} # 输出 bar
echo $foo # 输出 bar

# ${parameter:?word}
foo=
echo ${foo:?"parameter is empty"} # 输出 bash: foo: parameter is empty
echo $? # 输出 1
foo=bar
echo ${foo:?"parameter is empty"} # 输出 bar
echo $foo # 输出空

# ${parameter:+word}
foo=
echo ${foo:+"substitute value if set"} # 输出空
foo=bar
echo ${foo:+"substitute value if set"} # 输出 substitute value if set
```

#### 返回变量名的参数展开

`${!prefix*}` 和 `${!prefix@}` 都会返回以 `prefix` 开头的已有变量名。两种形式的执行结果形同。

##### 字符串展开

> 字符串操作展开可以用来替换其它常见命令比方说 sed 和 cut。通过减少使用外部程序，展开提高了脚本的效率。

| 形式                           | 说明                                                         |
| ------------------------------ | ------------------------------------------------------------ |
| `${#parameter}`                | 返回parameter所包含的字符串长度。如果 `parameter`为 @ 或 * 则结果为位置参数的个数 |
| `${parameter:offset}`          | 获取 从第offset 个字符到字符串结尾的内容                     |
| `${parameter:offset:length}`   | 获取 从第offset 个字符开始数 length 个长度的字符             |
| `${parameter#pattern}`         | `#`清除模式 `foo=file.txt.zip; echo ${foo#*.}` 输出结果 txt.zip |
| `${parameter##pattern}`        | `foo=file.txt.zip; echo ${foo##*.}` 输出结果 zip             |
| `${parameter%pattern}`         | 从尾部开始最小匹配删除字符串 `echo ${foo%.*}` # file.txt    |
| `${parameter%%pattern}`        | 从尾部开始最大匹配删除字符串 `echo ${foo%%.*}` # file       |
| `${parameter/pattern/string}`  | 查找替换匹配的第一个 `echo ${foo/./|` # 输出 `file|txt.zip`  |
| `${parmeter//pattern/string}`  | 查找替换全部 `echo ${foo//./|` # 输出 `file|txt|zip`         |
| `${parameter/#pattern/string}` | /# 要求匹配项出现在字符串的开头 `foo=JPG.JPG;echo ${foo/#JPG/jgp}`  输出 jpg.JPG |
| `${parameter/%pattern/string}` | 而 /% 要求匹 配项出现在字符串的末尾 `echo ${foo/%JPG/jpg}` JPG.jpg |

##### 大小写转换

| 格式               | 说明                      |
| ---------------- | ----------------------- |
| `${parameter,,}` | 把 parameter 的值全部展开为小写字母 |
| `${parameter,}`  | 仅把第一个字符串展开为小写           |
| `${parameter^^}` | 把 parameter 的值全部转换成大写字母 |
| `${parameter^}`  | 仅把 parameter 的首字母大写     |

##### 数基

| 表示法        | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| `number`      | 默认情况下，没有任何表示法的数字被看做是十进制数(以 10 为底) |
| `0number`     | 八进制                                                       |
| `0xnumber`    | 十六进制                                                     |
| `base#number` | number以base为底                                             |

##### 如何在 shell 进行高级的数学运算或使用浮点数

不能直接使用shell完成此类运行。可以使用外部程序如嵌入Perl 、AWK 等。或者使用 bc 命令。

```bc
/* foo.bc A very simple bc script */
2 + 2
```

1. `bc -q foo.bc`
2. `bc < foo.bc`

##### 找到数组元素的下标

`${!array[*]}` 和 `${!array[@]}`

```bash
#!/bin/bash
foo=([2]=a [4]=b [6]=c)
for i in "${!foo[@]}"; do
 echo $i
done
# 输出： 2 4 6
```

##### 临时文件

mktemp 程序接受一个用于创建文件名的模板作为参 数。这个模板应该包含一系列的“X”字符，随后这些字符会被相应数量的随机字 母和数字替换掉。一连串的“X”字符越长，则一连串的随机字符也就越长。

```sh
tempfile=$(mktemp /tmp/foobar.$$.XXXXXXXXXX) # 文件名如 /tmp/foobar.844890.NGOzxtorFx
```

##### 异步执行

在 `bash` 中可以使用 `wait` 命令来管理异步执行的任务，该命令会导致一个父脚本暂停运行，直到一个特定的进程运行结束。

```shell
#!/bin/bash
# async-parent: Asynchronous execution demo (parent)

echo "Parent: starting..."
echo "Parent: launching child script..."
aynsc-child &
pid=$!
echo "Parent: child (PID= $pid) launched."
echo "Parent: continuing..."
sleep 2
echo "Parent: pausing to wait for child to finish..."
wait $pid # 这里会等到子脚本执行完成后后续的才会执行
echo "Parent: child is finished. Continuing..."
echo "Parent: parent is done. Exiting."


#!/bin/bash
# async-child : Asynchronous execution demo (child)
echo "Child: child is running..."
sleep 5
echo "Child: child is done. Exiting."

```
