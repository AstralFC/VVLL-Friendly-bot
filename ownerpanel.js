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





// Check owner

function isOwner(id){


    return (

        id === config.OWNER_ID ||

        id === config.CO_OWNER_ID

    );


}







// Create panel

function getOwnerPanel(){



    const embed = new EmbedBuilder()


    .setColor("#ff0055")


    .setTitle("👑 VVLL Owner Panel")


    .setDescription(`

Manage your league here.


🏆 League Setup

🎮 Manage Games

📊 View Standings

🔄 Restart League


`);



    const buttons = new ActionRowBuilder()

    .addComponents(


        new ButtonBuilder()

        .setCustomId(
            "league_setup"
        )

        .setLabel("🏆 League Setup")

        .setStyle(ButtonStyle.Primary),



        new ButtonBuilder()

        .setCustomId(
            "manage_games"
        )

        .setLabel("🎮 Games")

        .setStyle(ButtonStyle.Secondary),



        new ButtonBuilder()

        .setCustomId(
            "view_standings"
        )

        .setLabel("📊 Standings")

        .setStyle(ButtonStyle.Success),



        new ButtonBuilder()

        .setCustomId(
            "reset_league"
        )

        .setLabel("🔄 Reset")

        .setStyle(ButtonStyle.Danger)



    );




    return {


        embeds:[embed],


        components:[buttons]


    };


}








// Handle buttons

async function handlePanel(interaction){



    if(!isOwner(interaction.user.id)){


        return interaction.reply({

            content:
            "❌ Owner only.",

            ephemeral:true

        });


    }






    if(interaction.customId === "reset_league"){



        league.resetLeague();



        return interaction.reply({

            content:
            "✅ League has been reset.",

            ephemeral:true

        });


    }






    if(interaction.customId === "view_standings"){



        return interaction.reply({

            content:
            "📊 Opening standings...",

            ephemeral:true

        });


    }






    if(interaction.customId === "manage_games"){



        return interaction.reply({

            content:
            "🎮 Game manager opened.",

            ephemeral:true

        });


    }






    if(interaction.customId === "league_setup"){



        return interaction.reply({

            content:
            "🏆 Use /league-setup to create your league.",

            ephemeral:true

        });


    }





}







module.exports = {


    isOwner,


    getOwnerPanel,


    handlePanel


};