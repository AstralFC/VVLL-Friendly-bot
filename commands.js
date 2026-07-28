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
// PERMISSIONS
// =====================================

const STAFF_IDS = [

"1505021865985572940",

"1429837765281058876"

];



const STAFF_COMMANDS = [

"team-create",
"team-delete",
"owner-panel",
"reset-league",
"add-stats"

];




// =====================================
// COMMAND LIST
// =====================================

const commands = [



new SlashCommandBuilder()

.setName("queue")

.setDescription(
"Open VVLL friendly queue"
),




new SlashCommandBuilder()

.setName("team-create")

.setDescription(
"Create a team"
)

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

.setDescription(
"View team roster"
)

.addRoleOption(o=>

o.setName("team")

.setDescription("Team")

.setRequired(false)

),




new SlashCommandBuilder()

.setName("my-stats")

.setDescription(
"View your stats"
),




new SlashCommandBuilder()

.setName("stats")

.setDescription(
"View player stats"
)

.addUserOption(o=>

o.setName("player")

.setDescription("Player")

.setRequired(true)

),




new SlashCommandBuilder()

.setName("sign")

.setDescription(
"Send player contract"
)

.addUserOption(o=>

o.setName("player")

.setDescription("Player")

.setRequired(true)

),




new SlashCommandBuilder()

.setName("owner-panel")

.setDescription(
"Open owner dashboard"
),




new SlashCommandBuilder()

.setName("standings")

.setDescription(
"View standings"
)



];




// =====================================
// ADD 2/3 BELOW THIS LINE
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
"✅ VVLL Commands Loaded"
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

let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"⚽ VVLL FRIENDLY QUEUE"
)

.setDescription(`

🎮 Players:
No players yet


⏰ Timer:
1 Hour


Press join when ready.

`);



return interaction.editReply({

embeds:[embed]

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
"🏆 Team Created"
)

.setDescription(`

⚽ ${name}


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


let selected =
interaction.options.getRole("team");



let team;



if(selected){

team =
database.db.teams.find(
t=>t.role===selected.id
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




let players =
team.players.length

?

team.players.map(
p=>`<@${p}>`
).join("\n")

:

"No players";




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

${players}


Total:

${team.players.length}

`)

]

});

}





// =====================================
// ADD 3/3 BELOW THIS LINE
// =====================================
// =====================================
// VVLL LEAGUE BOT
// COMMANDS.JS 3/3
// =====================================



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
"❌ You don't have stats yet."

});

}



return interaction.editReply({

embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"📊 YOUR VVLL PROFILE"
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


⭐ Player Of Match:
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
"❌ No stats found."

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
"❌ You are not a registered manager."

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


Accept this contract below.

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
"📊 Stats"
)

.setStyle(
ButtonStyle.Primary
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


🏆 Manage Teams

📊 Edit Player Stats

📄 Contracts

⚽ Matches

🔄 Reset League

`)

],

components:[row]

});

}





// =====================================
// EXPORTS
// =====================================

}



module.exports={

commands,

register,

run

};