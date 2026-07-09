module.exports = async (tp) => {

  const sourceImageFolder = "assets/images";  
  const targetNoteFolder  = "images-notes";

  const vault = tp.app.vault;

  // 确保目标文件夹存在
  if (!vault.getAbstractFileByPath(targetNoteFolder)) {
    await vault.createFolder(targetNoteFolder);
  }

  const folder = vault.getAbstractFileByPath(sourceImageFolder);
  if (!folder || !folder.children) {
    new Notice("❌ 找不到图片目录，请检查路径");
    return;
  }

  const exts = ["jpg", "jpeg", "png", "gif", "svg", "webp"];
  const imageFiles = folder.children.filter(f =>
    !f.children && exts.includes(f.extension?.toLowerCase())
  );

  if (imageFiles.length === 0) {
    new Notice("⚠️ 没检测到图片文件");
    return;
  }

  let counter = 0;

  for (const img of imageFiles) {
    const basename = img.basename;
    const imgPath = `${sourceImageFolder}/${img.name}`;
    const notePath = `${targetNoteFolder}/${basename}.md`;

    if (vault.getAbstractFileByPath(notePath)) continue;

    const content = `---
title: ${basename}
image: ${imgPath}
created: ${tp.date.now("YYYY-MM-DD HH:mm")}
---

![](${imgPath})
`;

    await vault.create(notePath, content);
    counter++;
  }

  new Notice(`✅ 已为 ${counter} 张图片创建笔记！`);
};
