function where(obj,predicate) { 
    if (obj instanceof Array) {
      for (var i = 0; i < obj.length; i++) { 
        var result = predicate(obj[i])
        if (result) {
          return obj[i]
        }
      }
      return null
    }
    throw new Error('Where function accept only array')
}
  
function whereIndex(obj,predicate) { 
    if (obj instanceof Array) {
      for (var i = 0; i < obj.length; i++) { 
        var result = predicate(obj[i])
        if (result) {
          return i
        }
      }
      return null
    }
    throw new Error('Where function accept only array')
}
  