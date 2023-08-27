#!/bin/bash

cd /home/pi/M300/makerhub-api
rm -rf .git
sleep 5
git init
git remote add origin git@github.com:makermadecnc/makerhub-api.git
git remote set-url origin git@github.com:makermadecnc/makerhub-api.git
git clean -f
git clean -fd
git fetch --all
git checkout --track origin/updateTesting
git pull origin updateTesting
cp -r old-ui/* /var/www/html
rm -rf /var/www/html/touch-ui/*
cp -r new-touch-ui/* /var/www/html/touch-ui
cp /var/www/html/touch-ui/static/js/* /var/www/html/static/js/
cp /var/www/html/touch-ui/static/css/* /var/www/html/static/css/

if [[ ! -e /var/www/html/static/media/ ]]; then
    mkdir /var/www/html/static/media/
fi

cp /var/www/html/touch-ui/static/media/* /var/www/html/static/media/
cp /home/pi/M300/makerhub-api/kiosk.sh /home/pi/kiosk.sh
cp /home/pi/M300/makerhub-api/update.sh /home/pi/M300/update.sh
cp /home/pi/M300/makerhub-api/update_zip.sh /home/pi/M300/update_zip.sh
chmod 777 /home/pi/M300/update.sh
chmod 777 /home/pi/M300/update_zip.sh
cd /home/pi/M300/makerhub-api/wifi_ctrl
chmod 777 /home/pi/M300/makerhub-api/wifi_ctrl/hotSpotControl.sh
chmod 777 /home/pi/M300/makerhub-api/wifi_ctrl/manageHostName.sh
chmod 777 /home/pi/M300/makerhub-api/wifi_ctrl/enableWebcam.sh
npm install
sleep 10
