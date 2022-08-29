import {first_load,loaded} from "./components/pre-loader"

first_load()
;(async()=>{
    const createApp=(await import("vue")).createApp
    const VueRouter=(await import("vue-router"))
    const obj=(await import("./main.vue")).default
    const routes = [
        {path:"/",component: ()=>import("./index.vue")},
        {path:"/arch/id/:archId", component: ()=>import("./archive.vue"),props:{parser:"archid"}},
        {path:"/arch", component: ()=>import("./archivelist.vue"),props:{filtertype:"all"}},
        {path:"/arch/date", component: ()=>import("./archivelist.vue"),props:{filtertype:"date-init"}},
        {path:"/arch/date/:year", component: ()=>import("./archivelist.vue"),props:{filtertype:"date-year"}},
        {path:"/arch/date/:year/:month", component: ()=>import("./archivelist.vue"),props:{filtertype:"date-month"}},
        {path:"/arch/date/:year/:month/:day", component: ()=>import("./archivelist.vue"),props:{filtertype:"date-day"}},
        {path:"/arch/:year/:month/:day/id/:archId", component: ()=>import("./archive.vue"),props:{parser:"archid"}},
        {path:"/arch/:year/:month/:day/:entityName", component: ()=>import("./archive.vue"),props:{parser:"entityName"}},
        {path:"/arch/:entityName", component: ()=>import("./archive.vue"),props:{parser:"entityName"}},
        {path:"/tags", component: ()=>import("./tags.vue")},
        {path:"/tags/:tagname", component: ()=>import("./archivelist.vue"),props:{filtertype:"tagname"}},
        {path:"/404", component: ()=>import("./404.vue"),props:{filtertype:"tagname"}},

    ]
    const router = VueRouter.createRouter({
        history: VueRouter.createWebHashHistory("/"),
        routes, 
      })
    

createApp(obj).use(router).mount("#vue-container")


loaded()
})();