function opmtimizationProcessor() {


    $('#listOptimizationAlgorithm').on('change', function () {
        var optimization = $('#listOptimizationAlgorithm').val();

        if (optimization == "StochasticGradientDescent") {
            $('#SGD').show();
            $('#RMSprop').hide();
        } else if (optimization == "RMSprop") {
            $('#SGD').hide();
            $('#RMSprop').show();
        } else {
            $('#SGD').hide();
            $('#RMSprop').hide();
        }
    });

    if (configMap.get(selectedStep).properties.optimization != undefined) {

        $('#listOptimizationAlgorithm').val(configMap.get(selectedStep).properties.optimization.algorithm);

        if (configMap.get(selectedStep).properties.optimization.algorithm == "StochasticGradientDescent") {

            if (configMap.get(selectedStep).properties.optimization.nesterov) {
                $('#chkNesterov').prop('checked', true);
            } else {
                $('#chkNesterov').prop('checked', false);
            }

            $('#SGD').show();
            $('#RMSprop').hide();
        } else if (configMap.get(selectedStep).properties.optimization.algorithm == "RMSprop") {
            $('#SGD').hide();
            $('#RMSprop').show();
        }


    } else {
        $('#SGD').hide();
        $('#RMSprop').hide();
    }

    if (configMap.get(selectedStep).properties.loss != undefined)
        $('#listLoss').val(configMap.get(selectedStep).properties.loss);


    $('#idOptimizationAlgo').on('click', function () {
        if (configMap.get(selectedStep).properties == undefined) {
            configMap.get(selectedStep).properties = {}
        }

        if (configMap.get(selectedStep).properties.optimization == undefined) {
            configMap.get(selectedStep).properties.optimization = {}
        }

        var optimization = $('#listOptimizationAlgorithm').val();

        configMap.get(selectedStep).properties.optimization.algorithm = optimization;

        if (optimization == "StochasticGradientDescent") {
            configMap.get(selectedStep).properties.optimization.learning_rate = parseFloat($('#numLearningRate').val());

            if (parseFloat($('#numMomentum').val()) > 0.0) {
                configMap.get(selectedStep).properties.optimization.momentum = parseFloat($('#numMomentum').val());
            } else {
                delete configMap.get(selectedStep).properties.optimization["momentum"]
            }

            if (parseFloat($('#numLearningRateDecay').val()) > 0.0) {
                configMap.get(selectedStep).properties.optimization.decay = parseFloat($('#numLearningRateDecay').val());
            } else {
                delete configMap.get(selectedStep).properties.optimization["decay"]
            }
            if ($('#chkNesterov').is(':checked')) {
                configMap.get(selectedStep).properties.optimization.nesterov = true;
            } else {
                configMap.get(selectedStep).properties.optimization.nesterov = false;
            }
        }

        if (optimization == "RMSprop") {
            configMap.get(selectedStep).properties.optimization.learning_rate = parseFloat($('#numLearningRateRMS').val());
        }

        if ($('#listLoss').val() != "Choose...") {
            configMap.get(selectedStep).properties.loss = $('#listLoss').val();
        } else {
            configMap.get(selectedStep).properties.loss = ""
        }

        configMap.get(selectedStep).properties.metrics = $('#txtMetrics').val();
        configMap.get(selectedStep).properties.model = $('#txtOutput').val();

    });
}