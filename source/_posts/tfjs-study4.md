---
title: tfjs-study4
date: 2025-05-10 10:27:08
tags:
---

## 基于迁移学习的图像分类器 --商标识别任务


把已训练好的模型参数迁移到新的模型来帮助新模型训练

深度学习模型参数多，从头训练陈本高

删除原始模型的最后一层，基于此截断模型的输出训练一个新的（通常相当浅的）模型

加载商标训练数据并可视化
定义模型结构：截断模型 + 双层神经网络
训练模型并预测



![](../images/tfjs/61.png)

![](../images/tfjs/62.png)

![](../images/tfjs/63.png)

![](../images/tfjs/64.png)


data.js

```
const IMAGE_SIZE = 224;

const loadImg = (src) => {
    return new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.width = IMAGE_SIZE;
        img.height = IMAGE_SIZE;
        img.onload = () => resolve(img);
    });
};
export const getInputs = async () => {
    const loadImgs = [];
    const labels = [];
    for (let i = 0; i < 30; i += 1) {
        ['android', 'apple', 'windows'].forEach(label => {
            const src = `http://127.0.0.1:8080/brand/train/${label}-${i}.jpg`;
            const img = loadImg(src);
            loadImgs.push(img);
            labels.push([
                label === 'android' ? 1 : 0,
                label === 'apple' ? 1 : 0,
                label === 'windows' ? 1 : 0,
            ]);
        });
    }
    const inputs = await Promise.all(loadImgs);
    return {
        inputs,
        labels,
    };
}

```


script.js

```

import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import { getInputs } from './data';
import { img2x, file2img } from './utils';

const MOBILENET_MODEL_PATH = 'http://127.0.0.1:8080/mobilenet/web_model/model.json';
const NUM_CLASSES = 3;
const BRAND_CLASSES = ['android', 'apple', 'windows'];

window.onload = async () => {
    const { inputs, labels } = await getInputs();
    const surface = tfvis.visor().surface({ name: '输入示例', styles: { height: 250 } });
    inputs.forEach(img => {
        surface.drawArea.appendChild(img);
    });

    const mobilenet = await tf.loadLayersModel(MOBILENET_MODEL_PATH);
    mobilenet.summary(); // 模型结构/*  */
    const layer = mobilenet.getLayer('conv_pw_13_relu'); //  获取模型中间层
    const truncatedMobilenet = tf.model({ //  截断模型
        inputs: mobilenet.inputs, //  输入层
        outputs: layer.output //  输出层 
    });

    //  创建新模型
    const model = tf.sequential();

    console.log(layer.outputShape)
    model.add(tf.layers.flatten({ //  展平层， 一维的向量，无训练参数 
        inputShape: layer.outputShape.slice(1) //  获取中间层输出的形状
    }));
    model.add(tf.layers.dense({ //  全连接层
        units: 10,
        activation: 'relu'
    }));
    model.add(tf.layers.dense({ // 分类层 
        units: NUM_CLASSES,
        activation: 'softmax'
    }));

    // 定义损失函数和优化器
    model.compile({ loss: 'categoricalCrossentropy', optimizer: tf.train.adam() });

    //训练数据经过截断模型，转为可以用于新模型训练的数据
    const { xs, ys } = tf.tidy(() => {
        const xs = tf.concat(inputs.map(imgEl => truncatedMobilenet.predict(img2x(imgEl))));
        const ys = tf.tensor(labels);
        return { xs, ys };
    });

    await model.fit(xs, ys, {
        epochs: 20,
        callbacks: tfvis.show.fitCallbacks(
            { name: '训练效果' },
            ['loss'],
            { callbacks: ['onEpochEnd'] }
        )
    });

    window.predict = async (file) => {
        const img = await file2img(file);
        document.body.appendChild(img);
        const pred = tf.tidy(() => {
            const x = img2x(img);
            const input = truncatedMobilenet.predict(x);
            return model.predict(input);
        });

        const index = pred.argMax(1).dataSync()[0];
        setTimeout(() => {
            alert(`预测结果：${BRAND_CLASSES[index]}`);
        }, 0);
    };

    window.download = async () => {
        await model.save('downloads://model');
    };
};

```


utils.js

```

import * as tf from '@tensorflow/tfjs';

export function img2x(imgEl){
    return tf.tidy(() => {
        const input = tf.browser.fromPixels(imgEl)
            .toFloat()
            .sub(255 / 2)
            .div(255 / 2)
            .reshape([1, 224, 224, 3]);
        return input;
    });
}

export function file2img(f) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(f);
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.width = 224;
            img.height = 224;
            img.onload = () => resolve(img);
        };
    });
}

```
