# electron-auto-setting

## How to Use?

```js
const { default: create, init, store } = require('..')
const { app, Menu, Tray } = require('electron')
const { resolve } = require('path')

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

let win = null
let tray = null

openSetting = () => {
  win = create()
  init(setting, '大大的设置')
  store.onDidChange('gender', console.log)
  console.log(store.store)
}

app.on('ready', () => {
  tray = new Tray(resolve(__dirname, 'icon.png'))
  const contextMenu = Menu.buildFromTemplate([
    { label: 'setting', click: openSetting }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

## Type

* choice
* path
* boolean
