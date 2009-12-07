/*
  Lazy-loading cross-browser EventUtil. This function pays a performance hit when first 
  calling its methods, but gets a speed up during subsiquent calls.
 */
var EventUtil = {

    addHandler: function(element, type, handler) {
        if (element.addEventListener) {
        	addHandler = function(element, type, handler) {
            	element.addEventListener(type, handler, false);
            }
        } else if (element.attachEvent) {
        	addHandler = function(element, type, handler) {
	            element.attachEvent("on" + type, handler);
	        }
        } else {
        	addHandler = function(element, type, handler) {
	            element["on" + type] = handler;
    	    }
    	}
    	return addHandler(element, type, handler);
    },
    
    getButton: function(event) {
        if (document.implementation.hasFeature("MouseEvents", "2.0")) {
        	getButton = function(event) {
	            return event.button;
	        }
        } else {
        	getButton = function(event) {
	            switch(event.button) {
    	            case 0:
    	            case 1:
        	        case 3:
            	    case 5:
                	case 7:
                    	return 0;
                	case 2:
                	case 6:
                    	return 2;
                	case 4: return 1;
                }
            }
        }
        return getButton(event);
    },
    
    getCharCode: function(event) {
        if (typeof event.keyCode == "number") {
        	getCharCode = function(event) {
	            return event.keyCode;
	        }
        } else {
        	getCharCode = function(event) {
	            return event.charCode;
	        }
        }
        return getCharCode(event);
    },
    
    getClipboardText: function(event) {
        var clipboardData = (event.clipboardData || window.clipboardData);
        if(event.clipboardData) {
        	getClipboardText = function(event) {
        		return event.clipboardData.getData("text");
        	}
        } else {
        	getClipboardText = function(event) {
        		return window.clipboardData.getData("text");
        	}
        } 
        getClipboardText(event);
    },
    
    getEvent: function(event) {
    	if(event) {
    		getEvent = function(event) {
    			return event;
    		}
    	} else {
    		getEvent = function(event) {
    			return window.event;
    		}
    	}
        return getEvent(event);
    },
    
    getRelatedTarget: function(event) {
        if (event.relatedTarget){
        	getRelatedTarget = function(event) {
        		return event.relatedTarget;
        	}
        } else if (event.toElement) {
        	getRelatedTarget = function(event) {
	            return event.toElement;
	        }
        } else if (event.fromElement) {
        	getRelatedTarget = function(event) {
	            return event.fromElement;
	        }
        } else {
        	getRelatedTarget = function(event) {
	            return null;
	        }
        }
    	return getRelatedTarget(event);
    },
    
    getTarget: function(event) {
    	if(event.target) {
    		getTarget = function(event) {
    			return event.target;
    		}
    	} else if(event.srcElement) {
    		getTarget = function(event) {
    			return event.srcElement;
    		}
    	} else {
    		getTarget = function(event) {
    			return false;
    		}
    	}
        return getTarget(event);
    },
    
    getWheelDelta: function(event) {
        if (event.wheelDelta){
        	getWheelData = function(event) { 
	            return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
        	}
        } else {
        	getWheelData = function(event) {
	            return -event.detail * 40;
	        }
        }
        return getWheelData(event);
    },
    
    preventDefault: function(event) {
        if (event.preventDefault){
        	preventDefault = function(event) {
	            event.preventDefault();
	        }
        } else {
        	preventDefault = function(event) {
	            event.returnValue = false;
	        }
        }
        preventDefault(event);
    },

    removeHandler: function(element, type, handler) {
        if (element.removeEventListener) {
        	removeHandler = function(element, type, handler) {
	            element.removeEventListener(type, handler, false);
	        }
        } else if (element.detachEvent){
        	removeHandler = function(element, type, handler) {
	            element.detachEvent("on" + type, handler);
	        }
        } else {
        	removeHandler = function(element, type, handler) {
	            element["on" + type] = null;
	        }
        }
        removeHandler(element, type, handler);
    },
    
    setClipboardText: function(event, value) {
        if (event.clipboardData){
			setClipboardText = function(event, value) {
            	event.clipboardData.setData("text/plain", value);
            }
        } else if (window.clipboardData){
			setClipboardText = function(event, value) {
            	window.clipboardData.setData("text", value);
           	}
        }
        setClipboardText(event, value);
    },
    
    stopPropagation: function(event) {
        if (event.stopPropagation){
        	stopPropagation = function(event) {
	            event.stopPropagation();
	        }
        } else {
        	stopPropagation = function(event) {
	            event.cancelBubble = true;
	        }
        }
        stopPropagation(event);
    }

};