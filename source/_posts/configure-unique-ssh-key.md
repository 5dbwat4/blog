---
title: 配置多SSH密钥，ssh_config以及authorized_keys
date: 2024-12-29T14:22:01+08:00
tags:
---

# 每次生成一个新密钥

```shell
ssh-keygen -t ed25519 -C "your_email@example.com"
```

# 添加config

1. 打开`~/.ssh/config`，追加内容：

   ```ssh-config
   Host something
       User root
       Hostname example.com
       PreferredAuthentications publickey
       IdentityFile ~/.ssh/id_rsa_or_your_file_name
   ```
2. 把`ssh-agent`开下来

   ```shell
   ssh-agent -s
   ```
3. 把新key加到ssh里面

   ```shell
   ssh-add ~/.ssh/id_rsa_or_your_file_name
   ```

# 设置远程authorized_keys

1. 登到远程服务器
2. 去往`~/.ssh/authorized_keys`
3. 把对应的.pub文件里的东西（一行）粘进去，保存


<!-- more -->