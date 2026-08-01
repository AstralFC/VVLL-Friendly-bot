const fs = require("fs");

const dbFile = "./database.json";

function loadDB() {
    if (!fs.existsSync(dbFile)) {
        return {
            players: {}
        };
    }

    return JSON.parse(fs.readFileSync(dbFile, "utf8"));
}

function saveDB(db) {
    fs.writeFileSync(
        dbFile,
        JSON.stringify(db, null, 4)
    );
}


module.exports = async (interaction) => {

    if (!interaction.isButton()) return;


    try {

        if (interaction.customId.startsWith("confirm_stats_")) {


            const playerId =
                interaction.customId.split("_")[2];


            const data =
                global.pendingStats[playerId];


            if (!data) {

                return interaction.reply({
                    content:
                    "❌ This stat update expired.",
                    ephemeral:true
                });

            }


            const db = loadDB();


            if (!db.players[playerId]) {

                db.players[playerId] = {
                    stats:{
                        goals:0,
                        assists:0,
                        saves:0,
                        blocks:0
                    }
                };

            }


            if (!db.players[playerId].stats) {

                db.players[playerId].stats = {
                    goals:0,
                    assists:0,
                    saves:0,
                    blocks:0
                };

            }


            db.players[playerId].stats.goals += data.goals;
            db.players[playerId].stats.assists += data.assists;
            db.players[playerId].stats.saves += data.saves;
            db.players[playerId].stats.blocks += data.blocks;


            saveDB(db);


            delete global.pendingStats[playerId];


            return interaction.update({

                content:
                "✅ Player stats updated!",

                embeds:[],
                components:[]

            });

        }



        if (interaction.customId.startsWith("cancel_stats_")) {


            const playerId =
                interaction.customId.split("_")[2];


            delete global.pendingStats[playerId];


            return interaction.update({

                content:
                "❌ Stat update cancelled.",

                embeds:[],
                components:[]

            });

        }


    } catch(error) {


        console.log(
            "STATS BUTTON ERROR:",
            error
        );


        if (!interaction.replied) {

            interaction.reply({
                content:
                "❌ Something went wrong.",
                ephemeral:true
            });

        }

    }

};