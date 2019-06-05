from core.process_executor import DeepLearningFrameworkAutomation
import json
from keras.datasets import cifar10

with open("minivgg.json", "r") as read_file:
    config = json.load(read_file)

((trainX, trainY), (testX, testY)) = cifar10.load_data()
trainX = trainX.astype("float") / 255.0
testX = testX.astype("float") / 255.0

labels = ["airplane", "automobile", "bird", "cat", "deer", "dog", "frog", "horse", "ship", "truck"]

container = {"trainX": trainX, "trainY": trainY, "testX": testX, "testY": testY, "labels": labels}

framework = DeepLearningFrameworkAutomation(config=config, container=container)
framework.execute()


