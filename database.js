// =======================================
// VVLL BOT DATABASE
// =======================================

const fs = require("fs");

const FILE = "./database.json";

let data = {
    teams: [],
    players: [],
    games: []
};

function load() {
    if (fs.existsSync(FILE)) {
        try {
            data = JSON.parse(fs.readFileSync(FILE, "utf8"));
            console.log("✅ Database loaded");
        } catch (err) {
            console.log("⚠️ Database corrupted, creating a new one...");
            save();
        }
    } else {
        save();
    }
}

function save() {
    fs.writeFileSync(
        FILE,
        JSON.stringify(data, null, 4)
    );
}

function reset() {
    data = {
        teams: [],
        players: [],
        games: []
    };

    save();
}

module.exports = {
    get data() {
        return data;
    },

    load,
    save,
    reset
};