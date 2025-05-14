> uex 是一个专为 Vue.js 应用程序开发的**状态管理模式**。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化

**什么是状态管理模式**
把组件的共享状态抽取出来，以一个全局单例模式管理
在这种模式下，我们的组件树构成了一个巨大的`“视图”`，不管在树的哪个位置，任何组件都能获取状态或者触发行为！这就是“状态管理模式”。

### Vuex的属性

> Vuex的属性：State，Getter，Mutation，Action，Module

#### State -- 单一状态树

* Vuex就是一个仓库，仓库内存放了很多对象，state就是**数据源存放地**。对应于一般Vue对象里的data
* state内存储的数据是响应式的，Vue组件从store中读取数据，若是store中的数据发生改变，依赖这个数据的组件也会发生更新
* 它通过 `mapState` 把全局的` state 和 getters` 映射到当前组件的 `computed 计算属性` 中
* 它作为一个“唯一数据源 (SSOT)”而存在，这也意味着，每个应用将仅仅包含一个` store 实例`

#### Getter

* getters可以对state进行计算操作，它就是store的计算属性
* getters可以在多组件之间复用
* 如果一个状态只在一个组件中使用，可以不用getters

#### Mutation

* 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
* Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的**事件类型 (type)** 和一个**回调函数 (handler)**
* 这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数

#### Action

Action 类似于 mutation，不同在于：

- Action 提交的是 mutation，而不是直接变更状态。
- Action 可以包含任意异步操作

####  Moule

Module 可以让每一个模块拥有自己的state、mutation、action、getters,使得结构非常清晰，方便管理

### 使用实例

**store/index.js**
```js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

// 声明状态
const state = {
  count:0
}
// 给acrtions注册事件处理函数
const actions = {
  increment:({commit})=>{commit('increment')},
  decrement:({commit})=>{commit('decrement')}
}
// 更新状态
const mutations = {
  increment (state) {
    ++state.count
  },
  derement (state) {
    --state.count
  }
}
// 获取状态信息
const getters = {
}
// 导出
export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})
```

**获取状态/改变状态**
```js
// vue2
const count = this.$store.state.count
this.$store.commit('increment')

// vue3
import {useStore} from 'vuex'
const store = useStore()
// 使用mutation
store.commit('increment')
// 使用action
store.dispatch('increment')
```

### 工作原理

1）vuex中的store本质就是一个没有`template模板`的隐藏式的vue组件

2）vuex是利用vue的`mixin混入机制`，在`beforeCreate`钩子前混入vuexInit方法

3）vuexInit方法实现将vuex store注册到当前组件的$store属性上

4）vuex的state作为一个隐藏的vue组件的data，定义在state上面的变量，相当于这个vue实例的data属性，凡是定义在data上的数据都是响应式的

5）当页面中使用了vuex state中的数据，就是依赖收集的过程，当vuex中state中的数据发生变化，就通过调用对应属性的dep对象的notify方法，去修改视图变化





