// =====================================
// VVLL LEAGUE BOT
// INDEX.JS
// =====================================


require("dotenv").config();


const {

Client,

GatewayIntentBits,

Collection

} = require("discord.js");



const client = new Client({

intents:[

GatewayIntentBits.Guilds,

GatewayIntentBits.GuildMembers,

GatewayIntentBits.DirectMessages

]

});





const commands = require("./commands");

const interactions = require("./interactions");





client.commands = new Collection();






// =====================================
// READY
// =====================================


client.once(

"ready",

async()=>{


console.log(
"=============================="
);


console.log(
`✅ VVLL ONLINE: ${client.user.tag}`
);


console.log(
"=============================="
);



// Register slash commands

await commands.register(client);


});






// =====================================
// SLASH COMMAND HANDLER
// =====================================


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







// BUTTONS + MODALS

else if(

interaction.isButton()

){


await interactions.run(
interaction
);


}





else if(

interaction.isModalSubmit()

){


await interactions.run(
interaction
);


}



}

catch(error){


console.log(error);



if(

interaction.deferred

){

await interaction.editReply({

content:

"❌ Something went wrong."

}).catch(()=>{});


}

else if(

!interaction.replied

){

await interaction.reply({

content:

"❌ Something went wrong."

,

ephemeral:true

}).catch(()=>{});


}



}



});







// =====================================
// LOGIN
// =====================================


client.login(

process.env.TOKEN

);