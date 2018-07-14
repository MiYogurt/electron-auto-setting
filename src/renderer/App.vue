<template>
  <div id="app">
    <tabs>
      <tab-pane v-for="(group, key) in setting" :label="group.label" :name="JSON.stringify(group.configs)" :icon="group.icon">
        <item :config="config" :key="key" :name="key" :type="config.type" v-for="(config, key) in group.configs"/>
      </tab-pane>
    </tabs>
    <div class="control">
      <at-button class="cancel" size="small" @click="reset">恢复默认</at-button>
      <at-button class="save" size="small" type="primary" @click="hidden">保存配置</at-button>
    </div>
  </div>
</template>


<script>
import { Button, Tabs, TabPane } from 'at-ui'
import Item from './item.js'
import { ipcRenderer } from 'electron'
const namespace = 'electron-auto-setting:'

export default {
  components: {
    Item,
    AtButton: Button,
    Tabs,
    TabPane
  },
  data() {
    return {
      setting: [],
      loading: true
    }
  },
  mounted() {
    this.setting = ipcRenderer.sendSync(namespace+'setting')
    this.loading = false
    console.log(this.setting);
  },
  methods: {
    hidden() {
      ipcRenderer.send(namespace+'hidden')
    },
    reset() {
      ipcRenderer.send(namespace+'settingRest')
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
  min-height: 90vh;
  overflow-y: scroll;
}

.control {
  padding: 0 0.5rem;
  box-sizing: border-box;
  display: flex;
  min-height: 10vh;
  justify-content: space-between;
  align-items: center;
}

.cancel,
.save {
  padding: 0.4rem 2rem;
}
</style>

<style>

.at-tabs__header {
  border-bottom: none !important;
}

.at-tabs__nav,
.item {
  padding: 0 .5rem
}

.item h3 {
  margin: 0.5rem 0;
  font-size: 0.8rem;
}

.at-input {
  margin-bottom: 0.5rem;
}
</style>
