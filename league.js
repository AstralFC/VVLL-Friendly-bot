// =====================================
// VVLL LEAGUE BOT
// LEAGUE.JS
// =====================================

const database = require("./database");


// Create a new league
function createLeague(teamNames) {

    const teams = randomizeTeams(teamNames);


    database.db.settings = {
        league: "VVLL",
        active: true,
        week: 1
    };


    database.db.teams = teams.map((team, index) => ({
        id: index + 1,
        name: team,
        players: [],
        points: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0
    }));


    database.db.matches = generateSchedule(teams);


    database.save();


    return database.db;

}



// Randomize teams
function randomizeTeams(teams) {

    return [...teams].sort(
        () => Math.random() - 0.5
    );

}



// Generate matches
function generateSchedule(teams) {

    let matches = [];

    let id = 1;


    for(let i = 0; i < teams.length; i++) {

        for(let j = i + 1; j < teams.length; j++) {


            matches.push({

                id: id++,

                week: 1,

                home: teams[i],

                away: teams[j],

                homeScore: null,

                awayScore: null,

                timestamp: null,

                played: false

            });


        }

    }


    return matches;

}



// Add match time
function setMatchTime(matchId, timestamp) {

    let match = database.db.matches.find(
        m => m.id === matchId
    );


    if(!match) return false;


    match.timestamp = timestamp;


    database.save();


    return true;

}



// Finish a match
function finishMatch(matchId, homeScore, awayScore) {

    let match = database.db.matches.find(
        m => m.id === matchId
    );


    if(!match) return false;


    match.homeScore = homeScore;

    match.awayScore = awayScore;

    match.played = true;


    database.save();


    return match;

}



// Get league
function getLeague() {

    return database.db;

}



// Reset league
function resetLeague() {


    database.db.settings = {

        league:"VVLL",

        active:false

    };


    database.db.teams = [];

    database.db.matches = [];


    database.save();

}



// Next week
function nextWeek(){

    database.db.settings.week++;


    database.save();

}




module.exports = {

    createLeague,

    randomizeTeams,

    generateSchedule,

    setMatchTime,

    finishMatch,

    getLeague,

    resetLeague,

    nextWeek

};