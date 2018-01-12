---
layout: post
title: Binary Classification Metrics
date: 2018-01-12
categories: datasci
hasMath: "Tex-AMS_CHTML"
tags:
- "machine learning"
- "accuracy"
- "error"
---

Depending on the situation, the simple "number of correct classifications" error metric might not be the best metric to use in binary classification. Here, we explore several metrics and how they might be used for different problems.

# Experimental Design

In binary classification, it is common practice to label the "afflicted" case as a 1. For example, if we try to predict whether an individual has cancer or not, we would label our training data with a 1 if the unit is afflicted with cancer. This isn't too big of a deal as long as you're clear, but the statistics in the following section make more intuitive sense with this convention.

# Binary Classification Statistics
There are $2^2 = 4$ binary classification statistics to consider.

## True Positive (TP):

A *true positive* is a classification where $\hat{y} = 1$ and $y = 1$. That is, the model predicts the positive case (1) correctly.

## False Positive (FP):

A *false positive* is a classification where $\hat{y} = 1$ and $y = 0$. The model makes a positive prediction even though the true class is negative. This is also known as Type-I error.

## False Negative (FN):

A *false negative* occurs when $\hat{y} = 0$ and $y = 1$. Here, the model predicts the negative case, even though the sample is actually a positive case. This is also known as Type-II error.

## True Negative (TN):

A *true negative* occurs when both $\hat{y}$ and $y$ are 0. The model successfully classifies a sample in the negative case.

With these statistics, we can then define detection metrics.

# Detection Metrics:

There are several metrics that can be used to measure the efficacy of your model:

## Accuracy

Accuracy is the most intuitive metric you might use. It's simply the proportion of correct classifications into either class:

$$\textit{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}$$

This is a reasonable metric to use when both classes are equally important.

## True Positive Rate

The True Positive Rate (TPR), also known as the *sensitivity*, is a measurement of how sensitive our model is to positive cases:

$$TPR = \frac{TP}{TP + FN}$$

If we are predicting whether units have diseases or not, we might want a sensitive model so we do not miss any cases. If the sensitivity is low, the test wouldn't be a strong indicator of the disease.

We would like the FPR to be as low as possible, meanig

## True Negative Rate

The True Negative Rate (TNR), also known as the *specificity*, is a measurement of units correctly classified into the negative case out of all units in the negative case.

$$TNR = \frac{TN}{FP + TN}$$

If our specificity is low, then our model might be incorrectly classifying everyone as the positive case, which would be uninformative.

## F1-Score

We might want to consider both how often we correctly mark something as the positive case in addition to its sensitivity. We can then use a metric based on *precision* and *recall*. Precision is defined as the fraction of correct positive cases:

$$P = \frac{TP}{TP + FP}$$

Recall (R) is the fraction of cases marked as positive, also known as the sensitivity of TPR.

The F1-Score or F-Score is known as the harmonic mean of precision and recall:

$$F_1 = 2\frac{P\cdot R}{P+R}$$

With these metrics, it's up to the data scientist to decide which metrics are the most important to report depending on the experiment being run.