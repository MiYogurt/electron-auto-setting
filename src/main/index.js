import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import Store from 'electron-store'

const isDevelopment = process.env.NODE_ENV !== 'production'

function init(mainWindow, setting) {
  const store = new Store()

  // let setting = {
  //   gender: {
  //     type: 'choice',
  //     label: '性别',
  //     choices: ['male', 'female'],
  //     defaultValue: 'male'
  //   },
  //   path: {
  //     type: 'path',
  //     label: '保存路径',
  //     defaultValue: __dirname
  //   },
  //   output: {
  //     type: 'boolean',
  //     label: '是否保存',
  //     defaultValue: true
  //   }
  // }

  ipcMain.on('setting', event => {
    Object.keys(setting).forEach(key => {
      setting[key].value = store.get(key)
    })
    event.returnValue = setting
  })

  ipcMain.on('get:path', (event, args) => {
    console.log(args)
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
    store.set(key, value)
    event.sender.send('return', { key, value })
  })
}

function createMainWindow() {
  const window = new BrowserWindow(...arguments)

  if (isDevelopment) {
    window.webContents.openDevTools()
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, '../renderer/index.html'),
        protocol: 'file',
        slashes: true
      })
    )
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

if (isDevelopment) {
  app.on('ready', () => {
    createMainWindow()
  })
}

export default createMainWindow
export { init }
