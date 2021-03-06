/*
 * Author: Alex Komoroske (jkomoros@gmail.com)
 */

goog.provide("graf.App");

goog.require("goog.graphics.ext");
goog.require("goog.Timer");
goog.require("goog.events");


graf.App = function() {
	this.graphics = new goog.graphics.ext.Graphics(400, 400);
	this.graphicsGroup = new goog.graphics.ext.Group(this.graphics);
	this.graphics.render(document.getElementById("surface"));
	this.circles = [];
	this.addCircle();
	this.timer = new goog.Timer(100);
	this.timer.start();
	goog.events.listen(this.timer, goog.Timer.TICK, this.decay, false, this);
}

graf.App.prototype.decay = function() {
	//do nothing for now.
	var len = this.circles.length;
	var circle;
	for(var i = 0; i < len; i++) {
		circle = this.circles[i];
		if (circle.getWidth() <= 0) continue;
		circle.setSize(circle.getWidth() - 1, circle.getHeight() - 1);
		circle.setRotation(circle.getRotation() + 10);
	}
}

graf.App.prototype.addCircle = function() {
	
	var circle = new goog.graphics.ext.Ellipse(this.graphicsGroup);
	circle.setLeft(Math.random() * this.graphics.getWidth());
	circle.setTop(Math.random() * this.graphics.getHeight());
	circle.setHeight(Math.random() * 100);
	circle.setWidth(Math.random() * 50);
	circle.setFill(new goog.graphics.SolidFill("#000"));
	circle.setStroke(new goog.graphics.Stroke(1, "#F00"));
	//TODO: this uses circle.getWrapper, but getWrapper is technically supposed to be protected.
	//unfortunately, events can't be successfully registered on the circle itself for some reason.
	goog.events.listen(circle.getWrapper(), goog.events.EventType.MOUSEOVER, function() {circle.setFill(new goog.graphics.SolidFill("#FF0"))});
	this.circles.push(circle);	
}