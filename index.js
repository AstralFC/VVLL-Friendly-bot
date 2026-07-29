// =====================================
// VVLL LEAGUE BOT
// INDEX.JS
// =====================================

const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    Collection
} = require("discord.js");

const commandsFile = require("./commands");
const interactions = require("./interactions");

const config = require("./config");



const client = new Client({

    intents:[

        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages

    ]

});



client.commands = new Collection();




// Load commands

for(const command of commandsFile.commands){

    client.commands.set(
        command.name,
        command
    );

}





// Bot ready

client.once("ready", async()=>{


    console.log(
        `✅ ${client.user.tag} online`
    );


    const rest = new REST({

        version:"10"

    }).setToken(
        process.env.TOKEN
    );



    try{


        await rest.put(

            Routes.applicationCommands(
                client.user.id
            ),

            {

                body:
                commandsFile.commands.map(
                    cmd => cmd.toJSON()
                )

            }

        );


        console.log(
            "✅ Commands registered"
        );


    }

    catch(error){

        console.log(error);

    }


});






// Slash commands

client.on(
"interactionCreate",

async interaction=>{


    try{


        if(interaction.isChatInputCommand()){


            return commandsFile.execute(
                interaction
            );


        }



        if(
            interaction.isButton() ||
            interaction.isModalSubmit()
        ){


            return interactions.run(
                interaction
            );


        }


    }


    catch(error){


        console.log(error);


        if(!interaction.replied){


            await interaction.reply({

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