# M300-3D_Printer

# Expand Filesystem to use entire disk
sudo raspi-config

sudo mkdir /media/usb/
sudo apt-get update
sudo apt-get install lighttpd haproxy build-essential cmake gcc g++ libjpeg62-turbo-dev libjpeg62-turbo-dev --no-install-recommends xserver-xorg xinit xdotool matchbox-window-manager xautomation ffmpeg hostapd dnsmasq python2 python3-pip git cmake plymouth plymouth-themes pix-plym-splash chromium-browser subversion libjpeg62-turbo-dev imagemagick libav-tools libv4l-dev cmake
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
sudo systemctl enable octoprint.service
sudo systemctl enable haproxy.service

# Use raspi-config to set the login mode to  console + autologin
sudo raspi-config

# Install octoprint
python -m venv OctoPrint
OctoPrint/bin/pip install OctoPrint

sudo usermod -a -G tty pi
sudo usermod -a -G dialout pi

rm -rf /home/pi/Bookshelf
rm -rf /home/pi/Desktop
rm -rf /home/pi/Documents
rm -rf /home/pi/Music
rm -rf /home/pi/Pictures
rm -rf /home/pi/Public
rm -rf /home/pi/Templates
rm -rf /home/pi/Videos

# Configure HAProxy
sudo cp /config_files/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg
sudo cp /config_files/haproxy/errors/*.* /etc/haproxy/errors/

# copy WWW contents to the Lighty Webserver html directory
sudo cp -a /home/pi/M300/www/html/. /var/www/html/
rm -rf /home/pi/M300/www
