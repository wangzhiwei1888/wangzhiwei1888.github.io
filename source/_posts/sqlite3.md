---
title: sqlite3
date: 2025-03-17 16:58:06
tags:
---


## sqlite3 基本操作


```

查看所有表
.tables


查看表结构
.schema users
pragma table_info(api_request_quota_group);


查看表数据
select * from api_user;

创建数据库
sudo sqlite3 test.db


创建表
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    email TEXT UNIQUE
);


插入数据
INSERT INTO users (name, age, email) VALUES ('Alice', 25, 'alice@example.com');

查询数据
SELECT * FROM users;

更新数据
UPDATE users SET age = 26 WHERE name = 'Alice';

删除数据
DELETE FROM users WHERE name = 'Alice';
删除表
DROP TABLE users;

```