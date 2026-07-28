// ===============================
// VVLL LEAGUE SETUP 1/2
// ===============================

if(interaction.commandName === "league-setup") {

    league.teams = [];
    league.games = [];
    league.current = 0;


    // Get selected teams

    for(let i = 1; i <= 8; i++) {

        let team = interaction.options.getRole(`team${i}`);

        league.teams.push(team);

    }


    // Randomize teams

    league.teams.sort(() => Math.random() - 0.5);



    // Create matchups

    for(let i = 0; i < league.teams.length; i += 2) {

        league.games.push({

            home: league.teams[i],

            away: league.teams[i + 1],

            time: null

        });

    }



    let matches = "";

    league.games.forEach((game,index)=>{

        matches +=
`
⚽ **Game ${index + 1}**

🏠 ${game.home}

VS

🚌 ${game.away}

`;

    });



    const embed = new EmbedBuilder()

    .setColor("#ff0055")

    .setTitle("🏆 VVLL League Matchups")

    .setDescription(

`
${matches}


Click the button below when you are ready to add times.
`

    );



    const row = new ActionRowBuilder()

    .addComponents(

        new ButtonBuilder()

        .setCustomId("league_add_time")

        .setLabel("⏰ Add Game Times")

        .setStyle(ButtonStyle.Primary)

    );



    return interaction.reply({

        embeds:[embed],

        components:[row]

    });

}
// ===============================
// VVLL LEAGUE SETUP 2/2
// ===============================


// ADD TIME BUTTON

if(interaction.isButton()){


if(interaction.customId === "league_add_time"){


let game = league.games[league.current];


let modal = new ModalBuilder()

.setCustomId("league_time_modal")

.setTitle(
`Game ${league.current + 1} Time`
);



let input = new TextInputBuilder()

.setCustomId("time")

.setLabel("Enter game date and time")

.setPlaceholder(
"July 30 6:00 PM"
)

.setStyle(TextInputStyle.Short);



modal.addComponents(

new ActionRowBuilder()

.addComponents(input)

);



return interaction.showModal(modal);


}


}



// SAVE GAME TIMES


if(interaction.isModalSubmit()){



if(interaction.customId === "league_time_modal"){



league.games[league.current].time =

interaction.fields.getTextInputValue("time");



league.current++;



// More games

if(league.current < league.games.length){


let next = league.games[league.current];


let embed = new EmbedBuilder()

.setColor("#ff0055")

.setTitle(
`⏰ Game ${league.current + 1}`
)

.setDescription(

`
⚽ ${next.home}

VS

${next.away}


Enter the time for this game.

`

);



let row = new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId("league_add_time")

.setLabel("Add Time")

.setStyle(ButtonStyle.Primary)

);



return interaction.reply({

embeds:[embed],

components:[row]

});


}




// FINISHED SCHEDULE


let schedule = "";



league.games.forEach((game,index)=>{


schedule +=

`
⚽ **Game ${index + 1}**

🏠 ${game.home}

VS

🚌 ${game.away}


⏰ ${game.time}


🧑‍⚖️ Ref Needed


────────────

`;



});



let finalEmbed = new EmbedBuilder()

.setColor("#ff0055")

.setTitle("🏆 VVLL Final Schedule")

.setDescription(schedule);



return interaction.reply({

embeds:[finalEmbed]

});


}


}