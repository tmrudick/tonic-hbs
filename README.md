tonic-hbs
===

Extension for [tonic.js](http://www.tonicjs.org) which renders [Handlebars](http://handlebarsjs.com) templates when jobs complete.

Usage
---

After creating a tonic application, register tonic-hbs using the use method on your tonic application.

```js
var tonic = require('tonic'),
    hbs = require('tonic-hbs');

var app = tonic();
tonic.use(hbs);

```

Configuration
---

Templates and helper methods can be configured using your tonic application's config.json file.

```json
{
  "handlebars": {
    "templates": [
      { "template": "templates/index.hbs", "filename": "public/index.html" },
      { "template": "templates/about.hbs", "filename": "public/about.html" }
    ],
    "helpers": "lib/helpers.js"
  }
}
```

Each template must be defined individually. The filename attribute is where the output will be written. 

An, optional, helpers JavaScript file can be provided.

All paths must be relative to the working directory of the tonic application.

Defining Helpers
---

The helpers JavaScript file must export a single function which takes a Handlebars object.

```js
module.exports = function(Handlebars) {
  Handlebars.registerHelper('json', function(object) {
    return new Handlebars.SafeString(JSON.stringify(object) || '');
  });

  Handlebars.registerHelper('pretty_json', function(object) {
    return new Handlebars.SafeString(JSON.stringify(object, null, 2) || '');
  });
};
```