function FeatureFactory() {
  this.avg;
  this.gradVar;
  this.secondVar;
  this.X; this.Y; this.T;
  this.box; 
  this.coordsX; this.coordsY;
  this.length;
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
    this.T = [null, new Date().getTime(), new Date().getTime()];
    this.box = [x, y, x, y];
    this.avg = [x, y];
    this.gradVar = [0, 0, 0, 0, 0, 0], 
    this.secondVar = [0, 0, 0, 0, 0, 0],
    this.coordsX = [x],
    this.coordsY = [y], 
    this.length = 1;
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
    
    var T = this.T;
    T[0] = T[1];
    T[1] = T[2];
    T[2] = new Date().getTime();    
    
    this.length++;
    this.avg[0] += x; this.avg[1] += y;
    
    var dy = this.firstDiff(Y[1], Y[2]), 
        dx = this.firstDiff(X[1], X[2]),
        dt = this.firstDiff(T[1], T[2]),
        ddt= this.firstDiff(T[0], T[1]),
        ddy= this.secondDiff(Y[0], Y[1], Y[2]), 
        ddx= this.secondDiff(X[0], X[1], X[2]),
        dydx = dy / this.purturb(dx),
        ddyddx= ddy / this.purturb(ddx),
        dydt = dy / this.purturb(2 * dt),
        dxdt = dx / this.purturb(2 * dt),
        ddyddt= ddy / this.purturb(dt * ddt),
        ddxddt= ddx / this.purturb(dt * ddt);
    
    var gradVar = this.gradVar, secondVar = this.secondVar;         
    gradVar[0] += dydx; 
    gradVar[1] += Math.pow(dydx, 2);
    gradVar[2] += dxdt; 
    gradVar[3] += Math.pow(dxdt, 2);
    gradVar[4] += dydt; 
    gradVar[5] += Math.pow(dydt, 2);
    secondVar[0] += ddyddx;
    secondVar[1] += Math.pow(ddyddx, 2);
    secondVar[2] += ddxddt;
    secondVar[3] += Math.pow(ddxddt, 2);
    secondVar[4] += ddyddt;
    this.secondVar[5] += Math.pow(ddyddt, 2);
    this.box = [Math.min(x, this.box[0]), Math.min(y, this.box[1]),
    	        Math.max(x, this.box[2]), Math.max(y, this.box[3])];
    
    if(ddyddx != 0) {  //push the points if they are not a part of the same line
      this.coordsX.push(x); 
      this.coordsY.push(y);
    }
  },
  getFeature : function() {
    var len = this.length, gradVar = this.gradVar, secondVar = this.secondVar;         
    gradVar[0] /= len - 1; gradVar[0] *= gradVar[0];
    gradVar[2] /= len - 1; gradVar[2] *= gradVar[2];
    gradVar[4] /= len - 1; gradVar[4] *= gradVar[4];
    gradVar[1] /= len - 1;
    gradVar[3] /= len - 1;
    gradVar[5] /= len - 1;
    secondVar[0] /= len - 1; secondVar[0] *= secondVar[0];
    secondVar[2] /= len - 1; secondVar[2] *= secondVar[2];
    secondVar[4] /= len - 1; secondVar[4] *= secondVar[4];
    secondVar[1] /= len - 1;
    secondVar[3] /= len - 1;
    secondVar[5] /= len - 1;

    var dist = Math.sqrt(Math.pow(this.coordsX[0] - this.X[2], 2) 
                       + Math.pow(this.coordsY[0] - this.Y[2], 2));           
    var feature = [gradVar[1] - gradVar[0], //gradVar[3] - gradVar[2], gradVar[5] - gradVar[4],
            secondVar[1] - secondVar[0], //secondVar[3] - secondVar[2], secondVar[5] - secondVar[4],
            dist, Math.max(this.avg[0]/this.avg[1], this.avg[1]/this.avg[0])]; //len, 
    return feature;
  } 
}