---
name: web-downloader
description: >
  Batch download web content and files from authenticated sites, SPAs, and APIs.
  Handles login, token capture, PDF downloads, API extraction, and batch processing with resume.
  Use when the user asks to download content from websites, extract articles, save PDFs,
  batch-download from a site, or scrape authenticated pages.
  Triggers: "下载这个网站", "批量下载", "把这些页面保存下来", "下载所有PDF",
  "抓取页面内容", "提取文章", "download all", "save these pages".
---

# Web Downloader — 网页内容与文件批量下载

> 基于 Playwright + Bearer Token 的认证网站批量下载方案。2026-05-18 从 Country Navigator 实战中萃取。

## 适用场景

- 需要登录的网站批量下载
- SPA（Angular/React/Vue）页面内容提取
- PDF/文件批量下载（含 S3 签名 URL）
- API 数据提取（Bearer Token 认证）
- 需要断点续传的大批量任务

## 前置条件

```bash
npm install playwright
npx playwright install chromium
```

## 核心模式

### 1. 登录 + Token 捕获

SPA 网站通常使用 Bearer Token（非 Cookie）认证 API。需要在登录时拦截 token：

```js
import { chromium } from 'playwright';

let token = null;

page.on('response', async (r) => {
  if (r.url().includes('/auth/login') && r.status() === 200) {
    try {
      const body = await r.json();
      token = body?.access_token || body?.token;
    } catch(e) {}
  }
});

await page.goto('https://example.com/login', { waitUntil: 'networkidle' });
await page.fill('input[type="email"]', EMAIL);
await page.fill('input[type="password"]', PASSWORD);
await page.click('button[type="submit"]');
await page.waitForTimeout(10000); // 等待 API 响应和页面跳转
```

### 2. SPA 页面内容提取

Angular/React 页面内容通过 JS 异步渲染。必须用 `networkidle` 等待：

```js
// ✅ 正确 — 等待所有 API 响应完成，Angular 组件渲染
await page.goto(url, { waitUntil: 'networkidle', timeout: 25000 });
await page.waitForTimeout(4000); // 额外等待组件渲染

// ❌ 错误 — domcontentloaded 时 SPA 内容通常还未渲染
await page.goto(url, { waitUntil: 'domcontentloaded' });
```

### 3. PDF 文件下载

**关键发现**：PDF 链接可能是无文本内容的 `<a>` 标签（只有图标），且 href 是 S3 签名 URL：

```js
// 查找 PDF 链接 — 用 href 而非文本内容匹配
const pdfLinks = await page.$$eval('a[href*=".pdf"]', els =>
  els.map(e => ({
    href: e.getAttribute('href'),
    isFlightPack: e.href.includes('flightpack'),
    isMindset: e.href.includes('mindset')
  }))
);

// 下载 — 关键：先创建 download promise，再点击
for (const link of pdfLinks) {
  const downloadPromise = page.waitForEvent('download', { timeout: 25000 });
  await page.click('a[href*="flightpack"]');  // 用 href 片段定位
  const download = await downloadPromise;
  await download.saveAs('/path/to/output.pdf');
}
```

**注意**：
- `waitForEvent('download')` 必须在 click 之前创建
- 用 `href*=` 选择器定位，不要用文本内容（可能是空的）
- S3 签名 URL 会过期，必须在浏览器会话中下载

### 4. API 数据提取（Bearer Token）

对于 API 驱动的 SPA，直接用 token 调 API 比解析 DOM 更高效：

```js
// 获取数据列表
const data = await page.evaluate(async (t) => {
  const r = await fetch('https://api.example.com/items?limit=500',
    { headers: { 'Authorization': `Bearer ${t}` } });
  const d = await r.json();
  return Array.isArray(d) ? d : (d?.data || []);
}, token);

// 批量获取详情 — 在单个 evaluate 内并行
const results = await page.evaluate(async ({ids, t}) => {
  const results = [];
  for (let i = 0; i < ids.length; i += 5) {  // 每批 5 个并行
    const batch = ids.slice(i, i + 5);
    const batchResults = await Promise.all(
      batch.map(id =>
        fetch(`https://api.example.com/detail/${id}`,
          { headers: { 'Authorization': `Bearer ${t}` } })
        .then(r => r.json())
        .catch(() => null)
      )
    );
    results.push(...batchResults);
  }
  return results;
}, { ids: itemIds, t: token });
```

**关键**：`page.evaluate` 只接受一个参数。多个参数需包装成对象：
```js
// ❌ 错误 — Too many arguments
page.evaluate(async (a, b, c) => {...}, valA, valB, valC)

// ✅ 正确 — 对象包装
page.evaluate(async ({a, b, c}) => {...}, {a: valA, b: valB, c: valC})
```

### 5. 断点续传

大批量任务必须支持断点续传：

```js
import { existsSync, writeFileSync, readFileSync } from 'fs';

// 进度文件
const PROGRESS_FILE = join(OUT_DIR, '_progress.json');

// 恢复进度
let done = 0, downloaded = 0;
try {
  const prev = JSON.parse(readFileSync(PROGRESS_FILE, 'utf8'));
  done = prev.done || 0;
  downloaded = prev.downloaded || 0;
} catch(e) {}

// 跳过已完成
for (const item of items.slice(done)) {
  const outFile = join(OUT_DIR, `${item.name}.pdf`);
  if (existsSync(outFile)) { done++; continue; }
  // ... download ...
  done++;
  // 每 N 个保存进度
  if (done % 20 === 0) {
    writeFileSync(PROGRESS_FILE, JSON.stringify({
      done, downloaded, last: item.name, ts: new Date().toISOString()
    }));
  }
}
```

## 常见陷阱

| 陷阱 | 现象 | 解决 |
|------|------|------|
| SPA 内容未渲染 | `document.querySelectorAll` 返回空 | 用 `networkidle` + 额外 `waitForTimeout` |
| Token 未捕获 | API 返回 401 | 确认 `page.on('response')` 在 `page.goto` 之前注册 |
| 下载事件丢失 | `waitForEvent` 超时 | download promise 必须在 click **之前**创建 |
| 多参数错误 | `Too many arguments` | 用对象包装：`{a, b, c}` |
| 日志缓冲不显示 | 长时间无 console 输出 | 用 `console.log` 而非 `process.stdout.write`；关键节点强制输出 |
| S3 签名过期 | 直接 curl 下载失败 | 必须在浏览器会话内通过 click 触发下载 |
| 链接无文本 | `:has-text()` 找不到 | 用 `[href*="keyword"]` 匹配 href 属性 |

## 完整示例

见 [references/country-navigator-example.md](references/country-navigator-example.md)

## 快速启动模板

```js
import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const OUT = '/path/to/output';
const BASE = 'https://example.com';

async function main() {
  mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ acceptDownloads: true });
  const page = await ctx.newPage();

  // 1. 捕获 token
  let token = null;
  page.on('response', async (r) => {
    if (r.url().includes('/auth/login') && r.status() === 200) {
      try { const b = await r.json(); token = b?.access_token; } catch(e) {}
    }
  });

  // 2. 登录
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.fill('input[type="email"]', 'user@example.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(10000);

  // 3. 获取列表（API 或 DOM）
  const items = await page.evaluate(async (t) => {
    const r = await fetch('https://api.example.com/items',
      { headers: { 'Authorization': `Bearer ${t}` } });
    return await r.json();
  }, token);

  // 4. 批量下载
  for (const item of items) {
    const outFile = join(OUT, `${item.name}.pdf`);
    if (existsSync(outFile)) continue;

    await page.goto(`${BASE}/detail/${item.id}`,
      { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(4000);

    const links = await page.$$eval('a[href*=".pdf"]',
      els => els.map(e => e.getAttribute('href')));

    for (const href of links) {
      const dp = page.waitForEvent('download', { timeout: 25000 });
      await page.click(`a[href*="${href.substring(href.length - 40)}"]`);
      await (await dp).saveAs(outFile);
    }
  }

  await browser.close();
}
main().catch(console.error);
```
