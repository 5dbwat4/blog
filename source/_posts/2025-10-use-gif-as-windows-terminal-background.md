---
title: 使用动图作为 Windows Terminal 背景
date: 2025-10-22T13:37:16+08:00
tags:
---

Windows Terminal 原生支持使用动图作为背景。

![](demo.png)

Step 1: `Ctrl + ,`进入设置

Step 2: 左侧列表配置文件，可以选择“默认值”或者在下面选择你希望修改的具体配置文件

“命令提示符”对应的是`cmd`，“Windows PowerShell”对应的是`powershell`。

Step 3: 选中，下滑到“外观”点击

Step 4: 在“背景图片路径”中选择你的动图文件，背景图像不透明度选择100%（后者可以修改）

现在问题来了：我找不到我的mp4文件怎么办？

答曰：它只支持`All supported Bitmap Image Types ( *.jpg, *.jpeg, *.png, *.bmp, *.gif, *.tiff, *.ico )`，**冷知识：gif也是Bitmap Image Type，虽然它可以是animated**，所以需要把mp4转换成gif。

ffmpeg可以直接转换：

```bash
ffmpeg -i input.mp4 output.gif
```

转换后的gif文件就可以直接作为背景图使用了。

<!-- more -->