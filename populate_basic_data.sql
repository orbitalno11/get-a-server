-- grade data
insert into grade (grade_title, grade_value) values ('มัธยมศึกษาปีที่ 4', 10), ('มัธยมศึกษาปีที่ 5', 11), ('มัธยมศึกษาปีที่ 6', 12);
insert into subject (subject_name) values ('คณิตศาสตร์'), ('วิทยาศาสตร์'), ('ภาษาไทย');
insert into role (role_id, role_name) values (0, 'admin'), (1, 'learner'), (2, 'tutor'), (3, 'tutor_learner');

-- exam type
insert into exam_type (exam_name) values ('O-NET');

-- institute
-- insert into institute()
-- insert into branch()

-- exchange rate
insert into exchange_rate(exchange_name, exchange_baht, exchange_coin, exchange_type, start_date) values ('standard', 10, 5, 'std', '1998-01-01');

-- course
insert into course_type (course_type_id, course_type_name) values (1, 'เดี่ยว'), (2, 'กลุ่ม');