from keras.models import Sequential
from keras.layers.normalization import BatchNormalization
from keras.layers.convolutional import Conv2D, MaxPooling2D
from keras.layers.core import Activation, Flatten, Dense, Dropout
import re
from utils.parents import Step


@Step.register
class CustomModel(Step):

    def __init__(self):
        pass

    def process(self, global_properties={}, properties={}, container={}):

        width = properties["width"]
        height = properties["height"]
        color_channel = properties["color_channel"]
        target_classes = properties["target_classes"]

        model = Sequential()

        layer_list = []

        layers = re.split("->", properties["model"])

        for layer in layers:
            if layer.find("=>") > -1:
                repeat = int(layer.split("*")[1])
                layer = layer.split("*")[0][1:-1]

                repeat_layers = re.split("=>", layer)
                for count in range(repeat):
                    for repeat_layer in repeat_layers:
                        layer_list.append(repeat_layer)
            else:
                layer_list.append(layer)

        for i, layer in enumerate(layer_list):

            if layer.find("(") > -1:
                name = layer.split("(")[0]
                params = layer.split("(")[1]
                params = params[:-1]

            if name == "Conv2D":
                params = params.split(",")
                if i == 0:
                    model.add(Conv2D(int(params[0]), (int(params[1]), int(params[1])), padding=params[2], input_shape=(height, width, color_channel)))
                else:
                    model.add(Conv2D(int(params[0]), (int(params[1]), int(params[1])), padding=params[2]))
            elif name == "Activation":
                model.add(Activation(params))
            elif name == "MaxPooling2D":
                model.add(MaxPooling2D(pool_size=(int(params), int(params))))
            elif name == "BatchNormalization":
                if params:
                    model.add(BatchNormalization(axis=int(params)))
                else:
                    model.add(BatchNormalization())
            elif name == "Dropout":
                model.add(Dropout(float(params)))
            elif name == "Flatten":
                model.add(Flatten())
            elif name == "Dense":
                if params:
                    model.add(Dense(int(params)))
                else:
                    model.add(Dense(target_classes))

        if "model_summary" in properties and properties["model_summary"]:
            print(model.summary())

        container[properties["output"]] = model

        return container
