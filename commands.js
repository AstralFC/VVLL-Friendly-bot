// ===============================
// VVLL LEAGUE BOT
// COMMANDS.JS
// PART 1/3
// ===============================

const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const database = require("./database");


// ===============================
// SLASH COMMANDS
// ===============================

const commands = [

    new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Create VVLL friendly queue"),


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
        .setDescription("Discord timestamp example: <t:1785555555:F>")
        .setRequired(true)
    )

    .addStringOption(option =>
        option
        .setName("format")
        .setDescription("Game format")
        .setRequired(true)

        .addChoices(
            {name:"4v4",value:"4v4"},
            {name:"5v5",value:"5v5"},
            {name:"6v6",value:"6v6"},
            {name:"7v7",value:"7v7"},
            {name:"8v8",value:"8v8"},
            {name:"9v9",value:"9v9"},
            {name:"10v10",value:"10v10"},
            {name:"11v11",value:"11v11"}
        )
    )

    .addStringOption(option =>
        option
        .setName("stage")
        .setDescription("Tournament stage")
        .setRequired(true)

        .addChoices(
            {name:"League",value:"League"},
            {name:"Last 8",value:"Last 8"},
            {name:"Last 4",value:"Last 4"},
            {name:"Finals",value:"Finals"}
        )
    ),



    new SlashCommandBuilder()
    .setName("league-setup")
    .setDescription("Create VVLL league")

];



// ===============================
// REGISTER COMMANDS
// ===============================

async function register(client){

    const {REST} = require("@discordjs/rest");
    const {Routes} = require("discord-api-types/v10");


    const rest = new REST({
        version:"10"
    })
    .setToken(process.env.TOKEN);



    await rest.put(

        Routes.applicationCommands(
            client.user.id
        ),

        {
            body: commands.map(cmd =>
                cmd.toJSON()
            )
        }

    );


    console.log("Commands registered");

}



// ===============================
// COMMAND HANDLER
// ===============================

async function run(interaction){



// ===============================
// FRIENDLY QUEUE SETUP
// ===============================

if(interaction.commandName === "setup"){


    const embed = new EmbedBuilder()

    .setColor("#ff0055")

    .setTitle("⚽ VVLL Friendly Queue")

    .setDescription(

`Nobody is currently queued.

⏰ Queue timer: 1 hour

Anyone can join.`

);



const buttons = new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId("queue_join")

.setLabel("✅ Join Queue")

.setStyle(ButtonStyle.Success),


new ButtonBuilder()

.setCustomId("queue_leave")

.setLabel("❌ Leave Queue")

.setStyle(ButtonStyle.Danger)

);



return interaction.reply({

    embeds:[embed],

    components:[buttons]

});


}




// ===============================
// CREATE GAME
// ===============================


if(interaction.commandName === "create-game"){


const game = {


home:
interaction.options.getRole("home").id,


away:
interaction.options.getRole("away").id,


time:
interaction.options.getString("time"),


format:
interaction.options.getString("format"),


stage:
interaction.options.getString("stage"),


ref:null


};



database.addMatch(game);



const embed = new EmbedBuilder()

.setColor("#ff0055")

.setTitle("⚽ VVLL Match")

.setDescription(`

🏠 Home:
${interaction.options.getRole("home")}


🚌 Away:
${interaction.options.getRole("away")}


📋 Format:
${game.format}


🏆 Stage:
${game.stage}


⏰ Time:
${game.time}


🧑‍⚖️ Ref Needed

`);



const row = new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId("claim_ref")

.setLabel("🧑‍⚖️ Claim Ref")

.setStyle(ButtonStyle.Primary)

);



return interaction.reply({

embeds:[embed],

components:[row]

});


}





// ===============================
// LEAGUE SETUP START
// ===============================


if(interaction.commandName === "league-setup"){


return interaction.reply({

content:
"🏆 League setup starting... Part 2 will add team selection and fixtures.",

ephemeral:true

});


}


}




module.exports = {

register,

run

};
// ===============================
// VVLL LEAGUE SETUP SYSTEM
// COMMANDS.JS PART 2/3
// ===============================


// ===============================
// LEAGUE SETUP COMMAND
// ===============================

if(interaction.commandName === "league-setup"){


    let teams = [];


    for(let i = 1; i <= 8; i++){

        const team =
        interaction.options.getRole(`team${i}`);


        teams.push({

            id: team.id,

            name: team.name

        });

    }



    // Shuffle teams

    teams = teams.sort(
        () => Math.random() - 0.5
    );



    // Create games

    let games = [];


    for(let i = 0; i < teams.length; i += 2){


        games.push({

            id: games.length + 1,

            home: teams[i],

            away: teams[i + 1],

            time: "Not Set",

            stage: "League",

            homeScore: null,

            awayScore: null

        });


    }



    // Save league

    database.db.league = {

        teams: teams,

        games: games,

        currentGame: 0

    };


    database.save();



    let teamList =
    teams.map((team,index)=>{

        return `${index + 1}. <@&${team.id}>`;

    }).join("\n");



    let gamesList =
    games.map(game=>{


        return `

⚽ **Game ${game.id}**

🏠 <@&${game.home.id}>
VS
🚌 <@&${game.away.id}>

📅 Time: Not Set

`;

    }).join("\n────────────");





    const embed = new EmbedBuilder()

    .setColor("#ff0055")

    .setTitle("🏆 VVLL League Setup")

    .setDescription(`

## Teams

${teamList}


## Fixtures

${gamesList}


✅ League created successfully.

`);




    return interaction.reply({

        embeds:[embed]

    });


}
// ===============================
// VVLL COMMANDS.JS
// PART 3/3
// ===============================


// ===============================
// RESULT COMMAND
// ===============================

if(interaction.commandName === "result"){


    let games = database.db.league?.games;


    if(!games || games.length === 0){

        return interaction.reply({

            content:"❌ No league games found.",

            ephemeral:true

        });

    }


    let game = games[0];


    let embed = new EmbedBuilder()

    .setColor("#ff0055")

    .setTitle("⚽ VVLL Match Result")

    .setDescription(`

🏠 Home:
<@&${game.home.id}>


🚌 Away:
<@&${game.away.id}>


Enter stats next:

⚽ Goals
🧤 Saves
🧱 Blocks

`);




    return interaction.reply({

        embeds:[embed]

    });


}




// ===============================
// SIGN COMMAND
// ===============================


if(interaction.commandName === "sign"){


    const player =
    interaction.options.getUser("player");


    const team =
    interaction.options.getRole("team");



    const embed = new EmbedBuilder()

    .setColor("#ff0055")

    .setTitle("📄 VVLL Contract Offer")

    .setDescription(`

You have received a signing offer.

🏆 Team:
${team}


Manager:
${interaction.user}


Do you accept?

`);




    const buttons = new ActionRowBuilder()

    .addComponents(

        new ButtonBuilder()

        .setCustomId(
        `accept_${team.id}`
        )

        .setLabel("✅ Accept")

        .setStyle(ButtonStyle.Success),



        new ButtonBuilder()

        .setCustomId(
        "decline_contract"
        )

        .setLabel("❌ Decline")

        .setStyle(ButtonStyle.Danger)

    );



    try{


        await player.send({

            embeds:[embed],

            components:[buttons]

        });



    }catch{


        return interaction.reply({

            content:"❌ Player DMs are closed.",

            ephemeral:true

        });

    }



    return interaction.reply({

        content:
        `✅ Contract sent to ${player}.`,

        ephemeral:true

    });


}




// ===============================
// STANDINGS
// ===============================


if(interaction.commandName === "standings"){



let standings =
database.getStandings();



if(!standings.length){


return interaction.reply({

content:
"❌ No standings yet.",

ephemeral:true

});


}



let table =
standings.map((team,index)=>{


return `

${index+1}. ${team.name}

🏆 ${team.points} pts

⚽ ${team.goals} goals

`;

}).join("\n");




let embed = new EmbedBuilder()

.setColor("#ff0055")

.setTitle("🏆 VVLL Standings")

.setDescription(table);



return interaction.reply({

embeds:[embed]

});


}




// ===============================
// PLAYER STATS
// ===============================


if(interaction.commandName === "stats"){


let players =
database.getPlayers();



if(!players.length){


return interaction.reply({

content:
"❌ No player stats yet.",

ephemeral:true

});


}



let stats = players.map(player=>{


return `

${player.name}

⚽ Goals: ${player.goals || 0}

🧤 Saves: ${player.saves || 0}

🧱 Blocks: ${player.blocks || 0}

`;

}).join("\n");




let embed = new EmbedBuilder()

.setColor("#ff0055")

.setTitle("📊 VVLL Player Stats")

.setDescription(stats);



return interaction.reply({

embeds:[embed]

});


}