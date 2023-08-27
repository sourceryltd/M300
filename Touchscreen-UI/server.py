import bottle
from bottle import Bottle, request, response
import json
import time
import os
import scandir
import subprocess
import sys
from string import ascii_lowercase
import requests
import re
import zipfile
import shutil
from distutils.version import StrictVersion

"""
COMMAND             /api/v1/ url    function
----------------------------------------------------------------------------
GET                 status          get status
POST, OPTIONS       send            Send a command (replace with web socket)

GET                 files           get contents of the root directory
GET                 files/*         get contents of a directory or file
POST                files/*         create a directory or file
DELETE              files/*         delete a directory or file

GET                 job             get progress of print job
POST, OPTIONS       job             create a print job (file path)
PATCH               job             pause or start a print job
DELETE              job             stop a print job

"""
def log(string):
    with open('server.log', 'a') as f:
        f.write(str(string) + '\n')

log('starting')

class OctoprintAPI:

    base_url = 'http://127.0.0.1:5000/api/'

    def get(self, url):
        headers = {
                    'X-Api-Key': 'E7BFE47F2DBF489B9E78A3D9D042874A',
                    'Cache-Control': 'no-cache'
        }
        log(self.base_url + url)
        return requests.get(self.base_url + url, headers=headers)

    def post(self, url, data={}):
        headers = {
                    'X-Api-Key': 'E7BFE47F2DBF489B9E78A3D9D042874A',
                    'Cache-Control': 'no-cache'
        }
        log(self.base_url + url)
        return requests.post(self.base_url + url, json=data, headers=headers)

    # def post_multipart(self, url, data):
    def post_multipart(self, url, data={}, files={}):
        log(self.base_url + url)
        headers = {
                    'X-Api-Key': 'E7BFE47F2DBF489B9E78A3D9D042874A',
                    'Cache-Control': 'no-cache'
        }
        return requests.post(self.base_url + url, data=data, files=files, headers=headers)

    def delete(self, url):
        headers = {
                    'X-Api-Key': 'E7BFE47F2DBF489B9E78A3D9D042874A',
                    'Cache-Control': 'no-cache'
        }
        log(self.base_url + url)
        return requests.delete(self.base_url + url, headers=headers)

    def patch(self, url):
        headers = {
                    'X-Api-Key': 'E7BFE47F2DBF489B9E78A3D9D042874A',
                    'Cache-Control': 'no-cache'
        }
        log(self.base_url + url)
        return requests.patch(self.base_url + url, headers=headers)


class EnableCors(object):
    name = 'enable_cors'
    api = 2

    def apply(self, fn, context):
        def _enable_cors(*args, **kwargs):
            # allow more than double the slicer settings size for payloads
            bottle.BaseRequest.MEMFILE_MAX = 2000000000
            # set CORS headers
            bottle.response.headers['Access-Control-Allow-Origin'] = '*'
            bottle.response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
            bottle.response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
            if bottle.request.method != 'OPTIONS':
                # actual request; reply with the actual response
                return fn(*args, **kwargs)

        return _enable_cors


class MakermadeServer():
    def __init__(self):
        self.API = OctoprintAPI()
        self.start_bottle()


    def start_bottle(self):
        web_app = Bottle()
        web_app.install(EnableCors())

        # get status of printer
        web_app.route('/api/v1/status', ['GET', 'OPTIONS'])(self.status)

        # send a command (replace with web socket)
        web_app.route('/api/v1/send', ['POST', 'OPTIONS'])(self.send_command)

        # get contents of the root directory
        web_app.route('/api/v1/files', ['GET', 'OPTIONS'])(self.get_root)

        # get the user's slicer settings
        web_app.route('/api/v1/settings', ['GET', 'OPTIONS'])(self.get_settings)

        # get contents of a directory or file
        web_app.route('/api/v1/files/<name:path>', ['GET', 'OPTIONS'])(self.get_files)

        # create a directory or file
        web_app.route('/api/v1/files/<name:path>', ['POST', 'OPTIONS'])(self.create_file)

        # delete a directory or file
        web_app.route('/api/v1/files/<name:path>', ['DELETE', 'OPTIONS'])(self.delete_file)

        # get contents of a USB drive
        web_app.route('/api/v1/usb/files', ['GET', 'OPTIONS'])(self.get_usb)

        # refresh contents of a USB drive
        web_app.route('/api/v1/usb/refresh', ['POST', 'OPTIONS'])(self.refresh_usb)

        # copy file from usb to hard disk
        web_app.route('/api/v1/usb/copy/<name:path>', ['POST', 'OPTIONS'])(self.copy_file)

        # create a print job (file path)
        web_app.route('/api/v1/job/<name:path>', ['POST', 'OPTIONS'])(self.start_job)

        # get progress of print job
        web_app.route('/api/v1/job', ['GET', 'OPTIONS'])(self.job_progress)

        # pause or start a print job
        web_app.route('/api/v1/job', ['PATCH', 'OPTIONS'])(self.toggle_job)

        # stop a print job
        web_app.route('/api/v1/job', ['DELETE', 'OPTIONS'])(self.delete_job)

        # API & UI versions
        web_app.route('/api/v1/get/software/version', ['GET', 'OPTIONS'])(self.get_software_version)

        # Get User Interface Settings
        web_app.route('/api/v1/get/ui/settings', ['GET', 'OPTIONS'])(self.get_user_settings)

        # Set User Interface Settings
        web_app.route('/api/v1/set/ui/settings', ['POST', 'OPTIONS'])(self.set_user_settings)

        # update API & UI
        web_app.route('/api/v1/update/software', ['POST', 'OPTIONS'])(self.update_software)

        # update API & UI check
        web_app.route('/api/v1/update/software/check', ['POST', 'OPTIONS'])(self.update_software_check)

        # Create or update, then return software version info
        web_app.route('/api/v1/update/version/info', ['POST', 'OPTIONS'])(self.update_version_info)

        # update API & UI check
        web_app.route('/api/v1/check/internet/connection', ['GET', 'OPTIONS'])(self.check_internet_connection)

        web_app.run(host='0.0.0.0', port=2127)


    # GET /api/v1/status
    def status(self):
        res = self.API.get('printer')
        submit = json.loads(res.text)
        return json.dumps(submit)

    # @post('/api/v1/send')
    def send_command(self):
        msg = bottle.request.json.get('gcode')
        commands = {'commands': [msg], "parameters":{}}
        res = self.API.post('printer/command', commands)

        return json.dumps({'sent':True})

    # get contents of the root directory
    def get_root(self):
        res = self.API.get('files')
        files = json.loads(res.text)
        return json.dumps(files)


    # get the user's slicer settings
    def get_settings(self):
        with open('/home/pi/M300/makerhub-api/printer_settings/definitions/user.def.json') as json_file:
            settings = json.load(json_file)

        return json.dumps(settings)

    def get_files(self, name):
        res = self.API.get('files/' + name)
        files = json.loads(res.text)
        return json.dumps(files)

    # create a directory or file
    # @post('/api/v1/files/*')
    def create_file(self, name):
        upload = bottle.request.files.get('file')
        init_name, ext = os.path.splitext(name)
        name = os.path.basename(name)
        init_name = os.path.basename(init_name)
        files = {'file': (name, upload.file)}
        currentDirectory = os.getcwd()
        full_path = currentDirectory + '/files/' + name

        if ext not in ('.g', '.gcode', '.G', '.GCODE', '.stl', '.STL', '.3mf', '.3MF'):
            return "File extension not allowed."

        if not os.path.exists(currentDirectory + '/files/'):
            os.makedirs(currentDirectory + '/files/')

        if ext in ('.stl', '.STL', '.3mf', '.3MF'):
            if not os.path.exists(full_path):
                upload.save(full_path)

        res = self.process_file(ext, currentDirectory, init_name, full_path, files)

        if ext in ('.stl', '.STL', '.3mf', '.3MF') and os.path.exists(full_path):
            os.remove(full_path)

        return json.dumps({"file": name, "created": True})

    # delete a directory or file
    # @delete('/api/v1/files/*')
    def delete_file(self, name):
        if bottle.request.method == 'DELETE':
            res = self.API.delete('files/' + name)
            return json.dumps({"file": name, "delete": True})
        return json.dumps({})


    # get contents of a USB drive
    def get_usb(self):
        print('get usb files')
        try:
            currentDirectory = os.getcwd()
            files_dir = '/media/usb'

            files = []
            subfolders, onlyfiles = self.run_fast_scandir(files_dir, [
                '.g', '.gcode', '.G', '.GCODE', '.stl', '.STL', '.3mf', '.3MF', '.zip', '.ZIP'
            ])

            for file in onlyfiles:
                print(file)
                display_name = file.replace("/media/usb/", "")
                files.append({
                  'display': display_name,
                  'size': os.path.getsize(file),
                  'date': os.path.getmtime(file)
                })

            return json.dumps({
                        'files': files
                    })

        except Exception as e:
            return json.dumps({
                        'files': []
                    })

    # refresh contents of a USB drive
    def refresh_usb(self):
        print('refresh usb files')
        resps = []
        for i in range(3):
            for c in ascii_lowercase:
                req = requests.get(url='http://localhost:8990/refresh/usb', data={'letter': c})
                resp = json.loads(req.text)
                resps.append(resp)

                if resp['success']:
                    return json.dumps(resp)

                time.sleep(0.1)

            time.sleep(0.1)

        return json.dumps(resps)

    # copy file from usb to hard disk
    def copy_file(self, name):
        print('copy usb files')
        # load the contents of the file from USB into memory
        # then run the usual file creation routine
        upload = '/media/usb/' + name
        init_name, ext = os.path.splitext(name)
        name = os.path.basename(name)
        init_name = os.path.basename(init_name)

        with open(upload, 'r') as content_file:
            file_content = content_file.read()

        # checking for ZIP update
        update_applied = self.update_from_zip(name, upload)

        if update_applied:
            return update_applied

        files = {'file': (name, file_content)}

        currentDirectory = os.getcwd()

        if ext not in ('.g', '.gcode', '.G', '.GCODE', '.stl', '.STL', '.3mf', '.3MF'):
            return "File extension not allowed."

        if not os.path.exists(currentDirectory + '/files/'):
            os.makedirs(currentDirectory + '/files/')

        self.process_file(ext, currentDirectory, init_name, upload, files)

        return json.dumps({
            'lines': 0
        })

    # create a print job
    def start_job(self, name):

        data = {
            'command': 'select',
            'print': 'true',
        }

        init_name, ext = os.path.splitext(name)

        if ext in ('.stl', '.STL', '.3mf', '.3MF'):
            name = init_name + '.gcode'

        res = self.API.post('files/local/' + name, data=data)

        return json.dumps(data)

    def job_progress(self):
        res = self.API.get('job')
        submit = json.loads(res.text)
        return json.dumps(submit)

    def toggle_job(self):
        res = self.API.post('job', { "command": "pause", "action": "toggle" })
        return json.dumps({ "command": "pause", "action": "toggle" })

    def delete_job(self):
        res = self.API.post('job', { "command": "cancel" })
        return json.dumps({ "command": "cancel" })

    def get_software_version(self):
        with open('/home/pi/M300/makerhub-api/version.json') as f:
          data = json.load(f)
        return json.dumps(data)

    def update_software(self):
        # make backup directory if needed
        if not os.path.isdir('/home/pi/M300/previous-version'):
            os.mkdir('/home/pi/M300/previous-version')
        # backup previous codebase
        shutil.rmtree("/home/pi/M300/previous-version/")
        shutil.copytree("/home/pi/M300/makerhub-api/", "/home/pi/M300/previous-version/")

        try:

            ui_settings = '/home/pi/M300/ui-settings.json'
            with open(ui_settings) as f:
              data = json.load(f)

            if data.get('allowPrerelease'):
                updateJsonUrl = 'https://api.github.com/repos/makermadecnc/300x-releases/releases'
                updateJsonReq = requests.get(updateJsonUrl)
                githubData = json.loads(updateJsonReq.text)
                downloadUrl = githubData[0]['assets'][0]['browser_download_url']
                downloadName = githubData[0]['assets'][0]['name']
            else:
                updateJsonUrl = 'https://api.github.com/repos/makermadecnc/300x-releases/releases/latest'
                updateJsonReq = requests.get(updateJsonUrl)
                githubData = json.loads(updateJsonReq.text)
                latestVersion = githubData['tag_name']
                downloadUrl = githubData['assets'][0]['browser_download_url']
                downloadName = githubData['assets'][0]['name']

            downloadFolder = downloadName.replace('.zip', '')
            updateReq = requests.get(downloadUrl)
        except Exception as e:
            print(e)
            return json.dumps({
                    'updated': False,
                    'message': "Update Failed, Original Code Installed..."
            })

        with open('/home/pi/M300/'+downloadName, 'wb') as zipFile:
            zipFile.write(updateReq.content)

        # unpack new file structure
        with zipfile.ZipFile('/home/pi/M300/'+downloadName, 'r') as zip_ref:
            zip_ref.extractall("/home/pi/M300/")  # new folder here is downloadName folder

        process = subprocess.Popen(
            "pip install -r /home/pi/M300/"+downloadFolder+"/requirements.txt",
            shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        output, error = process.communicate()
        # check if the code runs
        working = False
        process = subprocess.Popen(
            'python /home/pi/M300/'+downloadFolder+'/server.py',
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        output, error = process.communicate()
        if process.returncode != 0:
            if "server starting up" in output or "server starting up" in error:
               working = True

        if working:
            ui_settings = '/home/pi/M300/ui-settings.json'
            default_ui_settings = '/home/pi/M300/makerhub-api/ui-settings.json'
            if not os.path.isfile(ui_settings):
                shutil.copy(default_ui_settings, ui_settings)

            process = subprocess.Popen(
                ['cd /home/pi/M300/'+downloadFolder+'/wifi_ctrl && npm install'],
                shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            _, stderr = process.communicate()
            # if it runs, copy the files back to the makerhub-api directory
            os.chdir("/home/pi/M300/")
            shutil.rmtree("/home/pi/M300/makerhub-api/")
            shutil.copytree("/home/pi/M300/" + downloadFolder, "/home/pi/M300/makerhub-api/")
            # if it runs, copy UI and install wifi API
            process = subprocess.Popen(
                ['cp -r /home/pi/M300/'+downloadFolder+'/old-ui/* /var/www/html'],
                shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            _, stderr = process.communicate()
            process = subprocess.Popen(
                ['rm -rf /var/www/html/touch-ui/*'],
                shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            _, stderr = process.communicate()
            process = subprocess.Popen(
                ['cp -r /home/pi/M300/'+downloadFolder+'/new-touch-ui/* /var/www/html/touch-ui'],
                shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            _, stderr = process.communicate()
            process = subprocess.Popen(
                ['cp /var/www/html/touch-ui/static/css/* /var/www/html/static/css/'],
                shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            _, stderr = process.communicate()
            process = subprocess.Popen(
                ['cp /var/www/html/touch-ui/static/js/* /var/www/html/static/js/'],
                shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            _, stderr = process.communicate()
            process = subprocess.Popen(
                ['cp /var/www/html/touch-ui/static/media/* /var/www/html/static/media/'],
                shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            _, stderr = process.communicate()
            process = subprocess.Popen(
                ['cp /home/pi/M300/'+downloadFolder+'/kiosk.sh /home/pi/kiosk.sh'],
                shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            _, stderr = process.communicate()
            process = subprocess.Popen(
                ['chmod 777 /home/pi/M300/'+downloadFolder+'/wifi_ctrl/hotSpotControl.sh'],
                shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            _, stderr = process.communicate()
            process = subprocess.Popen(
                ['chmod 777 /home/pi/M300/'+downloadFolder+'/wifi_ctrl/manageHostName.sh'],
                shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            _, stderr = process.communicate()
            process = subprocess.Popen(
                ['chmod 777 /home/pi/M300/'+downloadFolder+'/wifi_ctrl/enableWebcam.sh'],
                shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            _, stderr = process.communicate()

            shutil.rmtree("/home/pi/M300/" + downloadFolder)

            return json.dumps({
                    'updated': True,
                    'message': "Update Complete. Rebooting Printer..."
            })

        return json.dumps({
                'updated': False,
                'message': "Update Failed, Original Code Installed..."
        })


    def update_software_check(self):

        releaseNotes = ""

        try:
            ui_settings = '/home/pi/M300/ui-settings.json'
            with open(ui_settings) as f:
              data = json.load(f)

            if data.get('allowPrerelease'):
                updateJsonUrl = 'https://api.github.com/repos/makermadecnc/300x-releases/releases'
                updateJsonReq = requests.get(updateJsonUrl)
                githubData = json.loads(updateJsonReq.text)
                latestVersion = githubData[0]['tag_name']
                releaseNotes = githubData[0]['body']
            else:
                updateJsonUrl = 'https://api.github.com/repos/makermadecnc/300x-releases/releases/latest'
                updateJsonReq = requests.get(updateJsonUrl)
                githubData = json.loads(updateJsonReq.text)
                latestVersion = githubData['tag_name']
                releaseNotes = githubData['body']

            with open('/home/pi/M300/makerhub-api/version.json') as f:
              currentVersionData = json.load(f)

            currentVersion = currentVersionData['general']['version']
        except Exception as e:
            print(e)
            return json.dumps({
                    'update': False,
                    'message': "Update Not Available"
            })

        # Supported pre-release tag formats:  1.0.4a3 or 1.0.4b1
        if StrictVersion(currentVersion) < StrictVersion(latestVersion):
            return json.dumps({
                    'update': True,
                    'message': "Update "+latestVersion+" Available",
                    'releaseNotes': releaseNotes
            })

        return json.dumps({
                'update': False,
                'message': "You already have the latest software version"
        })

    def update_version_info(self):
        if self.connected_to_internet():
            updateInfo = {};
            # pull data up to current version
            try:
                with open('/home/pi/M300/makerhub-api/version.json') as f:
                  currentVersionData = json.load(f)

                currentVersion = currentVersionData['general']['version']

                updateJsonUrl = 'https://api.github.com/repos/makermadecnc/300x-releases/releases'
                updateJsonReq = requests.get(updateJsonUrl)
                githubData = json.loads(updateJsonReq.text)

                for update in githubData:
                    if StrictVersion(update['tag_name']) <= StrictVersion(currentVersion):
                        updateInfo[update['tag_name']] = update['body']

                with open('/home/pi/M300/update-info.json', 'w') as outfile:
                    json.dump(updateInfo, outfile)

                return json.dumps({
                        'success': True,
                        'update_info': updateInfo,
                        'message': "Update Info From Github"
                })
            except Exception as e:
                print(e)
                try:
                    ui_settings = '/home/pi/M300/update-info.json'
                    with open(ui_settings) as f:
                      data = json.load(f)

                    return json.dumps({
                            'success': True,
                            'update_info': data,
                            'message': "Update Info From Backup"
                    })
                except Exception as e:
                    print(e)
                    return json.dumps({
                            'success': False,
                            'update_info': False,
                            'message': "Update Info Not Available"
                    })
        else:
            # pull current data from file
            try:
                ui_settings = '/home/pi/M300/update-info.json'
                with open(ui_settings) as f:
                  data = json.load(f)

                return json.dumps({
                        'success': True,
                        'update_info': data,
                        'message': "Update Info From Backup"
                })
            except Exception as e:
                print(e)
                return json.dumps({
                        'success': False,
                        'update_info': False,
                        'message': "Update Info Not Available"
                })

        return json.dumps({
                'success': False,
                'update_info': False,
                'message': "Update Info Not Available"
        })

    def check_internet_connection(self):
        if self.connected_to_internet():
            return json.dumps({
                    'online': True
            })

        return json.dumps({
                'online': False
        })

    def get_user_settings(self):

        ui_settings = '/home/pi/M300/ui-settings.json'
        backup_ui_settings = '/home/pi/M300/previous-version/ui-settings.json'
        default_ui_settings = '/home/pi/M300/makerhub-api/ui-settings.json'

        if not os.path.isfile(ui_settings):
            if os.path.isfile(backup_ui_settings):
                shutil.copy(backup_ui_settings, ui_settings)
            else:
                shutil.copy(default_ui_settings, ui_settings)

        try:
            set_network_info = requests.post('http://localhost:8990/set/network/info')
        except Exception as err:
            print('network info failed')

        with open(ui_settings) as f:
          data = json.load(f)

        return json.dumps(data)

    def set_user_settings(self):
        settings_data = json.loads(bottle.request.forms.get("json"))

        if settings_data:
            with open('/home/pi/M300/ui-settings.json', 'w') as outfile:
                json.dump(settings_data, outfile)

        with open('/home/pi/M300/ui-settings.json') as f:
          data = json.load(f)
        return json.dumps(data)


    def process_file(self, ext, currentDirectory, init_name, full_path, files):

        if ext in ('.stl', '.STL', '.3mf', '.3MF'):
            print('STL upload')
            slicer_settings = '/home/pi/M300/makerhub-api/printer_settings/definitions/user.def.json'

            slicer_data = json.loads(bottle.request.forms.get("json"))

            if slicer_data:
                new_settings = slicer_data
                with open('/home/pi/M300/makerhub-api/printer_settings/definitions/user.def.json', 'w') as outfile:
                    json.dump(new_settings, outfile)

                slicer_settings = '/home/pi/M300/makerhub-api/printer_settings/definitions/user.def.json'
            #                                           this duplicate replace code is only needed when we
            #                                           delete the above replace code to add back folder support
            #                                           in octoprint
            gcode_file = currentDirectory + '/files/' + init_name + '.gcode'
            try:
                # Set up the slice command using the appropriate settings
                cura_command = [
                    'CuraEngine',
                    'slice',
                    '-v',
                    '-j',
                    slicer_settings,
                    '-l',
                    full_path,
                    '-o',
                    gcode_file
                ]

                process = subprocess.Popen(cura_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                _, stderr = process.communicate()
                # Replace gcode header with header from stderr
                self.replace_Header(gcode_file, str(stderr))

            except Exception as err:
              return json.dumps({'error': True, 'message':err})

            with open(gcode_file, 'r') as content_file:
                file_content = content_file.read()

            files = {'file': (init_name + '.gcode', file_content)}
            os.remove(gcode_file)

        res = self.API.post_multipart('files/local', files=files, data={'select': 'true', 'print':'false'})
        return json.dumps({'select': 'true', 'print':'false'})


    # Replace gcode header
    def replace_Header(self, gcodeFilePath, stderrContent):
        print(stderrContent)
        contentList = stderrContent.split('\n')
        positionStart = contentList.index('Gcode header after slicing:') + 1

        with open(gcodeFilePath, 'r') as outfile:
            lines = outfile.readlines()

        for x in range(10):
            lines[x] = contentList[positionStart + x] + "\n"

        with open(gcodeFilePath, 'w') as outfile:
            outfile.writelines(lines)


    def update_from_zip(self, name, upload):

        pattern1 = re.compile("^(.+)300x-(\d+).(\d+).(\d+).zip$")
        pattern2 = re.compile("^300x-(\d+).(\d+).(\d+).zip$")
        pattern3 = re.compile("^300x-(\d+).(\d+).(\d+)\((\d+)\).zip$")
        pattern4 = re.compile("^300x-(\d+).(\d+).(\d+) \((\d+)\).zip$")
        pattern5 = re.compile("^(.+)300x-(\d+).(\d+).(\d+)\((\d+)\).zip$")
        pattern6 = re.compile("^(.+)300x-(\d+).(\d+).(\d+) \((\d+)\).zip$")

        pattern7 = re.compile("^300x-(\d+).(\d+).(\d+)-Beta.(\d+).zip$")
        pattern8 = re.compile("^300x-(\d+).(\d+).(\d+)-Beta.(\d+)\((\d+)\).zip$")
        pattern9 = re.compile("^300x-(\d+).(\d+).(\d+)-Beta.(\d+) \((\d+)\).zip$")
        pattern10 = re.compile("^(.+)300x-(\d+).(\d+).(\d+)-Beta.(\d+)\((\d+)\).zip$")
        pattern11 = re.compile("^(.+)300x-(\d+).(\d+).(\d+)-Beta.(\d+) \((\d+)\).zip$")

        pattern12 = re.compile("^300x-(\d+).(\d+).(\d+)-Alpha.(\d+).zip$")
        pattern13 = re.compile("^300x-(\d+).(\d+).(\d+)-Alpha.(\d+)\((\d+)\).zip$")
        pattern14 = re.compile("^300x-(\d+).(\d+).(\d+)-Alpha.(\d+) \((\d+)\).zip$")
        pattern15 = re.compile("^(.+)300x-(\d+).(\d+).(\d+)-Alpha.(\d+)\((\d+)\).zip$")
        pattern16 = re.compile("^(.+)300x-(\d+).(\d+).(\d+)-Alpha.(\d+) \((\d+)\).zip$")

        pattern17 = re.compile("^300x-(\d+).(\d+).(\d+)-beta.(\d+).zip$")
        pattern18 = re.compile("^300x-(\d+).(\d+).(\d+)-beta.(\d+)\((\d+)\).zip$")
        pattern19 = re.compile("^300x-(\d+).(\d+).(\d+)-beta.(\d+) \((\d+)\).zip$")
        pattern20 = re.compile("^(.+)300x-(\d+).(\d+).(\d+)-beta.(\d+)\((\d+)\).zip$")
        pattern21 = re.compile("^(.+)300x-(\d+).(\d+).(\d+)-beta.(\d+) \((\d+)\).zip$")

        pattern22 = re.compile("^300x-(\d+).(\d+).(\d+)-alpha.(\d+).zip$")
        pattern23 = re.compile("^300x-(\d+).(\d+).(\d+)-alpha.(\d+)\((\d+)\).zip$")
        pattern24 = re.compile("^300x-(\d+).(\d+).(\d+)-alpha.(\d+) \((\d+)\).zip$")
        pattern25 = re.compile("^(.+)300x-(\d+).(\d+).(\d+)-alpha.(\d+)\((\d+)\).zip$")
        pattern26 = re.compile("^(.+)300x-(\d+).(\d+).(\d+)-alpha.(\d+) \((\d+)\).zip$")

        pattern27 = re.compile("^(.+)300x-(\d+).(\d+).(\d+)-Beta.(\d+).zip$")
        pattern28 = re.compile("^(.+)300x-(\d+).(\d+).(\d+)-Alpha.(\d+).zip$")
        pattern29 = re.compile("^(.+)300x-(\d+).(\d+).(\d+)-beta.(\d+).zip$")
        pattern30 = re.compile("^(.+)300x-(\d+).(\d+).(\d+)-alpha.(\d+).zip$")

        init_name, ext = os.path.splitext(name)

        if pattern1.match(name) or pattern2.match(name) \
            or pattern3.match(name) or pattern4.match(name) \
            or pattern5.match(name) or pattern6.match(name) \
            or pattern7.match(name) or pattern8.match(name) \
            or pattern9.match(name) or pattern10.match(name) \
            or pattern11.match(name) or pattern12.match(name) \
            or pattern13.match(name) or pattern14.match(name) \
            or pattern15.match(name) or pattern16.match(name) \
            or pattern17.match(name) or pattern18.match(name) \
            or pattern19.match(name) or pattern20.match(name) \
            or pattern21.match(name) or pattern22.match(name) \
            or pattern23.match(name) or pattern24.match(name) \
            or pattern25.match(name) or pattern26.match(name) \
            or pattern27.match(name) or pattern28.match(name) \
            or pattern29.match(name) or pattern30.match(name):
            # make backup directory if needed
            if not os.path.isdir('/home/pi/M300/previous-version'):
                os.mkdir('/home/pi/M300/previous-version')
            # backup previous codebase
            shutil.rmtree("/home/pi/M300/previous-version/")
            shutil.copytree("/home/pi/M300/makerhub-api/", "/home/pi/M300/previous-version/")

            # unpack new file structure
            with zipfile.ZipFile(upload, 'r') as zip_ref:
                zip_ref.extractall("/home/pi/M300/")

            print("/home/pi/M300/" + init_name)
            # check for pip updates
            process = subprocess.Popen(
                "pip install -r /home/pi/M300/"+init_name+"/requirements.txt",
                shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            output, error = process.communicate()
            # check if the code runs
            working = False
            process = subprocess.Popen('python /home/pi/M300/'+init_name+'/server.py', shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            output, error = process.communicate()
            if process.returncode != 0:
                if "server starting up" in error and "Address already in use" in error:
                   working = True

            if working:
                ui_settings = '/home/pi/M300/ui-settings.json'
                default_ui_settings = '/home/pi/M300/makerhub-api/ui-settings.json'
                if not os.path.isfile(ui_settings):
                    shutil.copy(default_ui_settings, ui_settings)

                process = subprocess.Popen(
                    ['cd /home/pi/M300/'+init_name+'/wifi_ctrl && npm install'],
                    shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
                )
                _, stderr = process.communicate()
                # if it runs, copy the files back to the makerhub-api directory
                os.chdir("/home/pi/M300/")
                shutil.rmtree("/home/pi/M300/makerhub-api/")
                shutil.copytree("/home/pi/M300/" + init_name, "/home/pi/M300/makerhub-api/")
                # if it runs, copy UI and install wifi API
                process = subprocess.Popen(
                    ['cp -r /home/pi/M300/'+init_name+'/old-ui/* /var/www/html'],
                    shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
                )
                _, stderr = process.communicate()
                process = subprocess.Popen(
                    ['rm -rf /var/www/html/touch-ui/*'],
                    shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
                )
                _, stderr = process.communicate()
                process = subprocess.Popen(
                    ['cp -r /home/pi/M300/'+init_name+'/new-touch-ui/* /var/www/html/touch-ui'],
                    shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
                )
                _, stderr = process.communicate()
                process = subprocess.Popen(
                    ['cp /var/www/html/touch-ui/static/css/* /var/www/html/static/css/'],
                    shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
                )
                _, stderr = process.communicate()
                process = subprocess.Popen(
                    ['cp /var/www/html/touch-ui/static/js/* /var/www/html/static/js/'],
                    shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
                )
                _, stderr = process.communicate()
                process = subprocess.Popen(
                    ['cp /var/www/html/touch-ui/static/media/* /var/www/html/static/media/'],
                    shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
                )
                _, stderr = process.communicate()
                process = subprocess.Popen(
                    ['cp /home/pi/M300/'+init_name+'/kiosk.sh /home/pi/kiosk.sh'],
                    shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
                )
                _, stderr = process.communicate()
                process = subprocess.Popen(
                    ['chmod 777 /home/pi/M300/'+init_name+'/wifi_ctrl/hotSpotControl.sh'],
                    shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
                )
                _, stderr = process.communicate()
                process = subprocess.Popen(
                    ['chmod 777 /home/pi/M300/'+init_name+'/wifi_ctrl/manageHostName.sh'],
                    shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
                )
                _, stderr = process.communicate()
                process = subprocess.Popen(
                    ['chmod 777 /home/pi/M300/'+init_name+'/wifi_ctrl/enableWebcam.sh'],
                    shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
                )
                _, stderr = process.communicate()

                shutil.rmtree("/home/pi/M300/" + init_name)
                return json.dumps({
                        'updated': True,
                        'message': "Update Complete. Rebooting Printer..."
                })
            else:
                # if it does not run, need tp put old code back
                return json.dumps({
                        'updated': False,
                        'message': "Update Failed, Original Code Installed..."
                })

        # no update to apply
        return False

    def connected_to_internet(self, url='http://www.example.org/', timeout=5):
        try:
            _ = requests.head(url, timeout=timeout)
            return True
        except requests.ConnectionError:
            print("No internet connection available.")
        return False

    def run_fast_scandir(self, dir, ext):    # dir: str, ext: list
        subfolders, files = [], []

        for f in scandir.scandir(dir):
            if f.is_dir():
                subfolders.append(f.path)
            if f.is_file():
                if os.path.splitext(f.name)[1].lower() in ext:
                    if not f.name.startswith('.'):
                        files.append(f.path)


        for dir in list(subfolders):
            sf, f = self.run_fast_scandir(dir, ext)
            subfolders.extend(sf)
            files.extend(f)

        return subfolders, files


if __name__ == "__main__":
    MakermadeServer()
