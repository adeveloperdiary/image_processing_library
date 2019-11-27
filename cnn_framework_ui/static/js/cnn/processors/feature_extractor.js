function featureExtractorProcessor() {

    $('#IL_Directory').hide();

    if(configMap.get(selectedStep).properties.pre_trained_model!=undefined)
        $('#listPreTrainedModel').val(configMap.get(selectedStep).properties.pre_trained_model);

    //Show data on select
    if (configMap.get(selectedStep).properties.image_loading != undefined) {

        var imageLoaderType = configMap.get(selectedStep).properties.image_loading.type;

        if (imageLoaderType == "image_dir") {
            $('#IL_Directory').show();

            $('#listImageLoaderType').val('Image Directory');
        }
    }

    //Show options for the first time or whenever changed the image loader type.
    $('#listImageLoaderType').on('change', function () {
        var imageLoaderType = $('#listImageLoaderType').val();

        if (imageLoaderType == "Choose...") {
            $('#IL_Directory').hide();
        } else if (imageLoaderType == "Image Directory") {
            $('#IL_Directory').show();
        }
    });


    $('#idAddImageProcessor').on('click', function (event) {
        var imagePreProcessorType = $('#listImageProcessorType').val();

        if (imagePreProcessorType == "ImageResize") {
            $('#delete-new-image-resize-pre-processor').attr('disabled', true);

            $('#IP_ImageResize').modal()

        } else if (imagePreProcessorType == "ImageToArrayPreprocessor") {

            if (configMap.get(selectedStep).properties.image_loading == undefined) {
                configMap.get(selectedStep).properties.image_loading = {}
            }
            if (configMap.get(selectedStep).properties.image_loading.pipeline == undefined) {
                configMap.get(selectedStep).properties.image_loading.pipeline = []
            }

            $('#image_pre_processor_list').append('<a href="#" class="list-group-item list-group-item-action" onclick="show_image_pre_processor(\'ImageToArrayPreprocessor\')">ImageToArrayPreprocessor</a>');

            var pre_processor = {};

            pre_processor.processor = "processors.image_processor.ImageToArrayPreprocessor";
            pre_processor.name = "ImageToArrayPreprocessor";

            pre_processor.properties = {};

            pre_processor.properties.normalize_image = false;

            configMap.get(selectedStep).properties.image_loading.pipeline.push(pre_processor);

            event.stopImmediatePropagation();
        }
    });


    $('#add-new-image-resize-pre-processor').on('click', function (event) {
        if (configMap.get(selectedStep).properties.image_loading == undefined) {
            configMap.get(selectedStep).properties.image_loading = {}
        }
        if (configMap.get(selectedStep).properties.image_loading.pipeline == undefined) {
            configMap.get(selectedStep).properties.image_loading.pipeline = []
        }

        $('#image_pre_processor_list').append('<a href="#" class="list-group-item list-group-item-action" onclick="show_image_pre_processor_in_feature_extractor(\'ImageResize\')">ImageResize</a>');

        var pre_processor = {};

        pre_processor.processor = "processors.image_processor.ImageResize";
        pre_processor.name = "ImageResize";

        pre_processor.properties = {};

        pre_processor.properties.interpolation = parseInt($('#txtInterpolation').val());
        pre_processor.properties.width = parseInt($('#txtWidth').val());
        pre_processor.properties.height = parseInt($('#txtHeight').val());


        if ($('#IP_IR_AutoCrop').is(':checked')) {
            pre_processor.properties.crop = true;
        } else {
            pre_processor.properties.crop = false;
        }


        configMap.get(selectedStep).properties.image_loading.pipeline.push(pre_processor);

        $('#txtWidth').val('');
        $('#txtHeight').val('');
        $('#IP_IR_AutoCrop').prop('checked', false);

        $('#IP_ImageResize').modal('hide');

        event.stopImmediatePropagation();

    });


    $('#idImageLoaderSave').on('click', function (e) {

        var imageLoaderType = $('#listImageLoaderType').val();

        if (imageLoaderType == "Choose...") {
            showAlert("Please select an Image Loader", "error")
        } else if (imageLoaderType == "Image Directory") {

            if (configMap.get(selectedStep).properties.image_loading == undefined) {
                configMap.get(selectedStep).properties.image_loading = {}
            }

            configMap.get(selectedStep).properties.image_loading.type = "image_dir";
            configMap.get(selectedStep).properties.image_loading.path = $('#txtPathImages').val();
            configMap.get(selectedStep).properties.image_loading.batch_size = parseInt($('#numBatchSize').val());


        }
        if ($('#listPreTrainedModel').val() != "Choose...") {
            configMap.get(selectedStep).properties.pre_trained_model = $('#listPreTrainedModel').val();
        } else {
            showAlert('Please select the Pre-Trained Model', 'error');
        }

        if (configMap.get(selectedStep).properties.image_store == undefined) {
            configMap.get(selectedStep).properties.image_store = {}
        }

        configMap.get(selectedStep).properties.image_store.output = $('#txtOutputPathImages').val();
        configMap.get(selectedStep).properties.image_store.key = $('#txtOutputKey').val();
        configMap.get(selectedStep).properties.image_store.buffer_size = parseInt($('#txtBufferSize').val());

    });
}

function show_image_pre_processor_in_feature_extractor(name) {
    var pipeline_arr = configMap.get(selectedStep).properties.image_loading.pipeline;

    $.each(pipeline_arr, function (key, val) {
        if (val.name == name) {

            if (name == "ImageResize") {

                $('#txtInterpolation').val(val.properties.interpolation);
                $('#txtWidth').val(val.properties.width);
                $('#txtHeight').val(val.properties.height);

                if (val.properties.crop) {
                    $('#IP_IR_AutoCrop').prop('checked', true)
                } else {
                    $('#IP_IR_AutoCrop').prop('checked', false)
                }

                $('#delete-new-image-resize-pre-processor').attr('disabled', false);

                $('#IP_ImageResize').modal()

            }
        }
    })


}