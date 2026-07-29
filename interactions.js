// =====================================
// VVLL LEAGUE BOT
// INTERACTIONS.JS V2
// =====================================

const ownerPanel = require("./ownerPanel");
const contracts = require("./contracts");





async function run(interaction){


try{



// ==========================
// BUTTONS
// ==========================

if(interaction.isButton()){





// OWNER PANEL

if(

interaction.customId === "league_setup" ||

interaction.customId === "manage_games" ||

interaction.customId === "view_standings" ||

interaction.customId === "reset_league"

){


return ownerPanel.handlePanel(
interaction
);


}







// CONTRACT ACCEPT

if(

interaction.customId.startsWith(
"contract_accept_"
)

){



let data =
interaction.customId.split("_");



let teamId =
data[2];


let playerId =
data[3];



let success =
contracts.acceptContract(

playerId,

teamId

);





if(success){


return interaction.update({

content:

"✅ Contract accepted! You are now signed.",

components:[]

});


}




return interaction.update({

content:

"❌ Contract expired or roster full.",

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







}





// ==========================
// SELECT MENUS
// ==========================


if(interaction.isStringSelectMenu()){


return interaction.reply({

content:

"Selection received.",

ephemeral:true

});


}








// ==========================
// MODALS
// ==========================


if(interaction.isModalSubmit()){



return interaction.reply({

content:

"✅ Saved.",

ephemeral:true

});


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