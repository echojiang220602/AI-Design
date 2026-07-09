---
up:
relate:
  - "[[AI基础-AI工具架构图]]"
tags:
  - AI基础知识
created: "{{2026-0515}}"
source:
index:
project:
---
 AI 就像一个企业：企业的**员工**（LLM,GPT/Deepseek / Gemini / Minmax / Claude），通过不一样的沟通（CLI / GUI）方式管理，他们拿起工具（RAG / MCP）和手册（Skills / Harness）在办公室（IDE : VS Code / Cursor / Trae  或者  Vibe Coding）干活，有能自主干活（Agent ）员工，也有普通员工。


 
 
**前言** **| 大脑 | 怎么沟通？| 工具和手册 | 自主干活 | 办公室 | 总结**

![[Pasted image 20260515214831.png]]

**前言** | 大脑 | 怎么沟通？| 工具和手册 | 自主干活 | 办公室 | 总结
# AI 工具五层坐标系

![[Pasted image 20260515195300.png]]

前言 | **大脑** | 怎么沟通？| 工具和手册 | 自主干活 | 办公室 | 总结**
## 第一层 大脑

如，GPT、 Claude、Gemini

同样是模型，差异会很大，为什么？

定位：地基

![[Pasted image 20260515195546.png]]

### Token 

处理信息的**最小单位**，中文名叫 **词元**；

![[Pasted image 20260515195657.png]]


### Context

上线文窗口（Context Window）,**上下文工程**。


![[Pasted image 20260515195917.png]]


### Multi Model

多模态
不止是看文字，还可以**看图，听声音**

![[Pasted image 20260515200336.png]]


### 推理模型

推理模型 或推理模式，代表 O1, O3, Deepseek 3

**普通模型** VS **推理模型**
普通模型：直接回答  ；
推理模型：推理，**打草稿**，反复推敲，擅长数学


![[Pasted image 20260515200447.png]]

前言 | 大脑 | **怎么沟通**？| 工具和手册 | 自主干活 | 办公室 | 总结**
## 第二层 怎么沟通？

第二层：你怎么跟他说话
GUI VS CLI

GUI: 网页，app，如 GPT 网页版，claude.ai 都是界面
CLI:

![[Pasted image 20260515200925.png]]



![[Pasted image 20260515201232.png]]

### Prompt 和 Prompt Enginneering

**提示词** 和 **提示词工程**

前言 | 大脑 | 怎么沟通？| **工具和手册** | 自主干活 | 办公室 | 总结**
## 第三层 工具和手册

工具和手册
RAG -> MCP -> Skills -> Harness



![[Pasted image 20260515203001.png]]


### RAG

**检索增强生成**

![[Pasted image 20260515203342.png]]


### MCP

全称Model Context Protocol (**模型上下文协议**) ，是工具接入的统一标准，一套**通用接口**。相当于统一了一个插头规格，就好像 USB-C 统一了数据线。**符合 MCP 协议**，就可以接入大模型（员工就能直接去用）。

![[Pasted image 20260515203511.png]]

### Skills

定义为**操作手册**，特定**任务**的最佳做法是**提前写好**，AI 直接调用。

![[Pasted image 20260515203905.png]]


### Harness

**书架加管理员**，**管理**这些**手册**的**系统**，决定什么时候该调用哪本，本质是 Agent 的**运行框架**。


![[Pasted image 20260515204040.png]]





前言 | 大脑 | 怎么沟通？| 工具和手册 | **自主干活** | 办公室 | 总结**
## 第四层 能自主干活的员工 - Agent

**Agent = LLM + 工具 + 自主循环**

自主决策，如 OpenClaw / Hermes / Claude code / Codex Cli

![[Pasted image 20260515204316.png]]

**编程 Agent 三剑客**： 在终端里干活的 AI 员工

Agent 干活：自动清理收件箱，整理日历，规划三餐，制作周报，用微信发条消息让小龙虾干活，

![[Pasted image 20260515204725.png]]


### Hermes 

最大特点，**自主循环学习** 从**每次的使用中去积累经验**，自动的生成**新进能**，用的越久越聪明

![[Pasted image 20260515205026.png]]

前言 | 大脑 | 怎么沟通？| 工具和手册 | 自主干活 | **办公室** | 总结**
## 第五层 办公室-IDE


 Vibe Coding -- 只说话不写代码
![[Pasted image 20260515205326.png]]
### 办公室 

**IDE、 Cursor 和 Claude Code : 办公室 VS 员工**
国内的 阿里的 Qoder work、腾讯的 Marvis、像 minmax 各种 Agent 对

![[Pasted image 20260515205423.png]]

### Vibe Coding 


![[Pasted image 20260515205958.png]]