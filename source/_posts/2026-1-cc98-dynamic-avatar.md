---
title: 一种全新的CC98动态头像实现方案
date: 2026-01-26T04:12:57+08:00
tags:
---



![发表于 2025-11-25 11:02:57](image.png)

好吧其实原理也不复杂~~怎么能给我B出这么多话来~~。

# 背景

在CC98论坛中搜索“动态头像”，最新的帖子：<font face="kaiti">【论坛指南】现在论坛是无法更换动态头像了嘛？ https://www.cc98.org/topic/6254514 复制本链接到浏览器或者打开【CC98】微信小程序查看~</font>，发表于2025-08-07，帖子中提到，“现在论坛是无法更换动态头像了”“已经有动态头像的还能继续用，想新换的换不了了”

# 原理

## CC98后端怎么拦的

经过测试，上传头像的部分（`POST https://api.cc98.org/file/portrait`），如果使用动态头像（GIF格式），会被修正成静态头像格式。

基于Try to break things and trigger errors的思路，对后端实现的推测是：对于上传的不同类型文件，后端会有不同的库来进行处理。众所周知，WebP格式是可以包含动画的，那么，如果上传WebP格式的动态头像，后端会不会也把它修正成静态头像呢？~~经过测试，~~<span style="font-size:small">当时好像试了一下，具体能不能行忘了，但是不失为一种思路</span>。

总之上传头像之后后端会返回头像链接，我们还需要`PUT https://api.cc98.org/user/portrait`来把头像URL设置为当前头像。

过去的帖子都是在这个方面做文章的，比如<font face="kaiti">【论坛指南】分享一个设置动态头像的方法~ https://www.cc98.org/topic/4870862 复制本链接到浏览器或者打开【CC98】微信小程序查看~</font>，就是在这方面做的文章。

那这自然得狠狠封堵，怎么堵呢？把头像上传和其它上传的storage分开来不就行了。

所以头像上传跑到了`https://file.cc98.org/v4-upload/p/...`下面，而其它上传内容跑到了`https://file.cc98.org/v4-upload/d/...`下面。后端验证也是相当简单啊，（经过测试，它必须严格以`https://file.cc98.org/v4-upload/p/`或`http://file.cc98.org/v4-upload/p/`开头，且大小写无所谓），那感觉就没法绕过了，要么想办法让帖子上传的内容跑到`/p/`里面（？）<span style="font-size:small">这个真没试过，不过应该不可行</span>。

## 欸

那`/p/../d/`呢？还真可以。

# 说了这么多，我该怎么办？

参照[这个帖子](https://www.cc98.org/topic/4870862)找到图片URL，

填入到下面的第一行

```js
const IMAGE_URL = 'https://file.cc98.org/v4-upload/d/xxxxxx.gif';// 替换为你的动态头像URL

fetch("https://api.cc98.org/me/portrait", {
  "headers": {
    "authorization": (localStorage.getItem("accessToken")||(console.error("请先登录！"), "")).replace("str-", ""),
    "content-type": "application/json",
  },
  "body": `"${IMAGE_URL.replace("/d/", "/p/../d/")}"`,
  "method": "PUT",
});
```

然后在浏览器控制台执行即可。