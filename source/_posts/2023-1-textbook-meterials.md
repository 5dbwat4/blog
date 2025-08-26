---
title: 获得“国家中小学智慧教育平台”上的电子课本
date: 2023-01-24 02:03:20
tags:
---
如果你不在乎原理，可以直接前往[最后一节](#数据)。

<!-- more -->

# 原理

首先，所有学科的电子课本数据全部都是可以从[“国家中小学智慧教育平台”](https://basic.smartedu.cn/)上[**登陆后免费获取**](https://basic.smartedu.cn/tchMaterial)的，这意味着以下所述的行为完全是吃饱了撑着。但是这个平台是前后端分离的，是用 `react`写的，而且还发了一大堆log(`https://wkbrs1.tingyun.com/action?<Request Info>`)，严重拖慢了加载速度和浏览体验。
不仅如此，我们还没有办法一键获得所有教科书的PDF地址，页面上也没有提供下载按钮，而且，他的PDF阅读功能是用PDF.js写的（虽然说这确实是一个非常好用的库，而且是Mozilla开源的），但是我既然都用Firefox（内置了PDF.js viewer）打开它了，我为什么要再下载一遍PDF.js，即使他是minify过的？
所以我们要一键获取全部的电子课本地址，并将它展示出来，以下是分析过程和操作过程。

## 分析过程

我一开始以为，在进入教材页面之后，他会先发一个query POST，获得教材的书名、缩略图、点赞数等元数据，在单击一个教材名称之后，会进入教材详情页，再发第二个POST，获取包括PDF地址在内的详细信息。上述过程应该全是用API进行。
事实证明，我是想少了。
他的教材元数据是放在 `s-file-*.ykt.cbern.com.cn`（其中的星号是一个数字，标志的应该是负载平衡的服务器序号（我猜的））上的，那个s指的应该是static。不仅如此，它还给我缓存了，给我 `cache-control: max-age=600`了，而且看这个名字，还带了个.json，怎么看都像是直接静态存的。
仔细想想，确实没什么问题，毕竟这玩意儿也不是经常更新的，我存静态还加600秒的缓存，应该没问题吧。
总之，既然知道这个，后面就好办了。

这里有点偷懒，因为PDF的地址就是 `https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/<Recourse ID>.pkg/pdf.pdf`，但不保证全部都是。

---

## Files

完整的课本元数据：[Data](/arch/2023-1-textbook-meterials/all_obj.json.gz)

提纯后的（只含有标题,ID,tags,也是下面Component里面用到的数据）：[Data](/arch/2023-1-textbook-meterials/objentry.json)

以及一个[可爱的加载动画（雾）](/arch/2023-1-textbook-meterials/loading.9a8570d0.gif)



# 数据

**请注意，由于`cbern.com.cn`的`Referrer`策略，从本页面出去的链接会`403 Forbidden`，你可以直接下载（浏览器处理下载任务时会设置`Referrer`字段为`none`），或者复制链接在新标签页打开。**

{% raw %}

<div id="Component-Injection-fe3y7j"></div>
<script src="/arch/2023-1-textbook-meterials/5dbwat4-proj.blogc.core.main.1c5801ac71627ceb0f09.js"></script>

{% endraw %}

为高中牲专门把高中课本单列出来

| 科目   | -                                                                                                                                  | -                                                                                                                                  | -                                                                                                                                  | -                                                                                                                                  | -                                                                                                                                  | -                                                                                                                                  | -                                                                                                                                  |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 语文   | [必修上册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/b8e9a3fe-dae7-49c0-86cb-d146f883fd8e.pkg/pdf.pdf)          | [必修下册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/9085151a-b698-4b28-8c00-2c4aaf0c91ad.pkg/pdf.pdf)          | [选择性必修 上册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/3b7a3baf-4e1e-4380-b2cc-3bf330d00cc3.pkg/pdf.pdf)   | [选择性必修 中册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/da694670-f25b-46a0-9c3f-a31f5a2f131a.pkg/pdf.pdf)   | [选择性必修 下册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/2de54e6d-1f82-4fdc-9f26-c94dfed9c5af.pkg/pdf.pdf)   |                                                                                                                                    |                                                                                                                                    |
| 数学   | [必修 第一册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/5136d0eb-69b1-43cb-81e2-9f5f52ed06ca.pkg/pdf.pdf)       | [必修 第二册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/066ef32a-2360-49b1-a862-680b40b0ab2a.pkg/pdf.pdf)       | [选择性必修 第一册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/55265e13-60fd-4b6e-8eb3-c4ce84dfdbe7.pkg/pdf.pdf) | [选择性必修 第二册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/833cae74-4d4d-4472-8f56-a99fa306af96.pkg/pdf.pdf) |                                                                                                                                    |                                                                                                                                    |                                                                                                                                    |
| 英语   | [必修 第一册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/cd1feeb4-b1db-4a44-9694-9d8c35ab02f5.pkg/pdf.pdf)       | [必修 第二册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/0cbeba0b-b97b-4289-9b4e-f3a96f1e5b85.pkg/pdf.pdf)       | [必修 第三册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/35590078-42c3-4778-aa6b-5330fe4b8b5c.pkg/pdf.pdf)       | [选择性必修 第一册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/2c7b457b-b325-4fe5-8a98-777bc9a43a3b.pkg/pdf.pdf) | [选择性必修 第二册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/f5cf58a2-7084-4961-9b85-188262aee41b.pkg/pdf.pdf) | [选择性必修 第三册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/d6da38b7-c9c4-49c9-8a30-53339903376a.pkg/pdf.pdf) | [选择性必修 第四册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/1a758899-7438-4f8b-9c2a-eb19ffb71b11.pkg/pdf.pdf) |
| 物理   | [必修 第一册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/708256b6-6f06-4d14-89c7-4df16dfe3b81.pkg/pdf.pdf)       | [必修 第二册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/55baa3cc-156f-4358-8e28-bfa21a864450.pkg/pdf.pdf)       | [必修 第三册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/dcd8cc6b-5380-4008-a2d0-a061f24d34dd.pkg/pdf.pdf)       | [选择性必修 第一册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/346c3c04-1663-472c-849e-ff876dcf293f.pkg/pdf.pdf) | [选择性必修 第二册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/2ee7d7fa-1920-4d37-a179-91d5fd59b8c1.pkg/pdf.pdf) | [选择性必修 第三册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/2109c25c-2e52-4da3-8ab3-18cbe632ec11.pkg/pdf.pdf) |                                                                                                                                    |
| 化学   | [必修 第一册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/5cd19072-e40d-4a73-8580-7b7ada5d4005.pkg/pdf.pdf) | [必修 第二册](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/07f7d663-a867-4eb6-ad39-03b55dbd4a65.pkg/pdf.pdf) | [选择性必修1](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/3502fe81-b23e-4f68-aa3d-7921e7932ec9.pkg/pdf.pdf) | [选择性必修2](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/b82cefe7-d631-4bde-baf9-352ca033cba4.pkg/pdf.pdf) | [选择性必修3](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/c561d8ee-7c06-4cb1-9a4d-e34036f02d53.pkg/pdf.pdf) |                                                                                                                                    |                                                                                                                                    |
| 生物学 | [必修1](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/9d522562-b529-446c-9b5b-084812beee6e.pkg/pdf.pdf) | [必修2](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/f89f0368-11c8-4a21-a767-a9102c9ce872.pkg/pdf.pdf) | [选择性必修1](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/ec6ab12c-0b06-43a5-bf62-ee90b619f607.pkg/pdf.pdf) | [选择性必修2](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/825baab7-f0ea-4a90-9b4a-513f338e2484.pkg/pdf.pdf) | [选择性必修3](https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/d12ff6b6-b6cd-444a-9749-4642aa350482.pkg/pdf.pdf) |                                                                                                                                    |                                                                                                                                    |
