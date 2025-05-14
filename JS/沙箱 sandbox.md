> `沙箱(Sandbox)`，就是让你的程序跑在一个隔离的环境下，不对外界的其他程序造成影响
> 过创建类似沙盒的独立作业环境，在其内部运行的程序并不能对硬盘产生永久性的影响

Chrome浏览器打开的每个页面就是一个沙箱，保证**彼此独立互不影响**

**目的**
* 沙箱设计的目的是为了让`不可信的代码`运行在一定的环境中，从而`限制`这些代码`访问隔离区之外的资源`

## JS中沙箱的使用场景

**总结：**
* 当你要`解析或执行不可信的JS`的时候
* 当你要`隔离被执行代码的执行环境`的时候
* 当你要对`执行代码中可访问对象进行限制`的时候

沙箱就派上用场了

### JSONP

> JSONP的全称是 JSON with Padding；是JSON的一种使用模式；
> 可用于解决主流浏览器的**跨域数据访问**的问题

**沙箱使用**
解析服务器所返回的jsonp请求时，如果不信任jsonp中的数据，可以通过创建沙箱的方式来`解析获取数据`

#### 同源政策

##### 什么是同源

> 如果两个页面的`协议`，`域名`和`端口`都相同，则两个页面具有**相同的源**

**例如** -- 对于该网址而言：`http://www.test.com/index.html`
* 协议：https
* 域名：www.test.com
* 端口：默认是80端口

若另一个网址的上述三个元素都相同，则说明它们**同源**

##### 什么是同源策略

> 同源策略（英文全称 Same origin policy）是**浏览器提供**的一个**安全功能**

**MDN官方所给概念：**
* 同源策略限制了从同一个源加载的文档或脚本如何与来自另一个源的资源进行交互
* 这是一个用于隔离潜在恶意文件的重要安全机制

**资源交互**
- 无法读取非同源网页的 `Cookie`、`LocalStorage` 和 `IndexedDB`
- 无法接触非同源网页的 `DOM`
- 无法向非同源地址发送 `AJAX` 请求

#### 跨域

> 同源指的是两个 URL 的`协议`、`域名`、`端口`一致，反之，则是**跨域**

**出现跨域的根本原因**
* 浏览器的`同源策略`不允许非同源的 URL 之间进行资源的交互

**浏览器允许发起跨域请求，但是跨域请求回来的数据，会被浏览器拦截，无法被页面获取到**

##### 如何实现跨域数据请求

* 实现跨域数据请求方法有很多，比如`JSONP`、`CORS`、`postMessage`、`Websocket`、`Nginx反向代理`、`window.name + iframe` 、`document.domain + iframe`、`location.hash + iframe`等
* 其中最主要的三种解决方案，分别是 **JSONP** 和 **CORS** 和 **Nginx反向代理**

#### JSONP原理

* 事先定义一个用于获取跨域响应数据的回调函数
```js
function callback(){}
```
* 通过没有同源策略限制的`script`标签发起一个请求，将`回调函数的名称`放到这个请求的`query`参数里
```html
<script src="http://jsonp.js?callback=cb"></script>
```

* 然后`服务端`将需要响应的数据放到数里并返回这个回调函数的执行，将`function(response)`传递给客户端
```js
router.get('/', function (req, res, next) {
    (() => {
        const data = {
            x: 10
        };
        //获取 script传递的参数
        let params = req.query;
        if (params.callback) {
            let callback = params.callback;
            console.log(params.callback);
            res.send(`${callback}(${JSON.stringify(data.x)})`);
        } else {
            res.send('err');
        }
    })();
});
```
* 前端的`script`标签请求到这个执行的回调函数后会立马执行，于是就拿到了执行的响应数据，开始解析和执行`function(response)`

#### JSONP的优缺点

**优点**
- 它不像`XMLHttpRequest`对象实现的`Ajax`请求那样受到同源策略的限制
- 它的**兼容性更好**，在更加古老的浏览器中都可以运行，不需要`XMLHttpRequest`或`ActiveX`的支持
- 并且在请求完毕后可以通过调用`callback`的方式回传结果

**缺点**
- 它**只支持`GET`请求**而不支持 `POST` 等其它类型的 HTTP 请求
- 它只支持跨域 HTTP 请求这种情况，不能解决不同域的两个页面之间如何进行JavaScript 调用的问题（如A页面想调用B页面的函数）

#### 安全性问题

**CSRF攻击**
* 前端构造一个恶意页面，请求JSONP接口，收集服务端的敏感信息
* 如果JSONP接口还涉及一些敏感操作或信息（比如登录、删除等操作），那就更不安全了
* **解决方法**：验证JSONP的调用来源（`Referer`），服务端判断 `Referer` 是否是白名单，或者部署随机 `Token` 来防御。

**XSS漏洞**
* 如果没有严格定义好 `Content-Type（ Content-Type: application/json ）`，再加上没有过滤 `callback` 参数，直接当 HTML 解析了，就是一个赤裸裸的 `XSS` 了


**服务器被黑，返回一串恶意执行的代码**
* 可以将执行的代码转发到服务端进行校验 JSONP 内容校验，再返回校验结果

##### 什么是XSS漏洞

>XSS 漏洞（跨站脚本攻击，Cross-Site Scripting）
>是一种常见的 **Web 安全漏洞**，攻击者通过在网页中注入恶意脚本（JavaScript、HTML 等），使其在用户浏览器中执行，从而窃取用户数据、劫持会话、篡改页面内容或进行其他恶意操作


### 执行第三方JS

> 当你有必要执行第三方js的时候，而这份js文件又不一定可信的时候

### 在线代码编辑器

> 相信大家都有使用过一些在线代码编辑器，而这些代码的执行，基本都会放置在沙箱中，防止对页面本身造成影响

### VUE

* **VUE的服务器渲染：** vue的服务端渲染实现中，通过创建沙箱执行前端的bundle文件；在调用createBundleRenderer方法时候，允许配置runInNewContext为true或false的形式，判断是否传入一个新创建的sandbox对象以供vm使用
* **VUE的模板表达式：** vue模板中表达式的计算被放在沙盒中，只能访问全局变量的一个白名单，如 `Math 和 Date` 。你不能够在模板表达式中试图访问用户定义的全局变量
```js
// 全局定义
window.myGlobalVar = "hello"; // {{myGlobalVar}}无法访问

// 内置白名单
{{Math.floor(12.5)}} // 可以访问
```

## 沙箱的实现

### 沙箱逃逸

**沙箱于作者而言是一种安全策略，但于使用者而言可能是一种束缚**。脑洞大开的开发者们尝试用各种方式摆脱这种束缚，也称之为`沙箱逃逸`。因此一个沙箱程序最大的挑战就是如何检测并禁止这些预期之外的程序执行

### 最简陋：with+new Function

#### 1. with的作用

> with会**临时扩展作用域链**，使代码优先从指定对象中查找变量

```js
const str = "str1"
const obj = {str:"str2"}
with(obj){
  console.log(str) // str2
}
```

#### 2. new Function的作用

> `new Function` 可以 **动态编译并执行代码字符串**，且默认在**全局作用域**运行

* 最后一个参数是函数体操作
* 前面的参数（单个参数/数组）都是传入函数体的参数

```js
const foo = new Function("arg","console.log(arg)")
foo("str") // str
```

#### 3. 两者结合

- 通过 `with` 将代码的执行作用域限制在沙箱对象内
- 用 `new Function` 动态执行代码，避免直接使用 `eval`（更安全）

**基础实现**
```js
// code是要执行的代码；sandboxObj是沙箱对象
function createSandbox(code, sandboxObj) {

  // 1. 将沙箱对象的键拼接成 with 的作用域
  const sandboxKeys = Object.keys(sandboxObj);
  const sandboxValues = sandboxKeys.map(key => sandboxObj[key]);

  // 2. 动态生成函数，用 with 限制作用域
  const func = new Function(
    ...sandboxKeys,
    `with (this) { return (${code}); }`
  );

  // 3. 绑定沙箱对象并执行
  return func.apply(sandboxObj, sandboxValues);
}
```

**增加安全性**
* 使用 `Proxy` 拦截变量访问
* 通过设置has函数可以监听到变量的访问，禁止访问沙箱对象中未定义的变量

**存在问题**
* **不能完全隔离所有危险操作**（如无限循环 `while(true) {}`）
* 通过访问和篡改原型链的方式可以实现沙箱逃逸，就可以实现xss攻击

### 最常用：iframe

> `<iframe>`（Inline Frame）是 HTML 中的一个标签
> 用于在当前页面中`嵌入另一个独立的 HTML 文档`
> 它广泛用于`广告、第三方内容嵌入、微前端架构`等场景，但也带来了一些安`全和性能问题`

#### iframe基本使用

**常见属性**
* src ：指定嵌入的网页地址（可以是同源和跨域）
* width/height ：设置iframe的宽高（可以是px或者%）
* title ：提高可访问性（屏幕阅读器会读取）
* sandbox : 沙箱选项；限制 iframe 的权限（防止恶意行为）
* allow ：控制是否允许某些功能（如全屏或摄像头）
* loading ：控制懒加载（`lazy`/`eager`）
* Rferrerpolicy : `控制 `Referer` 头的发送策略`

**示例**
```html
<iframe 
  src="https://example.com" 
  width="600" 
  height="400"
  title="示例 iframe"
></iframe>
```

#### iframe实现沙箱

> 这种方式更为方便、简单、安全，也是目前比较通用的前端实现沙箱的方案
> 假如你要执行的代码不是自己写的代码，不是可信的数据源，那么务必要使用iframe沙箱

**sandbox属性：**
sandbox是h5提出的一个新属性， 启用方式就是在iframe标签中使用sandbox属性:

```html
<iframe sandbox src="..."></iframe>
```

**限制**
1. script脚本不能执行  
2. 不能发送ajax请求  
3. 不能使用本地存储，即localStorage,cookie等  
4. 不能创建新的弹窗和window  
5. 不能发送表单  
6. 不能加载额外插件比如flash等

**allow属性**
* 不过别方，你可以对这个iframe标签进行一些配置
     1. allow-forms 允许提交表达
     2. allow-scripts 允许执行脚本
     3. allow-popups 允许iframe中弹出新窗口

**postMessage API**
接下里你只需要结合postMessage API，将你需要执行的代码，和需要暴露的数据传递过去，然后和你的iframe页面通信就行了


### nodejs的沙箱

nodejs中使用沙箱很简单，只需要利用原生的vm模块，便可以快速创建沙箱，同时指定上下文







