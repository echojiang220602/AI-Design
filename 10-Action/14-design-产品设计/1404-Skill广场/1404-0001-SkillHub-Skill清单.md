---
AI 备注: SkillHub 专为中国用户优化的 Skills 社区清单，涵盖标讯搜索、Excel处理、公文生成、Word编辑、文档转换五大方向
created: 2026-06-04
tags:
  - SkillHub
  - Skills
  - AI数字员工
---

# SkillHub Skills 清单

> 来源：https://skillhub.cn - 专为中国用户优化的 Skills 社区

---
## 速查表

| Skill        | 功能提炼            | 数据来源                                                                                     | 适用场景      |
| ------------ | --------------- | ---------------------------------------------------------------------------------------- | --------- |
| 知了标讯         | 全网招中标数据搜索与分析    | [skillhub.cn/skills/zlbx-bidding](https://skillhub.cn/skills/zlbx-bidding)               | 招投标、商机发现  |
| MiniMax Xlsx | 专业 Excel 表格构建   | [skillhub.cn/skills/minimax-xlsx](https://skillhub.cn/skills/minimax-xlsx)               | 数据报表、统计分析 |
| 党政公文         | 符合国标的红头公文生成     | [skillhub.cn/skills/official-doc-writer](https://skillhub.cn/skills/official-doc-writer) | 政府/国企公文   |
| MiniMax Docx | 专业 Word 文档创建与排版 | [skillhub.cn/skills/yh-minimax-docx](https://skillhub.cn/skills/yh-minimax-docx)         | 正式文档、论文报告 |
| MarkItDown   | 多格式文档转 Markdown | [skillhub.cn/skills/markitdown](https://skillhub.cn/skills/markitdown)                   | 文档迁移、内容提取 |

---

## 一、知了标讯 (zlbx-bidding)

> 全网招中标数据搜索与分析，快速发现商机、洞察市场

**主要功能**: 全网招中标数据平台，支持企业分析、市场调研、商机发现

### 安装提示词

直接对数字人说：
> 请先检查是否已安装 SkillHub 商店，若未安装，请根据 https://skillhub.cn/install/skillhub.md 安装SkillHub商店，但是只安装CLI，然后安装zlbx-bidding技能。 若已安装，则直接安装zlbx-bidding技能。

### 核心能力

1. **标讯搜索**：关键词检索全网招标公告，支持高级筛选
2. **企业画像**：查询企业工商信息、中标业绩、竞争对手
3. **市场分析**：获取采购单位TOP榜单、供应商排名、品牌趋势
4. **价格洞察**：追踪历史中标价格，掌握市场行情

### 你可以这么说

直接对数字人说出你的需求，例如：
> "帮我查找最近30天，西北、西南的多式联运类招标公告，匹配关键词：外贸进出口、集装箱动态、物流可视化、预算、区域"
> "查一下浙江兰溪交通建设投资集团有限公司的资质和中标业绩"
> "找出近两年在浙江港口项目中中标最多的企业"

**数据来源**: https://skillhub.cn/skills/zlbx-bidding

---

## 二、MiniMax Xlsx

> 专业 Excel 表格构建，零错误公式与数据可视化

### 安装提示词

直接对数字人说：
>请先检查是否已安装 SkillHub 商店，若未安装，请根据 https://skillhub.cn/install/skillhub.md 安装SkillHub商店，但是只安装CLI，然后安装minimax-xlsx技能。 若已安装，则直接安装minimax-xlsx技能。

**主要功能**: Excel 表格构建、公式处理、数据透视表、图表生成
### 核心能力

1. **自动建表**：根据需求描述自动生成带样式的工作表
2. **智能公式**：自动插入 SUM/VLOOKUP/IF 等公式，支持跨表引用
3. **数据可视化**：一键生成柱状图、折线图、饼图，支持图表联动
4. **零错误保证**：自动校验公式，拒绝 #VALUE!、#REF! 等错误

### 你可以这么说

直接对数字人说出你的需求，例如：
>  "帮我生成一张最近一个月浙江省多式联动信息化项目的汇总表"
> "把这批多式联运数据做成数据透视表，按运输方式和目的港分析"
> "把集装箱吞吐量数据转成折线图，展示近一年趋势"

### 关键约束

- **零容忍错误**：不允许 `#VALUE!`、`#REF!`、`#DIV/0!` 等错误标记
- **动态公式**：可推导的值必须用公式，不能硬编码
- **货币格式**：以完整精度存储（如 15000000），用格式化显示（如 ¥15,000,000）

**数据来源**: https://skillhub.cn/skills/minimax-xlsx

---

## 三、党政机关公文 (official-doc-writer)

> 符合国标的红头公文生成，覆盖15种公文文种

### 安装提示词

直接对数字人说：
> 请先检查是否已安装 SkillHub 商店，若未安装，请根据 https://skillhub.cn/install/skillhub.md 安装SkillHub商店，但是只安装CLI，然后安装official-doc-writer技能。 若已安装，则直接安装official-doc-writer技能。

**主要功能**: 生成符合 GB/T 9704-2012 国家标准的党政机关公文
### 核心能力

1. **国标格式**：自动应用红头、文号、页边距等规范格式
2. **文种齐全**：覆盖通知、通报、请示、报告、函、纪要等15种公文
3. **要素完整**：自动包含版头、主送机关、成文日期、抄送单位等要素
4. **多级标题**：支持发文机关标志、主副标题、签发人等复杂结构

### 你可以这么说

直接对数字人说出你的需求，例如：
> "生成一份浙江省交通运输厅发文给各市人民政府关于推进浙江省多式联运试点工作的公函的红头文件"
> "写一份关于港口集装箱业务优化的通报"
> "帮我起草给省交通厅的请示，汇报多式联运试点方案"

### 公文要素

- 版头（发文机关标志、发文字号、红色分隔线）
- 主体（标题、主送机关、正文、附件说明、成文日期）
- 版记（抄送机关、印发机关/日期）

**数据来源**: https://skillhub.cn/skills/official-doc-writer

---

## 四、MiniMax Docx

> 专业 Word 文档创建与排版，支持模板填充与格式验证
### 安装提示词

直接对数字人说：
>请先检查是否已安装 SkillHub 商店，若未安装，请根据 https://skillhub.cn/install/skillhub.md 安装SkillHub商店，但是只安装CLI，然后安装yh-minimax-docx技能。若已安装，则直接安装yh-minimax-docx技能。


**主要功能**: Word 文档创建、编辑、格式化

### 核心能力

1. **从零创建**：根据描述生成规范 Word 文档，包含标题、段落、列表
2. **模板填充**：批量替换占位符，快速生成个性化文档
3. **专业排版**：自动应用标题样式、目录生成、页眉页脚设置
4. **格式验证**：检查元素顺序、样式引用，确保文档结构正确

### 你可以这么说

直接对数字人说出你的需求，例如：
> "生成一份多式联运信息化项目推广方案，包含背景、目标、实施计划"
> "用这份汇报模板生成月度经营报告，把数据替换成最新的"
> "给这篇物流行业分析报告生成目录和页眉"

### 关键约束

- **OpenXML 元素顺序**：必须严格遵守 `pPr → rPr → t` 的嵌套顺序
- **样式引用**：必须使用 `pStyle` 而非直接格式
- **验证管道**：每次写入后必须运行验证

**数据来源**: https://skillhub.cn/skills/yh-minimax-docx

---

## 五、MarkItDown

> 多格式文档转 Markdown，支持 PDF/Word/URL/多媒体

### 安装提示词

直接对数字人说：
> 请先检查是否已安装 SkillHub 商店，若未安装，请根据 https://skillhub.cn/install/skillhub.md 安装SkillHub商店，但是只安装CLI，然后安装markitdown技能。若已安装，则直接安装markitdown技能。


**主要功能**: 将各类文档转换为 Markdown 格式

### 核心能力

1. **多格式转换**：PDF、Word、PPT 直接转 Markdown，保留结构
2. **网页抓取**：URL 转 Markdown，提取文章内容去除广告噪音
3. **多媒体处理**：图片 OCR 识别、音频自动转字幕、YouTube 视频字幕提取
4. **批量处理**：一次转换多个文件，支持文件夹批量处理

### 你可以这么说

直接对数字人说出你的需求，例如：
> "把这份船公司提单 PDF 转成 Markdown"
> "抓取港口管理局官网的最新政策公告"
> "批量把文件夹里的 Word 文档都转成 Markdown"

### 常用命令

```bash
# 文件转换
markitdown document.pdf -o output.md

# URL 转换
markitdown https://example.com/docs -o docs.md

# 批量处理
python ~/.openclaw/skills/markitdown/scripts/batch_convert.py docs/*.pdf -o markdown/
```

**数据来源**: https://skillhub.cn/skills/markitdown