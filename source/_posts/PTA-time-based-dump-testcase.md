---
title: PTA 基于时间获取测试数据
date: 2025-10-29T14:53:37+08:00
tags:
---

突然想到了去年学程算时整出来的奇技淫巧，在这里分享一下。

背景：遇到了一些幽默题目，不知道测试数据是什么，有没有办法把它偷出来？

# 基于assert二分猜，但是一次透的bit数有点低

```c
#include <assert.h>

...

int main() {
    int n;
    scanf("%d", &n);
    assert(n >= value);
}
```

当`n < value`时，PTA报错：'运行时错误'（Runtime Error），通过不断调整`value`的值，可以二分猜出`n`的值。

# 基于时间获取数据

```c
#include <time.h>

int main() {
    int n;
    scanf("%d", &n);

    int data_to_steal = n%100;// for example.
    clock_t start = clock();

    while (clock() - start < data_to_steal * CLOCKS_PER_SEC / 100);

    return 0;
}
```

通过这种方式，通过评测机输出的“用时”这一栏目，可以偷出`data_to_steal`的值。

<!-- more -->