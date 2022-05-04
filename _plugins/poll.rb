class Poll < Liquid::Tag
  def initialize(tag_name, id, tokens)
    super
    @id = id.strip
  end

  def render(context)
    "<form class='Poll' method='post' onsubmit='submitPoll(event); return false'>
    <input type='hidden' name='poll' class='js-poll' value='#{@id}' />
<div class='Poll__success'>Thanks!</div>
<div class='Poll__fields'>
<div class='Input__field'>
<input type='text' class='Input' name='Name' value='' placeholder='Título'>
</div>
<input type='submit' name='' class='Button Poll__submit js-button' value='Enviar'>
</div>
</form>"
  end
end

Liquid::Template.register_tag('poll', Poll)
