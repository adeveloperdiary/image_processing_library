from core.process_executor import DeepLearningFrameworkAutomation
import json

with open("configs/feature_extraction.json", "r") as read_file:
    config = json.load(read_file)

framework = DeepLearningFrameworkAutomation(config=config, container={})
framework.execute()
