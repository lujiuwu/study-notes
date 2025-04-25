// // 声明一个构造函数
// let Idol = function () { } // 等同于function Idol(){}
// // 声明之后 -- 该函数的prototype属性指向其原型对象
// console.log(Idol.prototype, typeof Idol.prototype)
// // 该原型对象的constructor属性又指向构造函数 所以：
// console.log(Idol.prototype.constructor === Idol)
// // 正常的原型链都会终止于 Object 的原型对象
// // Object的原型对象是null
// console.log(Object.prototype.__proto__ === null)

// // 通过构造函数新建一个实例对象
// const sunoo = new Idol()
// // 该实例对象的__proto__属性指向构造函数的原型对象
// // * 它实际上指向隐藏特性[[Prototype]]
// console.log(sunoo.__proto__ === Idol.prototype)
// // 实例对象与构造函数本身没有直接联系
// // constructor属性实际继承自其原型对象
// console.log(sunoo.constructor)

// let Person = function () { }
// let person = new Person()
// // 向原型对象添加属性
// Person.prototype.name = 'sunoo'
// Person.prototype.birthday = "2003-6-24"
// // 向实例对象添加属性
// person.age = 21
// // 枚举所有实例属性
// console.log(Object.keys(person)) //[ 'age' ]
// // 枚举所有原型属性
// console.log(Object.keys(person.__proto__)) // [ 'name', 'birthday' ]

// let obj = {
//   id: 1,
//   price: "12yuan",
//   arr: [1, 2, 3],
//   getPrice: function () { return this.price },
//   is_open:true
// }
// console.log(Object.values(obj)[0] === obj.id) //true
// Object.values(obj)[0] = 2
// console.log(obj.id)
// let Person = function(){}
// let obj = {
//   name: 1,
//   func:function(){return this.name}
// }
// Person.prototype = obj
// console.log(Person.prototype.constructor === Person) //false

// // 定义父对象构造函数
// function SuperDom(){
//   this.superProperty = true
//   this.getSuperProperty = function(){return this.superProperty}
// }
// // 定义子对象构造函数
// function SubDom(){
//   this.subProperty = true
//   this.getSubProperty = function(){return this.subProperty}
// }
// // 通过创建SuperDom实例重写SubDom原型
// SubDom.prototype = new SuperDom()
// // 创建子对象实例
// const instance = new SubDom()
// // 验证继承关系
// console.log(instance.getSuperProperty())
// let arr1 = [1, 2, 3]
// let arr2 = [4, 5, 6]
// console.log(arr1.concat(arr2))
// class Person{}
// console.log(Person) // [class Person]
// console.log(typeof Person) // function


// class Person{ } // 新建一个构造函数为空函数的类
// class Animal{
//   constructor() {
//     console.log("constructor")
//   }
// } // 新建一个有构造函数的类 返回this对象

// class Food{
//   constructor() {
//     const obj = {id:1}
//     return obj
//   }
// } // 新建一个有构造函数的类 返回其他对象

// // 实例化
// const person = new Person()
// const animal = new Animal()
// const food = new Food()

// console.log("Person:", Person, typeof Person) // Person本质是特殊的函数
// console.log("person:", person, typeof person) // person本质是对象
// console.log("Animal:", Animal, typeof Animal)
// console.log("animal:", animal, typeof animal)
// console.log("Food:", Food, typeof Food)
// console.log("food:", food, typeof food)

// console.log(person instanceof Person)
// console.log(animal instanceof Animal)
// console.log(food instanceof Food) // false -- 因为返回的对象不是Food的实例

// console.log("constructor:", person.constructor(), typeof person.constructor()) // 报错
// console.log("constructor:", new Animal.constructor(), typeof new Animal.constructor()) // function
// // console.log("constructor:", food.constructor(), typeof food.constructor())
// console.log("constructor:", new Animal.constructor().constructor, typeof new Animal.constructor().constructor) // function

// class Person{
//   constructor(){
//     this.name = "cy" // 添加到this的内容会存在于不同的实例上，但不共享
//   }
//   getName() {
//     console.log("name")
//   }
// }
// let p = new Person()
// Person.prototype.getName() // "name"

// class Animal{
//   constructor() {
//     this.name = "cat"
//     this.getName = function(){
//       return `animal is ${this.name}`
//     }
//   } // 添加到this上的所有内容会存在于不同的实例上

//   getName() {
//     console.log("class prototype function")
//   } // 添加到类块中的方法会存在于类的原型对象上

//   static getName() {
//     console.log("class function")
//   } // 静态类方法会存在于类本身
// }

// // 验证
// let animal = new Animal()
// console.log(animal.name, animal.getName()) // cat animal is cat
// Animal.prototype.getName() // class prototype function
// Animal.getName() // class function


// class Animal{
//   constructor(name) {
//     this.animalName = name
//     console.log(this.animalName)
//   }
//   static getName() {
//     console.log("super",this.name)
//   }
// }
// class Cat extends Animal{
//   constructor(name) {
//     super(name)
//   }
//   static getName() {
//     console.log("sub",this.name)
//     super.getName()
//   }
// }
// let cat = new Cat("cat")
// Cat.getName()




// console.log(cat instanceof animal)
// console.log(Cat instanceof Animal) //false


// function func(num1,num2,num3) {
//   console.log(arguments.length) //2
// }
// func(1,2)
// let fun = () => {
//   console.log(arguments[0])
// }
// fun(1,2)

// let func = function () {
//   console.log(this.name)
// }
// func()

// let obj = {value:"val"}
// Object.defineProperty(obj,"value",{
//   // 属性被获取时调用
//   get(){
//     console.log("get value")
//     return this._value
//   },
//   // 属性被设置时调用
//   set(newVal){
//     console.log("set value,new value is"+newVal)
//     this._value = newVal
//   }
// })
// // 调用obj.value
// console.log(obj.value)
// // 设置obj.value
// obj.value = "newVal"
let map = new Map()
map.set(1,3)
map.set(1, 2)
console.log(map)
console.log(map.get(2))