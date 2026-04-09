---
date: "2025-08-04T09:57:04+08:00"
draft: false
title: "vue3 动态响应的原理"
---

Vue3 的核心原理，ChatGPT 老师给出来的内容，记录下来对于理解 vue 很有帮助

我们来动手实现一个最小可运行的响应式系统，它能模拟 Vue 3 中 reactive、ref、effect、track 和 trigger 的核心逻辑。

## **🧩 目标功能**

1. 实现 reactive(obj) 和 ref(value)。
2. 实现 effect(fn)：收集依赖并在数据变更时重新运行。
3. 实现 track：读取属性时记录依赖。
4. 实现 trigger：写入属性时触发依赖。

## **✅ 最简实现代码**

```js
// 用于记录当前正在执行的副作用函数
let activeEffect = null;

// targetMap 用于存储依赖映射：target -> key -> effects
const targetMap = new WeakMap();

// 收集依赖：在 get 时调用
function track(target, key) {
  if (!activeEffect) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }

  deps.add(activeEffect);
}

// 触发依赖：在 set 时调用
function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const deps = depsMap.get(key);
  if (deps) {
    for (const effect of deps) {
      effect();
    }
  }
}

// 注册副作用函数
function effect(fn) {
  activeEffect = fn;
  fn(); // 立即执行一次，触发 getter 从而 track
  activeEffect = null;
}

// 实现 reactive
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      trigger(target, key);
      return result;
    },
  });
}

// 实现 ref
function ref(value) {
  const obj = {
    get value() {
      track(obj, "value");
      return value;
    },
    set value(newVal) {
      value = newVal;
      trigger(obj, "value");
    },
  };
  return obj;
}
```

## **🚀 使用示例**

```js
const state = reactive({ count: 0 });

effect(() => {
  console.log("count changed to:", state.count);
});

state.count++; // 会触发 effect 再次执行
const age = ref(18);

effect(() => {
  console.log("age is:", age.value);
});

age.value = 20; // 会触发 effect 再次执行
```

## **📌 总结**

| **功能**   | **简述**                         |
| ---------- | -------------------------------- |
| effect(fn) | 注册副作用函数（依赖收集器）     |
| track()    | 读取数据时记录当前副作用函数依赖 |
| trigger()  | 写入数据时触发依赖函数重新运行   |
| reactive() | 用 Proxy 包装对象以支持响应式    |
| ref()      | 用 getter/setter 包装基本值      |

这个模型就是 Vue 3 响应性系统的基本结构，当然 Vue 3 实现里更复杂，支持嵌套对象、effect 的调度与清理、懒执行等等，但核心思想就是这里的 track -> trigger。
