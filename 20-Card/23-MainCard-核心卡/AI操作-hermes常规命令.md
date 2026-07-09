---
创建日期: 2026-05-15
AI备注: Hermes Agent 常规命令速查表。核心操作：对话、诊断、Profile 管理、Gateway 控制。飞书绑定配置：App ID + App Secret + WebSocket。Dashboard 启动命令。关键词：hermes chat / doctor / profile / gateway / setup。
---

# AI操作-hermes常规命令

## 基础命令

| 命令 | 作用 |
|------|------|
| `hermes chat` | 交互式对话（直接运行） |
| `hermes chat -m "..."` | 单次提问 |
| `hermes doctor` | 检查系统状态 |
| `hermes / exit` | 进入/退出交互模式 |

## Profile 管理

| 命令 | 作用 |
|------|------|
| `hermes profile create {name}` | 创建新 Profile |
| `hermes profile use {name}` | 切换 Profile |
| `hermes profile list` | 查看所有 Profile 状态 |

## Gateway 控制

| 命令                                 | 作用                        |
| ---------------------------------- | ------------------------- |
| `hermes -p {name} gateway start`   | 启动 Gateway                |
| `hermes -p {name} gateway restart` | 重启 Gateway                |
| `hermes -p {name} gateway setup`   | 配置平台（飞书/Discord/Telegram） |

## 配置修改

| 命令                           | 作用         |
| ---------------------------- | ---------- |
| `nano ~/.hermes/config.yaml` | 修改模型配置     |
| `nano ~/.hermes/.env`        | 修改 API Key |

minimax_api_key: sk-cp-R06bRcO4Hu731FuvOi8wumE4jmdkXLA9XcURi4OEcyJY_ghnmMJlmz_HbTAMc-eHpq094Go1nl0B3rY5caNaTPLrc3AZIMvGbLKYz31AMS2q9vO42r_MZE4
## 飞书配置参数

| 字段 | 值 |
|------|-----|
| App ID | `cli_aa8e285239f89bc4` |
| App Secret | `HEJ7cYLSBQuG3StgnGNTRbIcsbFKPpPp` |
| Domain | `feishu` |
| Connection Mode | `websocket` |

## Dashboard 启动

```bash
cd /home/echo/.hermes/hermes-agent
source venv/bin/activate
hermes dashboard --host 0.0.0.0 --no-open --insecure
```

## 架构图

```
┌─────────────────────────────────┐
│         Windows 11               │
│  ┌──────────┐  ┌─────────────┐  │
│  │ 飞书 App │◄─┤  Obsidian   │  │
│  └────┬─────┘  └──────▲──────┘  │
│       │                │        │
│  ┌────▼────────────────┴──────┐  │
│  │     WSL2 (Ubuntu 22.04)   │  │
│  │  ┌──────┐ ┌───────┐        │  │
│  │  │Hermes│◄│Gateway│       │  │
│  │  │Agent │ │WS连接 │       │  │
│  │  └──┬───┘ └───┬───┘        │  │
│  │     │         │             │  │
│  │     ▼         ▼             │  │
│  │  MiniMax   飞书服务器       │  │
│  └────────────────────────────┘  │
└─────────────────────────────────┘
```

## feishu-to-obsidian 导出

```bash
chmod +x ~/feishu-to-obsidian.sh && ~/feishu-to-obsidian.sh
```

路径对应：
| Windows | WSL |
|---------|-----|
| `F:\...\raw\feishu` | `/mnt/f/.../raw/feishu` |