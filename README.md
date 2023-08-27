# M300-3D_Printer

- Burn New PiOS (desktop version - not light version) to SD Card
- Setup Pi User with default password
- Setup Default Wifi Connection (for setup purposes) -- or plug into Ethernet

sudo raspi-config
  task: system options -> Hostname:   "M300"
  task: advanced options -> Expand Filesystem
  task: interface options -> SSH: "YES"
  task: system options -> Boot / Autologin -> "Console Autologin"
  task: system options -> Splash Screen:  "YES"

sudo mkdir /media/usb/
sudo apt-get update
sudo apt-get upgrade
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
nvm install 14 && nvm use 14
reboot
git clone https://github.com/sourceryltd/M300.git
cd M300
pip install -r requirements.txt && pip install serial
pip install requests

cat .bashrc >> nvm use 14
cat .bashrc >> sh /home/pi/M300/kiosk.sh

# Update the Boot Splash screen
cd /usr/share/plymouth/themes/pix/
sudo mv splash.png splash.png.bk
