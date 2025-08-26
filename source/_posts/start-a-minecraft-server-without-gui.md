---
title: 用阿里云无GUI启动Minecraft服务器
date: 2024-07-06T23:19:18+08:00
tags:
---
当我们想单机玩[Minecraft](https://minecraft.net)时，如何启动Minecraft并不是一件难事，因为官方启动器以及各种HMCL之类的启动器会帮助我们完成诸如安装java、下载minecraft的jar文件、管理各种模组之类的工作。

同理，联机也不是什么难事。启动Minecraft后，我们可以轻松“**向局域网开放**”，然后内网穿透一下便可。

这就导致，必须有一个人先启动游戏，其他人才能联机。

我们现在希望每个玩家可以平等地加入游戏，希望让游戏服务器持久化运行。当然，网上有专门做Minecraft服务器租用的平台。

但是，我们希望把服务器放在阿里云上。

<!-- more -->

## 一键式部署

[3分钟部署 我的世界（Minecraft） 联机服务-阿里云开发者社区 (aliyun.com)](https://developer.aliyun.com/article/1454890)

真的是一键部署，相当方便。问题是，启动服务器后发现配置游戏参数时忘了`online-mode=false`，改不了了，怎么办

### 探索该服务的文件结构

远程连接到ecs。

`/opt/minecraft`目录下是游戏服务器&存档文件。

`/opt/minecraft/instances/servival[or creative]/server.properties`就是配置文件，可以参照[server.properties – Minecraft Wiki](https://minecraft.wiki/w/Server.properties)修改。

## 从零开始部署

创建ecs服务器，远程连接，假设你用的是linux系统。

### Step 0 安装java

[教程:架设Java版服务器 - 中文 Minecraft Wiki](https://zh.minecraft.wiki/w/Tutorial:%E6%9E%B6%E8%AE%BEJava%E7%89%88%E6%9C%8D%E5%8A%A1%E5%99%A8)

这里说的很清楚。

### Step 1 打基础

决定你要把服务器放在哪里。假设这个位置是`/opt/minecraft`，那么你需要一路`mkdir`过来

### Step 2 安装游戏文件

[Minecraft Server Download | Minecraft](https://www.minecraft.net/en-us/download/server)

官方文档，但只有1.21版本。

如果你打开了文件管理，那么很容易被“上传”按钮吸引，决定本地下载再上传到ecs。

不如直接`wget`。

```bash
wget https://piston-data.mojang.com/v1/objects/450698d1863ab5180c25d7c804ef0fe6369dd1ba/server.jar
```

右键复制链接可以得到上面jar文件的URL

### Step 3 First run

```bash
java -Xmx1024M -Xms1024M -jar server.jar nogui
```

记得修改`eula.txt`

## wiki中没有说清楚的东西

### 我想下载其他版本，怎么办

[piston-meta.mojang.com/mc/game/version\_manifest.json](https://piston-meta.mojang.com/mc/game/version_manifest.json)

这里有所有版本的manifest。

```json
{
    "id": "1.21",
    "type": "release",
    "url": "https://piston-meta.mojang.com/v1/packages/177e49d3233cb6eac42f0495c0a48e719870c2ae/1.21.json",
    "time": "2024-06-13T08:32:38+00:00",
    "releaseTime": "2024-06-13T08:24:03+00:00"
}
```

访问url中的地址，找到`downloads.server.url`，`wget`这个url

### "Failed to bind to port!"时，怎么办

具体的说，是发生这个情况时，怎么办：

> 此类问题亦有可能是操作者疏忽导致服务端未关闭就再次开启了服务端，典型的错误操作有：Windows中直接双击了核心jar，Linux中使用守护进程运行Java等，导致服务端在后台运行而操作者未注意的情况。遇到此类问题可先检查占用该端口的进程，获取控制或将其结束，再启动服务端。

先`lsof -i:25565`，找到进程PID，`kill`它

### nohup: 关闭workbench时不会“服务器已断开连接”

给所有命令前面加一个`nohup`

## 我要安装forge，添加mods

去[Downloads for Minecraft Forge](https://files.minecraftforge.net/net/minecraftforge/forge/)找到你要安装的版本，同样的方法，`wget`到目录下。

运行`java -jar forge-1.20.1-47.2.0-installer.jar nogui --installServer`

上面的文件名是你下载的forge文件的文件名

完成后，在该目录下，会出现许多文件（夹），其中应该有`run.sh`,`mods`

可以仿照[Minecraft 1.20.1 Forge服务器保姆级搭建教程（Linux系统纯Shell管理，无mcsm面板） - 哔哩哔哩 (bilibili.com)](https://www.bilibili.com/read/cv34839109/)中的方法将`nogui`参数加到`run.sh`中，

然后把你要安装的mods下载到`mods`文件夹中。

*NOTE:* 模组之间会有各种依赖，可以先在本地用启动器安装模组，看看总共有哪些依赖，然后再去`wget`

最后一步，`nohup ./run.sh`

## Reference

[3分钟部署 我的世界（Minecraft） 联机服务-阿里云开发者社区 (aliyun.com)](https://developer.aliyun.com/article/1454890)

[教程:架设Java版服务器 - 中文 Minecraft Wiki](https://zh.minecraft.wiki/w/Tutorial:%E6%9E%B6%E8%AE%BEJava%E7%89%88%E6%9C%8D%E5%8A%A1%E5%99%A8)

[Minecraft Server Download | Minecraft](https://www.minecraft.net/en-us/download/server)

[Minecraft 1.20.1 Forge服务器保姆级搭建教程（Linux系统纯Shell管理，无mcsm面板） - 哔哩哔哩 (bilibili.com)](https://www.bilibili.com/read/cv34839109/)
