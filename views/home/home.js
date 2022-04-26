const electron = require("electron");
const { ipcRenderer} = electron;

function generateTableRow (tableId,tableData) {
    const tbodyElem = $(tableId);

    tableData.forEach((rowData) => {
        
        // Créer une ligne
        const tr = $('<tr class="table-light">')
        tr.append(' <th class="row">' + rowData.id +'</th>')
        tr.append(' <td>' + rowData.label +'</td>')
        tr.append(' <td>' + rowData.coefficient +'</td>')
        tr.append(' <td>' + rowData.note +'</td>')
        tr.append(' <td>' + 
            '<button class="btn btn-outline-warning">modifier</button>' +
            '<button class="btn btn-outline-danger ms-2">supprimer</button>' +
            '</td>'
        )

        // ajoute les lignes au tabnleau
        tbodyElem.append(tr)

    });

}

function updateMoyenne(newBalance) {
    // on recupére l'element
    const balanceElement = $('#laMoyenne');

    // supprimer l'ancienne class
    balanceElement.removeClass('bg-success bg-danger');
    balanceElement.text(newBalance);

    if(newBalance > 10) {
        balanceElement.addClass('bg-success');
    }
    else if ( newBalance < 10) {
        balanceElement.addClass('bg-danger');
    }
}

ipcRenderer.on('store-data',(evt,data) => {
    generateTableRow('#notesTbody',data.noteData);
    updateMoyenne(data.moyenneGeneral)
})