var SVGUtil = {
    svgNS : "http://www.w3.org/2000/svg",
    // Ellipse methods
    strokeEllipse:function(x, y, w, h) {
      var svg = document.getElementById('display');
      var ellipse = document.createElementNS(this.svgNS,"ellipse");
      ellipse.setAttributeNS(null, "cx", x + w/2);
      ellipse.setAttributeNS(null, "cy", y + h/2);
      ellipse.setAttributeNS(null, "rx", w/2);
      ellipse.setAttributeNS(null, "ry",h/2);
      ellipse.setAttributeNS(null,'stroke','rgb(0, 0, 0)');
      ellipse.setAttributeNS(null,'fill', 'rgba(255,255,255,0)');
	  ellipse.setAttributeNS(null,'stroke-width',2);
      svg.appendChild(ellipse);   
    },
    // Line methods
    strokeLine:function(x1, y1, x2, y2) {
      var svg = document.getElementById('display');
      var line = document.createElementNS(this.svgNS,"line");
      line.setAttributeNS(null, "x1", x1);
      line.setAttributeNS(null, "y1", y1);
      line.setAttributeNS(null, "x2", x2);
      line.setAttributeNS(null, "y2", y2);
      line.setAttributeNS(null,'stroke','rgb(0, 0, 0)');
	  line.setAttributeNS(null,'stroke-width',2);
      line.setAttributeNS(null,'fill', 'rgba(255,255,255,0)');
	  svg.appendChild(line);       
    },
    // Rect methods
    strokeRect:function(x, y, w, h) {
      var svg = document.getElementById('display');
      var rect = document.createElementNS(this.svgNS,"rect");
      rect.setAttributeNS(null, "x", x);
      rect.setAttributeNS(null, "y", y);
      rect.setAttributeNS(null, "width",  w);
      rect.setAttributeNS(null, "height", h);
      rect.setAttributeNS(null,'stroke','rgb(0, 0, 0)');
	  rect.setAttributeNS(null,'stroke-width',2);
      rect.setAttributeNS(null,'fill', 'rgba(255,255,255,0)');
      svg.appendChild(rect);     
    },
    // Triangle methods
    strokeTriangle: function(x, y, X, Y) {
      var svg = document.getElementById('display');
      var triangle = document.createElementNS(this.svgNS,"path");
      
      var str = "M" + x + "," + y + " L" + x + "," + Y + " L" + X + "," + Y + " L" + x + "," + y;
      triangle.setAttributeNS(null, "d", str);
      triangle.setAttributeNS(null, "d", str);
	  triangle.setAttributeNS(null,'stroke','rgb(0, 0, 0)');
	  triangle.setAttributeNS(null,'stroke-width',2);
      triangle.setAttributeNS(null,'fill', 'rgba(255,255,255,0)');
      svg.appendChild(triangle);
    },
    // Curve methods
    strokeSmoothCurve:function(x, y) {
      var svg = document.getElementById('display');
      var path = document.createElementNS(this.svgNS,"path");
        
      var str = "M" + x[0] + "," + y[0];
      for(var i = 1, len = x.length; i < len - 1; i = i + 2) {
        str = str.concat(" S", x[i].toString(), ",", y[i].toString(), ",", x[i+1].toString(), ",", y[i+1].toString());
      }
      path.setAttributeNS(null, "d", str);
      path.setAttributeNS(null,'stroke','rgb(0, 0, 0)');
	  path.setAttributeNS(null,'stroke-width', 2);
      path.setAttributeNS(null,'fill', 'rgba(255,255,255,0)');
      svg.appendChild(path);     
    },
    // Clear canvas
    clearCanvas: function() {
    	var svg = document.getElementById('display'), child = svg.firstChild, tmp;
		while(child != null) {
		  tmp = child.nextSibling;
		  svg.removeChild(child);
		  child = tmp;
		}
    },
    removeLast: function() {
      var svg = document.getElementById('display'), lc = svg.lastChild; 
      if(lc !== null) {
        svg.removeChild(lc);
      }
    }
};
