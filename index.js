// ===============================
// VVLL LEAGUE BOT - INDEX.JS
// PART 1/2
// ===============================

require("dotenv").config();

const {
Client,
GatewayIntentBits,
EmbedBuilder,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle,
SlashCommandBuilder,
PermissionsBitField,
ModalBuilder,
TextInputBuilder,
TextInputStyle
} = require("discord.js");

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

const client = new Client({
intents:[
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMembers
]
});


// ===============================
// SETTINGS
// ===============================

const REF_ROLE_ID = "1521782877950447740";


// ===============================
// DATA
// ===============================

let friendlyPlayers = new Map();

let league = {
teams:[],
games:[],
current:0
};


// ===============================
// COMMANDS
// ===============================

const commands = [

new SlashCommandBuilder()
.setName("setup")
.setDescription("Create friendly queue"),



new SlashCommandBuilder()
.setName("create-game")
.setDescription("Create a VVLL game")

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
.setDescription("Example: 30m, 2h, 1d")
.setRequired(true))

.addStringOption(o =>
o.setName("format")
.setDescription("Match format")
.setRequired(true)
.addChoices(
{name:"4v4",value:"4v4"},
{name:"5v5",value:"5v5"},
{name:"6v6",value:"6v6"},
{name:"7v7",value:"7v7"},
{name:"8v8",value:"8v8"},
{name:"9v9",value:"9v9"},
{name:"10v10",value:"10v10"},
{name:"11v11",value:"11v11"}
))

.addStringOption(o =>
o.setName("stage")
.setDescription("Tournament stage")
.setRequired(true)
.addChoices(
{name:"League",value:"League"},
{name:"Last 8",value:"Last 8"},
{name:"Last 4",value:"Last 4"},
{name:"Finals",value:"Finals"}
)),



new SlashCommandBuilder()
.setName("league-setup")
.setDescription("Setup league")

.addRoleOption(o=>o.setName("team1").setDescription("Team 1").setRequired(true))
.addRoleOption(o=>o.setName("team2").setDescription("Team 2").setRequired(true))
.addRoleOption(o=>o.setName("team3").setDescription("Team 3").setRequired(true))
.addRoleOption(o=>o.setName("team4").setDescription("Team 4").setRequired(true))
.addRoleOption(o=>o.setName("team5").setDescription("Team 5").setRequired(true))
.addRoleOption(o=>o.setName("team6").setDescription("Team 6").setRequired(true))
.addRoleOption(o=>o.setName("team7").setDescription("Team 7").setRequired(true))
.addRoleOption(o=>o.setName("team8").setDescription("Team 8").setRequired(true))

];



// ===============================
// READY
// ===============================

client.once("ready",async()=>{

console.log(`${client.user.tag} online`);

const rest = new REST({
version:"10"
}).setToken(process.env.TOKEN);


await rest.put(

Routes.applicationCommands(
client.user.id
),

{
body:commands.map(c=>c.toJSON())
}

);


console.log("Commands loaded");

});



// ===============================
// TIME CONVERTER
// ===============================

function convertTime(t){

let amount=parseInt(t);

if(t.endsWith("m"))
return amount*60;

if(t.endsWith("h"))
return amount*3600;

if(t.endsWith("d"))
return amount*86400;

return null;

}



// ===============================
// INTERACTIONS
// ===============================

client.on("interactionCreate",async interaction=>{


if(interaction.isChatInputCommand()){


// FRIENDLY SETUP

if(interaction.commandName==="setup"){


let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle("⚽ VVLL Friendly Queue")

.setDescription(
"Nobody joined yet\n\n⏰ Timer: 2 Hours"
);


let buttons =
new ActionRowBuilder()

.addComponents(

new ButtonBuilder()
.setCustomId("join_friendly")
.setLabel("Join")
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId("leave_friendly")
.setLabel("Leave")
.setStyle(ButtonStyle.Danger)

);


return interaction.reply({

embeds:[embed],

components:[buttons]

});


}



// CREATE GAME

if(interaction.commandName==="create-game"){


let seconds =
convertTime(
interaction.options.getString("time")
);


if(!seconds){

return interaction.reply({

content:"Use 30m, 2h, or 1d",

ephemeral:true

});

}


let timestamp =
Math.floor(Date.now()/1000)+seconds;


let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle("⚽ VVLL Match")

.setDescription(

`
🏠 ${interaction.options.getRole("home")}

🚌 ${interaction.options.getRole("away")}


📋 Format:
${interaction.options.getString("format")}


🏆 Stage:
${interaction.options.getString("stage")}


⏰ <t:${timestamp}:F>


🧑‍⚖️ Ref Needed
`

);


return interaction.reply({

embeds:[embed],

components:[

new ActionRowBuilder()

.addComponents(

new ButtonBuilder()
.setCustomId("claim_ref")
.setLabel("🧑‍⚖️ Claim Ref")
.setStyle(ButtonStyle.Primary)

)

]

});


}
// ===============================
// VVLL LEAGUE BOT - INDEX.JS
// PART 2/2
// ===============================


// LEAGUE SETUP

if(interaction.commandName==="league-setup"){


league.teams=[];


for(let i=1;i<=8;i++){

league.teams.push(

interaction.options.getRole(`team${i}`)

);

}


// Randomize

league.teams.sort(
()=>Math.random()-0.5
);



league.games=[];


for(let i=0;i<8;i+=2){

league.games.push({

home:league.teams[i],

away:league.teams[i+1],

time:null

});

}


league.current=0;



let embed =

new EmbedBuilder()

.setColor("#ff0055")

.setTitle("🏆 VVLL League Setup")

.setDescription(

`
✅ Teams Selected

${league.teams.map((t,i)=>
`${i+1}. ${t}`
).join("\n")}


Creating matchups...
`

);



await interaction.reply({

embeds:[embed]

});



setTimeout(async()=>{


let games =

league.games.map((g,i)=>

`
⚽ **Game ${i+1}**

${g.home}
VS
${g.away}
`

).join("\n");



let matchEmbed =

new EmbedBuilder()

.setColor("#ff0055")

.setTitle("⚽ VVLL Matchups")

.setDescription(

`
${games}

Press button to add times.
`

);



let button =

new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId("league_add_time")

.setLabel("⏰ Add Times")

.setStyle(ButtonStyle.Primary)

);



interaction.channel.send({

embeds:[matchEmbed],

components:[button]

});


},2000);


}



}



// ===============================
// BUTTONS
// ===============================


if(interaction.isButton()){



// FRIENDLY JOIN

if(interaction.customId==="join_friendly"){


friendlyPlayers.set(

interaction.user.id,

Date.now()

);


return interaction.reply({

content:"✅ Joined friendly queue",

ephemeral:true

});


}



// FRIENDLY LEAVE

if(interaction.customId==="leave_friendly"){


friendlyPlayers.delete(

interaction.user.id

);


return interaction.reply({

content:"❌ Left friendly queue",

ephemeral:true

});


}



// REF CLAIM

if(interaction.customId==="claim_ref"){


if(!interaction.member.roles.cache.has(REF_ROLE_ID)){


return interaction.reply({

content:"❌ You need the referee role",

ephemeral:true

});


}


return interaction.reply({

content:`🧑‍⚖️ Ref claimed by ${interaction.user}`

});


}



// LEAGUE TIME BUTTON

if(interaction.customId==="league_add_time"){



let modal =

new ModalBuilder()

.setCustomId("league_time_modal")

.setTitle(

`Game ${league.current+1} Time`

);



let input =

new TextInputBuilder()

.setCustomId("time")

.setLabel("Enter date/time")

.setPlaceholder(
"Example: July 30 6:00 PM"
)

.setStyle(TextInputStyle.Short);



modal.addComponents(

new ActionRowBuilder()

.addComponents(input)

);



return interaction.showModal(modal);


}



}



// ===============================
// MODALS
// ===============================


if(interaction.isModalSubmit()){



if(interaction.customId==="league_time_modal"){



let game =
league.games[league.current];


game.time =

interaction.fields.getTextInputValue(
"time"
);



league.current++;



if(league.current < league.games.length){


return interaction.reply({

content:

`✅ Saved!

Next game:
${league.games[league.current].home}
VS
${league.games[league.current].away}

Press Add Times again.`,

ephemeral:true

});


}



// FINAL SCHEDULE


let schedule="";



league.games.forEach((g,i)=>{


schedule +=

`
⚽ **Game ${i+1}**

🏠 ${g.home}

🚌 ${g.away}

📅 ${g.time}

🧑‍⚖️ Ref Needed

────────────
`;



});



let finalEmbed =

new EmbedBuilder()

.setColor("#ff0055")

.setTitle("🏆 VVLL Final Schedule")

.setDescription(schedule);



return interaction.reply({

embeds:[finalEmbed]

});


}


}


});



// REMOVE FRIENDLY AFTER 2 HOURS

setInterval(()=>{


let now=Date.now();


for(let [id,time] of friendlyPlayers){


if(now-time >= 7200000){

friendlyPlayers.delete(id);

}


}


},60000);



// LOGIN

client.login(process.env.TOKEN);