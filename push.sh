#!/bin/bash

T=`date "+%Y-%m-%d %H:%I:%S"`

# 后台云心 jekyll server
jekyll serve --detach

# 关闭进程
kill -9 $(ps aux | grep jekyll | grep -v 'grep'  | awk '{print $2}')

# 提交修改
git add --all
git commit -m"$T"
git push origin --all

exit 0
