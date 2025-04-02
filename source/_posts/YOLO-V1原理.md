---
title: YOLO V1原理
date: 2025-04-01 16:07:37
tags:
---

## YOLO V1原理

### YOLO V1 是一个单阶段的检测算法
### YOLO V1 对小物体，和比较接近的物体，检测准确度较差，YOLO的网格大小 会限制检测精度，尤其在物体较小或聚集的情况下


![](../images/yolov1_ppt/yolov1_ppt-01.png)

![](../images/yolov1_ppt/yolov1_ppt-02.png)
### Classification 类别
### Regression 边界框
### Localization 定位任务
### Region Proposal 区域候选: 是指在目标检测过程中，通过某种算法预先找出图像中目标可能出现的位置，这些位置被称为候选区域

![](../images/yolov1_ppt/yolov1_ppt-03.png)

### Iou 交并比 反应了预测效果（0-1）
![](../images/yolov1_ppt/yolov1_ppt-04.png)

### YOLO (You Only Look Once) 是一种时时物体检测方法，对整个图像同时进行检测，不像传统的对图像进行分类后检测，这使得YOLO可以显著提高检测速度。

### 2015年发布第一个版本

![](../images/yolov1_ppt/yolov1_ppt-05.png)



![](../images/yolov1_ppt/yolov1_ppt-06.png)

### Training Phase: How to establish a connection between the 7x7x30 output and the labels of the input image to compute the loss?
### 训练阶段：如何在7x7x30输出与输入标签之间建立连接计算损失的图像？
### Inference Phase: How to obtain bounding boxes and class probabilities from the 7x7x30 output?
### 推理阶段：如何从7x7x30输出中获取边界框和类概率？

![](../images/yolov1_ppt/yolov1_ppt-07.png)

### If multiple objects are in the same cell, only one class is assigned for training.

![](../images/yolov1_ppt/yolov1_ppt-08.png)

regression problem. 回归问题

![](../images/yolov1_ppt/yolov1_ppt-09.png)
![](../images/yolov1_ppt/yolov1_ppt-10.png)

### Bounding box coordinate regression 
### 边界框坐标回归损失，用于计算真实的 xywh 和预测的 xywh 之间的差别，此处用比较简单的平方损失函数
（1 ij obj） 第i个网格的第j个box, 一个网格会生成两个box,两个box中用于检测物体的box,交并比 Iou 大的box， （1 ij obj）取1 否则 取0

用于检测的box 和 ground truth 之间的坐标回归的损失

拉姆达 λ 是为了调解不同损失之间的权重 值 为 5

### Bounding box score prediction
### 边界框得分预测损失
用于计算物体存在的置信度误差
Ci 是网格中存在物体的概率，Ci 取1 否则取0
（1 ij nobj） 第i个网格的第j个box, 一个网格会生成两个box,两个box中 不用于 检测物体的box, λ 是为了调节不同损失之间的权重 值 为 0.5


### Classscore prediction
### 类得分预测损失
用于计算物体类别的置信度误差，预测类别概率于实际类别的概率之间的差异
（1 i obj）如果有某个物体的中心落在第i 个 网格中，这一项取1，否则取0，取1 就会计算后面的平方损失

![](../images/yolov1_ppt/yolov1_ppt-11.png)


### 推理阶段 每个 网格 都有 2个 bounding box

（图一）7*7*2 = 98个 bounding box，每个 bounding box 都有一个置信度，我们用粗细来区分了不同的置信度，置信度越大就越粗

（图二）同时我们还可以得到 每个 bounding box 的 类别概率,右侧的有计算公式

中这个 网格里有物体的情况下 是第i个类别的概率 条件概率 * 网格中有物体的概率 * 预测框和真实框之间的Iou 
= 网格是第i 类的概率 * Iou


![](../images/yolov1_ppt/yolov1_ppt-12.png)
![](../images/yolov1_ppt/yolov1_ppt-13.png)
![](../images/yolov1_ppt/yolov1_ppt-14.png)
![](../images/yolov1_ppt/yolov1_ppt-15.png)
![](../images/yolov1_ppt/yolov1_ppt-16.png)
![](../images/yolov1_ppt/yolov1_ppt-17.png)
![](../images/yolov1_ppt/yolov1_ppt-18.png)



![](../images/yolov1_ppt/yolov1_ppt-19.png)
![](../images/yolov1_ppt/yolov1_ppt-20.png)
![](../images/yolov1_ppt/yolov1_ppt-21.png)

### NMS 非极大值抑制，移除那些多余的 bounding boxes, 仅保留具有最高置信度的 bounding boxes


![](../images/yolov1_ppt/yolov1_ppt-22.png)


参考：
https://www.bilibili.com/video/BV1gKwAeWEo4?spm_id_from=333.788.player.switch&vd_source=ffda878df0ed45bee1ade91d8f451048&p=3