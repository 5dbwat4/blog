---
title: Mathematica 在数分习题中的应用（笔记）
date: 2025-03-27T19:39:08+08:00
tags:
---
（更新中）

级数求和：

```mathematica
(*定义级数的通项*)term[n_] := (2 n + 1)/(2^n n!);

(*计算级数的和，使用Sum进行精确求和*)
seriesSum = Sum[term[n], {n, 1, Infinity}];

(*使用Simplify尝试简化结果*)
simplifiedSum = Simplify[seriesSum];

(*输出结果*)
simplifiedSum
```

下列无穷级数收敛的是：

```mathematica
(*定义级数*)
seriesA = (-1)^n 3^(1/n)/Sqrt[n]

(*输出结果*)
SumConvergence[seriesA, n]
```

傅里叶级数求值系列问题：

求级数收敛域：

```mathematica
SumConvergence[x^n/(n (3^n + Log[n])), n, 
 Assumptions -> x \[Element] Reals]
```

<!-- more -->
