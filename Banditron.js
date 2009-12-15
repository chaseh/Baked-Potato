function Banditron(eta, k, d) {
  this.learners = new Array(k);
  for(var i = 0, j; i < k; i++) {
    this.learners[i] = new Array(d);
    for(j = 0; j < d; j++) {
      this.learners[i][j] = 0;
    }
  }
  this.eta = eta;
  this.k = k; 
  this.d = d;
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
    for(var i = 0, leni = this.k; i < leni; i++) {
      tmp = 0;
      for(var j = 0, lenj = this.d; j < lenj; j++) {
        tmp += (this.learners[i][j] * example[j]);
      }
      if(tmp > max) {
        max = tmp;
        this.maxIndex = i; 
      }
    }
    this.guess = Math.random();
    if(this.guess > (1 + 1 / this.k) * this.eta) {
      return this.guess = this.maxIndex;
    } else {
      this.guess = Math.floor(this.guess * this.k / this.eta);
      return this.guess = (this.guess >= this.maxIndex ? this.guess + 1 : this.guess);
    }
  },
  update : function(feedback) {
    var invProb, scalor;
    for(var i = 0, leni = this.k; i < leni; i++) {
      for(var j = 0, lenj = this.d; j < lenj; j++) {
        //this is messy but it corectly computes the scalor
        invProb = (this.maxIndex == i ? 1 / ((1 + 1 / this.k) * this.eta) : this.k / this.eta);
        scalor = invProb * (feedback ? 1 : 0) * (this.guess == i ? 1 : 0) - (this.maxIndex == i ? 1 : 0);
        this.learners[i][j] += this.example[j] * scalor;
      }    
    }
  }
};