var MathUtil = {
  MAX_VALUE : 100000,
  MIN_VALUE : 0,
  mapReduce : function(val, mapper, reducer) {
    if(typeof mapper == "function") {
      for(var i = 0, len = val.length; i < len; i++) {
        val[i] = mapper(val[i], i);
      }
    }
    return (typeof reducer == "function") ? reducer(val) : val;
  },
  avg : function(val) {
    return this.mapReduce(val, null, 
      function() {
        var ans = 0;
        for(var i = 0, len = val.length; i < len; i++) {
          ans += val[i];
        }
        return ans / len;
      });
  },
  min : function(val) { 
    var ans = this.MAX_VALUE;
    for(var i = 0, len = val.length; i < len; i++) {
      ans = (val[i] < ans ? val[i] : ans);
    }
    return ans;
  },
  max : function(val) {
    var ans = this.MIN_VALUE;
    for(var i = 0, len = val.length; i < len; i++) {
      ans = (val[i] > ans ? val[i] : ans);
    }
    return ans;
  },
}
