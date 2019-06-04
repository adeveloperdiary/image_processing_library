from utils.framework_utils import FrameworkUtility


class DeepLearningFrameworkAutomation:
    def __init__(self, config):
        self.master_config = config

    def execute(self):
        steps = self.master_config["steps"]
        steps_length = len(steps)

        container = {}

        for step_counter, step in enumerate(steps):
            print("[INFO] Executing Step - {} [{}/{}]".format(step["name"], step_counter + 1, steps_length))

            # START - Execute the Step
            class_loader = FrameworkUtility.get_instance(step["processor"])
            processor = class_loader()
            return_value = processor.process(step["properties"], container)
            container[step["properties"]["output"]] = return_value

            # END - Execute the Step
