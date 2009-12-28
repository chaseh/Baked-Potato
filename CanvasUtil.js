// Andrea Giammarchi - Mit Style License
var CanvasUtil = {
    // Circle methods
    circle:function(ctx, aX, aY, aDiameter){
        this.ellipse(ctx, aX, aY, aDiameter, aDiameter);
    },
    fillCircle:function(ctx, aX, aY, aDiameter){
        ctx.beginPath();
        this.circle(ctx, aX, aY, aDiameter);
        ctx.fill();
    },
    strokeCircle:function(ctx, aX, aY, aDiameter){
        ctx.beginPath();
        this.circle(ctx, aX, aY, aDiameter);
        ctx.stroke();
    },
    // Ellipse methods
    ellipse:function(ctx, aX, aY, aWidth, aHeight){
        var hB = (aWidth / 2) * .5522848,
            vB = (aHeight / 2) * .5522848,
            eX = aX + aWidth,
            eY = aY + aHeight,
            mX = aX + aWidth / 2,
            mY = aY + aHeight / 2;
        ctx.moveTo(aX, mY);
        ctx.bezierCurveTo(aX, mY - vB, mX - hB, aY, mX, aY);
        ctx.bezierCurveTo(mX + hB, aY, eX, mY - vB, eX, mY);
        ctx.bezierCurveTo(eX, mY + vB, mX + hB, eY, mX, eY);
        ctx.bezierCurveTo(mX - hB, eY, aX, mY + vB, aX, mY);
        ctx.closePath();
    },
    fillEllipse:function(ctx, aX, aY, aWidth, aHeight){
        ctx.beginPath();
        this.ellipse(ctx, aX, aY, aWidth, aHeight);
        ctx.fill();
    },
    strokeEllipse:function(ctx, aX, aY, aWidth, aHeight){
        ctx.beginPath();
        this.ellipse(ctx, aX, aY, aWidth, aHeight);
        ctx.stroke();
    },
    // Line methods
    beginLine: function(ctx, x, y) {
      ctx.beginPath();
      ctx.moveTo(x,y);
    },
    strokeLine:function(ctx, x, y) {
      	ctx.lineTo(x, y);
      	ctx.stroke();
    },
    endLine: function(ctx) {
       ctx.closePath();
    },
    // Rect methods
    strokeRect:function(ctx, x, y, w, h) {
    	ctx.beginPath();
		ctx.strokeRect(x, y, w, h);
      	ctx.closePath();
    },
    // Clear canvas
    clearCanvas: function(ctx, canvas) {
      ctx.clearRect(0,0, canvas.width, canvas.height);    
    },
    
};
