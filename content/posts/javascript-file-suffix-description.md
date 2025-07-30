---
date: "2025-07-23T09:56:34+08:00"
draft: false
title: "Javascript不同文件后缀的含义"
tags: ["js"]
ShowToc: true
TocOpen: true
---

## JavaScript 的不同文件后缀名的含义

| **后缀名** | **含义/用途**                                         | **常见位置或用途说明**                                       |
| ---------- | ----------------------------------------------------- | ------------------------------------------------------------ |
| .js        | JavaScript 文件，可能是 CommonJS 或 ESModule          | 项目源代码或编译产物                                         |
| .mjs       | JavaScript ES Module（明确标注为模块）                | Node.js 中使用 ESModule 时常见                               |
| .cjs       | JavaScript CommonJS 模块（明确标注）                  | 当项目默认使用 ESModule，但某些文件需保留 CJS 语法           |
| .ts        | TypeScript 源代码文件                                 | 支持类型系统和新语法特性，需编译为 .js 才能运行              |
| .cts       | TypeScript 的 CommonJS 模块                           | .ts 的 CJS 对应，ESM 项目中显式指定 CJS 模块                 |
| .mts       | TypeScript 的 ES Module 模块                          | .ts 的 ESM 对应                                              |
| .d.ts      | TypeScript 类型声明文件                               | 只包含类型信息，无实现，用于类型补全或公共 API 描述          |
| .jsx       | JavaScript + JSX（React）                             | React 组件的源代码，支持 JSX 语法                            |
| .tsx       | TypeScript + JSX（React）                             | 结合 TypeScript 类型检查与 React JSX                         |
| .json      | JSON 文件                                             | 配置、数据、模块导入（Node.js / Vite / webpack 支持 import） |
| .node      | 原生 Node.js 模块（二进制）                           | C/C++ 编译生成的原生插件，Node.js 用于加载本地扩展           |
| .wasm      | WebAssembly 模块                                      | 浏览器或 Node.js 中导入的高性能二进制模块                    |
| .map       | SourceMap 文件                                        | 用于调试编译后的代码（.js.map / .ts.map）                    |
| .lock      | 锁定文件依赖版本（package-lock.json, pnpm-lock.yaml） | 不是 JS 文件，但项目重要组成部分                             |

### **✅ 总结重点分类**

- **代码类型**：.js, .ts, .mjs, .cjs, .jsx, .tsx, .vue
- **类型声明**：.d.ts
- **编译产物**：.js, .map
- **配置文件**：.js, .ts, .json, .yaml, .env
- **模块说明**：.mjs, .cjs, .mts, .cts
- **框架扩展**：.vue, .svelte, .astro, .ejs, .hbs
