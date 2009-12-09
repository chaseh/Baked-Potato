function TextBox(x, y) {
	this.width = 1; this.height= 1;
	this.div = document.createElement("textarea");
	this.div.wrap = "hard";
	this.div.cols = this.width;
	this.div.rows = this.height;
	this.div.className = "note draggable";
	this.div.style.left = x + "px";
	this.div.style.top  = y + "px";

};

TextBox.prototype = {
	constructor: TextBox,
	getHTMLElement : function() {
		return this.div;	
	},
	focus : function() {
		this.div.focus();
	},
	addToDOM : function() {
		document.body.appendChild(this.div);
	},
	removeFromDOM : function() {
		document.body.removeChild(this.div);
	},
};

var TextBoxHTMLType = "textarea";