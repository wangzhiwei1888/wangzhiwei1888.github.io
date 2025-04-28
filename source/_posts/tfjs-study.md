---
title: tfjs-study
date: 2025-04-28 18:01:37
tags:
---



linear-study
.
├── dist
├── index.html
├── node_modules
├── package-lock.json
├── package.json
└── script.js


```
index.html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script src="script.js"></script>
</body>
</html>

```

```
import * as tfvis from '@tensorflow/tfjs-vis';

window.onload = function () {

    const xs = [1,2,3,4]
    const ys = [1,3,5,7]

    tfvis.render.scatterplot(
        { name: 'Linear Regression' },
        { values: xs.map((x, i) => ({ x, y: ys[i] })) },
        // {
        //     xLabel: 'X',
        //     yLabel: 'Y',
        //     height: 300,
        // },
        {
            xAxisDomain: [0, 10],
            yAxisDomain: [0, 10]
        }
    );
    

    // const model = tf.sequential();
    // model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    // model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
    
    // const xs = tf.tensor2d([0, 1, 2, 3], [4, 1]);
    // const ys = tf.tensor2d([0, 1, 2, 3], [4, 1]);
    
    // const container = {
    //     name: 'Linear Regression',
    //     styles: {
    //     height: '1000px',
    //     width: '1000px',
    //     },
    // };
    
    // const surface = tfvis.visor().surface(container);


}
```

```
cnpm i parcel-bundler -g

parcel index2.html


cnpm 安装  @tensorflow/tfjs 报错，改为 

npm install @tensorflow/tfjs 就没问题了


https://js.tensorflow.org/api/latest/?hl=zh-cn&_gl=1*nv702p*_ga*MjExOTY1MjIyNi4xNzQ1ODI3MTc0*_ga_W0YLR4190T*MTc0NTgzMTA0MC4yLjEuMTc0NTgzMjU4OC4wLjAuMA..#dot


参考：

https://www.bilibili.com/video/BV1p2BWYVEik?spm_id_from=333.788.player.switch&vd_source=ffda878df0ed45bee1ade91d8f451048&p=10

```