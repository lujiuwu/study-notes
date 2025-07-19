#### 生命周期

#### 双向数据绑定

* 双向数据绑定指的是视图和数据的双向数据绑定，任一修改都会反映到另一个模块上面
* 其本质是两种单向数据流的组合，是根据观察者模式实现的
* 数据到视图的核心流程大致是：vue初始化时通过object.defineProperty或proxy劫持数据；编译阶段解析指令，创建订阅者，即使用到这些所劫持数据的内容；从而创建数据和视图的依赖关系；因此后续数据变化时就可以通知到所有依赖项更新
* 视图到数据的更新是通过触发特点的DOM事件，在事件处理器执行体进行更新数据的逻辑，进而触发响应式系统的setter
* vue通过v-model指令封装了value和update函数，我们在需要响应式数据时使用即可

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

