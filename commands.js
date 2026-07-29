// =====================================
// VVLL INTERACTIONS
// 1/3
// =====================================


const {
EmbedBuilder,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle,
ModalBuilder,
TextInputBuilder,
TextInputStyle
}=require("discord.js");


const database = require("./database");



const OWNERS = [

"1505021865985572940",

"1429837765281058876"

];





async function run(interaction){



try{



// =====================================
// OWNER CHECK
// =====================================

function isOwner(){

return OWNERS.includes(
interaction.user.id
);

}





// =====================================
// OWNER PANEL BUTTON
// =====================================


if(
interaction.customId==="league_setup"
){

if(!isOwner()){

return interaction.reply({

content:
"❌ Owner only.",

ephemeral:true

});

}



const modal =
new ModalBuilder()

.setCustomId(
"league_setup_modal"
)

.setTitle(
"VVLL League Setup"
);



const teams =
new TextInputBuilder()

.setCustomId(
"teams"
)

.setLabel(
"Teams (one per line)"
)

.setStyle(
TextInputStyle.Paragraph
)

.setRequired(true);



const time =
new TextInputBuilder()

.setCustomId(
"time"
)

.setLabel(
"Match time"
)

.setPlaceholder(
"Example: July 30 6:00 PM"
)

.setStyle(
TextInputStyle.Short
)

.setRequired(true);



modal.addComponents(

new ActionRowBuilder()
.addComponents(teams),


new ActionRowBuilder()
.addComponents(time)

);



return interaction.showModal(modal);

}





// =====================================
// RESET LEAGUE
// =====================================


if(
interaction.customId==="reset_league"
){


if(!isOwner()){

return interaction.reply({

content:
"❌ Owner only.",

ephemeral:true

});

}




database.db.teams=[];

database.db.players=[];

database.db.matches=[];



database.save();



return interaction.reply({

content:
"🔄 VVLL League has been reset.",

ephemeral:true

});

}





// =====================================
// STATS BUTTON
// =====================================


if(
interaction.customId==="manage_stats"
){


if(!isOwner()){

return interaction.reply({

content:
"❌ Owner only.",

ephemeral:true

});

}



return interaction.reply({

embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"📊 Stats Manager"
)

.setDescription(`

Use:

/add-stats


to update:

⚽ Goals

🅰️ Assists

🧤 Saves

🧱 Blocks


`)

],

ephemeral:true

});

}





// =====================================
// TEAMS BUTTON
// =====================================


if(
interaction.customId==="manage_teams"
){


if(!isOwner()){

return interaction.reply({

content:
"❌ Owner only.",

ephemeral:true

});

}



return interaction.reply({

content:
"🏆 Team manager coming next.",

ephemeral:true

});

}





}catch(err){


console.log(err);


if(!interaction.replied){

return interaction.reply({

content:
"❌ Button error.",

ephemeral:true

});

}



}



}



module.exports={

run

};
// =====================================
// VVLL INTERACTIONS
// 2/3
// =====================================



// =====================================
// LEAGUE SETUP SUBMIT
// =====================================


if(
interaction.customId==="league_setup_modal"
){


if(
!OWNERS.includes(
interaction.user.id
)

){

return interaction.reply({

content:
"❌ Owner only.",

ephemeral:true

});

}




let teamText =
interaction.fields.getTextInputValue(
"teams"
);



let matchTime =
interaction.fields.getTextInputValue(
"time"
);




// TURN TEAMS INTO ARRAY

let teams =

teamText

.split("\n")

.map(t=>t.trim())

.filter(Boolean);





if(
teams.length < 2
){

return interaction.reply({

content:
"❌ You need at least 2 teams.",

ephemeral:true

});

}





// RANDOMIZE TEAMS

teams.sort(

()=>Math.random()-0.5

);





// CREATE UNIX TIMESTAMP

let date =
new Date(matchTime);



let timestamp =
Math.floor(
date.getTime()/1000
);





// SAVE LEAGUE

database.db.matches=[];



database.db.settings={

league:"VVLL",

time:matchTime,

timestamp:timestamp

};





// CREATE SCHEDULE

for(
let i=0;

i<teams.length;

i++

){


for(
let j=i+1;

j<teams.length;

j++

){


database.db.matches.push({

home:teams[i],

away:teams[j],

time:timestamp

});


}

}




database.db.teams = teams.map(name=>({

name:name,

players:[],

points:0,

wins:0,

draws:0,

losses:0,

goals:0

}));



database.save();





let schedule =

database.db.matches

.slice(0,10)

.map((m,index)=>`

**Match ${index+1}**

🏠 ${m.home}

vs

✈️ ${m.away}

🕒 <t:${m.time}:F>

`)

.join("\n");





return interaction.reply({

embeds:[

new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
"⚽ VVLL LEAGUE CREATED"
)

.setDescription(`

🏆 Teams:

${teams.map(t=>`• ${t}`).join("\n")}


📅 First Matches:


${schedule}


Created by:

${interaction.user}

`)

]

});

}
// =====================================
// VVLL COMMAND SYNC
// =====================================

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

const commandsFile = require("./commands");



async function syncCommands(client){


const rest = new REST({

version:"10"

}).setToken(
process.env.TOKEN
);



try{


console.log(
"🔄 Removing old commands..."
);



// DELETE OLD GUILD COMMANDS

await rest.put(

Routes.applicationGuildCommands(

client.user.id,

"1521671990505635965"

),

{

body:[]

}

);



console.log(
"🗑 Old commands removed"
);





// ADD NEW COMMANDS

await rest.put(

Routes.applicationGuildCommands(

client.user.id,

"1521671990505635965"

),

{

body:

commandsFile.commands.map(

cmd=>cmd.toJSON()

)

}

);



console.log(
"✅ New VVLL commands loaded"
);



}catch(err){

console.log(err);

}


}