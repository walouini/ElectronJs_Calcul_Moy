const { app, BrowserWindow, ipcMain } = require('electron')
const Store = require('electron-store');
const store = new Store();

/* let notes = [
    { id: 1, label: 'mathématique', coefficient: 3, note: 14 },
    { id: 2, label: 'physique', coefficient: 3, note: 16 },
    { id: 3, label: 'philosophie', coefficient: 1, note: 11 },
    { id: 4, label: 'informatique', coefficient: 3, note: 18 }
] */

let notes = store.has('notes') ? store.get('notes') : [];

// fenetre general
let mainWindow = null

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
function createWindow(pathFile, widthWin = 1000, heightWin = 750) {
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
    
    let arrayForDelete = notes;

    // Définir l'id du nouvel élément
    let newId = 1;
    // Vérifier la longueur du tableau et redéfinir l'id
    if(arrayForDelete.length > 0) {
        
        newId = arrayForDelete[arrayForDelete.length - 1].id + 1; 
    }
    
    newNote.id = newId;

    arrayForDelete.push(newNote);

    store.set('notes', notes)

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

    store.set('notes', notes)

    data.moyenneGeneral = generateMoyenne(notes);
    
    // retourner la confirmation que notre item a été correctement supprimé du serveur
    evt.sender.send('update-delete-note', data);
})

//Modify
ipcMain.on('open-modify-window', (evt, data) => {
    // creer une nouvelle fenetre
    const win = createWindow('views/addNote/addNote.html', 600, 500);
})


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})