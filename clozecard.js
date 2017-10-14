var ClozeCard = function(inputText, inputCloze){
	
	this.cloze = inputCloze,
	this.partial = inputText.replace(inputCloze, "_________"),
	this.fullText = inputText
}

module.exports = ClozeCard;