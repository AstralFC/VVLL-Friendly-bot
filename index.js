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

const client = new Client({
intents:[
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMembers
]
});


// REF ROLE ID
const REF_ROLE_ID = "1521782877950447740";


// Temporary storage
let teams = [];
let games = [];


// Commands

const commands = [

new SlashCommandBuilder()
.setName("league-setup")
.setDescription("Setup the VVLL league teams")
.addRoleOption(o =>
o.setName("team1")
.setDescription("Team role 1")
.setRequired(true))
.addRoleOption(o =>
o.setName("team2")
.setDescription("Team role 2")
.setRequired(true))
.addRoleOption(o =>
o.setName("team3")
.setDescription("Team role 3")
.setRequired(true))
.addRoleOption(o =>
o.setName("team4")
.setDescription("Team role 4")
.setRequired(true))
.addRoleOption(o =>
o.setName("team5")
.setDescription("Team role 5")
.setRequired(true))
.addRoleOption(o =>
o.setName("team6")
.setDescription("Team role 6")
.setRequired(true))
.addRoleOption(o =>
o.setName("team7")
.setDescription("Team role 7")
.setRequired(true))
.addRoleOption(o =>
o.setName("team8")
.setDescription("Team role 8")
.setRequired(true)),


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
.addIntegerOption(o =>
o.setName("minutes")
.setDescription("Minutes until game starts")
.setRequired(true))
.addStringOption(o =>
o.setName("format")
.setDescription("League, Semi Final, Final")
.setRequired(true))

].map(x=>x.toJSON());





client.once("ready", async()=>{

console.log(`Online ${client.user.tag}`);

const {REST}=require("@discordjs/rest");
const {Routes}=require("discord-api-types/v10");

const rest=new REST({
version:"10"
}).setToken(process.env.TOKEN);


await rest.put(
Routes.applicationCommands(client.user.id),
{
body:commands
});


console.log("Commands loaded");

});






client.on("interactionCreate",async interaction=>{


if(interaction.isChatInputCommand()){


// League setup

if(interaction.commandName==="league-setup"){


if(!interaction.member.permissions.has(
PermissionsBitField.Flags.Administrator
))
return interaction.reply({
content:"❌ Admin only",
ephemeral:true
});


teams=[];


for(let i=1;i<=8;i++){

teams.push(
interaction.options.getRole(`team${i}`)
);

}


// random order

teams.sort(()=>Math.random()-0.5);


return interaction.reply({

embeds:[

new EmbedBuilder()
.setColor("Red")
.setTitle("🏆 VVLL League Setup")
.setDescription(
teams.map((t,i)=>
`${i+1}. ${t}`
).join("\n")
)
.setFooter({
text:"Teams randomized"
})

]

});


}





// Create game


if(interaction.commandName==="create-game"){


let home=
interaction.options.getRole("home");

let away=
interaction.options.getRole("away");

let minutes=
interaction.options.getInteger("minutes");

let format=
interaction.options.getString("format");



let timestamp =
Math.floor(Date.now()/1000)
+
(minutes*60);



let embed=new EmbedBuilder()

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

📅 **Start**
<t:${timestamp}:F>

⏰ **Countdown**
<t:${timestamp}:R>

🧑‍⚖️ **Referee**
❌ No referee assigned

⚠️ This game requires 1+ referee.
`

);


let buttons =
new ActionRowBuilder()
.addComponents(

new ButtonBuilder()
.setCustomId("claim_ref")
.setLabel("🧑‍⚖️ Claim Ref")
.setStyle(ButtonStyle.Primary)

);



await interaction.reply({

embeds:[embed],

components:[buttons]

});


}

}





// Buttons


if(interaction.isButton()){


if(interaction.customId==="claim_ref"){


if(!interaction.member.roles.cache.has(
REF_ROLE_ID
)){

return interaction.reply({

content:
"❌ You need the Referee role to claim this.",

ephemeral:true

});

}



let oldEmbed =
interaction.message.embeds[0];


let newEmbed =
EmbedBuilder.from(oldEmbed)
.setDescription(
oldEmbed.description.replace(
"❌ No referee assigned",
`✅ ${interaction.user}`
)
);


let disabled =
new ActionRowBuilder()
.addComponents(

new ButtonBuilder()
.setCustomId("claimed")
.setLabel("🧑‍⚖️ Ref Assigned")
.setStyle(ButtonStyle.Success)
.setDisabled(true)

);



await interaction.update({

embeds:[newEmbed],

components:[disabled]

});


}


}


});



client.login(process.env.TOKEN);