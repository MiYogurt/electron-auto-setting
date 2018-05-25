# electron-auto-setting

⛑ 未完成，但是你可以做为参考

## How to Use?

```js
const { default: create, init } = require('..')
const { app } = require('electron')

let setting = {
  gender: {
    type: 'choice',
    label: '性别',
    choices: ['male', 'female'],
    defaultValue: 'male'
  },
  path: {
    type: 'path',
    label: '保存路径',
    defaultValue: __dirname
  },
  output: {
    type: 'boolean',
    label: '是否保存',
    defaultValue: true
  }
}

app.on('ready', () => {
  let win = create()
  init(win, setting)
})
```
