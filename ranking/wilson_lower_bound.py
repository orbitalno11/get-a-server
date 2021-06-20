import math
import scipy.stats as stat


def wilson_lower_bound(pos, n, confidence=0.95):
    if n == 0:
        return 0

    z = stat.norm.ppf(1 - (1 - confidence) / 2)
    p_hat = 1.0 * pos / n
    return ((p_hat + ((z * z) / (2 * n))) - (z * math.sqrt(((p_hat * (1 - p_hat)) / n) + ((z * z) / (4 * n))))) / (
                1 + ((z * z) / n))
