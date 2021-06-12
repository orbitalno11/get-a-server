import sys
from database_manager import DatabaseManager
from rfm import RFM

try:
    db_host = sys.argv[1]
    db_name = sys.argv[2]
    db_user_name = sys.argv[3]
    db_password = sys.argv[4]
    db_port = sys.argv[5]

    database_manager = DatabaseManager(db_host, db_name, db_user_name, db_password, int(db_port))

    recency = database_manager.get_tutor_recency()
    frequency = database_manager.get_tutor_frequency()
    monetary = database_manager.get_tutor_monetary()

    rfm = RFM(recency, frequency, monetary)
    rfm.calculate_rfm()

    rfm_df = rfm.rfm()

    database_manager.update_tutor_rank(rfm_df)
    database_manager.close()

    sys.stdout.write("success")
    sys.stdout.flush()
    sys.exit(0)
except Exception as e:
    print(e)
    sys.stdout.write("failure")
    sys.stdout.flush()
    sys.exit(0)
