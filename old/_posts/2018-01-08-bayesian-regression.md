---
layout: post
title: "Linear Regression: Bayesian Approach, Normal Conjugacy"
date: 2018-01-08
categories: datasci
img: ""
hasMath: "Tex-AMS_CHTML"
tags:
- "machine learning"
- "bayesian"
- "regression"
---

Understanding the linear regression from a probabilistic perspective allows us to perform more advanced statistical inference. Today, we'll be applying Bayesian inference concepts to the linear regression. As a result, we'll have a way to update the beliefs of our models as more data becomes accessible or account for prior knowledge when looking at data.

I highly recommend taking a look at <a class="link" href="/datasci/2017/09/10/inference-coins/">this introductory post on inference</a> before delving into this post as it covers the fundamentals of MLE, MAP, and conjugacy.

Recall from the last post on <a class="link" href="{{page.previous.url}}">{{ page.previous.title }}</a> that we can avoid overfitting our models with regularization terms. Here is the $\ell_2$ norm loss, for example:

$$\min_{\mathbf{w}} \mathcal{L}(\mathbf{w}) + \lambda \mathbf{w}^\top\mathbf{w}$$

We use $\lambda$ to be an adjustable hyperparameter that specifies how much weight we put on the regularization term. Regularization terms can be effective, but they're rather *ad hoc* and inflexible.

# Bayesian Basics

Another solution to avoid overfitting to the data is to use Bayesian methods. In the Bayesian framework, we have a prior belief on our weights, $\mathbf{w}$, which we would like to use to maximize the likelihood of our data $D$, denoted $p(D\|\mathbf{w})$.

For a super brief overview of Bayes' Rule, we define the posterior, $p(\mathbf{w}\|D)$, as the product of the likelihood and prior:

$$p(\mathbf{w}|D) = \frac{\overbrace{p(D|\mathbf{w})}^\text{likelihood}\overbrace{p(\mathbf{w})}^\text{prior}}{p(D)} \propto p(D|\mathbf{w})p(\mathbf{w})$$

$$p(D) = \int_{\mathbf{w}} p(D|\mathbf{w})p(\mathbf{w})d\mathbf{w} = \text{constant for all }\mathbf{w}$$

# Choosing a Prior

We've discussed how to calculate the likelihood before. It's simply the product of independent probabilities of each data point. But how do we choose the prior? Often, the prior distribution is informed by a field expert or taken from a previous experiment. Otherwise, you can use a *flat prior*, one that provides little information in the prior.

# The form of the posterior

In the linear regression context, the likelihood of our data comes from a multivariate Normal distribution $\mathcal{N}(\mathbf{y}\|\mathbf{Xw}, \beta^{-1}\mathbf{I})$ with an assumed (fixed) precision $\beta$. Suppose we define our prior on $\mathbf{w}$ to be $\mathcal{N}(\mathbf{w}\|\mathbf{m}_0, \mathbf{S}_0)$. Our posterior is then proportional to:

$$p(\mu|D) \propto p(D|\mu)p(\mu)$$

$$=\mathcal{N}(\mathbf{y}|\mathbf{Xw}, \beta^{-1}\mathbf{I})\mathcal{N}(\mathbf{w}|\mathbf{m}_0, \mathbf{S_0})$$

After multiplying out the two distributions, completing the square, and doing a whole lot of algebra in between, we arrive at the conclusion that the posterior distribution is indeed multivariate Normal:

$$\mathbf{w} \sim \mathcal{N}(\mathbf{m}_n, \mathbf{S}_n)$$

$$\mathbf{S}_n = (\mathbf{S}_0^{-1} + \beta \mathbf{X}^\top\mathbf{X})^{-1}$$

$$\mathbf{m}_n = \mathbf{S}_n(\mathbf{S}_0^{-1}\mathbf{m}_0 + \beta \mathbf{X}^\top \mathbf{y})$$

This means that the Normal distribution is a conjugate of itself with the posterior form having the above parameters.

# MAP Estimator

The MAP estimator for $\mu$ is then $\mathbf{m}_n$ instead of $\mathbf{m}_0$. This is a vector containing the average values of each feature.