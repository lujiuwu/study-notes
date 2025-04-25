function composeFn(...fnArgs) {
  // 判断是否为函数
  for (let i = 0; i < fnArgs.length; i++){
    if(typeof fnArgs[i] !== 'function') {
      throw new TypeError('Expected a function')
    }
  }
  // 返回组合函数
  return (...args) => {
    let index = 0
    let result = fnArgs[index].apply(this, args)
    while(++index < fnArgs.length) {
      result = fnArgs[index].call(this, result)
    }
    return result
  }
}
function fn1(num) {
  return num+1
};

function fn2(num) {
  return num+2
};

let num = 2
console.log("res",composeFn(fn1,fn2)(num))
