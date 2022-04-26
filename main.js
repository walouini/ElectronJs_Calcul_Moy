const { app, BrowserWindow, ipcMain } = require('electron')

let notes = [
    { id: 1, label: 'mathématique', coefficient: 3, note: 14 },
    { id: 2, label: 'physique', coefficient: 3, note: 16 },
    { id: 3, label: 'philosophie', coefficient: 1, note: 11 },
    { id: 1, label: 'informatique', coefficient: 3, note: 18 }
]

//
let mainWindow = null
//
let targetAddItemid

function generateMoyenne(recipes) {

    let note = 0
    let coeff = 0

    recipes.forEach((rowData) => {
        note += rowData.note * rowData.coefficient
        coeff += rowData.coefficient
    })

    return note / coeff
}

// function create Window
function createWindow(pathFile, widthWin = 1200, heightWin = 800) {
    let win = new BrowserWindow({
        width: widthWin,
        height: heightWin,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadFile(pathFile);
    return win;
}

app.whenReady().then(() => {
    mainWindow = createWindow('views/home/home.html');

    mainWindow.webContents.once('did-finish-load', () => {
        mainWindow.send('store-data', {
            noteData: notes,
            moyenneGeneral: generateMoyenne(notes)
        })
    })
})

ipcMain.on('open-new-item-window', (evt, data) => {
    // creer une nouvelle fenetre
    const win = createWindow('views/addNote/addNote.html', 600, 500);

    targetAddItemid = data;

    win.on('closed', () => {
        targetAddItemid = null
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})