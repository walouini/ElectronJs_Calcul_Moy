const { app, BrowserWindow, ipcMain } = require('electron')

let notes = [
    { id: 1, label: 'mathématique', coefficient: 3, note: 14 },
    { id: 2, label: 'physique', coefficient: 3, note: 16 },
    { id: 3, label: 'philosophie', coefficient: 1, note: 11 },
    { id: 4, label: 'informatique', coefficient: 3, note: 18 }
]

//
let mainWindow = null
//
let targetAddItemid

function generateMoyenne(tabNotes) {

    let note = 0
    let coeff = 0

    tabNotes.forEach((rowData) => {
        note += rowData.note * rowData.coefficient
        coeff += parseInt(rowData.coefficient)
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

/**
 * 
 * Ajout d'une note
 */
ipcMain.on('open-new-note-window', (evt, data) => {
    // creer une nouvelle fenetre
    const win = createWindow('views/addNote/addNote.html', 600, 500);
})

ipcMain.on('add-new-note', (evt, newNote) => {
    
    // Définir l'id du nouvel élément
    let newId = 1;

    // Vérifier la longueur du tableau et redéfinir l'id
    if(notes.length > 0) {
        
        newId = notes[notes.length - 1].id + 1; 
    }
    
    newNote.id = newId;

    notes.push(newNote);
    mainWindow.webContents.send('update-with-new-note', {
        
        newNote : [newNote],
        moyenneGeneral: generateMoyenne(notes),
    })
})

/**
 * 
 * Suppression d'une note
 */
ipcMain.on('delete-note', (evt, data) => {
    
    let arrayForDelete = notes;
    
    for (let i = 0; i < arrayForDelete.length; i++) {
        
        if(arrayForDelete[i].id === data.id) {
            arrayForDelete.splice(i,1);
            break;
        }
    }
        
    data.moyenneGeneral = generateMoyenne(notes);
    
    // retourner la confirmation que notre item a été correctement supprimé du serveur
    evt.sender.send('update-delete-note', data);
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})