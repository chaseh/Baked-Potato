function Banditron(eta, k, d) {
  this.learners = new Array(k);
  for(var i = 0; i < k; i++) {
    this.learners[i] = new Array(d);
  }
  this.eta = eta;
  this.example = null;
};

Banditron.prototype = {
  constructor : Banditron,
  MIN_VALUE : -1000000,
  predict : function(example) {

  },
  negativeFeedback() : function() {
  
  }
};