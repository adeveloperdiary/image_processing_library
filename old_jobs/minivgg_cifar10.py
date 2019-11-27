from core.process_executor import DeepLearningFrameworkAutomation
import json
from keras.datasets import cifar10
import numpy as np

import tensorflow as tf

config = tf.ConfigProto()
config.gpu_options.allow_growth = True
sess = tf.Session(config=config)

import keras.backend as K

dtype='float16'
K.set_floatx(dtype)

# default is 1e-7 which is too small for float16.  Without adjusting the epsilon, we will get NaN predictions because of divide by zero problems
K.set_epsilon(1e-4)


with open("configs/minivgg_cifar10.json", "r") as read_file:
    config = json.load(read_file)

((trainX, trainY), (testX, testY)) = cifar10.load_data()
trainX = trainX.astype("float")
testX = testX.astype("float")

mean = np.mean(trainX, axis=0)
trainX -= mean
testX -= mean

labels = ["airplane", "automobile", "bird", "cat", "deer", "dog", "frog", "horse", "ship", "truck"]

container = {"trainX": trainX, "trainY": trainY, "testX": testX, "testY": testY, "labels": labels}

framework = DeepLearningFrameworkAutomation(config=config, container=container)
framework.execute()


