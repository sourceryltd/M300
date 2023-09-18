# M300-3D_Printer

# Disable Desktop GUI
sudo armbian-config

# Enable console based autologin
sudo cp /home/pi/M300/config_files/orangepi/20-autologin.conf /lib/systemd/system/getty@tty1.service.d/20-autologin.conf

sudo mkdir /media/usb/
sudo apt-get update
sudo apt-get install chromium unclutter lighttpd software-properties-common build-essential cmake gcc g++ libjpeg62-turbo-dev libjpeg62-turbo-dev --no-install-recommends xserver-xorg xinit xdotool matchbox-window-manager xautomation ffmpeg hostapd dnsmasq plymouth plymouth-themes subversion libjpeg62-turbo-dev imagemagick libv4l-dev python3-dev python3.11-venv
sudo apt-get upgrade
sudo apt-get install dh-autoreconf cmake python3-setuptools python3-sip-dev python3-pip

sudo dpkg -i /home/pi/M300/config_files/orangepi/libssl1.1_1.1.1n-0+deb10u3_arm64.deb
sudo dpkg -i /home/pi/M300/config_files/orangepi/haproxy_1.8.19-1+deb10u4_arm64.deb
sudo apt-get -f install

curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
nvm install 14 && nvm use 14

git clone https://github.com/sourceryltd/M300.git
cd /home/pi/M300/wifi_ctrl
npm install

cd ..
sudo rm /usr/lib/python3.11/EXTERNALLY-MANAGED
pip install -r /home/pi/M300/requirements.txt

# Update the Boot Splash screen
sudo cp /home/pi/M300/bootimg.png /usr/share/plymouth/themes/pix/splash.png

# Install Mjpg-Streamer
git clone https://github.com/jacksonliam/mjpg-streamer.git
cd mjpg-streamer && cd mjpg-streamer-experimental && make 
sudo make install

echo "nvm use 14" >> /home/pi/.bashrc
echo "xinit /home/pi/M300/kiosk.sh -- vt$(fgconsole)" >> /home/pi/.bashrc

# on Armbian we have to use Xrand to rotate the screen
echo "xrandr -o left" >> kiosk.sh

# on Armbian the chromium browser is called "chromium"  on RaspberryPi OS it's called  "chromium-browser"
echo "chromium --display=:0  --incognito --window-position=0,0 http://localhost/" >> kiosk.sh

# Copy System services
sudo cp /home/pi/M300/startup_services/*.service /etc/systemd/system

sudo systemctl enable autohotspot.service
sudo systemctl enable haproxy.service
sudo systemctl enable wifi-api.service
sudo systemctl enable octoprint.service
sudo systemctl enable splashscreen.service

# Use raspi-config to set the login mode to  console + autologin
sudo armbian-config

# Install octoprint
cd /home/pi/
python3 -m venv OctoPrint
/home/pi/OctoPrint/bin/pip3 install OctoPrint

sudo usermod -a -G tty pi
sudo usermod -a -G dialout pi

rm -rf /home/pi/Desktop
rm -rf /home/pi/Documents
rm -rf /home/pi/Downloads
rm -rf /home/pi/Music
rm -rf /home/pi/Pictures
rm -rf /home/pi/Public
rm -rf /home/pi/Templates
rm -rf /home/pi/Videos

# Configure HAProxy
sudo cp /home/pi/M300/config_files/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg
sudo cp /home/pi/M300/config_files/haproxy/errors/*.* /etc/haproxy/errors/

# copy WWW contents to the Lighty Webserver html directory
sudo cp -a /home/pi/M300/www/html/. /var/www/html/
rm -rf /home/pi/M300/www

# copy over snakeoil SSL certs
sudo  cp /home/pi/M300/config_files/ssl/snakeoil.pem /etc/ssl/
sudo  cp /home/pi/M300/config_files/ssl/ssl-cert-snakeoil.pem /etc/ssl/certs/

# Update the Xorg touchscreen config to swap x-y coordinates when screen is in portrate mode
sudo cp /home/pi/M300/config_files/40-libinput.conf /usr/share/X11/xorg.conf.d/

# python 2.7 is not installable on Armbian since it's depreciated in nearly every Linux Distribution - we have to compile manually
wget https://www.python.org/ftp/python/2.7.9/Python-2.7.9.tgz
sudo tar xzf Python-2.7.9.tgz
cd Python-2.7.9
sudo ./configure --enable-optimizations
sudo make altinstall

python2.7 -V
~ Python 2.7.9
sudo ln -sfn '/usr/local/bin/python2.7' '/usr/bin/python2'
sudo update-alternatives --install /usr/bin/python python /usr/bin/python2 1
