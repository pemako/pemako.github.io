---
date: '2025-05-14T19:26:36+08:00'
draft: false
title: 'MCP Introduction'
description: "Model Context Protocol（MCP）模型上下文协议"
summary: ""
tags: ["mcp", "llm"]
categories: ["llm"]
---

📡 MCP 协议简明说明文档

## 什么是 MCP 协议？

**MCP（Message Calling Protocol）是一种用于“大模型调用工具”的通信协议标准。**

它的目标是解决这个问题：

> 🧠 “模型说要调用工具 A 干点事，那我们怎么告诉它工具叫啥、怎么传参、怎么返回结果呢？”

---

## MCP 协议规定了什么？（共 4 点）

### 1. 工具定义格式

使用 JSON Schema 定义工具的名称、描述和参数：

```json
{
  "name": "get_weather",
  "description": "获取城市天气",
  "parameters": {
    "type": "object",
    "properties": {
      "city": { "type": "string", "description": "城市名" }
    },
    "required": ["city"]
  }
}
```

---

### 2. 调用请求格式

遵循 JSON-RPC 格式：

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "city": "北京"
    }
  }
}
```

---

### 3. 返回结果格式

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "北京今天晴，最高25度。"
      }
    ]
  }
}
```

支持返回多种类型的数据（如文本、图片、文件等）。

---

### 4. 多轮交互 & 中间件机制

- 支持多轮对话中的函数调用
- MCP Server 可实现日志、权限、缓存、调度等中间件机制

---

## MCP 协议需要客户端和服务端做什么？

### 🖥️ 服务端（MCP Server）职责

| 功能               | 说明                                 |
| ------------------ | ------------------------------------ |
| 接收 JSON-RPC 请求 | 支持 HTTP / WebSocket / stdio 等方式 |
| 查找并执行工具逻辑 | 按名称 `name` 执行对应函数或脚本     |
| 返回标准格式结果   | 输出 `result.content`，统一格式      |

返回示例：

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "用户123的信息是：张三，男，30岁"
      }
    ]
  }
}
```

---

### 🤖 客户端（通常是大模型/代理）职责

| 功能                     | 说明                                 |
| ------------------------ | ------------------------------------ |
| 注册工具定义             | 向模型注册工具（包括 JSON Schema）   |
| 监听模型的 Function Call | 捕捉模型提出的调用请求               |
| 构造 JSON-RPC 请求       | 转换为 MCP 格式请求发送给 MCP Server |
| 处理返回内容             | 将结果转为模型能理解的结构或继续对话 |

---

## 附加功能建议（强烈推荐）

| 功能            | 建议位置        | 说明                     |
| --------------- | --------------- | ------------------------ |
| 工具注册接口    | 服务端          | 例如 `tools/list`        |
| 权限与多租户    | 服务端          | 控制不同用户访问不同工具 |
| 参数校验        | 服务端 & 客户端 | 严格验证参数格式         |
| 日志记录        | 服务端          | 调用链追踪、调试         |
| 流式输出（SSE） | 服务端          | 实时返回内容             |

---

## ✅ 总结一句话

> **MCP 是为“大模型调用外部工具”定的一套说话方式，它规定了工具怎么定义、怎么调用、怎么返回，帮你把大模型和实际功能连接起来，像调用 API 一样干活。**


## 资源记录

- [modelcontextprotocol.io](https://modelcontextprotocol.io/docs/concepts/architecture)
- [mcpservers.org](https://mcpservers.org/)
- [glama.ai/mcp/clients](https://glama.ai/mcp/clients)
- [mcpmarket.cn](https://mcpmarket.cn/)
- [mcp servers](https://github.com/modelcontextprotocol/servers)
- [github awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)
- [github awesome-mcp-clients](https://github.com/punkpeye/awesome-mcp-clients)

## 相关文章

- [Anthropic](https://www.anthropic.com/news/model-context-protocol)
- [知乎 MCP](https://zhuanlan.zhihu.com/p/29001189476)

## 相关类库

- [mcp-go](https://github.com/mark3labs/mcp-go)
- [inspector](https://github.com/modelcontextprotocol/inspector)
