$(function() {
    const log = console.log
    let clickOn = false
    let clickStart = false
    let toggler = true
    let savedChara = []
    let playChara = []

    let win = 0
    let lose = 0
    let defeted = 0

    let playerName = ""
    let playerOrgHealth = 0
    let playerHealth = 0
    let playerAttack = 0
    let playerMove = ""
    let playerIsChosen = false

    let computerName = ""
    let computerOrgHealth = 0
    let computerHealth = 0
    let computerMove = ""
    let computerAttack = 0
    let computerIsChosen = false

    ////////////////  FUNCTIONS TO CREATE THE RANDOM CHARATERS /////////////////////////
    let randomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1))+ min
    }

    let getPokemonById = (charaNum) => {
        let id = randomNumber(1, 150)
        let url = `https://pokeapi.co/api/v2/pokemon/${id}/`

        fetch(url)
            .then(res => res.json())
            .then(data => {
                // Move info
                let moveLength = data.moves.length - 1
                let moveNumRandom = randomNumber(0, moveLength)
                let moveURL = data.moves[moveNumRandom].move.url

                // Important Pokemon Data Extracted
                let thisPokemon = {
                    name: data.name.toUpperCase(),
                    imgFront:`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
                    imgBack:`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`,
                    // health: Math.floor((data.base_experience * 2 + randomNumber(1,30) + (randomNumber(1,255)/4)) * (data.stats[5].base_stat/100 + 10)),
                    health: Math.floor((data.stats[5].base_stat * 2 + randomNumber(1,30) + (randomNumber(1,255)/4)) * (10/100 + 10)),
                    move: data.moves[moveNumRandom].move.name,
                    attack: 5
                }

                while (badMoves.indexOf(thisPokemon.move) !== -1) {
                    moveNumRandom = randomNumber(0, moveLength)
                    moveURL = data.moves[moveNumRandom].move.url
                    thisPokemon.move = data.moves[moveNumRandom].move.name
                }

                // Fetch the MOVE's correct ATK power
                // Check if ATK and HP are a numbers
                return (fetch(moveURL)
                    .then(res => res.json())
                    .then(data => {
                        // If HP is not a number, make HP 1000
                        if (typeof thisPokemon.health !== "number") {
                            thisPokemon.health = 1000
                        }

                        // If ATK is a number replace ATK with correct num
                        if (typeof data.power === "number") {
                            thisPokemon.attack = data.power
                        }
                        return thisPokemon
                    }) )

                
            })
            .then(thechara => {
                thechara.move = thechara.move.toUpperCase()
                charaNum.push(thechara)
                
            })
            .catch(error => {
                log(`the error is ${error}`)
                $(".video, .gameplay").addClass("disappear")
                $(".nintendo").removeClass("disappear")
                $(".nintendo").removeClass("dark")
                $(".nintendo").addClass("light")
                $(".nintendo").html($("<p>").text("Sorry Server Down..."))

                setTimeout(() => {
                    clearAll()
                }, 2500)
            })

    }

    let clearAll = () => {
        $(".nintendo").addClass("dark")
        $(".nintendo").removeClass("light")
        $(".nintendo").removeClass("disappear")
        $(".nintendo").html($("<p>").text("Nintendo"))

        $(".video, .gameplay, .choosing").addClass("disappear")
        $(".choosing h3").html("Choose your character...")

        $(".win-score").html(win)
        $(".lose-score").html(lose)

        $(".chara-slot, .left-battle, .left-status, .right-battle, .right-status, .info-center").empty()


        clickOn = false
        toggler = true
        playChara = []

        defeted = 0

        playerName = ""
        playerOrgHealth = 0
        playerHealth = 0
        playerMove = ""
        playerAttack = 0
        playerOrgAttack = 0
        playerIsChosen = false
        computerName = ""
        computerOrgHealth = 0
        computerHealth = 0
        computerMove = ""
        computerAttack = 0
        computerIsChosen = false

    }

    // Lagg in getting API so in initial grab will get multi characters to save for later
    let addToCharaPlay = () => {
        for (let i = 0; i < 4; i++) {
            if (playChara.length < 4) {
                playChara.push(savedChara[0])
                savedChara.shift()
                getPokemonById(savedChara)
            }
        }
    }


    let divDisplay = () => {
        $(".chara-slot").empty()
        for (let i = 0; i < 4; i++) {
            $(`#chara-${i}`).append($("<img>").attr("src", playChara[i].imgFront))
            $(`#chara-${i}`).append($("<p>").html(playChara[i].name).addClass("chara-name"))
            $(`#chara-${i}`).append($("<p>").html(`Health: ${playChara[i].health}`).addClass("chara-health"))
            $(`#chara-${i}`).append($("<p>").html(`Move: ${playChara[i].move}`).addClass("chara-move"))
            $(`#chara-${i}`).append($("<p>").html(`Attack: ${playChara[i].attack}`).addClass("chara-attack"))
        }

    }

    let statusDisplay = (side) => {
        $(side).append($("<p>").addClass("status-name"))
        $(side).append($("<p>").addClass("status-attack"))
        $(side).append($("<p>").addClass("status-health"))
        $(side).append($("<div>").addClass("health-bar"))

    }

    let healthBarDisplay = (orgH, newH, div) => {
        let x = ((newH/ orgH) * 100)
        $(div).css("width", `${x}%`)
    }




    let playAudio = (i) => { 
        document.getElementById(`${i}`).play()
    } 
      
    let stopAudio = (i) => {
        document.getElementById(`${i}`).pause()
        document.getElementById(`${i}`).currentTime = 0.0
    }

    let startGame = () => {
        playAudio("gameboy-on")
        $(".click-start").addClass("disappear")
        $(".score").removeClass("disappear")
        $(".nintendo").addClass("light")
        $(".nintendo").removeClass("dark")
        setTimeout(() => {
            stopAudio("gameboy-on")
        }, 3500)
        setTimeout(() => {
            $(".nintendo").addClass("disappear")
            $(".video").removeClass("disappear")
            playAudio("poke-red")
        }, 4000)
        setTimeout(() => {
            $(".video").addClass("disappear")
            $(".choosing").removeClass("disappear")
            addToCharaPlay()
            divDisplay()
        }, 15000)
        setTimeout(() => {
            playAudio("bg-audio")
        }, 17000)

    }

    let checkWinLose = () => {
        if (computerHealth <= 0) {
            $(".info-center").empty()
            clickOn = false
            defeted++
            if (defeted === 3) {
                win++
                // $(".win-page").removeClass("disappear")
                $(".info-center").append($("<p>").text(`You Are A Winner!!!`))
                setTimeout(() => {
                    clearAll()
                    addToCharaPlay()
                    divDisplay()
                    $(".nintendo").addClass("disappear")
                    $(".choosing").removeClass("disappear")
                }, 500);
            } else {
                computerIsChosen = false
                $(".right-battle, .right-status").empty()
                $(".choosing").removeClass("disappear")
                $(".gameplay").addClass("disappear")

            }
        }else if (playerHealth <= 0) {
            $(".info-center").empty()
            clickOn = false
            lose++
            $(".info-center").append($("<p>").text(`You Lose...`))
            setTimeout(() => {
                clearAll()
                addToCharaPlay()
                divDisplay()
                $(".nintendo").addClass("disappear")
                $(".choosing").removeClass("disappear")
            }, 500);
        }
    }

    let updateOutcome = () => {
        //lower comp health by player health
        computerHealth -= playerAttack
        $(".right-status .status-health").html(`HP: ${computerHealth}`)
        healthBarDisplay(computerOrgHealth, computerHealth, ".right-status .health-bar")

        //lower player health by comp health
        playerHealth -= computerAttack
        $(".left-status .status-health").html(`HP: ${playerHealth}`)
        healthBarDisplay(playerOrgHealth, playerHealth, ".left-status .health-bar")
        playerAttack += 10
        $(".left-status .status-attack").html(`ATK: ${playerAttack}`)

        $(".info-center").empty()
        $(".info-center").append($("<p>").text(`${playerName} attacks with ${playerMove} ${playerAttack} ATK`))
        $(".info-center").append($("<p>").addClass("bot").text(`${computerName} Health is now ${computerHealth} HP`))
        $(".info-center").append($("<p>").text(`${computerName} attacks with ${computerMove} ${computerAttack} ATK`))
        $(".info-center").append($("<p>").addClass("bot").text(`${playerName} Health is now ${playerHealth} HP`))
        checkWinLose()
    }


    //////////////////  RUN IN GAME ////////////////////////////////
    for (let i = 0; i < 4; i++) {
        getPokemonById(savedChara)
    }

    $(".chara-slot").on("click", function() {
        let x = parseInt($(this).attr("value"))
        let y
        let choice = playChara[x]

        if (computerIsChosen) {
            $(".choosing").addClass("disappear")
            $(".gameplay").removeClass("disappear")
            // return false
        }

        if (playerIsChosen) {
            //add computer in field
            computerName = choice.name
            computerOrgHealth = choice.health
            computerHealth = choice.health
            computerMove = choice.move
            computerAttack = choice.attack
            $(".right-battle").append($("<img>").attr("src", choice.imgFront))
            statusDisplay(".right-status")
            $(".right-status .status-name").text(choice.name)
            $(".right-status .status-attack").text(`ATK: ${computerAttack}`)
            $(".right-status .status-health").text(`HP: ${computerHealth}`)
    
            //remove player from header
            $(this).empty()
            computerIsChosen = true

            //go to gameplay
            $(".choosing").addClass("disappear")
            $(".gameplay").removeClass("disappear")
            clickOn = true
            
            
        } else {
            //add player in field
            playerName = choice.name
            playerOrgHealth = choice.health
            playerHealth = choice.health
            playerMove = choice.move
            playerOrgAttack = choice.attack
            playerAttack = choice.attack
            $(".left-battle").append($("<img>").attr("src", choice.imgBack))
            statusDisplay(".left-status")
            $(".left-status .status-name").text(choice.name)
            $(".left-status .status-attack").text(`ATK: ${playerAttack}`)
            $(".left-status .status-health").text(`HP: ${playerHealth}`)
    
            //remove player from header
            $(this).empty()
            playerIsChosen = true

            // change msg to choose computer
            $(".choosing h3").slideUp()
            $(".choosing h3").html("Choose your apponent!")
            setTimeout(() => {
                $(".choosing h3").slideDown()
            }, 450);
            
        }
    })

    /////////////////  Buttons  //////////////////////////////////////////
    $("#start").on("click", function() {
        if (!clickStart) {
            startGame()
            clickStart = true
        }
    })


    $(".atk").on("click", function() {
        if (clickOn) {
            updateOutcome()
        }
    })


    $("#reset").on("click", function() {
        if (clickStart) {
            win = 0
            lose = 0
            clearAll()
            stopAudio("bg-audio")
            clickStart = false
            setTimeout(() => {
                startGame()
            }, 1000)
        }
    })

    $("#sound").on("click", function() {
        if (toggler) {
            stopAudio("bg-audio")
            toggler = false
        } else {
            playAudio("bg-audio")
            toggler = true
        }
    })

})