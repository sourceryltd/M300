// Require
var express = require('express');
var app = express();
var cors = require('cors');
var request = require('request');
var piWifi = require('pi-wifi');
var bodyParser = require('body-parser');
var fs = require('fs');
var { exec } = require("child_process");
var { networkInterfaces } = require('os');
var startupNetworks = [];
  app.use(cors())
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Test
  app.get('/', function(req, res){

    var answer = new Object();
    answer.message  = "wifi config";

    piWifi.check(req.body.ssid, function(err, result) {
      if (err) {
        answer.status = err.message;
        res.json(answer);
      } else {
        // => If everything is working
        // { selected: true, connected: true, ip: '192.168.0.12' }
        // => Alternatively
        // { selected: false, connected: false }
        answer.status = result;
        res.json(answer);
      }

    });

  });

  // Connect to any auth style Network
  app.post('/connect', function(req, res){

    var answer = new Object();
    answer.message = 'connecting...';
    var networkDetails = {};

    console.log(req.body);

    if(req.body.ssid) {
      networkDetails.ssid = req.body.ssid;
    }

    if(req.body.username) {
      networkDetails.username = req.body.username;
    }

    if(req.body.password) {
      networkDetails.password = req.body.password;
    }

    if(networkDetails.ssid) {

      piWifi.connectTo(networkDetails, function (err) {
        if (err) {
          answer.status = " " + err.message;
          console.log(answer.status);

        } else {
          answer.status = "connected!";
        }

        res.json(answer);

      });

    } else {
      answer.status = " invalid parameters specified";
      res.json(answer);
    }



  });

  // Disconnect
  app.post('/disconnect', function(req, res){

      if (req.body.disconnect == 'true') {

        var answer = new Object();
        answer.message = "disconnecting...";

        piWifi.disconnect(function(err) {

          if (err) {
            answer.status = err.message;
            res.json(answer);
          } else {
            answer.status = 'Disconnected from network!';
            res.json(answer);
          }

        });

      }

  });

  // List networks
  app.get('/networks', function(req, res){

        var answer = new Object();
        answer.message = "listing networks...";

        piWifi.listNetworks(function(err, networksArray) {

          if (err) {
            answer.status = err.message;
            fs.readFile('/home/pi/M300/makerhub-api/wifi_ctrl/ssids.txt', 'utf8', function (err,data) {
              if (err) {
                res.json(err);
              }

              lines = data.split("\n");
              answer.networks = [];
              for (let lineIdx in lines) {
                let network = lines[lineIdx].substring(lines[lineIdx].indexOf('ESSID:"') + 1);
                network = network.replace('SSID:"', '');
                network = network.replace('"','');
                answer.networks.push(network);
              }

              networks = [...new Set(answer.networks)];
              answer.networks = [];

              for (let netIdx in networks) {
                networkObj = {"network_id": netIdx, "ssid": networks[netIdx], "bssid":"any", "flags":""};
                answer.networks.push(networkObj);
              }
              startupNetworks = answer.networks;
              res.json(answer);
            });
          } else {
            answer.status = 'Listed networks!';
            answer.networks = networksArray;
            res.json(answer);
          }

        });
  });

  // Scan networks
  app.get('/networks/scan', function(req, res){

        var answer = new Object();
        answer.message = "scanning networks...";

        piWifi.scan(function(err, networks) {

          if (err) {
            answer.status = err.message;
            answer.refresh = false;
            // if in hotspot mode manually check wifis from startup
            fs.readFile('/home/pi/M300/makerhub-api/wifi_ctrl/ssids.txt', 'utf8', function (err,data) {
              if (err) {
                res.json(err);
              }

              lines = data.split("\n");
              answer.networks = [];
              for (let lineIdx in lines) {
                let network = lines[lineIdx].substring(lines[lineIdx].indexOf('ESSID:"') + 1);
                network = network.replace('SSID:"', '');
                network = network.replace('"','');
                answer.networks.push(network);
              }

              networks = [...new Set(answer.networks)];
              answer.networks = [];

              for (let netIdx in networks) {
                networkObj = {"network_id": netIdx, "ssid": networks[netIdx], "bssid":"any", "flags":""};
                answer.networks.push(networkObj);
              }
              startupNetworks = answer.networks;
              res.json(answer);
            });
          } else {
            answer.status = 'Scanned networks!';
            answer.refresh = true;
            answer.networks = networks;
            res.json(answer);
          }

        });

  });

  // Change .local name. Add or remove a hostname.
  app.post('/change/hostname', function(req, res){

        var answer = new Object();
        var ip = '127.0.1.1';
        var action = req.body.action;
        var hostname = req.body.hostname;
        answer.message = "Changing printer name...";

        if(action && hostname) {
          if (action != 'add' && action != 'remove') {
            answer.status = "invalid action specified";
            res.json(answer);
          } else {
            var cmd = "/home/pi/M300/makerhub-api/wifi_ctrl/manageHostName.sh "
              + action + " " + hostname + " " + ip

            exec(
              cmd,
              (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    answer.status = error.message;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                     answer.status = stderr;
                }
                answer.status = 'hostname ' + hostname + ' ' + action;
                answer.action = action;
                answer.success = true;
                console.log(`stdout: ${stdout}`);
                res.json(answer);
            });
          }

        } else {
          answer.status = "invalid parameters specified";
          res.json(answer);
        }

  });

  // Check hotspot
  app.get('/hotspot', function(req, res) {

        var answer = new Object();
        answer.message = "Checking hotspot";

        piWifi.detectSupplicant(function(err, iface, configFile) {
          if (err) {
            answer.status = err.message;
            res.json(answer);
          } else {
            answer.status = 'Hotspot running in interface' + iface +
                'using the configuration file' + configFile;
            res.json(answer);
          }

        });

  });

  // Connect hotspot
  app.post('/hotspot/connect', function(req, res){

        var answer = new Object();
        answer.message = "Connecting hotspot...";
        exec(
          "/home/pi/M300/makerhub-api/wifi_ctrl/hotSpotControl.sh enable_hotspot",
          (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                answer.status = error.message;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                 answer.status = stderr;
            }
            answer.status = 'Supplicant process Connected!';
            console.log(`stdout: ${stdout}`);
            res.json(answer);
        });

  });

  // Disconnect hotspot
  app.post('/hotspot/disconnect', function(req, res){

        var answer = new Object();
        answer.message = "Disconnecting hotspot...";
        var networkDetails = {};

        console.log(req.body);

        if(req.body.ssid) {
          networkDetails.ssid = req.body.ssid;
        }

        if(req.body.username) {
          networkDetails.username = req.body.username;
        }

        if(req.body.password) {
          networkDetails.password = req.body.password;
        }

        if(networkDetails.ssid && networkDetails.password) {
          var cmd =
          "/home/pi/M300/makerhub-api/wifi_ctrl/hotSpotControl.sh disable_hotspot " +
          networkDetails.ssid + " " + networkDetails.password;

          exec(
            cmd,
            (error, stdout, stderr) => {

              if (error) {
                  console.log(`error: ${error.message}`);
                  answer.status = error.message;
              }
              if (stderr) {
                  console.log(`stderr: ${stderr}`);
                   answer.status += " " + stderr;
              }
              console.log(`stdout: ${stdout}`);

              piWifi.connectTo(networkDetails, function (err) {
                if (err) {
                  answer.status += " " + err.message;
                  console.log(answer.status);

                } else {
                  answer.status += " connected!";
                }

              });
          });
        } else {
          exec(
            "/home/pi/M300/makerhub-api/wifi_ctrl/hotSpotControl.sh disable_hotspot",
            (error, stdout, stderr) => {
              if (error) {
                  console.log(`error: ${error.message}`);
                  answer.status = error.message;
              }
              if (stderr) {
                  console.log(`stderr: ${stderr}`);
                   answer.status = stderr;
              }
              answer.status = 'Supplicant process terminated!';
              console.log(`stdout: ${stdout}`);
              res.json(answer);
          });
        }

  });

  // Change hotspot ssid
  app.post('/hotspot/change/ssid/name', function(req, res) {

        var answer = new Object();
        var name = req.body.ssid;

        if(name) {

          exec(
            "/home/pi/M300/makerhub-api/wifi_ctrl/hotSpotControl.sh change_name " + name,
            (error, stdout, stderr) => {
              if (error) {
                  console.log(`error: ${error.message}`);
                  answer.status = error.message;
              }
              if (stderr) {
                  console.log(`stderr: ${stderr}`);
                   answer.status = stderr;
              }
              answer.status = 'ssid changed to ' + name;
              answer.success = true;
              console.log(`stdout: ${stdout}`);
              res.json(answer);
          });

        } else {
          answer.status = "invalid parameters specified";
          res.json(answer);
        }

  });

  // Change hotspot password
  app.post('/hotspot/change/ssid/password', function(req, res){

        var answer = new Object();
        var pass = req.body.pass;

        if(pass) {

          exec(
            "/home/pi/M300/makerhub-api/wifi_ctrl/hotSpotControl.sh change_pass " + pass,
            (error, stdout, stderr) => {
              if (error) {
                  console.log(`error: ${error.message}`);
                  answer.status = error.message;
              }
              if (stderr) {
                  console.log(`stderr: ${stderr}`);
                   answer.status = stderr;
              }
              answer.status = 'password changed';
              console.log(`stdout: ${stdout}`);
              res.json(answer);
          });

        } else {
          answer.status = "invalid parameters specified";
          res.json(answer);
        }

  });

  // Raise Interface
  app.post('/interface/up', function(req, res){

        var answer = new Object();

        if ('wlan0') {
          answer.message = "turning on " + 'wlan0';
          // wlan0 is supplicant (hotspot) interface
          piWifi.interfaceUp('wlan0', function (err) {
            if (err) {
              answer.status = err.message;
              res.json(answer);
            } else {
              answer.status = 'Interface raised succesfully!';
              res.json(answer);
            }

          });
        }

  });

  // Drop Interface
  app.post('/interface/down', function(req, res){

        var answer = new Object();

        if ('wlan0') {
          answer.message = "turning on " + 'wlan0';
          // wlan0 is supplicant (hotspot) interface
          piWifi.interfaceDown('wlan0', function (err) {
            if (err) {
              answer.status = err.message;
              res.json(answer);
            } else {
              answer.status = 'Interface dropped succesfully!';
              res.json(answer);
            }

          });
        }

  });

  // Restart Interface
  app.post('/interface/restart', function(req, res){

        var answer = new Object();

        if ('wlan0') {
          answer.message = "turning on " + 'wlan0';
          // wlan0 is supplicant (hotspot) interface
          piWifi.restartInterface('wlan0', function (err) {
            if (err) {
              answer.status = err.message;
              res.json(answer);
            } else {
              answer.status = 'Interface restarted succesfully!';
              res.json(answer);
            }

          });
        }

  });

  // Set Interface
  app.post('/interface/set', function(req, res){

        var answer = new Object();

        if ('wlan0') {
          answer.message = "turning on " + 'wlan0';
          piWifi.setCurrentInterface('wlan0');

          piWifi.status('wlan0', function(err, status) {
            if (err) {
              answer.status = err.message;
              res.json(answer);
            } else {
              answer.status = status;
              res.json(answer);
            }
          });
        }

  });

  // Enable or Disable the USB Camera
  app.post('/toggle/camera', function(req, res){

        var answer = new Object();
        var action = req.body.action;
        var cam_state = 'disabled';
        answer.message = "Toggling Camera...";

        if(action) {
          if (action != 'add' && action != 'remove') {
            answer.status = "invalid action specified";
            res.json(answer);
          } else {
            var cmd = "/home/pi/M300/makerhub-api/wifi_ctrl/enableWebcam.sh "
              + action;

            exec(
              cmd,
              (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    answer.status = error.message;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                     answer.status = stderr;
                }

                if(action == 'add') {
                  cam_state = 'enabled';
                }

                answer.status = 'webcam ' + cam_state;
                answer.action = action;
                answer.success = true;
                console.log(`stdout: ${stdout}`);
                res.json(answer);
            });
          }

        } else {
          answer.status = "invalid parameters specified";
          res.json(answer);
        }

  });

  // Set Network Details
  app.post('/set/network/info', function(req, res) {
    var answer = new Object();
    var interface = 'wlan0';
    let currentIP = '';

    try {
      let rawdata = fs.readFileSync('/home/pi/M300/ui-settings.json');
      let printerSettings = JSON.parse(rawdata);

      if (printerSettings.networkProfile == "ethernet") {
        interface = 'eth0';
      }

      const nets = networkInterfaces();
      const results = {};

      for (const name of Object.keys(nets)) {
          for (const net of nets[name]) {
              // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
              if (net.family === 'IPv4' && !net.internal) {
                  if (!results[name]) {
                      results[name] = [];
                  }
                  results[name].push(net.address);
              }
          }
      }

      if (results.hasOwnProperty(interface)) {
        console.log('ip', results[interface][0]);
        currentIP = results[interface][0];
        if(currentIP == '192.168.50.5') {
          printerSettings.networkProfile = 'hotspot';
        }
      }

      fs.readFile('/etc/hostname', 'utf8', function(err, data) {
            let printerName = data.toString().trim();
            let rawdata = fs.readFileSync('/home/pi/M300/ui-settings.json');
            let printerSettings = JSON.parse(rawdata);
            printerSettings.network = {
              ip: currentIP,
              hostName: 'http://'+printerName+'.local'
            };

            if(printerName && printerName !== "") {
              printerSettings.printerName = printerName;
            }

            if(interface == 'wlan0') {
              piWifi.status(interface, function(err, result) {
                if(!err) {
                  console.log('no status error');
                  console.log(result.ssid);
                  printerSettings.networkProfile = 'wifi';
                  printerSettings.network.ssid = result.ssid;
                  let newPrinterSettings = JSON.stringify(printerSettings);
                  fs.writeFileSync('/home/pi/M300/ui-settings.json', newPrinterSettings);
                  answer.status = 'success';
                  answer.success = true;
                  res.json(answer);
                } else {
                  if(currentIP == '192.168.50.5') {
                    printerSettings.networkProfile = 'hotspot';
                    printerSettings.network.ip = currentIP;
                  }
                  console.log('error', err);
                  printerSettings.network.ssid = '';
                  let newPrinterSettings = JSON.stringify(printerSettings);
                  fs.writeFileSync('/home/pi/M300/ui-settings.json', newPrinterSettings);
                  answer.status = 'success';
                  answer.success = true;
                  res.json(answer);
                }
              });
            } else {
              console.log('not wlan0');
              let newPrinterSettings = JSON.stringify(printerSettings);
              fs.writeFileSync('/home/pi/M300/ui-settings.json', newPrinterSettings);
              answer.status = 'success';
              answer.success = true;
              res.json(answer);
            }
        });

    } catch (error) {
      console.log(error);
      answer.status = 'failed';
      answer.success = false;
      answer.error = error;
      res.json(answer);
    }

  });

  // mount USB
  app.get('/refresh/usb', function(req, res) {
    var answer = new Object();
    answer.message = "mounting...";
    var letter = req.body.letter;
    var command = 'mount /dev/sd' + letter + '1 /media/usb';
    exec(
      command,
      (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            answer.status = error.message;
        }

        if (stderr) {
            console.log(`stderr: ${stderr}`);
            answer.status = stderr;
            if(stderr.includes("already mounted")) {
              answer.success = true;
            } else {
              answer.success = false;
            }
        } else {
          answer.success = true;
        }

        res.send(answer);

    });

  });

  // Safely Reboot Sysytem
  app.post('/reboot', function(req, res){

        var answer = new Object();

        exec(
          "pkill -o chromium",
          (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                answer.status = error.message;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                 answer.status = stderr;
            }

            exec(
              "systemctl reboot -f",
              (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    answer.status = error.message;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                     answer.status = stderr;
                }
                answer.status = 'rebooting';
                console.log(`stdout: ${stdout}`);
                res.json(answer);
            });

            answer.status = 'rebooting';
            console.log(`stdout: ${stdout}`);
            res.json(answer);
        });

  });

  // Safely Shutdown Sysytem
  app.post('/shutdown', function(req, res){

        var answer = new Object();

        exec(
          "pkill -o chromium",
          (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                answer.status = error.message;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                 answer.status = stderr;
            }

            exec(
              "shutdown -P now",
              (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    answer.status = error.message;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                     answer.status = stderr;
                }
                answer.status = 'shutting down';
                console.log(`stdout: ${stdout}`);
                res.json(answer);
            });

            answer.status = 'shutting down';
            console.log(`stdout: ${stdout}`);
            res.json(answer);
        });

  });

var server = app.listen(8990, function() {
    console.log('Listening on port %d', server.address().port);

    piWifi.scan(function(err, networks) {
      if (!err) {
        startupNetworks = networks;
      }
    });

});
