const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");

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
// DATABASE
// ==========================================

const DB_FILE = "./database.json";

function loadDB() {
    if (!fs.existsSync(DB_FILE)) {
        return {
            teams: {},
            players: {},
            games: {},
            stats: {},
            pendingOffers: {},
            settings: {
                season: 1
            }
        };
    }

    const db = JSON.parse(
        fs.readFileSync(DB_FILE, "utf8")
    );

    if (!db.teams) db.teams = {};
    if (!db.players) db.players = {};
    if (!db.games) db.games = {};
    if (!db.stats) db.stats = {};
    if (!db.pendingOffers) db.pendingOffers = {};
    if (!db.settings) db.settings = { season: 1 };

    return db;
}

function saveDB(db) {
    fs.writeFileSync(
        DB_FILE,
        JSON.stringify(db, null, 2)
    );
}

// ==========================================
// DISCORD CLIENT
// ==========================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ]
});

// ==========================================
// REGISTER COMMANDS
// ==========================================

async function registerCommands() {

    if (!TOKEN) {
        throw new Error("TOKEN is missing from Railway variables.");
    }

    if (!CLIENT_ID) {
        throw new Error("CLIENT_ID is missing from Railway variables.");
    }

    if (!GUILD_ID) {
        throw new Error("GUILD_ID is missing from Railway variables.");
    }

    const rest = new REST({
        version: "10"
    }).setToken(TOKEN);

    console.log("🧹 Removing old global commands...");

    try {
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            {
                body: []
            }
        );

        console.log(
            "✅ Old global commands removed."
        );
    } catch (error) {
        console.log(
            "⚠️ Could not remove global commands:",
            error.message
        );
    }

    console.log(
        "🧹 Removing old server commands..."
    );

    try {
        await rest.put(
            Routes.applicationGuildCommands(
                CLIENT_ID,
                GUILD_ID
            ),
            {
                body: []
            }
        );

        console.log(
            "✅ Old server commands removed."
        );
    } catch (error) {
        console.error(
            "❌ Could not remove server commands:"
        );

        console.error(error);

        throw error;
    }

    console.log(
        "📋 Registering new VVLL commands..."
    );

    try {
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

        console.log(
            `✅ Registered ${commands.length} VVLL commands.`
        );

    } catch (error) {
        console.error(
            "❌ Command registration failed:"
        );

        console.error(error);

        throw error;
    }
}

// ==========================================
// READY
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
// SLASH COMMANDS
// ==========================================

client.on("interactionCreate", async interaction => {

    try {

        // ======================================
        // SLASH COMMAND
        // ======================================

        if (interaction.isChatInputCommand()) {

            await handleCommand(interaction);

            return;
        }

        // ======================================
        // BUTTON
        // ======================================

        if (!interaction.isButton()) {
            return;
        }

        const customId = interaction.customId;

        // Only contract buttons
        if (
            !customId.startsWith(
                "contract_accept_"
            ) &&
            !customId.startsWith(
                "contract_decline_"
            )
        ) {
            return;
        }

        const isAccept =
            customId.startsWith(
                "contract_accept_"
            );

        const prefix = isAccept
            ? "contract_accept_"
            : "contract_decline_";

        const offerId =
            customId.substring(prefix.length);

        const db = loadDB();

        // ======================================
        // FIND OFFER
        // ======================================

        let offer = null;
        let offerPlayerId = null;

        for (
            const playerId of Object.keys(
                db.pendingOffers
            )
        ) {

            const possibleOffer =
                db.pendingOffers[playerId];

            if (
                possibleOffer &&
                possibleOffer.offerId === offerId
            ) {

                offer = possibleOffer;
                offerPlayerId = playerId;

                break;
            }
        }

        if (!offer) {

            return interaction.reply({
                content:
                    "❌ This contract offer is no longer valid.",
                ephemeral: true
            });
        }

        // ======================================
        // MAKE SURE PLAYER IS THE ONE
        // WHO RECEIVED THE OFFER
        // ======================================

        if (
            interaction.user.id !==
            offerPlayerId
        ) {

            return interaction.reply({
                content:
                    "❌ This contract offer belongs to another player.",
                ephemeral: true
            });
        }

        // ======================================
        // DECLINE
        // ======================================

        if (!isAccept) {

            delete db.pendingOffers[
                offerPlayerId
            ];

            saveDB(db);

            const declinedEmbed =
                new EmbedBuilder()
                    .setTitle(
                        "❌ Contract Declined"
                    )
                    .setDescription(
                        `You declined the contract offer from **${offer.teamName}**.`
                    )
                    .setTimestamp();

            await interaction.update({
                embeds: [declinedEmbed],
                components: []
            });

            // Notify manager
            try {

                const manager =
                    await client.users.fetch(
                        offer.offeredBy
                    );

                await manager.send(
                    `❌ <@${offerPlayerId}> declined your contract offer for **${offer.teamName}**.`
                );

            } catch (error) {
                console.log(
                    "⚠️ Could not DM manager about declined offer."
                );
            }

            return;
        }

        // ======================================
        // ACCEPT
        // ======================================

        const team =
            db.teams[offer.teamId];

        if (!team) {

            delete db.pendingOffers[
                offerPlayerId
            ];

            saveDB(db);

            return interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(
                            "❌ Contract Expired"
                        )
                        .setDescription(
                            "That team no longer exists."
                        )
                        .setTimestamp()
                ],
                components: []
            });
        }

        // ======================================
        // CHECK IF PLAYER SOMEHOW JOINED
        // ANOTHER TEAM WHILE OFFER WAS PENDING
        // ======================================

        let alreadyOnTeam = null;

        for (
            const teamId of Object.keys(db.teams)
        ) {

            const existingTeam =
                db.teams[teamId];

            if (
                existingTeam.players.includes(
                    offerPlayerId
                )
            ) {

                alreadyOnTeam = existingTeam;

                break;
            }
        }

        if (alreadyOnTeam) {

            delete db.pendingOffers[
                offerPlayerId
            ];

            saveDB(db);

            return interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(
                            "❌ Contract Failed"
                        )
                        .setDescription(
                            `You are already signed to **${alreadyOnTeam.name}**.`
                        )
                        .setTimestamp()
                ],
                components: []
            });
        }

        // ======================================
        // ADD PLAYER TO TEAM
        // ======================================

        if (!team.players.includes(offerPlayerId)) {
            team.players.push(offerPlayerId);
        }

        // Save player information
        db.players[offerPlayerId] = {
            id: offerPlayerId,
            teamId: team.roleId
        };

        // Remove pending offer
        delete db.pendingOffers[
            offerPlayerId
        ];

        saveDB(db);

        // ======================================
        // ACCEPTED MESSAGE
        // ======================================

        const acceptedEmbed =
            new EmbedBuilder()
                .setTitle(
                    "✅ Contract Accepted"
                )
                .setDescription(
                    `You have officially joined **${team.name}**!`
                )
                .addFields({
                    name: "🏆 Team",
                    value: team.name
                })
                .setTimestamp();

        await interaction.update({
            embeds: [acceptedEmbed],
            components: []
        });

        // ======================================
        // NOTIFY MANAGER
        // ======================================

        try {

            const manager =
                await client.users.fetch(
                    offer.offeredBy
                );

            await manager.send(
                `✅ <@${offerPlayerId}> accepted your contract offer and has joined **${team.name}**!`
            );

        } catch (error) {

            console.log(
                "⚠️ Could not DM manager about accepted offer."
            );
        }

        return;
    }

    } catch (error) {

        console.error(
            "❌ Interaction error:"
        );

        console.error(error);

        try {

            if (interaction.replied ||
                interaction.deferred) {

                await interaction.followUp({
                    content:
                        "❌ Something went wrong while processing that.",
                    ephemeral: true
                });

            } else {

                await interaction.reply({
                    content:
                        "❌ Something went wrong while processing that.",
                    ephemeral: true
                });

            }

        } catch (replyError) {

            console.error(
                "❌ Could not send error message:"
            );

        }
    }
});

// ==========================================
// START BOT
// ==========================================

async function startBot() {

    console.log(
        "🚀 Starting VVLL Bot..."
    );

    await registerCommands();

    console.log(
        "🔌 Connecting to Discord..."
    );

    await client.login(TOKEN);
}

startBot().catch(error => {

    console.error(
        "❌ VVLL Bot failed to start:"
    );

    console.error(error);

    process.exit(1);
});