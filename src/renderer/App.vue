<template>
  <div id="app">
    <h2>Hello</h2>
    <template v-for="(config, key) in setting">
      {{ config }} - {{ key }}
      <Item :type="config.type" :name="key" :config="config"/>
    </template>
  </div>
</template>


<script>
import Item from './item.js'

export default {
  components: {
    Item
  },
  data() {
    return { setting: this.$root.$data }
  },
  mounted() {
    console.log(this.$root.$data)
  }
}
</script>
