---
title: 提升组卷网的使用体验（二）：高效筛选试卷
date: 2023-12-20 23:01:49
tags:
 - Proj
---


本文旨在教您如何在不过分破费的情况下提升组卷网的使用体验。

## 高效筛选试卷

### 效果展示

![](p0.png)

<!-- more -->

#### 日均浏览量

这项功能意在提供一个判定试卷质量的参考数据。

将浏览量处理距今的天数，得到日均浏览量。这是一个兼顾试卷质量和试卷新颖度的指标。

以50为分界，日均浏览量高的试卷相关位置会加粗

#### 原创率功能

这项功能意在提供一个判定试卷质量的参考数据。

对于一张试卷中的题目，如果它的“使用过本题的试卷”中最早的那个就是这张试卷，那么，我把这道题称为这张试卷中的原创题，这意味着命题者在命制这张试卷时并没有**仅仅**进行组卷操作，也许可以意味着试卷的质量相对较高。

原创率提示了一张试卷中，这种原创题的数量。

以100%，90%，50%为分界，试卷的左侧会显示一个从显目到不显目的mark。

### 方法

```javascript
function isOriginal() {

    if (window.location.pathname.includes("/shijuan/")||window.location.pathname.includes("/papersearch")) {
        //console.log("beg");
        let oop = []
        document.querySelectorAll(".item-td").forEach(o => {

            o.querySelector(".exam-info").style.height="fit-content"
            o.style.height="fit-content"

            const ops = /(\d*)p(\d*)\.html/g.exec(o.querySelector(".exam-name").attributes.href.nodeValue)

            //console.log(ops[1], ops[2])
            fetch(APILoc + "/api/xkw-helper/____sensitive/get_zujuan_app_content", {"headers": { "Content-Type": "application/json" }
        ,
                    method: "POST", body: JSON.stringify
                        ({ method: "GET", url: "/app-server/v1/paper/detail/" + ops[1] + "/" + ops[2] })
                }).then(e => e.json()).then(o2 => {


                    const oopp = o2.data.quesList
                    let origCount = 0
                    for (let icon = 0; icon < oopp.length; icon++) {
                        const element = oopp[icon];
                        let swlList = []
                        element.paperSources.forEach(v => {
                            if (v.valid) {
                                swlList.push(v.id)
                            }
                        })
                        console.log(swlList, ops[2], Math.min(...swlList));
                        if (Math.min(...swlList) == ops[2]) {
                            origCount++
                        }
                    }
                    console.log(origCount, o, oopp.length)

                    o.querySelector(".test-sum").insertAdjacentHTML("beforeend", ` 原创数<em>${origCount}</em> (${Math.floor(origCount * 100 / oopp.length)}%)`)
                    if(origCount == oopp.length){
                        o.insertAdjacentHTML("afterbegin",`
                        <div style="position: absolute;display: block;width: 20px;height: 100%;z-index: 10000000000;background-color: #ffd700b0;border-radius: 10px;box-shadow: gold 0 0 15px;left: -5px;"></div>`)
                    }else if(origCount / oopp.length >0.9){
                        o.insertAdjacentHTML("afterbegin",`
                        <div style="position: absolute;display: block;width: 10px;height: 100%;z-index: 10000000000;background-color: #ffd700b0;border-radius: 5px;left: -5px;"></div>`)
                    }else if(origCount / oopp.length >0.5){
                        o.insertAdjacentHTML("afterbegin",`
                        <div style="position: absolute;display: block;width: 10px;height: 100%;z-index: 10000000000;background-color: #9f9d033d;border-radius: 5px;left: -5px;"></div>`)
                    }


                    //--------------------------------

                    const paperSubmitTime=o2.data.time
                    let now = new Date();
                    let paperTime = new Date(paperSubmitTime);
                    let diffTime = Math.abs(paperTime - now);
                    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    console.log(diffDays);
                    o.querySelector(".view-sum").insertAdjacentHTML("beforeend", ` 日均<em>${Math.floor((diffDays==0?o2.data.readSum:(o2.data.readSum/diffDays))*10)/10}</em>`)
                    if((diffDays==0?o2.data.readSum:(o2.data.readSum/diffDays))>40){
                        o.querySelector(".view-sum").style.fontWeight=900
                    }

                })


        })

    }

}
```

**提示：你需要一个proxy以使用此功能。**

在本实例中，该代理地址是`APILoc + "/api/xkw-helper/____sensitive/get_zujuan_app_content"`（隶属于`thost-be`）

以下为后端：

```javascript
  app.post("/api/xkw-helper/____sensitive/get_zujuan_app_content",async(req,res)=>{
    console.log("\x1b[36m[API]xkw-helper/get_zujuan_app_content\x1b[0m",req.body)
    console.log(req.body);
    let r={}
    if(req.body.method=="GET"){
r=await axios.get(`https://zjappserver.xkw.com`+req.body.url,{
  headers:CONFIG.zujuanHeaders
})
    }else if(req.body.method=="POST"){
      r=await axios.post(`https://zjappserver.xkw.com`+req.body.url,req.body.body||{},{
  headers:CONFIG.zujuanHeaders
})
    }
    if(r.data.code==20000){
      console.log("登陆状态失效，尝试refreshToken");
      const g=await axios.post(`https://zjappserver.xkw.com/app-server/gateway/v1/basic/refreshToken`,{
        refreshToken:zujuancookie.refreshToken
      })
      // console.log(g.data);
      zujuancookie.authToken=g.data.authToken
      CONFIG.zujuanHeaders.authToken=zujuancookie.authToken
      await fs.promises.writeFile("./oss/zujuancookie.s.json",JSON.stringify(zujuancookie))
      if(req.body.method=="GET"){
        r=await axios.get(`https://zjappserver.xkw.com`+req.body.url,{
          headers:CONFIG.zujuanHeaders
        })
            }else if(req.body.method=="POST"){
              r=await axios.post(`https://zjappserver.xkw.com`+req.body.url,req.body.body||{},{
          headers:CONFIG.zujuanHeaders
        })
            }
    }
    // console.log(r);
    res.json(r.data)
  })
  ```