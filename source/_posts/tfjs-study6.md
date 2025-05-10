---
title: tfjs-study6
date: 2025-05-10 15:31:07
tags:
---


## python 与 javascript 互转

python 模型： 
通过 python 版 TensorFlow/Keras 生成模型

包括： TensorFlow SavedModel、Keras HDF5 模型 等

获取：开源网站下载/算法同事提供

javascript 模型：

可以在 TensorFlowJS中运行的模型

包括： tfjs_layers_model.json、tfjs_graph_model.json、tfjs_weights.bin 等

获取：开源网站下载/通过TFJS生成/由python 模型转换而来

为何要进行互转?
Python to JavaScript:JavaScript模型可以在浏览器中运行

JavaScript to Python:少见,为了在更多平台运行

JavaScript to JavaScript:分片/量化/加速

如何进行互转?
安装Tensorflow.js Converter
在命令行指定输入输出的路径和模型格式即可

操作步骤
安装Tensorflow.js Converter
Python与JavaScript模型互转
JavaScript模型的互转:分片、量化、加速

安装Tensorflow.js Converter

操作步骤
安装Conda
使用Conda安装Python虚拟环境
使用Python虚拟环境安装Tensorflow.jsConverter


![](../images/tfjs/69.png)

![](../images/tfjs/70.png)

![](../images/tfjs/71.png)

![](../images/tfjs/72.png)

![](../images/tfjs/73.png)

