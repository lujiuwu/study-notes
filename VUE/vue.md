### vue的响应式原理/双向数据绑定
**当依赖数据发生改变时，与之关联的数据或计算结果能够自动更新就是响应式。**
双向绑定：指的是vue实例中的data与其渲染的DOM元素的内容保持一致，无论谁被改变，另一方会相应的更新为相同的数据

**原理：**
* 数据劫持结合发布者-订阅者模式实现

#### “数据变化后会重新对页面进行渲染”实现这一过程需要实现
* 侦测数据的变化 -- **数据劫持/数据代理**
* 收集视图依赖了哪些数据 **依赖收集**
* 数据变化时，自动“通知”需要更新的视图部分，并进行更新  **发布订阅模式**
#### 1. 数据劫持/数据依赖
> 在JS中如何侦测一个对象的变化 -- Object.defineProperty和ES6的Proxy

##### 方法1.Object.defineProperty实现 -- 出于对旧浏览器的支持 vue2使用
Vue通过设定对象属性的 setter/getter 方法来监听数据的变化，通过getter进行依赖收集，而每个setter方法就是一个观察者，在数据变更的时候通知订阅者更新视图
```js
let obj = {value:"val"}

Object.defineProperty(obj,"value",{

  // 属性被获取时调用

  get(){

    console.log("get value")

    return this._value

  },

  // 属性被设置时调用

  set(newVal){

    console.log("set value,new value is"+newVal)

    this._value = newVal

  }

})

// 调用obj.value

console.log(obj.value)

// 设置obj.value

obj.value = "newVal"
```
##### 方法2. Proxy实现 （兼容性不太好） -- vue3使用
Proxy对象允许你拦截并自定义对象的基本操作，包括属性访问和修改。这使得你可以创建一个代理对象，当访问或修改目标对象的属性时，会触发预定义的行为。
`Proxy` 是 JavaScript 2015 的一个新特性。**`Proxy` 的代理是针对整个对象的，而不是对象的某个属性**，因此不同于 `Object.defineProperty` 的必须遍历对象每个属性，`Proxy` 只需要做一层代理就可以监听同级结构下的所有属性变化，当然对于深层结构，递归还是需要进行的。此外`Proxy`支持代理数组的变化。
```js
new Proxy(
  { value: initialValue },
  {
            get(target, key) {
              return target[key];
            },
            set(target, key, value) {
              target[key] = value;
              if (key === "value") {
                updateDisplay(); // 当.value被设置时，更新DOM
              }
              return true;
            },
          }
    )

```
#### 2. 依赖收集 -- “事件发布订阅模式”

##### 订阅者Dep
* 收集依赖需要为依赖找一个存储依赖的地方，为此我们创建了Dep,它用来收集依赖、删除依赖和向依赖发送消息等。
* 它的主要作用是用来存放 Watcher 观察者对象
```js
class Dep {
    constructor () {
        /* 用来存放Watcher对象的数组 */
        this.subs = [];
    }
    /* 在subs中添加一个Watcher对象 */
    addSub (sub) {
        this.subs.push(sub);
    }
    /* 通知所有Watcher对象更新视图 */
    notify () {
        this.subs.forEach((sub) => {
            sub.update();
        })
    }
}
```

**代码功能：**
- 用 addSub 方法可以在目前的 Dep 对象中增加一个 Watcher 的订阅操作
- 用 notify 方法通知目前 Dep 对象的 subs 中的所有 Watcher 对象触发更新操作
所以当需要依赖收集的时候调用 addSub，当需要派发更新的时候调用 notify
```js
let dp = new Dep()
dp.addSub(() => { console.log('emit here') })
dp.notify()
```

##### 观察者Watcher
Vue 中定义一个 Watcher 类来表示观察订阅依赖
**为什么引入？**
当属性发生变化后，我们要通知用到数据的地方，而使用这个数据的地方有很多，而且类型还不一样，既有可能是模板，也有可能是用户写的一个watch
这时需要`抽象出一个能集中处理这些情况的类`。然后，我们在依赖收集阶段只收集这个封装好的类的实例进来，通知也只通知它一个，再由它负责通知其他地方。

**依赖收集的目的是将观察者 Watcher 对象存放到当前闭包中的订阅者 Dep 的 subs 中

```js
// Watcher简单实现
class Watcher {
  constructor(obj, key, cb) {
    // 将 Dep.target 指向自己
    // 然后触发属性的 getter 添加监听
    // 最后将 Dep.target 置空
    Dep.target = this
    this.cb = cb
    this.obj = obj
    this.key = key
    this.value = obj[key]
    Dep.target = null
  }
  update() {
    // 获得新值
    this.value = this.obj[this.key]
   // 我们定义一个 cb 函数，这个函数用来模拟视图更新，调用它即代表更新视图
    this.cb(this.value)
  }
}
```

##### 收集依赖
收集依赖总结起来就一句话，`在getter中收集依赖，在setter中触发依赖。先收集依赖，即把用到该数据的地方收集起来，然后等属性发生变化时，把之前收集好的依赖循环触发一遍就行了。`
具体来说，当外界通过Watcher读取数据时，便会触发getter从而将Watcher添加到依赖中，哪个Watcher触发了getter，就把哪个Watcher收集到Dep中。当数据发生变化时，会循环依赖列表，把所有的Watcher都通知一遍。




#### 事件监听


### v-show和v-if
* v-if是真正的条件渲染，它会确保在切换过程中条件快内的事件监听器和子组件适当地被销毁和重建；同时它也是`惰性的`，如果在渲染条件为假时就什么都不做
* v-show是简单的基于CSS的display属性进行切换

**v-if适合用于运行时很少改变条件；v-show适用于频繁切换条件的场景**

### class与style如何动态绑定
* 通过对象语法：
```html
<div v-bind:class="{active:isActive}"></div>
```
* 通过数组语法 -- 三元运算符
```html
<div v-bind:class="[isActive?'activr':'']"></div>
```

### vue的单向数据流
在vue中 数据流是指数据的传递和管理状态，vue采用了单向数据流，也就是说数据是从父组件传到子组件，而子组件不能直接修改父组件的值
所有的prop都使父子prop之间形成了一个`单向下行绑定`，父级prop更新会下流到子组件中，反之不行，这样可以防止子组件意外改变父级组件的状态
如果子组件想修改值，只能通过$emit派发一个自定义事件，父组件收到后再进行修改

### computed和watch的区别和应用场景
**computed：** 是计算属性，依赖其它属性值，并且 computed 的值有`缓存`，只有它依赖的属性值发生改变，下一次获取 computed 的值时才会重新计算 computed 的值；当我们需要进行数值计算并且依赖于其他数据时使用，这样可以`避免每次获取值时，都要重新计算`

**watch：** 更多的是「观察」的作用，类似于某些数据的监听回调 ，每当监听的数据变化时都会执行回调进行后续操作；当我们需要在数据变化时执行异步或者开销较大的操作时使用
`使用 watch 选项允许我们执行异步操作 ( 访问一个 API )，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。这些都是计算属性无法做到的。`

### vue生命周期
![](JS/红宝书/noteImg/D2B5CA33BD970F64A6301FA75AE2EB22.png)
#### 什么是生命周期
Vue 实例有一个完整的生命周期，也就是从开始创建、初始化数据、编译模版、挂载 Dom -> 渲染、更新 -> 渲染、卸载等一系列过程，我们称这是 Vue 的生命周期。

#### 各个生命周期
* beforeCreate -- 组件实例被创建之初，组件的属性生效之前
* created -- 组件实例已经完全创建，属性也绑定，但是真实DOM还没有生成
* beforeMount -- 在挂载开始之前被调用；相关的 render 函数首次被调用
* mountd -- el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子
* beforeUpdate -- 组件数据更新之前调用，发生在虚拟 DOM 打补丁之前
* update -- 组件数据更新之后
* activited -- keep-alive 专属，组件被激活时调用
* deactivited -- keep-alive 专属，组件被销毁时调用
* beforeDestory -- 组件销毁前调用
* destoryed -- 组件销毁后调用

#### 可以执行的操作
**调用异步请求**
* 可以在钩子函数 created、beforeMount、mounted 中进行调用

**访问操作DOM**
* mounted中

### keep-alive
keep-alive 是 Vue 内置的一个组件，可以使被包含的组件保留状态，避免重新渲染 ，其有以下特性：

- 一般结合路由和动态组件一起使用，用于缓存组件；
- 提供 include 和 exclude 属性，两者都支持字符串或正则表达式， include 表示只有名称匹配的组件会被缓存，exclude 表示任何名称匹配的组件都不会被缓存 ，其中 exclude 的优先级比 include 高；
- 对应两个钩子函数 activated 和 deactivated ，当组件被激活时，触发钩子函数 activated，当组件被移除时，触发钩子函数 deactivated。

### 组件中data为什么是一个函数
因为组件是用来复用的，且 JS 里对象是引用关系，如果组件中 data 是一个对象，那么这样作用域没有隔离，子组件中的 data 属性值会相互影响，如果组件中 data 选项是一个函数，那么每个实例可以维护一份被返回对象的独立的拷贝，组件实例之间的 data 属性值不会互相影响；而 new Vue 的实例，是不会被复用的，因此不存在引用对象的问题。  

### Vue组件间通信

#### 组件间的关系
* 父子关系
* 兄弟关系
* 隔代关系

#### 方法

##### 方法一：props **父组件向子组件传值**

* 父组件
```html
<div>
  <!--子组件-->
  <Son :props_data="props_data"></Son>
</div>
```

* 子组件
```html
//users子组件
<template>
  <div class="hello">
  </div>
</template>
<script>
export default {
  name: 'HelloWorld',
  props:{
    props_data:{           //这个就是父组件中子标签自定义名字
      type:Array,
      required:true
    }
  }
}
</script>
```

**父组件通过props向下传递数据给子组件**

##### 方法二：$emit事件 **子组件向父组件传值**

* 子组件
```html
// 子组件
<template>
  <header>
    <h1 @click="changeTitle">{{title}}</h1>//绑定一个点击事件
  </header>
</template>
<script>
export default {
  name: 'app-header',
  data() {
    return {
      title:"Vue.js Demo"
    }
  },
  methods:{
    changeTitle() {
      this.$emit("titleChanged","子向父组件传值");//自定义事件
    }
  }
}
</script>

```

* 父组件
```html
// 父组件
<template>
  <div id="app">
    <app-header v-on:titleChanged="updateTitle" ></app-header>//与子组件titleChanged自定义事件保持一致
   // updateTitle($event)接受传递过来的文字
    <h2>{{title}}</h2>
  </div>
</template>
<script>
import Header from "./components/Header"
export default {
  name: 'App',
  data(){
    return{
      title:"传递的是一个值"
    }
  },
  methods:{
    updateTitle(e){   //声明这个函数
      this.title = e;
    }
  },
  components:{
   "app-header":Header,
  }
}
</script>

```

**子组件通过events给父组件发送消息，实际上就是子组件把自己的数据发送到父组件。**

##### 方法二：$emit / $on

* 这种方法通过一个空的Vue实例作为`中央事件总线（事件中心）`，用它来触发事件和监听事件,巧妙而轻量地实现了`任何组件间的通信`，包括父子、兄弟、跨级

**思路：**
```js
var Event=new Vue();  // 在第三方组件
Event.$emit(事件名,数据);  // 在需要发送的组件import第三方组件，并发送 
Event.$on(事件名,data => {});  // 在需要接受的组件improt第三方组件，并接受和处理
```

**具体实现：**
* 第三方组件，A.vue
```js
import Vue from 'vue';
export var event = new Vue();
```

* 需要发送信号的组件 B.vue
```js
import { event } from './A.vue';
 
bbb: function(){
	event.$emit("signal");
}
```

* 需要接收信号的组件 C.vue
```js
import { event } from './A.vue';
 
mounted: function(){
	event.$on('signal', () => {
  			this.getPublishData());
		})
}
```

C.vue监听了自定义事件signal，因为不知何时会触发事件，所以在mounted或created中去监听，监听完成调用函数去处理。

##### 方法三：vuex

* Vuex实现了一个单向数据流，在全局拥有一个State存放数据
* 当组件要更改State中的数据时，必须通过Mutation进行

**vuex中的主要模块及功能**
* state ：页面状态管理容器对象。页面显示所需的数据从该对象中进行读取
* actions ：操作行为处理模块,由组件中的`$store.dispatch('action 名称', data)`来触发。然后由commit()来触发mutation的调用 , 间接更新 state
* mutations ：**状态改变操作方法，由actions中的`commit('mutation 名称')`来触发**。是Vuex修改state的唯一推荐方法。
* getters ：state对象读取方法

**vuex与localStotage**
* vuex 是 vue 的状态管理器，存储的数据是响应式的。但是并不会保存起来，刷新之后就回到了初始状态
* 具体做法应该在vuex里数据改变的时候把数据拷贝一份保存到localStorage里面，刷新之后，如果localStorage里有保存的数据，取出来再替换store里的state。

##### 方法四 **$attrs / $listeners**

多级组件嵌套需要传递数据时，通常使用的方法是通过vuex。但如果`仅仅是传递数据，而不做中间处理`，使用 vuex 处理，未免有点大材小用。为此Vue2.4 版本提供了另一种方法 ---- `$attrs`/`$listeners`

* $attrs： $attrs就是一个容器对象，这个容器对象会存放:父组件传过来的且子组件未使用props声明接收的数据
 
 **爷孙组件的传递**：

其实，爷组件传递给孙组件的逻辑流程就是，通过爷组件首先传递给父组件，当然父组件不在props中接收，那么爷组件传递给父组件的数据就会存放到父组件的`$attrs`对象中里面了，然后，再通过`v-bind="$attrs"`，再把这个`$attr`传递给孙组件，在孙组件中使用props就能接收到`$attrs中`的数据了，这样就实现了，祖孙之间的数据传递


* `$listeners`充当一个桥梁的作用，可以将子组件emit的方法通知到爷组件
* 实现方法：`_在中间的父组件中加上$listenners`
```html
<sun v-bind="$attrs" v-on="$listeners"></sun>
```

##### 方法五：provide / inject

Vue2.2.0新增API,这对选项需要一起使用，**以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，在其上下游关系成立的时间里始终生效**
主要解决了跨层级的问题，建立起一种主动提供与依赖注入的关系

##### 方法六：$parent / $chidren与ref

- `ref`：如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例
- `$parent` / `$children`：访问父 / 子实例

不过，**这两种方法的弊端是，无法在跨级或兄弟间通信**。





### Vuex
Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。每一个 Vuex 应用的核心就是 store（仓库）。“store” 基本上就是一个容器，它包含着你的应用中大部分的状态 ( state )。

（1）Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。

（2）改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化。

主要包括以下几个模块：

- State：定义了应用状态的数据结构，可以在这里设置默认的初始状态。
- Getter：允许组件从 Store 中获取数据，mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性。
- Mutation：是唯一更改 store 中状态的方法，且必须是同步函数。
- Action：用于提交 mutation，而不是直接变更状态，可以包含任意异步操作。
- Module：允许将单一的 Store 拆分为多个 store 且同时保存在单一的状态树中。

  
### vue-router路由模式
vue-router 有 3 种路由模式：hash、history、abstract
- hash: 使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器；
- history : 依赖 HTML5 History API 和服务器配置。具体可以查看 HTML5 History 模式；
- abstract : 支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式.

### MVVM
是一个软件架构设计模式，是一种简化用户界面的事件驱动编程方式

### Vue 框架怎么实现对象和数组的监听
Object.defineProperty() 只能对属性进行数据劫持，不能对整个对象进行劫持，同理无法对数组进行劫持
通过 Vue 源码部分查看，我们就能知道 Vue 框架是通过遍历数组 和递归遍历对象，从而达到利用 Object.defineProperty() 也能对对象和数组（部分方法的操作）进行监听

### Object.defineProperty和Proxy优劣对比（vue2与vue3）

**Proxy 的优势如下:**
- Proxy 可以直接监听对象而非属性；
- Proxy 可以直接监听数组的变化；
- Proxy 有多达 13 种拦截方法,不限于 apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的；
- Proxy 返回的是一个新对象,我们可以只操作新的对象达到目的,而 Object.defineProperty 只能遍历对象属性直接修改；
- Proxy 作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利；

**Object.defineProperty 的优势如下:**
- 兼容性好，支持 IE9，而 Proxy 的存在浏览器兼容性问题,而且无法用 polyfill 磨平，因此 Vue 的作者才声明需要等到下个大版本( 3.0 )才能用 Proxy 重写。

### 虚拟DOM
#### 什么是虚拟DOM
虚拟DOM（Virtual Dom），也就是我们常说的虚拟节点，是用`JS对象来模拟真实DOM中的节点`，该对象包含了真实DOM的结构及其属性
#### 为什么使用虚拟DOM
起初我们在使用JS/JQuery时，不可避免的会大量操作DOM，而DOM的变化又会引发回流或重绘，从而降低页面渲染性能。
所以虚拟DOM出现的主要目的就是为了**减少频繁操作DOM而引起回流重绘所引发的性能问题的**

#### 虚拟DOM的作用
1. 兼容性好。因为Vnode本质是JS对象，所以不管Node还是浏览器环境，都可以操作；
2. 减少了对Dom的操作。页面中的数据和状态变化，都通过Vnode对比，只需要在比对完之后更新DOM，不需要频繁操作，提高了页面性能；
#### 虚拟DOM和真实DOM的区别
- 虚拟DOM不会进行回流和重绘；
- 真实DOM在频繁操作时引发的回流重绘导致性能很低；
- 虚拟DOM频繁修改，然后一次性对比差异并修改真实DOM，最后进行依次回流重绘，减少了真实DOM中多次回流重绘引起的性能损耗；
- 虚拟DOM有效降低大面积的重绘与排版，因为是和真实DOM对比，更新差异部分，所以只渲染局部；
#### 虚拟DOM实现原理
虚拟 DOM 的实现原理主要包括以下 3 部分：

- 用 JavaScript 对象模拟真实 DOM 树，对真实 DOM 进行抽象；
- diff 算法 — 比较两棵虚拟 DOM 树的差异；
- pach 算法 — 将两个虚拟 DOM 对象的差异应用到真正的 DOM 树。

#### diff算法
当数据变化时，vue如何来更新视图的？其实很简单，一开始会根据真实DOM生成虚拟DOM，当虚拟DOM某个节点的数据改变后会生成一个新的Vnode，然后VNode和oldVnode对比，把不同的地方修改在真实DOM上，最后再使得oldVnode的值为Vnode。

> diff过程就是调用patch函数，比较新老节点，一边比较一边给真实DOM打补丁(patch)；
> **diff是同层比较，不存在跨级比较的

1. 调用patch函数比较新老节点是否为同一节点
    - 如果是同一节点，执行patchVnode进行子节点比较；
    - 如果不是同一节点，新节点直接替换老节点；
2. 调用patchVnode方法比较两个节点是否一致
    - 如果两个节点不一样，直接用新节点替换老节点
    - 如果两个节点一样：
        - ​ 新老节点一样，直接返回；
        - ​ 老节点有子节点，新节点没有：删除老节点的子节点；
        - ​ 老节点没有子节点，新节点有子节点：新节点的子节点直接append到老节点；
        - ​ 都只有文本节点：直接用新节点的文本节点替换老的文本节点；
        - ​ 都有子节点：updateChildren
        
3. updateChildren方法的核心：
    - 提取出新老节点的子节点：新节点子节点ch和老节点子节点oldCh；
    - ch和oldCh分别设置StartIdx（指向头）和EndIdx（指向尾）变量，它们两两比较（按照sameNode方法），有四种方式来比较。如果4种方式都没有匹配成功，如果设置了key就通过key进行比较，在比较过程种startIdx++，endIdx--，一旦StartIdx > EndIdx表明ch或者oldCh至少有一个已经遍历完成，此时就会结束比较。
    - 最后，在这些子节点sameVnode后如果满足条件继续执行patchVnode，层层递归，直到oldVnode和Vnode中所有子节点都比对完成，也就把所有的补丁都打好了，此时更新到视图
#### 虚拟DOM的优缺点
**优点：**

- **保证性能下限：** 框架的虚拟 DOM 需要适配任何上层 API 可能产生的操作，它的一些 DOM 操作的实现必须是普适的，所以它的性能并不是最优的；但是比起粗暴的 DOM 操作性能要好很多，因此框架的虚拟 DOM 至少可以保证在你不需要手动优化的情况下，依然可以提供还不错的性能，即保证性能的下限；
- **无需手动操作 DOM：** 我们不再需要手动去操作 DOM，只需要写好 View-Model 的代码逻辑，框架会根据虚拟 DOM 和 数据双向绑定，帮我们以可预期的方式更新视图，极大提高我们的开发效率；
- **跨平台：** 虚拟 DOM 本质上是 JavaScript 对象,而 DOM 与平台强相关，相比之下虚拟 DOM 可以进行更方便地跨平台操作，例如服务器渲染、weex 开发等等。

**缺点:**
- **无法进行极致优化：** 虽然虚拟 DOM + 合理的优化，足以应对绝大部分应用的性能需求，但在一些性能要求极高的应用中虚拟 DOM 无法进行针对性的极致优化。

### vue中的key有什么作用
key 是为 Vue 中 vnode 的唯一标记，通过这个 key，我们的 diff 操作可以更准确、更快速。
利用 key 的唯一性生成 map 对象来获取对应节点，比遍历方式更快

### vue2和vue3的不同点
| 特性                | Vue2                             | Vue3            |
| ----------------- | -------------------------------- | --------------- |
| **响应式系统**         | 基于 `Object.defineProperty`，兼容性更好 | 基于 `Proxy`，性能更优 |
| **API 设计**        | Options API                      | Composition API |
| **TypeScript 支持** | 有限支持                             | 全面支持            |
| **生态支持**          | 成熟但逐渐过时                          | 更现代化，未来趋势       |
#### API设计
- Vue2 的 Options API 将逻辑分散在 `data`、`methods` 等选项中，代码组织不够灵活。
- Vue3 的 Composition API 允许将相关逻辑集中在一个 `setup` 函数中，代码更易于维护和复用。
```js
// Vue2 Options API
export default {
  data() {
    return {
      count: 0
    };
  },
  methods: {
    increment() {
      this.count++;
    }
  }
};

// Vue3 Composition API
import { ref } from 'vue';

export default {
  setup() {
    const count = ref(0);
    const increment = () => count.value++;
    return { count, increment };
  }
};
```


### Vue性能优化

- 尽量减少 `data` 中的数据，`data` 中的数据都会增加 `getter` 和 `setter`，会收集对应的 `watcher`
- `v-if` 和 `v-for` 不能连用, v-for的优先级比v-if高，一起使用会造成性能浪费
- 如果需要使用 v-for 给每项元素绑定事件时使用事件代理
- SPA 页面采用 keep-alive 缓存组件
- 在更多的情况下，使用 v-if 替代 v-show
- key 保证唯一
- 使用路由懒加载、异步组件
- 防抖、节流
- 第三方模块按需导入
- 长列表滚动到可视区域动态加载
- 图片懒加载
- 第三方插件按需插入，避免体积太大