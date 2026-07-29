// =====================================
// VVLL LEAGUE BOT
// INTERACTIONS.JS
// =====================================

const ownerPanel = require("./ownerPanel");
const contracts = require("./contracts");
const database = require("./database");



async function run(interaction) {


    try {



        // ============================
        // BUTTONS
        // ============================

        if(interaction.isButton()) {



            // OWNER PANEL BUTTONS

            if(
                interaction.customId.startsWith("league_") ||
                interaction.customId.startsWith("reset_") ||
                interaction.customId.startsWith("view_") ||
                interaction.customId.startsWith("manage_")
            ){

                return ownerPanel.handlePanel(interaction);

            }





            // CONTRACT ACCEPT

            if(
                interaction.customId.startsWith(
                    "contract_accept_"
                )
            ){


                const parts =
                interaction.customId.split("_");


                const teamRole = parts[2];

                const playerId = parts[3];



                const accepted =
                contracts.acceptContract(
                    playerId,
                    teamRole
                );



                if(accepted){


                    return interaction.update({

                        content:
                        "✅ Contract accepted! You have joined the team.",

                        components:[]

                    });


                }


                else{


                    return interaction.update({

                        content:
                        "❌ This contract is no longer available.",

                        components:[]

                    });


                }


            }





            // CONTRACT DECLINE

            if(
                interaction.customId ===
                "contract_decline"
            ){


                return interaction.update({

                    content:
                    "❌ Contract declined.",

                    components:[]

                });


            }





            return interaction.reply({

                content:
                "❌ Unknown button.",

                ephemeral:true

            });


        }








        // ============================
        // MODALS
        // ============================


        if(interaction.isModalSubmit()) {



            if(
                interaction.customId ===
                "league_setup_modal"
            ){


                const teams =
                interaction.fields
                .getTextInputValue(
                    "teams"
                )
                .split("\n")
                .filter(Boolean);



                return interaction.reply({

                    content:
                    `✅ League setup received with ${teams.length} teams.`,

                    ephemeral:true

                });


            }


        }



    }

    catch(error){


        console.log(error);


        if(!interaction.replied){


            await interaction.reply({

                content:
                "❌ Something went wrong.",

                ephemeral:true

            });


        }


    }


}





module.exports = {

    run

};