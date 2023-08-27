#!/bin/bash

chmod -R 777 /home/pi/M300/*
pip install -r /home/pi/M300/makerhub-api/requirements.txt
python /home/pi/M300/makerhub-api/server.py &
cd /media/usb && python /home/pi/M300/makerhub-api/file_server.py 9990 &

DISPLAY=:0.0 xset s noblank
DISPLAY=:0.0 xset s off
DISPLAY=:0.0 xset -dpms

DISPLAY=:0.0 unclutter -root &

rm -rf ~/.config/chromium/Singleton*
rm -r  /home/pi/.cache/chromium/Default/Cache/*
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/pi/.config/chromium/Default/Preferences
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' /home/pi/.config/chromium/Default/Preferences

xinit /usr/bin/chromium-browser --noerrdialogs --disable-infobars --kiosk http://localhost/touch-ui &
