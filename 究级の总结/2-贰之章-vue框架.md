#### 插槽

**概念**
* 插槽是 Vue 提供的一种组件内容分发机制，允许父组件向子组件传递模板内容，实现更灵活的组件组合
* 使用slot标签包裹定义

**为什么需要**
* 解决组件内容定制化需求
* 增强组件复用性
* 实现更灵活的组件结构

**类型**
1. 默认插槽 --- 不指定名称 ； 一个组件只能由一个默认插槽
2. 具名插槽 --- 使用name属性指定名称；一个组件可以有多个


#### 虚拟DOM

**概念**

* 它是对真实DOM的抽象
* 虚拟DOM通过JavaScript对象的形式描述真实DOM的层次结构和属性，

**为什么需要**
* 直接操作DOM可能造成：性能开销大，开发效率低和跨平台限制的问题
* 虚拟DOM则能够很好的解决这些问题

**虚拟DOM的工作流程：**
* 数据变化
* 生成新的虚拟DOM
* diff算法比较
* 计算最小变更
* 更新真实DOM

**虚拟DOM的局限性**
* 内存占用
* 首次渲染开销
* 学习成本


**diff算法的优化策略**
* 只进行同级比较
* 使用key作为唯一标识阶段，帮助diff算法识别哪些节点可以复用
* 节点类型不同时直接替换
* 节点类型相同仅更新变化的属性

#### 生命周期

**总体而言分为四个阶段**
* 创建阶段 create
* 挂载阶段 moute
* 更新阶段 update
* 销毁阶段 destroy / unmoute

**具体的生命周期**
* beforeCreate -- 实例初始化之后，不能访问data,method等属性
* created -- 实例创建完成后被立即调用；已经完成数据观测data observer；但是DOM还未生成，$el属性不存在
* beforeMout -- 挂载开始之前被调用；虚拟DOM已经创建，但没有转换为真实DOM并插入网页
* mouted -- 实例被挂载后调用；可以操作DOM
* beforeUpdate -- 数据更新时调用，发生在虚拟DOM打补丁之前；此时访问的是旧DOM
* update -- 由于数据更改导致的虚拟 DOM 重新渲染和打补丁后调用
* beforeDestroy / beforeUnmout ：实例销毁之前被调用；清除定时器，取消事件监听
* destroyed / unmouted -- 
     * 所有指令都已解绑
    - 所有事件监听器都已移除
    - 所有子实例也都被销毁


**其他生命周期钩子**
* activated / deactivated -- keep-alive相关
* 被keep-alive缓存的组件激活时和停用时调用


#### 双向数据绑定

* 双向数据绑定指的是视图和数据的双向数据绑定，任一修改都会反映到另一个模块上面
* 其本质是两种单向数据流的组合，是根据观察者模式实现的
* 数据到视图的核心流程大致是：vue初始化时通过object.defineProperty或proxy劫持数据；编译阶段解析指令，创建订阅者，即使用到这些所劫持数据的内容；从而创建数据和视图的依赖关系；因此后续数据变化时就可以通知到所有依赖项更新详细讲解一下关于vue双向数据绑定的知识点，包括：**观察者模式和发布订阅模式的区别** **立即通知更新视图渲染的API** **v-model** **vue3的Proxy优势** **vue的双向是数据流与react的单向数据流** **react如何实现双向数据流**
* 视图到数据的更新是通过触发特点的DOM事件，在事件监听器执行体进行更新数据的逻辑，进而触发响应式系统的setter
* vue通过v-model指令封装了value和update函数，我们在需要响应式数据时使用即可

#### 观察者模式
* 观察者模式定义了对象间的一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知，并完成自动更新
* 在观察者模式中，存在两类对象 -- 主题/被观察者 ；观察者
     1. 在vue中，主题就是data函数中的响应式数据对象
     2. 观察者则是Watcher实例（每个vue组件实例化时自动创建的渲染Watcher；计算属性computed Watcher；用户Watcher）
```js
class Subject{
  constructor(){
    this.watchers = []
  },
  addWatch(),
  removeWatch(),
  notify(){
    this.watchers.forEach(watcher=>watcher.update())
  }
}
class Watcher{
  update()
}
```

* 特点：直接依赖的关系
     1. 观察者直接订阅主题对象，主题对象维护观察者列表
     2. 主题直接调用观察者的更新方法
* 耦合度较高，两者知道对方的存在
* 应用场景：vue的响应式系统
     1. 初始化阶段，将data中的数据通过Object.defineProperty/Proxy包装成响应式数据，每个数据对象拥有setter和getter方法
     2. 初始化阶段，解析代码指令，创建观察者，即查找依赖响应式数据的组件（例如v-model语法糖和{{}}语法）
     3. 上述步骤构建了数据和视图的关系
     4. 后续如果主题发生变化，触发setter，从而调用notify方法直接触发各观察者的update方法，实现更新
     5. 后续如果更新观察者，会在触发getter时动态更新依赖关系

#### 发布订阅模式
* 发布订阅模式是一种信息范式，信息的发送者不会直接将信息发送给特定的订阅者，而是通过一个中间件进行传递
* 发布订阅模式包含的三个部分：发布者，订阅者，作为中介的事件通道

* 由于中间件的存在，发布者和订阅者在很大程度上进行了解耦
* vue中的应用是组件间传值的EventBus全局事件总线

#### 立即通知更新视图渲染的API

* nextTick
* set

#### v-model

> Vue提供的语法糖，实现表单元素与数据的双向绑定

**等价于：**
```html
<input :value="message" @inpute="message = $event" />
```


#### vue3的Proxy优势

| 特性        | `Object.defineProperty`   | `Proxy` |
| --------- | ------------------------- | ------- |
| 检测属性添加/删除 | 需要 `Vue.set`/`Vue.delete` | 自动支持    |
| 数组变化检测    | 需要重写数组方法                  | 直接支持    |
| 性能        | 递归遍历对象属性                  | 惰性访问    |
| 嵌套对象      | 初始化时递归转换                  | 按需转换    |
| 兼容性       | IE9+                      | 不支持 IE  |

#### vue的双向是数据流与react的单向数据流

* vue的双向数据绑定指的是数据到视图和视图到数据的两个数据流组合

* react的单向数据流指的是数据只能从父组件流向子组件，比如通过props；旨在强调数据的不可变性和可预测性

#### react如何实现双向数据流
* 自定义hook


#### 组件通信

|**方式**|**适用场景**|**示例**|
|---|---|---|
|**Props / $emit**|父子组件通信|父传子：`<Child :msg="parentMsg">`  <br>子传父：`this.$emit('update', value)`|
|**$refs**|父组件访问子组件|`this.$refs.child.method()`|
|**Event Bus**|任意组件通信（小型应用）|`bus.$emit('event')` / `bus.$on('event')`|
|**Provide / Inject**|跨层级组件（祖先->后代）|祖先：`provide('key', value)`  <br>后代：`inject('key')`|
|**Vuex/Pinia**|大型应用全局状态管理|`this.$store.state`|
|**$attrs / $listeners**|高阶组件/多层透传|`v-bind="$attrs"` / `v-on="$listeners"`|
|**LocalStorage**|持久化数据共享|`localStorage.setItem('key', value)`|

#### 路由&路由间传值

**模式**
* hash & history

**路由钩子**

|**类型**|**钩子函数**|**触发时机**|
|---|---|---|
|**全局守卫**|beforeEach|路由跳转前|
||beforeResolve|导航被确认前|
||afterEach|路由跳转后|
|**路由独享**|beforeEnter|进入特定路由前|
|**组件内守卫**|beforeRouteEnter|组件实例创建前|
||beforeRouteUpdate|当前路由改变但组件复用时|
||beforeRouteLeave|离开当前路由前|


**路由间通信**

|**方式**|**特点**|**示例**|
|---|---|---|
|**Params**|URL 路径参数|`/user/:id` → `this.$route.params.id`|
|**Query**|URL 查询参数|`/search?q=vue` → `this.$route.query.q`|
|**Props**|将路由参数作为 props 传递|`{ path: '/user/:id', props: true }`|
|**Meta 字段**|路由元信息|`{ path: '/admin', meta: { requiresAuth: true } }`|
|**State 管理**|Vuex/Pinia 共享状态|`store.state.routeParams`|
|**LocalStorage**|持久化存储|`localStorage.setItem('param', value)`|

#### vue3 & vue2

| **特性**            | **Vue2**                | **Vue3**                      |
| ----------------- | ----------------------- | ----------------------------- |
| **响应式系统**         | Object.defineProperty   | Proxy API                     |
| **性能**            | 较慢（Virtual DOM 全量更新）    | 更快（静态提升、补丁标记优化）               |
| **API 设计**        | Options API             | Composition API + Options API |
| **TypeScript 支持** | 有限支持                    | 原生支持                          |
| **打包体积**          | 较大（~20KB）               | 更小（~10KB，Tree-shaking 优化）     |
| **生命周期**          | beforeDestroy/destroyed | beforeUnmount/unmounted       |
| <br></br>**片段支持** | 单根组件                    | 多根组件                          |

#### vuex

**核心概念**

| **概念**        | **作用**             | **示例**                                                                                    |
| ------------- | ------------------ | ----------------------------------------------------------------------------------------- |
| **State**     | 单一状态树              | `state: { count: 0 }`                                                                     |
| **Getters**   | 派生状态（计算属性）         | `getters: { double: s => s.count*2 }`                                                     |
| **Mutations** | 同步修改状态             | `mutations: { increment(state) { state.count++ } }`                                       |
| **Actions**   | 异步操作 + 提交 Mutation | `actions: { asyncIncrement({ commit }) { setTimeout(() => commit('increment'), 1000) } }` |
| **Modules**   | 状态分模块              | 将大型 store 拆分为模块                                                                           |
**使用场景**
- 中大型单页应用（SPA）状态管理
- 多个视图依赖同一状态（如用户登录信息）
- 不同视图需要变更同一状态（如购物车）

#### 异步渲染

**为什么**
- 减少不必要的 DOM 操作
    
- 避免中间状态导致的界面闪烁
    
- 优化复杂应用的渲染性能

#### hooks

**本质**
* 一组可复用的函数，它们可以“钩入”Vue组件的生命周期，让我们能够在组件的不同生命周期阶段执行特定的逻辑

#### mitt包

* 是一个小型的JS事件发布订阅库
* API简单易于学习

**使用**
```js
// 创建事件总线
import mitt from 'mitt'
const events = mitt()
// 监听事件
events.on('start',start)
events.on('end',end)
// 触发事件
events.emit('start')
events.emit('end')
```

#### 单页应用和多页应用

**单页面应用**
* 整个应用只有一个HTML页面 通过JS动态更新内容
* 页面切换时不加载整个页面
* 通过前端路由控制页面跳转

* 适用于：后台管理系统，交互复杂的web应用

**多页应用**
* 由多个完整HTML页面组成的应用
* 每次页面跳转都加载完整的HTML文档
* a标签进行传统的页面跳转
* 更利于SEO优化
* 服务器渲染为主
* 通过后端路由切换页面

* 适用于： 内容型网页，对于SEO友好的网站




