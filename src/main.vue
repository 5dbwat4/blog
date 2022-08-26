<template>
  <header-c/>
  <!-- <header-site-desc/> -->
      <main class="main">
      <div class="main-inner">


        <div class="content-wrap">
          

          <div class="content">
            


<router-view/>


</div></div>


      </div>
    </main>

  <footer-c/>
</template>

<script setup>

import { defineAsyncComponent, onMounted, ref } from "@vue/runtime-core";
const footerC=defineAsyncComponent(()=>import("./components/footer.vue"))
const headerC=defineAsyncComponent(()=>import("./components/header.vue"))
// const headerSiteDesc=defineAsyncComponent(()=>import("./components/header-site-desc.vue"))
// import footer from "./components/footer.vue"

onMounted(async()=>{
    (await import("./components/lib/canvas-nest")).default()
})
// const canvasnest
</script>

<style src="./components/styles/reset.css"></style>
<style src="./components/styles/content-wrapper.css"></style>