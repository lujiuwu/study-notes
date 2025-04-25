// 监听obj变化
const obj = {
  name: "name",
  age:12
}
const info = {
  s_no: 1,
  address:"address"
}

class Depend{
  constructor(){
    this.dependArr = []
  }
  addDepend(fn){
    this.dependArr.push(fn)
  }
  notify(){
    this.dependArr.forEach(item=>item())
  }
}

// let depend = new Depend()
let activeReactiveFn = nul

function watchFn(fn){
  activeReactiveFn = fn
  fn()
  activeReactiveFn = null
}

const targetMap = new WeakMap()
function getDepend(target,key){
  const map = targetMap.get(target)
  if(!map){
    map = new Map()
    targetMap.set(target,map)
  }
  const depend = map.get(target)
  if(!depend){
    depend = new Depend()
    map.set(key,depend)
  }
  return depend
}

const objProxy = new Proxy(obj,{
  set:function(target,key,newArr,receiver){
    Reflect.set(target,key,newArr,receiver)
    // 通知响应
    const depend = getDepend(target,key)
    depend.notify()
  },
  get:function(target,key,receiver){
    const depend = getDepend(target,key)
    // 怎样获取函数？ -- 设置全局对象
    depend.addDepend(fn)
    return Reflect.get(target[key],receiver)
  }
})

watchFn(
  function(){
    console.log("change name"+objProxy.name)
})

watchFn(
  function(){
    console.log("chang age"+objProxy.age)
})

objProxy.name = "name1"