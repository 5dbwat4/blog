---
title: 输出PTA的实际裁判程序
date: 2024-10-31T11:14:27+08:00
tags:
published: true
---
~~你无敌了PTA~~

有的时候，实际的裁判程序可能与题干所写的裁判程序有所不同，你可以通过这种方式获得实际的裁判程序。

<!-- more -->

版本1：禁用`for`,`while`

```c
#include <stdio.h>

char c;
FILE *fp;
void printCharacters() {
    c = fgetc(fp);
    if (c != EOF) {
        printf("%c", c);
        printCharacters();
    }
}
int doso() {
    fp = fopen(__FILE__, "r");
    if (fp == NULL) {
        printf("Error: unable to open file\n");
        return 1;
    }
    printCharacters();
    fclose(fp);
    return 0;
}

double NumRing(int index)   //替换成实际函数定义
{
    doso();
    exit(0);
    return 0;              //与函数类型保持一致
}
```

版本2：正常版

```c
int doso() {
    char c;
    FILE *fp;
    fp = fopen(__FILE__, "r");
    if (fp == NULL) {
        printf("Error: unable to open file\n");
        return 1;
    }
    while((c=fgetc(fp))!=EOF){
        printf("%c",c);
    }
    fclose(fp);
    return 0;
}

double NumRing(int index)   //替换成实际函数定义
{
    doso();
    exit(0);
    return 0;              //与函数类型保持一致
}
```

---

适用于PTA程序填空题，填写完成后前往“运行测试”，查看程序输出。
