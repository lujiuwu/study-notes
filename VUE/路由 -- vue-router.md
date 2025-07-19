
### 概念

vue router是vue官方提供的路由管理器
专门为单页面应用（SPA）设计，它通过 URL 与组件的映射关系，实现页面内容的无刷新切换

### 模式

**hash模式**
> 随着 ajax 的流行，异步数据请求交互运行在不刷新浏览器的情况下进行
> 但是这样存在一个问题，就是 url 每次变化的时候，都会造成页面的刷新

那解决问题的思路便是在改变 url 的情况下，保证页面的不刷新。在 2014 年之前，大家是通过 hash 来实现路由，url hash 就是类似于：
```ts
http://www.xx.com/#/login
```
 
这种 #。后面 hash 值的变化，并不会导致浏览器向服务器发出请求，浏览器不发出请求，也就不会刷新页面
另外每次 hash 值的变化，还会触发`hashchange` 这个事件，通过这个事件我们就可以知道 hash 值发生了哪些变化。然后我们便可以监听`hashchange`来实现更新页面部分内容的操作
```js
function matchAndUpdate () {
   // todo 匹配 hash 做 dom 更新操作
}

window.addEventListener('hashchange', matchAndUpdate)

```

**history**
> 14年后，因为HTML5标准发布。多了两个 API，`pushState` 和 `replaceState`
> 通过这两个 API 可以改变 url 地址且不会发送请求。同时还有`popstate` 事件
> 通过这些就能用另一种方式来实现前端路由了，但原理都是跟 hash 实现相同的。用了 HTML5 的实现，单页路由的 url 就不会多出一个#，变得更加美观。但因为没有 # 号，所以当用户刷新页面之类的操作时，浏览器还是会给服务器发送请求。为了避免出现这种情况，所以这个实现`需要服务器的支持`，需要把所有路由都`重定向到根页面`

```js
function matchAndUpdate () {
   // todo 匹配路径 做 dom 更新操作
}

window.addEventListener('popstate', matchAndUpdate)

```

**两种路由模式对比**

|模式|原理|URL 格式|服务器配置需求|
|---|---|---|---|
|hash|基于 URL 中的 # 符号及后续内容|`http://example.com/#/home`|无需特殊配置|
|history|基于 HTML5 History API|`http://example.com/home`|需要配置服务器重定向|

### vue router与单页面SPA

> Vue Router 是专门为单页面应用（SPA）设计

#### 基础配置

1）创建的页面路由会与该页面形成一个路由表（key value形式，key为该路由，value为对应的页面）

2）vue-router原理是监听 URL 的变化，然后匹配路由规则，会用新路由的页面替换到老的页面 ，无需刷新

3）目前单页面使用的路由有两种实现方式: `hash 模式`、`history 模式`

5）hash模式（路由中带#号），通过`hashchange`事件来监听路由的变化  
`window.addEventListener('hashchange', （)=>{})`

6）history 模式
* 利用了`pushState()` 和`replaceState()` 方法，实现往history中添加新的浏览记录、或替换对应的浏览记录
* 通过`popstate`事件来监听路由的变化，`window.addEventListener('popstate', （)=>{})`


##### createRouter

> **createRouter**  -- 创建路由实例的核心函数

**作用**
1. 初始化路由系统，建立 URL 路径与组件的映射关系
2. 配置路由模式（hash/history）
3. 注册全局路由守卫和钩子
4. 创建可在 Vue 应用中使用的路由实例

**传入参数**
* 路由模式配置
* 路由配置数组
  `定义路径与组件的映射关系，每个路由配置项包含以下常用属性`

**关于模式选择：**
     1. mode:'hash' / 'history'
     2. createWebHistory( ) / createWebHistory( )；可传入应用部署的根路径base
     3. 特殊的**内存模式**（主要用于测试或非浏览器环境） ：history:createMemoryHistory 
```javascript
const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  // history: createWebHash(),
  // mode: 'hash',
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
export default router
```

**关于路由配置数组**

* 参数
  - `path`：路径匹配规则（支持动态参数如 `/user/:id`）
  - `component`/`components`：对应的组件（支持懒加载，即通过箭头函数动态导入）
  - `name`：路由名称（用于命名路由导航）
  - `children`：嵌套路由配置
  - `meta`：自定义元信息（如权限要求）
  - `redirect`：重定向配置

**404路由配置** -- 使用通配符路由捕获所有未匹配路径
```javascript
{ path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
```

#### 底层原理

**所有模式的核心原理**
```plaintext
URL 变化 ──→ History 接口捕获变化 ──→ 路由匹配系统解析路径 ──→ 触发组件更新
```

##### hash

Hash 模式利用 URL 中的 hash 值（即 `#` 及其后面的部分）来实现路由功能。其核心特点：

- hash 值的变化不会触发浏览器重新加载页面
- 浏览器提供 `hashchange` 事件监听 hash 值变化
- URL 格式：`http://example.com/#/path`

| 优点            | 缺点                        |
| ------------- | ------------------------- |
| 兼容性好（支持 IE9+） | SEO 不友好（搜索引擎可能忽略 hash 内容） |
| 无需服务器配置       | URL 包含 # 符号，不够美观          |

##### history

History 模式利用 HTML5 的 History API 实现路由功能。其核心特点：

- 使用 `history.pushState` 和 `history.replaceState` 操作浏览器历史记录
- 通过 `popstate` 事件监听浏览器前进 / 后退按钮
- URL 格式与传统网站一致：`http://example.com/path`

|优点|缺点|
|---|---|
|URL 更美观，符合传统网站|需要服务器配置支持|
|更好的 SEO 支持|兼容性稍差（IE10+）|

#### 模式差异

| 特性     | Hash 模式                                                | History 模式                                         |
| ------ | ------------------------------------------------------ | -------------------------------------------------- |
| 触发事件   | hashchange                                             | popstate                                           |
| 导航方法   | window.location.hash                                   | history.pushState                                  |
| URL 格式 | [http://example.com/#/path](http://example.com/#/path) | [http://example.com/path](http://example.com/path) |
| 服务器要求  | 无特殊要求                                                  | 需要配置所有路径指向 index.html                              |
| 兼容性    | IE9+                                                   | IE10+                                              |
| 后退按钮支持 | 完全支持                                                   | 完全支持                                               |
| 锚点功能   | 与路由冲突                                                  | 可正常使用                                              |
### 路由匹配算法

无论使用哪种模式，Vue Router 都需要将当前 URL 解析为对应的路由配置。其核心匹配流程：
* **路径解析**：将路径字符串解析为正则表达式
* **嵌套路由匹配**：
* **优先级处理**：
    
    - 静态路径 > 动态路径 > 通配符
    - 相同类型路径按定义顺序匹配

### 考点















