# M300-3D_Printer


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
#npm start

cd ..
pip install -r /home/pi/M300/requirements.txt

# Update the Boot Splash screen
sudo mv /usr/share/plymouth/themes/pix/splash.png /usr/share/plymouth/themes/pix/splash.png.bak
sudo cp /home/pi/M300/bootimg.png /usr/share/plymouth/themes/pix/splash.png

# Install Mjpg-Streamer
git clone https://github.com/jacksonliam/mjpg-streamer.git
cd mjpg-streamer
cd mjpg-streamer-experimental
make
sudo make install

cat .bashrc >> nvm use 14
cat /home/pi/.bashrc >> xinit /home/pi/M300/kiosk.sh -- vt$(fgconsole)

# Copy System services
sudo cp /home/pi/M300/startup_services/autohotspot.service /etc/systemd/system
sudo cp /home/pi/M300/startup_services/splashscreen.service /etc/systemd/system
sudo systemctl enable autohotspot.service
sudo systemctl enable splashscreen.service
