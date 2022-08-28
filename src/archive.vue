<template>


    
<component v-if="loadingArticle" :is="ArticleComponent"/>
<art-loading v-else/>




</template>

<script setup>
import { defineAsyncComponent, h, ref, useAttrs } from "@vue/runtime-core";
import{useRoute} from "vue-router" 
import { makeSureArchMeta } from "./components/makeSureArchMeta";

const articleC=defineAsyncComponent(()=>import("./components/article.vue"))
const artLoading=defineAsyncComponent(()=>import("./components/articleLoading.vue"))

const route=useRoute(),attr=useAttrs()
const ArticleComponent=ref(h("p",{},{default:()=>"Loading..."}))
,loadingArticle=ref(false)
// ,loadingArticle=ref(true)
console.log(route.params);
console.log(attr.parser);
switch(attr.parser){
    case "archid":
initArticleById(route.params.archId)
    break;
    case "entityName":
        let archId=""
        makeSureArchMeta().then(()=>{
            for (let i = 0; i < window.ArchMeta.data.length; i++) {
                const element = window.ArchMeta.data[i];
                                if(element.entityName==route.params.entityName){
                    archId=element.id
                }
                break
            }
            if(archId==""){

            }else{
                initArticleById(archId)
            }
        })
}


function initArticleById(archId){
    fetch("./archdata/archmain/"+archId+".json").then(v=>v.json()).then(v=>{
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