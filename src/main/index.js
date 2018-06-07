import { app, BrowserWindow, ipcMain, dialog, Tray, Menu } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import Store from 'electron-store'
const store = new Store()

const isDevelopment = process.env.NODE_ENV !== 'production'
let mainWindow

function init(setting) {
  ipcMain.on('setting', event => {
    setting.forEach(group => {
      Object.keys(group.configs).forEach(key => {
        let config = group.configs[key]
        config.value = store.get(key)
      })
    })
    event.returnValue = setting
  })

  ipcMain.on('hidden', event => {
    if (mainWindow) {
      mainWindow.close()
    }
  })

  ipcMain.on('settingRest', event => {
    setting.forEach(group => {
      Object.keys(group.configs).forEach(key => {
        const value = group.configs[key].defaultValue
        if (key && value) {
          store.set(key, value)
          console.log('reset')
          console.log(key, value)
          event.sender.send('return', { key, value })
        }
      })
    })
  })

  ipcMain.on('isDev', event => {
    event.returnValue = isDevelopment
  })

  ipcMain.on('get:path', (event, args) => {
    dialog.showOpenDialog(
      mainWindow,
      {
        titie: '选择路径',
        properties: ['openDirectory', 'createDirectory']
      },
      filePaths => {
        console.log(filePaths)
        if (filePaths && filePaths.length) {
          store.set(args.key, filePaths[0])
          event.sender.send('return', { key: args.key, value: filePaths[0] })
        }
      }
    )
  })

  ipcMain.on('set', (event, { key, value }) => {
    console.log('set')
    console.log(key, value)
    store.set(key, value)
    event.sender.send('return', { key, value })
  })
}

function createMainWindow(windowConfig) {
  console.log(mainWindow)
  if (mainWindow) {
    return mainWindow.focus()
  }
  mainWindow = new BrowserWindow(
    Object.assign({}, windowConfig, {
      frame: false,
      width: 600,
      height: 400
    })
  )

  if (isDevelopment) {
    mainWindow.webContents.openDevTools()
  }

  if (isDevelopment) {
    mainWindow.loadURL(
      `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
    )
  } else {
    mainWindow.loadURL(
      formatUrl({
        pathname: path.join(__dirname, '../renderer/index.html'),
        protocol: 'file',
        slashes: true
      })
    )
  }

  mainWindow.on('closed', () => {
    console.log('closed')
    mainWindow = null
  })

  mainWindow.webContents.on('devtools-opened', () => {
    mainWindow.focus()
    setImmediate(() => {
      mainWindow.focus()
    })
  })

  return mainWindow
}

if (isDevelopment) {
  init([
    {
      icon: 'icon-settings',
      label: '设置',
      configs: {
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
    }
  ])

  const openSetting = () => {
    const win = createMainWindow({
      frame: false,
      titleBarStyle: 'hidden-inset',
      width: 600,
      height: 400
    })
    console.log(win)
    console.log(store)
    store.onDidChange('gender', console.log)
    console.log(store.store)
  }

  let tray = null

  app.on('ready', () => {
    tray = new Tray(path.resolve(__dirname, '../../tests/icon.png'))
    const contextMenu = Menu.buildFromTemplate([
      { label: 'setting', click: openSetting }
    ])
    tray.setContextMenu(contextMenu)
    // openSetting()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}

export default createMainWindow
export { init, store }
