import sys
from database_manager import DatabaseManager
from wilson_lower_bound import wilson_lower_bound

try:
    db_host = sys.argv[1]
    db_name = sys.argv[2]
    db_user_name = sys.argv[3]
    db_password = sys.argv[4]
    db_port = sys.argv[5]

    database_manager = DatabaseManager(db_host, db_name, db_user_name, db_password, int(db_port))

    online_course = database_manager.get_online_course_vote()

    online_course["ci"] = online_course.apply(lambda item: wilson_lower_bound(item["positive"], item["positive"] + item["negative"]), axis=1)

    database_manager.update_online_course_rank(online_course)
    database_manager.close()

    sys.stdout.write("success")
    sys.stdout.flush()
    sys.exit(0)
except Exception as e:
    print(e)
    sys.stdout.write("failure")
    sys.stdout.flush()
    sys.exit(0)
