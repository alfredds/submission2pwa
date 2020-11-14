const API_KEY = "ee781b505f3142379ecacc8e8931d0c5";
const base_URL = "https://api.football-data.org/v2/";

const LEAGUE_ID = 2021;

const ENDPOINT_COMPETITION = `${base_URL}competitions/${LEAGUE_ID}/teams`;
const ENDPOINT_STANDING = `${base_URL}competitions/${LEAGUE_ID}/standings`;


const fetchAPI = url => {
    return fetch(url, {
        headers: {
            'X-Auth-Token': API_KEY
        }
    })
        .then(response => {
            if (response.status !== 200){
                console.log(`Error: ${response.status}`);
                return Promise.reject(new Error(response.statusText))
            } else { 
                return Promise.resolve(response)
            }
        })
        .then(response => response.json())
        .catch(error => {
            console.log(error)
        })
};

function getAllTeams() {
    if ("caches" in window) {
        caches.match(ENDPOINT_COMPETITION).then(response => {
            if (response) {
                response.json().then(data => {
                    console.log(`Club Data : ${data}`)
                    showTeam(data);
                })
            }
        })
    }

    fetchAPI(ENDPOINT_COMPETITION)
    .then(data => {
        showTeam(data);
    })
    .catch(error => {
        console.log(error)
    })
}

//fungsi untuk melihat daftar team liga inggris
function showTeam(data) {
    let teams = "";
    let teamElement = document.getElementById("teamsPremier")
    
    data.teams.forEach(team => {
        teams += `
                <tr>
                    <td>
                    <a href="./squad.html?id=${team.id}">
                    <img class="responsive-img" src="${team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="40px" alt="badge"/>
                    </a></td>
                    <td>${team.name}</td>
                    <td>${team.address}</td>
                    <td class="center">${team.founded}</td>
                </tr>
        `;
    });

     teamElement.innerHTML = `
            <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">

                <table class="striped responsive-table">
                    <thead>
                        
                        <tr>
                            <th class="center">Logo Team</th>
                            <th class="center">Team Name</th>
                            <th class="center">Alamat</th>
                            <th class="center">Berdiri(tahun)</th>
                        </tr>
                     </thead>
                    <tbody id="teams">
                        ${teams}
                    </tbody>
                </table>
            </div>
    `;
}

//Fungsi untuk melihat squad team liga inggris
function getTeamById() {
        const urlParams = new URLSearchParams(window.location.search);
        let idParams = urlParams.get("id");

        if("caches" in window){
            return caches
            .match(`${base_URL}/teams/${idParams}`)
            .then(response => {
                console.log(response)
                if (response) {
                    console.log(response);
                    return response.json()
                    .then(squads => {
                        console.log('From cache')
                        console.log(squads);
                        showTeamById(squads);
                        return Promise.resolve(squads);
                })
                } else {
                    return fetchAPI(`${base_URL}/teams/${idParams}`)
                    .then(squad => {
                        console.log('From Fetch');
                        console.log(squad)
                        showTeamById(squad);
                        return Promise.resolve(squad);
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
        })
    }
}

function showTeamById(squads){
    console.log(squads['name'])
    console.log(squads['crestUrl'])
    let squad = '';
    let squadElement = document.getElementById("body-content");

    squads.squad.forEach(player =>{
        squad += ` 
                <tr class="centered">
                    <td>${player.id}</td>
                    <td>${player.name}</td>
                    <td>${player.position}</td>
                    <td>${player.nationality}</td>
                    <td>${player.role}</td>
                </tr>
        `;
    });

    squadElement.innerHTML = `
        <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">
            <div class="row">
            <div class="card-content small" style="text-align: center;">
            <img class="responsive-img" src="${squads.crestUrl.replace(/^http:\/\//i, 'https://')}" width="50px" alt="badge"/>   
            <h2 class="center responsive-text">${squads.name}</h2>
            </div>   
            <table class="striped responsive-table">
            <thead>
                    <tr id="squad">
                        <th class="centered">ID</th>
                        <th class="centered">Nama</th>
                        <th class="centered">Posisi</th>
                        <th class="centered">Kebangsaan</th>
                        <th class="centered">Jabatan</th>
                    </tr>
            </thead>
                <tbody id="squad">
                ${squad}
                </tbody>
            </table> 
        </div>       
    `;
} 


function getSaveTeam(){
    getAll().then(teams =>{
        const container = document.getElementById("body-content")
        teams.map(team => {
            const detailElement = `
                <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;>
                <div class="row">
                    <div class="card-content small" style="text-align: center;">
                    <a href="./squad.html?id=${team.id}">
                        <img class="responsive-image" src="${team.crestUrl.replace(/^http:\/\//i,'https://')}" width="50px" alt="badge/>
                    </a>
                    <h2 class="center responsive-text">${team.name}</h2>
                </div>
                <table class="striped centered responsive-table">
                    <thead>
                        <tr>
                            <th class="centered">ID</th>
                            <th class="centered">Nama</th>
                            <th class="centered">Posisi</th>
                            <th class="centered">Kebangsaan</th>
                            <th class="centered">Jabatan</th>
                        </tr>
                </thead>
                    <tbody id="squad">
                    ${team.squad.map(player=>(
                        `<tr class="centered">
                            <td><a href="./squad.html?id=${player.id}&saved=true">${player.id}</a><td>
                            <td>${player.name}</td>
                            <td>${player.position}</td>
                            <td>${player.nationality}</td>
                            <td>${player.role}</td>
                        </tr>`
                    )).join('')}
                    </tbody>
                </table>
            <div>
        </div>`;

            container.innerHTML += detailElement

        })
    });
} 

function getSavedTeamById(){
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");

    getTeamById(idParam).then(teams => {
        const container = document.getElementById("body-content")
        teams.map(team => {
            const detailElement = `
            <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;>
                <div class="row">
                    <div class="card-content small" style="text-align: center;">
                    <a href="./squad.html?id=${team.id}">
                        <img class="responsive-image" src="${team.crestUrl.replace(/^http:\/\//i,'https://')}" width="50px" alt="badge/>
                    </a>
                    <h2 class="center responsive-text">${team.name}</h2>
                /div>
            <table class="striped centered responsive-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama</th>
                        <th>Posisi</th>
                        <th>Kebangsaan</th>
                        <th>Jabatan</th>
                    </tr>
                </thead>
                <tbody id="squad">
                    ${team.squad.map(player=>(
                    `<tr class="centered">
                        <td><a href="./squad.html?id=${player.id}&saved=true">${player.id}</a><td>
                        <td>${player.name}</td>
                        <td>${player.position}</td>
                        <td>${player.nationality}</td>
                        <td>${player.role}</td>
                    </tr>`
                )).join('')}
            </tbody>
            </table>
        <div>
    </div>`;

        container.innerHTML += detailElement
       })
    });
}

function showNotifikasiSimpan() {
    const title = 'Notifikasi Save';
    const options = {
        'body': 'Squad team anda berhasil di simpan',
        'icon': '/icons/pwa-512.png'
    };
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification(title, options);
        });
    } else {
        console.error('Fitur notifikasi tidak diijinkan.');
    }
}

function showNotifikasiDelete() {
    const title = 'Notifikasi Delete';
    const options = {
        'body': 'Squad team anda berhasil di hapus',
        'icon': '/icons/pwa-512.png'
    };
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification(title, options);
        });
    } else {
        console.error('Fitur notifikasi tidak diijinkan.');
    }
}

//Fungsi untuk melihat papan klasemen liga inggris
function getAllStandings(){
    if("caches" in window) {
        caches.match(ENDPOINT_STANDING).then(response => {
            if(response){
                response.json().then(stand => {
                    console.log(`Standing Data: ${stand}`);
                    showStanding(stand);
                })
            }
        })
    }

    fetchAPI(ENDPOINT_STANDING)
        .then(stand => {
            showStanding(stand);
        })
        .catch(error => {
            console.log(error)
        })
}

function showStanding(stand) {
    let standings = "";
    let standingElement = document.getElementById("standings")

    stand.standings[0].table.forEach(standing => {
        standings += `
                <tr>
                    <td><img src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="40px" alt="badge"/></td>
                    <td class="centered">${standing.team.name}</td>
                    <td class="centered">${standing.won}</td>
                    <td class="centered">${standing.draw}</td>
                    <td class="centered">${standing.lost}</td>
                    <td class="centered">${standing.goalsFor}</td>
                    <td class="centered">${standing.goalsAgainst}<td>
                    <td class="centered">${standing.goalDifference}</td>
                    <td class="centered">${standing.points}</td>
                </tr>
        `;
    });

    standingElement.innerHTML = `
            <div class="card" style="padding-left: 24px; padding-right:24px; margin-top: 30px;">
        <table class="striped responsive-table">
            <thead>
                <tr>
                    <th></th>
                    <th class="centered">Team Name</th>
                    <th class="centered">W</th>
                    <th class="centered">D</th>
                    <th class="centered">L</th>
                    <th class="centered">GF</th>
                    <th class="centered">GA</th>
                    <th class="centered">GD</th>
                    <th class="centered">Point</th>
                </tr>
            </thead>
            <tbody id="standings">
                ${standings}
            </tbody>
        </table>
        </div>
    `;
}