import {
  App,
  ItemView,
  MarkdownRenderer,
  normalizePath,
  Notice,
  Platform,
  Plugin,
  PluginSettingTab,
  Setting,
  TFile,
  TFolder,
  WorkspaceLeaf
} from "obsidian";

const VIEW_TYPE = "mobile-daily-capture-view";
const DAILY_TEMPLATE_PATH = "+/_storage/42-template-模板/time-日志.md";
const PAGE_SIZE = 10;
const MAX_PREVIEW_LIMIT = 50;

type StorageMode = "daily" | "single";

interface MobileDailyCaptureSettings {
  storageMode: StorageMode;
  dailyFolder: string;
  dailyFileNameFormat: string;
  thoughtHeading: string;
  singleNotePath: string;
  openOnMobileStartup: boolean;
  openOnDesktopStartup: boolean;
}

const DEFAULT_SETTINGS: MobileDailyCaptureSettings = {
  storageMode: "daily",
  dailyFolder: "30-Time/34-Daily-日志",
  dailyFileNameFormat: "{date}（{weekday}）",
  thoughtHeading: "每日随想",
  singleNotePath: "每日随想.md",
  openOnMobileStartup: true,
  openOnDesktopStartup: false
};

interface ThoughtEntry {
  startLine: number;
  endLine: number;
  time: string;
  body: string;
  source: string;
}

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

function formatDateOnly(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function getWeekdayShortName(date: Date): string {
  return ["日", "一", "二", "三", "四", "五", "六"][date.getDay()];
}

function getWeekdayFullName(date: Date): string {
  return `周${getWeekdayShortName(date)}`;
}

function formatDailyDate(date: Date): string {
  return `${formatDateOnly(date)}（${getWeekdayShortName(date)}）`;
}

function formatTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDateTime(date: Date): string {
  return `${formatDateOnly(date)} ${formatTime(date)}`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function cleanHeadingText(value: string): string {
  return value.trim().replace(/^#{1,6}\s*/, "").trim() || DEFAULT_SETTINGS.thoughtHeading;
}

function formatDailyFileName(format: string, date: Date): string {
  const safeFormat = format.trim() || "{date}";
  const fileName = safeFormat
    .replace(/\{date\}/g, formatDateOnly(date))
    .replace(/\{year\}/g, `${date.getFullYear()}`)
    .replace(/\{month\}/g, pad(date.getMonth() + 1))
    .replace(/\{day\}/g, pad(date.getDate()))
    .replace(/\{weekdayFull\}/g, getWeekdayFullName(date))
    .replace(/\{weekday\}/g, getWeekdayShortName(date));
  return fileName.endsWith(".md") ? fileName : `${fileName}.md`;
}

function joinVaultPath(folder: string, fileName: string): string {
  const cleanFolder = folder.trim().replace(/^\/+|\/+$/g, "");
  return normalizePath(cleanFolder ? `${cleanFolder}/${fileName}` : fileName);
}

function normalizeNotePath(path: string): string {
  const cleanPath = normalizePath(path.trim().replace(/^\/+/, "") || DEFAULT_SETTINGS.singleNotePath);
  return cleanPath.endsWith(".md") ? cleanPath : `${cleanPath}.md`;
}

function isHeading(line: string): boolean {
  return /^#{1,6}\s+/.test(line);
}

function isThoughtHeading(line: string, heading: string): boolean {
  const pattern = new RegExp(`^#{1,6}\\s*${escapeRegExp(cleanHeadingText(heading))}\\s*$`);
  return pattern.test(line.trim());
}

function buildEntry(text: string, date: Date): string {
  const lines = text.trim().split(/\r?\n/);
  const firstLine = lines.shift() ?? "";
  const rest = lines.map((line) => `  ${line}`);
  return [`- ${formatTime(date)} ${firstLine}`, ...rest].join("\n");
}

function buildSingleNoteEntry(text: string, title: string): string {
  return `## ${title}\n\n${text.trim()}`;
}

function insertThought(content: string, entry: string, heading: string): string {
  const lines = content.split("\n");
  const cleanHeading = cleanHeadingText(heading);
  const existingHeadingIndex = lines.findIndex((line) => isThoughtHeading(line, cleanHeading));

  if (existingHeadingIndex >= 0) {
    let insertIndex = lines.length;
    for (let i = existingHeadingIndex + 1; i < lines.length; i++) {
      if (isHeading(lines[i]) || /^---\s*$/.test(lines[i])) {
        insertIndex = i;
        break;
      }
    }

    const before = lines.slice(0, insertIndex);
    const after = lines.slice(insertIndex);
    if (before[before.length - 1]?.trim()) before.push("");
    before.push(entry);
    before.push("");
    return [...before, ...after].join("\n").replace(/\n{4,}/g, "\n\n\n");
  }

  const summaryIndex = lines.findIndex((line) => /^##\s+今日总结\s*$/.test(line.trim()));
  let insertIndex = summaryIndex >= 0 ? summaryIndex : lines.length;
  if (summaryIndex > 0 && /^---\s*$/.test(lines[summaryIndex - 2]?.trim())) {
    insertIndex = summaryIndex - 2;
  } else if (summaryIndex > 0 && /^---\s*$/.test(lines[summaryIndex - 1]?.trim())) {
    insertIndex = summaryIndex - 1;
  }

  const section = ["", `## ${cleanHeading}`, "", entry, ""];
  const before = lines.slice(0, insertIndex);
  const after = lines.slice(insertIndex);
  while (before.length > 0 && before[before.length - 1] === "") before.pop();
  return [...before, ...section, ...after].join("\n").replace(/\n{4,}/g, "\n\n\n");
}

function isThoughtEntryStart(line: string): boolean {
  return /^-\s+\d{2}:\d{2}\s*/.test(line.trim());
}

function extractThoughts(content: string, heading: string): ThoughtEntry[] {
  const lines = content.split("\n");
  const headingIndex = lines.findIndex((line) => isThoughtHeading(line, heading));
  if (headingIndex < 0) return [];

  const thoughts: ThoughtEntry[] = [];
  let i = headingIndex + 1;
  while (i < lines.length) {
    const line = lines[i];
    if (isHeading(line) || /^---\s*$/.test(line)) break;

    const match = line.trim().match(/^-\s+(\d{2}:\d{2})\s*(.*)$/);
    if (!match) {
      i++;
      continue;
    }

    const startLine = i;
    const bodyLines = [match[2] ?? ""];
    i++;
    while (i < lines.length) {
      const nextLine = lines[i];
      if (isHeading(nextLine) || /^---\s*$/.test(nextLine) || isThoughtEntryStart(nextLine)) break;
      bodyLines.push(nextLine.replace(/^\s{2}/, ""));
      i++;
    }

    const endLine = i - 1;
    thoughts.push({
      startLine,
      endLine,
      time: match[1],
      body: bodyLines.join("\n").trim(),
      source: lines.slice(startLine, endLine + 1).join("\n")
    });
  }
  return thoughts.reverse();
}

function findThoughtRange(content: string, target: ThoughtEntry, heading: string): { startLine: number; endLine: number } {
  const lines = content.split("\n");
  let startLine = target.startLine;
  let endLine = target.endLine;
  const currentSource = lines.slice(startLine, endLine + 1).join("\n");

  if (currentSource !== target.source) {
    const thoughts = extractThoughts(content, heading);
    const freshTarget = thoughts.find((thought) => thought.source === target.source);
    if (!freshTarget) throw new Error("Thought entry was not found.");
    startLine = freshTarget.startLine;
    endLine = freshTarget.endLine;
  }

  return { startLine, endLine };
}

function replaceThought(content: string, target: ThoughtEntry, newBody: string, heading: string): string {
  const lines = content.split("\n");
  const { startLine, endLine } = findThoughtRange(content, target, heading);
  const replacement = buildEntry(newBody, new Date()).replace(/^- \d{2}:\d{2}/, `- ${target.time}`).split("\n");
  lines.splice(startLine, endLine - startLine + 1, ...replacement);
  return lines.join("\n");
}

function deleteThought(content: string, target: ThoughtEntry, heading: string): string {
  const lines = content.split("\n");
  const { startLine, endLine } = findThoughtRange(content, target, heading);
  let deleteEnd = endLine;
  if (lines[deleteEnd + 1] === "") deleteEnd++;
  lines.splice(startLine, deleteEnd - startLine + 1);
  return lines.join("\n").replace(/\n{4,}/g, "\n\n\n");
}

function isSingleEntryHeading(line: string): boolean {
  return /^##\s+\S+/.test(line.trim());
}

function extractSingleNoteThoughts(content: string): ThoughtEntry[] {
  const lines = content.split("\n");
  const thoughts: ThoughtEntry[] = [];
  let i = 0;

  while (i < lines.length) {
    const match = lines[i].trim().match(/^##\s+(.+)$/);
    if (!match) {
      i++;
      continue;
    }

    const startLine = i;
    const time = match[1].trim();
    const bodyLines: string[] = [];
    i++;

    while (i < lines.length) {
      if (isSingleEntryHeading(lines[i])) break;
      bodyLines.push(lines[i]);
      i++;
    }

    const endLine = i - 1;
    const body = bodyLines.join("\n").trim();
    thoughts.push({
      startLine,
      endLine,
      time,
      body,
      source: lines.slice(startLine, endLine + 1).join("\n").trim()
    });
  }

  return thoughts.reverse();
}

function findSingleNoteThoughtRange(content: string, target: ThoughtEntry): { startLine: number; endLine: number } {
  const lines = content.split("\n");
  let startLine = target.startLine;
  let endLine = target.endLine;
  const currentSource = lines.slice(startLine, endLine + 1).join("\n").trim();

  if (currentSource !== target.source) {
    const thoughts = extractSingleNoteThoughts(content);
    const freshTarget = thoughts.find((thought) => thought.source === target.source);
    if (!freshTarget) throw new Error("Thought entry was not found.");
    startLine = freshTarget.startLine;
    endLine = freshTarget.endLine;
  }

  return { startLine, endLine };
}

function insertSingleNoteThought(content: string, entry: string): string {
  const cleanContent = content.replace(/\s+$/g, "");
  return cleanContent ? `${cleanContent}\n\n${entry}\n` : `${entry}\n`;
}

function replaceSingleNoteThought(content: string, target: ThoughtEntry, newBody: string): string {
  const lines = content.split("\n");
  const { startLine, endLine } = findSingleNoteThoughtRange(content, target);
  const replacement = buildSingleNoteEntry(newBody, target.time).split("\n");
  lines.splice(startLine, endLine - startLine + 1, ...replacement);
  return lines.join("\n").replace(/\n{4,}/g, "\n\n\n");
}

function deleteSingleNoteThought(content: string, target: ThoughtEntry): string {
  const lines = content.split("\n");
  const { startLine, endLine } = findSingleNoteThoughtRange(content, target);
  let deleteEnd = endLine;
  while (lines[deleteEnd + 1] === "") deleteEnd++;
  lines.splice(startLine, deleteEnd - startLine + 1);
  return lines.join("\n").replace(/\n{4,}/g, "\n\n\n");
}

class DailyCaptureView extends ItemView {
  private plugin: MobileDailyCapturePlugin;
  private inputEl: HTMLTextAreaElement | null = null;
  private previewEl: HTMLElement | null = null;
  private footerEl: HTMLElement | null = null;
  private visibleLimit = PAGE_SIZE;

  constructor(leaf: WorkspaceLeaf, plugin: MobileDailyCapturePlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE;
  }

  getDisplayText(): string {
    return "每日随想";
  }

  getIcon(): string {
    return "message-square-plus";
  }

  async onOpen(): Promise<void> {
    const root = this.containerEl.children[1] as HTMLElement;
    root.empty();
    root.addClass("mobile-daily-capture");

    const composer = root.createDiv({ cls: "mobile-daily-capture__composer" });
    composer.createDiv({ cls: "mobile-daily-capture__date", text: this.plugin.getCapturePath(new Date()) });
    this.inputEl = composer.createEl("textarea", {
      cls: "mobile-daily-capture__input",
      attr: {
        placeholder: "记录一点想法...",
        rows: "7"
      }
    });

    const actions = composer.createDiv({ cls: "mobile-daily-capture__actions" });
    const openButton = actions.createEl("button", {
      cls: "mobile-daily-capture__secondary",
      text: "打开笔记"
    });
    openButton.addEventListener("click", () => {
      void this.plugin.openCaptureNote();
    });

    const saveButton = actions.createEl("button", {
      cls: "mobile-daily-capture__primary",
      text: "保存"
    });
    saveButton.addEventListener("click", () => {
      void this.saveInput();
    });

    this.inputEl.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        void this.saveInput();
      }
    });

    const preview = root.createDiv({ cls: "mobile-daily-capture__preview" });
    preview.createDiv({ cls: "mobile-daily-capture__section-title", text: "今天的随想" });
    this.previewEl = preview.createDiv({ cls: "mobile-daily-capture__list" });
    this.footerEl = preview.createDiv({ cls: "mobile-daily-capture__footer" });

    await this.refreshPreview();
    window.setTimeout(() => this.inputEl?.focus(), 120);
  }

  private async saveInput(): Promise<void> {
    const value = this.inputEl?.value.trim() ?? "";
    if (!value) {
      new Notice("先写一点内容");
      this.inputEl?.focus();
      return;
    }

    await this.plugin.saveThought(value);
    if (this.inputEl) this.inputEl.value = "";
    this.visibleLimit = PAGE_SIZE;
    await this.refreshPreview();
    this.inputEl?.focus();
    new Notice("已保存到每日随想");
  }

  async refreshPreview(): Promise<void> {
    if (!this.previewEl) return;
    this.previewEl.empty();
    this.footerEl?.empty();

    const file = await this.plugin.getCaptureFile(false);
    if (!file) {
      this.previewEl.createDiv({
        cls: "mobile-daily-capture__empty",
        text: "还没有目标笔记，保存第一条随想时会自动创建。"
      });
      return;
    }

    const content = await this.app.vault.cachedRead(file);
    const thoughts = this.plugin.extractThoughts(content);
    if (thoughts.length === 0) {
      this.previewEl.createDiv({
        cls: "mobile-daily-capture__empty",
        text: "今天还没有随想。"
      });
      return;
    }

    const cappedThoughts = thoughts.slice(0, MAX_PREVIEW_LIMIT);
    const visibleThoughts = cappedThoughts.slice(0, this.visibleLimit);

    for (const thought of visibleThoughts) {
      await this.renderThought(file, thought);
    }

    if (this.footerEl) {
      const shown = Math.min(visibleThoughts.length, MAX_PREVIEW_LIMIT);
      const total = Math.min(cappedThoughts.length, MAX_PREVIEW_LIMIT);
      this.footerEl.createSpan({
        cls: "mobile-daily-capture__count",
        text: `已显示 ${shown}/${total}`
      });

      if (shown < total) {
        const moreButton = this.footerEl.createEl("button", {
          cls: "mobile-daily-capture__secondary mobile-daily-capture__more",
          text: "刷新更多"
        });
        moreButton.addEventListener("click", () => {
          this.visibleLimit = Math.min(this.visibleLimit + PAGE_SIZE, MAX_PREVIEW_LIMIT);
          void this.refreshPreview();
        });
      }
    }
  }

  private async renderThought(file: TFile, thought: ThoughtEntry): Promise<void> {
    if (!this.previewEl) return;

    const item = this.previewEl.createDiv({ cls: "mobile-daily-capture__item" });
    const contentEl = item.createDiv({ cls: "mobile-daily-capture__item-content" });
    await MarkdownRenderer.render(this.app, thought.source, contentEl, file.path, this);

    const actions = item.createDiv({ cls: "mobile-daily-capture__item-actions" });
    const openButton = actions.createEl("button", {
      cls: "mobile-daily-capture__item-button",
      text: "跳转"
    });
    openButton.addEventListener("click", () => {
      void this.plugin.openThought(thought);
    });

    const editButton = actions.createEl("button", {
      cls: "mobile-daily-capture__item-button",
      text: "编辑"
    });
    editButton.addEventListener("click", () => {
      this.renderInlineEditor(item, thought);
    });

    const deleteButton = actions.createEl("button", {
      cls: "mobile-daily-capture__item-button mobile-daily-capture__item-button--danger",
      text: "删除"
    });
    deleteButton.addEventListener("click", async () => {
      if (!window.confirm("删除这条随想？")) return;
      await this.plugin.deleteThought(thought);
      await this.refreshPreview();
      new Notice("随想已删除");
    });
  }

  private renderInlineEditor(item: HTMLElement, thought: ThoughtEntry): void {
    item.empty();
    const editor = item.createEl("textarea", {
      cls: "mobile-daily-capture__edit-input",
      attr: {
        rows: "5"
      }
    });
    editor.value = thought.body;

    const actions = item.createDiv({ cls: "mobile-daily-capture__edit-actions" });
    const cancelButton = actions.createEl("button", {
      cls: "mobile-daily-capture__item-button",
      text: "取消"
    });
    cancelButton.addEventListener("click", () => {
      void this.refreshPreview();
    });

    const saveButton = actions.createEl("button", {
      cls: "mobile-daily-capture__item-button mobile-daily-capture__item-button--primary",
      text: "保存"
    });
    saveButton.addEventListener("click", async () => {
      const value = editor.value.trim();
      if (!value) {
        new Notice("内容不能为空");
        editor.focus();
        return;
      }
      await this.plugin.updateThought(thought, value);
      await this.refreshPreview();
      new Notice("随想已更新");
    });

    window.setTimeout(() => editor.focus(), 60);
  }
}

export default class MobileDailyCapturePlugin extends Plugin {
  settings: MobileDailyCaptureSettings = { ...DEFAULT_SETTINGS };

  async onload(): Promise<void> {
    await this.loadSettings();
    this.registerView(VIEW_TYPE, (leaf) => new DailyCaptureView(leaf, this));
    this.addSettingTab(new MobileDailyCaptureSettingTab(this.app, this));

    this.addCommand({
      id: "open-mobile-daily-capture",
      name: "打开每日随想输入页",
      callback: () => {
        void this.activateView();
      }
    });

    this.addCommand({
      id: "open-today-daily-note",
      name: "打开随想保存笔记",
      callback: () => {
        void this.openCaptureNote();
      }
    });

    this.app.workspace.onLayoutReady(() => {
      if (this.shouldOpenOnStartup()) void this.activateStartupView();
    });
  }

  onunload(): void {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);
  }

  async activateView(): Promise<void> {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE);
    if (existing.length > 0) {
      this.app.workspace.revealLeaf(existing[0]);
      return;
    }

    const leaf = this.app.workspace.getLeaf(false);
    await leaf.setViewState({ type: VIEW_TYPE, active: true });
    this.app.workspace.revealLeaf(leaf);
  }

  private shouldOpenOnStartup(): boolean {
    if (Platform.isMobileApp || Platform.isMobile) return this.settings.openOnMobileStartup;
    return this.settings.openOnDesktopStartup;
  }

  private async activateStartupView(): Promise<void> {
    await this.activateView();
    window.setTimeout(() => {
      void this.activateView();
    }, 600);
  }

  async saveThought(text: string): Promise<void> {
    const file = await this.getCaptureFile(true);
    if (!file) throw new Error("Capture note was not created.");
    if (this.settings.storageMode === "single") {
      const entry = buildSingleNoteEntry(text, formatDateTime(new Date()));
      await this.app.vault.process(file, (content) => insertSingleNoteThought(content, entry));
      return;
    }

    const entry = buildEntry(text, new Date());
    await this.app.vault.process(file, (content) => insertThought(content, entry, this.getThoughtHeading()));
  }

  async updateThought(thought: ThoughtEntry, text: string): Promise<void> {
    const file = await this.getCaptureFile(false);
    if (!file) throw new Error("Capture note was not found.");
    if (this.settings.storageMode === "single") {
      await this.app.vault.process(file, (content) => replaceSingleNoteThought(content, thought, text));
      return;
    }

    await this.app.vault.process(file, (content) => replaceThought(content, thought, text, this.getThoughtHeading()));
  }

  async deleteThought(thought: ThoughtEntry): Promise<void> {
    const file = await this.getCaptureFile(false);
    if (!file) throw new Error("Capture note was not found.");
    if (this.settings.storageMode === "single") {
      await this.app.vault.process(file, (content) => deleteSingleNoteThought(content, thought));
      return;
    }

    await this.app.vault.process(file, (content) => deleteThought(content, thought, this.getThoughtHeading()));
  }

  async openCaptureNote(): Promise<void> {
    const file = await this.getCaptureFile(true);
    if (!file) throw new Error("Capture note was not created.");
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(file);
  }

  async openThought(thought: ThoughtEntry): Promise<void> {
    const file = await this.getCaptureFile(false);
    if (!file) throw new Error("Capture note was not found.");
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(file, {
      active: true,
      eState: { line: thought.startLine }
    });
  }

  async getCaptureFile(createIfMissing: boolean): Promise<TFile | null> {
    const path = this.getCapturePath(new Date());
    const existing = this.app.vault.getAbstractFileByPath(path);
    if (existing instanceof TFile) return existing;
    if (!createIfMissing) return null;

    await this.ensureParentFolder(path);
    const template = await this.getCaptureTemplate();
    await this.app.vault.create(path, template);
    const created = this.app.vault.getAbstractFileByPath(path);
    if (created instanceof TFile) return created;
    throw new Error(`Failed to create capture note: ${path}`);
  }

  private async getCaptureTemplate(): Promise<string> {
    if (this.settings.storageMode === "single") {
      const title = this.settings.singleNotePath.split("/").pop()?.replace(/\.md$/i, "") || DEFAULT_SETTINGS.thoughtHeading;
      return `# ${title}\n\n`;
    }

    const templateFile = this.app.vault.getAbstractFileByPath(DAILY_TEMPLATE_PATH);
    if (templateFile instanceof TFile) {
      return await this.app.vault.cachedRead(templateFile);
    }
    return `# ${formatDateOnly(new Date())}\n\n## ${this.getThoughtHeading()}\n\n`;
  }

  extractThoughts(content: string): ThoughtEntry[] {
    if (this.settings.storageMode === "single") return extractSingleNoteThoughts(content);
    return extractThoughts(content, this.getThoughtHeading());
  }

  getThoughtHeading(): string {
    return cleanHeadingText(this.settings.thoughtHeading);
  }

  getStorageModeLabel(): string {
    return this.settings.storageMode === "single" ? "单一笔记" : "每日日志";
  }

  getTodayDailyPath(date: Date): string {
    return joinVaultPath(
      this.settings.dailyFolder,
      formatDailyFileName(this.settings.dailyFileNameFormat, date)
    );
  }

  getCapturePath(date: Date): string {
    if (this.settings.storageMode === "single") return normalizeNotePath(this.settings.singleNotePath);
    return this.getTodayDailyPath(date);
  }

  private async ensureParentFolder(path: string): Promise<void> {
    const parts = path.split("/");
    parts.pop();
    if (parts.length === 0) return;

    let currentPath = "";
    for (const part of parts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const existing = this.app.vault.getAbstractFileByPath(currentPath);
      if (existing instanceof TFolder) continue;
      if (existing) throw new Error(`Path exists and is not a folder: ${currentPath}`);
      await this.app.vault.createFolder(currentPath);
    }
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  refreshOpenViews(): void {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
      if (leaf.view instanceof DailyCaptureView) void leaf.view.refreshPreview();
    }
  }
}

class MobileDailyCaptureSettingTab extends PluginSettingTab {
  plugin: MobileDailyCapturePlugin;

  constructor(app: App, plugin: MobileDailyCapturePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "Mobile Daily Capture" });

    new Setting(containerEl)
      .setName("手机端启动时打开")
      .setDesc("在手机端打开 Obsidian 后，自动进入每日随想输入页。")
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.openOnMobileStartup)
          .onChange(async (value) => {
            this.plugin.settings.openOnMobileStartup = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("电脑端启动时打开")
      .setDesc("在电脑端打开 Obsidian 后，自动进入每日随想输入页。")
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.openOnDesktopStartup)
          .onChange(async (value) => {
            this.plugin.settings.openOnDesktopStartup = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("保存模式")
      .setDesc("选择把随想保存到每天的日志，或保存到一篇固定笔记。")
      .addDropdown((dropdown) => {
        dropdown
          .addOption("daily", "每日日志")
          .addOption("single", "单一笔记")
          .setValue(this.plugin.settings.storageMode)
          .onChange(async (value) => {
            this.plugin.settings.storageMode = value as StorageMode;
            await this.plugin.saveSettings();
            this.plugin.refreshOpenViews();
          });
      });

    new Setting(containerEl)
      .setName("单一笔记路径")
      .setDesc("保存模式为“单一笔记”时使用。每条随想会以“## YYYY-MM-DD HH:mm”作为二级标题。")
      .addText((text) => {
        text
          .setPlaceholder("每日随想.md")
          .setValue(this.plugin.settings.singleNotePath)
          .onChange(async (value) => {
            this.plugin.settings.singleNotePath = normalizeNotePath(value);
            await this.plugin.saveSettings();
            this.plugin.refreshOpenViews();
          });
      });

    new Setting(containerEl)
      .setName("日志文件夹")
      .setDesc("每日日志所在文件夹。留空则保存到 Vault 根目录。")
      .addText((text) => {
        text
          .setPlaceholder("30-Time/34-Daily-日志")
          .setValue(this.plugin.settings.dailyFolder)
          .onChange(async (value) => {
            this.plugin.settings.dailyFolder = value.trim();
            await this.plugin.saveSettings();
            this.plugin.refreshOpenViews();
          });
      });

    new Setting(containerEl)
      .setName("日志文件名格式")
      .setDesc("支持 {date}、{year}、{month}、{day}、{weekday}、{weekdayFull}。示例：{date}（{weekday}）。")
      .addText((text) => {
        text
          .setPlaceholder("{date}")
          .setValue(this.plugin.settings.dailyFileNameFormat)
          .onChange(async (value) => {
            this.plugin.settings.dailyFileNameFormat = value.trim() || DEFAULT_SETTINGS.dailyFileNameFormat;
            await this.plugin.saveSettings();
            this.plugin.refreshOpenViews();
          });
      });

    new Setting(containerEl)
      .setName("保存标题")
      .setDesc("随想保存到这个 Markdown 标题下面。可填写“每日随想”或“## 每日随想”。")
      .addText((text) => {
        text
          .setPlaceholder("每日随想")
          .setValue(this.plugin.settings.thoughtHeading)
          .onChange(async (value) => {
            this.plugin.settings.thoughtHeading = cleanHeadingText(value);
            await this.plugin.saveSettings();
            this.plugin.refreshOpenViews();
          });
      });
  }
}
