// =======================================
// VVLL BOT
// commands.js Part 1/3
// =======================================

const {
    SlashCommandBuilder,
    REST,
    Routes,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    EmbedBuilder
} = require("discord.js");

const database = require("./database");



// ===============================
// SLASH COMMAND LIST
// ===============================

const data = [

    new SlashCommandBuilder()
    .setName("create-league")
    .setDescription("Create the VVLL league"),


    new SlashCommandBuilder()
    .setName("team-create")
    .setDescription("Create a team")
    .addRoleOption(option =>
        option
        .setName("role")
        .setDescription("Team role")
        .setRequired(true)
    ),


    new SlashCommandBuilder()
    .setName("sign")
    .setDescription("Send a player contract")
    .addUserOption(option =>
        option
        .setName("player")
        .setDescription("Player to sign")
        .setRequired(true)
    ),


    new SlashCommandBuilder()
    .setName("create-game")
    .setDescription("Create a league game"),


    new SlashCommandBuilder()
    .setName("schedule")
    .setDescription("View game schedule"),


    new SlashCommandBuilder()
    .setName("game-result")
    .setDescription("Submit game result"),


    new SlashCommandBuilder()
    .setName("stat-game")
    .setDescription("Add game stats"),


    new SlashCommandBuilder()
    .setName("stat-player")
    .setDescription("Update player stats"),


    new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View player stats"),


    new SlashCommandBuilder()
    .setName("my-stats")
    .setDescription("View your stats"),


    new SlashCommandBuilder()
    .setName("standings")
    .setDescription("View standings"),


    new SlashCommandBuilder()
    .setName("reset-league")
    .setDescription("Reset VVLL league")

];





// ===============================
// REGISTER COMMANDS
// ===============================

async function register(client){

    const rest = new REST({
        version:"10"
    }).setToken(process.env.TOKEN);



    await rest.put(

        Routes.applicationGuildCommands(
            client.user.id,
            process.env.GUILD_ID
        ),

        {
            body:data.map(
                command => command.toJSON()
            )
        }

    );

}




// Parts 2/3 and 3/3 will add:
// - command logic
// - buttons
// - dropdowns
// - stats
// - standings
// =======================================
// VVLL BOT
// commands.js Part 2/3
// Command Logic
// =======================================


// ===============================
// SLASH COMMAND HANDLER
// ===============================

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



        if(db.teams.find(t=>t.id===role.id)){

            return interaction.reply({

                content:"❌ Team already exists.",

                ephemeral:true

            });

        }




        db.teams.push({

            id:role.id,

            name:role.name,

            players:[],

            wins:0,

            losses:0,

            draws:0,

            points:0

        });



        database.save();



        return interaction.reply({

            content:
            `✅ Team created: **${role.name}**`

        });

    }






    // SIGN PLAYER CONTRACT

    if(interaction.commandName === "sign"){

        const player =
        interaction.options.getUser("player");



        const buttons = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()

            .setCustomId(
                `contract_accept_${player.id}`
            )

            .setLabel("Accept Contract")

            .setStyle(ButtonStyle.Success),



            new ButtonBuilder()

            .setCustomId(
                `contract_decline_${player.id}`
            )

            .setLabel("Decline")

            .setStyle(ButtonStyle.Danger)

        );



        return interaction.reply({

            content:
            `📄 ${player}, you received a VVLL contract offer.`,

            components:[buttons]

        });

    }






    // CREATE GAME

    if(interaction.commandName === "create-game"){


        if(db.teams.length < 2){

            return interaction.reply({

                content:
                "❌ You need at least 2 teams.",

                ephemeral:true

            });

        }



        const menu =
        new StringSelectMenuBuilder()

        .setCustomId("select_game_teams")

        .setPlaceholder("Select 2 teams")

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
            "⚽ Choose teams for the match:",

            components:[

                new ActionRowBuilder()

                .addComponents(menu)

            ]

        });

    }

}
// =======================================
// VVLL BOT
// commands.js Part 3/3
// Buttons + Menus + Stats
// =======================================



// ===============================
// BUTTON HANDLER
// ===============================

async function button(client, interaction){

    const db = database.data;



    // ACCEPT CONTRACT

    if(interaction.customId.startsWith("contract_accept_")){


        const playerId =
        interaction.customId.split("_")[2];



        if(!db.players.find(p=>p.id===playerId)){


            db.players.push({

                id:playerId,

                name:"Player",

                team:"Free Agent"

            });


        }



        database.save();



        return interaction.update({

            content:
            "✅ Contract accepted!",

            components:[]

        });


    }





    // DECLINE CONTRACT

    if(interaction.customId.startsWith("contract_decline_")){


        return interaction.update({

            content:
            "❌ Contract declined.",

            components:[]

        });


    }


}







// ===============================
// SELECT MENU HANDLER
// ===============================

async function select(client, interaction){

    const db = database.data;



    if(interaction.customId === "select_game_teams"){


        const teams =
        interaction.values.map(id=>

            db.teams.find(
                t=>t.id===id
            )

        );



        db.games.push({

            id:Date.now().toString(),

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
            `⚽ Game created!\n\n${teams[0].name} 🆚 ${teams[1].name}`,

            components:[]

        });


    }


}







// ===============================
// OTHER COMMANDS
// ===============================

async function extraCommands(client, interaction){


    const db = database.data;



    if(interaction.commandName==="schedule"){


        const games =
        db.games.map((g,i)=>

        `${i+1}. ${g.home} 🆚 ${g.away}`

        ).join("\n");



        return interaction.reply({

            content:
            `📅 VVLL Schedule\n\n${games || "No games"}`

        });


    }



}







async function modal(client, interaction){

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