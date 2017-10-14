var BasicCard = function(inputFront, inputBack){
	this.front = inputFront.replace(inputBack, ""),
	this.back = inputBack
}

module.exports = BasicCard;