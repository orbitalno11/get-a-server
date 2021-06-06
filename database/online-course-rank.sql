-- SELECT 
--     clip_id,
--     (((number_of_five_star + number_of_four_star + number_of_three_star) + 1.9208) / ((number_of_five_star + number_of_four_star + number_of_three_star) + (number_of_two_star + number_of_one_star)) - 1.96 * SQRT(((number_of_five_star + number_of_four_star + number_of_three_star) * (number_of_two_star + number_of_one_star)) / ((number_of_five_star + number_of_four_star + number_of_three_star) + (number_of_two_star + number_of_one_star)) + 0.9604) / ((number_of_five_star + number_of_four_star + number_of_three_star) + (number_of_two_star + number_of_one_star))) / (1 + 3.8416 / ((number_of_five_star + number_of_four_star + number_of_three_star) + (number_of_two_star + number_of_one_star))) AS ci_lower_bound
-- FROM
--     clip_statistic
-- WHERE
--     (number_of_five_star + number_of_four_star + number_of_three_star) + (number_of_two_star + number_of_one_star) > 0
-- ORDER BY ci_lower_bound DESC;

UPDATE 
	clip_statistic 
SET 
	clip_rank = (((number_of_five_star + number_of_four_star + number_of_three_star) + 1.9208) / ((number_of_five_star + number_of_four_star + number_of_three_star) + (number_of_two_star + number_of_one_star)) - 1.96 * SQRT(((number_of_five_star + number_of_four_star + number_of_three_star) * (number_of_two_star + number_of_one_star)) / ((number_of_five_star + number_of_four_star + number_of_three_star) + (number_of_two_star + number_of_one_star)) + 0.9604) / ((number_of_five_star + number_of_four_star + number_of_three_star) + (number_of_two_star + number_of_one_star))) / (1 + 3.8416 / ((number_of_five_star + number_of_four_star + number_of_three_star) + (number_of_two_star + number_of_one_star)))
WHERE
	(number_of_five_star + number_of_four_star + number_of_three_star) + (number_of_two_star + number_of_one_star) > 0;

-- SELECT 
--     onlineCourseId, positive, negative
-- FROM
--     (SELECT 
--         onlineCourseId,
--             (SUM(number_of_one_star) + SUM(number_of_two_star)) AS negative,
--             (SUM(number_of_five_star) + SUM(number_of_four_star) + SUM(number_of_three_star)) AS positive
--     FROM
--         clip
--     INNER JOIN clip_statistic statistic ON clip.id LIKE statistic.clip_id
--     INNER JOIN online_course ON online_course.id LIKE clip.onlineCourseId
--     GROUP BY clip.onlineCourseId) AS CALCULATE;

-- SELECT 
--     onlineCourseId,
--     (SUM(number_of_one_star) + SUM(number_of_two_star)) as negative,
--     (SUM(number_of_five_star) + SUM(number_of_four_star) + SUM(number_of_three_star)) as positive
-- FROM
--     clip
--         INNER JOIN
--     clip_statistic statistic ON clip.id LIKE statistic.clip_id
--         INNER JOIN
--     online_course ON online_course.id LIKE clip.onlineCourseId
-- GROUP BY clip.onlineCourseId;


UPDATE online_course_statistic 
SET 
    course_rank = (SELECT 
            ((positive + 1.9208) / (positive + negative) - 1.96 * SQRT((positive * negative) / (positive + negative) + 0.9604) / (positive + negative)) / (1 + 3.8416 / (positive + negative))
        FROM
            (SELECT 
                onlineCourseId,
                    (SUM(number_of_one_star) + SUM(number_of_two_star)) AS negative,
                    (SUM(number_of_five_star) + SUM(number_of_four_star) + SUM(number_of_three_star)) AS positive
            FROM
                clip
            INNER JOIN clip_statistic statistic ON clip.id LIKE statistic.clip_id
            INNER JOIN online_course ON online_course.id LIKE clip.onlineCourseId
            WHERE
                clip.onlineCourseId LIKE online_course_statistic.course_id
            GROUP BY clip.onlineCourseId) AS CALCULATE);
            
SELECT 
    *
FROM
    clip_statistic;

SELECT 
    *
FROM
    online_course_statistic;