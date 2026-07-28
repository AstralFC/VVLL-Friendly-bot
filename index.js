// ===============================
// VVLL LEAGUE BOT
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

const FRIENDLY_ROLE_ID = "1531405293509017790";



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

.setDescription("Create VVLL game")

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

.setDescription("Example: 30m 2h 1d")

.setRequired(true)

)


.addStringOption(o=>

o.setName("format")

.setDescription("Game format")

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

)

)


.addStringOption(o=>

o.setName("stage")

.setDescription("Stage")

.setRequired(true)

.addChoices(

{name:"League",value:"League"},

{name:"Last 8",value:"Last 8"},

{name:"Last 4",value:"Last 4"},

{name:"Finals",value:"Finals"}

)

),



new SlashCommandBuilder()

.setName("league-setup")

.setDescription("Setup league")



];



// Add team roles to league command

for(let i=1;i<=8;i++){

commands[2]

.addRoleOption(o=>

o.setName(`team${i}`)

.setDescription(`Team ${i}`)

.setRequired(true)

);

}



// ===============================
// READY
// ===============================

client.once("ready",async()=>{


console.log(
`${client.user.tag} online`
);



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
// TIME
// ===============================

function convertTime(time){


let num=parseInt(time);


if(time.endsWith("m"))

return num*60;


if(time.endsWith("h"))

return num*3600;


if(time.endsWith("d"))

return num*86400;


return null;

}



// ===============================
// CHAT COMMANDS
// ===============================

client.on("interactionCreate",async interaction=>{


if(!interaction.isChatInputCommand())

return;



// FRIENDLY

if(interaction.commandName==="setup"){



let embed = new EmbedBuilder()

.setColor("#ff0055")

.setTitle("⚽ VVLL Friendly")

.setDescription(

"Nobody joined yet\n\n⏰ Timer: 2 Hours"

);



let row = new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId("friendly_join")

.setLabel("Join")

.setStyle(ButtonStyle.Success),


new ButtonBuilder()

.setCustomId("friendly_leave")

.setLabel("Leave")

.setStyle(ButtonStyle.Danger)

);



return interaction.reply({

embeds:[embed],

components:[row]

});



}



// CREATE GAME

if(interaction.commandName==="create-game"){



let seconds = convertTime(

interaction.options.getString("time")

);



if(!seconds){

return interaction.reply({

content:"Use 30m, 2h, or 1d",

ephemeral:true

});

}



let stamp =

Math.floor(Date.now()/1000)+seconds;



let embed = new EmbedBuilder()

.setColor("#ff0055")

.setTitle("⚽ VVLL Match")

.setDescription(

`
🏠 ${interaction.options.getRole("home")}

🚌 ${interaction.options.getRole("away")}


📋 ${interaction.options.getString("format")}


🏆 ${interaction.options.getString("stage")}


⏰ <t:${stamp}:F>


🧑‍⚖️ Ref Needed

`

);



let button = new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId("claim_ref")

.setLabel("🧑‍⚖️ Claim Ref")

.setStyle(ButtonStyle.Primary)

);



return interaction.reply({

embeds:[embed],

components:[button]

});

}
// ===============================
// VVLL LEAGUE BOT
// PART 2/2
// ===============================


// ===============================
// LEAGUE SETUP
// ===============================

if(interaction.commandName==="league-setup"){


league.teams=[];

league.games=[];

league.current=0;



for(let i=1;i<=8;i++){


league.teams.push(

interaction.options.getRole(`team${i}`)

);


}



league.teams.sort(

()=>Math.random()-0.5

);



for(let i=0;i<8;i+=2){


league.games.push({

home:league.teams[i],

away:league.teams[i+1],

time:null

});


}



let matches="";


league.games.forEach((g,i)=>{


matches +=

`
⚽ **Game ${i+1}**

${g.home}

VS

${g.away}

`;

});



let embed = new EmbedBuilder()

.setColor("#ff0055")

.setTitle("🏆 VVLL League Matchups")

.setDescription(

`
${matches}

Click below to add game times.

`

);



let row = new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId("league_time")

.setLabel("⏰ Add Times")

.setStyle(ButtonStyle.Primary)

);



return interaction.reply({

embeds:[embed],

components:[row]

});


}



});




// ===============================
// BUTTONS
// ===============================


client.on("interactionCreate",async interaction=>{


if(!interaction.isButton())

return;



// FRIENDLY JOIN


if(interaction.customId==="friendly_join"){


if(!interaction.member.roles.cache.has(FRIENDLY_ROLE_ID)){


return interaction.reply({

content:"❌ You need the Friendly role.",

ephemeral:true

});


}



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


if(interaction.customId==="friendly_leave"){


friendlyPlayers.delete(

interaction.user.id

);



return interaction.reply({

content:"❌ Left friendly queue",

ephemeral:true

});


}



// CLAIM REF


if(interaction.customId==="claim_ref"){


if(!interaction.member.roles.cache.has(REF_ROLE_ID)){


return interaction.reply({

content:"❌ You need the referee role.",

ephemeral:true

});


}



let embed = EmbedBuilder.from(

interaction.message.embeds[0]

);



embed.setDescription(

embed.data.description.replace(

"🧑‍⚖️ Ref Needed",

`🧑‍⚖️ Referee: ${interaction.user}`

)

);



return interaction.update({

embeds:[embed],

components:[]

});


}



// LEAGUE TIME


if(interaction.customId==="league_time"){



let modal = new ModalBuilder()

.setCustomId("league_modal")

.setTitle(

`Game ${league.current+1} Time`

);



let input = new TextInputBuilder()

.setCustomId("time")

.setLabel("Enter date/time")

.setPlaceholder(

"July 30 6:00 PM"

)

.setStyle(TextInputStyle.Short);



modal.addComponents(

new ActionRowBuilder()

.addComponents(input)

);



return interaction.showModal(modal);


}



});




// ===============================
// MODALS
// ===============================


client.on("interactionCreate",async interaction=>{


if(!interaction.isModalSubmit())

return;



if(interaction.customId==="league_modal"){



league.games[league.current].time =

interaction.fields.getTextInputValue("time");



league.current++;



if(league.current < league.games.length){


return interaction.reply({

content:

`✅ Saved!

Next game:

${league.games[league.current].home}

VS

${league.games[league.current].away}`,

ephemeral:true

});


}



let schedule="";



league.games.forEach((g,i)=>{


schedule +=

`
⚽ **Game ${i+1}**

🏠 ${g.home}

🚌 ${g.away}

⏰ ${g.time}

🧑‍⚖️ Ref Needed

────────────

`;



});



let embed = new EmbedBuilder()

.setColor("#ff0055")

.setTitle("🏆 VVLL Final Schedule")

.setDescription(schedule);



return interaction.reply({

embeds:[embed]

});


}



});



// ===============================
// CLEAN FRIENDLY TIMER
// ===============================


setInterval(()=>{


let now = Date.now();


for(let [id,time] of friendlyPlayers){


if(now-time >= 7200000){


friendlyPlayers.delete(id);


}


}


},60000);




// ===============================
// LOGIN
// ===============================


client.login(process.env.TOKEN);