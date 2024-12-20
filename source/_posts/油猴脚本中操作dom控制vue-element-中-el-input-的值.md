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


注意匹配规则设置

// @match        http://192.168.40.117:8080/*
// @match        https://192.168.40.51:8000/*
// @match        https://192.168.40.46/*
// @match        http://192.168.40.115:8080/*


http https 要区分 https://192.168.40.46/* 改为 https://192.168.40.*/* 不生效


与其他库（如react）集成： 当你需要与不基于 Vue 的库或框架集成时，可能会用到 dispatchEvent 来触发特定的事件。

