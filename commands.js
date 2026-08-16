const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");

const DB_FILE = "./database.json";

// ==========================================
// VVLL POC / CO-POC
// PUT THE DISCORD USER IDS HERE
// ==========================================

const POC_ID = "1505021865985572940";
const CO_POC_ID = "1429837765281058876";

// ==========================================
// DATABASE
// ==========================================

function loadDB() {
    if (!fs.existsSync(DB_FILE)) {
        return {
            teams: {},
            players: {},
            games: {},
            stats: {},
            settings: {
                season: 1
            }
        };
    }

    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function saveDB(db) {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// ==========================================
// PERMISSIONS
// ==========================================

function isPOC(userId) {
    return userId === POC_ID || userId === CO_POC_ID;
}

// ==========================================
// COMMANDS
// ==========================================

const commands = [

    // ======================================
    // /create team
    // ======================================

    new SlashCommandBuilder()
        .setName("create")
        .setDescription("VVLL team commands")
        .addSubcommand(sub =>
            sub
                .setName("team")
                .setDescription("Create a VVLL team")
                .addRoleOption(option =>
                    option
                        .setName("role")
                        .setDescription("The Discord role for the team")
                        .setRequired(true)
                )
                .addUserOption(option =>
                    option
                        .setName("manager")
                        .setDescription("The team manager")
                        .setRequired(true)
                )
        ),

    // ======================================
    // /sign
    // ======================================

    new SlashCommandBuilder()
        .setName("sign")
        .setDescription("Sign a player to your team")
        .addRoleOption(option =>
            option
                .setName("team")
                .setDescription("Your team role")
                .setRequired(true)
        )
        .addUserOption(option =>
            option
                .setName("player")
                .setDescription("Player to sign")
                .setRequired(true)
        ),

    // ======================================
    // /view roster
    // ======================================

    new SlashCommandBuilder()
        .setName("view")
        .setDescription("View VVLL information")
        .addSubcommand(sub =>
            sub
                .setName("roster")
                .setDescription("View a team roster")
                .addRoleOption(option =>
                    option
                        .setName("team")
                        .setDescription("Team to view")
                        .setRequired(true)
                )
        ),

    // ======================================
    // /create game
    // ======================================

    new SlashCommandBuilder()
        .setName("create")
        .setDescription("VVLL creation commands")
        .addSubcommand(sub =>
            sub
                .setName("game")
                .setDescription("Create a VVLL game")
                .addRoleOption(option =>
                    option
                        .setName("team1")
                        .setDescription("First team")
                        .setRequired(true)
                )
                .addRoleOption(option =>
                    option
                        .setName("team2")
                        .setDescription("Second team")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("time")
                        .setDescription("Game time")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("standing")
                        .setDescription("Standing stage")
                        .setRequired(true)
                        .addChoices(
                            { name: "16-Stand", value: "16-stand" },
                            { name: "8-Stand", value: "8-stand" },
                            { name: "4-Quarter", value: "4-quarter" },
                            { name: "2-Semi", value: "2-semi" }
                        )
                )
                .addStringOption(option =>
                    option
                        .setName("format")
                        .setDescription("Game format")
                        .setRequired(true)
                        .addChoices(
                            { name: "4v4", value: "4v4" },
                            { name: "5v5", value: "5v5" },
                            { name: "6v6", value: "6v6" },
                            { name: "7v7", value: "7v7" },
                            { name: "8v8", value: "8v8" },
                            { name: "9v9", value: "9v9" },
                            { name: "10v10", value: "10v10" },
                            { name: "11v11", value: "11v11" }
                        )
                )
        ),

    // ======================================
    // /give stats
    // ======================================

    new SlashCommandBuilder()
        .setName("give")
        .setDescription("VVLL stat commands")
        .addSubcommand(sub =>
            sub
                .setName("stats")
                .setDescription("Give a player stats")
                .addUserOption(option =>
                    option
                        .setName("player")
                        .setDescription("Player")
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName("goals")
                        .setDescription("Goals")
                        .setRequired(true)
                        .setMinValue(0)
                )
                .addIntegerOption(option =>
                    option
                        .setName("assists")
                        .setDescription("Assists")
                        .setRequired(true)
                        .setMinValue(0)
                )
                .addIntegerOption(option =>
                    option
                        .setName("saves")
                        .setDescription("Saves")
                        .setRequired(true)
                        .setMinValue(0)
                )
        ),

    // ======================================
    // /check stats
    // ======================================

    new SlashCommandBuilder()
        .setName("check")
        .setDescription("Check VVLL information")
        .addSubcommand(sub =>
            sub
                .setName("stats")
                .setDescription("Check player stats")
                .addUserOption(option =>
                    option
                        .setName("player")
                        .setDescription("Optional player to search")
                        .setRequired(false)
                )
        ),

    // ======================================
    // /change manager
    // ======================================

    new SlashCommandBuilder()
        .setName("change")
        .setDescription("VVLL management commands")
        .addSubcommand(sub =>
            sub
                .setName("manager")
                .setDescription("Change a team's manager")
                .addRoleOption(option =>
                    option
                        .setName("team")
                        .setDescription("Team")
                        .setRequired(true)
                )
                .addUserOption(option =>
                    option
                        .setName("manager")
                        .setDescription("New manager")
                        .setRequired(true)
                )
                .addUserOption(option =>
                    option
                        .setName("comanager")
                        .setDescription("New co-manager")
                        .setRequired(false)
                )
        ),

    // ======================================
    // /delete team
    // ======================================

    new SlashCommandBuilder()
        .setName("delete")
        .setDescription("VVLL deletion commands")
        .addSubcommand(sub =>
            sub
                .setName("team")
                .setDescription("Delete a VVLL team")
                .addRoleOption(option =>
                    option
                        .setName("team")
                        .setDescription("Team to delete")
                        .setRequired(true)
                )
        )
];

// ==========================================
// COMMAND EXECUTION
// ==========================================

async function handleCommand(interaction) {

    const db = loadDB();

    const command = interaction.commandName;
    const subcommand = interaction.options.getSubcommand(false);

    // ======================================
    // CREATE TEAM
    // ======================================

    if (command === "create" && subcommand === "team") {

        if (!isPOC(interaction.user.id)) {
            return interaction.reply({
                content: "❌ Only the POC or Co-POC can create teams.",
                ephemeral: true
            });
        }

        const role = interaction.options.getRole("role");
        const manager = interaction.options.getUser("manager");

        if (db.teams[role.id]) {
            return interaction.reply({
                content: "❌ That team has already been created.",
                ephemeral: true
            });
        }

        db.teams[role.id] = {
            roleId: role.id,
            name: role.name,
            managerId: manager.id,
            coManagerId: null,
            players: []
        };

        saveDB(db);

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("🏆 Team Created")
                    .setDescription(
                        `**Team:** ${role}\n` +
                        `**Manager:** <@${manager.id}>\n` +
                        `**Co-Manager:** None\n\n` +
                        `The team has been added to the VVLL.`
                    )
                    .setTimestamp()
            ]
        });
    }

    // ======================================
    // SIGN PLAYER
    // ======================================

    if (command === "sign") {

        const role = interaction.options.getRole("team");
        const player = interaction.options.getUser("player");

        const team = db.teams[role.id];

        if (!team) {
            return interaction.reply({
                content: "❌ That role is not a VVLL team.",
                ephemeral: true
            });
        }

        if (
            interaction.user.id !== team.managerId &&
            interaction.user.id !== team.coManagerId
        ) {
            return interaction.reply({
                content: "❌ Only the team manager or co-manager can sign players.",
                ephemeral: true
            });
        }

        if (team.players.includes(player.id)) {
            return interaction.reply({
                content: "❌ That player is already on this team.",
                ephemeral: true
            });
        }

        // Remove player from another team first
        for (const teamId of Object.keys(db.teams)) {
            db.teams[teamId].players =
                db.teams[teamId].players.filter(id => id !== player.id);
        }

        team.players.push(player.id);

        saveDB(db);

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("📝 Player Signed")
                    .setDescription(
                        `<@${player.id}> has been signed to ${role}.`
                    )
                    .setTimestamp()
            ]
        });
    }

    // ======================================
    // VIEW ROSTER
    // ======================================

    if (command === "view" && subcommand === "roster") {

        const role = interaction.options.getRole("team");
        const team = db.teams[role.id];

        if (!team) {
            return interaction.reply({
                content: "❌ That role is not a VVLL team.",
                ephemeral: true
            });
        }

        let players = "No players signed.";

        if (team.players.length > 0) {
            players = team.players
                .map((id, index) => `${index + 1}. <@${id}>`)
                .join("\n");
        }

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`🏆 ${team.name} Roster`)
                    .addFields(
                        {
                            name: "👑 Manager",
                            value: `<@${team.managerId}>`,
                            inline: true
                        },
                        {
                            name: "⭐ Co-Manager",
                            value: team.coManagerId
                                ? `<@${team.coManagerId}>`
                                : "None",
                            inline: true
                        },
                        {
                            name: `👥 Players (${team.players.length})`,
                            value: players
                        }
                    )
                    .setTimestamp()
            ]
        });
    }

    // ======================================
    // CREATE GAME
    // ======================================

    if (command === "create" && subcommand === "game") {

        if (!isPOC(interaction.user.id)) {
            return interaction.reply({
                content: "❌ Only the POC or Co-POC can create games.",
                ephemeral: true
            });
        }

        const team1 = interaction.options.getRole("team1");
        const team2 = interaction.options.getRole("team2");
        const time = interaction.options.getString("time");
        const standing = interaction.options.getString("standing");
        const format = interaction.options.getString("format");

        if (!db.teams[team1.id] || !db.teams[team2.id]) {
            return interaction.reply({
                content: "❌ Both teams must already be created in VVLL.",
                ephemeral: true
            });
        }

        if (team1.id === team2.id) {
            return interaction.reply({
                content: "❌ A team cannot play itself.",
                ephemeral: true
            });
        }

        const gameId = Date.now().toString();

        db.games[gameId] = {
            team1: team1.id,
            team2: team2.id,
            time,
            standing,
            format
        };

        saveDB(db);

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("⚽ VVLL Game Created")
                    .addFields(
                        {
                            name: "Teams",
                            value: `${team1} vs ${team2}`
                        },
                        {
                            name: "🕐 Time",
                            value: time,
                            inline: true
                        },
                        {
                            name: "🏆 Standing",
                            value: standing,
                            inline: true
                        },
                        {
                            name: "📋 Format",
                            value: format,
                            inline: true
                        }
                    )
                    .setTimestamp()
            ]
        });
    }

    // ======================================
    // GIVE STATS
    // ======================================

    if (command === "give" && subcommand === "stats") {

        if (!isPOC(interaction.user.id)) {
            return interaction.reply({
                content: "❌ Only the POC or Co-POC can give stats.",
                ephemeral: true
            });
        }

        const player = interaction.options.getUser("player");
        const goals = interaction.options.getInteger("goals");
        const assists = interaction.options.getInteger("assists");
        const saves = interaction.options.getInteger("saves");

        if (!db.stats[player.id]) {
            db.stats[player.id] = {
                goals: 0,
                assists: 0,
                saves: 0
            };
        }

        db.stats[player.id].goals += goals;
        db.stats[player.id].assists += assists;
        db.stats[player.id].saves += saves;

        saveDB(db);

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("📊 Stats Updated")
                    .setDescription(`<@${player.id}>`)
                    .addFields(
                        {
                            name: "⚽ Goals",
                            value: `+${goals}`,
                            inline: true
                        },
                        {
                            name: "🎯 Assists",
                            value: `+${assists}`,
                            inline: true
                        },
                        {
                            name: "🧤 Saves",
                            value: `+${saves}`,
                            inline: true
                        }
                    )
                    .setTimestamp()
            ]
        });
    }

    // ======================================
    // CHECK STATS
    // ======================================

    if (command === "check" && subcommand === "stats") {

        const player =
            interaction.options.getUser("player") ||
            interaction.user;

        const stats = db.stats[player.id] || {
            goals: 0,
            assists: 0,
            saves: 0
        };

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("📊 Player Stats")
                    .setDescription(`<@${player.id}>`)
                    .addFields(
                        {
                            name: "⚽ Goals",
                            value: `${stats.goals}`,
                            inline: true
                        },
                        {
                            name: "🎯 Assists",
                            value: `${stats.assists}`,
                            inline: true
                        },
                        {
                            name: "🧤 Saves",
                            value: `${stats.saves}`,
                            inline: true
                        }
                    )
                    .setTimestamp()
            ]
        });
    }

    // ======================================
    // CHANGE MANAGER
    // ======================================

    if (command === "change" && subcommand === "manager") {

        if (!isPOC(interaction.user.id)) {
            return interaction.reply({
                content: "❌ Only the POC or Co-POC can change managers.",
                ephemeral: true
            });
        }

        const role = interaction.options.getRole("team");
        const manager = interaction.options.getUser("manager");
        const coManager = interaction.options.getUser("comanager");

        const team = db.teams[role.id];

        if (!team) {
            return interaction.reply({
                content: "❌ That team has not been created.",
                ephemeral: true
            });
        }

        team.managerId = manager.id;

        if (coManager) {
            team.coManagerId = coManager.id;
        }

        saveDB(db);

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("👑 Management Updated")
                    .setDescription(
                        `**Team:** ${role}\n` +
                        `**Manager:** <@${manager.id}>\n` +
                        `**Co-Manager:** ${
                            coManager
                                ? `<@${coManager.id}>`
                                : team.coManagerId
                                    ? `<@${team.coManagerId}>`
                                    : "None"
                        }`
                    )
                    .setTimestamp()
            ]
        });
    }

    // ======================================
    // DELETE TEAM
    // ======================================

    if (command === "delete" && subcommand === "team") {

        if (!isPOC(interaction.user.id)) {
            return interaction.reply({
                content: "❌ Only the POC or Co-POC can delete teams.",
                ephemeral: true
            });
        }

        const role = interaction.options.getRole("team");

        if (!db.teams[role.id]) {
            return interaction.reply({
                content: "❌ That team does not exist in VVLL.",
                ephemeral: true
            });
        }

        delete db.teams[role.id];

        saveDB(db);

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("🗑️ Team Deleted")
                    .setDescription(
                        `${role} has been removed from the VVLL database.`
                    )
                    .setTimestamp()
            ]
        });
    }
}

module.exports = {
    commands,
    handleCommand
};