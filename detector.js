(function() { //private scope so this code can `play-nice' with other packages
  var canvas = null, ctx = null, 
      predictor = new Perceptron(5, 4),
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
    switch(label) {
      case 0:
        SVGUtil.strokeLine(example.coordsX[0], example.coordsY[0], example.X[2], example.Y[2]);
        break;
      case 1: //need rotated ellipses
        var t = example.box[0], l = example.box[1],
            w = example.box[2] - t, h = example.box[3] - l;
        SVGUtil.strokeEllipse(t, l, w, h);
        break;
      case 2: //need rotated/skew rectangles e.g. parallelograms
        var t = example.box[0], l = example.box[1],
            w = example.box[2] - t, h = example.box[3] - l;
        SVGUtil.strokeRect(t, l, w, h);
        break;
      case 3: //assumes equilateral triangle. This needs to be improved--need rotated shapes
        SVGUtil.strokeTriangle(example.box[0], example.box[1], example.box[2], example.box[3]);
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
    draw();
  };
   
  DragDrop.addHandler("dragstart", draggerStart);
  DragDrop.addHandler("drag", dragger);
  DragDrop.addHandler("dragend", draggerEnd);
})();