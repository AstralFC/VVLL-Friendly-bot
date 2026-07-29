// =====================================
// VVLL LEAGUE BOT
// LEAGUE.JS
// =====================================

const database = require("./database");
const utils = require("./utils");





// Create league

function createLeague(teamNames){



    database.db.settings.active = true;


    database.db.settings.league = "VVLL";


    database.db.matches = [];





    let shuffled = utils.shuffle(teamNames);





    database.db.teams = shuffled.map(

        (name,index)=>({


            id: utils.randomId(),


            name:name,


            manager:null,


            players:[],


            points:0,


            wins:0,


            draws:0,


            losses:0,


            goalsFor:0,


            goalsAgainst:0,


            played:0,


            seed:index+1


        })


    );





    generateSchedule();




    database.save();




    return database.db.teams;

}








// Create match schedule

function generateSchedule(){



    let teams = database.db.teams;



    let week = 1;




    for(let i = 0; i < teams.length; i++){



        for(let j = i + 1; j < teams.length; j++){



            database.db.matches.push({


                id: utils.randomId(),


                week:week,


                home:teams[i].name,


                away:teams[j].name,


                homeScore:null,


                awayScore:null,


                completed:false,


                time:null


            });



            week++;

            if(week > 99){

                week = 1;

            }


        }


    }



}








// Set game time

function setGameTime(gameId,time){



    let game = database.db.matches.find(

        g=>g.id === gameId

    );



    if(!game){

        return false;

    }




    game.time = time;



    database.save();



    return true;


}








// Get upcoming games

function getGames(){



    return database.db.matches;

}








// Reset league

function resetLeague(){



    database.reset();


    return true;


}







module.exports = {


    createLeague,


    generateSchedule,


    setGameTime,


    getGames,


    resetLeague


};