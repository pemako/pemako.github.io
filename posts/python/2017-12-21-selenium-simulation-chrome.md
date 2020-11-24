---
layout: post
title: selenium模块模拟Chrome浏览器
description: selenium模块模拟Chrome浏览器
keywords: 'python, selenium'
category: python
tags:
  - python
  - selenium
---

# 2017-12-21-selenium-simulation-chrome

1. [参考资料1](https://huilansame.github.io/huilansame.github.io/archivers/chrome-mobile-emulation-with-webdriver)
2. [参考资料2](https://jiayi.space/post/scrapy-phantomjs-seleniumdong-tai-pa-chong)
3. [下载Chrome浏览器driver](https://chromedriver.storage.googleapis.com/index.html?path=2.33/) `brew install chromedriver`
4. [crawlera神器](https://doc.scrapinghub.com/index.html) 该工具主要是为了防止反爬 iP被封
5. [pip selenium](https://pypi.python.org/pypi/selenium)

环境说明

```python
# 1. selenium  : 3.8.0
# 2. Scrapy    : 1.4.0
# 3. lxml      : 3.8.0.0
# 4. libxml2   : 2.9.4
# 5. cssselect : 1.0.1
# 6. parsel    : 1.2.0
# 7. w3lib     : 1.18.0
# 8. Twisted   : 17.9.0
# 9. Python    : 2.7.14 (default, Sep 25 2017, 09:54:19) - [GCC 4.2.1 Compatible Apple LLVM 9.0.0 (clang-900.0.37)]
# 10. pyOpenSSL : 17.2.0 (OpenSSL 1.1.0f  25 May 2017)
# 11. Platform  : Darwin-17.2.0-x86_64-i386-64bit
```

```python
from selenium import webdriver
from time import sleep

mobileEmulation = {
    "deviceMetrics": {
        "width": 320, 
        "height": 640, 
        "pixelRatio": 3.0 
    }, 
    "userAgent": 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
}
options = webdriver.ChromeOptions()
options.add_experimental_option('mobileEmulation', mobileEmulation)
# self.driver = webdriver.PhantomJS(executable_path=settings['JS_BIN'])
driver = webdriver.Chrome(executable_path='your chromedriver bin path',
                          chrome_options=options,
                          service_args=["--verbose", "--log-path=qc1.log"])
driver.get('http://m.dianping.com')

sleep(1000)
driver.close()
```

