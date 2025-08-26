---
title: frida抓Android网络包操作备忘
date: 2025-02-15T23:05:30+08:00
tags:
---
使用的是雷电模拟器。使用时注意雷电模拟器文件夹里**自带的`adb.exe`拉的一批**，要自己弄个新的adb套件；

如果还没有`frida-server`，上GitHub下载一个，

```shell
 adb push frida-server /data/local/frida-server
```

准备一个`dumpSSLKey.js`，内容为：

```js
function startTLSKeyLogger(SSL_CTX_new, SSL_CTX_set_keylog_callback) {
  console.log("start----")
  function keyLogger(ssl, line) {
    console.log(new NativePointer(line).readCString());
  }
  const keyLogCallback = new NativeCallback(keyLogger, 'void', ['pointer', 'pointer']);

  Interceptor.attach(SSL_CTX_new, {
    onLeave: function (retval) {
      const ssl = new NativePointer(retval);
      const SSL_CTX_set_keylog_callbackFn = new NativeFunction(SSL_CTX_set_keylog_callback, 'void', ['pointer', 'pointer']);
      SSL_CTX_set_keylog_callbackFn(ssl, keyLogCallback);
    }
  });
}
startTLSKeyLogger(
  Module.findExportByName('libssl.so', 'SSL_CTX_new'),
  Module.findExportByName('libssl.so', 'SSL_CTX_set_keylog_callback')
)
```

开始抓包：

Step 1:

```shell
adb shell /data/local/tmp/frida-server
```

Step 2:

这里`-w`后的地址为你在模拟器上配置的与电脑host共享的地址

```shell
adb shell tcpdump -i any -s 0 -w /sdcard/Pictures/output.pcap
```

Step 3:

`-f`后为包名

```shell
frida -U -l dumpSSLKey.js -f net.crigh.mysport
```

在此时，命令行会输出一些内容，这些内容需要保存至本地，后续要用

Step 4:

完成后启动Wireshark，将pcap文件拖进来，然后 编辑->首选项->Protocols->TLS

将(Pre)-Master-Secret Log Filename中填入Step 3中的文件名。

回到主页，上方filter中填`http`然后就可以愉快地分析网络流了


<!-- more -->
