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

.setDescription(
"Create and setup VVLL league"
),




new SlashCommandBuilder()

.setName("owner-panel")

.setDescription(
"Open VVLL owner panel"
),




new SlashCommandBuilder()

.setName("team-create")

.setDescription(
"Create a team"
)

.addStringOption(option=>

option

.setName("name")

.setDescription("Team name")

.setRequired(true)

)

.addRoleOption(option=>

option

.setName("role")

.setDescription("Team role")

.setRequired(true)

)

.addUserOption(option=>

option

.setName("manager")

.setDescription("Team manager")

.setRequired(true)

),




new SlashCommandBuilder()

.setName("roster")

.setDescription(
"View your team roster"
),




new SlashCommandBuilder()

.setName("sign")

.setDescription(
"Send a player contract"
)

.addUserOption(option=>

option

.setName("player")

.setDescription("Player to sign")

.setRequired(true)

),




new SlashCommandBuilder()

.setName("my-stats")

.setDescription(
"View your stats"
),




new SlashCommandBuilder()

.setName("stats")

.setDescription(
"View another players stats"
)

.addUserOption(option=>

option

.setName("player")

.setDescription("Player")

.setRequired(true)

),




new SlashCommandBuilder()

.setName("standings")

.setDescription(
"View league standings"
),




new SlashCommandBuilder()

.setName("schedule")

.setDescription(
"View league schedule"
)

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

.setToken(

process.env.TOKEN

);



try{


await rest.put(

Routes.applicationGuildCommands(

client.user.id,

"1521671990505635965"

),

{

body:

commands.map(

command=>command.toJSON()

)

}

);



console.log(
"✅ VVLL COMMANDS REGISTERED"
);



}

catch(error){

console.log(error);

}


}






// =====================================
// COMMAND HANDLER
// =====================================


async function run(interaction){



try{



await interaction.deferReply();






// =====================================
// LEAGUE SETUP
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

"❌ Only the owner/co-owner can use this."

});

}




database.db.settings={

league:"VVLL",

active:true,

createdBy:

interaction.user.id

};



database.save();



return interaction.editReply({

embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"⚽ VVLL READY"
)

.setDescription(`

League setup completed.


🏆 League:
VVLL


👑 Created by:
${interaction.user}


Systems:

✅ Teams

✅ Contracts

✅ Stats

✅ Standings

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





const buttons =

new ActionRowBuilder()

.addComponents(



new ButtonBuilder()

.setCustomId(
"league_setup"
)

.setLabel(
"⚽ League Setup"
)

.setStyle(
ButtonStyle.Primary
),



new ButtonBuilder()

.setCustomId(
"manage_stats"
)

.setLabel(
"📊 Stats"
)

.setStyle(
ButtonStyle.Success
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
"view_schedule"
)

.setLabel(
"📅 Schedule"
)

.setStyle(
ButtonStyle.Primary
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


⚽ Setup league

📊 Manage stats

🏆 Manage teams

📅 View schedule

🔄 Reset


`)

],

components:[buttons]

});

}








// =====================================
// TEAM CREATE
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

"❌ Only owner/co-owner."

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

losses:0,

goals:0

});



database.save();



return interaction.editReply({

content:

`✅ Created team **${name}** with manager ${manager}`

});


}




// ADD 3/3 BELOW
// =====================================
// VVLL LEAGUE BOT
// COMMANDS.JS 3/3
// =====================================



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
"❌ You are not a team manager."

});

}



let players =

team.players.length

?

team.players
.map(
p=>`<@${p}>`
)
.join("\n")

:

"No players signed yet";




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





let embed =

new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"📄 VVLL CONTRACT"
)

.setDescription(`

🏆 Team:

${team.name}


👔 Manager:

${interaction.user}


Do you accept this contract?

`);




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



if(!player){

return interaction.editReply({

content:

"❌ No stats found."

});

}




let team =

database.db.teams.find(

t=>t.players.includes(

interaction.user.id

)

);



return interaction.editReply({

embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"📊 YOUR STATS"
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


⭐ POTM:
${player.potm || 0}

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


let list =

database.db.teams

.sort(

(a,b)=>b.points-a.points

)

.map(

(t,i)=>

`${i+1}. **${t.name}** - ${t.points || 0} pts`

)

.join("\n");



return interaction.editReply({

embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"🏆 VVLL STANDINGS"
)

.setDescription(

list || "No teams created."

)

]

});

}





// =====================================
// SCHEDULE
// =====================================

if(
interaction.commandName==="schedule"
){


let matches =

database.db.matches;



if(!matches || !matches.length){

return interaction.editReply({

content:

"❌ No matches scheduled."

});

}




let text =

matches.slice(0,15)

.map(

(m,i)=>

`${i+1}. ${m.home} vs ${m.away}\n<t:${m.time}:F>`

)

.join("\n\n");



return interaction.editReply({

embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"📅 VVLL SCHEDULE"
)

.setDescription(text)

]

});

}





}catch(error){

console.log(error);


if(interaction.deferred){

return interaction.editReply({

content:

"❌ Command error."

});

}


}





}


// =====================================
// EXPORT
// =====================================

module.exports = {

commands,

register,

run

};