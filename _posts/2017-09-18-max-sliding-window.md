---
layout: post
title:  "Algorithms: Maximum Sliding Window"
date:   "2017-09-18"
categories: problems
img: ""
hasMath: "TeX-AMS_CHTML"
tags:
  - sliding window
  - algorithms
  - deque
---

The sliding window problem seeks to evaluate properties about every possible subarray without introducing a look-back penalty. In particular, the Maximum Sliding Window problem tries to find the maximum element in every contiguous fixed-length subarray.

Consider an array of integers $A$ length $n$ and integer $k \le n$. For each of the $n-k$ contiguous subarrays $(A[0, k], A[1, k+1], \ldots, A[n-k, n])$, we'd like to know the maximum of that subarray. Write a function that, given an array $A$, returns an array containing the maximum of each of the $n-k+1$ subarrays.

<h1>Naive Solution: $O(n^2)$</h1>

One naive solution would be to linearly search for the maximum of every subarray.

def MSW_naive(A, k):
    res = []
    n = len(A)
    for i in range(n - k + 1):
        res.append(max(A[i:i+k]))
    return res

In this case, we'd perform $k$ comparison operations for each of the $n-k+1$ subarrays, resulting in a time complexity of $O(k(n-k+1)) \to O(nk)$. Of course, we can do better.

<h1>Sliding Window</h1>

The fundamental idea behind sliding window problems is that we need to store enough information about the current subarray to solve the subproblem. At every timestep $i$, only the $k$ elements from $A[i:i+k]$ are considered, so we'd also need a way to dispose of elements outside our subarray region.

A FIFO (First-In, First-Out) queue is an excellent candidate for this kind of problem. At every step, a new element can be added to the queue, while the oldest element is removed. The simplest sliding window problem would be to return a list containing each window:

def SW(A, k):
    res = []
    n = len(A)
    for i in range(n-k + 1):
        res.append(A[i:i+k])
    return res

Wow, practically identical to MSW_naive, how riveting.

Unfortunately, a queue alone won't allow us to decrease our time bounds. To solve this problem, we'll use a Python deque. Deque's are two-sided queues with amortized constant-time insertion (pushing) and deletion (popping) for both sides of the datastructure. To be clear, Python's deque calls pushing appending, and popping from and appending to a deque occurs on the "right side" of the datastructure, whereas popleft and appendleft occur on the left side. Now things get interesting.

<h1>Maximum Sliding Window: Deque</h1>

How can we solve the Maximum Sliding Window problem with a deque? We'll satisfy two conditions for the deque at any time:

<ol>
<li>Anything in the deque must be a part of the subarray in question.</li>
<li>Anything older and smaller than some new element can be discarded.</li>
</ol>

The first is just a property of the sliding window technique. The second follows from the fact that if we've made it to some $i$th element already, then anything less than that $i$th element still in the deque will not be the max for the remainder of its time in the queue.

So, at every timestep $i$, we'll store the index $i$, removing from most recent to least recent any indices $j$ with $A[j]$ less than $A[i]$. This satisfies our condition that we should discard anything that has no chance of being a max. We can then remove any elements that are too old to be considered for this subarray. Then, we must  append our current $i$ to the deque. This is because it could be the case that $A[i]$ is the biggest element for the next $k$ steps, so we can't throw it out. Another way to think about it is that $A[i]$ could be the largest element we've seen so far, so the deque would be empty, and we'd want to report $i$. Finally, we append the oldest element in our deque to our list of answers.

Here's my implementation:

def maxSW(arr, k):
    d = deque()
    ans = []
    n = len(arr)
    for i in range(n):
    
        # remove elements from end that are smaller than new addition
        while d and arr[d[-1]] < arr[i]:
            d.pop()
            
        # make new addition
        d.append(i)
        
        # remove any elements that are too old
        if d[0] <= i - k:
            d.popleft()
            
        # the oldest element will be the largest in the deque
        # otherwise, we would have removed it in the while loop
        if i >= k-1:
            ans.append(arr[d[0]])
    return ans