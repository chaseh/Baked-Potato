    var DragDrop = function() {
      var dragdrop = new EventTarget(),
        dragging = null, timeout = null,
        startX = 0, startY = 0,
        diffX = 0, diffY = 0,
        clickCount = 0, hasDragged = false, 
        eventName = [
            "drag", "dbldrag", 
            "dragstart", "dbldragstart", 
            "dragend", "dbldragend", 
            "qkclick", "qkdblclick", 
            "click", "dblclick"]; //names of different events
      
      function handleEvent(event) {
      
        //get event and target
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
      
        //determine the type of event
        switch(event.type) {
          case "mousemove": //mouse moving
            if (dragging !== null) {                
              if(hasDragged === true) { //are we in the middle of a drag? if so fire a drag
                dragdrop.fire({type:eventName[clickCount], //drag
                	target: dragging, clientX: event.clientX, clientY: event.clientY, diffX: diffX, diffY: diffY});
              //if this is the start of a drag fire a `dragstart'
              } else if (hasDragged === false && (startX != event.clientX || startY != event.clientY)) { //if the (x,y) coords have changed since mousedown then this is a drag
                dragdrop.fire({type: eventName[2 + clickCount], //dragstart
                	target: dragging, clientX: startX, clientY: startY, diffX: diffX, diffY: diffY});
                hasDragged = true;
              } 
            }
            break;

          case "mousedown" : //mouse down
            if (target.className.indexOf("draggable") > -1) {
              if (timeout !== null) { //check if a previous click is waiting to be executed (if so then this is a double click)
                clearTimeout(timeout); 
                timeout = null;
                clickCount = 1;
              } else {
                clickCount = 0;
              }
              dragging = target;             
              startX = event.clientX;
              startY = event.clientY;
              diffX = startX - target.offsetLeft;
              diffY = startY - target.offsetTop;
              hasDragged = false;
            }
            break;
            
          case "mouseup": //mouse up
            if(dragging !== null) {
              if(hasDragged === true) { // was this a drag? if so fire a dragend
                dragdrop.fire({type: eventName[4 + clickCount], //dragend
              	  target: target, clientX: event.clientX, clientY: event.clientY, diffX: diffX, diffY: diffY});
                timeout = null;
                dragging = null;
              } else if(hasDragged === false && (startX == event.clientX && startY == event.clientY)) { //else it must have been a click. so fire a click
                timeout = setTimeout(function() {
//This is where we would add a `slower' click event that only output an event fo single vs dbl clicks -- not both
//                  dragdrop.fire({type: eventName[8 + clickCount], //click
//                    target: dragging, clientX: event.clientX, clientY: event.clientY, diffX: diffX, diffY: diffY});
                  timeout = null;
                  dragging = null;}, 200);//quarter of a second to detect single vs. dbl click
              } else {
                timeout = null;
                dragging = null;
              }
            }
            break;
            
          case "click": //quick click
            if(dragging !== null) {
	          	dragdrop.fire({type: eventName[6], //quickclick
    	          target: dragging, clientX: event.clientX, clientY: event.clientY, diffX: diffX, diffY: diffY});
    	    }
            break;
            
          case "dblclick":
            if(dragging !== null) {
	          	dragdrop.fire({type: eventName[7], //quickdbldclick
    	          target: dragging, clientX: event.clientX, clientY: event.clientY, diffX: diffX, diffY: diffY});
    	    }
    	    break;

        }
      };
      
      //public interface
      dragdrop.enable = function() {
          EventUtil.addHandler(document, "click",     handleEvent);
          EventUtil.addHandler(document, "dblclick",  handleEvent);
          EventUtil.addHandler(document, "mousedown", handleEvent);
          EventUtil.addHandler(document, "mousemove", handleEvent);
          EventUtil.addHandler(document, "mouseup",   handleEvent);
      };
        
      dragdrop.disable = function() {
          EventUtil.removeHandler(document, "click", handleEvent);
          EventUtil.removeHandler(document, "dblclick", handleEvent);
          EventUtil.removeHandler(document, "mousedown", handleEvent);
          EventUtil.removeHandler(document, "mousemove", handleEvent);
          EventUtil.removeHandler(document, "mouseup", handleEvent);
      };
      
      return dragdrop;
    }();