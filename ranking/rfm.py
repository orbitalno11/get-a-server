import pandas as pd
import numpy as np
from datetime import datetime


class RFM:

    def __init__(self, recency, frequency, monetary):
        self.__recency = None
        self.__recency_df = recency
        self.__frequency = None
        self.__frequency_df = frequency
        self.__monetary = None
        self.__monetary_df = monetary
        self.__rfm = None

    @staticmethod
    def transform_recent_value(recent):
        if recent <= 2:
            return 5
        elif 2 < recent <= 4:
            return 4
        elif 4 < recent <= 5:
            return 3
        elif 5 < recent <= 6:
            return 2
        else:
            return 1

    @staticmethod
    def find_deciles(data, n):
        return (10 * (data.name + 1)) / (n + 1)

    def calculate_recency(self):
        self.__recency_df["recent_login"] = pd.to_datetime(self.__recency_df["recent_login"])
        self.__recency_df["login_diff"] = (datetime.now() - self.__recency_df["recent_login"]).apply(
            lambda item: float(abs(item.days)))

        self.__recency_df["recent_profile_view"] = pd.to_datetime(self.__recency_df["recent_profile_view"])
        self.__recency_df["profile_diff"] = (datetime.now() - self.__recency_df["recent_profile_view"]).apply(
            lambda item: float(abs(item.days)))

        self.__recency_df["recent_comment"] = pd.to_datetime(self.__recency_df["recent_comment"])
        self.__recency_df["comment_diff"] = (datetime.now() - self.__recency_df["recent_comment"]).apply(
            lambda item: float(abs(item.days)))

        self.__recency_df["recent_approved"] = pd.to_datetime(self.__recency_df["recent_approved"])
        self.__recency_df["approve_diff"] = (datetime.now() - self.__recency_df["recent_approved"]).apply(
            lambda item: float(abs(item.days)))

        self.__recency_df["login_diff"].replace(to_replace=np.nan, value=7, inplace=True)
        self.__recency_df["profile_diff"].replace(to_replace=np.nan, value=7, inplace=True)
        self.__recency_df["comment_diff"].replace(to_replace=np.nan, value=7, inplace=True)
        self.__recency_df["approve_diff"].replace(to_replace=np.nan, value=7, inplace=True)

        self.__recency_df["login_value"] = self.__recency_df["login_diff"].apply(self.transform_recent_value)
        self.__recency_df["profile_value"] = self.__recency_df["profile_diff"].apply(self.transform_recent_value)
        self.__recency_df["comment_value"] = self.__recency_df["comment_diff"].apply(self.transform_recent_value)
        self.__recency_df["approve_value"] = self.__recency_df["approve_diff"].apply(self.transform_recent_value)

        self.__recency_df["recency"] = (
                (0.2438 * self.__recency_df["login_value"]) + (0.3063 * self.__recency_df["profile_value"]) +
                (0.3063 * self.__recency_df["comment_value"]) + (0.1438 * self.__recency_df["approve_value"]))

        self.__recency = self.__recency_df.loc[:, ["tutor_id", "recency"]]

    def calculate_frequency(self):
        df_size = len(self.__frequency_df.index)
        self.__frequency_df.sort_values(by="number_of_login", inplace=True)
        self.__frequency_df.reset_index(drop=True, inplace=True)
        self.__frequency_df["login_deciles"] = self.__frequency_df.apply(
            lambda item: self.find_deciles(item, df_size), axis=1)

        self.__frequency_df.sort_values(by="number_of_course_view", inplace=True)
        self.__frequency_df.reset_index(drop=True, inplace=True)
        self.__frequency_df["course_view_deciles"] = self.__frequency_df.apply(
            lambda item: self.find_deciles(item, df_size), axis=1)

        self.__frequency_df.sort_values(by="number_of_profile_view", inplace=True)
        self.__frequency_df.reset_index(drop=True, inplace=True)
        self.__frequency_df["profile_view_deciles"] = self.__frequency_df.apply(
            lambda item: self.find_deciles(item, df_size), axis=1)

        self.__frequency_df["frequency"] = (((0.0667 * self.__frequency_df["login_deciles"]) +
                                             (0.4667 * self.__frequency_df["course_view_deciles"]) +
                                             (0.4667 * self.__frequency_df["profile_view_deciles"])) * 5) / 10
        self.__frequency = self.__frequency_df.loc[:, ["tutor_id", "frequency"]]

    def calculate_monetary(self):
        df_size = len(self.__monetary_df.index)
        self.__monetary_df.sort_values(by="number_of_favorite", inplace=True)
        self.__monetary_df.reset_index(drop=True, inplace=True)
        self.__monetary_df["favorite_deciles"] = self.__monetary_df.apply(
            lambda item: self.find_deciles(item, df_size), axis=1)

        self.__monetary_df.sort_values(by="number_of_learner", inplace=True)
        self.__monetary_df.reset_index(drop=True, inplace=True)
        self.__monetary_df["learner_deciles"] = self.__monetary_df.apply(
            lambda item: self.find_deciles(item, df_size), axis=1)

        self.__monetary_df["number_of_review"] = (self.__monetary_df["number_of_offline_review"] +
                                                  self.__monetary_df["number_of_online_review"])
        self.__monetary_df.sort_values(by="number_of_review", inplace=True)
        self.__monetary_df.reset_index(drop=True, inplace=True)
        self.__monetary_df["review_deciles"] = self.__monetary_df.apply(
            lambda item: self.find_deciles(item, df_size), axis=1)

        self.__monetary_df["monetary"] = (((0.3235 * self.__monetary_df["tutor_rating"] * 2) +
                                           (0.0546 * self.__monetary_df["favorite_deciles"]) +
                                           (0.23 * self.__monetary_df["learner_deciles"]) +
                                           (0.3919 * self.__monetary_df["review_deciles"])) * 5) / 10

        self.__monetary = self.__monetary_df.loc[:, ["tutor_id", "monetary"]]

    def calculate_rfm(self):
        self.calculate_recency()
        self.calculate_frequency()
        self.calculate_monetary()

        self.__rfm = pd.merge(self.__recency, self.__frequency, left_on="tutor_id", right_on="tutor_id")
        self.__rfm = pd.merge(self.__rfm, self.__monetary, left_on="tutor_id", right_on="tutor_id")

        r_weight = 0.1001
        f_weight = 0.3893
        m_weight = 0.5105

        self.__rfm["rfm_value"] = ((r_weight * self.__rfm["recency"]) +
                                   (f_weight * self.__rfm["frequency"]) +
                                   (m_weight * self.__rfm["monetary"])) / (r_weight + f_weight + m_weight)
        self.__rfm.sort_values(by="rfm_value", ascending=False, inplace=True)


    def recency(self):
        return self.__recency

    def frequency(self):
        return self.__frequency

    def monetary(self):
        return self.__monetary

    def rfm(self):
        return self.__rfm
