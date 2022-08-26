<template>
  <div class="posts-expand">
   <article itemscope itemtype="http://schema.org/Article" class="post-block " lang="zh-CN">
    <link itemprop="mainEntityOfPage" :href="$attrs.entityURL">

    <span hidden itemprop="author" itemscope itemtype="http://schema.org/Person">
      <meta itemprop="image" content="/images/avatar.jpg">
      <meta itemprop="name" content="Zhengjiabao">
      <meta itemprop="description" content="">
    </span>

    <span hidden itemprop="publisher" itemscope itemtype="http://schema.org/Organization">
      <meta itemprop="name" content="ZhengJiabao`s Blog">
    </span>
      <header class="post-header">
        <h2 class="post-title" itemprop="name headline">
          {{$attrs.title}}
        </h2>

        <div class="post-meta">
            <span class="post-meta-item">
              <span class="post-meta-item-icon">
                <i class="fa fa-calendar-o"></i>
              </span>
              <span class="post-meta-item-text">发表于</span>
              

              <time :title="'创建时间：'+$attrs.dateCreate+' / 修改时间：'+$attrs.datePublished" itemprop="dateCreated datePublished" :datetime="$attrs.datetime">{{$attrs.date}}</time>
            </span>

          
            <span class="post-meta-item" title="阅读次数" id="busuanzi_container_page_pv" style="display: none;">
              <span class="post-meta-item-icon">
                <i class="fa fa-eye"></i>
              </span>
              <span class="post-meta-item-text">阅读次数：</span>
              <span id="busuanzi_value_page_pv"></span>
            </span>

        </div>
      </header>

    
    
    
    <div class="post-body" itemprop="articleBody" v-html="$attrs.body">

    </div>

    
    
    

    <div>
      
        <div>
    
        <div style="text-align:center;color: #ccc;font-size:14px;">-------------本文结束<i class="fa fa-paw"></i>感谢您的阅读-------------</div>
    
</div>
      
    </div>
        

<div>
<ul class="post-copyright">
  <li class="post-copyright-author">
    <strong>本文作者： </strong>Zhengjiabao
  </li>
  <li class="post-copyright-link">
    <strong>本文链接：</strong>
    <a href="https://zhengjiabao.gitee.io/2020/05/02/waiyutong-hommization/" title="外语通的人性化处理">https://zhengjiabao.gitee.io/2020/05/02/waiyutong-hommization/</a>
  </li>
  <li class="post-copyright-license">
    <strong>版权声明： </strong>本博客所有文章除特别声明外，均采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/zh-CN" rel="noopener" target="_blank"><i class="fa fa-fw fa-creative-commons"></i>BY-NC-SA</a> 许可协议。转载请注明出处！
  </li>
</ul>
</div>


      <footer class="post-footer">
          
          <div class="post-tags">
              <a href="/tags/course/" rel="tag"><i class="fa fa-tag"></i> course</a>
          </div>

      </footer>
    
  </article>
  </div>
</template>

<script setup>

</script>

<style scoped>
.post-body {
  font-family: 'Lato', "PingFang SC", "Microsoft YaHei", sans-serif;
  overflow-wrap: break-word;
  word-wrap: break-word;
}
@media (min-width: 1200px) {
  .post-body {
    font-size: 1.125em;
  }
}
.post-body span.exturl .fa {
  font-size: 0.875em;
  margin-left: 4px;
}
.post-body .image-caption,
.post-body .figure .caption {
  color: #999;
  font-size: 0.875em;
  font-weight: bold;
  line-height: 1;
  margin: -20px auto 15px;
  text-align: center;
}
.post-sticky-flag {
  display: inline-block;
  transform: rotate(30deg);
}
.post-button {
  margin-top: 40px;
  text-align: center;
}
.use-motion .post-block,
.use-motion .pagination,
.use-motion .comments {
  opacity: 0;
}
.use-motion .post-header {
  opacity: 0;
}
.use-motion .post-body {
  opacity: 0;
}
.use-motion .collection-header {
  opacity: 0;
}
.posts-collapse {
  margin-left: 55px;
  position: relative;
}
@media (max-width: 767px) {
  .posts-collapse {
    margin-left: 20px;
    margin-right: 20px;
  }
}
.posts-collapse .collection-title {
  font-size: 1.125em;
  position: relative;
}
.posts-collapse .collection-title::before {
  background: #999;
  border: 1px solid #fff;
  border-radius: 50%;
  content: ' ';
  height: 10px;
  left: 0;
  margin-left: -6px;
  margin-top: -4px;
  position: absolute;
  top: 50%;
  width: 10px;
}
.posts-collapse .collection-year {
  margin: 60px 0;
  position: relative;
}
.posts-collapse .collection-year::before {
  background: #bbb;
  border-radius: 50%;
  content: ' ';
  height: 8px;
  left: 0;
  margin-left: -4px;
  margin-top: -4px;
  position: absolute;
  top: 50%;
  width: 8px;
}
.posts-collapse .collection-header {
  display: inline-block;
  margin: 0 0 0 20px;
}
.posts-collapse .collection-header small {
  color: #bbb;
  margin-left: 5px;
}
.posts-collapse .post-header {
  border-bottom: 1px dashed #ccc;
  margin: 30px 0;
  padding-left: 15px;
  position: relative;
  transition-property: border;
  transition-delay: 0s;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
}
.posts-collapse .post-header::before {
  background: #bbb;
  border: 1px solid #fff;
  border-radius: 50%;
  content: ' ';
  height: 6px;
  left: 0;
  margin-left: -4px;
  position: absolute;
  top: 0.75em;
  transition-property: background;
  width: 6px;
  transition-delay: 0s;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
}
.posts-collapse .post-header:hover {
  border-bottom-color: #666;
}
.posts-collapse .post-header:hover::before {
  background: #222;
}
.posts-collapse .post-meta {
  display: inline;
  font-size: 0.75em;
  margin-right: 10px;
}
.posts-collapse .post-title {
  display: inline;
  font-size: 1em;
  font-weight: normal;
}
.posts-collapse .post-title a,
.posts-collapse .post-title span.exturl {
  border-bottom: none;
  color: #666;
}
.posts-collapse::before {
  background: #f5f5f5;
  content: ' ';
  height: 100%;
  left: 0;
  margin-left: -2px;
  position: absolute;
  top: 1.25em;
  width: 4px;
}
.posts-collapse .fa-external-link {
  font-size: 0.875em;
  margin-left: 5px;
}
.post-eof {
  background: #ccc;
  height: 1px;
  margin: 80px auto 60px;
  text-align: center;
  width: 8%;
}
.post-block:last-child .post-eof {
  display: none;
}
.posts-expand {
  padding-top: 40px;
}
@media (max-width: 767px) {
  .posts-expand {
    margin: 0 20px;
  }
}
@media (min-width: 992px) {
  .post-body {
    text-align: justify;
  }
}
@media (max-width: 991px) {
  .post-body {
    text-align: justify;
  }
}
.post-body h1,
.post-body h2,
.post-body h3,
.post-body h4,
.post-body h5,
.post-body h6 {
  padding-top: 10px;
}
.post-body h1 .header-anchor,
.post-body h2 .header-anchor,
.post-body h3 .header-anchor,
.post-body h4 .header-anchor,
.post-body h5 .header-anchor,
.post-body h6 .header-anchor {
  border-bottom-style: none;
  color: #ccc;
  float: right;
  margin-left: 10px;
  visibility: hidden;
}
.post-body h1 .header-anchor:hover,
.post-body h2 .header-anchor:hover,
.post-body h3 .header-anchor:hover,
.post-body h4 .header-anchor:hover,
.post-body h5 .header-anchor:hover,
.post-body h6 .header-anchor:hover {
  color: inherit;
}
.post-body h1:hover .header-anchor,
.post-body h2:hover .header-anchor,
.post-body h3:hover .header-anchor,
.post-body h4:hover .header-anchor,
.post-body h5:hover .header-anchor,
.post-body h6:hover .header-anchor {
  visibility: visible;
}
.post-body iframe,
.post-body img,
.post-body video {
  margin-bottom: 20px;
}
.post-body .video-container {
  height: 0;
  margin-bottom: 20px;
  overflow: hidden;
  padding-top: 75%;
  position: relative;
  width: 100%;
}
.post-body .video-container iframe,
.post-body .video-container object,
.post-body .video-container embed {
  height: 100%;
  left: 0;
  margin: 0;
  position: absolute;
  top: 0;
  width: 100%;
}
.post-gallery {
  align-items: center;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 1fr 1fr;
  margin-bottom: 20px;
}
@media (max-width: 767px) {
  .post-gallery {
    grid-template-columns: 1fr 1fr;
  }
}
.post-gallery a {
  border: 0;
}
.post-gallery img {
  margin: 0;
}
.posts-expand .post-header {
  font-size: 1.125em;
}
.posts-expand .post-title {
  font-weight: 400;
  margin: initial;
  text-align: center;
  overflow-wrap: break-word;
  word-wrap: break-word;
}
.posts-expand .post-title-link {
  border-bottom: none;
  color: #555;
  display: inline-block;
  position: relative;
  vertical-align: top;
}
.posts-expand .post-title-link::before {
  background: #000;
  bottom: 0;
  content: '';
  height: 2px;
  left: 0;
  position: absolute;
  transform: scaleX(0);
  visibility: hidden;
  width: 100%;
  transition-delay: 0s;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
}
.posts-expand .post-title-link:hover::before {
  transform: scaleX(1);
  visibility: visible;
}
.posts-expand .post-title-link .fa {
  font-size: 0.875em;
  margin-left: 5px;
}
.posts-expand .post-meta {
  color: #999;
  font-family: 'Lato', "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 0.75em;
  margin: 3px 0 60px 0;
  text-align: center;
}
.posts-expand .post-meta .post-description {
  font-size: 0.875em;
  margin-top: 2px;
}
.posts-expand .post-meta time {
  border-bottom: 1px dashed #999;
  cursor: pointer;
}
.post-meta .post-meta-item + .post-meta-item::before {
  content: '|';
  margin: 0 0.5em;
}
.post-meta-divider {
  margin: 0 0.5em;
}
.post-meta-item-icon {
  margin-right: 3px;
}
@media (max-width: 991px) {
  .post-meta-item-icon {
    display: inline-block;
  }
}
@media (max-width: 991px) {
  .post-meta-item-text {
    display: none;
  }
}
.post-nav {
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 10px;
}
.post-nav-item {
  flex: 1;
}
.post-nav-item a {
  border-bottom: none;
  display: block;
  font-size: 0.875em;
  line-height: 1.6;
  position: relative;
}
.post-nav-item a:hover {
  border-bottom: none;
  color: #222;
}
.post-nav-item a:active {
  top: 2px;
}
.post-nav-item .fa {
  font-size: 0.75em;
}
.post-nav-item:first-child {
  margin-right: 15px;
}
.post-nav-item:first-child a {
  padding-left: 5px;
}
.post-nav-item:first-child .fa {
  margin-right: 5px;
}
.post-nav-item:last-child {
  margin-left: 15px;
  text-align: right;
}
.post-nav-item:last-child a {
  padding-right: 5px;
}
.post-nav-item:last-child .fa {
  margin-left: 5px;
}
.rtl.post-body p,
.rtl.post-body a,
.rtl.post-body h1,
.rtl.post-body h2,
.rtl.post-body h3,
.rtl.post-body h4,
.rtl.post-body h5,
.rtl.post-body h6,
.rtl.post-body li,
.rtl.post-body ul,
.rtl.post-body ol {
  direction: rtl;
  font-family: UKIJ Ekran;
}
.rtl.post-title {
  font-family: UKIJ Ekran;
}
.post-tags {
  margin-top: 40px;
  text-align: center;
}
.post-tags a {
  display: inline-block;
  font-size: 0.8125em;
}
.post-tags a:not(:last-child) {
  margin-right: 10px;
}
.post-widgets {
  border-top: 1px solid #eee;
  margin-top: 15px;
  text-align: center;
}

.post-body {
  font-family: 'Lato', "PingFang SC", "Microsoft YaHei", sans-serif;
  overflow-wrap: break-word;
  word-wrap: break-word;
}
@media (min-width: 1200px) {
  .post-body {
    font-size: 1.125em;
  }
}
.post-body span.exturl .fa {
  font-size: 0.875em;
  margin-left: 4px;
}
.post-body .image-caption,
.post-body .figure .caption {
  color: #999;
  font-size: 0.875em;
  font-weight: bold;
  line-height: 1;
  margin: -20px auto 15px;
  text-align: center;
}
.post-sticky-flag {
  display: inline-block;
  transform: rotate(30deg);
}
.post-button {
  margin-top: 40px;
  text-align: center;
}
</style>

<style src="./styles/post-body-reset.css">

</style>

<style src="./styles/highlight-reset.css">

</style>