const electron = require("electron");
const { ipcRenderer } = electron;

function generateTableRow(tableId, tableData) {
    const tbodyElem = $(tableId);

    tableData.forEach((rowData) => {

        // Créer une ligne
        const tr = $('<tr id="row' + rowData.id + '" class="table-light">')
        tr.append(' <th class="row">' + rowData.id + '</th>')
        tr.append(' <td>' + rowData.label + '</td>')
        tr.append(' <td>' + rowData.coefficient + '</td>')
        tr.append(' <td>' + rowData.note + '</td>')
        tr.append(' <td>' +
            '<button id="delete' + rowData.id + '" class="btn btn-outline-danger ms-2">supprimer</button>' +
            '</td>'
        )

        // ajoute les lignes au tabnleau
        tbodyElem.append(tr)

        const deleteBtn = $('#delete' + rowData.id);

        deleteBtn.on('click', function (e) {

            e.preventDefault();

            ipcRenderer.send('delete-note', { id: rowData.id })

        })

        //
        const modifyBtn = $('#modify' + rowData.id);

        modifyBtn.on('click', function (e) {
            e.preventDefault();

            ipcRenderer.send('open-modify-window', {
                id: owData.id
            })

        })


    });

}

function updateMoyenne(newBalance) {
    // on recupére l'element
    const balanceElement = $('#laMoyenne');

    // supprimer l'ancienne class
    balanceElement.removeClass('bg-success bg-danger');
    balanceElement.text(newBalance);

    if (newBalance > 10) {
        balanceElement.addClass('bg-success');
    }
    else if (newBalance < 10) {
        balanceElement.addClass('bg-danger');
    }
}

ipcRenderer.on('store-data', (evt, data) => {

    generateTableRow('#notesTbody', data.noteData);
    updateMoyenne(data.moyenneGeneral)
})

/**
 * 
 * Ajout d'une note
 */

//Add event Listener on click for add new item
const openWindowAddNote = (evt) => {
    ipcRenderer.send('open-new-note-window', evt.target.id)
}

$('#addNote').on('click', openWindowAddNote)


ipcRenderer.on('update-with-new-note', (evt, data) => {

    generateTableRow('#notesTbody', data.newNote);
    updateMoyenne(data.moyenneGeneral);
})

/**
 * 
 * Suppresion d'une note
 */
ipcRenderer.on('update-delete-note', (evt, data) => {

    $('#row' + data.id).remove()
    updateMoyenne(data.moyenneGeneral);
})
