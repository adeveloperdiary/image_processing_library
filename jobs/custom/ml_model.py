from utils.parents import Step
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import classification_report


@Step.register
class CustomMLModel(Step):

    def __init__(self):
        pass

    def process(self, global_properties={}, properties={}, container={}):
        params = {"C": [0.1, 1.0, 10.0, 100.0, 1000.0, 10000.0]}
        model = GridSearchCV(LogisticRegression(), params, cv=3, n_jobs=32)
        model.fit(container["db"]["features"][:container["train_test_split_index"]], container["db"]["labels"][:container["train_test_split_index"]])

        predictions = model.predict(container["db"]["features"][container["train_test_split_index"]:])
        print(classification_report(container["db"]["labels"][container["train_test_split_index"]:], predictions,
                                    target_names=container["db"]["label_names"]))

        container["db"].close()
