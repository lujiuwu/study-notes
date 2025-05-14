```html
<style lang='css' scoped>
</style>
```

### 什么是scoped

> scoped是H5的新属性，如果使用该属性，则样式仅仅应用到 style 元素的父元素及其子元素、
> 即实现**样式隔离**

**vue中的scoped**
* 在Vue.js的组件化开发中，常常会对某个组件的style标签加上scoped属性
* 如`<style lang='less' scoped>`
* 当一个style标签拥有scoped属性时，它的CSS样式就只能作用于当前的组件，这样就可以使得**组件之间的样式不互相污染**
* 如果一个项目中的所有style标签全部加上了scoped，相当于实现了**组件的私有化，样式的模块化**

### scoped的实现原理

> vue中的scoped属性的效果主要通过**PostCSS**转译实现
> 编译时，会给每个vue文件生成一个唯一的id，会将此id添加到当前文件中所有html的标签上
> 
> 通过观察渲染的DOM结构可以发现，在DOM结构以及css样式上加了唯一的标记，使样式唯一且只作用于`含有该属性的dom——组件内部dom`

**PostCSS**
PostCSS 是一个用 JavaScript 编写的工具，它可以对 CSS 代码进行转换和处理。它提供了一种强大而灵活的方式来修改和增强 CSS，使开发者能够以`更高效和个性化的方式管理 CSS 样式`

**实例**
```html
<!-- 源代码 -->
<template>
    <div class="box">divBox</div>
</template>
<style scoped>
.box {
    width: 100px;
    height:100px;
    background:blue;
 }
</style>


<!-- 转译后 -->
<template>
    <div class="box" data-v-fabc90cc>divBox</div></template>
<style>
.box[data-v-fabc90cc] {
  width: 100px;
  height:100px;
  background:blue;
}
</style>

```
### 穿透

需要注意的是：**如果组件内部还有组件，那只会给最外层组件加唯一属性字段，不影响组件北部的样式
**造成的问题：** 父组件无法直接修改子组件的样式

#### 解决方法 -- 穿透

* >>>
```css
.outer >>> .inner{ }
```
* ::v-deep ( >>>的别名 )
```css
.outer{
  ::v-deep .inener{  }
}
```


* 在vue组件中使用两个style标签，一个加scoped属性，一个不加scoped属性，把需要覆盖的css样式写在不加scoped属性的style标签中



