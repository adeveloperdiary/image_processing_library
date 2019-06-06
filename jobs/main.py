from core.process_executor import DeepLearningFrameworkAutomation
import json

import numpy as np


def step_decay(epoch):
    initAlpha = 0.01
    factor = 0.5
    dropEvery = 5

    alpha = initAlpha * (factor ** np.floor((1 + epoch) / dropEvery))

    return float(alpha)


with open("configs/config.json", "r") as read_file:
    config = json.load(read_file)

framework = DeepLearningFrameworkAutomation(config=config, container={})

framework.execute()
