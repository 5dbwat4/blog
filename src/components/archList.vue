<template>
  <archive-item v-for="archive in $attrs.arch" :key="archive.id" :entityName="archive.entityName"
  :title="archive.title"/>
</template>

<script setup>
import { defineAsyncComponent } from "@vue/runtime-core";

const archiveItem=defineAsyncComponent(()=>import("./archiveItem.vue"))
</script>

<style>

</style>