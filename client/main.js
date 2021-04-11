const {app, BrowserWindow, Menu} = require('electron');
const exec = require('child_process').execFile
const path = require('path');

let mainWindow;
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }
    });
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:8080/index.html');
        exec(path.join(__dirname, '../service/service.exe'))
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile(process.resourcesPath + '/index.html');
        exec(process.resourcesPath + '/service.exe')
    }
};
Menu.setApplicationMenu(null);
app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    app.exit(0);
})