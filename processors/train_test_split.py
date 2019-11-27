import numpy as np
import cv2
from sklearn.model_selection import train_test_split
from utils.parents import Step
from sklearn.preprocessing import LabelBinarizer
from keras.utils import np_utils

@Step.register
class TrainTestSplit(Step):

    def __init__(self):
        pass

    def process(self, global_properties={}, properties={}, container={}):
        labels = container[properties["labels"]]

        if "label_to_number" in properties and properties["label_to_number"]:
            lb = LabelBinarizer()
            labels = lb.fit_transform(labels)
            labels = np_utils.to_categorical(labels, properties["classes"])

        random_state = None

        if isinstance(container[properties["data"]], list):
            total_number_of_records = len(container[properties["data"]])
        else:
            total_number_of_records = container[properties["data"]].shape[0]
        test_size = int(total_number_of_records * properties["test_size"])

        if "validation_size" in properties and properties["validation_size"] > 0:
            validation_size = int(total_number_of_records * properties["validation_size"])

        if "random_state" in properties:
            random_state = properties["random_state"]

        stratify = None
        shuffle = False

        if "stratify" in properties and properties["stratify"]:
            stratify = labels
            shuffle = True
        elif "shuffle" in properties:
            shuffle = properties["shuffle"]

        (trainX, testX, trainY, testY) = train_test_split(container[properties["data"]], labels, stratify=stratify, shuffle=shuffle,
                                                          test_size=test_size, random_state=random_state)

        if "validation_size" in properties and properties["validation_size"] > 0:

            if "stratify" in properties and properties["stratify"]:
                stratify = trainY

            (trainX, validationX, trainY, validationY) = train_test_split(trainX, trainY, stratify=stratify, shuffle=shuffle,
                                                                          test_size=validation_size, random_state=random_state)

        container[global_properties["trainX"]] = trainX
        container[global_properties["testX"]] = testX
        container[global_properties["trainY"]] = trainY
        container[global_properties["testY"]] = testY

        if "validation_size" in properties and properties["validation_size"] > 0:
            container[global_properties["validationX"]] = validationX
            container[global_properties["validationY"]] = validationY

        return container
