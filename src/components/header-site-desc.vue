<template>
    <aside class="sidebar">
    <div class="sidebar-inner">

      <!-- <ul class="sidebar-nav motion-element">
        <li class="sidebar-nav-toc">
          文章目录
        </li>
        <li class="sidebar-nav-overview">
          站点概览
        </li>
      </ul> -->

      <!--noindex-->
      <!-- <div class="post-toc-wrap sidebar-panel" >
          <div class="post-toc motion-element"><ol class="nav"><li class="nav-item nav-level-1"><a class="nav-link" href="#waiyutong-hommization"><span class="nav-number">1.</span> <span class="nav-text">waiyutong-hommization</span></a></li><li class="nav-item nav-level-1"><a class="nav-link" href="#外语通的人性化处理"><span class="nav-number">2.</span> <span class="nav-text">外语通的人性化处理</span></a><ol class="nav-child"><li class="nav-item nav-level-2"><a class="nav-link" href="#使用方法"><span class="nav-number">2.1.</span> <span class="nav-text">使用方法</span></a></li><li class="nav-item nav-level-2"><a class="nav-link" href="#news"><span class="nav-number">2.2.</span> <span class="nav-text">news</span></a><ol class="nav-child"><li class="nav-item nav-level-3"><a class="nav-link" href="#v1-0-1"><span class="nav-number">2.2.1.</span> <span class="nav-text">v1.0.1</span></a></li></ol></li></ol></li></ol></div>
      </div> -->
      <!--/noindex-->

      <div class="site-overview-wrap sidebar-panel" v-show="true">
        <div class="site-author motion-element" itemprop="author" itemscope itemtype="http://schema.org/Person">
    <img class="site-author-image" itemprop="image" alt="Zhengjiabao"
      src="/images/avatar.jpg">
  <p class="site-author-name" itemprop="name">Zhengjiabao</p>
  <div class="site-description" itemprop="description"></div>
</div>
<div class="site-state-wrap motion-element">
  <nav class="site-state">
      <div class="site-state-item site-state-posts">
          <a href="/archives/">
        
          <span class="site-state-item-count">13</span>
          <span class="site-state-item-name">日志</span>
        </a>
      </div>
      <div class="site-state-item site-state-tags">
        <span class="site-state-item-count">5</span>
        <span class="site-state-item-name">标签</span>
      </div>
  </nav>
</div>
  <div class="links-of-author motion-element">
      <span class="links-of-author-item">
        <a href="https://github.com/Zheng-Jiabao" title="GitHub → https:&#x2F;&#x2F;github.com&#x2F;Zheng-Jiabao" rel="noopener" target="_blank"><i class="fa fa-fw fa-github"></i>GitHub</a>
      </span>
      <span class="links-of-author-item">
        <a href="mailto:1426484228@qq.com" title="E-Mail → mailto:1426484228@qq.com" rel="noopener" target="_blank"><i class="fa fa-fw fa-envelope"></i>E-Mail</a>
      </span>
  </div>
  <div class="cc-license motion-element" itemprop="license">
    <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/zh-CN" class="cc-opacity" rel="noopener" target="_blank"><img src="/images/cc-by-nc-sa.svg" alt="Creative Commons"></a>
  </div>




      </div>
        <div class="back-to-top motion-element">
          <i class="fa fa-arrow-up"></i>
          <span>0%</span>
        </div>

    </div>
  </aside>
</template>

<script setup>

</script>

<style scoped>
.sidebar {
  background: #222;
  bottom: 0;
  box-shadow: inset 0 2px 6px #000;
  position: fixed;
  top: 0;
}
.sidebar a,
.sidebar span.exturl {
  border-bottom-color: #555;
  color: #999;
}
.sidebar a:hover,
.sidebar span.exturl:hover {
  border-bottom-color: #eee;
  color: #eee;
}
.sidebar-inner {
  color: #999;
  padding: 18px 10px;
  text-align: center;
}
.cc-license {
  margin-top: 10px;
  text-align: center;
}
.cc-license .cc-opacity {
  border-bottom: none;
  opacity: 0.7;
}
.cc-license .cc-opacity:hover {
  opacity: 0.9;
}
.cc-license img {
  display: inline-block;
}
.site-author-image {
  border: 1px solid #eee;
  display: block;
  height: auto;
  margin: 0 auto;
  max-width: 120px;
  padding: 2px;
  border-radius: 50%;
}
.site-author-image {
  transition: transform 1s ease-out;
}
.site-author-image:hover {
  transform: rotateZ(360deg);
}
.site-author-name {
  color: #222;
  font-weight: 600;
  margin: 0;
  text-align: center;
}
.site-description {
  color: #999;
  font-size: 0.8125em;
  margin-top: 0;
  text-align: center;
}
.links-of-author {
  margin-top: 15px;
}
.links-of-author a,
.links-of-author span.exturl {
  border-bottom-color: #555;
  display: inline-block;
  font-size: 0.8125em;
  margin-bottom: 10px;
  margin-right: 10px;
  vertical-align: middle;
}
.links-of-author a::before,
.links-of-author span.exturl::before {
  background: #b9426b;
  border-radius: 50%;
  content: ' ';
  display: inline-block;
  height: 4px;
  margin-right: 3px;
  vertical-align: middle;
  width: 4px;
}
.sidebar-button {
  margin-top: 15px;
}
.sidebar-button a {
  border: 1px solid #fc6423;
  border-radius: 4px;
  color: #fc6423;
  display: inline-block;
  padding: 0 15px;
}
.sidebar-button a .fa {
  margin-right: 5px;
}
.sidebar-button a:hover {
  background: #fc6423;
  border: 1px solid #fc6423;
  color: #fff;
}
.sidebar-button a:hover .fa {
  color: #fff;
}
.links-of-blogroll {
  font-size: 0.8125em;
  margin-top: 10px;
}
.links-of-blogroll-title {
  font-size: 0.875em;
  font-weight: 600;
  margin-top: 0;
}
.links-of-blogroll-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.links-of-blogroll-item {
  padding: 2px 10px;
}
.links-of-blogroll-item a,
.links-of-blogroll-item span.exturl {
  box-sizing: border-box;
  display: inline-block;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#sidebar-dimmer {
  display: none;
}
@media (max-width: 767px) {
  #sidebar-dimmer {
    background: #000;
    display: block;
    height: 100%;
    left: 100%;
    opacity: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1100;
  }
  .sidebar-active + #sidebar-dimmer {
    opacity: 0.7;
    transform: translateX(-100%);
    transition: opacity 0.5s;
  }
}
.sidebar-nav {
  margin: 0;
  padding-bottom: 20px;
  padding-left: 0;
}
.sidebar-nav li {
  border-bottom: 1px solid transparent;
  color: #555;
  cursor: pointer;
  display: inline-block;
  font-size: 0.875em;
}
.sidebar-nav li.sidebar-nav-overview {
  margin-left: 10px;
}
.sidebar-nav li:hover {
  color: #fc6423;
}
.sidebar-nav .sidebar-nav-active {
  border-bottom-color: #fc6423;
  color: #fc6423;
}
.sidebar-nav .sidebar-nav-active:hover {
  color: #fc6423;
}
.sidebar-panel {
  /* display: none; */
  overflow-x: hidden;
  overflow-y: auto;
}
.sidebar-panel-active {
  display: block;
}
.sidebar-toggle {
  background: #222;
  bottom: 45px;
  cursor: pointer;
  height: 14px;
  left: 30px;
  padding: 5px;
  position: fixed;
  width: 14px;
  z-index: 1300;
}
@media (max-width: 991px) {
  .sidebar-toggle {
    left: 20px;
    opacity: 0.8;
  }
}
.sidebar-toggle:hover .toggle-line {
  background: #fc6423;
}
.post-toc {
  font-size: 0.875em;
}
.post-toc ol {
  list-style: none;
  margin: 0;
  padding: 0 2px 5px 10px;
  text-align: left;
}
.post-toc ol > ol {
  padding-left: 0;
}
.post-toc ol a {
  border-bottom-color: #ccc;
  color: #666;
  transition-property: all;
  transition-delay: 0s;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
}
.post-toc ol a:hover {
  border-bottom-color: #000;
  color: #000;
}
.post-toc .nav-item {
  line-height: 1.8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.post-toc .nav .nav-child {
  display: none;
}
.post-toc .nav .active > .nav-child {
  display: block;
}
.post-toc .nav .active-current > .nav-child {
  display: block;
}
.post-toc .nav .active-current > .nav-child > .nav-item {
  display: block;
}
.post-toc .nav .active > a {
  border-bottom-color: #fc6423;
  color: #fc6423;
}
.post-toc .nav .active-current > a {
  color: #fc6423;
}
.post-toc .nav .active-current > a:hover {
  color: #fc6423;
}
.site-state {
  display: flex;
  justify-content: center;
  line-height: 1.4;
  margin-top: 10px;
  overflow: hidden;
  text-align: center;
  white-space: nowrap;
}
.site-state-item {
  padding: 0 15px;
}
.site-state-item:not(:first-child) {
  border-left: 1px solid #eee;
}
.site-state-item a {
  border-bottom: none;
}
.site-state-item-count {
  color: inherit;
  display: block;
  font-size: 1em;
  font-weight: 600;
  text-align: center;
}
.site-state-item-name {
  color: #999;
  font-size: 0.8125em;
}

.sidebar {
  background: #f5f7f9;
  box-shadow: none;
  margin-top: 100%;
  position: static;
  width: 240px;
}
@media (max-width: 991px) {
  .sidebar {
    display: none;
  }
}
.sidebar a,
.sidebar span.exturl {
  color: #555;
}
.sidebar a:hover,
.sidebar span.exturl:hover {
  border-bottom-color: #222;
  color: #222;
}
.sidebar-toggle {
  display: none;
}
.sidebar-inner {
  background: #fff;
  border-radius: initial;
  box-shadow: initial;
  box-sizing: border-box;
  color: #555;
  width: 240px;
  opacity: 0;
}
.sidebar-inner.affix {
  position: fixed;
  top: 12px;
}
.sidebar-inner.affix-bottom {
  position: absolute;
}
.site-state-item {
  padding: 0 10px;
}
.sidebar-button {
  border-bottom: 1px dotted #ccc;
  border-top: 1px dotted #ccc;
  margin-top: 10px;
  text-align: center;
}
.sidebar-button a {
  border: 0;
  color: #fc6423;
  display: block;
}
.sidebar-button a:hover {
  background: none;
  border: 0;
  color: #e34603;
}
.sidebar-button a:hover .fa {
  color: #e34603;
}
.links-of-author {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  justify-content: center;
}
.links-of-author-item {
  margin: 5px 0 0;
  width: 50%;
}
.links-of-author-item a,
.links-of-author-item span.exturl {
  box-sizing: border-box;
  display: inline-block;
  margin-bottom: 0;
  margin-right: 0;
  max-width: 216px;
  overflow: hidden;
  padding: 0 5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.links-of-author-item a,
.links-of-author-item span.exturl {
  border-bottom: none;
  display: block;
  text-decoration: none;
}
.links-of-author-item a::before,
.links-of-author-item span.exturl::before {
  display: none;
}
.links-of-author-item a:hover,
.links-of-author-item span.exturl:hover {
  background: #eee;
  border-radius: 4px;
}
.links-of-author-item .fa {
  margin-right: 2px;
}
.links-of-blogroll-item {
  padding: 0;
}
</style>