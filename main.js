const { app, BrowserWindow, globalShortcut } = require('electron');
const { dialog ,ipcMain} = require('electron');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
        contextIsolation: false,
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        enableRemoteModule: true
        },
  });

  win.loadFile('index.html');
  webFrame.setVisualZoomLevelLimits(1, 3); // Establece los límites del zoom
  globalShortcut.register('CommandOrControl+R', () => {
    win.reload();
  });
};


app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
});

ipcMain.on('open-new-window', () => {
  const newWindow = new BrowserWindow({
    height: 1520,
    width: 1368,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  newWindow.loadFile('./tree.html');
  newWindow.show();
});
