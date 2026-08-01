const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");

const dbFile = "./database.json";

function loadDB() {
    if (!fs.existsSync(dbFile)) {
        fs.writeFileSync(
            dbFile,
            JSON.stringify({
                teams: {},
                players: {},
                games: {}
            }, null, 4)
        );
    }

    return JSON.parse(fs.readFileSync(dbFile));
}

function saveDB(data) {
    fs.writeFileSync(
        dbFile,
        JSON.stringify(data, null, 4)
    );
}


module.exports = [
    
];