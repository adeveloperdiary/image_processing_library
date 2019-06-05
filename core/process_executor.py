from utils.framework_utils import FrameworkUtility


class DeepLearningFrameworkAutomation:
    def __init__(self, config, container={}):
        self.master_config = config
        self.container = container

    def execute(self):
        steps = self.master_config["steps"]
        steps_length = len(steps)

        for step_counter, step in enumerate(steps):
            print("[FRAMEWORK] Executing Step [{}/{}] - {}".format(step_counter + 1, steps_length, step["name"], ))

            # START - Execute the Step
            class_loader = FrameworkUtility.get_instance(step["processor"])
            processor = class_loader()
            self.container = processor.process(self.master_config["global"], step["properties"], self.container)
            # END - Execute the Step

        return self.container

