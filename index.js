// ===============================
// VVLL BOT INDEX.JS PART 1/2
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
Routes
} = require("discord.js");


const client = new Client({

intents:[

GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMembers

]

});


// ===============================
// IDS
// ===============================

const REF_ROLE_ID = "1521782877950447740";
const FRIENDLY_ROLE_ID = "1531405293509017790";


// ===============================
// DATA
// ===============================

let friendlyPlayers = [];

let friendlyMessage = null;



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

.setDescription("Start friendly queue"),



new SlashCommandBuilder()

.setName("create-game")

.setDescription("Create a game")

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

.setDescription("Example 2h")

.setRequired(true)

)


.addStringOption(o=>

o.setName("format")

.setDescription("4v4 - 11v11")

.setRequired(true)

)


.addStringOption(o=>

o.setName("stage")

.setDescription("League stage")

.setRequired(true)

),



new SlashCommandBuilder()

.setName("league-setup")

.setDescription("Create league")

];



// ===============================
// READY
// ===============================


client.once("ready", async()=>{


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

body: commands.map(c=>c.toJSON())

}

);



console.log("Commands registered");


});



// ===============================
// TIME
// ===============================


function getSeconds(time){


let number =
parseInt(time);



if(time.endsWith("m"))

return number * 60;



if(time.endsWith("h"))

return number * 3600;



if(time.endsWith("d"))

return number * 86400;



return null;


}



// ===============================
// INTERACTIONS START
// ===============================


client.on("interactionCreate", async interaction=>{


if(!interaction.isChatInputCommand())

return;



// FRIENDLY SETUP


if(interaction.commandName === "setup"){



let embed = new EmbedBuilder()

.setColor("#ff0055")

.setTitle("⚽ VVLL Friendly Queue")

.setDescription(

`
🟢 Players:

Nobody joined yet


⏰ Timer:

2 Hours

`

);



let buttons = new ActionRowBuilder()

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



let msg = await interaction.reply({

embeds:[embed],

components:[buttons],

fetchReply:true

});



friendlyMessage = msg;



}
// ===============================
// VVLL BOT INDEX.JS PART 2/2
// ===============================



// CREATE GAME

if(interaction.commandName === "create-game"){


let seconds =
getSeconds(
interaction.options.getString("time")
);



if(!seconds){

return interaction.reply({

content:"Use time like 30m, 2h, or 1d",

ephemeral:true

});

}



let timestamp =
Math.floor(Date.now()/1000)+seconds;



let embed = new EmbedBuilder()

.setColor("#ff0055")

.setTitle("⚽ VVLL Game")

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



let row = new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId("claim_ref")

.setLabel("🧑‍⚖️ Claim Ref")

.setStyle(ButtonStyle.Primary)

)



return interaction.reply({

embeds:[embed],

components:[row]

});


}



});



// ===============================
// BUTTON HANDLER
// ===============================


client.on("interactionCreate", async interaction=>{


if(!interaction.isButton())

return;



// JOIN FRIENDLY


if(interaction.customId === "join_friendly"){



if(!interaction.member.roles.cache.has(FRIENDLY_ROLE_ID)){


return interaction.reply({

content:"❌ You need the Friendly role.",

ephemeral:true

});


}



if(!friendlyPlayers.includes(interaction.user.id)){


friendlyPlayers.push(
interaction.user.id
);


}



let players = friendlyPlayers
.map(id=>`<@${id}>`)
.join("\n");



let embed =
EmbedBuilder.from(
interaction.message.embeds[0]
);



embed.setDescription(

`
🟢 Players:

${players}


⏰ Timer:

2 Hours

`

);



return interaction.update({

embeds:[embed]

});


}



// LEAVE FRIENDLY


if(interaction.customId === "leave_friendly"){



friendlyPlayers =
friendlyPlayers.filter(

id=>id !== interaction.user.id

);



return interaction.reply({

content:"❌ Left queue",

ephemeral:true

});


}




// CLAIM REF


if(interaction.customId === "claim_ref"){



if(!interaction.member.roles.cache.has(REF_ROLE_ID)){


return interaction.reply({

content:"❌ You need the Ref role.",

ephemeral:true

});


}



let embed =
EmbedBuilder.from(
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



});




// ===============================
// LOGIN
// ===============================


client.login(process.env.TOKEN);