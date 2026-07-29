// =======================================
// VVLL BOT
// database.js
// =======================================

const fs = require("fs");

const file = "./vvll-data.json";


let data = {

    league: {
        active: false,
        name: "VVLL"
    },

    teams: [],

    players: [],

    games: [],

    stats: []

};



// Load saved data

function load(){

    if(fs.existsSync(file)){

        data = JSON.parse(
            fs.readFileSync(file, "utf8")
        );

    }

}



// Save data

function save(){

    fs.writeFileSync(
        file,
        JSON.stringify(data, null, 2)
    );

}



// Reset everything

function reset(){

    data = {

        league:{
            active:false,
            name:"VVLL"
        },

        teams:[],

        players:[],

        games:[],

        stats:[]

    };


    save();

}



module.exports = {

    data,

    load,

    save,

    reset

};