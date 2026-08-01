// ===============================
// VVLL BOT COMMANDS
// FIXED ARRAY VERSION 1/4
// ===============================

const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");


const DB_FILE = "./database.json";

const OWNER_ID = "YOUR_ID_HERE";


function loadDB(){

    return JSON.parse(
        fs.readFileSync(DB_FILE,"utf8")
    );

}


function saveDB(db){

    fs.writeFileSync(
        DB_FILE,
        JSON.stringify(db,null,4)
    );

}


function isOwner(id){

    return id === OWNER_ID;

}


function createPlayer(db,user){

    if(!db.players[user.id]){

        db.players[user.id] = {

            name:user.username,

            team:null,

            stats:{
                goals:0,
                assists:0,
                saves:0,
                blocks:0
            }

        };

    }

}



module.exports = [


{

data:

new SlashCommandBuilder()

.setName("stats")

.setDescription("Add player stats")

.addUserOption(option =>
option
.setName("player")
.setDescription("Player")
.setRequired(true)
)

.addIntegerOption(option =>
option
.setName("goals")
.setDescription("Goals")
.setRequired(true)
)

.addIntegerOption(option =>
option
.setName("assists")
.setDescription("Assists")
.setRequired(true)
)

.addIntegerOption(option =>
option
.setName("saves")
.setDescription("Saves")
.setRequired(true)
)

.addIntegerOption(option =>
option
.setName("blocks")
.setDescription("Blocks")
.setRequired(true)
),



async execute(interaction){


const db = loadDB();


if(interaction.commandName === "stats"){


if(!isOwner(interaction.user.id)){

return interaction.reply({

content:"❌ Owner only",

ephemeral:true

});

}


const player =
interaction.options.getUser("player");


createPlayer(db,player);


db.players[player.id].stats.goals +=
interaction.options.getInteger("goals");


db.players[player.id].stats.assists +=
interaction.options.getInteger("assists");


db.players[player.id].stats.saves +=
interaction.options.getInteger("saves");


db.players[player.id].stats.blocks +=
interaction.options.getInteger("blocks");


saveDB(db);


return interaction.reply({

content:
`✅ Updated stats for ${player}`

});


}


}


}

// ===============================
// VVLL COMMANDS
// FIXED ARRAY VERSION 2/4
// ===============================


{


data:

new SlashCommandBuilder()

.setName("player-stats")

.setDescription("View player stats")

.addUserOption(option =>
option
.setName("player")
.setDescription("Player")
.setRequired(true)
),


async execute(interaction){


const db = loadDB();


const player =
interaction.options.getUser("player");


if(!db.players[player.id]){

return interaction.reply({

content:"❌ No stats found.",

ephemeral:true

});

}


const s =
db.players[player.id].stats;


return interaction.reply({

embeds:[

new EmbedBuilder()

.setTitle(`📊 ${player.username}`)

.setDescription(
`
⚽ Goals: ${s.goals}
🎯 Assists: ${s.assists}
🧤 Saves: ${s.saves}
🧱 Blocks: ${s.blocks}
`
)

]

});


}


},



{


data:

new SlashCommandBuilder()

.setName("create-team")

.setDescription("Create VVLL team")

.addStringOption(option =>
option
.setName("name")
.setDescription("Team name")
.setRequired(true)
)

.addUserOption(option =>
option
.setName("manager")
.setDescription("Manager")
.setRequired(true)
),


async execute(interaction){


const db = loadDB();


if(!isOwner(interaction.user.id)){

return interaction.reply({

content:"❌ Owner only",

ephemeral:true

});

}


const name =
interaction.options.getString("name");


const manager =
interaction.options.getUser("manager");


db.teams[name]={

manager:manager.id,

players:[]

};


saveDB(db);


return interaction.reply({

content:
`✅ Created ${name}`

});


}

// ===============================
// VVLL COMMANDS
// FIXED ARRAY VERSION 3/4
// ===============================


{


data:

new SlashCommandBuilder()

.setName("sign")

.setDescription("Sign a player to a team")

.addUserOption(option =>
option
.setName("player")
.setDescription("Player")
.setRequired(true)
)

.addStringOption(option =>
option
.setName("team")
.setDescription("Team")
.setRequired(true)
),



async execute(interaction){


const db = loadDB();


const player =
interaction.options.getUser("player");


const team =
interaction.options.getString("team");


if(!db.teams[team]){

return interaction.reply({

content:"❌ Team does not exist.",

ephemeral:true

});

}


createPlayer(db,player);


db.players[player.id].team = team;


if(!db.teams[team].players.includes(player.id)){

db.teams[team].players.push(player.id);

}


saveDB(db);


return interaction.reply({

content:
`✅ ${player} signed to ${team}`

});


}


},




{


data:

new SlashCommandBuilder()

.setName("team-stats")

.setDescription("View team stats")

.addStringOption(option =>
option
.setName("team")
.setDescription("Team")
.setRequired(true)
),



async execute(interaction){


const db = loadDB();


const team =
interaction.options.getString("team");


if(!db.teams[team]){

return interaction.reply({

content:"❌ Team not found.",

ephemeral:true

});

}


let goals=0;
let assists=0;
let saves=0;
let blocks=0;



db.teams[team].players.forEach(id=>{


const s =
db.players[id]?.stats;


if(s){

goals += s.goals;
assists += s.assists;
saves += s.saves;
blocks += s.blocks;

}


});



return interaction.reply({

content:
`
📊 ${team}

⚽ Goals: ${goals}
🎯 Assists: ${assists}
🧤 Saves: ${saves}
🧱 Blocks: ${blocks}
`

});


}

// ===============================
// VVLL COMMANDS
// FIXED ARRAY VERSION 4/4
// ===============================


{


data:

new SlashCommandBuilder()

.setName("standings")

.setDescription("View VVLL standings"),



async execute(interaction){


return interaction.reply({

content:
"🏆 VVLL Standings\nNo games recorded yet."

});


}


},




{


data:

new SlashCommandBuilder()

.setName("team-roster")

.setDescription("View team roster")

.addStringOption(option =>
option
.setName("team")
.setDescription("Team")
.setRequired(true)
),



async execute(interaction){


const db = loadDB();


const team =
interaction.options.getString("team");


if(!db.teams[team]){

return interaction.reply({

content:"❌ Team not found.",

ephemeral:true

});

}


let roster="";


db.teams[team].players.forEach(id=>{

roster +=
`• ${db.players[id]?.name || "Unknown"}\n`;

});


return interaction.reply({

content:
`🏟️ ${team}\n${roster || "No players"}`

});


}


},




{


data:

new SlashCommandBuilder()

.setName("reset-league")

.setDescription("Reset VVLL league"),



async execute(interaction){


const db = loadDB();


if(!isOwner(interaction.user.id)){

return interaction.reply({

content:"❌ Owner only",

ephemeral:true

});

}


db.players={};

db.teams={};

db.standings={};


saveDB(db);


return interaction.reply({

content:
"✅ League reset."

});


}


}

];

