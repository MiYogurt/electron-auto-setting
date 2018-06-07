import App from './App.vue'
import Vue from 'vue'
import { ipcRenderer } from 'electron'

import 'at-ui-style/css/at.min.css'
import './App.css'

import Message from 'at-ui/src/components/message/index'

Vue.prototype.$Message = Message

const app = new Vue({
  data: {
    setting: ipcRenderer.sendSync('setting'),
    isDev: ipcRenderer.sendSync('isDev')
  },
  render: h => h(App)
})

app.$mount('#app')
