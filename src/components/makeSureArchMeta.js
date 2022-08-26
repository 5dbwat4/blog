async function makeSureArchMeta(){
    
    if(!window.ArchMeta){
        await fetch("./archdata/maps/meta.json").then(v=>v.json()).then(v=>{
            window.ArchMeta=v
        })
    }
}

export{makeSureArchMeta}