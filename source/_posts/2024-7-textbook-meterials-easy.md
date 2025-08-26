---
title: 获得“国家中小学智慧教育平台”上的电子课本（不会编程也能用的方法）
date: 2023-01-24 02:03:20
tags:
---
在[获得 “国家中小学智慧教育平台” 上的电子课本](./2023-1-textbook-meterials)中，我们介绍了“国家中小学智慧教育平台”中电子课本存储的原理。

这篇文章则提供了一种不会编程也能用的方法。

# Step 1 选择教材

访问[国家中小学智慧教育平台 (smartedu.cn)](https://basic.smartedu.cn/tchMaterial)

![](man-1.png)

**选择想要的课本，单击。**

（这里以`普通高中教科书·语文必修 上册`为例）

# Step 2 获得`Content ID`

如果你未登录，则你会看到此界面：

![](man-2.png)

如果你已登录，则是此界面：

![](man-3.png)

这无所谓，你需要复制网址栏中的网址，他大致是长这样：`https://basic.smartedu.cn/tchMaterial/detail?contentType=assets_document&contentId=b8e9a3fe-dae7-49c0-86cb-d146f883fd8e&catalogType=tchMaterial&subCatalog=tchMaterial`

注意到其中从`contentId=`到`&`的部分，这是一个`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`格式的字符串，在这个网址中，这个字符串是`b8e9a3fe-dae7-49c0-86cb-d146f883fd8e`，**记住它，后文将用`Content ID`指代它**。

# Step 3 下载课本pdf

**编辑**以下网址：

`https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/<Content ID>.pkg/pdf.pdf`

将`<Content Id>`替换成第二步中得到的`Content ID`

例如：普通高中教科书·语文必修 上册 的下载地址就是`https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets_document/b8e9a3fe-dae7-49c0-86cb-d146f883fd8e.pkg/pdf.pdf`

**在网址栏中输入你得到的地址，即可下载。**

此方法对绝大多数[国家中小学智慧教育平台 (smartedu.cn)](https://basic.smartedu.cn/tchMaterial)
