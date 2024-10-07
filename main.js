const path = require('path')
const fs = require('fs')
const { app, BrowserWindow } = require('electron')

app.whenReady().then(async () => {
  const window = new BrowserWindow({
    autoHideMenuBar: true,
    title: 'Logiciel cartographique',
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  // Create uploads directory if not exists.
  if (!fs.existsSync(app.getPath('userData') + '/uploads/')) {
    fs.mkdirSync(app.getPath('userData') + '/uploads/')
  }

  // Create content.json file if not exists.
  if (!fs.existsSync(app.getPath('userData') + '/content.json')) {
    fs.copyFileSync(
      path.join(process.resourcesPath, '/config/content.json'),
      app.getPath('userData') + '/content.json',
    )
  }

  await import('./app/.output/server/index.mjs')
  await window.loadURL('http://localhost:3000')
})
