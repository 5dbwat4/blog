---
title: 浙大表单鉴权流程（2025/11版）
date: 2025-11-30T12:06:19+08:00
tags:
---

水一篇blog。


[![](https://opengraph.githubassets.com/token/5dbwat4/login-ZJU)](https://github.com/5dbwat4/login-ZJU)


[浙大表单](https://form.zju.edu.cn)拿到ticket后的鉴权，是访问`https://form.zju.edu.cn/dfi/validateLogin?ticket=[Redacted]&service=https%3A%2F%2Fform.zju.edu.cn%2F%23%2Fv2%2FhomePage`用ticket换token，ticket之前是直接传的，现在改了。

查阅代码找到：

```js
            var r = Object(u["a"])("encode", e, "zntb666666666666")
              , i = "/dfi/validateLogin?ticket=" + r + "&service=" + t
```

在watch处加一个`u["a"]`看到这个函数来自

```js
    "Oh/x": function(e, t, a) {
        "use strict";
        a.d(t, "a", (function() {
            return c
        }
        ));
        var n = a("aqBw")
          , r = a.n(n)
          , i = a("NFKh")
          , o = a.n(i);
        function s(e, t) {
            var a = o.a.AES.decrypt(e, o.a.MD5(t), {
                iv: [],
                mode: o.a.mode.ECB,
                padding: o.a.pad.Pkcs7
            })
              , n = a.toString(o.a.enc.Utf8);
            return n.toString()
        }
        function l(e, t) {
            var a = o.a.enc.Utf8.parse(e)
              , n = o.a.AES.encrypt(a, o.a.MD5(t), {
                iv: [],
                mode: o.a.mode.ECB,
                padding: o.a.pad.Pkcs7
            });
            return n.toString()
        }
        function c(e, t, a) {
            return t = "encode" == e ? r.a.encode(l(t, a)) : s(r.a.decode(t), a),
            t
        } // <---- HERE
    },
```

也就是`Base64(AES_enc(ticket, MD5("zntb666666666666")))`