// ====================
// VVLL COMMANDS 1/2
// PASTE EVERYTHING BELOW
// ====================

const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");


const dbFile = "./database.json";


function loadDB(){

    if(!fs.existsSync(dbFile)){

        fs.writeFileSync(
            dbFile,
            JSON.stringify({
                teams:{},
                players:{},
                games:{}
            },null,4)
        );

    }


    let db = JSON.parse(
        fs.readFileSync(dbFile)
    );


    // DATABASE UPGRADER
    if(!db.teams) db.teams={};
    if(!db.players) db.players={};
    if(!db.games) db.games={};


    return db;

}



function saveDB(db){

    fs.writeFileSync(
        dbFile,
        JSON.stringify(db,null,4)
    );

}



function isOwner(id){

    return (
        id === process.env.OWNER_ID ||
        id === process.env.CO_OWNER_ID
    );

}



module.exports = [



// ====================
// CREATE TEAM
// ====================


{

data:

new SlashCommandBuilder()

.setName("create-team")

.setDescription("Create a VVLL team")

.addRoleOption(option =>

option

.setName("team_role")

.setDescription("Team role")

.setRequired(true)

)

.addUserOption(option =>

option

.setName("manager")

.setDescription("Team manager")

.setRequired(true)

),



async execute(interaction){



if(!isOwner(interaction.user.id)){


return interaction.reply({

content:"❌ Owner only.",

ephemeral:true

});


}



let role =
interaction.options.getRole("team_role");



let manager =
interaction.options.getUser("manager");



let db = loadDB();



if(db.teams[role.id]){


return interaction.reply({

content:"❌ Team already exists.",

ephemeral:true

});


}



db.teams[role.id]={


name:role.name,

roleId:role.id,

managerId:manager.id,

guildId:interaction.guild.id,

players:[]


};



saveDB(db);



interaction.reply({


embeds:[

new EmbedBuilder()

.setColor("#ff4f8b")

.setTitle("🏆 VVLL Team Created")

.setDescription(

`🏟️ Team: **${role.name}**\n`+

`👔 Manager: ${manager}`

)

.setFooter({

text:"VVLL Bot | VVLL | NA | S1"

})

]


});


}


},





// ====================
// DELETE TEAM
// ====================


{

data:

new SlashCommandBuilder()

.setName("delete-team")

.setDescription("Delete a VVLL team")

.addRoleOption(option =>

option

.setName("team")

.setDescription("Team role")

.setRequired(true)

),



async execute(interaction){



if(!isOwner(interaction.user.id)){


return interaction.reply({

content:"❌ Owner only.",

ephemeral:true

});


}



let role =
interaction.options.getRole("team");



let db = loadDB();



if(!db.teams[role.id]){


return interaction.reply({

content:"❌ Team not found.",

ephemeral:true

});


}



delete db.teams[role.id];



for(let id in db.players){


if(db.players[id].roleId === role.id){

delete db.players[id];

}


}



saveDB(db);



interaction.reply(

`🗑️ Deleted **${role.name}**`

);


}


},




// ====================
// TEAM ROSTER
// ====================


{

data:

new SlashCommandBuilder()

.setName("team-roster")

.setDescription("View team roster")

.addRoleOption(option =>

option

.setName("team")

.setDescription("Team")

.setRequired(true)

),



async execute(interaction){



let role =
interaction.options.getRole("team");



let db = loadDB();



let team =
db.teams[role.id];



if(!team){


return interaction.reply({

content:"❌ Team not found.",

ephemeral:true

});


}



let players = Object.keys(db.players)

.filter(id =>

db.players[id].roleId === role.id

);



interaction.reply({


embeds:[

new EmbedBuilder()

.setColor("#ff4f8b")

.setTitle(`🏆 ${team.name} Roster`)

.setDescription(

`👔 Manager: <@${team.managerId}>\n\n`+

`👥 Players:\n`+

(

players.length

?

players.map(x=>`<@${x}>`).join("\n")

:

"No players"

)

)


]

});


}


},


// ====================
// STOP HERE
// PASTE VVLL COMMANDS 2/2 UNDER THIS LINE
// ====================
// ====================
// VVLL COMMANDS 2/2
// PASTE UNDER 1/2
// ====================


// ====================
// LEAGUE ROSTER
// ====================

{

data:

new SlashCommandBuilder()

.setName("league-roster")

.setDescription("View all VVLL teams"),



async execute(interaction){


let db = loadDB();


let teams = Object.values(db.teams);



interaction.reply({

embeds:[

new EmbedBuilder()

.setColor("#ff4f8b")

.setTitle("🌎 VVLL League Roster")

.setDescription(

teams.length

?

teams.map(team =>

`🏆 **${team.name}**\n`+
`👔 Manager: <@${team.managerId}>`

).join("\n\n")

:

"No teams created."

)

.setFooter({

text:"VVLL Bot | VVLL | NA | S1"

})

]

});


}

},





// ====================
// SIGN PLAYER
// ====================


{

data:

new SlashCommandBuilder()

.setName("sign")

.setDescription("Send a player a contract")

.addUserOption(option =>

option

.setName("player")

.setDescription("Player to sign")

.setRequired(true)

),



async execute(interaction){



let db = loadDB();



let team = Object.values(db.teams)

.find(t =>

t.managerId === interaction.user.id

);



if(!team){


return interaction.reply({

content:"❌ You are not a manager.",

ephemeral:true

});


}



let player =

interaction.options.getUser("player");





if(db.players[player.id]){


return interaction.reply({

content:"❌ Player already signed.",

ephemeral:true

});


}





// SAVE SERVER FOR DM BUTTONS

team.guildId = interaction.guild.id;

db.teams[team.roleId] = team;

saveDB(db);





let embed =

new EmbedBuilder()

.setColor("#ff4f8b")

.setTitle("🏆 VVLL Contract Offer")

.setDescription(

`You received a contract offer.\n\n`+

`🏟️ Team: **${team.name}**\n`+

`👔 Manager: ${interaction.user}\n\n`+

`Accept or decline below.`

)

.setFooter({

text:"Vx Vnilla Landon League"

});





await player.send({

embeds:[embed],

components:[

{

type:1,

components:[

{

type:2,

label:"Accept",

style:3,

custom_id:`accept_${team.roleId}`

},

{

type:2,

label:"Decline",

style:4,

custom_id:`decline_${team.roleId}`

}

]

}

]

}).catch(()=>{

return interaction.reply({

content:"❌ I cannot DM this player.",

ephemeral:true

});

});




interaction.reply({

content:

`✅ Contract sent to ${player}.`,

ephemeral:true

});



}

},





// ====================
// RELEASE PLAYER
// ====================


{

data:

new SlashCommandBuilder()

.setName("release-player")

.setDescription("Release player from your team")

.addUserOption(option =>

option

.setName("player")

.setDescription("Player")

.setRequired(true)

),



async execute(interaction){



let db = loadDB();



let team = Object.values(db.teams)

.find(t =>

t.managerId === interaction.user.id

);



if(!team){


return interaction.reply({

content:"❌ You are not a manager.",

ephemeral:true

});


}





let player =

interaction.options.getUser("player");





if(

!db.players[player.id] ||

db.players[player.id].roleId !== team.roleId

){


return interaction.reply({

content:"❌ Player is not on your team.",

ephemeral:true

});


}





delete db.players[player.id];


saveDB(db);





interaction.reply(

`✅ Released ${player} from **${team.name}**.`

);



}


},





// ====================
// TRANSFER MANAGER
// ====================


{

data:

new SlashCommandBuilder()

.setName("team-transfer-manager")

.setDescription("Transfer team manager")

.addRoleOption(option =>

option

.setName("team")

.setDescription("Team")

.setRequired(true)

)

.addUserOption(option =>

option

.setName("new_manager")

.setDescription("New manager")

.setRequired(true)

),



async execute(interaction){



if(!isOwner(interaction.user.id)){


return interaction.reply({

content:"❌ Owner only.",

ephemeral:true

});


}




let role =

interaction.options.getRole("team");



let manager =

interaction.options.getUser("new_manager");



let db = loadDB();



if(!db.teams[role.id]){


return interaction.reply({

content:"❌ Team not found.",

ephemeral:true

});


}





db.teams[role.id].managerId = manager.id;



saveDB(db);




interaction.reply(

`✅ ${role.name}'s new manager is ${manager}.`

);


}


},




// ====================
// CREATE GAME
// ====================


{

data:

new SlashCommandBuilder()

.setName("create-game")

.setDescription("Create a VVLL game")

.addRoleOption(option =>

option

.setName("home")

.setDescription("Home team")

.setRequired(true)

)

.addRoleOption(option =>

option

.setName("away")

.setDescription("Away team")

.setRequired(true)

)

.addStringOption(option =>

option

.setName("time")

.setDescription("Match time")

.setRequired(true)

)

.addStringOption(option =>

option

.setName("format")

.setDescription("4v4 - 11v11")

.setRequired(true)

)

.addStringOption(option =>

option

.setName("stage")

.setDescription("Last 8 / Last 4 / Finals")

.setRequired(true)

),




async execute(interaction){



if(!isOwner(interaction.user.id)){


return interaction.reply({

content:"❌ Owner only.",

ephemeral:true

});


}



let embed =

new EmbedBuilder()

.setColor("#ff4f8b")

.setTitle("🏆 VVLL Match")

.setDescription(

`${interaction.options.getRole("home")}\n`+

`⚔️ VS ⚔️\n`+

`${interaction.options.getRole("away")}\n\n`+

`🕒 ${interaction.options.getString("time")}\n`+

`👥 ${interaction.options.getString("format")}\n`+

`🏅 ${interaction.options.getString("stage")}`

);



interaction.reply({

embeds:[embed]

});


}


}


];


// ====================
// END VVLL COMMANDS
// ====================