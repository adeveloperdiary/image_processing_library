import os
import shutil
from datetime import datetime
import base64
import json

PATH = "configs/"


def clean_config(id):
    if os.path.isdir(PATH + id):
        shutil.rmtree(PATH + id)
        print("[INFO] Deleted existing config folder.")

    os.mkdir(PATH + id)


def save_designer_config(id, data):
    clean_config(id)

    f = open(PATH + id + "/design.json", "w+")
    f.write(data)
    f.close()


def save_config_file(id, data):
    f = open(PATH + id + "/config.json", "w+")
    f.write(data)
    f.close()


def get_projects():
    project_list = []

    subfolders = [f.path for f in os.scandir(PATH) if f.is_dir()]

    for config in subfolders:
        project = {}
        project["name"] = config.split('/')[1]
        project["created_by"] = "admin"
        project["created_date"] = datetime.fromtimestamp(os.stat(config).st_ctime).strftime("%Y-%m-%d %H:%M:%S")
        project["modified_date"] = datetime.fromtimestamp(os.stat(config + "/design.json").st_ctime).strftime("%Y-%m-%d %H:%M:%S")

        project_list.append(project)

    return project_list


def get_project(id):
    ret_value = {}

    f_designer = open(PATH + id + "/design.json", "r")
    ret_value["designer"] = f_designer.read()
    f_designer.close()

    with open(PATH + id + "/config.json") as json_file:
        data = json.load(json_file)

    ret_value["steps"] = data

    return ret_value


def export_json_config(id, data, settings):
    prj_settings = json.loads(settings)

    if not os.path.isdir(prj_settings["export_path"] + "/" + id):
        os.mkdir(prj_settings["export_path"] + "/" + id)
        os.mkdir(prj_settings["export_path"] + "/" + id + "/output")
        os.mkdir(prj_settings["export_path"] + "/" + id + "/output/checkpoint")
        os.mkdir(prj_settings["export_path"] + "/" + id + "/output/features")
        os.mkdir(prj_settings["export_path"] + "/" + id + "/output/model")
        os.mkdir(prj_settings["export_path"] + "/" + id + "/output/plots")

    f = open(prj_settings["export_path"] + "/" + id + "/config.json", "w+")
    f.write(data)
    f.close()

    f = open(prj_settings["export_path"] + "/" + id + "/main.py", "w+")
    f.write(base64.b64decode(prj_settings["starting_code"]).decode('utf-8'))
    f.close()

    return "success"


def get_settings(id):
    data = {}

    if os.path.isdir(PATH + id):
        with open(PATH + id + "/settings.json") as json_file:
            data = json.load(json_file)

    return json.dumps(data)


def save_settings(id, data):
    if os.path.isdir(PATH + id):
        f = open(PATH + id + "/settings.json", "w+")
        f.write(data)
        f.close()
        return "success"
    else:
        return "Project settings not saved"
