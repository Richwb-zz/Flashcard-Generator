var inquire = require("inquirer");
var clozeCards = require("./clozecard.js");
var basicCards = require("./basiccard.js");
var engine = require("./engine.js");

// Asks what action you would like to take
// If adding a card then processes that here
inquire
.prompt([
	{
		type: "list",
		name: "action",
		message: "What would you like to do?",
		choices: ["Flash cards","Fill in the blank","Add new card"]
	},
	{
		type: "input",
		name: "fact",
		message: "Input question",
		when: function(answer){
			return answer.action === "Add new card";
		}
	},
	{
		type: "input",
		name: "factpart",
		message: "part of the question to leave out",
		when: function(answer){
			return answer.action === "Add new card";
		},
		validate: function(factpart, fact){
			if(fact.fact.indexOf(factpart) === -1){
				return "fact is not contained within the statement";
			}

			return true
		}
	}
])
.then(function(answers){
	engine.uiHandler(answers);


});


