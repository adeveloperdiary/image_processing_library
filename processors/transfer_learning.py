from keras.applications import VGG16
from utils.parents import Step
from keras.layers import Input, Dense, Flatten, Dropout
from keras.models import Model
import re


@Step.register
class TransferLearning(Step):

    def __init__(self):
        pass

    def buildFCHead(self, baseModel, properties):
        headModel = baseModel.output

        # "Flatten->Dense(128, relu)->Dropout(0.5)->Dense(10, softmax)"

        layer_list = []

        layers = re.split("->", properties["model"])

        for layer in layers:
            layer_list.append(layer)

        for i, layer in enumerate(layer_list):

            if layer.find("(") > -1:
                name = layer.split("(")[0]
                params = layer.split("(")[1]
                params = params[:-1]

            if name == "Dropout":
                headModel = Dropout(float(params))(headModel)
            elif name == "Flatten":
                headModel = Flatten(name="flatten")(headModel)
            elif name == "Dense":
                params = params.split(",")
                headModel = Dense(int(params[0]), activation=params[1])(headModel)

        return headModel

    def process(self, global_properties={}, properties={}, container={}):

        if "unfreeze_layers" in properties and properties["unfreeze_layers"]:
            baseModel = container[properties["base_model"]]

            for layer in baseModel.layers[properties["unfreeze_from"]:]:
                layer.trainable = True

        else:
            if properties["pre_trained_model"] == "VGG16":
                baseModel = VGG16(weights="imagenet", include_top=False, input_tensor=Input(shape=(224, 224, 3)))

            headModel = self.buildFCHead(baseModel, properties)

            model = Model(inputs=baseModel.input, outputs=headModel)

            for layer in baseModel.layers:
                layer.trainable = False

            container[properties["output"]] = model
            container[properties["base_model"]] = baseModel

        return container
