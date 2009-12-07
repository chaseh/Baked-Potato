   
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

	EventUtil.addHandler(document, "keydown", function(event) {
	  event = EventUtil.getEvent(event);
	  var target = EventUtil.getTarget(event), 
	    val = target.value, code = EventUtil.getCharCode(event);
	  if(val.length == 0 && code == 8) { //pressed backspace with no characters
	    document.body.removeChild(target);
	    target = null;
	  } 
	});
	
	EventUtil.addHandler(document, "keyup", function(event) {
	  event = EventUtil.getEvent(event);
	  var target = EventUtil.getTarget(event), 
	    val = target.value, code = EventUtil.getCharCode(event);
	  target.cols = 1 + Math.round(.8 * min(val.length, charCodeIndexOf(val, 10)));
	  target.rows = 1 + countCharCode(val, 10);
/*	    if(val.length - charCodeLastIndexOf(val, 10) > target.cols) {
	      var space = charCodeLastIndexOf(val, 32);
	      if((val.length - space) < target.cols) {
	        alert(code);
	        val = val.slice(0, space).concat("<br />", val.slice(space + 1, val.length));
	      } else {
	        val.concat("<br />");
	      }
	    }*/
	});
	
    DragDrop.enable();       
    
    DragDrop.addHandler("qkclick", function(event) {
      var target = event.target;
      switch(target.tagName.toLowerCase()) {
       case "textarea" :
            var body = document.body;
         	body.removeChild(target); body.appendChild(target);
         	target.focus();
         	break;
        case "body" :
			var div = document.createElement("textarea");
			div.type = "html";
            div.cols ="1";
            div.rows ="1";
         	div.className = "box draggable";
         	div.style.left = event.clientX + "px";
         	div.style.top = event.clientY + "px";
         	document.body.appendChild(div);
         	div.focus();
         	break;
  
     }
  });
  
    DragDrop.addHandler("qkdblclick", function(event) {
      var target = event.target;
      switch(target.tagName.toLowerCase()) {
       case "textarea" :
      		document.body.removeChild(event.target);
      		target = null;
         	break;
     }
    });

    var dbldragger = function(event) {
      var target = event.target, body = document.body;
      switch(target.tagName.toLowerCase()) {
        case "textarea" :
          target.style.left = (event.clientX - event.diffX) + "px"; 
          target.style.top = (event.clientY - event.diffY) + "px";
          break;
      }
    }
    
    DragDrop.addHandler("dbldragstart", dbldragger);
    DragDrop.addHandler("dbldrag", dbldragger);
    DragDrop.addHandler("dbldragend", dbldragger);
