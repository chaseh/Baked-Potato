const MAX_VALUE = 100000, MIN_VALUE = 0; 
var MathUtil = {
  mapReduce : function(val, mapper, reducer) {
    if(mapper typeof function) {
      for(var i = 0, len = val.length; i < len; i++) {
        val[i] = mapper(val[i]);
      }
    }
    if(reducer typeof function) {
      return reducer(val);
    } else {
      return val;
    }
  },
  avg : function(val) {
    return mapReduce(val, null, 
      function() { 
        for(var i = 1, len = val.length; i < len; i++) {
          val[0] += val[i];
        }
        return val[0] / len;
      });
  },
  min : function(val) {
    return mapReduce(val, null, 
      function() { 
        var ans = MAX_VALUE;
        for(var i = 0, len = val.length; i++) {
          ans = (val[i] < ans ? val[i] : ans);
        }
        return ans;
      });
  },
  max : function(val) {
    return mapReduce(val, null, 
      function() { 
        var ans = MIN_VALUE;
        for(var i = 0, len = val.length; i++) {
          ans = (val[i] > ans ? val[i] : ans);
        }
        return ans;
      });
  }
}
