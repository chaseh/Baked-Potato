/*
 * Author: Chase Hensel (chase.hensel@gmail.com)
 */

function Pegasos(k, d) {
  this.t = 1;
  this.learners = new Array(k); //a double array containing the 
  for(var i = 0, j; i < k; i++) {
    this.learners[i] = new Array(d);
    for(j = 0; j < d; j++) {
      this.learners[i][j] = 0.0; // initialize to zero
    }
  }
  this.guess;
  this.example;
};

Pegasos.prototype = {
  lambda : .01,
  constructor : Pegasos,
  MIN_VALUE : -1000000,
  
  predict : function(example) {
    this.example = example;
    var max = this.MIN_VALUE, tmp;
    for(var k = 0, lenk = this.learners.length; k < lenk; k++) {
      tmp = 0;
      for(var d = 0, lend = this.learners[0].length; d < lend; d++) {
        tmp += (this.learners[k][d] * example[d]);
      }
      if(tmp > max) { // if the current prediction is higher
        max = tmp;
        this.guess = k;
      }
    }
    return this.guess;
  },
  update : function(index) {
    var scalor, eta, lambda = this.lambda, learners = this.learners, tot, cnst;
    eta = 1/(lambda * this.t++);
    cnst = (1 - eta * lambda);
    for(var k = 0, lenk = this.learners.length; k < lenk; k++) {
      scalor = eta * ((index == k ? 1 : 0) - (this.guess == k ? 1 : 0));
      for(var d = 0, lend = learners[0].length; d < lend; d++) {
        learners[k][d] *= cnst;
        learners[k][d] += this.example[d] * scalor;
        tot += Math.pow(learners[k][d], 2);
      }
      if(tot > lambda) {
        tot = Math.sqrt((1/lambda) / tot);
        for(var d = 0, lend = learners[0].length; d < lend; d++) {
          learners[k][d] /= tot;
        }
      }
    }
  },
  getModel : function() {
    return this.learners;
  },
};