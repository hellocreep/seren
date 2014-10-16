(function() {
$(function() {

  Seren.data({
    toJSON: function() {
      return JSON.stringify(this.data);
    }
  });

  var Module = Seren.extend({
    templateEngine: Handlebars.compile,
    action: function(e) {
      e.preventDefault();
    }
  });

  var modTodo = new Module('#modTodo', {
    init: function() {
      var data = JSON.parse(localStorage.getItem('todo') || '[]');
      this.setData(data);
      this.render('.todo-list', data);
      this.find('form').validate();
      this.on({
        '.js-add click': 'add',
        '.js-achieve click': 'achieve',
        '.js-delete click': 'del'
      });
    },
    template: $('#todoTmpl').html(),
    render: function(target, data) {
      var tmpl = this.templateEngine(this.template);
      this.find(target).html(tmpl(data));
      return this;
    },
    save: function() {
      localStorage.setItem('todo', this.data.toJSON());
      this.render('.todo-list', this.data.find());
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
    },
    achieve: function(e) {
      this.action(e);
      var self = this;
      var $li = $(e.currentTarget).closest('li');
      this.data.update({id: $li.data('id')}, {achieve: !$li.data('achieve')}, function() {
        self.save();
      });
    },
    del: function(e)  {
      this.action(e);
      var self = this;
      var $li = $(e.currentTarget).closest('li');
      var condition = {id: $li.data('id')};
      this.data.remove(condition, function() {
        self.save();
      });
    }
  });

});
})(jQuery);