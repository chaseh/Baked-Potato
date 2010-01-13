function Perceptron(k, d) {
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

Perceptron.prototype = {
  constructor : Perceptron,
  predict : function(example) {
    this.example = example;
    var max = 0, tmp, learners = this.learners;
    for(var d = 0, lend = this.learners[0].length; d < lend; d++) {
        max += (this.learners[0][d] * example[d]);
    }
    for(var k = 1, lenk = learners.length; k < lenk; k++) {
      tmp = 0;
      for(var d = 0, lend = learners[0].length; d < lend; d++) {
        tmp += (learners[k][d] * example[d]);
      }
      if(tmp > max) { // if the current prediction is higher
        max = tmp;
        this.guess = k;
      }
    }
    return this.guess;
  },
  update : function(index) {
    var scalor, learners = this.learners;
    for(var k = 0, lenk = this.learners.length; k < lenk; k++) {
      scalor = (index == k ? 1 : 0) - (this.guess == k ? 1 : 0);
      if(scalor == 1) {
        for(var d = 0, lend = learners[0].length; d < lend; d++) {
          learners[k][d] += this.example[d];
        }
      } else if(scalor == -1) {
        for(var d = 0, lend = learners[0].length; d < lend; d++) {
          learners[k][d] -= this.example[d];
        }      
      }
    }
  },
  getModel : function() {
    return this.learners;
  },
};