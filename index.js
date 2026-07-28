// ===============================
// VVLL BOT UPDATED INDEX.JS 1/2
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
REST,
ModalBuilder,
TextInputBuilder,
TextInputStyle,
Routes
} = require("discord.js");


const client = new Client({
intents:[
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMembers
]
});


// IDS

const REF_ROLE_ID = "1521782877950447740";
const FRIENDLY_ROLE_ID = "1531405293509017790";


// DATA

let friendlyPlayers = new Map();

let friendlyMessage = null;


let league = {
teams:[],
games:[],
current:0
};



// COMMANDS

const commands = [

new SlashCommandBuilder()
.setName("setup")
.setDescription("Create friendly queue"),


new SlashCommandBuilder()
.setName("create-game")
.setDescription("Create game")

.addRoleOption(o=>
o.setName("home")
.setDescription("Home team")
.setRequired(true))

.addRoleOption(o=>
o.setName("away")
.setDescription("Away team")
.setRequired(true))

.addStringOption(o=>
o.setName("time")
.setDescription("Example 30m 2h")
.setRequired(true))

.addStringOption(o=>
o.setName("format")
.setDescription("Format")
.setRequired(true))

.addStringOption(o=>
o.setName("stage")
.setDescription("Stage")
.setRequired(true)),


new SlashCommandBuilder()
.setName("league-setup")
.setDescription("Setup league")

];



// READY

client.once("ready",async()=>{

console.log(
`${client.user.tag} online`
);


const rest = new REST({
version:"10"
})
.setToken(process.env.TOKEN);


await rest.put(

Routes.applicationCommands(
client.user.id
),

{
body:commands.map(x=>x.toJSON())
}

);


});



// TIME

function convertTime(t){

let num=parseInt(t);

if(t.endsWith("m"))
return num*60;

if(t.endsWith("h"))
return num*3600;

if(t.endsWith("d"))
return num*86400;


return null;

}



// UPDATE FRIENDLY EMBED

async function updateFriendly(){


if(!friendlyMessage) return;


let players =
[...friendlyPlayers.keys()]
.map(id=>`<@${id}>`)
.join("\n");


if(!players)
players="Nobody joined yet";


let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle("⚽ VVLL Friendly")

.setDescription(

`
🟢 Ready Players:

${players}


⏰ Timer:
2 Hours

Need more players!
`

);



await friendlyMessage.edit({

embeds:[embed]

});


}



// INTERACTIONS

client.on("interactionCreate",async interaction=>{


if(interaction.isChatInputCommand()){


if(interaction.commandName==="setup"){


let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle("⚽ VVLL Friendly Queue")

.setDescription(
"Nobody joined yet\n\n⏰ 2 Hour Timer"
);



let row =
new ActionRowBuilder()

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



let msg =
await interaction.reply({

embeds:[embed],

components:[row],

fetchReply:true

});


friendlyMessage=msg;


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



let stamp =
Math.floor(Date.now()/1000)+seconds;



let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle("⚽ VVLL Game")

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



let row =
new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId("claim_ref")

.setLabel("🧑‍⚖️ Claim Ref")

.setStyle(ButtonStyle.Primary)

);



return interaction.reply({

embeds:[embed],

components:[row]

});


}
// ===============================
// VVLL BOT UPDATED INDEX.JS 2/2
// ===============================


// BUTTONS

if(interaction.isButton()){



// FRIENDLY JOIN

if(interaction.customId==="friendly_join"){


if(!interaction.member.roles.cache.has(FRIENDLY_ROLE_ID)){


return interaction.reply({

content:"❌ You need the Friendly role to join.",

ephemeral:true

});


}



friendlyPlayers.set(

interaction.user.id,

Date.now()

);



await updateFriendly();



return interaction.reply({

content:"✅ Joined friendly queue!",

ephemeral:true

});


}




// FRIENDLY LEAVE

if(interaction.customId==="friendly_leave"){


friendlyPlayers.delete(

interaction.user.id

);



await updateFriendly();



return interaction.reply({

content:"❌ Left friendly queue.",

ephemeral:true

});


}




// REF CLAIM

if(interaction.customId==="claim_ref"){



if(!interaction.member.roles.cache.has(REF_ROLE_ID)){


return interaction.reply({

content:"❌ You need the Referee role.",

ephemeral:true

});


}



let embed =
EmbedBuilder.from(
interaction.message.embeds[0]
);



let text =
embed.data.description
.replace(

"🧑‍⚖️ Ref Needed",

`🧑‍⚖️ Referee: ${interaction.user}`

);



embed.setDescription(text);



return interaction.update({

embeds:[embed],

components:[]

});


}



// LEAGUE TIME

if(interaction.customId==="league_time"){



let modal =
new ModalBuilder()

.setCustomId("league_time_modal")

.setTitle(
`Game ${league.current+1}`
);



let input =
new TextInputBuilder()

.setCustomId("time")

.setLabel("Enter date and time")

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



}





// MODALS

if(interaction.isModalSubmit()){



if(interaction.customId==="league_time_modal"){



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
⚽ Game ${i+1}

${g.home}
VS
${g.away}

⏰ ${g.time}

🧑‍⚖️ Ref Needed

────────────
`;



});



let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle("🏆 VVLL Final Schedule")

.setDescription(schedule);



return interaction.reply({

embeds:[embed]

});


}



}





// CLEAN FRIENDLY AFTER 2 HOURS

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