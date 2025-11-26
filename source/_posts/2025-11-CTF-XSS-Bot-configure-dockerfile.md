---
title: 配置XSS Bot的Dockerfile
date: 2025-11-26T19:57:50+08:00
tags:
---

# puppeteer


定型文：

```dockerfile
FROM node:24-slim

# Install Chrome dependencies
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

ENV XDG_CONFIG_HOME=/tmp/.chromium \
    XDG_CACHE_HOME=/tmp/.chromium

RUN apt-get update && apt-get install -y --no-install-recommends \
      gnupg2 wget ca-certificates \
    && wget -qO- https://dl.google.com/linux/linux_signing_key.pub \
         | gpg --dearmor > /usr/share/keyrings/google-linux-signing-keyring.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-linux-signing-keyring.gpg] \
         http://dl.google.com/linux/chrome/deb/ stable main" \
         > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*        
```

如果用Node.js中的puppeteer：

```dockerfile
WORKDIR /app
COPY package*.json ./

RUN npm install

COPY app /app

EXPOSE 8080
CMD [ "node", "server.js" ]
```

<!-- more -->

目前只用过这个，其它的用到时再补充。