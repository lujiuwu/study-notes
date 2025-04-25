* DOM是文档对象模型，是HTML和XML文档的编程接口
* DOM表示由多层节点构成的文档
* DOM Level 1 在 1998 年成为 W3C 推荐标准，提供了`基本文档结构和查询的接口`

# 节点层级
> 任何 HTML 或 XML 文档都可以用 DOM 表示为一个由节点构成的层级结构

* 根节点 -- document节点
* 文档元素 -- 根节点的子节点
    * 在HTML中始终是`<html>元素`
    * 在XML中 没有这样的预定义元素，`任何元素都可能成为文档元素`

HTML 中的每段标记都可以表示为这个树形结构中的一个节点。元素节点表示 HTML 元素，属性节点表示属性，文档类型节点表示文档类型，注释节点表示注释。
DOM 中总共有 `12 种节点类型`，这些类型都继承一种基本类型。

## Node类型
> Node接口是所有DOM节点类型都必须实现的，在JS中`所有节点类型都继承Node类型`

* **nodeType** -- 表示节点类型，12种常量取值
* **nodeName** -- 表示元素的标签名
* **nodeValue** -- 对于元素而言，nodeValue始终为`null`
```html
<body>
  <div id="div-box">我是div标签</div>
</body>

<script>
const div = document.getElementById('div-box')
console.log(div.nodeName,div.nodeType,div.nodeValue) // DIV 1 null
</script>
```
### 节点关系
文档中的所有节点都与其他节点有关系。这些关系可以形容为家族关系，相当于把文档树比作家谱。
在 HTML 中，< body >元素是< html >元素的子元素，而< html >元素则是< body >元素的父元素。< head >元素是< body >元素的同胞元素，因为它们有共同的父元素< html >。
#### childNodes属性
每个节点都有一个childNodes属性，其中包含一个`NodeList实例`
##### NodeList
> NodeList是一个`类数组对象`，用于存储`可以按位置存取的有序节点`
> 
> **注意**：
> * NodeList 并不是 Array 的实例，但可以使用中括号访问它的值，而且它也有 length 属性
> * NodeList 对象独特的地方在于，它其实是一个`对 DOM 结构的查询`，因此 DOM 结构的变化会自动地在 NodeList 中反映出来。我们通常说 NodeList 是`实时的活动对象`，而不是第一次访问时所获得内容的快照

* **访问NodeList的元素 -- item( )||[]**
```js
const div = document.getElementById('div-box')
console.log(div.childNodes)
console.log(div.childNodes[0])
console.log(div.childNodes.item(0))
```
* **转换为数组类型**
```js
// 与arguments类似，NodeList可以通过数组方法转换为数组
let nodeArr = Array.prototype.slice.call(NodeList,0)
let nodeArr = Array.form(NodeList)
```

#### parentNode属性
> 每个节点都有一个 parentNode 属性，指向其 DOM 树中的父元素
> * childNodes 中的所有节点都有同一个父元素，因此它们的 parentNode 属性都指向同一个节点

```js
const div = document.getElementById('div-box')
console.log(div.childNodes.item(0).parentNode)
```

#### previousSibling 和 nextSibling属性
> 返回同一树级别的上一/下一节点
> * 这个列表中第一个节点的 previousSibling 属性是 null，最后一个节点的nextSibling 属性也是 null
> * 如果childNodes中只有一个节点，那么它的这两个属性都为null

#### firstChild 和 nextChild
> firstChild 和 lastChild 分别指向childNodes 中的第一个和最后一个子节点

```js
// 多个节点
someNode.firstChild === someNode.childNodes[0]
someNode.lastChild === someNode.childNodes[someNode.childNodes.length-1]

// 单个节点
someNode.firstChild === someNode.lastChild

// 没有节点
someNode.firstChild === someNode.lastChild === null
```
#### hasChildNodes()方法
> 这个方法如果返回 true 则说明节点有一个或多个子节点。相比查询childNodes 的 length 属性，这个方法无疑更方便

#### ownerDocument属性
> 是一个指向代表整个文档的文档节点的指针

### 操纵节点
> 因为所有关系指针都是只读的，所以 DOM 又提供了一些操纵节点的方法

#### appendChild方法 -- 添加节点
> 该方法用于向childNodes列表末尾添加节点，返回添加的新节点

```js
let returnedNode = someNode.appendChild(newNode);
alert(returnedNode == newNode); // true
alert(someNode.lastChild == newNode); // true
```

#### insertBefore方法 -- 插入特定位置
> 这个方法接收两个参数：`要插入的节点和参照节点`
> 调用这个方法后，要插入的节点会变成参照节点的前一个同胞节点，并被返回

```js
// 作为新的第一个子节点插入
returnedNode = someNode.insertBefore(newNode, someNode.firstChild);
alert(returnedNode == newNode); // true
alert(newNode == someNode.firstChild); // true
```

#### replaceChild方法 -- 替代节点
> 该方法接收两个参数：`要插入的节点和要替换的节点`
> 调用这个方法后，要替换的节点会从文档树中完全移除，要插入的节点会取而代之

```js
// 替换第一个子节点
let returnedNode = someNode.replaceChild(newNode, someNode.firstChild);

// 替换最后一个子节点
returnedNode = someNode.replaceChild(newNode, someNode.lastChild);
```

#### removeChild方法 -- 移除节点
> 该方法接收一个参数：`要移除的元素`，被移除的元素会被返回

```js
// 删除第一个子节点
let formerFirstChild = someNode.removeChild(someNode.firstChild);

// 删除最后一个子节点
let formerLastChild = someNode.removeChild(someNode.lastChild);
```

**注意：**
上面介绍的 4 个方法都用于操纵某个节点的子元素，也就是说使用它们之前必须先取得父节点（使用前面介绍的 parentNode 属性）。并非所有节点类型都有子节点，如果在不支持子节点的节点上调用这些方法，则会导致抛出错误。

#### cloneNode方法
> 该方法会返回和调用它的节点一样的节点
> 接收一个布尔值参数，`表示是否深复制`
> * 在传入 true 参数时，会进行深复制，即复制节点及其整个子 DOM 树
> * 如果传入 false，则只会复制调用该方法的节点。复制返回的节点属于文档所有，但尚未指定父节点，所以可称为孤儿节点

#### normalize方法
> 这个方法唯一的任务就是处理文档子树中的文本节点

## Document类型
> 是JS中表示**文档节点**的类型
> 在浏览器中，文档对象 document 是HTMLDocument 的实例，表示整个HTML页面
> document 是 window对象的属性，因此是一个全局对象

> Document 类型可以表示 HTML 页面或其他 XML 文档，但最常用的还是通过 HTMLDocument 的实例取得 document 对象。`document 对象可用于获取关于页面的信息以及操纵其外观和底层结构`。
### 特征
 nodeType 等于 9；
 nodeName 值为"#document"；
 nodeValue 值为 null；
 parentNode 值为 null；
 ownerDocument 值为 null；
 子节点可以是 DocumentType（最多一个）、Element（最多一个）、ProcessingInstruction
或 Comment 类型。
### 文档子节点
#### documentElement属性
> 始终指向 HTML 页面中的< html>元素，更快更直接访问该元素

```js
// <html>元素既可以通过documentElement 属性获取，也可以通过 childNodes 列表访问
let html = document.documentElement; // 取得对<html>的引用
alert(html === document.childNodes[0]); // true
alert(html === document.firstChild); // true
```
#### body属性
> 该属性直接指向body元素

```js
let body = document.body; // 取得对<body>的引用
```

#### doctype属性
><!doctype>标签是文档中独立的部分，其信息可以通过 doctype 属性来访问

```js
let doctype = document.doctype; // 取得对<!doctype>的引用
```

### 文档信息
> document 作为 HTMLDocument 的实例，还有一些标准 Document 对象上所没有的属性。这些属性提供浏览器所加载网页的信息

#### title属性
> 该属性包含< title >元素中的文本，通常显示在浏览器窗口或标签页的标题栏
```js
// 读取文档标题
let originalTitle = document.title;

// 修改文档标题
document.title = "New page title";
```

#### URL，domain和referrer
* URL属性包含当前页面的完整 URL（地址栏中的 URL）
* domain属性包含页面的域名
* referrer包含链接到当前页面的那个页面的URL；如果页面没有来源则包含空字符串
**注意**
所有这些信息都可以在请求的 HTTP 头部信息中获取，只是在 JavaScript 中通过这几个属性暴露出来而已
```js
// 取得完整的 URL
let url = document.URL;

// 取得域名
let domain = document.domain;

// 取得来源
let referrer = document.referrer;
```

### 定位元素
使用 DOM 最常见的情形可能就是获取某个或某组元素的引用，然后对它们执行某些操作

#### getElementById( )
> 该方法接收一个字符串参数，即要获取的元素ID
> * 如果找到则返回，没找到则返回null
> * 如果存在多个id，返回第一个

```html
<div id="id_name"></div>
<script>
const box = document.getElementById("id_name")
</script>
```

#### getElementByTagName( )
> 该方法接收一个参数，即要获取的元素的标签名
> 返回包含零个或多个元素的 NodeList。在 HTML 文档中，这个方法返回一个HTMLCollection 对象

* 与 NodeList 对象一样，也可以使用中括号或 item()方法从 HTMLCollection 取得特定的元素
* 而取得元素的数量同样可以通过length 属性得知
```js
const boxes = document.getElementByTagName("tag_name")
const single_box = boxes[0]
```
* **namedItem( )方法** -- 可通过标签的 name 属性取得某一项的引用
```html
<img src="myimage.gif" name="myImage">
```
```js
let myImage = images.namedItem("myImage");
let myImage = images["myImage"];
```
* 返回所有元素
```js
let allElements = document.getElementsByTagName("*")
// 这行代码可以返回包含页面中所有元素的 HTMLCollection 对象
// 顺序就是它们在页面中出现的顺序。因此第一项是<html>元素，第二项是<head>元素...
```
* 关于大小写
`对于 document.getElementsByTagName()方法，虽然规范要求区分标签的大小写，但为了最大限度兼容原有 HTML 页面，实际上是不区分大小写的。`

#### getElmentByName( )
> 这个方法会返回具有给定 name 属性的所有元素
> 常用于单选按钮

* 与 getElementsByTagName()一样，getElementsByName()方法也返回 HTMLCollection

### 特殊集合
> document 对象上还暴露了几个特殊集合，这些集合也都是 HTMLCollection 的实例。这些集合是访问文档中公共部分的快捷方式
> 它们的内容也会**实时更新**以符合当前文档的内容

 document.anchors 包含文档中所有带 name 属性的< a >元素。

 document.applets 包含文档中所有< applet >元素（因为< applet >元素已经不建议使用，所

以这个集合已经废弃）。

 document.forms 包含文档中所有< form >元素（与 document.getElementsByTagName ("form")

返回的结果相同）。

 document.images 包含文档中所有<img>元素（与 document.getElementsByTagName ("img")

返回的结果相同）。

 document.links 包含文档中所有带 href 属性的< a >元素。
### 文档写入
> document 对象有一个古老的能力，即向网页输出流中写入内容
> 这个能力对应 4 个方法：`write()、writeln()、open()和 close()`

* write和writeln( )方法接收一个字符串参数，将这个字符串写入网页
* write简单写入文本，而writeln还会在字符串末尾追加一个换行符\n
**这两个方法可以用来在页面加载期间向页面中动态添加内容；经常用于动态包含外部资源**

```html
<html>
<head>
<title>document.write() Example</title>
</head>
<body>
<p>The current date and time is:
<script type="text/javascript">
document.write("<strong>" + (new Date()).toString() + "</strong>");
</script>
</p>
</body>
</html>
```
* open()和 close()方法分别用于打开和关闭网页输出流

## Element类型
> 除了Document 类型，Element 类型就是Web开发中最常用的类型了。Element 表示XML或HTML元素，对外暴露出访问`元素标签名、子节点和属性的能力`

 nodeType 等于 1；

 nodeName 值为元素的标签名；

 nodeValue 值为 null；

 parentNode 值为 Document 或 Element 对象；

 子节点可以是 Element、Text、Comment、ProcessingInstruction、CDATASection、EntityReference 类型

### HTML元素
所有 HTML 元素都通过 HTMLElement 类型表示，包括其直接实例和间接实例。另外，HTMLElement直接继承 Element 并增加了一些属性。每个属性都对应下列属性之一，它们是所有 HTML 元素上都有的标准属性：
* **id**：元素在文档中的唯一标识符
* **title**：包括文档的额外信息，通常以提示条形式展示
* **lang**：元素内容的语言代码
* **dir**：元素的书写方向(`"ltr"表示从左到右；"rtl"表示从右到左`)
* **className**：相当于class属性，用于指定元素的css类，不能直接使用
```html
<div id="myDiv" class="bd" title="Body text" lang="en" dir="ltr"></div>
```
```js
// 元素的所有属性可以通过下列代码展示
let div = document.getElementById("myDiv");
alert(div.id); // "myDiv"
alert(div.className); // "bd"
alert(div.title); // "Body text"
alert(div.lang); // "en"
alert(div.dir); // "ltr"

// 同时可以进行修改
div.id = "someOtherId";
div.className = "ft";
div.title = "Some other text";
div.lang = "fr";
div.dir ="rtl";
```

### 取得属性
> 每个元素都有零个或多个属性，通常用于为元素或其内容附加更多信息
> 与属性相关的 DOM 方法主要有 3 个：`getAttribute()、setAttribute()和 removeAttribute()`
> 这些方法主要用于操纵属性，包括在 HTMLElement 类型上定义的属性
#### getAttribute( )
```js
let div = document.getElementById("myDiv");
alert(div.getAttribute("id")); // "myDiv"
alert(div.getAttribute("class")); // "bd"
alert(div.getAttribute("title")); // "Body text"
alert(div.getAttribute("lang")); // "en"
alert(div.getAttribute("dir")); // "ltr
* 注意传给 getAttribute()的属性名与它们实际的属性名是一样的
* 如果给定的属性不存在则返回null
```
* **getAttribute还能取得不是HTML语言正式属性的自定义属性的值**
```html
<div id="myDiv" my_special_attribute="hello!"></div>
```
```js
let value = div.getAttribute("my_special_attribute");
```
* **getAttribute不区分大小写，因此id和ID被认为是同一个属性**
* style的不同：getAttribute返回`字符串`；DOM对象属性返回一个`CSSStyleDeclaration对象`
```html
<body>
  <div id="div-box" style="display: block;">dd</div>
</body>

<script>
const div = document.getElementById('div-box')
console.log(div.style)
console.log(div.getAttribute('style'))
// CSSStyleDeclaration { 0: 'display', accentColor: '', additiveSymbols: '', alignContent: '', alignItems: '', alignSelf: '', … }
// test.html: 15 display: block;
```
* 事件处理程序的不同：getAttribute返回`字符串`；DOM对象属性返回一个`JS函数`

**使用场景：**
考虑到以上差异，开发者在进行DOM编程时通常会放弃使用getAttribute()而只使用对象属性。getAttribute()主要用于取得自定义属性的值。
#### setAttribute( )
> 这个方法接收两个参数：要设置的属性名和属性的值。如果属性已经存在，则 setAttribute()会以指定的值替换原来的值；如果属性不存在，则 setAttribute()会以指定的值创建该属性

* setAttribute()适用于 HTML 属性，也适用于自定义属性。另外，使用 setAttribute()方法设置的属性名会规范为小写形式，因此"ID"会变成"id"
* 因为元素属性也是 DOM 对象属性，所以直接给 DOM 对象的属性赋值也可以设置元素属性的值
```js
div.setAttribute("id","id_name")
div.id = "id_name"
// 上面两行代码结果一致
```

#### removeAttribute( )
> 最后一个方法 removeAttribute()用于从元素中删除属性。这样不单单是清除属性的值，而是会把整个属性完全从元素中去掉

```js
div.removeAttribute("class");
```
### attributes属性
Element 类型是唯一使用 attributes 属性的 DOM 节点类型。attributes 属性包含一个`NamedNodeMap 实例`，是一个类似 NodeList 的`“实时”集合`。元素的每个属性都表示为一个` Attr 节点`，并保存在这个 NamedNodeMap 对象中。NamedNodeMap 对象包含下列方法：
* **getNamedItem(name)** -- 返回nodeName属性等于name的节点
* **removeNamedItem(name)** -- 删除 nodeName 属性等于 name 的节点
* **setNamedItem(node)** -- 向列表中添加 node 节点，以其 nodeName 为索引
* **item(pos)** -- 返回索引位置 pos 处的节点
* **nodeName** -- 对应属性的名字
* **nodeValue** -- 对应属性的值
```js
let id = element.attributes.getNamedItem("id").nodeValue;
let id = element.attributes["id"].nodeValue; // 中括号格式
```

**使用场景：**
attributes 属性最有用的场景是需要迭代元素上所有属性的时候。这时候往往是要把 DOM 结构序列化为 XML 或 HTML 字符串
不同浏览器返回的 attributes 中的属性顺序也可能不一样。HTML 或 XML 代码中属性出现的顺序不一定与 attributes 中的顺序一致

### 创建元素
> 使用 document.createElement()方法创建新元素。这个方法接收一个参数，为创建元素的标签名
> `在 HTML 文档中，标签名是不区分大小写的，而 XML 文档（包括 XHTML）是区分大小写的`

```js
// 创建一个div元素
let div = document.createElement("div")
```
* 使用 createElement()方法创建新元素的同时也会将其 ownerDocument 属性设置为 `document`,此时，可以再为其添加属性、添加更多子元素
```js
div.id = "id_name"
div.className = "class_name"
// 在新元素上设置这些属性只会附加信息。因为这个元素还没有添加到文档树，所以不会影响浏览器显示
```
* **添加元素到文档树**：`可以使用 appendChild()、insertBefore()或 replaceChild()`
```js
document.body.appendChild(div);
// 元素被添加到文档树之后，浏览器会立即将其渲染出来。之后再对这个元素所做的任何修改，都会立即在浏览器中反映出来
```

### 元素后代
> 元素可以拥有任意多个子元素和后代元素，因为元素本身也可以是其他元素的子元素
> childNodes属性包含元素所有的子节点，这些子节点可能是其他元素、文本节点、注释或处理指令
> 不同浏览器在识别这些节点时的表现有明显不同


## Text类型
> Text 节点由 Text 类型表示，包含按字面解释的纯文本，也可能包含转义后的 HTML 字符，但不含 HTML 代码

 nodeType 等于 3；

 nodeName 值为"#text"；

 nodeValue 值为节点中包含的文本；

 parentNode 值为 Element 对象；

 不支持子节点

### nodeValue & data
Text 节点中包含的文本可以通过 nodeValue 属性访问，也可以通过 data 属性访问，这两个属性包含相同的值。修改 nodeValue 或 data 的值，也会在另一个属性反映出来

### 操作文本方法
* **appendData(text)** -- 向文本句末添加文本text
* **deleteData(offset,count)** -- 从位置offset开始删除count个字符】
* **inserData(offset,text)** -- 向位置offser添加text字符
* **replaceData(offset,count,text)** -- 从text替换从位置offset到offset+count的文本
* **splitText(offset)** -- 在位置offset将当前文本节点拆分为两个文本节点
* **substringData(offset,count)** -- 提取从位置offset到offset+count的文本
### 创建文本方法
**document.createTextNode()**  --  可以用来创建新文本节点，它接收一个参数，即要插入节点的文本。跟设置已有文本节点的值一样，这些要插入的文本也会应用 HTML 或 XML 编码
```js
let textNode = document.createTextNode("<strong>Hello</strong> world!");
```
### 规范化文本节点
* **normalize( )** -- 合并相邻的文本节点
## Comment类型
> DOM中的注释通过该类型标识

 nodeType 等于 8；

 nodeName 值为"#comment"；

 nodeValue 值为注释的内容；

 parentNode 值为 Document 或 Element 对象；

 不支持子节点。

### Comment与Text
Comment 类型与 Text 类型继承同一个基类（CharacterData），因此拥有除 splitText()之外Text 节点所有的字符串操作方法
### 创建注释节点
```js
let comment = document.createComment("A comment");
```

## CDATASection类型
> CDATASection 类型表示 XML 中特有的 CDATA 区块。CDATASection 类型继承 Text 类型
> **CDATA 区块只在 XML 文档中有效**

 nodeType 等于 4；

 nodeName 值为"#cdata-section"；

 nodeValue 值为 CDATA 区块的内容；

 parentNode 值为 Document 或 Element 对象；

 不支持子节点。


## DocumentType类型
> DocumentType 类型的节点包含文档的文档类型（doctype）信息

 nodeType 等于 10；

 nodeName 值为文档类型的名称；

 nodeValue 值为 null；

 parentNode 值为 Document 对象；

 不支持子节点。



## DocumentFragment 类型
> 在所有节点类型中，DocumentFragment 类型是唯一一个在标记中没有对应表示的类型。DOM 将文档片段定义为“轻量级”文档，能够包含和操作节点，却没有完整文档那样额外的消耗
## Attr类型
> 元素数据在 DOM 中通过 Attr 类型表示。Attr 类型构造函数和原型在所有浏览器中都可以直接访问。技术上讲，属性是存在于元素 attributes 属性中的节点

**属性节点尽管是节点，却不被认为是 DOM 文档树的一部分。Attr 节点很少直接被引用，通常开
发者更喜欢使用 getAttribute()、removeAttribute()和 setAttribute()方法操作属性**


 nodeType 等于 2；

 nodeName 值为属性名；

 nodeValue 值为属性值；

 parentNode 值为 null；

 在 HTML 中不支持子节点；

 在 XML 中子节点可以是 Text 或 EntityReference
# DOM编程
## 动态脚本
> 动态脚本就是：在页面初始化加载时不存在，之后又通过DOM包含的脚本

### < script >元素
> < script >元素用于向网页中插入 JavaScript 代码，可以是 src 属性包含的外部文件，也可以是作为该元素内容的源代码

**有两种方式通过该元素为页面添加脚本**
#### 1. 引入外部文件
```html
<script src="foo.js"></script>
```
#### 2. 直接插入源代码
```html
<script>
function func(){...}
</script>
```

#### 3. 使用DOM创建脚本节点
```js
let script = document.createElement("script");
script.src = "foo.js";
document.body.appendChild(script);
```


## 动态样式
CSS 样式在 HTML 页面中可以通过两个元素加载：
* < link >元素用于包含 CSS 外部文件
* < style >元素用于添加嵌入样式。
与动态脚本类似，动态样式也是`页面初始加载时并不存在，而是在之后才添加到页面中的`

* 注意应该把< link >元素添加到< head >元素而不是< body >元素，这样才能保证所有浏览器都能正常运行
* 
## 操作表格 -- < table >
> 使用基本的DOM操作对表格进行操作相当繁琐也不好理解
> 为了方便创建表格

**HTML DOM 给< table >、< tbody >和< tr >元素添加了一些属性和方法**
 caption，指向`caption`元素的指针（如果存在）；
 tBodies，包含`tbody`元素的 HTMLCollection；
 tFoot，指向`tfoot`元素（如果存在）；
 tHead，指向`thead`元素（如果存在）；
 rows，包含表示所有行的 HTMLCollection；
 createTHead()，创建`thead`元素，放到表格中，返回引用；
 createTFoot()，创建`tfoot`元素，放到表格中，返回引用；
 createCaption()，创建`caption`元素，放到表格中，返回引用；
 deleteTHead()，删除`thead`元素；
 deleteTFoot()，删除`tfoot`元素；
 deleteCaption()，删除`caption`元素；
 deleteRow(pos)，删除给定位置的行；
 insertRow(pos)，在行集合中给定位置插入一行

**< tbody >元素添加了以下属性和方法：**
 rows，包含`tbody`元素中所有行的 HTMLCollection；
 deleteRow(pos)，删除给定位置的行；
 insertRow(pos)，在行集合中给定位置插入一行，返回该行的引用

**< tr >元素添加了以下属性和方法：**
 cells，包含tr元素所有表元的 HTMLCollection；
 deleteCell(pos)，删除给定位置的表元；
 insertCell(pos)，在表元集合给定位置插入一个表元，返回该表元的引用。
## 使用NodeList
> 理解 NodeList 对象和相关的 NamedNodeMap、HTMLCollection，是理解 DOM 编程的关键
> 因为这三个集合类型都是`实时的`，它们的值始终代表着最新的状态

**实际上，NodeList 就是基于 DOM 文档的实时查询**

一般来说，最好限制操作 NodeList 的次数。因为每次查询都会搜索整个文档，所以最好把查询到的 NodeList 缓存起来。

## MutationObserver 接口
> 可以在 DOM 被修改时异步执行回调
> 使用 MutationObserver 可以观察整个文档、DOM 树的一部分，或某个元素

