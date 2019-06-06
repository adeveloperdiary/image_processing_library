from utils.parents import Step
from keras.callbacks import LearningRateScheduler, ModelCheckpoint
from utils.framework_utils import FrameworkUtility
import os


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

        if "callbacks" in properties:
            callbacks = []
            callback_defs = properties["callbacks"]
            for callback_def in callback_defs:
                if callback_def["type"] == "decay":
                    method = FrameworkUtility.get_instance(callback_def["method"])
                    callbacks.append(LearningRateScheduler(method))
                elif callback_def["type"] == "training_monitor":
                    figPath = os.path.sep.join([callback_def["path"], "{}.png".format(os.getpid())])

                    jsonPath = os.path.sep.join([callback_def["path"], "{}.json".format(os.getpid())])

                    cls = FrameworkUtility.get_instance(callback_def["class"])
                    callbacks.append(cls(figPath, jsonPath))
                elif callback_def["type"] == "checkpoint":
                    callbacks.append(ModelCheckpoint(callback_def["path"] + "/" + callback_def["filename"], monitor=callback_def["monitor"],
                                                     save_best_only=callback_def["save_best_only"], verbose=properties["verbose"]))

        else:
            callbacks = None

        model_output = model.fit(trainX, trainY, validation_data=(testX, testY), batch_size=properties["batch_size"],
                                 epochs=global_properties["epochs"],
                                 callbacks=callbacks,
                                 verbose=properties["verbose"])

        container[properties["output"]] = model_output

        if "save_model" in properties:
            model.save(properties["save_model"])

        return container
