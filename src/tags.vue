<template>
<tags-cloud :tagslist="tagsData" :loaded="loaded" :refreshArchlist="refreshArchlist"/>
</template>

<script setup>
import { defineAsyncComponent, ref } from "@vue/runtime-core";

const tagsCloud=defineAsyncComponent(()=>import("./components/tag-cloud.vue"))

const tagsData=ref([]),loaded=ref(false)

const refreshArchlist=(d)=>{}


fetch("./archdata/maps/tags.json").then(v=>v.json()).then(async(v)=>{

    let tmp_obj={}

    for (let i = 0; i < v.data.length; i++) {
        tmp_obj[v.data[i].lable]={
            name:v.data[i].lable,
            value:0,
            list:[]
        }
    }

      ;await (await import("./components/makeSureArchMeta")).makeSureArchMeta();

    for (let i = 0; i < ArchMeta.data.length; i++) {
        ArchMeta.data[i].tags.forEach(v=>{
            tmp_obj[v].value++
            tmp_obj[v].list.push(ArchMeta.data[i])
        })   
    }

    tagsData.value=Object.entries(tmp_obj).map(v=>v[1])
    console.log(tagsData.value);
    loaded.value=true
})
</script>

<style>

</style>