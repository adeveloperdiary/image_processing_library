from utils.parents import Step
from keras.layers import Dense, Flatten, Conv2D, BatchNormalization, Dropout, MaxPooling2D, Activation, concatenate, AveragePooling2D,Input
from keras.models import Model
from core.BN16 import BatchNormalizationF16

@Step.register
class MiniGoogleNet(Step):

    def __init__(self):
        pass

    def conv_module(self, x, nFilters, size, stride, dim=-1, padding="same", ):
        x = Conv2D(nFilters, (size, size), padding=padding, strides=(stride, stride))(x)
        x = BatchNormalization(axis=dim)(x)
        x = Activation("relu")(x)

        return x

    def inception_module(self, x, nF1x1, nF3x3, dim=-1):
        conv_1x1 = self.conv_module(x, nF1x1, 1, 1, dim)
        conv_3x3 = self.conv_module(x, nF3x3, 3, 1, dim)

        x = concatenate([conv_1x1, conv_3x3], axis=dim)

        return x

    def downsample_module(self, x, nFilters, dim=-1):
        conv_3x3 = self.conv_module(x, nFilters, 3, 2, dim, padding="valid")

        pool = MaxPooling2D((3, 3), strides=(2, 2))(x)

        x = concatenate([conv_3x3, pool], axis=dim)

        return x

    def process(self, global_properties={}, properties={}, container={}):
        width = properties["width"]
        height = properties["height"]
        color_channel = properties["color_channel"]

        if "classes" in global_properties:
            target_classes = global_properties["classes"]
        else:
            target_classes = properties["target_classes"]

        inputs = Input(shape=(height, width, color_channel))

        x = self.conv_module(inputs, 96, 3, 1)

        x = self.inception_module(x, 32, 32)
        x = self.inception_module(x, 32, 48)
        x = self.downsample_module(x, 80)

        x = self.inception_module(x, 112, 48)
        x = self.inception_module(x, 96, 64)
        x = self.inception_module(x, 80, 80)
        x = self.inception_module(x, 48, 96)
        x = self.downsample_module(x, 96)

        x = self.inception_module(x, 176, 160)
        x = self.inception_module(x, 176, 160)
        x = AveragePooling2D((7, 7))(x)
        x = Dropout(0.5)(x)
        x = Flatten()(x)
        x = Dense(target_classes)(x)
        x = Activation("softmax")(x)

        model = Model(inputs, x, name="minigooglenet")

        if "model_summary" in properties and properties["model_summary"]:
            print(model.summary())

        container[properties["output"]] = model

        return container
