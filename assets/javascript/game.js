$(function() {
    let log = console.log
    let clickOn = false
    let clickStart = false
    var toggler = true
    let savedChara = []
    let playChara = []

    let win = 0
    let lose = 0
    let defeted = 0

    let playerOrgHealth = 0
    let playerHealth = 0
    let playerAttack = 0
    let playerOrgAttack = 0
    let playerIsChosen = false

    let computerOrgHealth = 0
    let computerHealth = 0
    let computerAttack = 0
    let computerIsChosen = false

    ////////////////  FUNCTIONS TO CREATE THE RANDOM CHARATERS /////////////////////////
    let randomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1))+ min
    }

    function CharaCreater(n, imgf, imgb, h, a) {
        this.name = n
        this.imgFront = imgf
        this.imgBack = imgb
        this.health = h
        this.attack = a
    }


    let getPokemonById = (charaNum) => {
        log("running")                                      //////////// remove
        let id = randomNumber(1, 150)
        let url = `https://pokeapi.co/api/v2/pokemon/${id}/`

        fetch(url)
        .then(responce => responce.json())
        .then(data => {
           return data.name.toUpperCase()
        }).then(dataName => {
            log(dataName)                               ///////////////// remove
            let front = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
            let back = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`
            let hp
            let atk

            if ((id > 143 || id === 3 || id === 6 || id === 9 || id === 130) && id < 152) {
                hp = randomNumber(150, 200)
                atk = randomNumber(15, 25)
            } else if (id === 129 ) {
                hp = randomNumber(50, 90)
                atk = 1
            } else {
                hp = randomNumber(100, 150)
                atk = randomNumber(10, 20)
            }

            construct = new CharaCreater(dataName, front, back, hp, atk)
            return construct
        }).then(thechara => {
            charaNum.push(thechara)
            
        }).catch(error => {
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
    
        playerOrgHealth = 0
        playerHealth = 0
        playerAttack = 0
        playerOrgAttack = 0
        playerIsChosen = false
        computerOrgHealth = 0
        computerHealth = 0
        computerAttack = 0
        computerIsChosen = false

    }

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

    let updateOutcome = () => {
        //lower comp health by player health
        computerHealth -= playerAttack
        $(".right-status .status-health").html(`HP: ${computerHealth}`)
        healthBarDisplay(computerOrgHealth, computerHealth, ".right-status .health-bar")

        //lower player health by comp health
        playerHealth -= computerAttack
        $(".left-status .status-health").html(`HP: ${playerHealth}`)
        healthBarDisplay(playerOrgHealth, playerHealth, ".left-status .health-bar")
        playerAttack += playerOrgAttack
        $(".left-status .status-attack").html(`ATK: ${playerAttack}`)

        $(".info-center").empty()
        $(".info-center").append($("<p>").text(`Player attacks with ${playerAttack}ATK. Computer Health is now ${computerHealth} HP`))
        $(".info-center").append($("<p>").text(`Computer attacks with ${computerAttack}ATK. Player Health is now ${playerHealth} HP`))
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
                }, 1500);
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
            //NEED SOME LOSE SCREEN
            $(".info-center").append($("<p>").text(`You Lose...`))
            setTimeout(() => {
                clearAll()
                addToCharaPlay()
                divDisplay()
                $(".nintendo").addClass("disappear")
                $(".choosing").removeClass("disappear")
            }, 1500);
        }


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
            return false
        }

        if (playerIsChosen) {
            //add computer in field
            computerOrgHealth = choice.health
            computerHealth = choice.health
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
            playerOrgHealth = choice.health
            playerHealth = choice.health
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
            checkWinLose()
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