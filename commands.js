// =====================================
// VVLL LEAGUE BOT
// COMMANDS.JS
// =====================================

const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const ownerPanel = require("./ownerPanel");
const teams = require("./teams");
const contracts = require("./contracts");
const league = require("./league");
const results = require("./results");
const standings = require("./standings");



const commands = [

    new SlashCommandBuilder()
    .setName("owner-panel")
    .setDescription("Open the VVLL owner panel"),



    new SlashCommandBuilder()
    .setName("standings")
    .setDescription("View league standings"),



    new SlashCommandBuilder()
    .setName("roster")
    .setDescription("View a team roster"),



    new SlashCommandBuilder()
    .setName("create-game")
    .setDescription("Create a league game")
    .addStringOption(option =>
        option
        .setName("home")
        .setDescription("Home team")
        .setRequired(true)
    )
    .addStringOption(option =>
        option
        .setName("away")
        .setDescription("Away team")
        .setRequired(true)
    ),



    new SlashCommandBuilder()
    .setName("sign")
    .setDescription("Send a player a contract")
    .addUserOption(option =>
        option
        .setName("player")
        .setDescription("Player to sign")
        .setRequired(true)
    ),



    new SlashCommandBuilder()
    .setName("team-create")
    .setDescription("Create a team"),


];





async function execute(interaction){


    if(interaction.commandName === "owner-panel"){


        if(!ownerPanel.isOwner(interaction.user.id)){

            return interaction.reply({
                content:"❌ Owner only.",
                ephemeral:true
            });

        }


        return interaction.reply(
            ownerPanel.getOwnerPanel()
        );


    }





    if(interaction.commandName === "standings"){


        let table =
        standings.getStandings();


        return interaction.reply({

            content:
            table.length

            ?

            table.map((t,i)=>
            `${i+1}. ${t.name} - ${t.points || 0} pts`
            ).join("\n")

            :

            "No teams yet."

        });


    }





    if(interaction.commandName === "create-game"){


        let home =
        interaction.options.getString("home");


        let away =
        interaction.options.getString("away");


        results.createGame(
            home,
            away
        );


        return interaction.reply(
            "✅ Game created."
        );


    }





    if(interaction.commandName === "sign"){


        let player =
        interaction.options.getUser("player");


        let team =
        teams.getManagerTeam(
            interaction.user.id
        );


        if(!team){

            return interaction.reply({
                content:
                "❌ You are not a manager.",
                ephemeral:true
            });

        }


        return interaction.reply({
            content:
            "📄 Contract system ready.",
            ephemeral:true
        });


    }


}





module.exports = {

    commands,

    execute

};