---
layout: post
title: "Arch Linux: Chromebook C720 Webcam Microphone Disappeared"
date: 2018-07-01
categories: technology
img: ""
tags:
  - "arch linux"
  - "webcam"
  - "microphone"
---

After plugging in a third-party microphone, my laptop stopped detecting my webcam and microphone in its listed devices.

Chromium stopped recognizing my webcam and microphone. In pavucontrol, the input audio devices did not include my microphone. Checking journalctl, I grep'ed for Camera logs and found the following issue:

```
kernel: uvcvideo 1-3:1.0: Entity type for entity Camera 1 was not initialized!
```

After looking around, I was told to install '''v4l-utils'''. After doing so, I checked whether the internal webcam existed with --list-devices. Sure enough, it was there.

The microphone was still broken. In ```/etc/pulse/default.pa```, I uncommented the following:

```
 load-module module-alsa-source device=hw:0,0
  # the line above should be somewhere before the line below
 .ifexists module-udev-detect.so
 ```

Then, I restarted pulseaudio to apply the new settings:
```
$ pulseaudio -k ; pulseaudio -D
```

Then things we working again!