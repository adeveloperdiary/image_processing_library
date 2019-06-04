import numpy as np
import cv2
from image_processor.image_processor import ImageProcessorParent
from keras.preprocessing.image import img_to_array


@ImageProcessorParent.register
class ImageToArrayPreprocessor(ImageProcessorParent):
    def __init__(self, dataFormat=None):
        self.dataFormat = dataFormat

    def process(self, image):
        return img_to_array(image, data_format=self.dataFormat)
