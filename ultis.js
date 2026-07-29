// =====================================
// VVLL LEAGUE BOT
// UTILS.JS
// =====================================


// Create random ID

function randomId(){


    return (

        Date.now().toString(36) +

        Math.random()

        .toString(36)

        .substring(2,8)

    );


}







// Shuffle array

function shuffle(array){



    let newArray = [...array];



    for(
        let i = newArray.length - 1;
        i > 0;
        i--
    ){


        let j = Math.floor(

            Math.random() * (i + 1)

        );



        [

            newArray[i],

            newArray[j]

        ] = [

            newArray[j],

            newArray[i]

        ];



    }



    return newArray;


}







module.exports = {


    randomId,


    shuffle


};