function customModelProcess() {
    $('#listModelTemplate').on('change', function () {
        var template_name = $('#listModelTemplate').val();

        if (template_name == "MiniVGGNet") {
            $('#modelDefinition').val("[Conv2D(32,3,same)=>Activation(relu)]*2->MaxPooling2D(2)->Dropout(0.25)->[Conv2D(64,3,same)=>Activation(relu)=>BatchNormalization(-1)]*2->MaxPooling2D(2)->Dropout(0.25)->Flatten()->Dense(512)->Activation(relu)->BatchNormalization()->Dropout(0.5)->Dense()->Activation(softmax)");
        } else if (template_name == "LeNet") {
            $('#modelDefinition').val("Conv2D(20,5,same)->Activation(relu)->MaxPooling2D(2,2)->Flatten()->Dense(500)->Activation(relu)->Dense()->Activation(softmax)");
        } else if (template_name == "ShallowNet") {
            $('#modelDefinition').val("Conv2D(32,3,same)->Activation(relu)->Flatten()->Dense()->Activation(softmax)");
        } else {
            $('#modelDefinition').val('');
        }
    });

    $('#idCustomModel').on('click', function () {
        if (configMap.get(selectedStep).properties == undefined) {
            configMap.get(selectedStep).properties = {}
        }

        configMap.get(selectedStep).properties.model = $('#modelDefinition').val();
        configMap.get(selectedStep).properties.output = $('#txtOutput').val();
        configMap.get(selectedStep).properties.width = parseInt($('#txtWidth').val());
        configMap.get(selectedStep).properties.height = parseInt($('#txtHeight').val());
        configMap.get(selectedStep).properties.color_channel = parseInt($('#numColorChannels').val());
        configMap.get(selectedStep).properties.target_classes = parseInt($('#numTargetClasses').val());

        if ($('#chkModelSummary').is(':checked')) {
            configMap.get(selectedStep).properties.model_summary = true;
        } else {
            configMap.get(selectedStep).properties.model_summary = false;
        }

    });
}