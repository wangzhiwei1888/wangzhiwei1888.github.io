---
title: YOLOv8 模型训练
date: 2025-04-01 09:57:57
tags:
---


模型训练

yolo task=detect mode=train data=yolo-qie.yaml model=yolov8n.pt epochs=50 workers=1 batch=16


训练的三种方式

命令行方式

cd /Users/wangzhiwei/study/ai/anaconda-study/ultralytics

yolo task=detect mode=train data=yolo-qie.yaml model=yolov8n.pt epochs=50 workers=1 batch=16


Results saved to /Users/wangzhiwei/study/ai/anaconda-study/ultralytics/runs/detect/train8


脚本方式


├── datasets (ultralytics 项目外)
│   └── qie
│       ├── images
│       │   ├── train
│       │   └── val
│       ├── labels
│       │   ├── classes.txt
│       │   ├── train
│       │   ├── train.cache
│       │   ├── val
│       │   └── val.cache
│       └── yolo11n.pt
└── ultralytics
    └── yolov11-train.py


```
yolo-qie.yaml

path: qie # dataset root dir
train: images/train # train images (relative to 'path') 4 images
val: images/val # val images (relative to 'path') 4 images
test: # test images (optional)

# Classes
names:
  0: qie

```


```

yolov11-train.py

from ultralytics import YOLO
model = YOLO("yolov8n.pt") # yolo11 的仓库也可以用 yolov8n.pt 训练
model.train(data="yolo-qie.yaml", epochs=50, batch=16, workers=0)


训练结果
Results saved to /Users/wangzhiwei/study/ai/anaconda-study/ultralytics/runs/detect/train7

```


默认配置方式
![](../images/yolo_train_10.png)



验证训练结果
cd /Users/wangzhiwei/study/ai/anaconda-study/ultralytics

yolo detect predict model=runs/detect/train8/weights/best.pt source=./video.mp4 show=True conf=0.03


参考：
https://www.bilibili.com/video/BV1CfQqYUEL5?spm_id_from=333.788.player.switch&vd_source=ffda878df0ed45bee1ade91d8f451048&p=5