class Scraper
  attr_accessor :question_titles, :question_contents, :answer_contents,
      :comment_contents, :tag_names, :tag_descriptions, :user_bio_contents

  def initialize
    @api_url = "https://api.stackexchange.com/2.2/"
    @site_url = "http://cooking.stackexchange.com/"
    @default_params = {
      site: "seasonedadvice",
      order: 'desc',
      sort: 'activity',
      pagesize: 100,
      key: ENV['STACK_APPS_API_KEY']
    }
    @question_titles = []
    @question_contents = []
    @answer_contents = []
    @comment_contents = []
    @tag_names = []
    @tag_descriptions = []
    @user_bio_contents = []
  end

  def scrape
    fetch_questions
    fetch_answers
    fetch_comments
    fetch_users
    scrape_tags_index

    # NOTE: cull_content used to reduce scraped elements to reduce memory foot-
    # print for heroku deployment. Alternatively, could scrape less pages to
    # begin with, but I prefer to have more randomness in site content by
    # taking samples from a larger pool.
    cull_content
  end

  private

  def cull_content
    @question_titles = @question_titles.sample 1000
    @question_contents = @question_contents.sample 600
    @answer_contents = @answer_contents.sample 600
    @comment_contents = @comment_contents.sample 600
  end

  def fetch_questions(max_page=20)
    params = @default_params.merge(
      filter: '!1hKclsMnzebK' # includes: .items, question.body, question.title
    )
    (1..max_page).each do |i|
      puts "Questions: parsing page##{i}"
      params[:page] = i
      url = @api_url + 'questions?' + parameterize(params)
      json = HTTParty.get(url)
      json['items'].each do |item|
        @question_titles << parse_html_chars(item['title'])
        @question_contents << parse_body(item['body'])
      end
    end
  end

  def fetch_answers(max_page=20)
    params = @default_params.merge(
      filter: '!VYNqt6k_i' # includes: .items, answer.body
    )
    (1..max_page).each do |i|
      puts "Answers: parsing page##{i}"
      params[:page] = i
      url = @api_url + 'answers?' + parameterize(params)
      json = HTTParty.get(url)
      json['items'].each do |item|
        @answer_contents << parse_body(item['body'])
      end
    end
  end

  def fetch_comments(max_page=20)
    params = @default_params.merge(
      sort: 'creation',
      filter: '!VYNqt8)cB' # includes: .items, comment.body
    )
    (1..max_page).each do |i|
      puts "Comments: parsing page##{i}"
      params[:page] = i
      url = @api_url + 'comments?' + parameterize(params)
      json = HTTParty.get(url)
      json['items'].each do |item|
        @comment_contents << parse_body(item['body'])
      end
    end
  end

  def fetch_users(max_page=20)
    params = @default_params.merge(
      sort: 'reputation',
      filter: '!VYNqt(G2S' # includes: .items, user.about_me
    )
    (1..max_page).each do |i|
      puts "Users: parsing page##{i}"
      params[:page] = i
      url = @api_url + 'users?' + parameterize(params)
      json = HTTParty.get(url)
      json['items'].each do |item|
        if item['about_me']
          about_me = parse_body(item['about_me'])
          @user_bio_contents << about_me if about_me.length > 0
        end
      end
    end
  end

  def parameterize(params)
    params.to_a.map { |pair| "#{pair[0]}=#{pair[1]}" }.join('&')
  end

  def parse_body(body)
    parse_html_chars(strip_tags(body).gsub(/\s+/, ' ').strip)
  end

  def parse_html_chars(string)
    string.gsub(/&#39;/, "'").gsub(/&quot;/, "\"").gsub(/&amp;/, "&")
  end

  def scrape_tags_index
    puts "parsing tags index"
    23.downto(1).each do |i|
      puts "parsing tags index page##{i}"
      url = "#{@site_url}/tags?page=#{i}&tab=popular"
      parse_page = Nokogiri::HTML(HTTParty.get(url))

      # get tag_names
      @tag_names.concat(parse_page.css(".post-tag").map(&:text))

      # get tag_descriptions
      @tag_descriptions.concat(parse_page.css(".excerpt").map(&:text))
    end
  end
end
