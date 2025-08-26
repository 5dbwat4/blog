---
title: 记逆向方正字库客户端字体下载逻辑
date: 2025-02-04T16:39:03+08:00
tags:
---
希望从[方正字库官网](https://www.foundertype.com/)下载字体，发现方正字库网站不能下载字体文件；从[【方正字库客户端】字 plus 方正字库客户端 fontplus 字体管理【软件 客户端 下载】](https://www.foundertype.com/index.php/Index/ftXplorer)下载客户端后发现仍需登录才能下载字体。抓包后发现并未找到下载字体文件的过程。现希望绕过上述步骤以可控方式获得字体文件。

<!-- more -->

文件：FounderClient_1.1.6.exe

链接：https://cdn13.foundertype.com/fclient/pro/windows/1.1.6/FounderClient_1.1.6.exe

SHA256：`b1d948b9797fc621fca1baa091d0fc439861f64a9ff37a43a8c89f54eba6a27d`

# 查看源码

发现是一个经典的 electron 应用。

使用 Fiddler 抓包发现页面实际加载了 https://cdn13.foundertype.com/fclient_webs/pro/fz_windows/1.1.6/?app_name=App&window_id=2&argv=...&timestamp=1738588167160 页面；

使用`npx asar e app.asar ./app`解包出本地部分的代码。

# 动态调试的准备工作

## 本地部分

热知识：直接将 app.asar 删掉，*方正字库.exe*就会加载`app/main.js`文件（从`app/package.json`推断），所以后续本地部分可以直接就着源代码修改

更热的知识：你可以`npx electron .`来绕过*方正字库.exe*的壳子并能查看`console.log`的内容。

不过我们实际上是 hack 了`main.js`文件

```js
console.log = (...args) => {
  const fs = require("fs");
  const util = require("util");
  const log_file = fs.createWriteStream(__dirname + "/log.txt", { flags: "a" });
  log_file.write(util.format.apply(null, args) + "\n");
};
```

然后我们仍然用*方正字库.exe*的壳子。现在本地部分的 log 会全部输出到*log.txt*文件中。我们还可以视情况给 app 中的各个函数加上`console.log`

## 线上部分

另一个热知识：快捷键`Ctrl+Shift+I`是 Toggle Developer Tools，在一切 electron 应用中一视同仁（包括 VSCode（更新版本中似乎把这个快捷键删了））

如果快捷键没用咋办？那就审计 main.js，其中一定有一些代码实现了“禁止 devtools”功能。

总而言之，我们可以像调试前端页面一样调试方正字库的线上部分了。

这里还有两个小 trick：

1. 前端把`console.log`函数覆写了，新的函数似乎是要把日志通过另一个函数输出到其他地方。我们直接控制台输入`console.log=console.warn`让它输到控制台；
2. 用最新 Chrome 时*源代码*可以自动把 minify 后的源码 format 一下，但是 electron 里的 devtools 似乎不支持。我们打算自己下载一份源码，手动 Prettier 之后通过 Fiddler 送给方正字库客户端，这样就方便调试了。

# 思路

## 获取密码过程在前端进行

审查 log.txt 发现以下日志（部分敏感内容用星号替代）：

```plain
[RenderProcessHelper] runOnNewRenderProcess...args:[download_and_unzip_to_dir,http://cdn1.foundertype.com/zfont/TTF/FZFWZhuZiABiaoTMCJW.zip,C:\Users\***\AppData\Roaming,81d922f9cee8e7a2cf726a068d9cd327]
```

根据变量名推测这表示从`http://cdn1.foundertype.com/zfont/TTF/FZFWZhuZiABiaoTMCJW.zip`下载文件到`C:\Users\***\AppData\Roaming`，解压密码是`81d922f9cee8e7a2cf726a068d9cd327`

经测试发现文件的解压密码确实如此，压缩包内文件确实为字体文件。

项目内全局搜索`runOnNewRenderProcess`，发现文件`./src/custom/async/RenderProcessHelper.js`中

```js
exports.runOnNewRenderProcess = async (...args) => {
  console.log(TAG, "runOnNewRenderProcess...args:[" + args + "]");
  let tag = args[0];
  args.splice(0, 1);
  await initRenderProcess(tag, args);
  return sendMsgToWebContent(tag, args);
};
```

继续追溯`args`的来源发现`./src/custom/Event.js`

```js
ipcMain.handle("run_on_new_render_process", (event, ...args) => {
  console.log(TAG, "handle[run_on_new_render_process].......");
  return RenderProcessHelper.runOnNewRenderProcess(...args);
});
```

说明`args`是从前端通过 IPC 传下来的。

## 与此同时，在另一边（指前端）

（原先打算找到这个下载链接的来源，在动态调试过程中却是歪打正着发现了密码的生成逻辑）

在控制台日志中发现

```plain
字体下载成功, id:22004, name:方正FW筑紫A标题明朝 简
 [换字]，字体下载成功，开始安装字体...下载耗时:1482800ms, fontid:22004, fontname:方正FW筑紫A标题明朝 简, ttfPath:C:\Users\xhton\Documents\方正字库\Font\FZFWZhuZiABiaoTMCJW.TTF
install font:22004
```

这几行引人在意的日志

由`handleFontViewItemClicked`函数发出。在*源代码*中定位到该函数，打断点执行。

发现该函数的参数中已经带了`downloadURL` property，回溯至上一个函数`handleItemClicked`发现参数中同样也包含`downloadURL`，继续回溯就已经到了 Vue renderer func 中，暂时放弃。

步进`handleFontViewItemClicked`函数发现

```js
o.beginDownload();
let t = await al(e);
(i = !0),
o.endDownload(!0),
```

（一开始以为 beginDownload 是下载函数，审计后发现这应该是显示下载动画用的，那么中间的`al`函数就非常可疑了）

发现该函数确实实现了下载文件流程，除此以外，在函数中还发现了上一节中提到的，向*Event.js*文件中发送`args`的过程：

```js
t.downloadAndUnzipToDir(
  n.download_url,
  Yp.getSystemInfo().storageInfo.cache,
  pl(n.download_url) // THIS IS CORE CODE TO GENERATE PASSWORD.
);
```

按照上一节找到的日志：

- `n.download_url`对应`http://cdn1.foundertype.com/zfont/TTF/FZFWZhuZiABiaoTMCJW.zip`
- `Yp.getSystemInfo().storageInfo.cache`对应`C:\Users\***\AppData\Roaming`
- `pl(n.download_url)`对应`81d922f9cee8e7a2cf726a068d9cd327`

那么`pl`就是生成解压密码的函数，该函数接受 download_url 作为参数，换句话说下载的字体文件的密码仅与其路径有关，与其它（e.g. 用户的登录状态）无关，甚至于不是说后端现场将字体文件打包设置随机密码发给前端。

## `pl`函数是啥捏

```js
function pl(e) {
  let t = e.lastIndexOf("/"),
    n = e.substring(0, t + 1),
    r = e.substring(t + 1, e.lastIndexOf(".")),
    o = r.substring(Math.max(r.length - 4, 0));
  return fs.hash(n + r + ".zip" + fs.hash(o));
}
```

这段代码相当易懂，就是说对 download_url 瞎 jb 乱剪，剪完瞎 jb 做 hash 运算，算完返回。

那么，`fs.hash`是什么 hash 捏？

显然 fs 指的不是`node:fs`，查阅[源代码](#fs)发现其中有许多幽默位运算，以及一堆 digest 之类的函数（反正很显然肯定是一个 js 加密库），请 AI 帮我们分析一下：

> 从代码片段来看，这是一段实现哈希算法的代码，具体来说，它实现的是 MD5 哈希算法。以下是分析的依据：
> 关键特征
> 初始哈希值：
> MD5 的初始哈希值是固定的，代码中定义了：

```js
this._hash = [1732584193, -271733879, -1732584194, 271733878];
```

> 这些值正是 MD5 算法的初始哈希值。
> 消息填充：
> MD5 算法在处理消息时，会在消息末尾添加一个 1 位，然后用 0 位填充，直到消息长度达到 64 的倍数。代码中实现了这一逻辑：

```js
e[s >> 2] |= 128 << (s % 4 << 3);
```

> 这表示在消息末尾添加一个 1 位。
> 消息长度附加：
> MD5 算法会在消息末尾附加一个 64 位的消息长度值。代码中实现了这一逻辑：

```js
(r = (r = 8 * this._length).toString(16).match(/(.*?)(.{0,8})$/)),
(o = parseInt(r[2], 16)),
(i = parseInt(r[1], 16) || 0),
(e[14] = o),
(e[15] = i),
```

> 这段代码将消息长度（以比特为单位）转换为两个 32 位整数，并存储在数组的最后两个位置。
> 分块处理：
> MD5 算法将消息分成 64 字节（512 位）的块进行处理。代码中实现了这一逻辑：

```js
for (t = 64; t <= o; t += 64) n(this._hash, r(this._buff.substring(t - 64, t)));
```

> 这段代码将消息分成 64 字节的块，并逐块处理。

~~感觉 AI 取代 CTFer 指日可待~~

综上，密码就是**md5(download_url+md5(文件名去除.zip 的最后 4 个字符))**

经验证确实如此。

## 其实，已经结束了

只需要把`http://cdn1.foundertype.com/zfont/TTF/FZFWZhuZiABiaoTMCJW.zip`中的字体名替换成你要的字体（e.g. FZZiZLDJW 这个字体名在网页前端就能找到），然后再用上面的算法算一下密码就可以获得字体。

以下是算号器：

{% raw %}

<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>

<input id="inputName" type="text" placeholder="Input name. e.g. FZZiZLDJW"/>
  <button id="submit">Generate</button>
  <p>Download URL:<a href="#" id="download_url"></a></p>
  <p>Password: <span style="user-select:all;" id="password"></span></p>
  <script>
document.querySelector("#submit").addEventListener("click", () => {
  const xname = document.querySelector("#inputName").value;
  const e = "http://cdn1.foundertype.com/zfont/TTF/" + xname + ".zip"

const t = e.lastIndexOf("/"),
n = e.substring(0, t + 1),
r = e.substring(t + 1, e.lastIndexOf(".")),
o = r.substring(Math.max(r.length - 4, 0));

const password = CryptoJS.MD5(n + r + ".zip" + CryptoJS.MD5(o).toString()).toString();

document.querySelector("#download_url").innerText = e;
document.querySelector("#download_url").setAttribute("href", e)
document.querySelector("#password").innerText = password

})

</script>
{% endraw %}

## ……吗？

还有一个问题没有解决。

无论是`https://cdn1.foundertype.com/Public/Uploads/recommend/recommend.txt`推荐字体，还是`https://fclient.foundertype.com/fontActivate`激活字体，发送的都是字体的ID（一个数字），没有找到任何一个网络请求，将这个ID转换成诸如download_url之类的信息。

后来我们发现在`C:/Users/***/AppData/Roaming/方正字库/appData`中方正字库客户端还拉了一些东西。

- `font_slogan4`: 用于展示的压缩版字体文件，只包含特定字
- `infos`: 各种config数据，其中包含了你的登录信息
- `log`: 你看我们前面做了一堆hack，其实方正字库已经将log保存下来了
- `remoteDB`: 这就是我们要的数据

在`remoteDB/S20250129050002.sqlite`中有我们要的全部数据，这个数据（推测）是在前端进行处理的（解释了为什么要获取`sql-wasm.wasm`文件），每次更新时都会重新下载这个数据文件。

```sql
CREATE TABLE "fp_fonts" (
  "fontid" INT (11),
  "fontname" STRING (50),
  "image" STRING (100),
  "night_image" STRING (100),
  "download_url" STRING (100),
  "time" INT (12),
  "heat" INT (11),
  "ps_name" STRING (50),
  "font_weight" INT (5),
  "type" INT (5),
  "language" STRING (20),
  "tags" STRING (200),
  "show_img" STRING (50),
  "codeid" INT (2),
  "default_sort" INT(2) DEFAULT (0),
  "partner_id" INT(2),
  "ser_name_take" STRING(100),
  "is_show" INT(5),
  "m_made_time" INT(12),
  "marketing" STRING (100),
  "is_3d" integer(1) DEFAULT 0,
  "font_en_name" STRING (50),
  "split_data" STRING (300),
  "is_sell" integer(2) DEFAULT 0,
  "has_info" int(1),
  "is_install" int(1),
  "sort_name" STRING (50),
  "is_sort_default" int(2) DEFAULT 0,
  "new_image" STRING (300),
  PRIMARY KEY ("fontid")
)
```

## 更进一步，这个database又是哪来的

既然已经知道方正字库会下载一个database，欲实现全流程绕过就很容易了。

只需要知道这个database是从哪里来的

现在删除remoteDB中的sqlite文件，再次运行，相关的那个网络请求就露出鸡脚了。

```http
POST https://fclient.foundertype.com/getBaseData HTTP/1.1
Accept: application/json, text/plain, */*
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN
Connection: keep-alive
Content-Length: 361
Content-Type: application/x-www-form-urlencoded
Cookie: ...
Host: fclient.foundertype.com
Referer: https://cdn13.foundertype.com/
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-site
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ????/1.1.6 Chrome/102.0.5005.167 Electron/19.1.8 Safari/537.36
sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="102"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"

SystemVersion=Microsoft Windows 11 家庭版&
browser_version=1.1.6&
data_version=A20250207050956&
is_x86=0&
mac=<...>&
platform=fz_windows&
source_type=foundertype&
system=windows&
tag=131&
token=<...>&
version=1.1.6&
web_version=1.1.6&
secret=<...>
```

我们发现：Cookie删除不影响请求，修改body会导致参数错误。

说明参数body中存在一个用于检验integrity的参数。

追踪到createPostReq函数，

```js
  createPostReq: async function (e, t, n) {
    try {
      let n = await _c({ method: "post", url: e, data: t });
      if (n && n.data) return JSON.parse(n.data);
      throw new Error("接口响应数据为空!!");
    } catch (r) {
      if (("Network Error" != r.message && jc(e, t, null, r), !n)) throw r;
      if (n > 0) return await this.createPostReq(e, t, n - 1);
      if (-1 == n)
        return await vc.sleep(5e3), await this.createPostReq(e, t, n);
    }
  },
```

单步发现给到的参数`t`只含有`tag=131`和`data_version=A20250207050956`，说明其余的参数都是在此后的过程中送上的。

审查`_c`函数发现正是该函数干了往参数里拉屎的事

```js
 transformRequest: function (e, t) {
    if (e) {
      let t,
        n = Vf.getUserInfo(),
        r = pp.getConfigInfo(),
        o = Yp.getSystemInfo();
      (t = "string" == typeof e ? JSON.parse(e) : e),
        t.token || (t.token = n ? n.token : ""),
        t.version || (t.version = o ? o.webVersion : ""),
        t.web_version || (t.web_version = o ? o.webVersion : ""),
        t.browser_version || (t.browser_version = o ? o.clientVersion : ""),
        t.system || (t.system = o ? o.systemName : ""),
        t.SystemVersion || (t.SystemVersion = o ? o.systemVersion : ""),
        t.mac || (t.mac = o ? o.mac : ""),
        t.platform || (t.platform = o ? "fz_" + o.systemName : ""),
        t.is_x86 || (t.is_x86 = o && o.isSystemX86 ? 1 : 0),
        t.source_type || (t.source_type = r.channel),
        t.data_version || (t.data_version = pi.getDataVersion());
      let i = [];
      for (let c in e) i.push(c);
      i.sort();
      let s = "",
        a = "";
      for (let c = 0; c < i.length; c++) {
        let t = e[i[c]],
          n = t;
        "object" == typeof t
          ? ((t = JSON.stringify(t)), (n = encodeURIComponent(t)))
          : "string" == typeof t && (n = encodeURIComponent(t)),
          (s = s + i[c] + "=" + t),
          (a = a + i[c] + "=" + n),
          c < i.length - 1 && ((s += "&"), (a += "&"));
      }
      return (
        (a += "&secret=" + fs.hash(fs.hash(s) + pi.getDS())),
        console.log(
          `req...(${this.method}) url:${xc(this.baseURL) + xc(this.url)}`
        ),
        a
      );
    }
    return (
      console.log(
        `req...(${this.method}) url:${xc(this.baseURL) + xc(this.url)}`
      ),
      e
    );
  },
```

```js
getDS: function () {
  let e = [123, 64, 18, 105, 0, 75, 103, 85, 36, 111],
    t = [94, 42, 56, 40, 37, 36, 35, 113, 80, 78],
    n = [];
  for (let r = 0; r < e.length; r++) n.push(e[r] ^ t[r]);
  return String.fromCodePoint(...n);
},

// pi.getDS() === '%j*A%oD$t!'
```

这里可以看出`secret`就是鉴定integrity的field，并且逻辑也相当清楚，我们甚至可以优化一下这个函数的外观：

```js

import CryptoJS from 'crypto-js'



function craftBody(orig) {
    orig.version = '1.1.6'
    orig.web_version = '1.1.6'
    orig.browser_version = '1.1.6'
    orig.system = 'windows'
    orig.SystemVersion = '114514'
    orig.mac = 'deadbeefdeadbeefdeadbeefdeadbeef'
    orig.platform = 'fz_windows'
    orig.is_x86 = 0
    orig.source_type = 'foundertype'
    orig.data_version = 'S20250208050004'
    orig.token = ''

    const a = Object.entries(orig)
        .sort((a, b) => a[0] > b[0] ? 1 : -1)
        .map(v => v[0] + "=" + encodeURIComponent(v[1]))
        .join('&')

    const s = Object.entries(orig)
        .sort((a, b) => a[0] > b[0] ? 1 : -1)
        .map(v => v[0] + "=" + v[1])
        .join('&')
      
    const secret = CryptoJS.MD5(CryptoJS.MD5(s).toString() + '%j*A%oD$t!').toString()

    return a + '&secret=' + secret
}
```

需要注意的是`data_version`必须传，传空报错。

返回的`response.founder_data.data_url`就是数据库的下载地址。

这里还有区分——取决于给的参数，url可以是`https://cdn1.foundertype.com/Public/Uploads/CLIENTDB/All/fz_fonts_<version>.zip`或者是`https://cdn1.foundertype.com/Public/Uploads/CLIENTDB/Raise/1738962004/fonts_<version>.zip`，字面意思，一个是全集，一个是增量集。

# 源代码片段

## handleItemClicked

```js
async handleItemClicked(e, t) {
  let s = e.font,
    i = s.fontid;
  if (
    (console.log(
      Cm,
      "handle item clicked....fontId:" +
      s.fontid +
      ", fontName:" +
      s.fontname
    ),
      !this.isUserLogin)
  )
    return void Kh.showLoginView();
  if (ad.isFontDownloading(i))
    return (
      console.error("font is downloading, font:" + s.fontname),
      void this.showToast("字体下载中", -1)
    );
  if (ad.isFontInstalling(i))
    return (
      console.error("font is installing, font:" + s.fontname),
      void this.showToast("字体安装中", -1)
    );
  if (ad.isFontUsing(i))
    return (
      console.error("font is using, font:" + s.fontname),
      void this.showToast("换字中", -1)
    );
  if (
    !e.isServerFont() &&
    !ld.findLocalFontById(i) &&
    !e.font.download_url
  )
    return void this.showToast("该字体暂未收录至方正字库客户端", 2);
  s.hasTag &&
    s.hasTag("m3") &&
    ((e.showFreeTip = !0), setTimeout(() => (e.showFreeTip = !1), 3e3));
  let n,
    o = !0;
  e.extraFontInfos || (n = this.getActivateBtnView(e.font.fontid));
  let a = 1;
  if (s.isActivate && s.isActivate())
    (e.showProgressView = !0), (o = !1), (a = 0);
  else if (
    (n ? n.setState(-1) : ((a = 0), (e.showProgressView = !0)),
      10 == this.pageType)
  )
    (o = !1), ad.requestChangeActivateFonts(i, !0);
  else
    try {
      if ((await ad.requestChangeActivateFonts(i, !0), !this.isUserLogin))
        return;
    } catch (l) {
      return (
        console.error(l),
        this.showToast("字体激活失败", !1),
        void (n ? n.setState(0) : (e.showProgressView = !1))
      );
    }
  try {
    await ad.handleFontViewItemClicked(s, t, !1),
      e.updateFamilyId(),
      this.showDownloadCompleteAnim(e, a),
      o && this.isUserLogin && this.showToast("字体激活成功", !0);
  } catch (l) {
    console.error(l), this.showToast(l, !1);
  }
  n && n.setState(1), (e.showProgressView = !1);
}
```

## handleFontViewItemClicked

```js
handleFontViewItemClicked: async function (e, t, n) {
  console.log(
    "[换字]，点击字体列表... fontid:" +
    e.fontid +
    ", fontname:" +
    e.fontname +
    ", isUseFont:" +
    t
  );
  let r = e.fontid;
  Uc = r;
  let o = new Ja(r),
    i = !1;
  if (!Au.isFontFileExist(r))
    try {
      console.log(
        "[换字]，字体未下载，开始下载字体...fontid:" +
        e.fontid +
        ", fontname:" +
        e.fontname
      ),
        o.beginDownload();
      let t = await al(e);
      (i = !0),
        o.endDownload(!0),
        console.log(
          "[换字]，字体下载成功，开始安装字体...下载耗时:" +
          o.download +
          "ms, fontid:" +
          e.fontid +
          ", fontname:" +
          e.fontname +
          ", ttfPath:" +
          t.ttfPath
        );
    } catch (s) {
      throw (
        (console.log(
          "[换字]，字体下载失败...fontid:" +
          e.fontid +
          ", fontname:" +
          e.fontname +
          ", error:" +
          s
        ),
          setTimeout(() => {
            lc.uploadError(
              new oc("字体使用", "字体下载失败", {
                error: s,
                fontId: e.fontid,
                fontName: e.fontname,
              })
            );
          }, 1e3),
          (s + "").indexOf("no space left on device") >= 0
            ? new Error("磁盘空间不足，字体下载失败")
            : new Error("字体下载失败"))
      );
    }
  setTimeout(() => {
    lc.uploadFontDownEvent(r, n, i), lc.uploadSystemSoftware();
  }, 1e3);
  try {
    Fc.add(r), o.beginInstall();
    let t = await hl(r);
    if ((o.endInstall(), !El(t)))
      throw (
        (console.error(
          "[换字]，字体安装失败...fontid:" +
          e.fontid +
          ", fontname:" +
          e.fontname +
          ", error(installResult):" +
          t
        ),
          setTimeout(() => {
            lc.uploadError(
              new oc("字体使用", "字体安装失败", {
                error: "error:" + t,
                fontId: e.fontid,
                fontName: e.fontname,
              })
            );
          }, 1e3),
          new Error("字体安装失败"))
      );
    console.log(
      "[换字]，字体安装成功，开始更换字体...安装耗时:" +
      o.install +
      "ms, fontid:" +
      e.fontid +
      ", fontname:" +
      e.fontname
    );
  } catch (a) {
    throw (
      (console.error(
        "[换字]，字体安装失败...fontid:" +
        e.fontid +
        ", fontname:" +
        e.fontname +
        ", error:" +
        a
      ),
        setTimeout(() => {
          lc.uploadError(
            new oc("字体使用", "字体安装失败", {
              error: a,
              fontId: e.fontid,
              fontName: e.fontname,
            })
          );
        }, 1e3),
        new Error("字体安装失败"))
    );
  } finally {
    Fc.delete(r);
  }
  if (t)
    if (r == Uc) {
      if (Wc)
        return (
          (qc = { fontId: r, doesInfo: o }),
          void console.log(
            "[换字]，换字结束(换字中，保存该字体等待换字上次结束)...fontid:" +
            e.fontid +
            ", fontname:" +
            e.fontname
          )
        );
      try {
        Mc.add(r), await _l(r, o);
      } catch (a) {
      } finally {
        if ((Mc.delete(r), qc)) {
          let e = () => {
            if (qc) {
              let t = qc.fontId,
                n = qc.doesInfo;
              (qc = null),
                t == r
                  ? console.log(
                    "[换字]，上次换字结束，但保存的字体和上次换字的字体一致...fontid:" +
                    t
                  )
                  : t != Uc
                    ? console.log(
                      "[换字]，上次换字结束，但保存的字体非最后一次点击的字体...fontid:" +
                      t
                    )
                    : (console.log(
                      "[换字]，上次换字结束，开始更换最后一个保存的字体...fontid:" +
                      t
                    ),
                      Mc.add(t),
                      _l(t, n)
                        .catch(console.error)
                        .finally(() => {
                          Mc.delete(t), e();
                        }));
            } else
              console.log(
                "[换字]，上次换字结束，没有需要继续更换的字体....."
              );
          };
          e();
        }
      }
    } else
      console.log(
        "[换字]，换字结束(fontId != lastClickFontId)...fontid:" +
        e.fontid +
        ", fontname:" +
        e.fontname
      );
  else
    console.log(
      "[换字]，换字结束(isUseFont = false)...fontid:" +
      e.fontid +
      ", fontname:" +
      e.fontname
    );
},
```

## al

```js
function al(n, r) {
  return new Promise((o, i) => {
    let s = n.fontid;
    if (
      ("string" == typeof s && (s = Number(s)),
      r ? Au.isFontFileExist(s) && ul(n) : Au.isFontFileExist(s))
    ) {
      let e = Au.findLocalFontById(s);
      return (
        console.log(
          "字体已下载过，无需再次下载 fontId:" + s + ", fontName:" + e.fontName
        ),
        void o(e)
      );
    }
    if (!n.download_url)
      return (
        console.error(
          "字体下载链接为空, fontId:" + s + ", fontName:" + n.fontname
        ),
        void i("该字体未同步至云端")
      );
    let a = Nc.get(s);
    if (a) return void a.push({ resole: o, reject: i });
    Nc.set(n.fontid, [{ resole: o, reject: i }]);
    let c = (e, t) => {
        e
          ? console.error(
              "字体下载失败, id:" +
                n.fontid +
                ", name:" +
                n.fontname +
                ", error:" +
                e
            )
          : console.log(
              "字体下载成功, id:" + n.fontid + ", name:" + n.fontname
            );
        let r = Nc.get(n.fontid);
        if ((Nc.delete(n.fontid), r))
          for (let n of r) e ? n.reject(e) : n.resole(t);
      },
      l = ul(n),
      u = xl(!1, n.fontid);
    if (l) {
      console.log(
        "字体文件已存在，无需下载字体, id:" + n.fontid + ", font path:" + l
      );
      let t = e.joinPath(u, e.getFileNameByPath(l));
      return (
        t != l && e.copyFile(l, t),
        void cl(n, t)
          .then((e) => {
            c(null, e);
          })
          .catch((e) => {
            c(e);
          })
      );
    }
    console.log("开始下载字体, id:" + n.fontid + ", name:" + n.fontname),
      t
        .downloadAndUnzipToDir(
          n.download_url,
          Yp.getSystemInfo().storageInfo.cache,
          pl(n.download_url) // THIS IS CORE CODE TO GENERATE PASSWORD.
        )
        .then((t) => {
          let r = t[0],
            o = null,
            i = e.getFileNameByPath(r),
            s = !1;
          if (
            (kl(n.fontid) && (Yp.isWindows() || Yp.isMac())
              ? Yp.isWindows()
                ? (o = e.joinPath(u, ns.encryptionVipFontName(i)))
                : Yp.isMac() &&
                  (o = e.joinPath(
                    u,
                    fs.hash(n.fontid + "").toLowerCase() + ".ttf"
                  ))
              : ((o = e.joinPath(u, i)), Yp.isMac() && (s = !0)),
            console.log("copy downloaded font path from=" + r + "    to=" + o),
            s)
          ) {
            let t = new su();
            (t.ttfPath = r),
              (t.installTTFPath = o),
              bl([t], [0])
                .then((t) => {
                  e.deleteFile(r),
                    t && El(t[0])
                      ? cl(n, o)
                          .then((e) => {
                            c(null, e);
                          })
                          .catch((e) => {
                            c(e);
                          })
                      : c(new Error("install mac font error" + t[0]));
                })
                .catch((e) => c(e));
          } else
            e.copyFile(r, o),
              e.deleteFile(r),
              cl(n, o)
                .then((e) => {
                  c(null, e);
                })
                .catch((e) => {
                  c(e);
                });
        })
        .catch((e) => {
          c(e);
        });
  });
}
```

## fs

```js
fs = (us.exports = (function (e) {
    var t = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
    ];
    function n(e, t) {
      var n = e[0],
        r = e[1],
        o = e[2],
        i = e[3];
      (r =
        ((((r +=
          ((((o =
            ((((o +=
              ((((i =
                ((((i +=
                  ((((n =
                    ((((n += (((r & o) | (~r & i)) + t[0] - 680876936) | 0) <<
                      7) |
                      (n >>> 25)) +
                      r) |
                    0) &
                    r) |
                    (~n & o)) +
                    t[1] -
                    389564586) |
                  0) <<
                  12) |
                  (i >>> 20)) +
                  n) |
                0) &
                n) |
                (~i & r)) +
                t[2] +
                606105819) |
              0) <<
              17) |
              (o >>> 15)) +
              i) |
            0) &
            i) |
            (~o & n)) +
            t[3] -
            1044525330) |
          0) <<
          22) |
          (r >>> 10)) +
          o) |
        0),
        (r =
          ((((r +=
            ((((o =
              ((((o +=
                ((((i =
                  ((((i +=
                    ((((n =
                      ((((n += (((r & o) | (~r & i)) + t[4] - 176418897) | 0) <<
                        7) |
                        (n >>> 25)) +
                        r) |
                      0) &
                      r) |
                      (~n & o)) +
                      t[5] +
                      1200080426) |
                    0) <<
                    12) |
                    (i >>> 20)) +
                    n) |
                  0) &
                  n) |
                  (~i & r)) +
                  t[6] -
                  1473231341) |
                0) <<
                17) |
                (o >>> 15)) +
                i) |
              0) &
              i) |
              (~o & n)) +
              t[7] -
              45705983) |
            0) <<
            22) |
            (r >>> 10)) +
            o) |
          0),
        (r =
          ((((r +=
            ((((o =
              ((((o +=
                ((((i =
                  ((((i +=
                    ((((n =
                      ((((n +=
                        (((r & o) | (~r & i)) + t[8] + 1770035416) | 0) <<
                        7) |
                        (n >>> 25)) +
                        r) |
                      0) &
                      r) |
                      (~n & o)) +
                      t[9] -
                      1958414417) |
                    0) <<
                    12) |
                    (i >>> 20)) +
                    n) |
                  0) &
                  n) |
                  (~i & r)) +
                  t[10] -
                  42063) |
                0) <<
                17) |
                (o >>> 15)) +
                i) |
              0) &
              i) |
              (~o & n)) +
              t[11] -
              1990404162) |
            0) <<
            22) |
            (r >>> 10)) +
            o) |
          0),
        (r =
          ((((r +=
            ((((o =
              ((((o +=
                ((((i =
                  ((((i +=
                    ((((n =
                      ((((n +=
                        (((r & o) | (~r & i)) + t[12] + 1804603682) | 0) <<
                        7) |
                        (n >>> 25)) +
                        r) |
                      0) &
                      r) |
                      (~n & o)) +
                      t[13] -
                      40341101) |
                    0) <<
                    12) |
                    (i >>> 20)) +
                    n) |
                  0) &
                  n) |
                  (~i & r)) +
                  t[14] -
                  1502002290) |
                0) <<
                17) |
                (o >>> 15)) +
                i) |
              0) &
              i) |
              (~o & n)) +
              t[15] +
              1236535329) |
            0) <<
            22) |
            (r >>> 10)) +
            o) |
          0),
        (r =
          ((((r +=
            ((((o =
              ((((o +=
                ((((i =
                  ((((i +=
                    ((((n =
                      ((((n += (((r & i) | (o & ~i)) + t[1] - 165796510) | 0) <<
                        5) |
                        (n >>> 27)) +
                        r) |
                      0) &
                      o) |
                      (r & ~o)) +
                      t[6] -
                      1069501632) |
                    0) <<
                    9) |
                    (i >>> 23)) +
                    n) |
                  0) &
                  r) |
                  (n & ~r)) +
                  t[11] +
                  643717713) |
                0) <<
                14) |
                (o >>> 18)) +
                i) |
              0) &
              n) |
              (i & ~n)) +
              t[0] -
              373897302) |
            0) <<
            20) |
            (r >>> 12)) +
            o) |
          0),
        (r =
          ((((r +=
            ((((o =
              ((((o +=
                ((((i =
                  ((((i +=
                    ((((n =
                      ((((n += (((r & i) | (o & ~i)) + t[5] - 701558691) | 0) <<
                        5) |
                        (n >>> 27)) +
                        r) |
                      0) &
                      o) |
                      (r & ~o)) +
                      t[10] +
                      38016083) |
                    0) <<
                    9) |
                    (i >>> 23)) +
                    n) |
                  0) &
                  r) |
                  (n & ~r)) +
                  t[15] -
                  660478335) |
                0) <<
                14) |
                (o >>> 18)) +
                i) |
              0) &
              n) |
              (i & ~n)) +
              t[4] -
              405537848) |
            0) <<
            20) |
            (r >>> 12)) +
            o) |
          0),
        (r =
          ((((r +=
            ((((o =
              ((((o +=
                ((((i =
                  ((((i +=
                    ((((n =
                      ((((n += (((r & i) | (o & ~i)) + t[9] + 568446438) | 0) <<
                        5) |
                        (n >>> 27)) +
                        r) |
                      0) &
                      o) |
                      (r & ~o)) +
                      t[14] -
                      1019803690) |
                    0) <<
                    9) |
                    (i >>> 23)) +
                    n) |
                  0) &
                  r) |
                  (n & ~r)) +
                  t[3] -
                  187363961) |
                0) <<
                14) |
                (o >>> 18)) +
                i) |
              0) &
              n) |
              (i & ~n)) +
              t[8] +
              1163531501) |
            0) <<
            20) |
            (r >>> 12)) +
            o) |
          0),
        (r =
          ((((r +=
            ((((o =
              ((((o +=
                ((((i =
                  ((((i +=
                    ((((n =
                      ((((n +=
                        (((r & i) | (o & ~i)) + t[13] - 1444681467) | 0) <<
                        5) |
                        (n >>> 27)) +
                        r) |
                      0) &
                      o) |
                      (r & ~o)) +
                      t[2] -
                      51403784) |
                    0) <<
                    9) |
                    (i >>> 23)) +
                    n) |
                  0) &
                  r) |
                  (n & ~r)) +
                  t[7] +
                  1735328473) |
                0) <<
                14) |
                (o >>> 18)) +
                i) |
              0) &
              n) |
              (i & ~n)) +
              t[12] -
              1926607734) |
            0) <<
            20) |
            (r >>> 12)) +
            o) |
          0),
        (r =
          ((((r +=
            (((o =
              ((((o +=
                (((i =
                  ((((i +=
                    (((n =
                      ((((n += ((r ^ o ^ i) + t[5] - 378558) | 0) << 4) |
                        (n >>> 28)) +
                        r) |
                      0) ^
                      r ^
                      o) +
                      t[8] -
                      2022574463) |
                    0) <<
                    11) |
                    (i >>> 21)) +
                    n) |
                  0) ^
                  n ^
                  r) +
                  t[11] +
                  1839030562) |
                0) <<
                16) |
                (o >>> 16)) +
                i) |
              0) ^
              i ^
              n) +
              t[14] -
              35309556) |
            0) <<
            23) |
            (r >>> 9)) +
            o) |
          0),
        (r =
          ((((r +=
            (((o =
              ((((o +=
                (((i =
                  ((((i +=
                    (((n =
                      ((((n += ((r ^ o ^ i) + t[1] - 1530992060) | 0) << 4) |
                        (n >>> 28)) +
                        r) |
                      0) ^
                      r ^
                      o) +
                      t[4] +
                      1272893353) |
                    0) <<
                    11) |
                    (i >>> 21)) +
                    n) |
                  0) ^
                  n ^
                  r) +
                  t[7] -
                  155497632) |
                0) <<
                16) |
                (o >>> 16)) +
                i) |
              0) ^
              i ^
              n) +
              t[10] -
              1094730640) |
            0) <<
            23) |
            (r >>> 9)) +
            o) |
          0),
        (r =
          ((((r +=
            (((o =
              ((((o +=
                (((i =
                  ((((i +=
                    (((n =
                      ((((n += ((r ^ o ^ i) + t[13] + 681279174) | 0) << 4) |
                        (n >>> 28)) +
                        r) |
                      0) ^
                      r ^
                      o) +
                      t[0] -
                      358537222) |
                    0) <<
                    11) |
                    (i >>> 21)) +
                    n) |
                  0) ^
                  n ^
                  r) +
                  t[3] -
                  722521979) |
                0) <<
                16) |
                (o >>> 16)) +
                i) |
              0) ^
              i ^
              n) +
              t[6] +
              76029189) |
            0) <<
            23) |
            (r >>> 9)) +
            o) |
          0),
        (r =
          ((((r +=
            (((o =
              ((((o +=
                (((i =
                  ((((i +=
                    (((n =
                      ((((n += ((r ^ o ^ i) + t[9] - 640364487) | 0) << 4) |
                        (n >>> 28)) +
                        r) |
                      0) ^
                      r ^
                      o) +
                      t[12] -
                      421815835) |
                    0) <<
                    11) |
                    (i >>> 21)) +
                    n) |
                  0) ^
                  n ^
                  r) +
                  t[15] +
                  530742520) |
                0) <<
                16) |
                (o >>> 16)) +
                i) |
              0) ^
              i ^
              n) +
              t[2] -
              995338651) |
            0) <<
            23) |
            (r >>> 9)) +
            o) |
          0),
        (r =
          ((((r +=
            (((i =
              ((((i +=
                ((r ^
                  ((n =
                    ((((n += ((o ^ (r | ~i)) + t[0] - 198630844) | 0) << 6) |
                      (n >>> 26)) +
                      r) |
                    0) |
                    ~o)) +
                  t[7] +
                  1126891415) |
                0) <<
                10) |
                (i >>> 22)) +
                n) |
              0) ^
              ((o =
                ((((o += ((n ^ (i | ~r)) + t[14] - 1416354905) | 0) << 15) |
                  (o >>> 17)) +
                  i) |
                0) |
                ~n)) +
              t[5] -
              57434055) |
            0) <<
            21) |
            (r >>> 11)) +
            o) |
          0),
        (r =
          ((((r +=
            (((i =
              ((((i +=
                ((r ^
                  ((n =
                    ((((n += ((o ^ (r | ~i)) + t[12] + 1700485571) | 0) << 6) |
                      (n >>> 26)) +
                      r) |
                    0) |
                    ~o)) +
                  t[3] -
                  1894986606) |
                0) <<
                10) |
                (i >>> 22)) +
                n) |
              0) ^
              ((o =
                ((((o += ((n ^ (i | ~r)) + t[10] - 1051523) | 0) << 15) |
                  (o >>> 17)) +
                  i) |
                0) |
                ~n)) +
              t[1] -
              2054922799) |
            0) <<
            21) |
            (r >>> 11)) +
            o) |
          0),
        (r =
          ((((r +=
            (((i =
              ((((i +=
                ((r ^
                  ((n =
                    ((((n += ((o ^ (r | ~i)) + t[8] + 1873313359) | 0) << 6) |
                      (n >>> 26)) +
                      r) |
                    0) |
                    ~o)) +
                  t[15] -
                  30611744) |
                0) <<
                10) |
                (i >>> 22)) +
                n) |
              0) ^
              ((o =
                ((((o += ((n ^ (i | ~r)) + t[6] - 1560198380) | 0) << 15) |
                  (o >>> 17)) +
                  i) |
                0) |
                ~n)) +
              t[13] +
              1309151649) |
            0) <<
            21) |
            (r >>> 11)) +
            o) |
          0),
        (r =
          ((((r +=
            (((i =
              ((((i +=
                ((r ^
                  ((n =
                    ((((n += ((o ^ (r | ~i)) + t[4] - 145523070) | 0) << 6) |
                      (n >>> 26)) +
                      r) |
                    0) |
                    ~o)) +
                  t[11] -
                  1120210379) |
                0) <<
                10) |
                (i >>> 22)) +
                n) |
              0) ^
              ((o =
                ((((o += ((n ^ (i | ~r)) + t[2] + 718787259) | 0) << 15) |
                  (o >>> 17)) +
                  i) |
                0) |
                ~n)) +
              t[9] -
              343485551) |
            0) <<
            21) |
            (r >>> 11)) +
            o) |
          0),
        (e[0] = (n + e[0]) | 0),
        (e[1] = (r + e[1]) | 0),
        (e[2] = (o + e[2]) | 0),
        (e[3] = (i + e[3]) | 0);
    }
    function r(e) {
      var t,
        n = [];
      for (t = 0; t < 64; t += 4)
        n[t >> 2] =
          e.charCodeAt(t) +
          (e.charCodeAt(t + 1) << 8) +
          (e.charCodeAt(t + 2) << 16) +
          (e.charCodeAt(t + 3) << 24);
      return n;
    }
    function o(e) {
      var t,
        n = [];
      for (t = 0; t < 64; t += 4)
        n[t >> 2] =
          e[t] + (e[t + 1] << 8) + (e[t + 2] << 16) + (e[t + 3] << 24);
      return n;
    }
    function i(e) {
      var t,
        o,
        i,
        s,
        a,
        c,
        l = e.length,
        u = [1732584193, -271733879, -1732584194, 271733878];
      for (t = 64; t <= l; t += 64) n(u, r(e.substring(t - 64, t)));
      for (
        o = (e = e.substring(t - 64)).length,
          i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          t = 0;
        t < o;
        t += 1
      )
        i[t >> 2] |= e.charCodeAt(t) << (t % 4 << 3);
      if (((i[t >> 2] |= 128 << (t % 4 << 3)), t > 55))
        for (n(u, i), t = 0; t < 16; t += 1) i[t] = 0;
      return (
        (s = (s = 8 * l).toString(16).match(/(.*?)(.{0,8})$/)),
        (a = parseInt(s[2], 16)),
        (c = parseInt(s[1], 16) || 0),
        (i[14] = a),
        (i[15] = c),
        n(u, i),
        u
      );
    }
    function s(e) {
      var t,
        r,
        i,
        s,
        a,
        c,
        l = e.length,
        u = [1732584193, -271733879, -1732584194, 271733878];
      for (t = 64; t <= l; t += 64) n(u, o(e.subarray(t - 64, t)));
      for (
        r = (e = t - 64 < l ? e.subarray(t - 64) : new Uint8Array(0)).length,
          i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          t = 0;
        t < r;
        t += 1
      )
        i[t >> 2] |= e[t] << (t % 4 << 3);
      if (((i[t >> 2] |= 128 << (t % 4 << 3)), t > 55))
        for (n(u, i), t = 0; t < 16; t += 1) i[t] = 0;
      return (
        (s = (s = 8 * l).toString(16).match(/(.*?)(.{0,8})$/)),
        (a = parseInt(s[2], 16)),
        (c = parseInt(s[1], 16) || 0),
        (i[14] = a),
        (i[15] = c),
        n(u, i),
        u
      );
    }
    function a(e) {
      var n,
        r = "";
      for (n = 0; n < 4; n += 1)
        r += t[(e >> (8 * n + 4)) & 15] + t[(e >> (8 * n)) & 15];
      return r;
    }
    function c(e) {
      var t;
      for (t = 0; t < e.length; t += 1) e[t] = a(e[t]);
      return e.join("");
    }
    function l(e) {
      return (
        /[\u0080-\uFFFF]/.test(e) && (e = unescape(encodeURIComponent(e))), e
      );
    }
    function u(e, t) {
      var n,
        r = e.length,
        o = new ArrayBuffer(r),
        i = new Uint8Array(o);
      for (n = 0; n < r; n += 1) i[n] = e.charCodeAt(n);
      return t ? i : o;
    }
    function f(e) {
      return String.fromCharCode.apply(null, new Uint8Array(e));
    }
    function p(e, t, n) {
      var r = new Uint8Array(e.byteLength + t.byteLength);
      return (
        r.set(new Uint8Array(e)),
        r.set(new Uint8Array(t), e.byteLength),
        n ? r : r.buffer
      );
    }
    function h(e) {
      var t,
        n = [],
        r = e.length;
      for (t = 0; t < r - 1; t += 2) n.push(parseInt(e.substr(t, 2), 16));
      return String.fromCharCode.apply(String, n);
    }
    function d() {
      this.reset();
    }
    return (
      c(i("hello")),
      "undefined" == typeof ArrayBuffer ||
        ArrayBuffer.prototype.slice ||
        (function () {
          function t(e, t) {
            return (e = 0 | e || 0) < 0 ? Math.max(e + t, 0) : Math.min(e, t);
          }
          ArrayBuffer.prototype.slice = function (n, r) {
            var o,
              i,
              s,
              a,
              c = this.byteLength,
              l = t(n, c),
              u = c;
            return (
              r !== e && (u = t(r, c)),
              l > u
                ? new ArrayBuffer(0)
                : ((o = u - l),
                  (i = new ArrayBuffer(o)),
                  (s = new Uint8Array(i)),
                  (a = new Uint8Array(this, l, o)),
                  s.set(a),
                  i)
            );
          };
        })(),
      (d.prototype.append = function (e) {
        return this.appendBinary(l(e)), this;
      }),
      (d.prototype.appendBinary = function (e) {
        (this._buff += e), (this._length += e.length);
        var t,
          o = this._buff.length;
        for (t = 64; t <= o; t += 64)
          n(this._hash, r(this._buff.substring(t - 64, t)));
        return (this._buff = this._buff.substring(t - 64)), this;
      }),
      (d.prototype.end = function (e) {
        var t,
          n,
          r = this._buff,
          o = r.length,
          i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (t = 0; t < o; t += 1) i[t >> 2] |= r.charCodeAt(t) << (t % 4 << 3);
        return (
          this._finish(i, o),
          (n = c(this._hash)),
          e && (n = h(n)),
          this.reset(),
          n
        );
      }),
      (d.prototype.reset = function () {
        return (
          (this._buff = ""),
          (this._length = 0),
          (this._hash = [1732584193, -271733879, -1732584194, 271733878]),
          this
        );
      }),
      (d.prototype.getState = function () {
        return {
          buff: this._buff,
          length: this._length,
          hash: this._hash.slice(),
        };
      }),
      (d.prototype.setState = function (e) {
        return (
          (this._buff = e.buff),
          (this._length = e.length),
          (this._hash = e.hash),
          this
        );
      }),
      (d.prototype.destroy = function () {
        delete this._hash, delete this._buff, delete this._length;
      }),
      (d.prototype._finish = function (e, t) {
        var r,
          o,
          i,
          s = t;
        if (((e[s >> 2] |= 128 << (s % 4 << 3)), s > 55))
          for (n(this._hash, e), s = 0; s < 16; s += 1) e[s] = 0;
        (r = (r = 8 * this._length).toString(16).match(/(.*?)(.{0,8})$/)),
          (o = parseInt(r[2], 16)),
          (i = parseInt(r[1], 16) || 0),
          (e[14] = o),
          (e[15] = i),
          n(this._hash, e);
      }),
      (d.hash = function (e, t) {
        return d.hashBinary(l(e), t);
      }),
      (d.hashBinary = function (e, t) {
        var n = c(i(e));
        return t ? h(n) : n;
      }),
      (d.ArrayBuffer = function () {
        this.reset();
      }),
      (d.ArrayBuffer.prototype.append = function (e) {
        var t,
          r = p(this._buff.buffer, e, !0),
          i = r.length;
        for (this._length += e.byteLength, t = 64; t <= i; t += 64)
          n(this._hash, o(r.subarray(t - 64, t)));
        return (
          (this._buff =
            t - 64 < i
              ? new Uint8Array(r.buffer.slice(t - 64))
              : new Uint8Array(0)),
          this
        );
      }),
      (d.ArrayBuffer.prototype.end = function (e) {
        var t,
          n,
          r = this._buff,
          o = r.length,
          i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (t = 0; t < o; t += 1) i[t >> 2] |= r[t] << (t % 4 << 3);
        return (
          this._finish(i, o),
          (n = c(this._hash)),
          e && (n = h(n)),
          this.reset(),
          n
        );
      }),
      (d.ArrayBuffer.prototype.reset = function () {
        return (
          (this._buff = new Uint8Array(0)),
          (this._length = 0),
          (this._hash = [1732584193, -271733879, -1732584194, 271733878]),
          this
        );
      }),
      (d.ArrayBuffer.prototype.getState = function () {
        var e = d.prototype.getState.call(this);
        return (e.buff = f(e.buff)), e;
      }),
      (d.ArrayBuffer.prototype.setState = function (e) {
        return (e.buff = u(e.buff, !0)), d.prototype.setState.call(this, e);
      }),
      (d.ArrayBuffer.prototype.destroy = d.prototype.destroy),
      (d.ArrayBuffer.prototype._finish = d.prototype._finish),
      (d.ArrayBuffer.hash = function (e, t) {
        var n = c(s(new Uint8Array(e)));
        return t ? h(n) : n;
      }),
      d
    );
  })()),
```
