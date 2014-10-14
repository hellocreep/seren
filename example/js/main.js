(function() {
$(function() {

  Seren.data({
    validate: function() {
    }
  });

  var Module = Seren.extend({
    templateEngine: Handlebars.compile,
    action: function(e) {
      e.preventDefault();
    }
  });

  var todoMod = new Module('#todoMod', {
    init: function() {
      var data = JSON.parse(localStorage.getItem('todo') || '[]');
      this.setData(data);
      this.render('.todo-list', data.todo);
      this.find('form').validate();
    },
    template: '#todoTmpl',
    save: function() {
      localStorage.setItem('todo', JSON.stringify(this.data.find()));
    },
    add: function(e) {
      this.action(e);
      if(!this.find('form').valid()) return;
      var input = this.find('input');
      var value = input.val();
      var data = {
        id: (this.find('.todo-list li:last').data('id')*1 + 1) || 0,
        content: value,
        achieve: false
      };
      this.data.create(data);
      input.val('');
      this.save();
      this.render();
    },
    achieve: function(e) {
      this.action(e);
      var $li = $(e.currentTarget).closest('li');
      this.data.update({id: $li.data('id')}, {achieve: !$li.data('achieve')})
      this.save();
      this.render();
    },
    del: function(e)  {
      var self = this;
      this.action(e);
      var $this = $(e.currentTarget).closest('li');
      var condition = {id: $this.data('id')};
      this.data.remove(condition, function() {
        self.save();
        self.render();
      });
    },
    render: function() {
      this._super('render')('.todo-list', this.data.find());
    }
  });

  todoMod.on({
    '.js-add click': 'add',
    '.js-achieve click': 'achieve',
    '.js-delete click': 'del'
  });

  Seren.router({
    '/': function() {

    },
    '/user': function() {

    }
  })

});
})(jQuery);