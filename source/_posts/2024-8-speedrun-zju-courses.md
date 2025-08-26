---
title: “学在浙大”课程 体验优化脚本
date: 2024-08-12T17:23:19+08:00
tags:
published: true
---
提示：目前只包括以下类型。


| Type         | completion_criterion_key |               说明               |
| ------------ | ------------------------ | :-------------------------------: |
| online_video | completeness             | 课程视频 - 需累积观看 80%(含)以上 |
| material     | view                     | 资料 - 观看或下载所有参考资料附件 |
| page         | view                     |          页面 - 浏览页面          |

<!-- more -->

# 安装

核心js代码：[index.js](./2024-8-speedrun-zju-courses/index.js)

你需要用各种方法让这段代码在课程页面加载 ~~（怎么像个CTF题）~~

例如，你可以直接复制这段代码，粘贴在F12控制台中；或者放到Tempermonkey里面；或者动态加载。

{% raw %}

<video src="./2024-8-speedrun-zju-courses/output.webm"></video>

{% endraw %}

# How could it

## 课程视频

```http
POST /api/course/activities-read/855495 HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate, br, zstd
Accept-Language: en,zh-CN;q=0.9,zh;q=0.8,en-GB;q=0.7,en-US;q=0.6
Connection: keep-alive
Content-Length: 19
Content-Type: application/json
Cookie: ...
Host: courses.zju.edu.cn
Origin: https://courses.zju.edu.cn
Referer: https://courses.zju.edu.cn/course/73032/learning-activity/full-screen
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0
X-Requested-With: XMLHttpRequest
sec-ch-ua: "Not)A;Brand";v="99", "Microsoft Edge";v="127", "Chromium";v="127"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"

{"start":0,"end":120}
```

该API限制`start`到`end`之间至多120，所以要将视频的总长度除以120，各发一次请求。

```js
 for (let i = 0; i < MAXLENGTH / 120; i++) {
      const start = i * 120;
      const end = Math.min(MAXLENGTH, i * 120 + 120);

      await fetch(
        "https://courses.zju.edu.cn/api/course/activities-read/" + VID,
        {
          body: JSON.stringify({ start, end }),
          method: "POST",
          mode: "cors",
          credentials: "include",
        }
      );
}
```
