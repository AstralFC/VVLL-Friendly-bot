// =====================================
// VVLL LEAGUE BOT
// CONTRACTS.JS
// =====================================

const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const teams = require("./teams");



// Send contract DM

async function sendContract(player, manager, team, channel) {


    if(team.players.length >= teams.MAX_PLAYERS){

        return {
            success:false,
            message:
            `❌ ${team.name} already has ${teams.MAX_PLAYERS} players.`
        };

    }



    const embed = new EmbedBuilder()

    .setColor("#ff0055")

    .setTitle("📄 VVLL Player Contract")

    .setDescription(`

🏆 Team:
**${team.name}**

👔 Manager:
${manager}


You have received a contract offer.


⚠️ Maximum roster size:
**15 players per team**


Do you accept?

`);




    const buttons = new ActionRowBuilder()

    .addComponents(

        new ButtonBuilder()

        .setCustomId(
            `contract_accept_${team.role}_${player.id}`
        )

        .setLabel("✅ Accept")

        .setStyle(ButtonStyle.Success),



        new ButtonBuilder()

        .setCustomId(
            "contract_decline"
        )

        .setLabel("❌ Decline")

        .setStyle(ButtonStyle.Danger)

    );




    try{


        await player.send({

            embeds:[embed],

            components:[buttons]

        });



        return {

            success:true,

            message:
            "✅ Contract sent."

        };



    }catch(error){


        return {

            success:false,

            message:
            "❌ Cannot DM this player."

        };


    }


}





// Accept contract

function acceptContract(playerId, teamRole){


    let team = require("./database").db.teams.find(

        t => t.role === teamRole

    );



    if(!team){

        return false;

    }



    if(team.players.length >= teams.MAX_PLAYERS){

        return false;

    }



    if(!team.players.includes(playerId)){


        team.players.push(playerId);


    }



    require("./database").save();



    return true;


}





module.exports = {

    sendContract,

    acceptContract

};