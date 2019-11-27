import cv2
from keras.preprocessing.image import img_to_array
from utils.parents import Step, ImageProcessor
import json
from sklearn.feature_extraction.image import extract_patches_2d


@ImageProcessor.register
class ImageResize(ImageProcessor):
    def __init__(self, properties={}):
        self.width = properties["width"]
        self.height = properties["height"]
        if "interpolation" in properties:
            self.interpolation = properties["interpolation"]
        else:
            self.interpolation = cv2.INTER_AREA

        if "crop" in properties and properties["crop"]:
            self.crop = True
        else:
            self.crop = False

    def process(self, image):

        if self.crop:
            (h, w) = image.shape[:2]
            dW = 0
            dH = 0

            if w < h:
                dH = int((image.shape[0] - self.height) / 2.0)
            else:
                dW = int((image.shape[1] - self.width) / 2.0)

            image = image[dH:h - dH, dW:w - dW]

        image = cv2.resize(image, (self.width, self.height), interpolation=self.interpolation)

        return image


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


@Step.register
class MeanRGBNormalize(ImageProcessor):

    def __init__(self, properties={}):
        means = json.loads(open(properties["load_from"]).read())
        self.mean_r = means["R"]
        self.mean_g = means["G"]
        self.mean_b = means["B"]

    def process(self, image):
        (B, G, R) = cv2.split(image.astype("float32"))

        R -= self.mean_r
        G -= self.mean_g
        B -= self.mean_b

        return cv2.merge([B, G, R])


@Step.register
class PatchProcessor(ImageProcessor):

    def __init__(self, properties={}):
        self.width = properties["width"]
        self.height = properties["height"]

    def process(self, image):
        return extract_patches_2d(image, (self.height, self.width), max_patches=1)[0]
