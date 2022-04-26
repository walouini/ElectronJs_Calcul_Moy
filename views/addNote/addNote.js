const electron = require("electron");
const { ipcRenderer} = electron;


$('#addNote').on('submit', function(e){
    e.preventDefault();

    const newItem = $('#addNote').serializeArray().reduce(function(obj, item){
        obj[item.name] = item.value;
        return obj;
    }, {});

    ipcRenderer.send('add-new-item', newItem);

    this.reset();
    $('#addNote')[0].reset()

});
