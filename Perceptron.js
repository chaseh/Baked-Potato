function Perceptron(k, d) {
  this.learners = new Array(k); //a double array containing the 
  for(var i = 0, j; i < k; i++) {
    this.learners[i] = new Array(d);
    for(j = 0; j < d; j++) {
      this.learners[i][j] = 0; // initialize to zero
    }
  }
  this.guess;
  this.example;
};

Perceptron.prototype = {
  constructor : Perceptron,
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
    var invProb, scalor;
    for(var k = 0, lenk = this.learners.length; k < lenk; k++) {
      //this is messy but it corectly computes the scalor
      scalor = (index == k ? 1 : 0) - (this.guess == k ? 1 : 0);
      for(var d = 0, lend = this.learners[0].length; d < lend; d++) {
        this.learners[k][d] += this.example[d] * scalor;
      }    
    }
  }
};