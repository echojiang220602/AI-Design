---
创建日期: 2026-05-15
AI备注: Hermes Agent 多 Profile 隔离配置指南。核心命令：profile create / profile use / gateway start/restart。配置三要素：.env（API Key）、config.yaml（模型+平台开关）、平台凭证。实现多个 Agent 独立运行、互不覆盖。
---

# Windows 配置多个 Hermes Agent

## 核心概念

**Profile 隔离**：每个 Agent 独立 Profile，互不影响

## 目录结构

```
~/.hermes/profiles/{name}/
├── .env           # API Key + 凭证
├── config.yaml    # 模型 + 平台配置
├── skills/        # 技能
├── tools/         # 工具
└── memories/      # 记忆
```

## 核心命令

| 命令 | 作用 |
|------|------|
| `hermes profile create {name}` | 创建新 Profile |
| `hermes profile use {name}` | 切换 Profile |
| `hermes -p {name} gateway start` | 启动 |
| `hermes -p {name} gateway restart` | 重启 |
| `hermes profile list` | 查看状态 |

## 快速配置

### 1. 写 API Key

```bash
echo 'MINIMAX_API_KEY=sk-cp-xxxx' >> ~/.hermes/profiles/{name}/.env
echo 'MINIMAX_BASE_URL=https://api.minimaxi.com/v1' >> ~/.hermes/profiles/{name}/.env
```

### 2. 改 config.yaml

```bash
nano ~/.hermes/profiles/{name}/config.yaml
```

```yaml
model: minimax/MiniMax-M2.7
provider: minimax
base_url: https://api.minimaxi.com/v1
```

搜索 `enabled: false` → 改为 `enabled: true`

### 3. 重启

```bash
hermes -p {name} gateway restart
```

## 一键命令版

```bash
echo 'MINIMAX_API_KEY=sk-cp-xxxx' >> ~/.hermes/profiles/{name}/.env
echo 'MINIMAX_BASE_URL=https://api.minimaxi.com/v1' >> ~/.hermes/profiles/{name}/.env
sed -i 's/enabled: false/enabled: true/' ~/.hermes/profiles/{name}/config.yaml
hermes -p {name} gateway restart
```

## 飞书绑定

```bash
hermes -p {name} gateway setup
```

填写：App ID、App Secret、Domain=feishu、Connection Mode=websocket

## 常见问题

| 问题 | 解决 |
|------|------|
| 平台无响应 | 检查 `platforms.enabled: true` |
| AI 回复异常 | 检查 API Key 变量名是否正确 |
| 配置被覆盖 | 每个 Agent 用独立 Profile |

## 架构

```
Hermes（电脑）
├── Profile: echo      → Hermes-Echo  ✅
└── Profile: design    → Hermes-Design ✅
```