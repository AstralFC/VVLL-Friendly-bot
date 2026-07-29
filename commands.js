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
// ONLY VVLL COMMANDS
// ===============================

const data = [

    new SlashCommandBuilder()
    .setName("create-league")
    .setDescription("Create the VVLL league"),


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
    .setDescription("View the schedule"),


    new SlashCommandBuilder()
    .setName("game-result")
    .setDescription("Finish a game"),


    new SlashCommandBuilder()
    .setName("stat-game")
    .setDescription("Add game stats"),


    new SlashCommandBuilder()
    .setName("stat-player")
    .setDescription("Add player stats"),


    new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View player stats"),


    new SlashCommandBuilder()
    .setName("my-stats")
    .setDescription("View your stats"),


    new SlashCommandBuilder()
    .setName("standings")
    .setDescription("View league standings")

];




// ===============================
// REGISTER COMMANDS
// ALSO CLEARS OLD COMMANDS
// ===============================

async function register(client){

    const rest = new REST({
        version:"10"
    }).setToken(process.env.TOKEN);



    // Delete old duplicate commands

    await rest.put(

        Routes.applicationGuildCommands(
            client.user.id,
            process.env.GUILD_ID
        ),

        {
            body:[]
        }

    );



    // Add only VVLL commands

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


    console.log("✅ VVLL commands registered");

}



// Part 2/3 adds the command actions
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



        if(db.teams.find(t=>t.id===role.id)){


            return interaction.reply({

                content:"❌ This team already exists.",

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
            `✅ Created team **${role.name}**`

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
                `accept_contract_${player.id}`
            )

            .setLabel("Accept")

            .setStyle(ButtonStyle.Success),



            new ButtonBuilder()

            .setCustomId(
                `decline_contract_${player.id}`
            )

            .setLabel("Decline")

            .setStyle(ButtonStyle.Danger)

        );



        return interaction.reply({

            content:
            `📄 ${player} received a VVLL contract offer.`,

            components:[row]

        });


    }






    // CREATE GAME

    if(interaction.commandName === "create-game"){



        if(db.teams.length < 2){


            return interaction.reply({

                content:
                "❌ Need at least 2 teams first.",

                ephemeral:true

            });

        }




        const menu =
        new StringSelectMenuBuilder()

        .setCustomId("create_match")

        .setPlaceholder("Choose 2 teams")

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
            "⚽ Select the teams:",

            components:[

                new ActionRowBuilder()

                .addComponents(menu)

            ]

        });


    }






    // SCHEDULE

    if(interaction.commandName === "schedule"){


        const games =
        db.games.map((g,i)=>

        `${i+1}. ${g.home} 🆚 ${g.away}`

        ).join("\n");



        return interaction.reply({

            content:
            `📅 VVLL Schedule\n\n${games || "No games created."}`

        });


    }


}
// =======================================
// VVLL BOT
// commands.js Part 3/3
// Buttons + Menus + Stats + Exports
// =======================================


// ===============================
// BUTTON HANDLER
// ===============================

async function button(client, interaction){

    const db = database.data;



    // ACCEPT CONTRACT

    if(interaction.customId.startsWith("accept_contract_")){


        const playerId =
        interaction.customId.split("_")[2];



        if(!db.players){

            db.players = [];

        }



        if(!db.players.find(p=>p.id===playerId)){


            db.players.push({

                id:playerId,

                name:"Player",

                team:"Free Agent"

            });


        }



        database.save();



        return interaction.update({

            content:"✅ Contract accepted!",

            components:[]

        });


    }




    // DECLINE CONTRACT

    if(interaction.customId.startsWith("decline_contract_")){


        return interaction.update({

            content:"❌ Contract declined.",

            components:[]

        });


    }

}







// ===============================
// DROPDOWN HANDLER
// ===============================

async function select(client, interaction){

    const db = database.data;



    if(interaction.customId === "create_match"){



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
// MODALS
// ===============================

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