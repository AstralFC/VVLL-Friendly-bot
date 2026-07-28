// ===============================
// VVLL LEAGUE BOT
// INTERACTIONS.JS
// ===============================

const {
EmbedBuilder,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle,
ModalBuilder,
TextInputBuilder,
TextInputStyle
} = require("discord.js");


const database = require("./database");



// ===============================
// BUTTON HANDLER
// ===============================

async function button(interaction){



// ===============================
// FRIENDLY QUEUE JOIN
// ===============================

if(interaction.customId === "queue_join"){


let user =
interaction.user.id;



if(database.queue.includes(user)){


return interaction.reply({

content:"❌ You are already in the queue.",

ephemeral:true

});


}



database.queue.push(user);

database.save();



return interaction.reply({

content:
"✅ You joined the friendly queue!",

ephemeral:true

});


}





// ===============================
// FRIENDLY QUEUE LEAVE
// ===============================


if(interaction.customId === "queue_leave"){


let user =
interaction.user.id;



database.queue =
database.queue.filter(
(id)=>id !== user
);



database.save();



return interaction.reply({

content:
"❌ You left the queue.",

ephemeral:true

});


}




// ===============================
// REF CLAIM
// ===============================


if(interaction.customId === "claim_ref"){


const REF_ROLE =
"1521782877950447740";



if(
!interaction.member.roles.cache.has(REF_ROLE)
){


return interaction.reply({

content:
"❌ You need the referee role.",

ephemeral:true

});


}



return interaction.reply({

content:
`🧑‍⚖️ Ref claimed by ${interaction.user}`

});


}





// ===============================
// ACCEPT CONTRACT
// ===============================


if(
interaction.customId.startsWith("accept_")
){


let teamID =
interaction.customId.split("_")[1];



await interaction.member.roles.add(teamID);



return interaction.update({

content:
"✅ Contract accepted! You joined the team.",

embeds:[],

components:[]

});


}





// ===============================
// DECLINE CONTRACT
// ===============================


if(
interaction.customId === "decline_contract"
){


return interaction.update({

content:
"❌ Contract declined.",

embeds:[],

components:[]

});


}



}



// ===============================
// MODAL HANDLER
// ===============================

async function modal(interaction){


// Result modal will be added here
// with goals, saves, blocks



}





module.exports = {

button,

modal

};