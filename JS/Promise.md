> Promise是一个类 

### API
- 当我们需要给予调用者一个承诺：待会儿我会给你回调数据时，就可以创建一个Promise的对象
### Promise的回调函数
- 在通过new创建Promise对象时，我们需要传入一个回调函数，我们称之为executor
  - 这个回调函数会被立即执行，并且给传入另外两个回调函数resolve、reject
    
  - 当我们调用resolve回调函数时，会执行Promise对象的then方法传入的回调函数
    
  - 当我们调用reject回调函数时，会执行Promise对象的catch方法传入的回调函数
#### resolve
在Promise的excutor回调中，resolve方法可以传递成功消息value
##### 传递值表达形式
* **Promise** -- 一旦传递Promise或其子类，且value.constructor === Promis,那么 `Promise.resolve()` 直接返回 `value`
  那么当前的Promise状态，则由传递进去的Promise所决定，相当于状态进行移交
* **带有then的对象** -- 执行then方法且由该then方法决定后续状态，
  一样会进行接力棒交接，因此正常Promise的then方法内所执行的是obj对象的then方法
### 状态
* pending -- 待定
* fulfilled -- 已实现
* rejected -- 已拒绝
#### 状态不可逆
- 一旦状态被确定下来(非待定状态)，Promise的状态会被`锁死`，该Promise的状态是不可更改的
- 在我们调用resolve的时候，如果resolve传入的值本身不是一个Promise，那么会将该Promise的状态变成`兑现（fulfilled）`
- 在锁定之后我们去调用reject时，已经不会有任何的响应了（并不是这行代码不会执行，而是无法改变Promise状态）
- 锁定状态无法改变，但正常代码可以正常往后执行

### 受诺方
- 我们可以将`resolve`和`reject`这两个回调函数理解为一个通知宣告，宣告我完成了该承诺或者失败了，但不管是哪一个回调，都会给对方带来信息

  - `承诺方`通过两个回调发出了具体消息，`受诺方`要如何拿到该消息呢？
    
  - 答案是通过then方法与catch方法，这两个方法是`受诺方`所具备的
    
  - 当承诺方resolve回调(信息传出)，受诺方then方法接收(参数信息)
    
  - 当承诺方reject回调(信息传出)，受诺方catch方法接收(参数信息)

### 链式调用
> `连续处理多个异步操作，每个操作都可以基于前一个操作的结果`的方式

### Promise对象方法
> Promise分为对象方法和类方法，在MDN文档中分别表示为`实例方法`和`静态方法`

#### 为什么要区分两类
主要原因在于**静态方法 不依赖具体的Promise实例**

- 因此静态方法可以直接调用，不用基于new出来的Promise调用，非常适合封装各种`工具函数`
    
- 而三个实例方法(`then(),finally(),catch()`)则必须基于executor锁定状态后返回的二阶段Promise才能调用，无法基于已经存在的Promise构造函数直接调用
    
- 因为该三个方法由于需要访问和操作与特定 Promise 实例相关的状态（例如，pending、fulfilled 或 rejected）且允许链式调用的特性，因此无法独立调用才会归类到实例方法中，前者是最主要的原因

#### 实例方法 -- then
> 它其实是放在Promise的原型上的 Promise.prototype.then

- 最多接收两个参数：onFulfilled与onRejected，分别对应兑现状态与拒绝状态
    
- 一般情况下，我们只会接收一个兑现状态的参数，其拒绝状态交给catch处理

##### 多次调用then(不是多次链式调用)
* 在同一个Promise上可以多次调用then，每个调用都会注册一个回调函数，当Promise解决时都会执行
- 当我们promise的resolve方法被回调时，所有基于该promise的then方法都会被调用
```js
const promise = new Promise()
promise.then(res=>{})
promise.then(res=>{})
```
##### then的具体返回值
- 传入then方法的回调函数具备返回值的功能，我们可以返回一个具体内容
- 内容可以是一个普通值，那么该值会作为一个新的Promise的resolve值

- 由于`返回的普通值会被包装为一个Promise`，所以可以在该基础上继续调用then方法，这是能够使用链式调用的原因
- 如果不设置返回值，则返回值默认由JS引擎设置为undefined，不能在undefined基础上进行任何调用，否则报错
- 如果直接返回一个新的 `Promise`，后续的 `then` 调用会等待这个 `Promise` 解决后继续执行。这提供了对异步操作更细粒度的控制

* 返回一个具有 `then` 方法的对象（`thenable` 对象）。这允许自定义解决过程，JS 引擎会像处理正常 `Promise` 那样处理 `thenable` 对象

#### 实例方法 -- catch
##### 两种调用方式
* 隐式调用 -- then方法第二参数 onRejected
  `阅读性差 不推荐；Promise A+中规定使用隐式`
* 显式调用 -- then方法之后接着链式调用catch方法 -- 相当于then的语法糖
  `但ES6中在实现Promise时，为了让代码阅读性更强，编写更方便，提供了第二种显式写法`

```js
// 隐式调用  
promise.then(undefined,err => {  
  console.log(err);  
})  
// 显式调用  
promise.then().catch(err => {  
  console.log(err);  
})
```

##### 返回值
- 调用catch方法时，相当于手动返回了一个Promise二阶段(rejected状态)
#### 实例方法 -- finally
* - finally方法内只有一个异步执行函数，调用该函数时不带任何参数，因为无论前面是fulfilled状态，还是rejected状态，它都会执行，不管上一个阶段返回什么状态的Promise
* 该`finally规范`在Promise A+规范中也是没有的，和catch方法一样，依旧是ES6及之后由ECMA实现Promise时所扩展的特殊方法

##### 阶段一返回错误信息到阶段二
有两种方式：
* reject()方法
* throw new Error() 抛出异常

**详解throw new Error( )**
* 这会导致promise的状态变为rejected 并可以被后续的 `catch` 方法捕获
* 写在`new Error`内的信息通常为错误类型及描述，和注释作用类似
* 终端显示的信息主要来自`堆栈跟踪`，这部分信息提供了错误发生时的具体位置和调用栈路径。主要目的在于帮我们了解错误发生的上下文，以及调用过程中涉及的函数
* 可以通过分析堆栈跟踪和错误信息，识别处理代码中的潜在问题或设计缺陷

这通常被认为是一种良好的实践；否则，执行捕获的部分将不得不对参数进行检查，以查看它是字符串还是错误，并且可能会丢失有用的信息，例如堆栈跟踪

**错误信息丰富度**
在不同地方所抛出的错误信息丰富度也不同，在executor阶段所抛出的是整个调用栈，而在then方法中抛出的错误信息就只有我们所抛出的部分：错误类型、错误信息(开发者给出的注释)、错误发生的具体位置
### Promise类方法
* resolve -- 将现有数据转换为 Promise 对象；启动一个Promise链；处理thenable对象；确保Promise完整性
* reject -- 传入参数reason，无论reason是什么类型的值，返回结果都是rejected类型的Promise，且拒绝理由是该参数；不进行任何额外的处理或状态检查
* all -- 传入Promise对象数组， 返回一个新的Promise实例：当所有对象的状态fulfilled，为fulfilled 所有结果作为数组传给fulfilled回调
  `问题：- 那么对于resolved的，以及依然处于pending状态的Promise，我们是获取不到对应的结果的`
* allSettled -- 在所有对象都有结果（rejected&fulfilled）才有结果；且返回结果一定是fulfilled
* race -- 哪个对象先有结果就用谁的结果；这在多源数据获取或具有多个备用请求的网络请求中特别有用，可以减少等待时间快速响应，提高应用性；实现超时机制
* any -- 该方法会等到一个fulfilled状态才会决定新的Promise状态；- 如果**所有的Promise都是reject**的，那么**也会等到所有的Promise都变成rejected状态**


### 堆栈跟踪
堆栈跟踪（Stack Trace），也称为堆栈回溯或调用栈
是一个非常重要的调试工具，用于展示程序执行时函数调用过程中的函数栈帧。程序中发生异常或错误时，堆栈跟踪负责提供一系列信息，指明错误发生时程序调用链的`具体点`。让开发者快速`定位问题原因`，理解错误发生时`程序的状态和上下文`
#### 内部包含部分
* 函数调用列表 -- 显示导致异常或错误的函数调用序列
* 文件信息 -- 显示导致错误的代码所在的文件名，有时还包括路径
* 行号 -- 指出错误发生的具体代码行
* 列号 -- 指出错误发生的具体代码列
* 错误信息 --  抛出异常或错误的描述



