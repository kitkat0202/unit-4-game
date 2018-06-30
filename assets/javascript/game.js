$(function() {

///////////////  ARRAY / OBJECTS  ////////////////////////
var characters = [
    {name: "KERO", image: "assets/images/mini/aa_cardcaptor1.png", class: "A"},
    {name: "TERRIERMON", image: "assets/images/mini/aa_digimon.png", class: "A"},
    {name: "YUNO GASAI", image: "assets/images/mini/aa_future-diary.png", class: "B"},
    {name: "ALADDIN", image: "assets/images/mini/aa_magi1.png", class: "B"},
    {name: "KAKASHI", image: "assets/images/mini/aa_naruto2.png", class: "C"},
    {name: "CHARIZARD", image: "assets/images/mini/aa_pokemon2.png", class: "C"}
]

///////////////  VARIABLES   /////////////////////////////
var gameStatus = true;



var playerChoice;
var playerHealth = 0;
var playerAttack = 0;
var playerMode;

var computerChoice;
var computerHealth = 0;
var computerAttack = 0;
var computerMode;





///////////////  FUNCTIONS   /////////////////////////////
var randNum = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clearAll() {
    //add all the characters back

    //remove the players on the field

    //clear stats
    playerHealth = 0;
    playerAttack = 0;
    playerMode = "";

    computerHealth = 0;
    computerAttack = 0;
    computerMode = "";
    
}


///////////////  GAME PLAY  //////////////////////////////




});