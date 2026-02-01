---
layout: post
title: "Classification and Perceptron"
date: 2018-01-09
categories: datasci
hasMath: "Tex-AMS_CHTML"
tags:
- "machine learning"
- "classification"
- "perceptron"
---

We now leave the land of predicting real-numbered values to look at data classification. The discussion will conclude with one of the fundamental concepts behind classification, the Perceptron algorithm.

# Introduction to Classification

The classification problem involves specifying which category a data point belongs to. For instance, if you have a feature vector of an individual's political preferences, a classification problem might be to classify the individual as a Democrat or Republican. This is an example of a *binary classification* since there are only two classes, Democrat or Republican. 

We can express our output space as:

$$\mathcal{y} = \{-1, 1\}$$

Note that this is different from the regression problem where $\mathcal{y} = \mathbb{R}$.

What if we wanted to also consider Libertarians, the Green Party, and Independents as possible political parties for an individual? We can instead do multiclass classification for $K$ classes where $$\mathcal{y} = \{C_1, C_2, \ldots, C_K \}$$. Multiclass classification can be found in a variety of applications such as image recognition, disease diagnostics, and product recommendation. In this post, we will only cover the binary case.

# KNN for Classification

Before discussing the parameterized classification problem, we first discuss the KNN solution. For some input feature vector $\mathbf{x}$, we classify $\mathbf{x}$ by taking the majority of the $k$ nearest points:

$$
\hat{y} = \begin{cases}
1 & \sum_{i=1}^k y^{(i)} > 0\\
-1 & \text{otherwise}
\end{cases}
$$

Of course, KNN is still subject to the same problems it had in the linear regression case, namely overfitting and the need to keep all your data around at all times.

# Binary Linear Classification

Let's take the same modeling approach we used in linear regression and use it to classify. Define a hypothesis function $h$:

$$h(\mathbf{x}; \mathbf{w}) = \mathbf{w}^\top\mathbf{x}$$

We can use this line (hyperplane) to split the space into two subspaces. If $$h(\mathbf{x}; \mathbf{w}) > 0$$, then we predict $\hat{y} = 1$. Otherwise, we predict $$\hat{y} = -1$$.

# Determining the Decision Boundary

The set of points on this hyperplane is known as the *decision boundary*. These are defined as the $\mathbf{x}$ where $$\mathbf{w}^\top\mathbf{x} = 0$$. To determine the decision boundary, we would like to find its orientation and position. 

The orientation of this hyperplane is determined solely by $\mathbf{w}$ since $\mathbf{w}$ is orthogonal to the hyperplane. The proof is simple:

$$\mathcal{S} = \{\mathbf{x} \in \mathcal{X} | \mathbf{w}^\top\mathbf{x} + w_0 = 0 \}$$

Let $\mathbf{x}_1, \mathbf{x}_2$ be in $\mathcal{S}$. Let $\mathbf{s} = \mathbf{x}_1 - \mathbf{x}_2$.

$$\begin{align*}
\mathbf{w}^\top\mathbf{s} &= \mathbf{w}^\top(\mathbf{x}_1 - \mathbf{x}_2) \\
&= \mathbf{w}^\top\mathbf{x}_1 - \mathbf{w}^\top\mathbf{x}_2 \\
& = w_0 - w_0 = 0
\end{align*}$$

So $\mathbf{w}$ is orthogonal to the hyperplane.

To determine the decision boundary's location, we can use Lagrange multipliers to solve an optimization problem. We will try to find the closest point to the origin (the location by definition):

$$\arg_{\mathbf{x}}\min \mathbf{x}^\top\mathbf{x}$$

$$s.t. \mathbf{w}^\top \mathbf{x} + w_0 = 0$$

We then incorporate the constraint for the Lagrange multiplier:

$$L(\mathbf{x}, \lambda) = \mathbf{x}^\top\mathbf{x} + \lambda(\mathbf{w}^\top\mathbf{x} + w_0 - 0)$$

$$\frac{\partial L(\mathbf{x}, \lambda)}{\partial \mathbf{x}} = 2\mathbf{x} + \lambda \mathbf{w} := 0$$

$$\frac{\partial L(\mathbf{x}, \lambda)}{\partial \lambda} = \mathbf{w}^\top\mathbf{x} + w_0 := 0$$

Solving the system of equations:

$$\mathbf{w}^\top(-\lambda\mathbf{w} / 2) + w_0 = 0$$

$$\lambda = \frac{2w_0}{\mathbf{w}^\top\mathbf{w}}$$

Thus, the distance from the origin is a function of $$ \frac{2w_0}{\mathbf{w}^\top\mathbf{w}}$$.

# Linear Separability

We know how to construct a decision boundary with a given $\mathbf{w}$, but we haven't looked at the data yet. Oftentimes, data may not be *linearly separable*, meaning there may not be a hyperplane that separates the data into the two classes. This could be due to noise or an incorrect linear space.

One solution would be to use basis functions. Doing so introduces nonlinearity that may correctly divide the data.

# Training and Loss

Now that we have an idea of how to construct a classification model, we now need to train it. But in order to train a model, we need a loss function. One instinct might be to try using the same distance-based loss functions we've seen thus far. Take, for instance, least squares:

$$\mathcal{L}(\mathbf{w}) = \sum_{i=1}^n (y_i - h(\mathbf{x}_i; \mathbf{w}))^2, y_i \in \{-1, 1\}$$

But think about what this loss is doing. Here, we penalize estimations based on their distance to the true class, $$\pm 1$$. This means that points that are correctly classified will be penalized based on how far away from the true class they are. Thus, an outlier point can drastically shift the boundary, even if it's classified correctly.

Instead, we need to target the accuracy of a classification, and for that, we'll use the Perceptron algorithm.

# Perceptron Algorithm

The Perceptron algorithm is as follows:

1. Check if point is classified correctly.
2. If it is, move on.
3. Otherwise, adjust weights with gradient.

To run perceptron, we'll need an accuracy-based loss function with an informative derivative that tells us how to change our weights.

# 0/1 Activation Function

*Activation functions* are the answer to our need for accuracy-based loss functions. Activation functions map real numbers to a discrete set of values. The first activation function we'll look it is the 0/1 activation function:

$$f_{0, 1}(z) = \begin{cases}
1 & z > 0 \\
0 & \text{otherwise}
\end{cases}$$

Our loss function would then be the sum of occurrences where the prediction and true value differ:

$$\mathcal{L}(\mathbf{w}) = \sum_{i=1}^n f_{0/1}(-h(\mathbf{x_i}; \mathbf{w}) \cdot y_i)$$

There is a problem with the 0/1 activtion loss, but to understand it, we'll first talk about how the derivative-based update would work.

# Gradient Descent

The idea of gradient descent is that we wish to update our weights in a way that minimizes the loss. To do so, we first compute the gradient of our loss with respect to our weights, $$\frac{\partial \mathcal{L}(\mathbf{w})}{\partial \mathbf{w}}$$. This represents the slope vector of greatest ascent. We can then update our weights by subtracting this gradient vector scaled by some learning rate parameter, $\eta$:

$$\mathbf{w} \leftarrow \mathbf{w} - \eta \cdot \frac{\partial \mathcal{L}(\mathbf{w})}{\partial \mathbf{w}}$$

Unfortunately, the 0/1 activation function does not have an informative derivative. At $z=0$, the slope is undefined, and 0 otherwise. As a result, performing a weight adjustment based on the derivative will yield 0 change.

# ReLU Function

The solution to this would be to use the rectified linear unit activation function (ReLU). The function is defined as:

$$f_{relu}(z) = \begin{cases}
z & z > 0 \\
0 & \text{otherwise}
\end{cases} = \max(0, z)$$

In the 0/1 activation function, a misclassification always had an error value of 1. Here, the farther off a point is from its correct classification, the worse the penalty. As a result, the derivative is 1 for values greater than 0 and 0 otherwise, giving us a nonzero value during gradient descent!

# Perceptron Loss

Let's tie this all together. The Perceptron loss is:

$$\mathcal{L}(\mathbf{w}) = \sum_{i=1}^n f_{relu}(-h(\mathbf{x}_i; \mathbf{w}) \cdot y_i) = \sum_{i=1; y_i \neq \hat{y}_i}^n (\mathbf{w}^\top\mathbf{x}_i + w_0) \cdot y_i$$

In other words, this loss is the total distance of all the misclassified points.

# Stochastic Gradient Descent (SGD)

The update step requires taking the derivative of the loss with respect to your weights. This requires going through all your data over and over again and can often be time consuming. Another strategy commonly used in practice is stochastic gradient descent (SGD). In SGD, a gradient descent update is performed for every individual datapoint's loss until model convergence, rather than after observing all the data. Oftentimes, this performs better in practice than regular gradient descent.

To be clear, the gradient of the total-data loss would be:

$$\frac{\partial \mathcal{L}(\mathbf{w})}{\partial \mathbf{w}} = - \sum_{i=1; y_i \neq \hat{y}_i}^n y_i \cdot \mathbf{x}_i$$

Whereas the stochastic, single-point version would be:

$$\frac{\partial \mathcal{L}^{(i)}(\mathbf{w})}{\partial \mathbf{w}} = -y_i \mathbf{x}_i$$

So the update after each datapoint would be:

$$\mathbf{w}^{(t+1)} \leftarrow \mathbf{w}^{(t)} + \eta y_i \mathbf{x}_i$$

# The Perceptron Algorithm, Detailed

The final Perceptron algorithm is therefore:

1. Iterate over data
- If all classifications are correct, do nothing
- Else, add $y_i \mathbf{x}_i$ and $y_i$ to w_0 (don't forget to perform the update rule by taking the gradient with respect to $w_0$ as well, this wasn't detailed here)
2. Repeat until no classification errors are made

If the data is linearly separable, the algorithm will converge!