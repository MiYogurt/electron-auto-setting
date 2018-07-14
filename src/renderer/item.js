import { Input, Switch, Checkbox, Button, Select, Option } from 'at-ui'
import { ipcRenderer } from 'electron'

let inputTimer = null

const namespace = 'electron-auto-setting:'

export default {
  name: 'Item',
  props: ['config', 'type', 'name'],
  data() {
    return {
      conf: this.config
    }
  },
  mounted() {
    ipcRenderer.on(namespace+'return', (event, args) => {
      if (this.name == args.key) {
        this.conf.value = args.value

        // fix switch no bind error
        if (this.type == 'boolean') {
          this.$children[0].checkStatus = args.value
        }
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
              value={config.value || false}
              onChange={value =>
                ipcRenderer.send(namespace + 'set', {
                  key: name,
                  value: value
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
                ipcRenderer.send(namespace + 'set', {
                  key: name,
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
              onChange={value => {
                if (inputTimer) {
                  clearTimeout(inputTimer)
                }
                inputTimer = setTimeout(() => {
                  ipcRenderer.send(namespace + 'set', { key: name, value })
                }, 400)
              }}
            />
            <Button
              size="small"
              onClick={e => {
                ipcRenderer.send(namespace + 'get:path', { key: name })
              }}
            >
              {config.showText || '打开目录'}
            </Button>
          </div>
        )
      },
      string: () => {
        return (
          <div>
            <h3>{config.label}</h3>
            <Input
              value={config.value || config.defaultValue}
              onChange={value => {
                if (inputTimer) {
                  clearTimeout(inputTimer)
                }
                inputTimer = setTimeout(() => {
                  ipcRenderer.send(namespace + 'set', { key: this.name, value })
                }, 400)
              }}
            />
          </div>
        )
      }
    }
    return <div class="item">{map[type]()}</div>
  }
}
