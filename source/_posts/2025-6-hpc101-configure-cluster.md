---
title: 记没有sudo的情况下HPC101节点的使用寄巧
date: 2025-06-25T13:10:37+08:00
tags:
---
简单的说，就是在没有`sudo`的情况下，一些配置如何退而求其次。

先说一下HPC101给的节点的状况：

- 没有sudo（很显然）
- 预装的软件包不多（SadServers都知道装一个asciinema你居然没有）

# oh-my-zsh 配置

直接`sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`  (ref: [Oh My Zsh - a delightful & open source framework for Zsh](https://ohmyz.sh/#install))

会到这个地方卡住：

```plain
Time to change your default shell to zsh:
Do you want to change your default shell to zsh? [Y/n]
Changing your shell to /usr/bin/zsh...
Password:
```

很显然我们没有Password，所以这里询问时直接`n`就行

然后**通过写`.bashrc`的方式实现`zsh`自动启用**

`vi ~/.bashrc`然后在结尾追加

```
# ========== OH MY ZSH init =========

if [ -t 1 ]; then
    exec zsh
fi

# =====end== OH MY ZSH init =========
```

# 装一个 asciinema

没有sudo，所以不能`apt install asciinema`，所幸asciinema官网上就有退而求其次的方案：

```bash
pipx install asciinema
```

(ref: [Getting started - asciinema docs](https://docs.asciinema.org/getting-started/#recording))

# jupyter notebook, over SSH

假定你想要偷集群的算力去学[d2l.ai](https://en.d2l.ai)，你按照文档的步骤已经走到了这一步：

> At this point, you can open [http://localhost:8888](http://localhost:8888/) (it may have already opened automatically) in your web browser.

很显然集群上没有web browser，用X11 forwarding来转发则更是幽默，可以用以下手段：

```shell
ssh -L 8888:localhost:8888 hpc101
```

意思是说将本地的8888端口和远程的8888端口绑定。

然后就可以在本地浏览器访问jupyter notebook了

# Build everything into `~/.local`

没有sudo权限，装软件只能装在用户目录下，通常是`~/.local`，所以在编译安装软件时，指定`./configure --prefix=$HOME/.local`即可

然后要处理环境变量的问题：

```shell
export PATH=$HOME/.local/bin:$PATH
export LD_LIBRARY_PATH=$HOME/.local/lib:$LD_LIBRARY_PATH
export PKG_CONFIG_PATH=$HOME/.local/lib/pkgconfig:$PKG_CONFIG_PATH
export C_INCLUDE_PATH=$HOME/.local/include:$C_INCLUDE_PATH
export CPLUS_INCLUDE_PATH=$HOME/.local/include:$CPLUS_INCLUDE_PATH
```

（主要是前两个，其它的反正我没遇到过相关导致的报错）

完成之后还要`ldconfig`一下，不然`ld`会炸。

```shell
mkdir -p $HOME/.local/lib/ldconfig
echo "$HOME/.local/lib" > $HOME/.local/lib/ld.so.conf
ldconfig -f $HOME/.local/lib/ld.so.conf
```
