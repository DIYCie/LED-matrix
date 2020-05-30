# LED-matrix
A framework for applications and games for the LED-matrix machine of the DIYCie activity.

## System setup
Before this application can run on the pi zero, a few things have to be changed on the system

### Disable sound module
In `/boot/config.txt` change the line `dtparam=audio=on` to `dtparam=audio=off`.

### Disable GPIO interrupts
Add the following lines to `/boot/config.txt` and reboot:
```
dtoverlay=gpio-no-irq
```

### Enable /dev/gpiomem access
Your user will need to be a member of the `gpio` group:
```console
$ sudo usermod -a -G gpio pi
```
and you need to configure udev with the following commands:
```console
$ sudo -i
$ cat >/etc/udev/rules.d/20-gpiomem.rules <<EOF
SUBSYSTEM=="bcm2835-gpiomem", KERNEL=="gpiomem", GROUP="gpio", MODE="0660"
EOF
$ exit
```
