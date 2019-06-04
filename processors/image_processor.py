import cv2
from keras.preprocessing.image import img_to_array
from utils.parents import Step, ImageProcessor


@ImageProcessor.register
class ImageResize(ImageProcessor):
    def __init__(self, properties={}):
        self.width = properties["width"]
        self.height = properties["height"]
        if "interpolation" in properties:
            self.interpolation = properties["interpolation"]
        else:
            self.interpolation = cv2.INTER_AREA

    def process(self, image):
        return cv2.resize(image, (self.width, self.height), interpolation=self.interpolation)


@Step.register
class ImageToArrayPreprocessor(ImageProcessor):
    def __init__(self, properties={}):

        if "dataFormat" in properties:
            self.dataFormat = properties["dataFormat"]
        else:
            self.dataFormat = None

        if "normalize_image" in properties and properties["normalize_image"]:
            self.normalize_image = True
        else:
            self.normalize_image = False

    def process(self, image):
        # Converts int to float32
        image = img_to_array(image, data_format=self.dataFormat)

        if self.normalize_image:
            image = image / 255.0

        return image
