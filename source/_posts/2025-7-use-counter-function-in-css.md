---
title: 在CSS中使用counter()实现自动小标题计数
date: 2025-07-04T13:47:56+08:00
tags:
---
# TL; DR

```css
body{
  counter-reset: h1;
}
h1 {
  counter-reset: h2;
}
h2 {
  counter-reset: h3;
}
h3 {
  counter-reset: h4;
}
h4 {
  counter-reset: h5;
}
h5 {
  counter-reset: h6;
}
h1:before {
  counter-increment: h1;
  content: counter(h1);
  margin-right: 0.8rem;
}
h2:before {
  counter-increment: h2;
  content: counter(h1) "." counter(h2);
  margin-right: 0.8rem;
}
h3:before {
  counter-increment: h3;
  content: counter(h1) "." counter(h2) "." counter(h3);
  margin-right: 0.8rem;
}
h4:before {
  counter-increment: h4;
  content: counter(h1) "." counter(h2) "." counter(h3) "." counter(h4);
  margin-right: 0.8rem;
}
h5:before {
  counter-increment: h5;
  content: counter(h1) "." counter(h2) "." counter(h3) "." counter(h4) "." counter(h5);
  margin-right: 0.8rem;
}
h6:before {
  counter-increment: h6;
  content: counter(h1) "." counter(h2) "." counter(h3) "." counter(h4) "." counter(h5) "." counter(h6);
  margin-right: 0.8rem;
}
```

<!-- more -->

# More about counter()

CSS的`counter()`函数可以用来实现自动编号的功能，通常用于标题或列表项的自动计数。通过`counter-reset`和`counter-increment`属性，可以轻松地为不同级别的标题设置计数器。

此外，counter还可以接受第二个参数：`counter(count, <counter-style>)`

常见的计数样式包括：

[list-style-type - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type#values)

- disc
  A filled circle (default value).
- circle
  A hollow circle.
- square
  A filled square.
- decimal
  Decimal numbers, beginning with 1.
  
- cjk-decimal
  Han decimal numbers.
  
- decimal-leading-zero
  Decimal numbers, padded by initial zeros.
  
- lower-roman
  Lowercase roman numerals.
  
- upper-roman
  Uppercase roman numerals.
  
- lower-greek
  Lowercase classical Greek.
  
- lower-alpha, lower-latin
  Lowercase ASCII letters.
  
- upper-alpha, upper-latin
  Uppercase ASCII letters.
  
- arabic-indic, -moz-arabic-indic
  Arabic-Indic numbers.
  
- armenian
  Traditional Armenian numbering.
  
- bengali, -moz-bengali
  Bengali numbering.
  
- cambodian/khmer
  Cambodian/Khmer numbering.
  
- cjk-earthly-branch, -moz-cjk-earthly-branch
  Han "Earthly Branch" ordinals.
  
- cjk-heavenly-stem, -moz-cjk-heavenly-stem
  Han "Heavenly Stem" ordinals.
  
- cjk-ideographic
  Identical to trad-chinese-informal.
  
- devanagari, -moz-devanagari
  Devanagari numbering.
  
- ethiopic-numeric
  Ethiopic numbering.
  
- georgian
  Traditional Georgian numbering.

...And more

[](https://developer.mozilla.org/zh-CN/docs/Web/CSS/list-style-type)


# Background

在[ctf_summer_courses/docs/css/custom.css at master · team-s2/ctf_summer_courses](https://github.com/team-s2/ctf_summer_courses/blob/master/docs/css/custom.css) 中看到了这个技巧