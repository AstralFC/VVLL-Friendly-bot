// =====================================
// VVLL LEAGUE BOT
// COMMANDS.JS 1/3
// =====================================

const {
SlashCommandBuilder,
EmbedBuilder,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle
}=require("discord.js");

const database = require("./database");


// =====================================
// PERMISSIONS
// =====================================

const OWNERS = [

"1505021865985572940",

"1429837765281058876"

];


// =====================================
// COMMAND LIST
// =====================================

const commands = [


new SlashCommandBuilder()
.setName("league-setup")
.setDescription("Setup VVLL league"),



new SlashCommandBuilder()
.setName("owner-panel")
.setDescription("Open owner panel"),



new SlashCommandBuilder()
.setName("team-create")
.setDescription("Create a team")
.addStringOption(o=>
o.setName("name")
.setDescription("Team name")
.setRequired(true)
)
.addRoleOption(o=>
o.setName("role")
.setDescription("Team role")
.setRequired(true)
)
.addUserOption(o=>
o.setName("manager")
.setDescription("Team manager")
.setRequired(true)
),



new SlashCommandBuilder()
.setName("roster")
.setDescription("View roster"),



new SlashCommandBuilder()
.setName("sign")
.setDescription("Send player contract")
.addUserOption(o=>
o.setName("player")
.setDescription("Player")
.setRequired(true)
),



new SlashCommandBuilder()
.setName("my-stats")
.setDescription("View your stats"),



new SlashCommandBuilder()
.setName("stats")
.setDescription("View player stats")
.addUserOption(o=>
o.setName("player")
.setDescription("Player")
.setRequired(true)
),



new SlashCommandBuilder()
.setName("standings")
.setDescription("View league standings")

];



// =====================================
// ADD 2/3 BELOW
// =====================================
// =====================================
// VVLL LEAGUE BOT
// COMMANDS.JS 2/3
// =====================================



// =====================================
// REGISTER COMMANDS
// =====================================

async function register(client){

const {
REST
}=require("@discordjs/rest");


const {
Routes
}=require("discord-api-types/v10");


const rest = new REST({

version:"10"

}).setToken(
process.env.TOKEN
);



await rest.put(

Routes.applicationGuildCommands(

client.user.id,

"1521671990505635965"

),

{

body:

commands.map(

cmd=>cmd.toJSON()

)

}

);



console.log(
"✅ VVLL COMMANDS REGISTERED"
);

}





// =====================================
// RUN COMMANDS
// =====================================

async function run(interaction){


await interaction.deferReply();





// =====================================
// LEAGUE SETUP
// OWNER + CO OWNER ONLY
// =====================================

if(
interaction.commandName==="league-setup"
){


if(
!OWNERS.includes(
interaction.user.id
)

){

return interaction.editReply({

content:
"❌ Only the owner and co-owner can setup VVLL."

});

}



database.db.settings={

league:"VVLL",

setup:true,

owner:interaction.user.id

};


database.save();



return interaction.editReply({

embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"⚽ VVLL SETUP COMPLETE"
)

.setDescription(`

✅ League Created


🏆 League:
VVLL


Systems:

✅ Teams

✅ Rosters

✅ Contracts

✅ Stats

✅ Standings


Setup by:
${interaction.user}

`)

]

});

}





// =====================================
// OWNER PANEL
// =====================================

if(
interaction.commandName==="owner-panel"
){

if(
!OWNERS.includes(
interaction.user.id
)

){

return interaction.editReply({

content:
"❌ Owner only."

});

}



let buttons =
new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId(
"manage_stats"
)

.setLabel(
"📊 Stats"
)

.setStyle(
ButtonStyle.Primary
),


new ButtonBuilder()

.setCustomId(
"manage_teams"
)

.setLabel(
"🏆 Teams"
)

.setStyle(
ButtonStyle.Secondary
),


new ButtonBuilder()

.setCustomId(
"reset_league"
)

.setLabel(
"🔄 Reset"
)

.setStyle(
ButtonStyle.Danger
)

);



return interaction.editReply({

embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"👑 VVLL OWNER PANEL"
)

.setDescription(`

League Control Center


🏆 Manage Teams

📊 Edit Stats

📄 Contracts

⚽ Matches

🔄 Reset League


`)

],

components:[buttons]

});

}





// =====================================
// CREATE TEAM
// =====================================

if(
interaction.commandName==="team-create"
){

if(
!OWNERS.includes(
interaction.user.id
)

){

return interaction.editReply({

content:
"❌ Owner only."

});

}



let name =
interaction.options.getString("name");


let role =
interaction.options.getRole("role");


let manager =
interaction.options.getUser("manager");




database.db.teams.push({

name:name,

role:role.id,

manager:manager.id,

players:[],

points:0,

wins:0,

draws:0,

losses:0

});



database.save();



return interaction.editReply({

embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"🏆 TEAM CREATED"
)

.setDescription(`

Team:
${name}


Manager:
${manager}


Role:
${role}


`)

]

});

}





// =====================================
// ROSTER
// =====================================

if(
interaction.commandName==="roster"
){

let team =
database.db.teams.find(

t=>t.manager===interaction.user.id

);



if(!team){

return interaction.editReply({

content:
"❌ You are not managing a team."

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



return interaction.editReply({

embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
`🏆 ${team.name} Roster`
)

.setDescription(`

👔 Manager:
<@${team.manager}>


Players:

${players}

`)

]

});

}





// ADD 3/3 BELOW
// =====================================
// VVLL LEAGUE BOT
// COMMANDS.JS 3/3
// =====================================


// =====================================
// SIGN PLAYER
// =====================================

if(
interaction.commandName==="sign"
){

let player =
interaction.options.getUser("player");



let team =
database.db.teams.find(

t=>t.manager===interaction.user.id

);



if(!team){

return interaction.editReply({

content:
"❌ You are not a team manager."

});

}



let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"📄 VVLL CONTRACT OFFER"
)

.setDescription(`

You received a contract offer!


🏆 Team:

${team.name}


👔 Manager:

<@${interaction.user.id}>


Press a button to accept or decline.

`);




let row =
new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId(
`accept_${team.role}_${player.id}`
)

.setLabel(
"✅ Accept"
)

.setStyle(
ButtonStyle.Success
),


new ButtonBuilder()

.setCustomId(
"decline_contract"
)

.setLabel(
"❌ Decline"
)

.setStyle(
ButtonStyle.Danger
)

);



await player.send({

embeds:[embed],

components:[row]

});



return interaction.editReply({

content:
`✅ Contract sent to ${player}`

});

}





// =====================================
// MY STATS
// =====================================

if(
interaction.commandName==="my-stats"
){

let player =
database.db.players.find(

p=>p.id===interaction.user.id

);



let team =
database.db.teams.find(

t=>t.players.includes(
interaction.user.id
)

);



if(!player){

return interaction.editReply({

content:
"❌ You have no stats yet."

});

}



return interaction.editReply({

embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"📊 YOUR VVLL STATS"
)

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


🏟 Games:
${player.games || 0}


⭐ POTM:
${player.potm || 0}

`)

]

});

}





// =====================================
// PLAYER STATS
// =====================================

if(
interaction.commandName==="stats"
){

let user =
interaction.options.getUser("player");


let player =
database.db.players.find(

p=>p.id===user.id

);



if(!player){

return interaction.editReply({

content:
"❌ Player stats not found."

});

}



return interaction.editReply({

embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"📊 PLAYER STATS"
)

.setDescription(`

👤 ${user}


⚽ Goals:
${player.goals || 0}


🅰️ Assists:
${player.assists || 0}


🧤 Saves:
${player.saves || 0}


🧱 Blocks:
${player.blocks || 0}


🏟 Games:
${player.games || 0}

`)

]

});

}





// =====================================
// STANDINGS
// =====================================

if(
interaction.commandName==="standings"
){

let teams =
database.db.teams;



let standings =

teams

.sort(
(a,b)=>b.points-a.points
)

.map((team,index)=>`

**${index+1}. ${team.name}**

🏆 Points: ${team.points || 0}

⚽ Goals: ${team.goals || 0}

🟢 Wins: ${team.wins || 0}

🔴 Losses: ${team.losses || 0}

`)

.join("\n");



return interaction.editReply({

embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"🏆 VVLL STANDINGS"
)

.setDescription(

standings || "No teams yet."

)

]

});

}





}



// =====================================
// EXPORTS
// =====================================

module.exports={

commands,

register,

run

};