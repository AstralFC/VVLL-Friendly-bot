// =====================================
// VVLL LEAGUE BOT
// RESULTS.JS
// =====================================

const database = require("./database");


// Create a game

function createGame(homeTeam, awayTeam, time = null) {


    const game = {

        id: Date.now(),

        home: homeTeam,

        away: awayTeam,

        time: time,

        homeScore: 0,

        awayScore: 0,

        played:false,

        playerStats:[]

    };


    database.db.matches.push(game);

    database.save();


    return game;

}





// Add game result

function addResult(gameId, homeScore, awayScore){


    let game = database.db.matches.find(

        g => g.id == gameId

    );



    if(!game){

        return false;

    }



    game.homeScore = homeScore;

    game.awayScore = awayScore;

    game.played = true;



    database.save();



    return game;

}





// Add player stats from a game

function addPlayerStats(
    gameId,
    playerId,
    goals = 0,
    assists = 0,
    saves = 0,
    blocks = 0
){



    let game = database.db.matches.find(

        g => g.id == gameId

    );



    if(!game){

        return false;

    }



    game.playerStats.push({

        player: playerId,

        goals,

        assists,

        saves,

        blocks

    });



    let player = database.db.players.find(

        p => p.id === playerId

    );



    if(!player){


        player = {

            id:playerId,

            goals:0,

            assists:0,

            saves:0,

            blocks:0,

            games:0

        };


        database.db.players.push(player);


    }



    player.goals += goals;

    player.assists += assists;

    player.saves += saves;

    player.blocks += blocks;

    player.games += 1;



    database.save();



    return true;


}





// Get games

function getGames(){


    return database.db.matches;


}



// Get one game

function getGame(id){


    return database.db.matches.find(

        g => g.id == id

    );

}





module.exports = {

    createGame,

    addResult,

    addPlayerStats,

    getGames,

    getGame

};