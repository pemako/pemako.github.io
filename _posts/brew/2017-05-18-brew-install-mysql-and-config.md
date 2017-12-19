---
layout: post
title: brew install mysql and config
category: brew
tags: [brew,mysql]
---


```
# 安装 mysql
brew install mysql

# 按照提示进行设置
mysql_secure_installation

# 起停
mysql.server  {start|stop|restart|reload|force-reload|status}

# 设置 my.cnf 
/usr/local/etc/my.cnf
```
