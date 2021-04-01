const {app, BrowserWindow, Menu} = require('electron');
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
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile(process.resourcesPath + '/index.html');
    }
};
Menu.setApplicationMenu(null);
app.whenReady().then(createWindow);