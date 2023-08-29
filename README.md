# M300-3D_Printer

- Burn New Rasapian OS to SD Card
- Setup Pi User with default password
- Setup Default Wifi Connection (for setup purposes) -- or plug into Ethernet

# sudo raspi-config
  task: system options -> Hostname:   "M300"
  task: advanced options -> Expand Filesystem
  task: interface options -> SSH: "YES"
  task: system options -> Boot / Autologin -> "Console Autologin"
  task: system options -> Splash Screen:  "YES"

# run install.sh
