from utils.parents import Step
from utils.hdf5datasetgenerator import HDF5DatasetGenerator
from utils.framework_utils import FrameworkUtility


@Step.register
class HDF5GeneratorProcessor(Step):

    def __init__(self):
        self.image_processors = []

    def process(self, global_properties={}, properties={}, container={}):
        if "augmentation" in properties:
            augmentation = container[properties["augmentation"]]
        else:
            augmentation = None

        if "pipeline" in properties:
            pipeline = properties["pipeline"]

            for image_processor in pipeline:
                class_loader = FrameworkUtility.get_instance(image_processor["processor"])
                img_process = class_loader(image_processor["properties"])
                self.image_processors.append(img_process)

        generator = HDF5DatasetGenerator(properties["path"], global_properties["batch_size"], preprocessors=self.image_processors, aug=augmentation)

        container[properties["output"]] = generator

        return container
