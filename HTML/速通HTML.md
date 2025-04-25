## HTML是什么
HTML是用来描述网页的一种语言
* HTML指的是超文本标记语言
* HTML不是一种编程语言而是一种标记语言
* 标记语言是一套标记标签
* HTML使用标记标签来描述网页
### HTML文档 = 网页
* HTML文档描述网页
* HTML文档包含HTML标签和纯文本
* HTML文档也称为网页

## HTML表格
```html
<table border="1">
 <!-- 一行 -->
 <tr>
   <!-- 一列 -->
   <th>header1</th>
   <th>header2</th>
 </tr>
 <tr>
   <!-- 一列 -->
   <td>row1,cell1</td>
   <td>row1,cell2</td>
 </tr>
</table>

```
## HTML表单
```html
<form>

</form>
```
### input元素
> 根据type属性切换类型

| 类型     | 描述                 |
| ------ | ------------------ |
| text   | 定义常规文本输入。          |
| radio  | 定义单选按钮输入（选择多个选择之一） |
| submit | 定义提交按钮（提交表单）       |
| check  | 定义复选框              |
```html
<form>
 First name:<br>
 <input type="text" name="firstname">
 <br>
 Last name:<br>
 <input type="text" name="lastname">
</form>
```
* 如果要正确地被提交，每个输入字段必须设置一个` name `属性
### select属性 -- 下拉列表
```html
<select name="cars">
  <option value="volvo" selected>Volvo</option>
  <option value="saab">Saab</option>
  <option value="fiat">Fiat</option>
  <option value="audi">Audi</option>
</select>
```
* **option**：元素定义待选择的选项
  `通过添加 selected 属性来定义预定义选项。`
### textarea

### 表单属性
* **action**：定义提交表单时要执行的操作
* **target**：规定提交表单之后在何处显示
* **method**：规定提交表单数据时要使用的HTTP方法

## HTML图片
* < img >是空标签，意思是说，它只包含属性，并且没有闭合标签
### 属性
* src -- 图片路径
* alt -- 为图像定义一串预备的可替换的文本；无法载入图像时显示
* title -- 标题属性 `鼠标悬停在带有title属性的HTML元素上时，会弹出提示框显示title属性的内容`

## HTML链接
```html
<a href="url_target" target="open_way" ></a>
```

**target属性值** -- 定义链接打开方式
* _ blank -- 在新窗口或标签页中打开
* _ self -- 在当前窗口或标签页打开（默认）
* _ parent -- 子父框架中打开
* _ top -- 在整个窗口打开 取消任何框架

**rel属性值** -- 定义链接与目标页面的关系
* nofollow -- 表示搜索引擎不应跟踪该链接，常用于外部链接
* noopener -- 防止新的浏览器上下文访问window.opener属性和open方法
* norefoerrer -- 不发送referer header（即不告诉目标网站你从哪里来的）
`noopener 和 noreferrer`: 防止在新标签中打开链接时的`安全问题`，尤其是使用` target="_blank" 时`

**download** -- 提示浏览器下载链接目标而不是导航到该目标
```html
<a href="file.pdf" download="example.pdf">下载文件</a>
```

**title** -- 定义链接的额外信息，当鼠标悬停在链接上时显示的工具访问
```html
<a href="https://www.example.com" title="访问 Example 网站">访问 Example</a>
```

**id** -- 用于链接锚点，通常在同一页面中跳转到某个特定位置
```html
<!-- 链接到页面中的某个部分 -->
<a href="#section1">跳转到第1部分</a>
<div id="section1">这是第1部分</div>
```

## HTML列表
### 无序列表 -- ul&li
此列项目使用粗体圆点（典型的小黑圆圈）进行标记
```html
<ul>  
  <li>Coffee</li>  
  <li>Milk</li>  
</ul>
```
### 有序列表 -- ol&li
列表项目使用数字进行标记
```html
<ol>  
  <li>Coffee</li>  
  <li>Milk</li>  
</ol>
```

### 自定义列表 -- dl&dt dd
自定义列表不仅仅是一列项目，而是项目及其注释的组合
* 自定义列表以 < dl > 标签开始。
* 每个自定义列表项以 < dt > 开始。每个自定义列表项的定义以 < dd > 开始。
```html
<dl>  
  <dt>Coffee</dt>  
  <dd>- black hot drink</dd>  
  <dt>Milk</dt>  
  <dd>- white cold drink</dd>  
</dl>
```


