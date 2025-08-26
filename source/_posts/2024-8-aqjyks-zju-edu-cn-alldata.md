---
title: 浙大迎新“安全教育考试”全题库（2024版）
date: 2024-08-14T19:14:42+08:00
tags:
published: true
---
提示：2024年题库中存在“2024年新增题目”这一分类，不排除未来题库还会增加。

以下为截止到2024年暑期的题库+答案，如果你用Ctrl+F搜索，可能会有题目无法查到（也有可能所有题目都查不到）。

以下为数据集：

<!-- more -->

[client.exercise.bank.*](./2024-8-aqjyks-zju-edu-cn-alldata/data.html)

# how we got here

该请求获得所有`bank.id`

```http
GET http://www.aqjyks.zju.edu.cn/hd/examination/client/exercise/bank HTTP/1.1
Host: www.aqjyks.zju.edu.cn
Connection: keep-alive
Authorization: ...
User-Agent: Mozilla/5.0 (Linux; U; Android 13; zh-CN; V2219A Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.58 UWS/5.12.4.0 Mobile Safari/537.36 AliApp(DingTalk/7.6.6) com.alibaba.android.rimet/38636630 Channel/10003993 language/en-US abi/64 xpn/vivo UT4Aplus/0.2.25 colorScheme/light
Accept: */*
X-Requested-With: com.alibaba.android.rimet
Referer: http://www.aqjyks.zju.edu.cn/mobisso/?code=ST-1830611-jDthe60Wk6ZLd4oQJVdb-zju.edu.cn
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Cookie: ...
```

根据`id`，可以继续发起请求

```http
POST http://www.aqjyks.zju.edu.cn/hd/examination/client/exercise/bank/1810344516155719682 HTTP/1.1
Host: www.aqjyks.zju.edu.cn
Connection: keep-alive
Content-Length: 0
Authorization: ...
User-Agent: Mozilla/5.0 (Linux; U; Android 13; zh-CN; V2219A Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.58 UWS/5.12.4.0 Mobile Safari/537.36 AliApp(DingTalk/7.6.6) com.alibaba.android.rimet/38636630 Channel/10003993 language/en-US abi/64 xpn/vivo UT4Aplus/0.2.25 colorScheme/light
Content-Type: application/json
Accept: */*
Origin: http://www.aqjyks.zju.edu.cn
X-Requested-With: com.alibaba.android.rimet
Referer: http://www.aqjyks.zju.edu.cn/mobisso/?code=ST-1830611-jDthe60Wk6ZLd4oQJVdb-zju.edu.cn
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Cookie: ...
```
