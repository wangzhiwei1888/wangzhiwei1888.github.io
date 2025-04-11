---
title: huggingface 上的模型微调后如何在 ollama 中使用
date: 2025-04-11 10:51:39
tags:
---


## 以下是将HuggingFace上的模型微调后在Ollama中使用的方法：

### 1. 微调模型
首先，你需要在HuggingFace上微调一个模型。可以使用HuggingFace的Transformers库来加载预训练模型，然后进行微调。例如：
```python
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, Trainer

model_name = "your_model_name"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# 准备训练数据
train_dataset = ...  # 你的训练数据

# 设置训练参数
training_args = TrainingArguments(
    output_dir="./output",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    save_steps=500,
    logging_dir="./logs",
)

# 创建Trainer并训练模型
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
)
trainer.train()

# 保存微调后的模型
model.save_pretrained("./output/finetuned_model")
tokenizer.save_pretrained("./output/finetuned_model")
```


### 2. 转换模型格式
Ollama支持GGUF格式的模型。你需要将微调后的模型转换为GGUF格式。可以使用llama.cpp工具来完成这个转换：
```bash
# 安装llama.cpp
git clone https://github.com/ggml-org/llama.cpp.git
cd llama.cpp
make

# 转换模型
python convert_hf_to_gguf.py ./output/finetuned_model ./output/finetuned_model.gguf
```


### 3. 导入Ollama
将转换后的GGUF模型文件导入Ollama：
```bash
# 创建Ollama模型
ollama create my_finetuned_model ./output/finetuned_model.gguf

# 运行模型
ollama run my_finetuned_model "生成文本"
```


### 4. 使用Ollama API
你还可以通过Ollama的API来调用微调后的模型：
```bash
# 启动Ollama服务
ollama serve

# 使用HTTP请求调用模型
curl -X POST http://localhost:11434/api/generate -d '{"model": "my_finetuned_model", "prompt": "生成文本"}'
```


### 注意事项
- 确保你的微调模型已经保存为全精度版本。
- 在转换模型格式时，可能需要根据你的硬件环境（如CUDA）进行相应的配置。
- 如果模型较大，转换和导入过程可能需要较长时间。

通过以上步骤，你就可以将HuggingFace上的模型微调后在Ollama中使用了。