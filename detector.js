(function() { //private scope so this code can `play-nice' with other packages
  var coordsX, coordsY, 
      varSq, sqVar,
      oldX, oldY, curX, curY,
      startTime,
      canvas, ctx, elements = new Array(), predictor =[0,0,0], guess = [0, 0, 0];
  const MAX_VALUE = 100000;

  var sign = function(val) {
    return (val < 0 ? -1 : (val > 0 ? 1 : 0));
  }
 
  var mapReduce = function(val, mapper, reducer) {
    for(var i = 0, len = val.lenght; i < len; i++) {
      val[i] = mapper(val[i]);
    }
    return reducer(val);
  }

  var avg = function(val) {
    var ans = 0;
    for(var i = 0, len = val.length; i < len; i++) {
      ans += val[i];
    }
    return ans / len;
  }

  var max = function(val) {
    var ans = 0;
    for(var i = 0, len = val.length; i < len; i++) {
      ans = (val[i] > ans? val[i] : ans);
    }
    return ans;
  }
  
  var min = function(val) {
    var ans = MAX_VALUE;
    for(var i = 0, len = val.length; i < len; i++) {
      ans = (val[i] < ans? val[i] : ans);
    }
    return ans;
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
        ctx.beginPath();
        ctx.moveTo(curX, curY);
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
        ctx.lineTo(curX, curY);
        ctx.stroke();
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
        varsq /= coordsX.length;
        varsq = varsq * varsq;
        sqvar /= coordsX.length;
        guess[0] = sqvar - varsq, guess[1] = new Date().getTime() - startTime, guess[2] = coordsX.length;
        ctx.closePath();
        ctx.clearRect(0,0, canvas.width, canvas.height);
        if(predictor[0] * guess[0] + predictor[1] * guess[1] + predictor[2] * guess[2]> 0) { //guess that this is a line
          elements.push([coordsX[0], coordsY[0], curX, curY]);
        } else {
          var x = avg(coordsX), y = avg(coordsY), rad = 0;
          for(var i = 0, len = coordsX.length; i < len; i++) {
            rad += Math.sqrt((x - coordsX[i]) * (x - coordsX[i]) 
            			   + (y - coordsY[i]) * (y - coordsY[i]));
          }
          rad /= len;
          elements.push([x, y, rad]);
        }
        ctx.beginPath();
        for(var i = 0, len = elements.length; i < len; i++) {
          var cur = elements[i];
          if(cur.length == 3) {
            ctx.moveTo(cur[0] + cur[2], cur[1]);
            ctx.arc(cur[0], cur[1], cur[2], 0, 2 * Math.PI, true);
          } else if(cur.length == 4) {
            ctx.moveTo(cur[0], cur[1]);
            ctx.lineTo(cur[2], cur[3]);
          }
        }
        ctx.stroke();
        ctx.closePath();
        var error = document.getElementById("error");
        //error.style.visibility = "visible";
        //setTimeout(function() { error.style.visibility = "hidden"}, 1000);
        break;
    }
  }
 
 
var click = function(event) {
  var target = event.target;
  switch(target.id) {
    case "error" :
      var corrector = (predictor[0] * guess[0] + predictor[1] * guess[1] + predictor[2] * guess[2]> 0 ? -1 : 1);
      predictor[0] = predictor[0] + corrector * guess[0];
      predictor[1] = predictor[1] + corrector * guess[1];
      predictor[2] = predictor[2] + corrector * guess[2];
      alert(predictor[0] + " " + predictor[1] + " " + predictor[2]);
      break;
    case "clear" : 
      elements = new Array();
      ctx.clearRect(0,0, canvas.width, canvas.height);
      break;
  }
}

  DragDrop.addHandler("dragstart", draggerStart);
  DragDrop.addHandler("drag", dragger);
  DragDrop.addHandler("dragend", draggerEnd);
  DragDrop.addHandler("click", click);
  DragDrop.addHandler("dblclick", click);
})();
