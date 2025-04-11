---
title: 前端发送SSE请求实现GPT流式输出
date: 2025-04-11 10:26:31
tags:
---


## fetchEventSource 

```
import { fetchEventSource } from '@microsoft/fetch-event-source';

async function startStream() {
  await fetchEventSource('request url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN',
    },
    body: JSON.stringify({ query: "Hello" }),
    onopen(response) {
      // 连接成功时触发
      if (response.ok) return;
      throw new Error('连接失败');
    },
    onmessage(event) {
      // 接收服务器发送的每条事件
      console.log('收到数据:', event.data);
      // 请求完成
      console.log('请求结束标记', data.done)
    },
    onclose() {
      // 连接关闭时触发
      console.log('连接终止');
    },
    onerror(err) {
      // 错误处理（默认会抛出异常并自动重试）
      console.error('错误:', err);
      throw err; // 抛出错误会触发重试机制
    }
  });
}



```




## rehypeRaw 支持 markdown 中含有 html 标签 
```

import { Avatar } from "antd"
import ReactMardown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import rehypeRaw from 'rehype-raw'

import {
    CopyOutlined,
    SyncOutlined
} from '@ant-design/icons';


function ChatAnswer( { item, onCopy }: ChatAnswerProps ) {
    return (
        <div className="chat-answer">
            <Avatar style={{ backgroundColor: '#2B65F7' }} size={40}>AI</Avatar>
            <div className="chat-answer-content" >
                {
                    !item.answer &&
                    <div className='loading-box'>
                        <SyncOutlined spin /> 思考中...
                    </div>
                }
                <div style={{paddingTop: 10}}>
                    <ReactMardown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {
                            item.answer &&
                            item.answer
                        }
                    </ReactMardown>
                </div>
                {
                    item.answer &&
                    <CopyToClipboard text={item.answer}
                        onCopy={onCopy}>
                        <span className='copy-btn'><CopyOutlined /> 复制</span>
                    </CopyToClipboard>
                }
            </div>
        </div>
    )
}

export default ChatAnswer

```


## 处理流式输出的标签
```

if (tep_mesg == '\u003cthink\u003e') {
          tep_mesg = "<div class='think'>"
        } else if (tep_mesg == '\u003c/think\u003e') {
          tep_mesg = "</div>"
        }
```

## 具体参考代码
```


import { PostHistoryAPI } from '@/apis/chat';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import hljs from 'highlight.js';
export async function sendMessage(tagDefault: string, msg: string, list: any[], setList: any, messageApi: any, setDone: any, id: number) {

  setDone(false)
  let answer = ''
  const lastObj = { ask: msg, answer: '' };

  await fetchEventSource('http://xxx/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer vllm',
    },
    body: JSON.stringify({
        "model": tagDefault,
        "messages": [
          {"role": "user", "content": msg}
        ],
        "stream": true
      }),
    onmessage(event) {
      // 接收服务器发送的每条事件
      console.log('收到数据:', event.data);

      
      
      if (event.data && event.data === '[DONE]') {
        console.log('请求完成');

        setDone(true)
        //将数据插入到历史接口
        PostHistoryAPI({
            groupId: id,
            ...lastObj
        }).then(res => {

            if (res.data.code !== 0) {
                messageApi.error(res.data.message)
            }
        })
        hljs.highlightAll();

      } else {
        console.log('收到数据:', JSON.parse(event.data).choices[0].delta.content);
        
        let tep_mesg = JSON.parse(event.data).choices[0].delta.content;
        if (tep_mesg == '\u003cthink\u003e') {
          tep_mesg = "<div class='think'>"
        } else if (tep_mesg == '\u003c/think\u003e') {
          tep_mesg = "</div>"
        }
        
        answer += tep_mesg

        if (answer) {
            lastObj.answer = answer
            setList([...list, lastObj])
        }
      }
      // 请求完成
    },
    onclose() {
      // 连接关闭时触发
      console.log('连接终止');
    },
    onerror(err) {
      // 错误处理（默认会抛出异常并自动重试）
      console.error('错误:', err);
      throw err; // 抛出错误会触发重试机制
    }
  });
}

```

## EventSource

'@microsoft/fetch-event-source' (之前用过pc兼容没问题，移动端兼容性好像不太好，当时是自己用原声js的 EventSource)

EventSource
https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events


参考地址：
https://juejin.cn/post/7476881372810313762
https://www.npmjs.com/package/react-markdown
https://www.npmjs.com/package/rehype-raw

