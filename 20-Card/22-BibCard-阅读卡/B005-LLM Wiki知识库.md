---
创建日期: 2026-05-11
AI 备注: LLM Wiki 架构——用 AI 替代人工维护，实现知识库的持续积累与交叉引用
source: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
tags:
  - 笔记系统
  - AI辅助
index:
  - "[[K102-笔记管理]]"
---

# LLM Wiki — 用 LLM 构建个人知识库

**来源**：Andrej Karpathy · GitHub Gist

## 核心理念

> 不要每次查询时重新发现知识，要让知识持续积累、编译、互相连接。

传统 RAG（ChatGPT 文件上传）—— 每次问答都从零检索，无积累
**LLM Wiki** —— 知识被持久编译，跨引用、矛盾标记、综合结论早已就位

## 三层架构

| 层级 | 作用 | 谁维护 |
|------|------|--------|
| **Raw Sources** | 原始文档（文章、论文、图片），**不可修改** | 人类 |
| **Wiki** | LLM 生成的摘要页、实体页、概念页、对比表 | LLM |
| **Schema（如 CLAUDE.md）** | 告诉 LLM 规范、格式、工作流 | 人 + LLM 共同迭代 |

## 三个核心操作

### 1. Ingest（摄取）
- 丢入新文章 → LLM 处理 → 更新摘要页 + 相关实体页 + index + log
- 一篇来源可能联动 10-15 个 wiki 页面

### 2. Query（查询）
- 问问题 → LLM 搜 wiki → 综合回答 + 引用来源
- **好答案值得归档回 wiki**，不要让它消失在对话历史里

### 3. Lint（体检）
- 检查：矛盾、过时信息、孤立页面、缺失交叉引用、数据空白
- 让 LLM 提出新问题和待查来源

## 两个关键文件

**index.md** — 内容导向，按类别列出所有页面 + 一句话摘要，LLM 读它找相关页面
**log.md** — 时间导向，记录 ingests、queries、lint 发生的事

## 工具链建议

- **Obsidian Web Clipper**：浏览器插件转 markdown
- **图片本地化**：设置 hotkey 自动下载文章图片
- **Graph View**：查看 wiki 连接结构
- **Marp**：生成幻灯片
- **Dataview**：用 frontmatter 做动态查询

## 我的评论

这个理念和 ACT 框架天然契合：
- Raw Sources → 收件箱 / 待处理文档
- Wiki → 22-BibCard / 23-MainCard
- Schema → .claude/rules/ 系列文件

**核心洞察**：人放弃维护 wiki，是因为维护负担增长快过价值增长。LLM 不会厌倦、不会忘记交叉引用。维护成本接近零。

## 与 ACT 的映射

| LLM Wiki | ACT 框架 |
|---------|---------|
| Raw Sources | 收件箱 / Daily 日志随手记 |
| Ingest | Action → Card 的转化 |
| Wiki（实体页/概念页） | 22-BibCard / 23-MainCard |
| Schema | .claude/rules/ |
| index.md | 21-IndexCard-索引卡 |
| log.md | Daily / Weekly 时间线 |