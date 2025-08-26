---
title: 【程序设计与算法基础】选/判/填 抽象Trick集
date: 2024-09-23T10:06:34+08:00
tags:


---
```c
    if(x > 0) y = 1;
    else if(x < 0) y = -1;
    else if(x = 0) y = 0;
```

Will the program run as expected?

<!-- more -->

Answer is NO.

Here is a list of stupid tricks in C, which may make you stumble.

# `0<=x<=10`

显然C不支持这种连等式。这段代码可以理解成`((0<=x)?1:0)<=10`.

对于`==`,`>=`,`<`,`>`同理

# `if(x = 0)`

> [Warning] suggest parentheses around assignment used as truth value [-Wparentheses]

小心`if`中出现的这种抽象副作用。

```c
int x,y=0;
if( x = 0 ){
    y = 1;
} else {
    y = 2;
}
```

x,y的值是多少？

~~由于x未定义，值未知，所以y也未知？~~并非如此，`x`被赋值为`0`,`y`的值为`2`.

`if`走那条分支取决于赋值后的`x`,如果`x`是Falsy的(e.g. `0`,`false`)，`if`会走false支.

# Where is your semicolon `;`

![第一空填什么](Pic1.png)

填`t = w / (h * h)`？ 废了，分号没辣！

# Where is your parentheses `()`

同上，程序填空题喜欢动不动就把`if`和`for`左右的括号漏掉。

---

以下是翻`-Wall`文档时找到的一些东西，这些暂时没遇到过

# 数组下标用`char`类型

`-Wchar-subscripts`

# 隐式精度提升

`-Wdouble-promotion`

Give a warning when a value of type `float` is implicitly promoted to `double`. CPUs with a 32-bit “single-precision” floating-point unit implement `float` in hardware, but emulate `double` in software. On such a machine, doing computations using `double` values is much more expensive because of the overhead required for software emulation.
当 `float` 类型的值隐式提升为 `double` 时发出警告。具有 32 位“单精度”浮点单元的 CPU 在硬件中实现 `float` ，但在软件中模拟 `double` 。在这样的机器上，使用 `double` 值进行计算要昂贵得多，因为软件仿真所需的开销。

It is easy to accidentally do computations with `double` because **floating-point literals are implicitly of type `double`.** For example, in:
很容易意外地使用 double 进行计算，因为**浮点字面量隐式为 double 类型**。例如，在：

```c
float area(float radius)
{
   return 3.14159 * radius * radius;
}
```

the compiler performs the entire computation with `double` because the floating-point literal is a `double`.
编译器使用 `double` 执行整个计算，因为浮点字面量是 `double`。

# `switch` fallthrough

`-Wimplicit-fallthrough`

The switch will fallthrough.

```c
switch (cond)
  {
  case 1:
    a = 1;
    break;
  case 2:
    a = 2;
  case 3:
    a = 3;
    break;
  }
```

So do the code below:

```c
switch (cond)
  {
  case 1:
    if (i > 3) {
      bar (5);
      break;
    } else if (i < 1) {
      bar (0);
    } else
      return;
  default:
    …
  }
```

# What is between `{` and the first `case`

What is between the controlling expression and the first case label?

`-Wswitch-unreachable`

When a switch statement contains statements between the controlling expression and the first case label, it will never be executed.

Except when it is a declaration.

And in deed...

# What is the lifecycle of vars in `switch`

Varriables can be declared but not be initialized.

Once declared, it can be used across the scope.

```c
switch (cond) {
		int u;
	case 5:
		i = 5;
		int c;
		break;
	case 7:
		c=1;
		cout<<c;
	case 8:
		u=9;
		break;
}
```

It can be compiled and run as expected, even it seems `c` is not declared when `cond==7` and `u` seems to be never declared.

```c
switch (cond) {
		int u=1;
	case 5:
		i = 5;
		int c=4;
		break;
	case 7:
		c=1;
		cout<<c;
	case 8:
		c=9;
		break;
}
```

And when you try to initialize the variables, compilers start to stop you with `[Error] crosses initialization of 'int c'`

---

> To be continued.
