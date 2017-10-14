var fs = require("fs");
var inqurier = require("inquirer");
var clozeCards = require("./clozecard.js");
var basicCards = require("./basiccard.js");
var ui = require("./ui.js");
var inquire = require("inquirer");

// Takes input from inquire and processes it
function uiHandler(answers){
	if(answers.action === "Add new card"){
		return createCards(answers);
	}else{
		getCards(answers);
	}
}

// processes the adding of a card
function createCards(answers){
	var cardAppend = "\n" + answers.fact;
	cardAppend +="\r\n" + answers.factpart;


	fs.appendFile("cards.txt", cardAppend, function(appendError){
		if(appendError){
			return appendError;
		}

		return "Card added successfully!";

	})
}

// Get the cards from file and add them to an array
function getCards(answers){
	var cards = [];
	
	var cardLength = 0;

	fs.readFile("cards.txt", "UTF-8", function(error, data){
		if(error){
			return console.log("Error: " + error);
		}

		cards = data.split("\r\n");
		addToArray(answers.action,cards,0);
	});
}

//depending on the game that was choosen add the neccesary information
//Flash Card adds the front and back properties to the array
// Fill in adds the cloze, partial and full text properties to the array
// once complete call the appropriate function or loop function to add more to the array
function addToArray(action, cards, i, cardDeck=[]){
	if(action === "Flash cards" && i < cards.length){
		cardDeck.push(new basicCards(cards[i], cards[i+1]));
	}else if(action === "Fill in the blank"  && i < cards.length){
		cardDeck.push(new clozeCards(cards[i], cards[i+1], cards[i+3]));
	}
	
	if(i >= cards.length){
		if(action === "Flash cards"){
			showBasic(cardDeck, 0);
		}else{
			showCloze(cardDeck, 0);
		}
	}else{
		i+=2;
		addToArray(action, cards,i, cardDeck);
	}
}

// Use inquire to display the front and then the back when enter key is hit
function showBasic(cardDeck, i){
	if(i < cardDeck.length){
		inquire
		.prompt([
			{
				type: "boolean",
				name: "basic",
				message: cardDeck[i].front
			}
		])
		.then(function(){
			console.log(cardDeck[i].back);
			i++;
			showBasic(cardDeck,i);
		});
	}
}

// Use inquire to display the partial phrase and the person can type in the missing part
// If guess is incorrect inform them and let them try again
// If correct mvoe on to the next card
function showCloze(cardDeck, i){
	if(i < cardDeck.length){
		inquire
		.prompt([
			{
				type: "input",
				name: "cloze",
				message: cardDeck[i].partial,
				validate: function(cloze){
					if(cloze.toLowerCase() !== cardDeck[i].cloze.toLowerCase()){
						return "Try Again";
					}

					console.log("\r\n" + cardDeck[i].fullText);
					return true		
				}
			}
		])
		.then(function(){
			i++;
			showCloze(cardDeck,i);
		});
	}
}

module.exports.uiHandler = uiHandler;

