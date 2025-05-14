> Vue支持计算属性computed和侦听属性watch两个选项

### 定义
#### computed

##### 基本用法
> computed是计算属性，类似于过滤器,对绑定到视图的数据进行处理,并监听变化进而执行对应的方法
> 计算属性是基于它们的依赖进行缓存的。只在相关依赖发生改变时它们才会重新求值

```ts
// vue2
computed:{
  fileName:{
    get(){return this.fileName},
    set(newValue){this.fileName = newValue}
  }
}
// vue3 / jsx
fileName = computed({
  set(){},
  get(){}
})
```

#### watch

##### 基本使用

> watch是一个侦听的动作，用来观察和响应 Vue 实例上的数据变动

```ts
// vue2
watch:{
  fileName(newValue,oldValue){
    console.log(newVaue,oldValue)
  } 
}
// vue3
watch(fileName,(newValue,oldValue))=>{
  console.log(newVaue,oldValue)
}
```

##### 高级用法 
* **immediate:true** 想让watch在初始化完成后立即执行一次
* **handler方法** 如果设置了immediate为true，就会立即先去执行里面的handler方法
```ts
  watch: {
    firstName: {
      handler(val) {
        console.log('第一次执行了～')
        this.fullName = val + ' ' + this.lastName
      },
      // 代表在watch里声明了firstName这个方法之后立即先去执行handler方法
      immediate: true
    }
  }
```

* **deep属性**  代表是否开启深度监听，默认为false
  `deep属性的意思是深度遍历，会在对象一层层往下遍历，在每一层都加上监听器`
```ts
  watch: {
    obj: {
      handler(val) {
       console.log('obj.a changed')
      },
      immediate: true
    }
  }
```

* **deep的性能优化** -- 但是使用deep属性会给每一层都加上监听器，性能开销可能就会非常大了。这样我们可以用字符串的形式来优化

```ts
  watch: {
    'obj.a': {
      handler(val) {
       console.log('obj.a changed')
      },
      immediate: true
      // deep: true
    }
  }
// 直到遇到'obj.a'属性，才会给该属性设置监听函数，提高性能。
```
#### 使用方法异同

**相同**： computed和watch都起到监听/依赖一个数据，并进行处理的作用

**异同**：它们其实都是vue对监听器的实现，只不过**computed主要用于对同步数据的处理，watch则主要用于观测某个值的变化去完成一段开销较大的复杂业务逻辑**。能用computed的时候优先用computed，避免了多个数据影响其中某个数据时多次调用watch的尴尬情况


### 原理

#### computed的本质是 computed watch

1）初始化计算属性时，遍历computed对象，给其中每一个计算属性分别生成唯一`computed watcher`，并将该watcher中的`dirty`设置为true

初始化时，计算属性并不会立即计算（vue做的优化之一），只有当获取的计算属性值才会进行对应计算

2）初始化计算属性时，将`Dep.target`设置成当前的computed watcher，将computed watcher添加到所依赖data值对应的`dep`中（`依赖收集的过程`），然后计算computed对应的值，后将dirty改成false

3）当所依赖data中的值发生变化时，调用set方法触发dep的notify方法，将computed watcher中的dirty设置为true

4）下次获取计算属性值时，若dirty为true, 重新计算属性的值

5）dirty是控制缓存的关键，当所依赖的data发生变化，dirty设置为true，再次被获取时，就会重新计算

#### watch的本质是 user wacth（用户自定义的watch）

1）遍历`watch`对象， 给其中每一个watch属性，生成对应的`user watcher`

2）调用watcher中的get方法，将`Dep.target`设置成当前的user watcher，并将user watcher添加到监听data值对应的dep中（依赖收集的过程）

3）当所监听data中的值发生变化时，会调用set方法触发dep的notify方法，执行watcher中定义的方法

4）设置成`deep：true`的情况，递归遍历所监听的对象，将`user watcher`添加到对象中每一层key值的dep对象中，这样无论当对象的中哪一层发生变化，wacher都能监听到。通过对象的递归遍历，实现了深度监听功能



