from core.process_executor import DeepLearningFrameworkAutomation
import json
import tensorflow as tf

config = tf.ConfigProto()
config.gpu_options.allow_growth = True
sess = tf.Session(config=config)

import keras.backend as K
dtype='float16'
K.set_floatx(dtype)

# default is 1e-7 which is too small for float16.  Without adjusting the epsilon, we will get NaN predictions because of divide by zero problems
K.set_epsilon(1e-4)

with open("configs/config.json", "r") as read_file:
    config = json.load(read_file)

framework = DeepLearningFrameworkAutomation(config=config, container={})
framework.execute()
