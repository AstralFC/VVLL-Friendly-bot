// ===============================
// VVLL LEAGUE BOT
// INTERACTIONS.JS
// ===============================

const {
EmbedBuilder
} = require("discord.js");


const database =
require("./database");



// ===============================
// BUTTON HANDLER
// ===============================

async function button(interaction){



// ===============================
// QUEUE JOIN
// ===============================

if(interaction.customId==="queue_join"){



let roleID =
"FRIENDLY_ROLE_ID_HERE";



if(!interaction.member.roles.cache.has(roleID)){


await interaction.member.roles.add(roleID);


}



database.db.queue.push({

id:interaction.user.id,

time:Date.now()

});


database.save();



return interaction.reply({

content:
"✅ You joined the friendly queue! You have 1 hour.",

ephemeral:true

});


}




// ===============================
// QUEUE LEAVE
// ===============================


if(interaction.customId==="queue_leave"){



let roleID =
"FRIENDLY_ROLE_ID_HERE";



await interaction.member.roles.remove(roleID);



database.db.queue =
database.db.queue.filter(
p=>p.id !== interaction.user.id
);



database.save();



return interaction.reply({

content:
"❌ You left the friendly queue.",

ephemeral:true

});


}




// ===============================
// REF CLAIM
// ===============================


if(interaction.customId==="claim_ref"){


let REF_ROLE =
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
// CONTRACT ACCEPT
// ===============================


if(
interaction.customId.startsWith(
"accept_contract_"
)
){


let teamID =
interaction.customId.split("_")[2];



await interaction.member.roles.add(teamID);



return interaction.update({

content:
"✅ Contract accepted! You joined the team.",

embeds:[],

components:[]

});


}





// ===============================
// CONTRACT DECLINE
// ===============================


if(
interaction.customId==="decline_contract"
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


return;

}





module.exports={

button,

modal

};