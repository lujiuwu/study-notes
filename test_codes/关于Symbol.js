// const s1 = Symbol()
// const s2 = Symbol()

// console.log(s1 === s2)
// console.log(s1.description)

const sa = Symbol.for("key")
const sb = Symbol.for("key")
console.log(sa === sb) // true
const key = Symbol.keyFor(sa)
const sc = Symbol.for(key)
console.log(sa === sc) // true
