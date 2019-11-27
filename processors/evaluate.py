from sklearn.metrics import classification_report
import matplotlib.pyplot as plt
import numpy as np
from utils.parents import Step
from keras.models import load_model
from utils.utils import rank5_accuracy


@Step.register
class DefaultModelEvaluation(Step):

    def __init__(self):
        pass

    def process(self, global_properties={}, properties={}, container={}):

        if "batch_size" in global_properties:
            batch_size = global_properties["batch_size"]
        else:
            batch_size = properties["batch_size"]

        if "load_model" in properties:
            model = load_model(properties["load_model"])
        else:
            model = container[properties["model"]]

        if "plot_loc" in properties and "model_output" in properties:
            H = container[properties["model_output"]]
            plt.style.use("ggplot")
            plt.figure()
            plt.plot(np.arange(0, global_properties["epochs"]), H.history["loss"], label="train_loss")
            plt.plot(np.arange(0, global_properties["epochs"]), H.history["val_loss"], label="val_loss")
            plt.plot(np.arange(0, global_properties["epochs"]), H.history["acc"], label="train_accuracy")
            plt.plot(np.arange(0, global_properties["epochs"]), H.history["val_acc"], label="val_accuracy")
            plt.title("Training Loss and Accuracy")
            plt.xlabel("Epoch #")
            plt.ylabel("Loss/Accuracy")
            plt.legend()
            plt.savefig(properties["plot_loc"])

        if "generator" in properties:

            testing_generator = container[properties["generator"]["testing_generator"]]

            predictions = model.predict_generator(testing_generator.generator(), steps=testing_generator.dataset_length // batch_size,
                                                  max_queue_size=properties["generator"]["max_queue_size"])
            print(classification_report(testing_generator.db.get("labels").value.argmax(axis=1), predictions.argmax(axis=1)))

            testing_generator.close()

        else:

            labelNames = np.unique(container[properties["labels"]]).astype(str).tolist()

            testX = container[global_properties["testX"]]
            testY = container[global_properties["testY"]]

            predictions = model.predict(testX, batch_size=batch_size)
            print(classification_report(testY.argmax(axis=1), predictions.argmax(axis=1), target_names=labelNames))

            if "rank5_accuracy" in properties and properties["rank5_accuracy"]:
                print(rank5_accuracy(predictions, testY))

        return container
