// =====================================
// VVLL LEAGUE BOT
// DATABASE.JS
// =====================================

const fs = require("fs");

const FILE = "./vvll-data.json";


// Default database

let db = {

    settings: {

        league: "VVLL",

        active: false,

        week: 1

    },


    teams: [],


    matches: [],


    players: []

};




// Load database

function load(){

    if(fs.existsSync(FILE)){


        const data = fs.readFileSync(
            FILE,
            "utf8"
        );


        db = JSON.parse(data);


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




// Reset everything

function reset(){


    db = {

        settings: {

            league:"VVLL",

            active:false,

            week:1

        },


        teams:[],


        matches:[],


        players:[]

    };


    save();

}





load();





module.exports = {

    db,

    save,

    load,

    reset

};