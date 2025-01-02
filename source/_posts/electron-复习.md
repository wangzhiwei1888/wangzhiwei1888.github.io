---
title: electron 复习
date: 2024-12-31 17:55:15
tags: 
    - electron
categories: 
    - electron
---



### URL在外部浏览器打开

require('electron').shell.openExternal('https://github.com/electron/electron')


### 在 Electron 中，通信主要发生在主进程和渲染进程之间。

ipcRenderer 和 ipcMain：

ipcRenderer 模块用于渲染进程（网页）向主进程发送消息。
ipcMain 模块用于主进程接收来自渲染进程的消息，并可以向渲染进程发送消息。

preload 脚本：
使用 preload 脚本可以在渲染进程中安全地访问 Node.js API 或与主进程通信，通过 contextBridge 模块暴露有限的 API 给渲染进程。

下面是一个简单的例子展示如何使用 ipcRenderer 和 ipcMain 进行通信：

主进程代码

```
const { app, BrowserWindow, ipcMain } = require('electron')

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  mainWindow.loadURL('https://example.com')
})

// 监听来自渲染进程的消息
ipcMain.on('message-from-renderer', (event, args) => {
  console.log(args) // 打印渲染进程传递的数据
  event.reply('response-to-renderer', '这是来自主进程的回复')
})

渲染进程代码 (通过 preload 脚本)

// preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessageToMain: (message) => ipcRenderer.send('message-from-renderer', message),
  receiveMessageFromMain: (callback) => ipcRenderer.on('response-to-renderer', callback)
})

// 在渲染进程中使用
window.electronAPI.sendMessageToMain('你好，主进程！')
window.electronAPI.receiveMessageFromMain((event, response) => {
  console.log(response) // 打印主进程的回复
})

```



### electron 和 iframe 的通信

渲染进程与 iframe 之间的通信

```
// 发送消息到 iframe
const iframe = document.getElementById('myIframe');
iframe.contentWindow.postMessage('你好，iframe！', '*');

// 监听来自 iframe 的消息
window.addEventListener('message', (event) => {
  if (event.origin !== 'http://example.com') return; // 确保消息来源安全
  console.log('来自 iframe 的消息:', event.data);
});

```


iframe 内部的脚本

```
// 监听来自父窗口的消息
window.addEventListener('message', (event) => {
  if (event.origin !== 'http://parent-window-origin.com') return; // 确保消息来源安全
  console.log('来自父窗口的消息:', event.data);

  // 发送消息回父窗口
  event.source.postMessage('你好，父窗口！', event.origin);
});

```


### 主进程与 iframe 之间的通信

由于 iframe 是渲染进程的一部分，主进程不能直接与 iframe 通信。但是，可以通过渲染进程作为桥梁来实现主进程与 iframe 之间的通信。


```
主进程


const { ipcMain } = require('electron');

// 监听来自渲染进程的消息
ipcMain.on('message-from-renderer', (event, args) => {
  console.log('来自渲染进程的消息:', args);
  // 将消息转发给 iframe
  event.reply('forward-to-iframe', '这是来自主进程的消息');
});

```
渲染进程

```

const { ipcRenderer } = require('electron');

// 发送消息到主进程
ipcRenderer.send('message-from-renderer', '你好，主进程！');

// 监听来自主进程的消息，并转发给 iframe
ipcRenderer.on('forward-to-iframe', (event, message) => {
  const iframe = document.getElementById('myIframe');
  iframe.contentWindow.postMessage(message, '*');
});

// 监听来自 iframe 的消息，并发送到主进程
window.addEventListener('message', (event) => {
  if (event.origin !== 'http://example.com') return; // 确保消息来源安全
  ipcRenderer.send('message-from-iframe', event.data);
});

```

iframe 内部的脚本

```

// 监听来自父窗口的消息
window.addEventListener('message', (event) => {
  if (event.origin !== 'http://parent-window-origin.com') return; // 确保消息来源安全
  console.log('来自父窗口的消息:', event.data);

  // 发送消息回父窗口
  event.source.postMessage('你好，父窗口！', event.origin);
});

```

### 主进程与渲染进程之间的通信 的使用场景


渲染进程需要读取或写入文件系统中的文件。
主进程具有更高的权限，可以直接访问文件系统。
渲染进程需要打开文件选择对话框、保存文件对话框等。
主进程可以更方便地调用 Electron 提供的对话框 API。
渲染进程需要发起网络请求，但可能需要使用 Electron 提供的特定功能或需要更高的权限。
主进程可以处理网络请求并返回结果。
渲染进程需要通知主进程执行某些操作，如退出应用、重启应用等。

```
const { ipcMain, app } = require('electron');

ipcMain.on('quit-app', () => {
  app.quit();
});

```





### demo 项目

克隆 https://github.com/zxwk1998/vue-admin-better.git


```
修改 index.html

<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->
    <!-- <meta http-equiv="Content-Security-Policy" content="default-src 'self'; frame-src http://localhost:8000/demo/"> -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; frame-src http://localhost:8001/demo/; style-src 'self'">

    <!-- <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"> -->
    <link href="./styles.css" rel="stylesheet">
    <title>Hello World!</title>
  </head>
  <body>
    <a href="http://localhost:8001/demo/">跳转</a>

    <iframe src="http://localhost:8001/demo/" frameborder="0" class="my-iframe" sandbox='allow-scripts allow-same-origin'></iframe>


    <!-- <h1>Hello World!</h1>
    We are using Node.js <span id="node-version"></span>,
    Chromium <span id="chrome-version"></span>,
    and Electron <span id="electron-version"></span>. -->

    <!-- You can also require other files to run in this process -->
    <script src="./renderer.js"></script>
  </body>
</html>


```


### iframe 集成 ruoyi-vue 项目 点击登录不能跳转

发现cookie没有写上


```

修改 auth.js 替换 Cookies 为 localStorage

import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

改为：

// import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}


```



### 打包配置
```
package.json 修改


{
  "name": "electron-quick-start",
  "version": "1.0.0",
  "description": "A minimal Electron application",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder"
  },
  "repository": "https://github.com/electron/electron-quick-start",
  "keywords": [
    "Electron",
    "quick",
    "start",
    "tutorial",
    "demo"
  ],
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "license": "CC0-1.0",
  "devDependencies": {
    "electron": "^33.2.1",
    "electron-builder": "^23.6.0"
  },
  "build": {
    "appId": "com.example.electronquickstart",
    "productName": "ElectronQuickStart",
    "directories": {
      "output": "build"
    },
    "files": [
      "main.js",
      "index.html",
      "renderer.js",
      "styles.css",
      "preload.js",
      "package.json"
    ],
    "icon": "build/icons/icon",
    "win": {
      "target": [
        {
          "target": "nsis"
        }
      ]
    },
    "mac": {
      "target": [
        {
          "target": "dmg"
        }
      ]
    },
    "linux": {
      "target": [
        {
          "target": "deb"
        },
        {
          "target": "AppImage"
        }
      ],
      "maintainer": "Your Name <your.email@example.com>"
    }
  }
}

```

上述代码在 ubuntu 上构建出 deb 和 AppImage 两种格式的应用程序。

对于不同的目标平台，需要在各个目标平台下构建

macOS (dmg): 需要在 macOS 上进行构建。
Windows (nsis): 需要在 Windows 上进行构建，或者使用 Wine 在 Linux 上进行构建。


参考：
https://blog.csdn.net/weixin_52799373/article/details/131513974


https://github.com/wangzhiwei1888/remote_electron

https://github.com/OblivionTime/remoteShell