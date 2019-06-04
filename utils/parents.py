import numpy as np
import cv2
import abc


class Step(abc.ABC):
    __metaclass__ = abc.ABCMeta

    def __init__(self):
        pass

    @abc.abstractmethod
    def process(self, properties={}, container={}):
        return


class ImageProcessor(abc.ABC):
    __metaclass__ = abc.ABCMeta

    def __init__(self):
        pass

    @abc.abstractmethod
    def process(self, image):
        return
