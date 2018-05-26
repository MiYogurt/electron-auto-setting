import { Input, Switch, Checkbox, Button, Select, Option } from 'at-ui'
import { ipcRenderer } from 'electron'

export default {
  name: 'Item',
  props: ['config', 'type', 'name'],
  data() {
    return {
      conf: this.config
    }
  },
  mounted() {
    ipcRenderer.on('return', (event, args) => {
      if (this.name == args.key) {
        this.conf.value = args.value
      }
    })
  },
  render(h) {
    const { type, conf: config, name } = this
    const map = {
      boolean: () => {
        return (
          <div>
            <h3>{config.label}</h3>
            <Switch
              value={
                config.value == undefined || config.value == null
                  ? config.defaultValue
                  : config.value
              }
              onChange={e =>
                ipcRenderer.send('set', {
                  key: this.name,
                  value: !config.value
                })
              }
            />
          </div>
        )
      },
      choice: () => {
        const choices = config.choices.map(choice => (
          <Option value={choice}>{choice}</Option>
        ))
        return (
          <div>
            <h3>{config.label}</h3>
            <Select
              value={config.value || config.defaultValue}
              onOn-change={value =>
                ipcRenderer.send('set', {
                  key: this.name,
                  value
                })
              }
              placeholder={config.label}
            >
              {choices}
            </Select>
          </div>
        )
      },
      path: () => {
        return (
          <div>
            <h3>{config.label}</h3>
            <Input
              value={config.value || config.defaultValue}
              onChange={value =>
                ipcRenderer.send('set', { key: this.name, value })
              }
            />
            <Button
              size="small"
              onClick={e => {
                ipcRenderer.send('get:path', { key: this.name })
              }}
            >
              {config.showText || '打开目录'}
            </Button>
          </div>
        )
      }
    }
    return <div class="item">{map[type]()}</div>
  }
}
