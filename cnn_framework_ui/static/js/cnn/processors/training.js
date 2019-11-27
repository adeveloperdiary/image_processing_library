function trainingProcessor() {

    if (configMap.get(selectedStep).properties == undefined) {
        configMap.get(selectedStep).properties = {}
    }
    if (configMap.get(selectedStep).properties.callbacks == undefined) {
        configMap.get(selectedStep).properties.callbacks = []
    }

    if (configMap.get(selectedStep).properties.augmentation != undefined) {

        $('#imageAugmentation').attr('checked', true);
        $('#image_augmentation_section').show();

        if(configMap.get(selectedStep).properties.augmentation.load_from!=undefined){
            $('#chkOptions').attr('checked', false);
            $('#frm_load_augmentation').show();
            $('#frm_options').hide();
        }else{
            $('#chkOptions').attr('checked', true);
            $('#frm_load_augmentation').hide();
            $('#frm_options').show();
        }

        if(configMap.get(selectedStep).properties.augmentation.fill_mode!=undefined
        && configMap.get(selectedStep).properties.augmentation.fill_mode!="Choose..."){
            $('#listAugFillMode').val(configMap.get(selectedStep).properties.augmentation.fill_mode);
        }

        if(configMap.get(selectedStep).properties.augmentation.horizontal_flip!=undefined
        && configMap.get(selectedStep).properties.augmentation.horizontal_flip){
            $('#chkHorizontalFlip').attr('checked', true);
        }

        if(configMap.get(selectedStep).properties.augmentation.vertical_flip!=undefined
        && configMap.get(selectedStep).properties.augmentation.vertical_flip){
            $('#chkVerticalFlip').attr('checked', true);
        }

    }else{
        $('#imageAugmentation').attr('checked', false);
        $('#image_augmentation_section').hide();
        $('#chkOptions').attr('checked', true);
        $('#frm_load_augmentation').hide();
        $('#frm_options').hide();
    }

    $('#imageAugmentation').on('change', function () {
        if ($('#imageAugmentation').is(':checked')) {
            $('#image_augmentation_section').show();
        } else {
            $('#image_augmentation_section').hide();
        }
    });

    $('#chkOptions').on('change',function () {
        if ($('#chkOptions').is(':checked')) {
            $('#frm_load_augmentation').hide();
            $('#frm_options').show()
        }else{
            $('#frm_load_augmentation').show();
            $('#frm_options').hide();
        }
    });

    $('#idCallbacks').on('click', function (event) {
        var callbackType = $('#listCallbackType').val();

        if (callbackType == "LearningRateScheduler") {
            $('#delete-lr-callbacks').attr('disabled', true);

            $('#Callbacks_LearningRateScheduler').modal()

        } else if (callbackType == "BaseLogger") {

            $('#delete-bl-callbacks').attr('disabled', true);
            $('#Callbacks_BaseLogger').modal()
        } else if (callbackType == "ModelCheckpoint") {

            $('#delete-checkpoint-callbacks').attr('disabled', true);
            $('#Callbacks_ModelCheckpoint').modal()
        }
    });

    $('#add-lr-callbacks').on('click', function (event) {

        $('#keras_callbacks').append('<a href="#" class="list-group-item list-group-item-action" onclick="show_callbacks(\'LearningRateScheduler\')">LearningRateScheduler</a>');

        var callback = {};

        callback.type = "LearningRateScheduler";

        if ($('#listLearningRateScheduler').val() != "Choose...") {
            callback.method = $('#listLearningRateScheduler').val();
        }

        configMap.get(selectedStep).properties.callbacks.push(callback);

        $('#listLearningRateScheduler').val('Choose...');
        $('#Callbacks_LearningRateScheduler').modal('hide');

        event.stopImmediatePropagation();


    });

    $('#add-bl-callbacks').on('click', function (event) {

        $('#keras_callbacks').append('<a href="#" class="list-group-item list-group-item-action" onclick="show_callbacks(\'BaseLogger\')">BaseLogger</a>');

        var callback = {};

        callback.type = "BaseLogger";

        callback.class = "callbacks.trainingmonitor.TrainingMonitor";
        callback.path = $('#txtBaseLogger').val();

        configMap.get(selectedStep).properties.callbacks.push(callback);

        $('#Callbacks_BaseLogger').modal('hide');

        event.stopImmediatePropagation();
    });

    $('#add-checkpoint-callbacks').on('click', function (event) {
        $('#keras_callbacks').append('<a href="#" class="list-group-item list-group-item-action" onclick="show_callbacks(\'ModelCheckpoint\')">ModelCheckpoint</a>');

        var callback = {};

        callback.type = "ModelCheckpoint";

        callback.filename = $('#txtCheckpointFileName').val();
        callback.path = $('#txtCheckpointPath').val();
        callback.monitor = $('#txtCheckpointMonitor').val();

        if ($('#chkCheckpointBest').is(':checked')) {
            callback.save_best_only = true;
        } else {
            callback.save_best_only = false;
        }

        $('#chkCheckpointBest').prop('checked', false);

        configMap.get(selectedStep).properties.callbacks.push(callback);

        $('#Callbacks_ModelCheckpoint').modal('hide');

        event.stopImmediatePropagation();
    });

    $('#idTraining').on('click', function () {
        if (configMap.get(selectedStep).properties == undefined) {
            configMap.get(selectedStep).properties = {}
        }

        configMap.get(selectedStep).properties.batch_size = parseInt($('#numBatchSize').val());
        configMap.get(selectedStep).properties.verbose = parseInt($('#numVerbose').val());

        configMap.get(selectedStep).properties.model = $('#txtModel').val();
        configMap.get(selectedStep).properties.output = $('#txtOutput').val();

        var path = $.trim($('#txtModelSavePath').val());

        if (path != '') {
            configMap.get(selectedStep).properties.save_model = path
        } else {
            delete configMap.get(selectedStep).properties["save_model"]
        }

        var epoch_val = $.trim($('#numEpochs').val());

        if (epoch_val != "" && parseInt(epoch_val) > 0) {
            configMap.get(selectedStep).properties.epochs = parseInt(epoch_val);
        } else {
            delete configMap.get(selectedStep).properties["epochs"]
        }

        if ($('#imageAugmentation').is(':checked')) {

            if (configMap.get(selectedStep).properties.augmentation == undefined) {
                configMap.get(selectedStep).properties.augmentation = {}
            }

            if ($('#chkOptions').is(':checked')) {
                configMap.get(selectedStep).properties.augmentation.rotation_range = parseInt($('#txtAugRotationRange').val());
                configMap.get(selectedStep).properties.augmentation.width_shift_range = parseFloat($('#txtAugWidthShiftRange').val());
                configMap.get(selectedStep).properties.augmentation.height_shift_range = parseFloat($('#txtAugHeightShiftRange').val());
                configMap.get(selectedStep).properties.augmentation.shear_range = parseFloat($('#txtAugShearRange').val());
                configMap.get(selectedStep).properties.augmentation.zoom_range = parseFloat($('#txtAugZoomRange').val());
                configMap.get(selectedStep).properties.augmentation.horizontal_flip = parseFloat($('#txtAugZoomRange').val());

                if ($('#listAugFillMode').val() != "Choose...") {
                    configMap.get(selectedStep).properties.augmentation.fill_mode = $('#listAugFillMode').val();
                } else {
                    delete configMap.get(selectedStep).properties.augmentation['fill_mode']
                }

                if ($('#chkHorizontalFlip').is(':checked')) {
                    configMap.get(selectedStep).properties.augmentation.horizontal_flip = true
                } else {
                    configMap.get(selectedStep).properties.augmentation.horizontal_flip = false
                }

                if ($('#chkVerticalFlip').is(':checked')) {
                    configMap.get(selectedStep).properties.augmentation.vertical_flip = true
                } else {
                    configMap.get(selectedStep).properties.augmentation.vertical_flip = false
                }

                configMap.get(selectedStep).properties.augmentation.save_to = $('#txtSaveTo').val();

                delete configMap.get(selectedStep).properties.augmentation["load_from"]

            } else {

                delete configMap.get(selectedStep).properties["augmentation"];

                configMap.get(selectedStep).properties.augmentation = {};

                configMap.get(selectedStep).properties.augmentation.load_from=$('#txtLoadAug').val();
            }

        } else {
            delete configMap.get(selectedStep).properties["augmentation"]
        }

    });

}

function show_callbacks(type) {

    var callback_arr = configMap.get(selectedStep).properties.callbacks;

    $.each(callback_arr, function (key, val) {
        if (val.type == type) {

            if (type == "LearningRateScheduler") {

                $('#listLearningRateScheduler').val(val.method);

                $('#delete-lr-callbacks').attr('disabled', false);

                $('#Callbacks_LearningRateScheduler').modal()

            } else if (type == "BaseLogger") {

                $('#txtBaseLogger').val(val.path);

                $('#delete-bl-callbacks').attr('disabled', false);

                $('#Callbacks_BaseLogger').modal()
            } else if (type == "ModelCheckpoint") {

                $('#txtCheckpointPath').val(val.path);
                $('#txtCheckpointFileName').val(val.filename);
                $('#txtCheckpointMonitor').val(val.monitor);

                if (val.save_best_only) {
                    $('#chkCheckpointBest').prop('checked', true)
                } else {
                    $('#chkCheckpointBest').prop('checked', false)
                }

                $('#delete-checkpoint-callbacks').attr('disabled', false);

                $('#Callbacks_ModelCheckpoint').modal()
            }

        }
    });

}