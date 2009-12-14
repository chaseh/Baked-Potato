(function() { //private scope so this code can `play-nice' with other packages
	var focused = null, textBoxes = new Array(),
		coordsX, coordsY,
		varSq, sqVar, length,
		oldX, oldY, curX, curY;

	EventUtil.addHandler(document, "keyup", function(event) {
		event = EventUtil.getEvent(event);
		var target = EventUtil.getTarget(event);
		focused.process(EventUtil.getCharCode(event), event.ctrlKey || event.metaKey);
	});

	DragDrop.enable();       
	DragDrop.addHandler("click", function(event) {
		var target = event.target, body = document.body;
		if(focused !== null && focused.isEmpty()) {
			focused.cleanUp();
		    focused = null;
		}
	    switch(target.tagName.toLowerCase()) {
	    	case "div" :
	    		focused = textBoxes[target.id];
	   	 		break;
	        case "body" :
	        case "html" : // needed
	        	var text = new TextBox(event.clientX, event.clientY);
				text.addToDOM();
				text.focus();
				focused = text;
				textBoxes[text.getHash()] = text;
	         	break;  
	     }
	  });

	var dblDraggerStart = function(event) {
		var target = event.target;
	    switch(target.tagName.toLowerCase()) {
    		case "div":
    		case "canvas":
    			var textBox = textBoxes[target.id];
    			textBox.setDragCursor();
    			textBox.setLocation(event.clientX - event.diffX, 
        	  						event.clientY - event.diffY);
	          	break;
	    }
	}

	var draggerStart = function(event) {
		var target = event.target;
	    switch(target.tagName.toLowerCase()) {
	    	case "body":
    		case "html":
				coordsX = new Array(); coordsY = new Array();
				curX = event.clientX; curY = event.clientY;
				coordsX.push(curX); coordsY.push(curY);
				length = 0;
				varsq = 0, sqvar = 0;
				minX = 100000, minY = 100000, 
				maxX = 0, maxY = 0;
    			break;
	    }
	}


	var sign = function(val) {
		return (val < 0 ? -1 : (val > 0 ? 1 : 0));
	}

	var dblDragger = function(event) {
		var target = event.target;
	    switch(target.tagName.toLowerCase()) {
    		case "div":
    		case "canvas":
    			var textBox = textBoxes[target.id];
    			textBox.setLocation(event.clientX - event.diffX, 
        	  						event.clientY - event.diffY);
        	  	break;
    	}
	}

	var dragger = function(event) {
		var target = event.target;
	    switch(target.tagName.toLowerCase()) {
	    	case "body":
	    	case "html":			
				if(curX != event.clientX || curY != event.clientY) {
					oldX = curX; oldY = curY;
					curX = event.clientX; curY = event.clientY;
					coordsX.push(curX); coordsY.push(curY);
					var diffX = curX - oldX, 
						diffY = curY - oldY;
					var rat1 = diffX / diffY,
						rat2 = diffY / diffX;
					var val = sign(rat1) * Math.min(Math.abs(rat1), Math.abs(rat2));
					varsq += val;
					sqvar += val * val;
					length++;
				}	
				break;
    	}
	}

	var dblDraggerEnd = function(event) {
		var target = event.target;
	    switch(target.tagName.toLowerCase()) {
    		case "div":
    		case "canvas":
    			var textBox = textBoxes[target.id];
    			textBox.setDefaultCursor();
    			textBox.setLocation(event.clientX - event.diffX, 
        	  						event.clientY - event.diffY);
        	  	break;
    	}
	}

	var draggerEnd = function(event) {
		var target = event.target;
	    switch(target.tagName.toLowerCase()) {
	    	case "body":
   		 	case "html":
				coordsX.push(curX); coordsY.push(curY);
				varsq /= length;
				varsq = varsq * varsq;
				sqvar /= length;
				var variance = sqvar - varsq;
				if(variance < .11) {
					alert("LINE!");
				} else {
					alert("NOT A LINE!");
				}
				break;
    	}
	}
	
	DragDrop.addHandler("dragstart", draggerStart);
	DragDrop.addHandler("dbldragstart", dblDraggerStart);
	DragDrop.addHandler("drag", dragger);
	DragDrop.addHandler("dbldrag", dblDragger);
	DragDrop.addHandler("dragend", draggerEnd);
	DragDrop.addHandler("dbldragend", dblDraggerEnd);
})();
