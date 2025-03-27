---
title: Anaconda
date: 2025-03-27 08:27:23
tags:
---


## Anaconda



Anaconda 是一个广泛使用的软件平台，主要用于科学计算、数据分析和机器学习等领域。以下是 Anaconda 的详细介绍：

### 基本概述
- **定义**：Anaconda 是一个包含大量科学计算、数据分析和机器学习相关 Python 包的发行版，它为用户提供了便捷的包管理和环境管理功能，使得在不同项目间切换和管理依赖项变得更加容易。
- **发展**：Anaconda 由 Continuum Analytics 公司开发，首次发布于 2012 年，经过不断发展和完善，已成为数据科学领域不可或缺的工具之一。

### 主要功能
- **包管理**：Anaconda 自带 conda 包管理器，用户可以通过简单的命令安装、更新和卸载各种 Python 包，无需手动下载和配置，大大节省了时间和精力。
- **环境管理**：conda 允许用户创建多个独立的环境，每个环境可以安装不同版本的 Python 和包，有效解决了不同项目间包版本冲突的问题，确保项目的稳定性和可复现性。
- **跨平台支持**：Anaconda 支持 Windows、macOS 和 Linux 等多种操作系统，用户可以在不同平台上使用相同的工具和流程进行开发和部署。

### 应用场景
- **数据科学与分析**：在数据处理、清洗、分析和可视化等环节，Anaconda 提供了丰富的工具和库，如 pandas、NumPy、Matplotlib 等，帮助数据科学家高效地完成数据相关任务。
- **机器学习与人工智能**：Anaconda 整合了多个机器学习框架和库，如 scikit-learn、TensorFlow、PyTorch 等，为模型的训练和部署提供了强大的支持，适用于从简单的线性回归到复杂的深度学习模型的开发。
- **科研与教育**：在学术研究和教学中，Anaconda 为师生提供了统一的开发环境，便于进行算法实验、数据分析等教学和科研活动，促进了知识的传播和创新。


### mac 环境下 Anaconda 安装

https://www.anaconda.com/download

安装后可以通过命令check anaconda
```
查看虚拟环境
conda env list

创建虚拟环境
conda create -n pytorch python=3.8

激活虚拟环境
conda activate pytorch

To deactivate an active environment, use
conda deactivate


cd ~
mkdir .pip
cd .pip
vim pip.conf

[global]
index-url = http://mirrors.aliyun.com/pypi/simple/

[install]
trusted-host = mirrors.aliyun.com




https://pytorch.org/get-started/previous-versions/

激活虚拟环境
conda activate pytorch

安装 pytorch
pip install torch==2.1.2 torchvision==0.16.2 torchaudio==2.1.2

验证安装

python
>>> import torch
>>> print(torch.__version__)

```
vscode 配置

![](../images/anaconda_01.png)

command + shift + p
![](../images/anaconda_02.png)

![](../images/anaconda_03.png)



好玩的网站：

https://www.hama.app/

![](../images/test.webp)

yolo
https://hub.ultralytics.com/home

https://docs.ultralytics.com/zh


了解吴恩达机器学习算法 视频

https://www.bilibili.com/video/BV14v4y1U7ye?vd_source=ffda878df0ed45bee1ade91d8f451048&spm_id_from=333.788.videopod.episodes


深度学习入门 书

![](../images/anaconda_04.png)




参考：https://space.bilibili.com/141214205