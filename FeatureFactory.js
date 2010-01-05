function FeatureFactory() {
  this.avg;
  this.gradVar;
  this.secondVar;
  this.X; this.Y;
  this.box;  this.transformedBox; //bounding boxes
  this.coordsX; this.coordsY;
  this.length;
  this.theta;
  this.m;
};

FeatureFactory.prototype = {
  constructor : FeatureFactory,
  purturb : function(x) {
    return x == 0 ? 1 : x;
  },
  firstDiff : function(a, b) {
    return b - a;
  },
  secondDiff : function(a, b, c) {
    return c - 2 * b + a;
  },
  startFeature : function(x, y) {
    this.X = [null, x, x]; 
    this.Y = [null, y, y];
    this.avg = [x, y];
    this.gradVar = [0, 0], 
    this.secondVar = [0, 0],
    this.coordsX = [x],
    this.coordsY = [y], 
    this.length = 1;
    this.box = [x, y, x, y];
  },
  addPoint : function(x, y) {
    var X = this.X;
    X[0] = X[1];
    X[1] = X[2];
    X[2] = x;
    
    var Y = this.Y;
    Y[0] = Y[1];
    Y[1] = Y[2];
    Y[2] = y;
        
    this.length++;
    this.avg[0] += x; this.avg[1] += y;

    this.box = [Math.min(x, this.box[0]), Math.min(y, this.box[1]),
                Math.max(x, this.box[2]), Math.max(y, this.box[3])];    
    
    var dydx = this.firstDiff(Y[1], Y[2]) / 
               this.purturb(this.firstDiff(X[1], X[2])),
        ddyddx = this.secondDiff(Y[0], Y[1], Y[2]) / 
                 this.purturb(this.secondDiff(X[0], X[1], X[2])),
        gradVar = this.gradVar, 
        secondVar = this.secondVar;         
    gradVar[0] += dydx; 
    gradVar[1] += Math.pow(dydx, 2);
    secondVar[0] += ddyddx;
    secondVar[1] += Math.pow(ddyddx, 2);
    
    if(ddyddx != 0) {  //push the points if they are not a part of the same line
      this.coordsX.push(x); 
      this.coordsY.push(y);
    }
  },
  getFeature : function() {
    var len = this.length, 
        gradVar = this.gradVar, 
        secondVar = this.secondVar;
    gradVar[0] /= len - 1; gradVar[0] *= gradVar[0];
    gradVar[1] /= len - 1;
    secondVar[0] /= len - 1; secondVar[0] *= secondVar[0];
    secondVar[1] /= len - 1;
    this.avg[0] /= len; this.avg[1] /= len;
    var dist = Math.sqrt(Math.pow(this.coordsX[0] - this.X[2], 2) 
                       + Math.pow(this.coordsY[0] - this.Y[2], 2));
    this.m = this.calcM();                   
    this.theta = (180 * Math.atan(this.m) / Math.PI);
    this.transformPoints(this.theta);
    
    var feature = [gradVar[1] - gradVar[0], secondVar[1] - secondVar[0],
            dist, Math.max(this.avg[0]/this.avg[1], this.avg[1]/this.avg[0])]; 
    
    return feature;
  },
  /*We want to find the line that minimizes the L-2 distance to all points in a gesture 
    and make this line the x-axis. The rational for this is that we want to rotate gestures for input
    into the detector in a way that is rotation invariant. After some algebra, the equation of this
    line can found from the optimization problem:
    \min_{m,b} \frac{1}{1 + m^2} \sum_{i=1}^{n} (y_i - mx_i - b)^2,
    where m is the slope and b is the intercept. I have attached a document containing the derivation
    of this problem and its solution.
    
    This pre-processing step requires a lot more consideration in the future... for example:
      -should we regularize it?
      -is there a way to calculate it online?
      -should we use a different metric than L-2
  */
  calcM : function() {
    var x = this.coordsX, y = this.coordsY, a = 0, b = 0, c = 0;
    for(var i = 0, len = y.length; i < len; i++) {
      a += y[i] * (x[i] - this.avg[0]);
      b += y[i] * (this.avg[1] - y[i]) + x[i] * (x[i] - this.avg[0]);
      c += x[i] * (this.avg[1] - y[i]);
    }
    var disc = Math.pow(b, 2) - 4 * a * c;
    return Math.min(100, disc < 0 ? 100 : (-b + Math.sqrt(disc)) / (2 * a)); //the non-degenerate solution
  },
  transformPoints : function(theta) {
    var x = [], y = [], 
      cos = Math.cos(theta), sin = Math.sin(theta);
    for(var i = 0, len = this.coordsX.length; i < len; i++) {
      var tmpx = this.coordsX[i], tmpy = this.coordsY[i];
      x.push(cos * tmpx - sin * tmpy);
      y.push(sin * tmpx + cos * tmpy);    
    }
    this.transformedBox = [x[0], y[0], x[0], y[0]];
    for(i = 1; i < len; i++) {
        this.transformedBox = [Math.min(x[i], this.transformedBox[0]), Math.min(y[i], this.transformedBox[1]),
                               Math.max(x[i], this.transformedBox[2]), Math.max(y[i], this.transformedBox[3])];    
    }
  }
}