---
layout: post
title: "Introduction to Inference: Coins and Discrete Probability"
date: 2017-09-10
categories: datasci
img: ""
hasMath: "TeX-AMS_CHTML"
tags:
  - "discrete"
  - "inference"
  - "machine learning"
---

In data science, it all starts with a coin. Today, we'll talk about the fundamentals of statistical inference for discrete models: how to determine the optimal parameters given data, how to incorporate prior knowledge, and how to make predictions. This assumes familiarity with random variables and the basics of probability theory.

<h1>Discrete Models: Overview</h1>

A discrete model is a model where we describe a situtation of events as a random variable that takes on values from a countable outcome set. Coin flips, for example, take on a value of either heads $H$ or tails $T$: $\\{H, T\\}$. Other models include dice rolls $(Y \\in \\{1, 2, 3, 4, 5, 6\\})$ and the number of heads in a row $(Z \\in \\mbb{Z}^+ \\cup \\{ 0 \\})$, but these have different analyses from our coin example.

<h1>Bernoulli Distribution</h1>

Consider the following problem: what is the probability that the next coin flip will be heads? Let $X$ be a random variable that describes whether a coin flip is a heads $H$ or tails $T$. This is a classic example of the most fundamental statistical distribution, <em>the Bernoulli distribution</em>.

The Bernoulli distribution is a probability distribution of a random variable $X$ which takes on values according to the following probabilities:

$$
\begin{array}{c|c}
x & P(X=x) \\
\hline
1 & \theta \\
0 & 1 - \theta
\end{array}
$$

In other words, its support, the values $X$ can take on, is the set $\\{ 0, 1 \\}$ with a probability mass function (PMF):

$$P(X=x) = \theta^x (1-\theta)^{1-x}$$

We say that $X$ is distributed Bernoulli or $X$ has a Bernoulli distribution. Notationally, we can also write:

$$ X \sim \t{Bern}(\theta), P(X = x) = \t{Bern} (x|\theta) $$

We can then model the probability of flipping heads as a random variable $X \sim \t{Bern}(\theta)$ where the probability is $P(X=1) = \theta$.

<h1>An Easy Prior</h1>

Unfortunately, we don't know the value of $\theta$ that our coin has. Slight deviations in coin manufacturing and face design may make $\theta \neq 0.5$. Suppose we had an expert <a class="link" href="https://en.wikipedia.org/wiki/Numismatics">numismatist</a> who knew the likelihood of getting a coin with a certain $\theta$:

$$
\begin{array}{c|c}
\theta_0 & P(\theta = \theta_0) \\
\hline
0.4 & 0.1 \\
0.5 & 0.8 \\
0.6 & 0.1
\end{array}
$$

and, implicitly, $P(\theta = \theta_0) = 0$ otherwise. 

$P(\theta = \theta_0)$ is known as the <em>prior distribution</em> because it captures previous knowledge about our random variable of interest, $X$. We can calculate our prior probability by the following:

$$P(\theta = \theta_0) = 0.1 \cdot \mbb{I}(\theta = 0.4) + 0.8 \cdot \mbb{I}(\theta = 0.5) + 0.1 \cdot \mbb{I}(\theta = 0.6)$$

where $\mbb I(x)$ is the indicator function which yields $1$ when $x$ is true and $0$ otherwise.

<em>Note: so far, we have correctly written probabilities as functions of events: "the probability of $\theta$ taking on the value $\theta_0$," and "the probability that a coin flip $X$ is $x$." Oftentimes, we write the shorthand $P(X)$ instead of $P(X=x)$ and $P(\theta)$ instead of $P(\theta = \theta_0)$ for ease of notation, though technically probabilities cannot be functions of random variables.</em>

<em>It's also important to note that here, we are treating our hyperparameter $\theta$ as a random variable, not a fixed constant. This is the core tenant of the Bayesian statistics: parameters are random variables. In contrast, the frequentist interprets parameters as fixed constants.</em>

<h1>Likelihood</h1>
How can we know which value of $\theta$ is most likely for our coin? Here, we introduce the concept of the likelihood. We define likelihood as the joint probability of seeing $n$ events:

$$L(\theta) = P(\bold{X} \vert \theta) = P(x_1, x_2, \ldots, x_n \vert \theta))$$

Suppose we flipped our coin $N$ times and observed $N_1$ heads and $N_0$ tails in a specific order. Assuming that the coin flips are independent (the outcome of one coin flip does not affect the outcome of another), we can calculate the likelihood of $\theta$, the probability of observing the sequence of $N$ coin flips, as the following:

$$L(\theta) = P(\bold{X}  \vert  \theta) = \prod_{i=1}^N \theta^{x_i}(1-\theta)^{1-x_i} = \theta^{N_1}(1-\theta)^{N_0}$$

Oftentimes, we will work in log-space since the log function is monotonic (preserves order) and prevents the issue of the vanishing probability (many probabilities multiplied together in a joint-probability approaches $0$). We will thus use the <em>log-likelihood</em>:

$$
\ell(\theta) = \log(L(\theta))
$$

<em>Note: if we only knew $N_1$ and $N_0$ without the specific ordering of heads and tails, our likelihood would be normalized by a constant ${N}\choose{N_1}$. This is equivalent to the PMF of the Binomial distribution $X \sim \t{Bin}(n, \theta)$ which models the number of successes out of $n$ trials with probability $\theta$ of success.</em>

<h1>Inference: $P(\theta \vert \bold{X})$</h1>

It's now time to do some inference. Our goal will be to calculate the probability of $\theta$ taking on some value given an observation set of data $\bold{X}$, $P(\theta\vert \bold{X})$. This is also called the <em>posterior distribution</em>.

<h2>Maximum Likelihood Estimation (MLE)</h2>
Intuitively, we might want to choose the $\theta$ that best reflects the likelihood of seeing our observations. For example, we'd expect $\theta$ to be about $0.5$ for a fair coin, so if we see an observation set $\bold{X}$ containing half heads and half tails, $\theta$ should have a high probability of being $0.5$.

Unsurprisingly, we can use our likelihood function which describes the probability of seeing our observations and pick the $\theta$ that maximizes the function. This maximium can be found using gradient descent or calculus (take the derivative, set to $0$) since likelihood functions are concave down. Furthermore, because the log function preserves order, we can use the log-likelihood without worry about changing $\theta$ when taking the gradient. We call this estimation of $\theta$ the <em>maximum likelihood estimation</em> $\hat{\theta}_{MLE}$.

$$\hat{\theta}_{MLE} = \t{argmax}_{\theta} P(\bold{X} \vert \theta) = \t{argmax}_{\theta} \log P(\bold{X} \vert \theta)$$

Using the Binomial form of the likelihood, we can calculate the log-likelihood for $N_1$ heads and $N_0$ tails:

$$
\begin{align*}
\ell(\theta) & = \log(P(\bold{X} | \theta)) \\
& = \log{\binom{N}{N_1}} \theta^{N_1} (1 - \theta)^{N_0} \\
& = \log{\binom{N}{N_1}} + N_1 \log \theta + N_0 \log (1 - \theta) \\
\end{align*}
$$

To find $\t{argmax}_\theta \ell(\theta)$, we take the derivative and solve for $\theta$:

$$\frac{d\ell(\theta)}{d\theta} = 0 + \frac{N_1}{\theta} - \frac{N_0}{1-\theta} := 0$$

$$\hat{\theta}_{MLE} = \frac{N_1}{N_0 + N_1}$$

And just like that, we've come to the result that $\hat{\theta}_{MLE}$ is simply the proportion of heads out of the total number of coin flips, an intuitive and clean result.

<h2>Maximum <em>a posteriori</em> Estimation (MAP)</h2>
But our expert numismatist looks at our data and thinks it must be a fluke accident. How can we capture the numismatist's doubt in our model?

We have already found the probability $P(\bold{X} \vert \theta)$ as the likelihood and $P(\theta)$ based on our prior calculation, so if we use Bayes' Rule:

$$
P(A \vert B) = \frac{P(B \vert A) P(A)}{P(B)}
$$

We can then make the following proportionality statement.

$$
P(\theta \vert \bold{X}) = \frac{P(\bold{X} \vert \theta) P(\theta)}{P(\bold{X})} \propto P(\bold{X} \vert \theta) P(\theta)
$$

The reason this is valid is that $P(\bold{X})$ is not a function of $\theta$ and therefore has no randomness. In other words, we are already given $\bold{X}$, but $\theta$ is still random. Thus, for any $\theta$, $P(\bold{X})$ will be the same constant for some given $\bold{X}$. Mathematically, the denominator just serves as a normalizing factor to make the probability valid (between $0$ and $1$). We can thus drop the term and focus only on the numerator. Using this expression, we now have a different estimator for $\theta$, the maximum likelihood estimator, $\hat{\theta}_{MAP}$.

$$\hat{\theta}_{MAP} = \t{argmax}_\theta \log P(\bold{X}|\theta)P(\theta)$$

In contrast with the MLE, we are now multiplying the likelihood $P(\bold{X} \vert \theta)$ by some prior knowledge $P(\theta)$. Note that if we have a "flat prior," a prior that assigns uniform probability to any value of $\theta$, then the MAP estimator reduces to the MLE.

Unfortunately, calculating the MAP (equivalent to calculating the mode) isn't as easy as taking a derivative and solving for the desired variable. Depending on the behavior of $P(\theta)$, the function might not be concave down. There are many strategies for finding modes, but all of them are estimations. Since in our prior, our expert said there are only three possible values of $\theta$, $(0.4, 0.5, 0.6)$, we can plug in each value of $\theta$ and select the one that yields the largest MAP estimator. Note that for any values of $\theta$ other than the three specified, $P(\theta) = 0$.

<h1>A Conjugate Prior</h1>
$P(\theta)$ has been very nice to us. It only has three values, so everything thus far has been easy to calculate. In the real world, however, our numismatist probably won't have such high confidence that the coin will only take on three values. Instead, we might know that our coin comes from a factory that generates coins with probability $\theta$ based on a distribution we'd have to assume. In our coin example, there is a distribution with nice properties that makes it an excellent prior candidate called the <em>Beta distribution</em>.

<h1>Beta Distribution</h1>
Let $\theta$ come from a Beta distribution. The Beta distribution has a probability density function (PDF):

$$f_\theta(\theta_0 \vert \alpha_0, \alpha_1) = \frac{\Gamma(\alpha_0 + \alpha_1)}{\Gamma(\alpha_0)\Gamma(\alpha_1)} \theta_0^{\alpha_1 - 1} (1 - \theta_0)^{\alpha_0 - 1}$$

where $\Gamma(x)$ is the Gamma function. Since the Beta distribution is not discrete, but rather continuous, the probability that $\theta$ is any single value is $0$. However, we can calculate the probability that $\theta$ falls in $[a, b]$ by integrating the PDF over the range:

$$P(a \le \theta_0 \le b) = \int_a^b f_\theta(\theta_0 \vert \alpha_0, \alpha_1) d\theta_0 = \int_a^b \frac{\Gamma(\alpha_0 + \alpha_1)}{\Gamma(\alpha_0)\Gamma(\alpha_1)} \theta_0^{\alpha_1 - 1} (1 - \theta_0)^{\alpha_0 - 1} d\theta_0$$

Interestingly enough, the analog of the PMF is the PDF, not the integral of the PDf, so we can express our posterior distribution as the following. Note that the ugly Gamma function can be ignored since it is a constant independent of the random variable $\theta$.

$$\begin{align*}P(\theta_0|\bold{X}) & = P(\bold{X}|\theta_0) f_\theta(\theta_0) \\
& = \theta_0^{N_1}(1-\theta_0)^{N_0} \cdot \frac{\Gamma(\alpha_0 + \alpha_1)}{\Gamma(\alpha_0)\Gamma(\alpha_1)} \theta_0^{\alpha_1 - 1} (1 - \theta_0)^{\alpha_0 - 1} \\
& \propto \theta_0^{N_1 + \alpha_1 - 1}(1-\theta_0)^{N_0 + \alpha_0 - 1}
\end{align*}$$

Apart from the normalizing constant, this posterior is identical in form to another Beta distribution $\theta \sim \t{Beta}(N_1 + \alpha_1, N_0 + \alpha_0)$! The Beta distribution is known as a <em>conjugate prior</em> to Bernoulli/Binomial data, because the posterior distribution is of the same form as the prior. Intuitively, we see that the parameters for the prior Beta have increased by $N_1$ and $N_0$. We can think of the $\alpha$ parameters as the counts of heads and tails from previous experiments. Because of the conjugacy of the problem, we can perform multiple experiments with the coin at different times, improving our prior knowledge as we go.

<h1>Predictive Distribution</h1>
We now have methods of inferring the value of $\theta$ based on data. Now, how can we predict the next coin flip? In other words, can we calculate $P(\hat{x} | \bold{X})$?

Of course, the answer is yes, by marginalizing out $\theta$. To do so, we integrate over all possible values of $\theta$ and consider our posterior distribution:

$$
\begin{align*}
P(\hat{x}\vert \bold{X}) & = \int_0^1 P(\hat{x} \vert \theta)P(\theta|\bold{X})d\theta\\
& = \int_0^1 \theta P(\theta \vert \bold{X}) d\theta\\
& = \mbb{E}[\theta] = \frac{\alpha_1 + N_1}{\alpha_0 + \alpha_1 + N_0 + N_1}, \theta \sim f_{\theta}(\theta \vert \bold{X})
\end{align*}
$$

And we get a nice result that we predict our next coin flip to be the proportion of heads we've seen with this coin in expectation.

<h1>Conclusion</h1>
Phew, that was a lot. We now know how to analyze a coin's flipping properties. To do so, we used the MLE and MAP estimators, two methods of performing inference on an unknown coin probability $\theta$. One was based entirely on the current observation data, while the other was based on prior knowledge. Finally, using our estimation of $\theta$, we can then find a posterior distribution, allowing us to predict future coin flips. If only all problems were as easy as coin flips.