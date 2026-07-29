// =======================================
// VVLL BOT
// database.js
// =======================================

const fs = require("fs");

const file = "./vvll-data.json";


let data = {

    league: {
        active:false,
        name:"VVLL"
    },


    teams: [],


    players: [],


    games: [],


    stats: []

};



// Load database

function load(){

    if(fs.existsSync(file)){

        try {

            data = JSON.parse(
                fs.readFileSync(file,"utf8")
            );

            console.log("✅ Database loaded");

        } catch {

            console.log("⚠️ Database reset");

            save();

        }

    } else {

        save();

    }

}



// Save database

function save(){

    fs.writeFileSync(

        file,

        JSON.stringify(
            data,
            null,
            4
        )

    );

}



// Reset league

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

    get data(){

        return data;

    },

    load,

    save,

    reset

};