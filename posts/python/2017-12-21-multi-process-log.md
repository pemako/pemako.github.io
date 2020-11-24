---
layout: post
title: 多进程日志问题
description: 多进程日志问题
keywords: python
category: python
tags:
  - python
---

# 2017-12-21-multi-process-log

1. python 在多进程下打日志出现丢失错乱等问题，是由于 python 源码的问题。可以引入第三方包进行轻松解决

```text
pip install ConcurrentLogHandler
```

`sample.py`

```python
log = getLogger()
# Use an absolute path to prevent file rotation trouble.
logfile = os.path.abspath("mylogfile.log")
# Rotate log after reaching 512K, keep 5 old copies.
rotateHandler = ConcurrentRotatingFileHandler(logfile, "a", 512*1024, 5)
log.addHandler(rotateHandler)
log.setLevel(INFO)

if __name__ == '__main__':
    import time, os
    from logging import getLogger, INFO
    from cloghandler import ConcurrentRotatingFileHandler

    log = getLogger()
    # Use an absolute path to prevent file rotation trouble.
    logfile = os.path.abspath("mylogfile.log")
    # Rotate log after reaching 512K, keep 5 old copies.
    rotateHandler = ConcurrentRotatingFileHandler(logfile, "a", 512*1024, 5)
    log.addHandler(rotateHandler)
    log.setLevel(INFO)

    while True:
        log.info( str(os.getpid()) + " " + str(time.time()))
        time.sleep(1)
```

`sample.config.py`

```python
if __name__ == '__main__':
    import os, time
    import logging, logging.config
    import cloghandler

    logging.config.fileConfig("logging.ini")
    log = logging.getLogger()

    while True:
        log.info(str(os.getpid()) + " " + str(time.time()))
        time.sleep(1)
```

`logging.ini`

```text
[loggers]
keys=root

[handlers]
keys=hand01

[formatters]
keys=form01

[logger_root]
level=NOTSET
handlers=hand01

[handler_hand01]
class=handlers.ConcurrentRotatingFileHandler
level=NOTSET
formatter=form01
args=("rotating.log", "a", 512*1024, 5)

[formatter_form01]
format=%(asctime)s %(levelname)s %(message)s
```

```text
1. nohup python xxx & 多个文件进行观察日志打印情况
2. ps aux | grep xxx | grep -v grep | awk '{print $2}' | xargs kill -9  # 杀死所有进程
```

