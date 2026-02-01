---
layout: "post"
title: "SSH: How to Set Up a Simple Local Media Server"
date: 2018-06-21
categories: technology
img: ""
tags:
  - arch linux
  - ssh
  - networks
  - termux
---

While getting ready for my big move to Facebook, I came across way too many old laptops. One in particular had a solid 128GB of disk space that I couldn't bring myself to throw into the electronics recycling bin. After looking around online for some good potential use cases, I finally decided that I'd try my hand at setting up a simple Linux-based local media server.

For this project, I wanted to run my server constantly in my room, allowing me to upload photos, videos, and documents from any device on the network to the server safely and securely. It turns out, the process is actually quite simple, consisting of the following steps:
1. Create an <a class="link" href="https://www.geemichael.com/technology/2018/01/17/arch-usb/">Arch Linux installation medium</a>
2. <a class="link" href="https://www.geemichael.com/technology/2017/12/18/arch-install-chromebook/">Install Arch on your server laptop</a>
3. Start an SSH server
4. (Optional) Install a terminal on your phone
5. Upload from any device to the server

# The Server Part

The following section details how to set up the "server" part of the media server. Before beginning, be sure to have a user account named ```media```.

## Starting an SSH Server

This section will describe how to start an SSH server on your server machine.

First, install `openssh`:
```console
sudo pacman -S openssh
```

Then start the sshd service:
```console
# systemctl start sshd.service
```

your SSH server should now be started. You should be able to run the following from your server and successfully SSH into the server itself:

```console
media@myhostname ~]$ ssh media@localhost
```

## Connecting to the SSH server

Let's now confirm that we can successfully SSH into the server. Find your server's local IP address:
```console
ip addr | grep "inet"
```
This number will have the form X.X.X.X

Then, from a different device on the same network, you should be able to SSH into the server:

```console
ssh media@X.X.X.X
```

## Uploading Files

If the above works, you should now be able to upload files to the media server using `scp`. To upload a folder, use the `-r` flag. Otherwise, order the arguments to be source file to destination:

```console
scp -r ./local_dir media@X.X.X.X:/path/to/destination
```

## Termux

You can even do the same process from your Android phone. Termux is a terminal app designed for mobile phones. Simply install Termux, download the `openssh` package, and perform a secure copy of your mobile device's files. To get access to Android's photos, you may need to run the following in Termux:
```console
termux-setup-storage
```
This gives you permissions to the media folders on your device and populates the home folder with a storage subdirectory.

# The Media Part

Here is how to turn your server machine into a minimalist media-viewing device using the Chromium web browser.

We'll give our  ```media``` user media-viewing capabilities by running Chromium full-screen when ```startx``` is called. Within the browser, you should be able to open PDFs, movie files, and images, making it a great all-in-one media-viewing application.

First, run the following installation:
```console
sudo pacman -S xorg xorg-xinit chromium
```

After the install is complete, edit your ```.xinitrc``` file to include the ```chromium``` command. This file is executed when ```startx``` is run:

```console
echo chromium >> ~/.xinitrc
```

Personally, I had some issues with the display not fully filling the screen when I ran ```startx```. To fix this, I changed the Chromium config file at ```~/.config/chromium/Default/Preferences``` to have the ```window_placement``` object fill the entire screen's coordinates. See <a class="link" href="https://unix.stackexchange.com/questions/273989/how-can-i-make-chromium-start-full-screen-under-x">this</a> stackoverflow link for more information.

And with that, you should be able to reuse any old laptops for file storage and file previewing!

