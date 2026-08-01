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
    .setDescription("Team name")
    .setRequired(true)
),


new SlashCommandBuilder()
.setName("sign")
.setDescription("Sign a player to your team")
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
.setDescription("Release a player from a team")
.addUserOption(option =>
    option
    .setName("player")
    .setDescription("Player to release")
    .setRequired(true)
),
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
.setName("create-game")
.setDescription("Create a VVLL game")
.addStringOption(option =>
    option
    .setName("team1")
    .setDescription("First team")
    .setRequired(true)
)
.addStringOption(option =>
    option
    .setName("team2")
    .setDescription("Second team")
    .setRequired(true)
),


new SlashCommandBuilder()
.setName("record-match")
.setDescription("Record a match result")
.addStringOption(option =>
    option
    .setName("winner")
    .setDescription("Winning team")
    .setRequired(true)
)
.addStringOption(option =>
    option
    .setName("loser")
    .setDescription("Losing team")
    .setRequired(true)
),
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

        created:
        Date.now()

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
            content:"❌ Only VVLL owners can delete teams.",
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


    for(const id in db.players){

        if(db.players[id].team === team){

            db.players[id].team = null;

        }

    }


    saveDB(db);


    return interaction.reply({

        content:
        `🗑️ Deleted team **${team}**`

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

            name:player.username,

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


    if(!db.teams[team].players.includes(player.id)){

        db.teams[team].players.push(player.id);

    }


    saveDB(db);


    return interaction.reply({

        content:
        `✅ ${player} signed to **${team}**`

    });


}
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

            content:
            "❌ Only the manager can release players.",

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

        content:
        `✅ ${player} was released from ${team}`

    });


}



if(interaction.commandName === "team-transfer-manager"){


    if(!isOwner(interaction.user.id)){

        return interaction.reply({
            content:"❌ Only owners can transfer managers.",
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

        content:
        `✅ ${manager} is now manager of ${team}`

    });


}



if(interaction.commandName === "create-game"){


    const db = loadDB();


    const team1 =
    interaction.options.getString("team1");


    const team2 =
    interaction.options.getString("team2");


    const id =
    Date.now().toString();


    db.games[id] = {

        team1,
        team2,
        status:"scheduled"

    };


    saveDB(db);


    return interaction.reply({

        content:
        `⚽ Game created:\n${team1} vs ${team2}`

    });


}



if(interaction.commandName === "record-match"){


    if(!isOwner(interaction.user.id)){

        return interaction.reply({
            content:"❌ Only owners can record matches.",
            ephemeral:true
        });

    }


    const db = loadDB();


    const winner =
    interaction.options.getString("winner");


    const loser =
    interaction.options.getString("loser");


    if(!db.standings[winner]){

        db.standings[winner] = {
            wins:0,
            losses:0,
            draws:0
        };

    }


    if(!db.standings[loser]){

        db.standings[loser] = {
            wins:0,
            losses:0,
            draws:0
        };

    }


    db.standings[winner].wins++;

    db.standings[loser].losses++;


    saveDB(db);


    return interaction.reply({

        content:
        `🏆 ${winner} defeated ${loser}`

    });


}