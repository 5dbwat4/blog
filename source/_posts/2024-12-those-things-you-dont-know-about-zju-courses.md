---
title: 你不一定知道的N个学在浙大小知识
date: 2024-12-18T18:09:29+08:00
tags:
---
1. 学在浙大其实是由两部分组成的，其一为 [courses.zju.edu.cn](https://courses.zju.edu.cn)，它叫`wangxin` ，其二为 [course.zju.edu.cn](https://course.zju.edu.cn), 它叫`zju_web`;
2. 两部分用的登录流程也不一样，所以，当你点击“进入平台”时，你实际上又走了一遍统一身份认证，换言之，即使你看到了“进入平台”按钮，如果你的 zjuam 状态掉了，你还是会被跳到登录界面;当然，这也意味着你不用先点一下“统一身份认证登录”再点一下“进入平台”;
3. 学在浙大用的外包系统是 [Tronclass](https://tronclass.com.cn/) ;
4. 其实，这里还有第三个域名：[identity.zju.edu.cn](https://identity.zju.edu.cn)。你可能从未用过“校外人员登录”这个功能，但是，如果你点击了，那么你将进入这个域名下。
5. 等等，我单击了上面那个网址，[WisdomGarden](https://www.wisdomgarden.com.cn/about) 是什么？其实，Tronclass是WisdomGarden的产品。虽然ZJU已经做了大量 *本地化* 措施，但是还有一些页面没有改掉。
6. 当然，这里还有一个没改掉的页面：[https://identity.zju.edu.cn/auth/realms/zju/account](https://identity.zju.edu.cn/auth/realms/zju/account)，虽然没什么用，但他就那么清新脱俗的立在那里，而且非常现代化，甚至提供了TOTP的配置;
7. 这个域名下还有一个由[KeyCloak](https://www.keycloak.org/)管理的页面，不过学生没有访问权限;
8. 跑题了，让我们回到学在浙大而非TronClass。其实学在浙大并没有用上TronClass所有的功能，但也没有将他们隐藏起来;
9. 你上传到学在浙大的图像不会被压缩，不会被删除EXIF信息，甚至连文件名都不会动。所以，如果你想上传头像，记得删除EXIF信息;
10. 另外，访问你的头像不需要登录。你也可以选择一节课，在header处找到老师的头像，删除URL中`modified-image`后面的内容，然后你将被跳转至`tcmedia.zju.edu.cn`下的网址，网址中就带有了上传时的图片名称;
11. 你可以提前知道&在没有参与这节课的情况下知道某次学在浙大小测的……标题和题型（好无聊的功能……这个API接口不鉴权;
12. 完成小测时，虽然数学公式的渲染就是一坨，但他确实是以latex的语法分发下来的;
13. 当然，很显然，它并不会同时把答案分发下来（知识点，后面要考）;
14. 其实，这里还有第四个域名……当你使用钉钉->工作台进入学在浙大时，你进入了什么？[mcourses.zju.edu.cn](https://mcourses.zju.edu.cn)，这个域名仅用于手机端的前端内容分发，它的后端API还是挂在`course.zju.edu.cn`下的;
15. 是的，你用电脑也可以访问这个页面，它不会检查访问者是否在使用手机，也没有将电脑端用户跳转至`course.zju.edu.cn`的行为;
16. 真的不会吗？其实这个逻辑是写了的，`jump-to-web.js`，这里面是一个经典的isMobile检验，但是他们没有配置电脑端网址，所以跳不了一点。这告诉我们该配置的东西一点也不能省;
17. 它也非常的国际化。除了支持中文（简体），中文（繁体）和英语外，它还暗戳戳地支持**泰语（th-TH）**。他明确写到代码里的支持语言就这四种;
    ![这是真的](image.png)
18. 刚进入手机端页面时，会有一段欢迎词。它只有六种可能：`"earlyMorning":"早上好！","morning":"上午好！","noon":"中午好！","afternoon":"下午好！","evening":"晚上好！","lateNight":"夜深了，请注意休息"`
19. 手机端和电脑端用的打包技术都是webpack,都用了Vue框架,手机端还用了Ion-App;
20. 按理来说，vue-router可以通过一些配置，确保当用户访问了不属于自己权限的页面时，可以直接跳转到错误页面。但它偏不。虽然后端你依然无法执行无权限的操作。
21. 这几个页面可以访问一下过个教师瘾。`/course/:courseId/radar-rollcall/new`,`/course/:courseId/number-rollcall/new`,`/course/:courseId/self-registration-rollcall/new`,`:courseId`替换成你的课的id。
22. 雷达点名时，你确实发送了一个PUT请求，请求中包含你的经度和纬度，你可以修改这里的经度和纬度实现远程签到。
23. 这个请求还会返回你发送的位置距离实际签到位置的距离，所以使用初中几何知识我们只要发三次请求就可以知道实际签到位置。你可以实现自动签到。
24. 收回伏笔。你的课前小测（quiz），答案是连着题目一起分发下来的。
