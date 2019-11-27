import numpy as np


class StepDecay:
    def __init__(self, init_alpha=0.01, factor=0.5, drop_in_every=5):
        self.init_alpha = init_alpha
        self.factor = factor
        self.drop_in_every = drop_in_every

    def decay(self, epoch):
        alpha = self.init_alpha * (self.factor ** np.floor((1 + epoch) / self.drop_in_every))
        return float(alpha)


class PolyDecay:
    def __init__(self, max_epochs=70, base_lr=5e-3, power_val=1.0):
        self.max_epochs = max_epochs
        self.base_lr = base_lr
        self.power_val = power_val

    def decay(self, epoch):
        alpha = self.base_lr * (1 - (epoch / float(self.max_epochs))) ** self.power_val

        return alpha
