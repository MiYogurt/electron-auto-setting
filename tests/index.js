const { setting, window, default: init } = require('../lib')
const { app } = require('electron')

init(require.resolve('./setting.js'))
  .then(win => {
    win.show()
    console.log(win)
    win.loadURL('http://localhost:9080')
  })
  .catch(console.error)
