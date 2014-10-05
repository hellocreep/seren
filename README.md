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

> It's support the AMD, CMD and the trandition way.


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

Bind functions on this module.

example
```js
  mod.on({
    '.js-add click': 'add',
    '.js-edit click: function() {
      this.toggle();
    }
  });
```

### mod.set(name, value)

Set a data

### mod.get(name)

Get a data

### mod.render(target, data)

Render html.
The target will be found in this module.

example
```js
  mod.render('.bd', mod.get('data'));
```

### mod.save([options])

Ajax submit, return module self, the ajax status store in a deffered, use `done` to handle the rest.

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

## Examples



## Todo

* Data Operation
* Router

## License

Copyright (c) 2014 lea
Licensed under the MIT licens