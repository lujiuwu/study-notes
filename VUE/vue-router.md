## 前端路由

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
> 通过这些就能用另一种方式来实现前端路由了，但原理都是跟 hash 实现相同的。用了 HTML5 的实现，单页路由的 url 就不会多出一个#，变得更加美观。但因为没有 # 号，所以当用户刷新页面之类的操作时，浏览器还是会给服务器发送请求。为了避免出现这种情况，所以这个实现``需要服务器的支持``，需要把所有路由都`重定向到根页面`

```js
function matchAndUpdate () {
   // todo 匹配路径 做 dom 更新操作
}

window.addEventListener('popstate', matchAndUpdate)

```

### Vue router 实现

#### 定义
```ts
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [...]
})

new Vue({
  router
  ...
})

```

* 可以看出来`vue-router`是通过 `Vue.use`的方法被注入进 Vue 实例中
* 在使用的时候我们需要全局用到 `vue-router`的`router-view`和`router-link`组件，以及`this.$router/$route`这样的实例对象

### 原理

1）创建的页面路由会与该页面形成一个路由表（key value形式，key为该路由，value为对应的页面）

2）vue-router原理是监听 URL 的变化，然后匹配路由规则，会用新路由的页面替换到老的页面 ，无需刷新

3）目前单页面使用的路由有两种实现方式: `hash 模式`、`history 模式`

5）hash模式（路由中带#号），通过`hashchange`事件来监听路由的变化  
`window.addEventListener('hashchange', （)=>{})`

6）history 模式，利用了`pushState()` 和`replaceState()` 方法，实现往history中添加新的浏览记录、或替换对应的浏览记录；通过`popstate`事件来监听路由的变化，`window.addEventListener('popstate', （)=>{})`










