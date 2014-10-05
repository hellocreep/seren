(function() {
$(function() {

  var Module = Seren.extend({
    templateEngine: Handlebars.compile,
    action: function(e) {
      e.preventDefault();
    }
  });

  var todoMod = new Module('#todoMod', {
    init: function() {
      var data = JSON.parse(localStorage.getItem('todo') || '{}');
      this.set('todo', data.todo);
      this.render('.todo-list', data.todo);
      this.find('form').validate();
    },
    template: '#todoTmpl',
    getData: function() {
      var data = [];
      this.find('.todo-list').find('li').each(function() {
        var $this = $(this);
        data.push({
          id: $this.data('id'),
          status: $this.data('status'),
          content: $this.data('content')
        });
      });
      return data;
    },
    save: function() {
      localStorage.setItem('todo', JSON.stringify(this.data));
    },
    add: function(e) {
      this.action(e);
      if(!this.find('form').valid()) return;
      var input = this.find('input');
      var value = input.val();
      var data = this.getData();
      data.push({
        id: (this.find('.todo-list li:last').data('id')*1 + 1) || 0,
        status: true,
        content: value
      });
      input.val('');
      this.set('todo', data);
      this.save();
      this.render();
    },
    achieve: function(e) {
      this.action(e);
      var $li = $(e.currentTarget).closest('li');
      if($li.data('status')) {
        $li.data('status', false);
      } else {
        $li.data('status', true);
      }
      var data = this.getData();
      this.set('todo', data);
      this.save();
      this.render();
    },
    del: function(e)  {
      this.action(e);
      var $this = $(e.currentTarget);
      $this.closest('li').remove();
      var data = this.getData();
      this.set('todo', data);
      this.save();
      this.render();
    },
    render: function() {
      this._super('render')('.todo-list', this.get('todo'));
    }
  });

  todoMod.on({
    '.js-add click': 'add',
    '.js-achieve click': 'achieve',
    '.js-delete click': 'del'
  });

});
})(jQuery);