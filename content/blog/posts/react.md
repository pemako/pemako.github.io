---
date: '2026-04-09T20:00:00+08:00'
title: 'React'
description: ""
summary: ""
tags: ["react", "frontend"]
categories: ["frontend"]
series: ["Frontend"]
ShowToc: true
TocOpen: true
---

## 基础知识

### **props**

> props 是配置组件行为和外观的外部输入，它决定组件渲染什么，但组件不能修改它。
### **props 的三个核心含义**

#### **1. 组件的外部数据输入**

组件不是凭空渲染，它需要“数据”，而 props 就是数据来源。

#### **2. 父组件 → 子组件的数据流（单向数据流）**

React 明确规定：
- 数据只能从父流向子
- 子组件不能直接改 props
这个规则保证了 UI 是可预测的。
#### **3. 组件之间的通信方式（父传子）**

子组件不直接知道父组件是谁，只知道父组件给它的 props。

在声明 props 时， **不要忘记 `(` 和 `)` 之间的一对花括号 `{` 和 `}`** ：

```
function Avatar({ person, size }) {  

}
```

这种语法被称为 [“解构”](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter)，等价于于从函数参数中读取属性：

```
function Avatar(props) {  
	let person = props.person;  
	let size = props.size;  
	// ...  
}
```

### **state**

state 是组件**内部可变的**数据，用来驱动组件的渲染与行为。它由组件自己拥有和管理（或通过 useReducer/外部管理器协调），当 state 变化时 React 会重新渲染该组件（及其子树）。


### 组件

- React 允许你创建组件，**应用程序的可复用 UI 元素**。
- 在 React 应用程序中，每一个 UI 模块都是一个组件。
- React 是常规的 JavaScript 函数，除了：
    1. 它们的名字总是以大写字母开头。
    2. 它们返回 JSX 标签。

**一个文件里有且仅有一个 _默认_ 导出，但是可以有任意多个 _具名_ 导出。**

组件的导出方式决定了其导入方式。当你用默认导入的方式，导入具名导出的组件时，就会报错。

| 语法  | 导出语句                                  | 导入语句                                    |
| --- | ------------------------------------- | --------------------------------------- |
| 默认  | `export default function Button() {}` | `import Button from './Button.js';`     |
| 具名  | `export function Button() {}`         | `import { Button } from './Button.js';` |

JSX 是 JavaScript 语法扩展，可以让你在 JavaScript 文件中书写类似 HTML 的标签。
### JSX 规则

- 只能返回一个根元素 
	- 如果想要在一个组件中包含多个元素，**需要用一个父标签把它们包裹起来**
	- 如果你不想在标签中增加一个额外的 `<div>`，可以用 `<>` 和 `</>` 元素来代替
	- 这个空标签被称作 _[Fragment](https://zh-hans.react.dev/reference/react/Fragment)_。React Fragment 允许你将子元素分组，而不会在 HTML 结构中添加额外节点。
- 标签必须闭合
- 使用驼峰式命名法给 所有 大部分属性命名！ 

在 JSX 中，只能在以下两种场景中使用大括号：

1. 用作 JSX 标签内的**文本**：`<h1>{name}'s To Do List</h1>` 是有效的，但是 `<{tag}>Gregorio Y. Zara's To Do List</{tag}>` 无效。
2. 用作紧跟在 `=` 符号后的 **属性**：`src={avatar}` 会读取 `avatar` 变量，但是 `src="{avatar}"` 只会传一个字符串 `{avatar}`。

使用 “双大括号”：JSX 中的 CSS 和 对象 

内联 `style` 属性 使用驼峰命名法编写。例如，HTML `<ul style="background-color: black">` 在你的组件里应该写成 `<ul style={{ backgroundColor: 'black' }}>`。

- JSX 引号内的值会作为字符串传递给属性。
- 大括号让你可以将 JavaScript 的逻辑和变量带入到标签中。
- 它们会在 JSX 标签中的内容区域或紧随属性的 `=` 后起作用。
- `{{` 和 `}}` 并不是什么特殊的语法：它只是包在 JSX 大括号内的 JavaScript 对象


**切勿将数字放在 `&&` 左侧.**

JavaScript 会自动将左侧的值转换成布尔类型以判断条件成立与否。然而，如果左侧是 `0`，整个表达式将变成左侧的值（`0`），React 此时则会渲染 `0` 而不是不进行渲染。

例如，一个常见的错误是 `messageCount && <p>New messages</p>`。其原本是想当 `messageCount` 为 0 的时候不进行渲染，但实际上却渲染了 `0`。

为了更正，可以将左侧的值改成布尔类型：`messageCount > 0 && <p>New messages</p>`。

```
// 使用的箭头函数 => 后面是表达式可以直接返回
const listItems = chemists.map(person =>  
	<li>...</li> // 隐式地返回！ 
);

// 如果是花括号则需要使用 return 语句
const listItems = chemists.map(person => { // 花括号  
	return <li>...</li>;  
});
```


**保持组件的纯粹**

- 一个组件必须是纯粹的，就意味着：
    - **只负责自己的任务。** 它不会更改在该函数调用前就已存在的对象或变量。
    - **输入相同，则输出相同。** 给定相同的输入，组件应该总是返回相同的 JSX。
- 渲染随时可能发生，因此组件不应依赖于彼此的渲染顺序。
- 你不应该改变任何用于组件渲染的输入。这包括 props、state 和 context。通过 [“设置” state](https://zh-hans.react.dev/learn/state-a-components-memory) 来更新界面，而不要改变预先存在的对象。
- 努力在你返回的 JSX 中表达你的组件逻辑。当你需要“改变事物”时，你通常希望在事件处理程序中进行。作为最后的手段，你可以使用 `useEffect`。
- 编写纯函数需要一些练习，但它充分释放了 React 范式的能力。


**传递给事件处理函数的函数应直接传递，而非调用**

|传递一个函数（正确）|调用一个函数（错误）|
|---|---|
|`<button onClick={handleClick}>`|`<button onClick={handleClick()}>`|
区别很微妙。在第一个示例中，`handleClick` 函数作为 `onClick` 事件处理函数传递。这会让 React 记住它，并且只在用户点击按钮时调用你的函数。

在第二个示例中，`handleClick()` 中最后的 `()` 会在 [渲染](https://zh-hans.react.dev/learn/render-and-commit) 过程中 **立即** 触发函数，即使没有任何点击。这是因为位于 [JSX `{}`](https://zh-hans.react.dev/learn/javascript-in-jsx-with-curly-braces) 之间的 JavaScript 会立即执行。

当你编写内联代码时，同样的陷阱可能会以不同的方式出现：

| 传递一个函数（正确）                              | 调用一个函数（错误）                        |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |
**按照惯例，事件处理函数 props 应该以 `on` 开头，后跟一个大写字母。**

在 React 中所有事件都会传播，除了 `onScroll`，它仅适用于你附加到的 JSX 标签。

事件处理函数接收一个 **事件对象** 作为唯一的参数。按照惯例，它通常被称为 `e` ，代表 “event”（事件）。你可以使用此对象来读取有关事件的信息。

这个事件对象还允许你阻止传播。如果你想阻止一个事件到达父组件，你需要像下面 `Button` 组件那样调用 `e.stopPropagation()` ：

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('你点击了 toolbar ！');
    }}>
      <Button onClick={() => alert('正在播放！')}>
        播放电影
      </Button>
      <Button onClick={() => alert('正在上传！')}>
        上传图片
      </Button>
    </div>
  );
}

```


不要混淆 `e.stopPropagation()` 和 `e.preventDefault()`。它们都很有用，但二者并不相关：

- [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) 阻止触发绑定在外层标签上的事件处理函数。
- [`e.preventDefault()`](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) 阻止少数事件的默认浏览器行为。


在 React 中，`useState` 以及任何其他以“`use`”开头的函数都被称为 **Hook**。

Hook 是特殊的函数，只在 React [渲染](https://zh-hans.react.dev/learn/render-and-commit#step-1-trigger-a-render)时有效。它们能让你 “hook” 到不同的 React 特性中去。

**Hooks ——以 `use` 开头的函数——只能在组件或[自定义 Hook](https://zh-hans.react.dev/learn/reusing-logic-with-custom-hooks) 的最顶层调用。** 你不能在条件语句、循环语句或其他嵌套函数内调用 Hook。Hook 是函数，但将它们视为关于组件需求的无条件声明会很有帮助。在组件顶部 “use” React 特性，类似于在文件顶部“导入”模块。

**渲染和提交**

- 在一个 React 应用中一次屏幕更新都会发生以下三个步骤：
    1. 触发
    2. 渲染
    3. 提交
- 你可以使用严格模式去找到组件中的错误
- 如果渲染结果与上次一样，那么 React 将不会修改 DOM

**把一些列的 state 的更新加入队列**

- 设置 state 不会更改现有渲染中的变量，但会请求一次新的渲染。
- React 会在事件处理函数执行完成之后处理 state 更新。这被称为批处理。
- 要在一个事件中多次更新某些 state，你可以使用 `setNumber(n => n + 1)` 更新函数。


### 使用 Immer 编写简洁的更新逻辑 [](https://zh-hans.react.dev/learn/updating-objects-in-state#write-concise-update-logic-with-immer "Link for 使用 Immer 编写简洁的更新逻辑")

如果你的 state 有多层的嵌套，你或许应该考虑 [将其扁平化](https://zh-hans.react.dev/learn/choosing-the-state-structure#avoid-deeply-nested-state)。但是，如果你不想改变 state 的数据结构，你可能更喜欢用一种更便捷的方式来实现嵌套展开的效果。[Immer](https://github.com/immerjs/use-immer) 是一个非常流行的库，它可以让你使用简便但可以直接修改的语法编写代码，并会帮你处理好复制的过程。通过使用 Immer，你写出的代码看起来就像是你“打破了规则”而直接修改了对象：

```
updatePerson(draft => {  draft.artwork.city = 'Lagos';});
```

下面是常见数组操作的参考表。当你操作 React state 中的数组时，你需要避免使用左列的方法，而首选右列的方法：

|避免使用 (会改变原始数组)|推荐使用 (会返回一个新数组）|
|---|---|---|
|添加元素|`push`，`unshift`|`concat`，`[...arr]` 展开语法（[例子](https://zh-hans.react.dev/learn/updating-arrays-in-state#adding-to-an-array)）|
|删除元素|`pop`，`shift`，`splice`|`filter`，`slice`（[例子](https://zh-hans.react.dev/learn/updating-arrays-in-state#removing-from-an-array)）|
|替换元素|`splice`，`arr[i] = ...` 赋值|`map`（[例子](https://zh-hans.react.dev/learn/updating-arrays-in-state#replacing-items-in-an-array)）|
|排序|`reverse`，`sort`|先将数组复制一份（[例子](https://zh-hans.react.dev/learn/updating-arrays-in-state#making-other-changes-to-an-array)）|

或者，你可以[使用 Immer](https://zh-hans.react.dev/learn/updating-arrays-in-state#write-concise-update-logic-with-immer) ，这样你便可以使用表格中的所有方法了。


## 构建 state 的原则 [](https://zh-hans.react.dev/learn/choosing-the-state-structure#principles-for-structuring-state "Link for 构建 state 的原则")

当你编写一个存有 state 的组件时，你需要选择使用多少个 state 变量以及它们都是怎样的数据格式。尽管选择次优的 state 结构下也可以编写正确的程序，但有几个原则可以指导你做出更好的决策：

1. **合并关联的 state**。如果你总是同时更新两个或更多的 state 变量，请考虑将它们合并为一个单独的 state 变量。
2. **避免互相矛盾的 state**。当 state 结构中存在多个相互矛盾或“不一致”的 state 时，你就可能为此会留下隐患。应尽量避免这种情况。
3. **避免冗余的 state**。如果你能在渲染期间从组件的 props 或其现有的 state 变量中计算出一些信息，则不应将这些信息放入该组件的 state 中。
4. **避免重复的 state**。当同一数据在多个 state 变量之间或在多个嵌套对象中重复时，这会很难保持它们同步。应尽可能减少重复。
5. **避免深度嵌套的 state**。深度分层的 state 更新起来不是很方便。如果可能的话，最好以扁平化方式构建 state。

这些原则背后的目标是 **使 state 易于更新而不引入错误**。从 state 中删除冗余和重复数据有助于确保所有部分保持同步。这类似于数据库工程师想要 [“规范化”数据库结构](https://docs.microsoft.com/zh-CN/office/troubleshoot/access/database-normalization-description)，以减少出现错误的机会。用爱因斯坦的话说，**“让你的状态尽可能简单，但不要过于简单。”**

## 在组件间共享状态

有时候，你希望两个组件的状态始终同步更改。要实现这一点，可以将相关 state 从这两个组件上移除，并把 state 放到它们的公共父级，再通过 props 将 state 传递给这两个组件。这被称为“状态提升”，这是编写 React 代码时常做的事。

**只要一个组件还被渲染在 UI 树的相同位置，React 就会保留它的 state。** 如果它被移除，或者一个不同的组件被渲染在相同的位置，那么 React 就会丢掉它的 state。

**相同位置的相同组件会使得 state 被保留下来**
记住 **对 React 来说重要的是组件在 UI 树中的位置,而不是在 JSX 中的位置**


### 对比 `useState` 和 `useReducer` [](https://zh-hans.react.dev/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer "Link for this heading")

Reducer 并非没有缺点！以下是比较它们的几种方法：

- **代码体积：** 通常，在使用 `useState` 时，一开始只需要编写少量代码。而 `useReducer` 必须提前编写 reducer 函数和需要调度的 actions。但是，当多个事件处理程序以相似的方式修改 state 时，`useReducer` 可以减少代码量。
- **可读性：** 当状态更新逻辑足够简单时，`useState` 的可读性还行。但是，一旦逻辑变得复杂起来，它们会使组件变得臃肿且难以阅读。在这种情况下，`useReducer` 允许你将状态更新逻辑与事件处理程序分离开来。
- **可调试性：** 当使用 `useState` 出现问题时, 你很难发现具体原因以及为什么。 而使用 `useReducer` 时， 你可以在 reducer 函数中通过打印日志的方式来观察每个状态的更新，以及为什么要更新（来自哪个 `action`）。 如果所有 `action` 都没问题，你就知道问题出在了 reducer 本身的逻辑中。 然而，与使用 `useState` 相比，你必须单步执行更多的代码。
- **可测试性：** reducer 是一个不依赖于组件的纯函数。这就意味着你可以单独对它进行测试。一般来说，我们最好是在真实环境中测试组件，但对于复杂的状态更新逻辑，针对特定的初始状态和 `action`，断言 reducer 返回的特定状态会很有帮助。
- **个人偏好：** 并不是所有人都喜欢用 reducer，没关系，这是个人偏好问题。你可以随时在 `useState` 和 `useReducer` 之间切换，它们能做的事情是一样的！

如果你在修改某些组件状态时经常出现问题或者想给组件添加更多逻辑时，我们建议你还是使用 reducer。当然，你也不必整个项目都用 reducer，这是可以自由搭配的。你甚至可以在一个组件中同时使用 `useState` 和 `useReducer`。

### 编写一个好的 reducer [](https://zh-hans.react.dev/learn/extracting-state-logic-into-a-reducer#writing-reducers-well "Link for 编写一个好的 reducer")

编写 `reducer` 时最好牢记以下两点：

- **reducer 必须是纯粹的。** 这一点和 [状态更新函数](https://zh-hans.react.dev/learn/queueing-a-series-of-state-updates) 是相似的，`reducer` 是在渲染时运行的！（actions 会排队直到下一次渲染)。 这就意味着 `reducer` [必须纯净](https://zh-hans.react.dev/learn/keeping-components-pure)，即当输入相同时，输出也是相同的。它们不应该包含异步请求、定时器或者任何副作用（对组件外部有影响的操作）。它们应该以不可变值的方式去更新 [对象](https://zh-hans.react.dev/learn/updating-objects-in-state) 和 [数组](https://zh-hans.react.dev/learn/updating-arrays-in-state)。
- **每个 action 都描述了一个单一的用户交互，即使它会引发数据的多个变化。** 举个例子，如果用户在一个由 `reducer` 管理的表单（包含五个表单项）中点击了 `重置按钮`，那么 dispatch 一个 `reset_form` 的 action 比 dispatch 五个单独的 `set_field` 的 action 更加合理。如果你在一个 `reducer` 中打印了所有的 `action` 日志，那么这个日志应该是很清晰的，它能让你以某种步骤复现已发生的交互或响应。这对代码调试很有帮助！

### 使用 Immer 简化 reducer [](https://zh-hans.react.dev/learn/extracting-state-logic-into-a-reducer#writing-concise-reducers-with-immer "Link for 使用 Immer 简化 reducer")

与在平常的 state 中 [修改对象](https://zh-hans.react.dev/learn/updating-objects-in-state#write-concise-update-logic-with-immer) 和 [数组](https://zh-hans.react.dev/learn/updating-arrays-in-state#write-concise-update-logic-with-immer) 一样，你可以使用 `Immer` 这个库来简化 `reducer`。在这里，[`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer) 让你可以通过 `push` 或 `arr[i] =` 来修改 state ：


### 迁移状态逻辑至 Reducer 中

- 把 `useState` 转化为 `useReducer`：
    1. 通过事件处理函数 dispatch actions；
    2. 编写一个 reducer 函数，它接受传入的 state 和一个 action，并返回一个新的 state；
    3. 使用 `useReducer` 替换 `useState`；
- Reducer 可能需要你写更多的代码，但是这有利于代码的调试和测试。
- Reducer 必须是纯净的。
- 每个 action 都描述了一个单一的用户交互。
- 使用 Immer 来帮助你在 reducer 里直接修改状态。

### 使用 Context 深层传递参数

- Context 使组件向其下方的整个树提供信息。
- 传递 Context 的方法:
    1. 通过 `export const MyContext = createContext(defaultValue)` 创建并导出 context。
    2. 在无论层级多深的任何子组件中，把 context 传递给 `useContext(MyContext)` Hook 来读取它。
    3. 在父组件中把 children 包在 `<MyContext value={...}>` 中来提供 context。
- Context 会穿过中间的任何组件。
- Context 可以让你写出 “较为通用” 的组件。
- 在使用 context 之前，先试试传递 props 或者将 JSX 作为 `children` 传递。

### 使用 Reducer 和 Context 拓展你的应用
- 你可以将 reducer 与 context 相结合，让任何组件读取和更新它的状态。
- 为子组件提供 state 和 dispatch 函数：
    1. 创建两个 context (一个用于 state,一个用于 dispatch 函数)。
    2. 让组件的 context 使用 reducer。
    3. 使用组件中需要读取的 context。
- 你可以通过将所有传递信息的代码移动到单个文件中来进一步整理组件。
    - 你可以导出一个像 `TasksProvider` 可以提供 context 的组件。
    - 你也可以导出像 `useTasks` 和 `useTasksDispatch` 这样的自定义 Hook。
- 你可以在你的应用程序中大量使用 context 和 reducer 的组合。

## 创建一个 React 应用

### Next.js (App Router)

**[Next.js 的 App Router](https://nextjs.org/docs) 是一个 React 框架，充分利用了 React 的架构，支持全栈 React 应用。**

```
npx create-next-app@latest
```

### React Router (v7)

**[React Router](https://reactrouter.com/start/framework/installation) 是 React 最流行的路由库，可以与 Vite 结合创建一个全栈 React 框架**。它强调标准的 Web API 并提供了多个 [可部署的模板](https://github.com/remix-run/react-router-templates) 适用于各种 JavaScript 运行时和平台。

要创建一个新的 React Router 框架项目，请运行:

```
npx create-react-router@latest
```

### Expo (for native apps) [](https://zh-hans.react.dev/learn/creating-a-react-app#expo "Link for Expo (for native apps)")

**[Expo](https://expo.dev/) 是一个 React 框架，让你可以创建支持真正原生 UI 的通用 Android、iOS 和 Web 应用**。它为 [React Native](https://reactnative.dev/) 提供了一个 SDK，让原生部分更易于使用。要创建一个新的 Expo 项目，请运行：

```
npx create-expo-app@latest
```



---

# **🧠 React 系统学习知识地图（工程 / 架构向）**

我按 **5 个层级** 来拆，每一层解决一个“本质问题”。

---
## **L1：React 的世界观（必修 · 不写代码先懂）**

**这一层决定你后面会不会迷路**

### **你必须真正想清楚的 5 个问题**

1. **React 到底是什么？**
   - 不是 MVVM
   - 不是模板引擎
   - 是一个「状态 → UI 映射 + 调度系统」
2. **UI = f(state)**
   - render ≠ DOM 操作
   - re-render ≠ 性能差
   - diff / reconciliation 在解决什么问题
3. **组件的本质**
   - 组件不是“页面片段”
   - 组件是：
     - 状态边界
     - 行为封装
     - 抽象单元

4. **为什么函数组件赢了**
   - class 组件的问题
   - this / 生命周期 / 复用失败
   - Hooks 是“能力注入机制”

5. **React 的设计哲学**
   - 显式 > 隐式
   - 组合 > 继承
   - 数据流向单一

👉 **达标标志**：

你能不用“Vue 类比”，用自己的话解释 React 在干嘛。

---

## **L2：函数组件 & Hooks（核心内功）**

**90% 的 React 困惑都出在这一层没学透**

---
### **1️⃣ 函数组件的运行模型（非常重要）**

你要理解的是：

- 每一次 render：
  - 函数重新执行
  - 闭包重新创建
- state 并不是“变量”
- props 是快照

核心问题：

> **为什么不能在 render 里写副作用？**

---

### **2️⃣ Hooks 的真实规则（不是死记）**

#### **Hooks 三大类（要分清）**

- **状态类**：useState, useReducer
- **副作用类**：useEffect, useLayoutEffect
- **引用类**：useRef, useMemo, useCallback

你要搞清楚：

- 为什么 Hooks 只能在顶层调用
- 为什么依赖数组不是“语法糖”
- 闭包陷阱是怎么产生的

---

### **3️⃣ 副作用模型（这是 React 的灵魂）**

重点不是 API，而是：

- render 阶段 vs commit 阶段
- effect 什么时候执行
- cleanup 的真实用途
- 为什么会有 StrictMode 双执行

👉 **达标标志**：

你看到一个 bug，能判断是：

- 闭包问题？
- 依赖问题？
- 状态设计问题？

---

## **L3：组件设计 & 状态结构（工程分水岭）**

**从“会写组件”到“会设计组件”**

---

### **1️⃣ 状态应该放哪？**

你要反复问自己：

- 这是 UI 状态？
- 业务状态？
- 跨组件状态？
- 临时状态？

核心方法论：

- 状态提升（Lifting State Up）
- 状态下沉
- 单一数据源

---

### **2️⃣ 受控 vs 非受控**

这是前端里非常“反直觉”的点：

- input 为什么要受控？
- 什么时候反而不该受控？
- ref 的正确边界

---

### **3️⃣ 组件拆分的正确姿势**

避免两种极端：

- 巨型组件（God Component）
- 碎片组件（Prop 地狱）

你要学会：

- Container / Presentational
- 自定义 Hook 作为“逻辑组件”
- 用组合代替配置

👉 **达标标志**：

你能拆一个 500 行组件，而且拆完**更好维护**。

---

## **L4：状态管理 & 异步复杂度（认知升级）**

**这一层会让你理解：前端为什么“看起来很乱”**

---

### **1️⃣ 为什么 React 本身不解决所有状态？**

你要想明白：

- 本地状态 vs 全局状态
- UI 状态 vs Server 状态
- 同步状态 vs 异步状态

---

### **2️⃣ 状态管理工具的“分工”**

不要一上来就 Redux。

你需要理解的是：

- Redux：状态一致性 & 可预测性
- Zustand：轻量共享状态
- React Query / TanStack Query：
  - server state 才是重点
  - cache / stale / retry

👉 核心认知：

> **大部分“状态管理混乱”，其实是状态类型没分清**

---

### **3️⃣ 表单 / 异步 / 缓存**

- 表单为什么这么难？
- 异步请求为什么会产生竞态？
- loading / error / empty 的状态模型

---

## **L5：工程化 & React 生态（架构视角）**

**你会开始“像后端一样看前端”**

---
### **1️⃣ 构建与运行时**

你需要懂：

- Vite 在干嘛
- ESM vs CJS
- 开发态 vs 生产态差异
- Tree Shaking 为什么有时失效

### **2️⃣ React 生态全景**

你不一定都用，但要知道：

- Router 在解决什么问题
- SSR / CSR / SSG 的取舍
- Server Components 的真实目的
- 微前端为什么会出现

### **3️⃣ 架构级思考**

- 前端模块边界怎么划
- Design System 的本质
- Monorepo 的收益点

👉 **达标标志**：

你能设计一个**可长期演进的前端项目结构**。

---

# **🎯 最终能力画像（学完你会变成什么样）**

- 能解释 React 的设计取舍
- 能判断一个 React 方案“是不是在作死”
- 能写复杂 UI 而不失控
- 能和后端/产品讨论方案，而不是被 UI 拖着跑

---

# **一、React 系统学习顺序 + 推荐资料（工程向）**

> 目标不是“刷完教程”，

> 而是 **每一阶段结束，你的认知会发生变化**。

---

## **🧩 Phase 0：学习前的「正确姿势」**

在开始之前，先统一三条认知（非常重要）：

1. **不要一边学 React，一边纠结 UI 样式**
2. **不要急着上 Redux / Zustand**
3. **所有 Hook 问题，本质都是“函数 + 闭包 + 调度”**

你是工程背景，这三条能帮你省至少 30% 的弯路。

---

## **🟢 Phase 1：React 核心模型（必修，最重要）**

> 这一阶段决定你以后写 React 是“通透”还是“玄学”。

### **学习顺序**

1. **React 的渲染模型**
   - render 是什么
   - re-render 为什么不可怕
   - 虚拟 DOM 在干嘛（不是性能银弹）

2. **函数组件的运行机制**
   - 每次 render = 函数重新执行
   - state 不是变量
   - props 是快照

3. **Hooks 的本质**
   - useState / useReducer
   - useEffect 的时机
   - 闭包陷阱的来源

👉 这一阶段 **不需要 Router、不需要状态库**

---

### **推荐资料（精选，不堆）**

**首推（一定要）**

- ✅ React 官方文档（新版）
  - 重点看：
    - _Describing the UI_
    - _Adding Interactivity_
    - _Synchronizing with Effects_

> 新版文档质量很高，已经不是“API 手册”了

**辅助理解**

- Dan Abramov（React 核心作者）的博客
  关键词：
  - _A Complete Guide to useEffect_
  - _Making Sense of React Hooks_

---

### **达标标准（自测）**

你能回答这些问题，就可以进入 Phase 2：

- 为什么 Hooks 不能写在 if 里？
- 为什么 useEffect 的依赖不是“可选的”？
- 为什么 setState 是异步语义？
- 为什么 render 里不能写副作用？

---

## **🟡 Phase 2：组件设计 & 状态结构（工程分水岭）**

> 从“会用 React” → “能设计 React 代码”

### **重点能力**

1. **状态放哪？**
   - UI 状态
   - 业务状态
   - 跨组件状态

2. **组件拆分方法论**
   - 容器组件 vs 展示组件
   - 自定义 Hook = 逻辑复用单元
   - 避免 props drilling 的真正方式

3. **受控 / 非受控**
   - 表单为什么是重灾区
   - ref 的边界

---

### **推荐资料**

- 官方文档：
  - _Sharing State Between Components_
  - _Reusing Logic with Custom Hooks_
- 实战参考：
  - 看一些“不是教学”的开源项目
  - 重点看 **组件是怎么拆的，不是 UI**

---

### **达标标准**

- 一个 300–500 行组件，你能拆，并且拆完：
  - 状态更清晰
  - 副作用更少
  - 逻辑可复用

---

## **🟠 Phase 3：异步 & 状态管理（理解而不是迷信）**

> 这一阶段你会突然理解：

> **“前端复杂，不是因为前端菜，而是问题复杂”**

### **顺序建议**

1. **先不用 Redux**
2. 理解：
   - 本地状态 vs server state
   - loading / error / empty 的模型

3. 再看：
   - React Query（非常推荐）
   - Zustand（轻量共享状态）

---

## **🔵 Phase 4：工程化 & 架构（你会很快上手）**

你有后端经验，这部分会是“熟悉的陌生人”：

- Vite 构建流程
- 环境配置
- 前端目录结构设计
- Monorepo（可选）

---

# **二、实战部分：我们直接拆一个「真实后台页面」**

现在进入 **你选的第 2️⃣ 步**。

我不会给你玩具 Demo，我们直接用**你一定会遇到的页面**。

---

## **🎯 实战场景（我们接下来要做的）**

> **服务发布管理平台 – 服务实例列表页**

典型需求（非常真实）：

- 服务列表（分页）
- 状态展示（运行中 / 停止 / 异常）
- 操作：
  - 启动 / 停止
  - 查看日志
- 异步加载
- loading / error / retry
- 局部刷新（单行更新）

---

## **下一步我会做什么（你只需要跟着）**

在下一条回复里，我会：

1. **先不给代码**
2. 带你做一件很关键的事👇

👉 **只做一件事：React 视角下的页面“状态建模”**

我们会一起回答：

- 这个页面有哪些状态？
- 哪些是 UI 状态？
- 哪些是 server state？
- 哪些组件应该拥有状态？

这是 90% React 新手最缺的能力。

---

### **在继续之前，我只问你一个确认问题（很关键）**

👉 你更想用哪个技术栈来做这个实战？

- A️⃣ React + TypeScript + Vite
- B️⃣ React + JavaScript（先专注模型）

回我 **A 或 B**，

下一步我们直接开拆，不再空谈。


---

> padding 调整的是一个 html 元素内部, 文本或图片和此 html 元素边界的距离
> margin 调整的是不同的 html 元素之间的距离

border 的一些样式设置

```css
box-shadow: 0 0 3px 3px #efb762;  /* 上下左右及颜色*/
border-radius: 9px;  /* 每个角圆角化9个像素 */
border-radius: 80px 20px; /* 左上右下设置圆角化 80像素，上右下左圆角化 20像素 */
border-radius: 30px 25px 60px 12px; /* top-left top-right bottom-right bottom-left */

transform: rotate(-0.6deg);  /* 逆时针旋转 0.6度  顺时针为正数*/
```
