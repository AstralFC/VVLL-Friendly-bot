// ===============================
// VVLL LEAGUE SETUP 1/2
// ===============================


// ADD THIS IN YOUR COMMANDS ARRAY

new SlashCommandBuilder()

.setName("league-setup")

.setDescription("Setup VVLL League")

.addRoleOption(o =>
o.setName("team1")
.setDescription("Team 1")
.setRequired(true))

.addRoleOption(o =>
o.setName("team2")
.setDescription("Team 2")
.setRequired(true))

.addRoleOption(o =>
o.setName("team3")
.setDescription("Team 3")
.setRequired(true))

.addRoleOption(o =>
o.setName("team4")
.setDescription("Team 4")
.setRequired(true))

.addRoleOption(o =>
o.setName("team5")
.setDescription("Team 5")
.setRequired(true))

.addRoleOption(o =>
o.setName("team6")
.setDescription("Team 6")
.setRequired(true))

.addRoleOption(o =>
o.setName("team7")
.setDescription("Team 7")
.setRequired(true))

.addRoleOption(o =>
o.setName("team8")
.setDescription("Team 8")
.setRequired(true)),




// ===============================
// PUT THIS INSIDE interactionCreate
// ===============================


if(interaction.commandName === "league-setup"){


league.teams = [];


// Get all teams

for(let i = 1; i <= 8; i++){

let team =
interaction.options.getRole(`team${i}`);

league.teams.push(team);

}



// Randomize teams

league.teams.sort(
() => Math.random() - 0.5
);



// Create games

league.games = [];


for(let i = 0; i < 8; i += 2){


league.games.push({

home: league.teams[i],

away: league.teams[i+1],

time: null

});


}



let matchupText = "";


league.games.forEach((game,index)=>{


matchupText +=

`
⚽ **Game ${index+1}**

${game.home}

VS

${game.away}

`;

});




let embed = new EmbedBuilder()

.setColor("#ff0055")

.setTitle("🏆 VVLL League Setup")

.setDescription(

`
✅ Teams Randomized!


${matchupText}


Next step:
⏰ Add game times

`

);



let button = new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId("league_add_time")

.setLabel("⏰ Add Times")

.setStyle(ButtonStyle.Primary)

);



return interaction.reply({

embeds:[embed],

components:[button]

});


}
// ===============================
// VVLL LEAGUE SETUP 2/2
// ===============================


// ADD TIME BUTTON

if(interaction.isButton()){


if(interaction.customId === "league_add_time"){



let modal = new ModalBuilder()

.setCustomId("league_time_modal")

.setTitle(
`Game ${league.current + 1} Time`
);



let input = new TextInputBuilder()

.setCustomId("game_time")

.setLabel("Enter date and time")

.setPlaceholder(
"Example: July 30 6:00 PM"
)

.setStyle(TextInputStyle.Short);



modal.addComponents(

new ActionRowBuilder()

.addComponents(input)

);



return interaction.showModal(modal);


}


}



// SAVE TIME


if(interaction.isModalSubmit()){


if(interaction.customId === "league_time_modal"){



let time =

interaction.fields.getTextInputValue(
"game_time"
);



league.games[league.current].time = time;



league.current++;



// More games left


if(league.current < league.games.length){



let next = league.games[league.current];



let embed = new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
`⏰ Game ${league.current + 1} Time`
)

.setDescription(

`
⚽ ${next.home}

VS

${next.away}


Enter the time for this game.

`

);



return interaction.reply({

embeds:[embed],

components:[

new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId("league_add_time")

.setLabel("Add Time")

.setStyle(ButtonStyle.Primary)

)

]

});


}




// FINISHED


let schedule = "";



league.games.forEach((game,index)=>{


let stamp = game.time;


schedule +=

`
⚽ **Game ${index+1}**

🏠 ${game.home}

🚌 ${game.away}


⏰ ${stamp}


🧑‍⚖️ Ref Needed

────────────

`;



});



let finalEmbed = new EmbedBuilder()

.setColor("#ff0055")

.setTitle("🏆 VVLL Final League Schedule")

.setDescription(schedule);



return interaction.reply({

embeds:[finalEmbed]

});


}


}