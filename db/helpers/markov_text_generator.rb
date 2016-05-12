class MarkovTextGenerator
  attr_accessor :raw_counts, :probabilities, :counts_grouped, :table

  def initialize(input, order=8)
    @input = input
    @order = order
    @raw_counts = Hash.new { |hash, key| hash[key] = 0 }
    @counts_grouped = Hash.new { |hash, key| hash[key] = {} }
    @probabilities = Hash.new { |hash, key| hash[key] = {} }
    @table = Hash.new { |hash, key| hash[key] = {} }
  end

  def setup(slurp=false)
    populate_counts(slurp)
    get_unique_starts
    calculate_probabilities
    create_table
    nil
  end

  def build_element(max=120, min=30)
    phrase = random_capitalized_element.dup
    until phrase.length == max
      last_char = phrase[-@order..-1]
      next_char = next_char(last_char)

      return handle_early_phrase_termination(phrase, max, min) if !next_char
      phrase << next_char
    end

    process_phrase_ending(phrase)
  end

  def capitalized_elements
    @capitalized_elements ||= @table.keys.select do |word|
      word.match(/\A[A-Z][a-z]+/)
    end
  end

  private

  def handle_early_phrase_termination(phrase, max, min)
    phrase = process_phrase_ending(phrase)
    return phrase.length < min ? build_element(max, min) : phrase
  end

  def process_phrase_ending(phrase)
    if phrase[-1].match(/[.!?;]/)
      phrase
    elsif phrase[-1] == ' '
      phrase.gsub(/ $/, '.')
    else
      phrase.gsub(/ \S+$/, '.')
    end
  end

  def next_char(char)
    return nil if @table[char].empty?

    rand_val = rand
    sinks = @table[char].to_a
    return sinks.first[0] if rand_val < sinks.first[1]

    (1...(sinks.length - 1)).each do |idx|
      sink = sinks[idx]
      division = sink[1]
      return sinks[idx - 1][0] if rand_val - division < 0
    end

    return sinks.last[0]
  rescue => e
    debugger
  end

  def create_table
    @probabilities.each do |source, sinks|
      sinks_arr = sinks.to_a
      sinks_arr.each_with_index do |sink, idx|
        sink_char = sink[0]
        sink_val = sink[1]
        @table[source][sink_char] = sink_val

        (0...idx).each do |prev_idx|
          @table[source][sink_char] += sinks_arr[prev_idx][1]
        end
      end
    end
  end

  def count_transitions(word_soup)
    (@order...word_soup.length).each do |i|
      @raw_counts[{ word_soup[(i - @order)...i] => word_soup[i] }] += 1
    end
  end

  def populate_counts(slurp)
    if @input.is_a?(Array)
      word_soup = @input
    else
      word_soup = File.readlines(@input).map(&:chomp)
    end

    if slurp
      word_soup = word_soup.select { |line| line != "" }.join(" ")
      count_transitions(word_soup)
    else
      word_soup.each { |line| count_transitions(line) }
    end
  end

  def get_unique_starts
    @raw_counts.each do |hash|
      transition = hash[0]
      count = hash[1]
      source = transition.keys[0]
      sink = transition.values[0]
      @counts_grouped[source][sink] = count
    end
  end

  def calculate_probabilities
    @counts_grouped.each do |source, sink_hash|
      total = sink_hash.values.inject(0) { |sum, num| sum += num }.to_f
      sink_hash.each do |sink, count|
        @probabilities[source][sink] = count / total
      end
    end
  end

  def random_capitalized_element
    capitalized_elements.sample
  end

  def ending_word?(word)
    true if [".", "!", "?"].include?(word[-1])
  end
end
