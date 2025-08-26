---
title: 图灵班“学子风采”排版速通
date: 2025-03-17T15:25:19+08:00
tags:
---


我猜只有图灵班每届的宣传委员才有读这篇文章的欲望。总之，泥浙的编辑器确实是充斥着上世纪的风格，如果你想要一个好的展现效果，这里有一个现成的展现方案。


![效果](showcase.png)

[在这里查看demo](https://webplus.zju.edu.cn/turingclass_cn/tl2002/list.psp)

<!-- more -->

请注意：我们假定你是一个**智力正常**，有**基本代码基础**的**图灵班学生**，且**对HTML一无所知或所知甚少**

# Step-by-step how

1. 打开*webplus编辑器*，请注意其中的**代码**功能，我们马上会经常要用到它；

> 名词解释：*webplus编辑器*，是以`https://webplus.zju.edu.cn/index.jsp`开头的一个网页，是你觉得非常难用的那个编辑器，与后文出现的VS Code不要混淆；**代码**功能 或 **代码**界面 ，请看下图红框部分，单击后进入

![](s1-1.png)

2. 这一步的目的是获得**图片的最终URL**，你需要使用上传图片功能，将所有同学提供的照片上传上去，然后**保存一次**，然后重新进入*webplus编辑器*页面，进入**代码**界面，你应当能看到类似以下内容：

![](s2-2.png)

**Q: 如果我看到的内容如下图所示怎么回事？**

![](s2-1.png)

**A: 你没有保存，你需要先保存一下才能看到如前所述的情况**

3. 现在需要你提取出每一张图片的`src`字段，这样的字段指的是`src="`到引号结束的部分。

例如，对于`<img data-layer="photo" src="/_upload/article/images/d1/25/aaaaaaaaaaaaaaaaaaaaaaaaaaaa/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa.jpg" original-src="/_upload/article/images/d1/25/aaaaaaaaaaaaaaaaaaaaaaaaaaaa/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa_d.jpg" style="float:none;" sudyfile-attr="{'title':'28661346B01C6BA015F946AF61A2D30B.jpg'}" />`，你应当提取出`/_upload/article/images/d1/25/aaaaaaaaaaaaaaaaaaaaaaaaaaaa/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa.jpg`

通过这种方式，你获得了所有**图片的最终URL**，它们与学生姓名、座右铭一一对应。现在，我们将这几个字段称作`IMG_SRC`,`NAME`,`MOTTO`。

> Q: 我把照片弄混了/我不确定提取的东西对不对
> A: 在你提取的字段前加上`https://webplus.zju.edu.cn`，然后复制到浏览器中访问，正确的话，你应当能看到对应图片

4. 现在你可以开始编码了。打开你的VS Code，新建一个文件。

将以下内容复制到文件中

```html
<!-- Hello! 既然你看到了这里，说明你肯定是宣传委员吧。泥浙的编辑器确实是充斥着上世纪的风格，总之如果你想要一个好的展现效果，我有一个现成的展现方案，欢迎去我的博客 blog.5dbwat4.top/arch/2025-3-xuezifengcai-how -->
<style>.student-main {  --n-bezier: cubic-bezier(0.4, 0, 0.2, 1);  display: flex;  width: 480px;  max-width: 90%;  min-width: 60%;  border: 1px solid #efeff5;  box-sizing: border-box;  position: relative;  border-radius: 3px;  word-break: break-word;  transition: color 0.3s var(--n-bezier),    background-color 0.3s var(--n-bezier),    box-shadow 0.3s var(--n-bezier),    border-color 0.3s var(--n-bezier);  padding: 26px;  display: flex;  flex-wrap: wrap;  flex-direction: row;  align-items: center;}.turing-main {  display: flex;  gap: 24px;  flex-direction: column;  align-content: center;  flex-wrap: wrap;  width: calc(min(1200px, 100vw) - 30px );  transform: translateX(-15px);  padding-bottom: 48px;}.student-main:hover{  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, .08), 0 3px 6px 0 rgba(0, 0, 0, .06), 0 5px 12px 4px rgba(0, 0, 0, .04);;}.student-image {  max-width: 140px !important;  margin: 12px;}.student-description {  display: flex;  flex-direction: column;  justify-content: center;  padding-left: 48px;  padding-top: 24px;  padding-bottom: 24px;}.student-image-container {  display: flex;  align-content: center;  flex-wrap: wrap;}.student-name {  font-weight: 800;  font-size: 1.4rem !important;}.student-motto {  position: relative;  margin-top: 2.5rem;  margin-left: 0.5rem;}.student-motto::before {  content: "“";  position: absolute;  top: -2.5rem;  left: -2.5rem;  font-size: 3rem;  color: #eaeaea;  font-family: kaiti;}.student-motto span {  position: relative;}.disclaimer p{  width: fit-content;  margin: auto;}.disclaimer{  position: relative;}</style>

<main class="turing-main">
    <div class="disclaimer">
        <p>（排名不分先后）</p>
      </div>
<!-- HERE WILL LAY STUDENTS PERSONAL INFORMATION -->
</main>
```

有没有发现上面的代码中包含了`<!-- HERE WILL LAY STUDENTS PERSONAL INFORMATION -->`这样的字段？现在删除它（包括两侧的`<!-- -->`），并记住其位置。接下来你写的内容应当被放在该位置上。

你需要对第三步中的**每一组**`IMG_SRC`,`NAME`,`MOTTO`，替换在以下代码中

```html
<div class="student-main">
  <div class="student-image-container">
    <img
      src="IMG_SRC"
      alt="NAME的个人照片"
      class="student-image"
    />
  </div>
  <div class="student-description">
    <p class="student-name">NAME</p>
    <p class="student-motto">MOTTO</p>
  </div>
</div>
```

（注意上述代码中有共4处需要替换的内容）

将你写出来的内容依次排列在上文中`<!-- HERE WILL LAY STUDENTS PERSONAL INFORMATION -->`的位置。

5. 现在，你获得了一份完整的代码，复制到*webplus编辑器*的**代码**区域，单击保存，大功告成。