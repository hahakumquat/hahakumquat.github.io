---
layout: post
title: "Nonlinearity: Basis Functions"
date: 2018-01-08
categories: datasci
hasMath: "Tex-AMS_CHTML"
tags:
- "machine learning"
- "non-linearity"
- "basis functions"
---

We often work in linear space, but you might ask how we could capture nonlinearity? The answer lies in basis functions.

Suppose we have data with a single, real-valued covariate input and that follows a quadratic trend. We'd like to fit a quadratic regression. How can we use the same tooling we have for linear regression and apply it to this problem?

Our problem as a linear regression would look like:

$$y = w_1x_1 + w_0$$

So our $\mathbf{x}$ would look like:

$$\begin{bmatrix}
1 \\
x_1
\end{bmatrix}$$

And our $\mathbf{w}$ would look like:

$$
\begin{bmatrix}
w_0 \\
w_1
\end{bmatrix}
$$

To capture this quadratic form, we can simply use a basis function.

# Basis Functions

Let $\phi(\mathbf{x})$ be a function that maps an input $\mathbf{x}$ to a new vector output of any dimensional output. For example, we can have $\phi$ do the following transformation:

$$\begin{bmatrix}
1 \\
x_1
\end{bmatrix} \to \begin{bmatrix}
1 \\
x_1 \\
x_1^2
\end{bmatrix}$$

Because we've increased the dimensionality of $\mathbf{x}$, we'd also need to increase the dimensionality of $\mathbf{w}$. As a result, our new lienar regression would look like:

$$y = \mathbf{w}^\top \phi(\mathbf{x}) = w_2x_1^2 + w_1x_1 + w_0$$

Ta-da! We have a quadratic regresion! Of course, we're not limited to polynomial regressions. Our $\phi$ basis function can transform our feature vector into any output we want. It's simply a matter of choosing the right functions to perform the basis transformation, but that's a whole ordeal on its own. The point is that it is indeed possible to use the same techniques learned for linear regression in non-linear cases just by basis functions. Ultimately, everything ends up being something like a linear model (except for Random Forests and the like, TBA).