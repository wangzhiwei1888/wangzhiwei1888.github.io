---
title: tfjs-study
date: 2025-04-28 18:01:37
tags:
---

## 机器学习是什么？

```
机器学习是对能通过经验自动改进的计算机算法的研究。

机器学习是研究
机器学习是计算机算法的研究
机器学习是对（经验）自动改进的计算机算法的研究。

机器学习是用（数据）或以往的（经验），以此优化计算机程序的性能标准。

```


### 机器学习例子 - 线性回归

![](../images/tfjs/01.png)

```

```



### 机器学习例子 - 逻辑回归

![](../images/tfjs/02.png)


### 机器学习例子 - 图片分类

![](../images/tfjs/03.png)


### 机器学习例子 - 语音助手

![](../images/tfjs/04.png)


## 为何要用机器学习？
有些棘手问题只能用机器学习来解决
获取数据比编写规则更容易
GPU等计算能力显著提升

## 机器学习如何运作？

### 神经网络 (重点)
### 2、决策树、支持向量机、贝叶斯分类器、强化学习...



## 神经网络

### 什么是神经网络？

在本课程中，指的是人工神经网络

人工神经网络是一种运算模型（就是输入输出的映射），由大量的节点（或称神经元）之间相互连接构成


![](../images/tfjs/05.png)

在上图中显示的是双层神经网络

每个神经元里存储着若干 权重（weight）、偏置（bias）和一个激活函数（activation function） 

计算过程：输入乘上权重，加上偏置，再经过激活函数得到输出

激活函数 用于添加一些非线性变化，不能一直线性增长

神经网络通常包括一个输入层、若干个隐藏层、一个输出层

输入层通常不用于计算神经网络的层数

## 什么是神经网络训练？

给大量输入和输出，算出神经网络里所有神经元的权重和偏置，然后给定新的输入，可以算出新的输出
在机器学习里输入输出被称为特征和标签，大量的输入和输出被称为训练集

例子：
给1000个相亲对象的数据(特征),和对应的满意程度(标签),训练完后,给一份新的相亲对象的数据,就可以判定满意程度了。


## 如何训练神经网络？

初始化：随机生成一些权重和偏置
计算损失：给定特征，计算出标签，得到它与真实标签的差距
优化：微调权重和偏置，让差距（损失）变小


前向传播与反向传播
前向传播：将训练数据的特征输入到神经网络，得到预测的标签
反向传播：将预测的标签与真实标签比较，得到损失，然后根据损失微调权重和偏置，让差距变小 （计算损失并优化）

## 如何计算损失？

使用损失函数
本课称涉及的损失函数：均方误差、对数损失、交叉熵损失
了解原理即可，工作中可以直接从第三方库中调用。tensorflow.js 中调用

## 如何优化？

使用优化器
本课称涉及的优化器：随机梯度下降（SGD）、Adam
了解原理即可，工作中可以直接从第三方库中调用。tensorflow.js 中调用



## tensorflow.js 是什么

tensorflow.js 是一个开源的机器学习库，基于 TensorFlow 的 JavaScript 实现。
可以直接在浏览器和Node.js 中使用机器学习技术了

## tensorflow.js 具体功能

运行现有模型
重新训练现有模型
使用 JavaScript 开发机器学习模型

![](../images/tfjs/06.png)

## 什么是 Tensor ?

中文名叫张量
张量是向量和矩阵向更高维度的推广
相当于多维数组


```
import * as tf from '@tensorflow/tfjs';


const t0 = tf.tensor(1);
t0.print();
console.log(t0);

```
![](../images/tfjs/07.png)



```
const t1 = tf.tensor([1, 2]);
t1.print();

console.log(t1);

```

![](../images/tfjs/08.png)


```

const t2 = tf.tensor([[1, 2], [3, 4]]);

t2.print();
console.log(t2);


```
![](../images/tfjs/09.png)


## Tensor和机器学习的关系

![](../images/tfjs/10.png)

神经网络的每一层要存储N维数据
N层的For循环运算
Tensor作为高维数据结构完美解决以上问题


```


import * as tf from '@tensorflow/tfjs';

// 传统 for 循环
const input = [1, 2, 3, 4];
const w = [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6], [4, 5, 6, 7]];
const output = [0, 0, 0, 0];

for (let i = 0; i < w.length; i++) {
    for (let j = 0; j < input.length; j++) {
        output[i] += input[j] * w[i][j];
    }
}

console.log(output);

tf.tensor(w).dot(tf.tensor(input)).print();

```

![](../images/tfjs/11.png)

![](../images/tfjs/12.png)

![](../images/tfjs/13.png)


什么是线性回归？
利用数理统计中回归分析，来确定两种或两种以上变量间相互依赖的定量关系的一种统计分析方法。

例子：身高体重预测、房价预测

操作步骤
准备、可视化训练数据

使用TensorFlow.js的API 构建神经网络（只有一个神经元）

训练模型并预测

tf-vis 文档
https://js.tensorflow.org/api_vis/1.5.1/#render.scatterplot

定义模型结构：

单层单个神经元组成的神经网络



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
    

    // const model = tf.sequential(); //创建模型 （连续的模型）
    // model.add(tf.layers.dense({ units: 1, inputShape: [1] })); //添加层 dense全连接层 输入维度为1 输出维度为1 units为输出维度 units 神经元的个数 https://js.tensorflow.org/api/4.22.0/#layers.dense
    // model.compile({ loss: tf.losses.meanSquaredError, optimizer: tf.train.sgd(0.1) }); //编译模型 meanSquaredError MSE 均方误差损失函数 sgd 随机梯度下降 优化器
    // 
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

![](../images/tfjs/14.png)


![](../images/tfjs/15.png)

![](../images/tfjs/16.png)


```
cnpm i parcel-bundler -g

parcel index2.html


cnpm 安装  @tensorflow/tfjs 报错，改为 

npm install @tensorflow/tfjs 就没问题了


https://js.tensorflow.org/api/latest/?hl=zh-cn&_gl=1*nv702p*_ga*MjExOTY1MjIyNi4xNzQ1ODI3MTc0*_ga_W0YLR4190T*MTc0NTgzMTA0MC4yLjEuMTc0NTgzMjU4OC4wLjAuMA..#dot


参考：

google机器学习课程 course
https://developers.google.com/machine-learning/crash-course/linear-regression?hl=zh-cn

https://www.bilibili.com/video/BV1p2BWYVEik?spm_id_from=333.788.player.switch&vd_source=ffda878df0ed45bee1ade91d8f451048&p=10

kimi问答
https://kimi.moonshot.cn/chat/d0dcjumf2kqelc31foc0

```