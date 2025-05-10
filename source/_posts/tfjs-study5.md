---
title: tfjs-study5
date: 2025-05-10 14:23:22
tags:
---

## 使用预训练模型进行语音识别

模型接受声音信息，输出分类信息
声音在计算机里是声谱图，因此也可以使用卷积神经网络进行识别


![](../images/tfjs/65.png)

![](../images/tfjs/66.png)

![](../images/tfjs/67.png)

![](../images/tfjs/68.png)

script.js

```
import * as speechCommands from '@tensorflow-models/speech-commands';

const MODEL_PATH = 'http://127.0.0.1:8080/speech';

window.onload = async () => {
    const recognizer = speechCommands.create(
        'BROWSER_FFT',
        null,
        MODEL_PATH + '/model.json',
        MODEL_PATH + '/metadata.json'
    );

    await recognizer.ensureModelLoaded();

    const labels = recognizer.wordLabels().slice(2); //
    const resultEl = document.querySelector('#result');
    resultEl.innerHTML = labels.map(l => `
        <div>${l}</div>
    `).join('');
    recognizer.listen(result => { //会打开浏览器麦克风
        const { scores } = result;
        const maxValue = Math.max(...scores);
        const index = scores.indexOf(maxValue) - 2;
        resultEl.innerHTML = labels.map((l, i) => `
        <div style="background: ${i === index && 'green'}">${l}</div>
        `).join('');
    }, {
        overlapFactor: 0.3, //重叠
        probabilityThreshold: 0.9 // 置信度
    });
};

```




index.html

```

<script src="script.js"></script>
<style>
    #result>div {
        float: left;
        padding: 20px;
    }
</style>
<div id="result"></div>

```


## 基于迁移学习的语音识别器：声控轮播图

在浏览器中收集中文语音训练数据

使用 speech commands （英文语音识别） 包进行迁移学习并预测 中文语音

语音训练数据的保存和加载


操作步骤

使用 speech commands 包创建迁移学习器
编写前端界面准备收集语音数据
调用collectExample函数收集语音数据






![](../images/tfjs/68.png)



index.html

```
<script src="script.js"></script>
<button onclick="collect(this)">上一张</button>
<button onclick="collect(this)">下一张</button>
<button onclick="collect(this)">背景噪音</button>
<button onclick="save()">保存</button>
<pre id="count"></pre>
<button onclick="train()">训练</button>
<br><br>
监听开关：<input type="checkbox" onchange="toggle(this.checked)">

```

script.js

```
import * as speechCommands from '@tensorflow-models/speech-commands';
import * as tfvis from '@tensorflow/tfjs-vis';

const MODEL_PATH = 'http://127.0.0.1:8080';
let transferRecognizer;

window.onload = async () => {
    const recognizer = speechCommands.create(
        'BROWSER_FFT',
        null,
        MODEL_PATH + '/speech/model.json',
        MODEL_PATH + '/speech/metadata.json'
    );
    await recognizer.ensureModelLoaded(); // 加载模型
    transferRecognizer = recognizer.createTransfer('轮播图'); // 创建一个训练器
};

window.collect = async (btn) => {
    btn.disabled = true;
    const label = btn.innerText;
    await transferRecognizer.collectExample( //  收集样本
        label === '背景噪音' ? '_background_noise_' : label
    );
    btn.disabled = false;
    document.querySelector('#count').innerHTML = JSON.stringify(transferRecognizer.countExamples(), null, 2);
};

window.train = async () => {
    await transferRecognizer.train({
        epochs: 30,
        callback: tfvis.show.fitCallbacks(
            { name: '训练效果' },
            ['loss', 'acc'],
            { callbacks: ['onEpochEnd'] }
        )
    });
};

window.toggle = async (checked) => {
    if (checked) {
        await transferRecognizer.listen(result => { // 监听
            const { scores } = result;
            const labels = transferRecognizer.wordLabels();
            const index = scores.indexOf(Math.max(...scores));
            console.log(labels[index]);
        }, {
            overlapFactor: 0,
            probabilityThreshold: 0.75
        });
    } else {
        transferRecognizer.stopListening();
    }
};

window.save = () => {
    const arrayBuffer = transferRecognizer.serializeExamples(); //把采集好的数据存下来
    const blob = new Blob([arrayBuffer]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'data.bin';
    link.click();
};
```

## 轮播图

index.html

```
<script src="script.js"></script>
监听开关：<input type="checkbox" onchange="toggle(this.checked)">

<style>
    .slider {
        width: 600px;
        overflow: hidden;
        margin: 10px auto;
    }
    .slider > div{
        display: flex;
        align-items: center;
    }
</style>
<div class="slider">
    <div>
        <img src="https://cdn.pixabay.com/photo/2019/10/29/15/57/vancouver-4587302__480.jpg" alt="" width="600">
        <img src="https://cdn.pixabay.com/photo/2019/10/31/07/14/coffee-4591159__480.jpg" alt="" width="600">
        <img src="https://cdn.pixabay.com/photo/2019/11/01/11/08/landscape-4593909__480.jpg" alt="" width="600">
        <img src="https://cdn.pixabay.com/photo/2019/11/02/21/45/maple-leaf-4597501__480.jpg" alt="" width="600">
        <img src="https://cdn.pixabay.com/photo/2019/11/02/03/13/in-xinjiang-4595560__480.jpg" alt="" width="600">
        <img src="https://cdn.pixabay.com/photo/2019/11/01/22/45/reschensee-4595385__480.jpg" alt="" width="600">
    </div>
</div>

```

script.js

```
import * as speechCommands from '@tensorflow-models/speech-commands';

const MODEL_PATH = 'http://127.0.0.1:8080';
let transferRecognizer;
let curIndex = 0;

window.onload = async () => {
    const recognizer = speechCommands.create(
        'BROWSER_FFT',
        null,
        MODEL_PATH + '/speech/model.json',
        MODEL_PATH + '/speech/metadata.json',
    );
    await recognizer.ensureModelLoaded();
    transferRecognizer = recognizer.createTransfer('轮播图');
    const res = await fetch(MODEL_PATH + '/slider/data.bin');
    const arrayBuffer = await res.arrayBuffer();
    transferRecognizer.loadExamples(arrayBuffer);
    await transferRecognizer.train({ epochs: 30 });
    console.log('done');
};

window.toggle = async (checked) => {
    if (checked) {
        await transferRecognizer.listen(result => {
            const { scores } = result;
            const labels = transferRecognizer.wordLabels();
            const index = scores.indexOf(Math.max(...scores));
            window.play(labels[index]);
        }, {
            overlapFactor: 0,
            probabilityThreshold: 0.5
        });
    } else {
        transferRecognizer.stopListening();
    }
};

window.play = (label) => {
    const div = document.querySelector('.slider>div');
    if (label === '上一张') {
        if (curIndex === 0) { return; }
        curIndex -= 1;
    } else {
        if (curIndex === document.querySelectorAll('img').length - 1) { return; }
        curIndex += 1;
    }
    div.style.transition = "transform 1s"
    div.style.transform = `translateX(-${100 * curIndex}%)`;
};

```