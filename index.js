// =======================================
// VVLL BOT
// index.js (Part 1/3)
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
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages
    ],
    partials: [
        Partials.Channel
    ]
});

// Make client available everywhere
client.commands = commands;
client.database = database;

client.once("ready", async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    // Load database
    database.load();

    // Register slash commands
    await commands.register(client);

    console.log("✅ VVLL Bot Ready");
});
// =======================================
// VVLL BOT
// index.js (Part 2/3)
// =======================================

// Handle every interaction

client.on("interactionCreate", async (interaction) => {

    try {

        // Slash Commands
        if (interaction.isChatInputCommand()) {

            return commands.run(client, interaction);

        }

        // Buttons
        if (interaction.isButton()) {

            return commands.button(client, interaction);

        }

        // Select Menus
        if (interaction.isStringSelectMenu()) {

            return commands.select(client, interaction);

        }

        // Modals
        if (interaction.isModalSubmit()) {

            return commands.modal(client, interaction);

        }

    } catch (err) {

        console.error(err);

        try {

            if (interaction.deferred || interaction.replied) {

                await interaction.followUp({
                    content: "❌ Something went wrong.",
                    ephemeral: true
                });

            } else {

                await interaction.reply({
                    content: "❌ Something went wrong.",
                    ephemeral: true
                });

            }

        } catch {}

    }

});
// =======================================
// VVLL BOT
// index.js (Part 3/3)
// =======================================

// Graceful shutdown

process.on("SIGINT", () => {

    console.log("💾 Saving database...");

    database.save();

    process.exit(0);

});

process.on("SIGTERM", () => {

    console.log("💾 Saving database...");

    database.save();

    process.exit(0);

});



// Catch unexpected errors

process.on("unhandledRejection", (error) => {

    console.error("Unhandled Promise Rejection:", error);

});

process.on("uncaughtException", (error) => {

    console.error("Uncaught Exception:", error);

});



// Login bot

if (!process.env.TOKEN) {
    console.error("❌ TOKEN is missing from your environment variables.");
    process.exit(1);
}

client.login(process.env.TOKEN);