---
up:
relate:
tags:
created: 2026-07-02
source:
index:
project:
---
## OpenClaw vs. Hermes Agent

1、根据对标 Openclaw workspace ，Hermes Agent的完整目录如下

```
~/.hermes/
├── 配置核心文件（全局）
│   ├── config.yaml      # 主配置，对应 openclaw.json
│   ├── .env             # API密钥、密钥凭证
│   ├── auth.json        # OAuth/第三方登录凭证
│   ├── SOUL.md          # 智能体人设、行为规则（同OpenClaw SOUL.md）
│
├── 核心工作目录（对标 workspace 功能分区）
│   ├── skills/          # 技能库 = OpenClaw workspace技能文件夹
│   │   ├── 每个子目录为独立技能，内含SKILL.md、脚本、参考文档
│   ├── memories/        # 长期记忆库 = OpenClaw memory/
│   │   ├── MEMORY.md    # 全局长期知识库
│   │   └── USER.md      # 用户偏好、个人信息
│   ├── sessions/        # 会话存储，存放对话上下文
│   ├── state.db         # SQLite会话数据库（完整对话历史）
│   ├── logs/            # 运行日志、执行记录
│   ├── hooks/           # 生命周期钩子脚本（启动/关闭/消息回调）
│   ├── cron/            # 定时任务脚本目录
│   ├── plans/           # 任务规划、执行方案缓存
│   ├── skins/           # 界面/提示词模板
│
├── hermes-agent/        # Hermes本体源码、CLI程序
├── workspace/（可选部署模式）# 部分Docker部署单独分出纯文件工作目录
└── profiles/            # 多用户/多实例隔离工作区（多workspace）
    ├── dev/
    │   ├── config.yaml
    │   ├── skills/
    │   ├── memories/
    │   ├── sessions/
    │   └── logs/
    └── prod/
```

## 二、各文件夹与 OpenClaw 对应关系对照表

|   |   |   |
|---|---|---|
|Hermes 目录|OpenClaw 对应位置|作用说明|
|`~/.hermes/` 全局根目录|`~/.openclaw/workspace`|默认完整工作区，存放人设、记忆、技能、会话|
|`~/.hermes/skills/`|workspace 内技能文件夹|自定义工具、业务能力脚本库|
|`~/.hermes/memories/`|`workspace/memory/`|长期记忆、用户画像持久存储|
|`~/.hermes/sessions/` + `state.db`|会话缓存文件|所有对话上下文、临时会话数据|
|`~/.hermes/logs/`|OpenClaw 日志目录|命令执行、工具调用报错日志|
|`~/.hermes/hooks/`|workspace hook 脚本|生命周期自定义回调|
|`~/.hermes/cron/`|定时任务目录|周期自动执行任务|
|`~/.hermes/profiles/xxx/`|`workspace-{profile}`|多实例隔离独立工作区，互不干扰|

## 三、项目本地上下文目录（局部 workspace）

在任意业务项目文件夹内执行 `hermes run` 时，会识别项目内：

plaintext

```
./.hermes/context/
```

作用：项目专属上下文文件，仅当前项目生效，相当于项目局部 workspace，仅注入当前会话提示词，不污染全局 `~/.hermes`。

## 四、关键补充

1. 单实例使用：直接操作 `~/.hermes/skills`、`memories` 即可，不用额外切换目录；
    
2. 多工作区分隔：新建 profile `hermes profile create work`，自动生成一套独立完整 workspace；
    
3. 迁移逻辑：Hermes 可一键迁移 OpenClaw workspace 内 SOUL、USER、MEMORY、skills 到自身目录。
    

# Hermes 有没有 identity.md/agent.md？结论先说

1. 没有 identity.md
    
    Hermes 全局身份文件统一叫 SOUL.md，完全替代 OpenClaw 的 identity.md 作用。
    
2. 有 AGENTS.md（大写复数）
    

但位置、用途和 OpenClaw 的 agent.md 完全不一样。

## 一、SOUL.md = Hermes 的全局身份（对标 OpenClaw identity.md）

路径：`~/.hermes/SOUL.md`（全局工作区根目录）

- 作用：Agent 核心人格、身份、基础行为规范，系统提示词第一层加载（Slot #1）
    
- 全局生效：所有项目、所有会话共用一套身份，切换项目不会变人设
    
- 对应 OpenClaw：`workspace/identity.md` + `workspace/SOUL.md` 合并功能
    
- 不存在 `identity.md`，Hermes 官方不识别这个文件名
    

## 二、AGENTS.md（项目局部规则，不是全局身份）

路径：当前项目仓库根目录（不是 `~/.hermes/`）

- 作用：仅对当前项目生效，写项目代码规范、目录约束、脚本规则、项目专属流程、多子 Agent 协作规则
    
- 加载优先级：会话启动自动读取当前目录 `AGENTS.md`，仅本项目生效，换项目自动失效
    
- 和 OpenClaw 区别：
    
    - OpenClaw：`workspace/agent.md` 是工作区全局文件，存在 workspace 文件夹里
        
    - Hermes：`AGENTS.md` 放在业务代码仓库根目录，属于项目上下文文件，不属于 Hermes 全局目录
        

## 三、OpenClaw ↔ Hermes 文件对照表

表格

|   |   |   |   |
|---|---|---|---|
|OpenClaw 文件|Hermes 对应文件|存放位置|用途|
|identity.md|SOUL.md|~/.hermes/（全局）|全局 Agent 身份、人设、基础约束|
|agent.md|AGENTS.md|项目仓库根目录（局部）|单项目专属规则、项目工作流程|
|SOUL.md|SOUL.md|~/.hermes/|同身份文件，Hermes 统一用它做 Identity|

## 四、补充：Hermes 相关配套记忆文件（都在～/.hermes/memories/）

- MEMORY.md：全局长期经验、踩坑记录、通用技术规范
    
- USER.md：你的个人偏好、常用环境、账号信息
    

## 快速区分记忆

- 想改AI 本身是谁：编辑 `~/.hermes/SOUL.md`（替代 identity.md）
    
- 想改这个项目怎么干活：在项目根目录新建 `AGENTS.md`（替代 agent.md）
    
- Hermes 全程不识别 `identity.md`，放了也不会加载。