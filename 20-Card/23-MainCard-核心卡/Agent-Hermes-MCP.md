---
AI 备注: Hermes Agent 内置 MCP 客户端文档，连接 MCP 服务器、发现工具、注册为 Hermes 工具
created: 2026-06-03
tags:
  - AI数字员工
  - MCP
  - Hermes
---

# Native MCP Client

> MCP 客户端：连接服务器，注册工具（stdio/HTTP）。

```yaml
name: native-mcp
description: "MCP client: connect servers, register tools (stdio/HTTP)."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [MCP, Tools, Integrations]
    related_skills: [mcporter]
```

---

## 概述

Hermes Agent 内置了 MCP 客户端，在启动时连接 MCP 服务器，发现其工具，并使它们作为一等工具（first-class tools）可直接调用。无需桥接 CLI——来自 MCP 服务器的工具会与内置工具（如 `terminal`、`read_file` 等）一起出现。

## 使用场景

在以下情况使用 MCP 客户端：
- 连接 MCP 服务器并从 Hermes Agent 内部使用其工具
- 通过 MCP 添加外部能力（文件系统访问、GitHub、数据库、API）
- 运行本地基于 stdio 的 MCP 服务器（npx、uvx 或任意命令）
- 连接到远程 HTTP/StreamableHTTP MCP 服务器
- 让 MCP 工具自动发现并在每次对话中可用

对于临时的一次性 MCP 工具调用，请参阅 `mcporter` skill。

## 前置条件

- **mcp Python 包** — 可选依赖；用 `pip install mcp` 安装。如未安装，MCP 支持会被静默禁用。
- **Node.js** — 用于 `npx` 类 MCP 服务器（大多数社区服务器）
- **uv** — 用于 `uvx` 类 MCP 服务器（Python 服务器）

## 快速开始

在 `~/.hermes/config.yaml` 的 `mcp_servers` 下添加 MCP 服务器：

```yaml
mcp_servers:
  time:
    command: "uvx"
    args: ["mcp-server-time"]
```

重启 Hermes Agent。启动时它会：
1. 连接到服务器
2. 发现可用工具
3. 在工具前缀 `mcp_time_*` 下注册它们
4. 注入到所有平台工具集

## 配置参考

每个 `mcp_servers` 下的条目是服务器名映射到其配置。有两种传输类型：**stdio**（基于命令）和 **HTTP**（基于 URL）。

### Stdio 传输

```yaml
mcp_servers:
  server_name:
    command: "npx"             # (必填) 要运行的可执行文件
    args: ["-y", "pkg-name"]   # (可选) 命令参数，默认: []
    env:                        # (可选) 子进程的环境变量
      SOME_API_KEY: "value"
    timeout: 120                # (可选) 每次工具调用的超时秒数
    connect_timeout: 60          # (可选) 初始连接超时秒数
```

### HTTP 传输

```yaml
mcp_servers:
  server_name:
    url: "https://my-server.example.com/mcp"  # (必填) 服务器 URL
    headers:                                    # (可选) 每个请求的 HTTP 头
      Authorization: "Bearer sk-..."
    timeout: 180               # (可选) 每次工具调用的超时秒数
```

## 工具命名约定

MCP 工具以命名模式注册：

```
mcp_{server_name}_{tool_name}
```

名称中的连字符和点替换为下划线以兼容 LLM API。

示例：
- 服务器 `filesystem`，工具 `read_file` → `mcp_filesystem_read_file`
- 服务器 `github`，工具 `list-issues` → `mcp_github_list_issues`

## 安全

### 环境变量过滤

对于 stdio 服务器，Hermes 不会将完整 shell 环境传递给 MCP 子进程。只有安全的基础变量被继承：

- `PATH`、`HOME`、`USER`、`LANG`、`LC_ALL`、`TERM`、`SHELL`、`TMPDIR`
- 任何 `XDG_*` 变量

所有其他环境变量（API 密钥、令牌、密钥）都会被排除，除非你通过 `env` 配置显式添加。

## 示例

### 时间服务器

```yaml
mcp_servers:
  time:
    command: "uvx"
    args: ["mcp-server-time"]
```

### 文件系统服务器

```yaml
mcp_servers:
  filesystem:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/documents"]
    timeout: 30
```

### GitHub 服务器（带认证）

```yaml
mcp_servers:
  github:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: "ghp_..."
```

### 远程 HTTP 服务器

```yaml
mcp_servers:
  company_api:
    url: "https://mcp.mycompany.com/mcp"
    headers:
      Authorization: "Bearer sk-..."
    timeout: 300
```

## 故障排除

| 问题 | 解决方案 |
|------|---------|
| "MCP SDK not available" | `pip install mcp` |
| "No MCP servers configured" | 检查 `~/.hermes/config.yaml` 中的 `mcp_servers` 配置 |
| "Failed to connect" | 检查命令是否在 PATH 中，增加 `connect_timeout` |
| 工具不出现 | 检查 YAML 缩进，工具名前缀为 `mcp_{server}_{tool}` |

---

**来源**：Hermes Agent 官方文档