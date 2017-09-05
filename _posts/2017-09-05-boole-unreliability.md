---
layout: post
title: "C4D: Unreliable Booles"
date: 2017-09-05
categories: graphics
img: "/assets/img/swishswishfish_t.png"
tags:
  - "cinema 4d r15"
  - "boole"
  - "displacement deformer"
  - "animation"
---

I came across an interesting issue while trying to displace the surface of an otherwise static object. When using the Boolean tool to intersect two objects with an animated displacement deformer, the point of intersection occasionally fails to render on certain frames.

This is a sample of the desired image:

<center><img src="/assets/img/swishswishfish.png"/></center>

The original goal was to animate the upper surface of the water cube with a displacement deformer while maintaining proper contact with the sand on the bottom.

To do so, I created a larger, invisible cube with the displacement deformer and intersected it with my water cube. To animate the water, I used the animation settings on the displacement cube's noise shader to affect the water cube's surface when boolean joined. The result was the shimmering water surface we see in the image, at least for certain frames.

As I tried rendering out more frames, I soon found that the top geometry of the water cube would occasionally <i>disappear</i>. This is especially odd since I didn't set any keyframes regarding the visibility of the mesh. After a couple hours of playing around, I've come to the conclusion that, depending on how the animation displaces the top surface, certain displacements would cause the top to disappear.

I can't figure out why this would be the case. According to <a class="link" href="https://www.reddit.com/r/Cinema4D/comments/4djnmo/c4d_boole_a_intersect_b_object_disappearing_when/">this reddit post</a>, there might be a bug relating to the instability of booles in C4D. The best alternative (and probably best solution from the get-go) I can think of would be to use a finite bounding box. I'll have to try constraining a deformer and applying the displacement over the upper region without this boolean method. The initial concern is that the geometry vertically along the walls is a single polygon, so the deformation would cause breaking holes in the mesh, but perhaps it'll work fine after subdividing the walls...