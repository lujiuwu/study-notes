### 抽象语法树AST

> `AST`是源代码的抽象语法结构的树状表现形式
> **在 js 世界中，可以认为`抽象语法树(AST)是最底层`**

### Babel基本原理与作用

> `Babel` 是一个 `JS 编译器`，把我们的代码转成浏览器可以运行的代码

**作用**
babel 主要用于将新版本的代码转换为向后兼容的 js 语法(`Polyfill` 方式)，以便能够运行在各版本的浏览器或其他环境中

**基本原理**
* 核心就是 `AST (抽象语法树)`
* 首先将源码转成抽象语法树，然后对语法树进行处理生成新的语法树，最后将新语法树生成新的 JS 代码

**Babel流程**

**3 个阶段： parsing (解析)、transforming (转换)、generating (生成)**

1）通过`babylon`将 js 转化成 ast (抽象语法树)

2）通过`babel-traverse`是一个对 ast 进行遍历，使用 babel 插件转化成新的 ast

3）通过`babel-generator`将 ast 生成新的 js 代码





