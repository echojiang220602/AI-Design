

你是一个经验丰富的React + TypeScript前端工程师，需要创建一个可直接投产的PC端的我的虾网页，整体布局简洁清晰，以蓝色调为主。消除云端 AI 黑盒感，让用户像操作本地电脑一样管理云端 Agent

技术栈要求：
- React 18 + TypeScript 5.0+
- Tailwind CSS 3.0+ 用于样式
- React Router v6 用于路由

页面结构：顶部导航，智能体、控制台、文件夹、终端、设置
**顶部导航栏** - OpenClaw Logo + 工作区/工具箱/渠道/技能 导航 + 设置按钮
1. **智能体**：左右分栏设计，左边是**身份定义**、**运行健康度**、**活跃统计**
	- **身份定义**：展示Agent名称及当前挂载的底层大模型。
	- **运行健康度**：提供 Pod 状态指示灯（如：运行中、重启中、异常），并实时显示当前容器的资源占用情况。
	- **活跃统计**：以热力图形式展示 Agent 的交互频次和任务完成率。
	- 多个tap的标签页，钉钉渠道配置，技能工具列表。
	右边是上下的分栏功能配置区：**行为准则标签页**、定时任务、SKILL技能商店
2. **控制台**：内嵌openclaw的webui
3. **文件夹：直接映射 OpenClaw 运行容器内的 `/workspace` 目录，作为 Agent 的“物理大脑”。
	- **文件系统映射**：实时同步展示容器内所有生成或存储的文件，包括代码脚本、输出报表、多媒体素材。
	- **文件全生命周期管理**：支持文件的上传、下载、重命名及删除。
	- **在线预览与编辑**：点击文本或代码文件即可开启内置编辑器进行修改；
4. 终端：openclaw 的terminal Pod 命令行窗口 (Terminal)**：集成沉浸式终端，允许用户直接进入容器的 Bash Shell 环境，进行环境检查、手动执行脚本或安装必要的依赖包。
5. **设置**:分上下栏显示 OpenClaw 版本、可用模型、插件信息

功能要求：
- 导航栏：响应式汉堡菜单、滚动高亮、下拉菜单
- 表单：带验证的联系表单、提交后状态反馈
- 图片：懒加载、WebP格式支持、响应式图片
- 动画：页面过渡动画、滚动触发动画、微交互

性能优化：
- 代码分割按路由懒加载
- 图片使用next/image或类似优化
- 关键CSS内联，非关键CSS异步加载
- Lighthouse评分目标：性能>90，可访问性>95，最佳实践>90

代码规范：
- 使用函数组件和Hooks
- 严格的TypeScript类型定义
- 组件按功能模块化组织
- 添加必要的单元测试（Jest + React Testing Library）

 **交互逻辑** - 目录终端联动、对话文件闭环、沉浸式调试
**视觉风格** - 飞书 OpenClaw 风格色彩、组件、布局规范

请调用 mcp pencil 设计一个前端页面，生成完整的、可直接部署的代码，包含所有必要的配置文件和构建脚本。


    



### **智能体
这个界面采用了典型的左右分栏设计，整体布局简洁清晰，以蓝色调为主，功能区域划分明确。
#### **左侧面板 - 用户信息区**
左侧是智能体（AI助手）的基本信息和状态展示区域：
1. **用户头像及信息**：
    - 显示用户名为“claude-shrimp”
    - 介绍其为“OpenClaw驱动的智能助手”，表明这是一个基于OpenClaw技术构建的AI助手
2. **统计数据**：
    - 陪伴天数：2天
    - 近期消息：11条
    - 完成任务：0个
    - 这些数据展示了智能体的使用频率和活跃度
3. **操作按钮**：
    - “去对话”按钮：点击后可直接进入与钉钉机器人的对话界面
4. **对话统计日历**：
    - 可视化展示对话活动的历史记录，帮助用户了解使用模式
**智能体信息看板** (左侧)
    - Agent 头像 + 名称 + 模型
    - 状态指示灯（运行中）
    - 统计数据：完成任务/总请求/成功率
    - 资源使用率：CPU/内存/网络（动态更新）
#### **右侧面板 - 功能配置区**

右侧是智能体的详细配置和管理区域，采用标签页形式组织：

1. **行为准则标签页**：- 这通常是定义智能体行为规范、价值观和响应原则的配置文件
    1. **行为准则** - 当前选中的标签，对应到soul.md配置。页面布局如下：
	    1. 顶部显示： SOUL.md智能体必须遵守的底线规则、安全框架和核心价值观；
	    2. 分割线，
	    3. 下面是支持用户自定义内容。
	2. **工作流程** - 可能包含智能体的工作流程定义，对应到agents.md配置。页面布局如下：
		1. 顶部显示：AGENTS.md智能体的工作流程、协作规则和任务编排；
		2. 分割线，
	    3. 下面是支持用户自定义内容。
	    4. 右上角有点击【编辑】按钮
	3. **智能体档案** - 智能体的详细配置信息，对应到identify.md配置。页面布局如下：
		1.  顶部显示：IDENTITY.md智能体的名字、性格和身份定义；
		2. 分割线，
	    3. 下面是支持用户自定义内容。
	    4. 右上角有点击【编辑】按钮
	4. **用户档案** - 用户相关信息和设置，对应user.md配置
		1.  顶部显示：USER.md你的基本信息和沟通偏好等，智能体会据此提供更贴合的回答；
		2. 分割线，
	    3. 下面是支持用户自定义内容。
	    4. 右上角有点击【编辑】按钮
	5. **全部文件** - 点击，直接调整到文件夹页面。
2. **定时任务**
    - 显示已配置的定时任务列表
	- 允许设置自动执行的任务，如定时报告、数据同步等
3. **技能工具列表**：
    - **技能列表**：如“miaoda-coding”等，代表智能体具备的特定能力
    - **工具列表**：如“miaoda-database-skill”等，可能是与外部系统集成的工具或API
    - 这些技能和工具扩展了智能体的功能范围

### **控制台页面整体结构**

这个界面采用了典型的左侧导航+中间主内容区的三栏布局设计，整体色调为简洁的蓝白色，布局清晰，专注于AI交互和对话管理。

#### **左侧导航栏**

左侧是功能导航区域，包含多个选项：

1. **聊天** - 可能切换到对话界面
2. **控制** - 当前选中的选项，表明这是控制台或管理界面
3. 可能还有其他功能选项（截图中未完全显示）

这种导航设计允许用户在不同功能模块间快速切换。

#### **中间主聊天区域**

这是页面的核心区域，显示AI助手与用户的对话内容：

**对话内容示例**：

1. **用户请求**：
    
    - “请帮我写一个介绍文档”
    - “一个小龙虾页面设计的介绍”
    - 这表明用户正在请求AI助手协助完成特定任务
2. **AI助手响应**：
    
    - 包含工具调用信息：“Tool call”
    - 包含工具输出信息：“Tool output”
    - 显示AI助手正在使用特定工具来处理用户请求

**交互特点**：

- 显示了完整的对话历史
- 包含工具调用和执行的详细信息
- 展示了AI助手的工作流程和响应过程

#### **可能的右侧面板**

虽然截图中未显示完整右侧区域，但基于常见AI聊天界面设计，可能包含：

1. **工具面板** - 显示可用的AI工具和功能
2. **设置选项** - 对话参数调整
3. **历史记录** - 过往对话的快速访问
4. 



你是一个经验丰富的React + TypeScript前端工程师，需要创建一个可直接投产的PC端的我的虾网页，整体布局简洁清晰，以蓝色调为主。消除云端 AI 黑盒感，让用户像操作本地电脑一样管理云端 Agent

技术栈要求：

- React 18 + TypeScript 5.0+
    
- Tailwind CSS 3.0+ 用于样式
    
- React Router v6 用于路由
    

页面结构：顶部导航，智能体、控制台、文件夹、终端、设置  
顶部导航栏 - OpenClaw Logo + 工作区/工具箱/渠道/技能 导航 + 设置按钮

1. 智能体：左右分栏设计，左边是身份定义、运行健康度、活跃统计
    
    - 身份定义：展示Agent名称及当前挂载的底层大模型。
        
    - 运行健康度：提供 Pod 状态指示灯（如：运行中、重启中、异常），并实时显示当前容器的资源占用情况。
        
    - 活跃统计：以热力图形式展示 Agent 的交互频次和任务完成率。
        
    - 多个tap的标签页，钉钉渠道配置，技能工具列表。  
        右边是上下的分栏功能配置区：行为准则标签页、定时任务、SKILL技能商店
        
2. 控制台：内嵌openclaw的webui
    
3. **文件夹：直接映射 OpenClaw 运行容器内的 `/workspace` 目录，作为 Agent 的“物理大脑”。
    
    - 文件系统映射：实时同步展示容器内所有生成或存储的文件，包括代码脚本、输出报表、多媒体素材。
        
    - 文件全生命周期管理：支持文件的上传、下载、重命名及删除。
        
    - 在线预览与编辑：点击文本或代码文件即可开启内置编辑器进行修改；
        
4. 终端：openclaw 的terminal Pod 命令行窗口 (Terminal)**：集成沉浸式终端，允许用户直接进入容器的 Bash Shell 环境，进行环境检查、手动执行脚本或安装必要的依赖包。
    
5. 设置:分上下栏显示 OpenClaw 版本、可用模型、插件信息
    

功能要求：

- 导航栏：响应式汉堡菜单、滚动高亮、下拉菜单
    
- 表单：带验证的联系表单、提交后状态反馈
    
- 图片：懒加载、WebP格式支持、响应式图片
    
- 动画：页面过渡动画、滚动触发动画、微交互
    

性能优化：

- 代码分割按路由懒加载
    
- 图片使用next/image或类似优化
    
- 关键CSS内联，非关键CSS异步加载
    
- Lighthouse评分目标：性能>90，可访问性>95，最佳实践>90
    

代码规范：

- 使用函数组件和Hooks
    
- 严格的TypeScript类型定义
    
- 组件按功能模块化组织
    
- 添加必要的单元测试（Jest + React Testing Library）
    

交互逻辑 - 目录终端联动、对话文件闭环、沉浸式调试  
视觉风格 - 飞书 OpenClaw 风格色彩、组件、布局规范

请调用 mcp pencil 设计一个前端页面，生成完整的、可直接部署的代码，包含所有必要的配置文件和构建脚本。

首页 页面布局

垂直方向：

- "最佳的工作搭档"卡片顶部距离导航栏 = 页面总高 1/4（pt-[25vh]）
    

- 两个卡片顶部对齐（同在 pt-[25vh] 的外层容器内）
    

水平方向：

- 三等分：左边缘 → 左卡片左边缘 = 左卡片右边缘 → 右卡片左边缘 = 右卡片右边缘 → 右边缘
    

- 左卡片 max-w-lg（512px），右卡片 max-w-md（448px）
    

- justify-between 让两卡之间 gap = 两侧外边距 = (100vw - 512px) / 3
    

高度：

- 两个卡片均为自然高度（内容决定高度，不再延伸满屏）
    

## 修改文件清单

|   |   |   |   |
|---|---|---|---|
|#|文件路径|修改内容摘要|反馈|
|1|`src/App.css`|重写样式（992行）：`.page-bg` 背景结构（蓝底+`Skill.png`全屏cover）、`.topnav` 毛玻璃导航栏、所有表单/卡片/按钮样式|在F:\Echo2026\AI数字人中台\src没有找到App.css文件|
|2|`src/pages/SkillsPage.tsx`|页面背景从 `style={{ background: tokens.cream }}` 改为 `className="page-bg"`，引用 `Skill.png` 作为全屏背景|在F:\Echo2026\AI数字人中台\src\pages 没有找到`SkillsPage.tsx`文件|
|3|`src/pages/HomePage.tsx`|修复6处必填项星号颜色为红色、动态表单对齐逻辑|在F:\Echo2026\AI数字人中台\src\pages 没有找到`HomePage.tsx`文件|
|4|`src/App.tsx`|添加 `/my-agents` 路由指向 `MyAgentsPage`|完成|
|5|`src/pages/DiaryPage.tsx`|背景改为 `className="page-bg"`|在F:\Echo2026\AI数字人中台\src\pages 没有找到`DiaryPage.tsx`文件|
|6|`src/pages/SkillPackPage.tsx`|背景改为 `className="page-bg"`|在F:\Echo2026\AI数字人中台\src\pages 没有找到`SkillPackPage.tsx`文件|
|7|`src/pages/MyAgentsPage.tsx`|新建页面，`.page-bg` 背景，`MemoryRouter` → `ShrimpApp`|没有执行|
|8|`src/components/Navbar.tsx`|简化为使用 App.css class，导航链接更新|在F:\Echo2026\AI数字人中台\src\components 没有找到`Navbar.tsx`文件|
|9|`index.html`|Noto Sans SC + zh-CN||
|10|`src/index.css`|简化为仅 CSS variables|在F:\Echo2026\AI数字人中台\src 没有找到`index.css`文件|
|11|`public/favicon.svg`|蓝白渐变机器人 SVG favicon|完成|
|12|`vite.config.ts`|添加 `/my-agents/:agentId?` 历史模式 fallback|未执行|

## 修改文件清单

|   |   |   |   |
|---|---|---|---|
|#|文件路径|修改内容|用途|
|1|`src/pages/shrimp/components/layout/Sidebar.tsx`|`top-0` → `top-14`|Sidebar固定定位下移，留出AI数字人中台顶部导航(56px)的高度|
|2|`src/pages/shrimp/App.tsx`|重写：移除`PageLayout`和`NavBar`，保留`Sidebar` + `Routes`包装在flex容器中|去掉shrimp自己的顶部导航，只保留左侧导航+主内容区，嵌入住导航下方|
|3|`src/pages/MyAgentsPage.tsx`|导入路径 `./App` → `./shrimp/App`|正确引用shrimp子项目的入口|
|4|`tsconfig.json`|添加 `"@shrimp/*": ["src/pages/shrimp/*"]` 路径映射|TypeScript识别`@shrimp/`别名，正确解析模块路径|
|5|`vite.config.ts`|添加 `@shrimp` alias指向`src/pages/shrimp`|Vite构建时解析`@shrimp/`路径别名|
|6|`src/pages/shrimp/` 下全部39个`.tsx`/`.ts`文件|批量替换：`@/` → `@shrimp/`，`../../xxx` → `@shrimp/xxx`|解决shrimp复制到AI数字人中台后的相对路径失效问题|

## 修改文件清单


![[Pasted image 20260530212102.png]]

|   |   |   |   |
|---|---|---|---|
|#|文件路径|修改内容|用途|
|1|`src/pages/shrimp/components/layout/Sidebar.tsx`|`top-0` → `top-14`|Sidebar固定定位下移，留出AI数字人中台顶部导航(56px)的高度|
|2|`src/pages/shrimp/App.tsx`|重写：移除`PageLayout`和`NavBar`，保留`Sidebar` + `Routes`包装在flex容器中|去掉shrimp自己的顶部导航，只保留左侧导航+主内容区，嵌入住导航下方|
|3|`src/pages/MyAgentsPage.tsx`|导入路径 `./App` → `./shrimp/App`|正确引用shrimp子项目的入口|
|4|`tsconfig.json`|添加 `"@shrimp/*": ["src/pages/shrimp/*"]` 路径映射|TypeScript识别`@shrimp/`别名，正确解析模块路径|
|5|`vite.config.ts`|添加 `@shrimp` alias指向`src/pages/shrimp`|Vite构建时解析`@shrimp/`路径别名|
|6|`src/pages/shrimp/` 下全部39个`.tsx`/`.ts`文件|批量替换：`@/` → `@shrimp/`，`../../xxx` → `@shrimp/xxx`|解决shrimp复制到AI数字人中台后的相对路径失效问题|

关键改动是第1、2条，实现了 shrimp 左侧导航 + 主内容在 AI数字人中台顶部导航下方的布局。


**修改文件清单：** | # | 文件 | 修改内容 | 作用 | |---|------|---------|------| 
| 1 | `src/pages/Home/index.tsx` 第22/57行 | `url(/home.png)` → `url(/images/home.png)` | 修复创建Agent页面背景图路径 |
| 2 | `src/pages/Diary/index.tsx` 第31行 | `url(/home.png)` → `url(/images/home.png)` + 移除 `.page-bg` class，改用纯内联style | 修复分享记录页面背景图路径 |
| 3 | `src/pages/Diary/index.tsx` 第107行 | `url(/diary.png)` → `url(/images/skill-pkgs.png)` | 修复日记详情页背景图 |
| 4 | `src/pages/Skills/index.tsx` 第33行 | `url(/skill-pkgs.png)` → `url(/images/skill-pkgs.png)` | 修复技能商城背景图路径 |
| 5 | `src/pages/shrimp/App.tsx` 第34行 | `url(/skill-pkgs.png)` → `url(/images/skill-pkgs.png)` + 加 `backgroundColor: '#F0F9FF'` | 修复我的Agent/技能商城/我的文件/远程桌面背景图路径 + 补充背景底色 |
| 6 | `src/styles/globals.css` `.page-bg` | `url('/home.png')` → `url('/images/home.png')` | 全局CSS背景图路径统一 |
| 7 | `src/styles/globals.css` `.page-bg` | 加 `background-color: #F0F9FF` | 全局背景色统一为浅蓝 | **Dev server：** [http://127.0.0.1:3001](http://127.0.0.1:3001)


#### 首页背景图展示方式

首页背景图的展示方式如下：

**图片路径：** `/images/home.png`

**CSS 样式（第22行、第57-61行）：**

```
background: #F0F9FF;                    /* 浅蓝色底色 */

background-image: url(/images/home.png); /* 背景图片 */

background-size: auto;                   /* 图片原始尺寸 */

background-position: left center;        /* 左对齐，垂直居中 */

background-repeat: repeat;               /* 图片平铺重复 */

```

**效果：**

- 图片从**左侧开始**，原始尺寸显示，向右平铺
    
- 整体覆盖整个页面，配合浅蓝底色 `#F0F9FF`
    
- `background-position: left center` 使图片左对齐，垂直方向居中
    
- `background-repeat: repeat` 会横向和纵向平铺
    

您有什么想调整的吗？比如：
- 图片位置（左/右/居中）
- 显示方式（平铺/不平铺/cover-contain）
- 底色深浅
