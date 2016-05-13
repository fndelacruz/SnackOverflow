class Scraper
  attr_reader :question_titles, :question_content_elements,
    :answer_content_elements, :comment_content_elements, :tag_names,
    :tag_description_elements, :user_bio_elements

  def initialize(
      last_question_page_idx=275,
      base_url="http://cooking.stackexchange.com/"
    )
    @last_question_page_idx = last_question_page_idx
    @base_url = base_url
    @question_titles = []
    @question_ids = []
    @question_content_elements = []
    @answer_content_elements = []
    @comment_content_elements = []
    @tag_names = []
    @tag_description_elements = []
    @user_ids = []
    @user_bio_elements = []
  end

  def scrape
    scrape_question_index
    scrape_question_shows
    scrape_tags_index
    scrape_users_index
    scrape_user_shows
  end

  private

  def scrape_question_index
    @last_question_page_idx.downto(1).each do |i|
      puts "parsing questions index page##{i}"
      url = "#{@base_url}/questions?page=#{i}&sort=newest"
      parse_page = Nokogiri::HTML(HTTParty.get(url))

      # get question titles
      parse_page.css(".question-hyperlink").each do |title_element|
        # gsub removes title meta content like '[duplicate]', etc.
        @question_titles << title_element.text.gsub(/ \[.+\]$/, '')
      end

      # get question ids
      parse_page.css(".question-summary").each do |id_element|
        @question_ids << id_element.attributes['id'].value.match(/(\d+)$/)
          .captures[0]
      end
    end
  end

  def scrape_question_shows
    question_ids = @question_ids.sample(1000)

    puts "Starting scraping of #{question_ids.length} questions."
    question_ids.each_with_index do |id, idx|
      puts "Scraping question #{idx} of #{question_ids.length}. question##{id}"
      url = "#{@base_url}/questions/#{id}"
      parsed_question_show_page = Nokogiri::HTML(HTTParty.get(url))

      scrapable_question_elements = parsed_question_show_page
        .css('#question .post-text')[0].children
        .reject { |el| el.is_a?(Nokogiri::XML::Text) }
      scrape_elements(scrapable_question_elements, :question)

      parsed_question_show_page.css('.answercell .post-text').each do |answer_el|
        scrapable_answer_elements = answer_el.children
          .reject { |el| el.is_a?(Nokogiri::XML::Text) }
        scrape_elements(scrapable_answer_elements, :answer)
      end

      comments = parsed_question_show_page.css('.comment-copy').map(&:text)
      @comment_content_elements.concat(comments)
    end
  end

  def scrape_elements(elements, category)
    case category
    when :question
      collection = @question_content_elements
    when :answer
      collection = @answer_content_elements
    when :user
      collection = @user_bio_elements
    end

    puts "parsing #{category}"
    elements.each do |el|
      puts "parsing #{el.name} element"
      case el.name
      when "p", "blockquote", "h1", "h2", "h3", "h4", "h5", "h6"
        next if el.text.match(/Apparently, this user prefers to keep an air of mystery about them./)
        collection << el.text.strip
      when "div"
        debugger unless el.text.match(/This question already has an answer here/)
        next
      when "ul", "ol", "pre"
        el.text.split("\n").reject(&:empty?)
          .each { |el| collection << el.strip}
      when "hr", "br", "a", "b", "i", "code", "sup", "img"
        next
      else
        debugger
      end
    end
  end

  def scrape_tags_index
    puts "parsing tags index"
    23.downto(1).each do |i|
      puts "parsing tags index page##{i}"
      url = "#{@base_url}/tags?page=#{i}&tab=popular"
      parse_page = Nokogiri::HTML(HTTParty.get(url))

      # get tag_names
      @tag_names.concat(parse_page.css(".post-tag").map(&:text))

      # get tag_descriptions
      @tag_description_elements.concat(parse_page.css(".excerpt").map(&:text))
    end
  end

  def scrape_users_index
    puts "parsing users index"
    200.downto(1).each do |i|
      puts "parsing users index page##{i}"
      url = "#{@base_url}/users?page=#{i}&tab=reputation&filter=month"
      parse_page = Nokogiri::HTML(HTTParty.get(url))

      # get user_ids
      el = parse_page.css(".user-details a").map do |el|
        @user_ids << el.attributes["href"].value.match(/\A\/users\/(\d+)/)[1]
      end
    end
  end

  def scrape_user_shows
    user_ids = @user_ids.sample(1000)

    puts "Starting scraping of #{user_ids.length} users."
    user_ids.each_with_index do |id, idx|
      puts "Scraping user #{idx} of #{user_ids.length}. user##{id}"
      url = "#{@base_url}/users/#{id}"
      parsed_user_show_page = Nokogiri::HTML(HTTParty.get(url))

      user_bio_element = parsed_user_show_page.css('.bio')[0]

      debugger if !user_bio_element
      if user_bio_element
        scrapable_user_elements = user_bio_element.children
          .reject { |el| el.is_a?(Nokogiri::XML::Text) }
        scrape_elements(scrapable_user_elements, :user)
      end
    end
  end
end
