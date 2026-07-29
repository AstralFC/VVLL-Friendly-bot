// =====================================
// VVLL LEAGUE BOT
// UTILS.JS
// =====================================


// Create a Discord timestamp

function createTimestamp(date){


    return `<t:${Math.floor(
        new Date(date).getTime() / 1000
    )}:F>`;

}





// Find item by ID

function findById(array, id){


    return array.find(

        item => item.id == id

    );

}





// Create a random ID

function randomId(){


    return Math.floor(

        Math.random() * 999999999

    );


}





// Shuffle array

function shuffle(array){


    return [...array].sort(

        () => Math.random() - 0.5

    );


}





// Format standings

function formatStandings(teams){


    return teams.map(

        (team,index)=>

        `${index + 1}. ${team.name}
🏆 ${team.points || 0} pts
⚽ ${team.goalsFor || 0}-${team.goalsAgainst || 0}`

    ).join("\n\n");


}





module.exports = {

    createTimestamp,

    findById,

    randomId,

    shuffle,

    formatStandings

};