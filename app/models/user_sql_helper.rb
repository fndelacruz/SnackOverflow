module UserSQLHelper
  def question_and_answer_tag_names
    <<-SQL
      (
        (
          SELECT  -- question tags enumeration
            users.id AS user_id,
            tags.name AS tag_name
          FROM
            users
          JOIN
            questions ON users.id = questions.user_id
          JOIN
            taggings ON questions.id = taggings.question_id
          JOIN
            tags ON taggings.tag_id = tags.id
          WHERE
            questions.user_id = :user_id
          GROUP BY
            users.id, tags.name
          ORDER BY
            users.id, tags.name
        )
          UNION
        (
          SELECT  -- answer tags enumeration
            users.id AS user_id,
            tags.name AS tag_name
          FROM
            users
          JOIN
            answers ON users.id = answers.user_id
          JOIN
            questions ON answers.question_id = questions.id
          JOIN
            taggings ON questions.id = taggings.question_id
          JOIN
            tags ON taggings.tag_id = tags.id
          WHERE
            answers.user_id = :user_id
          GROUP BY
            users.id, tags.name
          ORDER BY
            users.id, tags.name
        )
      ) AS tag_names ON users.id = tag_names.user_id
    SQL
  end

  def question_tags_count
    <<-SQL
      (
        SELECT -- question tags count
          users.id AS user_id,
          tags_q.name AS tag_name,
          COUNT(tags_q) AS q_tag_count
        FROM
          users
        LEFT JOIN
          questions ON users.id = questions.user_id
        LEFT JOIN
          taggings AS taggings_q ON questions.id = taggings_q.question_id
        JOIN
          tags AS tags_q ON taggings_q.tag_id = tags_q.id
        WHERE
          users.id = :user_id
        GROUP BY
          users.id, tags_q.name
        ORDER BY
          users.id, COUNT(tags_q) DESC, tags_q.name
      ) AS sq_q_tag_count ON
        users.id = sq_q_tag_count.user_id AND
        tag_names.tag_name = sq_q_tag_count.tag_name
    SQL
  end

  def question_tags_reputation
    <<-SQL
      (
        SELECT -- question tags reputation
          users.id AS user_id,
          tags_q.name AS tag_name,
          SUM(
            CASE votes.value
              WHEN 1 THEN 10
              WHEN -1 THEN -4
            END
          ) AS q_tag_reputation
        FROM
          users
        LEFT JOIN
          questions ON users.id = questions.user_id
        LEFT JOIN
          taggings AS taggings_q ON questions.id = taggings_q.question_id
        JOIN
          tags AS tags_q ON taggings_q.tag_id = tags_q.id
        LEFT JOIN
          votes ON questions.id = votes.votable_id AND votes.votable_type = 'Question'
        WHERE
          users.id = :user_id
        GROUP BY
          users.id, tags_q.name
        ORDER BY
          users.id, q_tag_reputation DESC, tags_q.name
      ) AS sq_q_tag_reputation ON
        users.id = sq_q_tag_reputation.user_id AND
        tag_names.tag_name = sq_q_tag_reputation.tag_name
    SQL
  end

  def answer_tags_count
    <<-SQL
      (
        SELECT -- answer tags count
          users.id AS user_id,
          tags_a.name AS tag_name,
          COUNT(tags_a) AS a_tag_count
        FROM
          users
        LEFT JOIN
          answers ON users.id = answers.user_id
        LEFT JOIN
          questions AS q2 on answers.question_id = q2.id
        LEFT JOIN
          taggings AS taggings_a ON q2.id = taggings_a.question_id
        JOIN
          tags AS tags_a ON taggings_a.tag_id = tags_a.id
        WHERE
          answers.user_id = :user_id
        GROUP BY
          users.id, tags_a.name
        ORDER BY
          users.id, tags_a.name
      ) AS sq_a_tag_count ON
        users.id = sq_a_tag_count.user_id AND
        tag_names.tag_name = sq_a_tag_count.tag_name
    SQL
  end

  def answer_tags_reputation
    <<-SQL
      (
        SELECT -- answer tags reputation
          users.id AS user_id,
          tags_a.name AS tag_name,
          SUM (
            CASE votes.value
              WHEN 1 THEN 20
              WHEN -1 THEN -4
            END
          ) AS a_tag_reputation
        FROM
          users
        LEFT JOIN
          answers ON users.id = answers.user_id
        LEFT JOIN
          questions AS q2 on answers.question_id = q2.id
        LEFT JOIN
          taggings AS taggings_a ON q2.id = taggings_a.question_id
        JOIN
          tags AS tags_a ON taggings_a.tag_id = tags_a.id
        LEFT JOIN
          votes ON answers.id = votes.votable_id AND votes.votable_type = 'Answer'
        WHERE
          answers.user_id = :user_id
        GROUP BY
          users.id, tags_a.name
        ORDER BY
          users.id, a_tag_reputation DESC, tags_a.name
      ) AS sq_a_tag_reputation ON
        users.id = sq_a_tag_reputation.user_id AND
        tag_names.tag_name = sq_a_tag_reputation.tag_name
    SQL
  end
end
