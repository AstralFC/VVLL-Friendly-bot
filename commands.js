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

.setName("setup")

.setDescription(
"Create friendly queue"
),



new SlashCommandBuilder()

.setName("create-game")

.setDescription(
"Create a VVLL game"
)

.addRoleOption(option=>
option
.setName("home")
.setDescription("Home team")
.setRequired(true)
)

.addRoleOption(option=>
option
.setName("away")
.setDescription("Away team")
.setRequired(true)
)

.addStringOption(option=>
option
.setName("time")
.setDescription("Example: <t:1234567890:F>")
.setRequired(true)
),



new SlashCommandBuilder()

.setName("league-setup")

.setDescription(
"Create league fixtures"
),



new SlashCommandBuilder()

.setName("sign")

.setDescription(
"Sign a player"
)

.addUserOption(option=>
option
.setName("player")
.setDescription("Player to sign")
.setRequired(true)
)

.addRoleOption(option=>
option
.setName("team")
.setDescription("Team role")
.setRequired(true)
),



new SlashCommandBuilder()

.setName("result")

.setDescription(
"Add match result"
),



new SlashCommandBuilder()

.setName("stats")

.setDescription(
"View player stats"
),



new SlashCommandBuilder()

.setName("standings")

.setDescription(
"View standings"
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
command=>command.toJSON()
)

}

);



console.log(
"✅ VVLL commands registered"
);


}




// =================================
// COMMAND HANDLER
// =================================

async function run(interaction){



if(
interaction.commandName==="setup"
){


let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"⚽ VVLL Friendly Queue"
)

.setDescription(

"Nobody joined yet.\n\n⏰ Time: 1 Hour"

);



return interaction.reply({

embeds:[embed],

components:[]

});


}





if(
interaction.commandName==="create-game"
){


database.addMatch({

home:
interaction.options.getRole("home").id,


away:
interaction.options.getRole("away").id,


time:
interaction.options.getString("time")

});



let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"⚽ VVLL Match"
)

.setDescription(`

🏠 Home:
${interaction.options.getRole("home")}

🚌 Away:
${interaction.options.getRole("away")}

⏰ ${interaction.options.getString("time")}

`);



return interaction.reply({

embeds:[embed]

});


}




// ================================
// ADD PART 2/3 UNDER THIS LINE
// ================================
// =================================
// VVLL LEAGUE BOT
// COMMANDS.JS 2/3
// =================================


// ================================
// LEAGUE SETUP
// ================================

if(
interaction.commandName==="league-setup"
){


let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"🏆 VVLL League Setup"
)

.setDescription(
"League setup system ready.\n\nOwner panel will add teams here."
);



return interaction.reply({

embeds:[embed]

});


}




// ================================
// SIGN SYSTEM
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
"📄 VVLL Contract Offer"
)

.setDescription(`

You have received a contract.

🏆 Team:
${team}

👤 Manager:
${interaction.user}

Do you accept?

`);




database.db.contracts.push({

player:player.id,

team:team.id,

manager:interaction.user.id

});


database.save();



try{


await player.send({

embeds:[embed]

});


}catch{


return interaction.reply({

content:
"❌ Cannot DM this player.",

ephemeral:true

});


}



return interaction.reply({

content:
`✅ Contract sent to ${player}`,

ephemeral:true

});


}




// ================================
// RESULT
// ================================

if(
interaction.commandName==="result"
){


let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"⚽ VVLL Result"
)

.setDescription(`

Select:

🏠 Home Team

🚌 Away Team

Then add player stats:

⚽ Goals

🧤 Saves

🧱 Blocks

`);



return interaction.reply({

embeds:[embed],

ephemeral:true

});


}




// ================================
// STATS
// ================================

if(
interaction.commandName==="stats"
){


let players =
database.db.players;


if(players.length===0){


return interaction.reply({

content:
"❌ No stats yet.",

ephemeral:true

});


}



let text =
players.map(player=>`

👤 ${player.name}

⚽ Goals: ${player.goals}

🧤 Saves: ${player.saves}

🧱 Blocks: ${player.blocks}

`).join("\n");



let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"📊 VVLL Player Stats"
)

.setDescription(text);



return interaction.reply({

embeds:[embed]

});


}



// ================================
// ADD PART 3/3 UNDER THIS LINE
// ================================
// =================================
// VVLL LEAGUE BOT
// COMMANDS.JS 3/3
// =================================


// ================================
// STANDINGS
// ================================

if(
interaction.commandName==="standings"
){


let teams =
database.db.teams;



if(!teams || teams.length===0){


return interaction.reply({

content:
"❌ No teams created yet.",

ephemeral:true

});


}



let table =
teams.map((team,index)=>`

${index+1}. ${team.name}

🏆 Points: ${team.points || 0}

⚽ Goals: ${team.goals || 0}

`).join("\n");




let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"🏆 VVLL Standings"
)

.setDescription(table);



return interaction.reply({

embeds:[embed]

});


}



}



// =================================
// EXPORTS
// =================================

module.exports={

commands,

register,

run

};


// =================================
// END OF COMMANDS.JS
// =================================