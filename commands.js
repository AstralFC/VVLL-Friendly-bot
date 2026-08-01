// ===============================
// VVLL TEAM COMMANDS 1/4
// COMMAND BUILDERS
// ===============================


new SlashCommandBuilder()

.setName("create-team")

.setDescription("Create a new VVLL team")

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

.setDescription("Delete a VVLL team")

.addStringOption(option =>
    option
    .setName("team")
    .setDescription("Team name to delete")
    .setRequired(true)
),



new SlashCommandBuilder()

.setName("sign")

.setDescription("Sign a player to a team")

.addUserOption(option =>
    option
    .setName("player")
    .setDescription("Player to sign")
    .setRequired(true)
)

.addStringOption(option =>
    option
    .setName("team")
    .setDescription("Team name")
    .setRequired(true)
),



new SlashCommandBuilder()

.setName("release-player")

.setDescription("Release a player from their team")

.addUserOption(option =>
    option
    .setName("player")
    .setDescription("Player to release")
    .setRequired(true)
),



// ===============================
// END OF TEAM COMMANDS 1/4
// NEXT: PASTE TEAM COMMANDS 2/4 BELOW
// ===============================
// ===============================
// VVLL TEAM COMMANDS 2/4
// MORE COMMAND BUILDERS
// ===============================


new SlashCommandBuilder()

.setName("team-transfer-manager")

.setDescription("Change a team's manager")

.addStringOption(option =>
    option
    .setName("team")
    .setDescription("Team name")
    .setRequired(true)
)

.addUserOption(option =>
    option
    .setName("manager")
    .setDescription("New manager")
    .setRequired(true)
),



new SlashCommandBuilder()

.setName("team-roster")

.setDescription("View a team's roster")

.addStringOption(option =>
    option
    .setName("team")
    .setDescription("Team name")
    .setRequired(true)
),



new SlashCommandBuilder()

.setName("league-roster")

.setDescription("View the whole league roster"),



new SlashCommandBuilder()

.setName("team-stats")

.setDescription("View team combined stats")

.addStringOption(option =>
    option
    .setName("team")
    .setDescription("Team name")
    .setRequired(true)
),



new SlashCommandBuilder()

.setName("standings")

.setDescription("View VVLL standings"),



// ===============================
// END OF TEAM COMMANDS 2/4
// NEXT: PASTE TEAM COMMANDS 3/4 BELOW
// ===============================
// ===============================
// VVLL TEAM COMMANDS 3/4
// COMMAND LOGIC
// ===============================


if(interaction.commandName === "create-team"){


    if(!isOwner(interaction.user.id)){

        return interaction.reply({
            content:"❌ Only VVLL owners can create teams.",
            ephemeral:true
        });

    }


    const db = loadDB();


    const name =
    interaction.options.getString("name");


    const manager =
    interaction.options.getUser("manager");


    if(db.teams[name]){

        return interaction.reply({
            content:"❌ Team already exists.",
            ephemeral:true
        });

    }


    db.teams[name] = {

        manager: manager.id,

        players: [],

        created: Date.now()

    };


    saveDB(db);


    return interaction.reply({

        content:
        `✅ Created **${name}**\nManager: ${manager}`

    });

}



if(interaction.commandName === "delete-team"){


    if(!isOwner(interaction.user.id)){

        return interaction.reply({
            content:"❌ Only owners can delete teams.",
            ephemeral:true
        });

    }


    const db = loadDB();


    const team =
    interaction.options.getString("team");


    if(!db.teams[team]){

        return interaction.reply({
            content:"❌ Team not found.",
            ephemeral:true
        });

    }


    delete db.teams[team];


    for(const player in db.players){

        if(db.players[player].team === team){

            db.players[player].team = null;

        }

    }


    saveDB(db);


    return interaction.reply({

        content:
        `🗑️ Deleted ${team}`

    });

}



if(interaction.commandName === "sign"){


    const player =
    interaction.options.getUser("player");


    const team =
    interaction.options.getString("team");


    const db = loadDB();


    if(!db.teams[team]){

        return interaction.reply({
            content:"❌ Team not found.",
            ephemeral:true
        });

    }


    if(db.teams[team].manager !== interaction.user.id){

        return interaction.reply({

            content:
            "❌ Only the team manager can sign players.",

            ephemeral:true

        });

    }


    if(!db.players[player.id]){

        db.players[player.id] = {

            name: player.username,

            team:null,

            stats:{
                goals:0,
                assists:0,
                saves:0,
                blocks:0
            }

        };

    }


    db.players[player.id].team = team;


    db.teams[team].players.push(player.id);


    saveDB(db);


    return interaction.reply({

        content:
        `✅ ${player} signed to ${team}`

    });

}


// ===============================
// END OF TEAM COMMANDS 3/4
// NEXT: PASTE TEAM COMMANDS 4/4 BELOW
// ===============================
// ===============================
// VVLL TEAM COMMANDS 4/4
// FINAL COMMAND LOGIC
// ===============================


if(interaction.commandName === "release-player"){


    const player =
    interaction.options.getUser("player");


    const db = loadDB();


    if(!db.players[player.id]){

        return interaction.reply({
            content:"❌ Player not found.",
            ephemeral:true
        });

    }


    const team =
    db.players[player.id].team;


    if(!team){

        return interaction.reply({
            content:"❌ Player is not on a team.",
            ephemeral:true
        });

    }


    if(db.teams[team].manager !== interaction.user.id){

        return interaction.reply({
            content:"❌ Only the manager can release players.",
            ephemeral:true
        });

    }


    db.players[player.id].team = null;


    db.teams[team].players =
    db.teams[team].players.filter(
        id => id !== player.id
    );


    saveDB(db);


    return interaction.reply({
        content:`✅ Released ${player}`
    });

}



if(interaction.commandName === "team-transfer-manager"){


    if(!isOwner(interaction.user.id)){

        return interaction.reply({
            content:"❌ Only owners can do this.",
            ephemeral:true
        });

    }


    const db = loadDB();


    const team =
    interaction.options.getString("team");


    const manager =
    interaction.options.getUser("manager");


    if(!db.teams[team]){

        return interaction.reply({
            content:"❌ Team not found.",
            ephemeral:true
        });

    }


    db.teams[team].manager =
    manager.id;


    saveDB(db);


    return interaction.reply({
        content:`✅ ${manager} is now manager of ${team}`
    });

}



if(interaction.commandName === "team-roster"){


    const db = loadDB();


    const team =
    interaction.options.getString("team");


    let roster = "No players";


    if(db.teams[team]){

        const players =
        db.teams[team].players;


        if(players.length){

            roster =
            players.map(id =>
            `• ${db.players[id]?.name || id}`
            ).join("\n");

        }

    }


    return interaction.reply({

        content:
        `🏟️ **${team} Roster**\n${roster}`

    });

}



if(interaction.commandName === "league-roster"){


    const db = loadDB();


    let text = "";


    for(const team in db.teams){

        text += `🏆 ${team}\n`;


        db.teams[team].players.forEach(id=>{

            text +=
            `• ${db.players[id]?.name || id}\n`;

        });


        text += "\n";

    }


    return interaction.reply({

        content:
        text || "No teams."

    });

}



if(interaction.commandName === "team-stats"){


    const db = loadDB();


    const team =
    interaction.options.getString("team");


    let goals = 0;
    let assists = 0;
    let saves = 0;
    let blocks = 0;


    if(db.teams[team]){

        db.teams[team].players.forEach(id=>{

            const stats =
            db.players[id]?.stats || {};


            goals += stats.goals || 0;
            assists += stats.assists || 0;
            saves += stats.saves || 0;
            blocks += stats.blocks || 0;

        });

    }


    return interaction.reply({

        content:
`📊 ${team} Stats

⚽ Goals: ${goals}
🎯 Assists: ${assists}
🧤 Saves: ${saves}
🧱 Blocks: ${blocks}`

    });

}


// ===============================
// CLOSE execute()
// ===============================