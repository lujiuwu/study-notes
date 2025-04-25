## CSS
### 盒模型介绍
> C3的盒模型分为两种：标准盒模型，IE(替代)盒模型
> 两种盒模型都是由 **content+padding+border+margin** 构成，其大小都是由content+padding+border决定的
> 但是盒子内容宽/高度的 **计算范围** 根据盒模型的不同会有所不同

* 标准盒模型 -- 只包括content
* IE盒模型 -- 包括content + padding + border

**通过 box-sizing属性 来改变盒模型**
* box-sizing:content-box：标准盒模型（默认值）
* box-sizing:border-box：IE盒模型

### CSS选择器和优先级
> !importent > style > id > class
> 内联 > ID选择器 > 类选择器 > 标签选择器
#### 什么是选择器优先级
浏览器通过**优先级**来判断哪一些属性值与一个元素最为相关，从而在该元素上应用这些属性值。
优先级是基于不同种类选择器组成的匹配规则
#### 浏览器具体的优先级算法
优先级是由 `A` 、`B`、`C`、`D` 的值来决定的，其中它们的值计算规则如下：

1. 如果存在内联样式，那么 `A = 1`, 否则 `A = 0`;
2. `B` 的值等于 `ID选择器` 出现的次数;
3. `C` 的值等于 `类选择器` 和 `属性选择器` 和 `伪类` 出现的总次数;
4. `D` 的值等于 `标签选择器` 和 `伪元素` 出现的总次数 。

**比较规则是: 从左往右依次进行比较 ，较大者胜出，如果相等，则继续往右移动一位进行比较 。如果4位全部相等，则后面的会覆盖前面的**

#### 优先级的特殊情况 -- !important

如果不是为了覆盖内联样式，最好不要使用!important
*杜绝在内联样式中使用!important* 

### 重排/回流(reflow)和重绘(repaint)的理解
#### 重排/回流
> 无论以什么方式影响了元素的**几何信息**（元素在视口内的位置和尺寸大小），浏览器都需要**重新计算**元素在视口的几何属性

##### 发生时机
* 添加或者删除可见的元素（修改标签，修改display属性）
* 元素的位置发生变化（修改定位的left,right,top,bottom等）
* 元素的尺寸发生变化（包括**外边距，内边框，边框大小，高度和宽度等**）
* 内容发生变化，比如文本变化或者图片被另一个不同尺寸的图片所替代
* 浏览器的窗口尺寸发生变化（因为回流是根据**视口的大小**来计算元素的位置和大小的）
##### 回流一定触发重绘，重绘不一定触发回流

#### 重绘
构造完渲染树并经历重排/回流后，接下来就将渲染树的每个节点转换为屏幕上的**实际像素**

#### 浏览器的优化机制
现代的浏览器很聪明，由于每次重排都会造成额外的计算消耗，因此大多数浏览器都会通过`队列化修改并批量执行`来优化重排过程。
浏览器会讲修改操作放入队列里，直到过了一段时间或者操作达到了一个阈值，才清空队列。
但是 **当执行获取布局信息的操作的时候，会强制队列刷新** 比如访问了以下属性或者使用以下方法：
* offsetTop,offsetLeft,offsertWidth,offsetHeight
* scrollTop,scrollLeft,scrollWidth,scrollHeifht
* clientTop,clientLeft,clientWidth,clientHeight
* getComputedStyle()
* getBoundingClientRet

补充：

|             | margin | border | padding | width&height | scroll | 视口之外的内容 |
| ----------- | ------ | ------ | ------- | ------------ | ------ | ------- |
| offsetWidth | 不包括    | 包括     | 包括      | 包括           | 包括     | 包括      |
| clientWidth | 不包括    | 不包括    | 包括      | 包括           | 不包括    | 不包括     |
| scrollWidth | 不包括    | 不包括    | 包括      | 包括           | 不包括    | 包括      |
* offset组：除了外边距之外的所有尺寸之和
* client组：`视口尺寸`，即只包含本身尺寸和内边距尺寸
* scroll组：只包括本身尺寸和内边距尺寸，`如果有滚动的溢出视口之外的内容`，也需要加上


**原因**
以上属性都需要返回最新的布局信息，因此浏览器不得不清空队列，触发回流重绘来返回正确的信息，
因此，我们在修改样式的时候，`最好避免使用上面列出的属性，他们都会刷新渲染队列，如果要使用，最好将值缓存起来`

#### 减少回流和重绘
##### 为什么要减少
浏览器的渲染过程其实是有代价的，因为在渲染过程中，每个步骤都会使用上一个操作的结果来创建新数据。例如：如果**布局树 (layout Tree)**  改变，那就会需要重新绘制。所以如果能够尽量避免回流 (Reflow) 或重绘 (Repaint)，就能够大大提升效能。
##### 方法一：合并多次对DOM和样式的操作
```js
const el = document.getELementById("idName")
el.style.padding = "5px"
el.style.borderLeft = "10px"
```
在代码中有三个样式属性被修改，每一个都会影响元素的几何结构从而引起回流。大部分现代浏览器做了优化，因此只会触发一次重流，但是如果在旧版浏览器上面执行时，有其他代码访问了布局信息，那么就会导致三次重排
因此，我们可以合并所有的改变然后依次处理：
* 使用cssText
```js
const el = document.getElementById("idName")
el.style.cssText = "padding:5px;border-left:10px;"
```
* 修改CSS的class 结合样式表修改
```js
const el = document.getElementById("idName")
el.className += "Active"
```
```css

.classNameActive{
  padding:5px;
  border-left:10px;
}
```

##### 方法二：批量修改DOM
当我们需要对DOM进行一系列修改时，可以通过一下步骤减少回流次数：
* 使元素脱离文档流
* 对其进行多次修改
* 将元素带回文档流
`该过程的第一步和第三步可能会引起回流，但是第一步之后，对DOM的所有修改都不会直接引起回流，因为它已经不在渲染树当中了`
**让DOM脱离文档流的方法**
> 示例
> 如果直接执行以下代码，由于每次循环都会插入一个新的节点，就会导致浏览器回流一次。
> 我们可以通过三种方式进行优化
```html
<ul id="list"></ul>
```
```js
// 原代码
function addElement(listDOM,listData){
  for(let i = 0;i<data.length;i++){
    const  li = document.createElement('li')
    li.textContent = data[i].value
    listDOM.appendChild(id)
  }
}
// 原执行
const listDOM = document.getElementById("list")
const listData = [
  {value:'li1'},
  {value:'li2'},
  {value:'li3'}
]
addElement(listDOM,listData)
```
* 隐藏元素，应用修改，重新显示 `在隐藏和展示节点的时候触发两次回流`
```js
const listDOM = document.getElementById("list")
// 隐藏 - 触发回流
listDOM.style.display = 'none'
// 执行 - 脱离渲染树
addElement(listDOM,listData)
// 显示 - 触发回流 回到渲染树
listDOM.style.display = 'block'
```

* 使用文档片段（document.fragment）在当前DOM之外构建一个`子树`，再替换原始的元素
```js
const listDOM = document.getElementById("list")
// 构建子树
const fragment = document.createDocumentFragment()
// 子树执行操作 -- 脱离渲染树
addElement(fragment,listData)
// 子树替代原始操作 -- 触发回流
listDOM.appendChild(fragment)
```

* 将原始元素拷贝到一个脱离文档流的节点中，修改节点后再替换原始的节点
```js
const listDOM = document.getElementById("list")
// 拷贝节点
const node = listDOM.cloneNode()
// 节点执行操作 -- 脱离渲染树
addElement(node,listData)
// 替换原始节点 -- 触发回流
listDOM.parentNode.replaceChild(node,listDOM)
```
**效果**
实验结果并不理想，因为现代浏览器会使用队列来存储多次修改，进行优化，所以对这个优化方案，其实不用优先考虑

##### 方法三：避免触发同步布局事件
> 所谓强制同步布局，是指 JavaScript 强制将计算样式和布局操作提前到当前的任务中
> 当我们访问元素的一些属性时，会导致浏览器强制清空队列，导致强制同步布局

```js
// eg:
function initP(){
  const box = document.getElementById("box")
  for(let i = 0;i<10;i++){
    // 此处获取了offsetWidth属性
    list[i].style.width = box.offsetWidth + 'px'
  }
}
```
上述代码会造成很大的性能问题，在每次循环的时候都获取了offsetWidth的属性，利用它来更新width的属性，这就导致每一次循环的时候浏览器都必须先使上一次循环的样式更新操作生效，才能响应本次循环的样式读取操作，**导致每一次循环都会强制浏览器刷新队列**

> **优化操作**

```js
function initP(){
  const box = document.getElementById("box")
  // 缓存值
  const boxWidth = box.offsetWidth

  for(let i = 0;i<10;i++){
    list[i].style.width = boxWidth + 'px'
  }
}
```
##### 方法四：使用fixed/absolute定位（对于负责动画）
> 对于复杂动画效果，由于会经常引起回流重绘，所以可以使用绝对定位，`让它脱离文档流`

##### 方法五：css3硬件加速（GPU加速）
> 比起考虑如何减少回流重绘，不如根本不需要回流重绘

###### 如何使用
常见的触发硬件加速的css属性
* transform
* opacity
* filters
* Will-change

**注意**：上述四个属性不会引起回流重绘，但是对于动画的其他属性 `比如background-color这些`，还是会引起回流重绘

###### 缺点
* 如果为太多元素使用css3硬件加速，会导致内存占用较大，会有性能问题
* 在GPU渲染字体会导致抗锯齿无效，`这是因为GPU和CPU算法不同`，所以如果不在动画结束的时候关闭硬件加速，会导致字体模糊

### 对于BFC的理解
> BFC -- **块级格式化上下文**

简单来说，BFC就是给盒子加一个属性，让盒子变成一块独立渲染的区域

**如何设置BFC**
* 根元素html
* 设置浮动float 且值不为none
* 设置定位absolute和fixed
* 设置display inline-block,flex,grid,table等
* 设置overflow不为visible





#### 盒模型
CSS盒模型描述了通过`文档树中的元素`以及相应的`视觉格式化模型`所生成的矩形盒子。
简单来说，盒模型定义了一个`矩形盒子`，当我们需要对文档进行布局时，浏览器的渲染引擎就会根据盒模型，将所有元素表示为一个个矩形的盒子，盒子的外观由CSS决定
一个标准的盒子由四个部分组成：**内容 内边距 边框 外边距**
##### 标准盒模型
在标准盒模型中，内容区域的大小可以明确地通过`width,min-width,mex-width...`控制，也就是说CSS设置的元素宽高只包含**内容区域**
##### 怪异盒模型/IE盒模型
```css
.box{
  box-sizing:border-box;
}
```
此时，元素的宽高包括了**内容，内边距，边框**
#### 视觉格式化模型
CSS视觉格式化模型描述了`盒子是怎样生成的`，即`盒子生成的计算规则`，通过规则将文档元素转换为一个个盒子
每一个盒子的布局由`尺寸、类型、定位、盒子的子元素或者兄弟元素、视口的尺寸和位置`等因素决定
视觉格式化模型定义了盒（Box）的生成，其中盒包括：`块级盒，行内盒，匿名盒`
视觉格式化模型的计算，取决于一个矩形的边界，这个矩形的边界就是**包含块**
```html
<div>
  <span>
    <p></p>
  </span>
</div>

* div和span都是包含块
* div是span的包含块 span是p的包含块
```
**盒子不受包含块的限制**：
当盒子的布局跑到包含块的外面时，就是我们说的`溢出（overflow）`
#### 块级元素
##### 定义
> CSS属性值`display`为`block,list-item,table`的元素

##### 块级盒
* 视觉上，块级盒呈现为`竖直排列`的块，按普通流排列
* 独立 容器 内部不会影响外部
* 每个块级盒都会参与`BFC`的创建
* 每个块级元素都会至少生成一个`块级盒`，称为**主块级盒**；一些元素可能会生成额外的块级盒，比如`<li>` 用来存放项目符号
#### 行内级元素
##### 定义
>  CSS属性值`display`为`inline,inline-block,inline-table`的元素

##### 行内盒
* 视觉上，每一个行内盒与其他行内级元素`并排列为多行`
* 所以的**可替换元素**（`display`值为：`inline`,比如`<img>,<iframe>,<video>,<embed>`等）生成的都是行内盒，它们会参与**IFC（行内格式化上下文）** 的构建
* 所有的**非可替换行内元素**（`display`值为：`inline-block,inline-table`）生成的盒称为`原子行内级盒`，不参与IFC创建
#### 匿名盒
匿名盒指`不能被CSS选择器选中的盒子`，比如：
```html
<div>
  匿名盒1
  <span>匿名盒2</span>
  匿名盒3
</div>

* div生成块级盒 span生成行内盒
* span的前后会生成两个匿名盒
* 匿名盒所有可以继承的CSS属性值都为inherit 所有不可继承的CSS属性值都为initial
```

#### 块级格式化上下文
BFC这个概念来自`视觉格式化模型`，它是页面CSS视觉渲染的一部分，**用于决定块级盒的布局及浮动相互影响范围的一个区域**
BFC 可以看作是一个**独立的容器**，其中包含了一个或多个块级元素。在 BFC 内部，元素的布局和渲染遵循特定的规则，与外部的元素相互独立。这意味着 BFC 内部的元素不会与外部的元素产生布局冲突，并且可以独立地进行样式计算和渲染
##### BFC的创建
* 根元素 html
* 浮动元素 float不为none
* 绝对定位元素 postion为absolute或fixed
* 表格的标题和单元格 display为table-caption，table-cell
* 匿名表格单元级元素 display为table，inline-table
* 行内块元素 display为inline-block
* overflow的值不为visible的元素
* 弹性元素 display值为flex或者inline-flex的元素的`直接子元素`
* 网格元素 display值为grid或者inline-grid的元素的`直接子元素`

**在最新的CSS3规范中**：弹性元素和网格元素会创建 `F(flex)FC`和`G(grid)FC`

##### BFC的范围
BFC的包含创建它的元素的所有子元素，但不包括创建了新的BFC的子元素的内部元素
简单来说，子元素如果又创建了一个新的BFC，那么它的内容就不属于上一个BFC了，这体现了`隔离`的思想，如：
```html
<table>
  <tr>
    <td></td>
  </tr>
</table>

* table创建的BFC记为tb_bfc tr创建的BFC记为tr_bfc，根据规则，两个BFC的范围分为：
* tb_bfc:tr元素，不包括tr的子元素
* tr_bfc:td元素

```
**一个元素不能同时存在于两个BFC中**

##### BFC的特性
BFC除了会创建一个隔离的空间外，还具有以下特性：
* BFC内部的块级盒会在垂直方向上一个一个排列
* 同一个BFC下的相邻块级元素可能发生外边距折叠，创建新的BFC可以避免外边距折叠
* 每个元素的外边距盒的左边与包含块级框盒的左边相接触，即使存在浮动也是如此
* 浮动盒的区域不会与BFC重叠
* 计算BFC的高度时，浮动元素也会参与计算

##### BFC的应用
* 自适应多栏布局
* 防止相邻元素外边距折叠问题

* 浮动重叠问题


### 布局
#### 两栏布局
* 利用浮动
```less
.outer{
  .left{
    width:30px;
    float:left;
  }
  .right{
    // 默认为 width:auto;
  }
}
```
* 利用浮动+overflow
```less
.outer{
  .left{
    width:30px;
    float:left;
  }
  .right{
    overflow: hidden; // 触发BFS BFS的区域不会与浮动元素重叠
  }
}
```

* flex布局
* 绝对定位：子绝父相 左边元素absolute定位

#### 圣杯布局和双飞翼布局（经典三份栏布局）
> **目的：** 三栏布局 中间一栏最先加载和渲染；两侧内容固定 中间内容随着宽度自适应；一般用于PC网页

- 使用 `float`  布局。
- 两侧使用 `margin` 负值，以便和中间内容横向重叠。
- 防止中间内容被两侧覆盖，圣杯布局用 `padding` ，双飞翼布局用 `margin` 。

#### 水平垂直居中方法
* 绝对定位：设置left:50%和top:50% ；再通过translate调整（不定宽高）
```less
.father { 
position: relative; 
} 
.son { 
position: absolute; 
left: 50%; 
top: 50%; 
transform: translate(-50%, -50%); 
}
```

* 子绝父相（盒子必须有宽高）
```less
.father { 
position: relative; } 
.son { 
position: absolute; 
top: 0; 
left: 0; 
right: 0; 
bottom: 0px; 
margin: auto; 
height: 100px;
width: 100px; }

```

* 子绝父相（定宽高）
```less
.father { 
position: relative;
} 
.son { 
position: absolute; 
left: 50%; 
top: 50%; 
width: 200px; 
height: 200px; 
margin-left: -100px; 
margin-top: -100px; 
}

```

* flex布局 不定宽高
```less
.father { 
display: flex; 
justify-content: center; 
align-items: center; 
}
```

### flex布局（flexible box）弹性布局
#### 定义
```less
// 块元素
.div{
display:flex;
}
// 行内元素
.span{
display:inline-flex;
}
```
Webkit 内核的浏览器，必须加上`-webkit`前缀。
```less
.box{
  display: -webkit-flex; /* Safari */
  display: flex;
}
```
**注意**：设为 Flex 布局以后，子元素的`float`、`clear`和`vertical-align`属性将失效。

#### 基本概念
采用flex布局的容器称为flex容器 所有元素称为flex项目
容器默认存在水平的主轴main axis和垂直的交叉轴cross axis

#### 容器属性
- flex-direction -- 决定主轴的方向 即项目的排列方向
```less
.box{
  flex-direction:row/row-reverse/column/column-reverse
}
```
- flex-wrap -- 决定是否换行以及换行的方向
```less
.box{
  flex-wrap:wrap/nowrap/wrap-reverse
}
```
- flex-flow -- 是以上两个属性的简写方式
```less
.box{
  flex-flow:direction||wrap
}
```
- justify-content -- 定义了项目在主轴上的对齐方式
```less
.box{
  justify-content:flex-start | flex-end | center | space-between | space-around

}
```
- align-items -- 定义项目在交叉轴上如何对齐
```js
{
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```
- align-content -- 多根轴线的对齐方式
.box {
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}

对于项目：
**### align-self属性

align-self属性允许单个项目有与其他项目不一样的对齐方式**