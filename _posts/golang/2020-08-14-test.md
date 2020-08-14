---
layout: post
title: Mac下gdb调试go程序
category: golang
tags: [golang, debug, gdb]
---

在Mac进行使用gdb调试的遇到的几个坑进行记录总结

### 我的环境

- 系统环境
    ```
    HOMEBREW_VERSION: 2.0.3
    ORIGIN: https://github.com/Homebrew/brew
    HEAD: 6865aee729ebc28dfa4af6fdbaeec297df0ac34c
    Last commit: 2 days ago
    Core tap ORIGIN: https://github.com/Homebrew/homebrew-core
    Core tap HEAD: 4d5e6a779f57a289bfa2db6118621fb5b5808747
    Core tap last commit: 6 hours ago
    HOMEBREW_PREFIX: /usr/local
    HOMEBREW_LOGS: /Users/mako/Library/Logs/Homebrew
    CPU: quad-core 64-bit haswell
    Homebrew Ruby: 2.3.7 => /System/Library/Frameworks/Ruby.framework/Versions/2.3/usr/bin/ruby
    Clang: 10.0 build 1000
    Git: 2.21.0 => /usr/local/bin/git
    Curl: 7.54.0 => /usr/bin/curl
    Java: 1.8.0_202
    macOS: 10.13.6-x86_64
    CLT: 10.1.0.0.1.1539992718
    Xcode: 10.1
    ```

- go 版本
    
    ```go version go1.12 darwin/amd64```

- gdb 版本
    
    ```GNU gdb (GDB) 8.2.1```

### 安装设置

- `brew install gdb`
- `echo "set startup-with-shell off" >> ~/.gdbinit`
- 创建证书
	- 1、打开 Keychain Access -> Certificate Assistant -> Create a Certificate...
	- 2、设置 
    	- Name: gdb_cert; 
    	- Identity Type:Self Signed Root
    	- Certifcate Type: Code Signing
    	- 勾选 Let me override defaults
    	- 一路下一步直到出现最后 Keychain: 选择 login(这里选择System的话会导致证书创建失败，先选择login模式后面进行导出后重新导入设置)
	- 3、设置密码导出证书
	- 4、导入证书把导出的证书拖到 Keychain Access-> System中即可
	- 5、codesign -f -s gdb_cert $(which gdb)
	- 6、如不生效重启电脑

- Go环境设置
    
    - `export GOFLAGS="-ldflags=-compressdwarf=false"` [参考](https://golang.org/doc/gdb#Known_Issues) 第4点
    
- 编译 `go build -gcflags "-N -l" -o hello-world hello-world.go`
 
- 调试demo

```
➜  methods gdb hello-world
GNU gdb (GDB) 8.2.1
Copyright (C) 2018 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
Type "show copying" and "show warranty" for details.
This GDB was configured as "x86_64-apple-darwin17.7.0".
Type "show configuration" for configuration details.
For bug reporting instructions, please see:
<http://www.gnu.org/software/gdb/bugs/>.
Find the GDB manual and other documentation resources online at:
    <http://www.gnu.org/software/gdb/documentation/>.

For help, type "help".
Type "apropos word" to search for commands related to "word"...
Reading symbols from hello-world...done.
Loading Go Runtime support.
(gdb) run
Starting program: /Users/mako/Work/2019/golearn/src/github.com/pemako/tour/content/methods/hello-world
[New Thread 0x1003 of process 2705]
[New Thread 0xf03 of process 2705]
During startup program terminated with signal SIGTRAP, Trace/breakpoint trap.
(gdb) info files
Symbols from "/Users/mako/Work/2019/golearn/src/github.com/pemako/tour/content/methods/hello-world".
Local exec file:
	`/Users/mako/Work/2019/golearn/src/github.com/pemako/tour/content/methods/hello-world', file type mach-o-x86-64.
	Entry point: 0x1052100
	0x0000000001001000 - 0x00000000010926a4 is .text
	0x00000000010926c0 - 0x00000000010e0fdf is __TEXT.__rodata
	0x00000000010e0fe0 - 0x00000000010e10e2 is __TEXT.__symbol_stub1
	0x00000000010e1100 - 0x00000000010e1d64 is __TEXT.__typelink
	0x00000000010e1d68 - 0x00000000010e1dd0 is __TEXT.__itablink
	0x00000000010e1dd0 - 0x00000000010e1dd0 is __TEXT.__gosymtab
	0x00000000010e1de0 - 0x000000000115bf18 is __TEXT.__gopclntab
	0x000000000115c000 - 0x000000000115c158 is __DATA.__nl_symbol_ptr
	0x000000000115c160 - 0x0000000001168c9c is __DATA.__noptrdata
	0x0000000001168ca0 - 0x000000000116f610 is .data
	0x000000000116f620 - 0x000000000118ae50 is .bss
	0x000000000118ae60 - 0x000000000118d418 is __DATA.__noptrbss
(gdb) b *0x1052100
Breakpoint 1 at 0x1052100: file /usr/local/Cellar/go/1.12/libexec/src/runtime/rt0_darwin_amd64.s, line 8.
(gdb) b _rt0_amd64
Breakpoint 2 at 0x104e800: file /usr/local/Cellar/go/1.12/libexec/src/runtime/asm_amd64.s, line 15.
(gdb) b runtime.rt0_go
```


### 参考

- 1、[https://stackoverflow.com/questions/52534287/debug-go-program-with-gdb-on-macos](https://stackoverflow.com/questions/52534287/debug-go-program-with-gdb-on-macos)
- 2、[https://groups.google.com/forum/#!topic/golang-nuts/LlgN1qpbRE8](https://groups.google.com/forum/#!topic/golang-nuts/LlgN1qpbRE8)
- 3、[https://golang.org/doc/gdb#Known_Issues](https://golang.org/doc/gdb#Known_Issues)
- 5、[http://www.voidcn.com/article/p-exgsckda-brx.html](http://www.voidcn.com/article/p-exgsckda-brx.html)
