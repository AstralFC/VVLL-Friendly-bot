// =====================================
// VVLL DATABASE SYSTEM
// =====================================

const fs = require("fs");

const FILE = "./vvll-data.json";


let db = {

    teams: [],

    players: [],

    contracts: [],

    matches: []

};




// Load database

function load(){

    if(fs.existsSync(FILE)){

        db = JSON.parse(
            fs.readFileSync(FILE)
        );

    }

}



// Save database

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



load();



module.exports = {

    db,

    save

};