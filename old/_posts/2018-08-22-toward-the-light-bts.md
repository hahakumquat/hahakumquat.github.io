---
layout: post
title:  "Toward the Light: Behind the Scenes"
date:   "2018-08-22"
categories: graphics
img: "/assets/img/toward_the_light_t.png"
tags:
  - "cinema 4d r15"
  - "3d animation"
  - "toward the light"
  - "particles"
  - "rigging"
---

This long-overdue post is a visual effects breakdown for some of my favorite shots in my VES 153AR: Intermediate Animation final project and first complete short animation, <i>Toward the Light</i>. To follow along, you can find the film <a class="link" href="https://www.youtube.com/watch?v=Np4Kl2DHNDQ">here</a>. I'll be referencing times based on the YouTube link to discuss the animation.

# 0:05 &ndash; Complex Opening Scene

One of the prettiest scenes, and also one of the most computationally expensive, is the opening sequence. Being the first scene of my first animation, I definitely set a stylistic expectation that would quickly devolve as the animation goes on. The scene is composed of several layers composited together: the fire and foreground, the trees and shrubbery, the flowers, and the mountains/northern lights sky. Initial attempts at the scene were ambitious, to say the least: polygonal trees and globally illuminated flowers and fire were the most expensive culprits of increased render time.

To fix the trees, I opted for two orthogonally intersecting planes with several transparent tree textures on each plane. The effect provides a huge save on the number of polygons, but it can look a bit tacky. If you look carefully at some of the trees, you can even see symmetry across their centers. 

The fire is a particle system with additional compositing in after effects. In Cinema 4D, I created a particle sytsem that emitted planes with a fire texture in random orientations and scales. To get the illumination on the ground, GI took too long to render, so I instead set up a light source within the fire with photometric intensity. This tended to render much faster than GI and had a great, if not identical effect. After touching it up with some Trapcode Shine, the final effect was a pretty convincing fire.

# 0:19 &ndash; Particle Fireflies

At this point in the animation, I had already begun to feel the toll of long render times. Switching particle systems from Cinema 4D to Adobe After Effects greatly increased the flexibility of the swarming sensation I tried to produce with the fireflies. From here on out, most of the assets are rendered on a transparent background and composited together.

# 0:34 &ndash; Aurora Borealis

The northern lights effect was based on long planar strips, bent in a wavy fashion. The texture had luminance and glow with alpha transparency along the edges of the plane. There were some minor artifacts along the edges of the final render while compositing the northern lights onto the background which could have been avoided with a certain setting, though I can't remember what that setting is.

# 0:47 &ndash; The Moth

The moth was my first-ever character rig. The head, eyes, eyebrows, body, and wings have full programmatic control via XPresso, allowing me to pose the moth in a variety of configurations. The most interesting part of the rig is the legs. The six legs follow inverse kinematics with Cinema 4D's bone tools, but to save myself the animation time of keyframing each leg movement, I devised a programmatic solution. Attached to the body are six circles representing the ranges each of the six feet can reside in. As the body moves forward, the ranges move along with it, though the feet stay in place. At some point, the body moves far enough such that the feet are out of the range of its respective circle. When this happens, I programmed the feet to move back to the center of the circular range. The result is a jittery, insect-like walk that still has the liveliness of IK-spline legs.

# 1:37 &ndash; Moth Closeup

Just wanted to touch on the movement of this moth. Toward the end of the animation process, I began taking note of earlier animation mistakes: much of the moth's movement before this point was robotic and linear. I found that an easy fix is staggering the keyframes of different motions so that movements overlapped with one another. This greatly improved the realism of the moth for the rest of the film.

# 2:17 &ndash; Ending

The fire trails behind the moth were all done in After Effects using Trapcode Particular and Trapcode Shine. This just goes to show that Cinema 4D is not primarily a visual effects tool, but rather a motion graphics tool, and many of the effects that really make an animation shine can be emulated in After Effects! Finding the right balance between animation and post-production can significantly increase your productivity and output.