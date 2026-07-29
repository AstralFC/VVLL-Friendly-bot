// =====================================
// VVLL LEAGUE BOT
// TEAMS.JS
// =====================================

const database = require("./database");

const MAX_PLAYERS = 15;


// Create team
function createTeam(roleId, managerId) {

    let exists = database.db.teams.find(
        t => t.role === roleId
    );


    if (exists) {
        return {
            success:false,
            message:"Team already exists."
        };
    }


    let team = {

        role: roleId,

        manager: managerId,

        players: [],

        points:0,

        wins:0,

        draws:0,

        losses:0,

        goalsFor:0,

        goalsAgainst:0

    };


    database.db.teams.push(team);

    database.save();


    return {
        success:true,
        team
    };

}



// Get team by manager
function getManagerTeam(managerId){

    return database.db.teams.find(

        t => t.manager === managerId

    );

}



// Add player to team
function addPlayer(team, playerId){


    if(team.players.length >= MAX_PLAYERS){

        return {

            success:false,

            message:
            `❌ Team already has ${MAX_PLAYERS} players.`

        };

    }



    if(team.players.includes(playerId)){

        return {

            success:false,

            message:
            "❌ Player is already on this team."

        };

    }



    team.players.push(playerId);


    database.save();


    return {

        success:true,

        message:
        "✅ Player added."

    };

}



// Remove player
function removePlayer(team, playerId){


    team.players = team.players.filter(

        id => id !== playerId

    );


    database.save();


    return true;

}



// Find player's team
function getPlayerTeam(playerId){


    return database.db.teams.find(

        team =>

        team.players.includes(playerId)

    );

}



// Get roster
function getRoster(team){


    return team.players || [];

}



// Check if user is manager
function isManager(userId){


    return database.db.teams.some(

        team =>

        team.manager === userId

    );

}




module.exports = {

    createTeam,

    getManagerTeam,

    addPlayer,

    removePlayer,

    getPlayerTeam,

    getRoster,

    isManager,

    MAX_PLAYERS

};