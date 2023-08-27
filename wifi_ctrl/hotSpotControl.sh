#!/bin/bash
#version 0.961-N/HS-I

#You may share this script on the condition a reference to RaspberryConnect.com
#must be included in copies or derivatives of this script.

#Network Wifi & Hotspot with Internet
#A script to switch between a wifi network and an Internet routed Hotspot
#A Raspberry Pi with a network port required for Internet in hotspot mode.
#Works at startup or with a seperate timer or manually without a reboot
#Other setup required find out more at
#http://www.raspberryconnect.com

wifidev="wlan0" #device name to use. Default is wlan0.
ethdev="eth0" #Ethernet port to use with IP tables
#use the command: iw dev ,to see wifi interface name

IFSdef=$IFS
cnt=0
#These four lines capture the wifi networks the RPi is setup to use
wpassid=$(awk '/ssid="/{ print $0 }' /etc/wpa_supplicant/wpa_supplicant.conf | awk -F'ssid=' '{ print $2 }' | sed 's/\r//g'| awk 'BEGIN{ORS=","} {print}' | sed 's/\"/''/g' | sed 's/,$//')
IFS=","
ssids=($wpassid)
IFS=$IFSdef #reset back to defaults


#Note:If you only want to check for certain SSIDs
#Remove the # in in front of ssids=('mySSID1'.... below and put a # infront of all four lines above
# separated by a space, eg ('mySSID1' 'mySSID2')
#ssids=('mySSID1' 'mySSID2' 'mySSID3')

#Enter the Routers Mac Addresses for hidden SSIDs, seperated by spaces ie
#( '11:22:33:44:55:66' 'aa:bb:cc:dd:ee:ff' )
mac=()

ssidsmac=("${ssids[@]}" "${mac[@]}") #combines ssid and MAC for checking

createAdHocNetwork()
{
    echo "Creating Hotspot"
    ip link set dev "$wifidev" down
    ip a add 192.168.50.5/24 brd + dev "$wifidev"
    ip link set dev "$wifidev" up
    dhcpcd -k "$wifidev" >/dev/null 2>&1
    iptables -t nat -A POSTROUTING -o "$ethdev" -j MASQUERADE
    iptables -A FORWARD -i "$ethdev" -o "$wifidev" -m state --state RELATED,ESTABLISHED -j ACCEPT
    iptables -A FORWARD -i "$wifidev" -o "$ethdev" -j ACCEPT
    systemctl start dnsmasq
    systemctl start hostapd
    echo 1 > /proc/sys/net/ipv4/ip_forward
}

KillHotspot()
{
    echo "Shutting Down Hotspot"
    ip link set dev "$wifidev" down
    systemctl stop hostapd
    systemctl stop dnsmasq
    iptables -D FORWARD -i "$ethdev" -o "$wifidev" -m state --state RELATED,ESTABLISHED -j ACCEPT
    iptables -D FORWARD -i "$wifidev" -o "$ethdev" -j ACCEPT
    echo 0 > /proc/sys/net/ipv4/ip_forward
    ip addr flush dev "$wifidev"
    ip link set dev "$wifidev" up
    dhcpcd  -n "$wifidev" >/dev/null 2>&1
}

ChkWifiUp()
{
	echo "Checking WiFi connection ok"
        sleep 20 #give time for connection to be completed to router
	if ! wpa_cli -i "$wifidev" status | grep 'ip_address' >/dev/null 2>&1
        then #Failed to connect to wifi (check your wifi settings, password etc)
	       echo 'Wifi failed to connect, falling back to Hotspot.'
               wpa_cli terminate "$wifidev" >/dev/null 2>&1
	       createAdHocNetwork
	fi
}

chksys()
{
    #After some system updates hostapd gets masked using Raspbian Buster, and above. This checks and fixes
    #the issue and also checks dnsmasq is ok so the hotspot can be generated.
    #Check Hostapd is unmasked and disabled
    if systemctl -all list-unit-files hostapd.service | grep "hostapd.service masked" >/dev/null 2>&1 ;then
	systemctl unmask hostapd.service >/dev/null 2>&1
    fi
    if systemctl -all list-unit-files hostapd.service | grep "hostapd.service enabled" >/dev/null 2>&1 ;then
	systemctl disable hostapd.service >/dev/null 2>&1
	systemctl stop hostapd >/dev/null 2>&1
    fi
    #Check dnsmasq is disabled
    if systemctl -all list-unit-files dnsmasq.service | grep "dnsmasq.service masked" >/dev/null 2>&1 ;then
	systemctl unmask dnsmasq >/dev/null 2>&1
    fi
    if systemctl -all list-unit-files dnsmasq.service | grep "dnsmasq.service enabled" >/dev/null 2>&1 ;then
	systemctl disable dnsmasq >/dev/null 2>&1
	systemctl stop dnsmasq >/dev/null 2>&1
    fi
}


FindSSID()
{
#Check to see what SSID's and MAC addresses are in range
ssidChk=('NoSSid')
i=0; j=0
until [ $i -eq 1 ] #wait for wifi if busy, usb wifi is slower.
do
        ssidreply=$((iw dev "$wifidev" scan ap-force | egrep "^BSS|SSID:") 2>&1) >/dev/null 2>&1
        #echo "SSid's in range: " $ssidreply
	printf '%s\n' "${ssidreply[@]}"
        echo "Device Available Check try " $j
        if (($j >= 10)); then #if busy 10 times goto hotspot
                 echo "Device busy or unavailable 10 times, going to Hotspot"
                 ssidreply=""
                 i=1
	elif echo "$ssidreply" | grep "No such device (-19)" >/dev/null 2>&1; then
                echo "No Device Reported, try " $j
		NoDevice
        elif echo "$ssidreply" | grep "Network is down (-100)" >/dev/null 2>&1 ; then
                echo "Network Not available, trying again" $j
                j=$((j + 1))
                sleep 2
	elif echo "$ssidreply" | grep "Read-only file system (-30)" >/dev/null 2>&1 ; then
		echo "Temporary Read only file system, trying again"
		j=$((j + 1))
		sleep 2
	elif echo "$ssidreply" | grep "Invalid exchange (-52)" >/dev/null 2>&1 ; then
		echo "Temporary unavailable, trying again"
		j=$((j + 1))
		sleep 2
	elif echo "$ssidreply" | grep -v "resource busy (-16)"  >/dev/null 2>&1 ; then
               echo "Device Available, checking SSid Results"
		i=1
	else #see if device not busy in 2 seconds
                echo "Device unavailable checking again, try " $j
		j=$((j + 1))
		sleep 2
	fi
done

for ssid in "${ssidsmac[@]}"
do
     if (echo "$ssidreply" | grep -F -- "$ssid") >/dev/null 2>&1
     then
	      #Valid SSid found, passing to script
              echo "Valid SSID Detected, assesing Wifi status"
              ssidChk=$ssid
              return 0
      else
	      #No Network found, NoSSid issued"
              echo "No SSid found, assessing WiFi status"
              ssidChk='NoSSid'
     fi
done
}

NoDevice()
{
	#if no wifi device,ie usb wifi removed, activate wifi so when it is
	#reconnected wifi to a router will be available
	echo "No wifi device connected"
	wpa_supplicant -B -i "$wifidev" -c /etc/wpa_supplicant/wpa_supplicant.conf >/dev/null 2>&1
	exit 1
}

echo $1

chksys

if [ $1 == "enable_hotspot" ]
then

  systemctl unmask hostapd
  sudo systemctl disable hostapd
  sudo systemctl disable dnsmasq
  sed -i "s/^#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/" /etc/sysctl.conf
  sed -i "s/^#nohook wpa_supplicant/nohook wpa_supplicant/" /etc/dhcpcd.conf
  systemctl enable autohotspot.service

  if systemctl status hostapd | grep "(running)" >/dev/null 2>&1
  then
        echo "Hostspot already active"
  elif { wpa_cli status | grep "$wifidev"; } >/dev/null 2>&1
  then
        echo "Cleaning wifi files and Activating Hotspot"
        wpa_cli terminate "$wifidev" >/dev/null 2>&1
        ip addr flush "$wifidev"
        ip link set dev "$wifidev" down
        rm -r /var/run/wpa_supplicant >/dev/null 2>&1
        createAdHocNetwork
  else #"No SSID, activating Hotspot"
        createAdHocNetwork
  fi
fi

if [ $1 == "disable_hotspot" ]
then

  systemctl disable autohotspot
  sed -i "s/^net.ipv4.ip_forward=1/#net.ipv4.ip_forward=1/" /etc/sysctl.conf
  sed -i "s/^nohook wpa_supplicant/#nohook wpa_supplicant/" /etc/dhcpcd.conf

  if [ ! -z "$2" ]
  then
    if [ ! -z "$3" ]
    then
      echo "network={" >> /etc/wpa_supplicant/wpa_supplicant.conf
      echo "	ssid=\"$2\"" >> /etc/wpa_supplicant/wpa_supplicant.conf
      echo "	psk=\"$3\"" >> /etc/wpa_supplicant/wpa_supplicant.conf
      echo "}" >> /etc/wpa_supplicant/wpa_supplicant.conf
    fi
  fi

  FindSSID
  # waiting for wifi connection

  if [ ! -z "$2" ]
  then
    if [ ! -z "$3" ]
    then
      sleep 10
      # checking wifi connection
      if ! wpa_cli -i "$wifidev" status | grep 'ip_address' >/dev/null 2>&1
      then
        echo 'Wifi failed to connect.'
      fi
    fi
  fi

  echo 0 > /proc/sys/net/ipv4/ip_forward #deactivate ip forwarding
  if systemctl status hostapd | grep "(running)" >/dev/null 2>&1
  then #hotspot running and ssid in range
         KillHotspot
         echo "Hotspot Deactivated, Bringing Wifi Up"
         wpa_supplicant -B -i "$wifidev" -c /etc/wpa_supplicant/wpa_supplicant.conf >/dev/null 2>&1
  elif { wpa_cli -i "$wifidev" status | grep 'ip_address'; } >/dev/null 2>&1
  then #Already connected
         echo "Wifi already connected to a network"
  else #ssid exists and no hotspot running connect to wifi network
         echo "Connecting to the WiFi Network"
         wpa_supplicant -B -i "$wifidev" -c /etc/wpa_supplicant/wpa_supplicant.conf >/dev/null 2>&1
  fi
fi

if [ $1 == "change_name" ]
then
  echo $2
  sed -i "s/^ssid=.*$/ssid=$2/" /etc/hostapd/hostapd.conf
fi

if [ $1 == "change_pass" ]
then
  echo $2
  sed -i "s/^wpa_passphrase=.*$/wpa_passphrase=$2/" /etc/hostapd/hostapd.conf
fi
