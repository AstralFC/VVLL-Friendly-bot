// =======================================
// VVLL BOT
// commands.js Part 1/3
// Clean Command System
// =======================================

const {
    SlashCommandBuilder,
    REST,
    Routes,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder
} = require("discord.js");

const database = require("./database");



// ===============================
// VVLL COMMANDS ONLY
// ===============================

const data = [

    new SlashCommandBuilder()
    .setName("create-league")
    .setDescription("Create VVLL league"),


    new SlashCommandBuilder()
    .setName("team-create")
    .setDescription("Create a VVLL team")
    .addRoleOption(option =>
        option
        .setName("role")
        .setDescription("Team role")
        .setRequired(true)
    ),


    new SlashCommandBuilder()
    .setName("sign")
    .setDescription("Send player contract")
    .addUserOption(option =>
        option
        .setName("player")
        .setDescription("Player")
        .setRequired(true)
    ),


    new SlashCommandBuilder()
    .setName("create-game")
    .setDescription("Create a game"),


    new SlashCommandBuilder()
    .setName("schedule")
    .setDescription("View schedule"),


    new SlashCommandBuilder()
    .setName("game-result")
    .setDescription("Submit game result"),


    new SlashCommandBuilder()
    .setName("stat-game")
    .setDescription("Add game stats"),


    new SlashCommandBuilder()
    .setName("stat-player")
    .setDescription("Add player stats"),


    new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View stats"),


    new SlashCommandBuilder()
    .setName("my-stats")
    .setDescription("View your stats"),


    new SlashCommandBuilder()
    .setName("standings")
    .setDescription("View standings")

];





// ===============================
// REGISTER + CLEAR OLD COMMANDS
// ===============================

async function register(client){


    const rest = new REST({

        version:"10"

    }).setToken(process.env.TOKEN);



    // Clear global commands

    await rest.put(

        Routes.applicationCommands(
            client.user.id
        ),

        {
            body:[]
        }

    );



    // Clear server commands

    await rest.put(

        Routes.applicationGuildCommands(

            client.user.id,

            process.env.GUILD_ID

        ),

        {
            body:[]
        }

    );



    // Add VVLL commands

    await rest.put(

        Routes.applicationGuildCommands(

            client.user.id,

            process.env.GUILD_ID

        ),

        {

            body:data.map(
                command=>command.toJSON()
            )

        }

    );


    console.log("✅ VVLL commands loaded");

}



// Part 2/3 = command actions
// =======================================
// VVLL BOT
// commands.js Part 2/3
// Command Actions
// =======================================


async function run(client, interaction){

    const db = database.data;



    // CREATE LEAGUE

    if(interaction.commandName === "create-league"){


        db.league = {

            active:true,

            name:"VVLL"

        };


        db.teams = [];

        db.players = [];

        db.games = [];

        db.stats = [];


        database.save();


        return interaction.reply({

            content:"🏆 VVLL League created!"

        });

    }






    // CREATE TEAM

    if(interaction.commandName === "team-create"){


        const role =
        interaction.options.getRole("role");



        db.teams.push({

            id:role.id,

            name:role.name,

            wins:0,

            losses:0,

            draws:0,

            points:0,

            players:[]

        });



        database.save();



        return interaction.reply({

            content:
            `✅ Team created: **${role.name}**`

        });


    }







    // SIGN PLAYER

    if(interaction.commandName === "sign"){


        const player =
        interaction.options.getUser("player");



        const row =
        new ActionRowBuilder()

        .addComponents(


            new ButtonBuilder()

            .setCustomId(
                `contract_accept_${player.id}`
            )

            .setLabel("Accept Contract")

            .setStyle(
                ButtonStyle.Success
            ),



            new ButtonBuilder()

            .setCustomId(
                `contract_decline_${player.id}`
            )

            .setLabel("Decline")

            .setStyle(
                ButtonStyle.Danger
            )

        );



        return interaction.reply({

            content:
            `📄 ${player} received a VVLL contract.`,

            components:[row]

        });


    }







    // CREATE GAME

    if(interaction.commandName === "create-game"){


        if(db.teams.length < 2){

            return interaction.reply({

                content:
                "❌ Create at least 2 teams first.",

                ephemeral:true

            });

        }



        const menu =
        new StringSelectMenuBuilder()

        .setCustomId(
            "game_select"
        )

        .setPlaceholder(
            "Choose teams"
        )

        .setMinValues(2)

        .setMaxValues(2)

        .addOptions(

            db.teams.map(team=>({

                label:team.name,

                value:team.id

            }))

        );



        return interaction.reply({

            content:
            "⚽ Select two teams:",

            components:[

                new ActionRowBuilder()

                .addComponents(menu)

            ]

        });


    }







    // SCHEDULE

    if(interaction.commandName === "schedule"){


        const games =
        db.games.map((game,index)=>

        `${index+1}. ${game.home} 🆚 ${game.away}`

        ).join("\n");



        return interaction.reply({

            content:
            `📅 VVLL Schedule\n\n${games || "No games"}`

        });


    }


}
// =======================================
// VVLL BOT
// commands.js Part 3/3
// Buttons + Menus + Stats + Export
// =======================================



// ===============================
// BUTTON HANDLER
// ===============================

async function button(client, interaction){

    const db = database.data;



    if(interaction.customId.startsWith("contract_accept_")){


        const id =
        interaction.customId.split("_")[2];



        if(!db.players){

            db.players = [];

        }



        db.players.push({

            id:id,

            name:"Player",

            team:"Free Agent"

        });



        database.save();



        return interaction.update({

            content:
            "✅ Contract accepted!",

            components:[]

        });


    }





    if(interaction.customId.startsWith("contract_decline_")){


        return interaction.update({

            content:
            "❌ Contract declined.",

            components:[]

        });


    }


}







// ===============================
// DROPDOWN HANDLER
// ===============================

async function select(client, interaction){

    const db = database.data;



    if(interaction.customId === "game_select"){


        const teams =
        interaction.values.map(id =>

            db.teams.find(
                team=>team.id===id
            )

        );



        db.games.push({

            id:Date.now(),

            home:teams[0].name,

            away:teams[1].name,

            homeId:teams[0].id,

            awayId:teams[1].id,

            played:false,

            winner:null

        });



        database.save();



        return interaction.update({

            content:
            `⚽ Game created!\n${teams[0].name} 🆚 ${teams[1].name}`,

            components:[]

        });


    }

}








// ===============================
// MODALS
// ===============================

async function modal(client, interaction){

    return;

}








// ===============================
// EXPORTS
// ===============================

module.exports = {

    data,

    register,

    run,

    button,

    select,

    modal

};