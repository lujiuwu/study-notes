###  Promise A+规范
> - 随着 `Promise` 在实际应用中的普及，对于一个统一和可预测的 `Promise` 行为标准的需求变得迫切，开发者需要一套清晰、一致的规则，以确保不同的代码库和应用可以无缝集成，并在不同的执行环境中保持相同的行为

* **Promise A+规范**在该需求以及环境下诞生，主要目标是提供一个最小的、可互操作的 `Promise` 设计，专注于提供一个简单而健壮的 `then` 方法

### Promise设计和构造方法
#### new的调用
> - Promise通过new调用进行使用，说明这是一个构造函数，进而创建Promise对象

```js
class MyPromise{

  constructor(executor) {

    executor()

  }

}

  

const my_promise = new MyPromise((resolve, reject) => {

  console.log("my-promise")

})


// my-promise
```

#### resolve & reject
我们还需要实现resolve和reject两个回调参数逻辑，做到以下两点：
* 改变状态
   - 状态一旦锁死就无法继续调用reject和resolve，但可以继续正常执行其他代码
   - 进入第二状态，then方法可以正常接收resolve或reject回调信息
* 异步信息传递

```js
// 状态

const PENDING = 'pending'

const FULFILLED = 'fulfilled'

const REJECTED = 'rejected'

  

class MyPromise{

  constructor(executor) {

    // 默认状态为pending

    this.status = PENDING

  

    // 回调函数

    const resolve = () => {

      // 状态判断

      if (this.status === PENDING)

        this.status = FULFILLED

        console.log("resolve被调用")

    }

    const reject = () => {

      if (this.status === PENDING) {

        this.status = REJECTED

        console.log("reject被调用")

      }

    }

  

    executor(resolve,reject)

  }

}

  

const my_promise = new MyPromise((resolve, reject) => {

  console.log("my-promise")

  resolve() // resolve被调用 -- 则reject不再被调用

  reject()

})

  

// my-promise
// resolve被调用
```

#### 异步信息传递
当异步信息传递resolve和reject中，需要进行接收，因此我们继续使用两个变量value和reason来进行接收，该变量值默认为undefined （按照Promise A+规定）
```js
// 状态

const PENDING = 'pending'

const FULFILLED = 'fulfilled'

const REJECTED = 'rejected'

  

class MyPromise{

  constructor(executor) {

    // 默认状态为pending

    this.status = PENDING

    // 默认回调函数参数值

    this.value = undefined

    this.reason = undefined

    // 回调函数

    const resolve = (value) => {

      // 状态判断

      if (this.status === PENDING)

        this.status = FULFILLED

        this.value = value

        console.log("resolve被调用,value为"+value)

    }

    const reject = (reason) => {

      if (this.status === PENDING) {

        this.status = REJECTED

        this.reason = reason

        console.log("reject被调用,reason为"+reason)

      }

    }

  

    executor(resolve,reject)

  }

}

  

const my_promise = new MyPromise((resolve, reject) => {

  console.log("my-promise")

  resolve("value") // resolve被调用 -- 则reject不再被调用

  reject("reason")

})

  

// my-promise

// resolve被调用,value为value
```

#### then方法和执行顺序
所需信息都已经被存储，我们如果需要验证信息是否成功被传递，需要通过then方法调用，因此需要编写then方法，在这里暂时需要注意几点：
* 参数一(onFulfilled)与参数二(onRejected)的参数顺序问题，兑现在前，拒绝在后 （命名也是规范）
* 执行顺序：
`调用new MyPromise时，executor里的内容会立即执行；实例方法then始终在new的后面，所以此时调用resolve或reject 内部的参数都只是默认的undefined而非传入的函数参数`

#### window接口的queueMicrotask方法（微任务）
```js
// 状态

const PENDING = 'pending'

const FULFILLED = 'fulfilled'

const REJECTED = 'rejected'

  

class MyPromise{

  constructor(executor) {

    // 默认状态为pending

    this.status = PENDING

    // 默认回调函数参数值

    this.value = undefined

    this.reason = undefined

    // 回调函数

    const resolve = (value) => {

      // 状态判断

      if (this.status === PENDING)

        this.status = FULFILLED

        this.value = value

        console.log("resolve被调用,value为" + value)

        // 微任务执行then方法

        queueMicrotask(()=>this.onFulfilled(value))

    }

    const reject = (reason) => {

      if (this.status === PENDING) {

        this.status = REJECTED

        this.reason = reason

        console.log("reject被调用,reason为" + reason)

        queueMicrotask(()=>this.onRejected(reason))

      }

    }

  

    executor(resolve,reject)

  }

  // then方法

  then(onFulfilled, oRejected) {

    this.onFulfilled = onFulfilled

    this.onRejected = oRejected

  }

}

  

const my_promise = new MyPromise((resolve, reject) => {

  console.log("my-promise")

  resolve("value") // resolve被调用 -- 则reject不再被调用

  reject("reason")

})

  

my_promise.then(res => {

  console.log(res)

})
```

#### then的返回值

**目前问题**
1. 调用then方法不传参数或者只传参数一或者传入的是Promise
2. 多次调用then方法，应该多次执行，但我们目前的代码只会执行单次
3. 当前我们是无法进行链式调用的，不管是链式then方法还是catch、finally方法 

**优化1：**
* then多次调用，就会多次执行，采用数组存储，每次调用将其存储进数组中，从数组中遍历调用
```js
// 状态

const PENDING = 'pending'

const FULFILLED = 'fulfilled'

const REJECTED = 'rejected'

  

class MyPromise{

  constructor(executor) {

    // 默认状态为pending

    this.status = PENDING

    // 默认回调函数参数值

    this.value = undefined

    this.reason = undefined

  

    // 回调函数数组

    this.onFulfilledArr = []

    this.onRejectedArr = []

    // 回调函数

    const resolve = (value) => {

      // 状态判断

      if (this.status === PENDING)

        this.status = FULFILLED

        this.value = value

        console.log("resolve被调用,value为" + value)

        // 微任务执行then方法 -- 循环遍历数组

        queueMicrotask(() => {

          this.onFulfilledArr.forEach(fn => {

            fn(this.value)

          })

        })

    }

    const reject = (reason) => {

      if (this.status === PENDING) {

        this.status = REJECTED

        this.reason = reason

        console.log("reject被调用,reason为" + reason)

        queueMicrotask(() => {

          this.onRejectedArr.forEach(fn => {

            fn(this.reason)

          })

        })

      }

    }

  

    executor(resolve,reject)

  }

  // then方法

  then(onFulfilled, onRejected) {

    /* this.onFulfilled = onFulfilled

    this.onRejected = oRejected */

    this.onFulfilledArr.push(onFulfilled)

    this.onRejectedArr.push(onRejected)

  }

}

  

const my_promise = new MyPromise((resolve, reject) => {

  console.log("my-promise")

  resolve("value") // resolve被调用 -- 则reject不再被调用

  reject("reason")

})

  

my_promise.then(res => {

  console.log("res1",res)

})

my_promise.then(res => {

  console.log("res2",res)

})
```

**优化2：**
需要灵活运用Promise的三个状态判断，在状态已经锁死的情况下，对后续而来的then方法进行"补票"调用
- pending状态时：正常处理，将失败与成功的数组添加到回调函数组内
- fulfilled状态时：直接执行then方法内的onFulfilled回调内容，并传递数据
- rejected状态时：直接执行then方法内的onRejected回调内容，并传递数据
```js
  then(onFulfilled, onRejected) {
    if(this.status === PENDING){
        this.onFulfilledArr.push(onFulfilled)

        this.onRejectedArr.push(oRejected)
    }
    if(this.status === REJECTED && onRejected) this.onRejected(this.reason)
    if(this.status === FULFILLED && onFulfilled) this.onFulfilled(this.value)
    

  }
```
**优化3：**
改变状态的操作应该放在queueMicrotask中：
- 因为queueMicrotask微任务之内的代码调用会稍迟一步，由同步代码先进行执行
- 如果改变状态部分像一开始时放在微任务外，一旦同步代码先执行，则状态先改变，后调用then方法。此时then方法中已经以判断状态为主进行处理，改变成锁死的状态，将无法执行正常pending状态判断内的逻辑代码，进而无法输出所需内容
- 因此需要将改变状态放入微任务内，执行then方法中对应回调函数后，再锁死状态，防止状态对应不上，无法通过判断

**优化4：**
二层限制异步：
- 如果没有在 `queueMicrotask()` 的回调中添加状态检查，可能会出现在状态已经被一个 `resolve()` 或 `reject()` 更改后，另一个 `resolve()` 或 `reject()` 再次尝试更改状态的情况。这种情况可能发生在复杂的异步流程中，或者当多个操作都试图解决同一个 Promise 时
- 确保状态一次性改变是 Promise 设计的关键要求，如果未能确保则会导致不符合预期的执行，如上方代码会resolve与reject同时执行或者同时多次执行

**优化5：**
实现链式调用，需要在then方法中返回一个MyPromise对象，有六种返回结果：
- 1、正常返回值 2、undefined，没有返回值 3、返回错误
- 4、5、6、返回三个阶段(兑现、拒绝、待定)的Promise
- 其中1、2、3需要通过Promise包裹一层，才能够实现链式调用

- 在手写then方法中，该执行位于`两个存储回调函数数组`的遍历执行中，并将其异步内容传递进去
```js
then(onFulfilled, onRejected) {  
  return new MyPromise((resolve, reject) => {  
    //其余内容暂时省略...  
    //在then方法中包裹一层属于自身的Promise  
    if (this.status === PENDING) {  
      this.onFulfilledFns.push(() => {  
        const value = onFulfilled(this.value)  
        resolve(value)  
      })  
      this.onRejectedFns.push(() => {  
        const reason = onRejected(this.reason)  
        return resolve(reason)  
      })  
    }  
  })  
}
```
* 抛出错误处理
```js
if (this.status === PENDING) {  
  this.onFulfilledFns.push(() => {  
    try {  
      //获取值  
      const value = onFulfilled(this.value)  
      resolve(value)  
    } catch(err) {  
      reject(err)  
    }  
  })  
  this.onRejectedFns.push(() => {  
    try {  
      //获取值  
      const reason = onRejected(this.reason)  
      resolve(reason)  
    } catch(err) {  
      reject(err)  
    }  
  })  
}
```
* 回调时捕获错误
```js
try {  
  executor(resolve, reject)  
} catch (err) {  
  reject(err)  
}
```

* 为了减少try...cacth...的重复率，封装一个工具函数抽取效果
```js
function execFunctionWithCatchError(execFn, value, resolve, reject) {
  // execFn -- 执行具体的业务逻辑
  try {  
    const result = execFn(value)  
    resolve(result)  
  } catch(err) {  
    reject(err)  
  }  
}
```
* 优化后：
```js
// 状态

const PENDING = 'pending'

const FULFILLED = 'fulfilled'

const REJECTED = 'rejected'

  

// 自定义错误捕获封装函数

function errFunction(exeFun,value,resolve,reject) {

  try {

    const result = exeFun(value)

    resolve(result)

    // 确保上一步操作的结果作为下一步结果的输出，连接Promise链各环节的数据

  } catch (err) {

    reject(err)

  }

}

  
  

class MyPromise{

  constructor(executor) {

    // 默认状态为pending

    this.status = PENDING

    // 默认回调函数参数值

    this.value = undefined

    this.reason = undefined

  

    // 回调函数数组

    this.onFulfilledArr = []

    this.onRejectedArr = []

    // 回调函数

    const resolve = (value) => {

      // 状态判断

      if (this.status === PENDING)

        queueMicrotask(() => {

          if (this.status !== PENDING) return

           this.status = FULFILLED

           this.value = value

           console.log("resolve被调用,value为" + value)

           this.onFulfilledArr.forEach(fn => {

             fn(this.value)

           })

        })

    }

    const reject = (reason) => {

      if (this.status === PENDING) {

        queueMicrotask(() => {

          if (this.status !== PENDING) return

           this.status = REJECTED

           this.reason = reason

           console.log("reject被调用,reason为" + reason)

           this.onRejectedArr.forEach(fn => {

             fn(this.reason)

           })

        })

      }

    }

  

    executor(resolve,reject)

  }

  // then方法

  then(onFulfilled, oRejected) {

    // 返回由MyPromise封装的数据

    return new MyPromise((resolve, reject) => {

      // 如果当前状态为FULFILLED，并且onFulfilled存在，则执行onFulfilled

      if (this.status === FULFILLED && onFulfilled) {

        // 执行操作时同时捕获错误

        errFunction(onFulfilled,this.value,resolve,reject)

      }

      // 如果当前状态为REJECTED，并且oRejected存在，则执行oRejected

      if (this.status === REJECTED && oRejected) {

        errFunction(oRejected,this.reason,resolve,reject)

      }

      if (this.status === PENDING) {

        this.onFulfilledArr.push(()=>errFunction(onFulfilled,this.value,resolve,reject))

        this.onRejectedArr.push(()=>errFunction(oRejected,this.reason,resolve,reject))

      }

    })

  }

}

  

const my_promise = new MyPromise((resolve, reject) => {

  console.log("my-promise")

  resolve("value") // resolve被调用 -- 则reject不再被调用

  reject("reason")

})

  

my_promise.then(res => {

  console.log("res1",res)

})

my_promise.then(res => {

  console.log("res2",res)

})
```

#### 边界判断
1. 当传入的不是值，而是一个Promise时，以当前Promise为返回值
2. 当传入的是带then方法的对象，也就是thenable时

#### catch
`Promise` 实例的 **`catch()`** 方法用于注册一个在 promise 被拒绝时调用的函数。它会立即返回一个等效的 `Promise`对象，这可以允许我们`链式`调用其他 promise 的方法。此方法是 `Promise.prototype.then(undefined, onRejected)` 的一种简写形式

1. promise在executor中调用reject方法，锁定rejected状态时调用的函数
2. 返回等效Promise对象，支持链式调用
3. then方法的简写形式(语法糖)

**具体实现：**
* 对于then进行处理，添加当resolve为undefined的逻辑
* catch内部调用 then(undefined,reject)
```js
  then(onFulfilled, onRejected) {  
    const defaultOnRejected = err => { throw err }  
    //使用方式1  
    onRejected = onRejected || (err => { throw err })  
    //使用方式2  
    onRejected = onRejected || defaultOnRejected  
    const defaultOnFulfilled = value => { return value }  
    onFulfilled = onFulfilled || defaultOnFulfilled  
  }
```

```js
catch(onRejected){
  return this.then(undefined,onRejected)
}
```

#### finally
`Promise`实例的 **`finally()`** 方法用于注册一个在 promise 敲定（兑现或拒绝）时调用的函数。它会立即返回一个等效的`Promise对象`，这可以允许我们**链式**调用其他 promise 方法
通过后续的说明，`finally()` 方法类似于调用 `then(onFinally, onFinally)`，也是语法糖的简写形式，但有以下几点不同需要注意：
```js
 then(onFulfilled, onRejected) {  
    //为空则为进入catch方法阶段，保证fulfilled状态的值成功传递  
    const defaultOnFulfilled = value => { return value }  
    onFulfilled = onFulfilled || defaultOnFulfilled  
  }
```

### Promise静态方法
#### resolve/reject
```js
static resolve(value){
  return new MyPromise((resolve)=>resolve(value))
}
static reject(reason){
  return new MyPromise((resolve,reject)=>reject(reason))
}
```
#### all
```js
static all(promises) {  
  // 问题关键: 什么时候要执行resolve, 什么时候要执行reject  
  return new MyPromise((resolve, reject) => {  
    //存储所有遍历resolve结果  
    const values = []  
    promises.forEach(promise => {  
      promise.then(res => {  
        //收集所有成功结果  
        values.push(res)  
        //promise全部正常调用resolve，返回存储所有内容的结果  
        if (values.length === promises.length) {  
          resolve(values)  
        }  
      }, err => {  
        //有一个拒绝状态，则直接返回err内容  
        reject(err)  
      })  
    })  
  })  
}
```
#### allSettled
> 与all的不同点在于：
1. 存储所有内容情况进行遍历
2. 区分resolve与reject状态依靠其存储结构为`[{},{}]`来完成，每一个遍历结果都为对象，对象内部除结果外，还存在一个状态码用以区分
```js
//allSettled方法的存储结构：返回内容+状态  
// [  
//   { status: 'fulfilled', value: 33 },  
//   { status: 'fulfilled', value: 66 },  
//   { status: 'fulfilled', value: 99 },  
//   { status: 'rejected', reason: Error: 一个错误 }  
// ]
```

```js
static allSettled(promises){
  return new Promise((resolve,reject)=>{
    const values = []
    promises.forEach(promise=>{
      promise.then(res=>{
        values.push({status:FULFILLED,value:res})
        if(values.length === promises.length) resolve(values)
      },
      err=>{
        values.push({static:REJECTED,reason:err})
        if(values.length === promises.length) resolve(values)
      }
    })
  })
}
```
#### race -- 接收数组参数，返回数组参数内调用最快的一个异步结果
```js
static race(promises){
  return new MyPromise((rosolve,reject)=>{
    promises.forEach(promise=>promise.then(resolve,reject))
  })
}
```
#### any -- 返回数组参数内`第一个调用成功的异步结果`或`全部拒绝状态的结果`

* AggregateError -- 是Error的子类，代表包装了多个错误对象的单个错误对象
```js
static any(promises) {  
  // resolve必须等到有一个成功的结果  
  // reject所有的都失败才执行reject  
  const reasons = []  
  return new MyPromise((resolve, reject) => {  
    promises.forEach(promise => {  
      promise.then(resolve, err => {  
        reasons.push(err)  
        if (reasons.length === promises.length) {  
          reject(new AggregateError(reasons))  
        }  
      })  
    })  
  })  
}
```








