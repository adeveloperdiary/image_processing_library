from keras.optimizers import SGD, RMSprop,Adam
from utils.parents import Step
from keras import backend as K


@Step.register
class DefaultOptimization(Step):

    def __init__(self):
        pass

    def process(self, global_properties={}, properties={}, container={}):
        model = container[properties["model"]]

        optimization_def = properties["optimization"]

        if optimization_def["algorithm"] == "StochasticGradientDescent":
            optimizer = SGD()

            if "nesterov" in optimization_def:
                optimizer.nesterov = optimization_def["nesterov"]

        if optimization_def["algorithm"] == "RMSprop":
            optimizer = RMSprop()

        if optimization_def["algorithm"] == "Adam":
            optimizer = Adam()

        metrics = properties["metrics"].split(",")

        if properties["loss"] == "CategoricalCrossEntropy":
            loss = "categorical_crossentropy"

        model.compile(loss=loss, optimizer=optimizer, metrics=metrics)

        if optimization_def["algorithm"] == "StochasticGradientDescent":
            if "learning_rate" in optimization_def:
                K.set_value(model.optimizer.lr, optimization_def["learning_rate"])

            if "momentum" in optimization_def:
                K.set_value(model.optimizer.momentum, optimization_def["momentum"])

            if "decay" in optimization_def:
                K.set_value(model.optimizer.decay, optimization_def["decay"] / global_properties["epochs"])

        if optimization_def["algorithm"] == "RMSprop":
            if "learning_rate" in optimization_def:
                K.set_value(model.optimizer.lr, optimization_def["learning_rate"])

        if optimization_def["algorithm"] == "Adam":
            if "learning_rate" in optimization_def:
                K.set_value(model.optimizer.lr, optimization_def["learning_rate"])

        container[properties["model"]] = model

        return container
