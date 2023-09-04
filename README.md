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

# Configure Octoprint Server
- in a browser connect to:   http://raspberrypi.local:5000
- run the configuration wizard
- Enter the size and type of 3d printer (300x300x400 build area)
- Leave the Extruder at defualt settings (single extruder,  0.4mm)
- Create new octoprint username and password:   user:m300,  pass:m300
- At the API section make sure "Enable COORS"  checkbox is selected
- Finish Octoprint Setup Wizard and reboot system
