from core.process_executor import DeepLearningFrameworkAutomation
import json
from sklearn import datasets

with open("configs/lenet.json", "r") as read_file:
    config = json.load(read_file)

dataset = datasets.fetch_mldata("MNIST Original")
data = dataset.data
data = data.reshape(data.shape[0], 28, 28, 1)
labels = dataset.target.astype("int")

container = {"data": data, "labels": labels}

framework = DeepLearningFrameworkAutomation(config=config, container=container)
framework.execute()
