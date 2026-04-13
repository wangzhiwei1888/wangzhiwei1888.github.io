---
title: Autogen
date: 2026-04-13 07:53:30
tags:
---

根据最新时间，我为你详细对比 **AutoGen vs LangGraph**，帮你面试时清晰表达技术选型思路。

---

## 一、核心定位对比

| 维度 | **AutoGen** | **LangGraph** |
|-----|------------|---------------|
| **设计哲学** | 对话驱动，Agent 像人一样聊天协作 | 状态机驱动，流程像 DAG 一样严谨执行 |
| **控制粒度** | 较灵活，框架决定发言顺序 | **强可控**，开发者明确定义每一步流转 |
| **交互模式** | 自然语言对话，多轮协商 | 结构化状态（State），节点间数据传递 |
| **适用场景** | 开放探索、创意任务、代码生成 | **企业流程、审批链路、合规要求** |
| **学习曲线** | 低，几行代码启动多 Agent 对话 | 中，需理解状态图、节点、边、条件分支 |
| **生态归属** | 微软主推，Azure 集成深 | LangChain 官方，社区最大 |

---

## 二、架构差异图解

### AutoGen：网状对话
```
UserProxy → Planner → Coder → Reviewer
     ↑        ↓         ↓        ↓
     └────────┴─────────┴────────┘
     
框架决定：谁说话、说几句、什么时候停
```

### LangGraph：DAG 状态机
```
          ┌─────────┐
          │  Start  │
          └────┬────┘
               ▼
          ┌─────────┐
          │ Planner │──┐
          └────┬────┘  │
               ▼       │
          ┌─────────┐  │ (需要检索)
          │ Retrieve│◄─┘
          └────┬────┘
               ▼
          ┌─────────┐
          │ Generate│
          └────┬────┘
               ▼
          ┌─────────┐
          │  End    │
          └─────────┘

你定义：每一步去哪、条件分支、循环、并行
```

---

## 三、代码风格对比

### 相同任务：写 RAG API

**AutoGen 版本（对话式）**
```python
from autogen import AssistantAgent, UserProxyAgent, GroupChat

# 创建专家 Agent
planner = AssistantAgent("planner", system_message="拆解RAG需求")
coder = AssistantAgent("coder", system_message="写FastAPI代码")
reviewer = AssistantAgent("reviewer", system_message="审查代码")

# 群聊，自动协调
groupchat = GroupChat(agents=[planner, coder, reviewer], messages=[], max_round=10)
manager = GroupChatManager(groupchat=groupchat)

# 启动：一句话需求，Agent 自己讨论实现
user_proxy.initiate_chat(manager, message="写个RAG API")
# 结果：对话历史，代码在 work_dir 里
```

**LangGraph 版本（你的简历，状态机式）**
```python
from langgraph.graph import StateGraph, END

# 明确定义状态
class RAGState(TypedDict):
    query: str
    plan: dict
    documents: list
    answer: str

# 明确定义每个节点做什么
def plan_step(state: RAGState):
    state["plan"] = planner_agent(state["query"])
    return state

def retrieve_step(state: RAGState):
    state["documents"] = vector_db.search(state["plan"]["keywords"])
    return state

def generate_step(state: RAGState):
    state["answer"] = llm.generate(state["documents"])
    return state

# 明确定义流转关系
workflow = StateGraph(RAGState)
workflow.add_node("plan", plan_step)
workflow.add_node("retrieve", retrieve_step)
workflow.add_node("generate", generate_step)

workflow.set_entry_point("plan")
workflow.add_edge("plan", "retrieve")
workflow.add_edge("retrieve", "generate")
workflow.add_edge("generate", END)

# 编译执行
app = workflow.compile()
result = app.invoke({"query": "什么是RAG"})
# 结果：结构化状态，每一步可追溯
```

---

## 四、关键能力对比表

| 能力 | AutoGen | LangGraph | 场景建议 |
|-----|---------|-----------|---------|
| **多 Agent 协商** | ⭐⭐⭐⭐⭐ 原生支持 | ⭐⭐⭐ 需自己实现 | 开放讨论用 AutoGen |
| **流程可控性** | ⭐⭐ 框架决定 | ⭐⭐⭐⭐⭐ 开发者决定 | 企业合规用 LangGraph |
| **循环/条件分支** | ⭐⭐ 对话隐式 | ⭐⭐⭐⭐⭐ 显式定义 | 复杂逻辑用 LangGraph |
| **并行执行** | ⭐⭐ 难控制 | ⭐⭐⭐⭐ 支持 Map-Reduce | 批量处理用 LangGraph |
| **人机协作** | ⭐⭐⭐⭐⭐ 灵活介入 | ⭐⭐⭐ 需节点埋点 | 需人类审批用 AutoGen |
| **调试可追溯** | ⭐⭐ 看对话历史 | ⭐⭐⭐⭐⭐ 状态快照 | 生产排障用 LangGraph |
| **代码生成执行** | ⭐⭐⭐⭐⭐ 内置 Docker | ⭐⭐ 需自己集成 | AI 写代码用 AutoGen |
| **持久化/断点续传** | ⭐⭐ 需扩展 | ⭐⭐⭐⭐⭐ 内置 Checkpoint | 长流程用 LangGraph |

---

## 五、企业级场景选型决策树

```
开始
 │
 ├─ 任务是否开放探索型？（写代码、研究、创意）
 │   └─ 是 → AutoGen（快速原型，Agent 自主协商）
 │
 └─ 否 → 任务是否有严格流程？（审批、合规、固定步骤）
     ├─ 是 → LangGraph（状态机可控，审计可追溯）
     │
     └─ 否 → 两者混合
         ├─ LangGraph 管主流程（严格步骤）
         └─ AutoGen 做子任务（某节点内多 Agent 讨论）
```

---

## 六、混合架构设计（面试亮点）

> "我的企业级 Agent 平台用 **LangGraph 做主框架**，确保流程合规可追溯。但在 **'代码生成'节点**内，嵌入 **AutoGen 的 Code-Executor**，让多个 Coder Agent 讨论优化，最后返回结果到主流程。"

```python
from langgraph.graph import StateGraph
from autogen import AssistantAgent, UserProxyAgent

# LangGraph 主流程（严格可控）
def code_generation_node(state: RAGState):
    """这个节点内部用 AutoGen 多 Agent 协作"""
    
    # AutoGen 子流程
    coder = AssistantAgent("coder", system_message="写Python代码")
    reviewer = AssistantAgent("reviewer", system_message="审查代码")
    executor = UserProxyAgent("executor", code_execution_config={"use_docker": True})
    
    groupchat = GroupChat(agents=[coder, reviewer, executor], ...)
    manager = GroupChatManager(groupchat=groupchat)
    
    # 执行 AutoGen 对话
    executor.initiate_chat(
        manager, 
        message=f"写代码实现：{state['requirements']}"
    )
    
    # 提取最终代码，返回 LangGraph 状态
    state["generated_code"] = extract_final_code(executor.chat_messages)
    return state

# LangGraph 主流程
workflow = StateGraph(RAGState)
workflow.add_node("plan", plan_step)
workflow.add_node("code_gen", code_generation_node)  # ← 内部是 AutoGen
workflow.add_node("test", test_step)
workflow.add_edge("plan", "code_gen")
workflow.add_edge("code_gen", "test")
```

---

## 七、面试金句

| 场景 | 金句 |
|-----|------|
| 技术选型 | "LangGraph 做**流程骨架**，AutoGen 做**灵活血肉**，根据任务特性分层选择。" |
| 企业优势 | "企业级场景选 LangGraph，因为**状态机比对话更易审计、更易回滚、更易测试**。" |
| 开放任务 | "探索性任务如代码生成，AutoGen 的**多 Agent 协商 + 真执行**更高效。" |
| 混合架构 | "我的设计是**'外刚内柔'**：外层 LangGraph 保证合规，关键节点内嵌 AutoGen 提升智能。" |

---

## 八、一句话对比

| | AutoGen | LangGraph |
|--|---------|-----------|
| **像什么** | 微信群聊，大家讨论出结果 | 工作流引擎，每一步按图纸执行 |
| **适合** | 创意、探索、代码生成 | **企业流程、合规、生产系统** |
| **你的项目** | 了解即可 | **深入精通，简历重点** |
| **两者关系** | 补充工具 | **主力框架** |

---

