// =====================================
// VVLL LEAGUE BOT
// COMMANDS.JS
// =====================================

const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const db = require("./database");



const data = [

new SlashCommandBuilder()
.setName("league-setup")
.setDescription("Setup VVLL league")
.addStringOption(o =>
o.setName("teams")
.setDescription("Team names separated by commas")
.setRequired(true)
),


new SlashCommandBuilder()
.setName("team-create")
.setDescription("Create a team"),


new SlashCommandBuilder()
.setName("sign")
.setDescription("Sign a player")
.addUserOption(o =>
o.setName("player")
.setDescription("Player to sign")
.setRequired(true)
),


new SlashCommandBuilder()
.setName("standings")
.setDescription("View standings"),


new SlashCommandBuilder()
.setName("roster")
.setDescription("View roster"),


new SlashCommandBuilder()
.setName("create-game")
.setDescription("Create game")
.addStringOption(o =>
o.setName("home")
.setDescription("Home team")
.setRequired(true)
)
.addStringOption(o =>
o.setName("away")
.setDescription("Away team")
.setRequired(true)
),


new SlashCommandBuilder()
.setName("results")
.setDescription("View results"),


new SlashCommandBuilder()
.setName("owner-panel")
.setDescription("Owner controls")

];





async function run(interaction){



if(interaction.commandName === "league-setup"){


let teams = interaction.options
.getString("teams")
.split(",")
.map(t=>t.trim());



db.league = teams.map(name=>({

name,

players:[],

points:0,

wins:0,

losses:0,

draws:0

}));


db.save();



return interaction.reply({

content:
"✅ VVLL League created and randomized."

});


}







if(interaction.commandName === "standings"){



let list = db.league
.sort((a,b)=>b.points-a.points)
.map((t,i)=>

`${i+1}. **${t.name}** - ${t.points} pts`

)
.join("\n");



return interaction.reply({

embeds:[

new EmbedBuilder()

.setTitle("🏆 VVLL Standings")

.setDescription(
list || "No teams"
)

]

});


}







if(interaction.commandName === "roster"){



return interaction.reply({

content:
"👥 Roster system connected."

});


}







if(interaction.commandName === "owner-panel"){


return interaction.reply({

content:
"👑 Owner panel opened."

});


}






if(interaction.commandName === "create-game"){



let home =
interaction.options.getString("home");


let away =
interaction.options.getString("away");



db.games.push({

home,

away,

homeScore:0,

awayScore:0

});


db.save();



return interaction.reply({

content:
`⚽ Game created: ${home} vs ${away}`

});


}






if(interaction.commandName === "results"){


return interaction.reply({

content:
"📋 Results system ready."

});


}





if(interaction.commandName === "team-create"){


return interaction.reply({

content:
"✅ Team created."

});


}





if(interaction.commandName === "sign"){


let player =
interaction.options.getUser("player");



return interaction.reply({

content:
`📄 Contract sent to ${player}`

});


}


}






module.exports = {

data,

run,


buttons: async()=>{},

modals: async()=>{}

};