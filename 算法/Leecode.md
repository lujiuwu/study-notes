
# hot 100
## 两数之和

给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出 **和为目标值** _`target`_  的那 **两个** 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。

你可以按任意顺序返回答案。

哈希表

```js
var twoSum = function(nums, target) {

    // 创建哈希表

    let map = new Map()

    for(let i = 0;len = nums.length;i++){

        if(map.has(target-nums[i])){

            return [map.get(target-nums[i]),i]

        }else{

            map.set(nums[i],i)

        }

    }

    return []

};
```

## 异位字符串分组
给你一个字符串数组，请你将 **字母异位词** 组合在一起。可以按任意顺序返回结果列表。

**字母异位词** 是由重新排列源单词的所有字母得到的一个新单词。
### 排序（想到但没实现）
```js
var groupAnagrams = function(strs) {

    let map = new Map()

    for(let str of strs){

        // 字符串排序

        let arr = Array.from(str)

        arr.sort()

        let sort_str = arr.toString()

        // 查询哈希表

        let list = map.has(sort_str)?map.get(sort_str):new Array()

        // 抽取存在的值/新建数组

        list.push(str)

        console.log(list)

        // 更新哈希表

        map.set(sort_str,list)

    }

    return Array.from(map.values())

};
```
### 其他解法
#### 计数 
**注意**：在JavaScript中，`Map` 对象是一种键值对的集合，类似于对象，但“键”的范围不限于字符串和符号，还可以是任何数据类型，包括数组。

当使用数组作为 `Map` 的键时，`Map` 的行为与其他类型的键一样，数组会被当作对象引用进行处理。每个数组实例在内存中有其唯一的引用，**因此即使两个数组的内容完全相同，只要它们不是同一个引用（即不是通过同一个变量或者同一个内存地址引用的），它们就会被视为不同的键。**

调用 `Map.values()` 方法时，`Map` 会返回一个新的迭代器对象，该对象按插入顺序包含了 `Map` 对象中每个元素的值。这些值与你使用什么类型的键（在这个情况下是数组）无关。

```js
 // 计数

    let map = new Map()

    for(let str of strs){

        // 新建空数组

        let arr = new Array(26).fill(0);

        // 修改数组 -- 字符重复的序列数组

        for(let cha of str){

            arr[cha.charCodeAt()-'a'.charCodeAt()]++

        }

        // 更新哈希表

        // 以序列数组作为键

        map.has(arr)?map.get(arr).push(str):map.set(arr,[str])

  

    }

    return Array.from(map.values())

* 运行上述代码 会出现：
```
![](算法/noteImg/Pasted%20image%2020241226195629.png)

正确解法：

```js
var groupAnagrams = function(strs) {

  

    // 计数

    let map = new Object()

    for(let str of strs){

        // 新建空数组

        let arr = new Array(26).fill(0);

        // 修改数组 -- 字符重复的序列数组

        for(let cha of str){

            arr[cha.charCodeAt()-'a'.charCodeAt()]++

        }

        // 更新哈希表

        // 以序列数组作为键

        map[arr]?map[arr].push(str):map[arr] = [str]

  

    }

    return Object.values(map)

};
```

## 最长连续序列
给定一个未排序的整数数组 `nums` ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。

请你设计并实现时间复杂度为 `O(n)` 的算法解决此问题。

```js
/**

 * @param {number[]} nums

 * @return {number}

 */

var longestConsecutive = function(nums) {

    // 去重

    let set = new Set(nums)

    // 最长序列数

    let streak = 0

    // 循环判断当前数是不是序列开头

    for(let num of nums){

        if(!set.has(num-1)){

            // 不存在num-1 --> 当前是序列开头

            let start = num

            // 序列的长度为1（包含当前数）

            let currentStreak = 1

            // 循环判断start开头的序列长度

            while(set.has(start+1)){

                start += 1

                currentStreak += 1

            }

            // 更新

            streak = Math.max(streak,currentStreak)

        }

    }

    return streak

};
```

## 移动零
给定一个数组 `nums`，编写一个函数将所有 `0` 移动到数组的末尾，同时保持非零元素的相对顺序。

**请注意** ，必须在不复制数组的情况下原地对数组进行操作。

```js
var moveZeroes = function(nums) {

    // 指向处理好的序列末尾

    let right = 0;

    // 指向待处理的序列头部

    let left = 0;

    while(right<nums.length){

        if(nums[right]){

            let t1 = nums[right]

            nums[right] = nums[left]

            nums[left] = t1

            left++

        }

        right++

    }

};
```

## 盛最多水的容器
给定一个长度为 `n` 的整数数组 `height` 。有 `n` 条垂线，第 `i` 条线的两个端点是 `(i, 0)` 和 `(i, height[i])` 。

找出其中的两条线，使得它们与 `x` 轴共同构成的容器可以容纳最多的水。

返回容器可以储存的最大水量。

**说明：** 你不能倾斜容器。
```js
var maxArea = function(height) {

    // 左侧

    let left = 0

    // 右侧

    let right = height.length-1

    // 容量 = Math.min(left,right) * (right-left)

    let res = 0

    while(left<right){

     let area = Math.min(height[right],height[left])*(right-left)

     res = Math.max(area,res)

     if(height[right]>=height[left]) ++left

     else --right

    }

    return res

};
```