---
layout: post
title: PHP单步调试
description: php,xdebug,phpstrom
keywords: php,xdebug,phpstorm
category: php
tags: [php]
---

废话不说直接上步骤

- 系统环境

```
Mac 10.13.6
PhpStorm 2018.1.4
MANP Pro 5.1
```

- 参考
    - https://blog.csdn.net/u012852597/article/details/78358463
    - http://www.cnblogs.com/orzlin/p/5179711.html

## 步骤

- 1、查看MAMP PRO 中Apache的端口 默认为8888
![trace](https://pemako.github.io/assets/imags/php/01)

- 2、查看PHP的版本及扩展中xdebug是否开启
￼
![trace](https://pemako.github.io/assets/imags/php/02)

- 3、配置PhpStorm Xdebug 端口及Server
    
    - 3.0、PHP的版本要和MANP中的选择的PHP版本一致
￼
    ![trace](https://pemako.github.io/assets/imags/php/03)

    - 3.1、xdebug port 的值9000 和 php.ini 中 xdebug配置的port 要保持一致

    ![trace](https://pemako.github.io/assets/imags/php/04)
￼
    - 3.2、IDE key 要和 php.ini中配置的保持一致；主机名和端口要和MANP中配置的保持一致
￼
    ![trace](https://pemako.github.io/assets/imags/php/05)

上面配置完成后保存后关闭

- 4、配置一个web服务器
    
    - 点击Edit Configurations
    ![trace](https://pemako.github.io/assets/imags/php/06)
￼
    - 点击 + 号添加入图所示
￼
    ![trace](https://pemako.github.io/assets/imags/php/07)

- 5、全部添加完成后就可以开始进行debug单步调试
    - 选择需要调试的脚本
    - 开启Debug 监听
    - 点击 Debug 运行
￼
![trace](https://pemako.github.io/assets/imags/php/08)

- 6、单步调试的效果如图

![trace](https://pemako.github.io/assets/imags/php/09)
