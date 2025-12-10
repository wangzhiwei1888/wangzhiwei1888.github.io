---
title: Dify mcp 链路打通调整
date: 2025-12-10 17:39:02
tags: Dify mcp 链路打通调整
---

## Dify mcp 链路打通调整


### 参考文档：
https://github.com/langgenius/dify/issues/28224
https://www.youtube.com/watch?v=kLKn3_tj70s

### dify应用的集成
通过获取登录后接口返回的 user_uuid，进行编码，编码为符合dify要求的格式

```
user:{"user_uuid":"c23afa76-c1d0-4980-ab00-9c041409b034"}


async function compressAndEncodeBase64(input: string) {
  const uint8Array = (new TextEncoder()).encode(input);
  const compressedStream = new Response(
    new Blob([uint8Array]).stream().pipeThrough(new CompressionStream("gzip"))
  ).arrayBuffer();
  const compressedUint8Array = new Uint8Array(await compressedStream);
  return btoa(String.fromCharCode(...compressedUint8Array));
}

//编码为符合dify要求的格式
compressAndEncodeBase64('c23afa76-c1d0-4980-ab00-9c041409b034', then(code) => {
    console.log(code);
})


//根据上一步生成的code,拼接最终的url参数 sys.user_id
https://xxxxxx:8080/chatbot/DpIAYCqQAtgSpHSc?sys.user_id=H4sIAAAAAAAAE0s2Mk5MSzQ30002TDHQNbG0MNBNTDIw0LVMNjAxNDGwTDIwNgEA0UXx2iQAAAA=


```

### 参考文档：
https://github.com/langgenius/dify/pull/27524
https://github.com/langgenius/dify/issues/27468


### 链路打通的最新抓包文件

```
uuid: c23afa76-c1d0-4980-ab00-9c041409b034
POST /mcp HTTP/1.1
Host: 192.168.40.211:18080
Accept-Encoding: gzip, deflate
Connection: keep-alive
User-Agent: python-httpx/0.27.2
uuid: c23afa76-c1d0-4980-ab00-9c041409b034
Content-Type: application/json
Accept: application/json, text/event-stream
Content-Length: 190

{"jsonrpc": "2.0", "id": 0, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "MCP Streamable HTTP Client", "version": "1.0.0"}}}
HTTP/1.1 200 OK
Server: njet/4.0.0.0
Date: Wed, 10 Dec 2025 06:27:21 GMT
Content-Type: application/json
Connection: keep-alive
Content-Length: 277
Mcp-Session-Id: aTkSyQiJwOoCAAB9

{"jsonrpc":"2.0","result":{"protocolVersion":"2024-11-05","serverInfo":{"name":"lua-resty-mcp","version":"2.0"},"capabilities":{"completions":{},"prompts":{"listChanged":true},"logging":{},"tools":{"listChanged":true},"resources":{"listChanged":true,"subscribe":true}}},"id":0}
POST /mcp HTTP/1.1
Host: 192.168.40.211:18080
Accept-Encoding: gzip, deflate
Connection: keep-alive
User-Agent: python-httpx/0.27.2
uuid: c23afa76-c1d0-4980-ab00-9c041409b034
Content-Type: application/json
Accept: application/json, text/event-stream
Mcp-Session-Id: aTkSyQiJwOoCAAB9
Content-Length: 71

{"jsonrpc": "2.0", "method": "notifications/initialized", "params": {}}
HTTP/1.1 202 Accepted
Server: njet/4.0.0.0
Date: Wed, 10 Dec 2025 06:27:21 GMT
Content-Type: text/plain
Transfer-Encoding: chunked
Connection: keep-alive


POST /mcp HTTP/1.1
Host: 192.168.40.211:18080
Accept-Encoding: gzip, deflate
Connection: keep-alive
User-Agent: python-httpx/0.27.2
uuid: c23afa76-c1d0-4980-ab00-9c041409b034
Content-Type: application/json
Accept: application/json, text/event-stream
Mcp-Session-Id: aTkSyQiJwOoCAAB9
Content-Length: 65

{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}
HTTP/1.1 200 OK
Server: njet/4.0.0.0
Date: Wed, 10 Dec 2025 06:27:21 GMT
Content-Type: text/event-stream
Transfer-Encoding: chunked
Connection: keep-alive
Cache-Control: no-store, no-transform
Connection: keep-alive

data:{"jsonrpc":"2.0","result":{"tools":[{"name":"echo","inputSchema":{"required":["message"],"type":"object","properties":{"message":{"type":"string"}}},"description":"Echo a message as a tool"},{"name":"exp","inputSchema":{"required":["inputA","oper","inputB"],"type":"object","properties":{"inputB":{"type":"number"},"oper":{"type":"string"},"inputA":{"type":"number"}}},"description":"a tool to calculate math expressions, like 1+1=?"}]},"id":1}


POST /mcp HTTP/1.1
Host: 192.168.40.211:18080
Accept-Encoding: gzip, deflate
Connection: keep-alive
User-Agent: python-httpx/0.27.2
uuid: c23afa76-c1d0-4980-ab00-9c041409b034
Content-Type: application/json
Accept: application/json, text/event-stream
Mcp-Session-Id: aTkSyQiJwOoCAAB9
Content-Length: 111

{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "echo", "arguments": {"message": "aa"}}}
HTTP/1.1 200 OK
Server: njet/4.0.0.0
Date: Wed, 10 Dec 2025 06:27:24 GMT
Content-Type: text/event-stream
Transfer-Encoding: chunked
Connection: keep-alive
Cache-Control: no-store, no-transform
Connection: keep-alive

data:{"jsonrpc":"2.0","result":{"content":[{"text":"Tool echo: aa","type":"text"}]},"id":2}


POST /mcp HTTP/1.1
Host: 192.168.40.211:18080
Accept-Encoding: gzip, deflate
Connection: keep-alive
User-Agent: python-httpx/0.27.2
uuid: c23afa76-c1d0-4980-ab00-9c041409b034
Content-Type: application/json
Accept: application/json, text/event-stream
Mcp-Session-Id: aTkSyQiJwOoCAAB9
Content-Length: 111

{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "echo", "arguments": {"message": "aa"}}}
HTTP/1.1 200 OK
Server: njet/4.0.0.0
Date: Wed, 10 Dec 2025 06:27:27 GMT
Content-Type: text/event-stream
Transfer-Encoding: chunked
Connection: keep-alive
Cache-Control: no-store, no-transform
Connection: keep-alive

data:{"jsonrpc":"2.0","result":{"content":[{"text":"Tool echo: aa","type":"text"}]},"id":3}


POST /mcp HTTP/1.1
Host: 192.168.40.211:18080
Accept-Encoding: gzip, deflate
Connection: keep-alive
User-Agent: python-httpx/0.27.2
uuid: c23afa76-c1d0-4980-ab00-9c041409b034
Content-Type: application/json
Accept: application/json, text/event-stream
Mcp-Session-Id: aTkSyQiJwOoCAAB9
Content-Length: 111

{"jsonrpc": "2.0", "id": 4, "method": "tools/call", "params": {"name": "echo", "arguments": {"message": "aa"}}}
HTTP/1.1 200 OK
Server: njet/4.0.0.0
Date: Wed, 10 Dec 2025 06:27:30 GMT
Content-Type: text/event-stream
Transfer-Encoding: chunked
Connection: keep-alive
Cache-Control: no-store, no-transform
Connection: keep-alive

data:{"jsonrpc":"2.0","result":{"content":[{"text":"Tool echo: aa","type":"text"}]},"id":4}


POST /mcp HTTP/1.1
Host: 192.168.40.211:18080
Accept-Encoding: gzip, deflate
Connection: keep-alive
User-Agent: python-httpx/0.27.2
uuid: c23afa76-c1d0-4980-ab00-9c041409b034
Content-Type: application/json
Accept: application/json, text/event-stream
Mcp-Session-Id: aTkSyQiJwOoCAAB9
Content-Length: 111

{"jsonrpc": "2.0", "id": 5, "method": "tools/call", "params": {"name": "echo", "arguments": {"message": "aa"}}}
HTTP/1.1 200 OK
Server: njet/4.0.0.0
Date: Wed, 10 Dec 2025 06:27:33 GMT
Content-Type: text/event-stream
Transfer-Encoding: chunked
Connection: keep-alive
Cache-Control: no-store, no-transform
Connection: keep-alive

data:{"jsonrpc":"2.0","result":{"content":[{"text":"Tool echo: aa","type":"text"}]},"id":5}


POST /mcp HTTP/1.1
Host: 192.168.40.211:18080
Accept-Encoding: gzip, deflate
Connection: keep-alive
User-Agent: python-httpx/0.27.2
uuid: c23afa76-c1d0-4980-ab00-9c041409b034
Content-Type: application/json
Accept: application/json, text/event-stream
Mcp-Session-Id: aTkSyQiJwOoCAAB9
Content-Length: 111

{"jsonrpc": "2.0", "id": 6, "method": "tools/call", "params": {"name": "echo", "arguments": {"message": "aa"}}}
HTTP/1.1 200 OK
Server: njet/4.0.0.0
Date: Wed, 10 Dec 2025 06:27:36 GMT
Content-Type: text/event-stream
Transfer-Encoding: chunked
Connection: keep-alive
Cache-Control: no-store, no-transform
Connection: keep-alive

data:{"jsonrpc":"2.0","result":{"content":[{"text":"Tool echo: aa","type":"text"}]},"id":6}


```

另外一种方法是自己调用一下 dify 的 passport 接口，将 user_id 传给 dify. 待验证。