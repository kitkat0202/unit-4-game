$(function() {

///////////////  ARRAY / OBJECTS  ////////////////////////
let characters = [
    // {name: "KERO", image: "assets/images/mini/aa_cardcaptor1.png", health: 99999, attack: 500},
    // {name: "TERRIERMON", image: "assets/images/mini/aa_digimon.png", health: 500, attack: 5},
    {name: "YUNO GASAI", image: "assets/images/mini/aa_future-diary.png", health: 400, attack: 5},
    {name: "MEW TWO", image: "assets/images/mini/aa_pokemon4.png", health: 400, attack: 5},
    {name: "KAKASHI", image: "assets/images/mini/aa_naruto2.png", health: 300, attack: 5},
    {name: "LING YAO", image: "assets/images/mini/dd_FMA3.png", health: 300, attack: 5}
]

///////////////  VARIABLES   /////////////////////////////
let countTurns = 0;
let win = 0;
let lose = 0;


//var playerChoice; 
let playerHealth = 0;
let playerAttack = 0;
let playerOrgAttack = 0;
let playerIsChosen = false;



//var computerChoice;
let computerHealth = 0;
let computerAttack = 0;
let computerOrgAttack = 0;
let computerIsChosen = false;





///////////////  FUNCTIONS   /////////////////////////////
function addToCharaSelect() {
    for (var i = 0; i < characters.length; i++) {
        $("#chara-select").append($("<div>").attr({class: "chara-slot", id: `chara-${i}`, value: i}));
        $(`#chara-${i}`).append($("<img>").attr("src", characters[i].image))
        $(`#chara-${i}`).append($("<p>").html(characters[i].name))
        $(`#chara-${i}`).append($("<p>").html(`Health: ${characters[i].health}`).addClass("health"))
    }
};



let randNum = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clearAll() {
    // disappear from field
    $("#player-chara, #comp-chara").addClass("disappear");

    //appear in header
    $("#chara-select").empty();
    


    //add atk btn
    $(".reset-btn").addClass("disappear")
    $(".atk-btn").removeClass("disappear")

    //clear stats
    countTurns = 0;

    playerHealth = 0;
    playerAttack = 0;
    playerOrgAttack = 0;
    playerIsChosen = false;

    computerHealth = 0;
    computerAttack = 0;
    computerIsChosen = false;
}



///////////////  GAME PLAY  //////////////////////////////
addToCharaSelect();


///////////// on-click functions /////////////////////////

// Game Start
$(".start").on("click", function () {
    
    $(".start-btn").addClass("disappear");
    $(".atk-btn").removeClass("disappear");

});

// CHOOSE CHARACTER
$(".chara-slot").on("click", function () {
    let choice = characters[parseInt($(this).attr("value"))]
    console.log("chara select");
    if (computerIsChosen) {
        return false
    }

    if (playerIsChosen) {
        //add computer in field
        computerChoice = choice;
        computerHealth = choice.health;
        computerOrgAttack = choice.attack;
        computerAttack = choice.attack;
        $("#comp-chara").removeClass("disappear");
        $("#comp-img").attr("src", choice.image);
        $("#comp-chara p.name").text(choice.name);
        $("#comp-health").text(computerHealth);
        $("#comp-attack").text(computerAttack);

        //remove player from header
        $(this).fadeOut()
        computerIsChosen = true
        
        
    } else {
        //add player in field
        playerChoice = choice;
        playerHealth = choice.health;
        playerOrgAttack = choice.attack;
        playerAttack = choice.attack;
        $("#player-chara").removeClass("disappear");
        $("#player-img").attr("src", choice.image);
        $("#player-chara p.name").text(choice.name);
        $("#player-health").text(playerHealth);
        $("#player-attack").text(playerAttack);

        //remove player from header
        $(this).fadeOut()
        playerIsChosen = true;
    }
    
});





// on click attack button and lose and win
$(".atk").on("click", function () {
    if (!computerIsChosen || playerHealth <= 0 || computerHealth <= 0) {
        return false
    } else {
        computerHealth -= playerAttack;
        playerAttack += playerOrgAttack;
        playerHealth -= computerAttack;
        $(".info-center").empty();
        $(".info-center").append($("<p>").text(`Your attach lowered Enemy health to ${computerHealth}`));
        $(".info-center").append($("<p>").text(`Enemy attach lowered Your health to ${computerHealth}`));
    }

    
    $("#comp-health").text(computerHealth);
    $("#comp-attack").text(computerAttack);
    $("#player-health").text(playerHealth);
    $("#player-attack").text(playerAttack);


    if (computerHealth <= 0) {
        $(".info-center").html($("<p>").text(`Enemy has lost.. Please choose your next apponent`));
        $("#comp-chara").addClass("disappear");
        countTurns +=1
        computerIsChosen = false;
        if (countTurns === characters.length - 1) {
            win++
            $(".win-score").html(`${win}`);
            $(".atk-btn").addClass("disappear");
            $(".reset-btn").removeClass("disappear");
        }
    }

    if (playerHealth <= 0) {
        $(".info-center").append($("<p>").text(`Enemy attach lowered Your health to ${computerHealth}`));
        $("#player-chara").addClass("disappear");
        lose++
        $(".lose-score").html(`${lose}`)
        $(".atk-btn").addClass("disappear")
        $(".reset-btn").removeClass("disappear")
    } 


});

$(".reset").on("click", function () {
    clearAll();
    $(".reset-btn").addClass("disappear")
    $(".start-btn").removeClass("disappear")
});



});