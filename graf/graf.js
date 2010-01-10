/*
 * Author: Alex Komoroske (jkomoros@gmail.com)
 */

goog.provide("graf.App");

goog.require("graf.Surface");

graf.App = function() {
	this.surface = graf.Surface(this);
}