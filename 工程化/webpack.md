## 什么是webpack

`webpack` 是一个现代 `JavaScript` 应用程序的静态模块打包器
当 `webpack` 处理应用程序时，会递归构建一个依赖关系图，其中包含应用程序需要的每个模块，然后将这些模块打包成一个或多个 `bundle`

* webpack 是前端的一个项目构建工具，它是基于 Node.js 开发出来的一个前端工具
* 它可以处理 js 之间互相依赖的关系和 js 的兼容问题

**bundle**
bundles 包含了早已经过加载和编译的`最终源文件版本`

## webpack的核心概念

- entry: 入口
- output: 输出
- loader: 模块转换器，用于把模块原内容按照需求转换成新内容
- 插件(plugins): 扩展插件，在webpack构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要做的事情

**作用**
把静态模块内容，压缩、转译、打包等（前端工程化）

- 把 less/sass 转成 css 代码
- 把 ES6+ 降级成 ES5 等
- 支持多种模块文件类型，多种模块标准语法

```js
//webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

   // mode 模式 -- development, production 或 none
   // 启用 webpack 内置在相应环境下的优化
   mode: 'development',

   // 关于入口： 指示 webpack 应该使用哪个模块，来作为构建其内部 依赖图(dependency graph)       的开始
   // 默认是 ./sre/index.js
   // 单个入口语法格式：entry: string | [string]
   // 多个入口 对象语法格式：entry:{entryChunkName:url,entryChunkName:url}
   entry: 'mySrc/index.js',

   // 关于输出：属性告诉 webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件
   // 默认是 ./dist/main.js
   output: {
     path: path.resolve(__dirname, 'dist'),
     fileName:'my-main-file.js'
   },

   module: {
    // loader:webpack 只能理解 JavaScript 和 JSON 文件，这是 webpack 开箱可用的自带能力
    // loader 让 webpack 能够去处理其他类型的文件
    // 并将它们转换为有效 模块，以供应用程序使用，以及被添加到依赖图中
    // rules数组定义如何处理特定类型的文件
    rules: [
       {
            // 必须配配置属性test -- 识别出哪些格式的文件会被转换
            test: /\.jsx?$/,

            // 必须配配置属性use -- 定义出在进行转换时，应该使用哪个 loader
            use: {
                // 配置loader
                loader: 'babel-loader',

                // options选项
                // 传递给 loader 的配置参数
                options: {
                    presets: ["@babel/preset-env"],
                    // 插件配置
                    plugins: [
                        [
                            "@babel/plugin-transform-runtime",
                            {
                                "corejs": 3
                            }
                        ]
                    ]
                }
            },
            // 排除特定文件或目录
            exclude: /node_modules/
            
            // 也可以使用 include 指定只处理某些目录
        }
    ]
  },

  // plugin插件
  // 插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' })
  ]
}
```

### 关于plugin

**作用：扩展webpack功能**

**工作原理：**

webpack 通过内部的事件流机制保证了插件的有序性，底层是利用`发布订阅模式`，webpack 在运行过程中会广播事件，插件只需要监听它所关心的事件，在特定的时机对资源做处理

#### 组成部分

1）Plugin 的本质是一个 `node 模块`，这个模块导出一个 JavaScript 类

2）它的原型上需要定义一个`apply` 的方法

3）通过`compiler`获取 webpack 内部的钩子，获取 webpack 打包过程中的各个阶段
    `钩子分为同步和异步的钩子，异步钩子必须执行对应的回调`

4）通过`compilation`操作 webpack 内部实例特定数据

5）功能完成后，执行 webpack 提供的 cb 回调

#### 使用自定义plugin

**webpack.config.js**
```js
const MyPlugin = require('./MyPlugin.js')
module.exports = {
  configureWebpack: {
    plugins: [new MyPlugin()]
  }
};
```

### 关于loader

**Loader 作用**

webpack 只能直接处理 js 格式的资源，任何非 js 文件都必须被对应的`loader`处理转换为 js 代码

#### 组成部分

loader 的本质是一个 `node`模块，该模块导出一个函数
函数接收`source(源文件)`，返回处理后的`source`

#### 执行顺序
相同优先级的 loader 链，执行顺序为：`从右到左，从下到上`

如`use: ['loader1', 'loader2', 'loader3']`，执行顺序为 `loader3 → loader2 → loader1`

#### 使用自定义loader

```js
const MyStyleLoader = require('./style-loader')
module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          // 对main.css文件使用MyStyleLoader处理
          test: /main.css/,
          loader: MyStyleLoader
        }
      ]
    }
  }
};

```

## webpack打包流程

1）webpack 从项目的`entry`入口文件开始递归分析，调用所有配置的 `loader`对模块进行编译

因为 webpack 默认只能识别 js 代码，所以如 css 文件、.vue 结尾的文件，必须要通过对应的 loader 解析成 js 代码后，webpack 才能识别

2）利用`babel(babylon)`将 js 代码转化为`ast抽象语法树`，然后通过`babel-traverse`对 ast 进行遍历

3）遍历的目的找到文件的`import引用节点`

因为现在我们引入文件都是通过 import 的方式引入，所以找到了 import 节点，就找到了文件的依赖关系

4）同时每个模块生成一个唯一的 id，并将解析过的`模块缓存`起来，如果其他地方也引入该模块，就无需重新解析，最后根据依赖关系生成依赖图谱

5）递归遍历所有依赖图谱的模块，组装成一个个包含多个模块的 `Chunk(块)`

6）最后将生成的文件输出到 `output` 的目录中

## webpack热更新

### 什么是热更新

> 热更新开发过程中`Hot Module Replacement`，简称`HMR`
> 是指代码发生变动后，webpack 会重新编译，编译后浏览器替换修改的模块，局部更新，无需刷新整个页面

**好处**：节省开发时间、提升开发体验

### 关于刷新

**刷新我们一般分为两种：**

- 一种是页面刷新，不保留页面状态，就是简单粗暴，直接`window.location.reload()`

- 另一种是基于`WDS (Webpack-dev-server)`的模块热替换，只需要局部刷新页面上发生变化的模块，同时可以保留当前的页面状态，比如复选框的选中状态、输入框的输入等。

`HMR`作为一个`Webpack`内置的功能，可以通过`HotModuleReplacementPlugin`或`--hot`开启。那么，`HMR`到底是怎么实现热更新的呢？下面让我们来了解一下吧！

### 热更新原理

主要是通过`websocket`实现，建立本地服务和浏览器的双向通信。当代码变化，重新编译后，通知浏览器请求更新的模块，替换原有的模块

1） 通过`webpack-dev-server`开启`server服务`，本地 server 启动之后，再去启动 websocket 服务，建立本地服务和浏览器的双向通信

2） webpack 每次编译后，会生成一个`Hash值`，Hash 代表每一次编译的标识。本次输出的 Hash 值会编译新生成的文件标识，被作为下次热更新的标识

3）webpack`监听文件变化`（主要是通过文件的生成时间判断是否有变化），当文件变化后，重新编译

4）编译结束后，通知浏览器请求变化的资源，同时将新生成的 hash 值传给浏览器，用于下次热更新使用

5）浏览器拿到更新后的模块后，用新模块替换掉旧的模块，从而实现了局部刷新

## webpack5 模块联邦

webpack5 `模块联邦(Module Federation)` 使 JavaScript 应用，得以从另一个 JavaScript 应用中动态的加载代码，实现共享依赖，用于**前端的微服务化**

比如`项目A`和`项目B`，公用`项目C`组件，以往这种情况，可以将 C 组件发布到 npm 上，然后 A 和 B 再具体引入。当 C 组件发生变化后，需要重新发布到 npm 上，A 和 B 也需要重新下载安装

使用模块联邦后，可以在远程模块的 Webpack 配置中，将 C 组件模块暴露出去，项目 A 和项目 B 就可以远程进行依赖引用。当 C 组件发生变化后，A 和 B 无需重新引用

模块联邦利用 webpack5 内置的`ModuleFederationPlugin`插件，实现了项目中间相互引用的按需热插拔


