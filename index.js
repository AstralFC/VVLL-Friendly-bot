require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// Load Files
const database = require("./database");
const commands = require("./commands");
const interactions = require("./interactions");

// Ready
client.once("ready", async () => {
    console.log(`✅ ${client.user.tag} is online`);

    // Connect database
    await database.connect();

    // Register slash commands
    await commands.register(client);

    console.log("✅ Database Connected");
    console.log("✅ Commands Loaded");
});

// Slash Commands
client.on("interactionCreate", async interaction => {

    if (interaction.isChatInputCommand()) {
        return commands.run(interaction, client);
    }

    if (
        interaction.isButton() ||
        interaction.isModalSubmit() ||
        interaction.isAnySelectMenu()
    ) {
        return interactions.run(interaction, client);
    }

});

// Login
client.login(process.env.TOKEN);