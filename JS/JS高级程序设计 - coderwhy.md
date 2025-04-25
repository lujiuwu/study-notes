> JS是一门高级的编程语言\解释性语言（接近人类的思维方式）
> 
> `计算机语言：机器语言 -> 汇编语言 -> 高级语言`
> 
> 实际上，计算机本身是不认识高级语言的，所以我们的代码最终还是会转换为机器指令


# 浏览器的工作原理
## 浏览器运行JS代码
* 浏览器输入网址，DNS解析域名
* 打开index.html网页
* 浏览器解析该index.html网页：遇到CSS则下载，遇到JS则下载
![](JS/noteImg/Pasted%20image%2020250330135927.png)
## 浏览器的内核
> CSS文件与JS文件谁来解析？ -- 浏览器内核

* 我们经常会说，不同的浏览器有自己不同的内核组成
* 如：Gecko，Trident（IE4-IE11），Webkit（谷歌，苹果），Blink（是Webkit的一个分支，谷歌开发，目前用于谷歌，Edge等）
* 我们常说的浏览器内核指的是**浏览器的排版引擎**，也称`排版引擎，浏览器引擎，页面渲染引擎，样板引擎`（无官方说法）

## 浏览器渲染过程
![](JS/noteImg/Pasted%20image%2020250330141440.png)
* HTML Parser解析HTML生成DOM树；CSS Parser解析CSS生成规则树
* DOM树与规则树结合在一起生成渲染树（Render Tree）
* 布局引擎对于渲染树进行具体操作和布局，最后进行绘制与展示
   `为什么需要布局引擎？ 不同浏览器的不同尺寸对于元素的呈现效果不同`
* 在执行过程中，遇到JS标签：会停止解析HTML而去加载和执行JS代码

# JS引擎 -- JS代码的执行
> JS代码是由JS引擎帮助执行的

### 为什么需要JS引擎
* 高级的编程语言都是需要转成机器指令来执行的
* 我们编写的JS无论是交给浏览器还是Node执行最终都是需要被`CPU`执行的
* 但是CPU只认识自己的指令集，实际上是机器语言，才能被CPU执行
* 所以我们需要JS引擎帮助我们将JS代码翻译成CPU指令来执行
### 常见的JS引擎
* SpiderMonky -- 第一款JS引擎，由JS作者开发
* Chakra -- 微软开发，用于IE浏览器
* JSCore -- Webkit所用
* **V8** -- 谷歌开发，帮助Chrom从众多浏览器中脱颖而出

### 浏览器内核与JS引擎的关系
> 以Webkit为例，实际上Webkit由两部分组成：
> * WebCore -- 负责HTML解析，布局和渲染等工作
> * JSCore -- 解析执行JS代码
> `小程序中的JS代码就是被JSCore执行的`

### V8引擎
> V8引擎使用`C++编写`的谷歌`开源`性能JS和WebAssembly引擎（两种代码都可以执行）；用于Chrome和node.js等

* V8引擎实现ECScript和WebAssembly，可多个平台与系统运行
* V8引擎可以`独立运行`，也可以嵌入到任何C++应用程序中
* 源码复杂
#### 原理
**V8引擎架构图**
![](JS/noteImg/Pasted%20image%2020250330160014.png)
* JS代码进行Parse(即解析，包括`词法分析:生成tokens数组，数组内是json对象，属性为key与value;语法分析:根据键值对分析语法，生成对应的AST树，即抽象语法树`)
* 为什么要转换AST树：树的结构固定，做转换与操作时都会更方便，如转成ES5代码或者字节码
* 转换字节码ytecode：ignition；为什么要转成字节码：JS代码运行的环境不一定（windows,linux,mac,node)，而不同的CPU架构能够执行的机器指令是不一样的 --> 则需要转为字节码，它们本身是跨平台的，到真正需要运行的时候则将字节码转为具体的CPU指令（会经历一个汇编指令的转换）
* babel 即 ts -> js ：ts代码转为抽象语法树，再修改生成新的抽象语法树，再进行generate code，生成JS代码
* vue template也有运用


* 上述转换影响性能 --> 能不能将字节码直接转换为机器指令，提高效率
* **TurboFan** -- ignition收集执行信息，将执行频率高的函数标记为hot（热函数），将其转换为优化的机器码，方便后续执行
* 参数变化呢？当优化无法使用，--> Deop --> 当下次执行机器指令的操作不一样进行反向优化，机器指令转为字节码再做一次转换，在CPU上执行
* **调用函数时尽量传入相同类型**
* TS代码 --> 为参数加类型 --> 运行效率高，不允许参数类型随便变化，则效率更高

#### 模块

![](JS/noteImg/Pasted%20image%2020250331165412.png)

#### 解析图
![](JS/noteImg/Pasted%20image%2020250331170415.png)
* Blink(内核)：解析HTML，遇到JS代码并进行下载
* Stream(流)：内核以流的形式将JS代码传给V8
* Scanner(扫描器)：进行词法分析
* tokens --> Parser --> ignition ...
![](JS/noteImg/Pasted%20image%2020250331170948.png)
#### 预解析PreParser / lazy Parsing
* 为什么要有预解析：并不是所有代码在一开始就会被执行
```js
function outer(){
  function inner(){
    ...
  }
}

outer()
```
* inner没有运行 --> inner不进行解析 --> 只对inner进行预解析，简单的解析
* 目的 -- 提高性能



# JS的执行
## 全局代码执行

**例**
```js
var name = "why"
var num1 = 1
var num2 = 2
var num3 = num1 + num2
```
### 变量提升

* 运行之前 -- 代码解析，V8引擎内部会帮助我们创建一个对象`GlobalObject`
     * GlobalObject内包含一系列全局对象以及**window属性**
     * GlobalObject也称go
     * window属性指向GlobalObject对象本身
     * window.window.window... 还是本身
     * 解析时，我们所定义的变量也会被放到全局对象中，但此时并未赋值，即值为`undefined`
 * 运行代码
     * 为了运行代码，V8引擎内部有一个东西 -- **执行上下文栈(函数调用栈)**
     * 执行上下文栈（Execution Context ECStack）
     * 代码执行时必须入栈；执行完则会出栈
     * 一般是函数入栈
     * 执行`全局代码`时，需要创建**全局执行上下文(Global Execution Context) 即GEC**
     * GEC放入ECStack
     * 全局执行上下文内包含：**VO，指向GO**
 * 正式执行代码
     * 依次执行代码
     * 通过VO查找GO -- 更新存在的值 `var name = "why"`
     * 准备阶段已经为GlobalObject新增了声明的变量，执行时赋值
     * 操作（如打印），还是从VO找GO
     * 变量提升

### 函数提升

```js
function foo(){
  ...
}
// foo/bar是一个命名习惯
```

#### 调用顺序

```js
foo()
function foo(){
  ...
}

// 函数体内的代码依然可以正常执行
```

* 解析/编译阶段
     * 当解析时发现函数，全局对象GO生成属性，会在内存里创建一个函数对象，主要包含`父级作用域[[scope]](函数上一层，全局作用域GO)与函数执行体(代码块)`
     * 一旦开辟空间，就会存在对应的内存地址(如0xa00)，则GO内的函数属性包含的是内存地址，即存在一个`引用关系`
* 执行阶段
     * 当执行时发现`执行函数`，则在VO->GO中查找，发现其值为内存地址，则根据该内存地址找到对应空间
     * ()表示函数执行，则将函数放入调用栈ECStack
     * 在调用栈创建一个**函数执行上下文FEC**
     * 在 FEC 中也存在一个VO` -> AO`
     * AO（ActivationObject）指的是一个对象（后面会被销毁）
     * AO对象内部放什么？ 对于一个函数，可能会接收参数以及在函数体内定义一系列属性，那么这些内容在解析阶段会提升至AO
     * 与GO类型 ，解析阶段只会赋值undefined
```js
foo(123) // 执行阶段 num赋值123
function foo(num){
  console.log(m) // 执行阶段，AO内的m为undefined
  var m = 1 // m赋值为1
  console.log(m) // 执行阶段，m为1
}

foo(321) // 创建新的执行上下文，重新执行一次
```
* 函数执行完毕
     * 函数执行上下文会弹出栈
     * 函数执行上下文会进行销毁
     * AO也会销毁


### 作用域链

```js
var name = "why"
function foo(){
  console.log(name) // why 
}
```

#### 概念
> **JS中的变量查找规则**：当我们查找一个变量时，它的真实查找路径是沿着作用域链查找的

**作用域链 -- scope chain**
> 	scope chain === AO + 父级作用域ParentScope

* 父级作用域 -- 在编译阶段就已经确定
* GO 或者嵌套函数的上一层

**函数的嵌套**
```js
var name = "why"
foo()
function foo(num){
  console.log(m)
  function bar(){
    console.log(name)
  }
  // bar函数在一开始只是预编译
  // 在内存里需要一个单独的存储空间
  // 编译时，AO内的bar指向该空间的内存地址
  bar()
  // 执行bar函数，会创建一个新的函数执行上下文
  // bar的AO内不存在name -> 查找上层作用域foo的AO
  // foo的AO内不存在 -> 沿着作用域向上查找 -> name === "why"

  // bar执行完 -- bar的FEC弹出调用栈
  // foo执行完 -- foo的FEC弹出调用栈
}
// 输出：--- why
```

**window的name属性**
* window本身存在一个name属性
* 即使全局未定义，输出时沿着作用域链查找到GlobalObject.name

#### 函数调用函数的执行过程
```js
var message = "helloWorld"
function foo(){
  console.lo(message) // helloGlobal
}

function bar(){
  var message = "helloBar"
  foo()
}

bar()
```
* 输出 helloGlobal
* foo定义在全局 -> 父级作用域为全局 即GO

### 作用域补充
#### 定义变量时不使用var
```js
function foo(){
  m = 100
}
console.log(m) // 100
```
* JS引擎对于**特殊语法**的处理：m定义在全局对象里面
### 作用域提升面试题
```js
var n = 100
function foo(){
  n = 200
}
foo()

console.log(n)
```

* GO : { n == undefined , foo == 内存地址}
* foo AO : { }
* 执行阶段：GO.n == 100 ; GO.n == 200
* 输出：200

```js
function foo(){
  console.log(n)
  var n = 200
  console.log(n)
}
var n = 100
foo()
```

* GO : { foo : 内存地址 , n : undefined}
* AO : { n : undefined }
* 执行阶段：GO.n == 100 ; foo : 输出值为undefined的n, AO.n == 200,输出200
* AO中是存在n的，只是值为undefined
* 输出结果： unbdefined , 200

```js
var n = 100
function foo1(){
  console.log(n)
}

function foo2(){
  var n = 200
  console.log(n)
  foo1()
}
foo2()
console.log(n)
```
* 编译阶段
     * GO : { n : undefined , foo1 : 内存地址 , foo2 : 内存地址 }
     * foo1 AO : {  }
     * foo2 AO : { n : undefined }
* 执行阶段
     * foo2(  ) -- foo2 AO.n = 200 , c.log( n == 200 )
     * foo2(  ).foo1(  ) -- foo1 AO不存在n --> 查找GO.n --> c.log( n == 100 )
     * c.log( n ) -- 100
 * 输出结果：`200,100,100`


```js
var a = 100
function foo(){
  console.log(a)
  return
  var a = 100
}
foo()
```
* **return之后的代码依然存在于AO中**，则打印a时会找到自己作用域的a，即undefined

```js
function foo(){
  var a = b = 10
}
foo()
console.log(a)
console.log(b)
```
* `var a = b = 10` 转换为：
     * var a = 10
     * b = 10

* 输出：error , 10


### 变量环境和记录
#### 早期ECMA规则
> AO GO VO等都是基于`早期ECMA的版本规范`，即ES5以前

* 每一个执行上下文会被关联到一个变量环境`VO`，在源代码中的`变量和函数声明`会被`作为属性`添加到VO中
* 对于函数，参数也会添加到VO中

#### ES5及以后的规则
**在最新的ECMA的版本规范中，对于一些词汇进行了修改**
* 每一个执行上下文会关联到一个`变量环境(Variable Enviroment) VE`
* 在执行上下文中变量和函数声明会作为`环境记录(Enviroment Record) ER`**绑定**到变量环境中
* 对于函数来说，参数也会作为环境记录添加到变量环境中


## 内存管理

> 不管是什么编程语言，在代码执行过程中都是需要给它**分配内存**的
> 不同的是某些编程语言都需要我们自己**手动管理内存**，某些编程语言可以**自动帮助我们管理内存**

**管理内存的生命周期**
* 分配`申请`需要的内存
* `使用`分配的内存
* 不需要时对内存进行`释放`

**不同的编程语言对于第一步和第三步有不同的实现**
* 手动管理内存：C,C++ ...（malloc和free函数）
* 自动管理内存：JAVA,JS,Python,Swift,Dart ...

### JS中的内存管理

**JS在定义变量时分配内存**
* 对于`基本数据类型`内存的分配会在执行时直接在`栈空间`进行分配
* 对于`复杂数据类型`内存的分配会在`堆内存`中开辟一块空间，并将这块空间的`指针`返回值变量引用

### JS的垃圾回收

> 因为内存的大小是**有限的**，所以当有些内存不再使用时，我们需要对其进行**释放**，以便腾出更多的内存空间

* 在手动管理内存的语言中，我们需要一些方法来释放不再需要的内存，比如free函数
   `这种方式非常的低效，影响我们编写代码的效率；对于开发者的要求也很高，一不小心就会产生内存泄漏`
* 所以大部分的现代编程语言都是有自己的垃圾回收机制
     * 垃圾回收的英文是`Garbage Collection` 简称**GC**
     * 对于那些不再使用的对象，我们都称之为`垃圾`，需要被回收以释放更多的内存空间
     * JS的运行环境，即JS引擎中内置了**垃圾回收器**，垃圾回收器也简称`GC`

#### GC算法

> 那么垃圾回收器怎么知道哪些对象不再使用呢，这就需要引入**GC算法**
##### 引用计数

**概念**
* 其思路是对每个值都记录它被引用的次数`retain count`
* 声明变量并给它赋一个引用值时，这个值的引用数为 1。如果同一个值又被赋给另一个变量，那么引用数加 1。类似地，如果保存对该值引用的变量被其他值给覆盖了，那么引用数减 1
* 当一个值的引用数为 0 时，就说明没办法再访问到这个值了，因此可以安全地收回其内存了

**弊端 -- 产生循环引用**
* 如果两个对象相互引用，那么这两块内存永远无法释放( `不进行手动obj1.obj2 = null的情况` )，进而造成内存泄漏的情况

##### 标记清除 -- 采用广泛

**概念**
* 设置一个根对象，垃圾回收器会定期从这个根变量开始，查找所有从根开始引用到的对象，对于那些没有被引用的对象，就会被视为不可用的对象
* 这个方法可以很好的解决循环引用的问题

## 闭包

**注意**
* JS中 函数是一等公民，这意味着：
     * 函数的使用是非常灵活的
     * 函数可以作为另一个函数的参数，也可以作为另一个函数的返回值来使用
     * 函数内部可以定义函数（C和JAVA是不允许的）
```js hl:1
// 函数作为参数

function foo(arg){
  console.log(arg)
  return arg // 函数作为返回值
}
function arg(){}
var res = foo(arg) 
```


### 高阶函数

> 把一个函数作为参数或者作为返回值的函数称之为高阶函数

**函数和方法的区别**
* 函数function -- 独立的function被称为一个函数
* 方法method -- 当函数属于一个对象的属性，这个函数function是这个对象的方法

**常见的高阶函数**
* ES6中数组新增的方法 -- filter,map,forEach,find,reduce... -- 都是接受一个自定义函数作为参数
```js
const arr = [11,2]
arr.filter(item=>{
  item > 0
})
```


### 闭包的定义

> 两个角度：

**计算机科学的角度**
* 闭包 ( Closure ) 又称**词法闭包**或者**函数闭包**
* 是在支持**头等函数** ( `头等函数是指，将函数作为一等公民` ) 的编程语言中，实现**词法绑定** ( `词法解析时确定的父级作用域以及可以访问的内容` ) 的一种技术
* 闭包在实现上是一个**结构体** ( `在JS中的表现是一个对象` )，它存储了一个**函数**和一个**关联的环境**（相当于一个`符号查找表`）
* 闭包和函数最大的区别是
     * 当捕捉闭包时，它的自由变量会在捕捉时被确定，这样即使脱离了捕捉时的上下文，它也照常运行

**MDN中对闭包的解释**
* 一个函数和对其周围环境的引用捆绑在一起的组合就是闭包
* 也就是说，闭包可以在一个内层函数中访问到其外层函数的作用域
* 在JS中，每创建一个函数，闭包就会在函数创建的时候创建出来
   `因为一个全局函数和它可以访问的全局作用域中的变量 组成了一个闭包`

```js hl:3
var name = "why"
function fun(){
  // fun中没有访问外层作用域的内容 -- 它属于闭包吗？
}
```

* 存在一定争论

**理解闭包**
* 一个函数如果可以访问它外层作用域的自由变量，那么这个函数就是一个闭包
* **从广义的角度** -- JS中的函数都是闭包
* **从狭义的角度** -- JS中的函数只有访问了外部作用域的变量，才是一个闭包

**代码**
```js
function foo(){
  var name = "foo"
  function bar(){
    console.log("bar",name)
  }
  return bar
}
var fn = foo()
fn()
```

**在内存的表示**
![](JS/images/闭包.jpg)

**哪里存在了闭包：**
* 当我们在执行fn，即bar函数时，foo的函数执行上下文已经弹出执行栈，即已经被销毁
* 而我们然能在fn/bar函数中正常访问foo中的变量name
* 此时的bar函数本身就形成了一个闭包 **（函数 + 它可以访问的自由变量）**

### 闭包的内存表现与内存泄漏

**普通函数**
```js
function fun(){
  var name = "fun"
}
function test(){
  console.log("test")
}
fun()
test()
```

* 在执行完7,8行代码后，fun和test的**函数执行上下文以及AO**都会被销毁

**修改代码** 
```js
function fun(){
  var name = "fun"
  var age = 1
  function test(){
    console.log(name)
    console.log(age)
  }
  return bar
}

var fun = foo()
fun()
```

* **为什么foo的AO对象没有被销毁**
     * 因为对于bar函数的`parentScope`指向父级作用域，即foo的AO对象
     * 全局作用域的fn函数指向bar函数的内存地址
     * 那么存在引用关系，AO不会被销毁（垃圾回收机制的标记清理算法）

* **内存泄漏的体现**
     * 如果我们只需要调用一次fun函数，那么内存里的foo AO和bar都不应该存在
     * 该销毁的东西没有被销毁，这就称之为内存泄漏

* **解决内存泄漏问题**
     * fun = null
     * 取消引用关系，内存里的foo AO和bar就会被垃圾回收器销毁

### 闭包引用的自由变量销毁

**ECMA的标准**
* 对于闭包，父级作用域的整个AO都应该保存下来

**V8引擎的优化**
* 为了提高性能，V8引擎进行了细节优化
* 即对于没有使用的自由变量，会进行销毁

 
## this
### 为什么需要有this

> 在常见的编程语言中，几乎都有this这个关键字（Object-C中使用的是self）
> 但是JS中的this和常见其他编程语言的this不太一样

* 在常见面向对象的语言中，this通常只会出现在类的方法中
* 也就是说需要有一个类，类中的方法中this代表的是当前调用的对象
* 但是JS中的this更加**灵活**

**JS中this的作用**
```js hl:4,6
var obj = {
  name:"why",
  eating:function(){
    // 需要打印名字 this代表的是obj对象
    console.log(this.name)
    // 这种写法也是可以的
    console.log(obj.name)
  }
}
```

* 从某些角度来说，在开发中如果没有this，很多问题也是有解决方法的；但是没有this会使编写代码变得非常不方便
### this的指向
#### 在全局作用域this的指向

> 在大多数情况，this都是出现在函数中；
> 在全局作用域分为两种情况：

* **浏览器** ：window对象 ( GlobalObject )
* **node环境** ： 空对象{ }
   `为什么？ node环境将JS文件作为模块module -> 编译加载并放到一个函数中 -> 执行这个函数.apply`  
   `在node初始化模块时，this的指向是空对象`

```js
console.log(this)
```

#### 在函数中this的指向

> 所有函数被调用时都会创建一个执行上下文，这个上下文记录着函数的调用栈和AO对象等
> **this也是其中的一条记录**

* this在执行时动态绑定

```js hl:1,6,9,15
// 函数的不同调用方式
function foo(){
  console.log(this)
}

// 1. 直接调用
foo()

// 2. 放入一个对象再进行调用
var obj = {
  foo:foo
}
obj.foo()

// 3. 使用apply进行调用
foo.apply("abc")
```
* 上述代码的打印结果是不一样的

**this指向**
* this的指向与函数的位置没关系
* this的指向与函数的调用方式有关

**this的绑定规则**
1. 绑定一：默认绑定
2. 绑定二：隐式绑定
3. 绑定三：显示绑定
4. 绑定四：new绑定

##### 绑定一：默认绑定 -- 指向window

> 触发情况：**独立函数调用**
> `函数没有绑定到某个对象上进行调用`

**案例一**
```js hl:4
function foo(){
  console.log(this)
}
// 独立调用
foo() // window
```

**案例二**
```js hl:6,11,4
function foo1(){
  console.log(this)
}
function foo2(){
  console.log(this)
  // 调用位置不在全局，但是独立调用
  foo1()
}
function foo3(){
  console.log(this)
  // 调用位置不在全局，但是独立调用
  foo2()
}
// 独立调用
foo3() // window,window,window
```

**案例三**
```js hl:8
function foo(){
  console.log(this)
}
var obj = {
  foo:foo
}
var fn = obj.foo
// 虽然经历了调用赋值，但是独立调用
fn()
```

**案例四**
```js hl:8
function foo(){
  return function(){
    console.log(this)
  }
}
var fn = foo()
// 虽然经历了调用赋值，但是独立调用
fn()
```

##### 绑定二：隐式绑定 

> 触发情况： 函数的调用方式是通过一个**对象**调用的
> `通过某个对象发起的调用`

**案例一**
```js hl:7
function foo(){
  console.log(this)
}
var obj = {
  fn:foo
}
// 通过obj对象发起调用
obj.fn() // {fn:function}
```

**案例二**
```js hl:9
var obj1 = {
  foo:function(){
    console.log(this)
  }
}
var obj2 = {
  bar:obj1.foo
}
// 通过obj2调用bar
obj2.bar() // {bar:function}
```

##### 绑定三：显式绑定 

> 隐式绑定的前提是发起调用的对象中存在被调用函数的引用，这样才能将this间接绑定到该对象中
> 如果我们**不希望对象内部包含该函数的引用，又希望在这个对象上强制调用**，应该怎么办？

* JS的所有函数都可以使用`call`和`apply`方法
   `call和apply都接收两个参数：第一个参数无区别；第二个参数 apply为数组，call为参数列表`
* 在调用这两个函数时，会将this绑定到这个传入的对象上

**基础使用**
```js hl:4,6,12
function foo(){
  console.log(this)
}
// 直接调用 this指向全局对象window
foo()
// 绑定到对象，指定this的指向
var obj = {
  name:"name"
}
foo.apply(obj) // {name:"name"}
foo.call(obj)  // {name:"name"}
// 绑定到字符串
foo.call("abc") // String:{"abc"}
```

**call和apply的区别**
```js hl:4,7
function foo(num1,num2){
  console.lof(num1+num2,this
}
// call调用
foo.call("call",1,2)

// apply调用
foo.apply("apply",[1,2])
```

**bind**
```js
function foo(){
  console.log(this)
}

// bind方法返回一个新的修改this指向的函数
var newFoo = foo.bind("abc")
// 直接调用
newFoo() // String:{"abc"}
// 传递参数有三种方法
var newFoo = foo.bind("abc",arg1,arg2...)

newFoo(arg1,arg2...)

var newFoo = foo.bind("abc",arg1)
newFoo(arg2...)
```

##### 绑定四：new绑定 

> JS中的函数可以当做一个类的构造函数来使用，也就是**new关键字**

**使用new关键字会执行的操作**
* 创建一个全新对象
* 这个对象会被执行prototype连接
* 这个对象会被绑定到函数调用的this上
* 如果函数没有返回其他对象，表达式会返回这个新对象

**基础使用**
```js hl:5,6
function Person(name,age){
  this.name = name
  this.age = age
}
// 通过一个new关键字调用一个函数，这时this是在调用这个构造器时创建的对象
// this == 这个创建的对象
var p1 = new Person("why",18)
```

### 内置函数的this绑定
#### setTimeout函数

```js hl:2
setTimeout(function(){
  // 内部指向应该是什么样子的？
  console.log(this) // 内部是独立调用 -- window
},2000)
```

#### 监听点击

```js hl:3
const box = document.selectElementById("box")
box.onClick = function(){
  // 内部指向应该是什么样子的？
  console.log(this)
}

box.addEventListener("click",(event)=>{
 console.log(this)
})
```

#### 数组的高阶函数方法

> forEach / map / filter / find

```js hl:2,3
var arr = [1,2,3]
// 函数内部默认将this指向window
// 手动传入第二个参数 修改this绑定
arr.forEach(function(ele){
  console.log(this)
},"abc")
```

### 规则优先级

* **默认绑定优先级最低**
* **显式绑定优先级**(apply,call,bind)**高于隐式绑定优先级**
* **new绑定优先于隐式绑定**
* **new绑定优先于显式绑定**
   `new关键字不能和apply和call一起使用；new可以和bind一起使用`

### this规则之外
#### 忽略显式绑定

> apply,call,bind当传入`null/undefined`时，自动将this绑定到`全局对象`

#### 间接函数引用

```js hl:14
var obj1 = {
  name:"obj1",
  foo:function(){
    console.log(this)
  }
}

var obj2 = {
  name:"obj2"
}

obj2.bar = obj1.foo

// 隐式绑定
obj2.bar()
```

```js hl:12
var obj1 = {
  name:"obj1",
  foo:function(){
    console.log(this)
  }
}

var obj2 = {
  name:"obj2"
}

(obj2.bar = obj1.foo)() // 属于独立函数调用

```

**代码不能运行的原因**
* 代码没加分号：obj2的定义和12行在`词法分析`中视为一个`整体`，值为undefined

## 箭头函数 ( arrow function )

> 箭头函数是ES6新增的一种编写函数的方法，并且它比函数表达式更加简洁
> * 箭头函数内不会绑定this和arguments属性
> * 箭头函数不能作为构造使用，即不能使用new关键字

```js
// 箭头函数的编写
const arrow_fun = ()=>{
  console.log("arrow function")
}
```

**特殊简写** -- 一个箭头函数只返回一个对象

```js hl:1
// 在对象外层添加一个小括号
const foo = item=> ({name:item,id:1})
```

### 箭头函数中的this指向

> 箭头函数不使用this的四种绑定规则，而是通过外层作用域寻找

**基础使用**
```js
var foo = ()=>{
  console.log(this) // window
}
foo.apply("abc") // window
var obj = {foo:foo}
obj.foo() // window
```

**应用场景**
```js
// 在箭头函数出来之前
var obj = {
  data:[],
  setData:function(){
    // 保留obj的this
    var _this = this
    setTimeout(function(){
      // this.data = [1] 这里的this是window，该操作并没有修改data，而是在GO上挂载了data
      _this.data = [1] // 正确操作

      // 这样形成了一个闭包
    })
  }
}

// 使用箭头函数
var obj = {
  data:[],
  setData:function(){
    setTimeout(()=>{
      // 箭头函数中的this是上层作用域 即调用时是obj的this
      this.data = [1]
    })
  }
}
```

### this例题

```js
var name = "window"
var person = {
  name:"person",
  sayName:function(){
    console.log(this.name)
  }
}
function sayName(){
  var sss = person.sayName
  sss() //window 独立函数调用
  person.sayName(); // person 隐式函数调用
  (pserson.sayName)(); // person 隐式函数调用
  (b = person.sayName)(); // window 赋值表达式 独立调用函数b
}
sayName();
```

```js hl:8
var name = "window"
var person1 = {
  name:"person1",
  foo1:function(){
    console.log(this.name)
  },
  foo2:()=>console.log(this.name),
  // foo2的上层作用域是window 而非obj
  foo3:function(){
    return function(){ console.log(this.name) }
  },
  foo4:function(){
    return ()=>console.log(this.name) 
  }
}
var person2 = {name:"person2"}
person1.foo1()  //  person1
person1.foo1.call(person2)  //  person2

person1.foo2()  //  person1     * window
person1.foo2.call(person2)  //  person1    * window

person1.foo3()()  //  window
person1.foo3.call(person2)()  //  person2 此处还是独立函数调用 * window
person1.foo3().call(person2)  //  person2 最终显示绑定的还是person2

person1.foo4()()  //  window  * person1 上层作用域
person1.foo4.call(person2)()  //  person2 
person1.foo4().call(person2)  //  person1
```

```js
var name = "window"
function Person(name){
  this.name = name
  this.foo1 = function(){
    console.log(this.name)
  }
  this.foo2 = ()=>console.log(this.name)
  this.foo3 = function(){
    return function(){ console.log(this.name) }
  }
  this.foo4 = function(){
    return ()=>console.log(this.name) 
  }
}

var person1 = new Person("person1")
var person2 = new Person("person2")

person1.foo1()  //  person1  隐式
person1.foo1.call(person2)  //  person2 显式

person1.foo2()  //  person1 上层作用域
person1.foo2.call(person2)  //  person1 上层作用域

person1.foo3()()  //  window
person1.foo3.call(person2)()  // window
person1.foo3().call(person2)  //  person2

person1.foo4()()  //  person1
person1.foo4.call(person2)()  //  person2
person1.foo4().call(person2)  //  person1
```

```js
var name = "window"
function Person(name){
  this.name = name
  this.obj = {
    name:"obj",
    foo1:function(){
      return function(){ console.log(this.name) }
    },
    foo2:function(){
      return ()=>console.log(this.name) 
    }
  }
}

var person1 = new Person("person1")
var person2 = new Person("person2")

person1.obj.foo1()() // window
person1.obj.foo1.call(person2)() // window
person1.obj.foo1().call(person2) // person2

person1.obj.foo2()() // obj
person1.obj.foo2.call(person2)() // person2
person1.obj.foo2().call(person2) // obj
```

## 函数式编程

> 函数式编程是一种编程范式/编程方式
### 手写call,apply,bind

> 用JS模拟实现

**call**

```js hl:5,7,9,11,13
// 为函数原型添加一个新的方法
// 参数1：thisArg -- 目标绑定this
// 参数2：传入的参数列表
Function.prototype.cyCall = function(thisArg,...args){
  // 在这里执行被调用的函数本身
  // 问题1：如何获取到哪一个函数执行了cyCall
  var fn = this
  // 问题2：如果传入的thisArg不是对象（数字，字符串，布尔值...）
  thisArg = Object(thisArg)
  // 问题3：传入undefined或null应该绑定到全局对象window
  thisArg = (thisArg!==null&&thisArg!==undefined)?Object(thisArg):window
  // 问题4：传入参数的情况 -- ES6的新特性剩余参数restParameters
  thisArg.fn = fn
  // 此处的...为展开运算符
  // 拿到函数执行的返回结果
  var res = thisArg.fn(...args)
  // 删除挂载的fn属性
  delete thisArg.fn
  return res
}
```

**apply**

```js
// 为函数原型添加一个新的方法
// 参数1：thisArg -- 目标绑定this
// 参数2：传入的参数数组
Function.prototype.cyApply = function(thisArg,args){
  var fn = this
  thisArg = (thisArg!==null&&thisArg!==undefined)?Object(thisArg):window
  thisArg.fn = fn
  // 问题 -- 如果不传入参数args，系统会报错
  // 判断
  args = args?args:[]
  var res = fn(...args)
  delete thisArg.fn
  return res
}
```

**bind**

```js
// 为函数原型添加一个新的方法
// 参数1：thisArg -- 目标绑定this
Function.prototype.cyApply = function(thisArg,...argArray){
  var fn = this
  thisArg = (thisArg!==null&&thisArg!==undefined)?Object(thisArg):window
  
  // 新函数
  function proxyFn(...args){
    // 合并参数
    var finalArgs = [...argArray,...args]
    // 等价于：var finalArgs = argArray.concat(...args)
    var res = thisArg.fn(...finalArgs)
    delete thisArg.fn
    return res
  }
  return proxyFn
}
```

### arguments

> **arguments**是一个对应于`传递给函数的参数`的`类数组对象`

**arguments的操作**
* 获取参数的长度 -- arguments.length
* 根据索引查找值 -- arguments[1]
* 获取当前arguments所在的函数 -- arguments.callee
  
**arguments与数组**
* arguments不能调用数组的方法( `map,some,every...` )
* arguments转化为数组
     * 自己遍历
     * 数组方法
```js hl:3,5,8,11
var newArr = Array.prototype.slice.call(arguments)
// 数组内置的slice方法内部是对于传入可迭代对象遍历生成一个新数组

var newArr = [].slice.call(arguments)
// 这种写法也是可以的

var newArr = Array.from(arguments)
// ES6的新语法

var newArr = [...arguments]
// 展开运算符

```

**箭头函数内没有arguments**
* 箭头函数默认会从上层作用域查找arguments
* node环境中有arguments；浏览器环境没有arguments
* 箭头函数中使用剩余参数模拟替代arguments
```js
var fn = (...args)=>{
  console.log(args)
}
```

### 纯函数

> JS符合函数式编程的范式，所以也有纯函数的概念：

* 在react中纯函数是被多次提及的
* react组件就要求像是一个纯函数，redux( `react的状态管理库` )中有一个概念叫做reducer，也要求必须是一个纯函数( pure function )

**纯函数的概念**
* 在程序设计中，若一个函数满足以下条件，则这个函数被称为纯函数
     * 此函数在`相同的输入`时，需产生`相同的输出`
     * 函数的输入值和输出值以外的`其他隐藏信息或状态无关`，也和`I/O设备产生的外部输出无关`
     * 该函数`不能有语义上可观察的函数副作用`，诸如"触发事件"，使输出设备输出，或更改输出值以外的内容等

**确定的输入必须产生确定的输出；不能产生副作用**

#### 副作用的概念

> 副作用( `side effect` ) 本身是医学的概念
> 在计算机科学中，表示**在执行一个函数时，除了返回函数值时，还对调用函数产生了附加的影响**
> `比如修改了全局变量，修改了参数或者改变外部的存储`

**为什么纯函数不能产生副作用**
* 副作用往往是bug的温床

#### 纯函数的案例

**截取数组的两种方法**
* **slice**
```js hl:3,4
var arr = [1,2,3,4,5]
var newArr = arr.slice(1,3)
// arr不会发生改变，即不会产生副作用
// 对于同一个数组来说，该方法会返回一个确定的值
```

**综上可知，Array.slice是一个纯函数**

* **splice**
```js hl:3
var arr = [1,2,3,4,5]
var newArr = arr.splice(1,3)
// arr会发生改变，即会产生副作用
```

**综上可知，Array.splice不是一个纯函数**


****

#### 纯函数的优势
* 纯函数使得程序员可以**安心的编写和安心的使用**
* 编写的时候**保证了函数的纯度**，这是**单纯实现自己的业务逻辑**即可，不需要关心传入的内容是如何获得的或者依赖其他的外部变量是否已经发生了修改
* 在使用的时候，确定**输入内容不会被篡改**，并且确定**自己的输入一定会有确定的输出**



### 柯里化

> 柯里化也是属于函数式编程里一个非常重要的概念

**柯里化的概念**
* 在计算机科学中，柯里化( `Currying` ) 又称卡瑞华或加里化
* 柯里化是指`把接收多个参数的函数变成接收单一参数的函数`，并且`返回接收余下的参数且返回结果的新函数`的技术
* 柯里化声称**如果你固定某些参数，你将得到接收余下参数的一个函数**

**总结**
* 只传递给函数一部分参数来调用它，让它返回一个函数去处理剩余的参数
* 这个过程就称为柯里化
```js
// 第一个函数
function foo1(m,n,x){
  return m+n+x
}
foo1(1,2,3)
// 第二个函数
function foo2(m){
  return function(n){
    return function(m){
      return function(x){
        return m+n+x
      }
    }
  }
}
foo2(1)(2)(3)
```

**上述代码中，将第一个函数转换为第二个函数的过程就称为柯里化**

**用箭头函数简化柯里化代码**
```js
var res = m=>n=>x=>m+n+x
```

#### 柯里化的优势

* 在函数式编程中，我们往往希望一个函数`处理的问题尽可能单一`，而不是将一大堆的处理过程交给一个函数处理
* 那么我们就可以将每次传入的参数在单一的函数中处理，处理完后在下一个函数再使用处理后的结果

* 逻辑的复用
```js
function makeAdder(count){
  return function(num){
    return num*count
  }
}

// 获取乘以5的函数
var Adder5 = makeAdder(5)
var res1 = Adder5(10) // 50

// 获取乘以2的函数
var Adder2 = makeAdder(2)
var res1 = Adder2(10) // 20
``` 

#### 柯里化函数的实现

> 将一个函数自动柯里化的实现函数

```js
function Currying(fn){
  function curriedFun(...args){
    // 判断当前传入的参数个数是否与fn函数需要的参数个数一致
    // 如果一致，则不需要再返回函数
    // fn.length -- fn的参数个数
    if(args.length >= fn.length) return fn.call(...args)
    else {
      // 递归
      return function(...args2){
		curriedFun.apply(this,[...args,...args2])
      }
    }
  }
  return curriedFn
}
```

**调用函数**
```js

const curriedFoo = Currying(fn)

// 返回的函数是：
function curriedFoo(...args){
  if(args.length >= fn.length) return fn.apply(args)
  else {
    return function(...args2){
  	curriedFoo.apply(this,[...args,...args2])
    }
  }
}

curriedFoo(10)(20)(30)
// 1: curriedFoo(10) --> args.length==1<fn.length==3 --> function(...)
// 2: function(20) --> args.length==2<fn.length==3 --> function(...)
// 3: function(30) --> args.length==3 == fn.length==3 --> call(10,20,30)
```

#### 柯里化的应用场景

**vue源码**
* 自定义渲染器

### 组合函数

> **组合函数**是JS开发过程中一种对函数的**使用技巧**

* 比如我们需要对某一个数据进行函数的调用，执行两个函数fn1和fn2，这两个函数是依次执行的
* 如果我们每次都需要进行两个函数的调用，操作上就会显得重复
* 将两个函数组合起来依次进行调用，这个过程就是**对函数的组合**，即**组合函数( Compose Function )**


**案例**
* 原函数
```js
function fn1(num){return num*2}
function fn2(num){return num**2}
var num = 2
fn1(num)
fn2(num)
```

* 组合函数的写法
```js
function composeFn(fn1,fn2){
  return (num)=>{fn1(fn2(num))}
}

compose(fn1,fn2)(num)
```

**复杂的组合函数**
```js
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
```

### with语句 了解&不推荐

> with语句会形成自己的作用域

```js
const obj = {name:"why"}

function fun(){
  with(obj){
    console.log(name)
  }
}
```

* 在上述代码中，第5行语句查找name时，会先从传入with的对象作用域里查找
* 严格模式下不建议使用with

### eval函数

> eval是一个特殊全局函数，它可以将传入的字符串当作JS代码来执行

**基础使用**

```js
var str = "console.log(1)"
eval(str) // 执行 console.log(1)
```

**一般不使用**
* eval代码的可读性很差
* eval是字符串，在执行过程中很容易被刻意篡改
* eval的执行必须经过JS解释器，不能进行JS引擎优化

### 严格模式

> ES5中推出的一种模式

* 严格模式是**一种具有限制性的JS模式**，从而使代码隐式脱离了**懒惰模式**
* 支持严格模式的浏览器在检测到浏览器有严格模式时，会以更严格的方式对代码进行检测和执行

**使用严格模式**
```js
"use strict";
```

**具体限制内容**
* 严格模式通过**抛出错误**来消除一些原有的**静默( slient )** 错误
   `静默错误：对于错误什么都不做`
* 严格模式让**JS引擎子啊执行代码时可以进行更多的优化**（`不需要对某些特殊的语言进行处理`）
* 严格模式禁用了在ES未来版本可以会定义的一些语法
  `即未来有可能升级成为关键字的保留字
  
#### 开启严格模式

> 在实际开发中，打包文件会对JS文件自动开启严格模式
> 严格模式支持**粒度化迁移**

* **在一个JS文件中开启严格模式**
```js
"use strict"
```

* **在一个函数中开始严格模式**
```js
function foo(){
  "use strict"
  console.log(1)
}
```

#### 严格模式限制

**常用的限制**
1. 无法意外的创建全局变量
```js
message = "msg"
function foo(){
  age = 2
  // 在默认情况下，会创建一个全局变量
  // 严格模式不允许该操作
}
```

2. 严格模式会使引起静默失败的赋值操作抛出异常
```js
var obj = {name:"cy"}
Object.defineProperty(obj,"name",{
  witable:false
})
obj.name = "yy" // 尝试修改不可修改的值 严格模式会报错
```

3. 严格模式下试图删除不可删除的属性
```js
var obj = {name:"cy"}
delete obj.age // 严格模式会报错
```

4. 严格模式不允许函数参数具有相同的名称
```js
function(x,y,y){ ... } // 严格模式不允许
```

5.  不允许0的八进制语法

6. 在严格模式下不允许使用with

7. 在严格模式下，eval不会向上引用变量
```js
var msg = "var num = 1;console.log(num)"
eval(msg) // 严格模式会报错
```

8. 在严格模式下，this绑定不会默认转成对象
```js
function foo(){
  console.log(this)
  // 在严格模式下，自执行函数(默认绑定)指向undefined
}

// setTimeout的this
setTimeout(function(){
  console.log(this) // 默认模式和严格模式下都指向this
},1000)

// setTimeout是浏览器实现的方法，内部是一个黑盒子

```

# 面向对象

> 面向对象是现实的抽象方式
> 对象是JS中一个非常重要的概念，因为对象可以**将多个相关联的数据封装在一起**，更好的**描述一个事物**
> 用对象来表述事物，更有利于我们将现实的事物抽离成代码中某个**数据结构**

## JS的面向对象

> JS支持多种编程范式，包括函数式编程和面向对象编程

* JS中的对象被设计成**一组属性的无序集合**，像是一个**哈希表**，有**key和value**组成
* key是一个标识符名称，value可以是任意值，也可以是其他对象
* 如果值是一个函数，这个函数也可以称之为**对象的方法**

### JS创建对象的多个方案
#### 普通创建

* **通过字面量**
```js
var obj = {}
```

* **通过new关键字 + 构造函数**
```js
var obj = new Object()
```

#### 批量创建多个对象

> 如果需要创建一系列信息不同的对象，应该采取什么样的方案

##### 工厂模式

* 工厂模式是一种常见的设计模式
* 通常会有一个工厂方法，通过该工厂方法创建对象
```js
// 工厂函数
function createObj(name,age,address){
  return {
    name,age,address
  }
}

const p1 = createObj("cy",20,"成都")
```

**缺点：** `工厂模式获取不到对象最真实的类型`

##### 构造函数的方式

**构造函数是什么**
* 构造函数也称之为构造器( `constructor` ) 通常是我们在创建对象时会调用的函数
* 在其他编程语言里，构造函数是存在于类的一个函数

**JS里的构造函数**
* 构造函数也是一个普通的函数
* 如果一个普通函数被new操作符调用了，那么这个函数就称之为一个构造函数

**构造函数与普通函数的区别**
* 如果一个函数被new操作符调用了，那么它会执行如下操作
     1. 在内存中创建一个新的对象（空对象）
     2. 这个对象内部的`prototype属性`会被复制为该函数的prototype属性
     3. 构造函数内部的`this`会指向创建出来的新对象
     4. 执行构造函数内部的代码
     5. 如果构造函数没有返回非空对象，则`返回创建出来的对象`
```js
// 模拟操作
function foo(){
  var obj = {}
  this = obj
  console.log("执行函数体")
  return this
}
```

**示例**
```js
function Person(name,age){
  this.name = name
  this.age = age
  // 因为执行函数体之前，this已经被赋值了新对象
  // 则this.name ==== obj.name
}
const p1 = new Person("cy",20)
```

**命名规范**
* 对于后续要用于构造函数的函数，名称首字母一般需要大写

**构造函数方法的缺点**
* 当属性值是函数时，每创建一个对象都会给这个对象创建新的函数
* 这样重复的操作对空间而言是有浪费的

##### 原型和构造函数

```js
function Person(name,age){
  this.name = name
  this.age = age
}
Person.prototype.getName = function(){console.log(this.name)}

// 调用实例对象的getName时，this只和调用方法有关
// this指向是调用的实例对象
```
### 对于对象属性的操作

#### 属性描述符 -- 精准添加或修改对象的属性

> 属性描述符可以在操作属性时进行一些限制
> 属性描述符分为 ： `数据属性描述符 和 存取属性描述符`

**Object.defineProperty( )**

* 接收三个参数
     * 要定义属性的对象名称
     * 要定义或修改的属性的名称或Symbol
     * 要定义或修改的属性描述符
* 返回值
     * 传入的对象

```js
var obj = {name:"name"}
// 第三个参数属性描述符是一个对象
Object.defineProperty(obj,"height",{
  // 配置
  value:1
})
```

##### 数据属性描述符的特性

* [ [ Configurable ] ] `表示属性是否可以通过delete删除，是否可以修改它的值，是否可以将它修改为存取属性
     * 当我们直接在对象上定义某个属性 -- [ [ Configurable ] ] 属性默认为true
     * 当我们通过属性描述符定义一个属性 - [ [ Configurable ] ] 属性默认为false
* [ [ Enumerable ] ] `表示属性是否可以通过for-in或者Object.keys()返回该属性`
     * 当我们直接在对象上定义某个属性 -- [ [ Enumerable ] ] 属性默认为true
     * 当我们通过属性描述符定义一个属性 - [ [ Enumerable ] ] 属性默认为false
* [ [ Writable ] ] `表示是否可以修改属性的值`
     * 当我们直接在对象上定义某个属性 -- [ [ Writable ] ]  属性默认为true
     * 当我们通过属性描述符定义一个属性 - [ [ Writable ] ]  属性默认为false
* [ [ value ] ] `属性的value的值，读取属性时会返回该值，修改属性时会返回`
     * 默认情况下为undefined

```js
Object.defineProperty(obj,"name",{
  value:"cy",
  configurable:false,
  enumerable:false,
  writable:true
})
```

##### 存取属性描述符的特性
* [ [ Configurable ] ] `表示属性是否可以通过delete删除，是否可以修改它的值，是否可以将它修改为存取属性
     * 当我们直接在对象上定义某个属性 -- [ [ Configurable ] ] 属性默认为true
     * 当我们通过属性描述符定义一个属性 - [ [ Configurable ] ] 属性默认为false
* [ [ Enumerable ] ] `表示属性是否可以通过for-in或者Object.keys()返回该属性`
     * 当我们直接在对象上定义某个属性 -- [ [ Enumerable ] ] 属性默认为true
     * 当我们通过属性描述符定义一个属性 - [ [ Enumerable ] ] 属性默认为false
* [ [ get ] ] `获取属性时会执行的函数` 默认为undefined
* [ [ set ] ] `设置属性时会执行的函数` 默认为undefined

```js
var obj = {_name:"cy"}

Object.defineProperty(obj,"name",{
  configurable:false,
  enumerable:false,
  get:function(){
    // 隐藏_name属性 只能通过name获取值
    return this._name
  },
  set:function(value){
    // value为赋值的值
    this._name = value
  }
})
```

**使用场景**
* 隐藏一个私有属性 不希望它被外界直接访问和赋值
* 希望截取一个属性 当它被访问和设置值的过程时 也会使用存取属性描述符
* vue2的响应式原理

**枚举属性与浏览器**
* 对于不可枚举的属性，浏览器为了方便调试，还是会显示在控制台
##### 定义多个属性描述符

> 使用**Object.defineProperties( )**

```js
var obj = {_age:"age"}
Object.defineProperties(obj,{
  name:{
    value:"name",
    writable:true
  },
  age:{
    configurable:false,
    get:function(){
      return this._age
    }
  }
})
```

##### 定义对象时定义setter与getter
```js
var obj = {
  _age:1,
  set age(value){
    this._age = value
  },
  get age(){
    return this._age
  }
}
// 这种写法默认可修改与可枚举
```

##### 私有属性

> JS里面没有严格意义的私有属性
> 但是约定速成以下划线开头定义的属性名则是私有属性

#### 获取属性描述符

* **特定属性：Object.getOwnPropertyDescriptor( obj , key_name )**

```js
console.log(Object.getOwnPropertyDescriptor(obj,"name"))
// 输出一个包含属性描述符的对象
```

* **所有属性：Object.getOwnPropertyDescriptors( obj )**


### 对象方法补充

* **禁止对象继续添加新的属性 -- 限制扩展操作符**
```js
Object.preventExtensions(obj)
```

* **禁止对象配置/删除里面的属性 -- seal方法**
```js
Object.seal(obj)
```

* **禁止对象属性修改 -- freeze方法**
```js
Object.freeze(obj.name)
// 默认模式静默报错；严格模式抛出错误
```

* **判断对象是否有一个自己的属性( 非原型上 ) -- Object.hasOwnProperty( )**
```js
console.log(obj.hasOwnProperty("name")) // true/false
```

* **判断对象是否存在该属性( 原型&&实例 ) -- in操作符**
```js
console.log("name" in obj) // true/false
```

* **判断对象的原型 -- instanceof**
     * 参数： 1. 对象    2. 构造函数
     * 判断： 构造函数是否出现在对象的原型链上
```js
console.log(stu1 instanceof Person) // true/false
```

* **判断某个对象是否出现在某个实例对象的原型链上-- isPrototypeOf**
```js
console.log(stu1.isPrototypeOf(stu2)) // true/false
```

### 面向对象三大特性

> 面向对象有三大特性：**封装，继承，多态**

* 封装：将属性和方法封装到一个类中，就可以称之为封装的过程
* 继承：重复利用一些代码（对代码的复用）
   `继承是多态的前提`
* 多态：不同的对象在执行时表现出不同的形态

#### 继承

> 继承是帮助我们将重复的代码和逻辑封装提取到父类中，子类只需要直接继承过来使用即可

##### 原型链

> 由相互关联的原型组成的**链状结构**就是原型链。

**原型链的顶层 -- Object.prototype**

![](JS/images/Snipaste_2025-04-07_15-58-18.jpg)

* 该对象有原型属性，但是原型属性已经指向null
* 该对象上有很多默认的属性和方法( `valueOf,toString()...` )

**结论：Object是所有类的父类；原型链的顶层原型对象就是Object的原型对象**

##### 为什么需要继承
* 优化重复的冗余代码

##### 实现继承
###### 普通继承
* 父类 -- 公共属性和方法
```js
function Person(name){
  this.name = name
}
Person.prototype.getName = function(){return this.name}
```

* 子类 -- 特有属性和方法
```js
function Student(s_no){
  this.s_no = s_no
}
Student.prototype.getSno = function(){return this.s_no}
```

* 子类和父类的连接
```js
Student.prototype = new Person()
```

**上述实现的弊端**
1. 打印子类对象，某些属性是看不见的
   `子类对象没有直接挂载父类对象的属性，而是继承获取`
2. 如果创建出两个子类对象，对于引用属性 ( `数组，对象...` ) 会相互影响，而不是独立关系
   `直接修改子类对象的属性不会影响，它的操作是给子类对象添加一个新属性`
3. 这种继承方式无法正常传递参数

###### 借用构造函数继承

> 为了解决上述问题，开发人员提供了一种新的技术：`constructor stealing` 
> 即 **借用构造函数继承/伪造对象**


```js hl:8,9
function Person(name,age){
  this.name = name
  this.age = age
}


function Student(name,age,s_no){
  // 调用Person构造函数
  Person.call(this,name,age)
  // 通过call函数将Person的this绑定到Student
  // 那么name和age都是添加到实例化对象person上的
  this.s_no = s_no
}
```

**借用构造函数继承的弊端**
* Person函数至少被调用了两次
* Student的原型对象上会出现不必要的属性


###### 寄生式继承

> 直接将父类的原型赋值给子类原型

```js
Student.prototype = Person.prototype
```

**弊端**
* 给子类添加方法时，会添加到父类原型上

###### 原型式继承函数

> 新创建一个对象作为函数的原型，再返回该对象

```js
function createObj(obj){
  function fn(){}
  fn.prototype = obj
  return new fn()
}
```

**Object.create( obj )**
> 底层就是上述方式

```js
const newObj = Object.create( obj )
```

**create方法的参数**
> create可以传入一个对象，包含属性的属性操作符

```js
const newObj = Object.create(obj,{
  address:{
    value:"123",
    enumerable:false,
    ...
  }
})
```



###### 寄生式继承函数

> 寄生式继承是将原型式继承和工厂函数结合在一起的方式

```js
var personObj = {
  running:function(){
    console.log("running")
  }
}
// 工厂函数
function createStudent(name,age){
  // 原型式继承
  var studentObj = Object.create(personObj)
  studentObj.name = name
  studentObj.age = age
  studentObj.studyding = function(){console.log("sty")}
}
// 创建子类对象
var stu1 = createStudent("name",21)
```

**弊端**：和工厂函数方式一样

###### 寄生组合式继承

> 目的：创建一个新对象，这个新对象是子类的原型，它的原型指向父类

```js hl:11-21
function Person(name,age){
  this.name = name
  this.age = age
}
Person.prototype.running = ()=>console.log("running")

function Student(s_no){
  this.s_no
}

// 创建这个对象并将子类原型赋值给它
Student.prototype = Object.create(Person.prototype)
// 添加子类方法（此时则不会影响Person)
Student.prototype.getScore = ()=>{connsole.log("score")}
// 注意构造函数
// 如果不添加构造函数属性，打印出的实例对象类型是Person
// 原因：查找constructor -> Student.prototype没有 -> 新对象没有 -> 查找Person.prototype
Object.defineProperty(Student.prototype,"constructor",{
  configurable:true,
  enumerable:false
})

// 创建实例对象
var stu1 = new Student("name",12,111)
```

**优化**
* 上述高亮代码为该方法的核心，后续如果有新的Person子类出现，可以封装到一个工具函数方便复用
```js
// 兼容性写法
function createObj(obj){
  function fn(){}
  fn.prototype = obj
  return new fn()
}
// 工具函数
function initPrototype(SubType,SuperType){
  SubType.prototype = Object.create(SuperType.prototype)
  SubType.prototype.getScore = ()=>{connsole.log("score")}
  Object.defineProperty(SubType.prototype,"constructor",{
    configurable:true,
    enumerable:false
  })
}
```


# 原型

## 对象原型/隐式原型

> JS中的每个对象都有一个特殊的内置属性`[[prototype]]`，称之为对象的原型( **隐式原型** )

* 早期的ECMA没有规范去查看protptype
* 浏览器给对象提供了一个属性，可以让我们查看这个原型方法

```js
const info = {}
console.log(info.__proto__)
```

* ES5提供一个查看原型的API -- `Object.getPropertyOf`
```js
console.log(Object.getPropertyOf(info))
```

**原型有什么用？**

* 当我们从一个对象中获取某个属性时，它会触发get操作
     1. 如果当前对象有这个属性，则直接使用
     2. 如果没有找到，就会沿着原型链查找


## 函数原型/显式原型

> 函数作为对象来说，也存在属性__proto__

> 函数作为函数本身，还会多出来一个显式原型prototype( `ECMA规范范畴，无浏览器兼容问题` )

```js
console.log(foo.prototype)
```

**构造函数内部实现**
```js
this.__proto__ = foo.prototype
// 根据构造函数创建的对象也会和构造函数原型联系起来
```

### 函数原型上的属性

* 函数原型上有一个属性**constructor** 默认为不可枚举 ( `直接打印不会显示` )
* constructor属性指向构造函数本身

### 操作原型对象

```js
foo.prototype = {
  age:12,
  constructor:foo
}
```

* 真实开发中，可以通过Object.defineProperty( )添加constructor
   `原型中construtor默认是不可枚举的`

## 对象，原型和函数的关系

* 对象里面存在一个__proto__对象 ( 隐式原型对象 ) 指向原型对象
* 函数有一个__proto__ ( 隐式原型对象 ) 和prototype ( 显式原型对象 ) 
     * 函数的__proto__属性 ( 函数也是对象 )
      `创建函数时，foo.__proto__ = Function.prototype`
      `Function.prototype = {constructor:Function}`
     * 函数的prototype属性
       `创建函数时，foo.prototype = {constructor:foo}`
     * 函数的__proto__和prototype不一样
     * 函数的__proto__和prototype都是由Object创建出来的
* Function的__proto__和prototype是一样的

![](JS/images/原型关系.jpg)



# ES6

## 类与继承
### class关键字

> 我们会发现，按照前面的构造函数形式创建类，不仅与普通的函数过于相似，而且理解代码也不容易

> 在ES6新的标准中使用了class关键字来直接定义类：
> **但本质上也只是构造函数,原型链的语法糖而已**

#### class定义类

**两种方式**
* 类声明
```js
class Person{

}
```
* 类表达式
```js
var Person = class{

}
```

**类的特点**
* 类存在原型对象（因为它的本质还是构造函数）
* 类的原型对象的constructor也是指向自己本身
* typeof Person === function

#### 类的方法
**类的构造方法**
* 类的声明和构造函数是分开的
  `一个类只能有一个构造函数`
```js
class Person{
  constructor(name,age){
    // 创建一个对象
    // 将类的原型赋值给创建出的对象__proto__
    // 将对象赋值给函数的this
    // 自动返回创建出的对象
    this.name = name
    this.age = age
  }
}
```

**类的实例方法方法**
```js
class Person{
  constructor(name,age){
    this.name = name
    this.age = age
  }
  // 类创建方法
  getName(){
    return this.name
  }
}
```

* 上述代码中，getName方法是挂载到原型上，即所有实例对象共享的

**类的访问器方法**
```js
class Person{
 constructor(name,age){
   this.name = name
   this.age = age
 },
 // 类的访问器方法
 get name(){
   return this.name
 }
 set name(newName){
  this.name = newName
 }
}

// 访问
const p1 = new Person(1,1)
let p1_name = p1.name
p1.name = 1
```

**类的静态方法**
> static关键字

静态方法与普通方法的区别
* 静态方法可以通过类名直接访问；普通方法需要依赖构造出的实例对象进行访问
```js
class Person{
  static createPerson(){
    return new Person()
  }
}
// 访问
const p2 = Person.createPerson()
```

### extends关键字

> **JS只支持单继承**

```js
class Person{
  constructor(name){
    this.name = name
  }
}

class Student extends Person{

}
```

**super关键字**
* 在子类/派生类的构造函数中，使用this或者返回默认对象前，**必须使用super关键字**
   `JS引擎解析子类的要求`
* super的三个场景：`子类的构造函数，实例方法和静态方法`
```js
class Student extends Person{
  constructor(name,s_no){
    // 调用父类的构造函数
    super(name)
    this.s_no = s_no
  }
  getInfo(){
    // 调用父类的实例方法
    super.getName()
    console.log(this.s_no)
  }
  // 子类对父类方法的重写
  getName(){
    console.log("student:",this.name)
  }
  static studentMethod(){
    // 调用父类的静态方法
    super.personMethod()
  }
}
```


### 继承内置类

> 我们可以定义继承系统内置类( 实际上默认基础自Object )；比较少用

### 类的混入mixin

> 不是一个专门的关键字；而是使用JS语言技巧实现混入的效果

```js
// 创建一个函数
function mixinsFunction(BaseClass){
  return class extends BaseClass{
    running(){ ... }
  }
}
```

> 类似于混入的方法 -- react中的高阶组件

### 多态

**什么是多态**
* 多态指的是`为不同数据类型提供统一的接口或使用一个单一的符号来表示多个不同的类型`
* 不同的类型进行同一个操作，表现出不同的行为，这就是多态

**传统的面向对象语言( JAVA,C++,TS )的多态**
* 三个前提
     * 必须有继承（多态的前提）
     * 必须有重写（只有子类重写，才会有表现不同形态的结果）
     * 必须有父类引用指向子类对象
       `var shape:Shape = new Circel()`

**JS动态语言**
* 更加灵活

### ES6转ES5源码

> 对于代码里一些比较新的语法，某些浏览器是无法识别的

> 对于vue/react是基于脚手架搭建，可以使用webpack环境中的babel`将比较新的代码转换成较低版本浏览器可以识别的代码`


## 对象字面量增强

**对象字面量增强的方案**
* 属性简写（property shorthand）
```js
// before
var obj = {name:name}
// after
var obj = {name}
```

* 方法简写（method shorthand）
```js
// before
var obj = {foo:function(){}}
// after
var obj = {foo(){}}
```

* 计算属性名（computed property names）
```js
var obj = {
  [name+123]:"han",
  // 等同于name123:"han"
}
```

## 解构 ( Destructuring)

> ES6新增了从数数组或者对象中方便获取属性的方法，叫做**解构**

**数组的解构**

```js
var arr = [1,2,3]
// 普通操作
var [ele] = arr
console.log(ele) // 2

// 解构后面的两个数据
var [,ele2,ele3] = arr

// 解构第一个数据，后面的数据都放在一个新数组eleArr中
var [ele1,...eleArr] = arr

// 解构的默认值
var [ele=1] = arr
```

**对象的解构**
```js
var obj = {name:"1",age:"2"}

// 对象的解构
var {name} = obj

// 自定义解构出的数据名
var {name:newName} = obj

// 默认赋值
var {newAddress:address = "3"} = obj
```

**解构的应用场景**
* 在开发中拿到一个对象可以自行对其进行解构，提高开发效率
* 对于函数的参数进行解构
```js
function(info){
  const {name,age} = info
}
```

## let / const

### let

> 从直观的角度而言，let和var都是声明一个变量

### const

> const ( constant ) 声明一个常量，即必须在声明时赋值且值不可修改
> `const本质上是传递的值不可修改；而传递的引用类型(内存地址)的属性和方法可以修改`


```js
const obj = {name:"1"}
obj = {} // 修改了内存地址 -- 报错
obj.name = "2" // 内部属性不影响 -- 允许操作
```

* let和const 定义的变量不可以重复定义
```js
var a = 1
var a = 2
// 允许操作

let a = 1
const a = 2
// 不允许
```

### 作用域提升

* var声明的变量有作用域提升
* let和const声明的变量在声明前访问会报错
```js
console.log(a) // 作用域提升 -- 打印undefined
var a = 1

console.log(a) // 无作用域提升 -- 报错
let a = 1
```

**let和const只有在执行阶段才会创建吗？**
* 不是
* ECMA262对于let和const的描述 
  `当这些变量的词法环境被创建时，变量就被实例化了；但是不可以访问它们，直到词法绑定被求值`

**let与const有没有作用域提升？**
* 作用域提升的目的就是提前被访问
* 而let和const声明的变量虽然在执行前被创建，但是无法提前访问
* 没有作用域提升

### let/const与window的关系

```js
// var声明的变量会添加到全局对象window上
var a = 1
console.log(window.a) // 1
```

**variables___：VariableMap类型对象**
* 最新的标准里，JS v8引擎会将所有定义的对象存储在名为variables___的对象里，而不是window
* window对象是早期的GO对象，在最新的实现里是浏览器添加的全局对象，并且一直保持了window和var之间值的相等性

### 块级作用域

**什么是块级作用域**
```js
// 块代码(block code)
{
  // 内部书写表达式
}

// if语句 块级作用域
if(true){  }

// switch语句 块级作用域
switch(num){   }

// for语句 块级作用域
for(let num = 1;num<6;num++){   }
```
* 对应其他编程语言，在块级作用域中声明的变量无法访问
* ES5之前 JS并没有块级作用域

**JS中形成作用域的情况**
* 全局作用域
* 函数作用域
```js
function foo(){
  function bar(){
  
  }
}
// 上述代码有三个作用域
```

**ES6的块级作用域对var是无效的；对于let const class function的声明有效**

```js
{
  let num = 1
  class Person{
  }
  function foo(){
    consple.log("foo")
  }
}
c.log(num) // 无法访问
c.log(Person) // 无法访问
foo()
```

**函数的特殊性**
* 在很多浏览器中，为了兼容旧版语法，在实现代码过程中函数是没有块级作用域的


**块级作用域的应用场景**
* ES5之前 for循环不会形成作用域，导致循环语句内的变量会在全局变化

**for...of与const**
```js
// ES6新增了遍历可迭代对象的方法
for(const i of arr){
  console.log(i)
}
// 内部操作是每一次遍历重新赋值 -- 允许操作
```

### 暂时性死区

> 它的意思是，使用let和const声明的变量，在声明前是不能够访问的；
> 在提前访问与声明之间的区域就是**暂时性死区**

### let,const,var的选择
* var表现出来的特殊性都是一些历史遗留问题，其实是JS设计之初的语言缺陷
* 在实际过程中不推荐使用var
* 优先推荐使用const -- `保证数据不会被篡改，保证安全性`
* 明确数据后续会被修改后再使用const

## 字符串模板

> 在ES6之前，想要拼接字符串与变量是很麻烦的

**ES6提供的全新定义 -- 模板字符串**
```js
const num = 1
// 直接拼接
const str = `num == ${num}`
// 拼接表达式
var age = 2
const str1 = 'age+1 === ${age+1}'
```

**标签模板字符串**
> 模板字符串还有另外一种用法 -- 标签模板字符串 ( `Tagged Template Literals` )
> 在一个函数名后面写上模板字符串 就变成了**标签模板字符串**

```js
// 第一个参数 ：被${}分隔的字符串数组
// 其余参数 ：被插入的数据
function foo(str_arr,str_data1,str_data2){
  console.log(str_arr,str_data1,str_data2)
}

// 调用函数
const data1 = 1
const data2 = 2
foo`str1${data1}str2${data2}`
// 输出：str1,str2,1,2
```

**应用场景**
* React的styled-components库的底层原理中就运用了标签模板字符串

## 关于函数

### 函数的默认参数

> 给函数设置默认值

* **ES6之前**
```js
// 设置参数a的默认值为1
function(a,b){
  a = a?a:"default_a"
}
```
* 问题
     * 阅读性差
     * 三元运算符判断不完整（a = 0/a = {}...）
* **ES6 提供的函数默认值写法**
```js
function(a = "default_a",b){}
```

* 对象参数提供默认值
```js
// 提供默认参数同时解构
function get_info({name,age} = {name:"cy",age:1}){
  console.log(name,age)
}
// 另一种写法
function get_info({name="cy",age=1}={}){
  console.log(name,age)
}
```

**注意**
* 有默认值的形参最后放在最后

**有默认值的函数的length属性**
* 如果一个函数有默认值参数，则该参数及之后的参数都不算在length之内
```js
function(x,y,z = 0,m,n){
  console.log(length) // 2
}
```


### 函数的剩余参数

> ES6引入了rest parameter，即剩余参数，可以将不定数量的参数放在一个数组内

* 剩余参数内的...不是运算符 而是一个前缀
* 剩余参数必须放在最后

```js
function(m,n,...args){
  
}
```

**剩余参数与arguments的区别**
* 剩余参数只包括`没有对应形参的实参`；而arguments对象包含了传给函数的所有实参
* arguments不是一个真正的数组；剩余参数数组是个真正的数组，可以进行数组的所有操作
* arguments是早期JS提供的一个数据结构；而剩余参数是ES6提供的方法用于替代arguments

### 箭头函数

* 箭头函数是没有显式原型的prototype ( undefined )


## 展开语法 ( Spread syntax )

> ES9 ( 2018 ) 添加的新特性

* 展开语法可以在函数调用数组构造时，将数组表达式或者string在语法层面展开
* 还可以在构造字面量对象时，将对象表达式按照key-value方式展开

```js
const arr = [1,2,3]
const str = "sunoo"

function foo(a,b,c){
  console.log(a,b,c)
}
// 在ES6之前 -- 希望将arr数组的元素传入函数foo
foo.apply(null,arr)

// 使用ES6提供的展开运算符
// 1. 第一个应用场景 -- 函数传参
foo(...arr) // 展开数组
foo(...str) // 还可以展开字符串

// 2. 第二个应用场景 -- 数组赋值
const arr2 = [...arr]

// 3. 第三个应用场景 -- 对象赋值
const obj = {name:"name"}
const obj2 = {...obj,address:"address"}

```

**展开运算符进行的浅拷贝** -- 拷贝的是内存地址
```js
const obj = {name:"name",friend:{name:"f_name"}}
const obj1 = {...obj}
obj1.friend.name = "f_name2"
console.log(obj.friend.name) // 也变成了f_name2
```


## 数值表示

```js
const num1 = 100 // 十进制
const num2 = 0b100 // 二进制
const num3 = 0o100 // 八进制
const num4 = 0x100 // 十八进制

// 大数值 ES12的连接符_
const num5 = 10_000_000_000_000
```

## Symbol

> ES6新增的数据类型，表示独一无二的值

**为什么需要Symbol**
* 在ES6之前，对象的属性名都是字符串形式，很容易造成`属性名的冲突`
* 比如原来有一个对象，我们并不知道它内部的属性有哪些，当需要添加内容时很容易导致冲突，从而覆盖掉它已有的属性
* 比如我们手写call/apply/bind时 为函数取名fn可能导致冲突

**Symbol就能解决上述问题**
* Symbol值是通过Symbol函数生成，生成后可以作为属性名
* 也就是说在ES6中，可以使用字符串作为属性名，也可以使用Symbol
* 即使重复创建，Symbol也是独一无二的

**Symbol的描述 -- description**
```js
const s1 = Symbol()
console.log(s1.description) // 默认是undefined
```

### Symbol作为对象属性key

* **定义时**
```js
const s1 = Symbol("s1")
const obj = {
  [s1]:"s1"
}
```

* **添加时**
```js
const s2 = Symbol("s2")
obj[s2] = "s2"
```

* **属性描述符**
```js
const s3 = Symbol("s3")
obj.defineProperty(obj,s3,{...})
```

* **获取值**
```js
console.log(obj[s1])
// 注意 Symbol不支持obj.s1来获取值
```

* **获取键**
     * 使用Symbol作为key的属性，在遍历/Object.keys等中是获取不到的
     * 需要使用特地方法 `Object.OwnPropertySymbols`
```js
const symbol_keys = Object.OwnPropertySymbols(obj)
// 遍历时也需要这样
for(const key in symbol_keys){
  console.log(obj[key])
}
```

### 创建一样的Symbol

> 对于Symbol.for( )创建的Symbol 传入一样的key值 则创建的Symbol是一样的

```js
const sa = Symbol.for("key")
const sb = Symbol.for("key")

console.log(sa === sb) // true

const key = Symbol.keyFor(sa)
const sc = Symbol.for(key)

console.log(sa === sc) // true
```

## 新增数据结构
### Set

> ES6新增的数据类型Set，与数组类似，与数组的区别是`存放的元素不能重复`

**创建Set**
```js
const set = new Set()
```

**添加元素**
* 一个元素
```js
set.add(1)
```

* 可迭代对象
```js
const arr = [1,2,3]
const set2 = new Set(arr)
```

**重复对象**
```js
set.add({})
set.add({})
// 添加成功 -- 这其实是两个对象 -- 不同的内存地址

const obj = {}
set.add(obj)
set.add(obj)
// 添加失败
```

**应用环境**
* 数组去重
```js
const arr = [1,2,3,4,4,4,6,6,7]
// 第一种方法
const newArr = Array.from(new Set(arr))

// 第二种方法
const newArr2 = [...new Set(arr)]
```

#### Set属性&方法
* size属性
```js
console.log(set.size)
```

* add方法
```js
set.add(1)
```
* delete方法
```js
set.delete(1)
```
* has方法
```js
const is_has = set.has(1)
```
* clear方法
```js
set.clear()
```
* 遍历
     * forEach方法
     * for...of方法
```js
set.forEach(item=>console.log(item))
for(const ele of set){
  console.log(ele)
}
```


### WeakSet

> 与Set类似的数组结构，同样不能存放重复元素

#### Set与WeakSet

**区别**
* WeakSet只能存放对象类型，不能存放基本数据类型
* WeakSet对元素的引用是`弱引用`，即如果没有其他对象对于该对象进行引用，则GC可以进行回收
     * 

**其他基础方法一致，但是**
* 没有clear方法
* 无法遍历

#### 弱引用

**强引用 ( Strong Reference )** -- 指的是在GC进行检查时，对象的引用关系是有效的
![](JS/images/强引用.jpg)

**弱引用 ( Weak Reference )** -- 指的是在GC进行检查时，对象的引用关系是无效的

#### 应用场景
* 其实没什么用( )
* 保证类不被显式绑定this的方法调用

### Map

> ES6新增的数据结构，用于存储映射关系

**Map与对象的区别**
* 对象存储映射关系只能使用字符串( ES6新增了Symbol )作为属性名
   `即使不是字符串类型，也会隐式转换成字符串格式，将字符串作为key；而所有对象转为字符串都是一样的`
* Map允许使用对象类型作为key

**创建Map**
```js
const map = new Map()

// 创建map时也可以放入数组 -- entries
const map = new Map([[obj,value],[obj2,value2]])
```

#### Map的属性和方法

* **添加元素 -- set**
```js
map.set([key,value])
```

* **获取值 -- get(key)**
```js
const value = map.get(key)
```

* **查找值 -- has(key)**
```js
const is_has = map.has(key)
```

* **删除值 -- delete(key)**
```js
map.delete(key)
```
* **清空数据 -- clear( )**
```js
map.clear()
```
* **遍历**
```js
// forEach方法
map.forEach(item=>console.log(item))

// for...of
for(const item of map){
  console.log(item) // 输出结果是键值对
}
// 遍历时解构
for(const [key,value] of map){
  console.log(key,value)
}
```

### WeakMap

> 与Map相似，也是存储键值对

* WeakMap的key只能使用对象
* WeakMap的key对于对象的引用也是`弱引用`

#### 常见方法
* get方法
* has方法
* delete方法
* 没有size和clear( )
* 不能进行遍历

#### 应用场景

* **Vue3的响应式原理**
```js
// 创建两个需要监听的对象
const obj1 = {name:"enhypen"}
const obj2 = {name:"bts"}

// 创建监听执行方法
function Obj1NameFn1(){
  console.log("change obj1.name 1")
}
function Obj1NameFn2(){
  console.log("change obj1.name 2")
}
function Obj2NameFn1(){
  console.log("change obj2.name 1")
}
function Obj2NameFn2(){
  console.log("change obj2.name 2")
}

// 目的 当obj1 obj2的name改变时，分别执行它们对应的方法

// 创建一个WeakMap
const wm = new WeakMap()
// 创建Map，存储对应的方法
const map1 = new Map()
map1.set("name",[Obj1NameFn1,Obj1NameFn2])
const map2 = new Map()
map2.set("name",[Obj2NameFn1,Obj2NameFn2])

// 将映射关系存入wm
wm.set(obj1,map1)
wm.set(obj2,map2)

// 当检测到变化 --> 内部执行
wm.get(obj1).forEach(item=>item())
```

**为什么使用WeakMap而不是Map**
* 为了能将 **不再使用的数据进行正确的垃圾回收**


# ES7

## Array Includes

> 判断数组是否包含一个元素

* 第一个参数 -- 查找的元素
* 第二个参数 -- 查找的起始索引
```js
const arr = [11,2]
const is_has = arr.includes(11,2) // true/false
```

**变化**
* 可以正确判断NaN

## 指数运算符

```js
// before
const res = Math.pow(1,2)
// after
const res = 1 ** 2
```

# ES8

## Object.values

> 之前我们可以通过Object.keys可以获取对象的所有属性名
> ES8新增了一个Object.values获取对象的所有属性值/数组的元素/字符串的每个字符


## Object.entries

> 获取一个数组，包含了对象的键值对/数组或对象的索引&值
> for...of就是获取的对象的entries

## String Padding

> 字符串填充；某些字符串需要一些方式进行前后填充以进行格式化

**两个方法**
* str.padStart(length,char)
* str.padEnd(length,char)
```js
const str = "hello"
const new_str = str.padStart(10,"*").padEnd(12,"-")
// new_str === *****hello--
```

## Trailing-Commas (结尾的逗号)

> 支持在函数的最后一个参数加上逗号

```js
function foo(a,b,){}
```

## Object Descriptors

> 支持在函数前添加async和await修饰符

# ES9 - E12

## ES9

* 迭代器
* 展开运算符
* Promise的finally方法

## ES10

### flat (降维)

>该方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组并返回

```js
const arr = [10,20,[2,9],[[30,40]],50] // 三维数组
// 转为一维数组
const new_arr = arr.flat(2) // 默认降维深度为1
// [10,20,2,9,[30,40],50]
```
### flatMap

> 该方法会对数组进行两个操作：`首先使用映射函数映射每个元素，然后将结果压缩成一个新数组`

**注意**
* flatMap先进行的map操作，再做flat操作
* flat的深度为1

```js

```

### Object.fromEntries

> 对于Object.entries获取到的格式数据，如何转换成对象呢

**以前**
```js
const newObj = {}
for(const entry of entries){
  newObj[entry[0]] = entry[1]
}
```

**es10 新增的方法**
```js
const newObj = Object.fromEntries(entries)
```

### trimStart( ) & trimEnd( )

> 消除字符串前后空格

### try/catch binding

## ES11
### BigInt

> 在JS里面不能`正确的表示`过大的数字

**es11之前可以表示的最大的数字**
```js
const big_num = Number.MAX_SAFE_INTEGER
// 最大的安全数字
```

**es11新增数据类型** -- bigInt
```js
const bigInt = 111111111111n
// 末尾必须加上n
```

**大数字操作**
* 大数字不支持隐式数据转换
```js
// 这样操作是不正确的
const bigInt = 11n
bigInt + 10

// 两种操作方法
bigInt + 10n
bigInt + bigInt(10) // 显式转换

// bigInt转Number不一定是正确的
```

### 空值合并运算符 Nullish Coalescing Operator

**替代逻辑或**
```js
const foo = undefined
const bar = foo ?? "default value"
// 替代写法 -- const bar = foo || "default value"
```

### 可选链 Optional Chaining

> 可选链主要作用是让我们的代码在进行null和undefined判断时更加清晰和简介

**从undefined获取属性**
```js
const obj = {name:1}
console.log(obj.bar.name) // 报错

// 且后面的代码都不可以运行
```

**es11提供的可选链**
```js
console.log(obj.bar?.name)
```

### Global This

> 对于**获取全局变量**：浏览器使用window/全局的this；node使用global

**es11的全局对象**
```js
console.log(globalThis) // 在不同的环境指向不一样
```

### for-in标准化

> 在以前，for-in没有ECMA标准化
> ES11中，标准化规定for-in用于遍历对象的key

### 其他

* 动态导入 模块化
* Promise.allSettled
* mata


## ES12

### FinalizationRegistry

> FinalizationRegistry对象可以让我们在对象被垃圾回收时请求一个回调

* 提供了一个方法：`当一个在注册表注册的对象被回收时，请求在某个时间点上调用一个清理回调`
* 通过register方法可以注册任何想要清理回调的对象，传入该对象和所含的值

**基础使用**
```js
// 注册时接收参数 -- 可以表示是哪个对象被回收
const finalRegistry = new FinalizationRegistry((value)=>{
  // 当注册在该对象中的对象被回收时 执行内部代码
  console.log("finalRegistry",value)
})

let obj = {name:"name"}
// 注册 -- 注册时同时可以传值
finalRegistry.register(obj,"obj")

// 修改obj指向
obj = null

// 在浏览器等待GC检查(node不支持) 控制台会打印
"finalRegistry"
```

### WeakRef

> es12新增了**WeakRef类** -- 创建一个原对象的弱引用

**before**
```js
let obj = {}
let info = obj

// 设置obj = null 并进行FinalizationRegistry对象方法的注册
// obj并不会被销毁 -- 因为还有info的强引用关系

// 要建立弱引用关系
const w_s = new WeakSet()
w_s.set(obj)
```

**after**
* es12提供了快捷类实现该操作 -- WeakRef

```js
let info = new WeakRef(obj)
// 获取原对象
console.log(info.deref())
```

### 逻辑赋值运算符

* **逻辑或** -- ||=
```js
// before
const str = undefined
const message = str || "msg"

// after
const str = undefined
const message ||= "msg"
```

* **逻辑与** -- &&=
```js
// before
const info = {name:"name"}
const info = info&&info.name

// after
const info &&= info.name
```

* **逻辑空** -- ??=

### 其他
* 数字分割符 _
* replaceAll 字符串替换

# Proxy/Reflect

## 监听对象的操作

**实现的操作方式**
* 存取属性描述符的get与set ; Object.defineProperty方法
     * 缺点：Object.defineProperty的设计初衷并不是监听对象的属性；对于更加丰富的操作( `新增属性` )是无能为力的

## Proxy

>ES6新增的Proxy类，用于为我们创建一个代理

* 如果我们想要监听一个对象的操作，可以先创建一个`代理对象(new Proxy())`
* 之后对于该对象的操作都通过代理对象完成

### 使用

```js
const obj = {name:"name"}
// 两个参数：创建代理的对象；捕获器
const objProxy = new Proxy(obj,{})

// 1. 获取
console.log(objProxy.name)

// 2. 操作
objProxy.age = 23

// 3. 监听 -- 捕获器
```

**捕获器**
```js
const objProxy = new Proxy(obj,{

  // 获取值时的捕获器
  get:function(target,key){
    // 参数：target -- 对象本身 key -- 监听的属性名
    return target[key]
  },
  // 设置值时的捕获器
  set:function(target,key,newValue){
    target[key] = newValyue
  }
  
})
```

### Proxy的其他捕获器

* **has** -- 监听查找属性存在的捕获器
```js
has:function(target,key){
  console.log("查找key")
  return target[key]
}
```

* **delete** --- 监听删除的捕获器
```js
delete:function(target,key){
  console.log("删除key")
  return key in target
}
```

* handler.getPrototypeOf -- `Object.getPrototypeOf()方法的监听`
* handler.setPrototypeOf --  `Object.setPrototypeOf()方法的监听`

**特殊的捕获器 -- 函数**
* handler.apply( ) -- `函数调用的捕获器`
* handler.construct( ) -- `new操作符的捕获器`
```js
function foo(){}
const foo_proxy = new Proxy(foo,{
  // apply 捕获器
  apply:function(target,thisArg,arrArg){
    // target -- 函数本身；thisArg -- apply传入的this绑定对象；arrArg -- 参数数组
    console.log("调用了function")
    target.apply(thisArg,arrArg)
  },
  // constructor捕获器
  constructor:function(target,argArray){
    console.log("通过new调用了函数")
    return new target(...argArray)
  }
})
```
## Reflect

> es6新增的一个API 它是一个**对象**而不是一个类，字面的意思是**反射**

**作用**
* 它提供了很多操作JS对象的方法 有点像Object操作对象的方案

**为什么需要**
* 在早期的ECMA规范时没有考虑到对于对象本身的操作如何设计会更规范，所以将API放到了Object上
* 但是Object作为一个构造函数，这些操作放在它身上其实不合适
* 另外还包含一些`in delete操作符` 让JS看起来有点奇怪
* 所以ES6新增了Reflect让我们将操作都集中到Reflect对象上

### Reflect常见方法

* 刚好有十三个和Proxy捕获器对应的方法

### Reflect的使用

* 使用Proxy时 对于代理对象的操作还是对于原来对象的操作；与预期相悖
* 因此，可以将Proxy和Reflec结合起来进行使用

```js
const objProxy = new Proxy(obj,{
  get:function(target,key,receiver){
    return Reflect.get(targert,key)
  },
  set:function(target,key,newValue,reveiver){
	Reflect.set(target,key,newValue)
  }
})
```

**Reflect与之前方法的区别**
* Reflect的执行结果会返回一个布尔值( `是否调用成功` )

### 关于最后一个参数receiver

**普通使用**
```js
const objProxy = new Proxy(obj,{
  set:function(target,key,newValue){
     // 这个操作直接访问的对象targer[key]属性
     // 如果是直接访问，那么捕获器中的拦截就没有意义了
     Reflect.set(target,key,newValue) 
  }
})
```

* 我们希望`先在代理对象上操作，再在实例对象上访问`
* receiver参数 -- 该参数就代表了代理对象
```js
const objProxy = new Proxy(obj,{
  set:function(target,key,newValue,receiver){
     Reflect.set(target,key,newValue,receiver) 
  }
})
```

### constructor方法

**使用场景**
* 在早期，ES6转ES5的源码中运用到了Reflect
* 目的是 ：`执行的是fn1函数的代码，但创建的是fn2构造函数创建的对象`

**使用constructor实现**
```js
const obj = Reflect.constructor(fn1,arrArg,fn2)
```






# 响应式
## 什么是响应式

**响应式意味着什么**
* m有一个初始化的值，有一段代码使用了这个值
* 那么在m有一个新的值时，这段代码可以自动执行

##  实现响应式

```js
// 监听obj变化
const obj = {name:"name"}
```
### 响应式函数的封装

>将所以响应式函数放到一个数组内进行循环调用

```js
function watchFn(fn){
  
}
```
### 封装收集依赖类

> 使对象的属性与类一一对应

```js
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

const depend = new Depend()
function watchFn(fn){
  depend.addDepend(fn)
}
```

### 自动监听执行

> 使用Proxy&Reflet

```js
const objProxy = new Proxy(obj,{
  set:function(target,key,newArr,receiver){
    Reflect.set(target[key],newArr,receiver)
    // 通知响应
    depend.notify()
  },
  get:function(target,key,receiver){
    return Reflect.get(target[key],receiver)
  }
})

watchFn(
  function(){
    objProxy.name = "name"
    console.log("change name")
})

watchFn(
  function(){
    console.log("get name"+objProxy.name)
})
```

### 依赖收集管理

> 此时的depend只有一个 监听的是整个对象
> 而在实际场景中，我们会有多个对象，而且对象内有多个属性

**应该怎样管理？**

* 将一个对象的不同属性监听器存储在Map中
* 将不同对象存储在WeakMap中


**获取depend函数 -- 告诉我们应该操作哪个depend**
```js
function getDepend(targer,key){
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
```

**如何收集依赖？**
```js
let activeReactiveFn = nul

function watchFn(fn){
  activeReactiveFn = fn
  fn()
  activeReactiveFn = null
}


// 在get内收集
  get:function(target,key,receiver){
    const depend = getDepend(targer,key)
    // 怎样获取函数？ -- 设置全局对象
    depend.addDepend(fn)
    return Reflect.get(target[key],receiver)
  }
```

### 初步代码
```js
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
```

### 自动化添加对象响应式
```js
function reactive(obj){
  return new Proxy(obj,{

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
}

// 自动化响应式
const foo = reative({name:"name"})
```
## vue中的响应式

* vue2中的响应式基于**Object.defineProperty**
   `Obj.entries(obj).forEach(item=>item.defineProperty...)`
* vue3的响应式底层就是上述内容 **Proxy&Reflect**




# 迭代器和生成器 Iterator-Generator

## 什么是迭代器

> 是使用户可以在容器对象上遍历访问的对象，这个对象 必须符合迭代器协议

**迭代器协议**
*  迭代器协议定义了一系列值的标准方法
* 那么在JS这个标准就是一个 特点的next方法

**next方法的要求**
* 一个无参数函数 返回一个应当拥有以下两个属性的对象：
     * done( boolean ) `如果迭代器可以产生序列的下一个值 则为false；反之为false`
     * value -- 迭代器返回任何的js值 
* done为true时可以省略

**手写迭代器**
```js
const iterator = {
  next:function
}
```





# Promise

## 异步任务的处理

**切入**
* 我们调用一个函数，这个函数中发送网络请求
* 如果发送成功，就告诉调用者发送成功；失败则通知失败

**原有的技术**
* 需要自定义回调函数

新技术的出现都是为了解决原有技术的痛点

**更好的方案**
* 规定好了所有的代码逻辑

### Promise

#### 什么是Promise
* ES6新增的API
* 是一个类（可以看做构造函数），给我们一个规范的方式对于异步任务进行操作 ，可以减少沟通成本
* 当我们需要给予调用者一个承诺，待会儿我会给你回调数据时，就可以新建一个Promise对象
* 在通过new创建Promise对象时，需要传入一个回调函数，称为executor
     * 传入参数  resolve和reject（都是回调函数）

```js
const promise = new Promise((resolve,reject)=>{
  // 内部代码立即执行
  // 这个函数称为executor
  // 可以传递参数
  if(成功的条件) resolve(res)
  else reject()
})

promise.then((res)=>{
  // 执行resolve函数被回调
  console.log("成功",res)
}).catch(()=>{
  // 执行reject函数被回调
  console.log("失败")
})
```

#### Promise对象的三种状态

> 为了知道当前Promise处于哪种阶段

* executor函数内部 -- pending (待定)
* resolve函数执行 -- fulfilled / resolved (已兑现)
* reject函数执行 -- rejected (已拒绝)

**状态一旦确定下来，就不可改变；不过后面的代码依然可以执行**

#### resolve参数

**resolve参数有不同类型**
* 普通的值或者对象
* 传入一个Promise 
  `当前Promise的状态 会由传入的Promise对象决定，即状态的移交`
* 传入的对象有一个then方法，且这个对象实现了thenable接口
  `会执行then方法，且状态由then方法决定`

#### then方法

> then方法属于Promise的对象方法(在原型上)，必须在实例对象上执行
> then方法传入的回调函数**可以有返回值**

* 同一个Promise可以多次调用then方法；当resolve被回调时这些then方法都会执行 

**返回值**
* 普通值 -- 作为一个新的Promise的resolve值
  `内部会生成新的Promise -- 链式调用的本质`
```js
// 返回1
then(()=>return 1)
// 相当于：
return new Promise(resolve=>{
  resolve(1)
})
```
* 无返回值 -- 默认为undefined
* Promise -- 由Promise决定创建出的Promise的状态
* 实现了thenable的对象 -- 由then方法决定创建出的Promise的状态

#### catch方法

> catch方法可以传入错误(拒绝)捕获的回调函数

* catch并不符合Promise A+规范
* 相当于then的一个语法糖，只是为了提高阅读性

```js
const promise = new Promise((resolve,reject)=>{
}).then().catch() // catch指的是第一个Promise而不是then方法返回的
```







# 事件循环

# async  & await

## async异步函数的使用

* async用于声明异步函数
```js
async function foo(){}
const foo2 = async ()=>{}
class F{
  async foo2(){}
}
```

* async函数内部的代码执行
     * 没有特殊操作 -- 和普通函数的执行没有区别


* **和普通函数的区别**
     * 关于返回值 ：异步函数的返回值一定是Promise，then的执行时机在异步函数return后
     * 关于异常：普通函数抛出异常后不会再执行后续代码；异步函数内的异常会被作为Promise的rerject值，不会影响后续代码


## await关键字

* async函数内部可以使用await关键字；普通函数在解析时就会报错

**用法**
* await后面跟的是表达式，表达式的返回值是Promise
* 什么时候返回结果 -- `Promise执行并有返回值`
* 在await执行完毕后，后续代码才会执行( `相当于在then里面执行，因此这些代码都可以看做微任务` ) 

**await + 普通值**
* 立即返回并赋值

**await + thenable对象**
* 返回对象then方法的值

**reject的情况**
* 必须catch才可以，否则报错


# 异常处理

> 对于错误操作，需要进行正确的异常处理方案，告知调用者哪里出现的错误

## throw关键字

> throw关键字用于抛出错误信息
> 如果没有对于程序做出处理，后续代码则无法运行

```js
throw "error"
```

* 抛出的信息可以是基础数据对象，并不常用
* 比较常见的是抛出`对象类型`，包含的信息更多更丰富

## 异常类型

* 如果每次throw抛出错误，都要新建一个对象，会很麻烦
* 常用的处理方式是`新建一个错误类`
```js
class MyError{}
throw new MyError
```

* JS内部提供的Error类
```js
// 需要传入一个参数message
throe new Error("error message")
```

**Error打印信息**
* 打印的实际是函数调用栈信息
* 方便我们进行调试

**Error子类**
* 类型错误 -- TypeError
* 下标值越界 -- RangeError
* 解析语法错误 -- SyntaxError

**如果函数抛出了异常，后续代码都不会被执行**

## 抛出异常处理

* 如果不处理异常 -- 直接继续将异常抛出去；直至到达最顶层调用，程序终止

* try...catch

### try...catch...finally

```js
try{
  // 代码块
  if(...) throw new Error("message")
}catch(err){
 // 处理异常 error捕获异常
 console.log(error.message)
 // 不会终止后续代码
}finally{
  // 一定会执行的代码
}
```

**ES10新增 -- 可以省略(error)**
# 模块化

**在以前，HTML内引用的JS文件**
* 没有自己的独立空间，导致命名冲突
* 解决方案 -- 新建函数作用域/函数表达式
```js
(function(){

})()
```
* 解决全局作用域使用不了函数作用域的变量的问题
     * 函数返回一个包含变量的对象
     * 问题 -- 函数返回值名称的命名冲突；难以记住名称；没有规范
```js
var moudleA = (function(){
  return {
    a,b
  }
})()
```

**什么是模块化，什么是模块化开发？**
* 模块化开发最终的目的是`将程序划分成一个个小的结构`
* 这个结构中编写`自己的逻辑代码`，有`自己的作用域`，不会影响到其他的结构
* 这个结构可以将自己`希望暴露的变量，函数和对象导出`给其他结构使用
* 也可以通过某种方式，导入语另外结构中的`变量，函数和对象等`
* 上面提到的结构就是模块，按照这种结构划分开程序的过程就是模块化开发

**早期JS是不支持模块化开发的**
* 因为JS早期仅仅作为一种验证表达和动画实现的脚本语言，那时代码是很少的
* 这个时候JS代码只需要写到< script >标签中即可
* 并没有必要放到多个文件来编写

**但是随着前端和JS的快速发展，JS代码变得越来越复杂**
* ajax的出现，前后端开发分离意味着后端返回数据后，我们需要通过JS进行前端页面渲染
* 包括Node的实现，JS编写负责的后端程序，没有模块化是致命的硬

**因此，模块化成为JS一个非常迫切的需求**
* 直到ES6才推出了自己的模块化方案
* 在此之前，为了让JS支持模块化，涌现了很多不同的模块化规范：`AMD,CMD,CommonJS`


## CommonJS规范

### CommonJS与Node的关系

> 我们需要知道CommonJS是一个规范，最初提出来就是在`浏览器以外的地方使用`
> 最初命名为ServerJS 后来为了体现它的广泛性，修改为**CommonJS**，也简称**CJS**

* Node是CommonJS在服务端一个具有代表性的实现
* Browserofy是CommonJS在浏览器的一种实现
* webpack打包工具具备对CommonJS的支持与转换

**Node对于CommonJS进行了支持与实现**
* 在Node中，每一个JS文件都是一个单独的模块
* 这个模块中包括`CommonJS规范的核心变量`:**exports，module.exports，require**
* 我们可以使用这些变量方便的进行模块化开发

**Node对于模块化的核心，即导入和导出 进行了实现**
* exports和module.exports可以负责对模块的内容进行导出
* require函数帮助导入模块内容（自定义模块，系统模块，第三方库模型）

### 导出方案

#### module.exports

> module.exports是一个对象
> module是这个模块本身的对象，exports属性也是一个对象

**基础实现**
```js
const name = 1
module.exports = {
  name
}
```

**内部原理 -- 引用赋值**

* module.exports赋值对象后，内存里的对象就会被暴露导出
* 
```js

```

#### exports

```js
const name = 1
exports.name = name
```

**原理**
```js
module.exports = {}
exports = module.exports

// 后续操作 相当于给module.exports添加属性
module.name = name // module.exports = name
```

**问题**
```js
exports = {
  ...
}
// 解除了exports与module.exports的关系
// 无法导出

exports.name = name
module.exports = { ... }
// module.exports指向了新对象
// 无法导出
```

**存在意义**

* 严格意义上来说module.exports是不符合common.js的规范
* 所以Node内添加了这一变量
* **but如今渐渐被抛弃了**
### 导入方案 -- require

> require本质是一个函数

**基础实现**
```js
// 获取对象 require后跟路径
const data = require('/ex.js')
// 解构
const {name} = require('/ex.js')
```

**内部原理 -- 引用赋值**
* 相当于
```js
function require(){
  return module.exports
}

const data = require('/ex.js')
```
* 和导出的对象是 一个对象，只是建立了一种引用关系

#### require的细节

##### 1. require的查找规则

* 导入格式：require(X)

**X不同形式的查找规则**
* X是一个Node核心模块，比如path，http
  `直接返回核心模块，并停止查找`
```js
const path = require("path")
```

* X是以`/或者./或者../等开头的`字符串
     * **把X当作文件 --** X有后缀名 -- 根据后缀名格式查找文件
     * X没有后缀名 按照如下顺序
         1. 直接查找文件X
         2. 查找X.js文件
         3. 查找X.json文件
         4. 查找X.node文件
     * **没有找到对应文件，将X作为一个目录**
     * 查找目录下的index文件 
         1. 查找X/index.js文件
         2. 查找X/index.json文件
         3. 查找X/index.node文件

* X不是核心模块也不是路径（第三方包）
  `在node_modules文件夹中寻找X/X.index`


### 模块的加载过程

* **结论一**：模块在第一次被引入时，模块中的JS代码就会被运行一次
* **结论二**：模块被多次引入时，会缓存，最终只加载 ( 运行 ) 一次
     * 为什么只有一次？ 
     `因为每个模块对象module都有一个属性：loaded；值为false表示未加载`
     `true表示未加载；该属性会记录是否被加载过`
 * **结论三**：如果有循环引用，那么加载顺序是什么？
     * 这其实是一种数据结构；Node则采用深度优先算法DFS遍历

### CommonJS的缺点

* CommonJS是同步的，代码是一行一行执行的，有可能造成阻塞
  `因为这一特性，CommonJS不适合于浏览器，更适合Node；当然也存在库可以实现异步加载`
* webpack中是另一回事，它会将Common转换成浏览器可以直接执行的代码

## AMD规范化

> AMD (Asynchronous Module Definition) 异步模块定义

* 它采用的是**异步加载模块**
* AMD实现的比较常用的库是`require.js和curl.js`

### require.js使用

#### 准备工作
* 下载require.js文件
* 定义HTML的script标签引入require.js定义入口文件
```html
<script src="./require.js" data-main = "./index.js"></script>

<!-- data-main属性的作用是在加载完src的文件后 才会加载执行该文件 -->
```

#### index.js实现AMD规范模块化

**注册模块**
```js
// 注册
require.config({
  baseUrl:'', // 定义根路径 默认为index.js所处文件夹
  paths:{
    foo:'./foo', // 相对于index.js的模块文件
    bar:'./bar'
  }
})
// 导入并使用
require(["foo"],function foo(){
  console.log("foo",foo)
  // {name,age}
})
```

**模块导出**
```js
define(function(){
  const name = 1
  const age = 2
  return {
    name,age
  }
})
```

## CMD规范

> CMD ( Common Module Definition ) 通用模块定义

* 异步加载模块
* 吸收了CommonJS的优点
* 实现方式：`sea.js`

**准备工作** -- 导入sea.js
```html
<script src = "./sea.js"></script>
<script>
  // 在此处设置入口文件
  seajs.use("./src/index.js")
</script>
```


**导入模块**
```js
define(function(require,exports,module){
  const foo = require("./foo,js")
  // 使用导入的模块
  console.log(foo)
})
```

**导出模块**
```js
define(function(require,exports,module){
  const name = 1
  const age = 2
  module.exports = {
    name,age
  }
})
```

## ESModule

**ESModule与CommonJS的不同**
* 一方面它使用了`import(导入)`和`export(导出)`关键字
* 另一方面它采用`编译期的静态分析`，同时也加入了`动态引入的方法`

**编译期的静态分析**
* 指的是在代码执行之前，JS引擎或者打包工具会对代码进行解析
* 主要有以下作用：
     * 确定模块依赖关系
       `在 ESModule 中，导入和导出语句是静态的，也就是它们必须位于文件的顶层，不能出现在条件语句或者函数内部`
     * 提前检查语法错误
     * 支持 Tree Shaking

**动态引入的方法**
* 允许在运行时动态加载模块，为开发者提供了更大的灵活性，能够根据运行时的条件来决定是否加载某个模块


**ESModule**
ESModule 的编译期静态分析使得代码更加可预测、易于优化，同时动态引入的方法又提供了运行时的灵活性

**采用ESModule会自动采用严格模式**




### 导入与导出
#### 导出
* 导出 -- export直接加声明语句
```js
export const name = 2
export const age = 1
```

* 导出 -- export {}
   `固定语法，不是对象`
```js
export {
  name, // 名字必须和变量相同
  // 取别名
  name as Nname // Nname就是导出的别名
  age
}
```


#### 导入
* 普通导入
```js
import { name,age } from './foo.js'
// 普通方式使用会报错；必须在模块内
```

* 别名导入
```js
import { name as Nname,age as Nage } from './foo.js'
```

* 将所有导入的内容放到一个标识符内
```js
import * as data from './foo.js'
```

* 如何声明一个文件为模块
  `script标签中定义type属性`
```html
<script src = "main.js" type="module"></script>
```

**注意**
* 不能通过本地方式打开加载一个模块
* 要开启一个本地服务才可以

#### 结合使用

> 为了代码规范，对于多个需要导入的工具模块
> 新增一个index.js作为统一出口

```js
export {foo} from "./foo.js"

export * from "./foo.js"
```






