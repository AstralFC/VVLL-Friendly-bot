// =======================================
// VVLL BOT
// commands.js Part 1/6
// =======================================

const {
    SlashCommandBuilder,
    REST,
    Routes
} = require("discord.js");


const database = require("./database");



// ===============================
// COMMAND LIST
// ===============================

const data = [

    new SlashCommandBuilder()
    .setName("create-league")
    .setDescription("Create a VVLL league"),



    new SlashCommandBuilder()
    .setName("team-create")
    .setDescription("Create a team from a role")
    .addRoleOption(option =>
        option
        .setName("role")
        .setDescription("Team role")
        .setRequired(true)
    ),



    new SlashCommandBuilder()
    .setName("sign")
    .setDescription("Sign a player")
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
    .setDescription("View league schedule"),



    new SlashCommandBuilder()
    .setName("game-result")
    .setDescription("Enter game result"),



    new SlashCommandBuilder()
    .setName("stat-game")
    .setDescription("Add game stats"),



    new SlashCommandBuilder()
    .setName("stat-player")
    .setDescription("Edit player stats"),



    new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View league stats"),



    new SlashCommandBuilder()
    .setName("my-stats")
    .setDescription("View your stats"),



    new SlashCommandBuilder()
    .setName("standings")
    .setDescription("View standings"),



    new SlashCommandBuilder()
    .setName("reset-league")
    .setDescription("Reset league")

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




// Empty handlers for now
// Parts 2-6 will fill these

async function run(client, interaction){}

async function button(client, interaction){}

async function select(client, interaction){}

async function modal(client, interaction){}




module.exports = {

    data,

    register,

    run,

    button,

    select,

    modal

};
// ===============================
// COMMAND HANDLER
// PART 2/6
// ===============================

async function run(client, interaction){


    const db = database.data;



    // CREATE LEAGUE

    if(interaction.commandName === "create-league"){


        db.league.active = true;


        db.teams = [];

        db.players = [];

        db.games = [];

        db.stats = [];



        database.save();



        return interaction.reply({

            content:
            "🏆 VVLL League has been created!",

            ephemeral:true

        });


    }





    // TEAM CREATE

    if(interaction.commandName === "team-create"){



        const role =
        interaction.options.getRole("role");



        const exists =
        db.teams.find(
            team => team.id === role.id
        );



        if(exists){

            return interaction.reply({

                content:
                "❌ This team already exists.",

                ephemeral:true

            });

        }




        db.teams.push({

            id: role.id,

            name: role.name,

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








    // SIGN PLAYER

    if(interaction.commandName === "sign"){



        const player =
        interaction.options.getUser("player");



        const team =
        db.teams.find(
            team =>
            interaction.member.roles.cache.has(team.id)
        );



        if(!team){

            return interaction.reply({

                content:
                "❌ You need a team role.",

                ephemeral:true

            });

        }




        if(team.players.length >= 15){


            return interaction.reply({

                content:
                "❌ Your team already has the maximum 15 players.",

                ephemeral:true

            });


        }





        team.players.push({

            id: player.id,

            name: player.username

        });



        database.save();




        return interaction.reply({

            content:
            `✅ ${player} has been signed to **${team.name}**`

        });


    }



}
// ===============================
// COMMAND HANDLER
// PART 3/6
// ===============================

async function run(client, interaction){

    const db = database.data;



    // CREATE GAME

    if(interaction.commandName === "create-game"){


        if(db.teams.length < 2){

            return interaction.reply({

                content:
                "❌ You need at least 2 teams first.",

                ephemeral:true

            });

        }



        const team1 = db.teams[0];

        const team2 = db.teams[1];



        const game = {

            id: Date.now().toString(),

            home: team1.name,

            away: team2.name,

            homeId: team1.id,

            awayId: team2.id,

            played:false,

            homeScore:0,

            awayScore:0,

            winner:null

        };



        db.games.push(game);


        database.save();



        return interaction.reply({

            content:
            `⚽ Game created!\n\n**${team1.name}** vs **${team2.name}**`

        });


    }








    // SCHEDULE

    if(interaction.commandName === "schedule"){



        if(db.games.length === 0){


            return interaction.reply({

                content:
                "📅 No games scheduled.",

                ephemeral:true

            });


        }



        let list = db.games.map(

            (game,index)=>

            `**Game ${index+1}**\n${game.home} 🆚 ${game.away}\nStatus: ${game.played ? "Finished" : "Scheduled"}`

        ).join("\n\n");




        return interaction.reply({

            content:
            `📅 **VVLL Schedule**\n\n${list}`

        });



    }


}
// ===============================
// COMMAND HANDLER
// PART 5/6
// ===============================

async function run(client, interaction){

    const db = database.data;



    // STAT PLAYER

    if(interaction.commandName === "stat-player"){


        const player =
        interaction.user;



        let stats =
        db.stats.find(
            s => s.id === player.id
        );



        if(!stats){


            stats = {

                id: player.id,

                name: player.username,

                goals:0,

                assists:0,

                saves:0,

                blocks:0

            };


            db.stats.push(stats);


        }



        // Adds a test stat for now
        // Part 6 will add buttons/forms

        stats.goals += 1;



        database.save();



        return interaction.reply({

            content:
            `📊 Updated ${player.username}'s stats\n⚽ Goals: ${stats.goals}`

        });


    }







    // STAT GAME

    if(interaction.commandName === "stat-game"){



        const game =
        db.games.find(
            g => g.played
        );



        if(!game){

            return interaction.reply({

                content:
                "❌ No completed games.",

                ephemeral:true

            });

        }




        return interaction.reply({

            content:
            `📊 Stats added for ${game.home} vs ${game.away}`

        });



    }



}
// ===============================
// COMMAND HANDLER
// PART 6/6
// ===============================

async function run(client, interaction){

    const db = database.data;



    // STATS

    if(interaction.commandName === "stats"){


        if(db.stats.length === 0){

            return interaction.reply({

                content:
                "📊 No player stats yet."

            });

        }



        const list = db.stats

        .sort(
            (a,b)=>b.goals-a.goals
        )

        .map(
            (p,i)=>
            `${i+1}. **${p.name}** - ⚽ ${p.goals} | 🅰 ${p.assists} | 🧤 ${p.saves} | 🧱 ${p.blocks}`
        )

        .join("\n");



        return interaction.reply({

            content:
            `📊 **VVLL Player Stats**\n\n${list}`

        });


    }








    // MY STATS

    if(interaction.commandName === "my-stats"){



        const player =
        db.stats.find(
            p=>p.id===interaction.user.id
        );



        if(!player){

            return interaction.reply({

                content:
                "❌ You have no stats yet.",

                ephemeral:true

            });

        }




        return interaction.reply({

            content:

            `📊 **${player.name}**\n\n`+

            `⚽ Goals: ${player.goals}\n`+

            `🅰 Assists: ${player.assists}\n`+

            `🧤 Saves: ${player.saves}\n`+

            `🧱 Blocks: ${player.blocks}`

        });



    }








    // STANDINGS

    if(interaction.commandName === "standings"){



        if(db.teams.length === 0){

            return interaction.reply({

                content:
                "❌ No teams created."

            });

        }




        const table = db.teams

        .sort(
            (a,b)=>b.points-a.points
        )

        .map(
            (t,i)=>
            `${i+1}. **${t.name}**\n🏆 ${t.points} pts | W ${t.wins} | D ${t.draws} | L ${t.losses}`
        )

        .join("\n\n");




        return interaction.reply({

            content:
            `🏆 **VVLL Standings**\n\n${table}`

        });


    }








    // RESET LEAGUE

    if(interaction.commandName === "reset-league"){


        database.reset();



        return interaction.reply({

            content:
            "♻️ VVLL League has been reset."

        });


    }



}