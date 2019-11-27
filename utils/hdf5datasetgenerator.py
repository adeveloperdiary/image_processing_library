import numpy as np
import h5py
from keras.utils import np_utils


class HDF5DatasetGenerator:
    def __init__(self, path, batch_size, preprocessors=None, aug=None):
        self.batch_size = batch_size
        self.preprocessors = preprocessors
        self.aug = aug

        self.db = h5py.File(path)
        self.dataset_length = self.db["labels"].shape[0]

    def generator(self, passes=np.inf):
        epochs = 0
        while epochs < passes:
            for i in np.arange(0, self.dataset_length, self.batch_size):
                images = self.db['images'][i: i + self.batch_size]
                labels = self.db['labels'][i: i + self.batch_size]

                if self.preprocessors is not None:
                    processed_images = []
                    for image in images:
                        for p in self.preprocessors:
                            image = p.process(image)
                        processed_images.append(image)
                    images = np.array(processed_images)

                if self.aug is not None:
                    (images, labels) = next(self.aug.flow(images, labels, batch_size=self.batch_size))

                yield (images, labels)

            epochs += 1

    def close(self):
        self.db.close()
