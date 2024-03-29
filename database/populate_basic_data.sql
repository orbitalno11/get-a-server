-- grade data
insert into grade (title, grade) values
('ปฐมวัย', 0),
('ประถมศึกษาปีที่ 1', 1),
('ประถมศึกษาปีที่ 2', 2),
('ประถมศึกษาปีที่ 3', 3),
('ประถมศึกษาปีที่ 4', 4),
('ประถมศึกษาปีที่ 5', 5),
('ประถมศึกษาปีที่ 6', 6),
('มัธยมศึกษาปีที่ 1', 7),
('มัธยมศึกษาปีที่ 2', 8),
('มัธยมศึกษาปีที่ 3', 9),
('มัธยมศึกษาปีที่ 4', 10),
('มัธยมศึกษาปีที่ 5', 11),
('มัธยมศึกษาปีที่ 6', 12),
('ปริญญาตรี', 13),
('ปริญญาโท', 14),
('ปริญญาเอก', 15);
insert into subject (title, code) values ('คณิตศาสตร์', 'MTH'), ('ภาษาไทย', 'THA'), ('วิทยาศาสตร์', 'SCI'), ('ฟิสิกส์', 'PHY'), ('เคมี', 'CHM'), ('ชีววิทยา', 'BIO'), ('สังคมศึกษา', 'SOC'), ('ภาษาอังกฤษ', 'ENG');
insert into role (id, title) values (0, 'admin'), (1, 'learner'), (2, 'tutor'), (3, 'tutor-learner'), (4, 'visitor');

-- exam type
insert into exam_type (id, title) values (1, 'O-NET'), (2, 'GAT'), (3, 'PAT'), (4, 'PISA'), (5, 'A-NET'),  (6, 'Admission'), (7, 'สอวน.');

-- exchange rate
insert into exchange_rate(title, baht, coin, type, startDate, endDate) values ('standard', 10, 5, 'std', '1998-01-01', '2021-12-31');

-- bank
insert into bank(id, title) values ('SCB', 'ไทยพาณิชย์'), ('KTB', 'กรุงไทย'), ('KBANK', 'กสิกรไทย'), ('BBL', 'กรุงเทพ');

-- course
insert into course_type (id, title) values (1, 'เดี่ยว'), (2, 'กลุ่ม');

-- institute
-- insert into institute()
INSERT INTO institute (id, title) VALUES
(1, 'จุฬาลงกรณ์มหาวิทยาลัย'),
(2, 'มหาวิทยาลัยเกษตรศาสตร์'),
(3, 'มหาวิทยาลัยขอนแก่น'),
(4, 'มหาวิทยาลัยเชียงใหม่'),
(5, 'มหาวิทยาลัยทักษิณ'),
(6, 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี'),
(7, 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ'),
(8, 'มหาวิทยาลัยเทคโนโลยีสุรนารี'),
(9, 'มหาวิทยาลัยธรรมศาสตร์'),
(10, 'มหาวิทยาลัยบูรพา'),
(11, 'มหาวิทยาลัยพะเยา'),
(12, 'มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย'),
(13, 'มหาวิทยาลัยมหามกุฏราชวิทยาลัย'),
(14, 'มหาวิทยาลัยมหิดล'),
(15, 'มหาวิทยาลัยแม่ฟ้าหลวง'),
(16, 'มหาวิทยาลัยวลัยลักษณ์'),
(17, 'มหาวิทยาลัยศรีนครินทรวิโรฒ'),
(18, 'มหาวิทยาลัยศิลปากร'),
(19, 'มหาวิทยาลัยสวนดุสิต'),
(20, 'มหาวิทยาลัยสงขลานครินทร์'),
(21, 'สถาบันดนตรีกัลยาณิวัฒนา'),
(22, 'สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง'),
(23, 'มหาวิทยาลัยแม่โจ้'),
(24, 'สถาบันเทคโนโลยีจิตรลดา'),
(25, 'สถาบันการพยาบาลศรีวสรินทรา สภากาชาดไทย'),
(26, 'สถาบันบัณฑิตพัฒนบริหารศาสตร์'),
(27, 'มหาวิทยาลัยกาฬสินธุ์'),
(28, 'มหาวิทยาลัยนครพนม'),
(29, 'มหาวิทยาลัยนราธิวาสราชนครินทร์'),
(30, 'มหาวิทยาลัยนเรศวร'),
(31, 'มหาวิทยาลัยมหาสารคาม'),
(32, 'มหาวิทยาลัยรามคำแหง'),
(33, 'มหาวิทยาลัยสุโขทัยธรรมมาธิราช'),
(34, 'มหาวิทยาลัยอุบลราชธานี'),
(35, 'สถาบันเทคโนโลยีปทุมวัน'),
(36, 'สถาบันวิทยาลัยชุมชน'),
(37, 'มหาวิทยาลัยราชภัฏกาญจนบุรี'),
(38, 'มหาวิทยาลัยราชภัฏกำแพงเพชร'),
(39, 'มหาวิทยาลัยราชภัฏจันทรเกษม'),
(40, 'มหาวิทยาลัยราชภัฏชัยภูมิ'),
(41, 'มหาวิทยาลัยราชภัฏเชียงราย'),
(42, 'มหาวิทยาลัยราชภัฏเชียงใหม่'),
(43, 'มหาวิทยาลัยราชภัฏเทพสตรี'),
(44, 'มหาวิทยาลัยราชภัฏธนบุรี'),
(45, 'มหาวิทยาลัยราชภัฏนครปฐม'),
(46, 'มหาวิทยาลัยราชภัฏนครราชสีมา'),
(47, 'มหาวิทยาลัยราชภัฏนครศรีธรรมราช'),
(48, 'มหาวิทยาลัยราชภัฏนครสวรรค์'),
(49, 'มหาวิทยาลัยราชภัฏบ้านสมเด็จเจ้าพระยา'),
(50, 'มหาวิทยาลัยราชภัฏบุรีรัมย์'),
(51, 'มหาวิทยาลัยราชภัฏพระนคร'),
(52, 'มหาวิทยาลัยราชภัฏพระนครศรีอยุธยา'),
(53, 'มหาวิทยาลัยราชภัฏพิบูลสงคราม'),
(54, 'มหาวิทยาลัยราชภัฏเพชรบุรี '),
(55, 'มหาวิทยาลัยราชภัฏเพชรบูรณ์'),
(56, 'มหาวิทยาลัยราชภัฏภูเก็ต'),
(57, 'มหาวิทยาลัยราชภัฏมหาสารคาม'),
(58, 'มหาวิทยาลัยราชภัฏยะลา'),
(59, 'มหาวิทยาลัยราชภัฏร้อยเอ็ด'),
(60, 'มหาวิทยาลัยราชภัฏราชนครินทร์'),
(61, 'มหาวิทยาลัยราชภัฏรำไพพรรณี'),
(62, 'มหาวิทยาลัยราชภัฏลำปาง'),
(63, 'มหาวิทยาลัยราชภัฏเลย'),
(64, 'มหาวิทยาลัยราชภัฏวไลยอลงกรณ์ ในพระบรมราชูปถัมภ์ '),
(65, 'มหาวิทยาลัยราชภัฏศรีสะเกษ'),
(66, 'มหาวิทยาลัยราชภัฏสกลนคร'),
(67, 'มหาวิทยาลัยราชภัฏสงขลา'),
(68, 'มหาวิทยาลัยราชภัฏสวนสุนันทา'),
(69, 'มหาวิทยาลัยราชภัฏสุราษฎ์ธานี'),
(70, 'มหาวิทยาลัยราชภัฏสุรินทร์'),
(71, 'มหาวิทยาลัยราชภัฏหมู่บ้านจอมบึง'),
(72, 'มหาวิทยาลัยราชภัฏอุดรธานี'),
(73, 'มหาวิทยาลัยราชภัฏอุตรดิตถ์'),
(74, 'มหาวิทยาลัยราชภัฏอุบลราชธานี'),
(75, 'มหาวิทยาลัยเทคโนโลยีราชมงคลกรุงเทพ'),
(76, 'มหาวิทยาลัยเทคโนโลยีราชมงคลตะวันออก'),
(77, 'มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี'),
(78, 'มหาวิทยาลัยเทคโนโลยีราชมงคลพระนคร'),
(79, 'มหาวิทยาลัยเทคโนโลยีราชมงคลรัตนโกสินทร์'),
(80, 'มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา'),
(81, 'มหาวิทยาลัยเทคโนโลยีราชมงคลศรีวิชัย'),
(82, 'มหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ'),
(83, 'มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน'),
(84, 'มหาวิทยาลัยกรุงเทพ'),
(85, 'มหาวิทยาลัยกรุงเทพธนบุรี'),
(86, 'มหาวิทยาลัยกรุงเทพสุวรรณภูมิ'),
(87, 'มหาวิทยาลัยการจัดการและเทคโนโลยีอีสเทิร์น'),
(88, 'มหาวิทยาลัยเกริก'),
(89, 'มหาวิทยาลัยเกษมบัณฑิต'),
(90, 'มหาวิทยาลัยคริสเตียน'),
(91, 'มหาวิทยาลัยเจ้าพระยา'),
(92, 'มหาวิทยาลัยเฉลิมกาญจนา'),
(93, 'มหาวิทยาลัยชินวัตร'),
(94, 'มหาวิทยาลัยเซนต์จอห์น'),
(95, 'มหาวิทยาลัยตาปี'),
(96, 'มหาวิทยาลัยเทคโนโลยีมหานคร'),
(97, 'มหาวิทยาลัยธนบุรี'),
(98, 'มหาวิทยาลัยธุรกิจบัณฑิตย์'),
(99, 'มหาวิทยาลัยนอร์ทกรุงเทพ'),
(100, 'มหาวิทยาลัยนอร์ท-เชียงใหม่'),
(101, 'มหาวิทยาลัยนานาชาติแสตมฟอร์ด'),
(102, 'มหาวิทยาลัยนานาชาติเอเชีย-แปซิฟิก'),
(103, 'มหาวิทยาลัยเนชั่น'),
(104, 'มหาวิทยาลัยปทุมธานี'),
(105, 'มหาวิทยาลัยพายัพ'),
(106, 'มหาวิทยาลัยพิษณุโลก'),
(107, 'มหาวิทยาลัยฟาฏอนี'),
(108, 'มหาวิทยาลัยฟาร์อีสเทอร์น'),
(109, 'มหาวิทยาลัยภาคกลาง'),
(110, 'มหาวิทยาลัยภาคตะวันออกเฉียงเหนือ'),
(111, 'มหาวิทยาลัยรังสิต'),
(112, 'มหาวิทยาลัยรัตนบัณฑิต'),
(113, 'มหาวิทยาลัยราชธานี'),
(114, 'มหาวิทยาลัยราชพฤกษ์'),
(115, 'มหาวิทยาลัยวงษ์ชวลิตกุล'),
(116, 'มหาวิทยาลัยเว็บสเตอร์(ประเทศไทย)'),
(117, 'มหาวิทยาลัยเวสเทิร์น '),
(118, 'มหาวิทยาลัยศรีปทุม'),
(119, 'มหาวิทยาลัยสยาม'),
(120, 'มหาวิทยาลัยหอการค้าไทย'),
(121, 'มหาวิทยาลัยหัวเฉียวเฉลิมพระเกียรติ'),
(122, 'มหาวิทยาลัยหาดใหญ่'),
(123, 'มหาวิทยาลัยอัสสัมชัญ'),
(124, 'มหาวิทยาลัยอีสเทิร์นเอเชีย'),
(125, 'มหาวิทยาลัยเอเชียอาคเนย์'),
(126, 'สถาบันกันตนา'),
(127, 'สถาบันการจัดการปัญญาภิวัฒน์'),
(128, 'สถาบันการเรียนรู้เพื่อปวงชน'),
(129, 'สถาบันเทคโนโลยีไทย-ญี่ปุ่น'),
(130, 'สถาบันเทคโนโลยียานยนต์มหาชัย'),
(131, 'สถาบันเทคโนโลยีแห่งสุวรรณภูมิ'),
(132, 'สถาบันวิทยาการประกอบการแห่งอโยธยา'),
(133, 'สถาบันรัชต์ภาคย์'),
(134, 'สถาบันวิทยสิริเมธี'),
(135, 'สถาบันวิทยาการจัดการแห่งแปซิฟิค'),
(136, 'สถาบันอาศรมศิลป์'),
(137, 'วิทยาลัยเฉลิมกาญจนาระยอง'),
(138, 'วิทยาลัยเชียงราย'),
(139, 'วิทยาลัยเซนต์หลุยส์'),
(140, 'วิทยาลัยเซาธ์อีสท์บางกอก'),
(141, 'วิทยาลัยดุสิตธานี'),
(142, 'วิทยาลัยทองสุข'),
(143, 'วิทยาลัยเทคโนโลยีพนมวันท์'),
(144, 'วิทยาลัยเทคโนโลยีภาคใต้'),
(145, 'วิทยาลัยเทคโนโลยีสยาม'),
(146, 'วิทยาลัยนครราชสีมา'),
(147, 'วิทยาลัยนานาชาติราฟเฟิลส์'),
(148, 'วิทยาลัยนานาชาติเซนต์เทเรซา'),
(149, 'วิทยาลัยบัณฑิตเอเซีย'),
(150, 'วิทยาลัยพิชญบัณฑิต'),
(151, 'วิทยาลัยพุทธศาสนานานาชาติ'),
(152, 'วิทยาลัยนอร์ทเทิร์น'),
(153, 'วิทยาลัยสันตพล'),
(154, 'วิทยาลัยแสงธรรม'),
(155, 'วิทยาลัยอินเตอร์เทคลำปาง');

-- insert into branch()
insert into branch (id, title) VALUES (1, 'คณิตศาสตร์'), (2, 'วิทยาศาสตร์'), (3, 'ภาษาไทย'), (4, 'ภาษาอังกฤษ');