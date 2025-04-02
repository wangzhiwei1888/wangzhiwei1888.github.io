---
title: 50亿免费token
date: 2025-04-02 15:29:14
tags:
---


【福利】腾讯T1 免费Key 共享50亿token
模型：hunyuan-t1-20250321
Key：sk-hbMzKcHfnDKSU1NnJPDEFG4xOQE1kB2mcQpkJYtPqDTeTRcV
URL：https://www.dmxapi.cn/v1

配置到代码或chat客户端就可以使用了。


```

curl -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer sk-hbMzKcHfnDKSU1NnJPDEFG4xOQE1kB2mcQpkJYtPqDTeTRcV" \
  -H "User-Agent: DMXAPI/1.0.0" \
  -d '{
    "model": "hunyuan-t1-20250321",
    "stream": true,
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "周树人和鲁迅是兄弟吗？"
      }
    ]
  }' \
  https://www.dmxapi.cn/v1/chat/completions



```
