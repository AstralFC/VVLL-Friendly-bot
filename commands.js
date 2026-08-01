// ===============================
// VVLL BOT COMMANDS
// CLEAN VERSION 1/4
// ===============================

const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");


const DB_FILE = "./database.json";


// CHANGE THIS TO YOUR DISCORD USER ID
const OWNER_ID = "YOUR_ID_HERE";


function loadDB(){

    if(!fs.existsSync(DB_FILE)){

        return {
            version:2,
            teams:{},
            players:{},
            games:{},
            standings:{},
            settings:{
                season:1
            }
        };

    }

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



function makePlayer(db,user){

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



module.exports = {

data:[


// ===============================
// STATS
// ===============================


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



new SlashCommandBuilder()

.setName("player-stats")

.setDescription("View player stats")

.addUserOption(option =>
option
.setName("player")
.setDescription("Player")
.setRequired(true)
),



// ===============================
// PASTE 2/4 UNDER THIS LINE
// ===============================
// ===============================
// TEAM COMMANDS
// CLEAN VERSION 2/4
// ===============================


new SlashCommandBuilder()

.setName("team-stats")

.setDescription("View team stats")

.addStringOption(option =>
option
.setName("team")
.setDescription("Team name")
.setRequired(true)
),



new SlashCommandBuilder()

.setName("standings")

.setDescription("View VVLL standings"),



new SlashCommandBuilder()

.setName("create-team")

.setDescription("Create a team")

.addStringOption(option =>
option
.setName("name")
.setDescription("Team name")
.setRequired(true)
)

.addUserOption(option =>
option
.setName("manager")
.setDescription("Team manager")
.setRequired(true)
),



new SlashCommandBuilder()

.setName("delete-team")

.setDescription("Delete a team")

.addStringOption(option =>
option
.setName("team")
.setDescription("Team name")
.setRequired(true)
),



new SlashCommandBuilder()

.setName("sign")

.setDescription("Sign player")

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



new SlashCommandBuilder()

.setName("release-player")

.setDescription("Release player")

.addUserOption(option =>
option
.setName("player")
.setDescription("Player")
.setRequired(true)
),



// ===============================
// PASTE 3/4 UNDER THIS LINE
// ===============================
// ===============================
// MORE COMMANDS + START EXECUTE
// CLEAN VERSION 3/4
// ===============================


new SlashCommandBuilder()

.setName("team-roster")

.setDescription("View team roster")

.addStringOption(option =>
option
.setName("team")
.setDescription("Team name")
.setRequired(true)
),



new SlashCommandBuilder()

.setName("league-roster")

.setDescription("View all teams"),



new SlashCommandBuilder()

.setName("reset-league")

.setDescription("Reset league"),



],



async execute(interaction){



const db = loadDB();



// ===============================
// STATS COMMAND
// ===============================


if(interaction.commandName === "stats"){


    if(!isOwner(interaction.user.id)){

        return interaction.reply({

            content:"❌ Owner only.",

            ephemeral:true

        });

    }


    const user =
    interaction.options.getUser("player");


    makePlayer(db,user);


    db.players[user.id].stats.goals +=
    interaction.options.getInteger("goals");


    db.players[user.id].stats.assists +=
    interaction.options.getInteger("assists");


    db.players[user.id].stats.saves +=
    interaction.options.getInteger("saves");


    db.players[user.id].stats.blocks +=
    interaction.options.getInteger("blocks");


    saveDB(db);


    return interaction.reply({

        content:
        `✅ Stats updated for ${user}`

    });


}




// ===============================
// PLAYER STATS
// ===============================


if(interaction.commandName === "player-stats"){


    const user =
    interaction.options.getUser("player");


    makePlayer(db,user);


    const s =
    db.players[user.id].stats;


    return interaction.reply({

        embeds:[

            new EmbedBuilder()

            .setTitle(`📊 ${user.username}`)

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




// ===============================
// PASTE 4/4 UNDER THIS LINE
// ===============================
// ===============================
// FINAL COMMAND LOGIC
// CLEAN VERSION 4/4
// ===============================



if(interaction.commandName === "create-team"){


    if(!isOwner(interaction.user.id)){

        return interaction.reply({
            content:"❌ Owner only.",
            ephemeral:true
        });

    }


    const name =
    interaction.options.getString("name");


    const manager =
    interaction.options.getUser("manager");


    db.teams[name] = {

        manager: manager.id,

        players:[]

    };


    saveDB(db);


    return interaction.reply({

        content:
        `✅ Created team ${name}`

    });

}




if(interaction.commandName === "sign"){


    const player =
    interaction.options.getUser("player");


    const team =
    interaction.options.getString("team");


    if(!db.teams[team]){

        return interaction.reply({
            content:"❌ Team not found.",
            ephemeral:true
        });

    }


    makePlayer(db,player);


    db.players[player.id].team = team;


    db.teams[team].players.push(player.id);


    saveDB(db);


    return interaction.reply({

        content:
        `✅ ${player} joined ${team}`

    });

}




if(interaction.commandName === "release-player"){


    const player =
    interaction.options.getUser("player");


    makePlayer(db,player);


    db.players[player.id].team = null;


    saveDB(db);


    return interaction.reply({

        content:
        `✅ Released ${player}`

    });

}




if(interaction.commandName === "team-stats"){


    const team =
    interaction.options.getString("team");


    let goals=0;
    let assists=0;
    let saves=0;
    let blocks=0;


    if(db.teams[team]){

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

    }


    return interaction.reply({

        content:
`📊 ${team}

⚽ ${goals}
🎯 ${assists}
🧤 ${saves}
🧱 ${blocks}`

    });

}




if(interaction.commandName === "team-roster"){


    const team =
    interaction.options.getString("team");


    let text="";


    if(db.teams[team]){

        db.teams[team].players.forEach(id=>{

            text +=
            `• ${db.players[id]?.name}\n`;

        });

    }


    return interaction.reply({

        content:
        text || "No players"

    });

}




if(interaction.commandName === "league-roster"){


    let text="";


    for(const team in db.teams){

        text +=
        `🏆 ${team}\n`;

    }


    return interaction.reply({

        content:
        text || "No teams"

    });

}




if(interaction.commandName === "standings"){


    return interaction.reply({

        content:
        "🏆 VVLL Standings coming soon."

    });

}




if(interaction.commandName === "reset-league"){


    if(!isOwner(interaction.user.id)){

        return interaction.reply({
            content:"❌ Owner only.",
            ephemeral:true
        });

    }


    db.players={};

    db.teams={};


    saveDB(db);


    return interaction.reply({

        content:
        "✅ League reset."

    });

}


}

};