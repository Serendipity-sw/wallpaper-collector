const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const wallpaper = require('wallpaper')
const exec = require('child_process').execFile
const path = require('path');

let mainWindow;
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 700,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'js/preload.js')
        }
    });
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools()
        mainWindow.loadURL('http://localhost:8080/index.html');
        if (process.platform === 'win32') {
            // windows 系统
            exec(path.join(__dirname, '../service/service.exe'))
        } else {
            exec(path.join(__dirname, '../service/service'))
        }
    } else {
        mainWindow.loadFile(process.resourcesPath + '/index.html');
        if (process.platform === 'win32') {
            // windows 系统
            exec(process.resourcesPath + '/service.exe')
        } else {
            exec(process.resourcesPath + '/service')
        }
    }

};
Menu.setApplicationMenu(null);
app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    app.exit(0);
})

ipcMain.on('downUrlLoad', (e, url) => {
    mainWindow.webContents.downloadURL(url)
})

ipcMain.on('setWallpaper', (e, filePath) => {
    if (process.platform === 'darwin') {
        // mac 系统
    }
    if (process.platform === 'win32') {
        // windows 系统
    }
    wallpaper.set(filePath)
})