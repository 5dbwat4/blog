---
title: 物理实验选课系统鉴权sign计算方式
date: 2025-02-22T13:56:37+08:00
tags:
---
叠甲：文章内容仅供学习参考，任何由于使用本博文内容而产生的后果，由使用者承担责任。

<!-- more -->

# 思路

相同请求重放返回`{"code":401,"data":"","message":"Unauthorized"}`，执行相同操作发现同一请求`timestamp`和`sign`字段发生变化，推断通过`timestamp`实现防止重放攻击。

因此需要逆向出`sign`的计算规则。

直接在`app.js`中搜索`sign`，只有两个结果，动态调试发现第一个结果是有用的，跟踪发现`o = S(x, e, a.path, a.data)`

```js
function S(t, e, s, i) {
    var a = []
      , n = t + s;
    if ("[object Object]" == Object.prototype.toString.call(i)) {
        for (var o in i)
            i.hasOwnProperty(o) && a.push(o);
        a.sort();
        for (var r = 0; r < a.length; r++) {
            var l = a[r]
              , d = i[l];
            "" !== d && null !== d && void 0 !== d && "object" !== u()(i[l]) && (n += l + d)
        }
    } else if ("[object FormData]" == Object.prototype.toString.call(i)) {
        var m = i.entries()
          , h = !0
          , p = !1
          , v = void 0;
        try {
            for (var g, _ = c()(m); !(h = (g = _.next()).done); h = !0) {
                var b = g.value;
                a.push(b[0])
            }
        } catch (t) {
            p = !0,
            v = t
        } finally {
            try {
                !h && _.return && _.return()
            } finally {
                if (p)
                    throw v
            }
        }
        a.sort();
        for (var C = 0; C < a.length; C++) {
            var y = a[C]
              , w = i.get(y);
            "" !== w && null !== w && void 0 !== w && "[object File]" !== Object.prototype.toString.call(w) && (n += y + w)
        }
    }
    return n += e + " " + t,f.a.MD5(n).toString()
}
```

加密函数还是相当简洁明了的，读代码得知`sign`的计算方式为`md5(key+path+DATA+timestamp+" "+key)`，其中`key`的值是一个定值，写死在了源码里。`DATA`的计算方式为：

- 对于不含有`data`的请求，`DATA`为空
- 含有Object形`data`的，遍历其每一项(`key`,`value`)，忽略其中`value`的类型不为`string`的部分，其余的按`key`排序，然后将`key`和`value`全部拼接，得到最终`DATA`。

最终发送请求时，对于`GET`请求，将`timestamp`和`sign`拼接在`query`末尾；对于`POST`请求，将`timestamp`和`sign`也包含在body里，转换为`x-www-form-urlencoded`形式。

# 示例

## 示例1

参见文章[zjuphylab.ics：将你的物理实验课课表导出成 iCal 日历格式](/arch/2025-2-zjuphylab-ics.html)

## 示例2

```js
// -------------------------------------------------
// YOU MUST SPECIFY THIS TERM YOURSELF
const Authorization = "bearer xxxxxxxxxxxxxxxxxxxxx"
const STU_UID = "3240999999"
const CourseId = 273
const prdata = [
    [4565,1],//★示波器的应用（必做实验）
    [4566,2],//★分光计的调整和使用（必做实验）
    [4576,3],//▲铁磁材料的磁滞回线和基本磁化曲线
    [4579,4],//空气密度测定
    [4577,5],//声速的测定
    [4575,6],//组装整流器
    [4571,7],//万用表的设计
    [4572,8],//非平衡电桥
    [4569,9],//▲用霍尔法测直流圆线圈与亥姆霍兹线圈磁场
    [4570,10],//密立根油滴实验
    [4584,11],//抛射体运动的照相法研究
    [4574,12],//用双臂电桥测低电阻
    [4573,13],//惠斯登电桥
    [4588,14],//演示实验
]
// -------------------------------------------------



const md5 = require("js-md5")

const APPKEY = "eb8c68399de7483abb2d8abaea0d039f"
const dumpedKey = "7cd476ab866b49d7a9788ad9f4789495"

const host = "http://10.203.16.55:8098/lab-course"

function GET(path,data={}){
    // const timestamp = (new Date()).getTime()
    const timestamp = Date.parse(new Date)

    return fetch(host+path+"?"+(new URLSearchParams(Object.entries({
        "app_key":APPKEY,
        timestamp,
        ...data,
        sign:md5(dumpedKey+path+Object.entries(data).map(v=>v.join("")).join("")+timestamp+" "+dumpedKey)
    }))).toString(),{
        headers:{
            Authorization
        }
    }).then(e=>{
        console.log("Fetch ",path," status ",e.status);
        return e.json()
    }).then(v=>{
        console.log(v);
        return v;
    })
}

function POST(path,data){

    const timestamp = Date.parse(new Date)
    return fetch(host+path,{
        method:"POST",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded",
            Authorization
        },
        body:(new URLSearchParams(Object.entries({
            "app_key":APPKEY,
            timestamp,
            sign:md5(dumpedKey+path+Object.entries(data).sort((a,b)=>(b[0]<a[0]?1:-1)).map(v=>v.join("")).join("")+timestamp+" "+dumpedKey),
            ...data,
        }))).toString()
    }).then(e=>e.json()).then(v=>{
        console.log("Response ",v);
        return v;
    }).catch(e=>{
        console.log("Error ",e);
        return e;
    })
}




function s(){

for (let index = 0; index < prdata.length; index++) {
    const e = prdata[index];
    POST("/api/course/lab/students",{
        courseId,
        courseLabId:e[0],
        termId: 12,
        uid: STU_UID,
        selectWeek:e[1]
    }).then(v=>{
        console.log(v);
    })
}

}

setInterval(()=>{s()},2000)

```
