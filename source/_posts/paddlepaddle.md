---
title: paddlepaddle
date: 2025-03-28 17:10:35
tags:
---

https://www.paddlepaddle.org.cn/install/quick?docurl=undefined


```
安装

conda create -n paddle3 python=3.8

conda activate paddle3

conda install paddlepaddle==3.0.0 -c paddle


验证安装

python

import paddle
paddle.utils.run_check()

打印
/opt/anaconda3/envs/paddle3/lib/python3.8/site-packages/paddle/utils/cpp_extension/extension_utils.py:711: UserWarning: No ccache found. Please be aware that recompiling all source files may be required. You can download and install ccache from: https://github.com/ccache/ccache/blob/master/doc/INSTALL.md
  warnings.warn(warning_message)
>>> paddle.utils.run_check()
Running verify PaddlePaddle program ...
I0328 17:09:40.513358 4041525312 pir_interpreter.cc:1541] New Executor is Running ...
I0328 17:09:40.513667 4041525312 pir_interpreter.cc:1564] pir interpreter is running by multi-thread mode ...
PaddlePaddle works well on 1 CPU.
PaddlePaddle is installed successfully! Let's start deep learning with PaddlePaddle now.

```


brew install ccache

线性回归

```
import paddle

# 定义一个计算费用的函数，根据行驶距离计算总费用
def calculate_fee(distance_travelled):
    """
    根据行驶距离计算总费用。
    
    参数:
    distance_travelled -- 行驶距离
    
    返回:
    总费用
    """
    return 10 + distance_travelled * 2

# 对于一组行驶距离，计算并打印相应的费用
for x in [1.0, 3.0, 5.0, 10.0]:
    print(calculate_fee(x))


# 线性回归demo

# 将行驶距离和对应的费用转换为PaddlePaddle张量
x_data = paddle.to_tensor([[1.0], [3.0], [5.0], [10.0]])
y_data = paddle.to_tensor([[12.0], [16.0], [20.0], [30.0]])

# 创建一个线性模型，用于拟合行驶距离和费用之间的关系
linear = paddle.nn.Linear(in_features=1, out_features=1)

# 获取线性模型的初始权重和偏置
w_before_opt = linear.weight.numpy().item()
b_before_opt = linear.bias.numpy().item()
print("Initial w: %.2f, b: %.2f" % (w_before_opt, b_before_opt))

# 定义均方误差损失函数
mes_loss = paddle.nn.MSELoss()

# 创建随机梯度下降优化器
sgd_optimizer = paddle.optimizer.SGD(learning_rate=0.001, parameters=linear.parameters())

# 设置总训练轮数 可分别tiao换为10000, 20000, 50000
total_epoch = 20000 

# 开始训练过程
for i in range(total_epoch):
    # 使用线性模型进行预测
    y_predict = linear(x_data)
    # 计算预测值和真实值之间的损失
    loss = mes_loss(y_predict, y_data)
    # 反向传播计算梯度
    loss.backward()
    # 更新模型参数
    sgd_optimizer.step()
    # 清除梯度
    sgd_optimizer.clear_gradients()
    # 每1000轮打印一次训练信息
    if i % 1000 == 0:
        print(i, loss.numpy())

print("Training finished, loss= {}".format(loss.numpy()))

# 获取训练后的权重和偏置
w_after_opt = linear.weight.numpy().item()
b_after_opt = linear.bias.numpy().item()
print("Initial w: %.2f, b: %.2f" % (w_after_opt, b_after_opt))

```