import App from './App.vue'
import Vue from 'vue'
import { ipcRenderer } from 'electron'

import 'at-ui-style/css/at.min.css'

const app = new Vue({
  data: {
    setting: ipcRenderer.sendSync('setting'),
    title: ipcRenderer.sendSync('title'),
    isDev: ipcRenderer.sendSync('isDev')
  },
  render: h => h(App)
})

app.$mount('#app')




