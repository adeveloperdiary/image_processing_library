from flask import Flask, render_template, request
from ui.utils.load_save_design import save_designer_config, save_config_file, get_projects, get_project, export_json_config, get_settings, \
    save_settings

app = Flask(__name__)
import json


@app.route('/')
def root_function():
    return render_template("index.html")


@app.route('/dashboard')
def dashboard():
    return render_template("dashboard.html")


@app.route('/list-projects')
def list_projects():
    return render_template("list_projects.html")


@app.route('/design_cnn')
def design_cnn():
    return render_template("design_cnn.html")


@app.route('/save_designer', methods=['POST'])
def save_designer():
    save_designer_config(request.form['id'], request.form['json'])
    return "success"


@app.route('/save_configs', methods=['POST'])
def save_configs():
    save_config_file(request.form['id'], request.form['config'])
    return "success"


@app.route('/get_project_list', methods=['GET'])
def get_project_list():
    project_list = get_projects()
    return json.dumps(project_list)


@app.route('/get_project_details', methods=['GET'])
def get_project_details():
    id = request.args['id']
    return json.dumps(get_project(id))


@app.route('/export_config', methods=['POST'])
def export_config():
    return export_json_config(request.form['id'], request.form['config'], request.form['settings'])


@app.route('/get_project_settings', methods=['GET'])
def get_project_settings():
    return get_settings(request.args['id'])


@app.route('/save_project_settings', methods=['POST'])
def save_project_settings():
    return save_settings(request.form['id'], request.form['config'])


if __name__ == '__main__':
    app.run()
