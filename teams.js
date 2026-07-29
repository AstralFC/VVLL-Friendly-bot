// =====================================
// VVLL LEAGUE BOT
// TEAMS.JS
// =====================================

const database = require("./database");
const utils = require("./utils");





// Create team

function createTeam(roleId, managerId){



    let exists = database.db.teams.find(

        t => t.roleId === roleId

    );



    if(exists){


        return {

            success:false,

            message:"❌ This team already exists."

        };


    }




    let team = {


        id: utils.randomId(),


        roleId: roleId,


        name: null,


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








// Set team name from Discord role

function setTeamName(roleId, name){



    let team = database.db.teams.find(

        t => t.roleId === roleId

    );



    if(!team){

        return false;

    }



    team.name = name;


    database.save();



    return true;

}








// Get manager team

function getManagerTeam(managerId){



    return database.db.teams.find(

        t => t.manager === managerId

    );



}








// Get player team

function getPlayerTeam(playerId){



    return database.db.teams.find(

        t => t.players.includes(playerId)

    );



}








// Add player manually

function addPlayer(teamId, playerId){



    let team = database.db.teams.find(

        t => t.id === teamId

    );



    if(!team){

        return false;

    }




    if(team.players.length >= 15){

        return false;

    }




    if(!team.players.includes(playerId)){


        team.players.push(playerId);


    }




    database.save();



    return true;


}








// Remove player

function removePlayer(teamId, playerId){



    let team = database.db.teams.find(

        t => t.id === teamId

    );



    if(!team){

        return false;

    }



    team.players = team.players.filter(

        p => p !== playerId

    );



    database.save();



    return true;


}






module.exports = {


    createTeam,


    setTeamName,


    getManagerTeam,


    getPlayerTeam,


    addPlayer,


    removePlayer


};