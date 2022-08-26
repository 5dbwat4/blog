<template>
    <article itemscope itemtype="http://schema.org/Article">
    <header class="post-header">

      <div class="post-meta">
        <time itemprop="dateCreated"
              datetime="2020-05-02T22:22:33+08:00"
              content="2020-05-02">
          05-02
        </time>
      </div>

      <h3 class="post-title">
          <router-link class="post-title-link" :to="'/arch/'+$attrs.entityName" itemprop="url">
            <span itemprop="name">{{$attrs.title}}</span>
          </router-link>
      </h3>

    </header>
  </article>

</template>

<script setup>

</script>

<style scoped> 

.collection-title {
  font-size: 1.125em;
  position: relative;
}
.collection-title::before {
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
.collection-year {
  margin: 60px 0;
  position: relative;
}
.collection-year::before {
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
.collection-header {
  display: inline-block;
  margin: 0 0 0 20px;
}
.collection-header small {
  color: #bbb;
  margin-left: 5px;
}
.post-header {
  border-bottom: 1px dashed #ccc;
  margin: 30px 0;
  padding-left: 15px;
  position: relative;
  transition-property: border;
  transition-delay: 0s;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
}
.post-header::before {
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
.post-header:hover {
  border-bottom-color: #666;
}
.post-header:hover::before {
  background: #222;
}
.post-meta {
  display: inline;
  font-size: 0.75em;
  margin-right: 10px;
}
.post-title {
  display: inline;
  font-size: 1em;
  font-weight: normal;
}
.post-title a,
.post-title span.exturl {
  border-bottom: none;
  color: #666;
}

.fa-external-link {
  font-size: 0.875em;
  margin-left: 5px;
}
</style>