import { app, BrowserWindow, ipcMain, dialog, Tray, Menu } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import Store from 'electron-store'
import debug from 'debug'
const store = new Store()

const log = debug('electron-auto-setting')

let isDevelopment = process.env.DEBUG|| false

let mainWindow

const namespace = 'electron-auto-setting:'

function init(setting) {
  setting.forEach(group => {
    Object.keys(group.configs).forEach(key => {
      let config = group.configs[key]
      config.value = store.get(key)
    })
  })

  ipcMain.on(namespace+'isDev', event => {
    event.returnValue = isDevelopment
  })

  ipcMain.on(namespace+'setting', event => {
    event.returnValue = setting
  })

  ipcMain.on(namespace+'hidden', event => {
    if (mainWindow) {
      mainWindow.close()
    }
  })

  ipcMain.on(namespace+'settingRest', event => {
    setting.forEach(group => {
      Object.keys(group.configs).forEach(key => {
        const value = group.configs[key].defaultValue
        if (key && value) {
          store.set(key, value)
          log('reset')
          log(key, value)
          event.sender.send(namespace+'return', { key, value })
        }
      })
    })
  })

  ipcMain.on(namespace+'get:path', (event, args) => {
    dialog.showOpenDialog(
      mainWindow,
      {
        titie: '选择路径',
        properties: ['openDirectory', 'createDirectory']
      },
      filePaths => {
        log(filePaths)
        if (filePaths && filePaths.length) {
          store.set(args.key, filePaths[0])
          event.sender.send(namespace+'return', { key: args.key, value: filePaths[0] })
        }
      }
    )
  })

  ipcMain.on(namespace+'set', (event, { key, value }) => {
    log('set')
    log(key, value)
    store.set(key, value)
    event.sender.send(namespace + 'return', { key, value })
  })
}

function createMainWindow(windowConfig, dev) {
  isDevelopment = dev || false
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


  mainWindow.loadURL(
      formatUrl({
        pathname: path.join(__dirname, '../renderer/index.html'),
        protocol: 'file',
        slashes: true
      })
  )

  mainWindow.on('closed', () => {
    log('closed')
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

export default createMainWindow
export { init, store }
