---
title: '数学公式示例'
weight: 1
math: true
---

# 数学公式示例

使用原生 Markdown 语法渲染数学公式，无需 shortcode。

## 行内公式

爱因斯坦质能方程：$E = mc^2$

欧拉公式：$e^{i\pi} + 1 = 0$

二次方程求根：$x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$

## 块级公式

傅里叶变换：

$$
f(x) = \int_{-\infty}^\infty\hat f(\xi)\,e^{2 \pi i \xi x}\,d\xi
$$

正态分布：

$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}
$$

矩阵：

$$\begin{pmatrix} a & b \\ c & d \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} ax + by \\ cx + dy \end{pmatrix}$$

## 折叠公式推导

<details>
<summary>展开：傅里叶变换推导过程</summary>

傅里叶变换将时域信号转换为频域：

$$f(x) = \int_{-\infty}^\infty\hat f(\xi)\,e^{2 \pi i \xi x}\,d\xi$$

其逆变换为：

$$\hat f(\xi) = \int_{-\infty}^\infty f(x)\,e^{-2 \pi i \xi x}\,dx$$

两者互为一对，$\xi$ 表示频率变量。

</details>

<details>
<summary>展开：正态分布参数说明</summary>

$$f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}$$

- $\mu$：均值，控制分布中心位置
- $\sigma$：标准差，控制分布宽窄
- $\sigma^2$：方差

当 $\mu=0, \sigma=1$ 时为**标准正态分布**。

</details>

## 常用符号速查

| 符号 | 命令      | 符号 | 命令      |
| ---- | --------- | ---- | --------- |
| ∫    | `\int`    | ∑    | `\sum`    |
| ∞    | `\infty`  | ±    | `\pm`     |
| ×    | `\times`  | √    | `\sqrt{}` |
| α    | `\alpha`  | β    | `\beta`   |
| γ    | `\gamma`  | δ    | `\delta`  |
| ξ    | `\xi`     | π    | `\pi`     |
| σ    | `\sigma`  | μ    | `\mu`     |
| λ    | `\lambda` | ω    | `\omega`  |

完整符号列表参考：[KaTeX Supported Functions](https://katex.org/docs/supported.html)

## 注意事项

多行公式（矩阵等）需写在一行内，避免换行被 Markdown 解析器处理：

```
$$\begin{pmatrix} a & b \\ c & d \end{pmatrix}$$
```
