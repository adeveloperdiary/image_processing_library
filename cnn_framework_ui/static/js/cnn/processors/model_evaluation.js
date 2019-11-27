function modelEvaluationProcesor() {

    $('#txtModelPath').on('input', function () {

        var path = $.trim($('#txtModelPath').val());

        if (path != "") {
            $('#txtModel').prop('disabled', true);
            $('#txtOutput').prop('disabled', true);
            $('#txtPlotLoc').prop('disabled', true);

        } else {
            $('#txtModel').prop('disabled', false);
            $('#txtOutput').prop('disabled', false);
            $('#txtPlotLoc').prop('disabled', false);
        }
    });

    if (configMap.get(selectedStep).properties.rank5_accuracy != undefined && configMap.get(selectedStep).properties.rank5_accuracy) {
        $('#chkRank5Accuracy').prop('checked', true);
    }else{
        $('#chkRank5Accuracy').prop('checked', false);
    }

    $('#idEvaluation').on('click', function () {
        if (configMap.get(selectedStep).properties == undefined) {
            configMap.get(selectedStep).properties = {}
        }

        configMap.get(selectedStep).properties.batch_size = parseInt($('#numBatchSize').val());
        configMap.get(selectedStep).properties.labels = $('#txtLabels').val();

        var path = $.trim($('#txtModelPath').val());

        if (path != "") {
            configMap.get(selectedStep).properties.save_model = path;

            delete configMap.get(selectedStep).properties["model"];
            delete configMap.get(selectedStep).properties["output"];
            delete configMap.get(selectedStep).properties["plot_loc"]

        } else {
            configMap.get(selectedStep).properties.model = $('#txtModel').val();
            configMap.get(selectedStep).properties.model_output = $('#txtOutput').val();

            var plotPath = $.trim($('#txtPlotLoc').val());

            if (plotPath != '') {
                configMap.get(selectedStep).properties.plot_loc = plotPath
            } else {
                delete configMap.get(selectedStep).properties["plot_loc"]
            }

            delete configMap.get(selectedStep).properties["load_model"];
        }

        if ($('#chkRank5Accuracy').is(':checked')) {
            configMap.get(selectedStep).properties.rank5_accuracy = true;
        } else {
            configMap.get(selectedStep).properties.rank5_accuracy = false;
        }


    });

}