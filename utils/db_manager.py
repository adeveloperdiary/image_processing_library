import numpy as np
import cv2
import h5py
import os


class HDF5DBManager:
    def __init__(self, dims, path, key="images", bufSize=1000):
        self.path = path

        if os.path.exists(self.path):
            os.remove(self.path)

        self.db = h5py.File(self.path, "w")
        self.data = self.db.create_dataset(key, dims, dtype="float")

        self.labels = self.db.create_dataset("labels", (dims[0],), dtype="int")
        self.bufSize = bufSize
        self.buffer = {"data": [], "labels": []}
        self.idx = 0

    def add(self, rows, labels):
        self.buffer["data"].extend(rows)
        self.buffer["labels"].extend(labels)

        if len(self.buffer["data"]) >= self.bufSize:
            self.flush_to_disk()

    def flush_to_disk(self):
        i = self.idx + len(self.buffer["data"])
        self.data[self.idx:i] = self.buffer["data"]
        self.labels[self.idx:i] = self.buffer["labels"]
        self.idx = i
        self.buffer = {"data": [], "labels": []}

    def save_target_labels(self, target_labels):
        datatype = h5py.special_dtype(vlen=str)
        labels = self.db.create_dataset("label_names", (len(target_labels),), dtype=datatype)
        labels[:] = target_labels

    def close(self):
        if len(self.buffer["data"]) > 0:
            self.flush_to_disk()
        self.db.close()
