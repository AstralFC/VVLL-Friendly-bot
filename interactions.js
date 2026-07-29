// =====================================
// VVLL LEAGUE BOT
// INTERACTIONS.JS
// =====================================

const contracts = require("./contracts");
const ownerPanel = require("./ownerPanel");
const database = require("./database");



async function run(interaction) {


    try {


        // ==========================
        // BUTTONS
        // ==========================

        if(interaction.isButton()) {



            // OWNER PANEL

            if(
                interaction.customId === "league_setup" ||
                interaction.customId === "reset_league" ||
                interaction.customId === "view_standings" ||
                interaction.customId === "manage_games" ||
                interaction.customId === "manage_stats" ||
                interaction.customId === "manage_teams"
            ){

                return ownerPanel.handlePanel(interaction);

            }





            // CONTRACT ACCEPT

            if(
                interaction.customId.startsWith(
                    "contract_accept_"
                )
            ){


                const data =
                interaction.customId.split("_");


                const teamRole =
                data[2];


                const playerId =
                data[3];



                const accepted =
                contracts.acceptContract(
                    playerId,
                    teamRole
                );



                if(!accepted){


                    return interaction.update({

                        content:
                        "❌ Contract expired or team is full.",

                        components:[]

                    });


                }



                return interaction.update({

                    content:
                    "✅ Contract accepted! You joined the team.",

                    components:[]

                });


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





            // UNKNOWN BUTTON

            return interaction.reply({

                content:
                "❌ Unknown button.",

                ephemeral:true

            });


        }






        // ==========================
        // MODALS
        // ==========================


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
                    `✅ ${teams.length} teams added.`,

                    ephemeral:true

                });


            }




        }



    }

    catch(error){


        console.log(
            "Interaction Error:",
            error
        );


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