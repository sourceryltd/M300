#!/bin/sh
# Start the Wifi control API server
node /home/pi/M300/wifi_ctrl/index.js &

# Start the API Server
python /home/pi/M300/server.py &

# Start the File Server 
cd /media/usb
python2 /home/pi/M300/file_server.py 9990 &

DISPLAY=:0.0 xset s noblank
DISPLAY=:0.0 xset s off
DISPLAY=:0.0 xset -dpms
DISPLAY=:0.0 unclutter -root &

rm -rf ~/.config/chromium/Singleton*
rm -r  /home/pi/.cache/chromium/Default/Cache/*
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/pi/.config/chromium/Default/Preferences
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' /home/pi/.config/chromium/Default/Preferences

matchbox-window-manager -use_titlebar no &
#chromium-browser --display=:0 --kiosk --incognito --window-position=0,0 http://localhost/
#chromium-browser --display=:0  --incognito --window-position=0,0 http://localhost/
