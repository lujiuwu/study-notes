### Node高并发的原理

**Node的特点：** 事件驱动，非阻塞I/O，高并发

**原理**
Nodejs之所以单线程可以处理高并发的原因，得益于内部的`事件循环机制`和底层线程池实现

遇到异步任务，node将所有的阻塞操作都交给了`内部的线程池`去实现
本质上的异步操作还是由线程池完成的，主线程本身只负责不断的往返调度，从而实现异步非阻塞I/O，这便是node单线程和事件驱动的精髓之处

#### 整体流程

* 每个Node进程只有一个主线程在执行程序代码
* 当用户的网络请求、数据库操作、读取文件等其它的异步操作时，node都会把它放到`Event Queue（"事件队列"）`之中，此时并不会立即执行它，代码也不会被阻塞，继续往下走，直到主线程代码执行完毕
* 主线程代码执行完毕完成后，然后通过事件循环机制，依次取出对应的事件，从线程池中`分配一个对应的线程去执行`，当有事件执行完毕后，会通知主线程，主线程执行回调拿到对应的结果

#### Node事件循环机制与浏览器的区别

**主要区别**：
浏览器中的微任务是在每个相应的宏任务中执行的，而nodejs中的微任务是在不同阶段之间执行的

**Node事件循环的阶段**
`node事件循环机制分为6个阶段，它们会按照顺序反复运行`

> 主要讲解timer, poll, check 三个阶段，因为日常开发中的绝大部分异步任务都是在这 3 个阶段处理的
* timer -- `timers 阶段会执行 setTimeout 和 setInterval 回调，并且是由 poll 阶段控制的`
* I/O callbacks
* idel，prepare
* poll -- `这一阶段中，系统会做两件事情：回到 timer 阶段执行回调：执行 I/O 回调`
* check -- `setImmediate()的回调会被加入 check 队列中，从 event loop 的阶段图可以知道，check 阶段的执行顺序在 poll 阶段之后`
* close callbacks

### 中间件

> 比较流行的 Node.js框架有`Express`、`KOA` 和 `Egg.js`，都是基于中间件来实现的。中间件主要用于请求拦截和修改请求或响应结果

#### 中间件原理
**中间件本质**
* node中间件本质上就是在进入具体的业务处理之前，先让`特定过滤器`进行处理

**为什么需要中间件**
* 一次Http请求通常包含很多工作，如`请求体解析、Cookie处理、权限验证、参数验证、记录日志、ip过滤、异常处理`等
* 这些环节通过中间件处理，使得让开发人员把核心放在对应的业务开发上

**这种模式也被称为"洋葱圈模型"**

#### express常用的中间件

|中间件名称|作用|
|---|---|
|express.static()|用来返回静态文件|
|body-parser|用于解析post数据|
|multer|处理文件上传|
|cookie-parser|用来操作cookie|
|cookie-session|处理session|
### 实现一个大文件上传和端点传续

**关键知识点** -- **pip管道流**

**管道：** 一个程序的输出直接成为下一个程序的输入，就像水流过管道一样方便 `readStream.pipe(writeStream)` 就是在可读流与可写流中间加入一个管道，实现一边读取，一边写入，读一点写一点。

**管道流的好处：节约内存**

读出的数据，不做保存，直接流出。写入写出会极大的占用内存，stream可以边读边写，不占用太多内存，并且完成所需任务

### 接口防刷

**概念**
顾名思义，就是要实现某个接口在某段时间内只能让某人访问指定次数，超出次数，就不让访问了
主要防止短时间接口被大量调用（攻击），出现系统崩溃和系统爬虫问题，提升服务的可用性

**方法**
* 最简单的方法就是采用验证码，要求客户端在调用接口之前输入正确的验证码。验证码可以是图形或短信等形式。但是，这种解决方案并不够安全，因为在一定程度上，人工验证码可以被机器破解，同时，验证码也会增加用户的负担
* 第二种方法就是**采用令牌桶算法**。在这种解决方案中，每个客户端被分配一个令牌桶。向桶中添加令牌是根据令牌的访问频率和限制次数进行的。如果客户端请求超过了其令牌限制，则它将被拒绝访问
* 第三种方法是**定期更改接口密钥**，这种方法的原理是`将接口密钥（ApiKey）周期性地更新`，以确保所有客户端都使用最新版本的密钥。这种方法可以防止利用过期密钥进行恶意攻击
* 最后，我们还可以采用 **“人机验证”** 的方法，这种方法需要客户端在进行某个操作之前回答人机验证问题。这种测试通常以“填空题”或“多选题”等形式进行。这种方法可以有效降低机器攻击的风险，但仍然有一定的误判率



