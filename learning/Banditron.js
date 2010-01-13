/*
 * Author: Chase Hensel (chase.hensel@gmail.com)
 */

function Banditron(eta, k, d) {
  this.learners = new Array(k); //a double array containing the 
  for(var i = 0, j; i < k; i++) {
    this.learners[i] = new Array(d);
    for(j = 0; j < d; j++) {
      this.learners[i][j] = 0; // initialize to zero
    }
  }
  this.eta = eta;
  this.guess;
  this.example;
  this.maxIndex;
};

Banditron.prototype = {
  constructor : Banditron,
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
        this.maxIndex = k; 
      }
    }
    
    this.guess = Math.random(); // guess a uniform random number
    if(this.guess < (1 - this.eta)) { // assign lower 1-eta of proability to predicted label
      return this.guess = this.maxIndex;
    } else { 
      // Otherwise scale the rest of the probability space back to (0,1) and sample uniformly from it
      //starts out between (1 - eta, 1) --> subtract (1 - eta) from both sides 
      this.guess -= (1 - this.eta);//--> (0, eta) --> divide by eta
      this.guess /= this.eta  // --> (0, 1);
      return Math.floor(this.guess * lenk); //return a proper index
    }
  },
  update : function(feedback) {
    var invProb, scalor;
    for(var k = 0, lenk = this.learners.length; k < lenk; k++) {
      //this is messy but it corectly computes the scalor
      invProb = this.maxIndex == k ? 1 / (1 - this.eta + this.eta / lenk) : lenk / this.eta;
      scalor = invProb * (feedback ? 1 : 0) * (this.guess == k ? k : 0) - (this.maxIndex == k ? 1 : 0);
      for(var d = 0, lend = this.learners[0].length; d < lend; d++) {
        this.learners[k][d] += this.example[d] * scalor;
      }    
    }
  }
};