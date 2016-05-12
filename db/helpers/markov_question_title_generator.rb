require_relative 'markov_text_generator.rb'
class MarkovQuestionTitleGenerator < MarkovTextGenerator

  private

  def process_phrase_ending(phrase)
    if phrase[-1] == '?'
      phrase
    else
      phrase = phrase.gsub(/[ .!,]$/, '?')
      phrase.gsub(/ \S+$/, '?')
    end
  end
end
