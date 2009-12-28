(function() { //private scope so this code can `play-nice' with other packages
  var canvas = null, ctx = null, 
      predictor = new Perceptron(5, 5),
      example = new FeatureFactory(), label = null;
      
  window.onload = function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.lineCap = "round";
    ctx.lineWidth = "2";
    
    document.getElementById('error').onclick = function () {
      var child = document.getElementById('error').firstChild;
      child.data = "Sorry!";
      setTimeout(function() {child.data = "Wrong?";}, 250);
      label = parseInt(document.getElementById("errorbox").value);
      SVGUtil.removeLast();
      drawLast();  
    };
  
    document.getElementById('undo').onclick = function() {
      SVGUtil.removeLast();
    };

    document.getElementById('clear').onclick = function() {
      SVGUtil.clearCanvas();
    };
  };
  
  var drawLast = function() {
    switch(label) {
      case 0:
        SVGUtil.strokeLine(example.coordsX[0], example.coordsY[0], example.curX, example.curY);
        break;
      case 1:
        var t = example.minX, l = example.minY,
            w = example.maxX - t, h = example.maxY - l;
        SVGUtil.strokeEllipse(t, l, w, h);
        break;
      case 2: //need rotated rectangles e.g. diamonds
        var t = example.minX, l = example.minY,
            w = example.maxX - t, h = example.maxY - l;
        SVGUtil.strokeRect(t, l, w, h);
        break;
      case 3: //assumes upwards equilateral triangle. This needs to be improved. Need rotated shapes
        SVGUtil.strokeTriangle(example.minX, example.minY, example.maxX, example.maxY);
        break;
      case 4: //unrecognizable
        SVGUtil.strokeSmoothCurve(example.coordsX, example.coordsY); //try to smooth the unrecognizable gesture
        break;
    }
  };
 
  DragDrop.enable();
  
  var draggerStart = function(event) {
    var x = event.clientX - canvas.offsetLeft, 
        y = event.clientY - canvas.offsetTop;
    if(label !== null) { //if this is the first gesture then the previous label is null
      predictor.update(label);
    } 
    example.startFeature(x, y);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  var dragger = function(event) {
    var x = event.clientX - canvas.offsetLeft, 
        y = event.clientY - canvas.offsetTop;
    example.addPoint(x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  var draggerEnd = function(event) {
    var x = event.clientX - canvas.offsetLeft, 
        y = event.clientY - canvas.offsetTop;
    example.addPoint(x, y);
    ctx.lineTo(x, y);
    label = predictor.predict(example.getFeature());
    ctx.clearRect(0,0, canvas.width, canvas.height); //clear canvas
    drawLast();
  };
   
  DragDrop.addHandler("dragstart", draggerStart);
  DragDrop.addHandler("drag", dragger);
  DragDrop.addHandler("dragend", draggerEnd);
})();