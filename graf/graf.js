/*
 * Author: Alex Komoroske (jkomoros@gmail.com)
 */

goog.provide("graf.App");

goog.require("goog.graphics")

graf.App = function() {
	this.graphics = goog.graphics.createGraphics(400,400);
	this.graphics.render(document.getElementById("surface"));
	this.circles = [];
	this.addCircle();
}

graf.App.prototype.addCircle = function() {
	var circle = this.graphics.drawEllipse(Math.random() * this.graphics.getSize().width, Math.random() * this.graphics.getSize().height, 30, 30, new goog.graphics.Stroke(1, "#F00"), new goog.graphics.SolidFill("#000"));
	this.circles.push(circle);	
}