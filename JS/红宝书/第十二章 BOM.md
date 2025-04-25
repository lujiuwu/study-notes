> BOM 提供了与网页无关的浏览器功能对象
# window对象 -- BOM的核心
> window对象表示浏览器的实例，window对象在浏览器中有两重身份
> * JS中的Global对象
> * 浏览器窗口的JS接口

## Global作用域
> 因为window对象被复用为JS中的Global对象，所以`通过var声明`的所有全局变量和函数都会成为window对象的属性和方法

* 访问未声明的变量会抛出错误，但是可以在 window 对象上查询是否存在可能未声明的变量

## 窗口关系
* top指向最外层窗口（浏览器窗口本身）
* parent指向当前窗口的父窗口
* self是终极window属性，始终指向window
**这些属性都是 window 对象的属性，因此访问 window.parent、window.top 和 window.self
都可以。这意味着可以把访问多个窗口的 window 对象串联起来**

### 窗口位置和像素比
> window 对象的位置可以通过不同的属性和方法来确定。现代浏览器提供了 screenLeft 和screenTop 属性，用于表示窗口相对于屏幕左侧和顶部的位置 ，返回值的单位是 `CSS 像素`

#### 像素比
> CSS 像素是 Web 开发中使用的统一像素单位。这个单位的背后其实是一个角度：0.0213°。

### 窗口大小
所有现代浏览器都支持 4 个属性：
`innerWidth、innerHeight、outerWidth 和 outerHeight。outerWidth 和 outerHeight`
返回浏览器窗口自身的大小

### 视口位置
浏览器窗口尺寸通常无法满足完整显示整个页面，为此用户可以通过滚动在有限的视口中查看文档
度量文档相对于视口滚动距离的属性有两对，返回相等的值：
`window.pageXoffset/window.scrollX` 和 `window.pageYoffset/window.scrollY`

### 导航与打开新窗口 -- window.open( )
> window.open()方法可以用于导航到指定 URL，也可以用于打开新浏览器窗口
> 这个方法接收四个参数：
> `要加载的 URL、目标窗口、特性字符串和表示新窗口在浏览器历史记录中是否替代当前加载页面的布尔值`

### 定时器 -- setTimeout( )&setInterval( )
#### setTimeout(operationCode,time)
> setTimeout()用于指定在一定时间后执行某些代码

```js
function func(){}
setTimeout(func(),1000) // 在1000ms后执行func函数的操作
```
* **返回参数** `调用 setTimeout()时，会返回一个表示该超时排期的数值 ID`
   这个超时 ID 是被排期执行代码的唯一标识符，可用于取消该任务
* **取消任务**
```js
// 设置超时任务
let timeoutId = setTimeout(() => alert("Hello world!"), 1000);

// 取消超时任务
clearTimeout(timeoutId);
```

#### setInterval(operationCode,time)
> 指定任务每隔指定时间就执行一次

```js
function func(){}
setInterval(func(),1000) // 每隔1000ms就执行一次func函数的操作
```

* **返回参数** `setInterval()方法也会返回一个循环定时 ID，可以用于在未来某个时间点上取消循环定时`
* **取消任务**
```js
let max = 10;
let incrementNumber = function() {
  num++;
  // 如果达到最大值，则取消所有未执行的任务
  if (num == max) {
    clearInterval(intervalId);
    alert("Done");
  }
}
intervalId = setInterval(incrementNumber, 500);
```

### 系统对话框
> 使用 alert()、confirm()和 prompt()方法，可以让浏览器调用系统对话框向用户显示消息

```js
// 警告框 -- alert
alert("警示内容")
// 确认框 -- confirm:返回一个表示用户选择的布尔值(OK键或者Cancel键)
if(confirm("确认内容")) ...
// 提示框 -- prompt:提示用户输入信息，OK键则返回输入框内容；Cancel键则返回null
console.log(prompt("提示内容"))
```

# location对象
> location 是最有用的 BOM 对象之一，提供了当前窗口中加载文档的信息，以及通常的导航功能
> 它既是window的属性也是document的属性

# navigator对象
> navigator 是由 Netscape Navigator 2 最早引入浏览器的，现在已经成为客户端标识浏览器的标准
> navigator 对象的属性通常用于确定浏览器的类型

# screen对象
# history对象
