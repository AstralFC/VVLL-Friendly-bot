const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "database.json");

let db = {
    teams: [],
    players: [],
    matches: [],
    queue: [],
    standings: []
};

async function connect() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
    }

    db = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

    console.log("Database loaded.");
}

function save() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

module.exports = {

    connect,

    save,

    db,

    addTeam(team) {
        db.teams.push(team);
        save();
    },

    getTeams() {
        return db.teams;
    },

    addPlayer(player) {
        db.players.push(player);
        save();
    },

    getPlayers() {
        return db.players;
    },

    addMatch(match) {
        db.matches.push(match);
        save();
    },

    getMatches() {
        return db.matches;
    },

    addQueue(user) {
        db.queue.push(user);
        save();
    },

    removeQueue(id) {
        db.queue = db.queue.filter(u => u.id !== id);
        save();
    },

    getQueue() {
        return db.queue;
    },

    updateStandings(data) {
        db.standings = data;
        save();
    },

    getStandings() {
        return db.standings;
    }

};