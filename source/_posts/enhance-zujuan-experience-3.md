---
title: 提升组卷网的使用体验（三）：提升试题清晰度
date: 2023-12-23 16:49:10
tags:
 - Proj
---

本文旨在教您如何在不过分破费的情况下提升组卷网的使用体验。

## 不同的图片差异有多大

|   原始   |   优化后   |
|----------|-----------|
|![](7f0bd933730d159e9ea6c6d3727f7ea8.png)|![](7f0bd933730d159e9ea6c6d3727f7ea8.svg)|
|\*.png|\*.svg|
|1.96 KB | 13.1 KB |

<!-- more -->

|   原始   |   优化后   |
|----------|-----------|
|![](67220cff-3af2-4723-a70f-57b668e71213.png)|![](67220cff-3af2-4723-a70f-57b668e71213.resizew.png)|
|\*.png?resizew=\*|\*.png|
|4.42 KB | 18.9 KB |


## code

```javascript
function normalize_q(dom) {
    const ool = dom

    ool.querySelectorAll("img").forEach(v => {
        if (v.src.includes("/formula/")) {
            v.src = v.src.replace(".png", ".svg")
        }
        if (v.src.includes("/dksih/")) {
            let tmp = /\?resizew=(\d*)/.exec(v.src)
            if (tmp.length != 0) {
                v.style.width = tmp[1] + "px"
                v.src = v.src.replace(/\?resizew=(\d*)/, "")
                v.setAttribute("width", tmp[1])
            }
        }
    })
}
```


[Greasy Fork](https://greasyfork.org/zh-CN/scripts/483043-%E4%BC%98%E5%8C%96%E7%BB%84%E5%8D%B7%E7%BD%91%E5%9B%BE%E7%89%87%E8%B4%A8%E9%87%8F)
