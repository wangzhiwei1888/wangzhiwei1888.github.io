---
title: electron 复习
date: 2024-12-31 17:55:15
tags: 
    - electron
categories: 
    - electron
---


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





iframe 集成 ruoyi-vue 项目 点击登录不能跳转

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


参考：
https://blog.csdn.net/weixin_52799373/article/details/131513974


