// =====================================
// VVLL LEAGUE BOT
// DATABASE.JS
// =====================================

const fs = require("fs");

const file = "./vvll-data.json";





let db = {


    settings:{


        active:false,


        league:"VVLL"


    },



    teams:[],


    players:[],


    matches:[]


};







// Load database

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







// Save database

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







// Reset database

function reset(){



    db = {


        settings:{


            active:false,


            league:"VVLL"


        },


        teams:[],


        players:[],


        matches:[]


    };



    save();


}






load();






module.exports = {


    db,


    save,


    reset,


    load


};