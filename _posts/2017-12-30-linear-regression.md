---
layout: post
title:  "Linear Regression: A Mathematical Approach"
date:   2017-12-30
categories: datasci
img: ""
hasMath: "TeX-AMS_CHTML"
tags:
- "machine learning"
- "linear regression"
scripts:
- "https://d3js.org/d3.v4.min.js"
- "/assets/js/vis/knn.js"
---

In this post, we'll take a look at linear regression from a mathematical lens, ignoring the statistical interpretation. Here, we provide the derivation and interpretation of the closed form solution for the weights.

In contrast with non-parametric regression approaches like K-Nearest Neighbors where an estimation is made simply by referring to other datapoints, parametric regression uses the data to optimize parameters (also known as weights) $\mathbf{w}$. These weights are then used to make future predictions. Be sure to read my blog post on my introduction to regression and KNN if that's not immediately clear.

Parametric modeling can be broken down into three main steps:
1. Defining a loss criterion $\mathcal{L}$.
2. Choosing a hypothesis $h$ with parameters $\mathbf{w}$.
3. Optimizing $\mathbf{w}^\star$ by minimizing the loss function $\mathcal{L}$.

To formalize this idea, we define a hypothesis function $\hat{y} = h(\mathbf{x}; \mathbf{w})$ where an estimate of a true $y$, $\hat{y}$ is a function of a feature vector $\mathbf{x}$ and given fixed parameters $\mathbf{w}$. To choose a specific $\mathbf{w^\star}$, we will then select a loss function $\mathcal{L}(\mathbf{w})$ such that the minimum of the loss suggests the best fit to the data.

In linear regression, we define $h(\mathbf{x}; \mathbf{w})$ to be a linear combination of the features with an added bias parameter $w_0$:

$$h(\mathbf{x}; \mathbf{w}, w_0) = w_0 + \sum_{i=1}^m x_i w_i = \mathbf{w^\top x} + w_0$$

$$\mathbf{x}, \mathbf{w} \in \mathbb{R}^m, w_0 \in \mathbb{R}$$

For notational simplicity, we often implicitly include the bias term $w_0$ in $\mathbf{w}$ and prepend a 1 to the feature vector. We will instead write the above expression assuming the bias term is within the weight vector:

$$\hat{y} = h(\mathbf{x^1}; \mathbf{w^1}, w_0) \to h(\mathbf{x}; \mathbf{w}) = \sum_{i=1}^{m+1} x_i w_i = \mathbf{w^\top x}$$

$$\mathbf{x}, \mathbf{w} \in \mathbb{R}^{m+1}, \mathbf{x} = \begin{bmatrix}1 \\ \mathbf{x^1}\end{bmatrix}, \mathbf{w} = \begin{bmatrix}w_0 \\ \mathbf{w^1} \end{bmatrix}$$

There are many loss functions we can use, but one common loss function is the least squares loss. This is also known as the sum-of-squares residuals or error, SSR/SSE:

$$\mathcal{L}(\mathbf{w}) = \sum_{i=1}^n (y_i - \hat{y_i})^2 = \sum_{i=1}^n (y_i - \mathbf{w}^\top \mathbf{x}_i)^2$$

One reason why we use least squares is that the function is convex. This allows us to solve for the optimum by using matrix calculus! We'll write the derivative with respect to a vector as the following:

$$\frac{\partial g(\mathbf{z})}{\partial \mathbf{z}} = \begin{bmatrix}\frac{\partial g(z)}{\partial z_1} \\ \vdots \\ \frac{\partial g(z)}{z_m}\end{bmatrix}$$

From this definition, it should be relatively straightforward to derive any of the math done here. To find the $\mathbf{w^\star}$ that yields the minimum loss, we can simply take the derivative of the loss with respect to $\mathbf{w}$ and solve for 0. The solution of $\mathbf{w}$ will be the parameter vector that minimizes the loss function.

$$\frac{\partial \mathcal{L}(\mathbf{w})}{\partial \mathbf{w}} = \sum_{i=1}^n -2(y_i - \mathbf{w}^\top\mathbf{x_i}) \mathbf{x}_i$$

$$= -2 \sum_{i=1}^n y_i\mathbf{x}_i + 2\sum_{i=1}^n \mathbf{x}_i \mathbf{x}_i^\top \cdot \mathbf{w}$$

$$\mathbf{w^\star} = \left(\sum_{i=1}^n \mathbf{x}_i^\top \mathbf{x}_i\right)^{-1}\cdot \sum_{i=1}^n y_i \mathbf{x}_i$$

That's pretty ugly. It looks a lot better if you work through this using matrix math. The matrix equivalent of the loss function is:

$$\mathcal{L}(\mathbf{w}) = (\mathbf{y} - \mathbf{Xw})^\top(\mathbf{y} - \mathbf{Xw})$$

$$=\mathbf{y}^\top\mathbf{y} - \mathbf{y}^\top\mathbf{Xw} - \mathbf{w}^\top\mathbf{X}^\top\mathbf{y} + \mathbf{w}^\top \mathbf{X}^\top \mathbf{X} \mathbf{w}$$

These are all scalars. The transpose of a scalar is the same scalar, so the middle two terms are equal.

$$=\mathbf{y}^\top\mathbf{y} - 2\mathbf{w}^\top\mathbf{X}^\top\mathbf{y} + \mathbf{w}^\top \mathbf{X}^\top \mathbf{X} \mathbf{w}$$

Let's take a derivative:

$$\frac{\partial \mathcal{L}(\mathbf{w})}{\partial \mathbf{w}} = -2 \mathbf{X}^\top \mathbf{y} + (\mathbf{X}^\top \mathbf{X} + (\mathbf{X}^\top \mathbf{X})^\top)\mathbf{w}$$

$$\frac{\partial \mathcal{L}(\mathbf{w})}{\partial \mathbf{w}} = -2 \mathbf{X}^\top \mathbf{y} + 2\mathbf{X}^\top \mathbf{X}\mathbf{w}$$

$$\mathbf{w^\star} = (\mathbf{X}^\top\mathbf{X})^{-1}\mathbf{X}^\top\mathbf{y}$$

This is the linear algebra definition of a projection of $\mathbf{y}$ onto the column space of $\mathbf{X}$! Thus, the optimal regression line is defined by the projection of your data onto the feature space. In the next post on linear regression, we'll be extending this interpretation into a stastical perspective.