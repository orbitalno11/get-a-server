from pandas import DataFrame
import numpy as np

from utils.date_preparation import DatePreparation


class RFMPreparing:

    def __init__(self, data: DataFrame):
        self.__data = data.copy()

    @staticmethod
    def __grading_recency(row):
        if row['last_login'] > 7:
            val = 1
        elif 6 <= row['last_login'] <= 7:
            val = 2
        elif 4 <= row['last_login'] <= 5:
            val = 3
        elif 2 <= row['last_login'] <= 3:
            val = 4
        else:
            val = 5
        return val

    @staticmethod
    def __grading_frequency(row):
        if row['last_login'] > 7:
            val = 5
        elif 6 <= row['last_login'] <= 7:
            val = 4
        elif 4 <= row['last_login'] <= 5:
            val = 3
        elif 2 <= row['last_login'] <= 3:
            val = 2
        else:
            val = 1
        return val


    def __calculate_recency_range(self):
        self.__data['recency_login'] = self.__data.apply(self.__grading_recency, axis=1)
        self.__data['comment_time'] = DatePreparation.string_to_date(self.__data['last_comment'])
        print('recency')

    def __calculate_frequency_range(self):
        self.__data['frequency_login'] = self.__data.apply(self.__grading_frequency, axis=1)
        print('frequency')

    def prepare(self) -> DataFrame:
        self.__calculate_recency_range()
        # self.__calculate_frequency_range()
        return self.__data
