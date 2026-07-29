// =====================================
// VVLL LEAGUE BOT
// DATABASE.JS
// =====================================

const fs = require("fs");

const file = "./vvll-data.json";



let db = {


    league: [],


    players: [],


    games: [],


    settings: {

        name:"VVLL",

        active:false,

        maxPlayers:15

    }


};







function load(){


    if(fs.existsSync(file)){


        db = JSON.parse(

            fs.readFileSync(

                file,

                "utf8"

            )

        );


    }


}







function save(){


    fs.writeFileSync(

        file,

        JSON.stringify(

            db,

            null,

            2

        )

    );


}







function reset(){


    db = {


        league:[],


        players:[],


        games:[],


        settings:{

            name:"VVLL",

            active:false,

            maxPlayers:15

        }


    };


    save();


}






load();






module.exports = {


    ...db,


    db,


    save,


    reset


};