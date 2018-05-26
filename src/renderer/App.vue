<template>
  <div id="app">
    <h2>{{title}}</h2>
    <template v-for="(config, key) in setting">
      <span v-if="isDev">{{ config }} - {{ key }}</span>
      <Item :type="config.type" :name="key" :config="config"/>
    </template>
    <div><at-button class="save" type="primary" @click="hidden">保存设置</at-button></div>
  </div>
</template>


<script>
import { Button } from 'at-ui'
import Item from './item.js'
import { ipcRenderer } from 'electron'
export default {
  components: {
    Item,
    AtButton: Button
  },
  data() {
    return this.$root.$data
  },
  mounted() {
    console.log(this.$root.$data)
  },
  methods: {
    hidden() {
      ipcRenderer.send('hidden')
    }
  }
}
</script>

<style scoped>
#app {
  padding: 0.5rem;
}

h2 {
  -webkit-app-region: drag;
  text-align: center;
  padding: 0.5rem 0;
}

.save {
  margin: 1rem auto;
  display: block;
}
</style>

<style>
.item h3 {
  margin: 0.5rem 0;
  font-size: 0.8rem;
}

.at-input {
  margin-bottom: 0.5rem;
}
</style>
