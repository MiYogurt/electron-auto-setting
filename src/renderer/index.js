import App from './App.vue'
import Vue from 'vue'
import { ipcRenderer } from 'electron'

import 'at-ui-style/css/at.min.css'
import './App.css'

import Message from 'at-ui/src/components/message/index'

Vue.prototype.$Message = Message

const namespace = 'electron-auto-setting:'

const app = new Vue({
  render: h => h(App)
})

app.$mount('#app')
