// =====================================
// VVLL LEAGUE BOT
// COMMANDS.JS 1/3
// =====================================

const {
SlashCommandBuilder,
EmbedBuilder
} = require("discord.js");

const database = require("./database");


// =====================================
// OWNER SETTINGS
// =====================================

const OWNER_ID = "1505021865985572940";

const OWNER_COMMANDS = [

"team-create",
"team-delete",
"owner-panel",
"league-setup"

];




// =====================================
// COMMAND LIST
// =====================================

const commands = [


// FRIENDLY QUEUE

new SlashCommandBuilder()

.setName("queue")

.setDescription(
"Open VVLL friendly queue"
),



// CREATE TEAM

new SlashCommandBuilder()

.setName("team-create")

.setDescription(
"Create a VVLL team"
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




// TEAM INFO

new SlashCommandBuilder()

.setName("team-info")

.setDescription(
"View team information"
)

.addRoleOption(o=>
o.setName("team")
.setDescription("Team role")
.setRequired(true)
),




// CREATE MATCH

new SlashCommandBuilder()

.setName("match-create")

.setDescription(
"Create a VVLL match"
)

.addRoleOption(o=>
o.setName("home")
.setDescription("Home team")
.setRequired(true)
)

.addRoleOption(o=>
o.setName("away")
.setDescription("Away team")
.setRequired(true)
)

.addStringOption(o=>
o.setName("time")
.setDescription("Match timestamp")
.setRequired(true)
),




// RESULT

new SlashCommandBuilder()

.setName("result")

.setDescription(
"Submit match result"
)

.addStringOption(o=>
o.setName("score")
.setDescription("Example 4-2")
.setRequired(true)
),




// PLAYER STATS

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




// STANDINGS

new SlashCommandBuilder()

.setName("standings")

.setDescription(
"View league standings"
),




// CONTRACT

new SlashCommandBuilder()

.setName("sign")

.setDescription(
"Send player contract"
)

.addUserOption(o=>
o.setName("player")
.setDescription("Player")
.setRequired(true)
)

.addRoleOption(o=>
o.setName("team")
.setDescription("Team")
.setRequired(true)
),



// OWNER PANEL

new SlashCommandBuilder()

.setName("owner-panel")

.setDescription(
"Open VVLL owner panel"
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



const rest =
new REST({

version:"10"

})
.setToken(process.env.TOKEN);



await rest.put(

Routes.applicationGuildCommands(

client.user.id,

"1521671990505632940"

),

{

body:
commands.map(
c=>c.toJSON()
)

}

);



console.log(
"✅ VVLL Commands Registered"
);


}





// =====================================
// COMMAND HANDLER
// =====================================

async function run(interaction){



// OWNER CHECK

if(

OWNER_COMMANDS.includes(
interaction.commandName
)

&&

interaction.user.id !== OWNER_ID

){


return interaction.reply({

content:
"❌ This command is owner only.",

ephemeral:true

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
"⚽ VVLL Friendly Queue"
)

.setDescription(`

Players:

Nobody joined yet.


⏰ Expires:
1 Hour


Everyone can join.

`);



return interaction.reply({

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

points:0,

wins:0,

losses:0,

draws:0,

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



return interaction.reply({

embeds:[embed]

});


}





// =====================================
// TEAM INFO
// =====================================

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

return interaction.reply({

content:
"❌ Team not found.",

ephemeral:true

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
"None"
}


📊 Record:

🟢 Wins:
${team.wins}

🟡 Draws:
${team.draws}

🔴 Losses:
${team.losses}


⚽ Goals:
${team.goals}

`);



return interaction.reply({

embeds:[embed]

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
// MATCH CREATE
// =====================================

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

home: home.id,

away: away.id,

time: time,

status:"Scheduled"

});


database.save();



let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle("⚽ VVLL MATCH")

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



return interaction.reply({

embeds:[embed]

});

}




// =====================================
// RESULT
// =====================================

if(
interaction.commandName==="result"
){

let score =
interaction.options.getString("score");



let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle("🏆 Match Result")

.setDescription(`

Final Score:

⚽ ${score}


Player stats:

⚽ Goals

🧤 Saves

🧱 Blocks

`);



return interaction.reply({

embeds:[embed]

});

}




// =====================================
// STATS
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

return interaction.reply({

content:
"❌ Player has no stats yet.",

ephemeral:true

});

}



let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle("📊 VVLL PLAYER STATS")

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



return interaction.reply({

embeds:[embed]

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
(a,b)=>
b.points-a.points
)
.map((team,index)=>`

**${index+1}. ${team.name}**

🏆 Points: ${team.points || 0}

⚽ Goals: ${team.goals || 0}

`)
.join("\n");



let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle("🏆 VVLL STANDINGS")

.setDescription(table || "No teams");



return interaction.reply({

embeds:[embed]

});

}




// =====================================
// OWNER PANEL
// =====================================

if(
interaction.commandName==="owner-panel"
){

let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle("👑 VVLL OWNER PANEL")

.setDescription(`

Manage:

🏆 Teams

👥 Managers

📄 Contracts

⚽ Matches

📊 Stats

`);



return interaction.reply({

embeds:[embed],

ephemeral:true

});

}




// =====================================
// SIGN CONTRACT
// =====================================

if(
interaction.commandName==="sign"
){

let player =
interaction.options.getUser("player");


let team =
interaction.options.getRole("team");



let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle("📄 VVLL CONTRACT OFFER")

.setDescription(`

⚽ Contract Offer


🏆 Team:
${team}


👤 Player:
${player}


Press accept or decline.

`);



database.db.contracts.push({

player:player.id,

team:team.id,

manager:interaction.user.id

});


database.save();



return interaction.reply({

content:
`✅ Contract sent to ${player}`,

ephemeral:true

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


// =====================================
// END COMMANDS.JS
// =====================================