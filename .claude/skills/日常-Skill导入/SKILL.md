---
name: 日常-Skill导入
description: 规范化和导入 Skills 到本地知识库，自动提取技能属性并生成标准化文档。当用户说"导入Skill"、"分析Skill结构"、"新建技能包"时触发。
---

# 日常-Skill导入

将外部 Skill 规范化为标准结构，提取属性并导入知识库。

## 核心属性定义

| 属性 | 说明 | 必填 | 示例 |
|------|------|------|------|
| **名称** | Skill 唯一标识名 | ✓ | `zlbx-bidding`、`minimax-xlsx` |
| **功能描述** | 一句话说明核心功能 | ✓ | 全网招中标数据搜索与分析 |
| **核心能力** | 具体功能列表 | ✓ | 标讯搜索、企业画像、市场分析 |
| **安装命令** | 安装提示词或CLI命令 | ✓ | `mmx skill install xxx` |
| **触发方式** | 如何调用 Skill | ✓ | 直接对话 / 命令调用 |
| **使用示例** | 常用命令或对话示例 | | "帮我查找..." |
| **参数说明** | 支持的参数及用法 | | `--prompt`、`--out-dir` |
| **适用场景** | 最佳使用场景 | | 招投标、商机发现 |
| **注意事项** | 约束条件或限制 | | 零容忍错误 |
| **数据来源** | 官方文档或链接 | | https://skillhub.cn/... |

---

## 导入流程

### Step 1: 定位 Skill 源码

```
 SkillHub 来源     → .claude/skills/[Skill名称]/
 GitHub 仓库       → 克隆后复制 plugins/*/skills/* 到 skills/
 Claude Code 市场   → ~/.claude/skills/[Skill名称]/
 OpenClaw          → ~/.openclaw/skills/[Skill名称]/
```

### Step 2: 提取核心文件

| 文件 | 说明 |
|------|------|
| `SKILL.md` | 主 Skill 定义 |
| `marketplace.json` | 市场元数据 |
| `README.md` | 使用文档 |
| `scripts/` | 可执行脚本 |
| `docs/` | 详细文档 |

### Step 3: 解析属性

根据文件内容提取：

1. **名称** - 来自目录名或 `marketplace.json`
2. **功能描述** - 来自 `SKILL.md` frontmatter description
3. **核心能力** - 解析 "核心能力"、"功能" 等章节
4. **安装命令** - 查找 "安装"、"install"、"setup" 相关内容
5. **触发方式** - "直接对数字人说..." / CLI 命令
6. **使用示例** - 收集示例对话或命令
7. **参数说明** - 解析命令帮助或参数定义
8. **适用场景** - 从描述中提炼
9. **注意事项** - "约束"、"注意"、"限制" 章节
10. **数据来源** - 原始链接或文档地址

### Step 4: 生成标准化文档

在 `LLM-WIKI/wiki/Skill广场/` 下创建：

```markdown
# [Skill名称]

## 基本信息

| 属性 | 内容 |
|------|------|
| 来源 | SkillHub / GitHub / Claude Market |
| 安装命令 | `xxx` |
| 触发方式 | 直接对话 / CLI |
| 适用场景 | xxx |

## 功能描述

一句话描述...

## 核心能力

1. xxx
2. xxx
3. xxx

## 使用示例

### 对话示例
> "..."

### 命令示例
```bash
mmx xxx
```

## 参数说明

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `--xxx` | xxx | xxx |

## 注意事项

- xxx
- xxx

## 相关链接

- 官方文档：https://...
- GitHub：https://...
```

---

## 快捷命令

| 操作 | 命令 |
|------|------|
| 列出已导入 Skills | `ls ~/.claude/skills/` |
| 检查 Skill 状态 | `mmx skill list` |
| 更新 Skill | `mmx skill update [name]` |
| 删除 Skill | `mmx skill remove [name]` |

---

## 示例：导入 frontend-slides

```bash
# 1. 克隆仓库
git clone https://github.com/xxx/frontend-slides.git

# 2. 复制到 skills 目录
cp -r frontend-slides/plugins/*/skills/* ~/.claude/skills/

# 3. 提取属性并生成文档
# → 创建 LLM-WIKI/wiki/Skill广场/frontend-slides.md
```

---

## 属性提取清单

```
□ 名称（name）
□ 功能描述（description）
□ 核心能力（capabilities）
□ 安装命令（install_command）
□ 触发方式（trigger）
□ 使用示例（examples）
□ 参数说明（parameters）
□ 适用场景（use_cases）
□ 注意事项（constraints）
□ 数据来源（source_url）
```

---

## 注意事项

1. **优先使用已有字段** - 不新增 frontmatter 属性
2. **只保留文件名** - 双链使用 `[[文件名]]`，不带路径
3. **命名规范** - Skill 名称用英文或拼音，文件用中文
4. **定期同步** - Skill 更新后同步更新文档
