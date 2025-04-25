// 第一种方法 -- JSON
let obj = {}
let clone_obj = JSON.parse(JSON.stringify(obj))

// 第二种方法 -- 手写深拷贝
function clone(target, map = new WeakMap()) {
  if (typeof target === "object") {
    let cloneTarget = Array.isArray(target) ? [] : {}
    if (map.has(target)) return map.get(target)
    else {
      for (const key in target) {
        cloneTarget[key] = clone(target[key],map)
      }
    }
    return cloneTarget
  }
  else return target
}

// 防抖
function debounce(fun, wait, immediate) {
  let timeout, result
  return function () {
    let context = this
    let args = arguments
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      let callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) result = fun.apply(context, args)
    } else {
      timeout = setTimeout(function () {
        fun.apply(context, args)
      },wait)
    }
    return result
  }
}

// 节流
function throttle(func,wait){
  var timeout
  return function(){
    var context = this
    var args = arguments
    if(!timeout){
      timeout = setTimeout(()=>{
        timeout = null
        func.apply(context,args)
      },wait)
    }
  }
}

// 数组扁平化
function flat(arr, depth = 1) {
  if (depth > 0) {
    // 以下代码还可以简化，不过为了可读性，还是....
    return arr.reduce((pre, cur) => {
      return pre.concat(Array.isArray(cur) ? flat(cur, depth - 1) : cur);
    }, []);
  }
  return arr.slice(); // 返回浅拷贝
}

// 手写reduce
Array.prototype.reduce = function (cb, initialValue) {
  const arr = this;
  let total = initialValue || arr[0];
  // 有初始值的话从0遍历，否则从1遍历
  for (let i = initialValue ? 0 : 1; i < arr.length; i++) {
    total = cb(total, arr[i], i, arr);
  }
  return total;
};

// 判断相等
function isEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
        return false;
    }
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length!== keysB.length) {
        return false;
    }
    for (let key of keysA) {
        if (!keysB.includes(key) ||!isEqual(a[key], b[key])) {
            return false;
        }
    }
    return true;
}    