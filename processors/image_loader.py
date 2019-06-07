import numpy as np
import cv2
import os
import progressbar
# import colorama
from utils.parents import Step
from utils.framework_utils import FrameworkUtility
import h5py


@Step.register
class ImageLoader(Step):
    def __init__(self):
        self.image_types = (".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff")
        self.image_processors = []

        # colorama.init()

    def list_files(self, basePath, validExts=None, contains=None):
        for (rootDir, dirNames, filenames) in os.walk(basePath):
            for filename in filenames:
                if contains is not None and filename.find(contains) == -1:
                    continue

                ext = filename[filename.rfind("."):].lower()

                if validExts is None or ext.endswith(validExts):
                    imagePath = os.path.join(rootDir, filename)
                    yield imagePath

    def list_images(self, basePath, contains=None):
        return self.list_files(basePath, validExts=self.image_types, contains=contains)

    def load_images_from_fs(self, path):

        imagePaths = list(self.list_images(path))

        # print(colorama.Fore.BLUE)

        data = []
        labels = []
        widgets = [
            '[ImageLoader] Loading Images - ',
            progressbar.Bar('#', '[', ']'),
            ' [', progressbar.Percentage(), '] ',
            '[', progressbar.Counter(format='%(value)02d/%(max_value)d'), '] '

        ]

        bar = progressbar.ProgressBar(maxval=len(imagePaths), widgets=widgets)
        bar.start()

        for (i, imagePath) in enumerate(imagePaths):
            image = cv2.imread(imagePath)
            label = imagePath.split(os.path.sep)[-2]

            image = self.processing_pipeline(image)

            data.append(image)
            labels.append(label)
            bar.update(i + 1)

        bar.finish()
        # print(colorama.Style.RESET_ALL)

        return np.array(data), np.array(labels)

    def processing_pipeline(self, image):
        if self.image_processors is not None:
            for p in self.image_processors:
                image = p.process(image)

        return image

    def process(self, global_properties={}, properties={}, container={}):

        if "pipeline" in properties:
            pipeline = properties["pipeline"]

            for image_processor in pipeline:
                class_loader = FrameworkUtility.get_instance(image_processor["processor"])
                img_process = class_loader(image_processor["properties"])
                self.image_processors.append(img_process)

        if properties["type"] == "image_dir":
            data, labels = self.load_images_from_fs(properties["path"])
            container[properties["data"]] = data
            container[properties["labels"]] = labels
        elif properties["type"] == "hdf5":
            db = h5py.File(properties["path"], "r")

            if "train_test_split" in properties:
                train_test_split_def = properties["train_test_split"]

                index = int(db[train_test_split_def["labels"]].shape[0] * (1.0 - (train_test_split_def["test_percent"] / 100.0)))
                container[train_test_split_def["index"]] = index

            container[properties["db"]] = db

        return container
