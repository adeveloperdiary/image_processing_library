import cv2
from image_processor.image_processor import ImageProcessorParent


@ImageProcessorParent.register
class ImageResize(ImageProcessorParent):
    def __init__(self, width, height, interpolation=cv2.INTER_AREA):
        self.width = width
        self.height = height
        self.interpolation = interpolation

    def process(self, image):
        return cv2.resize(image, (self.width, self.height), interpolation=self.interpolation)
