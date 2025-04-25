> DOM1（DOM Level 1）主要定义了 HTML 和 XML 文档的底层结构。
> DOM2（DOM Level 2）和DOM3（DOM Level 3）在这些结构之上加入更多交互能力，提供了更高级的 XML 特性。
> 实际上，DOM2和 DOM3 是按照模块化的思路来制定标准的，每个模块之间有一定关联，但分别针对某个 DOM 子集。

 DOM Core：在 DOM1 核心部分的基础上，为节点增加方法和属性。
 DOM Views：定义基于样式信息的不同视图。
 DOM Events：定义通过事件实现 DOM 文档交互。
 DOM Style：定义以编程方式访问和修改 CSS 样式的接口。
 DOM Traversal and Range：新增遍历 DOM 文档及选择文档内容的接口。
 DOM HTML：在 DOM1 HTML 部分的基础上，增加属性、方法和新接口。
 DOM Mutation Observers：定义基于 DOM 变化触发回调的接口。这个模块是 DOM4 级模块，用于取代 Mutation Events。

## DOM的演进
DOM2 和 DOM3 Core 模块的目标是扩展 DOM API，满足 XML 的所有需求并提供更好的错误处理和特性检测。很大程度上，这意味着支持 XML 命名空间的概念
### XML命名空间
> XML 命名空间可以实现在一个格式规范的文档中混用不同的 XML 语言，而不必担心元素命名冲突
> 严格来讲，XML 命名空间在 XHTML 中才支持，HTML 并不支持



