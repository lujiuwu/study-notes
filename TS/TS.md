
## TS编程的好处

* TS引入了**静态类型检查**，可以在编译时捕获潜在的类型错误，从而减少运行时错误
* TS通过**类型注解**使代码更加**清晰易读**，提供了**更好的文档化和自我描述性**
* TS的类型系统可以**明确定义接口、参数和返回值的类型约束**，从而减少了团队成员之间的沟通成本，使得团队协作更加高效和准确
* TS是JavaScript的超集，这意味着可以将现有的JavaScript代码逐步迁移到TS中，而不需要一次性重写整个代码库；可以选择性地为现有代码添加类型注解，逐渐引入TS的好处，同时保留对现有代码的兼容性

**新增功能**
- 类型批注和编译时类型检查
- 类型推断
- 类型擦除
- 接口
- 枚举
- Mixin
- 泛型编程
- 名字空间
- 元组
- Await
## 类型

> **类型是人为添加的一种编程约束和用法提示**
> 主要目的是在软件开发过程中，为编译器和开发工具提供更多的验证和帮助，帮助提高代码质量，减少错误

* 在JS中就没有定义类型这个功能，不会检查类型对不对。开发阶段很可能发现不了这个问题，代码也许就会原样发布，导致用户在使用时遇到错误
```js
// js声明变量的方式
var a = 1
let b = 2
const c = 3
```

* 作为比较，TypeScript 是在开发阶段报错，这样有利于提早发现错误，避免使用时报错。另一方面，函数定义里面加入类型，具有提示作用，可以告诉开发者这个函数怎么用
```ts
var a:string = "str" // 赋值其他类型会报错
let b:string[] = ["str1","str2"]
const c:number = 1
```

### 动态类型与静态类型

#### 动态类型语言

前面说了，TypeScript 的主要功能是为 JavaScript 添加类型系统。大家可能知道，JavaScript 语言本身就有一套自己的类型系统，比如数值`123`和字符串`Hello`。

但是，JavaScript 的类型系统非常弱，而且没有使用限制，运算符可以接受各种类型的值。在语法上，JavaScript 属于**动态类型语言**。

请看下面的 JavaScript 代码。
```js
// 例一
let x = 1;
x = "hello";

// 例二
let y = { foo: 1 };
delete y.foo;
y.bar = 2;
```

**通过观察可以得到**
* 在JS中，变量的类型是可以改变的，即动态的
* 所以 JavaScript 的类型系统是动态的，不具有很强的约束性
* 这对于提前发现代码错误，非常不利

#### 静态类型语言

同样是上述代码，在TS中就会报错
因为在首次声明时TypeScript 已经`推断确定了类型`，后面就不允许再赋值为其他类型的值，即变量的类型是**静态的**。例二的报错是因为对象的属性也是静态的，不允许随意增删。

TypeScript 的作用，就是为 JavaScript 引入这种**静态类型特征**

##### 静态类型语言的特点

**优点**
* 有利于代码的静态分析
   `有了静态类型，不必运行代码就可以确定变量的类型，从而推断代码有没有错误。这就叫做代码的静态分析`
   `单单在开发阶段运行静态检查，就可以发现很多问题，避免交付有问题的代码，大大降低了线上风险`
* 有利于发现错误
   `由于每个值、每个变量、每个运算符都有严格的类型约束，TypeScript 就能轻松发现拼写错误`
  
* 更好的IDE支持，做到语法提示和自动补全

* 类型信息可以部分替代代码文档，解释应该如何使用这些代码，熟练的开发者往往只看类型，就能大致推断代码的作用。借助类型信息，很多工具能够直接生成文档

* 有助于代码重构

**缺点**
* 丧失了动态类型的代码灵活性
* 增加了编程工作量。
  `有了类型之后，程序员不仅需要编写功能，还需要编写类型声明，确保类型正确。这增加了不少工作量，有时会显著拖长项目的开发时间`
* 引入了独立的编译步骤，要将TS转为JS后才能运行
* 存在一定兼容性问题

## TS的基本用法

### 类型声明

> TypeScript 代码最明显的特征，就是为 JavaScript 变量加上了类型声明

* 基本类型
```ts
const num:number = 1
```

* 函数
```ts
function foo(str:string):string{
  return string+"1"
}
```

**TS不允许：**
* 在显式声明类型/推断出数据类型后再赋值其他类型
* 在给变量赋值前被读取

### 类型推断

> 类型声明并不是必需的，如果没有，TypeScript 会自己推断类型

```ts
const num = 1
```

**TypeScript 的设计思想**
* 类型声明是可选的，你可以加，也可以不加
* 即使不加类型声明依然是有效的 TypeScript 代码，只是这时不能保证 TypeScript 会正确推断出类型

由于这个原因，**所有 JavaScript 代码都是合法的 TypeScript 代码**。
这样设计还有一个好处，将以前的 JavaScript 项目改为 TypeScript 项目时，你可以逐步地为老代码添加类型，即使有些代码没有添加，也不会无法运行

### TS的编译

JavaScript 的运行环境（浏览器和 Node.js）不认识 TypeScript 代码，所以TypeScript 项目要想运行，必须先转为 JavaScript 代码，这个代码转换的过程就叫做 **“编译”（compile）**

TypeScript 官方`没有做运行环境，只提供编译器`。编译时，会将类型声明和类型相关的代码全部删除，只留下能运行的 JavaScript 代码，并且不会改变 JavaScript 的运行结果。

因此，TypeScript 的类型检查只是`编译时的类型检查`，而`不是运行时的类型检查`
一旦代码编译为 JavaScript，运行时就不再检查类型了

### 值与类型

> 学习 TypeScript 需要分清楚`“值”（value）`和`“类型”（type）`

**值和类型的关系**
“类型”是针对“值”的，可以视为是后者的一个元属性。每一个值在 TypeScript 里面都是有类型的。比如，`3`是一个值，它的类型是`number`

**TS中的值与类型**
* TypeScript 代码`只涉及类型，不涉及值`
* 所有跟“值”相关的处理，都由 JavaScript 完成。

* TypeScript 项目里面，其实存在两种代码，一种是底层的“值代码”，另一种是上层的“类型代码”。前者使用 JavaScript 语法，后者使用 TypeScript 的类型语法
* 它们是可以分离的：“TypeScript 的编译过程，实际上就是把“类型代码”全部拿掉，只保留“值代码”

编写 TypeScript 项目时，不要混淆哪些是值代码，哪些是类型代码。

## any 类型，unknown 类型，never 类型

### any类型

> any 类型表示**没有任何限制**，该类型的变量可以赋予**任意类型的值**

```ts
let arg:any = 1
arg = "str"
arg = true
arg = [1,2]
```

**关闭类型检查：**
变量类型一旦设为`any`，TypeScript 实际上会`关闭这个变量的类型检查`
即使有明显的类型错误，只要句法正确，都不会报错

```ts
let arg = 1
arg.foo = function(){console.log("foo")}
```

#### any的使用场景

> 因为any会避开TS的类型检查，我们应该避免使用
> 实际开发中，`any`类型主要适用以下两个场合

**需要避开TS的类型检查**
* 出于特殊原因，需要关闭某些变量的类型检查，就可以把该变量的类型设为`any`

**适配以前的JS代码**
* 为了适配以前老的 JavaScript 项目，让代码快速迁移到 TypeScript，可以把变量类型设为`any`
* 有些年代很久的大型 JavaScript 项目，尤其是别人的代码，很难为每一行适配正确的类型，这时你为那些类型复杂的变量加上`any`，TypeScript 编译时就不会报错

#### 顶层类型

从集合论的角度看，`any`类型可以看成是所有其他类型的全集，包含了一切可能的类型
TypeScript 将这种类型称为 **“顶层类型”（top type），意为涵盖了所有下层**


#### 类型判断问题

对于开发者没有指定类型、TypeScript 必须自己推断类型的那些变量，如果无法推断出类型，TypeScript 就会认为该变量的类型是`any`

**noImplicitAny**

TypeScript 提供了一个编译选项`noImplicitAny`，打开该选项，只要推断出`any`类型就会报错

```powershell
tsc --noImplicitAny app.ts
```

**特殊情况**
* 即使打开了`noImplicitAny`，使用`let`和`var`命令声明变量，但`不赋值也不指定类型`，是不会报错的
* 由于这个原因，建议使用`let`和`var`声明变量时，如果不赋值，就一定要显式声明类型，否则可能存在安全隐患

#### 污染问题 

> `any`类型除了关闭类型检查，还有一个很大的问题，就是它会“污染”其他变量
> 它可以赋值给其他任何类型的变量（因为没有类型检查），导致其他变量出错

TypeScript 也检查不出错误，问题就这样`留到运行时才会暴露`

```ts
let y:any = 1
let x:string = "str"

x = y // TS检查不出错误
y*12 // TS还是检查不错错误
```

### unknown类型

> 为了解决`any`类型“污染”其他变量的问题，TypeScript 3.0 引入了`unknown`类型
> 它与`any`含义相同，表示类型不确定，可能是任意类型，但是它的使用有一些限制，不像`any`那样自由，可以视为**严格版的any**

在集合论上，`unknown`也可以视为所有其他类型（除了`any`）的全集，所以它和`any`一样，也属于 TypeScript 的顶层类型。

#### unknown与any的不同

* `unknown`类型可以赋值为各种类型的值。这与`any`的行为一致
* 不同的地方在于：

**unknow类型不能直接赋值给其他类型的值**
```ts
let v: unknown = 123;

let v1: boolean = v; // 报错
let v2: number = v; // 报错
```

**不能直接调用unknown类型变量的方法和属性**
```ts
let v1: unknown = { foo: 123 };
v1.foo; // 报错

let v2: unknown = "hello";
v2.trim(); // 报错

let v3: unknown = (n = 0) => n + 1;
v3(); // 报错
```

**unknown类型变量能够进行的运算是有限的**
* 只能进行比较运算（运算符`==`、`===`、`!=`、`!==`、`||`、`&&`、`?`）、取反运算（运算符`!`）、`typeof`运算符和`instanceof`运算符这几种，其他运算都会报错

#### 怎样使用unknown类型

**类型缩小**
答案是只有经过“类型缩小”，`unknown`类型变量才可以使用。所谓“类型缩小”，就是缩小`unknown`变量的类型范围，确保不会出错

```ts
const num:unknown = 1
if(typeof num === "number") let a = num*2
```

### never类型

> 为了保持与集合论的对应关系，以及类型运算的完整性，TypeScript 还引入了`“空类型”`的概念
> 即该类型**为空，不包含任何值**

```ts
const num:never = 1
```

**使用场景**
* 主要是在一些类型运算之中，保证类型运算的完整性
* 不可能返回值的函数，返回值的类型就可以写成`never`

**never是TS的唯一底层类型**
* never类型可以赋值给任何类型，都不会报错

## 类型系统

> TypeScript 继承了 JavaScript 的类型，在这个基础上，定义了一套自己的类型系统

**继承JS的八大类型**
* String,Number,Boolean,Undefined,Null,Object,Symbol,BigInt
* 可以看做是TS是**基本类型**

### Object类型与object类型

TypeScript 的对象类型也有大写`Object`和小写`object`两种

#### Object类型

> 大写的`Object`类型代表 JavaScript 语言里面的广义对象
> 所有可以转成对象的值，都是`Object`类型，这囊括了几乎所有的值

```ts
let obj: Object;

obj = true;
obj = "hi";
obj = 1;
obj = { foo: 123 };
obj = [1, 2];
obj = (a: number) => a + 1;
```

上面示例中，原始类型值、对象、数组、函数都是合法的`Object`类型。

事实上，除了`undefined`和`null`这两个值不能转为对象，其他任何值都可以赋值给`Object`类型

**空对象{}**
另外，空对象`{}`是`Object`类型的简写形式，所以使用`Object`时常常用空对象代替
```ts
let obj:{}
```

#### object类型

> 小写的`object`类型代表 JavaScript 里面的狭义对象，即**可以用字面量表示的对象**
> 只包含**对象、数组和函数**，不包括原始类型的值

```ts
let obj: object;

obj = { foo: 123 };
obj = [1, 2];
obj = (a: number) => a + 1;
obj = true; // 报错
obj = "hi"; // 报错
obj = 1; // 报错
```

#### 对象的自定义方法和属性

> 注意，无论是大写的`Object`类型，还是小写的`object`类型，都只包含 JavaScript 内置对象原生的属性和方法
> **用户自定义的属性和方法都不存在于这两个类型之中，我们也无法直接访问使用**

```ts
const o1: Object = { foo: 0 };
const o2: object = { foo: 0 };

o1.toString(); // 正确
o1.foo; // 报错

o2.toString(); // 正确
o2.foo; // 报错
```

### 包装对象类型

JavaScript 的 8 种类型之中
* `undefined`和`null`其实是两个特殊值
* `object`属于复合类型
* 剩下的五种属于原始类型（primitive value），代表`最基本的、不可再分的`值
     - boolean
     - string
     - number
     - bigint
     - symbol

上面这五种原始类型的值，都有对应的包装对象（wrapper object）
所谓“包装对象”，指的是这些值在需要时，会自动产生的对象

* 除了Symbol( )和BigInt( )，剩下三种都可以作为构造函数使用
```ts
const str = new String("str")
// str就是字符str的包装对象
// typeof str 会返回object，但是本质上它还是字符串
const str1 = String("str1")
// 如果不使用new关键字，返回就是一个普通字符串
```
* Number( )与Boolean( )同理

#### 包装对象类型与字面量类型

> 由于包装对象的存在，导致每一个原始类型的值都有`包装对象和字面量两种情况`

```ts
"hello"; // 字面量
new String("hello"); // 包装对象
```

**为了区分两者，TS对五种原始类型分别提供了大小写两种类型**

- Boolean 和 boolean
- String 和 string
- Number 和 number
- BigInt 和 bigint
- Symbol 和 symbol

其中，大写类型同时包含包装对象和字面量两种情况，小写类型只包含字面量，不包含包装对象

```ts
const s1: String = "hello"; // 正确
const s2: String = new String("hello"); // 正确

const s3: string = "hello"; // 正确
const s4: string = new String("hello"); // 报错
```

### undefined与null的特殊性

> `undefined`和`null`既是值，又是类型

* 作为值，它们有一个特殊的地方：任何其他类型的变量都可以赋值为`undefined`或`null`
```ts
let age: number = 24;

age = null; // 正确
age = undefined; // 正确
```

**这样的设计目的**
任何类型的变量都可以赋值为`undefined`和`null`，以便跟 JavaScript 的行为保持一致

**strictNullCheck**
TypeScript 提供了一个编译选项`strictNullChecks`。只要打开这个选项，`undefined`和`null`就不能赋值给其他类型的变量（除了`any`类型和`unknown`类型）

```ts
// tsc --strictNullChecks app.ts

let age: number = 24;

age = null; // 报错
age = undefined; // 报错
```

```ts
let x: any = undefined;
let y: unknown = null; // 赋值给any&unknown类型是可以的
```

### 值类型

> TypeScript 规定，单个值也是一种类型，称为“值类型”

```ts
let x: "hello";

x = "hello"; // 正确
x = "world"; // 报错
```

上面示例中，变量`x`的类型是字符串`hello`，导致它只能赋值为这个字符串，赋值为其他字符串就会报错

**cosnt与值类型**
TypeScript 推断类型时，遇到`const`命令声明的变量，如果代码里面没有注明类型，就会推断该变量是值类型
```ts
// x 的类型是 "https"
const x = "https";

// y 的类型是 string
const y: string = "https";
```

上面示例中，变量`x`是`const`命令声明的，TypeScript 就会推断它的类型是值`https`而不是`string`类型
这样推断是合理的，因为`const`命令声明的变量，一旦声明就不能改变，相当于常量。值类型就意味着不能赋为其他值。

* **注意**，`const`命令声明的变量，如果赋值为对象，并不会推断为值类型
* 这是因为 JavaScript 里面，`const`变量赋值为对象时，属性值是可以改变的

### 联合类型

> 联合类型（union types）指的是多个类型组成的一个新类型，使用符号`|`表示
> 联合类型`A|B`表示，任何一个类型只要属于`A`或`B`，就属于联合类型`A|B`

联合类型可以与值类型相结合，表示一个变量的值有若干种可能

```ts
let arg = "1"|"2"
```

### 交叉类型

> 交叉类型（intersection types）指的多个类型组成的一个新类型，使用符号`&`表示
> 交叉类型`A&B`表示，任何一个类型必须同时属于`A`和`B`，才属于交叉类型`A&B`，即交叉类型同时满足`A`和`B`的特征

**运用场景**
* TS的基本数据类型都是互不相同的，所以对于多个基本类型，该类型最后会成为**never**
* 交叉类型的主要用途是表示**对象的合成**；常常用来为对象类型添加新属性
```ts
let obj: { foo: string } & { bar: string };

obj = {
  foo: "hello",
  bar: "world",
};
```

### type命令 -- 属于类型代码

> `type`命令用来定义一个类型的别名；由于属于类型代码，编译成 JavaScript 的时候，会被全部删除

```ts
type Age = number;

let age: Age = 55;
```

**好处：**
* 上面示例中，`type`命令为`number`类型定义了一个别名`Age`。这样就能像使用`number`一样，使用`Age`作为类型
* 别名可以让类型的名字变得更有意义，也能增加代码的可读性，还可以使复杂类型用起来更方便，便于以后修改变量的类型。

**注意：**
* 别名的作用域是块级作用域。这意味着，代码块内部定义的别名，影响不到外部
* 可以说**同一个块级作用域下的别名不允许重名**
```ts
type Colo = number
if(..){
  type Color = string
  // 这种情况是允许的
}
```

* 别名支持使用表达式，也可以在定义一个别名时，使用另一个别名，即别名**允许嵌套**
```ts
type hello = "hello" // 使用字符串表达式
type world = `${hello} world` // 别名嵌套
```

### typeof运算符

* TypeScript 将`typeof`运算符移植到了类型运算
* 它的操作数依然是一个值，但是返回的不是字符串，而是`该值的 TypeScript 类型`

**对于以下代码**
```ts
const a = { x: 0 };

type T0 = typeof a; // { x: number }
type T1 = typeof a.x; // number
```

* 这种用法的`typeof`返回的是 TypeScript 类型
* 所以只能用在类型运算之中（即跟类型相关的代码之中），不能用在值运算

**注意点**
* 由于编译时不会进行 JavaScript 的值运算，所以 TypeScript 规定，typeof 的参数只能是标识符，不能是需要运算的表达式
* typeof命令的参数也不能是类型

### 块级类型声明

> TypeScript 支持块级类型声明，即类型可以声明在代码块（用大括号表示）里面，并且只在当前代码块有效

```ts
if (true) {
  type T = number;
  let v: T = 5;
} else {
  type T = string;
  let v: T = "hello";
}
```

### 类型的兼容

> TypeScript 的类型存在兼容关系，某些类型可以兼容其他类型

```ts
type T = number | string;

let a: number = 1;
let b: T = a;
```

#### 子类

> TypeScript 为这种情况定义了一个专门术语
> 如果类型`A`的值可以赋值给类型`B`，那么类型`A`就称为类型`B`的子类型（subtype）
> 在上例中，类型`number`就是类型`number|string`的子类型

TypeScript 的一个规则是，凡是可以使用父类型的地方，都可以使用子类型，但是反过来不行

```ts
let a: "hi" = "hi";
let b: string = "hello";

b = a; // 正确
a = b; // 报错
```

## 数组

>JS数组在 TypeScript 里面分成两种类型，分别是数组（array）和元组（tuple）

### TS的数组

> TypeScript 数组有一个根本特征：所有成员的**类型必须相同**，但是成员**数量是不确定的**，可以是无限数量的成员，也可以是零成员

#### 数组的定义

```ts
// 第一种写法 -- 字面量 与JS类似
const arr:number[] = [1,2,3]
const arr:(number|string)[] = [1,1,1]
// 这个例子里面的圆括号是必须的
// 否则因为竖杠`|`的优先级低于`[]`
// TypeScript 会把`number|string[]`理解成`number`和`string[]`的联合类型
const arr:any[] = [1,2,3]

// 第二种写法 -- 使用 TypeScript 内置的 Array 接口
const arr:Array<number> = [1,2,3]
const arr:Array<number|string> = [1,2,3]
```

**注意**
* 因为成员数量可以变化，所以 TypeScript 不会对数组边界进行检查，越界访问数组并不会报错

#### 数组的类型推断

> 如果数组变量没有声明类型，TypeScript 就会推断数组成员的类型。这时，推断行为会因为值的不同，而有所不同；**TS会自动更新类型推断**

```ts
const arr = [];
arr; // 推断为 any[]

arr.push(123);
arr; // 推断类型为 number[]

arr.push("abc");
arr; // 推断类型为 (string|number)[]
```

但是，类型推断的自动更新只发生初始值为空数组的情况。如果初始值不是空数组，类型推断就不会更新

```ts
// 推断类型为 number[]
const arr = [123];

arr.push("abc"); // 报错
```

#### 只读数组 const断言

> JavaScript 规定，`const`命令声明的数组变量是可以改变成员的
> 但是，很多时候确实有声明为只读数组的需求，即不允许变动数组成员。

TypeScript 允许声明**只读数组**，方法是在数组类型前面加上`readonly`关键字

```ts
const arr: readonly number[] = [0, 1];

arr[1] = 2; // 报错
arr.push(3); // 报错
delete arr[0]; // 报错
```

**只读数组与数组的关系**
* TypeScript 将`readonly number[]`与`number[]`视为两种不一样的类型，后者是前者的子类型。

* 这是因为只读数组没有`pop()`、`push()`之类会改变原数组的方法，所以`number[]`的方法数量要多于`readonly number[]`，这意味着`number[]`其实是`readonly number[]`的子类型

### TS的元组

> 元组（tuple）是 TypeScript 特有的数据类型，JavaScript 没有单独区分这种类型。它表示成员类型可以自由设置的数组，即数组的各个成员的类型可以不同。

**元组必须明确声明每个成员的类型**

```ts
const s: [string, string, boolean] = ["a", "b", true];
```

**区分数组与元组**
* 成员类型写在方括号里面的就是元组
* 写在外面的就是数组

**注意**
* 使用元组时，必须明确给出类型声明（上例的`[number]`），不能省略，否则 TypeScript 会把一个值自动推断为数组
```ts
// a 的类型为 (number | boolean)[]
let a = [1, true];
```
如上述代码，如果没有显式声明元组类型，则会被TS判定为一个(number|string)[]的数组

#### 尾部元素的问号后缀

> 元组成员的类型可以添加问号后缀（`?`），表示该成员是可选的

注意，问号只能用于元组的尾部成员，也就是说，所有可选成员必须在必选成员之后

```ts
const tur:[string,number,boolean?] = ["str",123]
// 这样的话，末尾不添加一个布尔值也是可以的
const tur:[string,number,boolean?,string?] = ["str",123]
```

#### 元组越界

> 由于需要声明每个成员的类型，所以大多数情况下，元组的成员数量是有限的
> 从类型声明就可以明确知道，元组包含多少个成员，**越界的成员会报错**

```ts
let x: [string, string] = ["a", "b"];

x[2] = "c"; // 报错
```

#### 元组与扩展与运算符

> 使用扩展运算符（`...`），可以表示不限成员数量的元组

```ts
type NamedNums = [string, ...number[]];

const a: NamedNums = ["A", 1, 2];
const b: NamedNums = ["B", 1, 2, 3];
```

**扩展运算符在任何位置都可以，但它后面只能是元组或者数组**
```ts
type t1 = [string, number, ...boolean[]];
type t2 = [string, ...boolean[], number];
type t3 = [...boolean[], string, number];
```

**如果不确定元组的元素类型与数量，可以这样写：**
```ts
type Tuple = [...any[]];
const t1:[Tuple] = [1,2,3]
```

#### 只读元组

> 元组也可以是只读的，不允许修改，有两种写法

```ts
// 写法一
type t = readonly [number, string];

// 写法二
type t = Readonly<[number, string]>;
```

## 函数

> 函数的类型声明，需要在声明函数时，给出参数的类型和返回值的类型

* 返回值的类型通常可以不写，因为 TypeScript 自己会推断出来
* 类型的参数名是必须写的，不然TypeScript 会理解成函数有一个名叫 string 的参数

```ts
function foo(x:number,y:number):number{
  return x+y;
}
```

**变量被赋值为函数的写法**
```ts
// 写法一
const hello = function (txt: string) {
  console.log("hello " + txt);
};

// 写法二
const hello: (txt: string) => void = function (txt) {
  console.log("hello " + txt);
};
// (txt:string)=>void 是hello的类型
```

**对于第二种写法：**
* 如果函数的类型定义很冗长，或者多个函数使用同一种类型，写法二用起来就很麻烦
* 因此，我们往往用`type`命令为函数类型定义一个别名，便于指定给其他变量
```ts
type foo_type = (txt:stirng)=>void
const foo:foo_type = (txt){
  console.log("txt")
}
```

**type的使用技巧**
* 除了上述方法
* 还可以使用`type`套用一个定义的函数获取其类型
```ts
function foo(x:number,y:number):void{
  console.log(x+y)
}

const foo2:typeof foo(x,y){
  console.log(x*y)
}
```

**函数类型的对象**

* 格式
```ts
{
  (参数列表): 返回值
}
```

* 实例
```ts
let add: {
  (x: number, y: number): number;
};

add = function (x, y) {
  return x + y;
};
```

### 关于参数

#### 参数数量
* **函数类型里面的参数名与实际参数名可以不一致**

#### 参数省略
* **参数省略**：函数的实际参数个数，可以少于类型指定的参数个数，但是不能多于
  `这是因为 JavaScript 函数在声明时往往有多余的参数，实际使用时可以只传入一部分参数`
```ts
let myFunc: (a: number, b: number) => number;

myFunc = (a: number) => a; // 正确

myFunc = (a: number, b: number, c: number) => a + b + c; // 报错
```

#### 可选参数

> 如果函数的某个参数可以省略，则在参数名后面加问号表示

```ts
function f(x?: number) {
  // ...
}

f(); // OK
f(10); // OK
```

**注意**
* 参数名带有问号，表示该参数的类型实际上是`原始类型|undefined`，它有可能为`undefined`
如，上例的`x`虽然类型声明为`number`，但是实际上是`number|undefined`

* 函数的可选参数只能在参数列表的尾部，跟在必选参数的后面

#### 参数默认值

> TS给参数设置默认值的方法和JS一样

```ts
const foo = function(name:string = "name"):void{
  console.log(name)
}
```

**注意**
* 可选参数与默认值不能同时使用
* 设有默认值的参数，如果传入`undefined`，也会触发默认值
* 具有默认值的参数如果不位于参数列表的末尾，调用时不能省略，如果要触发默认值，必须显式传入`undefined`
```ts
function add(x: number = 0, y: number) {
  return x + y;
}

add(1); // 报错
add(undefined, 1); // 正确
```

#### 参数解构

```ts
function f([x, y]: [number, number]) {
  // ...
}

function sum({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c);
}
```

#### 剩余参数

> rest 参数表示函数剩余的所有参数
> 它可以是数组（剩余参数类型相同），也可能是元组（剩余参数类型不同）

```ts
// rest 参数为数组
function joinNumbers(...nums: number[]) {
  // ...
}

// rest 参数为元组
function f(...args: [boolean, number]) {
  // ...
}
```

#### 只读参数 readonly

> 如果函数内部不能修改某个参数，可以在函数定义时，在参数类型前面加上`readonly`关键字，表示这是只读参数

```ts
function arraySum(arr: readonly number[]) {
  // ...
  arr[0] = 0; // 报错
}
```


### Function类型

> TypeScript 提供 Function 类型表示函数，任何函数都属于这个类型

```ts
function doSomething(f: Function) {
  return f(1, 2, 3);
}
```

* Function 类型的值都可以直接执行
* Function 类型的函数可以接受`任意数量的参数`，每个参数的类型都是`any`，返回值的类型也是`any`，代表没有任何约束，所以`不建议使用这个类型，给出函数详细的类型声明会更好`

### 箭头函数

```ts
const foo = (name:string):void=>console.log("name"+name)
```

### 函数重载

> 些函数可以接受不同类型或不同个数的参数，并且根据参数的不同，会有不同的函数行为。这种根据参数类型不同，执行不同逻辑的行为，称为函数重载（function overload）

**如何实现**
* TypeScript 对于“函数重载”的类型声明方法是，逐一定义每一种情况的类型
```ts
function reverse(str: string): string;
function reverse(arr: any[]): any[];
function reverse(stringOrArray: string | any[]): string | any[] {
  if (typeof stringOrArray === "string")
    return stringOrArray.split("").reverse().join("");
  else return stringOrArray.slice().reverse();
}
```

## 对象

### 定义对象

```ts
// 第一种方式
const obj: {
  x: number;
  y: number;
} = { x: 1, y: 1 };

```

* **属性类型可以用分号结尾，也可以用逗号结尾**

```ts
const obj: {
  name: string,
  age: number;
} = {
  name:"name",
  age:12
}
```

* 不能访问不存在的属性；不能删除存在的属性，可以修改存在的属性

*  `type`命令可以为对象类型声明一个别名
```ts
type MyObj = {
  x:string,
  y:number
}

const obj:MyObj = {x:"x",y:1}
```

### 可选属性

> 如果某个属性是可选的（即可以忽略），需要在属性名后面加一个问号

```ts
const obj: {
  x: number;
  y?: number;
} = { x: 1 };
```

* 可选属性等同于允许赋值为`undefined`，下面两种写法是等效的
```ts
type User = {
  firstName: string;
  lastName?: string;
};

// 等同于
type User = {
  firstName: string;
  lastName: string | undefined;
};
```

### 只读属性

* readonly关键字
```ts
const obj = {
  readonly name:number
}
```

* 断言 -- 只读对象，所有属性都处于只读状态
```ts
const myUser = {
  name: "Sabrina",
} as const;

myUser.name = "Cynthia"; // 报错
```

**但是**
如果变量明确地声明了类型，那么 TypeScript 会以声明的类型为准

```ts
const myUser: { name: string } = {
  name: "Sabrina",
} as const;

myUser.name = "Cynthia"; // 正确
```
上面示例中，根据变量`myUser`的类型声明，`name`不是只读属性，但是赋值时又使用只读断言`as const`。这时会以声明的类型为准，因为`name`属性可以修改

### 属性名的索引类型

> 如果对象的属性非常多，一个个声明类型就很麻烦
> 而且有些时候，无法事前知道对象会有多少属性，比如外部 API 返回的对象
> 这时 TypeScript 允许采用 `属性名表达式的写法来描述类型`，称为 `“属性名的索引类型”`

* 最常见的就是字符串索引
  `也就是说，不管这个对象有多少属性，只要属性名为字符串，且属性值也是字符串，就符合这个类型声明`
```ts
type MyObj = {
  [property: string]: string;
};

const obj: MyObj = {
  foo: "a",
  bar: "b",
  baz: "c",
};
```

### 解构赋值

> 解构赋值用于直接从对象中提取属性。

```ts
const { id:new_id_name, name, price } = product;
// 这里的冒号不能定义类型，只能作为解构而出的值的新名字
```

### 结构类型原则

> 只要对象 B 满足 对象 A 的结构特征，TypeScript 就认为对象 B `兼容`对象 A 的类型，这称为“结构类型”原则（structual typing）

```ts
const a = {
  name:string
}

const b = {
  name:string,
  age:string
}
```

上面示例中，对象`A`只有一个属性`x`，类型为`string`
对象`B`满足这个特征，因此兼容对象`A`，只要可以使用`A`的地方，就可以使用`B`

### 严格字面量检查

* 如果字面量的结构跟类型定义的不一样（比如多出了未定义的属性），就会报错
* 这样可以预防一些JS中无法发现的命名错误

### 最小可选属性规则

```ts
type Obj_type = {
  a?:string,
  b?:number
}
```

上面示例中，类型`Obj_type`是一个对象，它的所有属性都是可选的，这导致任何对象实际都符合`Options`类型。

为了避免这种情况，TypeScript 添加了最小可选属性规则
* 规定这时属于`Obj_type`类型的对象，必须**至少存在一个可选属性**

```ts
const obj1:Obj_type = {
  d:"str"
} // 报错

const obj2:Obj_type = {
  d:"str",
  a:"str1"
} // 正确
```

### 空对象
空对象是 TypeScript 的一种**特殊值**，也是一种**特殊类型**

* 在JS中 `先定义空对象再添加值是可以的`
```js
const obj = {}
obj.name = "name"
```
* 在TS中 上述代码则会报错
  `因为TS中的操作等同于：`
```ts
const obj:{} = {}
```

* 空对象没有自定义属性，所以对自定义属性赋值就会报错
* 空对象只能使用继承的属性，即继承自原型对象`Object.prototype`的属性

### 分布声明对象

> 根据上述内容，我们可以得知**对象不能分步生成，必须生成时一次性声明所有属性**

**如果想要实现分布声明呢？ -- 扩展运算符**
```ts
const obj1 = {name:"name"}
const obj2 = {age:12}

const obj3 = {...obj1,...obj2}
```

## 接口interface

> interface 是对象的模板，可以看作是一种类型约定，中文译为“接口”
> 使用了某个模板的对象，就拥有了**指定的类型结构**

**使用interface关键字定义**

```ts
interface Person {
  firstName: string;
  lastName: string;
  age: number;
}
```

**实现接口**
* 任何实现这个接口的对象，都必须部署这三个属性，并且必须符合规定的类型
* 实现该接口很简单，只要指定它作为对象的类型即可
```ts
const obj:Person = {
  firstName:"name1",
  lastName:"name2",
  age:12
}
```

### 接口的成员

> interface 可以表示对象的各种语法，它的成员有 5 种形式。

- 对象属性
- 对象的属性索引
- 对象方法
- 函数
- 构造函数

```ts
interface MyInterface = {
  // 普通属性
  name1:string,
  // 可选属性
  name2?:string,
  // 只读属性
  readonly name3:string,
  // 对象的属性索引 -- 只能定义一个，约束所有符合的键值对
  [prop:string]:string,
  // 这意味着所有属性名为字符串的属性，其值都必须是字符串

  // 对象方法
  // 1. 写法一
  foo:(x:string):void,
  // 2. 写法二
  foo1:(x:string)=>string,
  // 3. 写法三
  f:{(x:string),string}
}
// 声明单独的函数
interface MyInterface1 = {
  (x:number,y:number):number
}
// 构造函数
interface MyInterface2 = {
  new (x:number,y:number):number
}
```

### interface的继承

interface 可以继承其他类型，主要有下面几种情况
使用关键字`extends`

#### interface继承interface

> `extends`关键字会从继承的接口里面拷贝属性类型，这样就不必书写重复的属性
##### 继承类型 -- 单继承&多继承
* **单继承**
```ts
interface Car{
  type:string
}

interface RedCar extends Car{
  color:string
}
```

* **多继承**
  `多重接口继承，实际上相当于多个父接口的合并`
```ts
interface Car1{
  type:string
}
interface Car2{
  number:string
}

interface BlueCar extends Car1,Car2 {
  color:string
}
```

##### 多继承的冲突问题

* 如果子接口与父接口存在同名属性，那么子接口的属性会覆盖父接口的属性
* 子接口与父接口的同名属性必须是类型兼容的，不能有冲突，否则会报错
* 多重继承时，如果多个父接口存在同名属性，那么这些同名属性不能有类型冲突，否则会报错

#### interface继承type

**注意：**
注意，如果`type`命令定义的类型不是对象，interface 就无法继承

```ts
type Country = {
  name: string;
  capital: string;
};

interface CountryWithPop extends Country {
  population: number;
}
```

#### interface继承class

> interface 还可以继承 class，即继承该类的所有成员

```ts
class A {
  x: string = "";

  y(): boolean {
    return true;
  }
}

interface B extends A {
  z: number;
}
```

### 接口合并

> 重复定义接口，多个同名接口会合并为一个接口

```ts
interface Car {
  number:string
}
interface Car {
  color:string
}
```

**这样设计的原因**
这样的设计主要是为了`兼容 JavaScript 的行为`。JavaScript 开发者常常对全局对象或者外部库，添加自己的属性和方法。那么，只要使用 interface 给出这些自定义属性和方法的类型，就能自动跟原始的 interface 合并，使得扩展外部类型非常方便

**同一个属性如果有多个类型声明，彼此不能有类型冲突**


### interface与type

`interface`命令与`type`命令作用类似，都可以表示对象类型。

很多对象类型即可以用 interface 表示，也可以用 type 表示。而且，两者往往可以换用，几乎所有的 interface 命令都可以改写为 type 命令。

它们的相似之处，首先表现在都能**为对象类型起名**

interface 与 type 的区别有下面几点。

（1）`type`能够表示非对象类型，而`interface`只能表示对象类型（包括数组、函数等）。

（2）`interface`可以继承其他类型，`type`不支持继承。

（3）同名`interface`会自动合并，同名`type`则会报错。也就是说，TypeScript 不允许使用`type`多次定义同一个类型

（4）`interface`不能包含属性映射（mapping），`type`可以

（5）`this`关键字只能用于`interface`

（6）type 可以扩展原始数据类型，interface 不行

（7）`interface`无法表达某些复杂类型（比如交叉类型和联合类型），但是`type`可以

## class类

> 类（class）是面向对象编程的基本构件，封装了属性和方法，TypeScript 给予了全面支持


### Class的类型

#### 实例类型

> TypeScript 的类本身就是一种类型，但是它代表该类的实例类型，而不是 class 的自身类型

```ts
class Color {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

const green: Color = new Color("green");
```

#### 泛型类

```ts
class Box<Type> {
  contents: Type;

  constructor(value: Type) {
    this.contents = value;
  }
}

const b: Box<string> = new Box("hello!");
```
### 属性与方法

* 类的属性可以在顶层声明，也可以在构造方法内部声明
* 对于顶层声明的属性，可以在声明时同时给出类型

#### 属性
##### 顶层声明

```ts
class Person{
  name:string
  age:number = 1 // 可以同时初始化
  num!:number // 使用非空断言，告诉TS这个值一定不会为空
  readonly id: string = "foo" // 只读属性
  constructor(){
    // 对于类的只读属性，构造函数中可以修改值
    this.id = "id" // 这样不会报错
    
    //以构造方法为准。在其他方法修改只读属性都会报错
  
  }
}
```

##### 构造函数声明

> 在构造函数中声明属性，必须使用TS的修饰符：`public , private , protected / readonly`

```ts
class Person1 {
  constructor(public id:string) {
  }
}
```

#### 方法类型

> 类的方法就是普通函数，类型声明方式与函数一致

```ts
class Person{
  name:string
  constructor(name){
    this.name = name
  }
  getName():string{
    return this.name
  }
}
```

##### 存取器方法

> 存取器（accessor）是特殊的类方法，包括取值器（getter）和存值器（setter）两种方法
> 它们用于读写某个属性，取值器用来读取属性，存值器用来写入属性

```ts
class C {
  _name = "";
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
}
```

**TS对于存取器的方法**
* 如果某个属性只有`get`方法，没有`set`方法，那么该属性自动成为只读属性
* `set`方法的参数类型，必须兼容`get`方法的返回值类型，否则报错
* `get`方法与`set`方法的可访问性必须一致，要么都为公开方法，要么都为私有方法

#### 可访问修饰符，静态，抽象

##### 修饰符 -- public private protected

> 与JAVA类似，TS中有限制属性访问权限的修饰符

* **public** -- 公开访问
* **private** -- 不可访问，类的实例和子类都不能使用该成员
* **protected** -- 只能在类的内部使用该成员，实例无法使用该成员，但是子类内部可以使用

##### 静态 -- static

> 类的内部可以使用`static`关键字，定义静态成员。

静态成员是只能通过类本身使用的成员，不能通过实例对象使用

```ts
class MyClass {
  static x = 0;
  static printX() {
    console.log(MyClass.x);
  }
}
MyClass.x; // 0
MyClass.printX(); // 0
```

* 静态成员也可以用访问修饰符修饰

```ts
class Person{
  private static blood = "AB"
  // 这种写法等同于：
  static #blood = "AB"
}
```
##### 抽象 -- abstract

> TypeScript 允许在类的定义前面，加上关键字`abstract`，表示该类不能被实例化，只能当作其他类的模板。这种类就叫做“抽象类”（abastract class

* 抽象类只能当做基类，用来在它的基础上定义子类
* 抽象类的子类也可以是抽象类，也就是说，**抽象类可以继承其他抽象类**
* 抽象成员只能存在于抽象类，不能存在于普通类
* 抽象成员不能有具体实现的代码。也就是说，已经实现好的成员前面不能加`abstract`关键字
* 一个子类最多只能继承一个抽象类
* 抽象成员前也不能有`private`修饰符，否则无法在子类中实现该成员


```ts
abstract class A {
  id = 1;
}

class B extends A {
  amount = 100;
}

const b = new B();

b.id; // 1
b.amount; // 100
```




### 类与interface接口

interface 接口或 type 别名，可以用对象的形式，为 class 指定一组检查条件。然后，类使用 implements 关键字，表示当前类满足这些外部类型条件的限制

#### 类实现接口

```ts
interface Country {
  name: string;
  capital: string;
}
// 或者
type Country = {
  name: string;
  capital: string;
};

class MyCountry implements Country {
  name = "";
  capital = "";
}
```

**注意**
* interface 只是指定检查条件，如果不满足这些条件就会报错
* 它并不能代替 class 自身的类型声明
* 类可以定义接口没有声明的方法和属性

#### 类作为接口

> `implements`关键字后面，不仅可以是接口，也可以是另一个类。这时，后面的类将被当作接口

```ts
class Car {
  id: number = 1;
  move(): void {}
}

class MyCar implements Car {
  id = 2; // 不可省略
  move(): void {} // 不可省略
}
```

* 当类作为接口时，要求`MyCar`实现`Car`里面的每一个属性和方法，否则就会报错。所以，这时不能因为`Car`类已经实现过一次，而在`MyCar`类省略属性或方法

#### 类与接口同名

TypeScript 不允许两个同名的类，但是如果一个类和一个接口同名，那么接口会被合并进类。

```ts
class A {
  x: number = 1;
}

interface A {
  y: number;
}

let a = new A();
a.y = 10;

a.x; // 1
a.y; // 10
```

### 类的继承

> 类（这里又称“子类”）可以使用 extends 关键字继承另一个类（这里又称“基类”）的所有属性和方法

```ts
class A {
  greet() {
    console.log("Hello, world!");
  }
}

class B extends A {}

const b = new B();
b.greet(); // "Hello, world!"
```

* 子类可以覆盖基类的同名方法
* 子类可以使用`super`关键字调用基类的方法
```ts
class Person{
  getName(){}
}

class Student{
  getName(){
    super.getName()
  
  }
}
```

* 但是，子类的同名方法不能与基类的类型定义相冲突
```ts
class Person{
  getName():void{}
}

class Student{
  // 这样是冲突的
  getName():string{
    super.getName()
  
  }
}
```

* 如果基类包括保护成员（`protected`修饰符），子类可以将该成员的可访问性设置为公开（`public`修饰符），也可以保持保护成员不变，但是不能改用私有成员（`private`修饰符）

* 注意，`extends`关键字后面不一定是类名，可以是一个表达式，只要它的类型是构造函数就可以了



### 类的this

> 类的方法经常用到`this`关键字，它表示该方法当前所在的对象


## 泛型

> 有些时候，函数返回值的类型与参数类型是相关的

```ts
function getFirst(arr) {
  return arr[0];
}
```
上面示例中，函数`getFirst()`总是返回参数数组的第一个成员。参数数组是什么类型，返回值就是什么类型

**为了反映出这种关联 -- TS引入了一个概念**
* 泛型
* 泛型的特点就是带有“类型参数”
```ts
function getFirst<T>(arr: T[]): T {
  return arr[0];
}
```

上面示例中，函数`getFirst()`的函数名后面尖括号的部分`<T>`，就是类型参数
参数要放在一对尖括号（`<>`）里面
本例只有一个类型参数`T`，可以将其理解为类型声明需要的变量，需要在`调用时传入具体`的参数类型

**调用函数时，也需要通过尖括号来传递类型**
```ts
// 单个类型
getFirst<number>([1,2,3])
// 联合类型
gerFirst<number|string>([1,2])
```


### 泛型的写法

> 泛型主要用在四个场合：函数、接口、类和别名

#### 函数的泛型写法

* 普通函数
```ts
function foo<T>(arr:T,arr2:T):T{
  return arr[0]+arr2[1]
}
```
* 变量形式的函数
```ts
const foo:<T>(arr:T)=>T=id
```


#### 接口的泛型写法

```ts
interface Comparator<T> {
  compareTo(value: T): number;
}

class Rectangle implements Comparator<Rectangle> {
  compareTo(value: Rectangle): number {
    // ...
  }
}
```

#### 类的泛型写法

```ts
class Pair<K, V> {
  key: K;
  value: V;
}
```

#### 别名的泛型写法

```ts
type Nullable<T> = T | undefined | null;
```

#### 数组的泛型表示

> 《数组》一章提到过，数组类型有一种表示方法是`Array<T>`\
> 这就是泛型的写法
`Array`是 TypeScript 原生的一个泛型接口，`T`是它的类型参数。声明数组时，需要提供`T`的值

```ts
const arr = Array<number> = [1,2,3]
```
### 泛型默认值

> 在使用泛型的地方，可以设置一个类型的默认值

```ts
function<T=string>(str:T):T{
  return T+1
}
```

```ts
class Person<T=string,V=number>{
  name:T,
  age:V
}
```

**关于顺序**
* 一旦类型参数有默认值，就表示它是可选参数
* 如果有多个类型参数，可选参数必须在必选参数之后
```ts
<T = boolean, U> // 错误

<T, U = boolean> // 正确
```

### 泛型参数的约束条件

> 很多类型参数并不是无限制的，对于传入的类型存在约束条件


**实例**
```ts
function <T>getSum(arg1:T,arg2:T):T{
  if(arg1<arg2) return arg1-arg2
  else return arg2-arg1
}
```

**新语法**
* TypeScript 提供了一种语法，允许在类型参数上面写明约束条件
* 如果不满足条件，编译时就会报错。这样也可以有良好的语义，对类型参数进行说明
```ts
function comp<T extends { length: number }>(a: T, b: T) {
  if (a.length >= b.length) {
    return a;
  }
  return b;
}
```

**约束条件的语法格式：**
```ts
<TypeParameter extends ConstraintType>
```

类型参数可以同时设置约束条件和默认值，前提是默认值必须满足约束条件

## Enum 枚举类型

> 在实际开发中，经常需要定义一组相关的常量
> TypeScript 就设计了 Enum 结构，用来将相关常量放在一个容器里面，方便使用。

```ts
const Red = "red"
const Blue = "blue"
enum Color = {
  Red,
  Blue
}
```

### 编译后的Enum

* Enum 结构的特别之处在于，它既是一种类型，也是一个值
* 绝大多数 TypeScript 语法都是类型语法，编译后会全部去除
* 但是 Enum 结构是一个值，**编译后会变成 JavaScript 对象**，留在代码中

```ts
// 编译前
enum Color {
  Red, // 0
  Green, // 1
  Blue, // 2
}

// 编译后
let Color = {
  Red: 0,
  Green: 1,
  Blue: 2,
};
```

### Enum的使用

* 由于 TypeScript 的定位是 JavaScript 语言的类型增强，所以官方建议谨慎使用 Enum 结构，因为它不仅仅是类型，还会为编译后的代码加入一个对象。

Enum 结构比较适合的场景是，`成员的值不重要，名字更重要`，从而增加代码的`可读性和可维护性`

#### Enum成员的值

* Enum 成员默认不必赋值，系统会从零开始逐一递增，按照顺序为每个成员赋值，比如 0、1、2……
* 但是，也可以为 Enum 成员显式赋值
```ts
enum Color{
  Red = 0,
  Blue = 1
}
```

**注意**
* 成员的值可以是任意数值（整数/小数），但不能是大整数（Bigint）
* 成员的值也可以相同
* 成员的值也可以使用计算式

#### Enum与const

* Enum 成员值都是只读的，不能重新赋值
* 为了让这一点更醒目，通常会在 enum 关键字前面加上`const`修饰，表示这是常量，不能再次赋值

加上`const`还有一个好处，就是编译为 JavaScript 代码后，代码中 Enum 成员会被替换成对应的值，这样能提高性能表现

```ts
const enum Color{
  Red,
  Blue
}
```

#### 同名Enum的合并

> 多个同名的 Enum 结构会自动合并

**注意**
* Enum 结构合并时，只允许其中一个的首成员省略初始值，否则报错
* 同名 Enum 合并时，不能有同名成员，否则报错
* 所有定义必须同为 const 枚举或者非 const 枚举，不允许混合使用

#### 字符串Enum

> Enum 成员的值除了设为数值，还可以设为字符串
> 也就是说，Enum 也可以用作`一组相关字符串的集合`

```ts
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

## 类型断言

> 对于没有类型声明的值，TypeScript 会进行类型推断，很多时候得到的结果，未必是开发者想要的

**针对这种情况**
* TypeScript 提供了“类型断言”这样一种手段
* 允许开发者在代码中`“断言”某个值的类型`，告诉编译器此处的值是什么类型
* TypeScript 一旦发现存在类型断言，就不再对该值进行类型推断，而是`直接采用断言给出的类型`

**这种做法的实质**
允许开发者在某个位置“绕过”编译器的类型推断
让本来通不过类型检查的代码能够通过，避免编译器报错
这样虽然削弱了 TypeScript 类型系统的严格性，但是为开发者带来了方便，毕竟开发者比编译器更了解自己的代码


总之，类型断言并不是真的改变一个值的类型，而是**提示编译器，应该如何处理这个值**

### 类型断言的语法

类型断言有两种语法：
```ts
// 语法一：<类型>值
<Type>value;

// 语法二：值 as 类型
value as Type;
```

**实例**
```ts
type T = ...
let foo = ...

let val:T = <T>foo
let val:T = foo as T
```

### 断言类型

#### as const断言

> 如果没有声明变量类型，let 命令声明的变量，会被类型推断为 TypeScript 内置的基本类型之一；const 命令声明的变量，则被推断为值类型常量

```ts
// 类型推断为基本类型 string
let s1 = "JavaScript";

// 类型推断为字符串 “JavaScript”
const s2 = "JavaScript";
```

**断言形式**
* 第一种：后置
```ts
let num = 1 as const
```
* 第二种：前置
```ts
let num = <const>12
```

**as const与const**
* 相当于 const 命令有更强的限定作用，可以缩小变量的类型范围( `基本类型->值类型常量` )

**断言不可逆**
使用了`as const`断言以后，let 变量就不能再改变值了
```ts
let s = "JavaScript" as const;
s = "Python"; // 报错
```

**as const断言只能用于字面量**
* 不能用于常量
```ts
let s = "JavaScript";
setLang(s as const); // 报错
```

* 也不能用于表达式
```ts
let s = ("Java" + "Script") as const; // 报错
```

#### 非空断言

> 对于那些可能为空的变量（即可能等于`undefined`或`null`），TypeScript 提供了非空断言，保证这些变量不会为空，写法是在变量名后面加上感叹号

```ts
function f(x?: number | null) {
  validateNumber(x); // 自定义函数，确保 x 是数值
  console.log(x!.toFixed());
}

function validateNumber(e?: number | null) {
  if (typeof e !== "number") throw new Error("Not a number");
}
```

#### 断言函数

> 断言函数是一种特殊函数，用于保证函数参数符合某种类型。如果函数参数达不到要求，就会抛出错误，中断程序执行；如果达到要求，就不进行任何操作，让代码按照正常流程运行

**为了更加清晰的表达，TS引入了新的类型写法**
```ts
function isString(value: unknown): asserts value is string {
  if (typeof value !== "string") throw new Error("Not a string");
}
```

##### asserts和is关键词

* 上面示例中，函数`isString()`的返回值类型写成`asserts value is string`
* 其中`asserts`和`is`都是关键词
* `value`是函数的参数名，`string`是函数参数的预期类型
* 它的意思是，该函数用来断言参数`value`的类型是`string`，如果达不到要求，程序就会在这里中断

**注意**
另外，断言函数的`asserts`语句等同于`void`类型，所以如果返回除了`undefined`和`null`以外的值，都会报错

```ts
function isString(value: unknown): asserts value is string {
  if (typeof value !== "string") throw new Error("Not a string");
  return true; // 报错
}
```

##### 断言函数与类型保护函数

断言函数与类型保护函数（type guard）是两种不同的函数，它们的区别是：
断言函数不返回值，而类型保护函数总是返回一个布尔值

##### 断言参数保证为真

>如果要断言某个参数保证为真（即不等于`false`、`undefined`和`null`），TypeScript 提供了断言函数的一种简写形式

```ts
function foo(x:string):asserts x {
  
}
```


### 实际运用场景

《对象》一章提到过，对象类型有严格字面量检查，如果存在额外的属性会报错
```ts
const obj:{x:number} = {x:1,y:2} // 会报错
```

为了解决上面的问题，就可以使用类型断言

```ts
const obj:{x:number} = {x:0,y:0} as {x:number,y:number}
const obj:{x:number} = {x:0,y:0} as {x:number}
``` 

### 类型断言的条件

**对于以下代码：**
```ts
expr as T;
```
上面代码中，`expr`是实际的值，`T`是类型断言，它们必须满足下面的条件
* `expr`是`T`的子类型
* 或者`T`是`expr`的子类型


## 模块

> 任何`包含 import 或 export 语句的文件`，就是一个**模块（module）**
> 相应地，如果文件不包含 export 语句，就是一个全局的脚本文件

模块本身就是一个作用域，不属于全局作用域
模块内部的变量、函数、类只在内部可见，对于模块外部是不可见的。暴露给外部的接口，必须用 export 命令声明；如果其他文件要使用模块的接口，必须用 import 命令来输入

### JS与TS在模块作用域上的不同

**对于JS**
* ES5之前：不同文件的同名变量会覆盖
* ES5之后：每个文件都是一个独立的模块，**顶层变量默认是模块私有的**，不会污染全局作用域。因此，即使两个文件有同名变量，也不会冲突

**对于TS**
* TypeScript 除了支持 ES 模块外，还支持**脚本模式（非模块）**，并且会默认检查**全局类型声明**
* 如果多个 `.ts` 文件声明了同名变量，TS 会报错 ;TS 认为这些变量是全局的，所以不允许重复声明
* 解决方法就是让每一个TS文件变成一个独立的模块，即模块化

**这样设计的原因**
- **兼容性**：TS 需要支持传统的脚本模式（如浏览器 `<script>` 全局变量）
- **类型安全**：防止意外的全局变量污染
- **更严格的检查**：避免不同文件间的命名冲突

### TS的模块

**已知**
* 如果TS文件不包含 export 语句，就是一个全局的脚本文件；处于全局作用域中
  `不允许重复声明变量`
* 如果TS文件包含import/export语句；就是一个独立的模块，拥有自己的模块作用域

**简单的声明模块**
* 如果一个文件不包含 export 语句，但是希望把它当作一个模块（即内部变量对外不可见），可以在脚本头部添加一行语句
```ts
export {};
```

上面这行语句不产生任何实际作用，但会让当前文件被当作模块处理，所有它的代码都变成了内部代码

#### 关于编译

> 对于一个模块a.ts和引用了模块a.ts的模块b.ts

**编译方式**
* 允许省略文件后缀，自动定位同名ts文件
```ts
tsc ./a
```

* 允许同时编译两个文件
```ts
tsc ./a.ts ./b.ts
```

* 只编译b.ts，因为存在引用关系，也会自动编译a.ts
```ts
tsc ./b.ts
```

* 如果想将`a.ts`和`b.ts`编译成一个文件，可以使用`--outFile`参数
```ts
$ tsc --outFile result.js b.ts
// 上面示例将`a.ts`和`b.ts`合并编译为`result.js`
```

##### importsNotUsedAsValues 编译设置

TypeScript 特有的输入类型（type）的 import 语句，编译成 JavaScript 时怎么处理呢？

TypeScript 提供了`importsNotUsedAsValues`编译设置项，有三个可能的值。

（1）`remove`：这是默认值，自动删除输入类型的 import 语句。

（2）`preserve`：保留输入类型的 import 语句。

（3）`error`：保留输入类型的 import 语句（与`preserve`相同），但是必须写成`import type`的形式，否则报错
#### import type语句

> import 在一条语句中，可以同时输入类型和正常接口

```ts
// a.ts
export interface A {
  foo: string;
}

export let a = 123;

// b.ts
import { A, a } from "./a";
```

但是这样很不利于区分类型和正常接口，容易造成混淆
为了解决这个问题，TypeScript 引入了两个解决方法：

* 为引用的类型加上`type`关键字
```ts
// b.ts
import { type A, a } from "./a";
```

* 第二个方法是使用 import type 语句，这个语句只能输入类型，不能输入正常接口
```ts
// 正确
import type { A } from "./a";

// 报错
import type { a } from "./a";
```

* **引入全部类型**
```ts
import type * as TypeNS from "moduleA";
```

#### export关键字

> 同样的，export 语句也有两种方法，表示输出的是类型

```ts
type A = "a";
type B = "b";

// 方法一
export { type A, type B };

// 方法二
export type { A, B };
```

### CommonJS模块

> CommonJS 是 Node.js 的专用模块格式，与 ES 模块格式不兼容

**import**
```ts
import fs = require("fs");
const code = fs.readFileSync("hello.ts", "utf8");
```

**export**
```ts
let obj = { foo: 123 };

export = obj;
```

### 模块定位

```ts
import { TypeA } from "./a";
```
上面示例中，TypeScript 怎么确定`./a`到底是指哪一个模块，这就叫做“模块定位”

模块定位有两种方法：
* 一种称为 Classic 方法
* 另一种称为 Node 方法

可以使用编译参数`moduleResolution`，指定使用哪一种方法

## namespace

> namespace 是一种将相关代码组织在一起的方式，中文译为“命名空间”

它出现在 ES 模块诞生之前，作为 TypeScript 自己的模块格式而发明的。但是，自从有了 ES 模块，官方已经不推荐使用 namespace 了

### 基本用法
namespace 用来建立一个容器，内部的所有变量和函数，都必须在这个容器里面使用
```ts
namespace Utils {
  function isString(value: any) {
    return typeof value === "string";
  }

  // 正确
  isString("yes");
}

Utils.isString("no"); // 报错
```

**如果想要在命名空间以外使用内部变量 -- 使用export前缀**
```ts
namespace Utility {
  export function log(msg: string) {
    console.log(msg);
  }
  export function error(msg: string) {
    console.error(msg);
  }
}

Utility.log("Call me");
Utility.error("maybe!");

// 指定别名
import Util_log = Utility.log
log("namespace")
```

**如果想在内部使用命名空间以外的变量 -- 使用import**
```ts
namespace Utils {
  export function isString(value: any) {
    return typeof value === "string";
  }
}

namespace App {
  import isString = Utils.isString;

  isString("yes");
  // 等同于
  Utils.isString("yes");
}
```


**关于编译**
* namespace 会变成一个值，保留在编译后的代码中。这一点要小心，它不`是纯的类型代码`

### namespace的合并

> 多个同名的 namespace 会自动合并，这一点跟 interface 一样


## 装饰器

> 装饰器（Decorator）是一种语法结构，用来在定义时修改类（class）的行为

**在语法上，装饰器有如下几个特征**

（1）第一个字符（或者说前缀）是`@`，后面是一个表达式。

（2）`@`后面的表达式，必须是一个函数（或者执行后可以得到一个函数）。

（3）这个函数接受所修饰对象的一些相关值作为参数。

（4）这个函数要么不返回值，要么返回一个新对象取代所修饰的目标对象

### 装饰器的使用

**下面是一个最简单的装饰器**

```ts
// 这里定义了一个叫做simpleDecorator的函数
function simpleDecorator() {
  console.log("hi");
}

// 用这个函数修饰下方的类A
@simpleDecorator
class A {} // "hi"
```

* 函数`simpleDecorator()`用作装饰器，附加在类`A`之上，后者在代码解析时就会打印一行日志
* 编译上面的代码会报错，提示没有用到装饰器的参数；现在加上参数使其正常运行
```ts
function simpleDecorator(target: any, context: any) {
  console.log("hi, this is " + target);
  return target;
}

@simpleDecorator
class A {} // "hi, this is class A {}"
```

相比使用子类改变父类，装饰器更加简洁优雅，缺点是不那么直观，功能也受到一些限制。所以，装饰器一般只用来为类添加某种特定行为

### 装饰器的版本

TypeScript 从早期开始，就支持装饰器。但是，装饰器的语法后来发生了变化。ECMAScript 标准委员会最终通过的语法标准，与 TypeScript 早期使用的语法有很大差异。

目前，TypeScript 5.0 同时支持两种装饰器语法。标准语法可以直接使用，传统语法需要打开`--experimentalDecorators`编译参数

```ts
tsc --target ES5 --experimentalDecorators
```

### 装饰器的结构
* 装饰器函数的类型定义如下
```ts
// Decorator是装饰器的类型定义
// 它接收两个参数：value 和 context
type Decorator = (
  // value是所装饰的对象本身
  value: DecoratedValue,
  // context是上下文对象
  context: {
    // kind属性是必有的 -- 表示装饰对象的类型
    kind: string;
    // name属性是必有的 -- 表示装饰对象的名字
    name: string | symbol;
    // addInitializer 添加类的初始化逻辑
    addInitializer?(initializer: () => void): void;
    // static布尔值，表示装饰对象是否为类的静态成员
    static?: boolean;
    // private布尔值，表示装饰对象是否为类的私有成员
    private?: boolean;
    // access对象 包含了某个值的get和set方法
    access: {
      get?(): unknown;
      set?(value: unknown): void;
    };
  }
) => void | ReplacementValue;
```

**关于context.type的取值**
- 'class'
- 'method'
- 'getter'
- 'setter'
- 'field'
- 'accessor'
#### 类装饰器

>类装饰器的结构如下：

```ts
type ClassDecorator = (
  value: Function,
  context: {
    kind: "class";
    name: string | undefined;
    addInitializer(initializer: () => void): void;
  }
) => Function | void;
```

##### 类装饰器的实际运用

* **类装饰器对类进行操作，可以不返回任何值**
```ts
function Greeter(value, context) {
  if (context.kind === "class") {
    value.prototype.greet = function () {
      console.log("你好");
    };
  }
}

@Greeter
class User {}

let u = new User();
u.greet(); // "你好"
```

* **类装饰器还可以返回一个函数，代替当前类的构造方法**
```ts
function countInstances(value: any, context: any) {
  let instanceCount = 0;

  const wrapper = function (...args: any[]) {
    instanceCount++;
    // value是类A 此处实例化一个A对象
    const instance = new value(...args);
    instance.count = instanceCount;
    return instance;
  } as unknown as typeof MyClass;

  wrapper.prototype = value.prototype; // 构建原型关系
  return wrapper;
}

@countInstances
class MyClass {}

const inst1 = new MyClass();
inst1 instanceof MyClass; // true
inst1.count; // 1
```

**`as unknown as typeof MyClass` 的作用**

1. TypeScript 不允许直接从一个类型断言到另一个不相关的类型
2. 但可以通过 `unknown`（或 `any`）作为中介


* **类装饰器还可以返回一个新的类，代替原来所装饰的类**
```ts
function countInstances(value: any, context: any) {
  let instanceCount = 0;

  return class extends value {
    constructor(...args: any[]) {
      super(...args);
      instanceCount++;
      this.count = instanceCount;
    }
  };
}

@countInstances
class MyClass {}

const inst1 = new MyClass();
inst1 instanceof MyClass; // true
inst1.count; // 1
```

#### 方法装饰器

> 方法装饰器用来装饰类的方法（method）。它的类型描述如下

```ts
type ClassMethodDecorator = (
  value: Function,
  context: {
    kind: "method";
    name: string | symbol;
    static: boolean;
    private: boolean;
    access: { get: () => unknown };
    addInitializer(initializer: () => void): void;
  }
) => Function | void;
```

#### 属性装饰器

> 属性装饰器用来装饰定义在类顶部的属性（field）。它的类型描述如下

```ts
type ClassFieldDecorator = (
  value: undefined,
  context: {
    kind: "field";
    name: string | symbol;
    static: boolean;
    private: boolean;
    access: { get: () => unknown; set: (value: unknown) => void };
    addInitializer(initializer: () => void): void;
  }
) => (initialValue: unknown) => unknown | void;
```


