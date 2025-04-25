# Selectors API
> JavaScript 库中最流行的一种能力就是根据 CSS 选择符的模式匹配 DOM 元素

## querySelector( )
> querySelector()方法接收 CSS 选择符参数，返回匹配该模式的第一个后代元素，如果没有匹配项则返回 null

```js
// 取得<body>元素
let body = document.querySelector("body");

// 取得 ID 为"myDiv"的元素
let myDiv = document.querySelector("#myDiv");

// 取得类名为"selected"的第一个元素
let selected = document.querySelector(".selected");

// 取得类名为"button"的图片
let img = document.body.querySelector("img.button");
```

* 在 Document 上使用 querySelector()方法时，会从文档元素开始搜索；在 Element 上使用querySelector()方法时，则只会从当前元素的后代中查询。
* 用于查询模式的 CSS 选择符可繁可简，依需求而定。如果选择符有语法错误或碰到不支持的选择符，则 querySelector()方法会抛出错误。
## querySelectorAll( )
> querySelectorAll()方法跟 querySelector()一样，也接收一个用于查询的参数，但它会返回所有匹配的节点，而不止一个。
> 这个方法返回的是一个` NodeList 的静态实例`，它是一个静态的快照而非实时的查询

### 实例
```js
// 取得 ID 为"myDiv"的<div>元素中的所有<em>元素
let ems = document.getElementById("myDiv").querySelectorAll("em");

// 取得所有类名中包含"selected"的元素
let selecteds = document.querySelectorAll(".selected");
// 取得所有是<p>元素子元素的<strong>元素

let strongs = document.querySelectorAll("p strong");
```
### for-of循环,item( )和中括号语法 
```js
let strongElements = document.querySelectorAll("p strong");

// 以下 3 个循环的效果一样
for (let strong of strongElements) {
  strong.className = "important";
}

for (let i = 0; i < strongElements.length; ++i) {
  strongElements.item(i).className = "important";
}

for (let i = 0; i < strongElements.length; ++i) {
  strongElements[i].className = "important";
}
```

## matches
> 该方法接收一个`CSS选择符参数`，如果元素匹配则返回true，不匹配返回false

使用这个方法可以方便地检测某个元素会不会被 querySelector()或 querySelectorAll()方法返回


# 元素遍历
> IE9 之前的版本不会把元素间的空格当成空白节点，而其他浏览器则会。这样就导致了 childNodes和 firstChild 等属性上的差异。为了弥补这个差异，同时不影响 DOM 规范，W3C 通过新的 ElementTraversal 规范定义了一组新属性

**Element Traversal API 为 DOM 元素添加了 5 个属性：**
 childElementCount，返回子元素数量（不包含文本节点和注释）；

 firstElementChild，指向第一个 Element 类型的子元素（Element 版 firstChild）；

 lastElementChild，指向最后一个 Element 类型的子元素（Element 版 lastChild）；

 previousElementSibling ，指向前一个 Element 类型的同胞元素（ Element 版previousSibling）；

 nextElementSibling，指向后一个 Element 类型的同胞元素（Element 版 nextSibling）



# HTML5
> HTML5 规范却包含了与标记相关的大量 JavaScript API 定义。其中有的 API 与 DOM 重合，定义了浏览器应该提供的 DOM 扩展

## CSS类扩展
### getElementsByClassName属性
* **document.getElementsByClassName( className )**
  返回类名中包含相应类的元素的 NodeList
### classList属性
* **document.classList** -- 对类名进行操作
  classList 是一个新的集合类型 `DOMTokenList 的实例`，DOMTokenList有如下方法
   * add
   * remove
   * contains -- true or false
   * toggle -- 如果类名列表中已经存在指定的 value，则删除；如果不存在，则添加
```js
const dom = document.getElementByClassName("className")[0]
dom.classList.add("add_class_name")
dom.classList.remove("remove_class_name")
const is_contain = dom.classList.contains("contain_class_name")

dom.class.toggle("toggle_class_name")
// 相当于如下代码：
if(dom.classList.contains("class_name")) dom.classList.remove("class_name")
else dom.classList.add("class_name")
```

**注意：**
添加了 classList 属性之后，除非是完全删除或完全重写元素的 class 属性，否则 className属性就用不到了

## 焦点管理
* **document.activeElement** -- 包含当前拥有焦点的DOM元素
`dom.focus() -- 让dom元素获取焦点`
* **document.hasFocus( )** -- 表示文档是否拥有焦点

## HTMLDocument扩展
* **readyState属性** -- 文档的加载状态
   loading，表示文档正在加载；
   complete，表示文档加载完成。
* **compatMode属性** -- 指示浏览器当前处于什么渲染模式
* **head属性** -- 作为对 document.body（指向文档的< body >元素）的补充
## 字符集属性
HTML5 增加了几个与文档字符集有关的新属性。其中，characterSet 属性表示文档实际使用的字符集，也可以用来指定新字符集。这个属性的默认值是"UTF-16"，但可以通过< meta >元素或响应头，以及新增的 characterSeet 属性来修改。下面是一个例子：
```js
console.log(document.characterSet); // "UTF-16"
document.characterSet = "UTF-8";
```
## 自定义数据类型 -- 前缀data-
* 定义
```html
<div id="myDiv" data-appId="12345" data-myname="Nicholas"></div>
```
* 访问 -- dataset属性
```js
// 本例中使用的方法仅用于示范

let div = document.getElementById("myDiv");

// 取得自定义数据属性的值

let appId = div.dataset.appId;

let myName = div.dataset.myname;

// 设置自定义数据属性的值

div.dataset.appId = 23456;

div.dataset.myname = "Michael";

// 有"myname"吗？

if (div.dataset.myname){

console.log(`Hello, ${div.dataset.myname}`);

}
```

## 插入标记
### innerHTML属性
> 在读取 innerHTML 属性时，会返回元素所有后代的 HTML 字符串，包括元素、注释和文本节点。
> 而在写入 innerHTML 时，则会根据提供的字符串值以新的 DOM 子树替代元素中原来包含的所有节点

### 旧IE中的innerHTML
在所有现代浏览器中，通过 innerHTML 插入的< script >标签是不会执行的。而在 IE8 及之前的版本中，只要这样插入的< script >元素指定了 defer 属性，且< script >之前是“受控元素”，那就是可以执行的

### outerHTML属性
> 读取 outerHTML 属性时，会返回调用它的元素（及所有后代元素）的 HTML 字符串
> 写入outerHTML 属性时，调用它的元素会被传入的 HTML 字符串经解释之后生成的 DOM 子树取代

### insertAdjacentHTML()与 insertAdjacentText()
> 它们都接收两个参数：要插入标记的位置和要插入的 HTML 或文本。第一个参数必须是下列值中的一个

* "beforebegin" -- 插入到当前元素前面，作为前一个同胞节点
* "afterbegin" -- 插入到当前元素内部，作为新的子节点或者放在第一个子节点前面
* "beforeend" -- 插入到当前元素内部，作为新的子节点或者放在最后一个子节点后面
* "afterend" -- 插入到当前元素后面，作为后一个子节点

### 内存与性能问题
* 上述子节点操作方法可能在浏览器中导致性能问题
* HTML 解析器的构建与解构也不是没有代价，因此最好限制使用 innerHTML 和outerHTML 的次数

## scrollIntoView( )
> DOM 规范中没有涉及的一个问题是如何滚动页面中的某个区域。为填充这方面的缺失，不同浏览器实现了不同的控制滚动的方式。在所有这些专有方法中，HTML5 选择了标准化 scrollIntoView()

没个HTML上都有这个标签，参数如下：

 alignToTop 是一个布尔值。
   true：窗口滚动后元素的顶部与视口顶部对齐。
   false：窗口滚动后元素的底部与视口底部对齐。

 scrollIntoViewOptions 是一个选项对象。
   behavior：定义过渡动画，可取的值为"smooth"和"auto"，默认为"auto"。
   block：定义垂直方向的对齐，可取的值为"start"、"center"、"end"和"nearest"，默认为 "start"。
   inline：定义水平方向的对齐，可取的值为"start"、"center"、"end"和"nearest"，默认为 "nearest"。
  
 不传参数等同于 alignToTop 为 true。

# 专有扩展
