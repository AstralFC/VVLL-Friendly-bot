const {
    Client,
    GatewayIntentBits,
    REST,
    Routes
} = require("discord.js");

const {
    commands,
    handleCommand
} = require("./commands");

// ==========================================
// BOT SETTINGS
// ==========================================

const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CLIENT_ID = process.env.CLIENT_ID;

// ==========================================
// CLIENT
// ==========================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

// ==========================================
// REGISTER COMMANDS
// ==========================================

async function registerCommands() {

    const rest = new REST({
        version: "10"
    }).setToken(TOKEN);

    try {

        console.log("Registering VVLL commands...");

        await rest.put(
            Routes.applicationGuildCommands(
                CLIENT_ID,
                GUILD_ID
            ),
            {
                body: commands.map(command =>
                    command.toJSON()
                )
            }
        );

        console.log("✅ VVLL commands registered.");

    } catch (error) {

        console.error(
            "❌ Command registration failed:",
            error
        );

    }
}

// ==========================================
// BOT READY
// ==========================================

client.once("ready", () => {

    console.log(
        `✅ VVLL Bot is online as ${client.user.tag}`
    );

});

// ==========================================
// INTERACTIONS
// ==========================================

client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) {
        return;
    }

    try {

        await handleCommand(interaction);

    } catch (error) {

        console.error(
            "❌ Command error:",
            error
        );

        if (interaction.replied || interaction.deferred) {

            await interaction.followUp({
                content:
                    "❌ Something went wrong while running that command.",
                ephemeral: true
            });

        } else {

            await interaction.reply({
                content:
                    "❌ Something went wrong while running that command.",
                ephemeral: true
            });

        }
    }
});

// ==========================================
// START BOT
// ==========================================

async function startBot() {

    await registerCommands();

    await client.login(TOKEN);

}

startBot();