var dealerSum = 0;
var yourSum = 0;
var dealerAceCount = 0;
var yourAceCount = 0;
var hidden;
var deck;
var canHit = true; //allows the player (you) to draw while yourSum <= 21

var buildDeck = function () {
  let values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  let suit = ["C", "D", "H", "S"];
  deck = []; //this is the deck of cards, an array

  for (let i = 0; i < suit.length; i++) {
    //looping through suit
    for (let j = 0; j < values.length; j++) {
      //looping through each suit's individual cards
      deck.push(values[j] + "-" + suit[i]); //A-C -> K-C, A-D -> K-D, that is, building up each suit's cards
    }
  }
  console.log(deck);
};

var shuffleDeck = function () {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  console.log(deck);
};

var startGame = function () {
  hidden = deck.pop(); //draw dealer's hidden card
  dealerSum += getValue(hidden); //get value of dealer's hidden card and add to dealer's total
  dealerAceCount += checkAce(hidden); //check dealer's ace count inside hidden card
  // console.log(hidden);
  // console.log(dealerSum);
  while (dealerSum < 17) {
    //<img src="./cards/4-C.png">
    let cardImg = document.createElement("img"); //create tag location of card(s)
    let card = deck.pop(); //dealer draws shown cards as long as dealer's total sum is below 17 due to while loop
    cardImg.src = "./cards/" + card + ".png"; //get the source of the drawn card image
    dealerSum += getValue(card); //add drawn card(s)' values to dealer's total
    dealerAceCount += checkAce(card); //add ace count of drawn card(s)
    document.getElementById("dealer-cards").append(cardImg); //show drawn card images on screen HTML display
  }
  console.log(dealerSum);

  for (let i = 0; i < 2; i++) {
    //player's cards, gets 2 cards initially
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
  }

  console.log(yourSum);
  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stay").addEventListener("click", stay);
};

var hit = function () {
  if (!canHit) {
    return;
  }

  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = "./cards/" + card + ".png";
  yourSum += getValue(card);
  yourAceCount += checkAce(card);
  document.getElementById("your-cards").append(cardImg);

  if (reduceAce(yourSum, yourAceCount) > 21) {
    //if playerSum is greater than 21, cannot Hit anymore
    //A, J, 8 -> 1 + 10 + 8
    canHit = false;
  }
};

var stay = function () {
  dealerSum = reduceAce(dealerSum, dealerAceCount);
  yourSum = reduceAce(yourSum, yourAceCount);

  canHit = false;
  document.getElementById("hidden").src = "./cards/" + hidden + ".png";

  let message = "";
  if (yourSum > 21) {
    message = "You Lose!";
  } else if (dealerSum > 21) {
    message = "You win!";
  }
  //both you and dealer <= 21
  else if (yourSum == dealerSum) {
    message = "Tie!";
  } else if (yourSum > dealerSum) {
    message = "You Win!";
  } else if (yourSum < dealerSum) {
    message = "You Lose!";
  }

  document.getElementById("dealer-sum").innerText = dealerSum;
  document.getElementById("your-sum").innerText = yourSum;
  document.getElementById("results").innerText = message;
  var reloadbtn = document.getElementById("again");
  reloadbtn.style.display = "block";
};

var getValue = function (card) {
  //gets the value of each card
  let data = card.split("-"); // "4-C" -> ["4", "C"], splitting each card into 2-part array
  let value = data[0];

  if (isNaN(value)) {
    //if the card value is A, J, Q or K
    //A J Q K
    if (value == "A") {
      return 11;
    }
    return 10;
  }
  return parseInt(value); //returns or extract the first integer value of the data string, e.g. if "4-C", it returns "4"
};

var checkAce = function (card) {
  //checks ace count
  if (card[0] == "A") {
    return 1;
  }
  return 0;
};

//adjusts player's total and ace card count total
var reduceAce = function (playerSum, playerAceCount) {
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10; //change the ace's value to 10 instead of 11 on player's total sum
    playerAceCount -= 1; //reduce each ace instance that the player has
  }
  return playerSum;
};

location.onload = function () {
  buildDeck();
  shuffleDeck();
  startGame();
};
