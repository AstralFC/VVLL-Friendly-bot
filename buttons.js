// =========================
// VVLL BOT - buttons.js
// =========================

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
        fs.readFileSync(dbFile, "utf8")
    );

}



function saveDB(db){

    fs.writeFileSync(
        dbFile,
        JSON.stringify(db,null,4)
    );

}



module.exports = async (interaction)=>{


    if(!interaction.isButton()) return;


    const id = interaction.customId;


    if(
        !id.startsWith("accept_") &&
        !id.startsWith("decline_")
    ) return;



    try{


        await interaction.deferUpdate();



        const db = loadDB();



        const roleId =
        id.split("_")[1];



        const team =
        db.teams[roleId];



        if(!team){

            return interaction.editReply({

                content:
                "❌ Team not found in database.",

                components:[]

            });

        }





        // =================
        // ACCEPT
        // =================


        if(id.startsWith("accept_")){


            if(!team.guildId){

                return interaction.editReply({

                    content:
                    "❌ Missing server ID. Create a new contract.",

                    components:[]

                });

            }



            const guild =
            await interaction.client.guilds.fetch(
                team.guildId
            );



            let member;


            try{

                member =
                await guild.members.fetch(
                    interaction.user.id
                );


            }catch{

                return interaction.editReply({

                    content:
                    "❌ You must be inside the VVLL server before accepting.",

                    components:[]

                });

            }



            const role =
            guild.roles.cache.get(
                team.roleId
            );



            if(!role){

                return interaction.editReply({

                    content:
                    "❌ Team role was deleted.",

                    components:[]

                });

            }



            try{

                await member.roles.add(role);

            }catch(error){

                console.log(
                    "ROLE ERROR:",
                    error
                );


                return interaction.editReply({

                    content:
                    "❌ I cannot give you the team role. Check bot permissions.",

                    components:[]

                });

            }





            db.players[interaction.user.id]={

                team:team.name,

                roleId:team.roleId

            };



            saveDB(db);



            await interaction.editReply({

                content:
                `✅ Contract accepted!\nYou joined **${team.name}**.`,

                components:[]

            });



            const manager =
            await guild.members.fetch(
                team.managerId
            ).catch(()=>null);



            if(manager){

                manager.send(
                    `🏆 ${interaction.user} accepted the contract for **${team.name}**.`
                ).catch(()=>{});

            }



        }





        // =================
        // DECLINE
        // =================


        if(id.startsWith("decline_")){


            await interaction.editReply({

                content:
                `❌ You declined the contract from **${team.name}**.`,

                components:[]

            });



        }



    }catch(error){


        console.log(
            "========== VVLL BUTTON ERROR =========="
        );

        console.log(error);

        console.log(error.stack);

        console.log(
            "======================================="
        );



        if(interaction.deferred){

            await interaction.editReply({

                content:
                "❌ ERROR: " + error.message,

                components:[]

            }).catch(()=>{});

        }


    }


};