// =====================================
// VVLL LEAGUE BOT
// RESULTS.JS
// =====================================

const database = require("./database");
const standings = require("./standings");





// Create game

function createGame(home, away){


    let game = {


        id: Date.now(),


        home,


        away,


        homeScore:0,


        awayScore:0,


        completed:false,


        players:[]


    };



    database.db.matches.push(game);


    database.save();



    return game;


}








// Get games

function getGames(){


    return database.db.matches;


}








// Finish game

function finishGame(

    gameId,

    homeScore,

    awayScore

){



    let game = database.db.matches.find(

        g => g.id == gameId

    );



    if(!game){

        return false;

    }




    game.homeScore = homeScore;


    game.awayScore = awayScore;


    game.completed = true;






    standings.updateStandings(

        game.home,

        game.away,

        homeScore,

        awayScore

    );






    database.save();



    return true;


}








// Add player stats

function addPlayerStats(

    playerId,

    stats

){



    let player =

    database.db.players.find(

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






    player.goals += stats.goals || 0;


    player.assists += stats.assists || 0;


    player.saves += stats.saves || 0;


    player.blocks += stats.blocks || 0;


    player.games += 1;






    database.save();




    return true;


}








// Get one game

function getGame(id){



    return database.db.matches.find(

        g => g.id == id

    );



}







module.exports = {


    createGame,


    getGames,


    getGame,


    finishGame,


    addPlayerStats


};