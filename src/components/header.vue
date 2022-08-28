<template>
    <header class="header" itemscope itemtype="http://schema.org/WPHeader">
      <div class="header-inner"><div class="site-brand-container">
  <div class="site-meta">

    <div>
      <router-link to="/" class="brand">
        <span class="logo-line-before"><i></i></span>
        <span class="site-title">5dbwat4`s Blog</span>
        <span class="logo-line-after"><i></i></span>
      </router-link>
    </div>
  </div>

  <div class="site-nav-toggle">
    <div class="toggle" aria-label="切换导航栏">
      <span class="toggle-line toggle-line-first"></span>
      <span class="toggle-line toggle-line-middle"></span>
      <span class="toggle-line toggle-line-last"></span>
    </div>
  </div>
</div>


<nav class="site-nav">
  
  <ul id="menu" class="menu">
        <li class="menu-item menu-item-home">

    <router-link to="/"><i class="fa fa-fw fa-home"></i>首页</router-link>

  </li>
        <li class="menu-item menu-item-tags">

    <router-link to="/tags"><i class="fa fa-fw fa-tags"></i>标签<span class="badge">{{tagCount}}</span></router-link>

  </li>
        <li class="menu-item menu-item-archives">

    <router-link to="/arch"><i class="fa fa-fw fa-archive"></i>归档<span class="badge">{{archCount}}</span></router-link>

  </li>
      <li class="menu-item menu-item-search">
        <a role="button" class="popup-trigger"><i class="fa fa-search fa-fw"></i>搜索
        </a>
      </li>
  </ul>

</nav>
  <!-- <div class="site-search">
    <div class="popup search-popup">
    <div class="search-header">
  <span class="search-icon">
    <i class="fa fa-search"></i>
  </span>
  <div class="search-input-container">
    <input autocomplete="off" autocorrect="off" autocapitalize="off"
           placeholder="搜索..." spellcheck="false"
           type="search" class="search-input">
  </div>
  <span class="popup-btn-close">
    <i class="fa fa-times-circle"></i>
  </span>
</div>
<div id="search-result"></div>

</div>
<div class="search-pop-overlay"></div>

  </div> -->

</div>
    </header>

</template>

<script setup>
import { ref } from "@vue/reactivity"

const tagCount=ref("?")
const archCount=ref("?")

;(async()=>{
  await (await import("./makeSureArchMeta")).makeSureArchMeta()
  archCount.value=ArchMeta.data.length
tagCount.value=ArchMeta.tagCount
})()

// if(!window.ArchMeta){
// fetch("./archdata/maps/meta.json").then(v=>v.json()).then(v=>{
//     window.ArchMeta=v
// archCount.value=v.data.length
// tagCount.value=v.tagCount
// })
// }
</script>

<style scoped>
.header {
  margin: 0 auto;
  position: relative;
  width: calc(100% - 20px);
}
@media (min-width: 1200px) {
  .header {
    width: 1160px;
  }
}
@media (min-width: 1600px) {
  .header {
    width: 73%;
  }
}
@media (max-width: 991px) {
  .header {
    width: auto;
  }
}
.header-inner {
  background: #fff;
  border-radius: initial;
  box-shadow: initial;
  overflow: hidden;
  padding: 0;
  position: absolute;
  top: 0;
  width: 240px;
    right: 0;
}
@media (min-width: 1200px) {
  .header-inner {
    width: 240px;
  }
}
@media (max-width: 991px) {
  .header-inner {
    border-radius: initial;
    position: relative;
    width: auto;
  }
}
.headband {
  background: #222;
  height: 3px;
}
.site-meta {
  margin: 0;
  text-align: center;
}
@media (max-width: 767px) {
  .site-meta {
    text-align: center;
  }
}
.brand {
  background: #222;
  border-bottom: none;
  color: #fff;
  display: inline-block;
  line-height: 1.375em;
  padding: 0 40px;
  position: relative;
}
.brand:hover {
  color: #fff;
}
.site-title {
  display: inline-block;
  font-family: 'Lato', "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 1.375em;
  font-weight: normal;
  line-height: 1.5;
  vertical-align: top;
}
.site-subtitle {
  color: #ddd;
  font-size: 0.8125em;
  margin-top: 10px;
}
.use-motion .brand {
  opacity: 0;
}
.use-motion .site-title,
.use-motion .site-subtitle,
.use-motion .custom-logo-image {
  opacity: 0;
  position: relative;
  top: -10px;
}
.site-nav-toggle {
  display: none;
  left: 10px;
  position: absolute;
}
@media (max-width: 767px) {
  .site-nav-toggle {
    display: block;
  }
}
.site-nav-toggle .toggle {
  background: transparent;
  border: 0;
  margin-top: 2px;
  padding: 10px;
  width: 22px;
}
.site-nav-toggle .toggle .toggle-line {
  background: #555;
  border-radius: 1px;
}
.site-nav {
  display: block;
}
@media (max-width: 767px) {
  .site-nav {
    clear: both;
    display: none;
  }
}
.site-nav.site-nav-on {
  display: block;
}
.menu {
  margin-top: 20px;
  padding-left: 0;
  text-align: center;
}
.menu-item {
  display: inline-block;
  list-style: none;
  margin: 0 10px;
}
@media (max-width: 767px) {
  .menu-item {
    margin-top: 10px;
  }
}
.menu-item a,
.menu-item span.exturl {
  border-bottom: 0;
  display: block;
  font-size: 0.8125em;
  transition-property: border-color;
  transition-delay: 0s;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
}
@media (hover: none) {
  .menu-item a:hover,
  .menu-item span.exturl:hover {
    border-bottom-color: transparent !important;
  }
}
.menu-item .fa {
  margin-right: 8px;
}
.menu-item .badge {
  display: inline-block;
  font-weight: 700;
  line-height: 1;
  margin-left: 0.35em;
  margin-top: 0.35em;
  text-align: center;
  white-space: nowrap;
}
@media (max-width: 767px) {
  .menu-item .badge {
    float: right;
    margin-left: 0;
  }
}
.use-motion .menu-item {
  opacity: 0;
}

.site-meta {
  background: #222;
  color: #fff;
  padding: 20px 0;
}
@media (max-width: 991px) {
  .site-meta {
    box-shadow: 0 0 16px rgba(0,0,0,0.5);
  }
}
.brand {
  background: none;
  padding: 0;
}
.brand:hover {
  color: #fff;
}
.site-subtitle {
  font-weight: initial;
  margin: 10px 10px 0;
}
.custom-logo-image {
  margin-top: 20px;
}
@media (max-width: 991px) {
  .custom-logo-image {
    display: none;
  }
}
.site-nav-toggle {
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
}
@media (min-width: 768px) and (max-width: 991px) {
  .site-nav-toggle {
    display: block;
  }
}
.site-nav-toggle .toggle .toggle-line {
  background: #fff;
}
@media (min-width: 768px) and (max-width: 991px) {
  .site-nav {
    display: none;
  }
}
.menu-item-active a,
.menu .menu-item a:hover,
.menu .menu-item span.exturl:hover {
  background: #f5f5f5;
}
.menu .menu-item {
  display: block;
  margin: 0;
}
.menu .menu-item a,
.menu .menu-item span.exturl {
  padding: 5px 20px;
  position: relative;
  text-align: left;
  transition-property: background-color;
}
.menu .menu-item .badge {
  background: #ccc;
  border-radius: 10px;
  color: #fff;
  float: right;
  padding: 2px 5px;
  text-shadow: 1px 1px 0 rgba(0,0,0,0.1);
  vertical-align: middle;
}
.site-brand-container {
  position: relative;
}
</style>