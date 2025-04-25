---
title: ollama serve 如何让进程一直在
date: 2025-04-25 14:18:16
tags:
---


以下是几种让 `ollama serve` 进程一直运行的方法：

### 使用 `screen` 工具

  1. 安装 `screen`（如果尚未安装）：
     ```bash
     sudo apt install screen
     ```
  2. 创建一个新的 `screen` 会话并运行 `ollama serve`：
     ```bash
     screen -S ollama_session
     ollama serve
     ```
  3. 按下 `Ctrl+A` 然后按下 `D`，将当前会话分离，此时 `ollama serve` 将在后台继续运行。

### 使用 `tmux` 工具

  1. 安装 `tmux`（如果尚未安装）：
     ```bash
     sudo apt install tmux
     ```
  2. 创建一个新的 `tmux` 会话并运行 `ollama serve`：
     ```bash
     tmux new -s ollama_session
     ollama serve
     ```
  3. 按下 `Ctrl+B` 然后按下 `D`，将当前会话分离，`ollama serve` 会在后台持续运行。

### 使用 `nohup` 命令

执行以下命令来后台运行 Ollama：
```bash
nohup ollama serve &
```
这会生成一个名为 `nohup.out` 的文件，用于存储输出日志。

### 使用 `systemd` 管理服务（仅限 Linux）

  1. 创建服务文件：
     ```bash
     sudo nano /etc/systemd/system/ollama.service
     ```
  2. 在文件中添加以下内容：
     ```
     [Unit]
     Description=Ollama AI Service
     After=network.target

     [Service]
     Type=simple
     User=<your-username>
     WorkingDirectory=/path/to/ollama
     ExecStart=/usr/bin/ollama serve
     Restart=on-failure
     Environment="OLLAMA_HOST=0.0.0.0:11434"

     [Install]
     WantedBy=multi-user.target
     ```
  3. 启用并启动服务：
     ```bash
     sudo systemctl enable ollama.service
     sudo systemctl start ollama.service
     ```
如果需要停止服务，可以使用以下命令：
```bash
sudo systemctl stop ollama.service
```
查看服务状态：
```bash
sudo systemctl status ollama.service
```。

### 关闭终端时自动重启

这种方式需要手动编写字 shell 脚本，并将其添加到系统的启动项中，让系统在启动时自动运行该脚本，从而实现关闭终端时自动重启的效果。不过需要注意的是，这种方法一般用于特定场景，且需要根据系统的不同（如 Windows 和 Linux）采取不同的实现方式。

这些方法可以让 `ollama serve` 在后台持续运行，你可以根据自己的需求和系统环境选择合适的方式。


这是一段 `systemd` 服务配置文件的代码，用于管理 Ollama 服务的启动、运行和停止等行为。下面是对代码各部分的详细解释：

### `[Unit]` 部分

  * **Description=Ollama AI Service** ：用于描述该服务的简单信息，这里表示这是一个名为 “Ollama AI Service” 的服务。
  * **After=network.target** ：定义了服务的启动顺序依赖关系，表示该服务要在 `network.target` 单元之后启动。`network.target` 是一个用于标记网络服务可用的目标单元，这确保了 Ollama 服务在启动时网络已经就绪，以便它能正常地通过网络进行通信。

### `[Service]` 部分

  * **Type=simple** ：指定了服务的类型为简单类型，表示服务进程会在启动后立即开始运行，并且不会 fork 出子进程。这是最常见和简单的服务类型，适用于大多数直接运行的守护进程。
  * **User=<your-username>** ：定义了运行该服务的系统用户。`<your-username>` 是一个占位符，需要替换为实际的系统用户名。这样可以控制服务运行时的用户权限，以确保服务在合适的权限级别下运行，避免使用 root 用户带来的安全风险。
  * **WorkingDirectory=/path/to/ollama** ：设置了服务的工作目录，即服务在运行时所在的目录。`/path/to/ollama` 是一个示例路径，需替换为实际存放 Ollama 相关文件和配置的目录路径，这有助于服务在运行过程中正确地访问和操作文件。
  * **ExecStart=/usr/bin/ollama serve** ：指定了启动服务时要执行的命令。这里表示使用 `/usr/bin/ollama` 可执行文件，并传递 `serve` 参数来启动 Ollama 服务，这是启动 Ollama 的核心命令，用于使 Ollama 以服务的形式开始监听和处理请求。
  * **Restart=on-failure** ：配置了服务的重启策略。当服务因错误（如非零退出码、被信号终止等）而停止时，`systemd` 会自动尝试重启该服务，这提高了服务的可靠性和可用性，确保服务能够自动从一些常见的故障中恢复。
  * **Environment="OLLAMA_HOST=0.0.0.0:11434"** ：设置了一个环境变量 `OLLAMA_HOST`，其值为 `0.0.0.0:11434`。这通常用于指定 Ollama 服务监听的主机地址和端口号，`0.0.0.0` 表示监听所有网络接口，`11434` 是默认的服务端口，这样可以使 Ollama 服务能够接收来自任何网络接口的请求。

### `[Install]` 部分

  * **WantedBy=multi-user.target** ：定义了该服务的安装目标，表示当系统进入多用户模式（`multi-user.target`）时，该服务会被自动启动。`multi-user.target` 是一个常见的系统目标，用于表示多用户环境下的系统状态，这使得 Ollama 服务能够在系统启动后自动运行，为用户提供了一种方便的自动启动机制。