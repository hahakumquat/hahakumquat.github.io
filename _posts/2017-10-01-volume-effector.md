---
layout: post
title: "C4D: Volume Effector"
date: 2017-10-01
categories: graphics
img: "/assets/img/fragile_t.jpg"
tags:
  - "cinema 4d r15"
  - "volume effector"
  - "modeling"
---

I recently tried out the Volume Effector in Cinema 4D. The tool allows for a discrete version of the boole operation, allowing for a pretty cool modular effect.

<center><img src="/assets/img/fragile.jpg"/></center>

Under the Mograph effectors list is the Volume Effector. The Volume Effector is applied to a matrix object (or Mograph Cloner) containing a "field" of objects being used to fill a space. In my case, this would be a field of cubes. It then takes in a parameter, "Volume Object," which is the mesh in which your field will selectively fill. I used a turbulent sphere positioned near the corner of my field. To view the result, click the "Visible" flag in the Effector settings. The result, however, would be the intersection between the field and sphere. To invert this selection, I modified the transformation to invert Scaling from +1 to -1. And just like that, we have our cube field with a chunk cut out by a sphere.