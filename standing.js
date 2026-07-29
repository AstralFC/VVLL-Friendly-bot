// =====================================
// VVLL LEAGUE BOT
// STANDINGS.JS
// =====================================

const database = require("./database");


// Update standings after a game

function updateStandings(home, away, homeScore, awayScore) {


    let homeTeam = database.db.teams.find(
        t => t.name === home
    );


    let awayTeam = database.db.teams.find(
        t => t.name === away
    );


    if(!homeTeam || !awayTeam) return false;



    homeTeam.played = (homeTeam.played || 0) + 1;
    awayTeam.played = (awayTeam.played || 0) + 1;


    homeTeam.goalsFor =
    (homeTeam.goalsFor || 0) + homeScore;


    homeTeam.goalsAgainst =
    (homeTeam.goalsAgainst || 0) + awayScore;


    awayTeam.goalsFor =
    (awayTeam.goalsFor || 0) + awayScore;


    awayTeam.goalsAgainst =
    (awayTeam.goalsAgainst || 0) + homeScore;



    if(homeScore > awayScore){


        homeTeam.wins =
        (homeTeam.wins || 0) + 1;


        awayTeam.losses =
        (awayTeam.losses || 0) + 1;


        homeTeam.points =
        (homeTeam.points || 0) + 3;


    }



    else if(homeScore < awayScore){


        awayTeam.wins =
        (awayTeam.wins || 0) + 1;


        homeTeam.losses =
        (homeTeam.losses || 0) + 1;


        awayTeam.points =
        (awayTeam.points || 0) + 3;


    }



    else{


        homeTeam.draws =
        (homeTeam.draws || 0) + 1;


        awayTeam.draws =
        (awayTeam.draws || 0) + 1;


        homeTeam.points =
        (homeTeam.points || 0) + 1;


        awayTeam.points =
        (awayTeam.points || 0) + 1;


    }



    database.save();


    return true;

}





// Get sorted standings

function getStandings(){


    return database.db.teams.sort(

        (a,b)=>{


            if((b.points||0)!==(a.points||0))

                return (b.points||0)-(a.points||0);



            let bGD =
            (b.goalsFor||0)-(b.goalsAgainst||0);


            let aGD =
            (a.goalsFor||0)-(a.goalsAgainst||0);


            return bGD-aGD;


        }

    );


}





// Reset league standings

function resetStandings(){


    database.db.teams.forEach(team=>{


        team.played = 0;

        team.wins = 0;

        team.draws = 0;

        team.losses = 0;

        team.points = 0;

        team.goalsFor = 0;

        team.goalsAgainst = 0;


    });


    database.save();


}





module.exports = {


    updateStandings,

    getStandings,

    resetStandings


};