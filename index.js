// =======================================
// VVLL BOT
// index.js
// =======================================

require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Partials
} = require("discord.js");


const commands = require("./commands");
const database = require("./database");



const client = new Client({

    intents:[

        GatewayIntentBits.Guilds,

        GatewayIntentBits.GuildMembers,

        GatewayIntentBits.GuildMessages

    ],


    partials:[

        Partials.Channel

    ]

});




// Make available

client.commands = commands;

client.database = database;




// Bot ready

client.once("ready", async ()=>{


    console.log(
        `✅ Logged in as ${client.user.tag}`
    );


    database.load();


    await commands.register(client);


    console.log(
        "✅ VVLL Bot Ready"
    );


});







// Interactions

client.on(
    "interactionCreate",
    async interaction=>{


    try{


        if(interaction.isChatInputCommand()){


            return commands.run(
                client,
                interaction
            );


        }



        if(interaction.isButton()){


            return commands.button(
                client,
                interaction
            );


        }




        if(interaction.isStringSelectMenu()){


            return commands.select(
                client,
                interaction
            );


        }




        if(interaction.isModalSubmit()){


            return commands.modal(
                client,
                interaction
            );


        }



    }catch(error){


        console.error(error);



        if(!interaction.replied){


            await interaction.reply({

                content:
                "❌ Error happened.",

                ephemeral:true

            });


        }


    }


});








// Shutdown save

process.on(
"SIGINT",
()=>{

    database.save();

    process.exit();

});



process.on(
"SIGTERM",
()=>{

    database.save();

    process.exit();

});








// Error protection

process.on(
"unhandledRejection",
error=>{

    console.error(
        "Unhandled:",
        error
    );

});



process.on(
"uncaughtException",
error=>{

    console.error(
        "Crash:",
        error
    );

});








// Login

if(!process.env.TOKEN){


    console.error(
        "❌ Missing TOKEN"
    );


    process.exit(1);

}



client.login(
    process.env.TOKEN
);