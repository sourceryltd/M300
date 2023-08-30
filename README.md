# M300-3D_Printer

- Burn New Rasapian OS to SD Card
- Change Wifi connection information in the Boot directory of the repository to that of your own Wifi hotspot
- copy Boot files from repository to boot partition on the SD Card
- reboot and login via SSH
- clone repository with:
-     git clone https://github.com/sourceryltd/M300


# sudo raspi-config
  task: system options -> Hostname:   "M300"
  task: advanced options -> Expand Filesystem
  task: interface options -> SSH: "YES"
  task: system options -> Boot / Autologin -> "Console Autologin"
  task: system options -> Splash Screen:  "YES"

# run install.sh
