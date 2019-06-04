import abc


# parent class for all image processing
class ImageProcessorParent(abc.ABC):
    __metaclass__ = abc.ABCMeta

    def __init__(self):
        pass

    @abc.abstractmethod
    def process(self, image):
        return
