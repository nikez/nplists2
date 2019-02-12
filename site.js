document.addEventListener('DOMContentLoaded', function () {
    getPlayerData().then(x => updateContent(x)).catch(x => console.log(x));
}, false);


async function getPlayerData() {
    let request = await fetch('/api/list');
    if (request.status == 200) {
        let data = await request.json();
        return data;
    }
    throw new Error(request.status);
}

function updateContent(x) {
    setTitle(x);
    createPlayersTable(x);
}

function setTitle(data) {
    title = document.getElementById("title");
    table = document.getElementById('playerlist').getElementsByTagName('tbody')[0];

    title.innerText = `[NoPixel] Current Players: ${data.currentPlayers} / 32 | Queue: ${data.currentQueue}`;
}

function createPlayersTable(data) {
    data.players = data.players.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)); 
    data.players.forEach(function (player, i) {

        newRow   = table.insertRow(table.rows.length);
        newCell  = newRow.insertCell(0);          
        newText  = document.createTextNode(`${i+1}`)
        newCell.appendChild(newText);
        
        newCell  = newRow.insertCell(1);          
        newText  = document.createTextNode(`${player.id}`)
        newCell.appendChild(newText);

        newCell  = newRow.insertCell(2);          
        newText  = document.createTextNode(`${player.name}`)
        newCell.appendChild(newText);


        newCell  = newRow.insertCell(3);          
        newText  = document.createTextNode(`${player.identifiers[1]}`)
        newCell.appendChild(newText);


        newCell  = newRow.insertCell(4);          
        newText  = document.createTextNode(`${player.identifiers[0]}`)
        newCell.appendChild(newText);

        newCell  = newRow.insertCell(5);          
        newText  = document.createTextNode(`${player.ping}`)
        newCell.appendChild(newText);
    });
}