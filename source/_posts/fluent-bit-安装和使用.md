---
title: fluent-bit 安装和使用
date: 2024-12-13 15:54:05
tags:
---


```

curl -s https://packages.fluentbit.io/fluentbit.key | sudo apt-key add -
echo "deb https://packages.fluentbit.io/ubuntu/focal focal main" | sudo tee /etc/apt/sources.list.d/fluentbit.list
sudo apt-get update
sudo apt-get install -y fluent-bit


find / -name fluent-bit 2>/dev/null
/usr/lib/fluent-bit
/opt/fluent-bit
/opt/fluent-bit/bin/fluent-bit


默认配置
cat /etc/fluent-bit/fluent-bit.conf
[SERVICE]
    # Flush
    # =====
    # set an interval of seconds before to flush records to a destination
    flush        1

    # Daemon
    # ======
    # instruct Fluent Bit to run in foreground or background mode.
    daemon       Off

    # Log_Level
    # =========
    # Set the verbosity level of the service, values can be:
    #
    # - error
    # - warning
    # - info
    # - debug
    # - trace
    #
    # by default 'info' is set, that means it includes 'error' and 'warning'.
    log_level    info

    # Parsers File
    # ============
    # specify an optional 'Parsers' configuration file
    parsers_file parsers.conf

    # Plugins File
    # ============
    # specify an optional 'Plugins' configuration file to load external plugins.
    plugins_file plugins.conf

    # HTTP Server
    # ===========
    # Enable/Disable the built-in HTTP Server for metrics
    http_server  Off
    http_listen  0.0.0.0
    http_port    2020

    # Storage
    # =======
    # Fluent Bit can use memory and filesystem buffering based mechanisms
    #
    # - https://docs.fluentbit.io/manual/administration/buffering-and-storage
    #
    # storage metrics
    # ---------------
    # publish storage pipeline metrics in '/api/v1/storage'. The metrics are
    # exported only if the 'http_server' option is enabled.
    #
    storage.metrics on

    # storage.path
    # ------------
    # absolute file system path to store filesystem data buffers (chunks).
    #
    # storage.path /tmp/storage

    # storage.sync
    # ------------
    # configure the synchronization mode used to store the data into the
    # filesystem. It can take the values normal or full.
    #
    # storage.sync normal

    # storage.checksum
    # ----------------
    # enable the data integrity check when writing and reading data from the
    # filesystem. The storage layer uses the CRC32 algorithm.
    #
    # storage.checksum off

    # storage.backlog.mem_limit
    # -------------------------
    # if storage.path is set, Fluent Bit will look for data chunks that were
    # not delivered and are still in the storage layer, these are called
    # backlog data. This option configure a hint of maximum value of memory
    # to use when processing these records.
    #
    # storage.backlog.mem_limit 5M

[INPUT]
    name cpu
    tag  cpu.local

    # Read interval (sec) Default: 1
    interval_sec 1

[OUTPUT]
    name  stdout
    match *



运行
sudo /opt/fluent-bit/bin/fluent-bit -c /etc/fluent-bit/fluent-bit.conf


```

```

修改配置 实现每一秒中获取 cpu 的数据，写入到 es 数据库中
sudo vi /etc/fluent-bit/fluent-bit.conf

[SERVICE]
    Flush        1
    Daemon       Off
    Log_Level    info

[INPUT]
    name cpu
    tag  cpu.local

    # Read interval (sec) Default: 1
    interval_sec 1

[OUTPUT]
    name  es
    match *
    Host  localhost
    Port  9200
    Index fluent-bit
    suppress_type_name On

sudo /opt/fluent-bit/bin/fluent-bit -c /etc/fluent-bit/fluent-bit.conf


curl -X GET "localhost:9200/_cat"
curl -X GET "localhost:9200/_cat/indices"
curl -X GET "localhost:9200/_cat/indices/fluent-bit"

curl -X GET "localhost:9200/fluent-bit/_search?pretty"



```




```

好的，下面是 Fluent Bit 的安装和使用指南。我们将分为两部分：安装和基本使用。

### 1. 安装 Fluent Bit

#### 在 Ubuntu/Debian 上安装

1. **添加 Fluent Bit 的 APT 仓库**

   ```sh
   
curl -s https://packages.fluentbit.io/fluentbit.key | sudo apt-key add -
echo "deb https://packages.fluentbit.io/ubuntu/focal focal main" | sudo tee /etc/apt/sources.list.d/fluentbit.list
sudo apt-get update
   ```

2. **安装 Fluent Bit**

   ```sh
   sudo apt-get install -y fluent-bit
   ```

#### 在 CentOS/RHEL 上安装

1. **添加 Fluent Bit 的 YUM 仓库**

   ```sh
   sudo yum install -y epel-release
   curl -fsSL https://fluentbit.io/scripts/add_fluentbit_repo.sh | sudo bash
   ```

2. **安装 Fluent Bit**

   ```sh
   sudo yum install -y fluent-bit
   ```

#### 在 macOS 上安装

1. **使用 Homebrew 安装**

   ```sh
   brew install fluent-bit
   ```

### 2. 配置 Fluent Bit

Fluent Bit 的配置文件通常位于 `/etc/fluent-bit/fluent-bit.conf`。你可以根据需要编辑这个文件。

#### 基本配置示例

```plaintext
[SERVICE]
    Flush        1
    Daemon       Off
    Log_Level    info
    Parsers_File parsers.conf

[INPUT]
    Name         tail
    Path         /var/log/*.log
    Parser       json
    Tag          kube.*

[FILTER]
    Name         record_modifier
    Match        *
    Record       hostname myhostname

[OUTPUT]
    Name         stdout
    Match        *
```

### 3. 启动 Fluent Bit

你可以使用以下命令启动 Fluent Bit：

```sh
sudo fluent-bit -c /etc/fluent-bit/fluent-bit.conf
```

### 4. 检查日志

Fluent Bit 的日志通常会输出到控制台或指定的日志文件中。你可以查看这些日志以确保 Fluent Bit 正常运行。

### 5. 常见插件

- **输入插件**:
  - `tail`: 读取文件。
  - `forward`: 接收来自其他 Fluentd/Fluent Bit 实例的数据。
  - `syslog`: 读取系统日志。

- **过滤器插件**:
  - `record_modifier`: 修改记录字段。
  - `grep`: 过滤记录。
  - `throttle`: 限制输出速率。

- **输出插件**:
  - `stdout`: 输出到控制台。
  - `es`: 输出到 Elasticsearch。
  - `kafka`: 输出到 Kafka。
  - `s3`: 输出到 Amazon S3。

### 6. 示例：将日志发送到 Elasticsearch

假设你想将日志发送到 Elasticsearch，可以配置如下：

```plaintext
[OUTPUT]
    Name         es
    Match        *
    Host         localhost
    Port         9200
    Index        fluent-bit
    Type         log
```

### 7. 常见问题

- **Fluent Bit 不启动**:
  - 检查配置文件是否有语法错误。
  - 确保所需插件已安装。
  - 查看日志文件以获取更多信息。

- **日志数据不完整**:
  - 检查输入插件的配置是否正确。
  - 确保日志文件路径和权限设置正确。

### 8. 更多资源

- **官方文档**: [Fluent Bit 官方文档](https://docs.fluentbit.io/manual/)
- **GitHub 仓库**: [Fluent Bit GitHub 仓库](https://github.com/fluent/fluent-bit)

希望这些信息对你有所帮助！如果有更多具体问题，欢迎继续提问。

```

参考文档：
https://docs.fluentbit.io/manual