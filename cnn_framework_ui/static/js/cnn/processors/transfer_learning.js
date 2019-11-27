function transferLearningProcessor() {

    $('#generic').hide();
    $('#frm_unfreeze_layer').hide();

    if (configMap.get(selectedStep).properties.unfreeze_layers != undefined
        && configMap.get(selectedStep).properties.unfreeze_layers) {

        $('#chkUnfreezeLayers').prop('checked', true);
        $('#generic').hide();
        $('#frm_unfreeze_layer').show();

    } else {
        $('#chkUnfreezeLayers').prop('checked', false);
        $('#generic').show();
        $('#frm_unfreeze_layer').hide();

        if(configMap.get(selectedStep).properties.pre_trained_model!=undefined)
            $('#listPreTrainedModel').val(configMap.get(selectedStep).properties.pre_trained_model);
    }

    $('#chkUnfreezeLayers').on('change', function () {
        if ($('#chkUnfreezeLayers').is(':checked')) {
            $('#generic').hide();
            $('#frm_unfreeze_layer').show();
        } else {
            $('#generic').show();
            $('#frm_unfreeze_layer').hide();
        }
    });

    $('#listModelTemplate').on('change', function () {
        var template_name = $('#listModelTemplate').val();

        if (template_name == "1_FC_layer") {
            $('#modelDefinition').val("Flatten()->Dense(256,relu)->Dropout(0.5)->Dense(17,softmax)");
        } else {
            $('#modelDefinition').val("");
        }

    });

    $('#idTransferLearning').on('click', function () {
        if ($('#chkUnfreezeLayers').is(':checked')) {
            delete configMap.get(selectedStep).properties["model"];
            delete configMap.get(selectedStep).properties["output"];
            delete configMap.get(selectedStep).properties["pre_trained_model"];

            configMap.get(selectedStep).properties.base_model = $('#txtBaseModelOutput1').val();
            configMap.get(selectedStep).properties.unfreeze_from = parseInt($('#txtUnfreezeFrom').val());
            configMap.get(selectedStep).properties.unfreeze_layers = true;
        } else {
            delete configMap.get(selectedStep).properties["unfreeze_from"];
            delete configMap.get(selectedStep).properties["unfreeze_layers"];

            configMap.get(selectedStep).properties.model=$('#modelDefinition').val();
            configMap.get(selectedStep).properties.output=$('#txtOutputModel').val();
            configMap.get(selectedStep).properties.pre_trained_model=$('#listPreTrainedModel').val();
            configMap.get(selectedStep).properties.base_model = $('#txtBaseModelOutput').val();
        }
    });

}