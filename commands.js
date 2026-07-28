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
} = require("discord.js");

const database = require("./database");


// =====================================
// STAFF
// =====================================

const STAFF_IDS = [
    "1505021865985572940",
    "1429837765281058876"
];


const STAFF_COMMANDS = [
    "team-create",
    "owner-panel",
    "add-stats",
    "reset-league"
];



// =====================================
// COMMANDS
// =====================================

const commands = [


new SlashCommandBuilder()
.setName("queue")
.setDescription("Open VVLL friendly queue"),



new SlashCommandBuilder()
.setName("team-create")
.setDescription("Create a team")
.addStringOption(o =>
    o.setName("name")
    .setDescription("Team name")
    .setRequired(true)
)
.addRoleOption(o =>
    o.setName("role")
    .setDescription("Team role")
    .setRequired(true)
)
.addUserOption(o =>
    o.setName("manager")
    .setDescription("Manager")
    .setRequired(true)
),



new SlashCommandBuilder()
.setName("roster")
.setDescription("View roster")
.addRoleOption(o =>
    o.setName("team")
    .setDescription("Team")
    .setRequired(false)
),



new SlashCommandBuilder()
.setName("sign")
.setDescription("Send contract")
.addUserOption(o =>
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
.addUserOption(o =>
    o.setName("player")
    .setDescription("Player")
    .setRequired(true)
),



new SlashCommandBuilder()
.setName("add-stats")
.setDescription("Add player stats")
.addUserOption(o =>
    o.setName("player")
    .setDescription("Player")
    .setRequired(true)
)
.addIntegerOption(o =>
    o.setName("goals")
    .setDescription("Goals")
)
.addIntegerOption(o =>
    o.setName("assists")
    .setDescription("Assists")
)
.addIntegerOption(o =>
    o.setName("saves")
    .setDescription("Saves")
)
.addIntegerOption(o =>
    o.setName("blocks")
    .setDescription("Blocks")
),



new SlashCommandBuilder()
.setName("standings")
.setDescription("View standings"),



new SlashCommandBuilder()
.setName("owner-panel")
.setDescription("Open owner dashboard")

];


// ADD 2/3 BELOW
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

})
.setToken(process.env.TOKEN);



await rest.put(

Routes.applicationGuildCommands(

client.user.id,

"1521671990505635965"

),

{

body: commands.map(
cmd=>cmd.toJSON()
)

}

);


console.log(
"✅ VVLL COMMANDS ONLINE"
);

}





// =====================================
// COMMAND HANDLER
// =====================================

async function run(interaction){


await interaction.deferReply();



// STAFF CHECK

if(

STAFF_COMMANDS.includes(
interaction.commandName
)

&&

!STAFF_IDS.includes(
interaction.user.id
)

){

return interaction.editReply({

content:
"❌ You do not have permission."

});

}





// =====================================
// QUEUE
// =====================================

if(
interaction.commandName==="queue"
){

return interaction.editReply({

embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"⚽ VVLL FRIENDLY QUEUE"
)

.setDescription(`

🎮 Players:
No players yet


⏰ Status:
Open


Waiting for players...

`)

]

});

}





// =====================================
// TEAM CREATE
// =====================================

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

draws:0,

losses:0,

points:0,

goals:0

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

⚽ Team:
${name}


👔 Manager:
${manager}


🎭 Role:
${role}


Status:
✅ Active

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

let role =
interaction.options.getRole("team");



let team;



if(role){

team =
database.db.teams.find(
t=>t.role===role.id
);


}else{


team =
database.db.teams.find(
t=>t.manager===interaction.user.id
);


}



if(!team){

return interaction.editReply({

content:
"❌ Team not found."

});

}




let list =

team.players.length

?

team.players
.map(
p=>`<@${p}>`
)
.join("\n")

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


👥 Players:

${list}


Total Players:
${team.players.length}

`)

]

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
"❌ No stats found."

});

}



return interaction.editReply({

embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"📊 PLAYER PROFILE"
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
"❌ No stats found for this player."

});

}



return interaction.editReply({

embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle("📊 PLAYER STATS")

.setDescription(`

👤 Player:
${user}


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
// ADD STATS
// =====================================

if(
interaction.commandName==="add-stats"
){

let user =
interaction.options.getUser("player");


let player =
database.db.players.find(
p=>p.id===user.id
);



if(!player){

player={

id:user.id,

goals:0,

assists:0,

saves:0,

blocks:0,

games:0

};


database.db.players.push(player);

}



player.goals += 
interaction.options.getInteger("goals") || 0;


player.assists += 
interaction.options.getInteger("assists") || 0;


player.saves += 
interaction.options.getInteger("saves") || 0;


player.blocks += 
interaction.options.getInteger("blocks") || 0;



database.save();



return interaction.editReply({

content:
`✅ Updated stats for ${user}`

});

}





// =====================================
// SIGN PLAYER
// =====================================

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

You have received a contract offer!


🏆 Team:
${team.name}


👔 Manager:
<@${interaction.user.id}>


Press a button below.

`);




let buttons =
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

components:[buttons]

});



return interaction.editReply({

content:
`✅ Contract sent to ${player}`

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


let table =

teams

.sort(
(a,b)=>b.points-a.points
)

.map((t,i)=>`

**${i+1}. ${t.name}**

🏆 Points: ${t.points || 0}

⚽ Goals: ${t.goals || 0}

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
table || "No teams created."
)

]

});

}





// =====================================
// OWNER PANEL
// =====================================

if(
interaction.commandName==="owner-panel"
){

let row =
new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId(
"manage_stats"
)

.setLabel(
"📊 Manage Stats"
)

.setStyle(
ButtonStyle.Primary
),


new ButtonBuilder()

.setCustomId(
"manage_teams"
)

.setLabel(
"🏆 Manage Teams"
)

.setStyle(
ButtonStyle.Secondary
),


new ButtonBuilder()

.setCustomId(
"reset_league"
)

.setLabel(
"🔄 Reset League"
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

League Dashboard

🏆 Teams

📊 Player Stats

📄 Contracts

⚽ Matches

🔄 Reset League

`)

],

components:[row]

});

}



}



// =====================================
// EXPORTS
// =====================================

module.exports = {

commands,

register,

run

};