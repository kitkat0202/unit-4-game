$(function() {

///////////////  ARRAY / OBJECTS  ////////////////////////




let characters = []

///////////////  VARIABLES   /////////////////////////////
let countTurns = 0;
let win = 0;
let lose = 0;



let playerHealth = 0;
let playerAttack = 0;
let playerOrgAttack = 0;
let playerIsChosen = false;



let computerHealth = 0;
let computerAttack = 0;
let computerIsChosen = false;


///////////////  FUNCTIONS   /////////////////////////////
let randNum = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function addToCharaSelect() {
    $(".chara-slot").removeClass("disappear")
    for (var i = 0; i < 4; i++) {
        $(`#chara-${i}`).append($("<img>").attr("src", characters[i].image))
        $(`#chara-${i}`).append($("<p>").html(characters[i].name))
        $(`#chara-${i}`).append($("<p>").html(`Health: ${characters[i].health}`).addClass("health"))
        $(`#chara-${i}`).append($("<p>").html(`Attack: ${characters[i].attack}`).addClass("health"))
    }
};




function clearAll() {
    //Header Reset
    $(".chara-slot").addClass("disappear");
    $("#message-board").html($("<h1>").text("Welcome to Unit-4-Game"));
    $("#message-board").removeClass("disappear").slideDown();
    $(".chara-slot").empty();


    // Field Reset
    $("#player-chara, #comp-chara").addClass("disappear");
  
    
    //Footer Reset
    $(".reset-btn").addClass("disappear");
    $(".start-btn").removeClass("disappear");
    $(".info-center").empty();

    //clear stats
    characters = []
    countTurns = 0;

    playerHealth = 0;
    playerAttack = 0;
    playerOrgAttack = 0;
    playerIsChosen = false;

    computerHealth = 0;
    computerAttack = 0;
    computerIsChosen = false;
}





///////////// on-click functions /////////////////////////

// Game Start
$(".start").on("click", function () {
    let p1 = new Promise((resolve, reject) => {
        for (var i = 0; i < 4; i++) {
            var id = randNum(1, 151)
            
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
                .then(res => res.json())
                .then(data => {
                    var randName = data.name.toUpperCase()
                    var ranImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`
                    var ranHealth
                    var ranAttach
                    var ranID = parseInt(data.id)
                    if ((ranID > 143 || ranID === 3 || ranID === 6 || ranID === 9 || ranID === 130) && ranID < 152) {
                        ranHealth = randNum(150, 200); //legandary pokemon
                        ranAttach = randNum(11, 25);
                    } else if (ranID === 129 ){
                        ranHealth = randNum(50, 90); //magikarp
                        ranAttach = 1;
                    } else {
                        ranHealth = randNum(100, 150); //all other pokemon
                        ranAttach = randNum(2, 10);
                    }
                    thisPokemon = {name: randName, image: ranImage, health: ranHealth, attack: ranAttach};
                    characters.push(thisPokemon);
            })

        }
        resolve("success!")

    })

    p1.then((x) => {
        console.log(x);
        $("#message-board").slideUp()
        $(".start-btn").addClass("disappear");
        $(".atk-btn").removeClass("disappear");

        setTimeout(function() {
            $("#message-board").html($("<h1>").text("Please choose a character")).slideDown()
        }, 950);

        setTimeout(function() {
            $("#message-board").slideUp()
        }, 4000);

        setTimeout(function() {
            
            $("#chara-select").removeClass("disappear");
            addToCharaSelect();
        }, 5000);
    })
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
        $("#comp-chara").addClass("disappear");
        countTurns +=1
        
        if (countTurns === characters.length - 1) {
            win++
            $(".win-score").html(`${win}`);
            $(".atk-btn").addClass("disappear");
            $(".reset-btn").removeClass("disappear");
            $(".info-center").html($(`<p>YOU HAVE WON!</p>`));
        } else {
            computerIsChosen = false;
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