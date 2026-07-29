// =====================================
// VVLL LEAGUE BOT
// INDEX.JS
// =====================================

require("dotenv").config();


const {
    Client,
    GatewayIntentBits,
    REST,
    Routes
} = require("discord.js");



const config = require("./config");

const commandFile =
require("./commands");

const interactions =
require("./interactions");





const client = new Client({

    intents:[

        GatewayIntentBits.Guilds,

        GatewayIntentBits.GuildMembers,

        GatewayIntentBits.DirectMessages

    ]

});







client.once("ready", async()=>{


    console.log(
        `✅ ${client.user.tag} online`
    );



    const rest = new REST({

        version:"10"

    })

    .setToken(

        process.env.TOKEN

    );




    try{


        await rest.put(


            Routes.applicationGuildCommands(

                client.user.id,

                config.GUILD_ID

            ),


            {

                body:

                commandFile.commands.map(

                    cmd => cmd.toJSON()

                )

            }


        );



        console.log(
            "✅ Slash commands registered"
        );


    }


    catch(error){


        console.log(
            "❌ Command register error:",
            error
        );


    }



});








// Commands

client.on(

"interactionCreate",

async interaction=>{


    if(interaction.isChatInputCommand()){


        await commandFile.execute(

            interaction

        );


    }



    else{


        await interactions.run(

            interaction

        );


    }



});







client.login(

    process.env.TOKEN

);