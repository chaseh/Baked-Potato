(function() { //private scope so this code can `play-nice' with other packages
  var canvas = null, ctx = null, 
      predictor = new Perceptron(5, 206),
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
      SVGUtil.undo();
      draw();  
    };
  
    document.getElementById('undo').onclick = function() {
      SVGUtil.undo();
    };

    document.getElementById('clear').onclick = function() {
      SVGUtil.clear();
    };
  };
  
  var draw = function() {
    var box = example.box, avg = example.avg;
    switch(label) {
      case 0:
        SVGUtil.strokeLine(example.coordsX[0], example.coordsY[0], example.X[2], example.Y[2], null);
        break;
      case 1: //need rotated ellipses
        var w = box[2] - box[0], h = box[3] - box[1];
        SVGUtil.strokeEllipse(avg[0], avg[1], w/2, h/2, 0, null);
        break;
      case 2: //need rotated/skew rectangles e.g. parallelograms
        var w = box[2] - box[0], h = box[3] - box[1];
        SVGUtil.strokeRect(avg[0], avg[1], w/2, h/2, 0);
        break;
      case 3: //assumes equilateral triangle. This needs to be improved--need rotated shapes
        SVGUtil.strokeTriangle(box[0], box[1], box[2], box[3], 0);
        break;
      case 4: //unrecognizable
        for(var i = 0, len = example.coordsX.length; i < len; i++) {
          SVGUtil.strokeEllipse(example.coordsX[i], example.coordsY[i], 3, 3, 0, 'red');
        }
        SVGUtil.strokeSmoothCurve(example.coordsX, example.coordsY); 
        SVGUtil.strokeEllipse(avg[0], avg[1], 3, 3, 0, null);
//        SVGUtil.strokeLine(m * (avg[0] - 100) + b, avg[1] - 100, m * (avg[0] + 100) + b, avg[1] + 100, 'red');
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
    draw();
  };
   
  DragDrop.addHandler("dragstart", draggerStart);
  DragDrop.addHandler("drag", dragger);
  DragDrop.addHandler("dragend", draggerEnd);
})();
