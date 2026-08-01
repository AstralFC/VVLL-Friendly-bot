const {
    SlashCommandBuilder,
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

    return JSON.parse(
        fs.readFileSync(dbFile)
    );
}


function saveDB(data) {
    fs.writeFileSync(
        dbFile,
        JSON.stringify(data, null, 4)
    );
}


function isOwner(id) {
    return (
        id === process.env.OWNER_ID ||
        id === process.env.CO_OWNER_ID
    );
}


module.exports = [

    // CREATE TEAM

    {
        data: new SlashCommandBuilder()
        .setName("create-team")
        .setDescription("Create a VVLL team")
        .addRoleOption(option =>
            option
            .setName("team_role")
            .setDescription("Team role")
            .setRequired(true)
        )
        .addUserOption(option =>
            option
            .setName("manager")
            .setDescription("Team manager")
            .setRequired(true)
        ),

        async execute(interaction) {

            if (!isOwner(interaction.user.id)) {
                return interaction.reply({
                    content:"❌ Owner only.",
                    ephemeral:true
                });
            }


            const role =
            interaction.options.getRole("team_role");


            const manager =
            interaction.options.getUser("manager");


            let db = loadDB();


            if(db.teams[role.id]) {
                return interaction.reply({
                    content:"❌ Team already exists.",
                    ephemeral:true
                });
            }


            db.teams[role.id] = {
                name: role.name,
                roleId: role.id,
                managerId: manager.id
            };


            saveDB(db);


            interaction.reply({
                embeds:[
                    new EmbedBuilder()
                    .setColor("#ff4f8b")
                    .setTitle("🏆 VVLL Team Created")
                    .setDescription(
                        `**Team:** ${role.name}\n`+
                        `**Manager:** ${manager}`
                    )
                    .setFooter({
                        text:"VVLL Bot | VVLL | NA | S1"
                    })
                ]
            });

        }
    },


    // DELETE TEAM

    {
        data: new SlashCommandBuilder()
        .setName("delete-team")
        .setDescription("Delete a VVLL team")
        .addRoleOption(option =>
            option
            .setName("team")
            .setDescription("Team role")
            .setRequired(true)
        ),

        async execute(interaction) {


            if(!isOwner(interaction.user.id)) {
                return interaction.reply({
                    content:"❌ Owner only.",
                    ephemeral:true
                });
            }


            const role =
            interaction.options.getRole("team");


            let db = loadDB();


            if(!db.teams[role.id]) {
                return interaction.reply({
                    content:"❌ Team not found.",
                    ephemeral:true
                });
            }


            delete db.teams[role.id];


            for(const player in db.players){

                if(db.players[player].roleId === role.id){
                    delete db.players[player];
                }

            }


            saveDB(db);


            interaction.reply(
                `🗑️ Deleted **${role.name}**`
            );

        }
    },


    // TEAM ROSTER

    {
        data:new SlashCommandBuilder()
        .setName("team-roster")
        .setDescription("View a team's roster")
        .addRoleOption(option =>
            option
            .setName("team")
            .setDescription("Team")
            .setRequired(true)
        ),

        async execute(interaction) {

            const role =
            interaction.options.getRole("team");


            let db = loadDB();


            const team =
            db.teams[role.id];


            if(!team){
                return interaction.reply({
                    content:"❌ Team not found.",
                    ephemeral:true
                });
            }


            const players =
            Object.keys(db.players)
            .filter(id =>
                db.players[id].roleId === role.id
            );


            interaction.reply({
                embeds:[
                    new EmbedBuilder()
                    .setColor("#ff4f8b")
                    .setTitle(`🏆 ${team.name} Roster`)
                    .setDescription(
                        `👔 Manager: <@${team.managerId}>\n\n`+
                        `👥 Players:\n`+
                        (
                            players.length
                            ? players.map(p=>`<@${p}>`).join("\n")
                            : "No players"
                        )
                    )
                ]
            });

        }
    },
        // LEAGUE ROSTER

    {
        data:new SlashCommandBuilder()
        .setName("league-roster")
        .setDescription("View all VVLL teams"),

        async execute(interaction) {

            let db = loadDB();

            const teams = Object.values(db.teams);


            interaction.reply({
                embeds:[
                    new EmbedBuilder()
                    .setColor("#ff4f8b")
                    .setTitle("🌎 VVLL League Roster")
                    .setDescription(
                        teams.length
                        ?
                        teams.map(team =>
                            `🏆 **${team.name}**\n👔 Manager: <@${team.managerId}>`
                        ).join("\n\n")
                        :
                        "No teams created yet."
                    )
                    .setFooter({
                        text:"VVLL Bot | VVLL | NA | S1"
                    })
                ]
            });

        }
    },


    // SIGN PLAYER

    {
        data:new SlashCommandBuilder()
        .setName("sign")
        .setDescription("Sign a player")
        .addUserOption(option =>
            option
            .setName("player")
            .setDescription("Player to sign")
            .setRequired(true)
        ),

        async execute(interaction) {

            let db = loadDB();


            const team = Object.values(db.teams)
            .find(t =>
                t.managerId === interaction.user.id
            );


            if(!team){
                return interaction.reply({
                    content:"❌ You are not a team manager.",
                    ephemeral:true
                });
            }


            const player =
            interaction.options.getUser("player");


            if(db.players[player.id]){
                return interaction.reply({
                    content:"❌ Player already signed.",
                    ephemeral:true
                });
            }


            const embed =
            new EmbedBuilder()
            .setColor("#ff4f8b")
            .setTitle("🏆 VVLL Contract Offer")
            .setDescription(
                `You have received a contract offer.\n\n`+
                `🏟️ **Team:** ${team.name}\n`+
                `👔 **Manager:** <@${interaction.user.id}>\n\n`+
                `Do you accept this contract?`
            )
            .setFooter({
                text:"Vx Vnilla Landon League"
            });


            await player.send({
                embeds:[embed],
                components:[
                    {
                        type:1,
                        components:[
                            {
                                type:2,
                                label:"Accept",
                                style:3,
                                custom_id:`accept_${team.roleId}`
                            },
                            {
                                type:2,
                                label:"Decline",
                                style:4,
                                custom_id:`decline_${team.roleId}`
                            }
                        ]
                    }
                ]
            });


            interaction.reply({
                content:`✅ Contract sent to ${player}.`,
                ephemeral:true
            });

        }
    },


    // RELEASE PLAYER

    {
        data:new SlashCommandBuilder()
        .setName("release-player")
        .setDescription("Release a player")
        .addUserOption(option =>
            option
            .setName("player")
            .setDescription("Player")
            .setRequired(true)
        ),

        async execute(interaction) {


            let db = loadDB();


            const team = Object.values(db.teams)
            .find(t =>
                t.managerId === interaction.user.id
            );


            if(!team){
                return interaction.reply({
                    content:"❌ You are not a manager.",
                    ephemeral:true
                });
            }


            const player =
            interaction.options.getUser("player");


            if(
                !db.players[player.id] ||
                db.players[player.id].team !== team.name
            ){
                return interaction.reply({
                    content:"❌ Player is not on your team.",
                    ephemeral:true
                });
            }


            delete db.players[player.id];


            saveDB(db);


            interaction.reply(
                `✅ Released ${player} from ${team.name}.`
            );

        }
    },