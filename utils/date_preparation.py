import datetime


class DatePreparation:

    @staticmethod
    def string_to_date(date_string: str, date_format: str = '%d/%m/%Y') -> datetime:
        date_object = datetime.datetime.strptime(date_string, date_format)
        return date_object
