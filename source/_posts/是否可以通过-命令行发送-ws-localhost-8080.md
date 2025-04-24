---
title: 是否可以通过 命令行发送 ws://localhost:8080
date: 2025-04-24 18:08:00
tags:
---


是的，可以通过命令行工具发送消息到 `ws://localhost:8080`，但需要借助一些工具，比如 `wscat`。

### 1. **安装 wscat**
`wscat` 是一个命令行工具，可以用来测试 WebSocket 服务。

```bash
npm install -g wscat
```

### 2. **连接到 WebSocket 服务器**
使用 `wscat` 连接到服务器：

```bash
wscat -c ws://localhost:8080
```

连接成功后，你应该看到类似这样的提示：

```bash
connected (press CTRL+C to quit)
```

### 3. **发送消息**
当连接成功后，可以发送 JSON 格式的指令。例如：

```bash
> {"windowSize": 10, "predictionTime": 5}
```

### 4. **查看返回消息**
服务器会将监控和预测数据发送回客户端，你可以在命令行中看到返回的 JSON 消息。

### 5. **断开连接**
按 `Ctrl+C` 断开连接。

### 6. **其他命令行工具**
- **`websocat`**：另一个选择，使用方法类似：
  ```bash
  websocat ws://localhost:8080
  ```
  安装方法：
  ```bash
  cargo install websocat
  ```
- **`socat`**：通过 `socat` 也可以实现类似功能，但语法略有不同。

使用这些工具，你可以快速测试 WebSocket 服务器的功能。


package.json

```
{
  "name": "nodejs-backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "systeminformation": "^5.25.11",
    "websocket": "^1.0.35"
  }
}


```


server.js

```
// 指定与服务器和监控过程相关的导入。
const http = require("http"); // 导入 'http' 模块以创建 HTTP 服务器。
const WebSocketServer = require("websocket").server; // 导入 WebSocket 服务器模块。
const si = require('systeminformation'); // 导入 'systeminformation' 库以获取设备的系统信息。
const fs = require('fs'); // 导入 'fs' 模块以处理文件系统。

// 与机器学习相关的导入。
// var MLP = require('mlp'); // 导入 'mlp' 库，用于多层感知机预测。
// var KNN = require('ml-knn'); // 导入 'ml-knn' 库，用于 K 最近邻分类。


// 声明并初始化将在服务器脚本中使用的全局变量。
var monitoringInterval; // 声明一个用于监控间隔的变量。
var sampleSize = 0; // 初始化一个用于样本大小的变量，在数据收集阶段使用。
var predTime = 0; // 初始化一个用于预测时间的变量，表示用户希望进行预测的时间点。
var predRX = 0; // 初始化一个用于预测下载速度的变量，单位为 Kb/s。
var predTX = 0; // 初始化一个用于预测上传速度的变量，单位为 Kb/s。
var predLat = 0; // 初始化一个用于预测延迟的变量，单位为 ms。
var scoreQoS = ""; // 初始化一个用于 QoS（服务质量）得分的变量。
var latency = 0; // 初始化一个用于延迟测量的变量，单位为 ms。
var averageLatency = 0; // 初始化一个用于计算平均延迟的变量，单位为 ms。
var deviceActivity = ""; // 初始化一个用于确定设备活动状态的变量，状态可以是“空闲”“浏览”或“流媒体”。


// 从本地存储的数据库中获取一些之前存储的下载速度值。
const contents1 = fs.readFileSync("./Databases/downloadSpeed.txt", 'utf-8'); // 读取 'downloadSpeed.txt' 文件的内容。
var downloadArray = contents1.split(/\r?\n/); // 将内容分割成一个数组，假设每一行代表一个值。

// 从本地存储的数据库中获取一些之前存储的上传速度值。
const contents2 = fs.readFileSync("./Databases/uploadSpeed.txt", 'utf-8'); // 读取 'uploadSpeed.txt' 文件的内容。
var uploadArray = contents2.split(/\r?\n/); // 将内容分割成一个数组，假设每一行代表一个值。




// 在 8080 端口上托管服务器连接。
const server = http.createServer(); // 创建 HTTP 服务器实例。
server.listen(8080); // 在 8080 端口上监听传入的 HTTP 请求。
console.log("Server started on port 8080..."); // 记录消息，指示服务器已启动。
console.log("Waiting for connection..."); // 记录消息，指示服务器正在等待连接。

// 创建 WebSocket 服务器实例，并将其附加到之前创建的 HTTP 服务器。
const wsServer = new WebSocketServer({
    httpServer: server,
});


// 通过 WebSocket 服务器监听客户端的连接请求。
wsServer.on("request", function (request) {
    // 接受客户端的连接。
    const connection = request.accept(null, request.origin);
    // 使用 "message" 关键字接受来自客户端的消息。
    connection.on("message", function (message) {
        // 此处包含列表 5-16 的内容

        // 获取从客户端获得的消息。
        // 在这种情况下，收到的第一条消息是客户端发送的 URL。
        // 这确保了通信是正常的。
        console.log("Message from Client:", message.utf8Data);
        // 初始化一个变量以包含客户端发送的消息。
        var clientMessage = message.utf8Data;
        // 检查客户端发送的消息中是否包含 JSONObject 中的 "windowSize" 变量。
        // 这作为触发监控过程的决定因素。
        // 收到 "windowSize" 变量意味着客户端运行正常。
        if (clientMessage.includes("windowSize")) {
            const msg = JSON.parse(clientMessage); // 初始化一个常量以解析消息。
            // 从 JSONObject 中获取 "windowSize" 和 "predictionTime" 的值。
            sampleSize = msg.windowSize; // "windowSize" 的值。
            predTime = msg.predictionTime; // "predictionTime" 的值。
            // 初始化一个计数器，以知道已收集了多少网络流量。
            var counter = 0;
            // 初始化一个数组，以包含延迟项。
            var latencyArray = [];
            // 初始化一个计数器，以知道已收集了多少延迟值。
            var counterLatency = 0;
            // 使用 setInterval 方法创建一个每秒运行一次的函数。
            // 该方法以函数和毫秒为单位的时间间隔作为输入。
            monitoringInterval = setInterval(function () {
                // 此处包含列表 5-17 和列表 5-18 的内容

                // 从 Wi-Fi 接口获取网络数据。
                si.networkStats().then(data => {
                    // 计算每秒接收的数据包数量，即下载速度。
                    var RX = Math.round((((data[0].rx_sec) / 1000) + Number.EPSILON) * 100) / 100;
                    // 计算每秒发送的数据包数量，即上传速度。
                    var TX = Math.round((((data[0].tx_sec) / 1000) + Number.EPSILON) * 100) / 100;
                    // 使用 push() 方法将新读取的流量添加到预加载的数组中。
                    // 预加载的数组以时间序列方式存储参数。
                    // 根据设备活动，这可能会提高算法的性能。
                    downloadArray.push(RX); // 将下载速度值添加到其预加载的数组中。
                    uploadArray.push(TX); // 将上传速度值添加到其预加载的数组中。
                    // 将值记录到控制台。
                    console.log("Download Speed: " + RX + " KB/s");
                    console.log("Upload Speed: " + TX + " KB/s");
                    console.log("-----------------------------");
                    // 当记录了六十个值时，停止监控过程并触发机器学习算法。
                    if (counter == 60) {
                        // 使用 clearInterval() 方法停止监控过程。
                        clearInterval(monitoringInterval);
                        // 调用预测方法，对下载速度进行时间序列预测。
                        // 确保如果算法失败并返回 NaN，则再次调用该方法。
                        while (true) {
                            predRX = predictMLP(downloadArray, parseInt(sampleSize), parseInt(predTime), 0.1, 0.01);
                            if (!isNaN(predRX)) {
                                // 如果获得实际数字，则退出循环。
                                break;
                            }
                        }
                        // 调用预测方法，对上传速度进行时间序列预测。
                        // 确保如果算法失败并返回 NaN，则再次调用该方法。
                        while (true) {
                            predTX = predictMLP(uploadArray, parseInt(sampleSize), parseInt(predTime), 0.1, 0.01);
                            if (!isNaN(predTX)) {
                                // 如果获得实际数字，则退出循环。
                                break;
                            }
                        }
                        // 调用预测方法，对延迟进行时间序列预测。
                        // 确保如果算法失败并返回 NaN，则再次调用该方法。
                        while (true) {
                            predLat = predictMLP(latencyArray, parseInt(sampleSize), parseInt(predTime), 0.1, 0.01);
                            if (!isNaN(predLat)) {
                                // 如果获得实际数字，则退出循环。
                                break;
                            }
                        }
                        // 通过调用分类方法对设备活动进行分类。
                        deviceActivity = calculateKNN(RX, TX);
                        // 创建一个包含预测和分类结果的常量变量。
                        const predictionMessage = {
                            downloadSpeed: RX,
                            uploadSpeed: TX,
                            predictedDownloadSpeed: predRX,
                            predictedUploadSpeed: predTX,
                            predictedLatency: predLat,
                            predictedQoS: scoreQoS,
                            deviceActivity: deviceActivity,
                            averageLatency: averageLatency
                        };
                        // 将指标消息封装在 JSON 格式的字符串中，并通过 WebSocket 连接发送。
                        connection.send(JSON.stringify(predictionMessage));
                    } else {
                        // 创建一个包含每秒发送给客户端的网络流量值的常量变量。
                        // 添加所有 3 个实时值。
                        const jsonMessage = {
                            downloadSpeed: RX,
                            uploadSpeed: TX,
                            latency: latency
                        };
                        // 将实时消息封装在 JSON 格式的字符串中，并通过 WebSocket 连接发送。
                        connection.send(JSON.stringify(jsonMessage));
                        // 增加网络流量计数器。
                        counter = counter + 1;
                    }
                })


            }, 1000); // 指定监控过程的时间间隔为 1000 毫秒。
        }
    });
    // 使用 "close" 关键字处理客户端断开连接。
    connection.on("close", function (reasonCode, description) {
        // 记录消息，指示客户端已断开连接。
        console.log("Client has disconnected.");
        // 当客户端断开连接时，停止监控过程。
        clearInterval(monitoringInterval);
    });
});



```