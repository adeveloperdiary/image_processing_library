from keras.optimizers import SGD
from utils.parents import Step
from keras import backend as K


@Step.register
class DefaultOptimization(Step):

    def __init__(self):
        pass

    def process(self, global_properties={}, properties={}, container={}):
        model = container[properties["model"]]

        optimization_def = properties["optimization"]

        if optimization_def["algorithm"] == "stochastic_gradient_descent":
            optimizer = SGD()

            if "nesterov" in optimization_def:
                optimizer.nesterov = optimization_def["nesterov"]

        metrics = properties["metrics"].split(",")

        model.compile(loss=properties["loss"], optimizer=optimizer, metrics=metrics)

        if optimization_def["algorithm"] == "stochastic_gradient_descent":
            if "learning_rate" in optimization_def:
                K.set_value(model.optimizer.lr, optimization_def["learning_rate"])

            if "momentum" in optimization_def:
                K.set_value(model.optimizer.momentum, optimization_def["momentum"])

            if "decay" in optimization_def:
                K.set_value(model.optimizer.decay, optimization_def["decay"] / global_properties["epochs"])

        container[properties["output"]] = model

        return container
