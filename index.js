console.log("✅ NEW INDEX.JS LOADED");
// ===============================
// VVLL LEAGUE BOT
// INDEX.JS
// ===============================

require("dotenv").config();


const {
Client,
GatewayIntentBits
} = require("discord.js");


const commands =
require("./commands");


const interactions =
require("./interactions");



// ===============================
// CLIENT
// ===============================

const client = new Client({

intents:[

GatewayIntentBits.Guilds,

GatewayIntentBits.GuildMembers

]

});




// ===============================
// READY
// ===============================

client.once("ready", async()=>{


console.log(
`${client.user.tag} is online`
);



await commands.register(client);



});




// ===============================
// COMMANDS
// ===============================

client.on(
"interactionCreate",
async interaction=>{


try{


if(
interaction.isChatInputCommand()
){


await commands.run(
interaction
);


}





if(
interaction.isButton()
){


await interactions.button(
interaction
);


}





if(
interaction.isModalSubmit()
){


await interactions.modal(
interaction
);


}



}catch(error){


console.log(error);



if(!interaction.replied){


await interaction.reply({

content:
"❌ Something went wrong.",

ephemeral:true

});


}


}



});




// ===============================
// LOGIN
// ===============================

client.login(
process.env.TOKEN
);