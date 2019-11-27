function trainTestSplit() {
    $('#idTrainTestSave').on('click', function () {
        if (configMap.get(selectedStep).properties == undefined) {
            configMap.get(selectedStep).properties = {}
        }

        configMap.get(selectedStep).properties.data = $('#txtDataPlaceHolder').val();
        configMap.get(selectedStep).properties.labels = $('#txtLabelPlaceHolder').val();
        configMap.get(selectedStep).properties.test_size = parseFloat($('#numTestSplitSize').val());

        if ($('#labeltonumber').is(':checked')) {
            configMap.get(selectedStep).properties.label_to_number = true;
        } else {
            configMap.get(selectedStep).properties.label_to_number = false;
        }

        var validationSplit = parseFloat($('#numValSplitSize').val());

        if (validationSplit > 0) {
            configMap.get(selectedStep).properties.validation_size = validationSplit
        } else {
            delete configMap.get(selectedStep).properties["validation_size"]
        }

        var randomState = parseInt($('#txtRandomState').val());

        if (randomState > 0) {
            configMap.get(selectedStep).properties.random_state = randomState
        } else {
            delete configMap.get(selectedStep).properties["random_state"]
        }


        if ($('#shuffle').is(':checked')) {
            configMap.get(selectedStep).properties.shuffle = true;
        } else {
            configMap.get(selectedStep).properties.shuffle = false;
        }

        if ($('#stratify').is(':checked')) {
            configMap.get(selectedStep).properties.stratify = true;
        } else {
            configMap.get(selectedStep).properties.stratify = false;
        }

    });
}