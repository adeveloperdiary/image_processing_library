import importlib


class FrameworkUtility:

    @staticmethod
    def get_instance(path):
        module_name = path.split('.')[0:-1]
        module_name = ".".join(module_name)
        class_name = path.split('.')[-1]

        return getattr(importlib.import_module(module_name), class_name)
