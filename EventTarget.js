function EventTarget() {
    this.handlers = {};    
}

EventTarget.prototype = {
    constructor: EventTarget,

    addHandler: function(type, handler){
        if (typeof this.handlers[type] == "undefined"){
            this.handlers[type] = [];
        }
        this.handlers[type].push(handler);
    },
    
    fire: function(event) {
      var handlers = this.handlers[event.type];
      for (var i = handlers.length - 1; i >= 0; i--){
        handlers[i](event);
      }           
    },

    removeHandler: function(type, handler){
      var handlers = this.handlers[type];
      for (var i=0, len=handlers.length; i < len; i++){
        if (handlers[i] === handler){
          break;
        }
      }
      handlers.splice(i, 1);           
    }
};