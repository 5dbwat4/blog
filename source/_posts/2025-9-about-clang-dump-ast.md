---
title: Clang dump-ast功能学习
date: 2025-09-22T21:44:18+08:00
tags:
---

*本文尚未完成*

<!-- more -->

因为想要写一个~~逃过查重算法的~~混淆代码的工具，准备学习一下clang的AST dump功能，参考JS Obfuscator，对于这个工具的计划是1. 运算符提取成单独的函数，2. 所有字面量全部提取出来，3.尽可能做一些控制流展平之类的操作，4. 不能影响最后编译出来的代码。

# Use it

```bash
clang -Xclang -ast-dump -fsyntax-only test.c
```

因为后续要把AST树扔给Python/Node.js处理，所以让它输出json格式：

```bash
clang -Xclang -ast-dump=json -fsyntax-only test.c
```

# Parse it

现在要parse这个json文件。初步目标是重新获得源代码。

# Tricks

CompoundAssignOperator 和 Operator = 不是同一个东西