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


# Update the Boot Splash screen
sudo mv /usr/share/plymouth/themes/pix/splash.png /usr/share/plymouth/themes/pix/splash.png.bak
sudo cp /home/pi/M300/bootimg.png /usr/share/plymouth/themes/pix/splash.png

# Install Mjpg-Streamer
cd ~/
sudo apt-get install build-essential cmake gcc g++ libjpeg62-turbo-dev libjpeg62-turbo-dev
git clone https://github.com/jacksonliam/mjpg-streamer.git
cd mjpg-streamer
cd mjpg-streamer-experimental
make
sudo make install


# If using Rasapian Lite install Xorg Tools first
sudo apt-get install --no-install-recommends xserver-xorg

# Instlall Minimal Window Manager
sudo apt-get install xdotool matchbox-window-manager xautomation ffmpeg



