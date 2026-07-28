// =====================================
// VVLL LEAGUE BOT
// COMMANDS.JS 1/3
// =====================================

const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const database = require("./database");


// OWNER

const OWNER_ID = "1505021865985572940";

const OWNER_COMMANDS = [
    "team-create",
    "team-delete",
    "owner-panel",
    "league-setup"
];




// COMMAND LIST

const commands = [


new SlashCommandBuilder()
.setName("queue")
.setDescription("Open VVLL friendly queue"),



new SlashCommandBuilder()
.setName("team-create")
.setDescription("Create a VVLL team")
.addStringOption(option =>
    option
    .setName("name")
    .setDescription("Team name")
    .setRequired(true)
)
.addRoleOption(option =>
    option
    .setName("role")
    .setDescription("Team role")
    .setRequired(true)
)
.addUserOption(option =>
    option
    .setName("manager")
    .setDescription("Team manager")
    .setRequired(true)
),



new SlashCommandBuilder()
.setName("team-info")
.setDescription("View team information")
.addRoleOption(option =>
    option
    .setName("team")
    .setDescription("Team role")
    .setRequired(true)
),



new SlashCommandBuilder()
.setName("match-create")
.setDescription("Create match")
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
    .setDescription("Timestamp")
    .setRequired(true)
),



new SlashCommandBuilder()
.setName("result")
.setDescription("Submit result")
.addStringOption(option =>
    option
    .setName("score")
    .setDescription("Example 5-2")
    .setRequired(true)
),



new SlashCommandBuilder()
.setName("stats")
.setDescription("View player stats")
.addUserOption(option =>
    option
    .setName("player")
    .setDescription("Player")
    .setRequired(true)
),



new SlashCommandBuilder()
.setName("standings")
.setDescription("View standings"),



new SlashCommandBuilder()
.setName("sign")
.setDescription("Sign a player")
.addUserOption(option =>
    option
    .setName("player")
    .setDescription("Player to sign")
    .setRequired(true)
),



new SlashCommandBuilder()
.setName("owner-panel")
.setDescription("Open owner panel")


];




// ADD 2/3 BELOW THIS LINE
// =====================================
// VVLL LEAGUE BOT
// COMMANDS.JS 2/3
// =====================================



// REGISTER COMMANDS

async function register(client){


const {
REST
}=require("@discordjs/rest");


const {
Routes
}=require("discord-api-types/v10");



const rest = new REST({

version:"10"

})
.setToken(process.env.TOKEN);



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
"✅ VVLL commands loaded"
);


}





// COMMAND HANDLER

async function run(interaction){



// PREVENT TIMEOUTS

await interaction.deferReply();




// OWNER CHECK

if(

OWNER_COMMANDS.includes(
interaction.commandName
)

&&

interaction.user.id !== OWNER_ID

){


return interaction.editReply({

content:
"❌ This command is owner only."

});


}




// QUEUE

if(
interaction.commandName==="queue"
){


let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"⚽ VVLL Friendly Queue"
)

.setDescription(`

🎮 Players:
Nobody joined yet


⏰ Expires:
1 Hour


Anyone can join.

`);



return interaction.editReply({

embeds:[embed]

});


}





// TEAM CREATE

if(
interaction.commandName==="team-create"
){


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

wins:0,

losses:0,

draws:0,

points:0,

goals:0

});


database.save();



let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"🏆 Team Created"
)

.setDescription(`

⚽ Team:
${name}


🎭 Role:
${role}


👔 Manager:
${manager}


Status:
✅ Active

`);



return interaction.editReply({

embeds:[embed]

});

}




// TEAM INFO

if(
interaction.commandName==="team-info"
){


let role =
interaction.options.getRole("team");



let team =
database.db.teams.find(
t=>t.role===role.id
);



if(!team){

return interaction.editReply({

content:
"❌ Team not found."

});

}




let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
`🏆 ${team.name}`
)

.setDescription(`

👔 Manager:
<@${team.manager}>


👥 Players:

${
team.players.length
?
team.players.map(
p=>`<@${p}>`
).join("\n")
:
"No players"
}


📊 Record

🟢 Wins:
${team.wins}

🟡 Draws:
${team.draws}

🔴 Losses:
${team.losses}


🏆 Points:
${team.points}

`);



return interaction.editReply({

embeds:[embed]

});

}




// ADD 3/3 BELOW THIS LINE
// =====================================
// VVLL LEAGUE BOT
// COMMANDS.JS 3/3
// =====================================



// MATCH CREATE

if(
interaction.commandName==="match-create"
){


let home =
interaction.options.getRole("home");


let away =
interaction.options.getRole("away");


let time =
interaction.options.getString("time");



database.db.matches.push({

home:home.id,

away:away.id,

time:time,

status:"scheduled"

});


database.save();



let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"⚽ VVLL MATCH"
)

.setDescription(`

🏠 Home:
${home}


🚌 Away:
${away}


⏰ Time:
${time}


Status:
🟡 Scheduled

`);



return interaction.editReply({

embeds:[embed]

});

}





// RESULT

if(
interaction.commandName==="result"
){

let score =
interaction.options.getString("score");



let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"🏆 Match Result"
)

.setDescription(`

Final Score:

⚽ ${score}


Player stats needed:

⚽ Goals

🧤 Saves

🧱 Blocks

`);



return interaction.editReply({

embeds:[embed]

});

}





// STATS

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
"❌ Player has no stats."

});

}



let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"📊 VVLL PLAYER STATS"
)

.setDescription(`

👤 ${user}


⚽ Goals:
${player.goals || 0}


🧤 Saves:
${player.saves || 0}


🧱 Blocks:
${player.blocks || 0}


🏟 Matches:
${player.matches || 0}

`);



return interaction.editReply({

embeds:[embed]

});

}





// STANDINGS

if(
interaction.commandName==="standings"
){

let teams =
database.db.teams;



let table =
teams
.sort(
(a,b)=>
b.points-a.points
)
.map((team,index)=>`

**${index+1}. ${team.name}**

🏆 Points:
${team.points || 0}

⚽ Goals:
${team.goals || 0}

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
table || "No teams yet"
)

]

});

}





// SIGN PLAYER

if(
interaction.commandName==="sign"
){

let player =
interaction.options.getUser("player");



// FIND MANAGER TEAM

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

⚽ Signing Offer


🏆 Team:
${team.name}


👔 Manager:
<@${interaction.user.id}>


Accept or decline in DM.

`);



try{


await player.send({

embeds:[embed]

});


}catch{


return interaction.editReply({

content:
"❌ I cannot DM this player."

});

}



return interaction.editReply({

content:
`✅ Contract sent to ${player}`

});

}





// OWNER PANEL

if(
interaction.commandName==="owner-panel"
){

return interaction.editReply({

embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"👑 VVLL OWNER PANEL"
)

.setDescription(`

🏆 Manage Teams

📄 Contracts

⚽ Matches

📊 Stats

`)

]

});

}



}



// EXPORTS

module.exports={

commands,

register,

run

};


// =====================================
// END COMMANDS.JS
// =====================================