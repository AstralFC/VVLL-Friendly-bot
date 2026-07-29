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

const database = require("./database");





async function sendContract(player, manager, team){



    if(team.players.length >= 15){


        return {

            message:
            "❌ This team already has 15 players."

        };


    }



    const embed = new EmbedBuilder()

    .setColor("#ff0055")

    .setTitle("📄 VVLL Contract Offer")

    .setDescription(`

🏆 Team:

**${team.name}**


👔 Manager:

${manager}


You have been offered a spot.

Maximum roster size is **15 players**.

Accept or decline below.

`);





    const buttons = new ActionRowBuilder()

    .addComponents(


        new ButtonBuilder()

        .setCustomId(
            `contract_accept_${team.id}_${player.id}`
        )

        .setLabel("Accept")

        .setStyle(ButtonStyle.Success),



        new ButtonBuilder()

        .setCustomId(
            "contract_decline"
        )

        .setLabel("Decline")

        .setStyle(ButtonStyle.Danger)


    );





    await player.send({

        embeds:[embed],

        components:[buttons]

    });



    return {

        message:
        `✅ Contract sent to ${player.tag}`

    };


}








function acceptContract(playerId, teamId){



    const team =

    database.db.teams.find(

        t => t.id === teamId

    );



    if(!team){

        return false;

    }



    if(team.players.length >= 15){

        return false;

    }



    if(!team.players.includes(playerId)){


        team.players.push(playerId);


    }




    let player =

    database.db.players.find(

        p => p.id === playerId

    );




    if(!player){


        player = {

            id: playerId,

            goals:0,

            assists:0,

            saves:0,

            blocks:0,

            games:0

        };


        database.db.players.push(player);


    }





    database.save();



    return true;


}






module.exports = {

    sendContract,

    acceptContract

};