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
// RAILWAY VARIABLES
// ==========================================

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// ==========================================
// CHECK VARIABLES
// ==========================================

if (!TOKEN) {
    console.error("❌ TOKEN is missing from Railway variables.");
    process.exit(1);
}

if (!CLIENT_ID) {
    console.error("❌ CLIENT_ID is missing from Railway variables.");
    process.exit(1);
}

if (!GUILD_ID) {
    console.error("❌ GUILD_ID is missing from Railway variables.");
    process.exit(1);
}

// ==========================================
// DISCORD CLIENT
// ==========================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

// ==========================================
// REGISTER VVLL COMMANDS
// ==========================================

async function registerCommands() {

    const rest = new REST({
        version: "10"
    }).setToken(TOKEN);

    try {

        console.log("🧹 Removing old global commands...");

        // Delete old global commands
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            {
                body: []
            }
        );

        console.log("✅ Old global commands removed.");

        console.log("🧹 Removing old server commands...");

        // Clear old server commands
        await rest.put(
            Routes.applicationGuildCommands(
                CLIENT_ID,
                GUILD_ID
            ),
            {
                body: []
            }
        );

        console.log("✅ Old server commands removed.");

        console.log("📋 Registering new VVLL commands...");

        // Register ONLY the commands from commands.js
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

        console.log("✅ New VVLL commands registered.");

    } catch (error) {

        console.error(
            "❌ Command registration failed:"
        );

        console.error(error);

    }
}

// ==========================================
// BOT READY
// ==========================================

client.once("ready", () => {

    console.log(
        `✅ VVLL Bot is online as ${client.user.tag}`
    );

    console.log(
        `🏆 VVLL is connected to server: ${GUILD_ID}`
    );

});

// ==========================================
// COMMAND HANDLER
// ==========================================

client.on(
    "interactionCreate",
    async interaction => {

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

            if (
                interaction.replied ||
                interaction.deferred
            ) {

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
    }
);

// ==========================================
// START BOT
// ==========================================

async function startBot() {

    console.log("🚀 Starting VVLL Bot...");

    await registerCommands();

    console.log("🔌 Connecting to Discord...");

    await client.login(TOKEN);

}

startBot().catch(error => {

    console.error(
        "❌ VVLL Bot failed to start:"
    );

    console.error(error);

    process.exit(1);

});