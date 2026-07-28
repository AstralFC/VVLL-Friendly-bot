// ===============================
// VVLL LEAGUE BOT
// DATABASE.JS
// ===============================

const fs = require("fs");

const FILE = "./vvll-data.json";



// ===============================
// DEFAULT DATA
// ===============================

let db = {

    queue: [],


    teams: [],


    league: {

        teams: [],

        games: [],

        currentGame: 0

    },


    players: [],


    contracts: []

};




// ===============================
// LOAD DATA
// ===============================

if(fs.existsSync(FILE)){


    db =
    JSON.parse(
        fs.readFileSync(FILE)
    );


}




// ===============================
// SAVE DATA
// ===============================

function save(){


    fs.writeFileSync(

        FILE,

        JSON.stringify(
            db,
            null,
            4
        )

    );


}



// ===============================
// MATCHES
// ===============================

function addMatch(match){


    if(!db.matches){

        db.matches = [];

    }


    db.matches.push(match);


    save();

}




function getMatches(){


    return db.matches || [];


}



// ===============================
// PLAYER SYSTEM
// ===============================


function addPlayer(id,name){


    let player =
    db.players.find(
        p=>p.id===id
    );


    if(!player){


        db.players.push({

            id,

            name,

            goals:0,

            saves:0,

            blocks:0

        });


    }


    save();

}




function getPlayers(){


    return db.players;


}




// ===============================
// STANDINGS
// ===============================


function getStandings(){


let standings = [];


db.league.teams.forEach(team=>{


    standings.push({

        id:team.id,

        name:team.name,

        points:0,

        goals:0

    });


});



return standings;


}





// ===============================
// EXPORT
// ===============================

module.exports = {


db,

save,


queue:
db.queue,


addMatch,

getMatches,


addPlayer,

getPlayers,


getStandings


};