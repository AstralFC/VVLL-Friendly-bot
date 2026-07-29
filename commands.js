// =====================================
// VVLL LEAGUE BOT
// COMMANDS.JS 1/3
// =====================================

const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const config = require("./config");
const database = require("./database");
const league = require("./league");
const teams = require("./teams");
const ownerPanel = require("./ownerPanel");



const commands = [


new SlashCommandBuilder()
.setName("owner-panel")
.setDescription("Open the VVLL owner panel"),



new SlashCommandBuilder()
.setName("league-setup")
.setDescription("Setup the VVLL league")
.addStringOption(option =>
    option
    .setName("teams")
    .setDescription("Team roles separated by commas")
    .setRequired(true)
),



new SlashCommandBuilder()
.setName("team-create")
.setDescription("Create a team using a Discord role")
.addRoleOption(option =>
    option
    .setName("role")
    .setDescription("Team role")
    .setRequired(true)
),



new SlashCommandBuilder()
.setName("roster")
.setDescription("View your team roster")

];





async function execute(interaction){



// ================================
// OWNER PANEL
// ================================


if(interaction.commandName === "owner-panel"){


    if(!ownerPanel.isOwner(interaction.user.id)){


        return interaction.reply({

            content:"❌ Owner only.",

            ephemeral:true

        });


    }


    return interaction.reply(

        ownerPanel.getOwnerPanel()

    );


}





// ================================
// LEAGUE SETUP
// ================================


if(interaction.commandName === "league-setup"){


    if(!ownerPanel.isOwner(interaction.user.id)){


        return interaction.reply({

            content:"❌ Owner only.",

            ephemeral:true

        });


    }



    let names =

    interaction.options
    .getString("teams")
    .split(",")

    .map(t=>t.trim())

    .filter(Boolean);



    league.createLeague(names);



    return interaction.reply({

        embeds:[

            new EmbedBuilder()

            .setColor("#ff0055")

            .setTitle("🏆 VVLL League Created")

            .setDescription(

            `Teams added:\n\n${names.join("\n")}`

            )

        ]

    });


}






// ================================
// TEAM CREATE
// ================================


if(interaction.commandName === "team-create"){


    let role =

    interaction.options.getRole("role");



    let result = teams.createTeam(

        role.id,

        interaction.user.id

    );



    if(!result.success){


        return interaction.reply({

            content:
            result.message,

            ephemeral:true

        });


    }



    return interaction.reply({

        content:

        `✅ Team created: **${role.name}**`

    });


}






// ================================
// ROSTER
// ================================


if(interaction.commandName === "roster"){


    let team = teams.getManagerTeam(

        interaction.user.id

    );



    if(!team){


        return interaction.reply({

            content:

            "❌ You are not a manager.",

            ephemeral:true

        });


    }



    let players =

    team.players.length

    ?

    team.players.map(
        p=>`<@${p}>`
    ).join("\n")

    :

    "No players signed";



    return interaction.reply({

        embeds:[

            new EmbedBuilder()

            .setColor("#ff0055")

            .setTitle(

                `👥 ${team.name || "Team"} Roster`

            )

            .setDescription(players)

        ]

    });


}


}
// =====================================
// VVLL LEAGUE BOT
// COMMANDS.JS 2/3
// =====================================



commands.push(



new SlashCommandBuilder()

.setName("sign")

.setDescription("Send a contract to a player")

.addUserOption(option =>

option

.setName("player")

.setDescription("Player to sign")

.setRequired(true)

),




new SlashCommandBuilder()

.setName("my-stats")

.setDescription("View your player stats"),





new SlashCommandBuilder()

.setName("stats")

.setDescription("View player stats")

.addUserOption(option =>

option

.setName("player")

.setDescription("Player")

.setRequired(true)

)


);






// ================================
// SIGN PLAYER
// ================================


if(interaction.commandName === "sign"){


let player =

interaction.options.getUser("player");



let team =

teams.getManagerTeam(

interaction.user.id

);



if(!team){


return interaction.reply({

content:

"❌ You are not a team manager.",

ephemeral:true

});


}




if(team.players.length >= 15){


return interaction.reply({

content:

"❌ Your team already has the maximum 15 players.",

ephemeral:true

});


}




let result =

await contracts.sendContract(

player,

interaction.user,

team

);





return interaction.reply({

content:

result.message,

ephemeral:true

});


}







// ================================
// MY STATS
// ================================


if(interaction.commandName === "my-stats"){



let player =

database.db.players.find(

p => p.id === interaction.user.id

);





if(!player){


return interaction.reply({

content:

"❌ You have no stats yet.",

ephemeral:true

});


}




let team =

teams.getPlayerTeam(

interaction.user.id

);





return interaction.reply({


embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle("📊 Your VVLL Stats")

.setDescription(`

👤 Player:

${interaction.user}


🏆 Team:

${team ? team.name : "Free Agent"}


⚽ Goals:

${player.goals || 0}


🅰️ Assists:

${player.assists || 0}


🧤 Saves:

${player.saves || 0}


🧱 Blocks:

${player.blocks || 0}


🎮 Games:

${player.games || 0}

`)

]


});


}







// ================================
// PLAYER STATS
// ================================


if(interaction.commandName === "stats"){



let user =

interaction.options.getUser("player");



let player =

database.db.players.find(

p => p.id === user.id

);




if(!player){


return interaction.reply({

content:

"❌ No stats found.",

ephemeral:true

});


}



let team =

teams.getPlayerTeam(

user.id

);




return interaction.reply({


embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle("📊 Player Stats")

.setDescription(`

👤 ${user}


🏆 Team:

${team ? team.name : "Free Agent"}


⚽ Goals:

${player.goals || 0}


🅰️ Assists:

${player.assists || 0}


🧤 Saves:

${player.saves || 0}


🧱 Blocks:

${player.blocks || 0}


🎮 Games:

${player.games || 0}

`)

]


});


}
// =====================================
// VVLL LEAGUE BOT
// COMMANDS.JS 3/3
// =====================================



commands.push(



new SlashCommandBuilder()

.setName("create-game")

.setDescription("Create a league game")

.addStringOption(option =>

option

.setName("home")

.setDescription("Home team")

.setRequired(true)

)


.addStringOption(option =>

option

.setName("away")

.setDescription("Away team")

.setRequired(true)

),





new SlashCommandBuilder()

.setName("standings")

.setDescription("View VVLL standings"),





new SlashCommandBuilder()

.setName("results")

.setDescription("View league games")



);







// ================================
// CREATE GAME
// ================================


if(interaction.commandName === "create-game"){



let home =

interaction.options.getString("home");


let away =

interaction.options.getString("away");




let game = results.createGame(

home,

away

);




return interaction.reply({

embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle("⚽ Game Created")

.setDescription(`

🏠 Home:

${game.home}


🚌 Away:

${game.away}


Status:

Waiting for result.

`)

]


});


}







// ================================
// STANDINGS
// ================================


if(interaction.commandName === "standings"){



let table = standings.getStandings();




if(!table.length){


return interaction.reply(

"No teams in league."

);


}




let text = table.map(

(t,i)=>

`

**${i+1}. ${t.name}**

🏆 Points: ${t.points || 0}

⚽ Goals: ${t.goalsFor || 0}-${t.goalsAgainst || 0}

`

).join("\n");





return interaction.reply({


embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle("🏆 VVLL Standings")

.setDescription(text)

]


});



}







// ================================
// RESULTS
// ================================


if(interaction.commandName === "results"){



let games = results.getGames();




if(!games.length){


return interaction.reply(

"No games found."

);


}




let text = games.map(

(g,i)=>

`

${i+1}.

${g.home} vs ${g.away}


Score:

${g.homeScore}-${g.awayScore}


`

).join("\n");





return interaction.reply({


embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle("📋 VVLL Results")

.setDescription(text)

]


});



}








module.exports = {


commands,


execute


};