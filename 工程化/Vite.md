### 工作原理

1）通过`koa`开启一个服务，获取请求的静态文件内容

2）通过`es-module-lexer` 解析 `ast` 拿到 import 的内容

3）判断 import 导入模块是否为`三方模块`，是的话，返回`node_module`下的模块， 如 `import vue` 返回 `import './@modules/vue'`

4）如果是`.vue文件`，vite 拦截对应的请求，读取.vue 文件内容进行编译，通过`compileTemplate` 编译模板，将`template转化为render函数`

5）通过 babel parse 对 js 进行编译，最终返回编译后的 js 文件
