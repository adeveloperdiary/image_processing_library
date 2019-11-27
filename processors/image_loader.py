import numpy as np
import cv2
import os
import progressbar
# import colorama
from utils.parents import Step
from utils.framework_utils import FrameworkUtility
import h5py
from utils.utils import list_images
from utils.hdf5datasetwriter import HDF5DatasetWriter
import json
import os


@Step.register
class ImageLoader(Step):
    def __init__(self):
        self.image_processors = []

    def extract_mean_rgb(self, save_to, imagePaths):

        (R, G, B) = ([], [], [])

        widgets = [
            '[ImageLoader] ExtractMeanRGB  - ',
            progressbar.Bar('#', '[', ']'),
            ' [', progressbar.Percentage(), '] ',
            '[', progressbar.Counter(format='%(value)02d/%(max_value)d'), '] '
        ]

        bar = progressbar.ProgressBar(maxval=len(imagePaths), widgets=widgets)
        bar.start()

        for (i, imagePath) in enumerate(imagePaths):
            image = cv2.imread(imagePath)
            (b, g, r) = cv2.mean(image)[:3]
            R.append(r)
            G.append(g)
            B.append(b)
            bar.update(i + 1)

        bar.finish()

        f = open(save_to, "w+")
        f.write(json.dumps({"R": np.mean(R), "G": np.mean(G), "B": np.mean(B)}))
        f.close()

    def load_images_from_fs(self, properties, container):

        if "path" in properties["input"]:
            imagePaths = list(list_images(properties["input"]["path"]))
            labels = []
        else:
            imagePaths = container[properties["input"]["input_data"]]
            labels = container[properties["input"]["input_labels"]]

        if "pre_processing" in properties:
            pre_processing = properties["pre_processing"]

            for p in pre_processing:
                if p["type"] == "extract_mean_rgb":
                    self.extract_mean_rgb(p["save_to"], imagePaths)

        if "pipeline" in properties:
            pipeline = properties["pipeline"]

            for image_processor in pipeline:
                class_loader = FrameworkUtility.get_instance(image_processor["processor"])
                img_process = class_loader(image_processor["properties"])
                self.image_processors.append(img_process)

        data = []
        widgets = [
            '[ImageLoader] ProcessingImages - ',
            progressbar.Bar('#', '[', ']'),
            ' [', progressbar.Percentage(), '] ',
            '[', progressbar.Counter(format='%(value)02d/%(max_value)d'), '] '
        ]

        bar = progressbar.ProgressBar(maxval=len(imagePaths), widgets=widgets)
        bar.start()

        if "hdf5_file" in properties["output"]:
            writer = HDF5DatasetWriter(
                (len(imagePaths), properties["output"]["dim"]["features"]["width"], properties["output"]["dim"]["features"]["height"],
                 properties["output"]["dim"]["features"]["depth"]), (labels.shape[0], properties["output"]["dim"]["target"]),
                properties["output"]["hdf5_file"])

        for (i, imagePath) in enumerate(imagePaths):
            image = cv2.imread(imagePath)

            if "path" in properties["input"]:
                label = imagePath.split(os.path.sep)[-2]
            else:
                label = labels[i]

            image = self.processing_pipeline(image)

            if "hdf5_file" in properties["output"]:
                writer.add([image], [label])
            else:
                data.append(image)
                labels.append(label)
            bar.update(i + 1)

        if "path" in properties["input"]:
            writer.close()

        bar.finish()

        return np.array(data), np.array(labels)

    def processing_pipeline(self, image):
        if self.image_processors is not None:
            for p in self.image_processors:
                image = p.process(image)

        return image

    def process(self, global_properties={}, properties={}, container={}):

        if properties["type"] == "image_dir":
            data, labels = self.load_images_from_fs(properties, container)
            if "hdf5_file" not in properties["output"]:
                container[properties["data"]] = data
                container[properties["labels"]] = labels
        elif properties["type"] == "hdf5":
            db = h5py.File(properties["path"], "r")

            if "train_test_split" in properties:
                train_test_split_def = properties["train_test_split"]

                index = int(db[train_test_split_def["labels"]].shape[0] * (1.0 - (train_test_split_def["test_percent"] / 100.0)))
                container[train_test_split_def["index"]] = index

            container[properties["output"]] = db

        return container
