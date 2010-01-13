function min(val1, val2) {
	return val2 > -1 ? (val1 > val2 ? val2 : val1) : val1;
}
	
function charCodeIndexOf(val, code) {
	for(var i = 0, len = val.length; i < len; i++) {
		if(val.charCodeAt(i) == code) {
			return i;
	    }
	}
	return -1;
}

function lastIndexOfReturn(val) {
	for(var i = val.length - 1; i >= 0; i--) {
		if(val.charAt(i) == "\r" || val.charAt(i) == "\n") {
			return i;
	    }
	}
	return i;
}

function lastIndexOfSpace(val) {
	for(var i = val.length - 1; i >= 0; i--) {
		if(val.charAt(i) == " ") {
			return i;
	    }
	}
	return i;
}

function countReturns(val) {
	ans = 0;
	for(var i = 0, len = val.length; i < len; i++) {
	    if(val.charCodeAt(i) == 10 || val.charCodeAt(i) == 13) {
	        ans++;
	    }
	}
	return ans;
}

function getElementPixelWidth(val) {
	var span = document.createElement("span");
	span.textContent = "." + val.value + ".";
	span.className = val.className;
	span.style.border = "0px solid black";
	span.style.padding= "0cm 0cm 0cm 0cm";
	span.style.margin = "0cm 0cm 0cm 0cm";
	span.style.visibility="hidden";
	document.body.appendChild(span);
	var width = parseInt(span.offsetWidth); 
	document.body.removeChild(span);
	span = null;
	return width;
}

function getStringPixelWidth(val) {
	var span = document.createElement("span");
	span.textContent = val;
	span.style.visibility="hidden";
	document.body.appendChild(span);
	var width  = parseInt(span.offsetWidth);
	document.body.removeChild(span);
	span = null;
	return width;
}

function TextBox(x, y) {
//	this.width = 0; this.height = 0;
	this.div = document.createElement("div");
	this.div.className = "note draggable";
	this.div.id = new Date().getTime();
	this.setLocation(x,y);
	//this.setDimensions(this.width,this.height);
	this.setDefaultCursor();
	this.div.appendChild(document.createTextNode(''));
};

TextBox.prototype = {
	constructor: TextBox,
	isEmpty : function() {
		return this.div.firstChild.value == '';
	},
	getHTMLElement : function() {
		return this.div;	
	},
	focus : function() {
		this.div.focus();
	},
	addToDOM : function() {
		document.body.appendChild(this.div);
	},
	cleanUp : function () {
		try {
			document.body.removeChild(this.div);
			this.div = null;
		} catch(EX) {}
	},
	getHash : function () {
		return this.div.id;
	}, 
	process : function(code, ctrl) { //deals with the wrapping of text as you type
		switch (code) {
			case 10:
			case 13:
				if(this.div.children.length <=1) {
					this.div.style.width = getStringPixelWidth(this.div.firstChild.nodeValue);
				}		
				this.div.appendChild(document.createElement("br"));
				this.div.appendChild(document.createTextNode(''));
				break;
			case 8:
			case 127:
				this.div.lastChild.replaceData(this.div.lastChild.length - 1, 1,'');
				break;
			default:
				this.div.lastChild.appendData(String.fromCharCode(code));
				break;
		}
		//var elmn = this.div;
		//this.rows = 1 + countReturns(elmn.value);
/*		if(code == 13 || code == 10) {
			if(this.rows == 2) {
				this.width = getElementPixelWidth(elmn);
				elmn.cols = Math.ceil(this.width / this.avgCharWidth);
			}		
			elmn.rows = this.rows;
		} else if(this.rows == 1 && elmn.value.length >= elmn.cols - 1) {
			elmn.cols = (elmn.value.length + 5);
		} else if(this.rows > 1) {
			var w = getStringPixelWidth(
				elmn.value.substring(lastIndexOfReturn(elmn.value)));
			if(w >= this.width) {
				var space = lastIndexOfSpace(elmn.value);
				w = getStringPixelWidth(elmn.value.substring(space));
				if(w >= this.width) {
					elmn.value = elmn.value.substring(0, elmn.value.length - 2) 
						+ "\r" + elmn.value.charAt(elmn.value.length - 1);
				} else {
					elmn.value = elmn.value.substring(0, space) 
						+ "\r" + elmn.value.substring(space + 1);
				}
				elmn.rows = ++this.rows;
			}
		}
		if(code == 66 && ctrl) {
        	if(elmn.setSelectionRange) {
        		if(elmn.selectionStart != elmn.selectionEnd) {
					elmn.value = elmn.value.substring(0,elmn.selectionStart) 
							   + "&lt;strong&gt;" + elmn.value.substring(elmn.selectionStart, elmn.selectionEnd)
							   + "&lt;/strong&gt;"+ elmn.value.substring(elmn.selectionEnd);
        		} 
        	} else {
		        var selectedText = document.selection.createRange().text;
	        	if (selectedText != "") {
    	    	    var newText = "&lt;strong&gt;" + selectedText + "&lt;/strong&gt;";
        		    document.selection.createRange().text = newText;
        		}
        	}
		}*/
	}, setLocation: function(x, y) {
			this.div.style.left = x + "px";
			this.div.style.top  = y + "px";	
	}, setDimensions: function(x, y) {
			this.div.style.width = x + "px";
			this.div.style.height  = y + "px";	
	}, setDragCursor: function() {
		this.div.style.cursor = "default";
	}, 
	setDefaultCursor: function() {
		this.div.style.cursor = "text";	
	},
};
