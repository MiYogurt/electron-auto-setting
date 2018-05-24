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
      console.log('return')
      console.log(args)
      if (this.name == args.key) {
        console.log(this.conf)
        this.conf.value = args.value
      }
    })
  },
  render(h) {
    console.dir(this)
    const { type, conf: config, name } = this
    console.log(type)
    console.log(config)
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
        )
      },
      path: () => {
        return (
          <div>
            <h3>{config.label}</h3>
            <Input
              value={config.value || config.defaultValue}
              onChange={e => console.log(e)}
            />
            <Button
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

    const instance = map[type]

    return instance()
  }
}
