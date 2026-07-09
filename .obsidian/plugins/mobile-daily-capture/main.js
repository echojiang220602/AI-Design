var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var main_exports = {};
__export(main_exports, {
  default: () => MobileDailyCapturePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
const VIEW_TYPE = "mobile-daily-capture-view";
const DAILY_TEMPLATE_PATH = "+/_storage/42-template-\u6A21\u677F/time-\u65E5\u5FD7.md";
const PAGE_SIZE = 10;
const MAX_PREVIEW_LIMIT = 50;
const DEFAULT_SETTINGS = {
  storageMode: "daily",
  dailyFolder: "30-Time/34-Daily-\u65E5\u5FD7",
  dailyFileNameFormat: "{date}\uFF08{weekday}\uFF09",
  thoughtHeading: "\u6BCF\u65E5\u968F\u60F3",
  singleNotePath: "\u6BCF\u65E5\u968F\u60F3.md",
  openOnMobileStartup: true,
  openOnDesktopStartup: false
};
function pad(value) {
  return value.toString().padStart(2, "0");
}
function formatDateOnly(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
function getWeekdayShortName(date) {
  return ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"][date.getDay()];
}
function getWeekdayFullName(date) {
  return `\u5468${getWeekdayShortName(date)}`;
}
function formatDailyDate(date) {
  return `${formatDateOnly(date)}\uFF08${getWeekdayShortName(date)}\uFF09`;
}
function formatTime(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function formatDateTime(date) {
  return `${formatDateOnly(date)} ${formatTime(date)}`;
}
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function cleanHeadingText(value) {
  return value.trim().replace(/^#{1,6}\s*/, "").trim() || DEFAULT_SETTINGS.thoughtHeading;
}
function formatDailyFileName(format, date) {
  const safeFormat = format.trim() || "{date}";
  const fileName = safeFormat.replace(/\{date\}/g, formatDateOnly(date)).replace(/\{year\}/g, `${date.getFullYear()}`).replace(/\{month\}/g, pad(date.getMonth() + 1)).replace(/\{day\}/g, pad(date.getDate())).replace(/\{weekdayFull\}/g, getWeekdayFullName(date)).replace(/\{weekday\}/g, getWeekdayShortName(date));
  return fileName.endsWith(".md") ? fileName : `${fileName}.md`;
}
function joinVaultPath(folder, fileName) {
  const cleanFolder = folder.trim().replace(/^\/+|\/+$/g, "");
  return (0, import_obsidian.normalizePath)(cleanFolder ? `${cleanFolder}/${fileName}` : fileName);
}
function normalizeNotePath(path) {
  const cleanPath = (0, import_obsidian.normalizePath)(path.trim().replace(/^\/+/, "") || DEFAULT_SETTINGS.singleNotePath);
  return cleanPath.endsWith(".md") ? cleanPath : `${cleanPath}.md`;
}
function isHeading(line) {
  return /^#{1,6}\s+/.test(line);
}
function isThoughtHeading(line, heading) {
  const pattern = new RegExp(`^#{1,6}\\s*${escapeRegExp(cleanHeadingText(heading))}\\s*$`);
  return pattern.test(line.trim());
}
function buildEntry(text, date) {
  const lines = text.trim().split(/\r?\n/);
  const firstLine = lines.shift() ?? "";
  const rest = lines.map((line) => `  ${line}`);
  return [`- ${formatTime(date)} ${firstLine}`, ...rest].join("\n");
}
function buildSingleNoteEntry(text, title) {
  return `## ${title}

${text.trim()}`;
}
function insertThought(content, entry, heading) {
  const lines = content.split("\n");
  const cleanHeading = cleanHeadingText(heading);
  const existingHeadingIndex = lines.findIndex((line) => isThoughtHeading(line, cleanHeading));
  if (existingHeadingIndex >= 0) {
    let insertIndex2 = lines.length;
    for (let i = existingHeadingIndex + 1; i < lines.length; i++) {
      if (isHeading(lines[i]) || /^---\s*$/.test(lines[i])) {
        insertIndex2 = i;
        break;
      }
    }
    const before2 = lines.slice(0, insertIndex2);
    const after2 = lines.slice(insertIndex2);
    if (before2[before2.length - 1]?.trim()) before2.push("");
    before2.push(entry);
    before2.push("");
    return [...before2, ...after2].join("\n").replace(/\n{4,}/g, "\n\n\n");
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
function isThoughtEntryStart(line) {
  return /^-\s+\d{2}:\d{2}\s*/.test(line.trim());
}
function extractThoughts(content, heading) {
  const lines = content.split("\n");
  const headingIndex = lines.findIndex((line) => isThoughtHeading(line, heading));
  if (headingIndex < 0) return [];
  const thoughts = [];
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
function findThoughtRange(content, target, heading) {
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
function replaceThought(content, target, newBody, heading) {
  const lines = content.split("\n");
  const { startLine, endLine } = findThoughtRange(content, target, heading);
  const replacement = buildEntry(newBody, /* @__PURE__ */ new Date()).replace(/^- \d{2}:\d{2}/, `- ${target.time}`).split("\n");
  lines.splice(startLine, endLine - startLine + 1, ...replacement);
  return lines.join("\n");
}
function deleteThought(content, target, heading) {
  const lines = content.split("\n");
  const { startLine, endLine } = findThoughtRange(content, target, heading);
  let deleteEnd = endLine;
  if (lines[deleteEnd + 1] === "") deleteEnd++;
  lines.splice(startLine, deleteEnd - startLine + 1);
  return lines.join("\n").replace(/\n{4,}/g, "\n\n\n");
}
function isSingleEntryHeading(line) {
  return /^##\s+\S+/.test(line.trim());
}
function extractSingleNoteThoughts(content) {
  const lines = content.split("\n");
  const thoughts = [];
  let i = 0;
  while (i < lines.length) {
    const match = lines[i].trim().match(/^##\s+(.+)$/);
    if (!match) {
      i++;
      continue;
    }
    const startLine = i;
    const time = match[1].trim();
    const bodyLines = [];
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
function findSingleNoteThoughtRange(content, target) {
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
function insertSingleNoteThought(content, entry) {
  const cleanContent = content.replace(/\s+$/g, "");
  return cleanContent ? `${cleanContent}

${entry}
` : `${entry}
`;
}
function replaceSingleNoteThought(content, target, newBody) {
  const lines = content.split("\n");
  const { startLine, endLine } = findSingleNoteThoughtRange(content, target);
  const replacement = buildSingleNoteEntry(newBody, target.time).split("\n");
  lines.splice(startLine, endLine - startLine + 1, ...replacement);
  return lines.join("\n").replace(/\n{4,}/g, "\n\n\n");
}
function deleteSingleNoteThought(content, target) {
  const lines = content.split("\n");
  const { startLine, endLine } = findSingleNoteThoughtRange(content, target);
  let deleteEnd = endLine;
  while (lines[deleteEnd + 1] === "") deleteEnd++;
  lines.splice(startLine, deleteEnd - startLine + 1);
  return lines.join("\n").replace(/\n{4,}/g, "\n\n\n");
}
class DailyCaptureView extends import_obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.inputEl = null;
    this.previewEl = null;
    this.footerEl = null;
    this.visibleLimit = PAGE_SIZE;
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE;
  }
  getDisplayText() {
    return "\u6BCF\u65E5\u968F\u60F3";
  }
  getIcon() {
    return "message-square-plus";
  }
  async onOpen() {
    const root = this.containerEl.children[1];
    root.empty();
    root.addClass("mobile-daily-capture");
    const composer = root.createDiv({ cls: "mobile-daily-capture__composer" });
    composer.createDiv({ cls: "mobile-daily-capture__date", text: this.plugin.getCapturePath(/* @__PURE__ */ new Date()) });
    this.inputEl = composer.createEl("textarea", {
      cls: "mobile-daily-capture__input",
      attr: {
        placeholder: "\u8BB0\u5F55\u4E00\u70B9\u60F3\u6CD5...",
        rows: "7"
      }
    });
    const actions = composer.createDiv({ cls: "mobile-daily-capture__actions" });
    const openButton = actions.createEl("button", {
      cls: "mobile-daily-capture__secondary",
      text: "\u6253\u5F00\u7B14\u8BB0"
    });
    openButton.addEventListener("click", () => {
      void this.plugin.openCaptureNote();
    });
    const saveButton = actions.createEl("button", {
      cls: "mobile-daily-capture__primary",
      text: "\u4FDD\u5B58"
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
    preview.createDiv({ cls: "mobile-daily-capture__section-title", text: "\u4ECA\u5929\u7684\u968F\u60F3" });
    this.previewEl = preview.createDiv({ cls: "mobile-daily-capture__list" });
    this.footerEl = preview.createDiv({ cls: "mobile-daily-capture__footer" });
    await this.refreshPreview();
    window.setTimeout(() => this.inputEl?.focus(), 120);
  }
  async saveInput() {
    const value = this.inputEl?.value.trim() ?? "";
    if (!value) {
      new import_obsidian.Notice("\u5148\u5199\u4E00\u70B9\u5185\u5BB9");
      this.inputEl?.focus();
      return;
    }
    await this.plugin.saveThought(value);
    if (this.inputEl) this.inputEl.value = "";
    this.visibleLimit = PAGE_SIZE;
    await this.refreshPreview();
    this.inputEl?.focus();
    new import_obsidian.Notice("\u5DF2\u4FDD\u5B58\u5230\u6BCF\u65E5\u968F\u60F3");
  }
  async refreshPreview() {
    if (!this.previewEl) return;
    this.previewEl.empty();
    this.footerEl?.empty();
    const file = await this.plugin.getCaptureFile(false);
    if (!file) {
      this.previewEl.createDiv({
        cls: "mobile-daily-capture__empty",
        text: "\u8FD8\u6CA1\u6709\u76EE\u6807\u7B14\u8BB0\uFF0C\u4FDD\u5B58\u7B2C\u4E00\u6761\u968F\u60F3\u65F6\u4F1A\u81EA\u52A8\u521B\u5EFA\u3002"
      });
      return;
    }
    const content = await this.app.vault.cachedRead(file);
    const thoughts = this.plugin.extractThoughts(content);
    if (thoughts.length === 0) {
      this.previewEl.createDiv({
        cls: "mobile-daily-capture__empty",
        text: "\u4ECA\u5929\u8FD8\u6CA1\u6709\u968F\u60F3\u3002"
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
        text: `\u5DF2\u663E\u793A ${shown}/${total}`
      });
      if (shown < total) {
        const moreButton = this.footerEl.createEl("button", {
          cls: "mobile-daily-capture__secondary mobile-daily-capture__more",
          text: "\u5237\u65B0\u66F4\u591A"
        });
        moreButton.addEventListener("click", () => {
          this.visibleLimit = Math.min(this.visibleLimit + PAGE_SIZE, MAX_PREVIEW_LIMIT);
          void this.refreshPreview();
        });
      }
    }
  }
  async renderThought(file, thought) {
    if (!this.previewEl) return;
    const item = this.previewEl.createDiv({ cls: "mobile-daily-capture__item" });
    const contentEl = item.createDiv({ cls: "mobile-daily-capture__item-content" });
    await import_obsidian.MarkdownRenderer.render(this.app, thought.source, contentEl, file.path, this);
    const actions = item.createDiv({ cls: "mobile-daily-capture__item-actions" });
    const openButton = actions.createEl("button", {
      cls: "mobile-daily-capture__item-button",
      text: "\u8DF3\u8F6C"
    });
    openButton.addEventListener("click", () => {
      void this.plugin.openThought(thought);
    });
    const editButton = actions.createEl("button", {
      cls: "mobile-daily-capture__item-button",
      text: "\u7F16\u8F91"
    });
    editButton.addEventListener("click", () => {
      this.renderInlineEditor(item, thought);
    });
    const deleteButton = actions.createEl("button", {
      cls: "mobile-daily-capture__item-button mobile-daily-capture__item-button--danger",
      text: "\u5220\u9664"
    });
    deleteButton.addEventListener("click", async () => {
      if (!window.confirm("\u5220\u9664\u8FD9\u6761\u968F\u60F3\uFF1F")) return;
      await this.plugin.deleteThought(thought);
      await this.refreshPreview();
      new import_obsidian.Notice("\u968F\u60F3\u5DF2\u5220\u9664");
    });
  }
  renderInlineEditor(item, thought) {
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
      text: "\u53D6\u6D88"
    });
    cancelButton.addEventListener("click", () => {
      void this.refreshPreview();
    });
    const saveButton = actions.createEl("button", {
      cls: "mobile-daily-capture__item-button mobile-daily-capture__item-button--primary",
      text: "\u4FDD\u5B58"
    });
    saveButton.addEventListener("click", async () => {
      const value = editor.value.trim();
      if (!value) {
        new import_obsidian.Notice("\u5185\u5BB9\u4E0D\u80FD\u4E3A\u7A7A");
        editor.focus();
        return;
      }
      await this.plugin.updateThought(thought, value);
      await this.refreshPreview();
      new import_obsidian.Notice("\u968F\u60F3\u5DF2\u66F4\u65B0");
    });
    window.setTimeout(() => editor.focus(), 60);
  }
}
class MobileDailyCapturePlugin extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.settings = { ...DEFAULT_SETTINGS };
  }
  async onload() {
    await this.loadSettings();
    this.registerView(VIEW_TYPE, (leaf) => new DailyCaptureView(leaf, this));
    this.addSettingTab(new MobileDailyCaptureSettingTab(this.app, this));
    this.addCommand({
      id: "open-mobile-daily-capture",
      name: "\u6253\u5F00\u6BCF\u65E5\u968F\u60F3\u8F93\u5165\u9875",
      callback: () => {
        void this.activateView();
      }
    });
    this.addCommand({
      id: "open-today-daily-note",
      name: "\u6253\u5F00\u968F\u60F3\u4FDD\u5B58\u7B14\u8BB0",
      callback: () => {
        void this.openCaptureNote();
      }
    });
    this.app.workspace.onLayoutReady(() => {
      if (this.shouldOpenOnStartup()) void this.activateStartupView();
    });
  }
  onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);
  }
  async activateView() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE);
    if (existing.length > 0) {
      this.app.workspace.revealLeaf(existing[0]);
      return;
    }
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.setViewState({ type: VIEW_TYPE, active: true });
    this.app.workspace.revealLeaf(leaf);
  }
  shouldOpenOnStartup() {
    if (import_obsidian.Platform.isMobileApp || import_obsidian.Platform.isMobile) return this.settings.openOnMobileStartup;
    return this.settings.openOnDesktopStartup;
  }
  async activateStartupView() {
    await this.activateView();
    window.setTimeout(() => {
      void this.activateView();
    }, 600);
  }
  async saveThought(text) {
    const file = await this.getCaptureFile(true);
    if (!file) throw new Error("Capture note was not created.");
    if (this.settings.storageMode === "single") {
      const entry2 = buildSingleNoteEntry(text, formatDateTime(/* @__PURE__ */ new Date()));
      await this.app.vault.process(file, (content) => insertSingleNoteThought(content, entry2));
      return;
    }
    const entry = buildEntry(text, /* @__PURE__ */ new Date());
    await this.app.vault.process(file, (content) => insertThought(content, entry, this.getThoughtHeading()));
  }
  async updateThought(thought, text) {
    const file = await this.getCaptureFile(false);
    if (!file) throw new Error("Capture note was not found.");
    if (this.settings.storageMode === "single") {
      await this.app.vault.process(file, (content) => replaceSingleNoteThought(content, thought, text));
      return;
    }
    await this.app.vault.process(file, (content) => replaceThought(content, thought, text, this.getThoughtHeading()));
  }
  async deleteThought(thought) {
    const file = await this.getCaptureFile(false);
    if (!file) throw new Error("Capture note was not found.");
    if (this.settings.storageMode === "single") {
      await this.app.vault.process(file, (content) => deleteSingleNoteThought(content, thought));
      return;
    }
    await this.app.vault.process(file, (content) => deleteThought(content, thought, this.getThoughtHeading()));
  }
  async openCaptureNote() {
    const file = await this.getCaptureFile(true);
    if (!file) throw new Error("Capture note was not created.");
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(file);
  }
  async openThought(thought) {
    const file = await this.getCaptureFile(false);
    if (!file) throw new Error("Capture note was not found.");
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(file, {
      active: true,
      eState: { line: thought.startLine }
    });
  }
  async getCaptureFile(createIfMissing) {
    const path = this.getCapturePath(/* @__PURE__ */ new Date());
    const existing = this.app.vault.getAbstractFileByPath(path);
    if (existing instanceof import_obsidian.TFile) return existing;
    if (!createIfMissing) return null;
    await this.ensureParentFolder(path);
    const template = await this.getCaptureTemplate();
    await this.app.vault.create(path, template);
    const created = this.app.vault.getAbstractFileByPath(path);
    if (created instanceof import_obsidian.TFile) return created;
    throw new Error(`Failed to create capture note: ${path}`);
  }
  async getCaptureTemplate() {
    if (this.settings.storageMode === "single") {
      const title = this.settings.singleNotePath.split("/").pop()?.replace(/\.md$/i, "") || DEFAULT_SETTINGS.thoughtHeading;
      return `# ${title}

`;
    }
    const templateFile = this.app.vault.getAbstractFileByPath(DAILY_TEMPLATE_PATH);
    if (templateFile instanceof import_obsidian.TFile) {
      return await this.app.vault.cachedRead(templateFile);
    }
    return `# ${formatDateOnly(/* @__PURE__ */ new Date())}

## ${this.getThoughtHeading()}

`;
  }
  extractThoughts(content) {
    if (this.settings.storageMode === "single") return extractSingleNoteThoughts(content);
    return extractThoughts(content, this.getThoughtHeading());
  }
  getThoughtHeading() {
    return cleanHeadingText(this.settings.thoughtHeading);
  }
  getStorageModeLabel() {
    return this.settings.storageMode === "single" ? "\u5355\u4E00\u7B14\u8BB0" : "\u6BCF\u65E5\u65E5\u5FD7";
  }
  getTodayDailyPath(date) {
    return joinVaultPath(
      this.settings.dailyFolder,
      formatDailyFileName(this.settings.dailyFileNameFormat, date)
    );
  }
  getCapturePath(date) {
    if (this.settings.storageMode === "single") return normalizeNotePath(this.settings.singleNotePath);
    return this.getTodayDailyPath(date);
  }
  async ensureParentFolder(path) {
    const parts = path.split("/");
    parts.pop();
    if (parts.length === 0) return;
    let currentPath = "";
    for (const part of parts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const existing = this.app.vault.getAbstractFileByPath(currentPath);
      if (existing instanceof import_obsidian.TFolder) continue;
      if (existing) throw new Error(`Path exists and is not a folder: ${currentPath}`);
      await this.app.vault.createFolder(currentPath);
    }
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  refreshOpenViews() {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
      if (leaf.view instanceof DailyCaptureView) void leaf.view.refreshPreview();
    }
  }
}
class MobileDailyCaptureSettingTab extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Mobile Daily Capture" });
    new import_obsidian.Setting(containerEl).setName("\u624B\u673A\u7AEF\u542F\u52A8\u65F6\u6253\u5F00").setDesc("\u5728\u624B\u673A\u7AEF\u6253\u5F00 Obsidian \u540E\uFF0C\u81EA\u52A8\u8FDB\u5165\u6BCF\u65E5\u968F\u60F3\u8F93\u5165\u9875\u3002").addToggle((toggle) => {
      toggle.setValue(this.plugin.settings.openOnMobileStartup).onChange(async (value) => {
        this.plugin.settings.openOnMobileStartup = value;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u7535\u8111\u7AEF\u542F\u52A8\u65F6\u6253\u5F00").setDesc("\u5728\u7535\u8111\u7AEF\u6253\u5F00 Obsidian \u540E\uFF0C\u81EA\u52A8\u8FDB\u5165\u6BCF\u65E5\u968F\u60F3\u8F93\u5165\u9875\u3002").addToggle((toggle) => {
      toggle.setValue(this.plugin.settings.openOnDesktopStartup).onChange(async (value) => {
        this.plugin.settings.openOnDesktopStartup = value;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u4FDD\u5B58\u6A21\u5F0F").setDesc("\u9009\u62E9\u628A\u968F\u60F3\u4FDD\u5B58\u5230\u6BCF\u5929\u7684\u65E5\u5FD7\uFF0C\u6216\u4FDD\u5B58\u5230\u4E00\u7BC7\u56FA\u5B9A\u7B14\u8BB0\u3002").addDropdown((dropdown) => {
      dropdown.addOption("daily", "\u6BCF\u65E5\u65E5\u5FD7").addOption("single", "\u5355\u4E00\u7B14\u8BB0").setValue(this.plugin.settings.storageMode).onChange(async (value) => {
        this.plugin.settings.storageMode = value;
        await this.plugin.saveSettings();
        this.plugin.refreshOpenViews();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u5355\u4E00\u7B14\u8BB0\u8DEF\u5F84").setDesc("\u4FDD\u5B58\u6A21\u5F0F\u4E3A\u201C\u5355\u4E00\u7B14\u8BB0\u201D\u65F6\u4F7F\u7528\u3002\u6BCF\u6761\u968F\u60F3\u4F1A\u4EE5\u201C## YYYY-MM-DD HH:mm\u201D\u4F5C\u4E3A\u4E8C\u7EA7\u6807\u9898\u3002").addText((text) => {
      text.setPlaceholder("\u6BCF\u65E5\u968F\u60F3.md").setValue(this.plugin.settings.singleNotePath).onChange(async (value) => {
        this.plugin.settings.singleNotePath = normalizeNotePath(value);
        await this.plugin.saveSettings();
        this.plugin.refreshOpenViews();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u65E5\u5FD7\u6587\u4EF6\u5939").setDesc("\u6BCF\u65E5\u65E5\u5FD7\u6240\u5728\u6587\u4EF6\u5939\u3002\u7559\u7A7A\u5219\u4FDD\u5B58\u5230 Vault \u6839\u76EE\u5F55\u3002").addText((text) => {
      text.setPlaceholder("30-Time/34-Daily-\u65E5\u5FD7").setValue(this.plugin.settings.dailyFolder).onChange(async (value) => {
        this.plugin.settings.dailyFolder = value.trim();
        await this.plugin.saveSettings();
        this.plugin.refreshOpenViews();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u65E5\u5FD7\u6587\u4EF6\u540D\u683C\u5F0F").setDesc("\u652F\u6301 {date}\u3001{year}\u3001{month}\u3001{day}\u3001{weekday}\u3001{weekdayFull}\u3002\u793A\u4F8B\uFF1A{date}\uFF08{weekday}\uFF09\u3002").addText((text) => {
      text.setPlaceholder("{date}").setValue(this.plugin.settings.dailyFileNameFormat).onChange(async (value) => {
        this.plugin.settings.dailyFileNameFormat = value.trim() || DEFAULT_SETTINGS.dailyFileNameFormat;
        await this.plugin.saveSettings();
        this.plugin.refreshOpenViews();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u4FDD\u5B58\u6807\u9898").setDesc("\u968F\u60F3\u4FDD\u5B58\u5230\u8FD9\u4E2A Markdown \u6807\u9898\u4E0B\u9762\u3002\u53EF\u586B\u5199\u201C\u6BCF\u65E5\u968F\u60F3\u201D\u6216\u201C## \u6BCF\u65E5\u968F\u60F3\u201D\u3002").addText((text) => {
      text.setPlaceholder("\u6BCF\u65E5\u968F\u60F3").setValue(this.plugin.settings.thoughtHeading).onChange(async (value) => {
        this.plugin.settings.thoughtHeading = cleanHeadingText(value);
        await this.plugin.saveSettings();
        this.plugin.refreshOpenViews();
      });
    });
  }
}
