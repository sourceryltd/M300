# makerhub-api

## Installation

  - clone this repo onto the pi
  - try running `python server.py` and `pip install` whichever packages are missing. Most likely:
    - `pip install bottle`
    - `pip install serial`


## Crontab configuration for auto-run

To add to crontab:
`crontab -e`

Add the following to the bottom:

```
@reboot sleep 15;python /home/pi/M300/makerhub-api/server.py
@reboot sleep 30;cd /home/pi/M300/makerhub-api/ui;sudo python -m SimpleHTTPServer 80
```

## kill auto-run process

Kill the API:

  - `ps aux | grep "server.py"`
  - find pids for the auto run
  - run `sudo kill {pid}` for the pids listed, like `sudo kill 123`

Kill the web server for UI:

  - `ps aux | grep "SimpleHTTPServer"`
  - find pids for the auto run
  - run `sudo kill {pid}` for the pids listed, like `sudo kill 123`

## Run manually

Server:

 - `cd ~/M300/makerhub-api`
 - `python server.py`

 UI:

 - `cd ~/M300/makerhub-api/ui`
 - `sudo python -m SimpleHTTPServer 80`
