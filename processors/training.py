import numpy as np
import cv2

from utils.parents import Step


@Step.register
class DefaultTraining(Step):

    def __init__(self):
        pass

    def process(self, global_properties={}, properties={}, container={}):
        model = container[properties["model"]]
        trainX = container[global_properties["trainX"]]
        testX = container[global_properties["testX"]]
        trainY = container[global_properties["trainY"]]
        testY = container[global_properties["testY"]]

        model_output = model.fit(trainX, trainY, validation_data=(testX, testY), batch_size=properties["batch_size"],
                                 epochs=global_properties["epochs"], callbacks=None, verbose=properties["verbose"])

        container[properties["output"]] = model_output

        if "save_model" in properties:
            model.save(properties["save_model"])

        return container
