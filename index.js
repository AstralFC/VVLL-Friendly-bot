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


const config = require("./database");
const commands = require("./commands");



const client = new Client({

    intents:[

        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers

    ]

});




// When bot starts

client.once("ready", async()=>{


    console.log(
        `✅ ${client.user.tag} is online`
    );


    const rest = new REST({

        version:"10"

    }).setToken(
        process.env.TOKEN
    );



    try{


        await rest.put(

            Routes.applicationGuildCommands(

                client.user.id,

                process.env.GUILD_ID

            ),

            {

                body:

                commands.data.map(

                    cmd => cmd.toJSON()

                )

            }

        );


        console.log(
            "✅ Commands updated"
        );


    }

    catch(error){

        console.log(error);

    }


});







// Commands + Buttons

client.on(
"interactionCreate",

async interaction=>{


    try{


        if(interaction.isChatInputCommand()){


            return commands.run(
                interaction
            );


        }





        if(interaction.isButton()){


            return commands.buttons(
                interaction
            );


        }




        if(interaction.isModalSubmit()){


            return commands.modals(
                interaction
            );


        }



    }


    catch(error){


        console.log(error);


        if(!interaction.replied){


            interaction.reply({

                content:
                "❌ Something went wrong.",

                ephemeral:true

            });


        }


    }



});







client.login(
    process.env.TOKEN
);