function FeatureFactory() {
  this.coordsX;
  this.coordsY;
  this.varSq;
  this.sqVar;
  this.oldX;
  this.oldY;
  this.curX;
  this.curY;
  this.startTime;
  this.newFeature = true;
}


FeatureFactory.prototype = {
  constructor : FeatureFactory,
  addPoint : function(x, y) {
    if(this.newFeature) {
      this.startTime = new Date().getTime();
      this.coordsX = new Array(); this.coordsY = new Array();
      this.curX = x; this.curY = y;
      this.coordsX.push(x); this.coordsY.push(y);
      this.varsq = 0, this.sqvar = 0;
      this.newFeature = false;
    } else {
      this.oldX = this.curX; this.oldY = this.curY;
      this.curX = x; this.curY = y;
      this.coordsX.push(x); this.coordsY.push(y);
      var diffX = this.curX - this.oldX,
          diffY = this.curY - this.oldY;
      diffX = (Math.abs(diffX) < 1 ? (diffX < 0 ? -1 : 1): diffX); //purturb slightly for stability
      var val = diffY / diffX;        
      this.varsq += val;
      this.sqvar += val * val;
    }
  },
  getFeature : function() {
    this.varsq /= this.coordsX.length - 1; this.varsq = this.varsq * this.varsq;
    this.sqvar /= this.coordsX.length - 1;
    this.newFeature = true;
    return [this.sqvar - this.varsq, 
            new Date().getTime() - this.startTime, 
            this.coordsX.length, 
            Math.sqrt(Math.pow(this.coordsX[0] - this.curX, 2) + Math.pow(this.coordsY[0] - this.curY, 2))];
  }
  
}