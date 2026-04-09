---
date: "2025-07-30T20:25:52+08:00"
draft: false
title: "Tailwind CSS 类名前缀总结"
tags: ["css"]
ShowToc: true
TocOpen: true
---

下面是对 **Tailwind CSS 类名前缀**（开头简写）的一个系统总结，涵盖了常用的样式类别以及它们控制的样式类型，便于查阅与理解：

## **🧩 Tailwind CSS 类名前缀速查表**

| **类名前缀**                      | **作用描述**         | **影响的 CSS 属性**                                    |
| --------------------------------- | -------------------- | ------------------------------------------------------ |
| w-                                | **宽度**             | width                                                  |
| h-                                | **高度**             | height                                                 |
| min-w-                            | 最小宽度             | min-width                                              |
| min-h-                            | 最小高度             | min-height                                             |
| max-w-                            | 最大宽度             | max-width                                              |
| max-h-                            | 最大高度             | max-height                                             |
| p-                                | **内边距 (padding)** | padding（所有）                                        |
| px-                               | 水平内边距           | padding-left、padding-right                            |
| py-                               | 垂直内边距           | padding-top、padding-bottom                            |
| pt-                               | 上内边距             | padding-top                                            |
| pr-                               | 右内边距             | padding-right                                          |
| pb-                               | 下内边距             | padding-bottom                                         |
| pl-                               | 左内边距             | padding-left                                           |
| m-                                | **外边距 (margin)**  | margin（所有）                                         |
| mx-                               | 水平外边距           | margin-left、margin-right                              |
| my-                               | 垂直外边距           | margin-top、margin-bottom                              |
| mt-                               | 上外边距             | margin-top                                             |
| mr-                               | 右外边距             | margin-right                                           |
| mb-                               | 下外边距             | margin-bottom                                          |
| ml-                               | 左外边距             | margin-left                                            |
| text-                             | **文字样式**         | color, align, size, weight, transform                  |
| font-                             | 字体粗细、字体族     | font-weight, font-family                               |
| leading-                          | 行高                 | line-height                                            |
| tracking-                         | 字间距               | letter-spacing                                         |
| bg-                               | **背景样式**         | background-color, background-image, background-size 等 |
| border-                           | **边框样式**         | border-width, border-color 等                          |
| rounded-                          | 圆角                 | border-radius                                          |
| shadow-                           | 阴影                 | box-shadow                                             |
| flex、grid、inline-               | 布局模式             | display                                                |
| items-                            | 垂直方向对齐         | align-items                                            |
| justify-                          | 水平方向对齐         | justify-content                                        |
| gap-                              | 容器子元素间距       | gap                                                    |
| space-x-                          | 横向子元素间距       | margin-left                                            |
| space-y-                          | 纵向子元素间距       | margin-top                                             |
| z-                                | 层级                 | z-index                                                |
| opacity-                          | 透明度               | opacity                                                |
| overflow-                         | 溢出控制             | overflow, overflow-x, overflow-y                       |
| cursor-                           | 鼠标样式             | cursor                                                 |
| transition、duration-             | 动画过渡             | transition, transition-duration 等                     |
| ease-                             | 缓动函数             | transition-timing-function                             |
| scale-、rotate-、translate-       | 变换                 | transform                                              |
| absolute、relative、fixed、sticky | 定位模式             | position                                               |
| top-、left-、right-、bottom-      | 定位偏移             | top, left 等                                           |
| hidden、block、inline-block       | 显示类型             | display                                                |

## **📌 特殊响应式与状态前缀（组合使用）**

| **前缀**                     | **说明**       | **示例**                       |
| ---------------------------- | -------------- | ------------------------------ |
| sm: / md: / lg: / xl: / 2xl: | 响应式断点     | md:w-1/2（中等屏幕宽度为 50%） |
| hover:                       | 悬停状态       | hover:bg-blue-500              |
| focus:                       | 聚焦状态       | focus:ring                     |
| disabled:                    | 禁用状态       | disabled:opacity-50            |
| dark:                        | 深色模式       | dark:bg-gray-800               |
| group-hover:                 | 父元素悬停触发 | group-hover:text-red-500       |
