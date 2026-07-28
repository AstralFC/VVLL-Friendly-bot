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

const {
  REST
} = require("@discordjs/rest");

const {
  Routes
} = require("discord-api-types/v10");


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});


const queue = new Map();

let queueChannel;
let queueMessage;


// Create Embed
function createEmbed() {

  const players = [...queue.keys()];

  return new EmbedBuilder()
    .setColor("#ff0055")
    .setTitle("⚽ VVLL Friendly Queue")
    .setDescription(
      `🟢 **Ready Players: ${players.length}**\n\n` +

      (players.length
        ? players.map(id => `• <@${id}>`).join("\n")
        : "No players are ready yet.")
    )
    .addFields({
      name: "⏰ Queue Timer",
      value:
      "Players stay available for **2 hours** after joining.\n" +
      "The bot will automatically remove expired players."
    })
    .setFooter({
      text: "VVLL Friendly System"
    });
}


// Buttons
function createButtons(){

return new ActionRowBuilder()
.addComponents(

new ButtonBuilder()
.setCustomId("join")
.setLabel("🟢 Join Queue")
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId("leave")
.setLabel("🔴 Leave Queue")
.setStyle(ButtonStyle.Danger)

);

}


// Slash command setup

const commands = [

new SlashCommandBuilder()
.setName("setup")
.setDescription("Setup the VVLL friendly queue")
.addChannelOption(option =>
option
.setName("channel")
.setDescription("Channel for the queue embed")
.setRequired(true)
)

].map(command => command.toJSON());



client.once("ready", async()=>{

console.log(`✅ Online as ${client.user.tag}`);


const rest = new REST({
version:"10"
}).setToken(process.env.TOKEN);


await rest.put(

Routes.applicationCommands(client.user.id),

{
body: commands
}

);


console.log("✅ Commands loaded");

});



// Commands

client.on("interactionCreate", async interaction=>{


if(interaction.isChatInputCommand()){


if(interaction.commandName === "setup"){


if(
!interaction.member.permissions.has(
PermissionsBitField.Flags.Administrator
)
){

return interaction.reply({
content:"❌ You need Administrator permission.",
ephemeral:true
});

}


const channel =
interaction.options.getChannel("channel");


queueChannel = channel;


queueMessage = await channel.send({

embeds:[createEmbed()],

components:[createButtons()]

});


return interaction.reply({

content:
"✅ VVLL Friendly Queue created!",

ephemeral:true

});


}

}



// Buttons

if(interaction.isButton()){


const id = interaction.user.id;


if(interaction.customId === "join"){


queue.set(id, Date.now());


await interaction.reply({

content:"✅ You joined the friendly queue!",

ephemeral:true

});


}


if(interaction.customId === "leave"){


queue.delete(id);


await interaction.reply({

content:"❌ You left the friendly queue.",

ephemeral:true

});


}


if(queueMessage){

await queueMessage.edit({

embeds:[createEmbed()],

components:[createButtons()]

});

}


}

});



// Remove after 2 hours

setInterval(async()=>{


const now = Date.now();


for(const [id,time] of queue){


if(now - time >= 7200000){

queue.delete(id);

}


}


if(queueMessage){

await queueMessage.edit({

embeds:[createEmbed()],

components:[createButtons()]

});

}


},60000);



client.login(process.env.TOKEN);