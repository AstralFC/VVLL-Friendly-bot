console.log("✅ NEW COMMANDS.JS LOADED");
// ===============================
// VVLL LEAGUE BOT
// COMMANDS.JS 1/3
// ===============================

const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const database = require("./database");


// ===============================
// COMMAND LIST
// ===============================

const commands = [

new SlashCommandBuilder()
.setName("setup")
.setDescription("Create VVLL friendly queue"),


new SlashCommandBuilder()
.setName("create-game")
.setDescription("Create a VVLL match")
.addRoleOption(o =>
o.setName("home")
.setDescription("Home team")
.setRequired(true))
.addRoleOption(o =>
o.setName("away")
.setDescription("Away team")
.setRequired(true))
.addStringOption(o =>
o.setName("time")
.setDescription("Discord timestamp")
.setRequired(true)),


new SlashCommandBuilder()
.setName("league-setup")
.setDescription("Setup VVLL league")
.addRoleOption(o=>o.setName("team1").setDescription("Team 1").setRequired(true))
.addRoleOption(o=>o.setName("team2").setDescription("Team 2").setRequired(true))
.addRoleOption(o=>o.setName("team3").setDescription("Team 3").setRequired(true))
.addRoleOption(o=>o.setName("team4").setDescription("Team 4").setRequired(true))
.addRoleOption(o=>o.setName("team5").setDescription("Team 5").setRequired(true))
.addRoleOption(o=>o.setName("team6").setDescription("Team 6").setRequired(true))
.addRoleOption(o=>o.setName("team7").setDescription("Team 7").setRequired(true))
.addRoleOption(o=>o.setName("team8").setDescription("Team 8").setRequired(true)),


new SlashCommandBuilder()
.setName("sign")
.setDescription("Sign a player")
.addUserOption(o =>
o.setName("player")
.setDescription("Player")
.setRequired(true))
.addRoleOption(o =>
o.setName("team")
.setDescription("Team")
.setRequired(true)),


new SlashCommandBuilder()
.setName("result")
.setDescription("Submit match result"),


new SlashCommandBuilder()
.setName("standings")
.setDescription("View standings"),


new SlashCommandBuilder()
.setName("stats")
.setDescription("View player stats")

];




// ===============================
// REGISTER COMMANDS
// ===============================

async function register(client){


const {REST}=require("@discordjs/rest");
const {Routes}=require("discord-api-types/v10");


const rest = new REST({
version:"10"
})
.setToken(process.env.TOKEN);

console.log("COMMANDS:", commands.map(c => c.name));

await rest.put(

Routes.applicationGuildCommands(
client.user.id,
"1521671990505635965"
),

{
body:commands.map(c=>c.toJSON())
}

);


console.log("VVLL commands loaded");


}





// ===============================
// COMMAND HANDLER
// ===============================

async function run(interaction){



if(interaction.commandName==="setup"){


let embed = new EmbedBuilder()

.setColor("#ff0055")

.setTitle("⚽ VVLL Friendly Queue")

.setDescription(

`
Nobody joined yet.

⏰ Timer: 1 Hour

Anyone can join.
`

);



let buttons = new ActionRowBuilder()

.addComponents(

new ButtonBuilder()
.setCustomId("queue_join")
.setLabel("✅ Join")
.setStyle(ButtonStyle.Success),


new ButtonBuilder()
.setCustomId("queue_leave")
.setLabel("❌ Leave")
.setStyle(ButtonStyle.Danger)

);



return interaction.reply({

embeds:[embed],

components:[buttons]

});


}



if(interaction.commandName==="create-game"){


let game={

home:interaction.options.getRole("home").id,

away:interaction.options.getRole("away").id,

time:interaction.options.getString("time"),

format:interaction.options.getString("format"),

stage:interaction.options.getString("stage"),

ref:null

};


database.addMatch(game);



let embed=new EmbedBuilder()

.setColor("#ff0055")

.setTitle("⚽ VVLL Match")

.setDescription(`

🏠 Home:
${interaction.options.getRole("home")}

🚌 Away:
${interaction.options.getRole("away")}

📋 ${game.format}

🏆 ${game.stage}

⏰ ${game.time}

🧑‍⚖️ Ref Needed

`);



return interaction.reply({

embeds:[embed]

});


}


}

module.exports={
commands,
register,
run
};
// ===============================
// LEAGUE SETUP
// ===============================

if(interaction.commandName==="league-setup"){


let teams=[];


for(let i=1;i<=8;i++){

let role =
interaction.options.getRole(`team${i}`);


teams.push({

id:role.id,
name:role.name

});


}


// Shuffle teams

teams.sort(
()=>Math.random()-0.5
);



let games=[];


for(let i=0;i<teams.length;i+=2){


games.push({

id:games.length+1,

home:teams[i],

away:teams[i+1],

time:"Not Set",

stage:"League",

homeScore:0,

awayScore:0

});


}



database.db.league={

teams,

games

};


database.save();



let fixtures =
games.map(game=>{


return `

⚽ **Game ${game.id}**

🏠 ${game.home.name}

🚌 ${game.away.name}

📅 Time: Not Set

`;

}).join("\n────────────");




let embed=new EmbedBuilder()

.setColor("#ff0055")

.setTitle("🏆 VVLL League Created")

.setDescription(`

Teams:

${teams.map(t=>
`• ${t.name}`
).join("\n")}


Fixtures:

${fixtures}

`);




return interaction.reply({

embeds:[embed]

});





// ===============================
// SIGN SYSTEM
// ===============================


if(interaction.commandName==="sign"){


let player =
interaction.options.getUser("player");


let team =
interaction.options.getRole("team");



let embed=new EmbedBuilder()

.setColor("#ff0055")

.setTitle("📄 VVLL Signing Contract")

.setDescription(`

You received a contract offer.

🏆 Team:
${team}


Manager:
${interaction.user}


Do you accept?

`);




let buttons=new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId(
`accept_contract_${team.id}`
)

.setLabel("✅ Accept")

.setStyle(ButtonStyle.Success),


new ButtonBuilder()

.setCustomId("decline_contract")

.setLabel("❌ Decline")

.setStyle(ButtonStyle.Danger)

);


}

try {


await player.send({

embeds:[embed],

components:[buttons]

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
// ===============================
// MATCH RESULT
// ===============================

if(interaction.commandName==="result"){


let games =
database.db.league.games;


if(!games || games.length===0){

return interaction.reply({

content:"❌ No games found.",

ephemeral:true

});

}



let game = games[0];



let embed = new EmbedBuilder()

.setColor("#ff0055")

.setTitle("⚽ VVLL Result Entry")

.setDescription(`

🏠 Home:

<@&${game.home.id}>


🚌 Away:

<@&${game.away.id}>


Add player stats:

⚽ Goals

🧤 Saves

🧱 Blocks

`);




return interaction.reply({

embeds:[embed],

ephemeral:true

});


}





// ===============================
// STANDINGS
// ===============================

if(interaction.commandName==="standings"){


let teams =
database.db.league.teams;



if(!teams.length){

return interaction.reply({

content:
"❌ No league created.",

ephemeral:true

});

}



let table =
teams.map((team,index)=>{


return `

${index+1}. <@&${team.id}>

🏆 Points: 0

⚽ Goals: 0

`;

}).join("\n");




let embed=new EmbedBuilder()

.setColor("#ff0055")

.setTitle("🏆 VVLL Standings")

.setDescription(table);



return interaction.reply({

embeds:[embed]

});


}





// ===============================
// PLAYER STATS
// ===============================


if(interaction.commandName==="stats"){



let players =
database.db.players;



if(!players.length){


return interaction.reply({

content:
"❌ No player stats yet.",

ephemeral:true

});


}



let text =
players.map(player=>{


return `

👤 ${player.name}

⚽ Goals: ${player.goals}

🧤 Saves: ${player.saves}

🧱 Blocks: ${player.blocks}

`;

}).join("\n");




let embed=new EmbedBuilder()

.setColor("#ff0055")

.setTitle("📊 VVLL Player Stats")

.setDescription(text);



return interaction.reply({

embeds:[embed]

});


}