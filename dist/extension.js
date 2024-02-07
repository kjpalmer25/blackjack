/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**************************!*\
  !*** ./src/blackjack.js ***!
  \**************************/

// fix CSS
// add split + double down
//add pop up to prompt for player name
// be able to add multiple players: probably would need to create an array of hand objects for this
class Card {
    constructor(suit, rank, imageUrl){
        this.suit = suit,
        this.rank = rank,
        this.imageUrl = imageUrl
    }
}

class Deck {
    constructor(){
        this.cards = [],
        this.createDeck()
    }
    createDeck(){
        const suits = ["C", "D", "H", "S"]
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
        for (const suit of suits){
            for (const rank of ranks){
                let imageUrl = "./cards/" + rank + suit + ".svg" //path to images
                let newCard = new Card(suit, rank, imageUrl)
                this.cards.push(newCard)
            }
        }
    }
    shuffle(){ //fisher-yates shuffle
        for (let i = 0; i < this.cards.length; i++){
            let temp = this.cards[i] //store current value
            let r = Math.floor(Math.random()*this.cards.length) // random index in cards array
            this.cards[i] = this.cards[r] // swap current value with random value
            this.cards[r] = temp // assign stored value at random value
        }
    }
    dealCard(){
        return this.cards.pop() //returns popped element
    }
}

class hand {
    constructor(id){
        this.cards = []
        this.sum = 0
        this.playing = false //true if sum <= 21
        this.cardEl = document.getElementById(id) //message to display cards in html
        this.blackjack = false //true if hand is blackjack
        this.aceCount = 0 //number of aces in hand
    }
    drawCard(){ //add card to hand (not a hit for player)
        if (this.playing){
            let newCard = deck.dealCard()
            this.cards.push(newCard)
            if (newCard.rank === 'A')
                this.aceCount += 1
            this.sum = this.sumCards()
            this.cardEl.innerHTML += `<img class="card-image" src="${newCard.imageUrl}" alt="${newCard.rank+newCard.suit}">`
        }
    }
    drawCardOne(){ //add card to hand (not a hit for player)
        if (this.playing){
            //let newCard = deck.dealCard()
            let newCard = new Card('S', 'A', './cards/AS.svg')  // TEST
            this.cards.push(newCard)
            if (newCard.rank === 'A')
                this.aceCount += 1
            this.sum = this.sumCards()
            this.cardEl.innerHTML += `<img class="card-image" src="${newCard.imageUrl}" alt="${newCard.rank+newCard.suit}">`
        }
    }
    drawCardTwo(){ //add card to hand (not a hit for player)
        if (this.playing){
            //let newCard = deck.dealCard()
            let newCard = new Card('S', 'K', './cards/KS.svg')  // TEST
            this.cards.push(newCard)
            if (newCard.rank === 'A')
                this.aceCount += 1
            this.sum = this.sumCards()
            this.cardEl.innerHTML += `<img class="card-image" src="${newCard.imageUrl}" alt="${newCard.rank+newCard.suit}">`
        }
    }

    hit(){ //hit for player hand
        if (this.playing){
            // add new card to hand
            let newCard = deck.dealCard()
            this.cards.push(newCard)
            if (newCard.rank === 'A')
                this.aceCount += 1
            this.sum = this.sumCards()
            this.cardEl.innerHTML += `<img class="card-image" src="${newCard.imageUrl}" alt="${newCard.rank+newCard.suit}">`
            //evaluate hand
            if (this.sum === 21){
                endHand()
            }
            else if(this.sum > 21){
                this.playing = false
                endHand()
            }
        }
    }
    stay(){ //stay
        if (this.playing){
            console.log(playerData.name + " stays at " + this.sum)
            endHand()
        }
    }
    sumCards(){
        let sum = 0
        for (let i = 0; i<this.cards.length; i++){
            if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(this.cards[i].rank))
                sum += parseInt(this.cards[i].rank)
            else if (['J', 'Q', 'K'].includes(this.cards[i].rank))
                sum += 10
            else //ace
                sum += 11
        }
        if (this.aceCount > 0 && sum > 21){ //subtract for aces
            let temp = this.aceCount
            while (sum > 21 && temp > 0){
                sum -= 10
                temp -= 1
            }
        }
        return sum
    }
    reset(){
        this.cards = []
        this.sum = 0
        this.playing = false
        this.blackjack = false
        this.playing = true
        this.aceCount = 0
    }
}

let playerData = { //player object
    name: "Player",
    cash: 100, 
    bet: 0
}

let playerEl = document.getElementById("player-el") //player name and cash
playerEl.textContent = playerData.name + ": $" + playerData.cash
let messageEl = document.getElementById("message-el")
let startEl = document.getElementById("start-el")
//let messageEl = document.querySelector("message-el")
//querySelector can be used to select classes, id, body or other container, etc. 

//create hand for player and dealer
const player = new hand("player-hand")
const dealer = new hand("dealer-hand")

//create and shuffle deck
const deck = new Deck
deck.shuffle()

function startGame(){
    startEl.disabled = true
    //return cards to deck
    for (const card of player.cards){
        deck.cards.push(card)
    }
    for (const card of dealer.cards){
        deck.cards.push(card)
    }
    //shuffle deck
    deck.shuffle()
    //reset html output
    player.cardEl.textContent = "Your cards: "
    dealer.cardEl.textContent = "Dealer's cards: "
    //reset hands
    player.reset()
    dealer.reset()
    //reset cash if player runs out
    if (playerData.cash == 0){
        playerData.cash = 100
    }
    playerEl.textContent = playerData.name + ": $" + playerData.cash

    //confirm bet is within bounds
    placeBet()
    if (playerData.bet <= playerData.cash){
        //deal hands to player and dealer
        player.drawCard()
        dealer.drawCard()
        player.drawCard()
        dealer.drawCard()

        //hide dealer's second card
        dealer.cardEl.innerHTML = `Dealer's cards: `;
        dealer.cardEl.innerHTML += `<img class="card-image" src="${dealer.cards[0].imageUrl}" alt="${dealer.cards[0].rank+dealer.cards[0].suit}">`
        dealer.cardEl.innerHTML += `<img class="card-image" src="./cards/2B.svg" alt="hidden card">`
        
        //render gameplay output
        let message = ""
        player.sum = player.sumCards()
        if (player.sum === 21){
            message = "Blackjack!"
            player.blackjack = true
            endHand()
        }
        else{
            message = "Do you want to hit or stay?"
        }
        messageEl.textContent = message
    }
    else{
        messageEl.textContent = "Please place a valid bet"
    }
}

function endHand(){ //end hand and payout bet
    player.playing = false
    while(dealer.sum <= 16){
        dealer.drawCard()
    }
    //update html for dealer's hand
    dealer.cardEl.innerHTML = `Dealer's cards: `
    for (const card of dealer.cards){
        dealer.cardEl.innerHTML += `<img class="card-image" src="${card.imageUrl}" alt="${card.rank+card.suit}">`
    }

    if (player.sum <= 21){
        if (dealer.sum > 21){
            messageEl.textContent = "Dealer busts. You win!"
        }
        else if (player.sum > dealer.sum){
            messageEl.textContent = "You win!"
        }
        else if (dealer.sum > player.sum){
            messageEl.textContent = "You lose"
        }
        else{
            messageEl.textContent = "Draw"
        }
    }
    else{
        messageEl.textContent = "Bust - You lose"
    }

    processBet()
    startEl.disabled = false //allow new hand to begin
}

function placeBet(){
    let betInput = document.getElementById("bet-el")
    playerData.bet = betInput.value
}

function processBet(){
    // let bet = parseFloat(playerData.bet)
    // let cash = parseFloat(playerData.cash)
    if ((player.sum > dealer.sum || dealer.sum > 21) && player.sum <= 21){
        if (player.blackjack){ //payout 2 to 1 for blackjack
            playerData.cash += 2*parseFloat(playerData.bet)
            messageEl.textContent += " Win:"+ 2*playerData.bet
        }
        else{
            playerData.cash += parseFloat(playerData.bet)
            messageEl.textContent += " Win:"+ playerData.bet
        }
    }
    else if (player.sum === dealer.sum){
        messageEl.textContent += ". Bet returned"
    }
    else{
        playerData.cash -= parseFloat(playerData.bet)
        messageEl.textContent += " $" + playerData.bet
    }
    playerEl.textContent = playerData.name + ": $" + playerData.cash
}
module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map