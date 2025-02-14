---
title: 浏览器如何开启GPU加速，通过代码演示
date: 2025-02-14 17:07:23
tags:
---




```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <style>
    
    .div {
        width: 100px;
        height: 100px;
        background: pink;
        margin: 0 auto;
        animation: fadenum ease-in 1s;
        animation-fill-mode: forwards;
        position: absolute;
        will-change: left; // 开启GPU加速
        left: 20px;
        top: 220px;
    }

    @keyframes fadenum {
        0% {
            /* left: 0px; */
            transform: translateX(0); // 浏览器开启GPU加速
        }
        100% {
            /* left: 140px; */
            transform: translateX(140px);
        }
    }
    </style>
    

    <div class="div"></div>
</body>
</html>

```

未开启GPU加速时，渲染层和div在一层

![](../images/gpu_00.png)

![](../images/gpu_01.png)

开启GPU加速后，可以看到分层渲染

![](../images/gpu_02.png)



参考：https://www.douyin.com/video/7298924329268546866