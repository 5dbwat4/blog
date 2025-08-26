---
title: C#/dotNET应用基本运行和调试
date: 2025-07-17T21:22:24+08:00
tags:
---
RT,打CTF经常遇到C#或.NET应用，这里主要记录一下调试和运行的方案，**适用于完全没有相关基础的情况**。

# 逆向

可以用[ILSPY](https://github.com/icsharpcode/ILSpy/releases)

个人使用体验不错

# 运行

用dotNET SDK

下载：[下载 .NET (Linux、macOS 和 Windows) | .NET](https://dotnet.microsoft.com/zh-cn/download)

然后很坑的是不同的应用可能用的版本可能是不同的，比如L3HCTF的一道dotNET题用的就是6.0，然后更新版本直接把BinaryFormater删了

下载旧版本可以直接在原来页面后面加版本号。[下载 .NET 6.0 (Linux、macOS 和 Windows) | .NET](https://dotnet.microsoft.com/zh-cn/download/dotnet/6.0)

然后就能跑C#应用了

`dotnet --list-sdks`查看已安装的 SDK 版本

`dotnet new globaljson`创建一个`global.json`文件，后续可以通过改这个文件改变运行版本

`dotnet new console`创建一个新应用
