// ==========================
// VVLL BOT PART 1/3
// ==========================

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


// Ref role
const REF_ROLE_ID = "1521782877950447740";


// Storage
let friendlyPlayers = new Map();
let friendlyMessage = null;

let leagueTeams = [];
let leagueGames = [];


// Convert 30m / 5h / 1d
function convertTime(input){

    let amount = parseInt(input);

    if(isNaN(amount)) return null;

    if(input.endsWith("m"))
        return amount * 60;

    if(input.endsWith("h"))
        return amount * 3600;

    if(input.endsWith("d"))
        return amount * 86400;

    return null;
}



// Friendly embed
function friendlyEmbed(){

let players=[...friendlyPlayers.keys()];

return new EmbedBuilder()

.setColor("#ff0055")

.setTitle("⚽ VVLL Friendly Queue")

.setDescription(

`🟢 Ready Players: **${players.length}**

${
players.length
? players.map(x=>`• <@${x}>`).join("\n")
:"No players ready"
}

⏰ Players stay available for 2 hours`

);

}


// Friendly buttons

function friendlyButtons(){

return new ActionRowBuilder()

.addComponents(

new ButtonBuilder()
.setCustomId("friendly_join")
.setLabel("🟢 Join")
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId("friendly_leave")
.setLabel("🔴 Leave")
.setStyle(ButtonStyle.Danger)

);

}



// Commands

const commands=[


new SlashCommandBuilder()

.setName("setup")

.setDescription("Create friendly queue"),



new SlashCommandBuilder()

.setName("create-game")

.setDescription("Create a VVLL game")

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
.setDescription("Example: 30m 2h 1d")
.setRequired(true))

.addStringOption(o=>
o.setName("format")
.setDescription("League/Semi Final/Final")
.setRequired(true))


].map(x=>x.toJSON());




// Bot ready

client.once("ready", async()=>{

console.log(`✅ Online ${client.user.tag}`);


const rest=new REST({
version:"10"
}).setToken(process.env.TOKEN);


await rest.put(

Routes.applicationCommands(client.user.id),

{
body:commands
}

);


console.log("✅ Commands loaded");

});




// Commands

client.on("interactionCreate", async interaction=>{


if(interaction.isChatInputCommand()){



// Friendly setup

if(interaction.commandName==="setup"){


friendlyMessage=

await interaction.channel.send({

embeds:[
friendlyEmbed()
],

components:[
friendlyButtons()
]

});


return interaction.reply({

content:"✅ Friendly queue created",

ephemeral:true

});


}



// Create game

if(interaction.commandName==="create-game"){


let time=
interaction.options.getString("time");


let seconds=
convertTime(time);


if(!seconds){

return interaction.reply({

content:"❌ Use 30m, 2h, 1d",

ephemeral:true

});

}



let timestamp=
Math.floor(Date.now()/1000)+seconds;


let home=
interaction.options.getRole("home");


let away=
interaction.options.getRole("away");


let format=
interaction.options.getString("format");



let embed=

new EmbedBuilder()

.setColor("#ff0055")

.setTitle("⚽ VVLL Match")

.setDescription(

`
🏠 **Home**
${home}

🚌 **Away**
${away}


🏆 **Format**
${format}


⏰ **Starts**
<t:${timestamp}:F>

<t:${timestamp}:R>


🧑‍⚖️ **Referee**
❌ Needed

⚠️ Requires 1+ referee
`

);



let button=

new ActionRowBuilder()

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


}



// Buttons

if(interaction.isButton()){


if(interaction.customId==="friendly_join"){


friendlyPlayers.set(
interaction.user.id,
Date.now()
);


await interaction.reply({

content:"✅ Joined friendly queue",

ephemeral:true

});


}



if(interaction.customId==="friendly_leave"){


friendlyPlayers.delete(
interaction.user.id
);


await interaction.reply({

content:"❌ Left queue",

ephemeral:true

});


}



if(interaction.customId==="claim_ref"){


if(!interaction.member.roles.cache.has(REF_ROLE_ID)){


return interaction.reply({

content:"❌ You need the Referee role",

ephemeral:true

});


}


let embed=
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



if(friendlyMessage){


await friendlyMessage.edit({

embeds:[
friendlyEmbed()
],

components:[
friendlyButtons()
]

});


}


}


});


// ==========================
// PART 2 GOES DIRECTLY BELOW
// ==========================
// ==========================
// VVLL BOT PART 2/3
// ==========================


// League setup command
commands.push(

new SlashCommandBuilder()

.setName("league-setup")

.setDescription("Setup VVLL league schedule")

.addRoleOption(o=>
o.setName("team1")
.setDescription("Team 1")
.setRequired(true))

.addRoleOption(o=>
o.setName("team2")
.setDescription("Team 2")
.setRequired(true))

.addRoleOption(o=>
o.setName("team3")
.setDescription("Team 3")
.setRequired(true))

.addRoleOption(o=>
o.setName("team4")
.setDescription("Team 4")
.setRequired(true))

.addRoleOption(o=>
o.setName("team5")
.setDescription("Team 5")
.setRequired(true))

.addRoleOption(o=>
o.setName("team6")
.setDescription("Team 6")
.setRequired(true))

.addRoleOption(o=>
o.setName("team7")
.setDescription("Team 7")
.setRequired(true))

.addRoleOption(o=>
o.setName("team8")
.setDescription("Team 8")
.setRequired(true))


);




// League setup handler

client.on("interactionCreate", async interaction=>{


if(!interaction.isChatInputCommand())
return;



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



// Randomize order

leagueTeams.sort(
()=>Math.random()-0.5
);



let embed=

new EmbedBuilder()

.setColor("#ff0055")

.setTitle("🏆 VVLL League Setup")

.setDescription(

leagueTeams.map(

(team,index)=>

`${index+1}. ${team}`

).join("\n")

)

.setFooter({

text:"Teams randomized"

});



await interaction.reply({

embeds:[embed]

});



}

});



// ==========================
// PART 3 GOES DIRECTLY BELOW
// ==========================
// ==========================
// VVLL BOT PART 3/3
// ==========================


// Schedule generator

client.on("interactionCreate", async interaction=>{


if(!interaction.isChatInputCommand())
return;



if(interaction.commandName==="league-randomize"){


if(leagueTeams.length < 8){

return interaction.reply({

content:"❌ Use /league-setup first",

ephemeral:true

});

}



let games=[];


// Simple random matchups

let shuffled=[...leagueTeams]
.sort(()=>Math.random()-0.5);



for(let i=0;i<shuffled.length;i+=2){


games.push({

home:shuffled[i],

away:shuffled[i+1]

});


}



let description="";



games.forEach((game,index)=>{


let time =
Math.floor(Date.now()/1000)
+
((index+1)*3600);



description +=

`
⚽ **Game ${index+1}**

🏠 ${game.home}
🚌 ${game.away}

⏰ <t:${time}:F>

🧑‍⚖️ Ref Needed
⚠️ Requires 1+ referee

────────────
`;



});



let embed=

new EmbedBuilder()

.setColor("#ff0055")

.setTitle("🏆 VVLL League Schedule")

.setDescription(description);



await interaction.reply({

embeds:[embed]

});



}


});




// Auto remove friendly players after 2 hours

setInterval(()=>{


let now=Date.now();


for(let [id,time] of friendlyPlayers){


if(now-time >= 7200000){


friendlyPlayers.delete(id);


}


}


},60000);




// Final login

client.login(process.env.TOKEN);