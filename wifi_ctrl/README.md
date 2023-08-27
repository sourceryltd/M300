Wifi config API
---

Control Pi Wifi for robot via API

Configure Hotspot
----

Follow this tutorial http://www.raspberryconnect.com/network/item/330-raspberry-pi-auto-wifi-hotspot-switch-internet

Updated Oct 2017: now works with Raspbian Stretch and Raspbian Jessie
---------------------------------------------------------------------

  

When i am home I like to have my Raspberry Pi connected to the home network and the internet but when I am out I would like to connect to it via a hotspot using a tablet, phone or laptop. Usually this means when you are out you can't use your Raspberry Pi. The alternative is set it up as an access point so you can connect to it while you are out but when you are home you have to connect it to you routers ethernet port to use it on your home network.

I wanted a Raspberry Pi that connects to my home networks Wifi when I am at home or generates a wifi Hotspot/Access Point when I am out.

I have done this in a previous script but, for my use, when it is in Hotspot mode it was not able to use the internet if you connect an ethernet cable. Which was fine for me but some users required this feature. So this article is how to setup a Raspberry Pi so it can automatically switch between a network wifi connection and an internet routed hotspot.

If you are using a Raspbery Pi Zero w that has no network port and don't need an internet routed Access Point then you can use the other Hotspot switch script [Raspberry Pi - Auto WiFi Hotspot Switch - Direct Connection](/network/item/331-raspberry-pi-auto-wifi-hotspot-switch-no-internet-routing)

If you would just like a permanent hotspot then you can use this guide [Raspberry Pi - Hotspot/Access Point dhcpcd method](/network/item/333-raspberry-pi-hotspot-access-point-dhcpcd-method)

Aim:
----

*   When you're home:   On starting the Raspberry Pi it connects to your home routers wifi
*   When you're out: On starting, if any known wifi connection is not found it will generate a hotspot so a direct wifi connection can be made to the Raspberry Pi by a tablet, phone or laptop.
*   While in Hotspot mode:  if an ethernet cable is connected the Raspberry Pi, then it will have internet access along with any wifi device connected to the Hotspot.

### Additional Features:

Using a Cron, a timer can be setup so the wifi connection can be regulary checked. It will switch between a wifi router and a hotspot without a reboot depending on the results. This is useful for

*   Raspberry Pi in car entertainment systems
*   If the RPi looses wifi connection in your garden or near your home when using the camera or sensors.
*   You run a script or program at home connected to your router and wish to monitor it while you are out. As a hotspot is generated without a reboot the script/program is not interuppted.

It is also possible to run the script from a GPIO button so you can manually run the script to switch depending on where you are.

 Requirements:
--------------

This has been tested on Raspbian Jessie and Raspbian Stretch. To see which version you have enter the command lsb_release -a

*   Raspberry Pi 3
*   Raspberry Pi 1,2 with a Wifi Dongle*,
*   Raspberry Pi Zero W and Zero with WiFi Dongle* (internet hotspot not useable as it has no ethernet port. I suggest you use the non internet version of the script [Raspberry Pi - Auto WiFi Hotspot Switch - Direct Connection](/network/item/331-raspberry-pi-auto-wifi-hotspot-switch-no-internet-routing)
*   Wifi already configured for your home router

*some WiFi dongles don't work in adhoc mode or don't work with with the nl80211 driver used in this guide for RPi 3 & zero W inbuilt wifi, so you may want to check this first before starting.

This setup has been tested on Raspbian Jessie and Raspbian Stretch using a RPI3, RPI Zero W and a RPI 2 . A connection has been made to the Hotspot using an Android Tablet, Ipad2, Raspberry PI and Windows 10. All worked fine with SSH.

Note: Existing Autohotspot users
--------------------------------

If you are currently are using one of my other autohotspot scripts and would like to change it to this setup please read all sections as there are changes to the dnsmasq.conf file, interfaces file, the service file and the autohotspot file.

### Note:

Dnsmasq bug: in versions below 2.77 there is a recent bug that may cause the hotspot not to start for some users. This can be resolved by removing the dns-root-data. It may be benificial to do this before you start the rest of the installation as it has been reported that doing it after installation for effected users does not work but you won't know if it is an issue until after the installation is complete.

check your version with : dpkg -s dnsmasq

versions 2.77 and above are ok. If not then try the command:

sudo apt-get purge dns-root-data

thanks to danny for highlighting this.

### Note about Raspbian Stretch Network Device Names

For Raspbian Stretch there has been changes to how the network drivers are named, called Predictable Network Interface Names,  and may be different for the usual wlan0 and wlan1 for wifi and eth0 for ethernet connections. Though the official Foundation version of Raspbian Stretch seems to be keeping to the old standard names, at least at the time of writing,  this may not always be the case. For this guide I will use wlan0 as the device that is used.  

To check the device name for your setup enter the commmand iw dev and take a note of the "Interface" name. For wifi it should start with wl , replace your device name with any reference to wlan0 in the article, scripts and config files.

Step 1:
-------

To start with hostapd hotspot client and dnsmasq lightweight dns server need to be installed.

Open a Terminal session.

Update Raspbian with the latest updates by entering the commands:

```
sudo apt-get update
sudo apt-get upgrade
```

 To install hostapd enter the command:

`sudo apt-get install hostapd  
`

enter Y when prompted.

To install dnsmasq enter the command:

`sudo apt-get install dnsmasq  
`

enter Y when prompted

The installers will have set up the programme so they run when the pi is started. For this setup they only need to be started if the home router is not found. So automatic startup needs to be disabled. This is done with the following commands:

```
sudo systemctl disable hostapd
sudo systemctl disable dnsmasq
```
Now the hostspot configuration file can be setup. This contains the name of the WiFi signal you will need to connect to (SSID) and the security password.

_To edit the configuration files I will be using the nano text editor but if you prefer an editor with an point and click interface then replace nano with leafpad in the following instructions._

### Hostapd Configuration

Using a text editor edit the hostapd configuration file. This file won't exist at this stage so will be blank.

`sudo nano /etc/hostapd/hostapd.conf`

download file [here](/images/autohotspotN/update/hostapd.conf):

`interface=wlan0  
driver=nl80211  
ssid=RPiHotN  
hw_mode=g  
channel=6  
wmm_enabled=0  
macaddr_acl=0  
auth_algs=1  
ignore_broadcast_ssid=0  
wpa=2  
wpa_passphrase=1234567890  
wpa_key_mgmt=WPA-PSK  
wpa_pairwise=TKIP  
rsn_pairwise=CCMP`

*   The interface will be wlan0
*   The driver nl80211 works with the Raspberry Pi 3 & Zero W onboard WiFi but you will need to check that your wifi dongle is compatable and can use Access Point mode.

For more information on wifi dongles see [elinux.org/RPi\_USB\_Wi-Fi_Adapters](http://elinux.org/RPi_USB_Wi-Fi_Adapters)

*   The SSID is the name of the WiFi signal broadcast from the RPi, which you will connect to with your Tablet or phones WiFi settings.
*   Channel can be set between 1 and 13. If you are having trouble connection because of to many wifi signals in your area are using channel 6 then try another channel.
*   Wpa_passphrase is the password you will need to enter when you first connect a device to your Raspberry Pi's hotspot. This should be at least 8 characters and a bit more difficult to guess than my example.

To save the config file press ctrl & o and to exit nano press Ctrl & x

Now the defaults file needs to be updated to point to where the config file is stored.  
In terminal enter the command  
`sudo nano /etc/default/hostapd`

Change:  
#DAEMON_CONF=""  
to  
DAEMON_CONF="/etc/hostapd/hostapd.conf"

Check the DAEMON\_OPTS="" is preceded by a #, so is #DAEMON\_OPTS=""

And save.

### DNSmasq configuration

Next dnsmasq needs to be configured to allow the Rpi to act as a router and issue ip addresses. Open the dnsmasq.conf file with

sudo nano /etc/dnsmasq.conf

Go to the bottom of the file and add the following lines (download [here](/images/autohotspotN/update/AddTo-dnsmasqconfig.txt))

 #AutoHotspot config
interface=wlan0
no-resolv
bind-dynamic 
server=8.8.8.8
domain-needed
bogus-priv
dhcp-range=192.168.50.150,192.168.50.200,255.255.255.0,12h 

and the save (ctl & o) and exit (ctrl & x)

Step 2:
-------

Now that hostapd and dnsmasq are configured we now need to make some changes to the interfaces file, setup ip_forwarding and create a service. Once these are done we can then add the autohotspot script.

The interfaces file is not required and should be empty of any network config. Depending which version of Raspbian you have this file may still contain network config.

Enter

sudo nano /etc/network/interfaces

If your file shows more than the standard top 5 lines like this

 \# interfaces(5) file used by ifup(8) and ifdown(8)
\# Please note that this file is written to be used with dhcpcd
\# For static IP, consult /etc/dhcpcd.conf and 'man dhcpcd.conf'
\# Include files from /etc/network/interfaces.d:
source-directory /etc/network/interfaces.d 

then make a copy of of your file and then remove any excess lines from the interfaces file.

To make a backup of your interfaces file use the command

sudo cp /etc/network/interfaces /etc/network/interfaces-backup

###  ip forwarding

While the RPi is in hotspot mode ip forwarding needs to be on so the internet works when an ethernet cable is attached. The autohotspot script will switch ip forwarding on and off between network mode and hotspot mode but it needs to be on by default for the script to manage ip forwarding.

enter

sudo nano /etc/sysctl.conf

look for the line

\# Uncomment the next line to enable packet forwarding for IPv4  
#net.ipv4.ip_forward=1

and remove the # so it is

\# Uncomment the next line to enable packet forwarding for IPv4  
net.ipv4.ip_forward=1

now save (ctrl & o) and exit (ctrl & x)

### autohotspot service file

Next we have to create a service which will run the autohotspot script when the Raspberry Pi starts up.

create a new file with the command

sudo nano /etc/systemd/system/autohotspot.service

Then enter the following text or download [here](/images/autohotspotN/update/autohotspot.service)

 \[Unit\]
Description=Automatically generates an internet Hotspot when a valid ssid is not in range
After=multi-user.target
\[Service\]
Type=oneshot
RemainAfterExit=yes
ExecStart=/usr/bin/autohotspotN
\[Install\]
WantedBy=multi-user.target 

and save (ctrl & o) and exit (ctrl & x)

For the service to work it has to be enabled. To do this enter the command

sudo systemctl enable autohotspot.service

**Software check:**

If your version of Raspbian has been repeatedly upgraded from an old OS image, it is possible that that you don't have the correct wifi tools install. These are installed by default on more recent versions of Raspbian.

to check you have iw installed enter the command

dpkg -s iw

If it is installed the first two lines that shown should be

Package: iw  
Status: install ok installed

if not enter the command

sudo apt-get install iw

AutoHotspot Script
------------------

This is the main script that will manage your wifi connections between a wifi router and an Access Point.

It will search for any wifi connection that is setup on you Raspberry Pi by using the details found in /etc/wpa\_supplicant/wpa\_supplicant.conf

If no wifi signal is found for a known SSID then the script will shutdown the wifi network setup and create a Hotspot. If an ethernet cable that allows internet access is connect then the Hotspot will become a full internet access point. Allowing all connected devices to use the Internet. Without an ethernet connect the Raspberry Pi can be accessed from a wifi device using SSH or VNC.

 The script works with SSID's that contain spaces and by entering your routers MAC address it can be used with hidden SSID's.

### Hidden SSIDs

If you routers SSID is not broadcast/hidden then find this section in the script

#Enter the Routers Mac Addresses for hidden SSIDs, seperated by spaces ie  
#( '11:22:33:44:55:66' 'aa:bb:cc:dd:ee:ff' )  
mac=()

and enter you routers MAC address in the brackets of mac=() as shown in the example. Make sure mutiple MAC addresses are seperated by a space.

###  Creating the autohotspot script:

Create a new file with the command

sudo nano /usr/bin/autohotspotN

and add the autohotspot script. This can be downloaded from [here](/images/autohotspotN/update/autohotspotN)

 #!/bin/bash
#version 0.95-1-N/HS-I

#You may share this script on the condition a reference to RaspberryConnect.com 
#must be included in copies or derivatives of this script. 

#Network Wifi & Hotspot with Internet
#A script to switch between a wifi network and an Internet routed Hotspot
#A Raspberry Pi with a network port required for Internet in hotspot mode.
#Works at startup or with a seperate timer or manually without a reboot
#Other setup required find out more at
#http://www.raspberryconnect.com

wifidev="wlan0" #device name to use. Default is wlan0.
#use the command: iw dev ,to see wifi interface name 

IFSdef=$IFS
cnt=0
#These four lines capture the wifi networks the RPi is setup to use
wpassid=$(awk '/ssid="/{ print $0 }' /etc/wpa\_supplicant/wpa\_supplicant.conf | awk -F'ssid=' '{ print $2 }' ORS=',' | sed 's/\\"/''/g' | sed 's/,$//')
IFS=","
ssids=($wpassid)
IFS=$IFSdef #reset back to defaults


#Note:If you only want to check for certain SSIDs
#Remove the # in in front of ssids=('mySSID1'.... below and put a # infront of all four lines above
\# separated by a space, eg ('mySSID1' 'mySSID2')
#ssids=('mySSID1' 'mySSID2' 'mySSID3')

#Enter the Routers Mac Addresses for hidden SSIDs, seperated by spaces ie 
#( '11:22:33:44:55:66' 'aa:bb:cc:dd:ee:ff' ) 
mac=()

ssidsmac=("${ssids\[@\]}" "${mac\[@\]}") #combines ssid and MAC for checking

createAdHocNetwork()
{
    ip link set dev "$wifidev" down
    ip a add 192.168.50.5/24 brd + dev "$wifidev"
    ip link set dev "$wifidev" up
    iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
    iptables -A FORWARD -i eth0 -o "$wifidev" -m state --state RELATED,ESTABLISHED -j ACCEPT
    iptables -A FORWARD -i "$wifidev" -o eth0 -j ACCEPT
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
    iptables -D FORWARD -i eth0 -o "$wifidev" -m state --state RELATED,ESTABLISHED -j ACCEPT
    iptables -D FORWARD -i "$wifidev" -o eth0 -j ACCEPT
    echo 0 > /proc/sys/net/ipv4/ip_forward
    ip addr flush dev "$wifidev"
    ip link set dev "$wifidev" up
}

ChkWifiUp()
{
	echo "Checking WiFi connection ok"
        sleep 10 #give time for connection to be completed to router
	if ! wpa\_cli -i "$wifidev" status | grep 'ip\_address' >/dev/null 2>&1
        then #Failed to connect to wifi (check your wifi settings, password etc)
	       echo 'Wifi failed to connect, falling back to Hotspot.'
               wpa_cli terminate "$wifidev" >/dev/null 2>&1
	       createAdHocNetwork
	fi
}


FindSSID()
{
#Check to see what SSID's and MAC addresses are in range
ssidChk=('NoSSid')
i=0; j=0
until \[ $i -eq 1 \] #wait for wifi if busy, usb wifi is slower.
do
        ssidreply=$((iw dev "$wifidev" scan ap-force | egrep "^BSS|SSID:") 2>&1) >/dev/null 2>&1 
	if echo "$ssidreply" | grep "No such device (-19)" >/dev/null 2>&1; then
		NoDevice
	elif ! echo "$ssidreply" | grep "resource busy (-16)"  >/dev/null 2>&1 ;then
		i=1
	elif (($j >= 5)); then #if busy 5 times goto hotspot
                 ssidreply=""
		 i=1
	else #see if device not busy in 2 seconds
		j=$((j = 1))
		sleep 2
	fi
done

for ssid in "${ssidsmac\[@\]}"
do
     if (echo "$ssidreply" | grep "$ssid") >/dev/null 2>&1
     then
	      #Valid SSid found, passing to script
              ssidChk=$ssid
              return 0
      else
	      #No Network found, NoSSid issued"
              ssidChk='NoSSid'
     fi
done
}

NoDevice()
{
	#if no wifi device,ie usb wifi removed, activate wifi so when it is
	#reconnected wifi to a router will be available
	echo "No wifi device connected"
	wpa\_supplicant -B -i "$wifidev" -c /etc/wpa\_supplicant/wpa_supplicant.conf >/dev/null 2>&1
	exit 1
}

FindSSID

#Create Hotspot or connect to valid wifi networks
if \[ "$ssidChk" != "NoSSid" \] 
then
       echo 0 > /proc/sys/net/ipv4/ip_forward #deactivate ip forwarding
       if systemctl status hostapd | grep "(running)" >/dev/null 2>&1
       then #hotspot running and ssid in range
              KillHotspot
              echo "Hotspot Deactivated, Bringing Wifi Up"
              wpa\_supplicant -B -i "$wifidev" -c /etc/wpa\_supplicant/wpa_supplicant.conf >/dev/null 2>&1
              ChkWifiUp
       elif { wpa\_cli -i "$wifidev" status | grep 'ip\_address'; } >/dev/null 2>&1
       then #Already connected
              echo "Wifi already connected to a network"
       else #ssid exists and no hotspot running connect to wifi network
              echo "Connecting to the WiFi Network"
              wpa\_supplicant -B -i "$wifidev" -c /etc/wpa\_supplicant/wpa_supplicant.conf >/dev/null 2>&1
              ChkWifiUp
       fi
else #ssid or MAC address not in range
       if systemctl status hostapd | grep "(running)" >/dev/null 2>&1
       then
              echo "Hostspot already active"
       elif { wpa_cli status | grep "$wifidev"; } >/dev/null 2>&1
       then
              echo "Cleaning wifi files and Activating Hotspot"
              wpa_cli terminate >/dev/null 2>&1
              ip addr flush "$wifidev"
              ip link set dev "$wifidev" down
              rm -r /var/run/wpa_supplicant >/dev/null 2>&1
              ip link set dev "$wifidev" up
              createAdHocNetwork
       else #"No SSID, activating Hotspot"
              createAdHocNetwork
       fi 
fi 

and save (ctl & o) and exit (ctl & x)

For the autohotspotN script to work it needs to be executable. This is done with the command

sudo chmod +x /usr/bin/autohotspotN

Thats it, you are ready to go. Now test that everything is working ok.

Thanks to Willem Me and Tino for there contributions to the development of this script.

Testing the Hotspot
-------------------

To test that the RPi is setup ok reboot the RPI. When the desktop returns you should have the wifi icon ![Raspbian Pixel WiFI icon](/userimg/roboberry/wif.gif) by the clock.  
For those setting this up on a headerless RPi then you should see the pi on your routers network. 

To test the hotspot works ok edit the ssid name of your router in the wpa_supplicant file.

enter

sudo nano /etc/wpa\_supplicant/wpa\_supplicant.conf

and add 'off' to the end of your routers ssid. For example:

ctrl\_interface=DIR=/var/run/wpa\_supplicant GROUP=netdev  
update_config=1  
country=GB  
network={
	ssid="mySSID1"
	psk="myPassword"
	key_mgmt=WPA-PSK
} 

change to

ctrl\_interface=DIR=/var/run/wpa\_supplicant GROUP=netdev  
update_config=1  
country=GB  
network={
	ssid="mySSID1off"
	psk="myPassword"
	key_mgmt=WPA-PSK
} 

save (ctrl & o) and close (ctrl & x) the file

Now reboot the Raspberry Pi.

Once the RPi is up and running the wifi icon near the clock should now be two arrows facing opposite directions ![Raspbian Pixel AP mode icon](/userimg/roboberry/hotspot.gif) This means it is an access point. On a Tablet, phone or Laptop scan for wifi signals. You should see one for RPiHotN.

Select this as the wifi signal to connect to. The password is what you setup in the hostapd.conf file. From my example it is 1234567890

![android wifi in range list](/userimg/roboberry/android-wifi.jpg)

_Local wifi signals in range on Android_

For SSH and VNC the connection ip is 192.168.50.5 also if you have setup the Rpi as a webserver use the same ip to see the webpage.

For ssh use ssh [pi@192.168.50](mailto:pi@192.168.50) //<!\-\- document.getElementById('cloak92810').innerHTML = ''; var prefix = '&#109;a' + 'i&#108;' + '&#116;o'; var path = 'hr' + 'ef' + '='; var addy92810 = 'p&#105;' + '&#64;'; addy92810 = addy92810 + '192' + '&#46;' + '168' + '&#46;' + '50'; var addy\_text92810 = 'p&#105;' + '&#64;' + '192' + '&#46;' + '168' + '&#46;' + '50'; document.getElementById('cloak92810').innerHTML += '<a ' + path + '\\'' + prefix + ':' + addy92810 + '\\'>'+addy\_text92810+'<\\/a>'; //--> .5

For vnc use 192.168.50.5::5900

If you now connect an ethernet cable to the Raspbery Pi and your router and wait a few seconds the hotspot will allow connected wifi devices to use the internet as well as the RPi.

 Once you are happy the setup is working ok change the wpa_supplicant.conf file back to your routers ssid. From the next reboot the autohotspotN script will manage your wifi connection.

Setting up a Timer
------------------

If the autohotspotN script is set to be run at set intervals, when you go out of range of your home router it will automatically generate a hotspot and then when you get back in range it will deactivate the hotspot and connect to the routers wifi. If you run a program in the background or use programs like tmux then any software you are running will keep working.

If you have an active ssh or vnc session running when the switch happens it will be lost.

Using a Cron job, tasks can be set off automatically at certain times, dates or intervals. For my use running the script every 5 minutes is fine but this can be changed to your needs. To setup a cron task enter the command

crontab -e

At the bottom of the file enter the command

*/5 * * * * sudo /usr/bin/autohotspotN >/dev/null 2>&1

There is a space after each entry and * except the first *.

The first * position is for minutes. If you want it to check every minute just use * instead of */5

If you want to use hours, say every 2 hours enter it as

\* */2 * * * sudo /usr/bin/autohotspotN >/dev/null 2>&1

 Save the cron tab with ctrl & o and close it with ctrl & x

The cron job will automatically start straight away.

#### Note on Permissions:

by default the pi user does not need to enter a password to use the sudo command. If you are not using the default pi user and while doing this guide you have had to enter a password every time sudo is needed then you will find the the cron job will not work as it wont have permission to run the autohotspotN script.

To fix this you can give the user permission to run the script without a password.  
Enter the command

sudo visudo

enter your password  
at the bottom of the file add the following line, where username is the user that will be using the script:

username ALL= NOPASSWD: /usr/bin/autohotspotN

Now you will be able to run the script with sudo with the cron.

Thanks to Jim for pointing this out as an issue for some users.

### Disable Cron Timer

If you no longer need the timer running edit the cron with

crontab -e

and put a # infront so it is now

#*/5 * * * * sudo /usr/bin/autohotspot

The script will now only work at boot up or if you manually run the autohotspotN script with the command

sudo /usr/bin/autohotspotN

Script Removal
--------------

If you don't wish to continue using the autohotspotN script then the Raspberry Pi can be revered back to a standard wifi setup with the following steps.

Disable the script with the command

sudo systemctl disable autohotspot

Then disable ip forwarding

sudo nano /etc/sysctl.conf

look for the entry

\# Uncomment the next line to enable packet forwarding for IPv4  
net.ipv4.ip_forward=1

and add a # as follows

\# Uncomment the next line to enable packet forwarding for IPv4  
\# net.ipv4.ip_forward=1

If you had previous config in your interfaces file and made a backup you can restore your original interfaces file with the command

sudo mv /etc/network/interfaces-backup /etc/network/interfaces

Then reboot

The autohotspotN script will no longer have control of you wifi. Dnsmasq and hostapd can be uninstalled if you no longer need them.

###  Trouble Shooting

*   If you get no wifi connection or no hotspot and have this icon ![Network Down](/userimg/roboberry/networkdown.gif)then it is most likley the autohotspotN script is not executable or the service has not been enabled

redo the follow commands

sudo chmod +x /usr/bin/autohotspotN

sudo systemctl enable autohotspot.service

*   You are in range of your router but it only creates a hotspot. If there is an issue with connecting to the router, such as the password is wrong. The script will fall back to the hotspot so you still have some type of connection. Check your password in the wpa_supplicant.conf file. 
*   You can connect to the hotspot via an Android Phone but you can't get a ssh connection. Some users have found this issue where Android uses there data connection rather than the wifi. Disabeling data has allowed them to use ssh.   
*   If this setup is not working as expected you can check the script for errors by running it manually in a terminal window with the command, sudo /usr/bin/autohotspotN ,you can also check the service status with, sudo systemctl status -l autohotspot ,and if the hotspot has failed try, sudo systemctl status -l hostapd
*   You need to add a new wifi network to the RPi but it is in Hotspot mode so you are unable to scan for new wifi signals. You will need to add the new network to /etc/wpa\_supplicant/wpa\_supplicant manually. Enter the following details replacing mySSID and myPassword with the correct details. If your router has a hidden SSID/not Broadcast then include the line;  scan_ssid=1

ctrl\_interface=DIR=/var/run/wpa\_supplicant GROUP=netdev  
update_config=1  
country=GB  
  
network={
	ssid="mySSID1"
	psk="myPassword"
	key_mgmt=WPA-PSK
}