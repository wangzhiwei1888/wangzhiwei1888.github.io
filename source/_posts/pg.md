---
title: pg postgres 
date: 2024-12-13 14:52:23
tags: [database]

categories:
  - 数据库
  - postgres
---



链接postgres
psql -h localhost -p 5432 -U postgres -W

密码
admin



列出所有数据库
\list





切换数据库


CREATE DATABASE mydatabase;

\c mydatabase 

CREATE TABLE mytable (
   id SERIAL PRIMARY KEY,
   name VARCHAR(100),
   age INT,
   email VARCHAR(255)
);


INSERT INTO mytable (name, age, email) VALUES
('John Doe', 28, 'john.doe@example.com'),
('Jane Smith', 35, 'jane.smith@example.com');

\dt+  -- 列出所有表，包括视图和索引
\dt   -- 仅列出表
\dv   -- 仅列出视图
\di   -- 仅列出索引

SELECT * FROM mytable;

\q 退出 psql

数据操作

增
INSERT INTO mytable (name, age, email) VALUES
('John Doe', 28, 'john.doe@example.com'),
('Jane Smith', 35, 'jane.smith@example.com');

删
DELETE FROM mytable WHERE id = 2;

改
UPDATE mytable SET name = 'wzw', age = 38 WHERE id=1;

查询
SELECT * FROM mytable;




本地链接116 的postgresql
1、查看116 的项目配置文件查看配置的密码

/home/admin/tml/app/config
application-dev.yml


2、需要修改postgresql 的配置
	
/home/admin/tml/app/db/data
vi pg_hba.conf
shift + G

host    all             all              127.0.0.1/32            md5

增加一行
host    all             all              0.0.0.0/0            md5




vi postgresql.conf 

/listen

listen_addresses 改为 '*'   
listen_addresses = '*'          # what IP address(es) to listen on;



ss -anlp | grep 5432

重启postgresql
sudo systemctl restart postgresql-12

