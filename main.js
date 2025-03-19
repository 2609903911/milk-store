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
import OrderDetail from './pages/components/order-detail.vue'
import OrderCart from './pages/components/order-cart.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.component('order-detail', OrderDetail)
  app.component('order-cart', OrderCart)
  return {
    app
  }
}
// #endif