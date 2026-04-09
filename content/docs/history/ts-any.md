---
date: "2025-07-24T11:01:00+08:00"
draft: false
title: "TypeScript 的三种特殊类型"
---

## TypeScript 的三种特殊类型

### any

表示任意类型，对 TypeScript 的类型检查器完全关闭检查。编译器不会对它进行任何类型检查，也不会自动补全类型信息。

```TypeScript
let value: any;

value = 42;
value = "hello";
value = [1, 2, 3];

console.log(value.toFixed()); // 编译器不会报错，但运行时可能出错
```

- 兼容所有类型（可以赋值给任何类型，也可以接受任何类型赋值）
- 不安全，等于放弃了 TypeScript 的类型系统

### unknown

也是可以接受任何类型的变量，但不能直接使用，除非先做类型检查或断言。安全的任意类型

```TypeScript
let value: any;

value = 42;
value = "hello";
value = [1, 2, 3];

// console.log(value.toFixed()); // 报错 Object is of the 'unknown'

if ( typeof value == "number" ) {
  console.log(value.toFixed()); // 先检查后使用
}
```

- 可以接受任何类型赋值（类似 any）
- 不能直接使用（需要类型缩小或断言）
- 更安全，更适合函数入参或外部数据

### never （不可能的类型）

表示永远不会发生的值。 通用用于明确函数不会返回（抛错、死循环）；类型保护不完整时，确保类型覆盖完整性。

```TypeScript
// 抛出的异常函数
function throwError(msg: string): never {
  throw new Error(msg);
}


// 死循环函数
function loopForever(); never {
  while (true) {}
}

// 不可达的分支
function exhaustiveCheck(value: "a" | "b"): number {
  if ( value === "a") return 1;
  if ( value === "b") return 2;

  // value 的类型为 never, 如果执行到这里说明之前的类型判断不完整
  const check: never = vlaue;
  return check;
}
```

### 总结对比表

| **特性**         | any                  | unknown               | never                    |
| ---------------- | -------------------- | --------------------- | ------------------------ |
| 可接受任何值     | ✅ 是                | ✅ 是                 | ❌ 否                    |
| 可赋值给其他类型 | ✅ 是                | ❌ 否（需断言/缩小）  | ✅ 是                    |
| 可被其他类型赋值 | ✅ 是                | ✅ 是                 | ❌ 否                    |
| 编译器检查       | ❌ 无类型检查        | ✅ 有（使用前需检查） | ✅ 编译器保证类型不可达  |
| 安全性           | ❌ 不安全            | ✅ 安全               | ✅ 类型系统完整性保障    |
| 使用场景         | 快速开发、兼容旧代码 | 外部数据、泛型参数    | 永不返回函数、穷尽检查等 |
