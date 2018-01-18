---
layout: post
title:  "A Definitive Arch Linux Install Guide for the Chromebook C720"
date:   2017-12-18
categories: technology
img: ""
tags:
  - arch linux 
---

After the many, many times I've struggled to install and reinstall Arch Linux on a device, I've decided *enough is enough*. It's time to write a complete guide for installing Arch on a Chromebook C720.

I don't really know how I ended up owning three of these laptops, but it is what it is. The [official Arch install guide](https://wiki.archlinux.org/index.php/installation_guide) is a bit vague about setting up grub and partitions, so I'm going to document an example setup here.

The basic procedure is as follows:
1. Connect to wi-fi.
2. Update the system clock.
3. Partition the hard drive.
4. Mount partitions.
5. Install everything.
6. fstab.
7. GRUB.
8. Final touches.

<h1 class="invite">Connect to wi-fi.</h1>
```
# wifi-menu
```
You'll need wi-fi to install packages.
<h1 class="invite">Update the system clock.</h1>
```
# timedatectl set-ntp true
```

<h1 class="invite">Partition the hard drive.</h1>
We'll be using a GPT partition table. Additionally, we'll be using GRUB as our bootloader, so there needs to be a partition for booting as well.

```
(parted) mklabel gpt
(parted) mkpart primary 1MiB 3MiB
(parted) name 1 grub
(parted) set 1 bios_grub on
(parted) mkpart primary 3MiB 131MiB
(parted) name 2 boot
(parted) mkpart primary 131MiB 2GiB
(parted) name 3 swap
(parted) mkpart primary 2GiB 100%
(parted) name 4 rootfs
```

This makes a BIOS partition for GRUB, a boot partition, a swap partition, and disk space.

<h1 class="invite">Mount partitions.</h1>

First, format the partitions with the appropriate filesystem:
```
# mkfs.ext4 /dev/sda2
# mkfs.ext4 /dev/sda4
```

Then, mount the hard drive to an accessible path we can chroot into later.
```
mount /dev/sda4 /mnt
mkdir /mnt/boot
mount /dev/sda2 /mnt/boot
```

<h1 class="invite">Install everything.</h1>
The base and base-devel packages contain most things needed to get up and running. Use pacstrap to install:

```
# pacstrap \mnt base base-devel
```

If you run into problems about keys not being found, update the archlinux keyring:

```
# pacman -Sy archlinux-keyring
```

Then, update your USB install with `pacman -Syu`.

<h1 class="invite">fstab.</h1>

Generate the fstab afterwards:
```
# genfstab -U /mnt >> /mnt/etc/fstab
```

<h1 class="invite">GRUB.</h1>

We'll now start customizing the newly installed Arch copy. First chroot:
```
# arch-chroot /mnt
```

Let's set up booting to the new OS.
```
# pacman -Syu grub
# grub-install /dev/sda
# grub-mkconfig -o /boot/grub/grub.cfg
```

If there's an error, either this guide is bad or you messed up somewhere.

<h1 class="invite">Final Touches</h1>

Link the timezone:
```
# ln -sf /usr/share/zoneinfo/America/Los_Angeles /etc/localtime
```

Run hwclock to generate /etc/adjtime:
```
# hwclock --systohc
```

Set your locale by uncommenting your desired locale (en_US.UTF-8 UTF-8):
```
# nano /etc/locale.gen
```

Make your edits and run:
```
# locale-gen
```

And set the `LANG` variable in `locale.conf`:
```
LANG=en_US.UTF-8
```

Set the LANG variable as well:
```
echo LANG=en_US.UTF-8 >> /etc/locale.conf
```

Set your hostname. This is the "name" of your computer:
```
echo myhostname >> /etc/hostname
```

Add a matching entry to your hosts file:
```
127.0.0.1	localhost.localdomain	localhost
::1		localhost.localdomain	localhost
127.0.1.1	myhostname.localdomain	myhostname
```

Set a password for root:
```
# passwd
```

<h1 class="header">DONE!</h1>

Alright, good job, ctrl-D to exit chroot, unmount the OS:

```
unmount -R /mnt
```

Restart, and pray that you boot into Arch Linux the next time around.