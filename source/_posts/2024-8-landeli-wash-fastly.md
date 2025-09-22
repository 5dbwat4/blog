---
title: 某德力洗衣机预约功能分析
date: 2024-08-24T22:21:15+08:00
tags:
published: true
---



Updated @ 2025-8-20: 修改了标题和一些文本，未雨绸缪地移除了具体网址、商品名和教程

----

在军训期间，\*\*\*洗衣机尤其抢手，由于严重的供需不平衡关系，很难抢到一个时间正好（23:00）的洗衣机。甚至于，\*\*\*洗衣机可以预约3天的洗衣机，而在当天的凌晨零点，新放出来的后天的洗衣机已经抢完。一旦抢不到洗衣机，就必须手洗衣服，对军训一天、腰酸背疼的学生造成了严重负担。

对此，治本的方式就是增加洗衣机数量，最大程度缓解供需问题。但这并不明显可行，所以，以下是帮助你在抢洗衣机时如有神助的方法。

<!-- more -->


# 原理

## `POST https://api.******/orders/store`

参数为：


| query                 | 可选值      | 说明                                                   |
| --------------------- | ----------- | ------------------------------------------------------ |
| `count`               | 1           | 推测为预定洗衣机的数量，未测试                         |
| `deviceServerId`      | 一段24位hex | 未知                                                   |
| `predetermineTime`    | Timestamp   | 预定的时间                                             |
| `storeId`             | 一段24位hex | 店面编号，例如，玉湖7栋1楼为`5f375802c6e30100014256b6` |
| `physiologicalGender` | `M` or `F`  | 字面意思                                               |
| `exclusive`           | 0           | 未知                                                   |
| `sessionId`           | 一段字符串  | 字面意思，删了不影响                                   |

我们主要关心的是`predetermineTime`.

有这几种response.


| code | 说明                                                                                                                                          |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 200  | 创建未成功，返回data为一个数组，包含距离所选时间最近的两个可用时段。<br/>如果`predetermineTime`是一个过于超前的时间，那么数组可能只含有一个项 |
| 201  | 创建成功，返回data为一个Object，其中包含订单信息                                                                                              |
| 4xx  | 未登录/登录失效/Authorization错误                                                                                                             |

## 如何构建 Authorization

核心鉴权为请求Headers中的`Authorization`项目。

这是一个Base64值。

解码后，其值形如以下：

```plain
Bearer {"userId":"aaaaaaaaaaaaaaaaaaaaaaaa","time":1724507391097,"sign":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}
```

`time`是时间戳,`userId`经确认不会变化，问题是如何获得`sign`.

最终，在源码中找到以下片段：

```javascript
var t = this,
  n =
    localStorage.getItem("token") ||
    localStorage.getItem("timeToken");
if (n) {
  var r = localStorage.getItem("userId"),
    o = new Date().getTime(),
    a = V()(o + n),
    i = { userId: r, time: o, sign: a };
  (i = "Bearer " + d()(i)),
    (e.headers.common.Authorization = $.encode(i));
} else {
  var u = (function () {
    var e = window.navigator.userAgent.toLowerCase(),
      t = d()(e);
    /micromessenger/.test(e) && (t = "wechat");
    /alipayclient/.test(e) && (t = "alipay");
    /yunmaapp/.test(e) && (t = "yunma");
    /cloudpay/.test(e) && (t = "cloudpay");
    /dingtalk/.test(e) && (t = "dingtalk");
    return t;
  })();
```

我们可以确定：`d()`为`JSON.stringify`，`sign`仅与timestamp和`token`有关，且`userId`和`token`都可以从`localStorage`获取

所以`V()`是什么？

通过上下文，`V()`是`webpackJsonp`中一个编号为`NC6I`的包，通过遍历Chunks，最终找到这个包。

![感谢webpack不删copyright之恩](pic1.png)

所以`sign`就是`md5(timestamp + token)`，经测试成功。

```javascript
const NOWTime=(new Date()).getTime()
const authorization=Buffer.from("Bearer "+JSON.stringify(
    {
        "userId":UserId,
        "time":NOWTime,
        "sign":md5(""+NOWTime+TOKEN)
    }
)).toString("base64"),
```

## 如何获取`localStorage`

首先，我们需要`devTools`，所以我们启动浏览器，访问`wap.wash.ltd`，尝试登陆。

发现根本无法登录。该网页鉴权只能通过微信/支付宝/钉钉进行，换言之，只能在相关应用程序内置的`Webview`中访问应用。 ~~（也许有办法将这个过程放在外界容器中进行，但是我不会）~~

为了实现获取前文所需的`userId`和`token`，我们尝试重写页面，将相关代码送入webview中。

p.s. 这个过程还是不够亲民，希望有高手帮忙改进。

我们在`index.html`的body末尾中加入如下片段，然后用Fiddler的Auto Responder功能。

```html
<div
  id="pwned"
  style="display: block;position: fixed;top: 20px;bottom: 20pxwidth:600px;height:100px;overflow: scroll;"
>
  <h1>Your page has been pwned.</h1>
  <pre>UserId:  <span id="pwn__userId"></span></pre>
  <pre>Token:  <span id="pwn__token"></span></pre>
  <input id="exec000" /><button onclick="execCode___()">EXEC</button>
  <pre>Outputs:</pre>
  <div id="pwned_reqs"></div>
</div>
<script>
  function execCode___() {
    document
      .getElementById("pwned_reqs")
      .insertAdjacentHTML(
        "beforeend",
        "<pre>" + eval(document.getElementById("exec000").value) + "</pre>"
      );
  }

  (() => {
    document.getElementById("pwn__userId").innerText =
      localStorage.getItem("userId");
    document.getElementById("pwn__token").innerText =
      localStorage.getItem("token") || localStorage.getItem("timeToken");
  })();
</script>
```

随后用电脑端微信打开`wap.wash.ltd`，发现成功获取`userId`和`token`

# Fun Facts

- 在玉湖7栋1楼，一天的开始是2:19。换言之，你在一天最晚能订到大后天的2:19的洗衣机。
- 从后天往后所有的时间，在选择时间界面上都是“后天”