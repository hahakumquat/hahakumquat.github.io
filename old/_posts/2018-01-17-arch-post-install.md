---
layout: post
title: "Arch Linux: Post-Install Notes"
date: 2018-01-17
categories: technology
img: ""
tags:
  - arch linux
  - packages
---

Here's some things you should do after successfully installing Arch Linux.

# Install Useful Packages

- grub: for booting
- iw, wpa_supplicant: wifi stuff
- dialog: to allow wifi-menu
- intel-ucode: for Intel CPUs
- xorg-server: display server
- xorg-xinit: to startx
- xterm: because xinit needs a terminal
- chromium: to browse the Internet
- Emacs: because everyone needs a _good_ text editor
- arandr: screen extend
- ttf-dejavu: fonts
- xbindkeys: shortcuts
- xorg-xmodmap: change what the buttons do
- xorg-xbacklight: backlight
- xf86-input-libinput: mouse
- scrot: print screen
- pulseaudio: audio
- alsa-utils: audio
- pavucontrol: audio UI

# Make a user

```
useradd -m -G wheel -s /bin/bash username
passwd username
nano /etc/sudoers
# Comment out %wheel ALL=(ALL) ALL
```

# WLAN and Bluetooth Improvement
```
/etc/modprobe.d/ath9k.conf

options ath9k bt_ant_diversity=1 ps_enable=0
btcoex_enable=1
```

Setting `ps_enable=1` might freeze your system, but it saves power.

# Touchpad Settings
```
/etc/X11/xorg.conf.d/50-cros-touchpad.conf

Section "InputClass"
    Identifier "touchpad peppy cyapa"
        Driver "synaptics"
        MatchIsTouchpad "on"
        MatchDevicePath "/dev/input/event*"
            Option "TapButton1" "1"
            Option "TapButton2" "3"
            Option "TapButton3" "2"
	    Option "ClickFinger2" "3"
	    Option "ClickFinger3" "2"
            Option "VertTwoFingerScroll" "on"
	    Option "HorizTwoFingerScroll" "on"
            Option "FingerLow" "10"
	    Option "FingerHigh" "10"
EndSection
```

# xbindkeys
```
~/.xbindkeysrc

"amixer -c 1 set Master 5%+"
m:0x0 + c:76

"amixer -c 1 set Master 5%-"
m:0x0 + c:75

"pacmd dump|awk --non-decimal-data '$1~/set-sink-mute/{system ("pacmd "$1"
"$2" "($3=="yes"?"no":"yes"))}' > /dev/null"
m:0x0 + c:74 

"xbacklight -dec 5"
m:0x0 + c:72

"xbacklight -inc 5"
m:0x0 + c:73

"emacsclient -c"
m:0xc + c:26

"scrot -s '%Y-%m-%d-%s.png' -e 'mv $f ~/'"
m:0x4 + c:124

"systemctl suspend"
m:0x8 + c:124
```