#!/bin/bash

# PATH TO YOUR HOSTS FILE
ETC_HOSTS=/etc/hosts

ACTION=$1

# Hostname to add/remove.
HOSTNAME=$2

# DEFAULT IP FOR HOSTNAME
IP=$3

removehost() {
    if [ -n "$(grep $HOSTNAME /etc/hosts)" ]
    then
        echo "$HOSTNAME Found in your $ETC_HOSTS, Removing now...";
        sudo sed -i".bak" "/$HOSTNAME/d" $ETC_HOSTS
    else
        echo "$HOSTNAME was not found in your $ETC_HOSTS";
    fi
}

addhost() {
    sed -i "s/.*/$HOSTNAME/g" /etc/hostname
    HOSTS_LINE="$IP\t$HOSTNAME"
    if [ -n "$(grep $HOSTNAME /etc/hosts)" ]
        then
            echo "$HOSTNAME already exists : $(grep $HOSTNAME $ETC_HOSTS)"
        else
            echo "Adding $HOSTNAME to your $ETC_HOSTS";
            sudo -- sh -c -e "echo '$HOSTS_LINE' >> /etc/hosts";

            if [ -n "$(grep $HOSTNAME /etc/hosts)" ]
                then
                    echo "$HOSTNAME was added succesfully \n $(grep $HOSTNAME /etc/hosts)";
                else
                    echo "Failed to Add $HOSTNAME, Try again!";
            fi
    fi
}

echo $ACTION
echo $HOSTNAME
echo $IP

if [ $ACTION == "add" ]
then
  addhost
fi

if [ $ACTION == "remove" ]
then
  removehost
fi
