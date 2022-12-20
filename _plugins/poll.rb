class Poll < Liquid::Tag
  def initialize(tag_name, params, tokens)
    super
    @params = params.strip.split(' ')
    @id = @params[0]
    @fieldname = @params[1]
  end

  def render(context)
    "<form class='Poll' method='post' onsubmit='submitPoll(event); return false'>
      <input type='hidden' name='poll' class='js-poll' value='#{@id}' />
      <div class='Poll__success'>Thanks!</div>
      <div class='Poll__error js-error'></div>
      <div class='Poll__fields'>
        <div class='Input__field'><input type='text' class='Input' name='#{@fieldname}' value='' placeholder='Título'></div>
        <button class='Button Poll__submit js-button'>Enviar</button>
      </div>
    </form>"
  end
end

Liquid::Template.register_tag('poll', Poll)
