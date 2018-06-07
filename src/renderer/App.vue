<template>
  <div id="app">
    <template v-for="(group, key) in setting">
      <tabs :animated="false">
      <tab-pane :label="group.label" :name="group.configs.toString()" :icon="group.icon">
        <item :config="config" :key="key" :name="key" :type="config.type" v-for="(config, key) in group.configs"/>
      </tab-pane>
    </tabs>
    </template>
    <div class="control">
      <at-button class="cancel" @click="reset">恢复默认</at-button>
      <at-button class="save" type="primary" @click="hidden">保存配置</at-button>
    </div>
  </div>
</template>


<script>
import { Button, Tabs, TabPane } from 'at-ui'
import Item from './item.js'
import { ipcRenderer } from 'electron'
export default {
  components: {
    Item,
    AtButton: Button,
    Tabs,
    TabPane
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
    },
    reset() {
      ipcRenderer.send('settingRest')
      this.$Message.success('已重置为默认设置')
    }
  }
}
</script>

<style scoped>
#app {
  max-height: 100vh;
}

.at-tabs {
  min-height: 80vh;
  overflow: scroll;
  padding: 0.5rem;
}

.control {
  padding: 0.5rem;
  box-sizing: border-box;
  display: flex;
  min-height: 20vh;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;
}
.cancel,
.save {
  padding: 0.5rem 2rem;
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
