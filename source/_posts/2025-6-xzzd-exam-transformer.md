---
title: 学在浙大测验distribution数据美化
date: 2025-06-05T19:35:18+08:00
tags:
---
为了抢到CC98首发，造了一个小玩具把学在浙大distribution接口返回的json生肉转成熟肉

```js
const data = require("./distribution.json")


let op = "";
data.subjects.sort((a,b)=>a.id-b.id).forEach((item) => {
    op+="#"+item.id+" 难度："+item.difficulty_level+"\n"
    op+=item.description+"\n"
    op+="\n"
    op+=item.options.sort((a,b)=>a.original_sort-b.original_sort).map((b,index) => {
        return "选项"+String.fromCharCode(65+index)+" #"+b.id+" "+b.content
    }).join("\n")
    op+="\n\n"
})

const fs = require('fs');
fs.writeFileSync('output.txt', op)
```
