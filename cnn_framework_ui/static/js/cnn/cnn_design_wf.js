var editor = null;
var colorMap;
var selectedRect;
var selectedLink;
var bCreateLink = false;
var bCreateErrLink = false;
var saveConfig = false;
var graph;
var paper;
var stepMap;
var id;
var dependencyArr = [];
var configMap;
var selectedStep;
var bBulkUpload = false;
var uri;
var gridsize = 10;
var project_settings = {};
var custom_classes;

$(document).ready(function () {

    id = getUrlParameter('id');
    opentype = getUrlParameter('open');

    // On clicking the Add Step Button the respective Modal is loaded
    $('#addStep').on('click', function () {
        $('#addNewStep').modal();
    });

    custom_classes=new Map();

    colorMap = new Map();

    colorMap.set('CNNFImageLoader', {'fill': '#f3e5ff', 'border': '#6e0eab'});
    colorMap.set('CNNFLabel2Number', {'fill': '#f3e5ff', 'border': '#6e0eab'});
    colorMap.set('CNNFDefaultFeatureExtractor', {'fill': '#f3e5ff', 'border': '#6e0eab'});
    colorMap.set('CNNFTrainTestSplit', {'fill': '#f3e5ff', 'border': '#6e0eab'});
    colorMap.set('CNNFCustomKerasModel', {'fill': '#f3e5ff', 'border': '#6e0eab'});
    colorMap.set('CNNFDefaultOptimization', {'fill': '#f3e5ff', 'border': '#6e0eab'});
    colorMap.set('CNNFDefaultTraining', {'fill': '#f3e5ff', 'border': '#6e0eab'});
    colorMap.set('CNNFDefaultModelEvaluation', {'fill': '#f3e5ff', 'border': '#6e0eab'});
    colorMap.set('CNNFTransferLearning', {'fill': '#f3e5ff', 'border': '#6e0eab'});


    colorMap.set('Custom', {'fill': '#FFFFFF', 'border': '#6e0eab'});

    var container = document.getElementById("jsoneditor");
    var options = {mode: 'code'};
    editor = new JSONEditor(container, options);
    var json = {};
    editor.set(json);

    /*
    colorMap.set('MSFJSONValidation', {'fill': '#DCF7FD', 'border': '#2599B0'});
    colorMap.set('MSFJDBCRead', {'fill': '#ddfddd', 'border': '#25b125'});
    colorMap.set('MSFJDBCTransaction', {'fill': '#f5fddd', 'border': '#8eb125'});
    colorMap.set('MSFResponseGenerator', {'fill': '#fdeddd', 'border': '#b16b25'});
    colorMap.set('MSFREST', {'fill': '#edddfd', 'border': '#6b25b1'});
    colorMap.set('MSFRESTProxy', {'fill': '#edddfd', 'border': '#6b25b1'});
    colorMap.set('MSFSOAPInvocation', {'fill': '#fdddfd', 'border': '#b125b1'});
    colorMap.set('MSFTitanQuery', {'fill': '#fdfddd', 'border': '#b1b125'});
    colorMap.set('MSFHBaseQuery', {'fill': '#dde5fd', 'border': '#2548b1'});
    colorMap.set('MSFKafkaSend', {'fill': '#fddded', 'border': '#b1256b'});
    colorMap.set('MSFMQSend', {'fill': '#fddded', 'border': '#b1256b'});
    colorMap.set('Custom', {'fill': '#fddddd', 'border': '#b12525'});
    colorMap.set('MSFExceptionHandler', {'fill': '#ffe6e6', 'border': '#FF0000'});
    colorMap.set('MSFGlobalExceptionHandler', {'fill': '#ffe6e6', 'border': '#FF0000'});
    colorMap.set('MSFParallelProcessing', {'fill': '#eaeafb', 'border': '#2525b1'});
    colorMap.set('MSFJSONTransformation', {'fill': '#DCF7FD', 'border': '#2599B0'});
    colorMap.set('MSFXMLToJSONConversion', {'fill': '#DCF7FD', 'border': '#2599B0'});
    colorMap.set('MSFXSLTransformation', {'fill': '#DCF7FD', 'border': '#2599B0'});
    colorMap.set('MSFDataRelatiohship', {'fill': '#DCF7FD', 'border': '#2599B0'});
    */

    initEditor();
    if (opentype == "existing") {
        $.getJSON("/get_project_details?id=" + id, function (data) {

            if (data.designer != undefined) {
                var savedDesigner = JSON.parse(data.designer);
                if (savedDesigner != null && savedDesigner != undefined & savedDesigner != []) {
                    graph.fromJSON(savedDesigner);
                    configMap = new Map();


                    data.steps.forEach(function (elem) {
                        stepMap.set(elem.name, elem.class);
                        configMap.set(elem.name, JSON.parse(elem.json));
                    });

                    $.getJSON("/get_project_settings?id=" + id, function (data) {
                        project_settings = data;

                        if (project_settings.custom_classes != undefined) {


                            $.each(project_settings.custom_classes,function (key,val) {
                                custom_classes.set(val.name,val.value);
                            });

                            delete project_settings["custom_classes"];
                        }

                        selectedStep = 'global';
                        showDetailProperty('global');
                    });


                } else {
                    loadEditor();
                    createNewConfig(uri);
                }
            } else {
                loadEditor();
                createNewConfig(uri);
            }
        });


    } else {
        loadEditor();
        createNewConfig(uri);
    }

    addEditorListener();
});

/*Initializing the Paper and linking the corresponding Graph Model*/
function initEditor() {
    stepMap = new Map();
    $('#container').css('width', window.innerWidth);

    graph = new joint.dia.Graph;

    paper = new joint.dia.Paper({
        el: document.getElementById('designer'),
        model: graph,
        width: window.innerWidth - 70,
        height: 300,
        gridSize: gridsize,
        drawGrid: true,
        background: {
            color: 'rgba(247,236,255, 0.2)'
        }
    });
}

//#6e0eab


function createNewConfig(uri) {
    configMap = new Map();
    configMap.set('global', {
        "epochs": 10,
        "trainX": "trainX",
        "trainY": "trainY",
        "testX": "testX",
        "testY": "testY"
    });


    selectedStep = 'global';
    showDetailProperty('global');
}


// Initializing the Editor with the Endpoint Node starting
function loadEditor() {
    var start_rect = new joint.shapes.standard.Rectangle();

    start_rect.position(50, 120);
    start_rect.resize(80, 30);
    start_rect.attr({
        body: {
            fill: '#6e0eab',
            rx: 5,
            ry: 5,
            strokeWidth: 1,
            stroke: '#6e0eab'
        },
        label: {
            text: 'Start',
            fill: 'white',
            fontWeight: 'bold',
            fontSize: 12

        }
    });
    start_rect.addTo(graph);

    stepMap.set('global', 'global');
}


/* 
 * Common Function that handles all the events on the Editor/Paper/Graph
 */

function addEditorListener() {

    var graphEle = $('#designer').children("svg").first();
    //Setup  svgpan and zoom, with handlers that set the grid sizing on zoom and pan
    //Handlers not needed if you don't want the dotted grid
    panAndZoom = svgPanZoom(graphEle[0],
        {
            //View Port Selected where Graph is loaded
            viewportSelector: graphEle[0].childNodes[1],
            fit: false,
            center: false,
            controlIconsEnabled: true,
            zoomScaleSensitivity: 0.1,
            panEnabled: false,
            mouseWheelZoomEnabled: false
            /*onZoom: function(scale)
            {
                currentScale = scale;
            }*/
        });

    //Event when a mouse is clicked on an element
    paper.on('element:pointerclick', function (elementView) {
        resetEditor(this);
        var currentElement = elementView.model;
        currentElement.attr('body/strokeWidth', 3);


        // If the Create Link or Create Error Link is clicked
        if (bCreateLink) {
            if ((validateLink(selectedRect, currentElement)) == false) {
                link = new joint.shapes.standard.Link();
                link.source(selectedRect);
                link.target(currentElement);
                if (bCreateLink) {
                    bCreateLink = false;
                    link.attr('type/text', 'data');
                    link.attr('line/stroke', '#6e0eab');
                }
                link.addTo(graph);
            }
        } else {
            //Remove if later


            //if (configMap.has(currentElement.attr('label/text'))) {
            selectedStep = currentElement.attr('label/text');
            showDetailProperty(currentElement.attr('label/text'));
            //}

            $('#createLink').prop("disabled", false);
            $('#deleteElement').prop("disabled", false);

        }
        selectedRect = currentElement;

        $('#deleteLink').prop("disabled", true);

    });

    paper.on('blank:pointerclick', function () {
        resetEditor(this);
        selectedStep = 'global';
        showDetailProperty('global');
    });

    //Enable pan when a blank area is click (held) on
    paper.on('blank:pointerdown', function (evt, x, y) {
        panAndZoom.enablePan();
        //console.log(x + ' ' + y);
    });

    //Disable pan when the mouse button is released
    paper.on('blank:pointerup', function (event) {
        panAndZoom.disablePan();
    });

    paper.on('link:pointerclick', function (linkView) {
        resetEditor(this);

        var currentLink = linkView.model;
        //currentLink.attr('line/stroke', '#6e0eab');
        currentLink.attr('line/strokeWidth', 3);

        selectedLink = currentLink;
        $('#deleteLink').prop("disabled", false);

    });

    graph.on('change:size', function (cell, newPosition, opt) {

        if (opt.skipParentHandler) return;

        if (cell.get('embeds') && cell.get('embeds').length) {

            cell.set('originalSize', cell.get('size'));
        }
    });

    graph.on('change:position', function (cell, newPosition, opt) {

        if (opt.skipParentHandler) return;

        if (cell.get('embeds') && cell.get('embeds').length) {
            cell.set('originalPosition', cell.get('position'));
        }

        var parentId = cell.get('parent');
        if (!parentId) return;

        var parent = graph.getCell(parentId);
        var parentBbox = parent.getBBox();

        if (!parent.get('originalPosition')) parent.set('originalPosition', parent.get('position'));
        if (!parent.get('originalSize')) parent.set('originalSize', parent.get('size'));

        var originalPosition = parent.get('originalPosition');
        var originalSize = parent.get('originalSize');

        var newX = originalPosition.x;
        var newY = originalPosition.y;
        var newCornerX = originalPosition.x + originalSize.width;
        var newCornerY = originalPosition.y + originalSize.height;

        _.each(parent.getEmbeddedCells(), function (child) {

            var childBbox = child.getBBox();

            if (childBbox.x < newX) {
                newX = childBbox.x;
            }
            if (childBbox.y < newY) {
                newY = childBbox.y;
            }
            if (childBbox.corner().x > newCornerX) {
                newCornerX = childBbox.corner().x;
            }
            if (childBbox.corner().y > newCornerY) {
                newCornerY = childBbox.corner().y;
            }
        });


        parent.set({
            position: {x: newX, y: newY},
            size: {width: newCornerX - newX + 10, height: newCornerY - newY + 10}
        }, {skipParentHandler: true});
    });

}

function validateLink(selectedRect, currentElement) {

    var isInvalid = false;

    if (currentElement.attr('label/text') != selectedRect.attr('label/text')) {
        if (graph.getConnectedLinks(selectedRect, {outbound: true}).length > 0) {
            if (bCreateErrLink) {
                showAlert(" Error ! Cannot Create Error Link between " + selectedRect.attr('label/text') + " and "
                    + currentElement.attr('label/text'), "error");
                bCreateLink = false;
                bCreateErrLink = false;
                isInvalid = true;
            }

            if (graph.getConnectedLinks(currentElement, {inbound: true}).length > 0) {
                showAlert(" Error ! Step " + selectedRect.attr('label/text') + " already has an inbound link", "error");
                bCreateLink = false;
                bCreateErrLink = false;
                isInvalid = true;
            }
        }

        if (graph.getConnectedLinks(currentElement, {inbound: true}).length > 0) {
            if (currentElement.attr('processor/text') != "MSFExceptionHandler") {
                showAlert("Error ! Step " + currentElement.attr('label/text') + " already has one inbound link !", "error");
                bCreateLink = false;
                bCreateErrLink = false;
                isInvalid = true;
            }
        }
    } else {
        showAlert("Error ! Cyclic link on " + currentElement.attr('label/text') + ", cannot have connection to the same step !", "error");
        bCreateLink = false;
        bCreateErrLink = false;
        isInvalid = true;
    }

    return isInvalid;
}


function deleteElement() {
    if (selectedRect.attr('label/text') == "Start") {
        showAlert("Warning ! Start Step can not be deleted !", "warning");
    } else {
        stepMap.delete(selectedRect.attr('label/text'));
        configMap.delete(selectedRect.attr('label/text'));
        selectedRect.remove();
        $('#deleteElement').prop("disabled", true);

        if(custom_classes.has(selectedRect.attr('label/text'))){
            custom_classes.delete(selectedRect.attr('label/text'));
        }
    }
}

function deleteLink() {
    selectedLink.remove();
    $('#deleteLink').prop("disabled", true);
}


function addStep() {

    var name = $('#step-name').val();
    var wf_step = $('#cnn_workflow').val();

    if (stepMap.has(name)) {
        $('#addNewStep').modal('hide');
        showAlert("Error ! Step " + name + " already exists !", "error");
    } else {
        $('#addNewStep').modal('hide');

        var width = getTextWidth(name, "bold 9pt arial") + 20;
        var height = 30;

        var rect = new joint.shapes.standard.Rectangle();
        rect.resize((width > 80 ? width : 80), height);
        rect.position(20, 20);

        rect.attr({
            body: {
                fill: colorMap.get(wf_step)['fill'],
                rx: 5,
                ry: 5,
                strokeWidth: 2,
                stroke: colorMap.get(wf_step)['border']
            },
            label: {
                text: name,
                fill: '#6e0eab',
                fontWeight: 'bold',
                fontSize: 12
            }

        });
        rect.attr('processor/text', wf_step);

        rect.addTo(graph);

        showAlert("Success ! Step " + name + " added !", "success");
        $('#step-name').val('');

        stepMap.set(name, wf_step);

        switch (wf_step) {
            case 'CNNFImageLoader':
                configMap.set(name, {
                    "definition": {
                        "name": name,
                        "processor": "processors.image_loader.ImageLoader"
                    },
                    "properties": {}
                });
                break;
            case 'CNNFTrainTestSplit':
                configMap.set(name, {
                    "definition": {
                        "name": name,
                        "processor": "processors.train_test_split.TrainTestSplit"
                    },
                    "properties": {}
                });
                break;
            case 'CNNFCustomKerasModel':
                configMap.set(name, {
                    "definition": {
                        "name": name,
                        "processor": "processors.custom_model.CustomModel"
                    },
                    "properties": {}
                });
                break;
            case 'CNNFDefaultOptimization':
                configMap.set(name, {
                    "definition": {
                        "name": name,
                        "processor": "processors.optimization.DefaultOptimization"
                    },
                    "properties": {}
                });
                break;
            case 'CNNFDefaultTraining':
                configMap.set(name, {
                    "definition": {
                        "name": name,
                        "processor": "processors.training.DefaultTraining"
                    },
                    "properties": {}
                });
                break;

            case 'CNNFDefaultModelEvaluation':
                configMap.set(name, {
                    "definition": {
                        "name": name,
                        "processor": "processors.evaluate.DefaultModelEvaluation"
                    },
                    "properties": {}
                });
                break;
            case 'CNNFLabel2Number':
                configMap.set(name, {
                    "definition": {
                        "name": name,
                        "processor": "processors.label_to_number.LabelToNumber"
                    },
                    "properties": {}
                });
                break;
            case 'CNNFDefaultFeatureExtractor':
                configMap.set(name, {
                    "definition": {
                        "name": name,
                        "processor": "processors.feature_extractor.DefaultFeatureExtractor"
                    },
                    "properties": {}
                });
                break;
            case 'Custom':
                configMap.set(name, {
                    "definition": {
                        "name": name,
                        "processor": "jobs." + id + ".custom_steps." + name
                    },
                    "properties": {}
                });
                break;

            case 'CNNFTransferLearning':
                configMap.set(name, {
                    "definition": {
                        "name": name,
                        "processor": "processors.transfer_learning.TransferLearning"
                    },
                    "properties": {}
                });
                break;

        }
    }
}


function createLink() {
    bCreateLink = true;
}

function createErrLink() {
    bCreateErrLink = true;
}

function resetEditor(paper) {

    var elements = paper.model.getElements();
    for (var i = 0, ii = elements.length; i < ii; i++) {
        var currentElement = elements[i];
        currentElement.attr('body/strokeWidth', 1);
    }

    var links = paper.model.getLinks();
    for (var j = 0, jj = links.length; j < jj; j++) {
        var currentLink = links[j];
        //currentLink.attr('line/stroke', 'black');
        currentLink.attr('line/strokeWidth', 1);
    }

    $('#deleteElement').prop("disabled", true);
    $('#createLink').prop("disabled", true);

    $('#deleteLink').prop("disabled", true);

}

$(document).ready(function () {
    $('#saveConfig').click(function () {
        saveEditor();
    });

    $('#deleteConfig').click(function () {
        deleteConfig();
    });


    $('#saveEditorbttn').click(function () {
        configMap.set(selectedStep, editor.get());
        console.log("Selected Step: " + selectedStep);
    });

});

function deleteConfig() {
    $.post("/service/service-config/delete-config", {id: id}, function (data) {
        if (data.status == 'success') {
            window.open('/htmls/ServiceConfiguration/index.html', '_self');
        } else {
            showAlert('Error deleting configuration', 'error');
        }
    });
}

function saveEditor() {
    var jsonObject = graph.toJSON();
    var jsonString = JSON.stringify(jsonObject);
    saveConfig = true;

    if (id != undefined) {

        $.post("/save_designer", {id: id, json: jsonString}, function (data) {
            if (data == 'success') {
                var stepsData = [];
                var steps = [];
                var dependency = createDependencyList();

                stepsData.push({
                    name: 'global',
                    class: stepMap.get('global'),
                    json: JSON.stringify(configMap.get('global')),
                    sequence: 0
                });

                $.each(dependency, function (key, value) {
                    steps.push({val: configMap.get(value.name), key: value.name});
                });

                $.each(steps, function (key, val) {
                    stepsData.push
                    ({
                        name: val.key,
                        class: stepMap.get(val.key),
                        json: JSON.stringify(val.val),
                        sequence: key + 1
                    });

                });

                $.post("/save_configs", {id: id, config: JSON.stringify(stepsData)}, function (data) {
                    if (data == 'success') {
                        showAlert('Successfully saved configuration');

                        project_settings.custom_classes=[];

                        for (let key of custom_classes.keys()) {
                            var custom_class={};
                            custom_class.name=key;
                            custom_class.value=custom_classes.get(key);

                            project_settings.custom_classes.push(custom_class)
                        }

                        $.post("/save_project_settings", {
                            id: id,
                            config: JSON.stringify(project_settings)
                        }, function (data) {
                            if (data == 'success') {
                                showAlert('Successfully saved settings');
                            } else {
                                console.error(data);
                                showAlert('Error saving configuration', 'error');
                            }
                        });


                    } else {
                        console.error(data);
                        showAlert('Error saving configuration', 'error');
                    }
                });
            } else {
                console.error(data);
                showAlert('Error saving configuration', 'error');
            }
        });

    } else {
        showAlert('Project name not found !!!', 'error');
    }

}


function createDependencyList() {
    var allElement = graph.getElements();
    var childElement;
    var i = 0;
    var controller = allElement[0];
    dependencyArr = [];
    var next = graph.getNeighbors(controller, {outbound: true});
    loop(next);
    saveConfig = false;
    return dependencyArr;
}

function loop(next) {
    if (next.length > 0) {
        dependencyArr.push({'name': next[0].attr('label/text'), 'processor': next[0].attr('processor/text')});
        loop(graph.getNeighbors(next[0], {outbound: true}));

    }
}

function showDetailProperty(name) {
    if (name == "Start") {
        $('#divColumn1Property').removeClass("col-lg-6");
        $('#divColumn1Property').addClass("col-lg-9");
        $('#divColumn3Property').removeClass("col-lg-6");
        $('#divColumn3Property').addClass("col-lg-3");

        var source = document.getElementById("Start-template-property").innerHTML;
        $('#divColumn1Property').html(source);


        var source = document.getElementById("Start-template-action").innerHTML;
        $('#divColumn3Property').html(source);

        var ace_editor = ace.edit("code_editor");
        ace_editor.setTheme("ace/theme/xcode");
        ace_editor.session.setMode("ace/mode/python");
        ace_editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: false
        });
        ace_editor.setFontSize("14px");

        $('#idStartEditorSave').on('click', function () {
            project_settings.starting_code = btoa(ace_editor.getValue());
        });

    } else {
        if (stepMap.get(selectedStep) == "Custom") {
            $('#divColumn1Property').removeClass("col-lg-9");
            $('#divColumn1Property').addClass("col-lg-6");
            $('#divColumn3Property').removeClass("col-lg-3");
            $('#divColumn3Property').addClass("col-lg-6");
        } else {
            $('#divColumn1Property').removeClass("col-lg-6");
            $('#divColumn1Property').addClass("col-lg-9");
            $('#divColumn3Property').removeClass("col-lg-6");
            $('#divColumn3Property').addClass("col-lg-3");
        }
        $('#divColumn1Property').html(loadView(name, stepMap.get(name) + "-template-property"));

        if (name != 'global')
            $('#divColumn3Property').html(loadView(name, stepMap.get(name) + "-template-action"));

        switch (stepMap.get(selectedStep)) {
            case 'global':

                var source = document.getElementById("global-template-action").innerHTML;
                var template = Handlebars.compile(source);
                $('#divColumn3Property').html(template(project_settings));


                $('#idProjectSettingSave').on('click', function () {
                    project_settings.export_path = $('#txtExportPath').val();

                });

                $('#idGlobalSave').on('click', function () {
                    configMap.get(selectedStep).trainX = $('#txtTrainXPlaceHolder').val();
                    configMap.get(selectedStep).trainY = $('#txtTrainYPlaceHolder').val();
                    configMap.get(selectedStep).testX = $('#txtTestXPlaceHolder').val();
                    configMap.get(selectedStep).testY = $('#txtTestYPlaceHolder').val();
                    configMap.get(selectedStep).epochs = parseInt($('#numEpoch').val());

                    if($.trim($('#txtValidationXPlaceHolder').val())!="" && $.trim($('#txtValidationYPlaceHolder').val())!=""){
                        configMap.get(selectedStep).validationX = $.trim($('#txtValidationXPlaceHolder').val());
                        configMap.get(selectedStep).validationY = $.trim($('#txtValidationYPlaceHolder').val());
                    }

                });
                break;
            case 'Custom':
                var container_custom = document.getElementById("jsoneditor_custom");
                var options = {mode: 'code'};
                var editor_custom = new JSONEditor(container_custom, options);
                editor_custom.set(configMap.get(selectedStep).properties);

                $('#idCustomEditorSave').on('click', function () {
                    configMap.get(selectedStep).definition.processor = $('#txtStepClass').val();
                    configMap.get(selectedStep).properties = editor_custom.get();
                });

                var class_array = configMap.get(selectedStep).definition.processor.split('.');
                var class_name=class_array[class_array.length - 1];
                $('#txtStepClassName').val(class_name);



                var ace_editor = ace.edit("code_editor");
                ace_editor.setTheme("ace/theme/xcode");
                ace_editor.session.setMode("ace/mode/python");
                ace_editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: false
                });
                ace_editor.setFontSize("14px");

                if(custom_classes.has(name)){
                    ace_editor.setValue(atob(custom_classes.get(name)));
                }


                $('#idCustomCodeEditorSave').on('click', function () {
                    custom_classes.set(name,btoa(ace_editor.getValue()));
                });

                $('#txtStepClassName').bind('input', function () {
                    $('#txtStepClass').val("jobs." + id + ".custom_steps." + $.trim($('#txtStepClassName').val()));
                });




                break;
            case 'CNNFImageLoader':
                ImageLoaderProcessor();
                break;
            case 'CNNFTrainTestSplit':
                trainTestSplit();
                break;
            case 'CNNFCustomKerasModel':
                customModelProcess();
                break;
            case 'CNNFDefaultOptimization':
                opmtimizationProcessor();
                break;
            case 'CNNFDefaultTraining':
                trainingProcessor();
                break;
            case 'CNNFDefaultModelEvaluation':
                modelEvaluationProcesor();

            case 'CNNFDefaultFeatureExtractor':
                featureExtractorProcessor();
                break;

            case 'CNNFTransferLearning':
                transferLearningProcessor();

            default:
                break;
        }

    }


}

function showJSONConfig() {
    editor.set(configMap.get(selectedStep));
    $('#showJSONConfigFile').modal();
}

function loadView(name, id) {
    var source = document.getElementById(id).innerHTML;
    var template = Handlebars.compile(source);
    return template(configMap.get(name));
}


function downloadConfig() {
    var output = {};
    output.global = configMap.get('global');
    var steps = [];

    var dependency = createDependencyList();
    $.each(dependency, function (key, value) {
        steps.push(configMap.get(value.name));

    });

    output.steps = steps;

    $.post("/export_config", {
        id: id,
        config: JSON.stringify(output),
        settings: JSON.stringify(project_settings)
    }, function (data) {
        if (data == 'success') {
            showAlert('Exported Successfully', 'success');
        } else {
            showAlert('Error deleting configuration.' + data, 'error');
        }
    });

}