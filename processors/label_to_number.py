from utils.parents import Step
from sklearn.preprocessing import LabelBinarizer


@Step.register
class LabelToNumber(Step):

    def __init__(self):
        pass

    def process(self, global_properties={}, properties={}, container={}):
        lb = LabelBinarizer()
        trainY = lb.fit_transform(container[global_properties["trainY"]])
        testY = lb.transform(container[global_properties["testY"]])

        container[global_properties["trainY"]] = trainY
        container[global_properties["testY"]] = testY

        return container
