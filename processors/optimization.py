from keras.optimizers import SGD
from utils.parents import Step


@Step.register
class DefaultOptimization(Step):

    def __init__(self):
        pass

    def process(self, global_properties={}, properties={}, container={}):
        model = container[properties["model"]]

        optimization = properties["optimization"]

        if optimization["algorithm"] == "stochastic_gradient_descent":
            optimizer = SGD()

            if "learning_rate" in optimization:
                optimizer.lr = optimization["learning_rate"]

            if "momentum" in optimization:
                optimizer.momentum = optimization["momentum"]

            if "decay" in optimization:
                optimizer.decay = optimization["decay"] / global_properties["epochs"]

            if "nesterov" in optimization:
                optimizer.nesterov = optimization["nesterov"]

        metrics = properties["metrics"].split(",")

        model.compile(loss=properties["loss"], optimizer=optimizer, metrics=metrics)

        container[properties["output"]] = model

        return container
