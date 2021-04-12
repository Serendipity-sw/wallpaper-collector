const {contextBridge, ipcRenderer} = require('electron');
debugger

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            ipcRenderer.send(channel, data);
        }
    }
);