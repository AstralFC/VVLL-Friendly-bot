// =====================================
// VVLL LEAGUE BOT
// OWNERPANEL.JS
// =====================================

const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const config = require("./config");
const league = require("./league");
const standings = require("./standings");



// Check owner permissions

function isOwner(userId){

    return (
        userId === config.OWNER_ID ||
        userId === config.CO_OWNER_ID
    );

}





// Create owner panel

function getOwnerPanel(){


    const embed = new EmbedBuilder()

    .setColor("#ff0055")

    .setTitle("🏆 VVLL Owner Panel")

    .setDescription(`

Manage the entire league from here.

⚽ League Setup
👥 Teams
📋 Rosters
🎮 Games
📊 Stats
🔄 Reset League

`);



    const row = new ActionRowBuilder()

    .addComponents(


        new ButtonBuilder()

        .setCustomId("league_setup")

        .setLabel("🏆 League Setup")

        .setStyle(ButtonStyle.Primary),



        new ButtonBuilder()

        .setCustomId("reset_league")

        .setLabel("🔄 Reset League")

        .setStyle(ButtonStyle.Danger),



        new ButtonBuilder()

        .setCustomId("view_standings")

        .setLabel("📊 Standings")

        .setStyle(ButtonStyle.Secondary),



        new ButtonBuilder()

        .setCustomId("manage_games")

        .setLabel("🎮 Games")

        .setStyle(ButtonStyle.Secondary)

    );



    const row2 = new ActionRowBuilder()

    .addComponents(


        new ButtonBuilder()

        .setCustomId("manage_stats")

        .setLabel("📈 Edit Stats")

        .setStyle(ButtonStyle.Success),



        new ButtonBuilder()

        .setCustomId("manage_teams")

        .setLabel("👥 Teams")

        .setStyle(ButtonStyle.Secondary)

    );


    return {

        embeds:[embed],

        components:[row,row2]

    };

}





// Handle buttons

async function handlePanel(interaction){


    if(!isOwner(interaction.user.id)){


        return interaction.reply({

            content:"❌ Owner only.",

            ephemeral:true

        });

    }



    if(interaction.customId === "reset_league"){


        league.resetLeague();


        return interaction.reply({

            content:"✅ League has been reset.",

            ephemeral:true

        });

    }





    if(interaction.customId === "view_standings"){


        let data = standings.getStandings();


        return interaction.reply({

            content:

            data.length
            ? data.map((t,i)=>
            `${i+1}. ${t.name} - ${t.points || 0} pts`
            ).join("\n")

            : "No teams yet.",

            ephemeral:true

        });

    }





    return interaction.reply({

        content:`🔧 ${interaction.customId} opened.`,

        ephemeral:true

    });


}





module.exports = {

    getOwnerPanel,

    handlePanel,

    isOwner

};