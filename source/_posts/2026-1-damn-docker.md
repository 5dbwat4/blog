---
title: Docker使用问题合集
date: 2026-01-27T23:45:57+08:00
tags:
---


在做一个项目，涉及到非常多的docker配置问题，接下来挨个记录一下。

# docker没网

是的，docker在编译期也会出现没网的问题

表现为docker在apt install xxx的时候全是`Ign ...`，无法下载包

使用`docker build --network=host ...`（加上`--network=host`参数）可以结决这个问题

同理，在运行docker容器时，如果需要联网，也可以加上`--network=host`参数

# 给容器的pip配置镜像


```sh
#! /bin/bash

# in which user you run pip , in which user run this shell



# choose --system to write /etc/pip.conf (may require sudo), otherwise writes user config
if [ "$1" = "--system" ]; then
    TARGET=/etc/pip.conf
else
    TARGET="${XDG_CONFIG_HOME:-$HOME/.config}/pip/pip.conf"
fi

mkdir -p "$(dirname "$TARGET")"
[ -f "$TARGET" ] && cp -a "$TARGET" "$TARGET".bak."$(date +%s)"

cat > "$TARGET" <<'PIPCONF'
[global]
index-url = https://mirrors.zju.edu.cn/pypi/simple/
extra-index-url =
        https://pypi.tuna.tsinghua.edu.cn/simple
        https://mirrors.nju.edu.cn/pypi/simple/
        https://mirrors.aliyun.com/pypi/simple/
PIPCONF

printf 'pip config written to: %s\n' "$TARGET"
```

同时Dockerfile中添加：

```
COPY ./python-set-mirror.sh /tmp/python-set-mirror.sh
RUN bash /tmp/python-set-mirror.sh && rm /tmp/python-set-mirror.sh
```

# 下载Node.js并配置国内镜像

```dockerfile
# Install Node.js (LTS version)
RUN curl -fsSL http://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

RUN npm config set registry http://registry.npmmirror.com/
```

为什么不用nvm？因为我们访问不了githubusercontent.com

为什么不用官方deb？因为官方deb版本太老了

为什么不`FROM node:24-alpine`？因为项目要求所有docker都要是同一个base image。

如果你没有上述三个需求，那么直接`FROM node:24-alpine`就没这些p事了

<!-- # 选择妥当的python版本

我们的python有着复杂的依赖关系，（尤其是在复现一个4年前的项目时，这个项目使用了numpy一个特定的功能，这个功能在某个numpy版本中被移除了，而此前的numpy不支持高版本python），这个时候：

`python3.9-venv`依赖`python` -->

# 妥当的使用apt源以及deb源

浙江大学内部的话：

- Debian: https://mirrors.zju.edu.cn/docs/debian/
- Ubuntu: https://mirrors.zju.edu.cn/docs/ubuntu/

外部的话可以使用清华源：

- Debian: https://mirrors.tuna.tsinghua.edu.cn/help/debian/
- Ubuntu: https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/

可以保存到本地，然后在Dockefile里面`COPY ./debian-sources.list /etc/apt/sources.list.d/debian.sources`



# `apt update`在装`tzdata`时卡住了

在Dockerfile中添加：

```dockerfile
ENV DEBIAN_FRONTEND=noninteractive \
    TZ=Asia/Shanghai
```

# 定型文（前置版）

```dockerfile
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    pkg-config \
    clang \
    cmake \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*
```

涉及到编译相关的东西👆

话说回来其实可以直接莽上，然后缺啥补啥也不失为一种选择。反正目前的情况下把报错发给LLM它一般都能识别出你需要添加啥包

# python venv

你通常会遇到这一坨东西

```
[externally-managed]
Error=To install Python packages system-wide, try apt install
 python3-xyz, where xyz is the package you are trying to
 install.

 If you wish to install a non-Debian-packaged Python package,
 create a virtual environment using python3 -m venv path/to/venv.
 Then use path/to/venv/bin/python and path/to/venv/bin/pip. Make
 sure you have python3-full installed.

 If you wish to install a non-Debian packaged Python application,
 it may be easiest to use pipx install xyz, which will manage a
 virtual environment for you. Make sure you have pipx installed.
```

那么可以

```dockerfile
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
```

然后就可以正常操作python了

## 不如切到uv

[uv](https://github.com/astral-sh/uv)是一个新的python包管理工具，支持虚拟环境，安装包，运行python脚本，感觉比pip更好用一些，最主要的是有更好的venv支持。

举个例子`slither`和`brownie`的`web3`版本是冲突的，使用uv的话就可以`uv tool install slither-analyser`，它会为slither-analyser创建一个独立的venv，安装它的依赖，这样就不会和brownie的web3版本冲突了

# 清一清docker缓存

```sh
docker system prune -a
```

顺便一提，清完docker缓存后，wsl占的空间不会自动释放，可以参考

Step 1:
```sh
wsl --shutdown
```

Step 2:
```sh
diskpart # 先运行这个，下面的东西都是在这个里面运行的
# 选择虚拟磁盘文件
select vdisk file="D:\wsl\ext4.vhdx"
# 压缩文件
compact vdisk
# 压缩完毕后卸载磁盘
detach vdisk
```

# docker 与本地文件互动

参考文献：https://docs.docker.com/engine/storage/bind-mounts/

直接用命令行：

```
docker run --mount type=bind,src=<host-path>,dst=<container-path>
docker run --volume <host-path>:<container-path>
```

按照官方文档的说法，`--mount`更推荐一些，具体差异我没有尝试过（暂时还用不上*supports all the available options*）

# Dockerfile是有作用域的，而且没办法用类似include的方式组合Dockerfile

对不起这个可能有点sb，但是我真的在尝试这样一件事情，就是有几个应用，它们之间有一些共享的部分，也有一些有差异的部分，然后我就在尝试找一种类似`include ../../shared/xx.dockerfile`的方式来组合Dockerfile，结果发现并没有这样的功能，

除此以外，如果你想要`COPY ../shared/xx /app/xx`，也是不行的，COPY只能COPY当前Dockerfile所在目录的子目录

# 配置dockerhub镜像

浙大校内：访问https://git.zju.edu.cn/-o-/dh

阿里云：参考文献 https://help.aliyun.com/zh/acr/user-guide/accelerate-the-pulls-of-docker-official-images