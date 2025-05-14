> **虚拟DOM**简而言之就是，用JS去按照DOM结构来实现的树形结构对象，你也可以叫做**DOM对象**

### 虚拟DOM

**内容**
包含了 `tag`、`props`、`children` 三个属性

**转换示例**

```html
<div id="app">  
  <p class="text">hello world!!!</p>  
</div>
```
转换为虚拟DOM为：
```js
{  
  tag: 'div',  
  props: {  
    id: 'app'  
  },  
  chidren: [  
    {  
      tag: 'p',  
      props: {  
        className: 'text'  
      },  
      chidren: [  
        'hello world!!!'  
      ]  
    }  
  ]  
}
```

### 如何转换虚拟DOM

#### 关于h函数

> h 函数接受三个参数，分别代表是 DOM 元素的`标签名、属性、子节点`，最终返回一个`虚拟 DOM 的对象`

```ts
function h(tag, props, ...children) {  
  return {  
    tag,  
    props: props || {},  
    children: children.flat()  
  }  
}
```

#### 渲染虚拟DOM

* 转换为真实DOM
```ts
function render(vdom) {  
  // 如果是字符串或者数字，创建一个文本节点  
  if (typeof vdom === 'string' || typeof vdom === 'number') {  
    return document.createTextNode(vdom)  
  }  
  const { tag, props, children } = vdom  
  // 创建真实DOM  
  const element = document.createElement(tag)  
  // 设置属性  
  setProps(element, props)  
  // 遍历子节点，并获取创建真实DOM，插入到当前节点  
  children  
    .map(render)  
    .forEach(element.appendChild.bind(element))  
  
  // 虚拟 DOM 中缓存真实 DOM 节点  
  vdom.dom = element  
  
  // 返回 DOM 节点  
  return element  
}  
  
function setProps (element, props) {  
  Object.entries(props).forEach(([key, value]) => {  
    setProp(element, key, value)  
  })  
}  
  
function setProp (element, key, vlaue) {  
  element.setAttribute(  
    // className使用class代替  
    key === 'className' ? 'class' : key,  
    vlaue  
  )  
}
```

* 将节点插入到指定位置
```ts
const vdom = <div>hello world!!!</div> // h('div', {}, 'hello world!!!')  
const app = document.getElementById('app')  
const ele = render(vdom)  
app.appendChild(ele)
```

### diff算法

> diff ( 比较 )算法，顾名思义，就是比对新老 VDOM 的变化，然后将变化的部分更新到视图上。对应到代码上，就是一个 diff 函数，返回一个 patches （补丁）

diff的过程就是调用名为`patch`的函数，比较新旧节点，一边比较一边给**真实的DOM**打补丁

#### 同层级比较

在采取diff算法比较新旧节点的时候，比较只会在同层级进行, 不会跨层级比较

#### 具体分析

##### patch

**参数**：patch函数接收两个参数`oldVnode`和`Vnode`分别代表新的节点和之前的旧节点

**核心代码**：
```js
function patch (oldVnode, vnode) {
    // some code
    if (sameVnode(oldVnode, vnode)) {
    	patchVnode(oldVnode, vnode)
    } else {
    	const oEl = oldVnode.el // 当前oldVnode对应的真实元素节点
    	let parentEle = api.parentNode(oEl)  // 父元素
    	createEle(vnode)  // 根据Vnode生成新元素
    	if (parentEle !== null) {
            api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl)) // 将新元素添加进父元素
            api.removeChild(parentEle, oldVnode.el)  // 移除以前的旧元素节点
            oldVnode = null
    	}
    }
    // some code 
    return vnode
}
```

* **sameVnode函数** -- - 判断两节点是否相同 -- 不同则直接替换
```ts
function sameVnode (a, b) {
  return (
    a.key === b.key &&  // key值
    a.tag === b.tag &&  // 标签名
    a.isComment === b.isComment &&  // 是否为注释节点
    // 是否都定义了data，data包含一些具体信息，例如onclick , style
    isDef(a.data) === isDef(b.data) &&  
    sameInputType(a, b) // 当标签是<input>的时候，type必须相同
  )
}
```

* **patchVnode** -- 确定两个节点值得比较之后我们会对两个节点指定`patchVnode`方法
```ts
patchVnode (oldVnode, vnode) {
    <!-- 找到对应的真实dom，称为`el` -->
    const el = vnode.el = oldVnode.el
    let i, oldCh = oldVnode.children, ch = vnode.children
    
    <!-- 判断`Vnode`和`oldVnode`是否指向同一个对象，如果是，那么直接`return` -->
    if (oldVnode === vnode) return
    
    <!-- 如果他们都有文本节点并且不相等，那么将`el`的文本节点设置为`Vnode`的文本节点。 -->
    if (oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text) {
        api.setTextContent(el, vnode.text)
    }else {
        <!-- 更真实DOM元素的属性和事件 -->
        updateEle(el, vnode, oldVnode)
    	if (oldCh && ch && oldCh !== ch) {
            <!-- 如果两者都有子节点，则执行`updateChildren`函数比较子节点，这一步很重要 -->
            updateChildren(el, oldCh, ch)
    	}else if (ch){
    	    <!-- 如果`oldVnode`没有子节点而`Vnode`有，则将`Vnode`的子节点真实化之后添加到`el` -->
            createEle(vnode) //create el's children dom
    	}else if (oldCh){
    	    <!-- 如果`oldVnode`有子节点而`Vnode`没有，则删除`el`的子节点 -->
            api.removeChildren(el)
    	}
    }
}
```

* **updateChild方法**
     * - 将`Vnode`的子节点`Vch`和`oldVnode`的子节点`oldCh`提取出来
     * `oldCh`和`vCh`各有两个头尾的变量`StartIdx`和`EndIdx`，它们的2个变量相互比较，一共有4种比较方式
     * 如果4种比较都没匹配，如果设置了`key`，就会用`key`进行比较
     * 在比较的过程中，变量会往中间靠
     * 一旦`StartIdx>EndIdx`表明`oldCh`和`vCh`至少有一个已经遍历完了，就会结束比较


### 为什么现在主流的框架都使用虚拟dom?

1）前端性能优化的一个秘诀就是`尽可能少地操作DOM`，频繁变动DOM会造成浏览器的回流或者重绘

2）使用虚拟dom，当数据变化，页面需要更新时，通过diff算法对新旧虚拟dom节点进行对比，比较两棵树的差异，生成差异对象，一次性对DOM进行`批量更新操作`，进而有效`提高了性能`

3）虚拟 DOM 本质上是 js 对象，而 DOM 与平台强相关，相比之下虚拟 DOM 可以进行`更方便的跨平台操作`，例如服务器渲染、weex 开发等等









