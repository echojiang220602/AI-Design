---
created: "2026-07-02"
up: 15-04-00-OpenClaw vs. Hermes Agent.md
relate:
  - 15-04-00-OpenClaw vs. Hermes Agent.md
tags:
  - AI工具
  - OpenClaw
  - Hermes
  - 数字员工
project: AI数字人中台
---

# OpenClaw vs. Hermes Agent 完整对比

> 版本：v1.0
> 日期：2026-07-02
> 依据：OpenClaw workspace 架构分析 + Hermes Agent 源码研究

---

## 一、核心定位对比

| 维度 | OpenClaw | Hermes Agent |
|------|----------|--------------|
| **产品形态** | VS Code 插件 / CLI 工具 | 独立 CLI 程序 |
| **核心场景** | IDE 内 AI 辅助编程 | 终端 AI 任务执行 |
| **交互方式** | 边编码边 AI 协作 | 对话式任务自动化 |
| **技能生态** | SkillHub 市场，技能包可分享 | 本地 skills 文件夹，自建自用 |
| **记忆机制** | workspace/memory/ 分层存储 | ~/.hermes/memories/ 统一管理 |

---

## 二、目录结构对比

### 2.1 OpenClaw workspace 完整结构

```
~/.openclaw/workspace/
├── 配置核心文件
│   ├── identity.md          # Agent 身份定义
│   ├── SOUL.md              # Agent 人格、行为规范
│   ├── USER.md              # 用户偏好、个人信息
│   ├── AGENTS.md            # 工作流程规则
│   ├── .openclaw.json       # 主配置
│   └── .env                 # API密钥
│
├── 核心功能目录
│   ├── memory/               # 记忆库
│   │   ├── MEMORY.md        # 长期经验知识库
│   │   └── YYYY-MM-DD.md    # 每日会话记忆
│   ├── skills/              # 技能包目录
│   │   ├── 每个子目录为独立技能
│   │   └── 内含 SKILL.md、脚本、参考文档
│   ├── logs/                # 执行日志
│   └── hooks/               # 生命周期钩子
│
└── 多工作区隔离
    └── workspace-{profile}/ # 通过目录名区分不同工作区
```

### 2.2 Hermes Agent 完整结构

```
~/.hermes/
├── 配置核心文件（全局）
│   ├── config.yaml          # 主配置，对应 openclaw.json
│   ├── .env                 # API密钥、密钥凭证
│   ├── auth.json            # OAuth/第三方登录凭证
│   └── SOUL.md              # 智能体人设、行为规则（同OpenClaw SOUL.md）
│
├── 核心工作目录（对标 workspace 功能分区）
│   ├── skills/              # 技能库 = OpenClaw workspace技能文件夹
│   │   ├── 每个子目录为独立技能，内含SKILL.md、脚本、参考文档
│   ├── memories/            # 长期记忆库 = OpenClaw memory/
│   │   ├── MEMORY.md        # 全局长期知识库
│   │   └── USER.md          # 用户偏好、个人信息
│   ├── sessions/            # 会话存储，存放对话上下文
│   ├── state.db             # SQLite会话数据库（完整对话历史）
│   ├── logs/                # 运行日志、执行记录
│   ├── hooks/               # 生命周期钩子脚本（启动/关闭/消息回调）
│   ├── cron/                # 定时任务脚本目录
│   ├── plans/               # 任务规划、执行方案缓存
│   └── skins/               # 界面/提示词模板
│
├── profiles/                # 多用户/多实例隔离工作区（多workspace）
│   ├── dev/
│   │   ├── config.yaml
│   │   ├── skills/
│   │   ├── memories/
│   │   ├── sessions/
│   │   └── logs/
│   └── prod/
│
└── hermes-agent/             # Hermes本体源码、CLI程序
```

---

## 三、各文件夹对应关系对照表

| Hermes 目录 | OpenClaw 对应位置 | 作用说明 |
|-------------|------------------|----------|
| `~/.hermes/` 全局根目录 | `~/.openclaw/workspace` | 默认完整工作区，存放人设、记忆、技能、会话 |
| `~/.hermes/skills/` | workspace 内技能文件夹 | 自定义工具、业务能力脚本库 |
| `~/.hermes/memories/` | `workspace/memory/` | 长期记忆、用户画像持久存储 |
| `~/.hermes/sessions/` + `state.db` | 会话缓存文件 | 所有对话上下文、临时会话数据 |
| `~/.hermes/logs/` | OpenClaw 日志目录 | 命令执行、工具调用报错日志 |
| `~/.hermes/hooks/` | workspace hook 脚本 | 生命周期自定义回调 |
| `~/.hermes/cron/` | 定时任务目录 | 周期自动执行任务 |
| `~/.hermes/profiles/xxx/` | `workspace-{profile}` | 多实例隔离独立工作区，互不干扰 |

---

## 四、四大核心文件详细对比

### 4.1 SOUL.md / identity.md

#### OpenClaw 方案

| 文件 | 路径 | 作用 |
|------|------|------|
| `identity.md` | workspace/ | 定义 Agent 基础身份 |
| `SOUL.md` | workspace/ | 定义 Agent 人格、行为规范 |

OpenClaw 中 `identity.md` 和 `SOUL.md` 是两个独立文件，共同构成 Agent 的完整身份体系。

#### Hermes Agent 方案

| 文件 | 路径 | 作用 |
|------|------|------|
| `SOUL.md` | ~/.hermes/（全局） | **合并** identity + SOUL，统一作为全局身份 |

Hermes **没有** `identity.md` 文件，全局身份统一用 `SOUL.md` 定义，替代了 OpenClaw 中 `identity.md` + `SOUL.md` 的合并功能。

> **结论**：Hermes 没有 `identity.md`，统一用 `SOUL.md` 替代。

---

### 4.2 USER.md

#### OpenClaw 方案

| 文件 | 路径 | 作用 |
|------|------|------|
| `USER.md` | workspace/ | 用户偏好、常用环境、账号信息 |

#### Hermes Agent 方案

| 文件 | 路径 | 作用 |
|------|------|------|
| `USER.md` | ~/.hermes/memories/ | 同上，统一在 memories 目录下管理 |

Hermes 将 USER.md 放在 `~/.hermes/memories/` 目录下，与 MEMORY.md 同级管理。

---

### 4.3 AGENTS.md

#### OpenClaw 方案

| 文件 | 路径 | 作用 |
|------|------|------|
| `AGENTS.md` | workspace/ | 工作区全局规则、Agent 协作流程 |

OpenClaw 的 `AGENTS.md` 位于 workspace 文件夹内，对所有项目全局生效。

#### Hermes Agent 方案

| 文件 | 路径 | 作用 |
|------|------|------|
| `AGENTS.md` | **项目仓库根目录**（局部） | 仅对当前项目生效，不在 Hermes 全局目录 |

> **关键差异**：
> - OpenClaw：`AGENTS.md` 在 workspace 内，**全局生效**
> - Hermes：`AGENTS.md` 放在业务代码仓库根目录，**仅当前项目生效**，换项目自动失效

Hermes 的 `AGENTS.md` 用途与 OpenClaw 不同：
- OpenClaw：`workspace/agent.md` 是工作区全局文件
- Hermes：`AGENTS.md` 属于项目上下文文件，写项目代码规范、目录约束、脚本规则、项目专属流程、多子 Agent 协作规则

---

### 4.4 MEMORY.md

#### OpenClaw 方案

| 文件 | 路径 | 作用 |
|------|------|------|
| `MEMORY.md` | workspace/memory/ | 长期经验知识库 |
| `YYYY-MM-DD.md` | workspace/memory/ | 每日会话记忆 |

#### Hermes Agent 方案

| 文件 | 路径 | 作用 |
|------|------|------|
| `MEMORY.md` | ~/.hermes/memories/ | 长期经验知识库 |
| 会话数据 | sessions/ + state.db | SQLite 存储完整对话历史 |

Hermes 使用 SQLite 数据库（state.db）存储完整对话历史，比 OpenClaw 的每日 md 文件更结构化。

---

## 五、关键概念对照

### 5.1 多工作区隔离

| 维度 | OpenClaw | Hermes Agent |
|------|----------|--------------|
| 隔离机制 | `workspace-{profile}/` | `profiles/` |
| 切换命令 | `openclaw workspace switch work` | `hermes profile use work` |
| 新建方式 | 手动创建目录 | `hermes profile create work` |
| 效果 | 通过目录名区分不同工作区 | 自动生成一套独立完整 workspace |

### 5.2 项目局部上下文

Hermes 在任意业务项目文件夹内执行 `hermes run` 时，会识别项目内：

```
./.hermes/context/
```

**作用**：项目专属上下文文件，仅当前项目生效，相当于项目局部 workspace，仅注入当前会话提示词，不污染全局 `~/.hermes`。

| 维度 | OpenClaw | Hermes Agent |
|------|----------|--------------|
| 项目上下文目录 | `.openclaw/` | `/.hermes/context/` |
| 生效范围 | 仅当前项目注入提示词 | 仅当前项目注入提示词 |
| 效果 | 不污染全局 workspace | 不污染全局 ~/.hermes |

### 5.3 技能（Skills）

| 维度 | OpenClaw | Hermes Agent |
|------|----------|--------------|
| 存储位置 | workspace/skills/ | ~/.hermes/skills/ |
| 分享方式 | SkillHub 市场 | 本地目录 |
| 技能结构 | SKILL.md + 脚本 + 文档 | 同左 |
| 安装命令 | `openclaw skills install @user/skill` | 手动复制目录 |

---

## 六、快速操作指南

### 6.1 想改 AI 本身是谁？

| 操作 | OpenClaw | Hermes Agent |
|------|----------|--------------|
| 文件路径 | `workspace/SOUL.md` | `~/.hermes/SOUL.md` |
| 修改内容 | 同时编辑 identity.md + SOUL.md | 统一编辑 SOUL.md |
| 注意事项 | 可分别修改两个文件 | **全程不识别 `identity.md`**，放了也不会加载 |

### 6.2 想改这个项目怎么干活？

| 操作 | OpenClaw | Hermes Agent |
|------|----------|--------------|
| 文件路径 | `workspace/AGENTS.md` | 在项目根目录新建 `AGENTS.md` |
| 生效范围 | 全局生效 | 仅当前项目生效 |
| 换项目效果 | 不变 | 换项目自动失效 |

### 6.3 想让 AI 记住用户偏好？

| 操作 | OpenClaw | Hermes Agent |
|------|----------|--------------|
| 文件路径 | `workspace/USER.md` | `~/.hermes/memories/USER.md` |

### 6.4 想迁移 OpenClaw 到 Hermes？

Hermes 支持一键迁移 OpenClaw workspace 内所有配置：

```bash
# 一键迁移（推荐）
hermes migrate --from openclaw

# 或手动迁移
# 1. 复制 workspace/SOUL.md → ~/.hermes/SOUL.md
# 2. 复制 workspace/USER.md → ~/.hermes/memories/USER.md
# 3. 复制 workspace/memory/MEMORY.md → ~/.hermes/memories/MEMORY.md
# 4. 复制 workspace/skills/ → ~/.hermes/skills/
```

---

## 七、文件对照速查表

| OpenClaw 文件 | Hermes 对应 | 存放位置 | 作用范围 |
|---------------|-------------|----------|----------|
| `identity.md` | `SOUL.md` | ~/.hermes/ | 全局 |
| `SOUL.md` | `SOUL.md` | ~/.hermes/ | 全局 |
| `USER.md` | `USER.md` | ~/.hermes/memories/ | 全局 |
| `AGENTS.md` | `AGENTS.md` | 项目仓库根目录 | 局部（当前项目） |
| `memory/MEMORY.md` | `memories/MEMORY.md` | ~/.hermes/memories/ | 全局 |
| `memory/YYYY-MM-DD.md` | sessions/ + state.db | ~/.hermes/ | 全局 |
| `skills/` | `skills/` | ~/.hermes/ | 全局 |
| `logs/` | `logs/` | ~/.hermes/ | 全局 |
| `hooks/` | `hooks/` | ~/.hermes/ | 全局 |
| `workspace-{profile}/` | `profiles/` | ~/.hermes/ | 多实例隔离 |
| `.openclaw.json` | `config.yaml` | ~/.hermes/ | 全局 |
| `.env` | `.env` | ~/.hermes/ | 全局 |

---

## 八、总结

| 选择建议 | 场景 |
|----------|------|
| **选 OpenClaw** | 深度编程辅助、IDE 内协作、需要 SkillHub 分享技能 |
| **选 Hermes Agent** | 终端任务自动化、独立 CLI 操作、多实例项目隔离 |

---

## 附录：相关文档

- [[12-0004-OpenClaw-vs-Hermes-Agent-早期版]] - 原始对比笔记
