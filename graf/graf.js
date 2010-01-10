/*
 * Author: Alex Komoroske (jkomoros@gmail.com)
 */

goog.provide("graf.App");

goog.require("goog.graphics")

graf.App = function() {
	this.graphics = goog.graphics.createGraphics(400,400);
	var blackFill = new goog.graphics.SolidFill("#000");
	var redStroke = new goog.graphics.Stroke(1, "#F00");
	this.circle = this.graphics.drawEllipse(100,200, 10, 20, redStroke, blackFill);
	this.graphics.render(document.getElementById("surface"));
}