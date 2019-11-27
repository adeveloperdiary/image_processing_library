from utils.parents import Step
from utils.utils import list_images
import os


@Step.register
class ImageLoader_FromPath(Step):

    def __init__(self):
        pass

    def process(self, global_properties={}, properties={}, container={}):
        image_paths = list(list_images(properties["image_path"]))
        image_labels = [path.split(os.path.sep)[-1].split('.')[0] for path in image_paths]

        container[properties["output"]] = image_paths
        container[properties["labels"]] = image_labels

        return container
