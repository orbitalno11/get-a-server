import pymysql
import pandas as pd


class DatabaseManager:

    def __init__(self, host, database, user, password, port):
        self.__db_connection = pymysql.connect(host=host, user=user, password=password, database=database, port=port)
        self.__cursor = self.__db_connection.cursor()

    def get_tutor_recency(self):
        try:
            sql_command = "SELECT * FROM tutor_analytic_recency_data"
            self.__cursor.execute(sql_command)
            result = self.__cursor.fetchall()
            columns = ["tutor_id", "recent_login", "recent_profile_view", "recent_comment", "recent_approved"]
            return pd.DataFrame(result, columns=columns)
        except pymysql.Error as error:
            print("Error %d: %s" % (error.args[0], error.args[1]))
            return None

    def get_tutor_frequency(self):
        try:
            sql_command = "SELECT * FROM tutor_analytic_frequency_data"
            self.__cursor.execute(sql_command)
            result = self.__cursor.fetchall()
            columns = ["tutor_id", "number_of_login", "number_of_course_view", "number_of_profile_view"]
            dataframe = pd.DataFrame(result, columns=columns)
            dataframe["number_of_login"] = pd.to_numeric(dataframe["number_of_login"])
            dataframe["number_of_course_view"] = pd.to_numeric(dataframe["number_of_course_view"])
            dataframe["number_of_profile_view"] = pd.to_numeric(dataframe["number_of_profile_view"])
            return dataframe
        except pymysql.Error as error:
            print("Error %d: %s" % (error.args[0], error.args[1]))
            return None

    def get_tutor_monetary(self):
        try:
            sql_command = "SELECT * FROM tutor_analytic_monetary_data"
            self.__cursor.execute(sql_command)
            result = self.__cursor.fetchall()
            columns = ["tutor_id", "tutor_rating", "tutor_offline_rating", "tutor_online_rating", "number_of_favorite",
                       "number_of_learner", "number_of_offline_review", "number_of_online_review"]
            dataframe = pd.DataFrame(result, columns=columns)
            dataframe["tutor_rating"] = pd.to_numeric(dataframe["tutor_rating"])
            dataframe["number_of_course_view"] = pd.to_numeric(dataframe["tutor_offline_rating"])
            dataframe["number_of_profile_view"] = pd.to_numeric(dataframe["tutor_online_rating"])
            dataframe["number_of_course_view"] = pd.to_numeric(dataframe["number_of_favorite"])
            dataframe["number_of_profile_view"] = pd.to_numeric(dataframe["number_of_learner"])
            dataframe["number_of_course_view"] = pd.to_numeric(dataframe["number_of_offline_review"])
            dataframe["number_of_profile_view"] = pd.to_numeric(dataframe["number_of_online_review"])
            return dataframe
        except pymysql.Error as error:
            print("Error %d: %s" % (error.args[0], error.args[1]))
            return None

    def update_tutor_rank(self, data):
        try:
            update_data = list(data.loc[:, ["rfm_value", "tutor_id"]].itertuples(index=False, name=None))
            sql_command = "UPDATE tutor_statistic SET offline_course_rank=%s WHERE tutor_id LIKE %s"
            self.__cursor.executemany(sql_command, update_data)
            self.__db_connection.commit()
        except pymysql.Error as error:
            print("Error %d: %s" % (error.args[0], error.args[1]))
            self.__db_connection.rollback()

    def get_online_course_vote(self):
        try:
            sql_command = "SELECT onlineCourseId, (SUM(number_of_one_star) + SUM(number_of_two_star)) AS negative, (SUM(number_of_five_star) + SUM(number_of_four_star) + SUM(number_of_three_star)) AS positive FROM clip INNER JOIN clip_statistic statistic ON clip.id LIKE statistic.clip_id INNER JOIN online_course ON online_course.id LIKE clip.onlineCourseId GROUP BY clip.onlineCourseId"
            self.__cursor.execute(sql_command)
            result = self.__cursor.fetchall()
            columns = ["course_id", "negative", "positive"]
            dataframe = pd.DataFrame(result, columns=columns)
            dataframe["negative"] = pd.to_numeric(dataframe["negative"])
            dataframe["positive"] = pd.to_numeric(dataframe["positive"])
            return dataframe
        except pymysql.Error as error:
            print("Error %d: %s" % (error.args[0], error.args[1]))
            return None

    def update_online_course_rank(self, data):
        try:
            update_data = list(data.loc[:, ["ci", "course_id"]].itertuples(index=False, name=None))
            sql_command = "UPDATE online_course_statistic SET course_rank=%s WHERE course_id LIKE %s"
            self.__cursor.executemany(sql_command, update_data)
            self.__db_connection.commit()
        except pymysql.Error as error:
            print("Error %d: %s" % (error.args[0], error.args[1]))
            self.__db_connection.rollback()

    def close(self):
        self.__cursor.close()
        self.__db_connection.close()
