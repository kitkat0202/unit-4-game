$(function() {

///////////////  ARRAY / OBJECTS  ////////////////////////
let group1




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
// let computerOrgAttack = 0;
let computerIsChosen = false;





///////////////  FUNCTIONS   /////////////////////////////
function addToCharaSelect() {
    $(".chara-slot").removeClass("disappear")
    for (var i = 0; i < 4; i++) {
        $(`#chara-${i}`).append($("<img>").attr("src", characters[i].image))
        $(`#chara-${i}`).append($("<p>").html(characters[i].name))
        $(`#chara-${i}`).append($("<p>").html(`Health: ${characters[i].health}`).addClass("health"))
    }
};



let randNum = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clearAll() {
    //Header Reset
    $("#message-board").removeClass("disappear");
    $("#message-board").html($("<h1>").text("Welcome to Unit-4-Game")).slideDown()
    $(".chara-slot").addClass("disappear");
    $(".chara-slot").empty();


    // Field Reset
    $("#player-chara, #comp-chara").addClass("disappear");
  
    
    //Footer Reset
    $(".reset-btn").addClass("disappear");
    $(".start-btn").removeClass("disappear");
    $(".info-center").empty();

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



///////////// on-click functions /////////////////////////

// Game Start
$(".start").on("click", function () {
    $("#message-board").slideUp()
    $(".start-btn").addClass("disappear");
    $(".atk-btn").removeClass("disappear");

    setTimeout(function() {
        $("#message-board").html($("<h1>").text("Please choose a character")).slideDown()
    }, 450);

    setTimeout(function() {
        $("#message-board").addClass("disappear");
    }, 1500);

    setTimeout(function() {
        $("#chara-select").removeClass("disappear");
        addToCharaSelect();
    }, 2000);
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
        $(this).addClass("disappear")
        computerIsChosen = true

        // Message board appears again
        
        
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
        $(this).addClass("disappear")
        playerIsChosen = true;
    }
    
});





// ATTACK button and lose and win
$(".atk").on("click", function () {
    if (!computerIsChosen || playerHealth <= 0 || computerHealth <= 0) {
        return false
    } else {
        computerHealth -= playerAttack;
        playerAttack += playerOrgAttack;
        playerHealth -= computerAttack;
        $(".info-center").empty();
            $(".info-center").append($("<p>").text(`Your attach lowered Enemy health to ${computerHealth}`));
            $(".info-center").append($("<p>").text(`Enemy attach lowered Your health to ${playerHealth}`));
    }

    
    $("#comp-health").text(computerHealth);
    $("#comp-attack").text(computerAttack);
    $("#player-health").text(playerHealth);
    $("#player-attack").text(playerAttack);


    if (computerHealth <= 0) {
        $(".info-center").empty();
        $(".info-center").html($(`<p>Enemy has lost . . . <br> Please choose your next apponent </p>`));
        
        $("#comp-chara").addClass("disappear");
        countTurns +=1
        computerIsChosen = false;
        if (countTurns === characters.length - 1) {
            win++
            $(".win-score").html(`${win}`);
            $(".atk-btn").addClass("disappear");
            $(".reset-btn").removeClass("disappear");
            $(".info-center").html($(`<p>YOU HAVE WON!</p>`));
        }
    }

    if (playerHealth <= 0) {
        $(".info-center").empty();
        $(".info-center").html($("<p>").text(`Enemy has defeted you`));
        
        $("#player-chara").addClass("disappear");
        lose++
        $(".lose-score").html(`${lose}`)
        $(".atk-btn").addClass("disappear")
        $(".reset-btn").removeClass("disappear")
    } 


});


// RESET Button
$(".reset").on("click", function () {
    clearAll();
});



});