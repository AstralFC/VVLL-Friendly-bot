require("dotenv").config();

const {
Client,
GatewayIntentBits,
EmbedBuilder,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle,
SlashCommandBuilder,
PermissionsBitField
} = require("discord.js");

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");


const client = new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});


// Referee role
const REF_ROLE_ID = "1521782877950447740";


// Storage
let friendlyPlayers = new Map();
let leagueTeams = [];
let leagueGames = [];


// Convert time
function convertTime(time){

    let amount = parseInt(time);

    if(!amount) return null;

    if(time.endsWith("m"))
        return amount * 60;

    if(time.endsWith("h"))
        return amount * 3600;

    if(time.endsWith("d"))
        return amount * 86400;

    return null;
}



// Commands

const commands = [

new SlashCommandBuilder()
.setName("setup")
.setDescription("Create friendly queue"),



new SlashCommandBuilder()
.setName("create-game")
.setDescription("Create a match")

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
.setDescription("Example: 30m 2h 1d")
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
.setDescription("Stage")
.setRequired(true)
.addChoices(
{name:"League",value:"League"},
{name:"Last 8",value:"Last 8"},
{name:"Last 4",value:"Last 4"},
{name:"Finals",value:"Finals"}
)),



new SlashCommandBuilder()
.setName("league-setup")
.setDescription("Setup league teams")

.addRoleOption(o=>o.setName("team1").setDescription("Team 1").setRequired(true))
.addRoleOption(o=>o.setName("team2").setDescription("Team 2").setRequired(true))
.addRoleOption(o=>o.setName("team3").setDescription("Team 3").setRequired(true))
.addRoleOption(o=>o.setName("team4").setDescription("Team 4").setRequired(true))
.addRoleOption(o=>o.setName("team5").setDescription("Team 5").setRequired(true))
.addRoleOption(o=>o.setName("team6").setDescription("Team 6").setRequired(true))
.addRoleOption(o=>o.setName("team7").setDescription("Team 7").setDescription("Team 7").setRequired(true))
.addRoleOption(o=>o.setName("team8").setDescription("Team 8").setRequired(true))

].map(x=>x.toJSON());



client.once("ready", async()=>{

console.log(`Online ${client.user.tag}`);


const rest = new REST({
version:"10"
}).setToken(process.env.TOKEN);


await rest.put(

Routes.applicationCommands(client.user.id),

{
body:commands
}

);


console.log("Commands registered");

});



// Friendly embed

function friendlyEmbed(){

let list=[...friendlyPlayers.keys()];

return new EmbedBuilder()

.setColor("#ff0055")

.setTitle("⚽ VVLL Friendly Queue")

.setDescription(

`
🟢 Ready Players: **${list.length}**

${
list.length
? list.map(x=>`• <@${x}>`).join("\n")
:"Nobody joined yet"
}

⏰ Timer: 2 Hours
`

);

}


function friendlyButtons(){

return new ActionRowBuilder()

.addComponents(

new ButtonBuilder()
.setCustomId("join")
.setLabel("🟢 Join")
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId("leave")
.setLabel("🔴 Leave")
.setStyle(ButtonStyle.Danger)

);

}
// ==========================
// VVLL BOT SECTION 2/2
// ==========================


client.on("interactionCreate", async interaction=>{


// Slash commands

if(interaction.isChatInputCommand()){



// Friendly setup

if(interaction.commandName==="setup"){


await interaction.reply({

content:"✅ Friendly queue created!",

ephemeral:true

});


let msg = await interaction.channel.send({

embeds:[
friendlyEmbed()
],

components:[
friendlyButtons()
]

});


setInterval(async()=>{

try{

await msg.edit({

embeds:[
friendlyEmbed()
],

components:[
friendlyButtons()
]

});

}catch{}

},5000);


}



// Create game

if(interaction.commandName==="create-game"){



let seconds =
convertTime(
interaction.options.getString("time")
);



if(!seconds){

return interaction.reply({

content:"❌ Use time like 30m, 2h, or 1d",

ephemeral:true

});

}



let timestamp =
Math.floor(Date.now()/1000)+seconds;



let home =
interaction.options.getRole("home");


let away =
interaction.options.getRole("away");


let format =
interaction.options.getString("format");


let stage =
interaction.options.getString("stage");



let embed = new EmbedBuilder()

.setColor("#ff0055")

.setTitle("⚽ VVLL Match")

.setDescription(

`
🏠 **Home**
${home}

🚌 **Away**
${away}


📋 **Format**
${format}


🏆 **Stage**
${stage}


⏰ **Starts**
<t:${timestamp}:F>

<t:${timestamp}:R>


🧑‍⚖️ **Referee**
❌ Needed

⚠️ Requires 1+ referee
`

);



let row =
new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId("ref")

.setLabel("🧑‍⚖️ Claim Ref")

.setStyle(ButtonStyle.Primary)

);



return interaction.reply({

embeds:[embed],

components:[row]

});


}



// League setup


if(interaction.commandName==="league-setup"){


if(!interaction.member.permissions.has(
PermissionsBitField.Flags.Administrator
)){


return interaction.reply({

content:"❌ Admin only",

ephemeral:true

});


}



leagueTeams=[];



for(let i=1;i<=8;i++){


leagueTeams.push(

interaction.options.getRole(`team${i}`)

);


}



// Randomize

leagueTeams.sort(
()=>Math.random()-0.5
);



leagueGames=[];



for(let i=0;i<8;i+=2){


leagueGames.push({

home:leagueTeams[i],

away:leagueTeams[i+1],

time:null

});


}



let text="";



leagueGames.forEach((game,index)=>{


text +=

`
⚽ **Game ${index+1}**

🏠 ${game.home}
🚌 ${game.away}

⏰ Time:
Not Set

────────────
`;

});



let embed =
new EmbedBuilder()

.setColor("#ff0055")

.setTitle("🏆 VVLL League Schedule")

.setDescription(text);



return interaction.reply({

embeds:[embed]

});


}



}



// Buttons


if(interaction.isButton()){



// Join friendly

if(interaction.customId==="join"){


friendlyPlayers.set(

interaction.user.id,

Date.now()

);



return interaction.reply({

content:"✅ You joined the friendly",

ephemeral:true

});

}



// Leave friendly

if(interaction.customId==="leave"){


friendlyPlayers.delete(

interaction.user.id

);



return interaction.reply({

content:"❌ You left the friendly",

ephemeral:true

});

}



// Ref button

if(interaction.customId==="ref"){



if(!interaction.member.roles.cache.has(
REF_ROLE_ID
)){


return interaction.reply({

content:"❌ You need the Referee role.",

ephemeral:true

});


}



let embed =
EmbedBuilder.from(
interaction.message.embeds[0]
);



embed.setDescription(

embed.data.description.replace(

"❌ Needed",

`✅ ${interaction.user}`

)

);



return interaction.update({

embeds:[embed],

components:[]

});


}



}



});



// Remove friendly players after 2 hours

setInterval(()=>{


let now=Date.now();



for(let [id,time] of friendlyPlayers){


if(now-time >= 7200000){


friendlyPlayers.delete(id);


}


}


},60000);



// Start bot

client.login(process.env.TOKEN);