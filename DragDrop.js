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
                dragdrop.fire({type:eventName[clickCount], target: dragging, //drag
                clientX: event.clientX, clientY: event.clientY, diffX: diffX, diffY: diffY});
              } else if (startX != event.clientX || startY != event.clientY) { 
                  //if the (x,y) coords have changed since mousedown then this is a drag start
                dragdrop.fire({type: eventName[2 + clickCount], target: dragging,
                clientX: event.clientX, clientY: event.clientY, diffX: diffX, diffY: diffY});
                hasDragged = true;
              } 
            }
            break;

          case "mousedown" : //mouse down
            if (target.className.indexOf("draggable") > -1) {
              if (timeout !== null) { 
                // if a timer is waiting to be executed then double click
                clearTimeout(timeout); 
                timeout = null;
                clickCount = 1;
              } else {
              	dragging = target;             
              	startX = event.clientX;
              	startY = event.clientY;
              	diffX = startX - target.offsetLeft;
              	diffY = startY - target.offsetTop;
              	hasDragged = false;
              	clickCount = 0;
              }
            }
            break;
            
          case "mouseup": //mouse up
            if(dragging !== null) {
              if(hasDragged === true) { // was this a drag? if so fire a dragend
                dragdrop.fire({type: eventName[4 + clickCount], target: target, //dragend
                clientX: event.clientX, clientY: event.clientY, diffX: diffX, diffY: diffY}); 
                timeout = null;
                dragging = null;
              } else { 
                  //else it must have been a click. so fire a click
                timeout = 
                    setTimeout(function() { timeout = null; dragging = null;}, 250); 
                    //quarter of a second to detect single vs. dbl click
              } 
            }
            break;
            
          case "click":
            if(hasDragged === false) {
  	      	  dragdrop.fire({type: eventName[6], target: target, //click
	            clientX: event.clientX, clientY: event.clientY});
            }
            break;
            
          case "dblclick":
            if (hasDragged === false) {
              dragdrop.fire({type: eventName[7], target: target, //quickdblclick
  	            clientX: event.clientX, clientY: event.clientY});
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