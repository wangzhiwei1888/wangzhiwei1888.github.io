---
title: nodejs宏任务和微任务
date: 2024-12-24 14:32:22
tags: 
    - nodejs
categories: 
    - nodejs
---


## nodejs宏任务和微任务

在 Node.js 中，事件循环机制处理任务的方式分为宏任务（macrotask）和微任务（microtask）。以下是它们的区别及执行顺序：

- **宏任务（Macrotask）**
  - 包含：`setTimeout`, `setInterval`, I/O 操作, UI 渲染, `setImmediate`
  - 每次执行完一个宏任务后会进入微任务队列检查并执行所有微任务
  - 下一次事件循环开始时才会继续执行下一个宏任务

- **微任务（Microtask）**
  - 包含：`Promise.then`, `process.nextTick`, `Object.observe`(已废弃), `MutationObserver`
  - 在当前任务（无论是宏任务还是微任务）执行完毕后立即执行，直到微任务队列为空
  - `process.nextTick` 的优先级最高，在当前操作完成后立即执行，甚至早于其他微任务

### 执行顺序示例：
```javascript
console.log('start');

setTimeout(() => { // 宏任务
  console.log('setTimeout');
}, 0);

Promise.resolve().then(() => { // 微任务
  console.log('promise1');
});

Promise.resolve().then(() => { // 微任务
  console.log('promise2');
});

process.nextTick(() => { // 微任务，优先级最高
  console.log('nextTick');
});

console.log('end');
```

输出结果为：
```
start
end
nextTick
promise1
promise2
setTimeout
```

这是因为：
1. 同步代码先执行，输出 `start` 和 `end`
2. 然后执行微任务队列中的任务，由于 `process.nextTick` 优先级最高，所以首先输出 `nextTick`
3. 接着执行剩余的微任务，输出 `promise1` 和 `promise2`
4. 最后回到事件循环执行宏任务，输出 `setTimeout`

