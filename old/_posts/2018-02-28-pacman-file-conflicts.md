---
layout: post
title: "Pacman: File Conflicts"
date: 2018-02-28
categories: technology
img: ""
tags:
  - arch linux
  - packages
---

I got a Jupyter error: failed to commit transaction (conflicting files) while trying to update my packages.

Not sure how I managed to get my packages out of sync. Running pacman -Qo on the conflicting files specified that pacman wasn't managing the files that had the conflicts, and I definitely don't do any manual installs.

I ran pacman -Syu --force to get it to install. That's probably not the best way to handle this problem, like at all, but if it's for something like Jupyter Notebook, it's fine.