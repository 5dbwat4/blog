<template>
   <footer class="footer">
      <div class="footer-inner">
        

<div class="copyright">
  
  &copy; 2019 – 
  <span itemprop="copyrightYear">2022</span>
  <span class="with-love">
    <ion-icon name="heart"></ion-icon>
  </span>
  <span class="author" itemprop="copyrightHolder">5dbwat4</span>
</div>
        
<div class="busuanzi-count">
    <span class="post-meta-item" id="busuanzi_container_site_uv" style="display: none;">
      <span class="post-meta-item-icon">
        <i class="fa fa-user"></i>
      </span>
      <span class="site-uv" title="总访客量">
        <span id="busuanzi_value_site_uv"></span>
      </span>
    </span>
    <span class="post-meta-divider">|</span>
    <span class="post-meta-item" id="busuanzi_container_site_pv" style="display: none;">
      <span class="post-meta-item-icon">
        <i class="fa fa-eye"></i>
      </span>
      <span class="site-pv" title="总访问量">
        <span id="busuanzi_value_site_pv"></span>
      </span>
    </span>
</div>
      </div>
    </footer>
</template>

<script setup>
import { onMounted } from "@vue/runtime-core";




onMounted(async()=>{
    
})
</script>

<style scoped>
.footer {
  color: #999;
  font-size: 0.875em;
  padding: 20px 0;
}
.footer.footer-fixed {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
}
.footer-inner {
  box-sizing: border-box;
  margin: 0 auto;
  text-align: center;
  width: calc(100% - 20px);
}
@media (min-width: 1200px) {
  .footer-inner {
    width: 1160px;
  }
}
@media (min-width: 1600px) {
  .footer-inner {
    width: 73%;
  }
}
.with-love {
  color: #ff0000;
  display: inline-block;
  margin: 0 5px;
  animation: iconAnimate 1.33s ease-in-out infinite;
}
.powered-by,
.theme-info {
  display: inline-block;
}
@-moz-keyframes iconAnimate {
  0%, 100% {
    transform: scale(1);
  }
  10%, 30% {
    transform: scale(0.9);
  }
  20%, 40%, 60%, 80% {
    transform: scale(1.1);
  }
  50%, 70% {
    transform: scale(1.1);
  }
}
@-webkit-keyframes iconAnimate {
  0%, 100% {
    transform: scale(1);
  }
  10%, 30% {
    transform: scale(0.9);
  }
  20%, 40%, 60%, 80% {
    transform: scale(1.1);
  }
  50%, 70% {
    transform: scale(1.1);
  }
}
@-o-keyframes iconAnimate {
  0%, 100% {
    transform: scale(1);
  }
  10%, 30% {
    transform: scale(0.9);
  }
  20%, 40%, 60%, 80% {
    transform: scale(1.1);
  }
  50%, 70% {
    transform: scale(1.1);
  }
}
@keyframes iconAnimate {
  0%, 100% {
    transform: scale(1);
  }
  10%, 30% {
    transform: scale(0.9);
  }
  20%, 40%, 60%, 80% {
    transform: scale(1.1);
  }
  50%, 70% {
    transform: scale(1.1);
  }
}
</style>
   