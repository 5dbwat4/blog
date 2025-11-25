---
title: Sadserver Writeup Vol 1
date: 2025-11-05T01:10:27+08:00
tags:
---
*Work in progress*

<!-- more -->

# "Rio de Janeiro": Do we have another option?

Description: This scenario server is dedicated to Jenkins, a Java application managed by systemd. Jenkins is failing to start. Troubleshoot and find the problem, then apply the solution so Jenkins runs properly.

Root (sudo) Access: True

Test: The service must return the string "Sign in - Jenkins" amongst some other html code. You can check with the command `curl -s localhost:8888/login | grep Jenkins | head -n1`

## Solution



1. 初始状态检查  
    - **发现问题**：Jenkins服务处于inactive状态且被禁用
    - **执行命令**：`systemctl status jenkins`
    - **结果**：服务dead且disabled
    ```
    ○ jenkins.service - Jenkins Continuous Integration Server
        Loaded: loaded (/usr/lib/systemd/system/jenkins.service; disabled; preset: enabled)
        Active: inactive (dead)
    ```

2. 服务启动尝试  
    - **执行命令**：启用并启动Jenkins服务
        ```bash
        systemctl enable jenkins
        systemctl start jenkins
        ```
    - **结果**：启动失败，控制进程退出并报错
        ```
        Synchronizing state of jenkins.service with SysV service script with /usr/lib/systemd/systemd-sysv-install.
        Executing: /usr/lib/systemd/systemd-sysv-install enable jenkins
        Created symlink '/etc/systemd/system/multi-user.target.wants/jenkins.service' → '/usr/lib/systemd/system/jenkins.service'.
        Job for jenkins.service failed because the control process exited with error code.
        See "systemctl status jenkins.service" and "journalctl -xeu jenkins.service" for details.
        ```

3. 日志分析  
    - **执行命令**：`journalctl -xeu jenkins.service`
    - **关键发现**：Java版本兼容性问题
    - 错误信息：`UnsupportedClassVersionError: class file version 55.0, this version only recognizes up to 52.0`
    - 分析：Jenkins需要Java 11（版本55），但系统当前使用Java 8（版本52）
        ```
        Nov 04 17:21:27 i-097edbdc54cac144a jenkins[1336]: Exception in thread "main" java.lang.UnsupportedClassVersionError: executable/Main has been compiled by a more recent version of the Java Runtime (class file version 55.0), this version of the Java Runtime only recognizes class file versions up to 52.0
        Nov 04 17:21:27 i-097edbdc54cac144a jenkins[1336]:         at java.lang.ClassLoader.defineClass1(Native Method)
        Nov 04 17:21:27 i-097edbdc54cac144a jenkins[1336]:         at java.lang.ClassLoader.defineClass(ClassLoader.java:756)
        Nov 04 17:21:27 i-097edbdc54cac144a jenkins[1336]:         at java.security.SecureClassLoader.defineClass(SecureClassLoader.java:142)
        Nov 04 17:21:27 i-097edbdc54cac144a jenkins[1336]:         at java.net.URLClassLoader.defineClass(URLClassLoader.java:473)
        Nov 04 17:21:27 i-097edbdc54cac144a jenkins[1336]:         at java.net.URLClassLoader.access$100(URLClassLoader.java:74)
        Nov 04 17:21:27 i-097edbdc54cac144a jenkins[1336]:         at java.net.URLClassLoader$1.run(URLClassLoader.java:369)
        Nov 04 17:21:27 i-097edbdc54cac144a jenkins[1336]:         at java.net.URLClassLoader$1.run(URLClassLoader.java:363)
        Nov 04 17:21:27 i-097edbdc54cac144a jenkins[1336]:         at java.security.AccessController.doPrivileged(Native Method)
        Nov 04 17:21:27 i-097edbdc54cac144a jenkins[1336]:         at java.net.URLClassLoader.findClass(URLClassLoader.java:362)
        Nov 04 17:21:27 i-097edbdc54cac144a jenkins[1336]:         at java.lang.ClassLoader.loadClass(ClassLoader.java:418)
        Nov 04 17:21:27 i-097edbdc54cac144a jenkins[1336]:         at sun.misc.Launcher$AppClassLoader.loadClass(Launcher.java:352)
        Nov 04 17:21:27 i-097edbdc54cac144a jenkins[1336]:         at java.lang.ClassLoader.loadClass(ClassLoader.java:351)
        Nov 04 17:21:27 i-097edbdc54cac144a jenkins[1336]:         at sun.launcher.LauncherHelper.checkAndLoadMain(LauncherHelper.java:621)
        Nov 04 17:21:27 i-097edbdc54cac144a systemd[1]: jenkins.service: Main process exited, code=exited, status=1/FAILURE
        ```

4. Java环境检查  
    - **执行命令**：`java -version && update-alternatives --config java`
    - **发现**：
    - 当前使用：Java 8 (Temurin-8)
    - 系统已安装：Java 21 (openjdk-21)
        ```
        openjdk version "1.8.0_462"
        OpenJDK Runtime Environment (Temurin)(build 1.8.0_462-b08)
        OpenJDK 64-Bit Server VM (Temurin)(build 25.462-b08, mixed mode)
        There are 2 choices for the alternative java (providing /usr/bin/java).

        Selection    Path                                         Priority   Status
        ------------------------------------------------------------
        0            /usr/lib/jvm/java-21-openjdk-amd64/bin/java   2111      auto mode
        1            /usr/lib/jvm/java-21-openjdk-amd64/bin/java   2111      manual mode
        * 2            /usr/lib/jvm/temurin-8-jdk-amd64/bin/java     1081      manual mode

        Press <enter> to keep the current choice[*], or type selection number:
        ```

5. 还是炸了
- 相同步骤查看日志：
    ```
    Nov 04 17:21:31 i-097edbdc54cac144a systemd[1]: jenkins.service: Start request repeated too quickly.
    Nov 04 17:21:31 i-097edbdc54cac144a systemd[1]: jenkins.service: Failed with result 'exit-code'.
    Nov 04 17:21:31 i-097edbdc54cac144a systemd[1]: Failed to start jenkins.service - Jenkins Continuous Integration Server.
    ```
- **分析**：systemd对频繁失败的服务有保护机制，需重置失败计数器
- **执行命令**：`systemctl reset-failed jenkins`
- 再次启动，启动成功：
    ```
    Nov 04 17:26:30 i-097edbdc54cac144a jenkins[7743]: 2025-11-04 17:26:30.570+0000 [id=34]        INFO        jenkins.InitReactorRunner$1#onAttained: Completed initialization
    Nov 04 17:26:30 i-097edbdc54cac144a jenkins[7743]: 2025-11-04 17:26:30.599+0000 [id=24]        INFO        hudson.lifecycle.Lifecycle#onReady: Jenkins is fully up and running
    Nov 04 17:26:30 i-097edbdc54cac144a systemd[1]: Started jenkins.service - Jenkins Continuous Integration Server.
    ```

## 根本原因
Java版本不兼容：Jenkins需要Java 11或更高版本，但系统默认使用Java 8。


## 经验总结
- Java版本兼容性是Jenkins部署中的常见问题
- 使用`update-alternatives`可以灵活管理多个Java版本
- systemd服务的失败计数器需要重置，以防止频繁失败导致的启动阻塞：`systemctl reset-failed <service-name>`


# "Nuuk": More SSH Troubles

Level: Easy

Description: SSH seems broken in this server. The user admin has an id_ed25519 SSH key pair in their ~/.ssh directory with the public key in ~/.ssh/authorized_keys but ssh 127.0.0.1 won't work.

Test: You can ssh locally, i.e. ssh admin@127.0.0.1 works.

## Solution

1. **分析SSH连接详细日志**  
   - **命令**: `ssh -vvv admin@127.0.0.1`  
   - **关键发现**:  
     - 日志显示`Permission denied`错误当尝试读取`~/.ssh/known_hosts`和私钥文件（如`id_ed25519`）。  
     - 具体错误信息：  
       - `load_hostkeys: fopen /home/admin/.ssh/known_hosts: Permission denied`  
       - `no such identity: /home/admin/.ssh/id_ed25519: Permission denied`  
   - **结论**: 用户`admin`对`~/.ssh`目录或文件缺乏读取权限，导致SSH认证失败。
        ```
        debug1: Trying private key: /home/admin/.ssh/id_rsa
        debug3: no such identity: /home/admin/.ssh/id_rsa: Permission denied
        debug1: Trying private key: /home/admin/.ssh/id_ecdsa
        debug3: no such identity: /home/admin/.ssh/id_ecdsa: Permission denied
        debug1: Trying private key: /home/admin/.ssh/id_ecdsa_sk
        debug3: no such identity: /home/admin/.ssh/id_ecdsa_sk: Permission denied
        debug1: Trying private key: /home/admin/.ssh/id_ed25519
        debug3: no such identity: /home/admin/.ssh/id_ed25519: Permission denied
        debug1: Trying private key: /home/admin/.ssh/id_ed25519_sk
        debug3: no such identity: /home/admin/.ssh/id_ed25519_sk: Permission denied
        debug1: Trying private key: /home/admin/.ssh/id_xmss
        debug3: no such identity: /home/admin/.ssh/id_xmss: Permission denied
        ```

2. **检查目录权限和所有权**  
   - **命令**: `whoami && ls -la /home/admin/ | grep .ssh`  
   - **结果**:  
     - 当前用户为`admin`。  
     - `.ssh`目录权限为`d---------`，所有者为`admin`。

3. **修复`.ssh`目录权限**  
   - **命令**: `chmod 700 /home/admin/.ssh`  
   - **结果**: 无输出，表示权限修改成功。  
   - **验证**: 再次运行`ls -la /home/admin/.ssh/`确认权限已改为`drwx------`。

4. **检查`.ssh`内部文件权限**  
   - **命令**: `ls -la /home/admin/.ssh/`  
   - **结果**:  
        ```
        drwx------ 2 admin admin 4096 Oct 21 17:27 .
        drwx------ 5 admin admin 4096 Sep  7 16:32 ..
        -rw------- 1 admin admin  177 Nov  4 17:55 authorized_keys
        -rw------- 1 admin admin  387 Oct 21 17:27 id_ed25519
        -rw------- 1 admin admin   82 Oct 21 17:27 id_ed25519.pub
        ```
   - **分析**: 文件权限正确（私钥和`authorized_keys`应为600）。


## 根本原因
`/home/admin/.ssh`目录的权限设置不正确（初始为`d---------`，可能由于权限位异常），导致用户`admin`无法读取目录内的私钥和已知主机文件，从而SSH公钥认证失败。修复目录权限为`700`后，SSH客户端能正常访问所需文件。

## 经验总结
- **SSH权限要求**: SSH对文件和目录权限有严格限制：
  - `~/.ssh`目录必须为`700`（`drwx------`）。
  - 私钥文件（如`id_ed25519`）必须为`600`（`-rw-------`）。
  - `authorized_keys`文件通常为`600`或`644`（但`600`更安全）。
- **诊断技巧**: 使用`ssh -vvv`可快速定位认证问题，如权限错误、密钥路径问题等。
- **运维最佳实践**: 在部署SSH密钥时，应始终验证权限设置，避免因权限过松（安全风险）或过紧（连接失败）导致问题。

