---
title: redis
date: 2024-12-13 14:52:17
tags: db 

categories:
  - 数据库
  - redis
---



redis 数据库
链接本地
redis-cli -p 6379

链接远程redis数据库
sudo redis-cli -h 192.168.40.116 -p 6379 -a admin

切换数据库
SELECT 0
查询所有的key值
keys *

增
set aa 1
删
del aa
改
set aa 2
查
get 'aa'




