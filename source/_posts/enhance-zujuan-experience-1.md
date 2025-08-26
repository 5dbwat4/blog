---
title: 提升组卷网的使用体验（一）：自动签到
date: 2023-12-20 22:51:00
tags:
  - Proj
---

本文旨在教您如何在不过分破费的情况下提升组卷网的使用体验。

## 自动签到

自动签到可谓是最易于实现的功能。在登陆情况下执行如下函数，即可获得稳定每日10积分。

```javascript
function autoscoresign() {
    /** 自动签到*/
    fetch("https://zujuan.xkw.com/ms-api/score_sign", {
        method: "POST"
    })
}
```

<!-- more -->

你可以将此功能写进tempermonkey，甚至自己写一个任务计划来完成这一工作