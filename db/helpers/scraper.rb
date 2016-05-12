class Scraper
  attr_reader :question_titles, :question_content_elements

  def initialize(
      last_question_page_idx=275,
      base_url="http://cooking.stackexchange.com/"
    )
    @last_question_page_idx = last_question_page_idx
    @base_url = base_url
    @question_titles = []
    @question_ids = []
    @question_content_elements = []
  end

  def scrape
    scrape_question_index
    scrape_question_shows
  end

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
    question_ids = @question_ids.sample(750)

    puts "Starting scraping of #{question_ids.length} questions."
    question_ids.each_with_index do |id, idx|
      puts "Scraping question #{idx} of #{question_ids.length}. question##{id}"
      url = "#{@base_url}/questions/#{id}"
      parse_page = Nokogiri::HTML(HTTParty.get(url))
      scrapable_elements = parse_page.css('#question .post-text')[0].children
        .reject { |el| el.is_a?(Nokogiri::XML::Text) }

      scrapable_elements.each do |el|
        puts "parsing #{el.name} element"
        case el.name
        when "p", "blockquote", "h1", "h2", "h3", "h4", "h5", "h6"
          @question_content_elements << el.text.strip
        when "div"
          debugger unless el.text.match(/This question already has an answer here/)
          next
        when "ul", "ol", "pre"
          el.text.split("\n").reject(&:empty?)
            .each { |element| @question_content_elements << element.strip}
        when "hr"
          next
        else
          debugger
        end
      end
    end
  end
end
