var DragDrop = function() {
  var dragdrop = new EventTarget(),
	dragging = null, timeout = null,
	startX = 0, startY = 0,
	diffX = 0, diffY = 0, 
	dragDelay = null, //if mouse is down for a second without an `up' then fire dragstart
	clickCount = 0, hasDragged = false; 
  
  function fireDragstart(x, y) {
	dragdrop.fire({type: (clickCount == 0 ? "dragstart" : "dbldragstart"), 
		 target: dragging, 
		 clientX: x, 
		 clientY: y, 
		 diffX: diffX, 
		 diffY: diffY});
     hasDragged = true;
  };
  
  function handleDown(event) {
	event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event),
	    x = event.clientX, y = event.clientY;
	if (target.className.indexOf("draggable") > -1) {
	  if (timeout !== null) { 
		clearTimeout(timeout); 
		timeout = null;
		clickCount = 1;
	  } else {
    	dragging = target;             
    	startX = x;
    	startY = y;
    	diffX = startX - target.offsetLeft;
    	diffY = startY - target.offsetTop;
		hasDragged = false;
    	clickCount = 0;
      }
	  dragDelay = setTimeout(function() {fireDragstart(x, y); dragDelay = null; }, 1000);
    }
  };
  
  function handleMove(event) {
	if (dragging !== null) {          
	  event = EventUtil.getEvent(event);
  	  var x = event.clientX, y = event.clientY;
	  if(hasDragged === true) {
	    dragdrop.fire(
	       {type: (clickCount == 0 ? "drag" : "dbldrag"), 
		    target: dragging, 
		    clientX: x, 
		    clientY: y, 
		    diffX: diffX, 
		    diffY: diffY});
	  } else if (startX > x + 2 || startX < x - 2 
	          || startY > y + 2 || startY < y - 2) {
	    if(dragDelay !== null) {
	       clearTimeout(dragDelay);
	       dragDelay = null;
	    }
	    fireDragstart(x, y);
	  } 
	}
  };

  function handleUp(event) {
	event = EventUtil.getEvent(event);
	if(dragging !== null) {
	  if(hasDragged === true) { 
	    dragdrop.fire(
	       {type: (clickCount == 0 ? "dragend" : "dbldragend"), 
	        target: dragging, 
	        clientX: event.clientX, 
	        clientY: event.clientY, 
	        diffX: diffX, 
            diffY: diffY});
	    timeout = null;
	    dragging = null;
	  } else { 
		timeout = setTimeout(function() { timeout = null; dragging = null;}, 250); 
	  }          
	} else if(dragDelay !== null) {
        clearTimeout(dragDelay);
	    dragDelay = null;
	}
  };

  function handleClick(event) {      
	if(hasDragged === false) { dragdrop.fire(event); }	  
  };
    
  //public interface
  dragdrop.enable = function() {
	  EventUtil.addHandler(document, "click",     handleClick);
	  EventUtil.addHandler(document, "dblclick",  handleClick);
	  EventUtil.addHandler(document, "mousedown", handleDown);
	  EventUtil.addHandler(document, "mousemove", handleMove);
	  EventUtil.addHandler(document, "mouseup",   handleUp);
  };
	
  dragdrop.disable = function() {
	  EventUtil.removeHandler(document, "click",     handleClick);
	  EventUtil.removeHandler(document, "dblclick",  handleClick);
	  EventUtil.removeHandler(document, "mousedown", handleDown);
	  EventUtil.removeHandler(document, "mousemove", handleMove);
	  EventUtil.removeHandler(document, "mouseup",   handleUp);
  }; 
  
  return dragdrop;
}();