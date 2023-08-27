#!/bin/bash

CAM_CONFIG=/boot/octopi.txt
PORT_SETTING='camera_http_options="-p 8090"'

ACTION=$1

removecamera() {
    if [ -n "$(grep $PORT_SETTING $CAM_CONFIG)" ]
    then
        echo "Camera port found in your $CAM_CONFIG, Removing now...";
        sed -i".bak" "/$PORT_SETTING/d" $CAM_CONFIG
        sed -ri 's|^(\s*)(  snapshot\s*:\s*.*$)|\  snapshot: |' /home/pi/.octoprint/config.yaml
    else
        echo "$PORT_SETTING was not found in your $CAM_CONFIG";
    fi
}

addcamera() {
    if [ -n "$(grep $PORT_SETTING $CAM_CONFIG)" ]
    then
        echo "Camera port found in your $CAM_CONFIG, Already Configured...";
    else
        echo "Enabling Camera..."
        echo $PORT_SETTING >> $CAM_CONFIG;
        sed -ri 's|^(\s*)(  snapshot\s*:\s*.*$)|\  snapshot: http://127.0.0.1:8090/?action=snapshot|' /home/pi/.octoprint/config.yaml
    fi
}

echo $ACTION

if [ $ACTION == "add" ]
then
  addcamera
fi

if [ $ACTION == "remove" ]
then
  removecamera
fi
