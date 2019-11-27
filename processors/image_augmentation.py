from utils.parents import Step
from keras.preprocessing.image import ImageDataGenerator


@Step.register
class ImageAugmentation(Step):

    def __init__(self):
        self.image_processors = []

    def process(self, global_properties={}, properties={}, container={}):
        augmentation = ImageDataGenerator(rotation_range=properties["rotation_range"],
                                          width_shift_range=properties["width_shift_range"],
                                          height_shift_range=properties["height_shift_range"],
                                          shear_range=properties["shear_range"],
                                          zoom_range=properties["zoom_range"],
                                          horizontal_flip=properties["horizontal_flip"], fill_mode=properties["fill_mode"])

        container[properties["output"]] = augmentation

        return container
