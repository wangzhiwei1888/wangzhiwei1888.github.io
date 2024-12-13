---
title: Elasticsearch 提供了丰富的 RESTful API
date: 2024-12-13 15:48:41
tags: [Elasticsearch]
categories:
  - Elasticsearch
  - 数据库

---


Elasticsearch 提供了丰富的 RESTful API，可以通过 HTTP 请求与 Elasticsearch 进行交互。以下是一些常见的操作及其对应的 API 用法：


![](../images/es_01.png)


http://localhost:9200/

查看索引列表
curl -X GET "127.0.0.1:9200/_cat"
curl -X GET "127.0.0.1:9200/_cat/indices"
获取集群健康状态

```
curl -X GET "localhost:9200/_cluster/health?pretty"

```

创建索引

```

curl -X PUT "localhost:9200/my_index?pretty"

```

删除索引

```
curl -X DELETE "localhost:9200/my_index?pretty"

```

添加

```
curl -X POST "localhost:9200/my_index/_doc/1?pretty" -H 'Content-Type: application/json' -d'
{
  "field1": "value1",
  "field2": "value2"
}
'
```
修改
某一条文档局部更新

```
curl -X POST "localhost:9200/my_index/_update/1?pretty" -H 'Content-Type: application/json' -d'
{
  "doc": {
    "field1": "new_value1"
  }
}
'

```


某一条文档全量更新

```
curl -X PUT "localhost:9200/my_index/_doc/1?pretty" -H 'Content-Type: application/json' -d'
{
  "field1": "111111111111value1",
  "field2": "value2"
}
'
```
查询 my_index 索引中 ID 为 1 的文档：

```
curl -X GET "localhost:9200/my_index/_doc/1?pretty"

```

删除 my_index 索引中 ID 为 1 的文档：

```
curl -X DELETE "localhost:9200/my_index/_doc/1?pretty"

```
查询 my_index 里面的数据列表

```
curl -X GET "localhost:9200/my_index/_search"

```

条件查询

```
curl -X GET "localhost:9200/my_index/_search?q=field1:111111111111value1"

```

分页查询

```
curl -X GET "localhost:9200/my_index/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "from": 0,
  "size": 2,
  "query": {
    "match_all": {}
  }
}'

```


查询排序

```
curl -X GET "localhost:9200/my_index/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match_all": {}
  },
  "sort": [
    {"_id": "desc"}
  ]
}'

```

过滤返回字段

```
curl -X GET "localhost:9200/my_index/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match_all": {}
  },
  "sort": [
    {"_id": "desc"}
  ],
  "_source": ["field1"]
}'

```

在 Elasticsearch 中进行分页查询通常使用 `from` 和 `size` 参数。`from` 参数表示从第几条记录开始，`size` 参数表示每次查询返回的记录数。以下是一个示例，展示如何进行分页查询：

### 示例请求

假设你有一个索引 `my_index`，并且你想分页查询其中的文档。

#### 第一页（前10条记录）



```sh
curl -X GET "localhost:9200/my_index/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "from": 0,
  "size": 10,
  "query": {
    "match_all": {}
  }
}'
```

#### 第二页（第11到第20条记录）
```sh
curl -X GET "localhost:9200/my_index/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "from": 10,
  "size": 10,
  "query": {
    "match_all": {}
  }
}'
```

#### 第三页（第21到第30条记录）
```sh
curl -X GET "localhost:9200/my_index/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "from": 20,
  "size": 10,
  "query": {
    "match_all": {}
  }
}'
```

### 参数说明
- **`from`**: 表示从第几条记录开始。例如，`from: 0` 表示从第一条记录开始，`from: 10` 表示从第11条记录开始。
- **`size`**: 表示每次查询返回的记录数。例如，`size: 10` 表示每次返回10条记录。
- **`query`**: 查询条件。这里使用 `match_all` 表示匹配所有文档。你可以根据需要替换为其他查询条件。

### 注意事项
- **性能问题**: 当 `from` 值很大时，分页查询可能会变得非常慢。对于这种情况，建议使用 `search_after` 或 `scroll` API。
- **`search_after`**: 适用于深分页，可以避免性能问题。
- **`scroll`**: 适用于导出大量数据，可以保持搜索上下文一段时间。

### `search_after` 示例
```sh
curl -X GET "localhost:9200/my_index/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "size": 10,
  "query": {
    "match_all": {}
  },
  "sort": [
    {"_id": "asc"}
  ],
  "search_after": [10]
}'
```

### `scroll` 示例
```sh
# 初始化 scroll
curl -X GET "localhost:9200/my_index/_search?scroll=1m&pretty" -H 'Content-Type: application/json' -d'
{
  "size": 100,
  "query": {
    "match_all": {}
  }
}'

# 使用 scroll_id 获取下一批数据
curl -X GET "localhost:9200/_search/scroll?pretty" -H 'Content-Type: application/json' -d'
{
  "scroll": "1m",
  "scroll_id": "your_scroll_id"
}'
```

希望这些示例能帮助你实现分页查询。如果有更多具体的问题或需要进一步的帮助，请随时提问。

条件查询

范围查询

全文检索 

完全匹配

高亮查询

聚合查询

映射关系

