document.addEventListener('DOMContentLoaded', function () {
    getData();
}, false);

function getData() {
    fetch("https://nplist.now.sh/api/list").then(r => r.json())
        .then(data => {
            title = document.getElementById("title");
            table = document.getElementById('playerlist').getElementsByTagName('tbody')[0];

            title.innerText = `[NoPixel] Current Players: ${data.CurrentPlayers} / 32 | Queue: ${data.CurrentQueue}`;

            data.Players = data.Players.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)); 
            data.Players.forEach(function (player, i) {

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
                newText  = document.createTextNode(`${steamID(player.identifiers[0])}`)
                newCell.appendChild(newText);


                newCell  = newRow.insertCell(4);          
                newText  = document.createTextNode(`${steamHexTo64(player.identifiers[0])}`)
                newCell.appendChild(newText);

                newCell  = newRow.insertCell(5);          
                newText  = document.createTextNode(`${player.ping}`)
                newCell.appendChild(newText);
            });

        })
        .catch(e => console.log(e))
}

function steamHexTo64(steamId) {
    steamId = steamId.replace('steam:','0x');
    return BigInt(steamId);
}

function steam64ToLegacy(steamId) {
    auth = (BigInt(steamId) % BigInt(2))
    steamId = (BigInt(steamId) - BigInt('76561197960265728')) / BigInt(2)
    return `STEAM_0:${auth}:${steamId}`
}

function steamID(steamId) {
    steamId = steamHexTo64(steamId)
    return steam64ToLegacy(steamId)
}
