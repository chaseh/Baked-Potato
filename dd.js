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

function charCodeLastIndexOf(val, code) {
	for(var i = val.length - 1; i >= 0; i--) {
	    if(val.charCodeAt(i) == code) {
	    	return i;
	    }
	}
	return val.length;
}
	
function countCharCode(val, code) {
	ans = 0;
	for(var i = 0, len = val.length; i < len; i++) {
	    if(val.charCodeAt(i) == code) {
	        ans++;
	    }
	}
	return ans;
}

EventUtil.addHandler(document, "keyup", function(event) {
	event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event), 
		val = target.value, code = EventUtil.getCharCode(event);
	target.cols = 1 + min(val.length, charCodeIndexOf(val, 10));
	target.rows = 1 + countCharCode(val, 10);
});

//function to garbage collect the empty text areas
//the function observes that if we check for garbage after every click, 
//at most one empty text area can exist
//as a result we can only check if the last if the text area is empty
//and if so delete it   	
function gc(target) {
	try {
		var tas = document.getElementsByTagName("textarea"), pos = tas.length - 1;
		if(tas[pos].value.length == 0 && tas[pos] !== target) { 
	    	document.body.removeChild(tas[pos]);
	    	tas[pos] = null;    
		}
	} catch (ex) {} //fails if their are no text area's
}

//var focused = null; //the DOMobject that currently has focus
DragDrop.enable();       
    
DragDrop.addHandler("click", function(event) {
	var target = event.target, body = document.body;
	gc(target);
    switch(target.tagName.toLowerCase()) {
    /*    case "textarea" :
        	alert("here");
       		if(focused.isNot(target)) {
	         	body.removeChild(target); 
	         	body.appendChild(target);
    	     	target.focus();
    	     	focused = target;
    	    }
         	break;*/
        case "body" :
        case "html" : // needed
        	var text = new TextBox(event.clientX, event.clientY);
			//focused = text;
			text.addToDOM();
			text.focus();
         	break;  
     }
  });
  
var dbldragger = function(event) {
	var target = event.target;
    switch(target.tagName.toLowerCase()) {
    	case "textarea":
    		//focused = target;
          	target.style.left = (event.clientX - event.diffX) + "px"; 
          	target.style.top = (event.clientY - event.diffY) + "px";
          	break;
    }
}
    
DragDrop.addHandler("dbldragstart", dbldragger);
DragDrop.addHandler("dbldrag", dbldragger);
DragDrop.addHandler("dbldragend", dbldragger);
