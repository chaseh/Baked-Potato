function FeatureFactory() {
  this.gradVarSq; this.gradSqVar;
  this.secondVarSq; this.secondSqVar;
  this.olderX; this.olderY;
  this.oldX; this.oldY;
  this.curX; this.curY;
  this.maxX; this.minX;
  this.maxY; this.minY;
  this.muX; this.muY;
  this.startX; this.startY;
  this.length;
  this.startTime;
}

FeatureFactory.prototype = {
  constructor : FeatureFactory,
  startFeature : function(x, y) {
    this.length = 1;
    this.curX = x; this.curY = y;
    this.oldX = x; this.oldY = y;
    this.muX = x; this.muY = y;
    this.gradVarSq = 0, this.gradSqVar = 0;
    this.secondVarSq = 0, this.secondSqVar = 0;
    this.maxX = x; this.maxY = y;
    this.minX = x; this.minY = y;
    this.startX = x; this.startY = y;
    this.startTime = new Date().getTime();
  },
  addPoint : function(x, y) {
    this.olderX = this.oldX; this.olderY = this.oldY;
    this.oldX = this.curX; this.oldY = this.curY;
    this.curX = x; this.curY = y;
    this.length++;
    this.muX += x; this.muY += y;

    var dX = this.curX - this.oldX,
        dY = this.curY - this.oldY;
    dX = (Math.abs(dX) < 1 ? (dX < 0 ? -1 : 1): dX); //purturb slightly for stability
    var ddX = this.curX - 2 * this.oldX + this.olderX,
        ddY = this.curY - 2 * this.oldY + this.olderY;
    ddX = (Math.abs(ddX) < 1 ? (ddX < 0 ? -1 : 1): ddX); //purturb slightly for stability
    var grad = dY / dX;        
    var second = ddY / ddX;
    this.gradVarSq += grad;
    this.gradSqVar += grad * grad;
    this.secondVarSq += second;
    this.secondSqVar += second * second;
    
    this.maxX = x > this.maxX ? x : this.maxX;
    this.minX = x < this.minX ? x : this.minX;
    this.maxY = y > this.maxY ? y : this.maxY;
    this.minY = y < this.minY ? y : this.minY;
  },
  getFeature : function() {
    var len = this.length;
    this.gradVarSq /= len - 1; this.gradVarSq *= this.gradVarSq;
    this.gradSqVar /= len - 1;
    this.secondVarSq /= len - 1; this.secondVarSq *= this.secondVarSq;
    this.secondSqVar /= len - 1;
    this.muX /= len;
    this.muY /= len;
    var dist = Math.sqrt(Math.pow(this.startX - this.curX, 2) 
                       + Math.pow(this.startY - this.curY, 2));
//    alert((new Date().getTime() - this.startTime) / len); //alert the time per point
    return [this.gradSqVar - this.gradVarSq, this.secondSqVar - this.secondVarSq,
            dist, len, this.muY/this.muX];
  } 
}