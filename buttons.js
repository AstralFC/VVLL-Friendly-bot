// ====================
// VVLL BUTTONS.JS
// ====================

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



        let db = loadDB();



        const roleId =
        id.split("_")[1];



        let team =
        db.teams[roleId];



        if(!team){

            return interaction.editReply({

                content:
                "❌ Team not found.",

                components:[]

            });

        }



        // ACCEPT CONTRACT

        if(id.startsWith("accept_")){


            if(!team.guildId){

                return interaction.editReply({

                    content:
                    "❌ Team server data missing. Send a new contract.",

                    components:[]

                });

            }



            const guild =
            await interaction.client.guilds.fetch(
                team.guildId
            );



            const member =
            await guild.members.fetch(
                interaction.user.id
            ).catch(null);



            if(!member){

                return interaction.editReply({

                    content:
                    "❌ Join the VVLL server before accepting.",

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
                    "❌ Team role missing.",

                    components:[]

                });

            }



            await member.roles.add(role);



            db.players[interaction.user.id]={

                team:team.name,

                roleId:team.roleId

            };



            saveDB(db);



            await interaction.editReply({

                content:
                `✅ You signed with **${team.name}**!`,

                components:[]

            });



            const manager =
            await guild.members.fetch(
                team.managerId
            ).catch(null);



            if(manager){

                manager.send(
                    `🏆 ${interaction.user} signed with **${team.name}**.`
                ).catch(()=>{});

            }


        }





        // DECLINE CONTRACT


        if(id.startsWith("decline_")){


            await interaction.editReply({

                content:
                `❌ You declined **${team.name}** contract.`,

                components:[]

            });



        }



    }catch(error){


        console.log(
            "VVLL BUTTON ERROR:",
            error.stack
        );



        if(interaction.deferred){

            await interaction.editReply({

                content:
                "❌ Contract processing error.",

                components:[]

            }).catch(()=>{});

        }


    }


};