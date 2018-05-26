import { app, BrowserWindow, ipcMain, dialog, Tray, Menu } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import Store from 'electron-store'
const store = new Store()

const isDevelopment = process.env.NODE_ENV !== 'production'
let mainWindow

function init(setting, title) {
  ipcMain.on('setting', event => {
    Object.keys(setting).forEach(key => {
      setting[key].value = store.get(key)
    })
    event.returnValue = setting
  })

  ipcMain.on('title', event => {
    event.returnValue = title
  })

  ipcMain.on('hidden', event => {
    if (mainWindow) {
      mainWindow.close()
    }
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
    store.set(key, value)
    event.sender.send('return', { key, value })
  })
}

function createMainWindow(windowConfig) {
  mainWindow = new BrowserWindow(
    Object.assign({}, windowConfig, {
      frame: false,
      width: 300,
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

// if (isDevelopment) {
//   const openSetting = () => {
//     const win = createMainWindow({
//       frame: false,
//       titleBarStyle: 'hidden-inset',
//       width: 300,
//       height: 400
//     })
//     init(
//       {
//         gender: {
//           type: 'choice',
//           label: '性别',
//           choices: ['male', 'female'],
//           defaultValue: 'male'
//         },
//         path: {
//           type: 'path',
//           label: '保存路径',
//           defaultValue: __dirname
//         },
//         output: {
//           type: 'boolean',
//           label: '是否保存',
//           defaultValue: true
//         }
//       },
//       '设置'
//     )
//     console.log(store)
//     store.onDidChange('gender', console.log)
//     console.log(store.store)
//   }

//   let tray = null

//   app.on('ready', () => {
//     tray = new Tray(path.resolve(__dirname, '../../tests/icon.png'))
//     const contextMenu = Menu.buildFromTemplate([
//       { label: 'setting', click: openSetting }
//     ])
//     tray.setContextMenu(contextMenu)
//     // openSetting()
//   })

//   app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//       app.quit()
//     }
//   })
// }

export default createMainWindow
export { init, store }
