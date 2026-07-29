// =====================================
// VVLL LEAGUE BOT
// STANDINGS.JS
// =====================================

const database = require("./database");


// Get league standings
function getStandings() {

    if (!database.db.teams) {
        return [];
    }


    return [...database.db.teams].sort((a, b) => {


        // Points first
        if ((b.points || 0) !== (a.points || 0)) {

            return (b.points || 0) - (a.points || 0);

        }


        // Goal difference second
        const goalDiffA =
        (a.goalsFor || 0) -
        (a.goalsAgainst || 0);


        const goalDiffB =
        (b.goalsFor || 0) -
        (b.goalsAgainst || 0);


        return goalDiffB - goalDiffA;


    });

}




// Update standings after a finished game
function updateStandings(
    homeTeam,
    awayTeam,
    homeScore,
    awayScore
) {


    const home =
    database.db.teams.find(
        t => t.name === homeTeam
    );


    const away =
    database.db.teams.find(
        t => t.name === awayTeam
    );


    if (!home || !away) {

        return false;

    }



    home.played =
    (home.played || 0) + 1;


    away.played =
    (away.played || 0) + 1;



    home.goalsFor =
    (home.goalsFor || 0) + homeScore;


    home.goalsAgainst =
    (home.goalsAgainst || 0) + awayScore;



    away.goalsFor =
    (away.goalsFor || 0) + awayScore;


    away.goalsAgainst =
    (away.goalsAgainst || 0) + homeScore;




    if (homeScore > awayScore) {


        home.wins =
        (home.wins || 0) + 1;


        away.losses =
        (away.losses || 0) + 1;


        home.points =
        (home.points || 0) + 3;


    }


    else if (awayScore > homeScore) {


        away.wins =
        (away.wins || 0) + 1;


        home.losses =
        (home.losses || 0) + 1;


        away.points =
        (away.points || 0) + 3;


    }


    else {


        home.draws =
        (home.draws || 0) + 1;


        away.draws =
        (away.draws || 0) + 1;


        home.points =
        (home.points || 0) + 1;


        away.points =
        (away.points || 0) + 1;


    }



    database.save();


    return true;

}





// Reset league stats
function resetStandings() {


    database.db.teams.forEach(team => {


        team.played = 0;

        team.wins = 0;

        team.draws = 0;

        team.losses = 0;

        team.points = 0;

        team.goalsFor = 0;

        team.goalsAgainst = 0;


    });



    database.save();


    return true;

}





// Create playoff bracket
function createBracket() {


    const teams =
    getStandings();



    return {

        quarterFinals:
        teams.slice(0,8),

        semiFinals: [],

        final: []

    };


}





module.exports = {

    getStandings,

    updateStandings,

    resetStandings,

    createBracket

};