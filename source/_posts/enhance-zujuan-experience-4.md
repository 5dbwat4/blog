---
title: 提升组卷网的使用体验（四）：绑定replaceSatae事件
date: 2023-12-23 17:29:47
tags:
 - Proj
---


本文发布于2023/12/23，此时，组卷网新增了一个离谱的前后端分离功能。

当你切换页码，以及调节筛选条件时，会有一个`/list`请求被发出，返回内容是json格式但是返回内容的主体是一个HTML字符串。

我的评价是不如使用pjax

但是这会使原先依赖于每一次页面运行时加载而实现的功能无法使用。为了解决这一问题可以绑定一个replaceState事件。

<!-- more -->

当然更好的情况是直接inject组卷网的js文件，在渲染功能的代码运行结束后在运行相关的函数但是这个过程比较复杂所以选择退而求其次（其实是因为我水平太差）

```javascript
const bindEventListener = function(type) {
   const historyEvent = history[type];
   return function() {
       const newEvent = historyEvent.apply(this, arguments);
      const e = new Event(type);
       e.arguments = arguments;
       window.dispatchEvent(e);
       return newEvent;
   };
};
history.pushState = bindEventListener('pushState');
history.replaceState = bindEventListener('replaceState');
window.addEventListener('replaceState', function(e) {
  console.log('THEY DID IT AGAIN! replaceState');
    setTimeout(()=>{
        exec00()
    },100)

});
window.addEventListener('pushState', function(e) {
  console.log('THEY DID IT AGAIN! pushState');
    exec00()
});
```