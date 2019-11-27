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

        if "batch_size" in global_properties:
            batch_size = global_properties["batch_size"]
        else:
            batch_size = properties["batch_size"]

        if "epochs" in properties:
            epochs = properties["epochs"]
        else:
            epochs = global_properties["epochs"]

        if "callbacks" in properties:
            callbacks = []
            callback_defs = properties["callbacks"]
            for callback_def in callback_defs:
                if callback_def["type"] == "LearningRateScheduler":
                    class_loader = FrameworkUtility.get_instance(callback_def["class"])
                    cls = class_loader()
                    callbacks.append(LearningRateScheduler(cls.decay))
                elif callback_def["type"] == "BaseLogger":
                    figPath = os.path.sep.join([callback_def["path"], "{}.png".format(os.getpid())])

                    jsonPath = os.path.sep.join([callback_def["path"], "{}.json".format(os.getpid())])

                    cls = FrameworkUtility.get_instance(callback_def["class"])
                    callbacks.append(cls(figPath, jsonPath))
                elif callback_def["type"] == "ModelCheckpoint":
                    callbacks.append(ModelCheckpoint(callback_def["path"] + "/" + callback_def["filename"], monitor=callback_def["monitor"],
                                                     save_best_only=callback_def["save_best_only"], verbose=properties["verbose"]))

        else:
            callbacks = None

        if "generator" in properties:

            training_generator = container[properties["generator"]["training_generator"]]
            validation_generator = container[properties["generator"]["validation_generator"]]

            model.fit_generator(
                training_generator.generator(),
                steps_per_epoch=training_generator.dataset_length // batch_size,
                validation_data=validation_generator.generator(),
                validation_steps=validation_generator.dataset_length // batch_size,
                epochs=epochs,
                max_queue_size=properties["generator"]["max_queue_size"],
                callbacks=callbacks, verbose=properties["verbose"],
                use_multiprocessing=properties["generator"]["use_multiprocessing"],
                workers=properties["generator"]["workers"]
            )

            training_generator.close()
            validation_generator.close()
        else:
            trainX = container[global_properties["trainX"]]
            testX = container[global_properties["testX"]]
            trainY = container[global_properties["trainY"]]
            testY = container[global_properties["testY"]]


            if "augmentation" in properties:
                augmentation = container[properties["augmentation"]]

                model_output = model.fit_generator(augmentation.flow(trainX, trainY, batch_size=batch_size),
                                                   validation_data=(testX, testY), steps_per_epoch=len(trainX) // batch_size,
                                                   epochs=epochs, callbacks=callbacks, verbose=properties["verbose"])

            else:
                model_output = model.fit(trainX, trainY, validation_data=(testX, testY), batch_size=batch_size,
                                     epochs=epochs,
                                     callbacks=callbacks,
                                     verbose=properties["verbose"])

        container[properties["output"]] = model_output

        if "save_model" in properties:
            model.save(properties["save_model"])

        return container
