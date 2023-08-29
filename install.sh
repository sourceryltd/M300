# M300-3D_Printer


sudo mkdir /media/usb/
sudo apt-get update
sudo apt-get upgrade
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
nvm install 14 && nvm use 14
git clone https://github.com/sourceryltd/M300.git
pip install -r /home/pi/M300/requirements.txt

cat .bashrc >> nvm use 14


# Update the Boot Splash screen
sudo mv /usr/share/plymouth/themes/pix/splash.png /usr/share/plymouth/themes/pix/splash.png.bak
sudo cp /home/pi/M300/bootimg.png /usr/share/plymouth/themes/pix/splash.png

# Install Mjpg-Streamer
sudo apt-get install build-essential cmake gcc g++ libjpeg62-turbo-dev libjpeg62-turbo-dev --no-install-recommends xserver-xorg xdotool matchbox-window-manager xautomation ffmpeg hostapd dnsmasq
git clone https://github.com/jacksonliam/mjpg-streamer.git
cd mjpg-streamer
cd mjpg-streamer-experimental
make
sudo make install

cat /home/pi/.bashrc >> xinit /home/pi/M300/kiosk.sh -- vt$(fgconsole)
