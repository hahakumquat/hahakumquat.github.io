---
layout: post
title:  "Introduction to Regression: K-Nearest Neighbors"
date:   2017-12-19
categories: datasci
img: ""
hasMath: "TeX-AMS_CHTML"
tags:
- "machine learning"
- "k nearest neighbors"
scripts:
- "https://d3js.org/d3.v4.min.js"
- "/assets/js/vis/knn.js"
---

Here, we'll look at the K-Nearest Neighbors approach toward understanding one of the core ideas of machine learning, the regression.

In the context of a general regression problem, you have a bunch of information called *features* or *covariates* along with a numerical value associated with these features, and you want to use this information to estimate the numerical value as an output of a new input set of features. For example, we might have data about the GPAs of college seniors, the number of STEM classes each of the students took, and their starting salaries after graduating. In this case, the features are the quantities:

- GPA: a numerical value on a 4.0 scale
- Number of STEM classes taken: between 0 and the max number of classes possibly taken

and their starting salary is the numerical value associated with a given student's GPA and number of classes. We might "perform a regression" on this data and use it to predict a new student's salary given his/her GPA and number of STEM classes taken. You might imagine that students with a lower GPA might tend to have lower earning potential, whereas taking more STEM classes might get you that snazzy engineer salary. The regression should capture this intuition and be able to predict salaries for new students.

In math, we can express a unique student's features as a vector. We'll denote a feature vector for a single unit by $\mathbf{x} \in \mathbb{R}^m$. In the example, $m$, the dimensions of the feature vector, is 2: GPA and number of STEM classes. We'll also use $y \in \mathbb{R}$ to denote the output, the salary in the example. The goal is to define a function $h$ where $y = h(\mathbf{x})$. In other words, we will try to create a function which, given a student's school information, correctly guesses his/her salary.

# K-Nearest Neighbors

In this post, we'll be talking about a relatively easy approach to regression, K-Nearest Neighbors. KNN is a non-parametric model, meaning that nothing is "learned" in the construction of the model. The idea behind KNN is pretty simple. You have a bunch of data, some things are more similar than others, and so for any new queried datapoint, we simply look for the $k$ most similar datapoints we've regressed on and take the average. In the salary example, suppose we have a bunch of students with 4.0's taking 20 STEM courses, and their salaries are all in the 80k range plus or minus 1k. If I give you a new student also with a 4.0 who took 20 STEM courses, we can reasonably guess his/her salary will be \$80,000 by taking the average of the other similar datapoints.

We can express the regression function $h$ to make an estimate $\hat{y}$ of an input feature vector as:

$$\hat{y} = h(\mathbf{x}; k) = \frac{1}{k}\sum_{i=1}^k y^{(i)}$$

We can see KNN in action with the following D3 visualization. Think of the data as being plotted in $\mathbb{R}^3$, where $x_1$ and $x_2$ (GPA/STEM classes) are the planar axes, and $y$ (the student's salary) is the opacity (all the points are the same color here). As you hover over the visualization, the $k$ nearest points are highlighted in red and their convex hull is shaded in. For any point along the plane, an estimate can be made as the average of the $k$ red points within the hull.
<center>
<div class="slidecontainer">
<input type="range" min="3" max="30" value="5" class="slider" id="knn-slider">
<label>k: <span id="knn-slider-label">5</span></label>
</div>
<div id="knn"></div>
</center>

A quick note, you might argue that $k$ is a parameter, but again, it's not learned, so we still say this is a non-parametric model.

The KNN approach is an intuitive and easy way to regress on data since no parameters need to be "learned," but it does have its shortcomings.

1. KNN requires that you keep all your training data. For any query input vector, you'd have to calculate the distance to every point and find the top $k$. At best, this could be $O((n-k) \cdot log(k))$ time with a fully optimal priority queue. Unfortunately, this is still at least linear in $n$, and with lots of data, this becomes intractable to compute without smarter calculations.

2. KNN suffers from the curse of dimensionality. This is an even bigger problem. I'm not going to prove this here, but for high dimensionality, we find that Euclidean distance becomes uninformative to compute as a distance metric. Worse yet, many points would tend to have similar distances with large $n$, so KNN would skew toward these high-frequency feature vectors.

All in all, KNN is a approach to performing a simple form of regression, but it has its drawbacks.