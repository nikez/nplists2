document.addEventListener('DOMContentLoaded', function () {
    loadStyle();
    getPlayerData().then(x => updateContent(x)).catch(x => console.log(x));

    document.getElementById("lightlink").addEventListener('click', setLightMode, true);
    document.getElementById("darklink").addEventListener('click', setDarkMode, true);
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
    data.players = data.players.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
    data.players.forEach(function (player, i) {

        newRow = table.insertRow(table.rows.length);
        newCell = newRow.insertCell(0);
        newText = document.createTextNode(`${i+1}`)
        newCell.appendChild(newText);

        newCell = newRow.insertCell(1);
        newText = document.createTextNode(`${player.id}`)
        newCell.appendChild(newText);

        newCell = newRow.insertCell(2);
        a = document.createElement('a');
        a.setAttribute('href', `https://steamcommunity.com/profiles/${player.identifiers[2]}`);
        a.innerHTML = player.name;
        newCell.appendChild(a);

        newCell = newRow.insertCell(3);
        a = document.createElement('a');
        a.setAttribute('href', `http://www.nopixel.net/upload/index.php?members/${player.identifiers[4]}`);
        a.innerHTML = player.identifiers[0];
        newCell.appendChild(a);

        newCell = newRow.insertCell(4);
        newText = document.createTextNode(`${player.identifiers[1]}`)
        newCell.appendChild(newText);

        newCell = newRow.insertCell(5);
        newText = document.createTextNode(`${player.identifiers[2]}`)
        newCell.appendChild(newText);

        newCell = newRow.insertCell(6);
        newText = document.createTextNode(`${player.ping}`)
        newCell.appendChild(newText);
    });
}

function loadStyle() {

    style = localStorage.getItem('style');

    if (style === 'dark') {

        link = document.createElement("link");
        link.href = "https://unpkg.com/bulmaswatch/darkly/bulmaswatch.min.css";
        link.type = "text/css";
        link.id = "darkmode"
        link.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(link);
    }


    link = document.createElement("link");
    link.href = "site.css";
    link.type = "text/css";
    link.id = "sitestyle"
    link.rel = "stylesheet";

    document.getElementsByTagName("head")[0].appendChild(link);
}

function setDarkMode(e) {
    e.preventDefault();
    darkmode = document.getElementById('darkmode');
    if (darkmode) {
        return
    }
    localStorage.setItem('style', 'dark')
    loadStyle();
}


function setLightMode(e) {
    e.preventDefault();
    localStorage.removeItem('style')

    darkmode = document.getElementById('darkmode');

    if (darkmode) {
        darkmode.disabled = true;
        darkmode.parentNode.removeChild(darkmode);

        darkmode = document.getElementById('sitestyle');
        darkmode.disabled = true;
        darkmode.parentNode.removeChild(darkmode);
    }
    loadStyle();
}