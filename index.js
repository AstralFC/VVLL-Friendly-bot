// ===============================
// VVLL LEAGUE SYSTEM SECTION 1/2
// ===============================

let leagueData = {
    teams: [],
    games: [],
    currentGame: 0
};


// Add this command into your commands list

new SlashCommandBuilder()

.setName("league-setup")

.setDescription("Setup VVLL league")

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
.setRequired(true));




// Put inside interactionCreate

if(interaction.commandName === "league-setup"){


leagueData.teams = [];


// Save teams

for(let i = 1; i <= 8; i++){

leagueData.teams.push(

interaction.options.getRole(`team${i}`)

);

}


// Randomize teams

leagueData.teams.sort(
()=>Math.random()-0.5
);


// Create matchups

leagueData.games = [];


for(let i = 0; i < 8; i += 2){

leagueData.games.push({

home: leagueData.teams[i],

away: leagueData.teams[i+1],

time: null

});

}



let teamList =
leagueData.teams
.map((t,i)=>
`${i+1}. ${t}`
)
.join("\n");



let setupEmbed =

new EmbedBuilder()

.setColor("#ff0055")

.setTitle("🏆 VVLL League Setup")

.setDescription(

`
**Step 1/3 — Teams Selected**

${teamList}


✅ Matchups created!
`

);



await interaction.reply({

embeds:[setupEmbed]

});



setTimeout(()=>{


let games =

leagueData.games.map((g,i)=>

`
⚽ **Game ${i+1}**

🏠 ${g.home}

🚌 ${g.away}
`

).join("\n");



let matchEmbed =

new EmbedBuilder()

.setColor("#ff0055")

.setTitle("⚽ VVLL Matchups")

.setDescription(

`
**Step 2/3 — Add Game Times**

${games}
`

);



let button =

new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId("league_time")

.setLabel("⏰ Add Times")

.setStyle(ButtonStyle.Primary)

);



interaction.channel.send({

embeds:[matchEmbed],

components:[button]

});


},2000);



}
// ===============================
// VVLL LEAGUE SYSTEM SECTION 2/2
// ===============================


// Add this inside your existing interactionCreate

if(interaction.isButton()){


if(interaction.customId === "league_time"){


let game =
leagueData.games[leagueData.currentGame];


let modal = new ModalBuilder()

.setCustomId("league_time_modal")

.setTitle(
`Game ${leagueData.currentGame + 1} Time`
);



let input = new TextInputBuilder()

.setCustomId("game_time")

.setLabel("Date and time")

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



// Save game times

if(interaction.isModalSubmit()){


if(interaction.customId === "league_time_modal"){


let game =
leagueData.games[leagueData.currentGame];



game.time =
interaction.fields.getTextInputValue(
"game_time"
);



leagueData.currentGame++;



// More games left

if(
leagueData.currentGame < leagueData.games.length
){


let next =
leagueData.games[leagueData.currentGame];


return interaction.reply({

content:

`✅ Game saved!

Next:

⚽ ${next.home} vs ${next.away}

Press **Add Times** again.`,

ephemeral:true

});


}



// Finished


let schedule = "";



leagueData.games.forEach((g,i)=>{


schedule +=

`
⚽ **Game ${i+1}**

🏠 ${g.home}

🚌 ${g.away}


📅 ${g.time}


🧑‍⚖️ Ref Required

────────────
`;



});



let finalEmbed =

new EmbedBuilder()

.setColor("#ff0055")

.setTitle("🏆 VVLL Final League Schedule")

.setDescription(schedule)

.setFooter({

text:"VVLL League System"

});



return interaction.reply({

embeds:[finalEmbed]

});


}


}