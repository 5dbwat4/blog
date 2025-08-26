---
title: express.js常用代码块
date: 2024-07-09T17:40:26+08:00
tags:
---
通过复制粘贴实现一个基于`express.js`的后端

<!-- more -->



# Before all

```js
const express = require("express");
const app = express();
const port = 3000;

const http = require("http");
const fs = require("fs");

var httpServer = http.createServer(app);

httpServer.listen(port, () => {
  var ifaces = require("os").networkInterfaces();
  console.log("Listening");

  Object.keys(ifaces).forEach(function (dev) {
    ifaces[dev].forEach(function (details) {
      if (details.family === "IPv4") {
        console.log("  " + "http://" + details.address + ":" + port);
      }
    });
  });
});
```

# Create a static server

```js
app.use('/path',[express.static("path/to")])
```

# Allow large Request

```js
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
```

# Allow CORS

```js
app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": req.get("Origin"),
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "POST,GET,OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    Vary: "Origin",
  });
  next();
});
```

# Handle `OPTIONS`

```js
  app.use((req, res, next) => {
   if (req.method === "OPTIONS") {
     return res.sendStatus(200);
   }
   next();
  })
```

# Start A SQLite instance before all

```js
const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");
/**
 * @type sqlite.Database<sqlite3.Database, sqlite3.Statement>
 */
let db;

let openedFlag = false;

app.use(async (_, $, next) => {
  if (!openedFlag) {
    db = await sqlite.open({
      filename: "./data/data.db",
      driver: sqlite3.cached.Database,
    });
    openedFlag = true;
  }

  next();
});


```

# A simple login backend

（抄抄改改）

```js

'use strict'

/**
 * Module dependencies.
 */

var hash = require('pbkdf2-password')()
var path = require('path');
var session = require('express-session');

// var app = module.exports = express();

// config

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// middleware

app.use(express.urlencoded({ extended: false }))
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret'
}));

// Session-persisted message middleware

// app.use(function(req, res, next){
//   var err = req.session.error;
//   var msg = req.session.success;
//   delete req.session.error;
//   delete req.session.success;
//   res.locals.message = '';
//   if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
//   if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
//   next();
// });

// dummy database

// var users = {
//   admin: { name: '5dbwat4' }
// };

var oneCodeuserAuth={
  salt:"T1le0otX5tsqexqhpV6kT37asxuaWt1H/PLbYph7LkhhX2kraKxKciVlK9xb7UiDLF+gjT0gOwrv6m3tyGZv1A==",
  hash:"NjE68Pp8hGkLVI5jCIt2pypcZSJZAzOnKjfWZTZY9f6c98GKBAYf1e6kbyTV727blabq1TarZvFNL0++cZYHd3/G5o5KLxH6BgQN/J/P9/u1VIZn1rU1nxxCrV4/rUTdzCPoD8ngvT4odCbSg+3EPXlCGM/a7Oz+C/uCXsPwoOI="
}

// when you create a user, generate a salt
// and hash the password ('foobar' is the pass here)

// hash({ password: oneCodeuserAuth.code }, function (err, pass, salt, hash) {
//   if (err) throw err;
//   // store the salt & hash in the "db"
//   oneCodeuserAuth.salt = salt;
//   oneCodeuserAuth.hash = hash;
//   console.log(salt,hash);
// });

// Authenticate using our plain-object database of doom!

// function authenticate(pass, fn) {
//   // if (!module.parent) console.log('authenticating %s:%s', name, pass);
//   // var user = users[name];
//   // query the db for the given username
//   // if (!user) return fn(null, null)
//   // apply the same algorithm to the POSTed password, applying
//   // the hash against the pass / salt, if there is a match we
//   // found the user
//   hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
//     if (err) return fn(err);
//     if (hash === user.hash) return fn(null, user)
//     fn(null, null)
//   });
// }

function restrict(req, res, next) {
  // console.log(req.path);
  if(req.path.startsWith("/auth")){
    next()
    return ;
  }
  if(req.method=="OPTIONS"){
    next()
    return;
  }
  if (req.session.user) {
    next();
    return ;
  } else {
    // req.session.error = 'Access denied!';
    res.redirect(req.baseUrl+'/auth/access-denied');
    return ;
  }
}

app.use(restrict)

app.get('/auth/logout', function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function(){

    // res.redirect(req.baseUrl+"/auth/logout");
    res.send(`Logged out.<br/>
    <a href="${req.baseUrl}/auth/login">Log in</a>`)
  });
});
app.get('/auth/json/logout', function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function(){

    // res.redirect(req.baseUrl+"/auth/logout");
    res.json({code:200})
  });
});
app.get('/auth/access-denied', function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
res.send(`
<h1>Access denied</h1>
<hr/>
<h2>What happened?</h2>
<p> Some of the interfaces provided by this API involve sensitive information, so you need to enter Auth Code to use this API.</p>
<a href="${req.baseUrl}/auth/login">Log in here.</a>
`)
});

app.get('/auth/login', function(req, res){
  res.send(`
  Some of the interfaces provided by this API involve sensitive information, so you need to enter Auth Code to use this API.<br/>
By the way, please do not casually share this API URL with others, as others can obtain your password, ID Card Num.,Phone Number and other information through this backend.<br/>
  <form method="post" action="./login">
  <p>
    <label for="password">Auth Code:</label>
    <input type="text" name="password" id="password">
  </p>
  <p>
    <input type="submit" value="Login">
  </p>
</form>`);
});
app.get('/auth/status', function(req, res){
  if(req.session.user)res.json({auth:true});
  else res.json({auth:false});
});

app.post('/auth/login', function (req, res, next) {
  hash({ password: req.body.password, salt: oneCodeuserAuth.salt }, function (err, pass, salt, hash) {
    if (err) return next(err)
    if (hash === oneCodeuserAuth.hash){
      req.session.regenerate(function(){
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = oneCodeuserAuth;
        // req.session.success = 'Authenticated.'
        //   + ' click to <a href="/logout">logout</a>. '
        //   + ' You may now access <a href="/restricted">/restricted</a>.';
          res.send(`<strong style='color:green'>Authenticated.</strong><br/>
  Now you can go back to thost/zujuanink page to continue.<br/>
  <strong>Maybe you'll need to refresh that page</strong>`)
      });
    }else{
      // req.session.error = 'Authentication failed, please check your '
      //   + ' username and password.'
      //   + ' (use "tj" and "foobar")';
      res.send(`<strong style='color:red'>Authentication Failed. You probably entered a wrong code.</strong><br/>
      You can contact to the API administrator or who offered this API location to you to know what happened in detail.<br/>
      <a href="${req.baseUrl}/auth/login">Try again</a>`)
    }
  });
});
app.post('/auth/json/login', function (req, res, next) {
  hash({ password: req.body.password, salt: oneCodeuserAuth.salt }, function (err, pass, salt, hash) {
    if (err) return next(err)
    if (hash === oneCodeuserAuth.hash){
      // console.log("ooo");
      req.session.regenerate(function(){
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = oneCodeuserAuth;
        res.json({auth:true})
      });
    }else{
      res.json({auth:false})
    }
  });
});
// app.get("/auth/login/success",(req,res)=>{
//   res.send(`<strong style='color:green'>Authenticated.</strong><br/>
//   Now you can go back to thost/zujuanink page to continue.<br/>
//   <strong>Maybe you'll need to refresh that page</strong>`)
// })
// app.get("/auth/login/fail",(req,res)=>{
//   res.send(`<strong style='color:red'>Authentication Failed. You probably entered a wrong code.</strong><br/>
//   You can contact to the API administrator or who offered this API location to you to know what happened in detail.<br/>
//   <a href="${req.baseUrl}/auth/login">Try again</a>`)
// })

/* istanbul ignore next */
// if (!module.parent) {
//   app.listen(3000);
//   console.log('Express started on port 3000');
// }

```

# Upload file

```js
const fileUpload = require("express-fileupload");
const path = require("path");
const { cached } = require("sqlite3");
app.use(fileUpload());

app.post("/api/local/ranword/upload", (req, res) => {
const FolderPath="./path"
  if (!req.files || !req.files.file) {
    return res.status(400).send("No files were uploaded.");
  }
  const { v4: uuidv4 } = require("uuid");

  const uploadedFile = req.files.file;
  const uniqueFileName = uuidv4(); // 生成唯一文件名
  const uploadPath = path.join(FolderPath, uniqueFileName);

  uploadedFile.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.json({ code: 200, fid: uniqueFileName });
  });
});

```
