from pandas import DataFrame
from models.utils.rfm_preparing import RFMPreparing


class RFM:

    def __init__(self, data: DataFrame):
        self.__data = data.copy()
        self.__preparator = RFMPreparing(self.__data)

    def calculate_rfm(self):
        self.__data = self.__preparator.prepare()
