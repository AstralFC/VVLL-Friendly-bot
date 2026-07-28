// =====================================
// VVLL INTERACTIONS
// BUTTON SYSTEM
// =====================================

const {
EmbedBuilder
}=require("discord.js");


const database = require("./database");



const STAFF_IDS = [

"1505021865985572940",

"1429837765281058876"

];





async function run(interaction){



// ================================
// CONTRACT ACCEPT
// ================================

if(
interaction.customId.startsWith("accept_")
){


let data =
interaction.customId.split("_");



let roleId =
data[1];



let playerId =
data[2];



let member =
await interaction.guild.members.fetch(
playerId
);



let role =
interaction.guild.roles.cache.get(
roleId
);



if(role){

await member.roles.add(role);

}




let team =
database.db.teams.find(

t=>t.role===roleId

);



if(team){

if(
!team.players.includes(playerId)
){

team.players.push(
playerId
);

}

}



// Create player stats

let player =
database.db.players.find(

p=>p.id===playerId

);



if(!player){

database.db.players.push({

id:playerId,

goals:0,

assists:0,

saves:0,

blocks:0,

games:0,

potm:0

});

}



database.save();



await interaction.reply({

embeds:[

new EmbedBuilder()

.setColor("#00ff88")

.setTitle(
"✅ Contract Accepted"
)

.setDescription(`

Welcome to the team!


🏆 Team:
${team.name}


You are now officially signed.

`)

]

});



}






// ================================
// CONTRACT DECLINE
// ================================


if(
interaction.customId==="decline_contract"
){

return interaction.reply({

content:
"❌ Contract declined."

});

}





// ================================
// RESET LEAGUE
// ================================

if(
interaction.customId==="reset_league"
){


if(
!STAFF_IDS.includes(
interaction.user.id
)

){

return interaction.reply({

content:
"❌ No permission.",

ephemeral:true

});

}




database.db.teams.forEach(team=>{

team.points=0;

team.wins=0;

team.draws=0;

team.losses=0;

team.goals=0;

});



database.db.players.forEach(player=>{

player.goals=0;

player.assists=0;

player.saves=0;

player.blocks=0;

player.games=0;

player.potm=0;

});



database.save();



return interaction.reply({

content:
"🔄 League has been reset.",

ephemeral:true

});


}




// ================================
// STATS BUTTON PLACEHOLDER
// ================================


if(
interaction.customId==="manage_stats"
){

return interaction.reply({

content:
"📊 Stats manager coming next.",

ephemeral:true

});

}




// ================================
// TEAM BUTTON
// ================================


if(
interaction.customId==="manage_teams"
){

return interaction.reply({

content:
"🏆 Team manager coming next.",

ephemeral:true

});

}



}



module.exports={

run

};