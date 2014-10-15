Seren
=====

Seren is a module container, not an application nor MV* framework, just a library to set you free from everywhere jQuery style, make your code structured.

## Getting started

### Requirement

* jQuery

### Install

`bower install seren`

### Usage

`<script src="path/to/seren.js"></script>`


the HTML
```html
  <div class="module">
    ...
  </div>
```

the javascript
```javascript
  var Module = Seren.extend();
  var mod = new Module('.module', {
    func: function() {}
  });

  mod.on({
    '.el click': 'func'
  });

```

## Documentation

### Seren.extend([options])
Return a child module constructor inherit from Seren.

if you want to the `render` function, the option `templateEngine` is required.

example
```js
  var Module = Seren.extend({
    templateEngine: _.template,
    toggle: function() {
      this.find('.js-toggle').toggle();
    }
  })
```

### Module(moduleName, [options])

Get a instance.

Default options

* `template` the template id.
* `init` the function will be invoked when Module is initialized.
* `url` the default url to save.

example
```js
  var mod = new Module('.module', {
    template: '#tmpl',
    url: '/save/',
    init: function() {
      this.find('form').validate();
    }
  });
```

### mod.find(selector)

Return a jQuery object

example
```js
  mod.find('.js-action').trigger('edit');
```

### mod.on(options)

Bind functions in this module.

example
```js
  mod.on({
    '.js-add click': 'add',
    '.js-edit click': function() {
      this.toggle();
    }
  });
```

### mod.off(options)

Unbind functions in this module.

> TODO

### mod.emit(fnName)

Emit the function in this module.

example
```js
  mod.emit('save');
```

### mod.setData(data)

Set data

### mod.render(target, data)

Render html.
The target will be found in this module.

example
```js
  mod.render('.bd', mod.data.find());
```

### mod.fetch([options])

Ajax request to get the data, return this module, the ajax status store in a deffered, use `mod.done` to handle the reponse.

```js
  mod.fetch().done(function(result) {
    this.setData(result);
  }).fail(functoin(result) {
    alert(result);
  });
```

### mod.save([options])

Ajax submit, return this module, the ajax status store in a deffered, use `mod.done` to handle the response.

```js
  mod.save().done(function(result) {
    this.render('.bd', result);
  });
```

### mod.done(callback)

Handle the ajax response, this callback's context is this module not a jquery.ajax.

### mod.fail(callback)

Handle the ajax fail, this callback's context is this module not a jquery.ajax.

### mod._super(name)

If define a same name function of the conscructor, use `_super` to get it.

```js
  mod._super('func')(args);
```

### Module.data([options])

Add method to the module's data opearation.

example
```js
  Module.data({
    toJSON: function() {
      return JSON.stringify(this.data);
    }
  });

  var result = mod.data.toJSON();
```

### mod.data.find([condition])

Find the matched data, return the data collection.

example
```js
  mod.data.find({id: 1});
```

### mod.data.remove(condition [,callbck])

Remove the mathed data, return the removed data.

example
```js
  mod.data.remove({id: 1, name: 'test'}, function() {
    mod.save();
  });
```

### mod.data.update(condition, update)

Update the mathed data, return the updated data.

example
```js
  mod.update({id: 1}, {name: 'test2'});
```

### mod.data.create(data)

Add a new data

example
```js
  mod.data.create({id: 2, name: 'test3'});
```

## Examples


## License

Copyright (c) 2014 lea
Licensed under the MIT licens