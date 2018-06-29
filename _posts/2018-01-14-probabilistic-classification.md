---
layout: post
title: Classification
date: 2018-01-14
categories: datasci
hasMath: "Tex-AMS_CHTML"
tags:
- "machine learning"
- "probability"
- "classification"
---

In binary classification problems, we have an input feature vector and we'd like to classify it into one of two classes. We did this by minimizing reasonable loss functions based on activation functions. In this very long post, we'll take a probabilistic approach to classification and detail the generative framework.

# Generative Probabilistic View

There are two main probabilistic views of a classification problem: the generative and discriminative models. For some intuition of the generative model, suppose we're playing God and we're trying to construct wolf and sheep from scratch. We might think there's a particular distribution of wolf and sheep in the world that we would like to maintain. In terms of creating the animal, if we know that we're creating a wolf, the probability that the animal has the sharp teeth goes up and the probability that the animal has wool goes down. We might find that wooly wolves are less likely than sharp-toothed wolves, and wooly sheep are more likely than sharp-toothed sheep. Finally, if we know there is only one wolf for every million sheep, we might find that the probability of generating a wolf with any characteristics extremely unlikely. Most importantly, note that we have a model to decide how to generate the animals: specifically the relative proportions I'd like to maintain and what the features of the animal are.

In the *generative* view, we model the problem as trying to calculate the joint probability of both the data and the outcome:

$$p(\mathbf{x}, y) = \overbrace{p(\mathbf{x}|y)}^\text{class-conditional}\underbrace{p(y)}_\text{class}$$

The *class* probability is the probability that a datapoint is in a certain class $y$, while the *class-conditional* probability is the probability that a datapoint has a certain feature vector given the class.

Note, we'll also change our output space slightly to be:

$$\mathcal{y} = \{0, 1\}$$

This will be useful when expressing our class prior.

# Class Prior
In binary classification's $p(y)$, we need to define a prior distribution over the two classes. Let $\theta$ be the number of units in class 1.

$$p(y=1; \theta) = \theta, p(y=0; \theta) = 1-\theta$$

Because of our output space change, we can equivalently write this as:

$$p(y) = \theta^y(1-\theta)^{1-y}$$

We will later find an estimate of $\theta$ using Bayesian methods.

# Class-Conditional Prior

The class-conditional distribution is whatever distribution that defines $\mathbf{x}$. Depending on your feature vector, there are many ways to model $\mathbf{x}$. If they're all Normally distributed, you might consider a multivariate Gaussian to model the class-conditional:

$$p(\mathbf{x}|y=0; \mathbf{\mu}_0, \mathbf{\Sigma}_0)$$

$$p(\mathbf{x}|y=1; \mathbf{\mu}_1, \mathbf{\Sigma}_1)$$

Of course, keep in mind that choosing distributions that yield conjugacy with your class priors or otherwise make computation easier might be favorable, but you might introduce model bias.

We'll begin by assuming each of the covariates in $\mathbf{x}$ come from binary, discrete spaces:

$$p(\mathbf{x}|y; \mathbf{\pi}_0, \mathbf{\pi}_1)$$

We can think of each $\pi$ as being a $ \| \mathbf{x} \| \times 2$ matrix of probabilities, 2 because each of the features will be from a discrete set of binary values. These $\pi$ parameters will be learned from the data.

# Maximum Likelihood Estimation

We've defined a generative model and specified the parameters to learn. Now onto the learning. We calculate the MLE of the parameters as the values that minimize the negative log-likelihood of the data:

$$\min_{\mathbf{\pi}_0, \mathbf{\pi}_1, \theta}\mathcal{L}(\mathbf{\pi}_0, \mathbf{\pi}_1, \theta) = \min_{\mathbf{\pi}_0, \mathbf{\pi}_1, \theta} - \sum_{i=1}^n \left(\ln p(y, \theta) + \ln p(\mathbf{x}_i|y; \mathbf{\pi}_0, \mathbf{\pi}_1)\right)$$

Again, depending on the specified class and class-conditional distributions, there may be conjugate results that would make this easy to calculate, or you might have to use gradient descent to optimize the loss. The minimization would yield the optimal parameters under the MLE setting.

# Sentiment Analysis

Let's look at an example problem. One popular area in classification is *sentiment analysis.* Given a text document $\mathbf{x}$ and a vocabulary $V$, we would like to classify the document as being a positive or negative sentiment. 

Here are two examples:

*I loved that movie! The plot was so wonderful.* has a positive sentiment.

*I hated that movie. There was no plot.* has a negative sentiment.

## Feature Representation: Multinoulli

We can let $y=1$ be the label for a positive sentiment, and $y=0$ be the negative sentiment. Furthermore, our $\mathbf{x}$ text will be transformed into a binary vector with an indicator variable for each word in the dictionary:

$$\phi(\mathbf{x}) = \underbrace{[1, 0, 1, 0, 0, \ldots, 0]}_{\{0, 1\}^{|V|}}$$

A 1 at index $i$ indicates the $i$th word in the dictionary exists in document $\mathbf{x}$. This is known as the multivariate form of the Bernoulli, or the Multinoulli.

## Multinomial Distribution and MLE

We might want to consider the counts of different words rather than their existence alone. Instead of using the Multinoulli distribution which only flags whether a word is seen or not, we can use a generalization of the Binomial (also a generalization of the Multinoulli) called the Multinomial distribution.

$$p(\mathbf{x}; \mathbf{\pi}) \propto \prod_{j=1}^m \pi_j^{x_j}$$

Let's take a slight tangent and calculate the MLE over *a set of feature vectors (without considering classes)*. Using a monotonic log transformation:

$$\begin{align*}
& \arg_{\pi \ge 0}\max \prod_{i=1}^n p(\mathbf{x}_i; \pi) \\
& = \arg_{\pi \ge 0}\max \sum_{i=1}^n \sum_{j=1}^m x_{ij} \ln \pi_j \\
& \text{ s.t. } \sum_{j=1}^m \pi_j = 1\end{align*}$$

We can then optimize this using Lagrange multipliers:

$$L(\mathbf{\pi}, \lambda) = \sum_{i=1}^n \sum_{j=1}^m x_{ij} \ln \pi_j + \lambda \left(1 - \sum_{j=1}^m \pi_j \right)$$

$$\frac{\partial L(\pi, \lambda)}{\partial \pi_j} = \sum_{i=1}^n \frac{x_{ij}}{\pi_j} - \lambda = 0$$

$$\pi_j = \sum_{i=1}^n \frac{x_{ij}}{\lambda}$$

$$\frac{\partial}{\partial \lambda} L(\pi, \lambda) = 1 - \sum_{j=1}^m \pi_j$$

$$\sum_{j=1}^m \pi_j = 1$$

$$\sum_{i=1}^n \sum_{j=1}^m \frac{x_{ij}}{\lambda} = 1$$

$$\lambda = \sum_{i=1}^n \sum_{j=1}^m x_{ij}$$

Finally, we have an expression for $\pi$:

$$\hat{\pi}_{MLE} = \frac{\sum_{i=1}^n \mathbf{x}_i}{\sum_{i=1}^n \sum_{j=1}^m \mathbf{x}_{ij}} = \frac{\mathbf{X}^\top \mathbf{1}}{\mathbf{1X1}}$$

The intuition behind this formula is that the maximum likelihood estimator for $\pi$ is quite simply the proportion of times a word occurs out of all the words.

# Multinomial Binary-Class Naive Bayes

We took some time to understand the form of the parameters $\pi$ when calculating the MLE. Now, we'll see what happens when we incorporate class probabilities. To do this, we'll take the Bayesian approach, Naive Bayes.

Here, we define our generative model as:

$$p(\mathbf{x}, y) = p(y; \theta) p(\mathbf{x} | y; \mathbf{\pi}_0, \mathbf{\pi}_1)$$

Our class probability is distributed Bernoulli:

$$p(y; \theta) = \text{Bern}(y; \theta)$$

Working under the sentiment analysis problem where we'd only like to flag words that appear (instead of counting), our class-conditional distribution will be Multinoulli:

$$p(\mathbf{x}|y; \pi_0, \pi_1) \propto \prod_{j=1}^m \pi_{yj}^{x_j}$$

We can then calculate our desired probabilities of a datapoint being in a certain class given its features using Bayes' Rule:

$$p(y|\mathbf{x}) \propto p(\mathbf{x}|y; \pi_0, \pi_1) p(y; \theta)$$

# Multinomial Naive Bayes Loss

In a statistical context, our loss function will be to maximize the likelihood of the data:

$$\max_{\theta; \mathbf{\pi}_0, \mathbf{\pi}_1} \sum_{i=1}^n \ln p(\mathbf{x}_i, y_i) = \max_{\mathbf{\pi}_0, \mathbf{\pi}_1} \sum_{i=1}^n \ln p(\mathbf{x}_i|y_i; \mathbf{\pi}_0, \mathbf{\pi}_1) + \max_\theta \sum_{i=1}^n \ln p(y_i; \theta)$$

After a *bunch* of algebra, we get to the conclusion that:

$$\hat{\theta} = \frac{\mathbf{1y}}{n}$$

$$\hat{\pi}_{0} = \frac{\sum_{i=1}^n (1-y_i)\mathbf{x}_i}{\sum_{i=1}^n \sum_{j=1}^m (1-y_i) x_{ij}}$$

$$\hat{\pi}_{1} = \frac{\sum_{i=1}^n y_i\mathbf{x}_i}{\sum_{i=1}^n \sum_{j=1}^m y_i x_{ij}}$$

Intuitively, $$\hat{\theta}$$ is the proportion of samples in class 1, and each $$\hat{\pi}$$ is the normalized cumulative count vector over the features. Thus, we have derived non-MLE methods of finding the parameters using priors.

# Discriminant Probabilistic View

In practice, we would like to have a function that, having learned the parameters, decides whether a sample belongs in class 0 or 1. To do this, we can define a discriminant function where a sample is in class 1 if the function returns a positive number and 0 if the number is negative:

$$\begin{align*}
h(\mathbf{x}) &= (\ln p(\mathbf{x}|y=1) + \ln p(y=1)) - (\ln p(\mathbf{x}|y=0) + \ln p(y=0)) \\
&= \left[\ln \prod_{j=1}^m \pi_{1j}^{x_j} - \ln \prod_{j=1}^m \pi_{0j}^{x_j}  \right] + [\ln \theta - \ln (1 - \theta)]\\
&= \sum_{j=1}^m x_j \ln \frac{\pi_{1j}}{\pi_{0j}} + \ln \frac{\theta}{1-\theta} = \mathbf{x}^\top \left(\ln \frac{\pi_1}{\pi_0} \right) + \ln \frac{\theta}{1-\theta}
\end{align*}$$

We've recovered the form of a linear regression! Indeed, the binary classification problem ultimately reduces to a linear regression. Since much of the machinery of the linear regression is computationally easier, people often work under the regression framework.

If we choose to do this, then under the probabilistic framework of the linear regression, we would be maximizing:

$$\arg_\mathbf{w}\max \prod_{i=1}^n p(y_i | \mathbf{x}_i, \mathbf{w})$$

Notice that here, we are parameterizing the class-conditional distribution. This is known as the *discriminative* model. Note that this is different from the generative model since we are not parameterizing the entire joint distribution. The benefits of doing so is that we are only learning weights to discriminate between classes, whereas in the generative model, we are learning weights about proportions and class-conditional frequencies. However, in the generative framework, we have a way of randomly generating *new data*, whereas in the discriminative model, we do not have this possibility since we did not learn the parameters required to generate data.

In the next post, we'll talk more about the discriminative model and its relationship to the logistic regression.