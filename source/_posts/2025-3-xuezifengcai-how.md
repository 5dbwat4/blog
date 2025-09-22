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

**如果你对于HTML、CSS等概念相当清楚，那么你可能会觉得本文有点啰嗦、有点傻。这是合理的，这种情况下，你完全可以无视本文。**

# Step-by-step how

1. 打开*webplus编辑器*，请注意其中的**代码**功能，我们马上会经常要用到它；

> 名词解释：*webplus编辑器*，是以`https://webplus.zju.edu.cn/index.jsp`开头的一个网页，是你觉得非常难用的那个编辑器，与后文出现的VS Code不要混淆；**代码**功能 或 **代码**界面 ，请看下图，单击后进入

![](s1-1.png)

2. 这一步的目的是获得**图片的最终URL**，你需要使用上传图片功能，将所有同学提供的照片上传上去，然后**保存一次**，然后重新进入*webplus编辑器*页面，进入**代码**界面，你应当能看到类似以下内容：

![](s2-2.png)

**Q: 如果我看到的内容如下图所示怎么回事？**

![](s2-1.png)

**A: 你没有保存，你需要先保存一下才能看到如前所述的情况**

3. 现在需要你提取出每一张图片的`src`字段，这样的字段指的是`src="`到引号结束的部分。

例如：

![](ep.png)

通过这种方式，你获得了所有**图片的最终URL**，它们与学生姓名、座右铭一一对应。现在，我们将这几个字段称作`IMG_SRC`,`NAME`,`MOTTO`。

> Q: 我把照片弄混了/我不确定提取的东西对不对
> A: 在你提取的字段前加上`https://webplus.zju.edu.cn`，然后复制到浏览器中访问，正确的话，你应当能看到对应图片

4. 现在你可以开始编码了。打开你的VS Code，新建一个文件。

将以下内容复制到文件中

```html
<!-- Hello! 既然你看到了这里，说明你肯定是宣传委员吧。泥浙的编辑器确实是充斥着上世纪的风格，总之如果你想要一个好的展现效果，我有一个现成的展现方案，欢迎去我的博客：https://blog.5dbwat4.top/arch/2025-3-xuezifengcai-how 你也可以加我QQ:1426484228来了解详情--><style>
 @font-face {font-family: LXGW_wenkai;src: url("https://webplus.zju.edu.cn/_upload/article/images/d1/25/3d08ba194279a4250baac3f1ff29/52bd84d4-98cb-4bb8-92c7-80e0aa1c8ff9.png") format("truetype");}@font-face {font-family: PT-Serif;src: url("https://webplus.zju.edu.cn/_upload/article/images/d1/25/3d08ba194279a4250baac3f1ff29/ef088f33-b3d6-4ec4-92f6-6f29f9b02bd9.png") format("truetype");}.student-main {--n-bezier: cubic-bezier(0.4, 0, 0.2, 1);font-family:'PT-Serif','LXGW_WenKai',sans-serif;display: flex;width: 480px;max-width: 90%;min-width: 60%;border: 1px solid #efeff5;box-sizing: border-box;position: relative;border-radius: 3px;word-break: break-word;transition: color 0.3s var(--n-bezier), background-color 0.3s var(--n-bezier), box-shadow 0.3s var(--n-bezier), border-color 0.3s var(--n-bezier);padding: 26px;display: flex;flex-wrap: wrap;flex-direction: row;align-items: center;--background-opacity: 0.05;background-image: radial-gradient(circle at 28% 29%, rgba(237, 237, 237, var(--background-opacity)) 0 50%, rgba(136, 136, 136, var(--background-opacity)) 50% 100%), radial-gradient(circle at 8% 78%, rgba(156, 156, 156, var(--background-opacity)), rgba(156, 156, 156, var(--background-opacity)) 50%, rgba(37, 37, 37, var(--background-opacity)) 50%, rgba(37, 37, 37, var(--background-opacity)));background-size: cover;background-repeat: no-repeat;background-attachment: scroll;scroll-snap-align: center;}.turing-main {display: flex;gap: 24px;flex-direction: column;align-content: center;flex-wrap: wrap;width: calc(min(1200px, 100vw) - 30px);transform: translateX(-15px);padding-bottom: 48px;scroll-behavior: smooth;scroll-snap-type: y mandatory;}.student-main:hover {box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08), 0 3px 6px 0 rgba(0, 0, 0, 0.06), 0 5px 12px 4px rgba(0, 0, 0, 0.04);}.student-image {max-width: 140px !important;margin: 12px;}.student-description {display: flex;flex-direction: column;justify-content: center;padding-left: 48px;padding-top: 24px;padding-bottom: 24px;}.student-image-container {display: flex;align-content: center;flex-wrap: wrap;}.student-name {font-weight: 800;font-size: 1.4rem !important;}.student-motto {position: relative;margin-top: 2.5rem;margin-left: 0.5rem;}.student-motto::before {content: "“";position: absolute;top: -2.5rem;left: -2.5rem;font-size: 3rem;color: #eaeaea;font-family: kaiti;}.student-motto span {position: relative;}.disclaimer p {width: fit-content;margin: auto;}.disclaimer {position: relative;}@media (max-width: 960px) {.student-main {align-content: center;flex-wrap: wrap ;flex-direction: column }.student-description {display: flex;flex-direction: column;justify-content: center;padding-left: 0;padding-top: 1.5rem;padding-bottom: 0;width: 100%;align-content: center;flex-wrap: wrap;align-items: center;}.student-description p{text-align: center;}.student-motto{margin-top: 1.5rem;}}
</style><!-- The two tags below are necessary otherwise the resource will be removed from the server.--><img src="https://webplus.zju.edu.cn/_upload/article/images/d1/25/3d08ba194279a4250baac3f1ff29/52bd84d4-98cb-4bb8-92c7-80e0aa1c8ff9.png" style="display:none;" /><img src="https://webplus.zju.edu.cn/_upload/article/images/d1/25/3d08ba194279a4250baac3f1ff29/ef088f33-b3d6-4ec4-92f6-6f29f9b02bd9.png" style="display:none;" />

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

# 能不能更自动化一点

当然可以。这个自动化方案主要是自动化了第4步的内容。

## Part 1

现在你仍然需要完成上面的1,2,3步。你获得了`IMG_SRC`,`NAME`,`MOTTO`字段。用`|`符号隔开，一行一个，保存为文件`data.txt`。

以下是文件示例：

```plain
周X|/_upload/article/images/d1/25/3d08ba194279a4250baac3f1ff29/0ac39804-4cf5-4322-8e24-2197a9c0e6cd.jpg|苔花如米小，也学牡丹开。
张XX|/_upload/article/images/d1/25/3d08ba194279a4250baac3f1ff29/46f07047-ea19-4324-a40a-846f49c1fc68.jpg|我欲穿花寻路，直入白云深处，浩气展虹霓。
陈XX|/_upload/article/images/d1/25/3d08ba194279a4250baac3f1ff29/611bf2e7-b568-441e-bb57-a759fcebd414.jpg|愿识乾坤大，仍怜草木青。
朱XX|/_upload/article/images/d1/25/3d08ba194279a4250baac3f1ff29/951f6dc9-54ee-4e0e-a46b-d726ab21e598.jpg|知足常乐
丁X|/_upload/article/images/d1/25/3d08ba194279a4250baac3f1ff29/9ae79384-2bb6-4631-8786-fc851a845a3a.jpg|挫其锐，解其纷，和其光，同其尘
陈XX|/_upload/article/images/d1/25/3d08ba194279a4250baac3f1ff29/fe9b292f-a0cd-4ffa-aa07-311c0c17adfe.jpg|仁者不忧，勇者不惧
```

## Part 2

然后，打开你的VS Code，新建一个文件`generate.js`，将以下内容复制进去

```javascript
const fs = require("fs")

const data = (new String(fs.readFileSync("./data.txt"))).split("\n").filter(v => v).map(v => v.trim().split("|"))


const output = `    <!-- Hello! 既然你看到了这里，说明你肯定是宣传委员吧。泥浙的编辑器确实是充斥着上世纪的风格，总之如果你想要一个好的展现效果，我有一个现成的展现方案，欢迎去我的博客：https://blog.5dbwat4.top/arch/2025-3-xuezifengcai-how 你也可以加我QQ:1426484228来了解详情--><style>
  @font-face {
    font-family: LXGW_wenkai;
    src: url("https://webplus.zju.edu.cn/_upload/article/images/d1/25/3d08ba194279a4250baac3f1ff29/52bd84d4-98cb-4bb8-92c7-80e0aa1c8ff9.png") format("truetype");
  }
  @font-face {
    font-family: PT-Serif;
    src: url("https://webplus.zju.edu.cn/_upload/article/images/d1/25/3d08ba194279a4250baac3f1ff29/ef088f33-b3d6-4ec4-92f6-6f29f9b02bd9.png") format("truetype");
  }
  .student-main {
    --n-bezier: cubic-bezier(0.4, 0, 0.2, 1);
    font-family:'PT-Serif','LXGW_WenKai',sans-serif;
    display: flex;
    width: 480px;
    max-width: 90%;
    min-width: 60%;
    border: 1px solid #efeff5;
    box-sizing: border-box;
    position: relative;
    border-radius: 3px;
    word-break: break-word;
    transition: color 0.3s var(--n-bezier),
      background-color 0.3s var(--n-bezier),
      box-shadow 0.3s var(--n-bezier),
      border-color 0.3s var(--n-bezier);
    padding: 26px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;

    --background-opacity: 0.05;
        background-image: radial-gradient(circle at 28% 29%, rgba(237, 237, 237, var(--background-opacity)) 0 50%, rgba(136, 136, 136, var(--background-opacity)) 50% 100%), radial-gradient(circle at 8% 78%, rgba(156, 156, 156, var(--background-opacity)), rgba(156, 156, 156, var(--background-opacity)) 50%, rgba(37, 37, 37, var(--background-opacity)) 50%, rgba(37, 37, 37, var(--background-opacity)));
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: scroll;

    scroll-snap-align: center;
  }
 
  .turing-main {
    display: flex;
    gap: 24px;
    flex-direction: column;
    align-content: center;
    flex-wrap: wrap;
    width: calc(min(1200px, 100vw) - 30px);
    transform: translateX(-15px);
    padding-bottom: 48px;
    scroll-behavior: smooth;
    scroll-snap-type: y mandatory;
  }
  .student-main:hover {
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08),
      0 3px 6px 0 rgba(0, 0, 0, 0.06),
      0 5px 12px 4px rgba(0, 0, 0, 0.04);
  }
  .student-image {
    max-width: 140px !important;
    margin: 12px;
  }
  .student-description {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 48px;
    padding-top: 24px;
    padding-bottom: 24px;
  }
  .student-image-container {
    display: flex;
    align-content: center;
    flex-wrap: wrap;
  }
  .student-name {
    font-weight: 800;
    font-size: 1.4rem !important;
  }
  .student-motto {
    position: relative;
    margin-top: 2.5rem;
    margin-left: 0.5rem;
  }
  .student-motto::before {
    content: "“";
    position: absolute;
    top: -2.5rem;
    left: -2.5rem;
    font-size: 3rem;
    color: #eaeaea;
    font-family: kaiti;
  }
  .student-motto span {
    position: relative;
  }
  .disclaimer p {
    width: fit-content;
    margin: auto;
  }
  .disclaimer {
    position: relative;
  }
   @media (max-width: 960px) {
    .student-main {
          align-content: center;
          flex-wrap: wrap ;
          flex-direction: column
    }
    .student-description {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 0;
    padding-top: 1.5rem;
    padding-bottom: 0; 
    width: 100%;
    align-content: center;
    flex-wrap: wrap;
    align-items: center;

    }
    .student-description p{
      text-align: center;
    }
    .student-motto{
          margin-top: 1.5rem;
    }
  }
</style>
<!-- The two tags below are necessary otherwise the resource will be removed from the server.-->
<img src="https://webplus.zju.edu.cn/_upload/article/images/d1/25/3d08ba194279a4250baac3f1ff29/52bd84d4-98cb-4bb8-92c7-80e0aa1c8ff9.png" style="display:none;" />
<img src="https://webplus.zju.edu.cn/_upload/article/images/d1/25/3d08ba194279a4250baac3f1ff29/ef088f33-b3d6-4ec4-92f6-6f29f9b02bd9.png" style="display:none;" />

<main class="turing-main">
    <div class="disclaimer">
        <p>（排名不分先后）</p>
      </div>
                          
                          
${data.map(d => `

           <div class="student-main">
   <div class="student-image-container">
     <img
       src="https://webplus.zju.edu.cn${d[1]}"
       alt="${d[0]}的个人照片"
       class="student-image"
     />
   </div>
   <div class="student-description">
     <p class="student-name">${d[0]}</p>
     <p class="student-motto"><span>${d[2]}</span></p>
   </div>
 </div>
`).join("")} 
</main>`


fs.writeFileSync("out.txt", output)
```

保存。

【现在你的文件夹中应当有`data.txt`和`generate.js`两个文件。】

## Part 3

接下来的步骤是为了配置Node.js环境，如果你已经配置好了，可以跳过该步骤。

前往 [Node.js官网](https://nodejs.org/en/download) ，下载并安装最新的LTS版本。

注意与`Add to PATH`相关的选项，确保它被选中。此外的部分保持默认即可。

安装完成后，打开命令行（Win+R，输入`cmd`，回车），输入`node -v`，如果你看到了版本号，说明安装成功。

## Part 4

在命令行中，使用`cd`命令进入到`data.txt`和`generate.js`所在的文件夹。

接下来，输入

```bash
node generate.js
```

将会生成一个`out.txt`文件，里面包含了完整的HTML代码。

接下来使用这个代码继续前文的第五步：将`out.txt`中的内容完整的复制到*webplus编辑器*的**代码**区域（替换掉原有的内容），单击保存。