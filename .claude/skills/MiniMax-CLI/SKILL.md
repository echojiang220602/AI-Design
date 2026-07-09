---
name: minimax-cli
description: >
  MiniMax AI 平台官方 CLI 工具，支持文本聊天、图像生成、视频生成、
  语音合成、音乐生成、网络搜索和图片理解。
  触发关键词：mmx、minimax、生成图片、生成视频、生成语音、
  生成音乐、网络搜索、图片理解、TTS
when_to_use: >
  当用户请求以下任何操作时激活此 skill：
  1. 生成或创建图片、图像、插画、配图、Logo
  2. 生成或创建视频、动画
  3. 合成语音、TTS、语音播报、文字转音频
  4. 生成音乐、BGM、背景音乐、歌曲
  5. 进行网络搜索、资料检索
  6. 分析或理解图片内容（图片理解/Vision）
  7. 用户明确提及 mmx、minimax 或 MiniMax CLI
  8. 查询 API 配额或配置状态
context: inline
user-invocable: true
allowed-tools:
  - Bash
aliases:
  - mmx
  - minimax
---

# MiniMax-CLI

> MiniMax AI 平台官方 CLI，用于生成文本、图像、视频、语音和音乐

---

## 安装状态

- ✅ CLI 已全局安装：`mmx1.0.16`
- ✅ API Key 已配置（区域：cn）

---

## 触发方式

当用户说：
- "生成图片" / "生成视频" / "生成语音" / "生成音乐"
- "搜索一下" / "网络搜索"
- "分析图片" / "图片理解"
- "mmx" / "minimax"

---

## 可用命令

### 文本生成

```bash
mmx text chat --message "你的问题"
mmx text chat --model MiniMax-M2.7-highspeed --message "Hello" --stream
```

### 图像生成

```bash
mmx image "A cat in a spacesuit"
mmx image generate --prompt "描述" --n 3 --aspect-ratio 16:9
mmx image generate --prompt "Logo" --out-dir ./out/
```

### 视频生成

```bash
mmx video generate --prompt "Ocean waves at sunset" --download sunset.mp4
mmx video generate --prompt "A robot painting" --async
```

### 语音合成

```bash
mmx speech synthesize --text "Hello!" --out hello.mp3
mmx speech synthesize --text "Hi" --voice English_magnetic_voiced_man --speed 1.2
mmx speech voices  # 查看可用音色
```

### 音乐生成

```bash
mmx music generate --prompt "Upbeat pop" --lyrics "[verse] La da dee" --out song.mp3
mmx music generate --prompt "Indie folk" --instrumental --out bgm.mp3
```

### 网络搜索

```bash
mmx search "MiniMax AI"
mmx search query --q "最新消息" --output json
```

### 图片理解

```bash
mmx vision photo.jpg
mmx vision describe --image https://example.com/img.jpg --prompt "描述图片内容"
```

### 配额查询

```bash
mmx quota
```

### 配置管理

```bash
mmx config show
mmx auth status
```

---

## 常用场景示例

| 场景 | 命令 |
|------|------|
| 快速提问 | `mmx text chat --message "解释什么是CLAUDE.md"` |
| 生成配图 | `mmx image "科技风格插画" --out-dir ./images/` |
| 语音播报 | `mmx speech synthesize --text "这是一段语音播报" --out tts.mp3` |
| 搜素资料 | `mmx search "AI发展趋势"` |
| 图片分析 | `mmx vision screenshot.png` |

---

## 注意事项

1. **需要 MiniMax Token Plan** 才能使用
2. 当前配置区域为 CN (`api.minimaxi.com`)
3. 可用 `--api-key` 覆盖默认配置
4. 使用 `--help` 查看完整命令帮助

---

**记忆口诀**：图片视频语音音乐，文本搜索图片理解，一个 mmx 全搞定。