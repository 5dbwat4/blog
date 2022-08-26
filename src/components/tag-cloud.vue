<template>
    <div id="tagCloud" class="tagCloud">Loading cloud...</div>
</template>

<script setup>
import { onMounted, ref, useAttrs, watch } from "@vue/runtime-core";

import{renderWordCloud} from "./renderWordCloud"

/**
 * {
 *  refreshArchlist=function(tagname):void
 * loaded:boolean
 * tagslist:[]
 * }
 */
var attr=ref(useAttrs())

var RenderWordCloudAllowed,
wordCloudDOMMounted=ref(false)

console.log(attr.value.loaded);

watch([attr,wordCloudDOMMounted],()=>{
    console.log(attr.value,wordCloudDOMMounted.value);
    if(attr.value.loaded&&wordCloudDOMMounted.value){
        console.log("initted");
            renderWordCloud(attr.value.tagslist,attr.value.refreshArchlist)
    }
})




onMounted(async()=>{
    wordCloudDOMMounted.value=true

})


</script>

<style>
.tagCloud{
    display: block;
    height: 400px;
}
</style>