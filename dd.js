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
	try {
		var target = EventUtil.getTarget(event), 
			val = target.value, code = EventUtil.getCharCode(event);
		target.cols = 1 + min(target.textLength, charCodeIndexOf(val, 10));
		target.rows = 1 + countCharCode(val, 10);
	} catch (EX) {}
});


function gc(fc) {
	if(fc !== null && fc.textLength == 0) { 
	    document.body.removeChild(fc);
	    fc = null;
	}
}

var focused = null;

DragDrop.enable();       
DragDrop.addHandler("click", function(event) {
	gc(focused);
	var target = event.target, body = document.body;
    switch(target.tagName.toLowerCase()) {
    	case "textarea" :
    		focused = target;
    		break;
        case "body" :
        case "html" : // needed
        	var text = new TextBox(event.clientX, event.clientY);
			text.addToDOM();
			text.focus();
			focused = text.getHTMLElement();
         	break;  
     }
  });
  
var dbldragger = function(event) {
	var target = event.target;
    switch(target.tagName.toLowerCase()) {
    	case "textarea":
    	case "canvas":
          	target.style.left = (event.clientX - event.diffX) + "px"; 
          	target.style.top = (event.clientY - event.diffY) + "px";
          	break;
    }
}
    
DragDrop.addHandler("dbldragstart", dbldragger);
DragDrop.addHandler("dbldrag", dbldragger);
DragDrop.addHandler("dbldragend", dbldragger);



var varSq, sqVar, length;
var grad, oldX, oldY, curX, curY;
var startX, startY;
var draggerStart = function(event) {
	curX = event.clientX;
	curY = event.clientY;
	startX = curX; startY = curY;
	length = 0;
	varsq = 0, sqvar = 0;
}

var sign = function(val) {
	return (val < 0 ? -1 : (val > 0 ? 1 : 0));
}

var dragger = function(event) {
	if(curX != event.clientX || curY != event.clientY) {
		oldX = curX; oldY = curY;
		curX = event.clientX; curY = event.clientY;
		var diffX = curX - oldX, 
			diffY = curY - oldY;
		var rat1 = diffX / diffY,
			rat2 = diffY / diffX;
		var val = sign(rat1) * Math.min(Math.abs(rat1), Math.abs(rat2));
		varsq += val;
		sqvar += val * val;
		length++;
	}
}

var draggerEnd = function(event) {
	varsq /= length;
	varsq = varsq * varsq;
	sqvar /= length;
	var variance = sqvar - varsq;
	if(variance < .11) {
		alert("line!");
		var canvas = document.createElement("canvas"), 
			endX = event.clientX, endY = event.clientY,
			left = Math.min(startX, endX), top = Math.min(startY, endY),
			width= Math.abs(startX - endX),height=Math.abs(startY - endY);  
		canvas.style.left = (left - 5) + "px";
 		canvas.style.top  = (top  - 5)+ "px";
		canvas.width  = width + 10;
		canvas.height = height + 10;
		canvas.className = "draggable";
		
		document.body.appendChild(canvas);
		
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = "black";
		ctx.lineWidth = "2";
		ctx.beginPath();
		ctx.moveTo(startX - left - 5, startY - top - 5);
		ctx.lineTo(endX - left,  endY - top);
		ctx.stroke();
	} else {
		alert("not!");
	}
}

DragDrop.addHandler("dragstart", draggerStart);
DragDrop.addHandler("drag", dragger);
DragDrop.addHandler("dragend", draggerEnd);








/*var canvas = null, ctx = null, 
	minX = 100000, minY = 100000, 
	maxX = 0, maxY = 0;

var draggerStart = function(event) {
	minX = (minX > event.clientX ? event.clientX : minX);
	minY = (minY > event.clientY ? event.clientY : minY);
	maxX = (maxX < event.clientX ? event.clientX : maxX);
	maxY = (maxY < event.clientY ? event.clientY : maxY);
	canvas = document.createElement("canvas");
	canvas.style.left = event.clientX + "px";
 	canvas.style.top  = event.clientY + "px";
	canvas.width  = (maxX - minX) + 2;
	canvas.height = (maxY - minY) + 2;

	canvas.className = "draggable";
	document.body.appendChild(canvas);
	ctx = canvas.getContext('2d');
	ctx.fillStyle = "black";
	ctx.lineWidth = "2";
	ctx.beginPath();
	ctx.moveTo(event.clientX, event.clientY);
	ctx.stroke();
}

var dragger = function(event) {
	minX = (minX > event.clientX ? event.clientX : minX);
	minY = (minY > event.clientY ? event.clientY : minY);
	maxX = (maxX < event.clientX ? event.clientX : maxX);
	maxY = (maxY < event.clientY ? event.clientY : maxY);
	
	canvas.style.left = minX + "px";
	canvas.style.top  = minY + "px";
	canvas.width  = (maxX - minX) + 2;
	canvas.height = (maxY - minY) + 2;
	ctx.lineTo(event.clientX, event.clientY);
	ctx.stroke();
}

var draggerEnd = function(event) {
	minX = (minX > event.clientX ? event.clientX : minX);
	minY = (minY > event.clientY ? event.clientY : minY);
	maxX = (maxX < event.clientX ? event.clientX : maxX);
	maxY = (maxY < event.clientX ? event.clientY : maxY);
	canvas.style.left = minX + "px";
	canvas.style.top = minY + "px";
	canvas.style.width = maxX - minX + 2;
	canvas.style.height = maxY - minY + 2;
	ctx.lineTo(event.clientX, event.clientY);
	ctx.stroke();
	canvas = null;
	ctx = null;
}

DragDrop.addHandler("dragstart", draggerStart);
DragDrop.addHandler("drag", dragger);
DragDrop.addHandler("dragend", draggerEnd);
*/
