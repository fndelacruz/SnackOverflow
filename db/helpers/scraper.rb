class Scraper
  attr_reader :question_titles
  
  def initialize(
      last_question_page_idx=5,
      base_url="http://cooking.stackexchange.com/"
    )
    @last_question_page_idx = last_question_page_idx
    @base_url = base_url
    @question_titles = []
    @question_ids = []
  end

  def scrape
    scrape_question_index
  end

  def scrape_question_index
    @last_question_page_idx.downto(1).each do |i|
      puts "parsing questions index page##{i}"
      url = "#{@base_url}/questions?page=#{i}&sort=newest"
      parse_page = Nokogiri::HTML(HTTParty.get(url))

      # get question titles
      parse_page.css(".question-hyperlink").each do |question_element|
        # gsub removes title meta content like '[duplicate]', etc.
        @question_titles << question_element.children[0].to_s.gsub(/ \[.+\]$/, '')
      end
    end
  end
end
