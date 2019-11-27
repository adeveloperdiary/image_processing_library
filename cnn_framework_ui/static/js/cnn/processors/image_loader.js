function ImageLoaderProcessor() {

    $('#IL_hff5').hide();
    $('#IL_Directory').hide();
    $('#train_test_split_section').hide();
    $('#train_test_split').prop('checked', false);


    //Show data on select
    if (configMap.get(selectedStep).properties != undefined) {

        var imageLoaderType = configMap.get(selectedStep).properties.type;

        if (imageLoaderType == "hdf5") {

            $('#listImageLoaderType').val('HDF5');
            $('#IL_hff5').show();
            $('#IL_Directory').hide();

            if (configMap.get(selectedStep).properties.train_test_split != undefined) {
                $('#train_test_split').prop('checked', true);
                $('#train_test_split_section').show();
            } else {
                $('#train_test_split').prop('checked', false);
                $('#train_test_split_section').hide();
            }
        } else if (imageLoaderType == "image_dir") {
            $('#IL_hff5').hide();
            $('#IL_Directory').show();
            $('#train_test_split').prop('checked', false);
            $('#train_test_split_section').hide();

            $('#listImageLoaderType').val('Image Directory');
        }
    }

    //Show options for the first time or whenever changed the image loader type.
    $('#listImageLoaderType').on('change', function () {
        var imageLoaderType = $('#listImageLoaderType').val();

        if (imageLoaderType == "Choose...") {
            $('#IL_hff5').hide();
            $('#IL_Directory').hide();
            $('#train_test_split').prop('checked', false);
            $('#train_test_split_section').hide();

        } else if (imageLoaderType == "HDF5") {
            $('#IL_hff5').show();
            $('#IL_Directory').hide();

            $('#train_test_split').prop('checked', false);
            $('#train_test_split_section').hide();

        } else if (imageLoaderType == "Image Directory") {
            $('#IL_hff5').hide();
            $('#IL_Directory').show();
            $('#train_test_split').prop('checked', false);
            $('#train_test_split_section').hide();
        }
    });


    $('#idAddImageProcessor').on('click', function (event) {
        var imagePreProcessorType = $('#listImageProcessorType').val();

        if (imagePreProcessorType == "ImageResize") {
            $('#delete-new-image-resize-pre-processor').attr('disabled', true);

            $('#IP_ImageResize').modal()

        } else if (imagePreProcessorType == "ImageToArrayPreprocessor") {

            $('#delete-image-to-array-pp').attr('disabled', true);
            $('#IP_ImageToArrayPreprocessor').modal()
        }
    });

    $('#train_test_split').on('change', function () {
        if ($('#train_test_split').is(':checked')) {
            $('#train_test_split_section').show();
        } else {
            $('#train_test_split_section').hide();
        }
    });

    $('#txtPathImages').bind('input',function () {
       if($.trim($('#txtPathImages').val())!=""){
           $('#txtInputDataPlaceHolder').val("");
           $('#txtInputDataPlaceHolder').prop('disabled',true);

           $('#txtInputLabelPlaceHolder').val("");
           $('#txtInputLabelPlaceHolder').prop('disabled',true);

       }else{
           $('#txtInputDataPlaceHolder').val("data");
           $('#txtInputDataPlaceHolder').prop('disabled',false);

           $('#txtInputLabelPlaceHolder').val("labels");
           $('#txtInputLabelPlaceHolder').prop('disabled',false);
       }
    });

    $('#add-new-image-resize-pre-processor').on('click', function (event) {
        if (configMap.get(selectedStep).properties == undefined) {
            configMap.get(selectedStep).properties = {}
        }
        if (configMap.get(selectedStep).properties.pipeline == undefined) {
            configMap.get(selectedStep).properties.pipeline = []
        }

        $('#image_pre_processor_list').append('<a href="#" class="list-group-item list-group-item-action" onclick="show_image_pre_processor(\'ImageResize\')">ImageResize</a>');

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


        configMap.get(selectedStep).properties.pipeline.push(pre_processor);

        $('#txtWidth').val('');
        $('#txtHeight').val('');
        $('#IP_IR_AutoCrop').prop('checked', false);

        $('#IP_ImageResize').modal('hide');

        event.stopImmediatePropagation();

    });

    $('#add-image-to-array-pp').on('click', function (event) {
        if (configMap.get(selectedStep).properties == undefined) {
            configMap.get(selectedStep).properties = {}
        }
        if (configMap.get(selectedStep).properties.pipeline == undefined) {
            configMap.get(selectedStep).properties.pipeline = []
        }

        $('#image_pre_processor_list').append('<a href="#" class="list-group-item list-group-item-action" onclick="show_image_pre_processor(\'ImageToArrayPreprocessor\')">ImageToArrayPreprocessor</a>');

        var pre_processor = {};

        pre_processor.processor = "processors.image_processor.ImageToArrayPreprocessor";
        pre_processor.name = "ImageToArrayPreprocessor";

        pre_processor.properties = {};

        if ($('#IP_IA_Normalize').is(':checked')) {
            pre_processor.properties.normalize_image = true;
        } else {
            pre_processor.properties.normalize_image = false;
        }

        configMap.get(selectedStep).properties.pipeline.push(pre_processor);

        $('#IP_IA_Normalize').prop('checked', false);

        $('#IP_ImageToArrayPreprocessor').modal('hide');

        event.stopImmediatePropagation();
    });

    $('#idImageLoaderSave').on('click', function (e) {

        var imageLoaderType = $('#listImageLoaderType').val();

        if (imageLoaderType == "Choose...") {
            showAlert("Please select an Image Loader", "error")
        } else if (imageLoaderType == "HDF5") {

            configMap.get(selectedStep).properties = {};

            configMap.get(selectedStep).properties.type = "hdf5";
            configMap.get(selectedStep).properties.path = $('#txtPathhdf5').val();
            configMap.get(selectedStep).properties.output = $('#txtOutput').val();

            configMap.get(selectedStep).properties.train_test_split = {};

            if ($('#train_test_split').is(':checked')) {

                configMap.get(selectedStep).properties.train_test_split.labels = $('#txtLabels').val();
                configMap.get(selectedStep).properties.train_test_split.test_percent = parseInt($('#numTestPercent').val());
                configMap.get(selectedStep).properties.train_test_split.index = $('#txtIndex').val();
            }
            $('#image_pre_processor_list').html('')

        } else if (imageLoaderType == "Image Directory") {

            if (configMap.get(selectedStep).properties == undefined) {
                configMap.get(selectedStep).properties = {}
            }

            configMap.get(selectedStep).properties.type = "image_dir";
            configMap.get(selectedStep).properties.path = $('#txtPathImages').val();
            configMap.get(selectedStep).properties.data = $('#txtDataPlaceHolder').val();
            configMap.get(selectedStep).properties.labels = $('#txtLabelPlaceHolder').val();

        }

    });
}

function show_image_pre_processor(name) {
    var pipeline_arr = configMap.get(selectedStep).properties.pipeline;

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

                $('#delete-new-image-resize-pre-processor').attr('disabled',false);

                $('#IP_ImageResize').modal()

            } else if (name == "ImageToArrayPreprocessor") {

                if (val.properties.normalize_image) {
                    $('#IP_IA_Normalize').prop('checked', true)
                } else {
                    $('#IP_IA_Normalize').prop('checked', false)
                }

                $('#delete-image-to-array-pp').attr('disabled', false);

                $('#IP_ImageToArrayPreprocessor').modal()
            }

        }
    })


}