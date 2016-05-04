module UserSQLHelper
  def question_and_answer_tag_names(user_id=nil)
    <<-SQL
      (
        (
          SELECT  -- question tags enumeration
            users.id AS user_id,
            tags.id AS tag_id,
            tags.name AS tag_name
          FROM
            users
          JOIN
            questions ON users.id = questions.user_id
          JOIN
            taggings ON questions.id = taggings.question_id
          JOIN
            tags ON taggings.tag_id = tags.id
          #{user_id ? "WHERE questions.user_id = :user_id" : ""}
          GROUP BY
            users.id, tags.name, tags.id
          ORDER BY
            users.id, tags.name, tags.id
        )
          UNION
        (
          SELECT  -- answer tags enumeration
            users.id AS user_id,
            tags.id AS tag_id,
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
          #{user_id ? "WHERE answers.user_id = :user_id" : ""}
          GROUP BY
            users.id, tags.name, tags.id
          ORDER BY
            users.id, tags.name, tags.id
        )
      ) AS tag_names ON users.id = tag_names.user_id
    SQL
  end

  def question_tags_count(user_id=nil)
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
        #{user_id ? "WHERE users.id = :user_id" : ""}
        GROUP BY
          users.id, tags_q.name
        ORDER BY
          users.id, COUNT(tags_q) DESC, tags_q.name
      ) AS sq_q_tag_count ON
        users.id = sq_q_tag_count.user_id AND
        tag_names.tag_name = sq_q_tag_count.tag_name
    SQL
  end

  def question_tags_reputation(user_id=nil)
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
        #{user_id ? "WHERE users.id = :user_id" : ""}
        GROUP BY
          users.id, tags_q.name
        ORDER BY
          users.id, q_tag_reputation DESC, tags_q.name
      ) AS sq_q_tag_reputation ON
        users.id = sq_q_tag_reputation.user_id AND
        tag_names.tag_name = sq_q_tag_reputation.tag_name
    SQL
  end

  def answer_tags_count(user_id=nil)
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
        #{user_id ? "WHERE answers.user_id = :user_id" : ""}
        GROUP BY
          users.id, tags_a.name
        ORDER BY
          users.id, tags_a.name
      ) AS sq_a_tag_count ON
        users.id = sq_a_tag_count.user_id AND
        tag_names.tag_name = sq_a_tag_count.tag_name
    SQL
  end

  def answer_tags_reputation(user_id=nil)
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
        #{user_id ? "WHERE answers.user_id = :user_id" : ""}
        GROUP BY
          users.id, tags_a.name
        ORDER BY
          users.id, a_tag_reputation DESC, tags_a.name
      ) AS sq_a_tag_reputation ON
        users.id = sq_a_tag_reputation.user_id AND
        tag_names.tag_name = sq_a_tag_reputation.tag_name
    SQL
  end

  def parse_user_tags(user_id, user_tags)
    user_tags[0].tags = []
    users = [user_tags[0]]

    user_tags.each do |user_with_tag|
      if users.last.id != user_with_tag.id
        user_with_tag.tags = []
        users << user_with_tag
      end
      next unless user_with_tag.tag_name

      users.last.tags << {
        name: user_with_tag.tag_name,
        id: user_with_tag.tag_id,
        question_count: user_with_tag.question_tag_count,
        question_reputation: user_with_tag.question_tag_reputation,
        answer_count: user_with_tag.answer_tag_count,
        answer_reputation: user_with_tag.answer_tag_reputation,
        post_count: user_with_tag.post_tag_count,
        post_reputation: user_with_tag.post_tag_reputation
      }
    end
    user_id ? users.first : users
  end


  def user_received_question_vote_reputations(user_id=nil)
    <<-SQL
      (
        SELECT
          users.id,
          users.display_name,
          SUM(
            CASE votes.value
            WHEN 1 THEN #{User::REPUTATION_SCHEME[:receive_question_upvote]}
            WHEN -1 THEN #{User::REPUTATION_SCHEME[:receive_question_downvote]}
            END
          ) AS reputation
        FROM
          users
        LEFT JOIN
          questions ON users.id = questions.user_id
        LEFT JOIN
          votes ON (
            questions.id = votes.votable_id AND
            votes.votable_type = 'Question'
          )
        #{user_id ? "WHERE #{where_user_id_helper(user_id)}" : ""}
        GROUP BY
          users.id
        ORDER BY
          users.id
      ) AS user_received_question_vote_reputations ON
        users.id = user_received_question_vote_reputations.id
    SQL
  end

  def user_received_answer_vote_reputations(user_id=nil)
    <<-SQL
      (
        SELECT
          users.id,
          SUM(
            CASE votes.value
            WHEN 1 THEN #{User::REPUTATION_SCHEME[:receive_answer_upvote]}
            WHEN -1 THEN #{User::REPUTATION_SCHEME[:receive_answer_downvote]}
            END
          ) AS reputation
        FROM
          users
        LEFT JOIN
          answers ON users.id = answers.user_id
        LEFT JOIN
          votes ON (answers.id = votes.votable_id AND votes.votable_type = 'Answer')
        #{user_id ? "WHERE #{where_user_id_helper(user_id)}" : ""}
        GROUP BY
          users.id
        ORDER BY
          users.id
      ) AS user_received_answer_vote_reputations ON
        users.id = user_received_answer_vote_reputations.id
    SQL
  end

  def user_received_comment_vote_reputations(user_id=nil)
    <<-SQL
      (
        SELECT
          users.id,
          SUM(
            CASE votes.value
            WHEN 1 THEN #{User::REPUTATION_SCHEME[:receive_comment_upvote]}
            WHEN -1 THEN #{User::REPUTATION_SCHEME[:receive_comment_downvote]}
            END
          ) AS reputation
        FROM
          users
        LEFT JOIN
          comments ON users.id = comments.user_id
        LEFT JOIN
          votes ON (comments.id = votes.votable_id AND votes.votable_type = 'Comment')
        #{user_id ? "WHERE #{where_user_id_helper(user_id)}" : ""}
        GROUP BY
          users.id
        ORDER BY
          users.id
      ) AS user_received_comment_vote_reputations ON
        users.id = user_received_comment_vote_reputations.id
    SQL
  end

  def user_given_answer_downvote_reputations(user_id=nil)
    <<-SQL
      (
        SELECT
          users.id,
          COUNT(votes.*) * #{User::REPUTATION_SCHEME[:give_answer_downvote]}
            AS reputation
        FROM
          users
        JOIN
          votes ON users.id = votes.user_id
        WHERE
          #{user_id ? "#{where_user_id_helper(user_id)} AND" : ""}
          votes.votable_type = 'Answer' AND votes.value = -1
        GROUP BY
          users.id
        ORDER BY
          users.id
      ) AS user_given_answer_downvote_reputations ON
        users.id = user_given_answer_downvote_reputations.id
    SQL
  end

  def user_vote_counts(user_id=nil)
    <<-SQL
      (
        SELECT
          users.id, COUNT(votes.*) AS count
        FROM
          users
        LEFT JOIN
          votes on users.id = votes.user_id
        #{user_id ? "WHERE #{where_user_id_helper(user_id)}" : ""}
        GROUP BY
          users.id
        ORDER BY
          users.id
      ) AS user_vote_counts ON users.id = user_vote_counts.id
    SQL
  end

  def where_user_id_helper(user_id)
    where = "users.id "
    if user_id.is_a?(Integer) || user_id.is_a?(String)
      where += "= :user_id"
    elsif user_id.is_a?(Array)
      where += "IN (#{user_id.join(',')})"
    end
    where
  end
end
