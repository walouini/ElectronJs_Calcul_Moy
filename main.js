const { app, BrowserWindow, ipcMain } = require('electron')

function generateMoyenne(recipes) {

    let note = 0
    let coeff = 0

    recipes.forEach((rowData) => {
        note += rowData.note * rowData.coefficient
        coeff += rowData.coefficient
    })

    return note/coeff
}

let notes = [
    { id: 1, label: 'mathématique', coefficient: 3, note: 14 },
    { id: 2, label: 'physique', coefficient: 3, note: 16 },
    { id: 3, label: 'philosophie', coefficient: 1, note: 11 },
    { id: 1, label: 'informatique', coefficient: 3, note: 18 }
]

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences : {
        nodeIntegration : true
      }
    })
  
    win.loadFile('views/home/home.html')

    win.webContents.once('did-finish-load', () => {
        win.send('store-data',{
            noteData : notes,
            moyenneGeneral : generateMoyenne(notes)
        })
    })
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})