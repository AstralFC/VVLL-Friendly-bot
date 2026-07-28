// =================================
// VVLL LEAGUE BOT
// COMMANDS.JS 1/3
// =================================

const {
SlashCommandBuilder,
EmbedBuilder
} = require("discord.js");

const database = require("./database");



// =================================
// COMMAND LIST
// =================================

const commands = [


new SlashCommandBuilder()

.setName("queue")

.setDescription(
"Open VVLL friendly queue"
),



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



new SlashCommandBuilder()

.setName("result")

.setDescription(
"Submit match result"
)

.addStringOption(o=>
o.setName("score")
.setDescription("Example: 5-3")
.setRequired(true)
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

.setName("standings")

.setDescription(
"View VVLL standings"
),



new SlashCommandBuilder()

.setName("sign")

.setDescription(
"Send player contract"
)

.addUserOption(o=>
o.setName("player")
.setDescription("Player to sign")
.setRequired(true)
)

.addRoleOption(o=>
o.setName("team")
.setDescription("Team role")
.setRequired(true)
)


];




// =================================
// REGISTER COMMANDS
// =================================

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
"✅ VVLL Commands Loaded"
);


}




// =================================
// COMMAND HANDLER
// =================================

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

.setDescription(

`
Nobody joined yet.

⏰ Queue expires:
1 Hour

Players receive:
🎮 Friendly role
`

);



return interaction.reply({

embeds:[embed]

});


}




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



let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"🏆 VVLL Match"
)

.setDescription(

`
🏠 Home:
${home}


🚌 Away:
${away}


⏰ Time:
${time}


Status:
🟡 Waiting
`

);



database.db.matches.push({

home:home.id,

away:away.id,

time:time

});


database.save();



return interaction.reply({

embeds:[embed]

});


}



// ================================
// ADD 2/3 UNDER THIS LINE
// ================================
// =================================
// VVLL LEAGUE BOT
// COMMANDS.JS 2/3
// =================================



// ================================
// MATCH RESULT
// ================================

if(
interaction.commandName==="result"
){


let score =
interaction.options.getString("score");



let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"⚽ VVLL Match Result"
)

.setDescription(

`
Final Score:

${score}


Add player performances:

⚽ Goals

🧤 Saves

🧱 Blocks


Use the stats panel to add players.
`

);



return interaction.reply({

embeds:[embed]

});


}





// ================================
// PLAYER STATS
// ================================

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
"❌ This player has no stats yet.",

ephemeral:true

});


}




let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"📊 VVLL Player Stats"
)

.setDescription(

`
👤 ${user}


⚽ Goals:
${player.goals || 0}


🧤 Saves:
${player.saves || 0}


🧱 Blocks:
${player.blocks || 0}


🏆 Matches:
${player.matches || 0}

`

);



return interaction.reply({

embeds:[embed]

});


}





// ================================
// STANDINGS
// ================================

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
teams.map((team,i)=>`

**${i+1}. ${team.name}**

🏆 Points: ${team.points || 0}

⚽ Goals: ${team.goals || 0}

`).join("\n");



let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"🏆 VVLL League Table"
)

.setDescription(table);



return interaction.reply({

embeds:[embed]

});


}





// ================================
// SIGN CONTRACT
// ================================

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

.setTitle(
"📄 VVLL CONTRACT OFFER"
)

.setDescription(

`
⚽ You have received a contract offer.


🏆 Team:
${team}


👤 Manager:
${interaction.user}


Press accept or decline.

`

);



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



// ================================
// ADD 3/3 UNDER THIS LINE
// ================================
// =================================
// VVLL LEAGUE BOT
// COMMANDS.JS 3/3
// =================================


// ================================
// CLOSE COMMAND HANDLER
// ================================

}



// ================================
// EXPORTS
// ================================

module.exports = {

commands,

register,

run

};


// =================================
// END COMMANDS.JS
// =================================