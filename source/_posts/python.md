---
title: python
date: 2026-04-12 12:58:10
tags: 
- python
categories: 
    - Ai Agent
---

"精通Python，具备扎实的软件工程基础和编码规范"，我帮你准备面试问题，覆盖**Python进阶、工程实践、编码规范**三个层次，用大白话讲清楚。

---

## 一、Python 进阶特性

### Q1: Python的GIL是什么？怎么绕过它做并行？

**大白话答：**
> GIL = Global Interpreter Lock，全局解释器锁。Python多线程**同一时刻只有一个线程执行Python字节码**，多核CPU用不满。

**绕过方案：**

| 方案 | 适用场景 | 代码示例 |
|-----|---------|---------|
| **多进程** | CPU密集型（计算） | `multiprocessing.Pool` |
| **C扩展** | 关键代码用C/C++写 | `numpy`底层就是C |
| **异步IO** | IO密集型（网络/文件） | `asyncio` |
| **其他解释器** | 彻底绕过 | `PyPy`、`Jython` |

**RAG项目实例：**
```python
# 坏：多线程处理文档（CPU密集型，GIL限制）
import threading
def process_docs(docs):
    threads = [threading.Thread(target=embed, args=(d,)) for d in docs]
    # 实际上还是单核跑

# 好：多进程处理文档（用满多核）
from multiprocessing import Pool
def process_docs(docs, n_workers=4):
    with Pool(n_workers) as p:
        return p.map(embed_document, docs)

# 更好：异步处理网络请求（IO密集型）
import aiohttp
async def fetch_urls(urls):
    async with aiohttp.ClientSession() as session:
        tasks = [session.get(url) for url in urls]
        return await asyncio.gather(*tasks)
```

---

### Q2: 装饰器是什么？在RAG项目里怎么用？

**大白话答：**
> 装饰器 = **不改原函数代码，给它加功能**。像给手机套壳，不拆机就能防摔。

**RAG项目实例：**

```python
import time
from functools import wraps

# 1. 性能监控装饰器
def monitor_latency(func):
    @wraps(func)  # 保留原函数信息
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        latency = time.time() - start
        
        # 发送到Prometheus
        REQUEST_LATENCY.observe(latency)
        print(f"{func.__name__} took {latency:.3f}s")
        return result
    return wrapper

# 使用
@monitor_latency
def retrieve_documents(query: str):
    # 向量检索逻辑
    return milvus.search(query)

# 2. 缓存装饰器（避免重复Embedding）
from functools import lru_cache

@lru_cache(maxsize=1000)
def get_embedding(text: str):
    #  expensive operation
    return openai_embed(text)

# 3. 重试装饰器（API失败自动重试）
def retry(max_attempts=3):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for i in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if i == max_attempts - 1:
                        raise
                    time.sleep(2 ** i)  # 指数退避
            return wrapper
        return decorator

@retry(max_attempts=3)
def call_llm_api(prompt: str):
    return openai.chat.completions.create(...)
```

---

### Q3: 生成器（Generator）和列表推导式什么区别？什么时候用？

**大白话答：**

| | 列表推导式 | 生成器 |
|--|-----------|--------|
| 内存 | 全存内存 `[...]` | 惰性计算，用一次产一次 |
| 速度 | 立即生成， upfront 慢 | 边用边生成，启动快 |
| 遍历次数 | 无限次 | 只能遍历一次 |
| 适用 | 数据量小，需随机访问 | 数据量大，流式处理 |

**RAG项目实例：**
```python
# 坏：100万文档全读内存，爆掉
def load_all_docs():
    return [process(line) for line in open("million_docs.json")]  # 内存爆炸

# 好：流式处理，一次只读一篇
def load_docs_stream():
    for line in open("million_docs.json"):
        yield process(line)  # 生成器，省内存

# 使用
for doc in load_docs_stream():  # 内存只存当前一篇
    embed_and_index(doc)

# 更高级：生成器管道
def tokenize(docs):
    for doc in docs:
        yield doc.split()

def embed(tokens):
    for tok in tokens:
        yield model.encode(tok)

# 管道串联，全程流式
pipeline = embed(tokenize(load_docs_stream()))
```

---

### Q4: Python的鸭子类型是什么？怎么用？

**大白话答：**
> "如果它走起路来像鸭子，叫起来像鸭子，那它就是鸭子。"——**不看重类型，看重行为**。

**RAG项目实例：**
```python
# 不 care 是Milvus还是FAISS，能search就行
class VectorDB:
    def search(self, query: list, top_k: int) -> list:
        raise NotImplementedError

class MilvusDB(VectorDB):
    def search(self, query, top_k):
        return milvus_client.search(query, top_k)

class FAISSDB(VectorDB):
    def search(self, query, top_k):
        return faiss_index.search(np.array([query]), top_k)

# 使用：鸭子类型，不判断具体类型
def retrieve(db: VectorDB, query: str, top_k: int = 10):
    return db.search(get_embedding(query), top_k)

# 随时切换底层，业务代码不动
db = MilvusDB() if use_cloud else FAISSDB()
results = retrieve(db, "什么是RAG")
```

---

## 二、软件工程基础

### Q5: 怎么设计一个可扩展的RAG系统架构？

**大白话答：**
> **分层 + 抽象 + 插件化**，新功能加模块，不改老代码。

**架构图：**
```
┌─────────────────────────────────────┐
│           API层 (FastAPI)          │  ← 统一入口，路由分发
├─────────────────────────────────────┤
│         编排层 (LangGraph)          │  ← Agent状态机，可插拔节点
│  ┌─────────┐ ┌─────────┐ ┌───────┐ │
│  │ Planner │ │Retrieve │ │Generate│ │  ← 每个节点独立实现
│  └─────────┘ └─────────┘ └───────┘ │
├─────────────────────────────────────┤
│         服务抽象层                   │  ← 鸭子类型，底层可换
│  ┌─────────┐ ┌─────────┐ ┌───────┐ │
│  │VectorDB │ │  LLM    │ │Embed  │ │  ← 接口统一，实现多样
│  │(Milvus/ │ │(OpenAI/ │ │(OpenAI│ │
│  │ FAISS)  │ │DeepSeek)│ │/Local)│ │
│  └─────────┘ └─────────┘ └───────┘ │
├─────────────────────────────────────┤
│         监控层 (Prometheus)          │  ← 埋点，可观测
└─────────────────────────────────────┘
```

**关键代码：**
```python
# 抽象接口
from abc import ABC, abstractmethod

class BaseRetriever(ABC):
    @abstractmethod
    def retrieve(self, query: str, top_k: int) -> list[Document]:
        pass

class MilvusRetriever(BaseRetriever):
    def retrieve(self, query, top_k):
        # 具体实现
        pass

class ElasticsearchRetriever(BaseRetriever):
    def retrieve(self, query, top_k):
        # 另一实现
        pass

# 工厂模式，配置驱动
def get_retriever(config: dict) -> BaseRetriever:
    retrievers = {
        'milvus': MilvusRetriever,
        'es': ElasticsearchRetriever,
        'hybrid': HybridRetriever  # 组合多个
    }
    return retrievers[config['type']](**config['params'])

# 使用
retriever = get_retriever({'type': 'milvus', 'params': {...}})
docs = retriever.retrieve("query", top_k=10)
```

---

### Q6: 怎么处理RAG系统的配置管理？

**大白话答：**
> 配置和代码分离，环境不同配置不同，敏感信息不泄露。

**方案对比：**

| 方式 | 缺点 | 推荐度 |
|-----|------|--------|
| 硬编码 | 改配置要改代码，不安全 | ❌ |
| 环境变量 | 简单，但难管理复杂配置 | ⭐⭐ |
| **YAML/JSON文件** | 清晰，支持分层 | ⭐⭐⭐ |
| **Pydantic Settings** | 类型安全，自动验证 | ⭐⭐⭐⭐⭐ |

**推荐实现（Pydantic）：**
```python
from pydantic import Field, validator
from pydantic_settings import BaseSettings

class RAGConfig(BaseSettings):
    # 向量数据库
    vector_db_type: str = Field(default="milvus", env="VECTOR_DB_TYPE")
    milvus_host: str = Field(default="localhost", env="MILVUS_HOST")
    milvus_port: int = Field(default=19530, env="MILVUS_PORT")
    
    # LLM
    llm_provider: str = Field(default="openai", env="LLM_PROVIDER")
    openai_api_key: str = Field(..., env="OPENAI_API_KEY")  # 必填，敏感
    
    # 检索参数
    default_top_k: int = 10
    rerank_enabled: bool = True
    
    @validator('default_top_k')
    def validate_top_k(cls, v):
        if not 1 <= v <= 100:
            raise ValueError('top_k must be 1-100')
        return v
    
    class Config:
        env_file = ".env"  # 从.env文件加载

# 使用
config = RAGConfig()  # 自动读取环境变量和.env文件
print(config.milvus_host)  # 类型安全，IDE有提示

# .env文件（不提交Git）
# OPENAI_API_KEY=sk-xxx
# VECTOR_DB_TYPE=milvus
```

---

### Q7: 怎么做RAG系统的错误处理和容错？

**大白话答：**
> **分层捕获，优雅降级，关键路径不能挂**。

**策略矩阵：**

| 组件 | 失败场景 | 处理策略 | 代码示例 |
|-----|---------|---------|---------|
| 向量检索 | Milvus超时 | 降级到FAISS本地索引 | `try...except + fallback` |
| LLM生成 | OpenAI限流 | 切换备用模型（DeepSeek） | 模型路由 |
| Embedding | 模型加载失败 | 用上次缓存的向量 | 缓存兜底 |
| Agent规划 | 死循环 | 强制退出，返回提示 | 超时控制 |

**代码实现：**
```python
from tenacity import retry, stop_after_attempt, wait_exponential
import logging

logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self):
        self.primary_llm = OpenAIClient()
        self.fallback_llm = DeepSeekClient()
        self.local_cache = LRUCache(maxsize=10000)
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=True
    )
    def generate_with_fallback(self, prompt: str) -> str:
        """主模型失败，自动切备用模型"""
        try:
            return self.primary_llm.generate(prompt)
        except Exception as e:
            logger.warning(f"Primary LLM failed: {e}, switching to fallback")
            return self.fallback_llm.generate(prompt)
    
    def retrieve_with_cache(self, query: str) -> list:
        """缓存兜底，Embedding服务挂了也能返回"""
        cache_key = hash(query)
        
        if cache_key in self.local_cache:
            return self.local_cache[cache_key]
        
        try:
            results = self.vector_db.search(query)
            self.local_cache[cache_key] = results
            return results
        except Exception as e:
            logger.error(f"Vector DB failed: {e}")
            # 降级：返回空或历史热门结果
            return self.get_popular_documents()
    
    def agent_with_timeout(self, query: str, max_steps: int = 5) -> str:
        """Agent强制退出，防止死循环"""
        for step in range(max_steps):
            action = self.planner.next_step(query)
            
            if action.is_complete:
                return action.result
            
            if step == max_steps - 1:
                logger.warning("Agent max steps reached, forcing exit")
                return "抱歉，这个问题我需要更多时间来处理，请稍后重试"
        
        query = action.updated_query
```

---

## 三、编码规范

### Q8: 你的Python代码规范是什么？怎么保证团队一致？

**大白话答：**
> **自动化工具强制规范，Code Review抓设计，文档降低门槛**。

**工具链：**

```bash
# 1. 代码格式化（Black，统一风格）
black src/ tests/

# 2. 代码检查（Ruff，快，替代Flake8+isort）
ruff check src/ --fix

# 3. 类型检查（mypy，减少运行时错误）
mypy src/ --strict

# 4. 测试（pytest，覆盖率>80%）
pytest tests/ --cov=src --cov-report=html

# 5. Git Hooks（提交前自动检查）
pre-commit install
```

**pre-commit配置：**
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.1.0
    hooks:
      - id: black
  
  - repo: https://github.com/charliermarsh/ruff-pre-commit
    rev: v0.0.267
    hooks:
      - id: ruff
  
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.3.0
    hooks:
      - id: mypy
```

**项目结构规范：**
```
rag_project/
├── src/
│   ├── __init__.py
│   ├── api/              # FastAPI路由
│   │   ├── __init__.py
│   │   └── endpoints.py
│   ├── core/             # 核心业务逻辑
│   │   ├── retriever.py
│   │   ├── generator.py
│   │   └── agent.py
│   ├── models/           # Pydantic模型
│   │   └── schemas.py
│   ├── services/         # 外部服务封装
│   │   ├── milvus_client.py
│   │   └── llm_client.py
│   └── utils/            # 工具函数
│       └── decorators.py
├── tests/
│   ├── unit/             # 单元测试
│   ├── integration/      # 集成测试
│   └── conftest.py       # pytest fixtures
├── configs/              # 配置文件
├── scripts/              # 运维脚本
├── docs/                 # 文档
├── pyproject.toml        # 项目配置（替代setup.py）
├── .pre-commit-config.yaml
└── Makefile              # 统一命令入口
```

**Makefile统一入口：**
```makefile
.PHONY: install format lint test check

install:
	pip install -e ".[dev]"

format:
	black src/ tests/
	ruff check src/ tests/ --fix

lint:
	ruff check src/ tests/
	mypy src/ --strict

test:
	pytest tests/ -v --cov=src --cov-report=term-missing

check: format lint test  # CI流水线执行
```

---

### Q9: 怎么写RAG系统的单元测试？

**大白话答：**
> **测核心逻辑，Mock外部依赖，数据驱动测试**。

**关键测试策略：**

```python
# tests/unit/test_retriever.py
import pytest
from unittest.mock import Mock, patch

def test_milvus_retriever_success():
    """测试检索成功"""
    # Mock Milvus客户端
    mock_client = Mock()
    mock_client.search.return_value = [
        {"id": 1, "distance": 0.9, "text": "相关文档1"},
        {"id": 2, "distance": 0.8, "text": "相关文档2"},
    ]
    
    retriever = MilvusRetriever(client=mock_client)
    results = retriever.retrieve("测试查询", top_k=2)
    
    assert len(results) == 2
    assert results[0].score == 0.9
    mock_client.search.assert_called_once()

def test_retriever_with_fallback():
    """测试Milvus失败降级到FAISS"""
    with patch('src.services.milvus_client.MilvusClient') as mock_milvus:
        mock_milvus.return_value.search.side_effect = Exception("连接超时")
        
        retriever = HybridRetriever(
            primary=MilvusRetriever(mock_milvus.return_value),
            fallback=FAISSRetriever()  # 真实或Mock
        )
        
        results = retriever.retrieve("测试查询")
        assert len(results) > 0  # 降级成功，有结果

# tests/unit/test_agent.py
def test_planner_intent_recognition():
    """测试意图识别"""
    planner = PlannerAgent()
    
    test_cases = [
        ("2024年营收多少", "financial_query"),
        ("怎么请假", "hr_policy"),
        ("讲个笑话", "chitchat"),
    ]
    
    for query, expected_intent in test_cases:
        intent = planner.recognize_intent(query)
        assert intent == expected_intent, f"Failed for: {query}"

# tests/integration/test_api.py
def test_search_endpoint(client):
    """测试端到端API"""
    response = client.post("/search", json={"query": "什么是RAG"})
    
    assert response.status_code == 200
    assert "answer" in response.json()
    assert len(response.json()["sources"]) <= 10
```

---

## 四、面试金句

> "我的Python工程实践分三层：**语言层**用生成器省内存、装饰器做横切、鸭子类型做抽象；**架构层**分层设计+配置驱动+工厂模式，向量数据库和LLM随时可换；**规范层**Black+Ruff+mypy+pre-commit强制代码质量，pytest分层测试保稳定性。RAG系统里，**流式处理百万文档、多进程并行Embedding、自动降级容错**，都是这些基础能力的体现。"

---

