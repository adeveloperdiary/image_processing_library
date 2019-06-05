from utils.parents import Step
from sklearn.preprocessing import LabelBinarizer


@Step.register
class LabelToNumber(Step):

    def __init__(self):
        pass

    def process(self, global_properties={},properties={}, container={}):
        lb = LabelBinarizer()
        trainY = lb.fit_transform(container[properties["trainY"]])
        testY = lb.transform(container[properties["testY"]])

        return trainY, testY
