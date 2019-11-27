import numpy as np
import os


def rank5_accuracy(predictions, targets):
    rank1 = 0
    rank5 = 0

    targets = targets.argmax(axis=1)

    for (p, gt) in zip(predictions, targets):
        p = np.argsort(p)[::-1]
        if gt in p[:5]:
            rank5 += 1

        if gt == p[0]:
            rank1 += 1

    rank1 /= float(len(targets))
    rank5 /= float(len(targets))

    return rank1, rank5


image_types = (".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff")


def list_files(basePath, validExts=None, contains=None):
    for (rootDir, dirNames, filenames) in os.walk(basePath):
        for filename in filenames:
            if contains is not None and filename.find(contains) == -1:
                continue

            ext = filename[filename.rfind("."):].lower()

            if validExts is None or ext.endswith(validExts):
                imagePath = os.path.join(rootDir, filename)
                yield imagePath


def list_images(basePath, contains=None):
    return list_files(basePath, validExts=image_types, contains=contains)
