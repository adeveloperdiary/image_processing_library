import numpy as np
import cv2
from image_processor.image_resize import ImageResize

image = cv2.imread("/Users/home/Documents/code/dl4cv/datasets/animals/cats/cats_00001.jpg")

ir = ImageResize(300, 300)
image = ir.process1(image)
cv2.imshow("", image)
cv2.waitKey(0)
