
function first_load(){
  document.getElementById("loading").innerHTML=`

  `
  }
  function loaded(){
      document.getElementById("loading").innerHTML=""
  }
  export {
      first_load,
      loaded
  }
