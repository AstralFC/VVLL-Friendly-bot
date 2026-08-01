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



    try {


        await interaction.deferUpdate();



        let db = loadDB();


        const roleId = id.split("_")[1];


        const team = db.teams[roleId];



        if(!team){

            return interaction.editReply({
                content:"❌ This contract expired.",
                components:[]
            });

        }



        // ACCEPT


        if(id.startsWith("accept_")){


            if(!team.guildId){

                return interaction.editReply({

                    content:
                    "❌ This team was created before the update. Delete and recreate the team.",

                    components:[]

                });

            }



            const guild =
            await interaction.client.guilds.fetch(
                team.guildId
            );



            let member =
            await guild.members.fetch(
                interaction.user.id
            ).catch(()=>null);



            if(!member){

                return interaction.editReply({

                    content:
                    "❌ You must join the VVLL Discord server before accepting this contract.",

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
                    "❌ Team role not found.",

                    components:[]

                });

            }



            if(
                guild.members.me.roles.highest.position
                <= role.position
            ){

                return interaction.editReply({

                    content:
                    "❌ Bot role is below the team role. Move the bot role above team roles.",

                    components:[]

                });

            }



            await member.roles.add(role);



            db.players[interaction.user.id] = {

                team: team.name,

                roleId: team.roleId

            };



            saveDB(db);



            await interaction.editReply({

                content:
                `✅ You signed with **${team.name}**.`,

                components:[]

            });



            const manager =
            await guild.members.fetch(
                team.managerId
            ).catch(()=>null);



            if(manager){

                manager.send(
                    `🏆 Contract Accepted\n\n${interaction.user} signed with **${team.name}**.`
                ).catch(()=>{});

            }



        }




        // DECLINE


        if(id.startsWith("decline_")){


            await interaction.editReply({

                content:
                `❌ You declined the contract from **${team.name}**.`,

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

                    manager.send(
                        `❌ ${interaction.user} declined the contract from **${team.name}**.`
                    ).catch(()=>{});

                }

            }

        }


    } catch(error){


        console.log("BUTTON ERROR:", error);


        if(!interaction.replied){

            await interaction.editReply({

                content:
                "❌ Something went wrong processing this contract.",

                components:[]

            }).catch(()=>{});

        }


    }


};