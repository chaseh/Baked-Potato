function FeatureFactory() {
  this.avg;
  this.gradVar;
  this.secondVar;
  this.X; this.Y;
  this.box; 
  this.coordsX; this.coordsY;
  this.theta;
  this.m;
  this.distBetweenPoints, this.totalDistance;
};

FeatureFactory.prototype = {
  size : 606,
  constructor : FeatureFactory,
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
    this.box = [x, y, x + 1, y + 1];
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
    var box = this.box;
    this.box = [Math.min(x, box[0]), Math.min(y, box[1]),
           Math.max(x, box[2]), Math.max(y, box[3])];    
    
    var purturb = function(x) { return x == 0 ? 1 : x; }, 
      firstDiff = function(a, b) {return b - a;},
     secondDiff = function(a, b, c) { return c - 2 * b + a;};

    var dydx = firstDiff(Y[1], Y[2]) / 
               purturb(firstDiff(X[1], X[2])),
        ddyddx = secondDiff(Y[0], Y[1], Y[2]) / 
                 purturb(secondDiff(X[0], X[1], X[2])),
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
    var curDist = this.l2Dist(x, y, X[1], Y[1]);                       
    this.distBetweenPoints.push(curDist);
    this.totalDistance += curDist;
  },
  /*
   * function to create the feature and finish up all computations not done online. Ideally this
   * function should contain no O(n) computations, and everything should be done online, 
   * in addPoint. The goal behind these two functions is to get as much
   * computing power without any visible slowdown to the user. 
   */
  getFeature : function() {
    //variance features
    var len = this.coordsX.length, gradVar = this.gradVar, secondVar = this.secondVar;
    gradVar[0] /= len - 1; gradVar[0] *= gradVar[0];
    gradVar[1] /= len - 1;
    secondVar[0] /= len - 1; secondVar[0] *= secondVar[0];
    secondVar[1] /= len - 1;

    //Distance between start and end, get reference to coords and dists
    var coordsX = this.coordsX, coordsY = this.coordsY, distBetweenPoints = this.distBetweenPoints,
        endDist = this.l2Dist(coordsX[0], this.X[2], coordsY[0], this.Y[2]), totalDistance = this.totalDistance;
    //resample, pivot (around the left, top most point), and guassian smooth points
    var pair = this.resample(coordsX, coordsY, totalDistance, distBetweenPoints, 54); //O(n + 108)
    //pair = this.pivot(pair[0], pair[1]); //O(108)
    coordsX = this.smooth(pair[0]); //O(54) drops first two and last two points
    this.coordsX = coordsX;
    coordsY = this.smooth(pair[1]); //O(54) drops first two and last two points    
    this.coordsY = coordsY;
    
    //scale points to be between (0,1)
    pair = this.scale(coordsX, coordsY, this.box); //O(100)
    var scaledX = pair[0], 
        scaledY = pair[1];
    
    //center of gravity mean point
    var avg = [0, 0];
    avg[0] = this.mean(coordsX); //O(50)
    avg[1] = this.mean(coordsY); //O(50)
    this.avg = avg;
    
    //angle features
    var trip = this.angles(coordsX, coordsY, avg); //O(100);
    var sin = trip[0], cos = trip[1];
    //trip[2] is the total angle -- heuristic to determine if the shape is clockwize or not
/*    if(trip[2] < 0) {
      scaledX.reverse();
      scaledY.reverse();
      sin.reverse();
      cos.reverse();
    }*/
    
    //offline features
    var offline = this.offline(scaledX, scaledY, 20, 20); //O(400);
    
    //get the ratio of the x and y center of gravity                    
    var xc = avg[0] - this.box[0], yc = avg[1] - this.box[1];
    
    var feature = [gradVar[1] - gradVar[0], secondVar[1] - secondVar[0],
            endDist / 10, 
            totalDistance / 10, 
            totalDistance / endDist, 
            Math.max(yc/xc, xc/yc)];//6 -- special features

    feature = feature.concat(scaledX, scaledY); //100 -- online features
    feature = feature.concat(offline); //400 -- offline features
    feature = feature.concat(sin, cos); //100 -- online features
    return feature;
  },
  pivot : function(x, y) {
    var idx = 0;
    for(var i = 1, len = x.length; i < len; i++) {
      idx = x[idx] > x[i] ? i : 
          (x[idx] == x[i] && y[idx] > y[i] ? i : idx);  
    }
    
    if(idx > 0 && idx < len) {
      x = x.slice(idx + 1).concat(x.slice(0, idx + 1));
      y = y.slice(idx + 1).concat(y.slice(0, idx + 1));
    }
    return [x, y];
  },
   /*
   linear interpolation re-sampling algorithm
   
   input: a list of (x,y) coordinates, a list of the distances between each (x_i,y_i) and (x_i+1, y_i+1),
   and the new distance between each evenly sampled point
   
    return a new set of points evenly spaced with distanceBetweenPoints distance between each point
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
    for(var i = 2, len = list.length - 2; i < len; i++) {
      ans.push(.1 * list[i - 2] + .2 * list[i - 1] + .4 * list[i] + .2 * list[i + 1] + .1 * list[i + 2]);
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
  scale : function(x, y, box) { //scale the shape down to fall between (0,1). Aspect ratio is not preserved    
    var width = box[2] - box[0], height = box[3] - box[1],
        sX = [], sY = [];
    for(var i = 0, len = x.length; i < len; i++) {
      sX.push((x[i] - box[0]) / width);
      sY.push((y[i] - box[1]) / height);
    }
    return [sX, sY];   
  },
  angles : function (x, y, avg) { //get the angle features
    var sin = [], cos = [], theta, clk = 0;
    for(var i = 0, len = x.length; i < len; i++) {
      theta = Math.atan((x[i] - avg[0]) / (y[i] - avg[0]));
      clk += theta;
      sin.push(Math.sin(theta));
      cos.push(Math.cos(theta));
    }
    return [sin, cos, clk];
  },
  offline : function(x, y, numX, numY) {
    var ans = [], tmp;
    for(var i = 0, len = numX * numY; i < len; i++) {
      ans[i] = 0;
    }
    for(i = 0, len = x.length; i < len; i++) {
      tmp = Math.floor((.05 + .9 * x[i] + Math.floor((.05 + .9 * y[i]) * numY)) * numX);
      ans[tmp]++; 
    }
/*  var str = "";
    for(i = 0; i < numX; i++) {
      for(var j = 0; j < numY; j++) {
        str += ans[i + numX * j];
      }
      str += "\n";
    }
    alert(str);*/
    return ans;
  }
};
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