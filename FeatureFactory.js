function FeatureFactory() {
  this.avg;
  this.gradVar;
  this.secondVar;
  this.X; this.Y;
  this.box; //bounding boxes
  this.coordsX; this.coordsY;
  this.theta;
  this.m;
  this.distBetweenPoints, this.totalDistance;
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
  l2Dist : function(x1,y1,x2,y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  },
  startFeature : function(x, y) {
    this.X = [null, x, x]; 
    this.Y = [null, y, y];
    this.gradVar = [0, 0], 
    this.secondVar = [0, 0],
    this.coordsX = [x],
    this.coordsY = [y], 
    this.box = [x, y, x, y];
    this.distBetweenPoints = [];
    this.totalDistance = 0;
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
    
    //bounding box
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
    
    //coordinate features features
    this.coordsX.push(x);
    this.coordsY.push(y);
    
    // an augmented matrix used to store the distances between each original point
    var curDist = this.l2Dist(x,y,X[1],Y[1]);                       
    this.distBetweenPoints.push(curDist);
    this.totalDistance += curDist;
  },
  /*
   * function to get the actual feature and finish up any computation that is not done online. Ideally this
   * function would contain as little work as possible as the majority of computation should be done 
   * sequentially in the addPoint function. The general goal behind these two functions is to get as much
   * computing power out of them without any visible slowdown to the user. The means that the
   * combined online/offline approach is probably ideal.
  */
  getFeature : function() {
    var len = this.coordsX.length, 
        gradVar = this.gradVar, 
        secondVar = this.secondVar;
        
    //variance features
    gradVar[0] /= len - 1; gradVar[0] *= gradVar[0];
    gradVar[1] /= len - 1;
    secondVar[0] /= len - 1; secondVar[0] *= secondVar[0];
    secondVar[1] /= len - 1;

    //resample and guassian smooth points
    var pair = this.resample(this.coordsX, this.coordsY, this.totalDistance, this.distBetweenPoints, 52); //O(n + 104)
    this.coordsX = this.smooth(pair[0]); //O(52) drops first and last point
    this.coordsY = this.smooth(pair[1]); //O(52) drops first and last point

    pair = this.scale(this.coordsX, this.coordsY, this.box); //O(100)
    var scaledX = pair[0], scaledY = pair[1];
        
    this.avg = [0, 0];
    this.avg[0] = this.mean(this.coordsX); //O(50)
    this.avg[1] = this.mean(this.coordsY); //O(50)
    
    pair = this.angles(this.coordsX, this.coordsY, this.avg); //O(100);
    var sin = pair[0], cos = pair[1];
    
    var endDist = this.l2Dist(this.coordsX[0], this.X[2], this.coordsY[0], this.Y[2]);
                       
    var xc = this.mean(scaledX), 
        yc = this.mean(scaledY);
    
    var feature = [gradVar[1] - gradVar[0], secondVar[1] - secondVar[0],
            endDist / 10, this.totalDistance / 10, this.totalDistance / endDist, Math.max(yc/xc, xc/yc)]; 
    feature = feature.concat(scaledX, scaledY, sin, cos);
    return feature;
  },

   /*
   linear interpolation re-sampling algorithm
   
   input: a list of (x,y) coordinates, a list of the distances between each (x_i,y_i) and (x_i+1, y_i+1),
   and the new distance between each evenly sampled point
   
    return a new set of points evenly spaced with distanceBewteenPoints distance between each point
   */
  resample : function(coordsX, coordsY, totalDistance, dist, number) {
    var distanceBetweenPoints = totalDistance / (number - 1),
        x = [coordsX[0]], y = [coordsY[0]],
        distanceUntilNext = distanceBetweenPoints,
        soFar = 0, rat;
         
    for(var i = 0, len = dist.length; i < len; i++) {
      while(dist[i] >= distanceUntilNext + soFar) {
        soFar += distanceUntilNext; //add the distance just traveled
        distanceUntilNext = distanceBetweenPoints; //reset the distance until next
         
        rat = soFar / dist[i];
        x.push((1 - rat) * coordsX[i] + rat * coordsX[i + 1]); 
        y.push((1 - rat) * coordsY[i] + rat * coordsY[i + 1]);
      }
         
      distanceUntilNext -= (dist[i] - soFar);
      soFar = 0;         
    }
    if(x.length < number) { //this shouldn't happen, but it does do to round-off error
      x.push(coordsX[len - 1]);
      y.push(coordsY[len - 1]);
    }
    return [x, y];
  },
  smooth : function(list) {//gaussian smoothing of the points
    var ans = [];
    for(var i = 1, len = list.length - 1; i < len; i++) {
      ans.push(.25 * list[i - 1] + .5 * list[i] + .25 * list[i + 1]);
    }
    return ans;
  },
  mean : function(list) { //a function to calculate the average point
    var ans = 0;
    for(var i = 0, len = list.length; i < len; i++) {
      ans += list[i];
    }
    return ans / len;
  },
  2scale : function(y, x, box) { //scale the shape down to fall between (0,1). Aspect ratio is not preserved
     var scalorX = box[0] > box[2] ? box[0] - box[2] : box[2] - box[1],
         scalorY = box[1] > box[3] ? box[1] - box[3] : box[3] - box[1],
         sX = [], sY = [];
     for(var i = 0, len = x.length; i < len; i++) {
       sX.push((x[i] - box[0]) / scalorX);
       sY.push((y[i] - box[1]) / scalorY);
     }
     return [sX, sY];   
   },
   angles : function (x, y, avg) { //get the angle features
     var sin = [], cos = [], theta;
     for(var i = 0, len = x.length; i < len; i++) {
       theta = Math.atan((x[i] - avg[0]) / (y[i] - avg[0]));
       sin.push(Math.sin(theta));
       cos.push(Math.cos(theta));
     }
     return [sin, cos];
   }
 }

   
     
       
         
           
             
               
                 
 
 /* 
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
      -Is the model correct?
      -Is there another way to compute this?
  
  calcM : function() {
    var coordsX = this.coordsX, coordsY = this.coordsY, 
        a = 0, b = 0, c = 0, box = this.box, avg = [0,0];
        scalorX = box[2] - box[0], scalorY = box[3] - box[1];
    this.scaledX = new Array(coordsX.length);
    this.scaledY = new Array(coordsY.length);
    var scaledX = this.scaledX, scaledY = this.scaledY;
    avg[0] = (this.avg[0] - box[0]) / scalorX;
    avg[1] = (this.avg[1] - box[1]) / scalorY;
    for(var i = 0, len = coordsY.length; i < len; i++) {
      scaledX[i] = (coordsX[i] - box[0]) / scalorX;
      scaledY[i] = (coordsY[i] - box[1]) / scalorY;
//      a += scaledY[i] * (scaledX[i] - avg[0]);
//      b += scaledY[i] * (avg[1] - scaledY[i]) + scaledX[i] * (scaledX[i] - avg[0]);
//      c += scaledX[i] * (avg[1] - scaledY[i]);
    }
    var disc = Math.pow(b, 2) - 4 * a * c;
    return Math.min(100, disc < 0 ? 100 : (-b - Math.sqrt(disc)) / (2 * a)); //the non-degenerate solution
  },

  transformPoints : function(theta) {
    var cos = Math.cos(theta), sin = Math.sin(theta), x = null,y = null,
    tmpx = this.coordsX[0], tmpy = this.coordsY[0];
    x = cos * tmpx - sin * tmpy;
    y = sin * tmpx + cos * tmpy;    
    this.transformedBox = [x, y, x, y];
    for(var i = 1, len = this.coordsX.length; i < len; i++) {
      tmpx = this.coordsX[i]; tmpy = this.coordsY[i];
      x = cos * tmpx - sin * tmpy;
      y = sin * tmpx + cos * tmpy;    
      this.transformedBox = [Math.min(x, this.transformedBox[0]), Math.min(y, this.transformedBox[1]),
                             Math.max(x, this.transformedBox[2]), Math.max(y, this.transformedBox[3])];    

    }
  },
}*/


