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

        games: []

    },


    players: [],


    contracts: [],


    matches: []

};



// ===============================
// LOAD DATA
// ===============================

if(fs.existsSync(FILE)){

    db = JSON.parse(
        fs.readFileSync(FILE)
    );

}



// ===============================
// SAVE
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
// MATCH SYSTEM
// ===============================

function addMatch(match){

    db.matches.push(match);

    save();

}



function getMatches(){

    return db.matches;

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

id:id,

name:name,

goals:0,

saves:0,

blocks:0

});


}


save();


}



function updateStats(id,type){


let player =
db.players.find(
p=>p.id===id
);



if(!player){

return;

}



if(type==="goal"){

player.goals++;

}


if(type==="save"){

player.saves++;

}


if(type==="block"){

player.blocks++;

}



save();


}




function getPlayers(){

return db.players;

}



// ===============================
// QUEUE TIMER CLEANER
// ===============================

function cleanQueue(){


let now = Date.now();


db.queue =
db.queue.filter(player=>{


return now - player.time < 3600000;


});


save();


}




setInterval(cleanQueue,60000);




// ===============================
// EXPORT
// ===============================

module.exports={


db,

save,


addMatch,

getMatches,


addPlayer,

updateStats,

getPlayers


};