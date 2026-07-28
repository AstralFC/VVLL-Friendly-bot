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
// SLASH COMMANDS
// =====================================

const commands = [



// QUEUE

new SlashCommandBuilder()

.setName("queue")

.setDescription(
"Open a VVLL friendly queue"
),




// TEAM CREATE

new SlashCommandBuilder()

.setName("team-create")

.setDescription(
"Create a VVLL team"
)

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
.setDescription("Team manager")
.setRequired(true)
),




// TEAM INFO

new SlashCommandBuilder()

.setName("team-info")

.setDescription(
"View team information"
)

.addRoleOption(o =>
o.setName("team")
.setDescription("Team role")
.setRequired(true)
),





// MATCH CREATE

new SlashCommandBuilder()

.setName("match-create")

.setDescription(
"Create a VVLL match"
)

.addRoleOption(o =>
o.setName("home")
.setDescription("Home team")
.setRequired(true)
)

.addRoleOption(o =>
o.setName("away")
.setDescription("Away team")
.setRequired(true)
)

.addStringOption(o =>
o.setName("time")
.setDescription("Match time")
.setRequired(true)
),





// RESULT

new SlashCommandBuilder()

.setName("result")

.setDescription(
"Submit match result"
)

.addStringOption(o =>
o.setName("score")
.setDescription("Example 5-3")
.setRequired(true)
),





// STATS

new SlashCommandBuilder()

.setName("stats")

.setDescription(
"View player stats"
)

.addUserOption(o =>
o.setName("player")
.setDescription("Player")
.setRequired(true)
),





// STANDINGS

new SlashCommandBuilder()

.setName("standings")

.setDescription(
"View league table"
),




// SIGN PLAYER

new SlashCommandBuilder()

.setName("sign")

.setDescription(
"Send player contract"
)

.addUserOption(o =>
o.setName("player")
.setDescription("Player")
.setRequired(true)
)

.addRoleOption(o =>
o.setName("team")
.setDescription("Team")
.setRequired(true)
)



];




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

"1521671990505635965"

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

Nobody joined yet.

⏰ Time:
1 Hour

Click join to play.

`);



return interaction.reply({

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

points:0,

goals:0

});


database.save();



return interaction.reply({

content:
`✅ Created ${name}`

});


}




// ================================
// ADD 2/3 UNDER THIS LINE
// ================================
// =====================================
// VVLL LEAGUE BOT
// COMMANDS.JS 2/3
// =====================================


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

content:"❌ Team not found.",

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

🎭 Role:
<@&${team.role}>


👔 Manager:
<@${team.manager}>


👥 Players:
${team.players.length ? team.players.map(p=>`<@${p}>`).join("\n") : "No players yet"}


📊 Points:
${team.points}


⚽ Goals:
${team.goals}

`);



return interaction.reply({

embeds:[embed]

});

}




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

home:home.id,

away:away.id,

time:time,

status:"Scheduled"

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



return interaction.reply({

embeds:[embed]

});

}




// =====================================
// RESULT SYSTEM
// =====================================

if(
interaction.commandName==="result"
){


let score =
interaction.options.getString("score");



let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"📊 Match Result"
)

.setDescription(`

Final Score:

⚽ ${score}


Add player performances:

⚽ Goals

🧤 Saves

🧱 Blocks


Use the stats manager to record players.

`);



return interaction.reply({

embeds:[embed]

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

return interaction.reply({

content:
"❌ No stats found for this player.",

ephemeral:true

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



return interaction.reply({

embeds:[embed]

});

}




// =====================================
// ADD 3/3 UNDER THIS LINE
// =====================================
// =====================================
// VVLL LEAGUE BOT
// COMMANDS.JS 3/3
// =====================================



// =====================================
// STANDINGS
// =====================================

if(
interaction.commandName==="standings"
){


let teams =
database.db.teams;



if(!teams.length){

return interaction.reply({

content:
"❌ No teams created yet.",

ephemeral:true

});

}



let table =
teams
.sort(
(a,b)=>
(b.points||0)-(a.points||0)
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

.setTitle(
"🏆 VVLL STANDINGS"
)

.setDescription(table);



return interaction.reply({

embeds:[embed]

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
interaction.options.getRole("team");



let teamData =
database.db.teams.find(
t=>t.role===team.id
);



if(!teamData){

return interaction.reply({

content:
"❌ Team is not registered.",

ephemeral:true

});

}



let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"📄 VVLL CONTRACT OFFER"
)

.setDescription(`

⚽ You have received a signing offer!


🏆 Team:
${team}


👔 Manager:
<@${teamData.manager}>


Do you accept this contract?

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



} // closes run()




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