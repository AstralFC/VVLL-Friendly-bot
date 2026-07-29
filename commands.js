// =====================================
// VVLL LEAGUE BOT
// COMMANDS.JS
// =====================================

const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const config = require("./config");
const database = require("./database");
const league = require("./league");
const teams = require("./teams");
const contracts = require("./contracts");
const results = require("./results");
const standings = require("./standings");
const ownerPanel = require("./ownerPanel");



const commands = [

    new SlashCommandBuilder()
    .setName("owner-panel")
    .setDescription("Open owner panel"),


    new SlashCommandBuilder()
    .setName("league-setup")
    .setDescription("Setup league")
    .addStringOption(option =>
        option
        .setName("teams")
        .setDescription("Teams separated by commas")
        .setRequired(true)
    ),


    new SlashCommandBuilder()
    .setName("team-create")
    .setDescription("Create a team")
    .addRoleOption(option =>
        option
        .setName("role")
        .setDescription("Team role")
        .setRequired(true)
    ),


    new SlashCommandBuilder()
    .setName("roster")
    .setDescription("View your roster"),


    new SlashCommandBuilder()
    .setName("sign")
    .setDescription("Send a contract")
    .addUserOption(option =>
        option
        .setName("player")
        .setDescription("Player")
        .setRequired(true)
    ),


    new SlashCommandBuilder()
    .setName("my-stats")
    .setDescription("View your stats"),


    new SlashCommandBuilder()
    .setName("create-game")
    .setDescription("Create a game")
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
    .setDescription("View standings"),


    new SlashCommandBuilder()
    .setName("results")
    .setDescription("View results")

];





async function execute(interaction){


try{


// OWNER PANEL

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







// LEAGUE SETUP

if(interaction.commandName === "league-setup"){


if(!ownerPanel.isOwner(interaction.user.id)){

return interaction.reply({
content:"❌ Owner only.",
ephemeral:true
});

}



let teamsList =
interaction.options
.getString("teams")
.split(",")
.map(x=>x.trim());



league.createLeague(teamsList);



return interaction.reply({

content:
"✅ League setup complete."

});


}







// TEAM CREATE

if(interaction.commandName === "team-create"){


let role =
interaction.options.getRole("role");



let result =
teams.createTeam(
role.id,
interaction.user.id
);



return interaction.reply({

content:
result.success
?
`✅ Created ${role.name}`
:
result.message

});


}







// ROSTER

if(interaction.commandName === "roster"){


let team =
teams.getManagerTeam(
interaction.user.id
);



if(!team){

return interaction.reply({
content:"❌ No team found.",
ephemeral:true
});

}



return interaction.reply({

embeds:[

new EmbedBuilder()

.setTitle(`👥 ${team.name || "Roster"}`)

.setDescription(

team.players.length

?

team.players.map(
p=>`<@${p}>`
).join("\n")

:

"No players"

)

]

});


}







// SIGN

if(interaction.commandName === "sign"){


let player =
interaction.options.getUser("player");



let team =
teams.getManagerTeam(
interaction.user.id
);



if(!team){

return interaction.reply({
content:"❌ You are not a manager.",
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







// CREATE GAME

if(interaction.commandName === "create-game"){


let game =
results.createGame(

interaction.options.getString("home"),

interaction.options.getString("away")

);



return interaction.reply({

content:
`✅ Game created: ${game.home} vs ${game.away}`

});


}







// STANDINGS

if(interaction.commandName === "standings"){


let table =
standings.getStandings();



return interaction.reply({

embeds:[

new EmbedBuilder()

.setTitle("🏆 VVLL Standings")

.setDescription(

table.length

?

table.map((t,i)=>
`${i+1}. ${t.name} - ${t.points || 0} pts`
).join("\n")

:

"No teams"

)

]

});


}







// RESULTS

if(interaction.commandName === "results"){


let games =
results.getGames();



return interaction.reply({

content:
games.length
?
games.map(
g=>`${g.home} ${g.homeScore}-${g.awayScore} ${g.away}`
).join("\n")
:
"No games"

});


}






}

catch(error){

console.log(error);


if(!interaction.replied){

await interaction.reply({

content:"❌ Something went wrong.",

ephemeral:true

});

}

}


}





module.exports = {

commands,

execute

};