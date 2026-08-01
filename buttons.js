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
        id.replace("accept_","")
          .replace("decline_","");



        let team =
        db.teams[roleId];



        if(!team){

            return interaction.editReply({

                content:
                "❌ Contract no longer exists.",

                components:[]

            });

        }



        // ACCEPT


        if(id.startsWith("accept_")){


            // find server from saved data

            if(!team.guildId){

                return interaction.editReply({

                    content:
                    "❌ This contract is old. Ask the manager to send a new contract.",

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
            ).catch(()=>null);



            if(!member){

                return interaction.editReply({

                    content:
                    "❌ Join the VVLL Discord server first, then accept the contract.",

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
                    "❌ Team role does not exist.",

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
                `✅ Contract accepted!\nYou joined **${team.name}**.`,

                components:[]

            });



            const manager =
            await guild.members.fetch(
                team.managerId
            ).catch(()=>null);



            if(manager){

                manager.send({

                    content:
                    `🏆 Contract Accepted\n\n${interaction.user} joined **${team.name}**.`

                }).catch(()=>{});

            }


        }





        // DECLINE


        if(id.startsWith("decline_")){


            await interaction.editReply({

                content:
                `❌ You declined **${team.name}** contract.`,

                components:[]

            });



            const guild =
            await interaction.client.guilds.fetch(
                team.guildId
            ).catch(()=>null);



            if(guild){


                const manager =
                await guild.members.fetch(
                    team.managerId
                ).catch(()=>null);



                if(manager){

                    manager.send({

                        content:
                        `❌ ${interaction.user} declined the contract from **${team.name}**.`

                    }).catch(()=>{});

                }


            }


        }



    }catch(error){


        console.log(
            "VVLL BUTTON ERROR:",
            error
        );



        if(interaction.deferred){

            interaction.editReply({

                content:
                "❌ Contract processing error.",

                components:[]

            }).catch(()=>{});

        }


    }


};