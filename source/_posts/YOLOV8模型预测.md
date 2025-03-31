---
title: YOLOV8模型预测
date: 2025-03-31 13:48:34
tags:
---

# YOLOV8模型预测

模型预测基本使用

激活虚拟环境
conda activate yolov8

命令行：

```
yolo predict model=yolo11n.pt source='./bus.jpg'

```

test.py
```
from ultralytics import YOLO
model = YOLO('yolo11n.pt', task='detect')

# 对图片检测
# results = model(source='./bus.jpg')

# 对视频检测
# results = model(source='./video.mp4')

# 对屏幕检测
results = model(source='screen')

# 对摄像头检测
#results = model(source=0)


results = model(source='./bus.jpg', save=True, conf=0.5)

```

python test.py




安装 jupyterlab

pip install jupyterlab



![](../images/yolo11_01.png)

![](../images/yolo11_02.png)

![](../images/yolo11_03.png)

![](../images/yolo11_04_01.png)

![](../images/yolo11_04.png)

![](../images/yolo11_05.png)

![](../images/yolo11_06.png)


![](../images/yolo11_07_1.png)
![](../images/yolo11_07_2.png)
![](../images/yolo11_07_3.png)
![](../images/yolo11_07_4.png)



参考：

参数介绍
https://docs.ultralytics.com/modes/predict/#inference-arguments


https://www.bilibili.com/video/BV1CfQqYUEL5?spm_id_from=333.788.videopod.episodes&vd_source=ffda878df0ed45bee1ade91d8f451048&p=3