var SVGUtil = {
    svgNS : "http://www.w3.org/2000/svg",
    // Ellipse methods
    strokeEllipse:function(cx, cy, rw, rh, angle) {
      var svg = document.getElementById('display');
      var ellipse = document.createElementNS(this.svgNS,"ellipse");
      ellipse.setAttributeNS(null, "cx", cx);
      ellipse.setAttributeNS(null, "cy", cy);
      ellipse.setAttributeNS(null, "rx", rw);
      ellipse.setAttributeNS(null, "ry", rh);
      ellipse.setAttributeNS(null,'fill', 'white');
      ellipse.setAttributeNS(null,'stroke','black');
	  ellipse.setAttributeNS(null,'stroke-width',2);
	  ellipse.setAttributeNS(null,'transform', 'rotate(' + angle + ',' + cx + ',' + cy + ')');
      svg.appendChild(ellipse);   
    },
    // Line methods
    strokeLine:function(x1, y1, x2, y2, color) {
      var svg = document.getElementById('display');
      var line = document.createElementNS(this.svgNS,"line");
      line.setAttributeNS(null, "x1", x1);
      line.setAttributeNS(null, "y1", y1);
      line.setAttributeNS(null, "x2", x2);
      line.setAttributeNS(null, "y2", y2);
      line.setAttributeNS(null,'stroke',color === null ? 'black' : color);
	  line.setAttributeNS(null,'stroke-width',2);
	  svg.appendChild(line);       
    },
    // Rect methods
    strokeRect:function(cx, cy, rw, rh, angle) {
      var svg = document.getElementById('display');
      var rect = document.createElementNS(this.svgNS,"rect");
      rect.setAttributeNS(null, "x", cx - rw);
      rect.setAttributeNS(null, "y", cy - rh);
      rect.setAttributeNS(null, "width",  2 * rw);
      rect.setAttributeNS(null, "height", 2 * rh);
      rect.setAttributeNS(null,'fill', 'white');
      rect.setAttributeNS(null,'stroke','black');
	  rect.setAttributeNS(null,'stroke-width',2);
	  rect.setAttributeNS(null,'transform', 'rotate(' + angle + ',' + cx + ',' + cy + ')');
      svg.appendChild(rect);     
    },
    // Triangle methods
    strokeTriangle: function(x, y, X, Y, angle) {
      var svg = document.getElementById('display');
      var triangle = document.createElementNS(this.svgNS,"path");
      var str = "M" + x + "," + Y + " L" + X + "," + Y + " L" + .5 * (X + x) + "," + y + " L" + x + "," + Y;
      triangle.setAttributeNS(null, "d", str);
      triangle.setAttributeNS(null, "d", str);
      triangle.setAttributeNS(null,'fill', 'white');
	  triangle.setAttributeNS(null,'stroke','black');
	  triangle.setAttributeNS(null,'stroke-width',2);
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
      path.setAttributeNS(null,'stroke','black');
	  path.setAttributeNS(null,'stroke-width', 2);
      path.setAttributeNS(null,'fill-opacity',0);
      svg.appendChild(path);     
    },
    // Clear canvas
    clear: function() {
    	var svg = document.getElementById('display'), child = svg.firstChild, tmp;
		while(child != null) {
		  tmp = child.nextSibling;
		  svg.removeChild(child);
		  child = tmp;
		}
    },
    undo: function() {
      var svg = document.getElementById('display'), lc = svg.lastChild; 
      if(lc !== null) {
        svg.removeChild(lc);
        lc = svg.lastChild;
        if(lc !== null) {
          svg.removeChild(lc);
        }
      } 
    }
};
