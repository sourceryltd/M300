#!/bin/sh

cd /home/pi/M300/makerhub-api
find .git/objects/ -size 0 -delete
git reset --hard
sleep 10
git remote set-url origin git@github.com:makermadecnc/makerhub-api.git
git remote update

UPSTREAM=${1:-'@{u}'}
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")
BASE=$(git merge-base @ "$UPSTREAM")

if [ $LOCAL = $REMOTE ]; then
    echo "Up-to-date"
elif [ $LOCAL = $BASE ]; then
    echo "Need to pull"
elif [ $REMOTE = $BASE ]; then
    echo "Need to push"
else
    echo "Diverged"
fi
