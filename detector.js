(function() { //private scope so this code can `play-nice' with other packages
  var coordsX, coordsY, 
      varSq, sqVar,
      oldX, oldY, curX, curY,
      startTime,
      canvas, ctx, 
      elements = new Array(), 
      predictor=[0,0,0], 
      example = [0, 0, 0];

  var sign = function(val) {
    return (val < 0 ? -1 : (val > 0 ? 1 : 0));
  }
 
  DragDrop.enable();
  
  var draggerStart = function(event) {
    var target = event.target;
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
        var rat1 = diffX / diffY,
            rat2 = diffY / diffX;
        var val = sign(rat1) * Math.min(Math.abs(rat1), Math.abs(rat2));
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
        example[0] = sqvar - varsq;
        example[1] = new Date().getTime() - startTime;
        example[2] = coordsX.length;
        CanvasUtil.clearCanvas(ctx, canvas);
        
        var ans = 0;
        for(var i = 0, len = predictor.length; i < len; i++) {
          ans += predictor[i] * example[i];
        }
        
        if(ans > 0) { //guess that this is a line
          elements.push({type:"line", startX:coordsX[0], startY:coordsY[0], 
                                      endX:curX, endY:curY});
        } else { //guess that this is an ellipse
          //find the min, and max of x and y
          //compute the width and height and add an ellipse to the elements
          //only works if assume that ellipses have a vertical dimension
          //and a horizontal dimension. E.g. this does not render rotated ellipses
          var x = MathUtil.min(coordsX), y = MathUtil.min(coordsY), 
              w = MathUtil.max(coordsX) - x, h = MathUtil.max(coordsY) - y;
          elements.push({type:"ellipse", left:x, top:y, width:w, height:h});               
        }
        
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
      var ans = 0;
      for(var i = 0, len = predictor.length; i < len; i++) {
        ans += predictor[i] * example[i];
      }
      var sgn = ans > 0 ? -1 : 1;
      predictor = MathUtil.mapReduce(predictor, 
        function(val, i) { return val + sgn * example[i];}, null);
        //update the solution
        alert(MathUtil.mapReduce(predictor, null, function(val) {
          var ans = "";
          for(var i = 0, len = val.length; i < len; i++) {
            ans += val[i] + " ";
          }
          return ans;
        }));
        
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
