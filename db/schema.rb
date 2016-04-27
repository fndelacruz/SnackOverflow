# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160427163421) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "answers", force: :cascade do |t|
    t.integer  "user_id",     null: false
    t.integer  "question_id", null: false
    t.text     "content",     null: false
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "answers", ["question_id"], name: "index_answers_on_question_id", using: :btree
  add_index "answers", ["user_id"], name: "index_answers_on_user_id", using: :btree

  create_table "badges", force: :cascade do |t|
    t.string   "name",        null: false
    t.string   "rank",        null: false
    t.text     "description", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "category",    null: false
    t.string   "subcategory", null: false
  end

  add_index "badges", ["name", "rank"], name: "index_badges_on_name_and_rank", unique: true, using: :btree

  create_table "badgings", force: :cascade do |t|
    t.integer  "user_id",        null: false
    t.integer  "badge_id",       null: false
    t.string   "badgeable_type"
    t.integer  "badgeable_id"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  add_index "badgings", ["badge_id"], name: "index_badgings_on_badge_id", using: :btree
  add_index "badgings", ["badgeable_id"], name: "index_badgings_on_badgeable_id", using: :btree
  add_index "badgings", ["badgeable_type"], name: "index_badgings_on_badgeable_type", using: :btree
  add_index "badgings", ["user_id"], name: "index_badgings_on_user_id", using: :btree

  create_table "comments", force: :cascade do |t|
    t.integer  "user_id",          null: false
    t.integer  "commentable_id",   null: false
    t.string   "commentable_type", null: false
    t.text     "content",          null: false
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  add_index "comments", ["commentable_id"], name: "index_comments_on_commentable_id", using: :btree
  add_index "comments", ["commentable_type"], name: "index_comments_on_commentable_type", using: :btree
  add_index "comments", ["user_id"], name: "index_comments_on_user_id", using: :btree

  create_table "favorites", force: :cascade do |t|
    t.integer  "user_id",     null: false
    t.integer  "question_id", null: false
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "favorites", ["question_id"], name: "index_favorites_on_question_id", using: :btree
  add_index "favorites", ["user_id", "question_id"], name: "index_favorites_on_user_id_and_question_id", unique: true, using: :btree

  create_table "questions", force: :cascade do |t|
    t.integer  "user_id",    null: false
    t.string   "title",      null: false
    t.text     "content",    null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "questions", ["user_id"], name: "index_questions_on_user_id", using: :btree

  create_table "taggings", force: :cascade do |t|
    t.integer  "question_id", null: false
    t.integer  "tag_id",      null: false
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "taggings", ["question_id"], name: "index_taggings_on_question_id", using: :btree
  add_index "taggings", ["tag_id", "question_id"], name: "index_taggings_on_tag_id_and_question_id", unique: true, using: :btree

  create_table "tags", force: :cascade do |t|
    t.string   "name",        null: false
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.text     "description", null: false
  end

  add_index "tags", ["name"], name: "index_tags_on_name", unique: true, using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",           null: false
    t.string   "display_name",    null: false
    t.string   "password_digest", null: false
    t.string   "session_token",   null: false
    t.text     "bio"
    t.string   "location"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["session_token"], name: "index_users_on_session_token", unique: true, using: :btree

  create_table "views", force: :cascade do |t|
    t.integer  "user_id",       null: false
    t.string   "viewable_type", null: false
    t.integer  "viewable_id",   null: false
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  add_index "views", ["user_id", "viewable_type", "viewable_id"], name: "index_views_on_user_id_and_viewable_type_and_viewable_id", using: :btree
  add_index "views", ["viewable_id"], name: "index_views_on_viewable_id", using: :btree
  add_index "views", ["viewable_type"], name: "index_views_on_viewable_type", using: :btree

  create_table "votes", force: :cascade do |t|
    t.integer  "user_id",      null: false
    t.string   "votable_type", null: false
    t.integer  "votable_id",   null: false
    t.integer  "value",        null: false
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  add_index "votes", ["user_id", "votable_type", "votable_id"], name: "index_votes_on_user_id_and_votable_type_and_votable_id", unique: true, using: :btree
  add_index "votes", ["votable_id"], name: "index_votes_on_votable_id", using: :btree
  add_index "votes", ["votable_type"], name: "index_votes_on_votable_type", using: :btree

end
