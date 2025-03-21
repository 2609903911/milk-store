import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import OrderDetail from './pages/components/shop-detail.vue'
import OrderCart from './pages/components/order-cart.vue'

// 开发环境错误处理
// #ifdef MP-WEIXIN
// 微信小程序环境下，关闭网络请求限制警告
if (typeof wx !== 'undefined') {
  // 屏蔽特定错误
  const originalConsole = console;
  console.warn = function(...args) {
    // 过滤socket和localhost相关警告
    if (args.length > 0 && typeof args[0] === 'string' && 
        (args[0].includes('localhost') || args[0].includes('socket'))) {
      return;
    }
    return originalConsole.warn.apply(console, args);
  };
}
// #endif

export function createApp() {
  const app = createSSRApp(App)
  app.component('shop-detail', OrderDetail)
  app.component('order-cart', OrderCart)
  
  // 全局错误处理
  app.config.errorHandler = (err, vm, info) => {
    // 过滤掉socket相关错误
    if (err && typeof err === 'string' && 
       (err.includes('socket') || err.includes('localhost'))) {
      return;
    }
    console.error('[App Error]:', err);
  };
  
  return {
    app
  }
}
// #endif