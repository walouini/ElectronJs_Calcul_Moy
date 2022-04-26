const { ipcRenderer } = require('electron')

// ajouter un eventListner
$('#btn').on('click', () => {

})


// je récupére mon nouveau titre
ipcRenderer.on('giveNewTitle', (evt, data) => {
    
})
