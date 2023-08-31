# M300-3D_Printer

# Expand Filesystem to use entire disk
sudo raspi-config

sudo mkdir /media/usb/
sudo apt-get update
sudo apt-get install build-essential cmake gcc g++ libjpeg62-turbo-dev libjpeg62-turbo-dev --no-install-recommends xserver-xorg xinit xdotool matchbox-window-manager xautomation ffmpeg hostapd dnsmasq python2 python3-pip git cmake plymouth plymouth-themes pix-plym-splash chromium-browser
sudo apt-get upgrade

curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
nvm install 14 && nvm use 14

git clone https://github.com/sourceryltd/M300.git
cd /home/pi/M300/wifi_ctrl
npm install

cd ..
pip install -r /home/pi/M300/requirements.txt

# Update the Boot Splash screen
sudo cp /home/pi/M300/bootimg.png /usr/share/plymouth/themes/pix/splash.png

# Install Mjpg-Streamer
git clone https://github.com/jacksonliam/mjpg-streamer.git
cd mjpg-streamer
cd mjpg-streamer-experimental
make
sudo make install

echo "nvm use 14" >> /home/pi/.bashrc
echo "xinit /home/pi/M300/kiosk.sh -- vt$(fgconsole)" >> /home/pi/.bashrc

# Copy System services
sudo cp /home/pi/M300/startup_services/*.service /etc/systemd/system

sudo systemctl enable autohotspot.service
sudo systemctl enable splashscreen.service
sudo systemctl enable kiosk.service
sudo systemctl enable wifi-api.service

# Use raspi-config to set the login mode to  console + autologin
sudo raspi-config

# Install octoprint
python -m venv OctoPrint
OctoPrint/bin/pip install OctoPrint

# start octoprint with:
# ./OctoPrint/bin/octoprint serve
