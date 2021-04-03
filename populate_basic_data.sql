-- grade data
insert into grade (title, grade) values ('มัธยมศึกษาปีที่ 4', 10), ('มัธยมศึกษาปีที่ 5', 11), ('มัธยมศึกษาปีที่ 6', 12);
insert into subject (title, code) values ('คณิตศาสตร์', 'MTH'), ('ภาษาไทย', 'THA'), ('วิทยาศาสตร์', 'SCI'), ('ฟิสิกส์', 'PHY'), ('เคมี', 'CHM'), ('ชีววิทยา', 'BIO'), ('สังคมศึกษา', 'SOC'), ('ภาษาอังกฤษ', 'ENG');
insert into role (id, title) values (0, 'admin'), (1, 'learner'), (2, 'tutor'), (3, 'tutor-learner'), (4, 'visitor');

-- exam type
insert into exam_type (title) values ('O-NET');

-- institute
-- insert into institute()
-- insert into branch()

-- exchange rate
insert into exchange_rate(title, baht, coin, type, startDate) values ('standard', 10, 5, 'std', '1998-01-01');

-- course
insert into course_type (id, title) values (1, 'เดี่ยว'), (2, 'กลุ่ม');