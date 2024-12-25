---
title: 油猴脚本中操作dom控制vue-element 中 el-input 的值
date: 2024-12-20 09:06:08
tags: 
    - 工具集合
    - 油猴脚本
categories: 
  - 工具集合
---


要使用油猴插件（Tampermonkey）修改Vue-Element的el-input的值，关键在于理解Vue的响应式原理和事件触发机制。以下是具体的步骤和代码示例：
1.  获取el-input元素：首先，你需要定位到页面中的el-input元素。可以使用CSS选择器来获取这个元素。
2.  修改值：直接设置input元素的value属性是不够的，因为这样不会触发Vue的响应式更新。你需要手动触发一个input事件来通知Vue更新其数据。
3.  触发事件：创建一个新的Event对象，并使用dispatchEvent方法来触发input事件，这样Vue就能检测到输入框的值变化。


```js
// ==UserScript==
// @name         login
// @namespace    https://192.168.40.51:8000
// @version      2024-12-20
// @description  try to take over the world!
// @author       jason
// @match        https://192.168.40.51:8000/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';
    console.log('hello login');
    setTimeout(()=> {
        const userName = document.querySelectorAll('.el-input__inner')[0];
        if (userName) {
            userName.value = 'admin';
            userName.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        } else {
            console.error('Username input not found');
        }

        const passWord = document.querySelectorAll('.el-input__inner')[1];
        if (passWord) {
            passWord.value = 'xxx';
            passWord.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        } else {
            console.error('Password input not found');
        }
        setTimeout(()=> {
            document.querySelector('.el-button').click()
        }, 1000)
    }, 1000)
    

})();

```

拦截所有ajax请求

```
// ==UserScript==
// @name         拦截所有ajax请求
// @namespace    https://192.168.40.51:8000
// @version      2024-12-20
// @description  try to take over the world!
// @author       jason
// @match        http://192.168.40.117:8080/*
// @match        https://192.168.40.51:8000/*
// @match        https://192.168.40.46/*
// @match        http://192.168.40.115:8080/*
// @match        https://192.168.40.116/*
// @match        http://localhost:8000/*
// @match        https://localhost:8000/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 保存原始的 XMLHttpRequest 方法
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

    // 重写 open 方法
    XMLHttpRequest.prototype.open = function(method, url, async) {
        this._method = method;
        this._url = url;
        this._async = async;
        this._requestHeaders = {}; // 用于存储请求头
        this._requestData = null; // 用于存储请求体
        originalOpen.apply(this, arguments);
    };

    // 重写 setRequestHeader 方法
    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        this._requestHeaders[header] = value;
        originalSetRequestHeader.apply(this, arguments);
    };

    // 重写 send 方法
    XMLHttpRequest.prototype.send = function(data) {
        // 捕获请求体
        if (data instanceof FormData) {
            const formData = new FormData();
            data.forEach((value, key) => {
                formData.append(key, value);
            });
            this._requestData = formData;
        } else if (data instanceof Blob || data instanceof ArrayBuffer) {
            this._requestData = data;
        } else {
            this._requestData = data;
        }

        this.addEventListener('load', function() {
            console.log('AJAX Request:', {
                method: this._method,
                url: this._url,
                async: this._async,
                requestHeaders: this._requestHeaders, // 添加请求头信息
                requestData: this._requestData, // 添加请求体信息
                response: this.responseText,
                status: this.status,
                statusText: this.statusText
            });
        });

        originalSend.apply(this, arguments);
    };

    console.log('hello login');
    // 其他代码...
})();


```


在油猴脚本中，@run-at 元数据块用于指定脚本何时执行。不同的 @run-at 值会影响脚本的执行时机，从而影响脚本的行为和效果。以下是常见的 @run-at 值及其含义：

@run-at document-start

含义：脚本在文档解析开始时立即执行，此时 document.documentElement 可能尚未创建，document.head 也尚未完全加载。
适用场景：适用于需要在页面加载之前执行某些操作的情况，例如修改页面的初始加载行为。
@run-at document-end

含义：脚本在文档解析完成后执行，此时 document.body 已经可用，但所有外部资源（如图片、样式表、子框架等）可能尚未加载完成。
适用场景：适用于需要在页面加载完成后执行某些操作的情况，但不需要等待所有外部资源加载完成。
@run-at document-idle

含义：脚本在文档解析完成后且所有外部资源（如图片、样式表、子框架等）加载完成后执行。
适用场景：适用于需要在页面完全加载后执行某些操作的情况，确保所有资源都已加载完毕。


注意匹配规则设置

// @match        http://192.168.40.117:8080/*
// @match        https://192.168.40.51:8000/*
// @match        https://192.168.40.46/*
// @match        http://192.168.40.115:8080/*


http https 要区分 https://192.168.40.46/* 改为 https://192.168.40.*/* 不生效


与其他库（如react）集成： 当你需要与不基于 Vue 的库或框架集成时，可能会用到 dispatchEvent 来触发特定的事件。

