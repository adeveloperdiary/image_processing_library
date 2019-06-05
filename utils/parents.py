import abc


class Step(abc.ABC):
    __metaclass__ = abc.ABCMeta

    def __init__(self):
        pass

    @abc.abstractmethod
    def process(self, global_properties={}, properties={}, container={}):
        return container


class ImageProcessor(abc.ABC):
    __metaclass__ = abc.ABCMeta

    def __init__(self):
        pass

    @abc.abstractmethod
    def process(self, image):
        return image
