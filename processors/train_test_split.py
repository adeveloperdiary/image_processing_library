import numpy as np
import cv2
from sklearn.model_selection import train_test_split
from utils.parents import Step
from sklearn.preprocessing import LabelBinarizer


@Step.register
class TrainTestSplit(Step):

    def __init__(self):
        pass

    def process(self, properties={}, container={}):
        (trainX, testX, trainY, testY) = train_test_split(container[properties["data"]], container[properties["labels"]],
                                                          test_size=properties["test_size"])

        if "label_to_number" in properties and properties["label_to_number"]:
            lb = LabelBinarizer()
            trainY = lb.fit_transform(trainY)
            testY = lb.transform(testY)

        container["trainX"] = trainX
        container["testX"] = testX
        container["trainY"] = trainY
        container["testY"] = testY

        return container
