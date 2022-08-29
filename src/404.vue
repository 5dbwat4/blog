<template>
<div id="404-anim"></div>
<p>404 Not Found</p>
</template>

<script setup>
import { onMounted } from "@vue/runtime-core";


onMounted(async()=>{
    ;(await import("./components/404-anim")).init404Animation(document.getElementById("404-anim"));
})
</script>