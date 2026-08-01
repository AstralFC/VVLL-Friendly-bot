const fs = require("fs");

const dbFile = "./database.json";


function loadDB(){

    if(!fs.existsSync(dbFile)){

        fs.writeFileSync(
            dbFile,
            JSON.stringify({
                teams:{},
                players:{},
                games:{}
            }, null, 4)
        );

    }

    return JSON.parse(
        fs.readFileSync(dbFile)
    );

}



function saveDB(data){

    fs.writeFileSync(
        dbFile,
        JSON.stringify(data,null,4)
    );

}



module.exports = async (interaction) => {


    if(!interaction.isButton()) return;


    const id = interaction.customId;


    if(
        !id.startsWith("accept_") &&
        !id.startsWith("decline_")
    ) return;



    let db = loadDB();


    const roleId = id.split("_")[1];


    const team = db.teams[roleId];


    if(!team){

        return interaction.reply({
            content:"❌ This contract has expired.",
            ephemeral:true
        });

    }



    // =====================
    // ACCEPT CONTRACT
    // =====================


    if(id.startsWith("accept_")){


        let guild;


        try{

            guild = await interaction.client.guilds.fetch(
                team.guildId
            );


        }catch(err){

            return interaction.reply({
                content:
                "❌ Cannot find the VVLL server.",
                ephemeral:true
            });

        }



        let member =
        guild.members.cache.get(
            interaction.user.id
        );



        if(!member){

            try{

                member =
                await guild.members.fetch(
                    interaction.user.id
                );


            }catch(err){

                return interaction.reply({

                    content:
                    "❌ You must join the VVLL Discord server before accepting this contract.",

                    ephemeral:true

                });

            }

        }



        const role =
        guild.roles.cache.get(
            team.roleId
        );



        if(role){

            await member.roles.add(role)
            .catch(()=>{});

        }



        db.players[interaction.user.id] = {

            team: team.name,

            roleId: team.roleId

        };



        saveDB(db);



        await interaction.update({

            content:
            `✅ You signed with **${team.name}**.`,

            embeds:[],

            components:[]

        });



        let manager;


        try{

            manager =
            await guild.members.fetch(
                team.managerId
            );

        }catch(err){

            manager = null;

        }



        if(manager){

            manager.send({

                content:
                `🏆 **Contract Accepted**\n\n`+
                `${interaction.user} signed with **${team.name}**.`

            }).catch(()=>{});

        }


    }




    // =====================
    // DECLINE CONTRACT
    // =====================


    if(id.startsWith("decline_")){


        await interaction.update({

            content:
            `❌ You declined the contract from **${team.name}**.`,

            embeds:[],

            components:[]

        });



        let guild;



        try{

            guild =
            await interaction.client.guilds.fetch(
                team.guildId
            );


        }catch(err){

            return;

        }




        let manager;


        try{

            manager =
            await guild.members.fetch(
                team.managerId
            );


        }catch(err){

            manager = null;

        }




        if(manager){

            manager.send({

                content:
                `❌ ${interaction.user} declined the contract from **${team.name}**.`

            }).catch(()=>{});

        }


    }


};