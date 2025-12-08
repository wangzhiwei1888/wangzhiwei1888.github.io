---
title: dify X-App-Passport 中 end_user_id 打通大模型访问链路
date: 2025-12-08 11:43:19
tags: dify end_user_id
---

## dify X-App-Passport 中 end_user_id 打通大模型访问链路


前端解密用到了 jose ，需要对X-App-Passport ，进行解密，解密需要在 https环境下，否则揭秘方法会报错。

dify应用，调用dify 自己的 chat 接口，会传递 X-App-Passport ，

![](../images/dify01.jpeg)


```

useEffect(() => {
    if (iframeLoaded) {
      setTimeout(async() => {        
        const passport = localStorage.getItem('passport-' + chatId) || '';
        console.log(passport);

        if (passport) {
          const secret = new TextEncoder().encode('sk-xxxxxxxxxxx');
          // 验签
          try {
            const { payload } = await jose.jwtVerify(passport, secret, {
              algorithms: ['HS256'],
            });
            // console.log(payload);
            // alert(JSON.stringify(payload));

            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : {};

            setEndUserId(user.user_uuid as string, payload.end_user_id as string)
            .then((res) => {
              console.log('set end user id success', res);
            })
            .catch((err) => {
              console.error('set end user id failed', err);
            });

          } catch (e) {
            console.error('invalid', e);
          }

        }
        
      }, 1000)
    }
  }, [iframeLoaded]);

```


X-App-Passport 解析后含有以下内容

```
{
    iss: 'd1b66a51-b4ef-45ef-b3bf-7b5813c86261', 
    sub: 'Web API Passport', 
    app_id: 'd1b66a51-b4ef-45ef-b3bf-7b5813c86261', 
    app_code: 'j0xH9mK60ZS5mI70', 
    end_user_id: '239b5e72-7cfd-4a25-930d-de68a3f41764'
}
```

重点关注end_user_id，dify会将其发送给大模型的请求体中。抓包可以看到如下信息

```
POST /v1/chat/completions HTTP/1.1
Host: 192.168.0.209:8080
User-Agent: python-requests/2.32.5
Accept-Encoding: gzip, deflate
Accept: */*
Connection: keep-alive
Content-Type: application/json
Accept-Charset: utf-8
Authorization: Bearer vllm
Content-Length: 227

{"model": "Qwen3-14B", "stream": true, "temperature": 0.7, "messages": [{"role": "user", "content": "85f7cfff-90fe-4248-b41a-f60c56d8efb3"}, {"role": "user", "content": "a\n\n"}], "user": "85f7cfff-90fe-4248-b41a-f60c56d8efb3"}
```


X-App-Passport 内容格式如下，我们可以通过拆分下面的字符串，获取中间部分
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkMWI2NmE1MS1iNGVmLTQ1ZWYtYjNiZi03YjU4MTNjODYyNjEiLCJzdWIiOiJXZWIgQVBJIFBhc3Nwb3J0IiwiYXBwX2lkIjoiZDFiNjZhNTEtYjRlZi00NWVmLWIzYmYtN2I1ODEzYzg2MjYxIiwiYXBwX2NvZGUiOiJqMHhIOW1LNjBaUzVtSTcwIiwiZW5kX3VzZXJfaWQiOiIyMzliNWU3Mi03Y2ZkLTRhMjUtOTMwZC1kZTY4YTNmNDE3NjQifQ.eb0j1nJaPXvB5ZFLLlopQu-PwkvAHSvWlqnaaG2d6ms
```


```
// 1. 把 URL-safe 字符 (- _) 换回标准 (+ /)
const urlSafe = 'eyJpc3MiOiJkMWI2NmE1MS1iNGVmLTQ1ZWYtYjNiZi03YjU4MTNjODYyNjEiLCJzdWIiOiJXZWIgQVBJIFBhc3Nwb3J0IiwiYXBwX2lkIjoiZDFiNjZhNTEtYjRlZi00NWVmLWIzYmYtN2I1ODEzYzg2MjYxIiwiYXBwX2NvZGUiOiJqMHhIOW1LNjBaUzVtSTcwIiwiZW5kX3VzZXJfaWQiOiIyMzliNWU3Mi03Y2ZkLTRhMjUtOTMwZC1kZTY4YTNmNDE3NjQifQ';
const standard = urlSafe.replace(/-/g, '+').replace(/_/g, '/');

// 2. 解码
const jsonStr = decodeURIComponent(
  Array.prototype.map.call(
    atob(standard),
    c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join('')
);

console.log(jsonStr);


{
  "iss": "d1b66a51-b4ef-45ef-b3bf-7b5813c86261",
  "sub": "Web API Passport",
  "app_id": "d1b66a51-b4ef-45ef-b3bf-7b5813c86261",
  "app_code": "j0xH9mK60ZS5mI70",
  "end_user_id": "239b5e72-7cfd-4a25-930d-de68a3f41764"
}
```


拓展对字符进行base64加密

```
// 加密：普通字符串 → Base64
function base64Encode(str) {
  return btoa(
    encodeURIComponent(str)
      .replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode('0x' + p1)
      )
  );
}

/* ---- 用例 ---- */
const json = JSON.stringify({
  iss: "d1b66a51-b4ef-45ef-b3bf-7b5813c86261",
  sub: "Web API Passport",
  app_id: "d1b66a51-b4ef-45ef-b3bf-7b5813c86261",
  app_code: "j0xH9mK60ZS5mI70",
  end_user_id: "239b5e72-7cfd-4a25-930d-de68a3f41764"
});

console.log(base64Encode(json));
// 输出：
// eyJpc3MiOiJkMWI2NmE1MS1iNGVmLTQ1ZWYtYjNiZi03YjU4MTNjODYyNjEiLCJzdWIiOiJXZWIgQVBJIFBhc3Nwb3J0IiwiYXBwX2lkIjoiZDFiNjZhNTEtYjRlZi00NWVmLWIzYmYtN2I1ODEzYzg2MjYxIiwiYXBwX2NvZGUiOiJqMHhIOW1LNjBaUzVtSTcwIiwiZW5kX3VzZXJfaWQiOiIyMzliNWU3Mi03Y2ZkLTRhMjUtOTMwZC1kZTY4YTNmNDE3NjQifQ

```

