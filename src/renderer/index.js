import App from './App.vue'
import Vue from 'vue'

const app = new Vue({
  render: h => h(App)
})

app.$mount('#app')
