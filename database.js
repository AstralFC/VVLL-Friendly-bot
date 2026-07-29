// =====================================
// VVLL LEAGUE BOT
// DATABASE.JS
// =====================================

const fs = require("fs");

const FILE = "./vvll_data.json";



let db = {


settings: {

league:"VVLL",

active:false

},


teams:[],


players:[],


matches:[]


};





function load(){


if(
fs.existsSync(FILE)
){


try{


db = JSON.parse(

fs.readFileSync(
FILE,
"utf8"
)

);


console.log(
"✅ Database loaded"
);



}

catch(err){

console.log(
"❌ Database load error",
err
);

}


}


}





function save(){


fs.writeFileSync(

FILE,

JSON.stringify(

db,

null,

2

)

);


}





load();





module.exports = {

db,

save

};