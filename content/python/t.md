---
date: '2025-04-27T12:50:35+08:00'
draft: true
title: '获取从指定开始时间到指定结束时间的列表'
description: ""
summary: ""
tags: ["python"]
categories: ["python"]
series: ["Python"]
ShowToc: false
TocOpen: true
---



```python

import datetime

def date_range1(start, end):
    days = (datetime.datetime.strptime(end, "%Y%m%d") - datetime.datetime.strptime(start, "%Y%m%d")).days + 1
    return [datetime.datetime.strftime(datetime.datetime.strptime(start, "%Y%m%d") + datetime.timedelta(i), "%Y%m%d") for i in xrange(days)]


def date_range2(beginDate, endDate):
    dates = []
    dt = datetime.datetime.strptime(beginDate, "%Y%m%d")
    date = beginDate[:]
    while date <= endDate:
        dates.append(date)
        dt = dt + datetime.timedelta(1)
        date = dt.strftime("%Y%m%d")

    return dates

dt_list = date_range1('20161218', '20161220')
// ['20161218', '20161219', '20161220']

```
