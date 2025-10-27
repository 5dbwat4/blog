---
title: 为DeFiHackLabs配置运行环境
date: 2025-10-27T15:46:12+08:00
tags:
---

TODO: **我也是初学者，这里的东西主要是我以一个初学者的视角折腾相关东西的记录**，**大抵是充满错误的**。等我再努力努力应该能返回来修正。仅供参考。

------

https://github.com/SunWeb3Sec/DeFiHackLabs

很遗憾，看起来这个仓库维护的一般，主要体现在：
- 一些`/past/xx`中的shell没办法运行
- 环境的配置不够清晰

当然，也有可能是随着时间更新，各种依赖出现了breaking change导致的。

无论如何，以下是在*2025/10/27*把DeFiHackLabs跑起来的步骤，供大家参考。

对应的DeFiHackLabs版本是`commit dd6934`。

# 正确下载DeFiHackLabs

在`/libs`里面，DeFiHackLabs依赖了一些子模块（`forde-std`），

所以要么按照原文README的说明，使用`git clone` `git submodule update --init --recursive`命令下载；

也可以clone时直接加上`--recurse-submodules`参数：

```bash
git clone --recurse-submodules https://github.com/SunWeb3Sec/DeFiHackLabs.git
```

如果直接Download ZIP的话，`/libs`目录下的内容是空的，会导致后续运行报错，去 https://github.com/foundry-rs/forge-std 手动下载`forge-std`放到`/libs`目录下。

# 配置foundry环境

参考[foundry - Ethereum Development Framework](https://getfoundry.sh/introduction/installation)下载Foundry。

对于我的电脑（Windows 11），我选择的是直接下载Prebuild Release，而不是getfoundry.sh脚本。

1. 前往[Foundry Releases](https://github.com/foundry-rs/foundry/releases)页面，下载最新的Prebuilt Release。不一定要用Nightly版本，稳定版也可以。
2. 解压下载的压缩包到你想安装Foundry的目录。一般就是4个可执行文件：`forge.exe`、`cast.exe`、`anvil.exe`和`foundryup.exe`。  
   > 小剧场：
   >
   > 我下的是`foundry_v1.4.2_win32_amd64.zip`，写文章时一看发现foundry已经更新到`v1.4.3`了。（超高速版本迭代.jpg）
3. 添加Path环境变量。

## 文档有关的一个小问题

> If you're using Windows, you'll need to install and use Git BASH or WSL as your terminal, since Foundryup currently doesn't support Powershell or Command Prompt (Cmd).

对于文档中的这个内容，我个人看起来是自带的Windows Terminal（cmd或PowerShell）都可以使用，不一定非要用Git BASH或WSL。如果你要用Windows Terminal，要注意的是：**文档中的一些语法，例如`export`之类，在powershell/cmd中有其它的写法**，可以询问LLM。

UPDATE: 眼瞎了，文档说的是Foundryup不支持cmd/powershell，而不是Foundry本身不支持。

# 开起来一个Private Network

使用`anvil`命令开起来一个本地的以太坊网络。

```bash
anvil
```

这tm不比geth好用

开完应该会有类似下面的输出：

```plaintext


                             _   _
                            (_) | |
      __ _   _ __   __   __  _  | |
     / _` | | '_ \  \ \ / / | | | |
    | (_| | | | | |  \ V /  | | | |
     \__,_| |_| |_|   \_/   |_| |_|

    1.4.2-v1.4.2 (828441d243 2025-10-18T06:47:53.677415800Z)
    https://github.com/foundry-rs/foundry

...(中间省略)

Chain ID
==================

31337

Base Fee
==================

1000000000

Gas Limit
==================

30000000

Genesis Timestamp
==================

1761550478

Genesis Number
==================

0

Listening on 127.0.0.1:8545
```

记住一个Chain ID（我这里是31337），然后记住RPC地址`http://127.0.0.1:8545`（这个应该都是一样的）。

## 支线任务：配Metamask

1. 打开Metamask，点击右上角的网络选择下拉菜单，选择“添加网络”。
2. 在“添加网络”页面，填写以下信息：
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`（根据anvil输出的实际Chain ID填写）
3. 然后其它东西应该就全帮你填好了，确认一下，然后保存即可。

# 配置DeFiHackLabs项目

主要是配置`foundry.toml`文件。

```toml
[rpc_endpoints]
mainnet = "https://eth.llamarpc.com"
blast = "https://rpc.ankr.com/blast"
optimism = "https://optimism.llamarpc.com"
fantom = "https://fantom-pokt.nodies.app"
arbitrum =  "https://arb1.arbitrum.io/rpc" # https://arbitrum.llamarpc.com
bsc = "https://binance.llamarpc.com"
moonriver = "https://moonriver.public.blastapi.io"
gnosis = "https://gnosis-mainnet.public.blastapi.io"
avalanche = "https://avax.meowrpc.com"
polygon = "https://rpc.ankr.com/polygon"
celo = "https://rpc.ankr.com/celo"
base = "https://developer-access-mainnet.base.org"
linea = "https://linea.drpc.org"
mantle = "https://rpc.mantle.xyz"
sei = "wss://sei.drpc.org"

# See more config options https://github.com/foundry-rs/foundry/tree/master/.config
```

我的理解是，这些RPC endpoints是用来在不同网络上拉取block区块数据的，然后如果DeFiHackLabs跑不起来，多半就是这个RPC endpoints炸了（比如限速/rate limit/被墙了之类的）。

有点幽默的是`https://eth.llamarpc.com/`我直接在浏览器中访问会`rpc-proxy is running fine.`，但是DeFiHackLabs跑不起来，提示`[FAIL: EVM error; database error: failed to get account for 0x690B9A9E9aa1C9dB991C7721a92d351Db4FaC990: server returned an error response: error code -32603: state at block #19290921 is pruned] `。 

我干的是**找一个可用的RPC Endpoint，把所有东西都换成它的**。

具体的说，我找的是[Ankr](https://www.ankr.com/)的[High-Performance Blockchain Node Infrastructure: 70+ Web3 APIs & RPCs](https://www.ankr.com/web3-api/)，免费版提供的额度是：


- 30 reqs/sec Node API
- 30 reqs/min Advanced API
- Limited chains
- Fixed regions
- Community support

不一定要用我这个，可以以"Web3 RPC Provider"/"Web3 API"为关键词在网上找其它的。然后如果不出意外，你找到的应该都会要求注册账号登录（这对吗？）

进入后台，创建一个新的Project，然后就能看到对应的RPC Endpoint URL了。

![](ankr-1.png)

下面的Chains都可以点击，然后看到对应的HTTPS Endpoints。

![](ankr-2.png)

基本上都有，有一部分名字可能需要猜一下：

- mainnet <-> Ethereum
- bsc <-> BNB Smart Chain

别的一一对应即可。

# 开跑

回到DeFiHackLabs的根目录，运行：

```bash
forge test --contracts ./src/test/2025-08/SizeCredit_exp.sol -vvv
```

其中`./src/test/2025-08/SizeCredit_exp.sol`是你要跑的测试合约路径，可以根据需要更换。

对于`/past/2024`里面的一些内容，它测试脚本写的是`forge test --match-contract CompoundUni_exp -vvv`，我跑的时候发现它似乎会把所有的测试合约都跑一遍，不清楚为什么。对于这种，可以把`--match-contract CompoundUni_exp`改成`--contracts ./src/test/2024-xx/CompoundUni_exp.sol`来指定具体的测试合约路径。