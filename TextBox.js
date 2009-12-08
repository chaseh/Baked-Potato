function TextBox(x, y) {
	this.div = document.createElement("textarea");
	this.div.wrap = "hard";
	this.div.cols ="1";
	this.div.rows ="1";
	this.div.className = "note draggable";
	this.div.style.left = x + "px";
	this.div.style.top = y + "px";
};

TextBox.prototype = {
	constructor: TextBox,
	HTMLType : "textarea",
	getHTMLElement : function() {
		return this.div;	
	},
	focus : function() {
		this.div.focus();
	},
	addToDOM : function() {
		document.body.appendChild(this.div);
	},
	isNot : function(target) {
		return div !== target;	
	}
};

var TextBoxHTMLType = "textarea";