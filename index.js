const { 
    Client, 
    GatewayIntentBits, 
    Collection,
    REST,
    Routes
} = require("discord.js");

const config = {
    token: process.env.TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
    ownerId: process.env.OWNER_ID,
    coOwnerId: process.env.CO_OWNER_ID
};
const commands = require("./commands");
const buttonHandler = require("./buttons");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ],
    partials: [
        "CHANNEL"
    ]
});

client.commands = new Collection();

for (const command of commands) {
    client.commands.set(command.data.name, command);
}


// Register slash commands
const rest = new REST({ version: "10" }).setToken(config.token);

async function registerCommands() {
    try {
        console.log("🔄 Registering VVLL commands...");

        await rest.put(
            Routes.applicationGuildCommands(
                config.clientId,
                config.guildId
            ),
            {
                body: commands.map(cmd => cmd.data.toJSON())
            }
        );

        console.log("✅ VVLL commands registered!");
    } catch (error) {
        console.error(error);
    }
}


// Bot ready
client.once("ready", async () => {
    console.log(`🏆 ${client.user.tag} is online!`);

    await registerCommands();
});


// Slash command handler
client.on("interactionCreate", async interaction => {

    if (interaction.isChatInputCommand()) {

        const command = client.commands.get(
            interaction.commandName
        );

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);

            if (!interaction.replied) {
                await interaction.reply({
                    content: "❌ Something went wrong.",
                    ephemeral: true
                });
            }
        }
    }


    // Button handler
    if (interaction.isButton()) {
        try {
            await buttonHandler(interaction);
        } catch(error) {
            console.error(error);
        }
    }

});


client.login(config.token);