---
layout: post
title:  "Model Selection"
date:   2018-01-06
categories: datasci
img: ""
hasMath: "TeX-AMS_CHTML"
tags:
- "machine learning"
- "model selection"
- "overfitting"
---

So far, we've looked at linear regression and K-Nearest Neighbors as potential models for estimating real-valued data. But how do we know which model is the best to use? In this post, we discuss overfitting, bias-variance decomposition, and regularization as factors when considering models.

# Naive Solution

When choosing a model, it might be tempting to select the model with the minimum loss. After all, if our model matches our data perfectly, why wouldn't we use it? Unfortunately, this leads to the problem of *overfitting*, the issue where the model adheres too closely to the data we possess. Overfitting can occur for several reasons:

- Insufficient data: the data doesn't capture enough variation. If we roll a die 6 times and all of them happen to be exclusively odd numbers, then our model might think we have 0 probability of getting an even number.

- Noise: we might mistake noise to be a property of the data. Perhaps, because of high noise, we might want to use a high-degree polynomial regression to decrease the loss, even though a linear model would work perfectly fine.

- Irrelevant features: our model might rely on correlated features that have little to do with the output. For example, if a teacher's socks are red and it tends to rain, we still wouldn't care about the teacher's sock color since it's absurd to think the two are related (unless the teacher chooses to wear red socks on rainy days).

To prevent overfitting, we need to make decisions about what data is relevant to our problem and how much we should believe in our judgment.

# Train Validate Test

To calculate our model's performance, we often split our data into a training set, validation set, and test set. The training set is used to train a model, the validation set is used to calculate the performance of a model, and the test set is used to measure the error in our model. The idea is that we train different models with the training set, compare them based on the error of the validation set (called the *validation error*), and finally select a model (usually the one with the minimum validation erorr), reporting its error on the test set (the *test error*). Notice that we do not look at the test set until the model has been selected. Our test set is meant to simulate the performance of the model on new, unforeseen data. If we were to evaluate the performance of our model on our test set, we would essentially be cheating on the efficacy of our model. This is known as *peeking* and should be avoided. The error in the test error is an unbiased estimate of the *generalization error*, the prediction accuracy on unseen data, whereas the validation error is a biased estimate of the generalization error.

When considering how exactly to split your data, there are two factors to keep in mind. If your training set is too small, then none of your models will learn very well. However, if your validation set is too small, then the performance statistic will have high variance. A safe split of the data would be 60% train, 20% validation, 20% test.

# K-Fold Cross Validation

Sometimes, you might not have enough data to split your data into the three groups. One such solution to this problem would be to perform *k-fold cross validation*. The idea is you split your data into $k$ partitions, assign $k-1$ groups to training set, assign the remaining group to the validation set, and measure your model's accuracy. The average of your accuracies over the $k$ different configurations would be your model's validation error. This is a standard procedure, even though the experiments now lose independence.

# Bias-Variance Decomposition

$K$-fold cross validation improves the generalizability of the model, but we'd then have to train our model $k$ times, one per data configuration, greatly increasing the model generation time. For a better method in improving generalization, we need to understand the tradeoff between bias and variance.

*Bias* is the systematic error, or error that arises because the model tends deviate from the observed data. *Variance* is the sensitivity of prediction, or how much influence a data point has on the model. Simpler models tend to *underfit* the data because they tend to deviate from the provided data (high bias) but are robust to outliers in the data (low variance). More complex models tend to *overfit* the data because they adhere to the data (low bias) but are sensitive to outliers in the data (high variance).

The generalization error can be summed up as the following:
<center>generalization = bias + variance</center>

The right tradeoff between bias and variance depends on the amount of data. With more data, we can afford to use more complex models.

# Bias-Variance Analysis

Here, we detail the mathematics behind the bias-variance decomposition. We'll define the following variables:

- $D$: the data as a random variable

- $h_D: \mathcal{X} \to \mathbb{R}$, the trained model

- $\mathbf{x}$, a new input feature vector

- $y$, a true target value as a random variable

We would like to calculate the generalization error for $\mathbf{x}$:

$$\mathbb{E}_{D, y|\mathbf{x}} [(y - h_D(\mathbf{x}))^2]$$

This is the expectation of the residual error between the true $y$ and the model's estimate $y$ with respect to the data and the true $y$.

We now define the *true conditional mean*:

$$\bar{y} = \mathbb{E}_{y|\mathbf{x}} [y]$$

We then do a bit of arithmetic:

$$\mathbb{E}_{D, y|\mathbf{x}} [(y - h_D(\mathbf{x}))^2] = \mathbb{E}_{D, y|\mathbf{x}}[(y-\bar{y}+\bar{y} - h_D(\mathbf{x}))^2]$$

$$=\mathbb{E}_{y|\mathbf{x}}[(y-\bar{y})^2]+\mathbb{E}_D[(\bar{y}-h_D(\mathbf{x}))^2] + 2\mathbb{E}_{D,y|\mathbf{x}}[(y-\bar{y})(\bar{y}-h_D(\mathbf{x}))]$$

The last term can be written as:

$$2\mathbb{E}_{D, y|\mathbf{x}}[\bar{y} - h_D(\mathbf{x})] \cdot \mathbb{E}_{y|\mathbf{x}}[y-\bar{y}] = 2\mathbb{E}_{D, y|\mathbf{x}}[\bar{y} - h_D(\mathbf{x})] \cdot 0 = 0$$

So the generalization error simplifies to:

$$=\underbrace{\mathbb{E}_{y|\mathbf{x}}[(y-\bar{y})^2]}_\text{noise}+\underbrace{\mathbb{E}_D[(\bar{y}-h_D(\mathbf{x}))^2]}_\text{bias+variance}$$

Let's now split up the bias/variance term. Let the *prediction mean* be:

$$\bar{h}(\mathbf{x}) = \mathbb{E}_D[h_D(\mathbf{x})]$$

Using similar arithmetic from before, we get:

$$\mathbb{E}_D[(\bar{y}-h_D(\mathbf{x}))^2] = \mathbb{E}_D[(\bar{y}-\bar{h}(\mathbf{x}) + \bar{h}(\mathbf{x}) - h_D(\mathbf{x}))^2]$$

$$=\underbrace{(\bar{y} - \bar{h}(\mathbf{x}))^2}_\text{bias squared} + \underbrace{\mathbb{E}_D[(\bar{h}(\mathbf{x}) - h_D(\mathbf{x}))^2]}_\text{variance} + \underbrace{2\mathbb{E}_D[(\bar{y}-\bar{h}(\mathbf{x}))(\bar{h}(\mathbf{x}) - h_D(\mathbf{x}))]}_0$$

Plugging this back into the generalization error, we get:

$$=\underbrace{\mathbb{E}_{y|\mathbf{x}}[(y-\bar{y})^2]}_\text{noise}+\underbrace{(\bar{y} - \bar{h}(\mathbf{x}))^2}_\text{bias squared} + \underbrace{\mathbb{E}_D[(\bar{h}(\mathbf{x}) - h_D(\mathbf{x}))^2]}_\text{variance}$$

$$=\text{noise}(\mathbf{x})+(\text{bias}(h(\mathbf{x}))^2+\text{Var}_D(h_D(\mathbf{x}))$$

The expectation of this over $\mathbf{x}$ is the generalization error. In conclusion, the generalization error is a function of the noise, bias, and variance of the data. Notice that as $n \to \infty$, the variance falls, allowing us to reduce generalization error and use a more complex model.

# Regularization

To control this tradeoff, we can incorporate a *regularization term* in the loss function. Regularization terms penalize loss based on the magnitude and number of weights. Take, for example, the least-squared loss:

$$\mathcal{L}(\mathbf{x}) = \sum_{i=1}^n (y_i - h(\mathbf{x}_i; \mathbf{w}))^2$$

One such regularization term is known as *ridge regression* where we add the squared $\ell_2$ norm:

$$||\mathbf{x}||^2_2 = (\ell_2(\mathbf{x}))^2 = (\sqrt{\mathbf{x} \cdot \mathbf{x}})^2 = <\mathbf{x}, \mathbf{x}>$$

So our new loss to minimize would be:

$$\min_{\mathbf{w}} \mathcal{L}(\mathbf{w}) + ||\mathbf{w}||^2_2$$

Fortunately, ridge regression is convex and differentiable, so the loss function can be optimized by matrix inversion. However, the inversion could be expensive for a large number of features. This is not the case for the *LASSO regression* which uses the $\ell_1$ norm:

$$\ell_1(\mathbf{w}) = ||\mathbf{w}||_1 = \sum_{i}^{|\mathbf{w}|}|w_i|$$

for the loss function:

$$\min_{\mathbf{w}} \mathcal{L}(\mathbf{w}) + ||\mathbf{w}||_1$$

Instead, we can always use stochastic methods/gradient descent to optimize these loss functions.

Note that we can use both regularization terms together or even add hyperparameter constants to adjust the strength of each like so:

$$\min_{\mathbf{w}} \mathcal{L}(\mathbf{w}) + \lambda \mathbf{w}^\top\mathbf{w}$$

# Ensemble Methods

Finally, usually a decrease in variance results in an increase in bias, but we can also reduce the variance without increasing bias by using *ensemble methods.* The ensemble method simply trains multiple models and takes the average (for regression, majority vote for classification) of predictions. This is known as *bagging.* In *boosting*, we train data sequentially, giving more weight to incorrectly classified examples.

# Conclusion

Phew, that was a lot about understanding how to choose good models. Once we get to neural networks, we don't have to worry about any of this. :)