---
title: 我们如何获取《学英语报》的答案（已废弃）
date: 2022-12-22 21:34:25
tags: 
 - Schoolwork
 - Proj
---
如果你不在乎原理，可以直接前往[最后一节](#我只想要答案，原理什么的与我无关)。

# 原理

## 我们如何获得上一期报纸的答案

当我们将报纸翻到中缝的位置，我们就可以看到上一期报纸的答案，当然，这不是最主要的，更重要的是，在报纸的下面，我还可以看到有一个矩形的方框，里面有两个二维码，上面还写了一个6位资源码，还有一堆文字，告诉你，如果你扫描二维码，然后输入这六位资源码你就可以获得对应的资源。
如果你真的这么做了，你就可以获得上一期报纸的答案。

<!-- more -->

{% asset_img  1671718094976.png  "如图所示，这就是你能看到的页面"%}

## 但是，如何获得下一期报纸答案呢

首先我们来分析这个网页的网址

`https://www.xyybs.com/index.php?id=77418&m=wap&a=show&ewm=1&catid=152`

这个网址非常的有特色，因为其中有一个参数，叫做 `id`，它的值是一个5位数。~~当然也不一定是5位数，如果资源多了，它可能会是6位数（这是什么废话~~
接下来，我们试着把它的值从 `77147`改成 `77148`

{% asset_img 1671717222058.png  "于是，我们就得到了下一期报纸的答案" %}

我们可以合理的猜测，这个ID的值是递增的，并且是稠密的（后来试了一下，发现其实并不是，可能是有的ID被隐藏了，导致获取不了），但总之，我们只需要把它遍历一下，就可以获得全部的报纸答案。

```python
import requests,json
from bs4 import BeautifulSoup
import os

####CONFIG####
CONFIG={
    from:77999,
    to:79000,
    fn:"./data-ssa.txt"
}
##############

a=""


for i in range(CONFIG.from,CONFIG.to):
    cnt+=1
    req=requests.get("https://www.xyybs.com/index.php?m=wap&a=show&ewm=1&catid=152&id="+str(i),headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; rv:98.0) Gecko/20100101 Firefox/98.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Cache-Control": "max-age=0"}
    )
    soup = BeautifulSoup(req.content,'lxml')
    list= soup.find_all(class_="contentbox")
    try:
        print(str(i)+"-"+list[0].find("h3").text)
        a+=str(i)+"-"+list[0].find("h3").text+"\n"
        with open(CONFIG.fn,"w+",encoding="utf-8") as f:
            f.write(a)
    except IndexError:
        pass

```

它将会获取从 `CONFIG.from`到 `CONFIG.to`的所有资源，并保存到 `CONFIG.fn`中。

等到用的时候可以查找对应的资源名称。

## 小丑竟是我自己

*Update @ 2022-12-22*
刚在尝试各个参数的意思，然后突然发现小丑竟是我自己
先来介绍各参数的意义

`https://www.xyybs.com/index.php?<SearchParams>`

SearchParams:

| Key       | Value                                                                                                |
| --------- | ---------------------------------------------------------------------------------------------------- |
| `id`    | `INT`，资源的唯一标记                                                                              |
| `m`     | >`content`，电脑端<br />>`wap`，触屏端                                                           |
| `a`     | >`lists`，展示列表，仅对电脑端有效<br />>`show`，显示详情<br />>`init`，不理解，可能是初始状态 |
| `page`  | `INT`，页面序号                                                                                    |
| `catid` | `INT`，栏目ID                                                                                      |

所以开始尝试其他方案。

```js
(async()=>{
  document.body.style.display="none !important"
  let oo=[]
for(let i=1;i<76;i++){
  await fetch("https://www.xyybs.com/index.php?m=content&c=index&a=lists&catid=152&page="+i).then(v=>v.text()).then(v=>{
    document.body.innerHTML=v
    document.querySelectorAll(".list li a").forEach(q=>{
      oo.push({
        name:q.innerText,
        id:parseInt((new URL( q.href)).searchParams.get("id"))
      })
    })
  })
  console.log("p",i)
}
   var outputfile=new Blob([JSON.stringify(oo)],{ type:'text/plain' })
      var a=document.createElement("a")
    a.download = "list.json";
    a.href = URL.createObjectURL(outputfile);
    a.click()
})()
```

循环次数为页码数，它将会给出一个名称和id的对应。


{% raw %}

{% endraw %}


# 我只想要答案，原理什么的与我无关

我们会每隔2~3周检查一次江苏高二(N)的答案，进行整理，并合并成一个易于打印的文件。你现在就可以下载它们。

{% asset_link Output{6da8048f-8dfb-40d0-b17d-fb97f0c9f2a3}.pdf 20~25期答案 %}
{% asset_link Output{491865fd-4043-44ae-88e4-fc39d0d88d27}.pdf 16~19期答案 %}
{% asset_link Output.{A891ACF5-FAA4-9805-243A-AC4501AFED11}.pdf 1~15期答案 %}

如果你从上面没有找到你想要的答案，那有可能是我们没有整理，或者对应答案没有发出，你可以使用下面的Component

以下Component是对上述得到的map的一个封装

{% raw %}
<div id="Component-Injection-9sd77e"></div>
<script src="./how-we-get-the-answer-of-english-paper/5dbwat4-proj.blogc.core.main.7c43670905c8a81568be.js">
{% endraw %}

