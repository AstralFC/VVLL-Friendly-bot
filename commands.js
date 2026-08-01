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

    return JSON.parse(fs.readFileSync(dbFile));
}

function saveDB(data) {
    fs.writeFileSync(
        dbFile,
        JSON.stringify(data, null, 4)
    );
}


function isOwner(userId) {
    return (
        userId === process.env.OWNER_ID ||
        userId === process.env.CO_OWNER_ID
    );
}


module.exports = [

/* CREATE TEAM */

{
data: new SlashCommandBuilder()
.setName("create-team")
.setDescription("Create a VVLL team")
.addRoleOption(o =>
    o.setName("team_role")
    .setDescription("Team role")
    .setRequired(true)
)
.addUserOption(o =>
    o.setName("manager")
    .setDescription("Team manager")
    .setRequired(true)
),

async execute(interaction){

if(!isOwner(interaction.user.id))
return interaction.reply({
content:"❌ Owner only command.",
ephemeral:true
});


const role = interaction.options.getRole("team_role");
const manager = interaction.options.getUser("manager");

let db = loadDB();


if(db.teams[role.id])
return interaction.reply({
content:"❌ Team already exists.",
ephemeral:true
});


db.teams[role.id]={
name:role.name,
roleId:role.id,
managerId:manager.id
};


saveDB(db);


return interaction.reply({
embeds:[
new EmbedBuilder()
.setColor("#ff4f8b")
.setTitle("🏆 VVLL Team Created")
.setDescription(
`**Team:** ${role.name}\n`+
`**Manager:** <@${manager.id}>`
)
.setFooter({
text:"VVLL Bot | VVLL | NA | S1"
})
]
});

}

},



/* SIGN */

{
data:new SlashCommandBuilder()
.setName("sign")
.setDescription("Sign a player")
.addUserOption(o=>
o.setName("player")
.setDescription("Player to sign")
.setRequired(true)
),

async execute(interaction){

let db=loadDB();


let team = Object.values(db.teams)
.find(t=>t.managerId===interaction.user.id);


if(!team)
return interaction.reply({
content:"❌ You are not a team manager.",
ephemeral:true
});


let player = interaction.options.getUser("player");


if(db.players[player.id])
return interaction.reply({
content:"❌ Player already signed.",
ephemeral:true
});


let embed=new EmbedBuilder()
.setColor("#ff4f8b")
.setTitle("🏆 VVLL Contract Offer")
.setDescription(
`You have received a contract offer.\n\n`+
`**Team:** ${team.name}\n`+
`**Manager:** <@${interaction.user.id}>\n\n`+
`Accept this contract?`
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




/* TRANSFER MANAGER */

{
data:new SlashCommandBuilder()
.setName("team-transfer-manager")
.setDescription("Transfer team manager")
.addRoleOption(o=>
o.setName("team")
.setDescription("Team")
.setRequired(true)
)
.addUserOption(o=>
o.setName("new_manager")
.setDescription("New manager")
.setRequired(true)
),

async execute(interaction){

if(!isOwner(interaction.user.id))
return interaction.reply({
content:"❌ Owner only.",
ephemeral:true
});


let role=interaction.options.getRole("team");
let manager=interaction.options.getUser("new_manager");


let db=loadDB();


if(!db.teams[role.id])
return interaction.reply({
content:"❌ Team does not exist.",
ephemeral:true
});


let old=db.teams[role.id].managerId;


db.teams[role.id].managerId=manager.id;


saveDB(db);


interaction.reply({
content:`✅ ${role.name}'s manager is now ${manager}.`
});


}

},




/* CREATE GAME */

{
data:new SlashCommandBuilder()
.setName("create-game")
.setDescription("Create VVLL game")
.addRoleOption(o=>
o.setName("home")
.setDescription("Home team")
.setRequired(true))
.addRoleOption(o=>
o.setName("away")
.setDescription("Away team")
.setRequired(true))
.addStringOption(o=>
o.setName("time")
.setDescription("Game time")
.setRequired(true))
.addStringOption(o=>
o.setName("format")
.setDescription("4v4-11v11")
.setRequired(true))
.addStringOption(o=>
o.setName("stage")
.setDescription("Stage")
.setRequired(true)),

async execute(interaction){


if(!isOwner(interaction.user.id))
return interaction.reply({
content:"❌ Owner only.",
ephemeral:true
});


let embed=new EmbedBuilder()
.setColor("#ff4f8b")
.setTitle("🏆 VVLL Official Match")
.setDescription(
`${interaction.options.getRole("home")}\n`+
`⚔️ VS ⚔️\n`+
`${interaction.options.getRole("away")}\n\n`+
`🕒 ${interaction.options.getString("time")}\n`+
`👥 ${interaction.options.getString("format")}\n`+
`🏅 ${interaction.options.getString("stage")}`
)
.setFooter({
text:"VVLL Bot | VVLL | NA | S1"
});


interaction.reply({
embeds:[embed]
});

}

},





/* RELEASE PLAYER */

{
data:new SlashCommandBuilder()
.setName("release-player")
.setDescription("Release a player")
.addUserOption(o=>
o.setName("player")
.setDescription("Player")
.setRequired(true)
),

async execute(interaction){


let db=loadDB();


let team=Object.values(db.teams)
.find(t=>t.managerId===interaction.user.id);


if(!team)
return interaction.reply({
content:"❌ You are not a manager.",
ephemeral:true
});


let player=interaction.options.getUser("player");


if(!db.players[player.id] ||
db.players[player.id].team!==team.name)
return interaction.reply({
content:"❌ Player is not on your team.",
ephemeral:true
});


delete db.players[player.id];


saveDB(db);


interaction.reply({
content:`✅ Released ${player}.`
});


}

}


];
/* DELETE TEAM */

{
data:new SlashCommandBuilder()
.setName("delete-team")
.setDescription("Delete a VVLL team")
.addRoleOption(o=>
o.setName("team")
.setDescription("Team to delete")
.setRequired(true)
),

async execute(interaction){

if(!isOwner(interaction.user.id))
return interaction.reply({
content:"❌ Owner only.",
ephemeral:true
});


let role = interaction.options.getRole("team");

let db = loadDB();


if(!db.teams[role.id])
return interaction.reply({
content:"❌ Team does not exist.",
ephemeral:true
});


delete db.teams[role.id];


for(const player in db.players){

if(db.players[player].roleId === role.id){
delete db.players[player];
}

}


saveDB(db);


interaction.reply({
content:`🗑️ Deleted **${role.name}** from VVLL.`
});

}

},



/* TEAM ROSTER */

{
data:new SlashCommandBuilder()
.setName("team-roster")
.setDescription("View a team's roster")
.addRoleOption(o=>
o.setName("team")
.setDescription("Team")
.setRequired(true)
),

async execute(interaction){

let role = interaction.options.getRole("team");

let db = loadDB();


let team = db.teams[role.id];


if(!team)
return interaction.reply({
content:"❌ Team not found.",
ephemeral:true
});


let players = Object.entries(db.players)
.filter(([id,p])=>p.roleId===role.id)
.map(([id])=>`<@${id}>`);


let embed = new EmbedBuilder()
.setColor("#ff4f8b")
.setTitle(`🏆 ${team.name} Roster`)
.setDescription(
`👔 Manager: <@${team.managerId}>\n\n`+
`👥 Players:\n`+
(players.length ? players.join("\n") : "No players signed")
)
.setFooter({
text:"VVLL Bot | VVLL | NA | S1"
});


interaction.reply({
embeds:[embed]
});

}

},




/* LEAGUE ROSTER */

{
data:new SlashCommandBuilder()
.setName("league-roster")
.setDescription("View all VVLL teams")
,

async execute(interaction){

let db = loadDB();


let list = Object.values(db.teams)
.map(team=>
`🏆 **${team.name}**\n👔 Manager: <@${team.managerId}>`
);


let embed = new EmbedBuilder()
.setColor("#ff4f8b")
.setTitle("🌎 VVLL League Roster")
.setDescription(
list.length ?
list.join("\n\n") :
"No teams created yet."
)
.setFooter({
text:"VVLL Bot | VVLL | NA | S1"
});


interaction.reply({
embeds:[embed]
});

}

}