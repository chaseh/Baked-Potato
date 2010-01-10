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
	this.timer = new goog.Timer(10);
	this.timer.start();
	goog.events.listen(this.timer, goog.Timer.TICK, this.addCircle, false, this);
}

graf.App.prototype.addCircle = function() {
	
	var circle = new goog.graphics.ext.Ellipse(this.graphicsGroup);
	circle.setLeft(Math.random() * this.graphics.getWidth());
	circle.setTop(Math.random() * this.graphics.getHeight());
	circle.setHeight(30);
	circle.setWidth(30);
	circle.setFill(new goog.graphics.SolidFill("#000"));
	circle.setStroke(new goog.graphics.Stroke(1, "#F00"));
	this.circles.push(circle);	
}