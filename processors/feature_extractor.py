import numpy as np
import cv2
from keras.applications import VGG16
from utils.parents import Step
from utils.db_manager import HDF5DBManager
from processors.image_loader import ImageLoader
import random
import os
from sklearn.preprocessing import LabelEncoder
from utils.framework_utils import FrameworkUtility
from keras.applications import imagenet_utils
import progressbar


@Step.register
class DefaultFeatureExtractor(Step):

    def __init__(self):
        self.image_processors = []

    def get_labels(self, image_paths):
        labels = [p.split(os.path.sep)[-2] for p in image_paths]
        le = LabelEncoder()
        labels = le.fit_transform(labels)

        return labels, le.classes_

    def processing_pipeline(self, image):
        if self.image_processors is not None:
            for p in self.image_processors:
                image = p.process(image)

        return image

    def define_pipeline(self, config):
        pipeline = config["pipeline"]

        for image_processor in pipeline:
            class_loader = FrameworkUtility.get_instance(image_processor["processor"])
            img_process = class_loader(image_processor["properties"])
            self.image_processors.append(img_process)

    def process(self, global_properties={}, properties={}, container={}):

        if properties["pre_trained_model"] == "VGG16":
            model_out_size = 512 * 7 * 7

            model = VGG16(weights="imagenet", include_top=False)

        image_loading_def = properties["image_loading"]

        if image_loading_def["type"] == "image_dir":
            loader = ImageLoader()
            image_paths = list(loader.list_images(image_loading_def["path"]))
            random.shuffle(image_paths)

            labels, classes = self.get_labels(image_paths)

            image_store_def = properties["image_store"]

            dataset = HDF5DBManager((len(image_paths), model_out_size),
                                    image_store_def["output"], key=image_store_def["key"],
                                    bufSize=image_store_def["buffer_size"])

            dataset.save_target_labels(classes)

            self.define_pipeline(image_loading_def)

            widgets = [
                '[ImageLoader] Loading Images - ',
                progressbar.Bar('#', '[', ']'),
                ' [', progressbar.Percentage(), '] ',
                '[', progressbar.Counter(format='%(value)02d/%(max_value)d'), '] '

            ]

            bar = progressbar.ProgressBar(maxval=len(image_paths), widgets=widgets)
            bar.start()

            for i in np.arange(0, len(image_paths), image_loading_def["batch_size"]):
                batchPaths = image_paths[i:i + image_loading_def["batch_size"]]
                batchLabels = labels[i:i + image_loading_def["batch_size"]]
                batchImages = []

                for (j, imagePath) in enumerate(batchPaths):
                    image = cv2.imread(imagePath)
                    image = self.processing_pipeline(image)

                    image = np.expand_dims(image, axis=0)
                    image = imagenet_utils.preprocess_input(image)

                    batchImages.append(image)

                batchImages = np.vstack(batchImages)
                features = model.predict(batchImages, image_loading_def["batch_size"])

                features = features.reshape((features.shape[0], model_out_size))

                dataset.add(features, batchLabels)
                bar.update(i + 1)

            dataset.close()
            bar.finish()

        return container
