from sklearn.metrics import classification_report
import matplotlib.pyplot as plt
import numpy as np
from utils.parents import Step
from keras.models import load_model


@Step.register
class DefaultModelEvaluation(Step):

    def __init__(self):
        pass

    def process(self, global_properties={}, properties={}, container={}):
        labelNames = np.unique(container[properties["labels"]]).astype(str).tolist()

        testX = container[global_properties["testX"]]
        testY = container[global_properties["testY"]]

        if "load_model" in properties:
            model = load_model(properties["load_model"])
        else:
            model = container[properties["model"]]

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

        predictions = model.predict(testX, batch_size=properties["batch_size"])
        print(classification_report(testY.argmax(axis=1), predictions.argmax(axis=1), target_names=labelNames))
