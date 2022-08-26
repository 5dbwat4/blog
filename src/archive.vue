<template>


    
<component v-if="loadingArticle" :is="ArticleComponent"/>
<art-loading v-else/>




</template>

<script setup>
import { defineAsyncComponent, h, ref, useAttrs } from "@vue/runtime-core";
import{useRoute} from "vue-router" 

const articleC=defineAsyncComponent(()=>import("./components/article.vue"))
const artLoading=defineAsyncComponent(()=>import("./components/articleLoading.vue"))

const route=useRoute(),attr=useAttrs()
const ArticleComponent=ref(h("p",{},{default:()=>"Loading..."}))
,loadingArticle=ref(false)
// ,loadingArticle=ref(true)
console.log(route.params);
console.log(attr.parser);
if(attr.parser=="archid"){
    fetch("./archdata/archmain/"+route.params.archId+".json").then(v=>v.json()).then(v=>{
        ArticleComponent.value=h(articleC,{
            title          : v.title         ,
            dateCreate     : v.dateCreate    ,
            datePublished  : v.datePublished ,
            datetime       : v.datetime      ,
            date           : v.date          ,
            body           : v.body          ,
            entityName     : v.entityName    
        })
        loadingArticle.value=true
    })
}
</script>

<style scoped>

</style>