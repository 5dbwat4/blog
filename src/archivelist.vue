<template>
  <div class="posts-collapse">
      <div class="collection-title">
        <span class="collection-header">嗯..! 目前共计 13 篇日志。 继续努力。</span>
      </div>

<arch-list :arch="archMetaList"/>

  </div>
</template>

<script setup>
import { defineAsyncComponent, onMounted, ref } from "@vue/runtime-core";
import { makeSureArchMeta } from "./components/makeSureArchMeta";

const archList=defineAsyncComponent(()=>import("./components/archList.vue"))
const archMetaList=ref(false)

makeSureArchMeta().then(()=>{
    archMetaList.value=window.ArchMeta
})

</script>

<style>
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
</style>