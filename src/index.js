let setting = null
import createMainWindow from './main'
import { app, ipcMain } from 'electron'

const ready = new Promise((resolve, reject) => {
  app.on('ready', resolve)
})

export default function reload(settingPath) {
  setting = require(settingPath)
  setting = setting.default || setting
  return ready.then(createMainWindow)
}

ipcMain.on('setting', event => {
  console.log(setting)
  event.returnValue = setting
})

export { setting }
