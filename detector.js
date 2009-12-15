(function() { //private scope so this code can `play-nice' with other packages
  var canvas, ctx, 
      elements = new Array(), 
      predictor = new Banditron(.25, 3, 4), accuracy,
      example = new FeatureFactory();

  var drawScreen = function() {
    CanvasUtil.clearCanvas(ctx, canvas);
    //draw the elements
    for(var i = 0, len = elements.length; i < len; i++) {
      var cur = elements[i];
      switch(cur.type) {
        case "line" :
          CanvasUtil.strokeLine(ctx, cur.startX, cur.startY, cur.endX, cur.endY);
          break;
        case "ellipse" :
          CanvasUtil.strokeEllipse(ctx, cur.left, cur.top, cur.width, cur.height);
          break;
      }
    }
  }
 
  DragDrop.enable();
  
  var draggerStart = function(event) {
    var target = event.target;
    try {
      predictor.update(accuracy);
    } catch (EX) { }
    switch(target.tagName.toLowerCase()) {
      case "canvas":
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'rgba(90, 90, 90, .9)';
        ctx.shadowColor = 'rgba(90, 90, 90, 0.7)';
        ctx.lineCap = "round";
        ctx.lineWidth = "4";
        example.addPoint(event.clientX, event.clientY);
        break;
      }
  }

  var dragger = function(event) {
    var target = event.target;
    switch(target.tagName.toLowerCase()) {
      case "canvas":
        example.addPoint(event.clientX, event.clientY);
        CanvasUtil.strokeLine(ctx, example.oldX, example.oldY, example.curX, example.curY);
        break;
    }
  }

  var draggerEnd = function(event) {
    var target = event.target;
    switch(target.tagName.toLowerCase()) {
      case "canvas":
        example.addPoint(event.clientX, event.clientY);
        CanvasUtil.strokeLine(ctx, example.oldX, example.oldY, example.curX, example.curY);
        var prediction = predictor.predict(example.getFeature());
        
        if(prediction == 0) { //guess that this is a line
          elements.push({type:"line", startX:example.coordsX[0], startY:example.coordsY[0], 
                                      endX:example.curX, endY:example.curY});
        } if(prediction == 1) { //guess this is an ellipse
          //find the min, and max of x and y
          //compute the width and height and add an ellipse to the elements
          //only works if assume that ellipses have a vertical dimension
          //and a horizontal dimension. E.g. this does not render rotated ellipses
          var x = MathUtil.min(example.coordsX), y = MathUtil.min(example.coordsY), 
              w = MathUtil.max(example.coordsX) - x, h = MathUtil.max(example.coordsY) - y;
          elements.push({type:"ellipse", left:x, top:y, width:w, height:h});               
        } else { //guess that this is nothing -- fail case
        
        }
        accuracy = true;
        drawScreen();
        break;
    }
  }
 
  var click = function(event) { 
    //need to use special click handler so events don't fire during drag
    var target = event.target;
    switch(target.id) {
      case "error" :
        target.firstChild.data = "YES";
        setTimeout(function() { target.firstChild.data = "Screwed up?"; }, 250);
        accuracy = false;
        break;
      case "clear" : 
        elements = new Array();
        drawScreen();
        break;
    }
    
  }

  DragDrop.addHandler("dragstart", draggerStart);
  DragDrop.addHandler("drag", dragger);
  DragDrop.addHandler("dragend", draggerEnd);
  DragDrop.addHandler("click", click);
})();
