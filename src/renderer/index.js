import App from './App.vue'
import Vue from 'vue'
import { ipcRenderer } from 'electron'

import 'at-ui-style/css/at.min.css'

const app = new Vue({
  data: ipcRenderer.sendSync('setting'),
  render: h => h(App)
})

app.$mount('#app')




