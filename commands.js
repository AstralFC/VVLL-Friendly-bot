const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");

const DB_FILE = "./database.json";

const OWNER_ID = "1505021865985572940";
const CO_OWNER_ID = "1429837765281058876";


function loadDB() {
    if (!fs.existsSync(DB_FILE)) {
        return {
            version: 2,
            teams: {},
            players: {},
            games: {},
            standings: {},
            settings: {
                season: 1
            }
        };
    }

    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}


function saveDB(db) {
    fs.writeFileSync(
        DB_FILE,
        JSON.stringify(db, null, 4)
    );
}


function isOwner(id) {
    return (
        id === OWNER_ID ||
        id === CO_OWNER_ID
    );
}


function setupPlayer(db, user) {

    if (!db.players[user.id]) {

        db.players[user.id] = {
            name: user.username,
            team: null,
            stats: {
                goals: 0,
                assists: 0,
                saves: 0,
                blocks: 0
            }
        };

    }

    if (!db.players[user.id].stats) {

        db.players[user.id].stats = {
            goals: 0,
            assists: 0,
            saves: 0,
            blocks: 0
        };

    }

}


module.exports = {

data: [

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


],


async execute(interaction) {


if (interaction.commandName === "stats") {


    if (!isOwner(interaction.user.id)) {

        return interaction.reply({
            content: "❌ Only VVLL owners can use this command.",
            ephemeral: true
        });

    }


    const user =
    interaction.options.getUser("player");


    const db = loadDB();


    setupPlayer(db, user);


    db.players[user.id].stats.goals +=
    interaction.options.getInteger("goals");


    db.players[user.id].stats.assists +=
    interaction.options.getInteger("assists");


    db.players[user.id].stats.saves +=
    interaction.options.getInteger("saves");


    db.players[user.id].stats.blocks +=
    interaction.options.getInteger("blocks");


    saveDB(db);


    const embed = new EmbedBuilder()

    .setTitle("🏆 VVLL Stats Updated")

    .setDescription(
`${user}

⚽ Goals: ${db.players[user.id].stats.goals}
🎯 Assists: ${db.players[user.id].stats.assists}
🧤 Saves: ${db.players[user.id].stats.saves}
🧱 Blocks: ${db.players[user.id].stats.blocks}`
    );


    return interaction.reply({
        embeds:[embed]
    });

}


// CONTINUE PART 2/3 BELOW
if (interaction.commandName === "player-stats") {


    const user =
    interaction.options.getUser("player");


    const db = loadDB();


    const player =
    db.players[user.id];


    if (!player) {

        return interaction.reply({

            content:
            "❌ This player has no stats yet.",

            ephemeral:true

        });

    }


    const stats =
    player.stats || {

        goals:0,
        assists:0,
        saves:0,
        blocks:0

    };


    const embed =
    new EmbedBuilder()

    .setTitle("📊 VVLL Player Stats")

    .setDescription(
`${user}

⚽ Goals: ${stats.goals}
🎯 Assists: ${stats.assists}
🧤 Saves: ${stats.saves}
🧱 Blocks: ${stats.blocks}

🏟 Team: ${
player.team ? player.team : "Free Agent"
}`
    );


    return interaction.reply({

        embeds:[embed]

    });


}



if (interaction.commandName === "team-stats") {


    const team =
    interaction.options.getString("team");


    const db = loadDB();


    if (!db.teams[team]) {

        return interaction.reply({

            content:
            "❌ Team not found.",

            ephemeral:true

        });

    }


    let goals = 0;
    let assists = 0;
    let saves = 0;
    let blocks = 0;


    for (const id in db.players) {


        const player =
        db.players[id];


        if (player.team === team) {


            goals += player.stats?.goals || 0;

            assists += player.stats?.assists || 0;

            saves += player.stats?.saves || 0;

            blocks += player.stats?.blocks || 0;


        }


    }


    const embed =
    new EmbedBuilder()

    .setTitle(`🏆 ${team} Team Stats`)

    .setDescription(
`
⚽ Goals: ${goals}
🎯 Assists: ${assists}
🧤 Saves: ${saves}
🧱 Blocks: ${blocks}
`
    );


    return interaction.reply({

        embeds:[embed]

    });


}



if (interaction.commandName === "standings") {


    const db = loadDB();


    let text = "";


    if (Object.keys(db.standings).length === 0) {

        text =
        "No standings yet.";

    } else {


        for (const team in db.standings) {


            const data =
            db.standings[team];


            text +=
`${team}

Wins: ${data.wins || 0}
Losses: ${data.losses || 0}
Draws: ${data.draws || 0}

`;

        }


    }


    const embed =
    new EmbedBuilder()

    .setTitle("🏆 VVLL Standings")

    .setDescription(text);


    return interaction.reply({

        embeds:[embed]

    });


}


// CONTINUE PART 3/3 BELOW
if (interaction.commandName === "team-roster") {


    const team =
    interaction.options.getString("team");


    const db = loadDB();


    if (!db.teams[team]) {

        return interaction.reply({

            content:"❌ Team not found.",
            ephemeral:true

        });

    }


    let roster = "No players";


    const players =
    Object.values(db.players)
    .filter(p => p.team === team);


    if(players.length > 0){

        roster =
        players.map(p => `• ${p.name}`).join("\n");

    }


    const embed =
    new EmbedBuilder()

    .setTitle(`📋 ${team} Roster`)

    .setDescription(roster);


    return interaction.reply({

        embeds:[embed]

    });


}



if (interaction.commandName === "league-roster") {


    const db = loadDB();


    let text = "";


    for(const team in db.teams){


        text +=
`🏟 ${team}

`;


        const players =
        Object.values(db.players)
        .filter(p => p.team === team);


        if(players.length){

            players.forEach(p=>{

                text +=
                `• ${p.name}\n`;

            });

        } else {

            text +=
            "No players\n";

        }


        text += "\n";


    }


    const embed =
    new EmbedBuilder()

    .setTitle("🏆 VVLL League Roster")

    .setDescription(
    text || "No teams created."
    );


    return interaction.reply({

        embeds:[embed]

    });


}



if (interaction.commandName === "reset-league") {


    if(!isOwner(interaction.user.id)){


        return interaction.reply({

            content:
            "❌ Only owners can reset the league.",

            ephemeral:true

        });

    }


    const db = loadDB();


    for(const id in db.players){

        db.players[id].stats = {

            goals:0,
            assists:0,
            saves:0,
            blocks:0

        };

    }


    db.teams = {};
    db.games = {};
    db.standings = {};


    saveDB(db);


    return interaction.reply({

        content:
        "✅ League reset complete."

    });


}



}

};