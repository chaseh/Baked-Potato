(function() { //private scope so this code can `play-nice' with other packages
  var coordsX, coordsY, 
      varSq, sqVar,
      oldX, oldY, curX, curY,
      startTime,
      canvas, ctx, 
      elements = new Array(), 
      predictor = new Banditron(.25, 3, 3), accuracy;
  var sign = function(val) {
    return (val < 0 ? -1 : (val > 0 ? 1 : 0));
  }
 
  DragDrop.enable();
  
  var draggerStart = function(event) {
    var target = event.target;
    try {
      predictor.update(accuracy);
      //alert("HERE");
    } catch (EX) { }
    switch(target.tagName.toLowerCase()) {
      case "canvas":
        startTime = new Date().getTime();
        coordsX = new Array(); coordsY = new Array();
        curX = event.clientX; curY = event.clientY;
        coordsX.push(curX); coordsY.push(curY);
        varsq = 0, sqvar = 0;
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'rgba(90, 90, 90, .9)';
        ctx.shadowColor = 'rgba(90, 90, 90, 0.7)';
        ctx.lineCap = "round";
        ctx.lineWidth = "4";
        break;
      }
  }

  var dragger = function(event) {
    var target = event.target;
    switch(target.tagName.toLowerCase()) {
      case "canvas":
        oldX = curX; oldY = curY;
        curX = event.clientX; curY = event.clientY;
        coordsX.push(curX); coordsY.push(curY);
        var diffX = curX - oldX,
            diffY = curY - oldY;
        diffX = (Math.abs(diffX) < 1 ? (diffX < 0 ? -1 : 1): diffX); //purturb slightly for stability
        var val = diffY / diffX;
        
        varsq += val;
        sqvar += val * val;
        CanvasUtil.strokeLine(ctx, oldX, oldY, curX, curY);
        break;
    }
  }

  var draggerEnd = function(event) {
    var target = event.target;
    switch(target.tagName.toLowerCase()) {
      case "canvas":
        oldX = curX; oldY = curY;
        curX = event.clientX; curY = event.clientY;
        coordsX.push(curX); coordsY.push(curY);
        CanvasUtil.strokeLine(ctx, oldX, oldY, curX, curY);
        varsq /= coordsX.length; varsq = varsq * varsq;
        sqvar /= coordsX.length;
        var prediction = predictor.predict(
            [sqvar - varsq, //get the feature and predict using the learning Algorithm
             new Date().getTime() - startTime, 
             coordsX.length]);

        CanvasUtil.clearCanvas(ctx, canvas);
        
        if(prediction == 0) { //guess that this is a line
          elements.push({type:"line", startX:coordsX[0], startY:coordsY[0], 
                                      endX:curX, endY:curY});
        } if(prediction == 1) { //guess this is an ellipse
          //find the min, and max of x and y
          //compute the width and height and add an ellipse to the elements
          //only works if assume that ellipses have a vertical dimension
          //and a horizontal dimension. E.g. this does not render rotated ellipses
          var x = MathUtil.min(coordsX), y = MathUtil.min(coordsY), 
              w = MathUtil.max(coordsX) - x, h = MathUtil.max(coordsY) - y;
          elements.push({type:"ellipse", left:x, top:y, width:w, height:h});               
        } else { //guess that this is nothign -- fail case
        }
        accuracy = true;
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
        break;
    }
  }
 
 
var click = function(event) { 
  //need to use special click handler so events don't fire during drag
  var target = event.target;
  switch(target.id) {
    case "error" :
      accuracy = false;
      break;
    case "clear" : 
      elements = new Array();
      CanvasUtil.clearCanvas(ctx, canvas);
      break;
  }
}

  DragDrop.addHandler("dragstart", draggerStart);
  DragDrop.addHandler("drag", dragger);
  DragDrop.addHandler("dragend", draggerEnd);
  DragDrop.addHandler("click", click);
})();
